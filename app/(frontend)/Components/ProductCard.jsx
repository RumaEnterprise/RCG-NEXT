import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  buyNow,
  getWish,
  loginState,
  updateLikesDislikes,
} from "../Redux/AppReducer/Action";
import fillWish from "../Resources/fillWish.png";
import dislike from "../Resources/dislike.png";
import like from "../Resources/like.png";
import star from "../Resources/star.png";
import emptyWish from "../Resources/emptyWish.png";
import { shortenNumber } from "./number_shortener";
import Loading from "../Components/Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";
const ProductCard = ({
  plike,
  pdislike,
  title,
  price,
  color,
  quantity,
  skuID,
  discount,
  rating = 5,
  i,
}) => {
  const data = JSON.parse(localStorage.getItem("rareLikesDislikes")) || [];
  const token = useSelector((store) => store.auth.token);
  const wish = useSelector((store) => store.app.wish);
  const userProduct = useSelector((store) => store.app.userProduct);
  const toast = useToast();
  const navigate = useRouter();
  const dispatch = useDispatch();
  const tempText = `${title.split("").splice(0, 50).join("")}...`;
  const floatModify = (value) => {
    if (value !== undefined) {
      let seperate = "";
      seperate = value.toString();
      seperate = seperate.split(".");
      if (seperate.length <= 1) {
        return Number(seperate[0]);
      }
      if (seperate[1] >= 50) {
        return Number(seperate[0]) + 1;
      } else {
        return Number(seperate[0]);
      }
    }
  };
  let pos = -1;
  const handleLikes = (skuID, type) => {
    data.filter((ele, i) => {
      if (ele.skuID == skuID && ele.type == type) {
        pos = i;
        return ele;
      }
    });
    let temp = { ...userProduct };
    if (pos == -1) {
      data.push({ skuID: skuID, type: type });
      let payload = {};
      payload.skuID = skuID;
      temp.data[i][type]++;
      payload[type] = type == "like" ? plike + 1 : pdislike + 1;
      if (payload[type] <= 0) {
        payload[type] = 0;
      }
      payload.data = temp;
      dispatch(updateLikesDislikes(payload));
    } else {
      data.splice(pos, 1);
      let payload = {};
      payload.skuID = skuID;
      temp.data[i][type]--;
      payload[type] = type == "like" ? plike - 1 : pdislike - 1;
      if (payload[type] <= 0) {
        payload[type] = 0;
      }
      payload.data = temp;
      dispatch(updateLikesDislikes(payload));
    }
    localStorage.setItem("rareLikesDislikes", JSON.stringify(data));
  };
  const handleCart = (title, price, skuID, discount, quantity, color) => {
    const payload = {
      title,
      price,
      skuID,
      stock: quantity,
      discount,
      color,
      quantity: 1,
    };
    if (token === "") {
      dispatch(loginState(toast));
    } else {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/create`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          toast({
            title: res.data.msg,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: err.response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };
  const handleShop = (skuID, title, price, discount, quantity, color) => {
    const payload = {
      skuID,
      title,
      price,
      discount,
      color,
      stock: quantity,
      quantity: 1,
    };
    if (token === "") {
      dispatch(loginState(toast));
    } else {
      dispatch(buyNow([payload]));
      navigate.push(`/cart/${skuID}`);
    }
  };
  const HandleWishUpdate = (skuID, title, price, quantity) => {
    if (token === "") {
      dispatch(loginState(toast));
    } else {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/wish/create`,
          { skuID, title, price, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          toast({
            title: res.data.msg,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          dispatch(getWish(token));
        });
    }
  };
  const link = `/allProducts/single/${skuID}`;
  return (
    <Box
      cursor={"pointer"}
      key={i}
      p={"5px 10px"}
      pb={"15px"}
      boxShadow={
        "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
      }
    >
      <Box>
        <Flex>
          <Box w={"90%"} ml={"30px"}>
            <Link href={link} target="_blank">
              <Image loading="eager"
                alt={skuID}
                title={skuID}
                htmlHeight={["auto", "auto", "250px", "250px"]}
                htmlWidth={["auto", "auto", "280px", "280px"]}
                w={["auto", "auto", "280px", "280px"]}
                h={["auto", "auto", "250px", "250px"]}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${skuID}-1.jpg`}
              />
            </Link>
          </Box>
          <Flex gap={"10px"} direction={"column"}>
            <Box
              cursor={"pointer"}
              onClick={() => HandleWishUpdate(skuID, title, price, quantity)}
            >
              {wish?.some((el) => el.skuID === skuID) ? (
                <Center>
                  <Image title="emptyWish" loading="eager"
                  htmlHeight={"17px"} htmlWidth={"17px"}
                    alt="emptyWish"
                    h={"17px"}
                    w={"17px"}
                    src={emptyWish.src}
                  />
                </Center>
              ) : (
                <Center>
                  <Image title="fillWish" loading="eager" htmlHeight={"17px"} htmlWidth={"17px"} alt="addwish" h={"17px"} w={"17px"} src={fillWish.src} />
                </Center>
              )}
            </Box>
            <Box cursor={"pointer"} onClick={() => handleLikes(skuID, "like")}>
              <Flex direction={"column"}>
                <Center>
                  <Image title="like" loading="eager" htmlHeight={"17px"} htmlWidth={"17px"} alt={"like"} h={"17px"} w={"17px"} src={like.src} />
                </Center>
                <Text fontSize={"10px"}>{shortenNumber(plike)}</Text>
              </Flex>
            </Box>
            <Box
              cursor={"pointer"}
              onClick={() => handleLikes(skuID, "dislike")}
            >
              <Flex direction={"column"}>
                <Center>
                  <Image title="dislike" loading="eager" htmlHeight={"17px"} htmlWidth={"17px"} alt={"dislike"} h={"17px"} w={"17px"} src={dislike.src} />
                </Center>
                <Text fontSize={"10px"}>{shortenNumber(pdislike)}</Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
        <Box>
          <Text
            fontWeight={"500"}
            textAlign={"left"}
            w={["auto", "auto", "300px", "300px"]}
          >
            {tempText}
          </Text>
        </Box>
        <Flex ml={"2px"} gap={"9px"} direction={["row", "row", "row", "row"]}>
          <Box
            p={"5px"}
            bgColor={"green"}
            color={"white"}
            h={"27px"}
            w={"50px"}
            borderRadius={"5px"}
          >
            <Flex gap={"4px"}>
              <Text fontSize={"12px"} textAlign={"left"}>
                {parseFloat(rating).toFixed(1)}
              </Text>
              <Image title={"star"} loading="eager" htmlHeight={"15px"} htmlWidth={"auto"} h={"15px"} alt="star" src={star.src} />
            </Flex>
          </Box>
          <Flex gap={"7px"} mb={"15px"}>
            <Text
              fontSize={["auto", "15px", "16px", "18px"]}
              textAlign={"left"}
              fontWeight={"bold"}
            >
              Rs.
              {Number(
                Number(price) - Number(price) * (Number(discount) / 100)
              ).toFixed(2)}
            </Text>
            <Text
              color={"gray"}
              textDecorationLine={"line-through"}
              fontSize={["auto", "15px", "16px", "18px"]}
              textAlign={"left"}
              fontWeight={"bold"}
            >
              Rs.{Number(price).toFixed(2)}
            </Text>
            <Text
              color={"green"}
              mt={"2px"}
              fontWeight={"semibold"}
              fontSize={["auto", "13px", "13px", "15px"]}
            >
              {floatModify(discount)}% off
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Flex
        justifyContent={["center", "center", "space-around", "space-around"]}
        alignItems={"center"}
        gap={"10px"}
        direction={["column", "row", "row", "row"]}
      >
        <Button
          fontSize={["13px", "15px", "16px", "18px"]}
          padding="0px 10px 0px 10px"
          variant={"unstyled"}
          bgColor={"#1a75ff"}
          w={["100%", "150px", "150px", "150px"]}
          _hover={{ bgColor: "black" }}
          color={"white"}
          onClick={() =>
            handleCart(title, price, skuID, discount, quantity, color)
          }
        >
          Add to cart
        </Button>
        <Button
          fontSize={["13px", "15px", "16px", "18px"]}
          padding="0px 10px"
          variant={"unstyled"}
          bgColor={"green"}
          _hover={{ bgColor: "black" }}
          w={["100%", "150px", "150px", "150px"]}
          color={"white"}
          onClick={() =>
            handleShop(skuID, title, price, discount, quantity, color)
          }
        >
          Buy Now
        </Button>
      </Flex>
    </Box>
  );
};

export default ProductCard;
