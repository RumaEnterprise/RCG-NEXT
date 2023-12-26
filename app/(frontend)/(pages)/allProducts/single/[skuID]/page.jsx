"use client";
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Center,
  useToast,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Input,
  Textarea,
} from "@chakra-ui/react";
import dislike from "../../../../Resources/dislike.png";
import like from "../../../../Resources/like.png";
import { MdShare } from "react-icons/md";
import { LiaFacebookF } from "react-icons/lia";
import { FaTelegramPlane } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import fillWish from "../../../../Resources/fillWish.png";
import emptyWish from "../../../../Resources/emptyWish.png";
import star from "../../../../Resources/star.png";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import { ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { FacebookShareButton } from "react-share";
import {
  allProduct,
  buyNow,
  getWish,
  loginState,
  updateLikesDislikes,
} from "../../../../Redux/AppReducer/Action";
import CustomSlider from "../../../../Components/CustomSlider";
import Loading from "../../../../Components/Loading";
import { ImageMagnifier } from "../../../../Components/Magnifier";
import ReviewCard from "../../../../Components/ReviewCard";
import { FaStar } from "react-icons/fa";
import { shortenNumber } from "../../../../Components/number_shortener";
import { getQuote, option } from "../../../../Components/Ship";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
const SingleProduct = () => {
  const user = useSelector((store) => store.auth.user);
  const [premium, setPremium] = useState([]);
  const [gifts, setGift] = useState([]);
  const [randomProd, setRandomProd] = useState({});
  const [product, setProduct] = useState({});
  const [load, setLoad] = useState(false);
  const wish = useSelector((store) => store.app.wish);
  const token = useSelector((store) => store.auth.token);
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [number, setNumber] = useState(0);
  const [images, setImages] = useState([]);
  const [courier, setCourier] = useState({
    dateDifference: 999,
    date: "",
    ship: 999,
    cod: 999,
  });
  const [share, setShare] = useState(false);
  const [pause, setPause] = useState(false);
  const pin = useRef();
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
  const mousenter = () => {
    setPause(true);
  };
  const mouseleave = () => {
    setPause(false);
  };
  const flexStyles = {
    ml: "-10px",
    fontSize: "30px",
    gap: "10px",
    maxHeight: !share ? "0px" : "200px", // Set a specific value for the hidden state (e.g., 200px)
    overflow: "hidden",
    transition: "max-height 0.5s ease",
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    adaptiveHeight: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const handleShare = (data) => {
    if (data === "facebook") {
      window.FB.ui(
        {
          method: "share",
          href: window.location.href,
        },
        function (response) {
          // Handle the share response if needed
          console.log(response);
        }
      );
    } else {
      const gen_url = generateShareLink(data);
      var fakeLink = document.createElement("a");
      fakeLink.setAttribute("href", gen_url);
      fakeLink.setAttribute("data-action", "share/whatsapp/share");
      fakeLink.click();
    }

    // window.open(gen_url, "_blank");
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
      navigate(`/cart/${skuID}`);
    }
  };
  const handleCart = (second = false) => {
    const payload = {
      title: product.title,
      price: product.price,
      skuID: product.skuID,
      discount: product.discount,
      quantity: quantity,
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
          if (second) {
            const sload = {
              title: randomProd.title,
              price: randomProd.price,
              skuID: randomProd.skuID,
              discount: randomProd.discount,
              quantity: 1,
            };
            axios
              .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/create`, sload, {
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
  const generateShareLink = (platform) => {
    const url = window.location.href;
    const message = `Check out our ${product.title} at ${url}`;
    const base64Image =
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"; // Replace this with your Base64 image
    const encodedBase64Image = encodeURIComponent(base64Image);
    // const fbShareUrl = `https://www.facebook.com/dialog/share?app_id=${encodeURIComponent(
    //   fbAppID
    // )}&href=${encodeURIComponent(url)}${
    //   quote ? `&quote=${encodeURIComponent(quote)}` : ""
    // }`;
    switch (platform) {
      case "whatsapp":
        return `https://api.whatsapp.com/send?text=${encodeURIComponent(
          message
        )}`;
      case "telegram":
        return `https://t.me/share/url?url=${encodeURIComponent(
          window.location.href
        )}&text=${encodeURIComponent(message)}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href
        )}&quote=${encodeURIComponent(message)}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          window.location.href
        )}&text=${encodeURIComponent(message)}`;
      default:
        return "";
    }
  };
  const handleWishUpdate = () => {
    if (token === "") {
      dispatch(loginState(toast));
    } else {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wish/create`, product, {
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
          dispatch(getWish(token));
        });
    }
  };
  const handleData = useCallback(async () => {
    const storedIP = localStorage.getItem("systemIP");
    let click = false;
    if (
      storedIP == null &&
      (user.administration == "" || user.administration == undefined)
    ) {
      let ip = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/getPublicIP`
      );
      click = true;
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      const ipData = {
        ip: ip.data.publicIP,
        expiration: expirationTime,
      };
      localStorage.setItem("systemIP", JSON.stringify(ipData));
    }
    setLoad(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/single/${skuID}`, {
        headers: {
          "X-Frontend-CLICK": `${click}`,
          "X-Frontend-URL": window.location.pathname,
        },
      })
      .then((res) => {
        setProduct(res.data.data);
        setLoad(false);
        setRandomProd(res.data.random);
        setImages(res.data.images);
        setPremium(res.data.premium);
        setGift(res.data.gift);
      });
  });
  const handleSubmitRating = () => {
    if (rating <= 0) {
      toast({
        title: "Give us rating to submit",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (review?.current?.value == "") {
      toast({
        title: "Give us feedback to submit",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const payload = {
      rate: rating,
      title: title.current.value,
      review: review.current.value,
      username: user.name,
    };
    try {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/review/${product?._id}`,
          payload,
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
            duration: 2000,
            isClosable: true,
          });
          setRating(0);
          onReviewClose();
          title.current.value = "";
          review.current.value = "";
        })
        .catch((err) => {
          onReviewClose();
          toast({
            title: err.response.data.msg,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
    } catch (error) {}
  };

  const handleZipCheck = () => {
    if (pin.current.value.length >= 6) {
      const zip = Number(pin.current.value);
      try {
        axios
          .get(`https://geocodes.envia.com/zipcode/IN/${zip}`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENVIA_KEY}`,
            },
          })
          .then(async (res) => {
            if (res.data.length >= 1) {
              const data = await getQuote(zip, finalPrice, option);
              setCourier(data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast({
        title: "Enter Proper Pincode",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const handleLikes = (skuID, type) => {
    let pos = -1;
    const data = JSON.parse(localStorage.getItem("rareLikesDislikes")) || [];
    data.filter((ele, i) => {
      if (ele.skuID == skuID && ele.type == type) {
        pos = i;
      }
    });
    if (pos == -1) {
      data.push({ skuID: skuID, type: type });
      let payload = {};
      payload.skuID = skuID;
      let temp = { ...product };
      temp[type] = temp[type] + 1;
      setProduct(temp);
      payload[type] = type == "like" ? product?.like + 1 : product?.dislike + 1;
      dispatch(updateLikesDislikes(payload));
    } else {
      data.splice(pos, 1);
      let payload = {};
      payload.skuID = skuID;
      let temp = { ...product };
      temp[type] = temp[type] - 1;
      setProduct(temp);
      payload[type] = type == "like" ? product?.like - 1 : product?.dislike - 1;
      dispatch(updateLikesDislikes(payload));
    }
    localStorage.setItem("rareLikesDislikes", JSON.stringify(data));
  };
  const handleReview = () => {
    if (token == "") {
      dispatch(loginState(toast));
    } else {
      onReviewOpen();
    }
  };
  let { skuID } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    handleData();
  }, [skuID]);

  useEffect(() => {
    let interval;

    if (!pause) {
      interval = setInterval(() => {
        setNumber((prevValue) => (prevValue + 1) % images.length || 0);
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [pause]);
  const finalPrice = Number(
    Number(product.price) -
      Number(product.price) * (Number(product.discount) / 100)
  ).toFixed(0);
  const navigate = useRouter();
  const [rating, setRating] = useState(0);
  const title = useRef();
  const review = useRef();
  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();
  if (load) {
    return <Loading load={load} />;
  }
  return (
    <Box mt={"50px"} ml={"7px"} textAlign={"left"}>
      <Modal isCentered isOpen={isReviewOpen} onClose={onReviewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Your Thoughts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Select Rating</Text>
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <Box
                  mr={"5px"}
                  key={starValue}
                  as="button"
                  onClick={() => setRating(starValue)}
                  color={starValue <= rating ? "orange.400" : "gray.300"}
                  fontSize="25px"
                  cursor="pointer"
                >
                  <StarIcon />
                </Box>
              );
            })}
            <Input mt={"10px"} ref={title} placeholder="Title" required />
            <Textarea
              ref={review}
              mt={"10px"}
              resize={"none"}
              placeholder="Type Your Review"
            />
            <Button
              mt={"10px"}
              colorScheme="green"
              onClick={() => handleSubmitRating()}
            >
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex
        direction={["column", "column", "row", "row"]}
        gap={"20px"}
        mb={"30px"}
      >
        <Flex
          position={window.innerWidth <= 760 ? "" : "sticky"}
          top={40}
          left={0}
          mb={"30px"}
          h={[
            "350px",
            "350px",
            window.innerHeight - 200,
            window.innerHeight - 200,
          ]}
          direction={"row"}
          gap={"10px"}
        >
          <Flex
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
            justifyContent={"space-between"}
            direction={"column"}
            // overflow={"scroll"}
            // overflowX={"hidden"}
            // overflowY={"hidden"}
            gap={"20px"}
            mr={"10px"}
            h={`${87.5 * images.length}px`}
            border={"1px solid black"}
            // h={["auto", "auto", "50vh", "68vh"]}
            p={"7px"}
            borderRadius={"10px"}
          >
            {images?.map((el, i) => {
              return (
                <Box key={i} onClick={() => setNumber(i)} cursor={"pointer"}>
                  <Image
                    alt={i + 1}
                    title={i + 1}
                    htmlHeight={"50px"}
                    htmlWidth={"50px"}
                    loading="eager"
                    // border={"1px solid black"}
                    w={"50px"}
                    h={"50px"}
                    src={el.data}
                  />
                  <Box pt={"15px"} border={"0px solid black"}>
                    {i < images.length - 1 ? <Divider /> : null}
                  </Box>
                </Box>
              );
            })}
          </Flex>
          <Flex
            w={"100%"}
            h={["auto", "auto", "500px", "600px"]}
            direction={"column"}
            justifyContent={"center"}
          >
            <Flex
              justifyContent={"center"}
              transition={"ease-out"}
              mt={"-50px"}
            >
              <Box onMouseEnter={mousenter} onMouseLeave={mouseleave}>
                <ImageMagnifier
                  skuID={skuID}
                  src={images[number]?.data}
                  height={["270px", "200px", "300px", "500px"]}
                  width={["270px", "200px", "300px", "500px"]}
                />
              </Box>
              <Flex direction={"column"} gap={"15px"}>
                <Box w={"20px"} onClick={handleWishUpdate} cursor={"pointer"}>
                  {wish?.some((el) => el.skuID === skuID) ? (
                    <Image
                      alt={"emptyWish"}
                      title={"emptyWish"}
                      htmlHeight={"20px"}
                      htmlWidth={"auto"}
                      loading="eager"
                      h={"20px"}
                      src={emptyWish.src}
                    />
                  ) : (
                    <Image
                      alt={"fillWish"}
                      title={"fillWish"}
                      htmlHeight={"20px"}
                      htmlWidth={"auto"}
                      loading="eager"
                      h={"20px"}
                      src={fillWish.src}
                    />
                  )}
                </Box>
                <Box cursor={"pointer"}>
                  <Flex direction={"column"}>
                    <Center>
                      <Image
                        alt={"like"}
                        title={"like"}
                        htmlHeight={"17px"}
                        htmlWidth={"17px"}
                        loading="eager"
                        h={"17px"}
                        w={"17px"}
                        src={like.src}
                        onClick={() => handleLikes(skuID, "like")}
                      />
                    </Center>
                    <Center>
                      <Text fontSize={"13px"}>
                        {shortenNumber(product?.like || 0)}
                      </Text>
                    </Center>
                  </Flex>
                </Box>
                <Box cursor={"pointer"}>
                  <Flex direction={"column"}>
                    <Center>
                      <Image
                        alt={"dislike"}
                        title={"dislike"}
                        htmlHeight={"17px"}
                        htmlWidth={"17px"}
                        loading="eager"
                        h={"17px"}
                        w={"17px"}
                        src={dislike.src}
                        onClick={() => handleLikes(skuID, "dislike")}
                      />
                    </Center>
                    <Center>
                      <Text fontSize={"13px"}>
                        {shortenNumber(product?.dislike || 0)}
                      </Text>
                    </Center>
                  </Flex>
                </Box>
                <Box
                  fontSize={"25px"}
                  onClick={() => setShare(!share)}
                  cursor={"pointer"}
                >
                  <MdShare />
                </Box>
                <Flex direction={"column"} style={flexStyles}>
                  <Tooltip label="Whatsapp">
                    <Box
                      color={"#00be21"}
                      cursor={"pointer"}
                      onClick={() => handleShare("whatsapp")}
                    >
                      <RiWhatsappFill />
                    </Box>
                  </Tooltip>
                  <Tooltip label="Facebook">
                    <Box cursor={"pointer"} color={"#3b5999"}>
                      <FacebookShareButton
                        url={`https://www.rarecombee.com/allProducts/single/${skuID}`}
                        quote={"Rarecombee"}
                        hashtag="#rarecombee"
                      >
                        <LiaFacebookF />
                      </FacebookShareButton>
                    </Box>
                  </Tooltip>
                  <Tooltip label="Twitter">
                    <Box
                      cursor={"pointer"}
                      onClick={() => handleShare("twitter")}
                    >
                      <svg
                        viewBox="0 0 27 27"
                        aria-hidden="true"
                        class="r-k200y r-18jsvk2 r-4qtqp9 r-yyyyoo r-5sfk15 r-dnmrzs r-kzbkwu r-bnwqim r-1plcrui r-lrvibr"
                      >
                        <g>
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </g>
                      </svg>
                    </Box>
                  </Tooltip>
                  <Tooltip label="Telegram">
                    <Box
                      color={"#0088cc"}
                      cursor={"pointer"}
                      onClick={() => handleShare("telegram")}
                    >
                      <FaTelegramPlane />
                    </Box>
                  </Tooltip>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              justifyContent={"space-between"}
              gap={"5px"}
              h={"50px"}
              mr={"10px"}
            >
              <Button
                isDisabled={product.quantity <= 0}
                w={["100%", "100%", "100%", "50%"]}
                fontSize={["15px", "15px", "15px", "16px"]}
                padding="0px 10px 0px 10px"
                variant={"unstyled"}
                bgColor={"#ffa500"}
                h={"50px"}
                _hover={{ bgColor: "black" }}
                color={"white"}
                onClick={handleCart}
              >
                ADD TO CART
              </Button>
              <Button
                isDisabled={product.quantity <= 0}
                w={["100%", "100%", "100%", "50%"]}
                h={"50px"}
                fontSize={["15px", "15px", "15px", "16px"]}
                padding="0px 10px 0px 10px"
                variant={"unstyled"}
                bgColor={"blue.400"}
                _hover={{ bgColor: "black" }}
                color={"white"}
                onClick={() =>
                  handleShop(
                    product.skuID,
                    product.title,
                    product.price,
                    product.discount,
                    product.quantity
                  )
                }
              >
                BUY NOW
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Box
          border={"0px solid gray"}
          w={["full", "full", "54%", "54%"]}
          pl={"5px"}
        >
          <Breadcrumb
            spacing="2px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href={`/allProducts?category=${product.category}`}>
                {product.category}
              </Link>
            </BreadcrumbItem>
          </Breadcrumb>
          <Flex
            justifyContent={"space-between"}
            fontWeight={"semibold"}
            gap={"5px"}
            direction={["column", "column", "row", "row"]}
          >
            <Text
              fontSize={["15px", "15px", "20px", "25px"]}
              w={["100%", "100%", "70%", "70%"]}
            >
              {product.title}
            </Text>
            <Flex fontSize={"13px"}>
              <Text>SKU :</Text>
              <Text color={"gray"} fontSize={"13px"}>
                {product.skuID}
              </Text>
            </Flex>
          </Flex>
          <Flex
            mt={"5px"}
            gap={"9px"}
            direction={["row", "row", "column", "column"]}
          >
            <Flex gap={"7px"}>
              <Center>
                <Text
                  fontSize={["18px", "18px", "22px", "28px"]}
                  textAlign={"left"}
                  fontWeight={"bold"}
                >
                  Rs.
                  {Number(finalPrice)?.toFixed(2)}
                </Text>
              </Center>
              <Center>
                <Text
                  color={"gray"}
                  textDecorationLine={"line-through"}
                  fontSize={["13px", "13px", "15px", "16px"]}
                  textAlign={"left"}
                  fontWeight={"bold"}
                >
                  Rs.{Number(product.price).toFixed(2)}
                </Text>
              </Center>
              <Center>
                <Text
                  color={"green"}
                  mt={"2px"}
                  fontWeight={"semibold"}
                  fontSize={["13px", "13px", "14px", "15px"]}
                >
                  {floatModify(product?.discount)}% off
                </Text>
              </Center>
            </Flex>
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
                  alt={"star"}
                  title={"star"}
                  htmlHeight={"15px"}
                  htmlWidth={"auto"}
                  loading="eager"
                  h={"15px"}
                  src={star.src}
                />
              </Flex>
            </Box>
            <Flex gap={"5px"}>
              <Center>
                <Text
                  borderRadius={"5px"}
                  fontWeight={"bold"}
                  fontSize={["12px", "15px", "18px", "20px"]}
                  hidden={window.innerWidth <= 818}
                >
                  Select Size
                </Text>
              </Center>
              <Text
                borderRadius={"5px"}
                bgColor={"red"}
                color={"white"}
                p={"5px"}
                fontSize={"12px"}
                fontWeight={"bold"}
              >
                Free Size
              </Text>
            </Flex>
          </Flex>

          <Flex mt={"10px"} mb={"10px"} gap={"10px"}>
            <Text
              borderRadius={"5px"}
              w={product.quantity >= 1 ? "80px" : "110px"}
              bgColor={product.quantity >= 1 ? "green" : "red"}
              color={"white"}
              p={"5px 10px"}
            >
              {product.quantity >= 1 ? "In Stock" : "Out of stock"}
            </Text>
            <Center hidden={product.quantity > 10 || product.quantity <= 0}>
              <Text letterSpacing={"1px"} fontWeight={"600"} color={"red"}>
                Hurry! Only {product.quantity} left
              </Text>
            </Center>
          </Flex>
          <Flex
            gap={"10px"}
            fontWeight={"600"}
            mt={"5px"}
            mb={"10px"}
            hidden={product.quantity > 10 || product.quantity <= 0}
          >
            <Button
              border={"1px solid gray"}
              isDisabled={quantity === 1}
              onClick={() => setQuantity(quantity - 1)}
            >
              -
            </Button>
            <Text fontSize={"20px"} pl={"5px"} pr={"5px"} mt={"5px"}>
              {quantity}
            </Text>
            <Button
              border={"1px solid gray"}
              onClick={() => setQuantity(quantity + 1)}
              isDisabled={quantity === product.quantity}
            >
              +
            </Button>
          </Flex>
          <Flex gap={"10px"} mb={"10px"}>
            <Center>
              <Text color={"gray"}>Delivery</Text>
            </Center>
            <Input
              ref={pin}
              type="number"
              variant={"flushed"}
              maxW={"150px"}
              placeholder="Enter Pin"
            />
            <Button colorScheme="green" onClick={handleZipCheck}>
              Check
            </Button>
          </Flex>
          <Box hidden={courier?.date == ""}>
            <Text>Faster delivery by 11 PM {courier?.date}</Text>
          </Box>
          <Box border={"0px solid black"}>
            <Divider />
          </Box>
          <Box m={"20px 0px"}>
            <Text fontSize={"25px"} fontWeight={"600"}>
              Frequently Bought
            </Text>
            <Flex>
              <Box w={"49%"}>
                <Center>
                  <Image
                    alt={"image"}
                    title={"image"}
                    htmlHeight={["100px", "100px", "150px", "150px"]}
                    htmlWidth={"auto"}
                    loading="eager"
                    h={["100px", "100px", "150px", "150px"]}
                    src={images[0]?.data}
                  />
                </Center>
                <Text minH={"50px"}>
                  {window.innerWidth >= 600
                    ? product?.title
                    : `${product?.title?.split("").splice(0, 35).join("")}...`}
                </Text>
                <Flex mt={"7px"} gap={"7px"}>
                  <Text
                    fontSize={["11px", "13px", "15px", "20px"]}
                    textAlign={"left"}
                    fontWeight={"bold"}
                  >
                    Rs.
                    {Number(finalPrice)?.toFixed(2)}
                  </Text>
                  <Text
                    mt={"4px"}
                    color={"gray"}
                    textDecorationLine={"line-through"}
                    fontSize={["11px", "13px", "15px", "16px"]}
                    textAlign={"left"}
                    fontWeight={"bold"}
                  >
                    Rs.{Number(product.price).toFixed(2)}
                  </Text>
                  <Text
                    mt={"4px"}
                    color={"green"}
                    fontWeight={"semibold"}
                    fontSize={["11px", "13px", "14px", "15px"]}
                  >
                    {floatModify(product.discount)}% off
                  </Text>
                </Flex>
              </Box>
              <Box fontSize={"60px"} fontWeight={"semibold"}>
                <Center>
                  <Text>+</Text>
                </Center>
              </Box>
              <Box w={"49%"}>
                <Center>
                  <Link href={randomProd.url||""} target="_blank">
                    <Image
                      alt={randomProd.skuID}
                      title={randomProd.skuID}
                      htmlHeight={["100px", "100px", "150px", "150px"]}
                      htmlWidth={"auto"}
                      loading="eager"
                      h={["100px", "100px", "150px", "150px"]}
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${randomProd.skuID}-1.jpg`}
                    />
                  </Link>
                </Center>
                <Text minH={"50px"}>
                  {window.innerWidth >= 600
                    ? randomProd?.title
                    : `${randomProd?.title
                        ?.split("")
                        .splice(0, 35)
                        .join("")}...`}
                </Text>
                <Flex mt={"7px"} gap={"7px"}>
                  <Text
                    fontSize={["11px", "13px", "15px", "20px"]}
                    textAlign={"left"}
                    fontWeight={"bold"}
                  >
                    Rs.
                    {Number(
                      Number(randomProd.price) -
                        Number(randomProd.price) *
                          (Number(randomProd.discount) / 100)
                    ).toFixed(0) + ".00"}
                  </Text>
                  <Text
                    mt={"4px"}
                    color={"gray"}
                    textDecorationLine={"line-through"}
                    fontSize={["11px", "13px", "15px", "16px"]}
                    textAlign={"left"}
                    fontWeight={"bold"}
                  >
                    Rs.{Number(randomProd.price).toFixed(2)}
                  </Text>
                  <Text
                    mt={"4px"}
                    color={"green"}
                    fontWeight={"semibold"}
                    fontSize={["11px", "13px", "14px", "15px"]}
                  >
                    {floatModify(randomProd.discount)}% off
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Box>
          <Box border={"0px solid black"}>
            <Divider />
          </Box>
          <Flex
            fontWeight={"bold"}
            justifyContent={"space-between"}
            fontSize={["16px", "16px", "20px", "25px"]}
            mt={"10px"}
            mb={"10px"}
            direction={["column", "column", "column", "row"]}
          >
            <Center>
              <Flex gap={["5px", "5px", "10px", "20px"]}>
                <Center>
                  <Text>
                    Rs.
                    {Number(finalPrice).toFixed(2)}
                  </Text>
                </Center>
                <Box fontSize={"40px"} fontWeight={"semibold"}>
                  <Center>
                    <Text>+</Text>
                  </Center>
                </Box>
                <Center>
                  <Text>
                    Rs.
                    {Number(
                      Number(randomProd.price) -
                        Number(randomProd.price) *
                          (Number(randomProd.discount) / 100)
                    ).toFixed(0) + ".00"}
                  </Text>
                </Center>
                <Center>
                  <Text>=</Text>
                </Center>
                <Center>
                  <Text>
                    Rs.
                    {Number(
                      Number(finalPrice) +
                        Number(
                          Number(
                            Number(randomProd.price) -
                              Number(randomProd.price) *
                                (Number(randomProd.discount) / 100)
                          )
                        )
                    ).toFixed(0) + ".00"}
                  </Text>
                </Center>
              </Flex>
            </Center>
            <Center>
              <Button
                fontSize={["13px", "13px", "15px", "15px"]}
                onClick={() => {
                  handleCart(true);
                }}
                bgColor={"#ffa500"}
                color={"white"}
                h={"50px"}
                _hover={{}}
              >
                ADD 2 ITEMS TO CART
              </Button>
            </Center>
          </Flex>
          <Box border={"0px solid black"}>
            <Divider />
          </Box>
          <Text
            mt={"10px"}
            fontSize={"22px"}
            borderBottom={"1px solid black"}
            fontWeight={"bold"}
          >
            DESCRIPTION
          </Text>
          <Text mt={"10px"} fontSize={"13px"}>
            {product.description}
          </Text>
          <Box mt={"10px"}>
            <Text
              fontSize={"22px"}
              fontWeight={"bold"}
              borderBottom={"1px solid black"}
            >
              Product Details
            </Text>
            <Box mt={"10px"} fontSize={"13px"}>
              <Text>
                <Text as="h1" fontWeight="bold">
                  Product Dimensions :
                </Text>{" "}
                152.4 x 7.62 x 0.76 cm; 200 Grams
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">
                  Item model number :
                </Text>{" "}
                {skuID}
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">
                  Country of Origin :
                </Text>{" "}
                India
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">
                  Department :
                </Text>{" "}
                Unisex Adult
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">
                  Item Weight :
                </Text>{" "}
                200 g
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">
                  Item Dimensions LxWxH :
                </Text>{" "}
                152.4 x 7.6 x 0.8 Centimeters
              </Text>
              <Text>
                <Text as="span" fontWeight="bold">
                  Net Quantity :
                </Text>{" "}
                1.00 count
              </Text>
            </Box>
          </Box>
          <Box mt={"20px"} fontSize={"13px"}>
            <Text
              fontSize={"22px"}
              fontWeight={"bold"}
              borderBottom={"1px solid black"}
            >
              Pro Care
            </Text>
            <Box ml={"20px"} mt={"10px"}>
              <ul>
                <li>Dry Clean Only</li>
                <li>Machine Wash & Hand Wash Only</li>
                <li>Fit Type: regular</li>
                <li>Wash me Soft Handedly</li>
                <li>Iron on low heat</li>
                <li>Fold properly</li>
                <li>Keep me in your wardrobe</li>
                <li>Red necktie with every suit create the perfect pair</li>
                <li>Easy to wear and give a great comfort</li>
                <li>Size: 60cm x 3cm</li>
                <li>Available in every color</li>
                <li>
                  The design, artistry and your love take this product from just
                  a product to a great product
                </li>
              </ul>
            </Box>
          </Box>
          <Flex
            justifyContent={"space-between"}
            borderBottom={"1px solid black"}
          >
            <Text mt={"10px"} fontWeight={"600"} fontSize={"22px"} mb={"10px"}>
              Rating & Reviews
            </Text>
            <Center>
              <Button
                bgColor={"#ffa500"}
                color={"white"}
                _hover={{}}
                onClick={handleReview}
              >
                Rate Product
              </Button>
            </Center>
          </Flex>
          {product?.productReview?.map((ele,i) => {
            if (ele.status == "accept") {
              return <ReviewCard data={ele} key={i} />;
            }
          })}
        </Box>
      </Flex>
      <Flex mt={"20px"} direction={"column"} gap={"20px"}>
        <Text ml={"20px"} fontWeight={"bold"} fontSize={"20px"}>
          Premium Products
        </Text>
        <Box p={"10px 0px"}>
          <CustomSlider
            data={premium}
            settings={settings}
            h={"150px"}
            button={true}
            redirect={true}
            cursor={true}
          />
        </Box>
        <Text ml={"20px"} fontWeight={"bold"} fontSize={"20px"}>
          Products for gifts
        </Text>

        <CustomSlider
          data={gifts}
          settings={settings}
          h={"150px"}
          button={true}
          redirect={true}
          cursor={true}
        />
      </Flex>
    </Box>
  );
};

export default SingleProduct;
