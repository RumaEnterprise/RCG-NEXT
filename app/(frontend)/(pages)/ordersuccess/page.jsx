"use client";
import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyNow } from "../../Redux/AppReducer/Action";
import { generateLabel } from "../../Components/Ship";
import Loading from "../../Components/Loading";
import { useParams, useRouter } from "next/navigation";
const OrderSuccess = () => {
  const [orderID, setOrderID] = useState("");
  const { transactionID } = useParams();
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useRouter();
  const user = useSelector((store) => store.auth.user);
  const buy = useSelector((store) => store.app.buy);
  const coupon = useSelector((store) => store.app.appliedCoupon);
  const token = useSelector((store) => store.auth.token);
  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let date = d.getDate();
  let hour = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();
  let t = d.getHours() > 12 ? "PM" : "AM";
  let milliSeconds = d.getMilliseconds();
  let fullDate = `${date}/${month}/${year}`;
  let fullTime = `${hour}:${minutes}:${seconds}:${milliSeconds} ${t}`;
  let payload = {};
  const dispatch = useDispatch();
  const purchase = async (data, txid, amt) => {
    if (data.length <= 0) {
    } else {
      const amount =
        txid === "COD" ? amt.toFixed(0) : Number(amt / 100).toFixed(0);
      payload = {
        trnxID: transactionID,
        products: data,
        paymentID: txid,
        user: user,
        price: amount,
        date: fullDate,
        time: fullTime,
        cancelled: [],
        status: [
          {
            status: "Order received",
            date: fullDate,
          },
        ],
      };
      try {
        const newData = data.map((ele) => {
          let payload = {};
          payload.skuID = ele.skuID;
          payload.quantity = Number(ele.stock) - Number(ele.quantity);
          return payload;
        });
        axios
          .patch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/bulkupdate`,
            { data: newData },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
        let label = await generateLabel(payload);
        payload.carrier = label.carrier;
        payload.trackingNumber = label.trackingNumber;
        payload.label = label.label;
        payload.appliedCoupon = "";
        let applyCoupon;
        if (coupon.couponCode !== "") {
          applyCoupon = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/usedcoupon/create`,
            { userID: user._id, couponID: coupon.couponCode },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        payload.appliedCoupon=applyCoupon.data.data._id;
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/create`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setOrderID(res.data.orderid);
            axios
              .post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/downloadCustomerInvoice`,
                res.data.data,
                {
                  responseType: "blob",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then(() => {
                axios
                  .post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/email`,
                    {
                      sendTo: payload.user.email,
                      subject: "Your order has been placed",
                      bcc: true,
                      body: `Dear ${
                        payload.user.name
                      }, This is confirmation for order ${
                        res.data.orderid
                      }. Placed on ${payload.date} at ${
                        payload.time
                      }. Total order value of Rs. ${payload.price} via ${
                        payload.paymentID === "COD" ? "COD" : "Online Payment"
                      }. We will send you courier information after the product is shipped from our end. Thank you for choosing us.`,
                      attach: true,
                      id: res.data.data._id,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((res) => {})
                  .catch((eee) => {
                    console.log(eee);
                  });
              });

            axios.delete(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/deleteall`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            dispatch(buyNow([]));
          });
      } catch (error) {
        console.log(error);
      }
    }
    setLoad(false);
  };
  const cashOnDelivery = () => {
    if (buy.length <= 0) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let main_price = 0;
          res?.data?.data?.map(({ price, quantity, discount }) => {
            const Price =
              Number(price) - (Number(price) * Number(discount)) / 100;
            const qty = Number(quantity);
            const totalPrice = Number(Price * qty + Price * qty * 0.05);
            main_price += totalPrice;
          });

          purchase(res.data.data, "COD", main_price);
        });
    } else {
      let main_price = 0;
      buy?.map(({ price, quantity, discount }) => {
        const Price = Number(price) - (Number(price) * Number(discount)) / 100;
        const qty = Number(quantity);
        const totalPrice = Number(Price * qty + Price * qty * 0.05);
        main_price += totalPrice;
      });
      purchase(buy, "COD", main_price);
    }
  };
  useEffect(() => {
    const pload = {
      merchantId: `${process.env.NEXT_PUBLIC_PHONEPE_MERCHANTID}`,
      merchantTransactionId: transactionID,
    };
    setLoad(true);
    if (transactionID === undefined) {
      cashOnDelivery();
    } else {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/paystatus`, pload)
        .then((resu) => {
          if (resu.data.data.code === "PAYMENT_SUCCESS") {
            if (buy.length <= 0) {
              axios
                .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((res) => {
                  purchase(
                    res.data.data,
                    resu.data.data.data.transactionId,
                    resu.data.data.data.amount
                  );
                  setLoad(false);
                });
            } else {
              purchase(
                buy,
                resu.data.data.data.transactionId,
                resu.data.data.data.amount
              );
              setLoad(false);
            }
          } else {
            setError(true);
          }
        });
    }
  }, []);
  if (load) {
    return <Loading load={load} />;
  }
  return (
    <Box
      pt={"30px"}
      h={["auto", "auto", "auto", "70vh"]}
      bgColor={"#cdced4"}
      pb={"30px"}
    >
      <Box
        fontSize={"25px"}
        bgColor={"white"}
        textAlign={"left"}
        m={["0px 20px", "0px 50px", "0px 100px", "0px 250px"]}
        mt={"10px"}
        p={["30px 5px", "30px 10px", "30px 15px", "30px"]}
      >
        {load === true ? (
          <Center>
            <Box>Loading...</Box>
          </Center>
        ) : load === false && error === true ? (
          <Center>
            <Box>Payment Failed...</Box>
          </Center>
        ) : orderID.length <= 0 ? (
          <Center>
            <Box>Page Expired</Box>
          </Center>
        ) : (
          <>
            <Flex
              justifyContent={"space-between"}
              direction={[
                "column-reverse",
                "column-reverse",
                "column-reverse",
                "row",
              ]}
            >
              <Text>Hi {user.name},</Text>
              <Box>
                <Flex
                  justifyContent={"center"}
                  gap={["10px", "15px", "25px", "30px"]}
                  alignItems={"center"}
                  fontWeight={"bold"}
                  mb={"5px"}
                  fontSize={"12px"}
                >
                  <Box>Received</Box>
                  <Box>Processing</Box>
                  <Box>Packaged</Box>
                  <Box>Shipped</Box>
                  <Box>Delivered</Box>
                </Flex>
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Box
                    bgColor={"green"}
                    w={"20px"}
                    h={"20px"}
                    borderRadius={"50%"}
                  ></Box>
                  <Center>
                    <Box
                      w={["50px", "55px", "65px", "70px"]}
                      h={"3px"}
                      bgColor={"gray.400"}
                    ></Box>
                  </Center>
                  <Box
                    bgColor={"gray.400"}
                    w={"20px"}
                    h={"20px"}
                    borderRadius={"50%"}
                  ></Box>
                  <Center>
                    <Box
                      w={["50px", "55px", "65px", "70px"]}
                      h={"3px"}
                      bgColor={"gray.400"}
                    ></Box>
                  </Center>
                  <Box
                    bgColor={"gray.400"}
                    w={"20px"}
                    h={"20px"}
                    borderRadius={"50%"}
                  ></Box>
                  <Center>
                    <Box
                      w={["50px", "55px", "65px", "70px"]}
                      h={"3px"}
                      bgColor={"gray.400"}
                    ></Box>
                  </Center>
                  <Box
                    bgColor={"gray.400"}
                    w={"20px"}
                    h={"20px"}
                    borderRadius={"50%"}
                  ></Box>
                  <Center>
                    <Box
                      w={["50px", "55px", "65px", "70px"]}
                      h={"3px"}
                      bgColor={"gray.400"}
                    ></Box>
                  </Center>
                  <Box
                    bgColor={"gray.400"}
                    w={"20px"}
                    h={"20px"}
                    borderRadius={"50%"}
                  ></Box>
                </Flex>
              </Box>
            </Flex>
            <Flex gap={"30px"} direction={["column", "column", "row", "row"]}>
              <Flex direction={"column"}>
                <Text>Order successfully placed.</Text>
                <Text mt={"40px"} fontSize={"17px"}>
                  Your order will be delivered within 7 working days.
                </Text>
                <Text mt={"10px"} fontSize={"17px"}>
                  We are pleased to confirm your order no {orderID}
                </Text>
                <Text mt={"10px"} fontSize={"17px"}>
                  Thank you for shopping with Rare Combee Group
                </Text>
                <Button
                  mt={"20px"}
                  bgColor={"blue.400"}
                  color={"white"}
                  variant={"unstyled"}
                  p={"0px 20px"}
                  onClick={() => navigate("/orders")}
                >
                  Manage Orders
                </Button>
              </Flex>
              <Flex direction={"column"}>
                <Text>Delivery Address</Text>
                <Text fontSize={"20px"} mt={"30px"}>
                  {user.shippingAddress.fname} {user.shippingAddress.lname}
                </Text>
                <Text fontSize={"20px"}>
                  {user.shippingAddress.address},{user.shippingAddress.city}-
                  {user.shippingAddress.postalCode},{user.shippingAddress.state}
                </Text>
                <Text fontSize={"20px"}>{user.shippingAddress.phone}</Text>
              </Flex>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};

export default OrderSuccess;