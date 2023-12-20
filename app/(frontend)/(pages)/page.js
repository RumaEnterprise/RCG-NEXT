"use client";
import {
  Box,
  Center,
  Flex,
  Image,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import CustomSlider from "../Components/CustomSlider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import fbb1 from "../Resources/fbb1.jpg";
import range from "../Resources/pricerange.jpg";
import banner3 from "../Resources/banner3.jpg";
import quality_banner from "../Resources/quality_banner.jpg";
import new_product_gif from "../Resources/new_product.gif";
import Review from "../Components/Review";
import axios from "axios";
import HomeCard from "../Components/HomeCard";

import { useDispatch, useSelector } from "react-redux";
import { allLatestProduct } from "../Redux/AppReducer/Action";
import SingleHomeCard from "../Components/SingleHomeCard";
import {
  homeFiveBanner,
  homeFourBanner,
  homeThreeBanner,
  homeTopBanner,
  homeTwoBanner,
} from "../universal_variable";
import Loading from "../Components/Loading";
import Link from "next/link";
import New_gif from "./New_gif";

const Home = () => {
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [scrollToTop, setScrollToTop] = useState(true);
  const [load, setLoad] = useState(false);
  const [classic, setClassic] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [banners, setBanners] = useState({});
  const [wooden, setWooden] = useState([]);
  const color = "#59c3f3";
  const latestProduct = useSelector((store) => store.app.allLatestProducts);
  const getData = ({ tag, items }) => {
    try {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/random?&tag=${tag}&items=${items}`
        )
        .then((res) => {
          dispatch(allLatestProduct(res.data.data));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  };
  useEffect(() => {
    setLoad(true);
    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getpremium`)
        .then((res) => {
          res.data.map((el) => {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/single/${el.skuID}`,
                {
                  headers: {
                    "X-Frontend-CLICK": false,
                    "X-Frontend-URL": window.location.pathname,
                  },
                }
              )
              .then((result) => {
                setWooden((prev) => [...prev, result.data.data]);
                setLoad(false);
              })
              .catch((err) => {
                console.log(err);
              });
          });
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/banner`)
        .then((response) => {
          let data = response.data;
          data = data.map((ele) => {
            let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/image?name=${ele}`;
            return url;
          });
          const first = data
            .filter((name) => name.includes(homeTopBanner))
            .map((name) => {
              return { image: name };
            });
          const second = data.filter((name) => name.includes(homeTwoBanner));
          const third = data.filter((name) => name.includes(homeThreeBanner));
          const fourth = data.filter((name) => name.includes(homeFourBanner));
          const fifth = data.filter((name) => name.includes(homeFiveBanner));
          console.log(second)
          setBanners({ first, second, third, fourth, fifth });
        })
        .catch((error) => {
          console.error("Error fetching image data:", error);
        });
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feedback`)
        .then((res) => {
          setFeedback(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/random?category=classic&items=50`
        )
        .then((res) => {
          let array = res.data.data;
          let groupSize = 2;
          let groupedArray = [];
          while (array.length >= groupSize) {
            groupedArray.push(array.splice(0, 2));
          }
          setClassic(groupedArray);
        })
        .catch((err) => {
          console.log(err);
        });
      getData({ tag: "classicPlain", items: 2 });
      getData({ tag: "classicPrinted", items: 2 });
      getData({ tag: "Premium", items: 2 });
      getData({ tag: "ultraPremium", items: 2 });
      getData({ tag: "sqfs", items: 2 });
      getData({ tag: "scps", items: 2 });
      getData({ tag: "indianCan", items: 2 });
      getData({ tag: "CateringPlain", items: 2 });
      getData({ tag: "CateringPrinted", items: 2 });
    } catch (error) {
      console.log(error);
    }
  }, []);
  const toggleScrollDirection = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      const currentScrollTop = container.scrollTop;
      const targetScrollTop = scrollToTop ? maxScrollTop : 0;
      const distance = Math.abs(currentScrollTop - targetScrollTop);
      const duration = 1000; // Adjust this value to control the scrolling speed

      const startTime = performance.now();
      const endTime = startTime + duration;

      function scroll() {
        const now = performance.now();
        if (now >= endTime) {
          container.scrollTop = targetScrollTop;
          setScrollToTop(!scrollToTop); // Toggle the scroll direction
          return;
        }

        const progress = (now - startTime) / duration;
        const ease = easeOutQuart(progress); // You can use different easing functions
        container.scrollTop =
          currentScrollTop + ease * (targetScrollTop - currentScrollTop);

        requestAnimationFrame(scroll);
      }

      scroll();
    }
  };

  function easeOutQuart(t) {
    return 1 - --t * t * t * t;
  }
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    pauseOnHover: false,
  };

  var settings1 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024, // For screens larger than or equal to 1024px
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // For screens larger than or equal to 768px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // For screens larger than or equal to 480px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 330, // For screens larger than or equal to 480px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  var settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024, // For screens larger than or equal to 1024px
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // For screens larger than or equal to 768px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // For screens larger than or equal to 480px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 330, // For screens larger than or equal to 480px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  if (load) {
    return <Loading load={load} />;
  }
  return (
    <Box bgColor={"#F7F7F7"} h={["5600px", "5700px", "4300px", "3550px"]}>
      <Box
        m={["0px 20px", "0px 20px", "0px 40px", "0px 100px"]}
        h={"800px"}
        fontFamily={"Karla,HelveticaNeue,Helvetica Neue,sans-serif"}
      >
        <Box h={["100px", "150px", "250px", "300px"]} overflow={"hidden"}>
          <CustomSlider
            banner={true}
            data={banners?.first}
            settings={settings}
          />
        </Box>
        <Box>
          <Text
            as={"h1"}
            fontSize={["15px", "20px", "25px", "30px"]}
            fontWeight={"bold"}
            mt={"15px"}
            bgColor={color}
            color={"white"}
            textAlign={"center"}
          >
            ULTRA PREMIUM GIFT SET
          </Text>
        </Box>
        <Box mt={"20px"} h={["auto", "auto", "auto", "300px"]}>
          <SimpleGrid
            gap={"10px"}
            justifyContent={"space-around"}
            columns={[2, 2, 3, 5]}
          >
            {wooden.map((ele, i) => {
              return (
                <SingleHomeCard
                  key={i}
                  buyFont="17px"
                  ele={ele}
                  hover={true}
                  buynow={true}
                  price={true}
                  title={true}
                  sale={false}
                  imgHeight={"190px"}
                />
              );
            })}
          </SimpleGrid>
        </Box>
        <Flex
          mt={"20px"}
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
              textAlign={"center"}
            >
              PREMIUM TIE WITH CUFFLINKS AND ROSE PIN
            </Text>
            <HomeCard
              cartFont="14px"
              scroll={true}
              settings={settings1}
              tag={"sqfs"}
              column={[2, 2, 3, 4]}
            />
          </Box>
          <Box w={["auto", "auto", "auto", "25%"]}>
            <Image
              loading="eager"
              title={"Banner2"}
              h={"350px"}
              w={"500px"}
              htmlWidth={"500px"}
              htmlHeight={"350px"}
              alt={"image"}
              src={banners?.second?.[0]}
            />
          </Box>
        </Flex>

        <Flex
          mt={"20px"}
          direction={["column", "column", "row", "row"]}
          justifyContent={"space-between"}
          gap={"10px"}
        >
          <Box w={["100%", "100%", "75%", "75%"]}>
            <Text
              mb={"15px"}
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mt={"18px"}
              bgColor={color}
              color={"white"}
              textAlign={"center"}
            >
              CLASSIC TIES FOR OFFICE AND PARTY
            </Text>
            <Slider {...settings2}>
              {classic?.map((data, i) => {
                return (
                  <SimpleGrid gap={"10px"} columns={[2, 2, 3, 4]} key={i}>
                    {data?.map((ele, i) => {
                      return (
                        <Flex mb={"10px"} key={i}>
                          <SingleHomeCard cartFont="18px" ele={ele} i={i} />
                          <Box w={"15px"} bgColor={"#F7F7F7"}>
                            {" "}
                          </Box>
                        </Flex>
                      );
                    })}
                  </SimpleGrid>
                );
              })}
            </Slider>
          </Box>
          <Box w={["100%", "100%", "25%", "25%"]}>
            <Text
              mb={"15px"}
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mt={"18px"}
              bgColor={color}
              color={"white"}
            >
              LATEST PRODUCTS
            </Text>
            <Flex direction={"column"}>
              <Box
                overflow={"scroll"}
                h={"330px"}
                overflowX={"hidden"}
                ref={scrollContainerRef}
                sx={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {latestProduct?.map((ele, i) => {
                  const url = `/allProducts/single/${ele.skuID}`;
                  return (
                    <Link href={url} cursor={"pointer"} key={i}>
                      <Flex
                        mb={"10px"}
                        gap={"8px"}
                        key={i}
                        bgColor={"white"}
                        _hover={{ bgColor: "#F0F0F0" }}
                      >
                        <Image
                          loading="eager"
                          title={ele.skuID}
                          htmlWidth={"auto"}
                          htmlHeight={"50px"}
                          h={"50px"}
                          alt={i}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${ele.skuID}-1.jpg`}
                        />
                        <Flex direction={"column"}>
                          <Text align={"left"}>
                            {ele?.title?.split("").splice(0, 27).join("") +
                              "..."}
                          </Text>
                          <Flex mt={"-8px"}>
                            <Box
                              mt={"3px"}
                              fontSize={"15px"}
                              fontWeight={"bold"}
                            >
                              <Text float={"left"} color={"green"}>
                                ₹
                                {(
                                  ele?.price -
                                  ele?.price * (ele?.discount?.toFixed(0) / 100)
                                ).toFixed(0)}
                              </Text>
                              <Text
                                ml={"3px"}
                                color={"red"}
                                float={"left"}
                                mr={"3px"}
                                textDecorationLine={"line-through"}
                              >
                                ₹{ele?.price}
                              </Text>
                            </Box>
                            <Center>
                              <New_gif index={i} image={new_product_gif} />
                            </Center>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Link>
                  );
                })}
              </Box>
              <Box
                p={"8px 0px"}
                bgColor={"teal"}
                color={"white"}
                onClick={toggleScrollDirection}
                cursor={"pointer"}
              >
                <Text textAlign={"center"}>
                  Scroll {scrollToTop ? "to Bottom" : "to Top"}
                </Text>
              </Box>
            </Flex>
            <Center>
              <Box
                mt={"10px"}
                bgImage={`url(${banners?.fifth?.[0]})`}
                bgSize="contain" // You can adjust the background size as needed
                bgPosition="center" // You can adjust the background position as needed
                w={"100%"} // You can adjust the width as needed
                bgRepeat="no-repeat"
              >
                <Flex
                  h={"200px"}
                  m={["0px 30px", "0px 25px", "0px 18px", "0px 10px"]}
                  justifyContent={"space-around"}
                >
                  <Box
                    cursor={"pointer"}
                    w={"32%"}
                    onClick={() =>
                      window.open(`/allProducts?minPrice=199&maxPrice=299`)
                    }
                  ></Box>
                  <Box
                    cursor={"pointer"}
                    w={"32%"}
                    onClick={() =>
                      window.open(`/allProducts?minPrice=300&maxPrice=499`)
                    }
                  ></Box>
                  <Box
                    cursor={"pointer"}
                    w={"32%"}
                    onClick={() =>
                      window.open(`/allProducts?minPrice=500&maxPrice=699`)
                    }
                  ></Box>
                </Flex>
              </Box>
            </Center>
          </Box>
        </Flex>
        <Image
          loading="eager"
          title={"Banner3"}
          mt={"15px"}
          src={banners?.third?.[0]}
          alt={"banner"}
          htmlWidth={"auto"}
          htmlHeight={"auto"}
        />
        <Box>
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
                textAlign={"center"}
              >
                CASUAL
              </Text>
              <HomeCard
                hover={false}
                cartFont="14px"
                category={"casual"}
                items={"6"}
                column={[2, 2, 2, 3]}
              />
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
                    textAlign={"center"}
                  >
                    WEDDING
                  </Text>
                  <HomeCard
                    view={true}
                    cartFont="15px"
                    p={"0px 6px 0px 0px"}
                    category={"wedding"}
                    sale={false}
                    items={"10"}
                    column={"2"}
                    height={"114px"}
                    imgHeight={"100px"}
                    title={false}
                    price={false}
                  />
                </Box>
                <Box w={"48%"}>
                  <Text
                    fontSize={["15px", "20px", "25px", "30px"]}
                    fontWeight={"bold"}
                    mb={"15px"}
                    bgColor={color}
                    color={"white"}
                    textAlign={"center"}
                  >
                    GIFT
                  </Text>
                  <HomeCard
                    view={true}
                    cartFont="15px"
                    p={"0px 6px 0px 0px"}
                    category={"gift"}
                    sale={false}
                    items={"10"}
                    column={"2"}
                    height={"114px"}
                    imgHeight={"100px"}
                    title={false}
                    price={false}
                  />
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
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
              textAlign={"center"}
            >
              REASON TO CHOOSE US
            </Text>
            <Image
              loading="eager"
              title={"Banner4"}
              src={banners?.fourth?.[0]}
              h={"auto"}
              maxWidth={"100%"}
              alt={"banner2"}
              htmlWidth={"auto"}
              htmlHeight={"auto"}
            />
            <Text
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mb={"15px"}
              bgColor={color}
              color={"white"}
              textAlign={"center"}
            >
              Thanks for giving us feedback online
            </Text>
            <SimpleGrid
              columns={[1, 2, 3]}
              sx={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              overflow={"scroll"}
              gap={"10px"}
            >
              {feedback?.map((ele, i) => {
                return (
                  <Box key={i}>
                    <Review
                      name={ele.name}
                      rate={ele.rate}
                      date={ele.date}
                      feedback={ele.feedback}
                    />
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
          <Box w={["100%", "100%", "40%", "40%"]} mt={"15px"}>
            <Text
              fontSize={["15px", "20px", "25px", "30px"]}
              fontWeight={"bold"}
              mb={"15px"}
              bgColor={color}
              color={"white"}
              textAlign={"center"}
            >
              COMBO
            </Text>
            <HomeCard
              cartFont="14px"
              category={"combo"}
              items={"6"}
              column={"2"}
              height={"185px"}
              imgHeight={"110px"}
              price={false}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Home;
