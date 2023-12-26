"use client";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
} from "@chakra-ui/react";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RazorpayUI from "../../Components/RazorpayUI";
import { localBill, userUpdate } from "../../Redux/AuthReducer/Action";
import ShowOffPremium from "../../Components/ShowOffPremium";
import {
  recomendedCoupon,
  updateAppliedCoupon,
} from "../../Redux/AppReducer/Action";
import { useParams } from "next/navigation";
import Link from "next/link";

const Summary = () => {
  let { skuID } = useParams();
  const [gst, setGst] = useState(0);
  const [total, setTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [category, setCategory] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [data, setData] = useState([]);
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [ship, setShip] = useState(false);
  const token = useSelector((store) => store.auth.token);
  const recomPayload = useSelector((store) => store.app.recomPayload);
  const couponData = useSelector((store) => store.app.appliedCoupon);
  const buy = useSelector((store) => store.app.buy);
  const user = useSelector((store) => store.auth.user);
  const toast = useToast();
  let fname = user.name.split(" ")[0];
  let lname = user.name.split(" ")[1];
  const dispatch = useDispatch();
  const handlePromo = (e) => {
    setPromo(e.target.value);
  };
  const isSubset = (array1, array2) => {
    return array1.every((item) => array2.includes(item));
  };
  const handleApplyCoupon = async (value) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/single/${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.msg == "found") {
        const flag = isSubset(recomPayload?.category, res.data.data.category);
        if (
          flag &&
          recomPayload?.quantity >= res.data.data.quantity &&
          recomPayload?.cartValue >= res.data.data.cartValue
        ) {
          let discounted;
          if (res.data.data.discountType == "Rs") {
            discounted = res.data.data.discount;
          } else {
            discounted = Number((total * res.data.data.discount) / 100).toFixed(
              0
            );
          }
          setDiscountAmount(discounted);
          setAppliedPromo(value);
          const total_Price =
            Number(Number(total - discounted).toFixed(0)) +
            Number(
              Number(Number(total - discounted).toFixed(0) * 0.05).toFixed(0)
            );
          dispatch(
            updateAppliedCoupon({
              couponCode: value,
              price: Number(total_Price).toFixed(0),
            })
          );
          setPromo("");
        }
      } else {
        if (promo !== "") {
          toast({
            title: "Promo Code not Applicable",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [billData, setBillData] = useState({
    fname: fname,
    lname: lname,
    address: user.billingAddress?.address || "",
    phone: user.billingAddress?.phone || "",
    postalCode: user.billingAddress?.postalCode || "",
    state: user.billingAddress?.state || "",
    city: user.billingAddress?.city || "",
    gstin: "",
  });
  const [shipData, setShipData] = useState({
    fname: "",
    lname: "",
    address: "",
    phone: "",
    postalCode: "",
    state: "",
    city: "",
  });
  const [height, setH] = useState(0);
  const handleCart = () => {
    let totalqty = 0;
    let total = 0;
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setTotal(0);
        setGst(0);
        res?.data?.data?.map(({ price, skuID, quantity, discount }) => {
          getCategory(skuID);
          const Price = Number(
            Number(price) - (Number(price) * Number(discount)) / 100
          ).toFixed(0);
          const qty = Number(quantity);

          setTotal((res) => res + Price * qty);
          total = total + Price * qty;
          totalqty = totalqty + qty;
          return 0;
        });
        const payTemp = { ...recomPayload };
        payTemp.quantity = totalqty;
        payTemp.cartValue = Number(total.toFixed(0));
        const total_Price =
          Number(Number(total).toFixed(0)) +
          Number(Number(Number(total).toFixed(0) * 0.05).toFixed(0));
        dispatch(
          updateAppliedCoupon({
            couponCode: "",
            price: Number(total_Price).toFixed(0),
          })
        );
        dispatch(recomendedCoupon(payTemp));
      });
  };
  const generateGST = (total, discount) => {
    let mainPrice = total - discount;
    return Number(mainPrice * 0.05).toFixed(0);
  };
  const getCategory = (sku) => {
    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/category/${sku}`)
        .then((res) => {
          let temp = [...category];
          temp.push(res.data.category);
          setCategory(temp);
          const payTemp = { ...recomPayload };
          payTemp.category = temp;
          dispatch(recomendedCoupon(payTemp));
        });
    } catch (error) {
      console.log(error);
    }
  };
  const grandTotal = (a, b) => {
    return Number(a + b).toFixed(2);
  };
  useEffect(() => {
    dispatch(updateAppliedCoupon({ couponCode: "", price: 0 }));
    let totalqty = 0;
    let total = 0;
    if (skuID == undefined) {
      handleCart();
    } else {
      getCategory(skuID);
      setTotal(0);
      setGst(0);
      buy.map(({ price, quantity, discount }) => {
        const Price = Number(price) - (Number(price) * Number(discount)) / 100;
        const qty = Number(quantity);
        setTotal((res) => res + Price * qty);
        setQuantity((res) => res + qty);
        total = total + Price * qty;
        totalqty = totalqty + qty;
      });
    }
    const total_Price =
      Number(Number(total).toFixed(0)) +
      Number(Number(Number(total).toFixed(0) * 0.05).toFixed(0));
    dispatch(
      updateAppliedCoupon({
        couponCode: "",
        price: Number(total_Price).toFixed(0),
      })
    );
    const payTemp = { ...recomPayload };
    payTemp.quantity = totalqty;
    payTemp.cartValue = Number(total.toFixed(0));

    dispatch(recomendedCoupon(payTemp));
  }, []);
  useEffect(() => {
    if (recomPayload.code == undefined) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/recomended`,
          recomPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.msg == "found") {
            const payTemp = { ...recomPayload };
            payTemp.code = res.data.code;

            dispatch(recomendedCoupon(payTemp));
            handleApplyCoupon(res.data.code);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [recomPayload]);
  const handleBill = (e) => {
    let temp = { ...billData };
    temp[e.target.name] = e.target.value;
    let payload = {
      billingAddress: temp,
    };
    dispatch(localBill(payload));
    setBillData(temp);
  };
  const handleShip = (e) => {
    let temp = { ...shipData };
    temp[e.target.name] = e.target.value;
    setShipData(temp);
  };
  const handleBillInformation = () => {
    let payload = {
      billingAddress: billData,
    };
    dispatch(userUpdate(payload, token, toast));
  };
  return (
    <Flex
      m={[
        "20px 20px 0px 20px",
        "20px 80px 0px 80px",
        "20px 150px 0px 150px",
        "20px 50px 0px 100px",
      ]}
      justifyContent={"space-between"}
    >
      <Box textAlign={"left"} w={"63%"}>
        <Center>
          <Text fontWeight={"bold"} fontSize={"40px"}>
            Checkout
          </Text>
        </Center>

        <Flex
          direction={["column", "column", "row", "row"]}
          mt={"30px"}
          gap={"10px"}
        >
          <Flex direction={"column"} w={["full", "full", "60%", "60%"]}>
            <Box>
              <Box border={"1px solid gray"} p={"20px"}>
                <Text fontSize={"20px"} fontWeight={"bold"}>
                  Billing Information
                </Text>
                <Flex
                  direction={"column"}
                  mt={"10px"}
                  border={"1px solid black"}
                  p={"10px"}
                  h={"70px"}
                >
                  <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                    Country/Region
                  </FormLabel>
                  <Input
                    border={"none"}
                    variant={"flushed"}
                    color={"black"}
                    isDisabled={true}
                    value={"India"}
                  />
                </Flex>
                <Flex
                  gap={["0px", "0px", "10px", "10px"]}
                  direction={["column", "column", "row", "row"]}
                >
                  <Flex
                    mt={"10px"}
                    direction={"column"}
                    border={"1px solid black"}
                    h={"70px"}
                    p={"10px"}
                    w={["100%", "100%", "50%", "50%"]}
                  >
                    <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                      First Name
                    </FormLabel>
                    <Input
                      border={"none"}
                      variant={"flushed"}
                      textIndent={"5px"}
                      color={"black"}
                      defaultValue={fname}
                      name="fname"
                      onChange={(e) => handleBill(e)}
                    />
                  </Flex>
                  <Flex
                    mt={"10px"}
                    direction={"column"}
                    border={"1px solid black"}
                    h={"70px"}
                    p={"10px"}
                    w={["100%", "100%", "50%", "50%"]}
                  >
                    <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                      Last Name
                    </FormLabel>
                    <Input
                      border={"none"}
                      variant={"flushed"}
                      textIndent={"5px"}
                      color={"black"}
                      defaultValue={lname}
                      name="lname"
                      onChange={(e) => handleBill(e)}
                    />
                  </Flex>
                </Flex>
                <Flex
                  mt={"10px"}
                  direction={"column"}
                  border={"1px solid black"}
                  h={"70px"}
                  p={"10px"}
                >
                  <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                    Address
                  </FormLabel>
                  <Input
                    border={"none"}
                    variant={"flushed"}
                    textIndent={"5px"}
                    placeholder="Enter address"
                    defaultValue={billData.address}
                    name="address"
                    onChange={(e) => handleBill(e)}
                  />
                </Flex>
                <Flex
                  mt={"10px"}
                  direction={"column"}
                  border={"1px solid black"}
                  p={"10px"}
                >
                  <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                    Phone Number
                  </FormLabel>
                  <InputGroup>
                    <InputLeftAddon>+91</InputLeftAddon>
                    <Input
                      border={"none"}
                      variant={"flushed"}
                      textIndent={"5px"}
                      type="tel"
                      maxLength={"10"}
                      defaultValue={billData.phone}
                      placeholder="Enter Phone Number"
                      name="phone"
                      onChange={(e) => handleBill(e)}
                    />
                  </InputGroup>
                </Flex>
                <Flex
                  gap={["0px", "0px", "10px", "10px"]}
                  direction={["column", "column", "row", "row"]}
                >
                  <Flex
                    mt={"10px"}
                    direction={"column"}
                    border={"1px solid black"}
                    h={"70px"}
                    p={"10px"}
                    w={["100%", "100%", "50%", "50%"]}
                  >
                    <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                      Postal Code
                    </FormLabel>
                    <Input
                      type="tel"
                      border={"none"}
                      variant={"flushed"}
                      placeholder="Postal Code"
                      textIndent={"5px"}
                      color={"black"}
                      maxLength={"6"}
                      defaultValue={billData.postalCode}
                      name="postalCode"
                      onChange={(e) => handleBill(e)}
                    />
                  </Flex>
                  <Flex
                    mt={"10px"}
                    direction={"column"}
                    border={"1px solid black"}
                    h={"70px"}
                    p={"10px"}
                    w={["100%", "100%", "50%", "50%"]}
                  >
                    <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                      State
                    </FormLabel>
                    <Select
                      name="state"
                      onChange={(e) => handleBill(e)}
                      h={"20px"}
                      variant={"flushed"}
                      border={"none"}
                      defaultValue={billData.state}
                    >
                      <option value="">Select a state</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">
                        Arunachal Pradesh
                      </option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                    </Select>
                  </Flex>
                </Flex>
                <Flex
                  mt={"10px"}
                  direction={"column"}
                  border={"1px solid black"}
                  h={"70px"}
                  p={"10px"}
                >
                  <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                    City
                  </FormLabel>
                  <Input
                    border={"none"}
                    variant={"flushed"}
                    textIndent={"5px"}
                    placeholder="Enter City"
                    name="city"
                    defaultValue={billData.city}
                    onChange={(e) => handleBill(e)}
                  />
                </Flex>
                <Flex
                  mt={"10px"}
                  direction={"column"}
                  border={"1px solid black"}
                  h={"70px"}
                  p={"10px"}
                >
                  <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                    GSTIN (Optional)
                  </FormLabel>
                  <Input
                    border={"none"}
                    variant={"flushed"}
                    textIndent={"5px"}
                    placeholder="Enter GSTIN"
                    name="gstin"
                    onChange={(e) => handleBill(e)}
                  />
                </Flex>
              </Box>

              <Button
                variant={"unstyled"}
                bgColor={"Highlight"}
                mt={"10px"}
                color={"white"}
                w={"full"}
                onClick={handleBillInformation}
                isDisabled={
                  billData.fname === "" ||
                  billData.address === "" ||
                  billData.lname === "" ||
                  billData.phone === "" ||
                  billData.postalCode === "" ||
                  billData.state === "" ||
                  billData.city === ""
                }
                _hover={{}}
              >
                Save Billing Information
              </Button>
            </Box>
            {billData.fname === "" ||
            billData.address === "" ||
            billData.lname === "" ||
            billData.phone === "" ||
            billData.postalCode === "" ||
            billData.state === "" ||
            billData.city === "" ? (
              <></>
            ) : (
              <Accordion
                onChange={() => {
                  if (height == 600) {
                    setH(0);
                  } else {
                    setH(600);
                  }
                }}
                allowMultiple
                m={"20px 0px"}
                onClick={() => setShip(!ship)}
              >
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontWeight={"bold"}
                      >
                        Shipping Information
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Box border={"1px solid gray"} p={"20px"}>
                      <Flex gap={"5px"} mt={"10px"}>
                        <Checkbox
                          name={"label"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShipData(billData);
                            } else {
                              setShipData({
                                fname: "",
                                lname: "",
                                address: "",
                                phone: "",
                                postalCode: "",
                                state: "",
                                city: "",
                              });
                            }
                          }}
                        />
                        <Text>Same as Billing Address</Text>
                      </Flex>
                      <Flex
                        direction={"column"}
                        mt={"10px"}
                        border={"1px solid black"}
                        p={"10px"}
                        h={"70px"}
                      >
                        <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                          Country/Region
                        </FormLabel>
                        <Input
                          border={"none"}
                          variant={"flushed"}
                          color={"black"}
                          isDisabled={true}
                          value={"India"}
                        />
                      </Flex>
                      <Flex gap={"10px"}>
                        <Flex
                          mt={"10px"}
                          direction={"column"}
                          border={"1px solid black"}
                          h={"70px"}
                          p={"10px"}
                          w={"50%"}
                        >
                          <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                            First Name
                          </FormLabel>
                          <Input
                            border={"none"}
                            variant={"flushed"}
                            textIndent={"5px"}
                            color={"black"}
                            defaultValue={shipData.fname}
                            name="fname"
                            onChange={(e) => handleShip(e)}
                          />
                        </Flex>
                        <Flex
                          mt={"10px"}
                          direction={"column"}
                          border={"1px solid black"}
                          h={"70px"}
                          p={"10px"}
                          w={"50%"}
                        >
                          <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                            Last Name
                          </FormLabel>
                          <Input
                            border={"none"}
                            variant={"flushed"}
                            textIndent={"5px"}
                            color={"black"}
                            defaultValue={shipData.lname}
                            name="lname"
                            onChange={(e) => handleShip(e)}
                          />
                        </Flex>
                      </Flex>
                      <Flex
                        mt={"10px"}
                        direction={"column"}
                        border={"1px solid black"}
                        h={"70px"}
                        p={"10px"}
                      >
                        <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                          Address
                        </FormLabel>
                        <Input
                          border={"none"}
                          variant={"flushed"}
                          textIndent={"5px"}
                          placeholder="Enter address"
                          defaultValue={shipData.address}
                          name="address"
                          onChange={(e) => handleShip(e)}
                        />
                      </Flex>
                      <Flex
                        mt={"10px"}
                        direction={"column"}
                        border={"1px solid black"}
                        p={"10px"}
                      >
                        <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                          Phone Number
                        </FormLabel>
                        <InputGroup>
                          <InputLeftAddon>+91</InputLeftAddon>
                          <Input
                            border={"none"}
                            variant={"flushed"}
                            textIndent={"5px"}
                            type="tel"
                            maxLength={"10"}
                            defaultValue={shipData.phone}
                            placeholder="Enter Phone Number"
                            name="phone"
                            onChange={(e) => handleShip(e)}
                          />
                        </InputGroup>
                      </Flex>
                      <Flex gap={"10px"}>
                        <Flex
                          mt={"10px"}
                          direction={"column"}
                          border={"1px solid black"}
                          h={"70px"}
                          p={"10px"}
                          w={"50%"}
                        >
                          <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                            Postal Code
                          </FormLabel>
                          <Input
                            type="tel"
                            border={"none"}
                            variant={"flushed"}
                            placeholder="Postal Code"
                            textIndent={"5px"}
                            color={"black"}
                            maxLength={"6"}
                            defaultValue={shipData.postalCode}
                            name="postalCode"
                            onChange={(e) => handleShip(e)}
                          />
                        </Flex>
                        <Flex
                          mt={"10px"}
                          direction={"column"}
                          border={"1px solid black"}
                          h={"70px"}
                          p={"10px"}
                          w={"50%"}
                        >
                          <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                            State
                          </FormLabel>
                          <Select
                            name="state"
                            value={shipData.state}
                            onChange={(e) => handleShip(e)}
                            h={"20px"}
                            variant={"flushed"}
                            border={"none"}
                          >
                            <option value="">Select a state</option>
                            <option value="Andhra Pradesh">
                              Andhra Pradesh
                            </option>
                            <option value="Arunachal Pradesh">
                              Arunachal Pradesh
                            </option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">
                              Himachal Pradesh
                            </option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">
                              Madhya Pradesh
                            </option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                          </Select>
                        </Flex>
                      </Flex>
                      <Flex
                        mt={"10px"}
                        direction={"column"}
                        border={"1px solid black"}
                        h={"70px"}
                        p={"10px"}
                      >
                        <FormLabel fontSize={"13px"} fontWeight={"bold"}>
                          City
                        </FormLabel>
                        <Input
                          border={"none"}
                          variant={"flushed"}
                          textIndent={"5px"}
                          placeholder="Enter City"
                          defaultValue={shipData.city}
                          name="city"
                          onChange={(e) => handleShip(e)}
                        />
                      </Flex>
                    </Box>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}
          </Flex>
          <Box
            w={["full", "full", "40%", "40%"]}
            bgColor={"#F5F7F8"}
            p={"0px 8px 0px 8px"}
          >
            <Box mt={"15px"}>
              <Text fontSize={"20px"} fontWeight={"bold"}>
                Order Summary
              </Text>
              <Flex
                fontWeight={"600"}
                justifyContent={"space-between"}
                m={"30px 10px 0px 10px"}
              >
                {skuID === undefined ? (
                  <Text>{data?.length} Item</Text>
                ) : (
                  <Text>{buy?.length} Item</Text>
                )}

                {skuID === undefined ? (
                  <Link href={"/cart"}>
                    <Text cursor={"pointer"} textDecoration={"underline"}>
                      Edit Order
                    </Text>
                  </Link>
                ) : (
                  <Link href={`/cart/${skuID}`}>
                    <Text cursor={"pointer"} textDecoration={"underline"}>
                      Edit Order
                    </Text>
                  </Link>
                )}
              </Flex>
            </Box>
            <Box m={"10px 0px 10px 0px"} h={"1px"} bgColor={"gray.300"}></Box>
            <Flex justifyContent={"space-between"}>
              <Text>Price</Text>
              <Text fontWeight={"bold"}>Rs.{total.toFixed(0) + ".00"}</Text>
            </Flex>

            <Flex mt={"10px"} justifyContent={"space-between"}>
              <Flex gap={"3px"}>
                <Text>Coupon</Text>
                <Flex hidden={discountAmount == 0}>
                  <Text>(</Text>
                  <Text fontWeight={"bold"} color={"green"}>
                    {appliedPromo}
                  </Text>
                  <Text>)</Text>
                  <Box
                    mt={"3px"}
                    ml={"5px"}
                    cursor={"pointer"}
                    onClick={() => {
                      dispatch(
                        updateAppliedCoupon({
                          couponCode: couponData.couponCode,
                          price: Number(
                            Number(couponData.price) + Number(discountAmount)
                          ).toFixed(0),
                        })
                      );
                      setAppliedPromo("");
                      setDiscountAmount(0);
                    }}
                  >
                    <RiDeleteBin5Line />
                  </Box>
                </Flex>
              </Flex>
              <Text color={"red"}>
                - Rs.{Number(discountAmount).toFixed(0)}.00
              </Text>
            </Flex>
            <Flex gap={"10px"} mt={"20px"}>
              <Input
                value={promo}
                onChange={(e) => handlePromo(e)}
                placeholder="Have a promo code?"
              />
              <Button
                onClick={() => handleApplyCoupon(promo)}
                isDisabled={promo == ""}
              >
                Apply
              </Button>
            </Flex>
            <Box m={"10px 0px 10px 0px"} h={"1px"} bgColor={"gray.300"}></Box>
            <Flex justifyContent={"space-between"}>
              <Text>SubTotal</Text>
              <Text fontWeight={"bold"}>
                Rs.{Number(total - discountAmount).toFixed(0) + ".00"}
              </Text>
            </Flex>
            <Box m={"10px 0px 10px 0px"} h={"1px"} bgColor={"gray.300"}></Box>
            <Flex mt={"10px"} justifyContent={"space-between"}>
              <Text>GST (5%)</Text>
              <Text>
                Rs.{Number(generateGST(total, discountAmount)).toFixed(2)}
              </Text>
            </Flex>
            <Box m={"10px 0px 10px 0px"} h={"1px"} bgColor={"gray.300"}></Box>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"23px"}>Grand Total</Text>
              <Text fontWeight={"bold"} fontSize={"23px"}>
                Rs. {Number(couponData.price).toFixed(0) + ".00"}
              </Text>
            </Flex>
            <RazorpayUI
              price={Number(couponData.price).toFixed(0)}
              ship={shipData}
              products={skuID !== undefined ? buy : data}
            />
          </Box>
        </Flex>
      </Box>
      <Box w={["100%", "100%", "100%", "30%"]}>
        <ShowOffPremium h={height} />
      </Box>
    </Flex>
  );
};

export default Summary;
