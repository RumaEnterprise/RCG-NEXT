"use client";
import { Box, Center, Image, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import Link from "next/link";
import Buy_Cart from "./Buy_Cart";
import { buyNow, getCart, loginState } from "../Redux/AppReducer/Action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const SingleHomeCard = ({
  ele,
  i,
  buyFont = "10px",
  cartFont = "10px",
  view = false,
  p,
  hover = true,
  button = true,
  buynow = false,
  height = "auto",
  title = true,
  price = true,
  imgHeight = "190px",
  sale = true,
}) => {
  const [btnHover, setBtnHover] = useState(false);
  let new_imgHeight = imgHeight.split("px");
  new_imgHeight = new_imgHeight[0];
  const dispatch = useDispatch();
  const toast = useToast();
  const token = useSelector((store) => store.auth.token);
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
          dispatch(getCart(token));
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
  const handleShop = (skuID, title, price, discount, quantity) => {
    const payload = {
      skuID,
      title,
      price,
      discount,
      stock: quantity,
      quantity: 1,
    };
    if (token === "") {
      dispatch(loginState(toast));
    } else {
      dispatch(buyNow([payload]));
      window.open(`/cart/${skuID}`, "_blank");
    }
  };
  return (
    <Box key={i} position="relative">
      <Box cursor={"pointer"} bg={"white"} h={["auto", "auto", "auto", height]}>
        {sale ? (
          <Text
            textAlign={"left"}
            p={"3px 7px"}
            fontWeight={"bold"}
            w={"47px"}
            fontSize={["8px", "9px", "10px", "12px"]}
            color={"white"}
            bgColor={"#006eff"}
          >
            SALE
          </Text>
        ) : null}
        <Link href={`/allProducts/single/${ele.skuID}`} target="_blank">
          <Center>
            <Image
              loading="eager"
              title={ele.skuID || i}
              htmlWidth={"auto"}
              htmlHeight={imgHeight}
              h={[
                new_imgHeight >= 200
                  ? `${new_imgHeight - 90}px`
                  : `${new_imgHeight - 50}px`,
                new_imgHeight > 200
                  ? `${new_imgHeight - 70}px`
                  : `${new_imgHeight - 30}px`,
                new_imgHeight > 200
                  ? `${new_imgHeight - 40}px`
                  : `${new_imgHeight - 10}px`,
                `${new_imgHeight}px`,
              ]}
              alt={i}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${ele.skuID}-1.jpg`}
            />
          </Center>
        </Link>
        {title ? (
          <Text p={"0px 3px"} textAlign={"center"}>{ele.title?.split("").splice(0, 50).join("") + "..."}</Text>
        ) : null}
        {price ? (
          <Center mt={"10px"} fontWeight={"bold"} fontSize={"15px"}>
            <Text float={"left"} color={"green"}>
              ₹
              {(
                ele.price -
                ele.price * (ele.discount.toFixed(0) / 100)
              ).toFixed(0)}
            </Text>
            <Text
              color={"red"}
              ml={"3px"}
              float={"left"}
              mr={"3px"}
              textDecorationLine={"line-through"}
            >
              ₹{ele.price}
            </Text>
          </Center>
        ) : null}
        {hover ? (
          <Center
            onMouseEnter={() => setBtnHover(false)}
            onClick={() =>
              !btnHover
                ? window.open(`/allProducts/single/${ele.skuID}`, "_blank")
                : null
            }
            bgColor={"rgba(0,0,0,0.5)"}
            h={"full"}
            w={"100%"}
            transition="opacity 0.3s ease-in-out"
            position="absolute"
            opacity={"0"}
            _hover={{ opacity: 1 }}
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            {button ? (
              <Buy_Cart
                setBtnHover={setBtnHover}
                view={view}
                name={view ? "View" : buynow ? "Buy Now" : "Add to Cart"}
                fs={buynow ? buyFont : cartFont}
                bgColor={view ? "black" : buynow ? "black" : "red"}
                color={"white"}
                p={p}
                functionAPI={
                  view
                    ? () => {
                        window.open(
                          `/allProducts/single/${ele.skuID}`,
                          "_blank"
                        );
                      }
                    : buynow
                    ? () =>
                        handleShop(
                          ele.skuID,
                          ele.title,
                          ele.price,
                          ele.discount,
                          ele.quantity
                        )
                    : () =>
                        handleCart(
                          ele.title,
                          ele.price,
                          ele.skuID,
                          ele.discount,
                          ele.quantity,
                          ele.color
                        )
                }
              />
            ) : null}
          </Center>
        ) : (
          <Center>
            {button ? (
              <Buy_Cart
                setBtnHover={setBtnHover}
                name={buynow ? "Buy Now" : "Add to Cart"}
                fs={buynow ? buyFont : cartFont}
                bgColor={buynow ? "black" : "red"}
                color={"white"}
                p={p}
                functionAPI={
                  buynow
                    ? () =>
                        handleShop(
                          ele.skuID,
                          ele.title,
                          ele.price,
                          ele.discount,
                          ele.quantity
                        )
                    : () =>
                        handleCart(
                          ele.title,
                          ele.price,
                          ele.skuID,
                          ele.discount,
                          ele.quantity,
                          ele.color
                        )
                }
              />
            ) : null}
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default SingleHomeCard;
