"use client";
import {
  Box,
  Button,
  Center,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsCheckLg, BsArrowRight } from "react-icons/bs";
import { RiTwitterFill } from "react-icons/ri";
import foot_bar from "../Resources/foot_bar.jpg";
import RCG_logo from "../Resources/RCG_logo.png";
import ruma from "../Resources/ruma.png";
import { SignupOpen } from "../Redux/AppReducer/Action";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Footer = () => {
  const [hide, setHide] = useState(false);
  const navigate = useRouter();
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
      name: "COMBO",
      link: "/allProducts?category=combo",
    },
  ];
  const company = [
    {
      name: "about us",
      link: "/",
    },
    {
      name: "blog",
      link: "/",
    },
    {
      name: "partnership",
      link: "/",
    },

    {
      name: "careers",
      link: "/",
    },
    {
      name: "our team",
      link: "/team",
    },
  ];
  const policies = [
    {
      name: "Our Policies",
      link: "/policies",
    },
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    if (window.location.pathname.includes("/admin")) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, []);
  return (
    <Box h={"auto"} bgColor={"#000e24"} pt={"15px"} hidden={hide} mt={"100px"}>
      <Center mt={"-80px"}>
        <Box
          borderRadius={"5px"}
          w={"70%"}
          backgroundImage={`url(https://api.rarecombee.com/admin/image?name=foot_bar.jpg)`}
          p={"20px"}
          pb={"30px"}
        >
          <Flex direction={["column", "column", "column", "row"]}>
            <Box>
              <Text
                textAlign={"left"}
                color={"white"}
                letterSpacing={"1.5px"}
                fontSize={"25px"}
                fontFamily={"Poppins"}
              >
                Try Rare Combee Group Today
              </Text>
              <SimpleGrid columns={[1, 1, 3]} gap={"10px"} mt={"20px"}>
                <Flex gap={"5px"}>
                  <Center color={"white"}>
                    <BsCheckLg />
                  </Center>
                  <Center>
                    <Text
                      letterSpacing={"1px"}
                      fontSize={"12px"}
                      color={"white"}
                      textAlign={"left"}
                    >
                      Quality Assurance
                    </Text>
                  </Center>
                </Flex>
                <Flex gap={"5px"}>
                  <Center color={"white"}>
                    <BsCheckLg />
                  </Center>
                  <Center>
                    <Text
                      letterSpacing={"1px"}
                      fontSize={"12px"}
                      color={"white"}
                      textAlign={"left"}
                    >
                      Fastest Delivery
                    </Text>
                  </Center>
                </Flex>
                <Flex gap={"5px"}>
                  <Center color={"white"}>
                    <BsCheckLg />
                  </Center>
                  <Center>
                    <Text
                      letterSpacing={"1px"}
                      fontSize={"12px"}
                      color={"white"}
                      textAlign={"left"}
                    >
                      Thoughtful Packaging
                    </Text>
                  </Center>
                </Flex>
              </SimpleGrid>
            </Box>
            <Box
              mt={"20px"}
              ml={["0px", "50px", "50px", "150px"]}
              w={["100%", "60%", "50%", "38%"]}
            >
              <SimpleGrid
                columns={[1, 1, 1, 2]}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"10px"}
              >
                <Center>
                  <Button
                    borderRadius={"20px"}
                    w={"150px"}
                    onClick={() => {
                      dispatch(SignupOpen());
                    }}
                  >
                    Sign Up Free &nbsp; <BsArrowRight />
                  </Button>
                </Center>
                <Center>
                  <Button
                    borderRadius={"20px"}
                    w={"150px"}
                    onClick={() => {
                      navigate.push("/contact");
                    }}
                  >
                    Contact Us &nbsp; <BsArrowRight />
                  </Button>
                </Center>
              </SimpleGrid>
            </Box>
          </Flex>
        </Box>
      </Center>
      <Box
        ml={["10px", "10px", "10px", "140px"]}
        mr={["10px", "10px", "10px", "140px"]}
        mb={"40px"}
        mt={"70px"}
      >
        <SimpleGrid
          textAlign={"center"}
          columns={[1, 2, 3, 4, 5]}
          gap={"15px"}
          justifyContent={"space-between"}
        >
          <Box
            textAlign={"left"}
            color={"white"}
            w={["100%", "220px", "220px", "220px"]}
          >
            <Text
              fontWeight={"bold"}
              fontSize={"16px"}
              mb={"15px"}
              textAlign={["center", "center", "left", "left"]}
              color={"#5f6683"}
              letterSpacing={"1px"}
            >
              CATEGORY
            </Text>
            <SimpleGrid
              columns={[3, 2, 2, 2]}
              fontSize={"13px"}
              gap={"10px"}
              justifyContent={"space-between"}
            >
              {category.map(({ name, link }, i) => {
                return (
                  <Box key={name}>
                    <Link href={link}>
                      <Text
                        cursor={"pointer"}
                        fontWeight={"500"}
                        _hover={{ fontWeight: "bold" }}
                        letterSpacing={"1px"}
                        textAlign={i % 2 === 0 ? "left" : "left"}
                      >
                        {name.toUpperCase()}
                      </Text>
                    </Link>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
          <Box textAlign={"left"} color={"white"}>
            <Text
              fontWeight={"bold"}
              fontSize={"16px"}
              mb={"15px"}
              textAlign={["center", "center", "left", "left"]}
              color={"#5f6683"}
              letterSpacing={"1px"}
            >
              COMPANY
            </Text>
            <SimpleGrid columns={2} fontSize={"13px"} gap={"10px"}>
              {company.map(({ name, link }) => {
                return (
                  <Box key={name}>
                    <Link href={link}>
                      <Text
                        cursor={"pointer"}
                        fontWeight={"500"}
                        _hover={{ fontWeight: "bold" }}
                        letterSpacing={"1px"}
                        textAlign={"left"}
                      >
                        {name.toUpperCase()}
                      </Text>
                    </Link>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
          <Box textAlign={"left"} color={"white"}>
            <Text
              fontWeight={"bold"}
              fontSize={"16px"}
              mb={"15px"}
              color={"#5f6683"}
              textAlign={["center", "center", "left", "left"]}
              letterSpacing={"1px"}
            >
              TERMS & POLICY
            </Text>
            <SimpleGrid columns={"1"} fontSize={"13px"} gap={"10px"}>
              {policies.map(({ name, link }) => {
                return (
                  <Box key={name}>
                    <Link href={link}>
                      <Text
                        cursor={"pointer"}
                        fontWeight={"500"}
                        _hover={{ fontWeight: "bold" }}
                        letterSpacing={"1px"}
                        textAlign={"left"}
                      >
                        {name.toUpperCase()}
                      </Text>
                    </Link>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
          <Box textAlign={"left"} color={"white"}>
            <Text
              fontWeight={"bold"}
              fontSize={"16px"}
              mb={"15px"}
              color={"#5f6683"}
              textAlign={["center", "center", "left", "left"]}
              letterSpacing={"1px"}
            >
              CONTACT US
            </Text>

            <Flex w={"250px"} direction={"column"} gap={"10px"}>
              <a href="mailto:rumaenterprise@gmail.com">
                rumaenterprise@gmail.com
              </a>
              <a href="tel:+919903753033">+919903753033</a>
              <Text letterSpacing={"1px"} fontSize={"16px"} fontWeight={"bold"}>
                Head Office -
                <a
                  style={{ fontWeight: "lighter", fontSize: "13px" }}
                  href="https://goo.gl/maps/H8v98xxMbCgL3uKVA"
                  target="_blank"
                >
                  Jitu babur Godown, Blessed Industries, 76/18/1,Banaras Road
                  Bose Company, Howrah, West Bengal 711101
                </a>
              </Text>
            </Flex>
          </Box>
          <Box
            textAlign={"left"}
            ml={["0px", "0px", "50px", "80px"]}
            mt={["0px", "-150px", "0px", "0px"]}
          >
            <Text
              fontWeight={"bold"}
              fontSize={"18px"}
              mb={"5px"}
              textAlign={["center", "center", "left", "left"]}
              color={"#5f6683"}
            >
              Social Media
            </Text>
            <SimpleGrid columns={[2, 2, 2, 1]} gap={"10px"} color={"white"}>
              <a href="https://www.facebook.com/Ruma-Enterprise-109959944608602/">
                <Flex letterSpacing={"1px"}>
                  <Center>
                    <Box bgColor={"blue"} borderRadius={"50%"} p={"5px"}>
                      <FaFacebookF />
                    </Box>
                    &nbsp; Facebook
                  </Center>
                </Flex>
              </a>
              <a href="https://www.instagram.com/rumaenterprise/">
                <Flex letterSpacing={"1px"}>
                  <Center>
                    <Box bgColor={"purple"} borderRadius={"50%"} p={"5px"}>
                      <FaInstagram />
                    </Box>
                    &nbsp; Instagram
                  </Center>
                </Flex>
              </a>
              <a href="https://www.instagram.com/rumaenterprise/">
                <Flex letterSpacing={"1px"}>
                  <Center>
                    <Box bgColor={"#54abed"} borderRadius={"50%"} p={"5px"}>
                      <RiTwitterFill />
                    </Box>
                    &nbsp; Twitter
                  </Center>
                </Flex>
              </a>
              <a href="https://www.instagram.com/rumaenterprise/">
                <Flex letterSpacing={"1px"}>
                  <Center>
                    <Box
                      bgColor={"rgb(10, 102, 194);"}
                      borderRadius={"50%"}
                      p={"5px"}
                    >
                      <FaLinkedinIn />
                    </Box>
                    &nbsp; LinkedIn
                  </Center>
                </Flex>
              </a>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
        <Flex
          mt={["15px", "15px", "0px", "0px"]}
          direction={["column", "column", "row", "row"]}
          gap={["0px", "0px", "10px", "10px"]}
        >
          <Image
            height={80}
            width={80}
            loading="eager"
            title={"logo"}
            src={RCG_logo}
            alt={"logo"}
            htmlWidth={"auto"}
            htmlHeight={"80px"}
          />
          <Flex
            gap={"10px"}
            mt={["10px", "10px", "40px", "40px"]}
            textAlign={"left"}
          >
            <Center>
              <Text color={"white"}>A unit of Ruma Enterprise</Text>
            </Center>
            <a href="https://rumaenterprise.com" target="_blank">
              <Image
                htmlWidth={"auto"}
                htmlHeight={"40px"}
                height={130}
                width={130}
                loading="eager"
                title={"ruma"}
                alt={"ruma"}
                src={ruma}
              />
            </a>
          </Flex>
        </Flex>
      </Box>
      <Box w={"100%"} borderBottom={"0.5px solid gray"}></Box>
      <Box
        ml={["10px", "10px", "10px", "140px"]}
        mr={["10px", "10px", "10px", "140px"]}
        p={"10px 0px"}
      >
        <Flex
          w={["100%", "100%", "65%", "65%"]}
          direction={["column", "column", "column", "row"]}
          alignItems={"center"}
          color={"white"}
          justifyContent={"space-between"}
        >
          <Center>
            <Flex fontSize={"13px"} gap={"20px"}>
              <Text letterSpacing={"1px"}>©2023 Rare Combee Group</Text>
              <Text letterSpacing={"1px"}>Terms</Text>
              <Text letterSpacing={"1px"}>Privacy</Text>
            </Flex>
          </Center>
          <Center>
            <Box fontSize={"13px"}>
              <Text>Designed and Develped by Rare Combee Group</Text>
            </Box>
          </Center>
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer;
