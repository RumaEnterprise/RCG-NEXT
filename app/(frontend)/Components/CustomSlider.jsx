import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaShoppingCart } from "react-icons/fa";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { buyNow, getCart, loginState } from "../Redux/AppReducer/Action";
import { useRouter } from "next/navigation";
import axios from "axios";
const CustomSlider = ({
  data,
  settings,
  text = false,
  button = false,
  banner = false,
  h = "",
  mb = "",
  w = "",
  redirect = false,
  cursor = false,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((store) => store.auth.token);
  const toast = useToast();
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
  const handleShop = (skuID, title, price) => {
    const payload = {
      skuID,
      title,
      price,
      quantity: 1,
    };
    dispatch(buyNow([payload]));
    router.push(`/cart/${skuID}`);
  };
  return (
    <Slider {...settings}>
      {data?.map(
        ({ skuID, title, price, image, discount, quantity, color }, i) => {
          return (
            <Flex key={i}>
              <Box
                bgColor={"white"}
                key={i}
                pb={"20px"}
                w={banner ? "100%" : "96%"}
                _hover={{ bgColor: "#F0F0F0" }}
              >
                <Center>
                  <Image
                    loading="eager"
                    title={skuID || i}
                    alt={i}
                    htmlWidth={"auto"}
                    htmlHeight={"auto"}
                    onClick={() => {
                      if (redirect) {
                        router.push(`/allProducts/single/${skuID}`);
                      }
                    }}
                    cursor={cursor ? "pointer" : ""}
                    src={
                      skuID === undefined
                        ? image
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${skuID}-1.jpg`
                    }
                    h={h}
                    w={w}
                    mb={mb}
                  />
                </Center>
                <Center>
                  {text === true ? (
                    <Text>
                      {title?.split("").splice(0, 50).join("") + "..."}
                    </Text>
                  ) : null}
                </Center>
                <Center>
                  {price !== undefined ? (
                    <Center mt={"10px"} fontWeight={"bold"} fontSize={"15px"}>
                      <Text float={"left"} color={"green"}>
                        ₹
                        {(price - price * (discount.toFixed(0) / 100)).toFixed(
                          0
                        )}
                      </Text>
                      <Text
                        color={"red"}
                        ml={"3px"}
                        float={"left"}
                        mr={"3px"}
                        textDecorationLine={"line-through"}
                      >
                        ₹{price}
                      </Text>
                    </Center>
                  ) : null}
                </Center>
                <Center>
                  {button === true ? (
                    <Flex gap={"10px"} fontSize={"13px"}>
                      <Button
                        fontSize="14px"
                        fontWeight={"bold"}
                        borderRadius="5px"
                        onClick={() =>
                          handleCart(
                            title,
                            price,
                            skuID,
                            discount,
                            quantity,
                            color
                          )
                        }
                        variant="unstyled"
                        bgColor="red"
                        color="white"
                        h="30px"
                        p="0px 15px"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ marginRight: "8px", fontSize: "15px" }}>
                          <FaShoppingCart />
                        </span>
                        Add to Cart
                      </Button>
                    </Flex>
                  ) : null}
                </Center>
              </Box>
              <Box
                hidden={banner}
                w={banner ? "0px" : "15px"}
                bgColor={"#F7F7F7"}
              >
                {" "}
              </Box>
            </Flex>
          );
        }
      )}
    </Slider>
  );
};

export default CustomSlider;
