"use client";
import {
  Box,
  Center,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  InputLeftAddon,
  useToast,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { HiSquares2X2 } from "react-icons/hi2";
import { BiPackage, BiLogOutCircle } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import RCG_logo from "../Resources/RCG_logo.png";
import { LoginSocialGoogle } from "reactjs-social-login";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiSearch } from "react-icons/fi";
import { AiTwotoneHeart } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import "./Nav.css";
import { useDispatch, useSelector } from "react-redux";
import { logout, sendOTP, signin, signup } from "../Redux/AuthReducer/Action";
import axios from "axios";
import { getCart, getWish, wipeWish } from "../Redux/AppReducer/Action";
import check from "../Resources/check.png";
import { ResetPassword, onPasswordResetOpen } from "./ResetPassword";
import OtpInput from "react-otp-input";
import { useRouter } from "next/navigation";
import Link from "next/link";
const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const handleOtpChange = (otpValue) => {
    // Check if the length of the OTP is 6
    if (otpValue.length === 6) {
      setOtp(otpValue);
      // You can perform further actions here if needed
    }
  };
  return (
    <Box m={"10px 0px"}>
      <OtpInput
        inputStyle={{ color: "black", height: "20px" }}
        value={otp}
        onChange={handleOtpChange}
        numInputs={6}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
      />
    </Box>
  );
};
const Nav = () => {
  const [load, setLoad] = useState(false);
  const category = [
    {
      name: "HOME",
      link: "/",
    },
    {
      name: "CLASSIC",
      link: "/allProducts?category=classic",
    },
    {
      name: "PREMIUM",
      link: "/allProducts?category=premium",
    },
    {
      name: "GIFT",
      link: "/allProducts?category=gift",
    },
    {
      name: "WEDDING",
      link: "/allProducts?category=wedding",
    },
    {
      name: "PARTYWEAR",
      link: "/allProducts?category=partywear",
    },
    {
      name: "CASUAL",
      link: "/allProducts?category=casual",
    },
    {
      name: "COMBO",
      link: "/allProducts?category=combo",
    },
    {
      name: "BULK ORDER",
      link: "/corporate",
    },
    {
      name: "CONTACT US",
      link: "/contact",
    },
  ];
  const email = useRef(null);
  const password = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const loginState = useSelector((store) => store.app.loginForm);
  const token = useSelector((store) => store.auth.token);
  const user = useSelector((store) => store.auth.user);
  const loginload = useSelector((store) => store.auth.isLoading);
  const otp = useSelector((store) => store.auth.otp);
  const wish = useSelector((store) => store.app.wish);
  const cart = useSelector((store) => store.app.cart);
  const allProducts = useSelector((store) => store.app.allProducts);
  const dispatch = useDispatch();
  const navigate = useRouter();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    mobile: "",
    name: "",
  });
  let temp;
  let searchID;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPasswordResetOpen,
    onOpen: onPasswordResetOpen,
    onClose: onPasswordResetClose,
  } = useDisclosure();
  useEffect(() => {
    if (token === "" && loginState == true) {
      onOpen();
    }
  }, [loginState]);

  useEffect(() => {
    handleGetCart();
    dispatch(getCart(token));
  }, []);
  if (user.name !== undefined) {
    temp = user.name.split(" ")[0].toUpperCase();
    temp = temp.split("");
    if (temp.length > 10) {
      temp = temp.splice(0, 10);
      console.log(temp);
      temp = temp.join();
      temp = temp + "...";
    } else {
      temp = temp.join("");
    }
  }
  const handleLogout = () => {
    dispatch(logout(toast, navigate));
    dispatch(wipeWish());
  };
  const handleCart = () => {
    if (token === "") {
      toast({
        title: "Please login first",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
      onOpen();
    } else {
      navigate.push("/cart");
    }
  };
  const handleGetCart = () => {
    if (
      token !== "" &&
      window.location.href == "/" &&
      !window.location.href.includes("admin")
    ) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setData(res.data.data);
        });
    }
  };
  const handleSignup = (payload) => {
    setLoad(true);
    const emailValidation = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    if (
      payload.fname === "" &&
      payload.lname === "" &&
      payload.email === "" &&
      payload.password === "" &&
      payload.mobile === "" &&
      payload.name === ""
    ) {
      toast({
        title: "Fill all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      if (emailValidation.test(payload.email) === false) {
        toast({
          title: "Invalid E-mail",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (payload.password.length < 8) {
        toast({
          title: "password must be more than 8 characters",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        userData.name = userData.fname + " " + userData.lname;
        userData.loginType = "Manual";
        delete userData.fname;
        delete userData.lname;
        userData.token = "";
        const emailPayload = {
          sendTo: userData.email,
          subject: "Account Verification for Rarecombee",
          text: `Dear ${userData.name},
          Thank you for registering on our website, Rarecombee. We appreciate your interest and are excited to have you on board.
          To complete the verification process and fully activate your account, please click on the following link: `,
          url: "https://www.rarecombee.com/verify-your-email?token=",
          outro: `If you have any questions, feel free to reach out to our customer support team. We're here to help.
          Best regards,
          Rarecombee Team`,
        };
        axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token`, {
            user: userData,
            email: emailPayload,
            username: true,
            username: false,
          })
          .then((res) => {
            setLoad(false);
            navigate.push("/verify");
            onClose();
          });
      }
    }
  };
  const handleResetPassword = () => {
    onClose();
    onPasswordResetOpen();
  };
  const handleDeleteWish = (skuID) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wish/delete/${skuID}`, {
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
        dispatch(getWish(token));
      });
  };
  const handleSignIn = () => {
    const payload = {
      email: email.current.value,
      password: password.current.value,
      loginType: "manual",
    };
    if (email.current.value != "" && password.current.value != "") {
      dispatch(signin(payload, toast, onClose, navigate, setLoad));
    } else {
      toast({
        title: "Fill all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleAddCart = (skuID) => {
    const data = allProducts.filter((el) => el.skuID === skuID);
    const payload = {
      title: data[0].title,
      price: data[0].price,
      skuID: data[0].skuID,
      discount: data[0].discount,
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
          handleGetCart();
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
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    let temp = { ...userData, [name]: value };
    setUserData(temp);
  };
  const handleSearch = (e) => {
    try {
      let text = e.target.value;
      setSearchBarText(text);
      clearTimeout(searchID);
      searchID = setTimeout(() => {
        if (text !== "") {
          axios
            .get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/search?search=${text}`
            )
            .then((res) => {
              setSearchData(res.data.data);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          setSearchData([]);
        }
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGoogle = ({ provider, data }) => {
    const payload = {
      name: data.name,
      email: data.email,
      loginType: provider,
      administration: "",
    };
    dispatch(signin(payload, toast, onClose, navigate, setLoad));
  };
  const handleSearchClick = (skuID) => {
    setSearchData([]);
    setSearchBarText("");
    navigate.push(`/allProducts/single/${skuID}`);
  };
  return (
    <Box id="nav" hidden={window.location.pathname.includes("/admin")}>
      <ResetPassword
        isPasswordResetOpen={isPasswordResetOpen}
        onPasswordResetClose={onPasswordResetClose}
      />
      <Box h={"70px"} bgColor={"white"}>
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Center>
            <Input
              textIndent={"7px"}
              value={searchBarText}
              placeholder="Search"
              w={"700px"}
              mt={"15px"}
              p={"5px 0px"}
              onChange={(e) => handleSearch(e)}
              shadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
            />
            <Box position={"relative"} ml={"-30px"} mt={"17px"}>
              <Center>
                <FiSearch />
              </Center>
            </Box>
          </Center>
        </Flex>
      </Box>
      <Center>
        <Box
          ml={"10px"}
          w={"700px"}
          position={"fixed"}
          top={110}
          bgColor={"white"}
          borderRadius={"7px"}
          hidden={searchData.length <= 0 }
        >
          {searchData?.map((ele, i) => {
            return (
              <Flex
                key={i}
                mb={"10px"}
                p={"5px"}
                gap={"5px"}
                cursor={"pointer"}
                onClick={() => handleSearchClick(ele.skuID)}
              >
                <Image
                  h={"50px"}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${ele.skuID}-1.jpg`}
                />
                <Center>
                  <Text fontSize={"14px"}>{ele.title}</Text>
                </Center>
              </Flex>
            );
          })}
          <Flex
            direction={"row-reverse"}
            p={"0px 5px"}
            onClick={() => {
              navigate.push(`/search?query=${searchBarText}`);
              setSearchBarText("");
              setSearchData([]);
            }}
          >
            <Text cursor={"pointer"}>See More</Text>
          </Flex>
        </Box>
      </Center>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList mb="1em">
                <Tab>SIGN IN</Tab>
                <Tab>SIGN UP</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack mt={"-70px"} mx={"auto"} maxW={"lg"} py={12} px={6}>
                    <Box
                      rounded={"lg"}
                      bg={useColorModeValue("white", "gray.700")}
                      boxShadow={"lg"}
                      p={8}
                    >
                      <Stack spacing={4}>
                        <FormControl id="email">
                          <Input
                            onKeyDown={(e) => {
                              if (e.key == "Enter") {
                                e.preventDefault();
                                handleSignIn();
                              }
                            }}
                            ref={email}
                            type="email"
                            placeholder="example@gmail.com"
                            isRequired
                          />
                        </FormControl>
                        <FormControl id="password">
                          <InputGroup>
                            <Input
                              onKeyDown={(e) => {
                                if (e.key == "Enter") {
                                  e.preventDefault();
                                  handleSignIn();
                                }
                              }}
                              ref={password}
                              type={showPassword ? "text" : "password"}
                              isRequired
                              placeholder="Password"
                            />
                            <InputRightElement h={"full"}>
                              <Button
                                _hover={{}}
                                variant={"unstyled"}
                                onClick={() =>
                                  setShowPassword(
                                    (showPassword) => !showPassword
                                  )
                                }
                              >
                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                        <Flex direction={"row-reverse"}>
                          <Text
                            textAlign={"right"}
                            fontSize={"14px"}
                            fontWeight={"400"}
                            onClick={handleResetPassword}
                            color={"#0a093d"}
                            cursor={"pointer"}
                          >
                            Forgot Password ?
                          </Text>
                        </Flex>

                        <Stack spacing={3} pt={2}>
                          <Button
                            fontSize={"14px"}
                            fontWeight={"600"}
                            isLoading={loginload}
                            onClick={handleSignIn}
                            loadingText="Submitting"
                            size="lg"
                            border={"1px solid blue"}
                            _hover={{
                              bg: "blue.500",
                              color: "white",
                              border: "none",
                            }}
                          >
                            SIGN IN
                          </Button>

                          {window&&<LoginSocialGoogle
                            client_id={process.env.NEXT_PUBLIC_GG_APP_ID || ""}
                            redirect_uri={"https://www.rarecombee.com"}
                            scope="openid profile email"
                            discoveryDocs="claims_supported"
                            access_type="offline"
                            onResolve={(e) => handleGoogle(e)}
                            onReject={(err) => {
                              console.log(err);
                            }}
                          >
                            <Button
                              fontSize={"14px"}
                              fontWeight={"600"}
                              loadingText="Accessing..."
                              isLoading={load}
                              w={"100%"}
                              size="lg"
                              border={"1px solid blue"}
                              _hover={{
                                bg: "blue.500",
                                color: "white",
                                border: "none",
                              }}
                            >
                              <FcGoogle />
                              &nbsp; Signin with Google
                            </Button>
                          </LoginSocialGoogle>}
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Flex>
                    <FormControl mr="5%">
                      <Input
                        id="first-name"
                        name="fname"
                        placeholder="First name"
                        isRequired
                        onChange={handleOnChange}
                      />
                    </FormControl>

                    <FormControl>
                      <Input
                        id="last-name"
                        name="lname"
                        placeholder="Last name"
                        isRequired
                        onChange={handleOnChange}
                      />
                    </FormControl>
                  </Flex>
                  <FormControl mt="2%">
                    <Input
                      id="email"
                      name="email"
                      onChange={handleOnChange}
                      type="email"
                      isRequired
                      placeholder="example@gmail.com"
                    />
                  </FormControl>

                  <FormControl>
                    <InputGroup mt="2%">
                      <Input
                        minLength={10}
                        pr="4.5rem"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        isRequired
                        name="password"
                        onChange={handleOnChange}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          variant={"unstyled"}
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {otp?.verificationId == undefined ? (
                      <InputGroup size="sm" mt="2%">
                        <InputLeftAddon
                          bg="gray.50"
                          _dark={{
                            bg: "gray.800",
                          }}
                          color="gray.500"
                          rounded="md"
                        >
                          +91
                        </InputLeftAddon>
                        <Input
                          onChange={handleOnChange}
                          type="tel"
                          name="mobile"
                          placeholder="Phone Number"
                          rounded="md"
                        />
                      </InputGroup>
                    ) : (
                      <VerifyOtp />
                    )}
                  </FormControl>
                  <div id="recaptcha-container"></div>
                  <Flex justifyContent={"space-between"} mt="2%">
                    {otp?.verificationId == undefined ? (
                      <Button
                        isLoading={load}
                        fontSize={"14px"}
                        fontWeight={"600"}
                        onClick={() => {
                          handleSignup(userData);
                        }}
                        loadingText="Submitting"
                        size="lg"
                        border={"1px solid blue"}
                        _hover={{
                          bg: "blue.500",
                          color: "white",
                          border: "none",
                        }}
                      >
                        SIGNUP
                      </Button>
                    ) : (
                      <Button
                        isLoading={load}
                        fontSize={"14px"}
                        fontWeight={"600"}
                        onClick={() => {
                          dispatch(sendOTP(`+91${userData.mobile}`));
                        }}
                        loadingText="Submitting"
                        size="lg"
                        border={"1px solid blue"}
                        _hover={{
                          bg: "blue.500",
                          color: "white",
                          border: "none",
                        }}
                      >
                        SEND OTP
                      </Button>
                    )}

                    <Button
                      fontSize={"14px"}
                      fontWeight={"600"}
                      loadingText="Accessing..."
                      // isLoading={true}
                      size="lg"
                      border={"1px solid blue"}
                      _hover={{
                        bg: "blue.500",
                        color: "white",
                        border: "none",
                      }}
                    >
                      <FcGoogle />
                      &nbsp; SIGNUP WITH GOOGLE
                    </Button>
                  </Flex>
                  <Box mt={"10px"} onClick={onClose}>
                    <Center>
                      <Text
                        _hover={{ color: "red" }}
                        cursor={"pointer"}
                        fontSize={"14px"}
                        fontWeight={"600"}
                      >
                        Continue without signup/signin
                      </Text>
                    </Center>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex
        h={"42px"}
        bgColor={"#20295a"}
        color={"white"}
        justifyContent={"space-between"}
      >
        <Image
          htmlWidth={"auto"}
          htmlHeight={"100px"}
          id={"logo"}
          src={"https://api.rarecombee.com/admin/image?name=RCG_logo.png"}
          loading="eager"
          title={"logo"}
          alt={"logo"}
          mt={"-30px"}
          ml={"100px"}
        />
        <Flex
          columns={[3, 5, 5, 10]}
          gap={["15px", "15px", "15px", "25px"]}
          cursor={"pointer"}
          fontSize={["12px", "12px", "12px", "12px", "15px"]}
        >
          {category.map(({ name, link }, i) => {
            return (
              <Center key={i}>
                <Link href={link||""}>
                  <Box fontWeight={"bold"} _hover={{ fontWeight: "bold" }}>
                    {name}
                  </Box>
                </Link>
              </Center>
            );
          })}
        </Flex>
        <Flex gap={"15px"} w={"250px"}>
          <Center>
            {user.name !== undefined ? null : (
              <Box
                onClick={onOpen}
                cursor={"pointer"}
                h={"30px"}
                bgColor={"white"}
                fontSize={"14px"}
                p={"5px 20px"}
                color={"#20295a"}
                fontWeight={"bold"}
                letterSpacing={"1px"}
              >
                <Center>{user.name === undefined ? "LOGIN" : temp}</Center>
              </Box>
            )}
            {user.name === undefined ? null : (
              <Menu>
                <MenuButton as={Box} cursor={"pointer"} h={"30px"}>
                  <Box
                    bgColor={"white"}
                    fontSize={"14px"}
                    p={"5px 20px"}
                    color={"#20295a"}
                    fontWeight={"bold"}
                    letterSpacing={"1px"}
                  >
                    <Center>{user.name === undefined ? "LOGIN" : temp}</Center>
                  </Box>
                </MenuButton>
                <MenuList
                  bgColor={"#2874f0"}
                  w={"300px"}
                  border={"0px solid black"}
                  h={"auto"}
                >
                  <Box
                    m={"10px 0px"}
                    fontWeight={"bold"}
                    color={"white"}
                    textAlign={"left"}
                    ml={"13px"}
                  >
                    {user.name === undefined ? "" : user.name.toUpperCase()}
                  </Box>
                  {user.name === undefined ? (
                    <MenuItem
                      onClick={onOpen}
                      mb={"-8px"}
                      borderBottomRightRadius={"5px"}
                      borderBottomLeftRadius={"5px"}
                    >
                      SIGNUP / SIGNIN
                    </MenuItem>
                  ) : (
                    <Box>
                      <Box borderTop={"5px solid #0a093d"} color={"black"}>
                        <Link href={"/allProducts"}>
                          <MenuItem
                            p={"10px 0px"}
                            pl={"10px"}
                            _hover={{ bgColor: "#dadee3" }}
                          >
                            <Flex gap={"10px"}>
                              <Center>
                                <HiSquares2X2 />
                              </Center>
                              <Center>
                                <Text cursor={"pointer"}>All Category</Text>
                              </Center>
                            </Flex>
                          </MenuItem>
                        </Link>
                        <Link href={"/orders"}>
                          <MenuItem
                            p={"10px 0px"}
                            pl={"10px"}
                            _hover={{ bgColor: "#dadee3" }}
                          >
                            <Flex gap={"10px"}>
                              <Center>
                                <BiPackage />
                              </Center>
                              <Center>
                                <Text cursor={"pointer"}>My Orders</Text>
                              </Center>
                            </Flex>
                          </MenuItem>
                        </Link>
                        <Link href={"/cart"}>
                          <MenuItem
                            p={"10px 0px"}
                            pl={"10px"}
                            _hover={{ bgColor: "#dadee3" }}
                          >
                            <Flex gap={"10px"}>
                              <Center>
                                <FaShoppingCart />
                              </Center>
                              <Center>
                                <Text cursor={"pointer"}>My Cart</Text>
                              </Center>
                            </Flex>
                          </MenuItem>
                        </Link>
                        <Link href={"/wishlist"}>
                          <MenuItem
                            p={"10px 0px"}
                            pl={"10px"}
                            _hover={{ bgColor: "#dadee3" }}
                          >
                            <Flex gap={"10px"}>
                              <Center>
                                <AiTwotoneHeart />
                              </Center>
                              <Center>
                                <Text cursor={"pointer"}>My Wishlist</Text>
                              </Center>
                            </Flex>
                          </MenuItem>
                        </Link>
                        <Link href={"/profile"}>
                          <MenuItem
                            p={"10px 0px"}
                            pl={"10px"}
                            _hover={{ bgColor: "#dadee3" }}
                          >
                            <Flex gap={"10px"}>
                              <Center>
                                <FaUser />
                              </Center>
                              <Center>
                                <Text cursor={"pointer"}>Edit Profile</Text>
                              </Center>
                            </Flex>
                          </MenuItem>
                        </Link>
                      </Box>

                      <MenuItem
                        color={"black"}
                        borderTop={"3px solid #0a093d"}
                        p={"10px 0px"}
                        mb={"-8px"}
                        borderBottomLeftRadius={"5px"}
                        borderBottomRightRadius={"5px"}
                        pl={"10px"}
                        _hover={{ bgColor: "#dadee3" }}
                        onClick={handleLogout}
                      >
                        <BiLogOutCircle />
                        &nbsp;&nbsp;Logout
                      </MenuItem>
                    </Box>
                  )}
                </MenuList>
              </Menu>
            )}
          </Center>
          <Center>
            <Menu>
              <MenuButton as={Box} cursor={"pointer"}>
                <AiTwotoneHeart />
              </MenuButton>
              <MenuList>
                <TableContainer>
                  <Table variant="simple">
                    <Thead bgColor={"gray.200"}>
                      <Tr>
                        <Th></Th>
                        <Th>Product Name</Th>
                        <Th>Unit Price</Th>
                        <Th>Stock Status</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {wish?.map((el, i) => {
                        const tempText = `${el.title
                          .split("")
                          .splice(0, 20)
                          .join("")}...`;
                        return (
                          <Tr key={i}>
                            <Td>
                              <Flex gap={"8px"}>
                                <Center>
                                  <Box
                                    cursor={"pointer"}
                                    onClick={() => handleDeleteWish(el.skuID)}
                                  >
                                    <RiDeleteBinLine />
                                  </Box>
                                </Center>
                                <Box w={"50px"}>
                                  <Link href={`/allProducts/single/${el.skuID}`||""}>
                                    <Image
                                      border={"1px solid gray"}
                                      h={"50px"}
                                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${el.skuID}-1.jpg`}
                                    />
                                  </Link>
                                </Box>
                              </Flex>
                            </Td>
                            <Td>
                              <Link href={`/allProducts/single/${el.skuID}`}>
                                <Center>
                                  <Text cursor={"pointer"}>{tempText}</Text>
                                </Center>
                              </Link>
                            </Td>
                            <Td>
                              <Link href={`/allProducts/single/${el.skuID}`}>
                                <Center cursor={"pointer"}>{el.price}</Center>
                              </Link>
                            </Td>
                            <Td>
                              <Link href={`/allProducts/single/${el.skuID}`}>
                                <Center>
                                  {el.quantity <= 0 ? (
                                    <Text color={"red"} cursor={"pointer"}>
                                      Out of Stock
                                    </Text>
                                  ) : (
                                    <Text color={"green"} cursor={"pointer"}>
                                      In Stock
                                    </Text>
                                  )}
                                </Center>
                              </Link>
                            </Td>
                            <Td>
                              {data?.some((ele) => ele.skuID === el.skuID) ? (
                                <Flex>
                                  <Image src={check} />
                                </Flex>
                              ) : (
                                <Button
                                  w={"100px"}
                                  variant={"unstyled"}
                                  bgColor={"green"}
                                  color={"white"}
                                  onClick={() => handleAddCart(el.skuID)}
                                >
                                  Add to Cart
                                </Button>
                              )}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </MenuList>
            </Menu>
          </Center>
          <Center onClick={handleCart} cursor={"pointer"}>
            <Box>
              <FaShoppingCart />
            </Box>
            <Box
              h={"13px"}
              w={"13px"}
              border={"1px solid #0a093d"}
              position={"relative"}
              borderRadius={"50%"}
              top={"-2"}
              left={"-2"}
              color={"#0a093d"}
              fontSize={"10px"}
              flexWrap={"bold"}
              bg={"white"}
            >
              <Center
                position={"relative"}
                top={"-0.5"}
                left={"0"}
                fontWeight={"bold"}
              >
                {cart?.length || 0}
              </Center>{" "}
            </Box>
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Nav;
