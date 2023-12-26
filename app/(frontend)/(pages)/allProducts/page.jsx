"use client";
import {
  Box,
  Flex,
  Text,
  Radio,
  RadioGroup,
  SimpleGrid,
  Image,
  Button,
  Center,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import star from "../../Resources/star.png";
import {
  buyNow,
  getWish,
  setURL,
  userGetProduct,
} from "../../Redux/AppReducer/Action";
import { categoryList, colorList } from "../../universal_variable";
import Head from "next/head";
import { capitalizeWords } from "../../Components/capital";
import ProductCard from "../../Components/ProductCard";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../../Components/Loading";
const User = () => {
  const searchParams = useSearchParams();
  const navigate = useRouter();
  const [pageload, setLoad] = useState(true);
  const [page, setPage] = useState(1);
  const token = useSelector((store) => store.auth.token);
  const loginform = useSelector((store) => store.app.loginForm);
  const userProduct = useSelector((store) => store.app.userProduct);
  const userProductLoading = useSelector((store) => store.app.isProductLoading);
  const wish = useSelector((store) => store.app.wish);
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const getProduct = () => {
    setLoad(true);
    let filter = `category=${searchParams.get(
      "category"
    )}&page=${page}&limit=9&minPrice=${searchParams.get(
      "minPrice"
    )}&maxPrice=${searchParams.get("maxPrice")}&color=${searchParams.get(
      "color"
    )}&rating=${searchParams.get("rate")}&discount=${searchParams.get(
      "discount"
    )}`;
    let payload = {
      filter: filter,
    };
    dispatch(userGetProduct(payload));
    dispatch(buyNow([]));
    handleWish();
    setLoad(false);
  };
  const deleteParams = (name) => {
    const param = searchParams.get(name);
    const allParams = window.location.href.split("?")?.[1]?.split("&") || [];
    if (name == "price") {
      let filter = allParams
        .map((ele) => {
          if (ele.includes("minPrice") || ele.includes("maxPrice")) {
            return;
          } else {
            return ele;
          }
        })
        .filter((ele) => ele !== undefined);
      navigate.push(`?${filter.join("&")}`);
    } else if (param) {
      const filter = allParams.filter((ele) => ele.split("=")[0] !== name);
      navigate.push(
        `?${filter.length == 1 ? filter.join("") : filter.join("&")}`
      );
    }
  };
  const addParams = (name, value) => {
    const allParams = window.location.href.split("?")?.[1]?.split("&") || [];
    if (name == "price") {
      const [minPrice, maxPrice] = value.split("-");
      let filter = allParams
        .map((ele) => {
          if (ele.includes("minPrice") || ele.includes("maxPrice")) {
            return;
          } else {
            return ele;
          }
        })
        .filter((ele) => ele !== undefined);

      navigate.push(
        `?${filter.join("&")}${
          filter.length >= 1 ? "&" : ""
        }minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
    } else {
      const filter = allParams.filter((ele) => !ele.includes(name));
      navigate.push(
        `?${filter.join("&")}${filter.length >= 1 ? "&" : ""}${name}=${value}`
      );
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  const handleWish = () => {
    if (token !== "" && user.administration == "" && wish.length <= 0) {
      dispatch(getWish(token));
    }
  };

  useEffect(() => {
    getProduct();
  }, [page, searchParams, loginform, user]);
  if (userProductLoading) {
    return <Loading load={userProductLoading} />;
  }
  return (
    <Box>
      <Head>
        <title>Rare Combee Group Products</title>
      </Head>
      <Image
        loading="eager"
        title="banner"
        alt="banner"
        w={"100%"}
        htmlHeight={["auto", "auto", "auto", "400px"]}
        htmlWidth={"100%"}
        h={["auto", "auto", "auto", "400px"]}
        src="https://i.ibb.co/wYSVmmw/co4.jpg"
      />
      <Flex
        justifyContent={"space-between"}
        direction={["column", "column", "row", "row"]}
      >
        <Box
          w={["auto", "auto", "auto", "25%"]}
          p={"5px"}
          bgColor={"#DDE5E6"}
          m={"10px 0px"}
        >
          <Accordion allowToggle defaultIndex={[0, 1, 2]}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text
                      fontSize={"18px"}
                      textAlign={"left"}
                      fontWeight={"600"}
                    >
                      Filter by Type
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text
                  onClick={() => deleteParams("category")}
                  mr={"5px"}
                  fontSize={"18px"}
                  textAlign={"left"}
                  textDecoration={"underline"}
                  color={"blue"}
                  cursor={"pointer"}
                >
                  Reset Filter
                </Text>
                <RadioGroup
                  w={"100px"}
                  onChange={(e) => {
                    addParams("category", e);
                  }}
                  value={searchParams.get("category") || ""}
                >
                  <SimpleGrid gap={"7px"} columns={"1"} direction="column">
                    {categoryList.map(({ name },i) => {
                      return (
                        <Radio border={"1px solid black"} value={name}key={i}>
                          {capitalizeWords(name)}
                        </Radio>
                      );
                    })}
                  </SimpleGrid>
                </RadioGroup>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text
                      fontSize={"18px"}
                      textAlign={"left"}
                      fontWeight={"600"}
                    >
                      Filter by Color
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text
                  onClick={() => deleteParams("color")}
                  mr={"5px"}
                  fontSize={"18px"}
                  textAlign={"left"}
                  textDecoration={"underline"}
                  color={"blue"}
                  cursor={"pointer"}
                >
                  Reset Filter
                </Text>
                <RadioGroup
                  onChange={(e) => {
                    addParams("color", e);
                  }}
                  value={searchParams.get("color") || ""}
                >
                  <SimpleGrid gap={"7px"} columns={"2"} direction="column">
                    {colorList.map(({ name, code },i) => {
                      const value = name.split(" ").join("");
                      return (
                        <Radio border={"1px solid black"} value={value} key={i}>
                          <Flex gap={"5px"}>
                            <Center>
                              <Box
                                border={"0.5px solid black"}
                                h={"15px"}
                                borderRadius={"50%"}
                                w={"15px"}
                                bg={code}
                              ></Box>
                            </Center>
                            {capitalizeWords(name)}
                          </Flex>
                        </Radio>
                      );
                    })}
                  </SimpleGrid>
                </RadioGroup>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text
                      fontSize={"18px"}
                      textAlign={"left"}
                      fontWeight={"600"}
                    >
                      Filter by Price
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text
                  onClick={() => deleteParams("price")}
                  mr={"5px"}
                  fontSize={"18px"}
                  textAlign={"left"}
                  textDecoration={"underline"}
                  color={"blue"}
                  cursor={"pointer"}
                >
                  Reset Filter
                </Text>
                <RadioGroup
                  onChange={(e) => {
                    addParams("price", e);
                  }}
                  value={
                    `${searchParams.get("minPrice")}-${searchParams.get(
                      "maxPrice"
                    )}` || ""
                  }
                >
                  <SimpleGrid gap={"7px"} columns={"1"} direction="column">
                    <Radio border={"1px solid black"} value="300-400">
                      Rs.300 - Rs.400
                    </Radio>
                    <Radio border={"1px solid black"} value="401-500">
                      Rs.401 - Rs.500
                    </Radio>
                    <Radio border={"1px solid black"} value="501-600">
                      Rs.501 - Rs.600
                    </Radio>
                  </SimpleGrid>
                </RadioGroup>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text
                      fontSize={"18px"}
                      textAlign={"left"}
                      fontWeight={"600"}
                    >
                      Filter by Rating
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text
                  onClick={() => deleteParams("rate")}
                  mr={"5px"}
                  mt={"20px"}
                  fontSize={"18px"}
                  mb={"10px"}
                  textAlign={"left"}
                  textDecoration={"underline"}
                  color={"blue"}
                  cursor={"pointer"}
                >
                  Reset Filter
                </Text>
                <RadioGroup
                  onChange={(e) => {
                    addParams("rate", e);
                  }}
                  value={searchParams.get("rate") || ""}
                >
                  <SimpleGrid gap={"7px"} columns={"1"} direction="column">
                    <Radio border={"1px solid black"} value="2star">
                      <Flex gap={"5px"}>
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
                              2.0
                            </Text>
                            <Image
                              loading="eager"
                              title="star"
                              htmlHeight={"15px"}
                              htmlWidth={"auto"}
                              alt={"star"}
                              h={"15px"}
                              src={star.src}
                            />
                          </Flex>
                        </Box>
                        <Box>& above</Box>
                      </Flex>
                    </Radio>
                    <Radio border={"1px solid black"} value="3star">
                      <Flex gap={"5px"}>
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
                              3.0
                            </Text>
                            <Image
                              title="star"
                              htmlHeight={"15px"}
                              htmlWidth={"auto"}
                              loading={"eager"}
                              alt={"star"}
                              h={"15px"}
                              src={star.src}
                            />
                          </Flex>
                        </Box>
                        <Box>& above</Box>
                      </Flex>
                    </Radio>
                    <Radio border={"1px solid black"} value="4star">
                      <Flex gap={"5px"}>
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
                              4.0
                            </Text>
                            <Image
                              title="star"
                              htmlHeight={"15px"}
                              htmlWidth={"auto"}
                              loading={"eager"}
                              alt={"star"}
                              h={"15px"}
                              src={star.src}
                            />
                          </Flex>
                        </Box>
                        <Box>& above</Box>
                      </Flex>
                    </Radio>
                    <Radio border={"1px solid black"} value="5star">
                      <Flex gap={"5px"}>
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
                              5.0
                            </Text>
                            <Image
                              title="star"
                              htmlHeight={"15px"}
                              htmlWidth={"auto"}
                              loading={"eager"}
                              alt={"star"}
                              h={"15px"}
                              src={star.src}
                            />
                          </Flex>
                        </Box>
                        <Box>& above</Box>
                      </Flex>
                    </Radio>
                  </SimpleGrid>
                </RadioGroup>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text
                      fontSize={"18px"}
                      textAlign={"left"}
                      fontWeight={"600"}
                    >
                      Filter by Discount
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text
                  onClick={() => deleteParams("discount")}
                  mr={"5px"}
                  mt={"20px"}
                  fontSize={"18px"}
                  mb={"10px"}
                  textAlign={"left"}
                  textDecoration={"underline"}
                  color={"blue"}
                  cursor={"pointer"}
                >
                  Reset Filter
                </Text>
                <RadioGroup
                  onChange={(e) => {
                    addParams("discount", e);
                  }}
                  value={searchParams.get("discount") || ""}
                >
                  <SimpleGrid gap={"7px"} columns={"1"} direction="column">
                    <Radio border={"1px solid black"} value="50">
                      50% or more
                    </Radio>
                    <Radio border={"1px solid black"} value="40">
                      40% or more
                    </Radio>
                    <Radio border={"1px solid black"} value="30">
                      30% or more
                    </Radio>
                    <Radio border={"1px solid black"} value="20">
                      20% or more
                    </Radio>
                    <Radio border={"1px solid black"} value="10">
                      10% or more
                    </Radio>
                  </SimpleGrid>
                </RadioGroup>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
        <Box
          w={["auto", "auto", "auto", "80%"]}
          position={"relative"}
          pb={"50px"}
        >
          <SimpleGrid
            justifyContent={"space-around"}
            p={"0px 5px"}
            columns={[1, 2, 2, 2, 3]}
            gap={"10px"}
            paddingBottom={"15px"}
            mt={"20px"}
          >
            {userProduct?.data?.length <= 0 ? (
              <Box fontSize={"25px"} color={"red"} w={"150vh"}>
                <Center>Product Not Available</Center>
              </Box>
            ) : null}
            {userProduct?.data?.map(
              (
                {
                  like,
                  dislike,
                  title,
                  price,
                  color,
                  quantity,
                  skuID,
                  discount = 10,
                  rating = 5,
                },
                i
              ) => {
                return (
                  <ProductCard key={i}
                    plike={like}
                    pdislike={dislike}
                    title={title}
                    price={price}
                    color={color}
                    quantity={quantity}
                    skuID={skuID}
                    discount={discount}
                    rating={rating}
                    i={i}
                  />
                );
              }
            )}
          </SimpleGrid>
          <Flex
            position="absolute"
            bottom="0px"
            right={(window.innerWidth - 500) / 2}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"10px"}
            mb={"10px"}
            mr={"10px"}
          >
            <Button
              _hover={{}}
              onClick={() => setPage((res) => res - 1)}
              isDisabled={page === 1}
            >
              <GrFormPreviousLink />
            </Button>
            <Box>
              Page {page} out of {userProduct?.maxPage}
            </Box>
            <Button
              _hover={{}}
              onClick={() => setPage((res) => res + 1)}
              isDisabled={page >= userProduct?.maxPage}
            >
              <GrFormNextLink />
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default User;
