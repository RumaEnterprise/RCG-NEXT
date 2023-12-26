"use client";
import React, { useEffect } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Center,
  Image,
  useToast,
  Button,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
} from "react-icons/fi";
import { MdPendingActions } from "react-icons/md";
import { BsServer, BsBoxSeam } from "react-icons/bs";
import { RiCoupon2Line } from "react-icons/ri";
import { TbReport, TbTie } from "react-icons/tb";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";
import RCG_logo from "../../Resources/RCG_logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./../../Redux/AuthReducer/Action";
import { useState } from "react";
import { capitalizeWords } from "../../Components/capital";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Dashboard({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const [LinkItems, setLinkItems] = useState([]);
  const user = useSelector((store) => store.auth.user);
  useEffect(() => {
    const menus = [];
    menus.push({
      name: "Dashboard",
      icon: MdOutlineSpaceDashboard,
      url: "/admin",
    });
    if (
      user.displayProduct ||
      user.addProduct ||
      user.editProduct ||
      user.deleteProduct ||
      user.productStatus
    ) {
      menus.push({ name: "Product", icon: TbTie, url: "/admin/product" });
    }
    if (user.addUser || user.editUser || user.deleteUser || user.addAdminUser) {
      menus.push({ name: "Users", icon: FiUser, url: "/admin/users" });
    }
    if (user.displayCoupon || user.addCoupon || user.deleteCoupon) {
      menus.push({
        name: "Coupons",
        icon: RiCoupon2Line,
        url: "/admin/coupons",
      });
    }
    if (user.modifyHome) {
      menus.push({ name: "Home", icon: FiHome, url: "/admin/home" });
    }
    if (user.review) {
      menus.push({
        name: "Review",
        icon: MdPendingActions,
        url: "/admin/review",
      });
    }

    if (user.seeServerLogs) {
      menus.push({ name: "Server Log", icon: BsServer, url: "/admin/rarelog" });
    }
    if (user.seeReports) {
      menus.push({ name: "Reports", icon: TbReport, url: "/admin/reports" });
    }
    if (user.modifyOrder) {
      menus.push({ name: "Order", icon: BsBoxSeam, url: "/admin/orders" });
    }
    if (user.productReturn) {
      menus.push({
        name: "Return Request",
        icon: TbTruckReturn,
        url: "/admin/return",
      });
    }
    setLinkItems(menus);
  }, []);

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        mb={"10px"}
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        <Image h={"80px"} src={RCG_logo.src} />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        return (
          <Center key={link.name}>
            <Link href={link.url||""} shallow>
              <Box
                p={"20px 0px"}
                w={"200px"}
                mb={"10px"}
                pl={"20px"}
                color={
                  link.url === window.location.pathname ? "white" : "black"
                }
                bgColor={
                  link.url === window.location.pathname
                    ? "cyan.400"
                    : "transparent"
                }
                borderRadius={"10px"}
                _hover={{ color: "white", bgColor: "cyan.400" }}
              >
                <Flex gap={"30px"}>
                  <Center>
                    <link.icon />
                  </Center>
                  <Center>{link.name}</Center>
                </Flex>
              </Box>
            </Link>
          </Center>
        );
      })}
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const toast = useToast();
  const handleLogout = () => {
    dispatch(logout(toast));
    navigate.push("/");
  };
  const user = useSelector((store) => store.auth.user);
  return (
    <Flex
      position={"sticky"}
      top={"0"}
      zIndex={"999"}
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {/* <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text> */}

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{capitalizeWords(user.name)}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {capitalizeWords(user.administration)}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
              zIndex={"999"}
            >
              <Link href={"/admin/profile"} shallow>
                <MenuItem>Profile</MenuItem>
              </Link>
              <Link href={"/admin/settings"} shallow>
                <MenuItem>Settings</MenuItem>
              </Link>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default Dashboard;
