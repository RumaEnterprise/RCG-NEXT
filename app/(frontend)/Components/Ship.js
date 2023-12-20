import axios from "axios";
import { envia_origin } from "../universal_variable";

const getStateByPin = async (pinCode) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/pincode?pin=${pinCode}`
    );
    const stateCodes = {
      "ANDAMAN AND NICOBAR ISLANDS": "AN",
      "ANDHRA PRADESH": "AP",
      "ARUNACHAL PRADESH": "AR",
      ASSAM: "AS",
      BIHAR: "BR",
      CHANDIGARH: "CH",
      CHHATTISGARH: "CT",
      "DADRA AND NAGAR HAVELI AND DAMAN AND DIU": "DN",
      DELHI: "DL",
      GOA: "GA",
      GUJARAT: "GJ",
      HARYANA: "HR",
      "HIMACHAL PRADESH": "HP",
      JHARKHAND: "JH",
      KARNATAKA: "KA",
      KERALA: "KL",
      LAKSHADWEEP: "LD",
      "MADHYA PRADESH": "MP",
      MAHARASHTRA: "MH",
      MANIPUR: "MN",
      MEGHALAYA: "ML",
      MIZORAM: "MZ",
      NAGALAND: "NL",
      ODISHA: "OR",
      PUDUCHERRY: "PY",
      PUNJAB: "PB",
      RAJASTHAN: "RJ",
      SIKKIM: "SK",
      "TAMIL NADU": "TN",
      TELANGANA: "TG",
      TRIPURA: "TR",
      "UTTAR PRADESH": "UP",
      UTTARAKHAND: "UK",
      "WEST BENGAL": "WB",
    };
    const state = stateCodes[res.data.data.StateName];
    return state;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};
const option = {
  origin: envia_origin,
  destination: {
    number: "",
    postalCode: "",
    type: "destination",
    name: "",
    email: "",
    phone: "",
    country: "IN",
    street: "",
    city: "",
    state: "",
    category: 1,
  },
  packages: [
    {
      additionalServices: [
        {
          data: { amount: 0 },
          service: "cash_on_delivery",
        },
      ],
      type: "box",
      content: "Clothes",
      amount: 1,
      name: "Clothes",
      declaredValue: 0,
      lengthUnit: "CM",
      weightUnit: "KG",
      weight: 0.3,
      dimensions: {
        length: 20,
        width: 10,
        height: 4,
      },
    },
  ],
  settings: {
    currency: "INR",
  },
  shipment: {
    type: 1,
    carrier: "",
  },
};
const getQuote = async (zip, finalPrice, pload) => {
  const partner = ["ecomExpress", "xpressBees", "delhivery"];
  const getState = await getStateByPin(zip);
  let results = [];
  await Promise.all(
    partner.map(async (ele) => {
      try {
        pload.destination.postalCode = zip.toString();
        pload.destination.state = getState || "";
        pload.packages[0].additionalServices[0].data.amount =
          Number(finalPrice);
        pload.packages[0].declaredValue = Number(finalPrice);
        pload.shipment.carrier = ele;

        const response = await axios.post(
          `${process.env.REACT_APP_ENVIA_API}/ship/rate?carrier=${ele}`,
          pload, // Use pload instead of payload
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_ENVIA_KEY}`,
            },
          }
        );

        response.data.data.forEach((ele) => {
          if (ele.cashOnDeliveryAmount <= 0) {
            return;
          }
          const shortMonthsArray = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          let date = ele.deliveryDate.date.split("-");
          date = `${date[2]}-${shortMonthsArray[date[1] - 1]}-${date[0]}`;
          results.push({
            dateDifference: ele.deliveryDate.dateDifference,
            totalPrice: ele.totalPrice,
            date: date,
            data: ele,
          });
        });
      } catch (err) {
        console.log(err);
      }
    })
  );
  const result = results.sort((a, b) => a.totalPrice - b.totalPrice);
  return result[0];
};

const generateLabel = async (data) => {
  try {
    const {
      price,
      paymentID,
      user: {
        email,
        shippingAddress: { fname, lname, address, phone, postalCode, city },
      },
    } = data;
    const getState = await getStateByPin(postalCode);
    const options = {
      origin: envia_origin,
      destination: {
        name: `${fname} ${lname}`,
        company: "",
        email: email,
        phone: phone,
        street: address,
        number: "",
        district: "",
        city: city,
        state: getState || "",
        country: "IN",
        postalCode: postalCode,
        reference: "",
      },
      packages: [
        {
          content: "Clothes",
          amount: 1,
          type: "box",
          dimensions: {
            length: 14,
            width: 4,
            height: 6,
          },
          weight: 0.3,
          declaredValue: price,
          weightUnit: "KG",
          lengthUnit: "CM",
        },
      ],

      shipment: {
        carrier: "fedex",
        service: "express",
        type: 1,
      },
      settings: {
        printFormat: "PDF",
        printSize: "STOCK_4X6",
        comments: "",
      },
    };
    if (paymentID == "COD") {
      let temp = { ...options.packages[0] };
      temp.additionalServices = [
        {
          data: { amount: price },
          service: "cash_on_delivery",
        },
      ];
      options.packages[0] = temp;
    }
    let quoteData = await getQuote(postalCode, price, options);
    options.shipment.carrier = quoteData.data.carrier;
    options.shipment.service = quoteData.data.service;
    const response = await axios.post(
      `${process.env.REACT_APP_ENVIA_API}/ship/generate`,
      options,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_ENVIA_KEY}`,
        },
      }
    );
    return response.data.data[0];
  } catch (error) {
    console.log(error);
  }
};
const initiateCancelOrder = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_ENVIA_API}/ship/cancel`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_ENVIA_KEY}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {}
};
export { getQuote, generateLabel, option, initiateCancelOrder };
