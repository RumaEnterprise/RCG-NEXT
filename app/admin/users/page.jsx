"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Center,
  Select,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  useToast,
  Checkbox,
  FormLabel,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import CustomAlert from "../../../Components/CustomAlert";
import { FiSearch } from "react-icons/fi";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { searchProduct } from "../../../Redux/AppReducer/Action";
import { capitalizeWords } from "../../../Components/capital";
import Refresh from "../../../Components/Admin/Refresh";
import Loading from "../../../Components/Loading";

const UserList = () => {
  const dispatch = useDispatch();
  const [userCheckData, setUserCheckData] = useState([]);
  const [editUserData, setEditUserData] = useState({});
  const [searchBarText, setSearchBarText] = useState("");
  const [page, setPage] = useState(1);
  const [typePage, setTypePage] = useState(0);
  const [api, setapi] = useState("user");
  const users = useSelector((store) => store.auth.user);
  const load = useSelector((store) => store.app.isProductLoading);
  const {
    isOpen: isUserAddOpen,
    onOpen: onUserAddOpen,
    onClose: onUserAddClose,
  } = useDisclosure();
  const {
    isOpen: isUserEditOpen,
    onOpen: onUserEditOpen,
    onClose: onUserEditClose,
  } = useDisclosure();
  const {
    isOpen: isUserAddAlertOpen,
    onOpen: onUserAddAlertOpen,
    onClose: onUserAddAlertClose,
  } = useDisclosure();
  const {
    isOpen: isUserDeleteAlertOpen,
    onOpen: onUserDeleteAlertOpen,
    onClose: onUserDeleteAlertClose,
  } = useDisclosure();
  useEffect(() => {
    getUserList();
  }, []);
  const [inputValue, setInputValue] = useState({
    fname: "",
    lname: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    administration: "",
    displayProduct: false,
    addProduct: false,
    editProduct: false,
    deleteProduct: false,
    productStatus: false,
    addUser: false,
    editUser: false,
    deleteUser: false,
    addAdminUser: false,
    displayCoupon: false,
    addCoupon: false,
    deleteCoupon: false,
    modifyHome: false,
    modifyOrder: false,
    seeReports: false,
    seeServerLogs: false,
    review: false,
    productReturn: false,
  });
  const toast = useToast();
  const token = useSelector((store) => store.auth.token);
  const user = useSelector((store) => store.auth.user);
  const productData = useSelector((store) => store.app.products);
  const handleTypePage = (e) => {
    setTypePage(e.target.value);
  };
  const fetchProduct = () => {
    const payload = {
      text: searchBarText,
      token: token,
      limit: 9,
      page: page,
    };
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/adminsearch?search=${payload.text}&limit=${payload.limit}&page=${payload.page}`;
    if (searchBarText !== "") {
      if (api !== "search") {
        setapi("search");
        setPage(1);
      }
      dispatch(searchProduct(url, payload, toast));
    } else {
      if (api !== "product") {
        setapi("product");
        setPage(1);
      }
      getUserList();
    }
  };
  const changePermission = (e, setData, data) => {
    const { name, checked } = e.target;
    const temp = { ...data };
    temp[name] = checked;
    setData(temp);
  };
  const handleSearch = (e) => {
    try {
      let text = e.target.value;
      setSearchBarText(text);
      if (text == "" && api == "search") {
        setapi("product");
        getUserList();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUserList = () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?page=${page}&limit=9`;
    dispatch(searchProduct(url, { token: token }, toast));
  };
  const handleEdit = (event) => {
    const { name, value } = event.target;
    const temp = { ...editUserData };
    if (name == "administration") {
      if (value == "admin") {
        temp.displayProduct = true;
        temp.addProduct = true;
        temp.editProduct = true;
        temp.deleteProduct = true;
        temp.productStatus = true;
        temp.addUser = true;
        temp.editUser = true;
        temp.deleteUser = true;
        temp.addAdminUser = true;
        temp.displayCoupon = true;
        temp.addCoupon = true;
        temp.deleteCoupon = true;
        temp.modifyHome = true;
        temp.modifyOrder = true;
        temp.seeReports = true;
        temp.seeServerLogs = true;
      } else if (value == "manager") {
        temp.displayProduct = true;
        temp.addProduct = true;
        temp.editProduct = true;
        temp.deleteProduct = true;
        temp.productStatus = true;
        temp.addUser = true;
        temp.editUser = true;
        temp.deleteUser = true;
        temp.addAdminUser = false;
        temp.displayCoupon = true;
        temp.addCoupon = true;
        temp.deleteCoupon = true;
        temp.modifyHome = true;
        temp.modifyOrder = true;
        temp.seeReports = true;
        temp.seeServerLogs = false;
      } else if (value == "data operator") {
        temp.displayProduct = true;
        temp.addProduct = true;
        temp.editProduct = true;
        temp.deleteProduct = true;
        temp.productStatus = true;
        temp.addUser = false;
        temp.editUser = false;
        temp.deleteUser = false;
        temp.addAdminUser = false;
        temp.displayCoupon = true;
        temp.addCoupon = true;
        temp.deleteCoupon = true;
        temp.modifyHome = false;
        temp.modifyOrder = true;
        temp.seeReports = true;
        temp.seeServerLogs = false;
      } else if (value == "marketing manager") {
        temp.displayProduct = true;
        temp.addProduct = false;
        temp.editProduct = false;
        temp.deleteProduct = false;
        temp.productStatus = false;
        temp.addUser = false;
        temp.editUser = false;
        temp.deleteUser = false;
        temp.addAdminUser = false;
        temp.displayCoupon = true;
        temp.addCoupon = false;
        temp.deleteCoupon = false;
        temp.modifyHome = false;
        temp.modifyOrder = false;
        temp.seeReports = true;
        temp.seeServerLogs = false;
      } else if (value == "") {
        temp.addProduct = false;
        temp.displayProduct = false;
        temp.editProduct = false;
        temp.deleteProduct = false;
        temp.productStatus = false;
        temp.addUser = false;
        temp.editUser = false;
        temp.deleteUser = false;
        temp.addAdminUser = false;
        temp.displayCoupon = false;
        temp.addCoupon = false;
        temp.deleteCoupon = false;
        temp.modifyHome = false;
        temp.modifyOrder = false;
        temp.seeReports = false;
        temp.seeServerLogs = false;
      }
    }
    if ((/^[a-zA-Z]+$/.test(value) && name == "fname") || value.length == 0) {
      temp[name] = value;
    } else if (
      (/^[a-zA-Z]+$/.test(value) && name == "lname") ||
      value.length == 0
    ) {
      temp[name] = value;
    } else if (name === "mobile" && isNaN(value)) {
      toast({
        title: "Invalid Character",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    } else if (name !== "fname" && name !== "lname") {
      temp[name] = value;
    } else {
      toast({
        title: "Invalid Character",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
    if (temp.fname === userCheckData[0]?.name.split(" ")[0]) {
      delete temp.fname;
    }
    if (temp.lname === userCheckData[0]?.name.split(" ")[1]) {
      delete temp.lname;
    }
    if (temp.email === userCheckData[0]?.email) {
      delete temp.email;
    }
    if (temp.password == userCheckData[0]?.password) {
      delete temp.password;
    }
    if (temp.mobile === userCheckData[0]?.mobile) {
      delete temp.mobile;
    }
    if (temp.administration === userCheckData[0]?.administration) {
      delete temp.administration;
    }
    setEditUserData(temp);
  };
  const handleEditSubmit = () => {
    try {
      if (Object.keys(editUserData).length !== 0) {
        const payload = { ...editUserData };
        payload.id = userCheckData[0]?._id;
        axios
          .patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            onUserEditClose();
            getUserList();
            setEditUserData({});
            setUserCheckData([]);
            toast({
              title: res.data.msg,
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          })
          .catch((err) => {
            console.log(err);
            toast({
              title: err.response.data.msg,
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = () => {
    const id = userCheckData.map((ele) => {
      return ele._id;
    });
    try {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/delete?user=${id.join(
            ","
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setUserCheckData([]);
          getUserList();
          onUserDeleteAlertClose();
          toast({
            title: res.data.msg,
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  };
  const handleAddUser = () => {
    try {
      inputValue.name = `${inputValue.fname} ${inputValue.lname}`;
      delete inputValue.confirmPassword;
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create`, inputValue, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          getUserList();
          onUserAddAlertClose();
          onUserAddClose();
          toast({
            title: res.data.msg,
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: err.response.data.msg,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          onUserAddAlertClose();
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleCheck = (user, e) => {
    let temp = [...userCheckData];
    if (e.target.checked) {
      temp.push(user);
    } else {
      temp = temp.filter(({ _id }) => _id !== user._id);
    }
    setUserCheckData(temp);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const temp = { ...inputValue };
    if (/^[a-zA-Z]+$/.test(value) && name == "fname") {
      temp[name] = value;
      setInputValue(temp);
    } else if (/^[a-zA-Z]+$/.test(value) && name == "lname") {
      temp[name] = value;
      setInputValue(temp);
    } else if (name !== "fname" && name !== "lname") {
      if (name == "administration") {
        if (value == "admin") {
          temp.displayProduct = true;
          temp.addProduct = true;
          temp.editProduct = true;
          temp.deleteProduct = true;
          temp.productStatus = true;
          temp.addUser = true;
          temp.editUser = true;
          temp.deleteUser = true;
          temp.addAdminUser = true;
          temp.displayCoupon = true;
          temp.addCoupon = true;
          temp.deleteCoupon = true;
          temp.modifyHome = true;
          temp.modifyOrder = true;
          temp.seeReports = true;
          temp.seeServerLogs = true;
          temp.review = true;
          temp.productReturn = true;
        } else if (value == "manager") {
          temp.displayProduct = true;
          temp.addProduct = true;
          temp.editProduct = true;
          temp.deleteProduct = true;
          temp.productStatus = true;
          temp.addUser = true;
          temp.editUser = true;
          temp.deleteUser = true;
          temp.addAdminUser = false;
          temp.displayCoupon = true;
          temp.addCoupon = true;
          temp.deleteCoupon = true;
          temp.modifyHome = true;
          temp.modifyOrder = true;
          temp.seeReports = true;
          temp.seeServerLogs = false;
          temp.review = true;
          temp.productReturn = true;
        } else if (value == "data operator") {
          temp.displayProduct = true;
          temp.addProduct = true;
          temp.editProduct = true;
          temp.deleteProduct = true;
          temp.productStatus = true;
          temp.addUser = false;
          temp.editUser = false;
          temp.deleteUser = false;
          temp.addAdminUser = false;
          temp.displayCoupon = true;
          temp.addCoupon = true;
          temp.deleteCoupon = true;
          temp.modifyHome = false;
          temp.modifyOrder = true;
          temp.seeReports = true;
          temp.seeServerLogs = false;
          temp.review = false;
          temp.productReturn = false;
        } else if (value == "marketing manager") {
          temp.displayProduct = true;
          temp.addProduct = false;
          temp.editProduct = false;
          temp.deleteProduct = false;
          temp.productStatus = false;
          temp.addUser = false;
          temp.editUser = false;
          temp.deleteUser = false;
          temp.addAdminUser = false;
          temp.displayCoupon = true;
          temp.addCoupon = false;
          temp.deleteCoupon = false;
          temp.modifyHome = false;
          temp.modifyOrder = false;
          temp.seeReports = true;
          temp.seeServerLogs = false;
          temp.review = false;
          temp.productReturn = false;
        } else if (value == "") {
          temp.addProduct = false;
          temp.displayProduct = false;
          temp.editProduct = false;
          temp.deleteProduct = false;
          temp.productStatus = false;
          temp.addUser = false;
          temp.editUser = false;
          temp.deleteUser = false;
          temp.addAdminUser = false;
          temp.displayCoupon = false;
          temp.addCoupon = false;
          temp.deleteCoupon = false;
          temp.modifyHome = false;
          temp.modifyOrder = false;
          temp.seeReports = false;
          temp.seeServerLogs = false;
          temp.review = false;
          temp.productReturn = false;
        }
      }
      temp[name] = value;
      setInputValue(temp);
    } else {
      toast({
        title: "Invalid Character",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (typePage > productData?.maxPage || typePage <= 0) {
        toast({
          title: "Invalid Page Number",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setPage(Number(typePage));
      }
    }
  };
  if (load) {
    return <Loading load={load} />;
  }
  return (
    <Dashboard>
      <CustomAlert
        isUserAddAlertOpen={isUserAddAlertOpen}
        onUserAddAlertClose={onUserAddAlertClose}
        heading="Confirm Add User"
        btnName="Confirm"
        btnbgColor={"green"}
        btnCall={handleAddUser}
      />
      <CustomAlert
        isUserAddAlertOpen={isUserDeleteAlertOpen}
        onUserAddAlertClose={onUserDeleteAlertClose}
        heading="Confirm Delete User"
        btnName="Confirm"
        btnbgColor={"green"}
        btnCall={deleteUser}
      />
      <Modal isOpen={isUserAddOpen} onClose={onUserAddClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={"20px"}>
              <Input
                type="text"
                value={inputValue.fname}
                placeholder="First Name"
                name="fname"
                onChange={(e) => handleInputChange(e)}
              />
              <Input
                type="text"
                value={inputValue.lname}
                placeholder="Last Name"
                name="lname"
                onChange={(e) => handleInputChange(e)}
              />
            </Flex>
            <Flex gap={"20px"} mt={"20px"}>
              <Input
                _invalid={{ color: "red" }}
                type="email"
                value={inputValue.email}
                placeholder="E-mail"
                name="email"
                onChange={(e) => handleInputChange(e)}
              />
              <Input
                type="tel"
                value={inputValue.mobile}
                placeholder="Phone Number"
                maxLength={10}
                name="mobile"
                onChange={(e) => handleInputChange(e)}
              />
            </Flex>
            <Flex gap={"20px"} mt={"20px"}>
              <Input
                type="password"
                value={inputValue.password}
                placeholder="Password"
                name="password"
                onChange={(e) => handleInputChange(e)}
              />
              <Input
                type="password"
                value={inputValue.confirmPassword}
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={(e) => handleInputChange(e)}
              />
            </Flex>
            <Box hidden={inputValue?.confirmPassword == inputValue?.password}>
              <Text color={"red"} fontSize={"14px"}>
                * Password is not matched
              </Text>
            </Box>
            <Select
              mt={"10px"}
              name="administration"
              onChange={(e) => handleInputChange(e)}
            >
              <option hidden>Set User Role</option>
              <option hidden={!users.addAdminUser} value={"admin"}>
                Admin
              </option>
              <option value={"manager"}>Manager</option>
              <option value={"data operator"}>Data Operator</option>
              <option value={"marketing manager"}>Marketing Manager</option>
              <option value={""}>User</option>
            </Select>
            <Box>
              <Text m={"10px 0px"} fontSize={"18px"} fontWeight={"bold"}>
                Permissions
              </Text>
              <SimpleGrid gap={"10px"} columns={[1, 2, 3, 3]}>
                <Checkbox
                  isChecked={inputValue.displayProduct}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="displayProduct"
                  border={"0px solid black"}
                >
                  Display Product
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.addProduct}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="addProduct"
                  border={"0px solid black"}
                >
                  Add Product
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.editProduct}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="editProduct"
                  border={"0px solid black"}
                >
                  Edit Product
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.deleteProduct}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="deleteProduct"
                  border={"0px solid black"}
                >
                  Delete Product
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.productStatus}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="productStatus"
                  border={"0px solid black"}
                >
                  Product Status
                </Checkbox>

                <Checkbox
                  isChecked={inputValue.addUser}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="addUser"
                  border={"0px solid black"}
                >
                  Add User
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.editUser}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="editUser"
                  border={"0px solid black"}
                >
                  Edit User
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.deleteUser}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="deleteUser"
                  border={"0px solid black"}
                >
                  Delete User
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.addAdminUser}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="addAdminUser"
                  border={"0px solid black"}
                >
                  Add Admin
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.displayCoupon}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="displayCoupon"
                  border={"0px solid black"}
                >
                  Display Coupon
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.addCoupon}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="addCoupon"
                  border={"0px solid black"}
                >
                  Add Coupon
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.deleteCoupon}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="deleteCoupon"
                  border={"0px solid black"}
                >
                  Delete Coupon
                </Checkbox>

                <Checkbox
                  isChecked={inputValue.modifyHome}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="modifyHome"
                  border={"0px solid black"}
                >
                  Update Home
                </Checkbox>

                <Checkbox
                  isChecked={inputValue.modifyOrder}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="modifyOrder"
                  border={"0px solid black"}
                >
                  Update Orders
                </Checkbox>

                <Checkbox
                  isChecked={inputValue.seeReports}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="seeReports"
                  border={"0px solid black"}
                >
                  Reports
                </Checkbox>

                <Checkbox
                  isChecked={inputValue.seeServerLogs}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="seeServerLogs"
                  border={"0px solid black"}
                >
                  Server Logs
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.review}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="review"
                  border={"0px solid black"}
                >
                  Review Modify
                </Checkbox>
                <Checkbox
                  isChecked={inputValue.productReturn}
                  onChange={(e) =>
                    changePermission(e, setInputValue, inputValue)
                  }
                  name="productReturn"
                  border={"0px solid black"}
                >
                  Return Modify
                </Checkbox>
              </SimpleGrid>
            </Box>
            <Button
              onClick={onUserAddAlertOpen}
              _hover={{}}
              isDisabled={
                inputValue.confirmPassword !== inputValue.password ||
                inputValue.fname === "" ||
                inputValue.lname === "" ||
                inputValue.password === "" ||
                inputValue.mobile === "" ||
                inputValue.administration === ""
              }
              variant={"unstyled"}
              m={"10px 0px"}
              color={"white"}
              w={"100%"}
              bgColor={"green"}
            >
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isUserEditOpen} onClose={onUserEditClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={"20px"}>
              <Box>
                <Text fontSize={"13px"}>First Name</Text>
                <Input
                  type="text"
                  value={editUserData.fname}
                  defaultValue={userCheckData[0]?.name.split(" ")[0]}
                  placeholder="First Name"
                  name="fname"
                  onChange={(e) => handleEdit(e)}
                />
              </Box>
              <Box>
                <Text fontSize={"13px"}>Last Name</Text>
                <Input
                  type="text"
                  value={editUserData.lname}
                  defaultValue={userCheckData[0]?.name.split(" ")[1]}
                  placeholder="Last Name"
                  name="lname"
                  onChange={(e) => handleEdit(e)}
                />
              </Box>
            </Flex>
            <Flex gap={"20px"} mt={"20px"}>
              <Box>
                <Text fontSize={"13px"}>E-mail</Text>
                <Input
                  _invalid={{ color: "red" }}
                  type="email"
                  value={editUserData.email}
                  defaultValue={userCheckData[0]?.email}
                  placeholder="E-mail"
                  name="email"
                  onChange={(e) => handleEdit(e)}
                />
              </Box>
              <Box>
                <Text fontSize={"13px"}>Mobile No.</Text>
                <Input
                  type="tel"
                  value={editUserData.mobile}
                  defaultValue={userCheckData[0]?.mobile}
                  placeholder="Phone Number"
                  maxLength={10}
                  name="mobile"
                  onChange={(e) => handleEdit(e)}
                />
              </Box>
            </Flex>
            <Flex gap={"20px"} mt={"20px"}>
              <Box>
                <Text fontSize={"13px"}>Password</Text>
                <Input
                  type="text"
                  value={editUserData.password}
                  placeholder="Password"
                  name="password"
                  onChange={(e) => handleEdit(e)}
                />
              </Box>
              <Box>
                <Text fontSize={"13px"}>User Role/Type</Text>
                <Select
                  name="administration"
                  value={editUserData.administration}
                  defaultValue={userCheckData[0]?.administration}
                  onChange={(e) => handleEdit(e)}
                >
                  <option hidden>Change Status</option>
                  <option
                    hidden={user.administration !== "admin"}
                    value={"admin"}
                  >
                    Admin
                  </option>
                  <option value={"manager"}>Manager</option>
                  <option value={"data operator"}>Data Operator</option>
                  <option value={"marketing manager"}>Marketing Manager</option>
                  <option value={""}>User</option>
                </Select>
              </Box>
            </Flex>
            <Box>
              <Text m={"10px 0px"} fontSize={"18px"} fontWeight={"bold"}>
                Permissions
              </Text>
              <SimpleGrid gap={"10px"} columns={[1, 2, 3, 3]}>
                <Checkbox
                  isChecked={editUserData.displayProduct}
                  defaultChecked={userCheckData[0]?.displayProduct}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="displayProduct"
                  border={"0px solid black"}
                >
                  Display Product
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.addProduct}
                  defaultChecked={userCheckData[0]?.addProduct}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="addProduct"
                  border={"0px solid black"}
                >
                  Add Product
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.editProduct}
                  defaultChecked={userCheckData[0]?.editProduct}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="editProduct"
                  border={"0px solid black"}
                >
                  Edit Product
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.deleteProduct}
                  defaultChecked={userCheckData[0]?.deleteProduct}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="deleteProduct"
                  border={"0px solid black"}
                >
                  Delete Product
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.productStatus}
                  defaultChecked={userCheckData[0]?.productStatus}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="productStatus"
                  border={"0px solid black"}
                >
                  Product Status
                </Checkbox>

                <Checkbox
                  isChecked={editUserData.addUser}
                  defaultChecked={userCheckData[0]?.addUser}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="addUser"
                  border={"0px solid black"}
                >
                  Add User
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.editUser}
                  defaultChecked={userCheckData[0]?.editUser}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="editUser"
                  border={"0px solid black"}
                >
                  Edit User
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.deleteUser}
                  defaultChecked={userCheckData[0]?.deleteUser}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="deleteUser"
                  border={"0px solid black"}
                >
                  Delete User
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.addAdminUser}
                  defaultChecked={userCheckData[0]?.addAdminUser}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="addAdminUser"
                  border={"0px solid black"}
                >
                  Add Admin
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.displayCoupon}
                  defaultChecked={userCheckData[0]?.displayCoupon}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="displayCoupon"
                  border={"0px solid black"}
                >
                  Display Coupon
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.addCoupon}
                  defaultChecked={userCheckData[0]?.addCoupon}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="addCoupon"
                  border={"0px solid black"}
                >
                  Add Coupon
                </Checkbox>
                <Checkbox
                  isChecked={editUserData.deleteCoupon}
                  defaultChecked={userCheckData[0]?.deleteCoupon}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="deleteCoupon"
                  border={"0px solid black"}
                >
                  Delete Coupon
                </Checkbox>

                <Checkbox
                  isChecked={editUserData.modifyHome}
                  defaultChecked={userCheckData[0]?.modifyHome}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="modifyHome"
                  border={"0px solid black"}
                >
                  Update Home
                </Checkbox>

                <Checkbox
                  isChecked={editUserData.modifyOrder}
                  defaultChecked={userCheckData[0]?.modifyOrder}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="modifyOrder"
                  border={"0px solid black"}
                >
                  Update Orders
                </Checkbox>

                <Checkbox
                  isChecked={editUserData.seeReports}
                  defaultChecked={userCheckData[0]?.seeReports}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="seeReports"
                  border={"0px solid black"}
                >
                  Reports
                </Checkbox>

                <Checkbox
                  isChecked={editUserData.seeServerLogs}
                  defaultChecked={userCheckData[0]?.seeServerLogs}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="seeServerLogs"
                  border={"0px solid black"}
                >
                  Server Logs
                </Checkbox>
                <Checkbox
                isChecked={editUserData.review}
                defaultChecked={userCheckData[0]?.review}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="review"
                  border={"0px solid black"}
                >
                  Review Modify
                </Checkbox>
                <Checkbox
                isChecked={editUserData.productReturn}
                defaultChecked={userCheckData[0]?.productReturn}
                  onChange={(e) =>
                    changePermission(e, setEditUserData, editUserData)
                  }
                  name="productReturn"
                  border={"0px solid black"}
                >
                  Return Modify
                </Checkbox>
              </SimpleGrid>
            </Box>
            <Button
              onClick={handleEditSubmit}
              _hover={{}}
              variant={"unstyled"}
              m={"10px 0px"}
              color={"white"}
              w={"100%"}
              bgColor={"green"}
            >
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box h={"70px"} mt={"30px"}>
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Center>
            <Input
              variant={"unstyled"}
              textIndent={"7px"}
              value={searchBarText}
              placeholder="Enter user name to search"
              w={"700px"}
              mt={"15px"}
              p={"5px"}
              onChange={(e) => handleSearch(e)}
              shadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
            />
            <Box position={"relative"} ml={"-30px"} mt={"17px"}>
              <Center>
                <Box cursor={"pointer"} onClick={fetchProduct}>
                  <FiSearch />
                </Box>
              </Center>
            </Box>
          </Center>
        </Flex>
      </Box>
      <Box>
        <Flex
          w={"82%"}
          justifyContent={"space-between"}
          position={"fixed"}
          right={"0"}
          top={"20"}
          zIndex={"100"}
          bgColor={"transparent"}
          p={"10px"}
          mr={"16px"}
        >
          <Refresh refresh={fetchProduct} />
          <Flex gap={"10px"}>
            <Box textAlign={"right"} hidden={!users.addUser}>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="green"
                onClick={() => {
                  setInputValue({
                    fname: "",
                    lname: "",
                    email: "",
                    password: "",
                    mobile: "",
                    administration: "",
                  });
                  onUserAddOpen();
                }}
                isDisabled={userCheckData.length > 0}
                _disabled={{ bgColor: "green.300", cursor: "not-allowed" }}
              >
                Create
              </Button>
            </Box>
            <Box textAlign={"right"} hidden={!users.editUser}>
              <Button
                leftIcon={<EditIcon />}
                onClick={onUserEditOpen}
                colorScheme={
                  userCheckData.length <= 0 || userCheckData.length > 1
                    ? "gray"
                    : "teal"
                }
                color={"white"}
                _hover={{}}
                isDisabled={
                  userCheckData.length <= 0 || userCheckData.length > 1
                }
                _disabled={{ bgColor: "teal.300", cursor: "not-allowed" }}
              >
                Edit
              </Button>
            </Box>
            <Box textAlign={"right"} hidden={!users.deleteUser}>
              <Button
                leftIcon={<DeleteIcon />}
                bgColor={userCheckData.length <= 0 ? "gray" : "red.400"}
                onClick={onUserDeleteAlertOpen}
                isDisabled={userCheckData.length <= 0}
                color={"white"}
                _hover={{}}
                _disabled={{ bgColor: "red.400", cursor: "not-allowed" }}
              >
                Delete
              </Button>
            </Box>
          </Flex>
        </Flex>
        <TableContainer mt={"50px"}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>
                  <Center>Name</Center>
                </Th>
                <Th>
                  <Center>E-mail</Center>
                </Th>
                <Th>
                  <Center>Mobile No</Center>
                </Th>
                <Th>
                  <Center>Role</Center>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {productData?.data?.map((ele, i) => {
                const isChecked = userCheckData.some(
                  (user) => user._id === ele._id
                );

                return (
                  <Tr key={i}>
                    <Td>
                      <Flex gap={"10px"}>
                        <Center>
                          {ele.administration === "admin" &&
                          user.administration !== "admin" ? null : (
                            <Checkbox
                              border={"0px solid black"}
                              isChecked={isChecked}
                              onChange={(e) => handleCheck(ele, e)}
                            />
                          )}
                        </Center>
                        <Center>{capitalizeWords(ele.name)}</Center>
                      </Flex>
                    </Td>
                    <Td>
                      <Center>{ele.email}</Center>
                    </Td>
                    <Td>
                      <Center>{ele.mobile}</Center>
                    </Td>
                    <Td>
                      <Box>
                        <Center>
                          <Text textAlign={"left"}>
                            {ele.administration === ""
                              ? "User"
                              : capitalizeWords(ele.administration)}
                          </Text>
                        </Center>
                      </Box>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          gap={"10px"}
          hidden={productData?.data?.length <= 0}
        >
          <Button
            _hover={{}}
            onClick={() => setPage((res) => res - 1)}
            isDisabled={page === 1}
          >
            <GrFormPreviousLink />
          </Button>
          <Flex gap={"4px"}>
            <Center>Page</Center>

            <Input
              onChange={(e) => handleTypePage(e)}
              onKeyDown={handleKeyDown}
              variant={"unstyled"}
              textIndent={"6px"}
              w={"30px"}
              h={"30px"}
              defaultValue={page}
              border={"1px solid black"}
            />
            <Center>out of {productData?.maxPage}</Center>
          </Flex>
          {/* <Box>Page {page} out of {max}</Box> */}
          <Button
            _hover={{}}
            onClick={() => setPage((res) => res + 1)}
            isDisabled={page >= productData.maxPage}
          >
            <GrFormNextLink />
          </Button>
        </Flex>
      </Box>
    </Dashboard>
  );
};

export default UserList;