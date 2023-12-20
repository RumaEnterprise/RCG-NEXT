import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Center,
  useToast,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tabs,
  TabList,
  useColorModeValue,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import RCG_logo from "../Resources/RCG_logo.png";
import { IoMdMenu } from "react-icons/io";
import "./Nav.css";
import { BsPersonCircle } from "react-icons/bs";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { PiPhoneCallFill } from "react-icons/pi";
import { AiFillHome, AiTwotoneHeart } from "react-icons/ai";
import { MdCorporateFare } from "react-icons/md";
import { FiLogOut, FiPackage } from "react-icons/fi";
import { FaUser, FaShoppingCart } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { loginState, wipeWish } from "../Redux/AppReducer/Action";
import MobileNavCard from "./MobileNavCard";
import { logout, signin, signup } from "../Redux/AuthReducer/Action";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Mobile = () => {
  const [data, setData] = useState([]);
  const email = useRef(null);
  const password = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    mobile: "",
    name: "",
  });
  const handleSignup = (paylaod) => {
    dispatch(signup(paylaod, toast));
  };
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const token = useSelector((store) => store.auth.token);
  const toast = useToast();
  // dispatch(loginState(toast));
  const navigate = useRouter();
  const {
    isOpen: mobileIsOpen,
    onOpen: mobileOnOpen,
    onClose: mobileOnClose,
  } = useDisclosure();
  const btnRef = useRef();
  const {
    isOpen: popupIsOpen,
    onOpen: popuponOpen,
    onClose: popupOnClose,
  } = useDisclosure();
  const handleLogout = () => {
    dispatch(logout(toast, navigate));
    dispatch(wipeWish());
    mobileOnClose();
  };
  const category = [
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
      name: "PARTYWARE",
      link: "/allProducts?category=partywear",
    },
    {
      name: "CASUAL",
      link: "/allProducts?category=casual",
    },
    {
      name: "CATERING",
      link: "/allProducts?category=catering",
    },
  ];
  const handleLoginCheck = (point) => {
    if (token === "") {
      toast({
        title: "Please login first",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
      popuponOpen();
    } else {
      navigate.push(`/${point}`);
    }
  };
  return (
    <Box
      zIndex={"999"}
      position={"sticky"}
      top={"0px"}
      hidden={window.location.pathname.includes("/admin")}
    >
      <Modal
        isCentered
        isOpen={popupIsOpen}
        onClose={() => {
          popupOnClose();
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
                  <Stack mt={"-70px"} mx={"auto"} py={12} px={6}>
                    <Box
                      rounded={"lg"}
                      bg={useColorModeValue("white", "gray.700")}
                      boxShadow={"lg"}
                    >
                      <Stack spacing={4}>
                        <FormControl id="email">
                          <Input
                            ref={email}
                            type="email"
                            placeholder="example@gmail.com"
                            isRequired
                          />
                        </FormControl>
                        <FormControl id="password">
                          <InputGroup>
                            <Input
                              ref={password}
                              type={showPassword ? "text" : "password"}
                              isRequired
                              placeholder="Password"
                            />
                            <InputRightElement h={"full"}>
                              <Button
                                variant={"ghost"}
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
                        <Stack spacing={3} pt={2}>
                          <Button
                            fontSize={"14px"}
                            fontWeight={"600"}
                            onClick={(res) => {
                              const payload = {
                                email: email.current.value,
                                password: password.current.value,
                              };
                              dispatch(
                                signin(payload, toast, popupOnClose, navigate)
                              );
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
                            SIGN IN
                          </Button>
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
                            &nbsp; Signin with Google
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Flex direction={"column"} gap={"10px"}>
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
                  </FormControl>
                  <Flex direction={"column"} gap={"5px"} justifyContent={"space-between"} mt="2%">
                    <Button
                      fontSize={"14px"}
                      fontWeight={"600"}
                      onClick={() => {
                        userData.name = userData.fname + " " + userData.lname;
                        delete userData.fname;
                        delete userData.lname;
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
                  <Box mt={"10px"} onClick={popupOnClose}>
                    <Center>
                      <Text
                        _hover={{ color: "red" }}
                        cursor={"pointer"}
                        fontSize={"13px"}
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
        color={"white"}
        backgroundColor={"#20295a"}
        gap={"30px"}
        h="40px"
        justifyContent={"space-between"}
      >
        <Button ref={btnRef} colorScheme="#20295a" onClick={mobileOnOpen}>
          <IoMdMenu size="26px" />
        </Button>
        <Image id={"logo"} src={RCG_logo} h={"50px"} alt="logo" />
      </Flex>
      <Drawer
        isOpen={mobileIsOpen}
        placement="left"
        onClose={mobileOnClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bgColor={"#6a5df9"} size={"10px"}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Box fontSize={"50px"} color={"white"} gap={"3px"}>
              <Center>
                <BsPersonCircle />
              </Center>
              <Center>
                <Text cursor={"pointer"}
                  fontSize={"16px"}
                  onClick={
                    user.name === undefined
                      ? () => {
                          popuponOpen();
                        }
                      : null
                  }
                >
                  {user.name === undefined ? "LOGIN" : user.name}
                </Text>
              </Center>
            </Box>
          </DrawerHeader>

          <DrawerBody>
            <Flex
              h={window.innerHeight - 130}
              direction={"column"}
              justifyContent={"space-between"}
            >
              <Box>
                <MobileNavCard
                  link={"/"}
                  icon={AiFillHome}
                  text={"Home"}
                  close={mobileOnClose}
                />
                <Accordion
                  allowToggle
                  mb={"10px"}
                  border={"none"}
                  color={"white"}
                  borderBottom={"1px solid white"}
                >
                  <AccordionItem border={"none"}>
                    <h2>
                      <AccordionButton>
                        <Flex gap={"20px"} as="span" flex="1" textAlign="left">
                          <Center>
                            <BiSolidCategoryAlt />
                          </Center>

                          <Text>Category</Text>
                        </Flex>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {category.map(({ name, link }, i) => {
                        return (
                          <Link href={link} key={i}>
                            <Box
                              p={"10px"}
                              color={"white"}
                              fontSize={"14px"}
                              cursor={"pointer"}
                              key={i}
                              onClick={mobileOnClose}
                              marginBottom={2}
                              textAlign={"left"}
                              borderBottom={"1px solid white"}
                            >
                              {name}
                            </Box>
                          </Link>
                        );
                      })}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                <MobileNavCard
                  link={"/corporate"}
                  icon={MdCorporateFare}
                  text={"BULK ORDER"}
                  close={mobileOnClose}
                />
                <Box onClick={() => handleLoginCheck("orders")}>
                  <MobileNavCard
                    icon={FiPackage}
                    text={"My Orders"}
                    close={mobileOnClose}
                    seperator={false}
                  />
                </Box>

                <Box onClick={() => handleLoginCheck("cart")}>
                  <MobileNavCard
                    icon={FaShoppingCart}
                    text={"My Cart"}
                    close={mobileOnClose}
                    seperator={false}
                  />
                </Box>
                <Box onClick={() => handleLoginCheck("wishlist")}>
                  <MobileNavCard
                    icon={AiTwotoneHeart}
                    text={"My Wishlist"}
                    close={mobileOnClose}
                    seperator={false}
                  />
                </Box>
                <Box onClick={() => handleLoginCheck("profile")}>
                  <MobileNavCard
                    icon={FaUser}
                    text={"My Account"}
                    close={mobileOnClose}
                  />
                </Box>

                <MobileNavCard
                  link={"/"}
                  text={"Help Centre"}
                  close={mobileOnClose}
                  seperator={false}
                />
                <MobileNavCard
                  link={"/"}
                  text={"Privacy Policies"}
                  close={mobileOnClose}
                  seperator={false}
                />
                <MobileNavCard
                  link={"/"}
                  text={"Payment Policies"}
                  close={mobileOnClose}
                  seperator={false}
                />
                <MobileNavCard
                  link={"/"}
                  text={"Safety Policies"}
                  close={mobileOnClose}
                  seperator={false}
                />
                <MobileNavCard
                  link={"/"}
                  text={"Confidentiality Policies"}
                  close={mobileOnClose}
                />
              </Box>
              <Box>
                <Link to={"/contact"}>
                  <Flex
                    p={"10px"}
                    pl={"17px"}
                    color={"white"}
                    borderBottom={
                      user.name === undefined ? "none" : "1px solid white"
                    }
                    fontSize={"14px"}
                    cursor={"pointer"}
                    onClick={mobileOnClose}
                    marginBottom={2}
                    textAlign={"center"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={"17px"}
                  >
                    <Center fontSize={"17px"}>
                      {" "}
                      <PiPhoneCallFill />{" "}
                    </Center>
                    <Text>CONTACT US</Text>
                  </Flex>
                </Link>
                {user.name !== undefined ? (
                  <Flex
                    onClick={handleLogout}
                    color={"white"}
                    p={"10px 0px"}
                    borderBottom={"1px solid white"}
                    fontSize={"14px"}
                    cursor={"pointer"}
                    marginBottom={2}
                    textAlign={"center"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={"17px"}
                  >
                    <Center fontSize={"17px"} ml={"-15px"}>
                      <FiLogOut />
                    </Center>
                    <Text textAlign={"left"}>LOGOUT</Text>
                  </Flex>
                ) : null}
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Mobile;
