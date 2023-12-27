"use client";
import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  Image,
  Input,
  Select,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../Dashboard";
import { getHomeData } from "../../../Redux/AppReducer/Action";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import fbb1 from "../../../Resources/fbb1.jpg";
import {
  homeFiveBanner,
  homeFourBanner,
  homeThreeBanner,
  homeTopBanner,
  homeTwoBanner,
} from "../../../universal_variable";
import Link from "next/link";
const Divider = () => {
  return <Box bgGradient="linear(to-r, green,yellow.500, red)" h={"1px"}></Box>;
};

const ProductCard = ({
  data,
  token,
  category = "",
  tag = "",
  column,
  height = "270px",
  imgHeight = "190px",
  sale = true,
  hover = true,
}) => {
  const dispatch = useDispatch();
  let new_imgHeight = imgHeight.split("px");
  new_imgHeight = new_imgHeight[0];
  const [selectedData, setSelectedData] = useState([]);
  useEffect(() => {
    let base_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getsku?`;
    if (category !== "") {
      base_url += `category=${category}`;
    } else {
      base_url += `tag=${tag}`;
    }
    axios
      .get(base_url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSelectedData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleUpdateProduct = (id, skuID) => {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/update/${id}`,
        { skuID: skuID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        dispatch(getHomeData(token));
      });
  };
  return (
    <Box mt={"10px"}>
      <SimpleGrid gap={"10px"} justifyContent={"space-around"} columns={column}>
        {data?.map((ele, i) => {
          return (
            <Box key={i}>
              <Box
                cursor={"pointer"}
                bg={"white"}
                transition="background 0.2s ease-in-out"
                h={["auto", "auto", "auto", height]}
                _hover={{
                  bg: hover ? "#F0F0F0" : "white",
                }}
              >
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
                <Select
                  mt={"10px"}
                  value={ele.skuID}
                  onChange={(e) => handleUpdateProduct(ele._id, e.target.value)}
                >
                  {data &&
                    selectedData &&
                    selectedData?.map((el, i) => {
                      return (
                        <option key={i} value={el.skuID}>
                          {el.skuID}
                        </option>
                      );
                    })}
                </Select>
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

const UserHome = () => {
  const toast = useToast();
  const color = "#59c3f3";
  const [load, setLoad] = useState({ discount: false });
  const [name, setName] = useState("");
  const [bannerID, setBannerID] = useState("");
  const [banners, setBanners] = useState({});
  const discount = useRef();
  const dispatch = useDispatch();
  const token = useSelector((store) => store.auth.token);
  const homeData = useSelector((store) => store.app.home);
  const ultra_premium_gift_set = homeData?.filter(
    (el) => el.type === "ULTRA PREMIUM GIFT SET"
  );
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    pauseOnHover: true,
  };
  const [isHovered, setHovered] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
  });

  const handleMouseEnter = (bannername, bannerid, state) => {
    setName(bannername);
    setBannerID(bannerid);
    const new_hover = { ...isHovered };
    new_hover[state] = true;
    setHovered(new_hover);
  };

  const handleMouseLeave = (state) => {
    setName("");
    setBannerID("");
    const new_hover = { ...isHovered };
    new_hover[state] = false;
    setHovered(new_hover);
  };
  const getBanners = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/banner`)
      .then((response) => {
        let data = response.data;
        const first = data.filter((name) => name.includes(homeTopBanner));
        const second = data.filter((name) => name.includes(homeTwoBanner));
        const third = data.filter((name) => name.includes(homeThreeBanner));
        const fourth = data.filter((name) => name.includes(homeFourBanner));
        const fifth = data.filter((name) => name.includes(homeFiveBanner));
        setBanners({ first, second, third, fourth,fifth });
      })
      .catch((error) => {
        console.error("Error fetching image data:", error);
      });
  };
  const discountData = homeData?.filter((el) => el.type === "discount");
  useEffect(() => {
    dispatch(getHomeData(token));
    getBanners();
  }, [dispatch, token]);

  const handleUpdateDiscount = (id) => {
    setLoad({ ...load, discount: true });
    const payload = {
      text: discount.current.value,
    };
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        dispatch(getHomeData(token));
        setLoad({ ...load, discount: false });
        toast({
          title: "Discount Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
        setLoad({ ...load, discount: false });
      });
  };
  const handleBannerUpload = (event) => {
    let selectedFile = event.target.files[0];
    try {
      if (selectedFile) {
        const formData = new FormData();
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
        if (allowedExtensions.includes(`.${fileExtension}`)) {
          formData.append("banner", selectedFile);
          axios
            .patch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/updatebanner?name=${name}&bannerID=${bannerID}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              getBanners();
              toast({
                title: "Banner Updated",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            })
            .catch((err) => {
              console.log(err);
              toast({
                title: "Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Invalid file type. Please select a valid file.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteTopBanner = () => {
    try {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/deletebanner?name=${name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          getBanners();
          toast({
            title: "Banner Deleted",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Try again",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box>
      <Dashboard>
        <Box border={"0px solid purple"}>
          <Flex gap={"7px"} mb={"10px"}>
            <Center>
              <FormLabel mt={"7px"}>Top Discount</FormLabel>
            </Center>
            <Input
              defaultValue={discountData[0]?.text}
              ref={discount}
              border={"0.5px solid blue"}
              w={"600px"}
              placeholder="Enter Discount"
            />
            <Button
              isLoading={load.discount}
              variant={"unstyled"}
              bgColor={"teal"}
              p={"0px 20px"}
              color={"white"}
              onClick={() => handleUpdateDiscount(discountData[0]?._id)}
            >
              Update
            </Button>
          </Flex>
          <Divider />
          <Box mt={"10px"}>
            <Slider {...settings}>
              {banners?.first?.map((ele, i) => {
                return (
                  <Box
                    bgColor={"white"}
                    key={i}
                    h={"350px"}
                    pb={"20px"}
                    bgImage={`url(${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/image?name=${ele})`}
                    bgSize="contain"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    w={"100%"}
                    onMouseEnter={() =>
                      handleMouseEnter(ele, homeTopBanner, "first")
                    }
                    onMouseLeave={() => handleMouseLeave("first")}
                    position="relative"
                  >
                    <Box
                      opacity={isHovered.first ? 0.5 : 0} // Set opacity based on hover state
                      transition="opacity 0.3s ease-in-out" // Add transition effect
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      bg="black"
                      zIndex="1"
                    />
                    <Flex
                      gap={"10px"}
                      opacity={isHovered.first ? 1 : 0} // Set opacity based on hover state
                      transition="opacity 0.3s ease-in-out" // Add transition effect
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      padding="10px 20px"
                      border="none"
                      cursor="pointer"
                      zIndex="2"
                    >
                      <Box>
                        <Input
                          id="bannerInput"
                          display={"none"}
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          onChange={(event) =>
                            handleBannerUpload(event, homeTopBanner)
                          }
                          name="banner"
                        />
                        <label htmlFor="bannerInput">
                          <Center>
                            <Box
                              p={"8px 15px"}
                              borderRadius={"5px"}
                              cursor="pointer"
                              position="relative"
                              color={"white"}
                              bgColor={"blue"}
                              _hover={{ bgColor: "blue.600" }}
                            >
                              <Text>Update</Text>
                              {/* <Button colorScheme="blue">Update</Button> */}
                            </Box>
                          </Center>
                        </label>
                      </Box>

                      <Button
                        colorScheme="red"
                        onClick={() => deleteTopBanner()}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Box>
                );
              })}
              <Box
                bgColor={"white"}
                h={"350px"}
                pb={"20px"}
                onMouseEnter={() =>
                  handleMouseEnter("", homeTopBanner, "first")
                }
                onMouseLeave={() => handleMouseLeave("first")}
                position="relative"
              >
                <Center>
                  <Text
                    position="absolute"
                    top="40%"
                    left="48%"
                    fontSize={"60px"}
                  >
                    +
                  </Text>
                </Center>
                <Box
                  opacity={isHovered.first ? 0.5 : 0} // Set opacity based on hover state
                  transition="opacity 0.3s ease-in-out" // Add transition effect
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  bg="black"
                  zIndex="1"
                />
                <Flex
                  gap={"10px"}
                  opacity={isHovered.first ? 1 : 0} // Set opacity based on hover state
                  transition="opacity 0.3s ease-in-out" // Add transition effect
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  padding="10px 20px"
                  border="none"
                  cursor="pointer"
                  zIndex="2"
                >
                  <Box>
                    <Input
                      id="bannerInput"
                      display={"none"}
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={(event) =>
                        handleBannerUpload(event, homeTopBanner)
                      }
                      name="banner"
                    />
                    <label htmlFor="bannerInput">
                      <Center>
                        <Box
                          p={"8px 15px"}
                          borderRadius={"5px"}
                          cursor="pointer"
                          position="relative"
                          color={"white"}
                          bgColor={"blue"}
                          _hover={{ bgColor: "blue.600" }}
                        >
                          <Text>Add Banner</Text>
                        </Box>
                      </Center>
                    </label>
                  </Box>
                </Flex>
              </Box>
            </Slider>
          </Box>
          <Divider />
          <Box>
            <Text
              as={"h1"}
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mt={"15px"}
              bgColor={color}
              color={"white"}
            >
              ULTRA PREMIUM GIFT SET
            </Text>
            <ProductCard
              tag={"ultraPremium"}
              token={token}
              data={ultra_premium_gift_set}
              column={[2, 2, 3, 5]}
            />
          </Box>
        </Box>
        <Divider />
        <Flex
          mt={"20px"}
          mb={"10px"}
          justifyContent={"space-between"}
          direction={["column", "column", "row", "row"]}
          gap={"10px"}
        >
          <Box w={["auto", "auto", "auto", "75%"]}>
            <Text
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mb={"18px"}
              bgColor={color}
              color={"white"}
            >
              PREMIUM TIE WITH CUFFLINKS AND ROSE PIN
            </Text>
          </Box>
          <Box w={["auto", "auto", "auto", "25%"]} h={"290px"}>
            <Box
              bgColor={"white"}
              h={"300px"}
              pb={"20px"}
              bgImage={`url(${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/image?name=${banners?.second?.[0]})`}
              bgSize="contain"
              bgPosition="center"
              bgRepeat="no-repeat"
              onMouseEnter={() =>
                handleMouseEnter(banners?.second[0], homeTwoBanner, "second")
              }
              onMouseLeave={() => handleMouseLeave("second")}
              position="relative"
            >
              <Box
                opacity={isHovered.second ? 0.5 : 0} // Set opacity based on hover state
                transition="opacity 0.3s ease-in-out" // Add transition effect
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bg="black"
                zIndex="1"
              />
              <Flex
                gap={"10px"}
                opacity={isHovered.second ? 1 : 0} // Set opacity based on hover state
                transition="opacity 0.3s ease-in-out" // Add transition effect
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                padding="10px 20px"
                border="none"
                cursor="pointer"
                zIndex="2"
              >
                <Box>
                  <Input
                    id="bannerInput"
                    display={"none"}
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(event) =>
                      handleBannerUpload(event, homeTwoBanner)
                    }
                    name="banner"
                  />
                  <label htmlFor="bannerInput">
                    <Center>
                      <Box
                        p={"8px 15px"}
                        borderRadius={"5px"}
                        cursor="pointer"
                        position="relative"
                        color={"white"}
                        bgColor={"blue"}
                        _hover={{ bgColor: "blue.600" }}
                      >
                        <Text>Update</Text>
                      </Box>
                    </Center>
                  </label>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Flex>
        <Divider />
        <Flex
          mt={"20px"}
          direction={["column", "column", "row", "row"]}
          justifyContent={"space-between"}
          gap={"10px"}
        >
          <Box w={["100%", "100%", "75%", "75%"]}>
            <Text
              mb={"15px"}
              fontSize={["15px", "20px", "25px", "25px"]}
              fontWeight={"bold"}
              mt={"18px"}
              bgColor={color}
              color={"white"}
            >
              CLASSIC TIES FOR OFFICE AND PARTY
            </Text>
          </Box>
          <Box w={["100%", "100%", "25%", "25%"]}>
            <Text
              mb={"15px"}
              fontSize={["15px", "20px", "25px", "25px"]}
              fontWeight={"bold"}
              mt={"18px"}
              bgColor={color}
              color={"white"}
            >
              LATEST PRODUCTS
            </Text>
            <Divider />
            <Box
              bgColor={"white"}
              h={"300px"}
              pb={"20px"}
              bgImage={`url(${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/image?name=${banners?.fifth?.[0]})`}
              bgSize="contain"
              bgPosition="center"
              bgRepeat="no-repeat"
              onMouseEnter={() =>
                handleMouseEnter(banners?.fifth?.[0], homeFiveBanner, "fifth")
              }
              onMouseLeave={() => handleMouseLeave("fifth")}
              position="relative"
            >
              <Box
                opacity={isHovered.fifth ? 0.5 : 0} // Set opacity based on hover state
                transition="opacity 0.3s ease-in-out" // Add transition effect
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bg="black"
                zIndex="1"
              />
              <Flex
                gap={"10px"}
                opacity={isHovered.fifth ? 1 : 0} // Set opacity based on hover state
                transition="opacity 0.3s ease-in-out" // Add transition effect
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                padding="10px 20px"
                border="none"
                cursor="pointer"
                zIndex="2"
              >
                <Box>
                  <Input
                    id="bannerInput"
                    display={"none"}
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(event) =>
                      handleBannerUpload(event, homeFiveBanner)
                    }
                    name="banner"
                  />
                  <label htmlFor="bannerInput">
                    <Center>
                      <Box
                        p={"8px 15px"}
                        borderRadius={"5px"}
                        cursor="pointer"
                        position="relative"
                        color={"white"}
                        bgColor={"blue"}
                        _hover={{ bgColor: "blue.600" }}
                      >
                        <Text>Update</Text>
                      </Box>
                    </Center>
                  </label>
                </Box>
              </Flex>
            </Box>
          </Box>
          
        </Flex>
        <Divider />
        <Box
          bgColor={"white"}
          h={"300px"}
          pb={"20px"}
          bgImage={`url(${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/image?name=${banners?.third?.[0]})`}
          bgSize="contain"
          bgPosition="center"
          bgRepeat="no-repeat"
          onMouseEnter={() =>
            handleMouseEnter(banners?.third?.[0], homeThreeBanner, "third")
          }
          onMouseLeave={() => handleMouseLeave("third")}
          position="relative"
        >
          <Box
            opacity={isHovered.third ? 0.5 : 0} // Set opacity based on hover state
            transition="opacity 0.3s ease-in-out" // Add transition effect
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bg="black"
            zIndex="1"
          />
          <Flex
            gap={"10px"}
            opacity={isHovered.third ? 1 : 0} // Set opacity based on hover state
            transition="opacity 0.3s ease-in-out" // Add transition effect
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            padding="10px 20px"
            border="none"
            cursor="pointer"
            zIndex="2"
          >
            <Box>
              <Input
                id="bannerInput"
                display={"none"}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={(event) => handleBannerUpload(event, homeThreeBanner)}
                name="banner"
              />
              <label htmlFor="bannerInput">
                <Center>
                  <Box
                    p={"8px 15px"}
                    borderRadius={"5px"}
                    cursor="pointer"
                    position="relative"
                    color={"white"}
                    bgColor={"blue"}
                    _hover={{ bgColor: "blue.600" }}
                  >
                    <Text>Update</Text>
                  </Box>
                </Center>
              </label>
            </Box>
          </Flex>
        </Box>
        <Divider />
        <Flex
          gap={"5px"}
          mt={"20px"}
          justifyContent={"space-between"}
          direction={["column", "column", "row", "row"]}
        >
          <Box w={["100%", "100%", "59%", "59%"]}>
            <Text
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mb={"15px"}
              bgColor={color}
              color={"white"}
            >
              CASUAL
            </Text>
          </Box>
          <Box w={["100%", "100%", "40%", "40%"]}>
            <Flex justifyContent={"space-between"}>
              <Box w={"48%"}>
                <Text
                  fontSize={["15px", "20px", "25px", "30px"]}
                  fontWeight={"bold"}
                  mb={"15px"}
                  bgColor={color}
                  color={"white"}
                >
                  WEDDING
                </Text>
              </Box>
              <Box w={"48%"}>
                <Text
                  fontSize={["15px", "20px", "25px", "30px"]}
                  fontWeight={"bold"}
                  mb={"15px"}
                  bgColor={color}
                  color={"white"}
                >
                  GIFT
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Divider />
        <Flex
          gap={"5px"}
          justifyContent={"space-between"}
          direction={["column-reverse", "column-reverse", "row", "row"]}
        >
          <Box mt={"15px"} w={["100%", "100%", "59%", "59%"]}>
            <Text
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mb={"15px"}
              bgColor={color}
              color={"white"}
            >
              REASON TO CHOOSE US
            </Text>
            <Box
              bgColor={"white"}
              h={"300px"}
              pb={"20px"}
              bgImage={`url(${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/image?name=${banners?.fourth?.[0]})`}
              bgSize="contain"
              bgPosition="center"
              bgRepeat="no-repeat"
              onMouseEnter={() =>
                handleMouseEnter(banners?.fourth?.[0], homeFourBanner, "fourth")
              }
              onMouseLeave={() => handleMouseLeave("fourth")}
              position="relative"
            >
              <Box
                opacity={isHovered.fourth ? 0.5 : 0} // Set opacity based on hover state
                transition="opacity 0.3s ease-in-out" // Add transition effect
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bg="black"
                zIndex="1"
              />
              <Flex
                gap={"10px"}
                opacity={isHovered.fourth ? 1 : 0} // Set opacity based on hover state
                transition="opacity 0.3s ease-in-out" // Add transition effect
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                padding="10px 20px"
                border="none"
                cursor="pointer"
                zIndex="2"
              >
                <Box>
                  <Input
                    id="bannerInput"
                    display={"none"}
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(event) =>
                      handleBannerUpload(event, homeFourBanner)
                    }
                    name="banner"
                  />
                  <label htmlFor="bannerInput">
                    <Center>
                      <Box
                        p={"8px 15px"}
                        borderRadius={"5px"}
                        cursor="pointer"
                        position="relative"
                        color={"white"}
                        bgColor={"blue"}
                        _hover={{ bgColor: "blue.600" }}
                      >
                        <Text>Update</Text>
                      </Box>
                    </Center>
                  </label>
                </Box>
              </Flex>
            </Box>
            <Text
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mb={"15px"}
              bgColor={color}
              color={"white"}
            >
              Thanks for giving us feedback online
            </Text>
          </Box>
          <Box w={["100%", "100%", "40%", "40%"]} mt={"15px"}>
            <Text
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mb={"15px"}
              bgColor={color}
              color={"white"}
            >
              COMBO
            </Text>
          </Box>
        </Flex>
      </Dashboard>
    </Box>
  );
};

export default UserHome;