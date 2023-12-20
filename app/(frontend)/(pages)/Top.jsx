"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { setDiscount } from "../Redux/AppReducer/Action";
import Nav from "../Components/Nav";
import Mobile from "../Components/Mobile";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Center, Flex, Text } from "@chakra-ui/react";
const Top = () => {
  const user = useSelector((store) => store.auth.user);
  const [size, setSize] = useState(window.innerWidth);
  const discount = useSelector((store) => store.app.discount);
  const updateSize = () => setSize(window.innerWidth);
  const [today, setDate] = useState(new Date());
  const dispatch = useDispatch();
  const months = [
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
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = months[currentDate.getMonth()]; // Note: Months are zero-based, so January is 0, February is 1, and so on.
  const currentDay = currentDate.getDate();
  useEffect(() => {
    var currentDate = new Date();
    var currentSecond = currentDate.getSeconds();
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => (window.onresize = updateSize), []);
  useEffect(() => {
    dispatch(setDiscount(discount));
  }, []);
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const locale = "en";
  const date = `${currentDay} ${currentMonth},${currentYear}`;
  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
    second:"2-digit"
  });
  return (
    <>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        hidden={
          user.administration === "manager" ||
          user.administration === "admin" ||
          user.administration === "data operator" ||
          user.administration === "marketing manager"
            ? true
            : false
        }
        id={"sale"}
        h={"40px"}
        pt={"10px"}
        pb={"10px"}
        bgColor={"#d32f2e"}
      >
        <Center w={["70%", "70%", "85%", "85%"]}>
          <Text
            fontSize={[10, 12, 14, 16]}
            fontWeight={"bold"}
            color={"#fffc00"}
          >
            {discount?.text}
          </Text>
        </Center>
        <Center>
          <Text
            fontSize={[10, 12, 14, 16]}
            textAlign={"right"}
            fontWeight={"bold"}
            color={"#fffc00"}
          >
            {date} {time}
          </Text>
        </Center>
      </Flex>
      {size >= 1100 ? <Nav /> : <Mobile />}
    </>
  );
};

export default Top;
