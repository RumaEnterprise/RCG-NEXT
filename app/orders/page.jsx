"use client";
import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getPurchase, singleOrder } from "../../Redux/AppReducer/Action";
import axios from "axios";
import Loading from "../../Components/Loading";
import UserOrderCard from "../../Components/UserOrderCard";
const UserCancel = lazy(() => import("../../Components/UserCancel"));

const AllOrders = () => {
  const purchase = useSelector((store) => store.app.purchase);
  return (
    <Box minH={window.innerHeight - 300}>
      {purchase.map((el, i) => {
        if (el.cancelled.length==0 || el.cancelled[el.cancelled.length-1].status=="reject") {
          return (
            <Box key={i}>
              <UserOrderCard el={el} />
            </Box>
          );
        }
      })}
    </Box>
  );
};
const MyOrders = () => {
  const [orderData, setOrderData] = useState("Orders");
  const token = useSelector((store) => store.auth.token);
  const dispatch = useDispatch();
  const orderList = [
    "Orders",
    "Buy Again",
    "Not Yet Shipped",
    "Cancelled Orders",
  ];
  useEffect(() => {
    dispatch(getPurchase(token));
  }, []);
  return (
    <Box
      textAlign={"left"}
      p={"10px"}
      m={["auto", "auto", "0px 70px", "0px 70px"]}
      mt={"25px"}
    >
      <Flex
        justifyContent={"space-between"}
        direction={["column", "column", "column", "row"]}
      >
        <Text fontSize={"25px"}>Your Orders</Text>
        <Flex gap={"20px"} w={["100%", "100%", "100%", "50%"]}>
          <Input
            mt={"5px"}
            h={"30px"}
            border={"1px solid gray"}
            placeholder="Search Orders"
          />
          <Button
            mt={"5px"}
            h={"30px"}
            variant={"unstyled"}
            bgColor={"black"}
            color={"white"}
            w={["100%", "100%", "30%", "30%"]}
          >
            Search Orders
          </Button>
        </Flex>
      </Flex>
      <Flex gap={"30px"} mt={"50px"}>
        {orderList.map((el, i) => {
          return (
            <Box
              key={i}
              cursor={"pointer"}
              p={"10px"}
              borderBottom={orderData === el ? "1px solid orange" : ""}
              onClick={() => setOrderData(el)}
            >
              {el}
            </Box>
          );
        })}
      </Flex>
      <Box borderTop={"1px solid gray"}></Box>
      {orderData === "Orders" ? (
        <AllOrders />
      ) : orderData === "Cancelled Orders" ? (
        <Suspense fallback={<Loading load={true} />}>
          <UserCancel />
        </Suspense>
      ) : null}
    </Box>
  );
};

export default MyOrders;