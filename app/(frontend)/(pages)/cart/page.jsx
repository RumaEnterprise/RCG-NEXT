"use client";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  useToast,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import RCG_logo from "../../Resources/RCG_logo.png";
import React, { useEffect, useState } from "react";
import axios from "axios";
import fillWish from "../../Resources/fillWish.png";
import emptyWish from "../../Resources/emptyWish.png";
import star from "../../Resources/star.png";
import cart from "../../Resources/cart.png";
import Loading from "../../Components/Loading";
import CartDisplay from "../../Components/CartDisplay";
import { AiOutlineShoppingCart } from "react-icons/ai";
import {
  clearRecomendedCoupon,
  randomProduct,
} from "../../Redux/AppReducer/Action";
import Slider from "react-slick";
import ProductCard from "../../Components/ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams, useRouter } from "next/navigation";
const Cart = () => {
  var settings = {
    dots: false, // Show dots navigation
    infinite: true, // Enable infinite loop
    speed: 500, // Transition speed in milliseconds
    autoplaySpeed: 5000, // Time in milliseconds before sliding to the next one (5 seconds in this example)
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at once
    autoplay: true, // Enable autoplay
    arrows: false, // Show arrows navigation
    adaptiveHeight: true,
    pauseOnHover: true, // Pause autoplay when hovering over the slider
  };
  const [total, setTotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const token = useSelector((store) => store.auth.token);
  const buy = useSelector((store) => store.app.buy);
  const sliderProduct = useSelector((store) => store.app.randomProduct);
  const navigate = useRouter();
  const { pathname } = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  let { skuID } = useParams();
  const handleCart = () => {
    setLoad(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setTotal(0);
        setGst(0);
        res?.data?.data?.map(({ price, quantity, discount }) => {
          const Price =
            Number(price) - (Number(price) * Number(discount)) / 100;
          const qty = Number(quantity);
          const totalPrice = Number(Price * qty + Price * qty * 0.05);
          setTotal((res) => res + Price * qty);
          setGst((res) => res + totalPrice);
          return 0;
        });
        setLoad(false);
      });
  };
  useEffect(() => {
    dispatch(randomProduct({ type: "classic" }));
    dispatch(randomProduct({ type: "premium" }));
    dispatch(randomProduct({ type: "casual" }));
    dispatch(randomProduct({ type: "gift" }));
    dispatch(randomProduct({ type: "wedding" }));
    dispatch(randomProduct({ type: "partywear" }));
    dispatch(randomProduct({ type: "combo" }));
    dispatch(clearRecomendedCoupon());
  }, []);
  useEffect(() => {
    setLoad(true);
    if (skuID == undefined) {
      handleCart();
    } else {
      setTotal(0);
      setGst(0);
      buy.map(({ price, quantity, discount }) => {
        const Price = Number(price) - (Number(price) * Number(discount)) / 100;
        const qty = Number(quantity);
        setTotal((res) => res + Price * qty);
        setGst((res) => res + Price * qty + Price * qty * 0.05);
        return 0;
      });
    }
    setLoad(false);
  }, [buy, pathname]);
  if (data.length <= 0 && skuID == undefined) {
    return (
      <Box>
        {load ? <Loading load={load} /> : null}
        <Center>
          <Image
            alt="cart"
            htmlHeight={"200px"}
            htmlWidth={"auto"}
            loading="eager"
            title="cart"
            mt={"90px"}
            h={"200px"}
            src={cart.src}
          />
        </Center>
        <Center>
          <Text as={"h1"} fontWeight={"bold"} fontSize={"50px"} mt={"20px"}>
            Your Cart is Currently Empty
          </Text>
        </Center>
        <Center>
          <Text
            m={"40px 0px"}
            mb={"5px"}
            fontWeight={"600"}
            fontSize={"20px"}
            color={"gray.500"}
          >
            Before proceed to checkout, you must add some products to your cart.
          </Text>
        </Center>
        <Center>
          <Text
            as={"h1"}
            fontWeight={"600"}
            fontSize={"20px"}
            color={"gray.500"}
          >
            You will find a lot of interesting products on our "Shop" page.
          </Text>
        </Center>
        <Center>
          <Button
            fontSize={"18px"}
            bgColor={"#68bb7d"}
            color={"white"}
            p={"30px"}
            mt={"30px"}
            mb={"50px"}
            _hover={{ bgColor: "#68bb7d" }}
            onClick={() => {
              navigate("/");
            }}
          >
            <AiOutlineShoppingCart />
            &nbsp;RETURN TO SHOP
          </Button>
        </Center>
      </Box>
    );
  }
  return (
    <Box>

      <Text
        hidden
        as={"h1"}
        fontSize={["15px", "20px", "30px", "40px"]}
        fontWeight={"bold"}
      >
        Your Cart Details with summary
      </Text>

      <Flex
        direction={["column", "column", "row", "row"]}
        mr={["10px", "10px", "10px", "50px"]}
        ml={["10px", "10px", "10px", "60px"]}
      >
        <Box w={["100%", "100%", "60%", "60%"]} mt={"40px"}>
          <TableContainer>
            <Table variant="simple" overflow={"scroll"}>
              <Thead bgColor={"gray.200"}>
                <Tr>
                  <Th>
                    <Center>
                      <Text
                        fontSize={["10px", "11px", "13px", "16px"]}
                        fontFamily={"Poppins"}
                        color={"gray.600"}
                      >
                        product
                      </Text>
                    </Center>
                  </Th>
                  <Th>
                    <Center>
                      <Text
                        fontSize={["10px", "11px", "13px", "16px"]}
                        fontFamily={"Poppins"}
                        color={"gray.600"}
                      >
                        price
                      </Text>
                    </Center>
                  </Th>
                  <Th>
                    <Center>
                      <Text
                        fontSize={["10px", "11px", "13px", "16px"]}
                        fontFamily={"Poppins"}
                        color={"gray.600"}
                      >
                        quantity
                      </Text>
                    </Center>
                  </Th>
                  <Th>
                    <Center>
                      <Text
                        fontSize={["10px", "11px", "13px", "16px"]}
                        fontFamily={"Poppins"}
                        color={"gray.600"}
                      >
                        total
                      </Text>
                    </Center>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {skuID === undefined ? (
                  <CartDisplay
                    data={data}
                    handleCart={handleCart}
                    setLoad={setLoad}
                  />
                ) : (
                  <CartDisplay
                    handleCart={handleCart}
                    data={buy}
                    setLoad={setLoad}
                  />
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          border={"0px solid black"}
          ml={["10px", "10px", "10px", "50px"]}
          mr={["10px", "10px", "10px", "50px"]}
          w={["100%", "100%", "30%", "30%"]}
          bgColor={"gray.200"}
          mt={"40px"}
          textAlign={"left"}
          p={"15px"}
          pt={"7px"}
          pl={"40px"}
        >
          <Text
            textAlign={"left"}
            fontFamily={"Poppins"}
            color={"gray.600"}
            fontWeight={"semibold"}
            letterSpacing={"2px"}
          >
            CART DETAILS
          </Text>
          <Divider />
          <Flex mt={"20px"} justifyContent={"space-between"} mb={"20px"}>
            <Text>SubTotal</Text>
            <Text>₹{total.toFixed(0) + ".00"}</Text>
          </Flex>
          <Divider />

          {/* <Box>
            <Text mb={"10px"}>Calculate Shipping</Text>
            <Flex gap={"10px"}>
            <Center>
            <Input boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} h={"30px"} w={'200px'} placeholder="Enter Indian Pincode" /></Center>
            <Button
            h={"30px"}
            border={"1px solid gray"}
            bgColor={"black"}
            color={"white"}
            _hover={{
              border: "2px solid black",
              bgColor: "white",
              color: "black",
            }}
            onClick={()=>{
              setShipping(300)
              setCheckout(total+300)
            }}
            >Check</Button>
            </Flex>

          </Box>
          <Divider /> */}
          <Flex mt={"20px"} justifyContent={"space-between"} mb={"20px"}>
            <Text>Shipping</Text>
            {/* <Text>₹{shipping}</Text> */}
            <Text color={"green"}>Free</Text>
          </Flex>
          <Divider />
          <Flex
            mt={"20px"}
            justifyContent={"space-between"}
            mb={"20px"}
            fontWeight={"bold"}
            fontSize={"24px"}
          >
            <Text>Total</Text>
            <Text>₹{total.toFixed(0) + ".00"}</Text>
          </Flex>
          <Box textAlign={"right"} mr={"50px"}>
            <Button
              border={"1px solid gray"}
              bgColor={"black"}
              color={"white"}
              _hover={{
                border: "2px solid black",
                bgColor: "white",
                color: "black",
              }}
              onClick={() => {
                if (skuID == undefined) {
                  navigate.push("/summary");
                } else {
                  navigate.push(`/summary/${skuID}`);
                }
              }}
            >
              PROCEED TO CHECKOUT
            </Button>
          </Box>
        </Box>
      </Flex>
      <Box mt={"40px"}>
        <Slider {...settings}>
          <Box>
            <Center fontSize={"40px"} fontWeight={"bold"} fontStyle={"italic"}>
              Our New Classic Products
            </Center>
            <SimpleGrid columns={[1, 2, 3, 4]} justifyContent={"space-around"}>
              {sliderProduct?.classic?.map(
                (
                  { skuID, title, price, discount, quantity, color, rating },
                  i
                ) => (
                  <ProductCard
                    title={title}
                    price={price}
                    color={color}
                    quantity={quantity}
                    skuID={skuID}
                    discount={discount}
                    rating={rating}
                    i={i}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
          <Box>
            <Center fontSize={"40px"} fontWeight={"bold"} fontStyle={"italic"}>
              Our New Premium Products
            </Center>
            <SimpleGrid columns={[1, 2, 3, 4]} justifyContent={"space-around"}>
              {sliderProduct?.premium?.map(
                (
                  { skuID, title, price, discount, quantity, color, rating },
                  i
                ) => (
                  <ProductCard
                    title={title}
                    price={price}
                    color={color}
                    quantity={quantity}
                    skuID={skuID}
                    discount={discount}
                    rating={rating}
                    i={i}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
          <Box>
            <Center fontSize={"40px"} fontWeight={"bold"} fontStyle={"italic"}>
              Our New Gift Products
            </Center>
            <SimpleGrid columns={[1, 2, 3, 4]} justifyContent={"space-around"}>
              {sliderProduct?.gift?.map(
                (
                  { skuID, title, price, discount, quantity, color, rating },
                  i
                ) => (
                  <ProductCard
                    title={title}
                    price={price}
                    color={color}
                    quantity={quantity}
                    skuID={skuID}
                    discount={discount}
                    rating={rating}
                    i={i}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
          <Box>
            <Center fontSize={"40px"} fontWeight={"bold"} fontStyle={"italic"}>
              Our New Wedding Products
            </Center>
            <SimpleGrid columns={[1, 2, 3, 4]} justifyContent={"space-around"}>
              {sliderProduct?.wedding?.map(
                (
                  { skuID, title, price, discount, quantity, color, rating },
                  i
                ) => (
                  <ProductCard
                    title={title}
                    price={price}
                    color={color}
                    quantity={quantity}
                    skuID={skuID}
                    discount={discount}
                    rating={rating}
                    i={i}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
          <Box>
            <Center fontSize={"40px"} fontWeight={"bold"} fontStyle={"italic"}>
              Our New Partyware Products
            </Center>
            <SimpleGrid columns={[1, 2, 3, 4]} justifyContent={"space-around"}>
              {sliderProduct?.partywear?.map(
                (
                  { skuID, title, price, discount, quantity, color, rating },
                  i
                ) => (
                  <ProductCard
                    title={title}
                    price={price}
                    color={color}
                    quantity={quantity}
                    skuID={skuID}
                    discount={discount}
                    rating={rating}
                    i={i}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
          <Box>
            <Center fontSize={"40px"} fontWeight={"bold"} fontStyle={"italic"}>
              Our New Casual Products
            </Center>
            <SimpleGrid columns={[1, 2, 3, 4]} justifyContent={"space-around"}>
              {sliderProduct?.casual?.map(
                (
                  { skuID, title, price, discount, quantity, color, rating },
                  i
                ) => (
                  <ProductCard
                    title={title}
                    price={price}
                    color={color}
                    quantity={quantity}
                    skuID={skuID}
                    discount={discount}
                    rating={rating}
                    i={i}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
          <Box>
            <Center fontSize={"40px"} fontWeight={"bold"} fontStyle={"italic"}>
              Our New Combo Products
            </Center>
            <SimpleGrid columns={[1, 2, 3, 4]} justifyContent={"space-around"}>
              {sliderProduct?.combo?.map(
                (
                  { skuID, title, price, discount, quantity, color, rating },
                  i
                ) => (
                  <ProductCard
                    title={title}
                    price={price}
                    color={color}
                    quantity={quantity}
                    skuID={skuID}
                    discount={discount}
                    rating={rating}
                    i={i}
                  />
                )
              )}
            </SimpleGrid>
          </Box>
        </Slider>
      </Box>
    </Box>
  );
};

export default Cart;
