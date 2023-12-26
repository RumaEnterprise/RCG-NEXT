"use client";
import {
  Box,
  Flex,
  Button,
  Checkbox,
  Input,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useToast,
  MenuDivider,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupon } from "../../../Redux/AppReducer/Action";
import { AddIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import Loading from "../../../Components/Loading";
import Refresh from "../../../Components/Admin/Refresh";
const Coupons = () => {
  const dispatch = useDispatch();
  const loading = useSelector((store) => store.app.isCouponLoading);
  const coupons = useSelector((store) => store.app.coupons);
  const token = useSelector((store) => store.auth.token);
  const user = useSelector((store) => store.auth.user);
  const toast = useToast();
  const getCoupon = () => {
    dispatch(getAllCoupon({ token: token }));
  };

  const createCoupon = () => {
    try {
      const couponname = coupons.filter((ele) => ele.code == newCoupon.code);
      if (
        newCoupon.cartValue == "" ||
        newCoupon.code == "" ||
        newCoupon.category.length <= 0 ||
        newCoupon.discount == "" ||
        newCoupon.discountType == "" ||
        newCoupon.status == "" ||
        newCoupon.startDate == "" ||
        newCoupon.endDate == "" ||
        newCoupon.quantity == ""
      ) {
        toast({
          title: "Fill all fields",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else if (couponname.length > 0) {
        toast({
          title: `Coupon code already exist`,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      } else if (newCoupon.discountType == "Rs" && newCoupon.discount < 10) {
        toast({
          title: `Discount should be more than Rs. 10`,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      } else if (newCoupon.discountType == "%" && newCoupon.discount <= 1) {
        toast({
          title: `Discount should be more than 1%`,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      } else {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/create`,
            newCoupon,
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
            setNewCoupon({
              cartValue: "",
              code: "",
              category: [],
              discount: "",
              discountType: "",
              status: "",
              startDate: "",
              endDate: "",
            });
            dispatch(getAllCoupon({ token: token }));
          })
          .catch((err) => {
            toast({
              title: err.response.data.msg,
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          });
      }
    } catch (error) {}
  };
  const [newCoupon, setNewCoupon] = useState({
    cartValue: "",
    code: "",
    category: [],
    discount: "",
    discountType: "%",
    quantity: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const handleStatusUpdate = (e, code) => {
    try {
      axios
        .patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/update/${code}`,
          { status: e.target.value },
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
          dispatch(getAllCoupon({ token: token }));
        })
        .catch((err) => {
          toast({
            title: err.response.data.msg,
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleNewCoupon = (e) => {
    const { name, value, type, checked } = e.target;
    let temp = { ...newCoupon };
    if (type === "checkbox") {
      let category = temp.category;
      if (checked) {
        if (value == "all") {
          let allCategory = [
            "classic",
            "premium",
            "gift",
            "wedding",
            "casual",
            "partywear",
            "combo",
          ];
          setNewCoupon({ ...newCoupon, category: allCategory });
        } else {
          category.push(value);
          setNewCoupon({ ...newCoupon, category: category });
        }
      } else {
        if (value == "all") {
          let allCategory = [];
          setNewCoupon({ ...newCoupon, category: allCategory });
        } else {
          let newData = category.filter((el) => el !== value);
          setNewCoupon({ ...newCoupon, category: newData });
        }
      }
    } else {
      temp[name] = value;
      setNewCoupon(temp);
    }
  };
  const [id, setID] = useState([]);
  const [hide, setHide] = useState(true);
  useEffect(() => {
    getCoupon();
  }, [dispatch, token]);
  const handleSKU = (status, sku) => {
    if (status) {
      setID([...id, sku]);
    } else {
      let temp = [...id];
      temp = temp.filter((el) => el !== sku);
      setID(temp);
    }
  };
  const handleCouponDelete = () => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/delete`, id, {
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
          setID([]);
          dispatch(getAllCoupon({ token: token }));
        });
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return <Loading load={loading} />;
  }
  return (
    <Dashboard>
      <Flex
        justifyContent={"space-between"}
        position={"fixed"}
        right={"0"}
        top={"20"}
        zIndex={"100"}
        p={"10px"}
        mr={"16px"}
        w={"82%"}
      >
        <Refresh refresh={getCoupon} />
        <Flex gap={"10px"}>
          <Box textAlign={"right"}>
            <Button
              hidden={!user.deleteCoupon}
              leftIcon={<DeleteIcon />}
              onClick={handleCouponDelete}
              colorScheme="red"
              isDisabled={id.length <= 0}
              _disabled={{ bgColor: "gray", cursor: "not-allowed" }}
              _hover={{
                bgColor: id.length <= 0 ? "gray" : "red",
                cursor: id.length <= 0 ? "not-allowed" : "",
              }}
            >
              Delete
            </Button>
          </Box>
          <Box textAlign={"right"}>
            <Button
              hidden={!user.addCoupon}
              leftIcon={<AddIcon />}
              colorScheme="green"
              onClick={() => setHide(!hide)}
              isDisabled={id.length > 0}
              _disabled={{ bgColor: "gray", cursor: "not-allowed" }}
              _hover={{
                bgColor: id.length > 0 ? "gray" : "green",
                cursor: id.length > 0 ? "not-allowed" : "",
              }}
            >
              Create
            </Button>
          </Box>
          <Box textAlign={"right"} hidden={hide}>
            <Button
              leftIcon={<AiOutlineCloudUpload />}
              minW={"100px"}
              colorScheme="green"
              onClick={createCoupon}
              isDisabled={
                newCoupon.cartValue == "" ||
                newCoupon.code == "" ||
                newCoupon.category.length <= 0 ||
                newCoupon.discount == "" ||
                newCoupon.discountType == "" ||
                newCoupon.status == "" ||
                newCoupon.startDate == "" ||
                newCoupon.endDate == ""
              }
              _disabled={{ bgColor: "gray", cursor: "not-allowed" }}
              _hover={{
                bgColor:
                  newCoupon.cartValue == "" ||
                  newCoupon.code == "" ||
                  newCoupon.category.length <= 0 ||
                  newCoupon.discount == "" ||
                  newCoupon.discountType == "" ||
                  newCoupon.status == "" ||
                  newCoupon.startDate == "" ||
                  newCoupon.endDate == ""
                    ? "gray"
                    : "green",
                cursor:
                  newCoupon.cartValue == "" ||
                  newCoupon.code == "" ||
                  newCoupon.category.length <= 0 ||
                  newCoupon.discount == "" ||
                  newCoupon.discountType == "" ||
                  newCoupon.status == "" ||
                  newCoupon.startDate == "" ||
                  newCoupon.endDate == ""
                    ? "not-allowed"
                    : "",
              }}
            >
              Add
            </Button>
          </Box>
        </Flex>
      </Flex>
      <table style={{ width: "100%", marginTop: "60px" }}>
        <thead style={{ padding: "10px", height: "40px" }}>
          <tr
            style={{
              position: "sticky",
              backgroundColor: "white",
              top: 0,
              zIndex: 99,
              backgroundColor: "blue",
              color: "white",
            }}
          >
            <td>Code</td>
            <td>Category</td>
            <td>Discount</td>
            <td>Order amount</td>
            <td>Quantity</td>
            <td>Usage</td>
            <td>Status</td>
            <td>Start Date</td>
            <td>End Date</td>
          </tr>
        </thead>
        <tbody>
          {coupons?.map((ele) => {
            return (
              <tr>
                <td w={"150px"}>
                  <Flex gap={"10px"}>
                    <Checkbox
                      border={"0px solid gray"}
                      onChange={(event) =>
                        handleSKU(event.target.checked, ele._id)
                      }
                    />
                    <Center>{ele.code}</Center>
                  </Flex>
                </td>
                <td w={"110px"}>
                  <Menu closeOnSelect={false} border={"1px solid gray"}>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      See all
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <Flex gap={"15px"}>
                          <Checkbox
                            readOnly
                            isChecked={ele.category.includes("classic")}
                            border={"0px solid black"}
                            name="category"
                            value="classic"
                            onChange={(e) => handleNewCoupon(e)}
                          />
                          <Text>Classic</Text>
                        </Flex>
                      </MenuItem>
                      <MenuItem>
                        <Flex gap={"15px"}>
                          <Checkbox
                            readOnly
                            isChecked={ele.category.includes("premium")}
                            border={"0px solid black"}
                            name="category"
                            value="premium"
                            onChange={(e) => handleNewCoupon(e)}
                          />
                          <Text>Premium</Text>
                        </Flex>
                      </MenuItem>
                      <MenuItem>
                        <Flex gap={"15px"}>
                          <Checkbox
                            readOnly
                            isChecked={ele.category.includes("gift")}
                            border={"0px solid black"}
                            name="category"
                            value="gift"
                            onChange={(e) => handleNewCoupon(e)}
                          />
                          <Text>Gift</Text>
                        </Flex>
                      </MenuItem>
                      <MenuItem>
                        <Flex gap={"15px"}>
                          <Checkbox
                            readOnly
                            isChecked={ele.category.includes("wedding")}
                            border={"0px solid black"}
                            name="category"
                            value="wedding"
                            onChange={(e) => handleNewCoupon(e)}
                          />
                          <Text>Wedding</Text>
                        </Flex>
                      </MenuItem>
                      <MenuItem>
                        <Flex gap={"15px"}>
                          <Checkbox
                            readOnly
                            isChecked={ele.category.includes("casual")}
                            border={"0px solid black"}
                            name="category"
                            value="casual"
                            onChange={(e) => handleNewCoupon(e)}
                          />
                          <Text>Casual</Text>
                        </Flex>
                      </MenuItem>
                      <MenuItem>
                        <Flex gap={"15px"}>
                          <Checkbox
                            readOnly
                            isChecked={ele.category.includes("partywear")}
                            border={"0px solid black"}
                            name="category"
                            value="partywear"
                            onChange={(e) => handleNewCoupon(e)}
                          />
                          <Text>Partywear</Text>
                        </Flex>
                      </MenuItem>
                      <MenuItem>
                        <Flex gap={"15px"}>
                          <Checkbox
                            readOnly
                            isChecked={ele.category.includes("combo")}
                            border={"0px solid black"}
                            name="category"
                            value="combo"
                            onChange={(e) => handleNewCoupon(e)}
                          />
                          <Text>Combo</Text>
                        </Flex>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
                <td w={"125px"}>
                  {" "}
                  {ele.discountType == "%"
                    ? `${ele.discount} ${ele.discountType}`
                    : `${ele.discountType}. ${ele.discount}`}
                </td>
                <td>Rs. {ele.cartValue}</td>
                <td> {ele.quantity}</td>
                <td>{ele.usedCount}</td>
                <td w={"120px"}>
                  <Select
                    defaultValue={ele.status}
                    onChange={(e) => handleStatusUpdate(e, ele.code)}
                  >
                    <option value={"active"}>Active</option>
                    <option value={"inactive"}>Inactive</option>
                  </Select>
                </td>
                <td w={"170px"}>{ele.startDate}</td>
                <td w={"250px"}>{ele.endDate}</td>
              </tr>
            );
          })}
          {!hide ? (
            <tr>
              <td>
                <Input
                  value={newCoupon.code}
                  w={"150px"}
                  _hover={{ border: "1px solid gray" }}
                  name="code"
                  border={"1px solid gray"}
                  placeholder="Code"
                  maxLength={20}
                  onChange={(e) => handleNewCoupon(e)}
                />
              </td>
              <td>
                <Menu closeOnSelect={false} border={"1px solid gray"}>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Select
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <Flex gap={"15px"}>
                        <Checkbox
                          isChecked={newCoupon?.category.includes("classic")}
                          border={"0px solid black"}
                          name="category"
                          value="classic"
                          onChange={(e) => handleNewCoupon(e)}
                        />
                        <Text>Classic</Text>
                      </Flex>
                    </MenuItem>
                    <MenuItem>
                      <Flex gap={"15px"}>
                        <Checkbox
                          isChecked={newCoupon?.category.includes("premium")}
                          border={"0px solid black"}
                          name="category"
                          value="premium"
                          onChange={(e) => handleNewCoupon(e)}
                        />
                        <Text>Premium</Text>
                      </Flex>
                    </MenuItem>
                    <MenuItem>
                      <Flex gap={"15px"}>
                        <Checkbox
                          isChecked={newCoupon?.category.includes("gift")}
                          border={"0px solid black"}
                          name="category"
                          value="gift"
                          onChange={(e) => handleNewCoupon(e)}
                        />
                        <Text>Gift</Text>
                      </Flex>
                    </MenuItem>
                    <MenuItem>
                      <Flex gap={"15px"}>
                        <Checkbox
                          isChecked={newCoupon?.category.includes("wedding")}
                          border={"0px solid black"}
                          name="category"
                          value="wedding"
                          onChange={(e) => handleNewCoupon(e)}
                        />
                        <Text>Wedding</Text>
                      </Flex>
                    </MenuItem>
                    <MenuItem>
                      <Flex gap={"15px"}>
                        <Checkbox
                          isChecked={newCoupon?.category.includes("casual")}
                          border={"0px solid black"}
                          name="category"
                          value="casual"
                          onChange={(e) => handleNewCoupon(e)}
                        />
                        <Text>Casual</Text>
                      </Flex>
                    </MenuItem>
                    <MenuItem>
                      <Flex gap={"15px"}>
                        <Checkbox
                          isChecked={newCoupon?.category.includes("partywear")}
                          border={"0px solid black"}
                          name="category"
                          value="partywear"
                          onChange={(e) => handleNewCoupon(e)}
                        />
                        <Text>Partywear</Text>
                      </Flex>
                    </MenuItem>
                    <MenuItem>
                      <Flex gap={"15px"}>
                        <Checkbox
                          isChecked={newCoupon?.category.includes("combo")}
                          border={"0px solid black"}
                          name="category"
                          value="combo"
                          onChange={(e) => handleNewCoupon(e)}
                        />
                        <Text>Combo</Text>
                      </Flex>
                    </MenuItem>
                    <MenuDivider color={"black"} />
                    <MenuItem>
                      <Flex gap={"15px"}>
                        <Checkbox
                          isChecked={newCoupon?.category.length >= 7}
                          border={"0px solid black"}
                          name="category"
                          value="all"
                          onChange={(e) => handleNewCoupon(e)}
                        />
                        <Text>Select All</Text>
                      </Flex>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </td>
              <td>
                <Flex
                  border={"1px solid gray"}
                  w={"150px"}
                  p={"7px 5px"}
                  borderRadius={"5px"}
                >
                  <Input
                    value={newCoupon.discount}
                    w={"130px"}
                    variant={"unstyled"}
                    _hover={{ border: "0px solid gray" }}
                    name="discount"
                    type="number"
                    border={"0px solid gray"}
                    placeholder="Discount"
                    onChange={(e) => handleNewCoupon(e)}
                  />
                  <Select
                    w={"80px"}
                    value={newCoupon.discountType}
                    name="discountType"
                    onChange={(e) => handleNewCoupon(e)}
                    variant={"unstyled"}
                  >
                    <option defaultChecked value="%">
                      %
                    </option>
                    <option value="Rs">Rs</option>
                  </Select>
                </Flex>
              </td>
              <td>
                <Input
                  value={newCoupon.cartValue}
                  _hover={{ border: "1px solid gray" }}
                  name="cartValue"
                  type="number"
                  border={"1px solid gray"}
                  placeholder="Amount"
                  onChange={(e) => handleNewCoupon(e)}
                />
              </td>
              <td>
                <Input
                  value={newCoupon.quantity}
                  _hover={{ border: "1px solid gray" }}
                  name="quantity"
                  type="number"
                  border={"1px solid gray"}
                  placeholder="Quantity"
                  onChange={(e) => handleNewCoupon(e)}
                />
              </td>
              <td>
                <Select
                  value={newCoupon.status}
                  _hover={{ border: "1px solid gray" }}
                  border={"1px solid gray"}
                  w={"100px"}
                  name="status"
                  onChange={(e) => handleNewCoupon(e)}
                >
                  <option hidden>Status</option>
                  <option value={"active"}>Active</option>
                  <option value={"inactive"}>Inactive</option>
                </Select>
              </td>
              <td>
                <Input
                  value={newCoupon.startDate}
                  _hover={{ border: "1px solid gray" }}
                  name="startDate"
                  border={"1px solid gray"}
                  placeholder="Date From"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleNewCoupon(e)}
                />
              </td>
              <td>
                <Input
                  isDisabled={newCoupon.startDate === ""}
                  value={newCoupon.endDate}
                  _hover={{ border: "1px solid gray" }}
                  name="endDate"
                  border={"1px solid gray"}
                  placeholder="To Date"
                  type="date"
                  min={newCoupon.startDate}
                  onChange={(e) => handleNewCoupon(e)}
                />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <Flex direction={"column"}>
        <Flex
          gap={"15px"}
          w={"100%"}
          alignItems={"center"}
          mt={"20px"}
          hidden={hide}
        ></Flex>
      </Flex>
    </Dashboard>
  );
};

export default Coupons;