"use client";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Td,
  Text,
  Textarea,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { buyNow } from "../Redux/AppReducer/Action";
import { useParams } from "next/navigation";
import Link from "next/link";

const CartDisplay = ({ data, handleCart,setLoad }) => {
  let { skuID } = useParams();
  const token = useSelector((store) => store.auth.token);
  const buy = useSelector((store) => store.app.buy);
  const dispatch = useDispatch();
  const toast = useToast();
  const handleDelete = (skuID) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/delete/${skuID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast({
          title: res.data.msg,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        handleCart();
      });
  };
  const handleQuantity = (type, quantity, skuId) => {
    setLoad(true);
    let totalQTY;
    if (type === "decrease") {
      totalQTY = Number(quantity) - 1;
    } else {
      totalQTY = Number(quantity) + 1;
    }
    if (skuID !== undefined) {
      let temp = [...buy];
      temp[0].quantity = totalQTY;
      dispatch(buyNow(temp));
    } else {
      try {
        axios
          .patch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/update/${skuId}`,
            { quantity: totalQTY },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            handleCart();
          });
      } catch (error) {
        console.log(error);
      }
    }
    setLoad(false)
  };
  return (
    <>
      {data.map(({ skuID, title, price, quantity, discount, stock },i) => {
        return (
          <Tr key={i}>
            <Td>
              <Flex gap={"9px"} direction={["column", "column", "row", "row"]}>
                <Flex>
                  {buy.length <= 0 ? (
                    <Center cursor={"pointer"}>
                      <Box mr={"5px"} onClick={() => handleDelete(skuID)}>
                        <RiDeleteBin6Line />
                      </Box>
                    </Center>
                  ) : null}
                  <Link href={`/allProducts/single/${skuID}`} target="_blank">
                  <Image alt="product" htmlHeight={"70px"} htmlWidth={"200px"} loading="eager" title="product"
                    h={"70px"} w={"200px"}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${skuID}-1.jpg`}
                  /></Link>
                </Flex>
                <Text whiteSpace={"pre-wrap"}
                  w={["90px", "auto", "auto", "auto"]}
                  fontSize={["11px", "13px", "14px", "16px"]}
                  sx={{
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {title}
                </Text>
              </Flex>
            </Td>
            <Td>
              <Center>
                Rs.
                {Number(
                  Number(price) - Number(price) * (Number(discount) / 100)
                ).toFixed(0) + ".00"}
              </Center>
            </Td>
            <Td>
              <Flex direction={"column"}>
                <Flex gap={"10px"}>
                  <Center>
                    <Button
                      variant={"unstyled"}
                      isDisabled={quantity <= 1}
                      bgColor={"gray.300"}
                      onClick={() =>
                        handleQuantity("decrease", quantity, skuID)
                      }
                      fontWeight={"600"}
                    >
                      -
                    </Button>
                  </Center>
                  <Center>
                    <Text fontSize={"18px"}>{quantity}</Text>
                  </Center>
                  <Center>
                    <Button
                      variant={"unstyled"}
                      isDisabled={stock === quantity}
                      bgColor={"gray.300"}
                      onClick={() =>
                        handleQuantity("increase", quantity, skuID)
                      }
                      fontWeight={"600"}
                    >
                      +
                    </Button>
                  </Center>
                </Flex>
                {stock === quantity ? (
                  <>
                    <Text color={"red"}>Out of stock</Text>
                  </>
                ) : null}
              </Flex>
            </Td>
            <Td>
              <Center>
                ₹
                {Number(
                  Number(
                    Number(price) - (Number(price) * Number(discount)) / 100
                  ).toFixed(0) * quantity
                ).toFixed(2)}
              </Center>
            </Td>
          </Tr>
        );
      })}
    </>
  );
};

export default CartDisplay;
