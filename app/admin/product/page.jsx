"use client";
import React, { useEffect, useRef, useState } from "react";
import Dashboard from "../Dashboard";
import axios from "axios";
import {
  Box,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Input,
  Image,
  Textarea,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
  Center,
  Checkbox,
  Select,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { RiDownloadFill } from "react-icons/ri";
import default_product_image from "../../../Resources/default_product_image.png";
import view_test from "../../../Resources/view_test.png";
import { categoryList, colorList } from "../../../universal_variable";
import {
  deleteProduct,
  getProduct,
  searchProduct,
  updateProduct,
} from "../../../Redux/AppReducer/Action";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import Loading from "../../../../../Components/Loading.jsx";
import SingleProductModal from "../../../../../Components/Admin/SingleProductModal";
import { FiSearch } from "react-icons/fi";
import { capitalizeWords } from "../../../../../Components/capital";
import Refresh from "../../../../../Components/Admin/Refresh";
import { MdClose } from "react-icons/md";
import { getAllCourier } from "../../../Redux/ShipReducer/Action.js";
import Link from "next/link";
const Product = () => {
  
  const isValidImageUrl = async (url) => {
    return axios
      .get(url)
      .then((response) => {
        console.log(response.status, url);
        if (response.status === 200) {
          return url;
        } else {
          return default_product_image.src;
        }
      })
      .catch(() => {
        return default_product_image.src;
      });
  };
  const handleOpenEdit = () => {
    document.body.style.cursor = "wait";
    setSelectedImage([]);
    let dummy = [1, 2, 3, 4];
    const imgArray = [];
    dummy.forEach((ele) => {
      let path = `${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${SKU[0]?.skuID}-${ele}.jpg`;
      isValidImageUrl(path).then((res) => {
        imgArray[ele - 1] = res;
      });
    });
    setdisplayImage(imgArray);
    let sellingPrice =
      Number(SKU[0].price) -
      (Number(SKU[0].price) * Number(SKU[0].discount)) / 100;
    SKU[0].sellingPrice = sellingPrice;
    setCalculatedDiscount(SKU[0].discount);
    setTimeout(() => {
      document.body.style.cursor = "auto";
      onOpenEdit();
    }, 2000);
  };
  const handleOpenAdd = () => {
    onOpenAdd();
    setSelectedImage([]);
    setCalculatedDiscount(0);
    setdisplayImage([
      default_product_image.src,
      default_product_image.src,
      default_product_image.src,
      default_product_image.src,
    ]);
  };
  const toast = useToast();
  const title = useRef(null);
  const discount = useRef(null);
  const price = useRef(null);
  const description = useRef(null);
  const loading = useSelector((store) => store.app.isProductUpdateLoading);
  const color = useRef(null);
  const skuID = useRef(null);
  const category = useRef(null);
  const tag = useRef(null);
  const quantity = useRef(null);
  const [searchBarText, setSearchBarText] = useState("");
  const [calculatedDiscount, setCalculatedDiscount] = useState(0);
  const productData = useSelector((store) => store.app.products);
  const load = useSelector((store) => store.app.isProductLoading);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [typePage, setTypePage] = useState(0);
  const token = useSelector((store) => store.auth.token);
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState([]);
  const [SKU, setSKU] = useState([]);
  const [singleProduct, setSingleProduct] = useState({});
  const [sameSKU, setsameSKU] = useState(false);
  const [api, setapi] = useState("product");
  const [editLoading, setLoad] = useState(false);
  const [displayImage, setdisplayImage] = useState([]);
  const [disable, setDisable] = useState(true);
  const [sortBy, setSortBy] = useState({ field: "_id", order: "-1" });
  const [instantUpdate, setInstantUpdate] = useState([]);
  const modifiedByGen = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
    const formsttedDate = `${day}-${month}-${year}`;
    const uploaddata = {
      date: formsttedDate,
      time: formattedTime,
      name: user.name,
    };
    return JSON.stringify(uploaddata);
  };
  const fetchProduct = () => {
    const payload = {
      text: searchBarText,
      token: token,
      limit: limit,
      page: page,
    };
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/adminsearch?search=${payload.text}&limit=${payload.limit}&page=${payload.page}&sortBy=${sortBy.field}&order=${sortBy.order}`;
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
      dispatch(getProduct({ limit: limit, page: page, sortBy: sortBy }, toast));
    }
  };
  const handleUpdateInstantUpdate = (e, sku) => {
    const { name, value } = e.target;
    let payload = [...instantUpdate];
    let dataUpload = modifiedByGen();
    const lastModified = dataUpload;
    let pos = payload
      .map((ele) => {
        return ele.skuID;
      })
      .indexOf(sku);
    if (pos !== -1) {
      payload[pos].lastModified = lastModified;
      payload[pos][name] = value;
    } else {
      let temp = {
        lastModified: lastModified,
        skuID: sku,
      };
      temp[name] = value;
      payload.push(temp);
    }
    setInstantUpdate(payload);
  };
  const instantHidden = (sku) => {
    let pos = instantUpdate
      .map((ele) => {
        return ele.skuID;
      })
      .indexOf(sku);
    return pos === -1;
  };
  useEffect(() => {
    const checkClipboardPermission = async () => {
      try {
        const result = await navigator.permissions.query({
          name: "clipboard-write",
        });

        if (result.state === "granted" || result.state === "prompt") {
        }
      } catch (error) {
        console.error("Error checking clipboard permission:", error);
      }
    };

    checkClipboardPermission();
  }, []);
  useEffect(() => {
    fetchProduct();
  }, [dispatch, toast, page, api, limit, sortBy]);
  const handleTypePage = (e) => {
    setTypePage(e.target.value);
  };
  const handleSearch = (e) => {
    try {
      let text = e.target.value;
      setSearchBarText(text);
      if (text == "" && api == "search") {
        setapi("product");
      }
    } catch (error) {
      console.log(error);
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
  const updatedNewDiscount = (e) => {
    const { name, value } = e.target;
    let mrp;
    let sell;
    if (name == "price") {
      mrp = value;
      sell = discount?.current?.value;
    } else {
      mrp = price?.current?.value;
      sell = value;
    }
    if (mrp !== "" || sell !== "") {
      mrp = Number(mrp);
      sell = Number(sell);
      const newDiscont = ((mrp - sell) / mrp) * 100;
      if (newDiscont < 0) {
        e.target.value = Number(e.target.value / 10).toFixed(0);
        toast({
          title: "Selling price can not more than MRP",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setCalculatedDiscount(newDiscont.toFixed(2));
      }
    }
  };
  const handleOpenStatus = (skuID) => {
    handleSKU(true, skuID);
    setTimeout(() => {
      onOpenStatus();
    }, 1000);
  };
  const handleUpdateProduct = () => {
    let dele;
    setLoad(true);
    let dataUpload = modifiedByGen();
    const formData = new FormData();
    for (let i = 0; i < selectedImage.length; i++) {
      formData.append(
        "myFile",
        selectedImage[i].pic,
        `${selectedImage[i].position}.jpg`
      );
    }
    dele = displayImage.map((ele) => {
      if (ele == default_product_image.src) {
        return false;
      } else {
        return true;
      }
    });
    formData.append("removeImage", JSON.stringify(dele));

    if (title.current.value !== "") {
      formData.append("title", title.current.value);
    }
    if (price.current.value !== "") {
      formData.append("price", Number(price.current.value));
    }
    if (description.current.value !== "") {
      formData.append("description", description.current.value);
    }
    if (quantity.current.value !== "") {
      formData.append("quantity", quantity.current.value);
    }
    if (color.current.value !== "") {
      formData.append("color", color.current.value);
    }
    if (category.current.value !== "") {
      formData.append("category", category.current.value);
    }
    if (discount.current.value !== "") {
      formData.append("discount", calculatedDiscount);
    }
    if (tag.current.value !== "") {
      formData.append("tag", tag.current.value);
    }
    formData.append("lastModified", JSON.stringify(dataUpload));
    console.log(dele.indexOf(true) == -1);
    if (dele.indexOf(true) == -1) {
      toast({
        title: "You must upload minimum 1 product image",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    } else {
      dispatch(updateProduct(formData, toast, SKU[0].skuID, token));
      onCloseEdit();
      fetchProduct();
      setLoad(false);
      setSelectedImage([]);
      setSKU([]);
    }
  };
  const handleAddProduct = () => {
    let err = "";
    if (skuID.current.value == "") {
      err = "SKUID";
    } else if (title.current.value == "") {
      err = "Title";
    } else if (price.current.value == "" || discount.current.value == "") {
      err = "MRP/Selling Price";
    } else if (description.current.value == "") {
      err = "Description";
    } else if (quantity.current.value == "") {
      err = "Quantity";
    } else if (color.current.value == "") {
      err = "Color";
    } else if (category.current.value == "") {
      err = "Category";
    } else if (tag.current.value == "") {
      err = "Tag";
    } else if (selectedImage.length <= 0) {
      err = "Image";
    }
    if (err == "") {
      setLoad(true);
      let dataUpload = modifiedByGen();
      const formData = new FormData();
      for (let i = 0; i < selectedImage.length; i++) {
        formData.append(
          "myFile",
          selectedImage[i].pic,
          `${selectedImage[i].position}.jpg`
        );
      }
      formData.append("title", title.current.value);
      formData.append("price", Number(price.current.value));
      formData.append("description", description.current.value);
      formData.append("quantity", quantity.current.value);
      formData.append("skuID", skuID.current.value);
      formData.append("color", color.current.value);
      formData.append("tag", tag.current.value);
      formData.append("category", category.current.value);
      formData.append("discount", calculatedDiscount);
      formData.append("createdBy", dataUpload);
      formData.append("lastModified", dataUpload);

      // for (const value of formData.values()) {
      //   console.log(value);
      // }

      try {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/create/${skuID.current.value}`,
            formData,
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
              duration: 3000,
              isClosable: true,
            });
            setLoad(false);
            setSelectedImage([]);
            setCalculatedDiscount(0);
            title.current.value = "";
            price.current.value = "";
            description.current.value = "";
            quantity.current.value = "";
            skuID.current.value = "";
            color.current.value = "";
            category.current.value = "";
            discount.current.value = "";
            setSKU([]);
            fetchProduct();
            onCloseAdd();
          })
          .catch((err) => {
            setLoad(false);
            toast({
              title: err.response.data.msg,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast({
        title: `${err} is empty`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleDelete = () => {
    const tempSKU = SKU.map((ele) => {
      return ele.skuID;
    });
    const payload = {
      products: tempSKU,
    };
    dispatch(deleteProduct(payload, toast, token));
    onCloseDelete();
    dispatch(getProduct({ limit: 9, page: page }, toast));
    setSKU([]);
  };

  const handleSKU = (status, sku) => {
    const sdata = productData?.data.filter((el) => el.skuID === sku);
    if (status) {
      setSKU([...SKU, ...sdata]);
    } else {
      let temp = [...SKU];
      temp = temp.filter((el) => el.skuID !== sku);
      setSKU(temp);
    }
  };
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const {
    isOpen: isOpenSingle,
    onOpen: onOpenSingle,
    onClose: onCloseSingle,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenStatus,
    onOpen: onOpenStatus,
    onClose: onCloseStatus,
  } = useDisclosure();
  const handleSortBy = (e) => {
    const field = e.split("-")[0];
    let order = e.split("-")[1];
    if (order == "h2l") {
      order = -1;
    } else {
      order = 1;
    }
    setSortBy({ field: field, order: order });
  };
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const handleSubmitStatus = (status) => {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/status?sku=${SKU[0]._id}&status=${status}`,
        {},
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
        fetchProduct();
        setSKU([]);
        onCloseStatus();
      })
      .catch((err) => {
        toast({
          title: err.response.data.msg,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        onCloseStatus();
      });
  };
  const handleSingleProduct = (data) => {
    document.body.style.cursor = "wait";
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/single/${data.skuID}`,
        {
          headers: {
            "X-Frontend-URL": window.location.pathname,
          },
        }
      )
      .then((res) => {
        document.body.style.cursor = "default";
        setSingleProduct(res.data);
        onOpenSingle();
      })
      .catch((err) => {});
  };
  const handleImageUpload = (event, pos) => {
    let pics = selectedImage;
    let blob = [...displayImage];
    if (event.target.files[0] !== undefined) {
      pics[selectedImage.length] = {
        pic: event.target.files[0],
        position: pos + 1,
      };
      blob[pos] = URL.createObjectURL(event.target.files[0]);
      setSelectedImage(pics);
      setdisplayImage(blob);
      event.target.value = "";
    }
  };
  const handleDeleteImage = (e, pos) => {
    e.preventDefault();
    let pics = selectedImage.filter((ele, i) => i !== pos);
    let blob = [...displayImage];
    URL.revokeObjectURL(blob[pos]);
    blob[pos] = default_product_image.src;
    setSelectedImage(pics);
    setdisplayImage(blob);
  };
  let id;
  const handleCheckSKU = (e) => {
    try {
      clearTimeout(id);
      id = setTimeout(() => {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/checksku`,
            {
              skuID: e.target.value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setsameSKU(res.data.status);
            setDisable(res.data.status);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const submitInstantUpdate = (skuID = "empty") => {
    let newData;
    if (skuID == "empty") {
      newData = instantUpdate;
    } else {
      newData = instantUpdate.filter((ele) => ele.skuID == skuID);
    }
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/bulkupdate`,
        { data: newData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSKU([]);
        if (skuID == "empty") {
          setInstantUpdate([]);
        } else {
          newData = instantUpdate.filter((ele) => ele.skuID !== skuID);
          if (newData.length > 0) {
            setInstantUpdate(newData);
          } else {
            setInstantUpdate([]);
          }
        }
        fetchProduct();
        toast({
          title: res.data.msg,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((err) => {
        setSKU([]);
        fetchProduct();
        toast({
          title: err.response.data.msg,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };
  if (load || loading) {
    return <Loading load={load} />;
  }
  return (
    <Dashboard>
      <Box fontSize={"12px"}>
        <SingleProductModal
          isOpen={isOpenSingle}
          onClose={onCloseSingle}
          data={singleProduct}
        />
        <AlertDialog
          motionPreset="slideInBottom"
          onClose={onCloseDelete}
          isOpen={isOpenDelete}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>Delete Product?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete all of your selected product?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onCloseDelete}>No</Button>
              <Button colorScheme="red" ml={3} onClick={handleDelete}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog
          motionPreset="slideInBottom"
          onClose={() => {
            setSKU([]);
            onCloseStatus();
          }}
          isOpen={isOpenStatus}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>Change Product Status?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Center>{SKU.length} will be modified.</Center>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                isDisabled={SKU[0]?.status == "inactive"}
                onClick={() => handleSubmitStatus("inactive")}
                colorScheme="red"
                ml={3}
              >
                Inactive
              </Button>
              <Button
                isDisabled={SKU[0]?.status == "active"}
                colorScheme="green"
                ml={3}
                onClick={() => handleSubmitStatus("active")}
              >
                Active
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Modal isOpen={isOpenAdd} onClose={onCloseAdd} size={"xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text color={"red"} mb={"10px"}>
                * Choose your main image first
              </Text>
              <SimpleGrid columns={"2"} gap={"20px"}>
                <Flex justifyContent={"space-between"}>
                  <Box>
                    <Input
                      id="fileInput"
                      display={"none"}
                      type="file"
                      onChange={(event) => handleImageUpload(event, 0)}
                      name="myFile"
                    />
                    <label htmlFor="fileInput">
                      <Box cursor="pointer" position="relative" h="100px">
                        <Image
                          src={displayImage[0]}
                          alt="Default Image"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <Box
                          hidden={
                            displayImage[0] == default_product_image.src
                              ? true
                              : false
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          position="absolute"
                          top="5px"
                          right="5px"
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          backgroundColor="white"
                        >
                          <Icon
                            opacity={"1"}
                            pointerEvents="auto"
                            onClick={(e) => handleDeleteImage(e, 0)}
                            as={MdClose}
                            color="red"
                            cursor="pointer"
                          />
                        </Box>
                      </Box>
                    </label>
                  </Box>
                  <Box>
                    <Input
                      id="fileInput1"
                      display={"none"}
                      type="file"
                      onChange={(event) => handleImageUpload(event, 1)}
                      name="myFile"
                    />
                    <label htmlFor="fileInput1">
                      <Box cursor="pointer" position="relative" h="100px">
                        <Image
                          src={displayImage[1]}
                          alt="Default Image"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <Box
                          hidden={
                            displayImage[1] == default_product_image.src
                              ? true
                              : false
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          position="absolute"
                          top="5px"
                          right="5px"
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          backgroundColor="white"
                        >
                          <Icon
                            opacity={"1"}
                            pointerEvents="auto"
                            onClick={(e) => handleDeleteImage(e, 1)}
                            as={MdClose}
                            color="red"
                            cursor="pointer"
                          />
                        </Box>
                      </Box>
                    </label>
                  </Box>
                </Flex>
                <Flex justifyContent={"space-between"}>
                  <Box>
                    <Input
                      id="fileInput2"
                      display={"none"}
                      type="file"
                      onChange={(event) => handleImageUpload(event, 2)}
                      name="myFile"
                    />
                    <label htmlFor="fileInput2">
                      <Box cursor="pointer" position="relative" h="100px">
                        <Image
                          src={displayImage[2]}
                          alt="Default Image"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <Box
                          hidden={
                            displayImage[2] == default_product_image.src
                              ? true
                              : false
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          position="absolute"
                          top="5px"
                          right="5px"
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          backgroundColor="white"
                        >
                          <Icon
                            opacity={"1"}
                            pointerEvents="auto"
                            onClick={(e) => handleDeleteImage(e, 2)}
                            as={MdClose}
                            color="red"
                            cursor="pointer"
                          />
                        </Box>
                      </Box>
                    </label>
                  </Box>
                  <Box>
                    <Input
                      id="fileInput3"
                      display={"none"}
                      type="file"
                      onChange={(event) => handleImageUpload(event, 3)}
                      name="myFile"
                    />
                    <label htmlFor="fileInput3">
                      <Box cursor="pointer" position="relative" h="100px">
                        <Image
                          src={displayImage[3]}
                          alt="Default Image"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <Box
                          hidden={
                            displayImage[3] == default_product_image.src
                              ? true
                              : false
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          position="absolute"
                          top="5px"
                          right="5px"
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          backgroundColor="white"
                        >
                          <Icon
                            opacity={"1"}
                            pointerEvents="auto"
                            onClick={(e) => handleDeleteImage(e, 3)}
                            as={MdClose}
                            color="red"
                            cursor="pointer"
                          />
                        </Box>
                      </Box>
                    </label>
                  </Box>
                </Flex>
                <Tooltip label="Title">
                  <Input
                    ref={title}
                    type="text"
                    placeholder="Title"
                    disabled={disable}
                    _hover={{}}
                    border={"1px solid black"}
                  />
                </Tooltip>
                <Tooltip label="SKU ID">
                  <Box>
                    <Input
                      ref={skuID}
                      type="text"
                      placeholder="sku ID"
                      onChange={(e) => handleCheckSKU(e)}
                      _hover={{}}
                      border={"1px solid black"}
                    />
                    <Text fontSize={"13px"} color={"red"} hidden={!sameSKU}>
                      SKU Already Exist
                    </Text>
                  </Box>
                </Tooltip>
                <Tooltip label="Quantity">
                  <Input
                    ref={quantity}
                    type="number"
                    disabled={disable}
                    placeholder="Quantity"
                    _hover={{}}
                    border={"1px solid black"}
                  />
                </Tooltip>
                <Select
                  ref={color}
                  disabled={disable}
                  _hover={{}}
                  border={"1px solid black"}
                >
                  <option hidden>Color</option>
                  {colorList.map(({ name },i) => {
                    const value = name.split(" ").join("");
                    return (
                      <option key={i} value={value}>{capitalizeWords(name)}</option>
                    );
                  })}
                </Select>
                <Tooltip label="M.R.P">
                  <Input
                    name={"price"}
                    ref={price}
                    onChange={(e) => updatedNewDiscount(e)}
                    type="number"
                    placeholder="M.R.P"
                    disabled={disable}
                    _hover={{}}
                    border={"1px solid black"}
                  />
                </Tooltip>
                <Tooltip label="Category">
                  <Select
                    ref={category}
                    disabled={disable}
                    _hover={{}}
                    border={"1px solid black"}
                  >
                    <option hidden>Category</option>
                    {categoryList.map(({ name },i) => {
                      const value = name.split(" ").join("");
                      return (
                        <option key={i} value={value}>{capitalizeWords(name)}</option>
                      );
                    })}
                  </Select>
                </Tooltip>

                <Tooltip label="Description">
                  <Textarea
                    resize={"none"}
                    sx={{
                      "::-webkit-scrollbar": {
                        display: "none",
                      },
                    }}
                    ref={description}
                    placeholder="Description"
                    disabled={disable}
                    _hover={{}}
                    border={"1px solid black"}
                  />
                </Tooltip>
                <Flex gap={"10px"} direction={"column"}>
                  <Tooltip label="Selling Price">
                    <Input
                      name={"discount"}
                      _hover={{}}
                      onChange={(e) => updatedNewDiscount(e)}
                      border={"1px solid black"}
                      ref={discount}
                      type="number"
                      placeholder="Selling Price"
                      disabled={disable}
                    />
                  </Tooltip>
                  <Tooltip label="Tag">
                    <Select
                      ref={tag}
                      disabled={disable}
                      _hover={{}}
                      border={"1px solid black"}
                    >
                      <option hidden value={""}>
                        Tag
                      </option>
                      <option value={"classicPlain"}>Classic Plain</option>
                      <option value={"classicPrinted"}>Classic Printed</option>
                      <option value={"Premium"}>Premium</option>
                      <option value={"ultraPremium"}>U Premium</option>
                      <option value={"sqfs"}>SQFS</option>
                      <option value={"scps"}>SCPS</option>
                      <option value={"indianCan"}>INDIAN CAN</option>
                      <option value={"CateringPlain"}>Catering Plain</option>
                      <option value={"CateringPrinted"}>
                        Catering Printed
                      </option>
                    </Select>
                  </Tooltip>
                  <Box>Discount is: {calculatedDiscount}%</Box>
                </Flex>
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="green"
                mr={3}
                isLoading={editLoading}
                onClick={handleAddProduct}
              >
                Add
              </Button>
              <Button colorScheme="red" onClick={onCloseAdd}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenEdit} onClose={onCloseEdit} size={"xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text color={"red"} mb={"10px"}>
                * Fill the fields which you want to update
              </Text>
              <SimpleGrid columns={"2"} gap={"20px"}>
                <Flex justifyContent={"space-between"}>
                  <Box>
                    <Input
                      id="fileInput"
                      display={"none"}
                      type="file"
                      onChange={(event) => handleImageUpload(event, 0)}
                      name="myFile"
                    />
                    <label htmlFor="fileInput">
                      <Box cursor="pointer" position="relative" h="100px">
                        <Image
                          src={displayImage[0]}
                          alt="Default Image"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <Box
                          hidden={
                            displayImage[0] == default_product_image.src
                              ? true
                              : false
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          position="absolute"
                          top="5px"
                          right="5px"
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          backgroundColor="white"
                        >
                          <Icon
                            opacity={"1"}
                            pointerEvents="auto"
                            onClick={(e) => handleDeleteImage(e, 0)}
                            as={MdClose}
                            color="red"
                            cursor="pointer"
                          />
                        </Box>
                      </Box>
                    </label>
                  </Box>
                  <Box>
                    <Input
                      id="fileInput1"
                      display={"none"}
                      type="file"
                      onChange={(event) => handleImageUpload(event, 1)}
                      name="myFile"
                    />
                    <label htmlFor="fileInput1">
                      <Box cursor="pointer" position="relative" h="100px">
                        <Image
                          src={displayImage[1]}
                          alt="Default Image"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <Box
                          hidden={
                            displayImage[1] == default_product_image.src
                              ? true
                              : false
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          position="absolute"
                          top="5px"
                          right="5px"
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          backgroundColor="white"
                        >
                          <Icon
                            opacity={"1"}
                            pointerEvents="auto"
                            onClick={(e) => handleDeleteImage(e, 1)}
                            as={MdClose}
                            color="red"
                            cursor="pointer"
                          />
                        </Box>
                      </Box>
                    </label>
                  </Box>
                </Flex>
                <Flex justifyContent={"space-between"}>
                  <Box>
                    <Input
                      id="fileInput2"
                      display={"none"}
                      type="file"
                      onChange={(event) => handleImageUpload(event, 2)}
                      name="myFile"
                    />
                    <label htmlFor="fileInput2">
                      <Box cursor="pointer" position="relative" h="100px">
                        <Image
                          src={displayImage[2]}
                          alt="Default Image"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <Box
                          hidden={
                            displayImage[2] == default_product_image.src
                              ? true
                              : false
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          position="absolute"
                          top="5px"
                          right="5px"
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          backgroundColor="white"
                        >
                          <Icon
                            opacity={"1"}
                            pointerEvents="auto"
                            onClick={(e) => handleDeleteImage(e, 2)}
                            as={MdClose}
                            color="red"
                            cursor="pointer"
                          />
                        </Box>
                      </Box>
                    </label>
                  </Box>
                  <Box>
                    <Input
                      id="fileInput3"
                      display={"none"}
                      type="file"
                      onChange={(event) => handleImageUpload(event, 3)}
                      name="myFile"
                    />
                    <label htmlFor="fileInput3">
                      <Box cursor="pointer" position="relative" h="100px">
                        <Image
                          src={displayImage[3]}
                          alt="Default Image"
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                        <Box
                          hidden={
                            displayImage[3] == default_product_image.src
                              ? true
                              : false
                          }
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          position="absolute"
                          top="5px"
                          right="5px"
                          width="20px"
                          height="20px"
                          borderRadius="50%"
                          backgroundColor="white"
                        >
                          <Icon
                            opacity={"1"}
                            pointerEvents="auto"
                            onClick={(e) => handleDeleteImage(e, 3)}
                            as={MdClose}
                            color="red"
                            cursor="pointer"
                          />
                        </Box>
                      </Box>
                    </label>
                  </Box>
                </Flex>
                <Tooltip label="Title">
                  <Input
                    ref={title}
                    type="text"
                    placeholder="Title"
                    defaultValue={SKU[0]?.title}
                  />
                </Tooltip>
                <Tooltip label="SKU ID">
                  <Input
                    ref={skuID}
                    type="text"
                    placeholder="sku ID"
                    defaultValue={`${SKU[0]?.skuID}`}
                    isDisabled={true}
                  />
                </Tooltip>
                <Tooltip label="Quantity">
                  <Input
                    ref={quantity}
                    type="number"
                    placeholder="Quantity"
                    defaultValue={SKU[0]?.quantity}
                  />
                </Tooltip>
                <Select ref={color} defaultValue={SKU[0]?.color}>
                  <option hidden>Select Color</option>
                  {colorList.map(({ name },i) => {
                    const value = name.split(" ").join("");
                    return (
                      <option key={i} value={value}>{capitalizeWords(name)}</option>
                    );
                  })}
                </Select>
                <Tooltip label="M.R.P">
                  <Input
                    onChange={(e) => {
                      const temp = SKU;
                      temp[0].price = e.target.value;
                      setSKU(temp);
                    }}
                    ref={price}
                    type="number"
                    placeholder="M.R.P"
                    defaultValue={SKU[0]?.price}
                  />
                </Tooltip>
                <Tooltip label={"Category"}>
                  <Select ref={category} defaultValue={SKU[0]?.category}>
                    <option hidden>Select Category</option>
                    {categoryList.map(({ name },i) => {
                      const value = name.split(" ").join("");
                      return (
                        <option key={i} value={value}>{capitalizeWords(name)}</option>
                      );
                    })}
                  </Select>
                </Tooltip>
                <Tooltip label="Description">
                  <Textarea
                    sx={{
                      "::-webkit-scrollbar": {
                        display: "none",
                      },
                    }}
                    ref={description}
                    placeholder="Description"
                    defaultValue={SKU[0]?.description}
                  />
                </Tooltip>
                <Flex gap={"10px"} direction={"column"}>
                  <Tooltip label="Selling Price">
                    <Input
                      name={"discount"}
                      _hover={{}}
                      onChange={(e) => {
                        if (
                          e.target.value > SKU[0]?.price ||
                          e.target.value > price
                        ) {
                          e.target.value = Number(e.target.value / 10).toFixed(
                            0
                          );
                          toast({
                            title: "Selling price can not more than MRP",
                            status: "warning",
                            duration: 3000,
                            isClosable: true,
                          });
                        } else {
                          updatedNewDiscount(e);
                        }
                      }}
                      ref={discount}
                      type="number"
                      placeholder="Selling Price"
                      defaultValue={Math.ceil(SKU[0]?.sellingPrice)}
                    />
                  </Tooltip>
                  <Tooltip label="Tag">
                    <Select ref={tag} defaultValue={SKU[0]?.tag} _hover={{}}>
                      <option hidden value={""}>
                        Tag
                      </option>
                      <option value={"classicPlain"}>Classic Plain</option>
                      <option value={"classicPrinted"}>Classic Printed</option>
                      <option value={"Premium"}>Premium</option>
                      <option value={"ultraPremium"}>U Premium</option>
                      <option value={"sqfs"}>SQFS</option>
                      <option value={"scps"}>SCPS</option>
                      <option value={"indianCan"}>INDIAN CAN</option>
                      <option value={"CateringPlain"}>Catering Plain</option>
                      <option value={"CateringPrinted"}>
                        Catering Printed
                      </option>
                    </Select>
                  </Tooltip>
                  <Box>Discount is: {calculatedDiscount}%</Box>
                </Flex>
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleUpdateProduct}>
                Update
              </Button>
              <Button colorScheme="red" onClick={onCloseEdit}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Flex
          fontSize={"10px"}
          w={"82%"}
          bgColor={"transparent"}
          justifyContent={"space-between"}
          position={"fixed"}
          right={"0"}
          mb={"10px"}
          top={"20"}
          zIndex={"100"}
          p={"10px"}
          mr={"16px"}
        >
          <Box h={"70px"} mr={"20px"} ml={"40px"}>
            <Flex justifyContent={"center"} alignItems={"center"}></Flex>
          </Box>
          <Flex gap={"10px"} fontSize={"10px"}>
            <Flex
              mr={"30px"}
              mt={"5px"}
              h={"32px"}
              borderRadius={"10px"}
              shadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
            >
              <Input
                bgColor={"transparent"}
                variant={"unstyled"}
                textIndent={"7px"}
                value={searchBarText}
                h={"32px"}
                placeholder="Enter SKU ID / Tag Name to Search"
                w={"300px"}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    e.preventDefault();
                    fetchProduct();
                  }
                }}
                p={"5px"}
                onChange={(e) => handleSearch(e)}
              />
              <Box mt={"8px"} position={"relative"} mr={"20px"}>
                <Center>
                  <Box
                    fontSize={"15px"}
                    cursor={"pointer"}
                    onClick={fetchProduct}
                  >
                    <FiSearch />
                  </Box>
                </Center>
              </Box>
            </Flex>
            <Box mt={"-5px"}>
              <Refresh refresh={fetchProduct} />
            </Box>
            <Button
              mt={"5px"}
              shadow={"rgba(0, 0, 0, 0.40) 0px 2px 5px"}
              h={"30px"}
              borderRadius={"10px"}
              fontSize={"13px"}
              letterSpacing={"1px"}
              p={"7px"}
              isDisabled={instantUpdate.length <= 1}
              _hover={{}}
              onClick={() => submitInstantUpdate()}
              bgColor={"#f2c75d"}
            >
              Save All
            </Button>
            <Box
              textAlign={"right"}
              hidden={!user.addProduct}
              fontSize={"10px"}
            >
              <Button
                mt={"5px"}
                shadow={"rgba(0, 0, 0, 0.40) 0px 2px 5px"}
                h={"30px"}
                borderRadius={"10px"}
                fontSize={"13px"}
                letterSpacing={"1px"}
                p={"7px"}
                leftIcon={<AddIcon />}
                colorScheme="green"
                onClick={handleOpenAdd}
                isDisabled={SKU.length > 0}
                _disabled={{ bgColor: "green.300", cursor: "not-allowed" }}
              >
                Create
              </Button>
            </Box>
            <Box
              textAlign={"right"}
              hidden={!user.editProduct}
              fontSize={"10px"}
            >
              <Button
                mt={"5px"}
                shadow={"rgba(0, 0, 0, 0.40) 0px 2px 5px"}
                h={"30px"}
                borderRadius={"10px"}
                fontSize={"13px"}
                letterSpacing={"1px"}
                p={"7px"}
                leftIcon={<EditIcon />}
                colorScheme="teal"
                onClick={handleOpenEdit}
                isDisabled={SKU.length <= 0 || SKU.length > 1}
                _disabled={{ bgColor: "teal.300", cursor: "not-allowed" }}
              >
                Edit
              </Button>
            </Box>
            <Box
              textAlign={"right"}
              hidden={!user.deleteProduct}
              fontSize={"10px"}
            >
              <Button
                mt={"5px"}
                shadow={"rgba(0, 0, 0, 0.40) 0px 2px 5px"}
                h={"30px"}
                borderRadius={"10px"}
                fontSize={"13px"}
                letterSpacing={"1px"}
                p={"7px"}
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                onClick={onOpenDelete}
                isDisabled={SKU.length <= 0}
                _disabled={{ bgColor: "red.400", cursor: "not-allowed" }}
              >
                Delete
              </Button>
            </Box>
            <Box
              textAlign={"right"}
              hidden={!user.productStatus}
              fontSize={"10px"}
            >
              <Button
                mt={"5px"}
                shadow={"rgba(0, 0, 0, 0.40) 0px 2px 5px"}
                h={"30px"}
                borderRadius={"10px"}
                fontSize={"13px"}
                letterSpacing={"1px"}
                p={"7px"}
                colorScheme="teal"
                onClick={onOpenStatus}
                isDisabled={SKU.length <= 0 || SKU.length > 1}
                _disabled={{ bgColor: "teal.300", cursor: "not-allowed" }}
              >
                Active/Inactive
              </Button>
            </Box>
          </Flex>
        </Flex>
        <Flex justifyContent={"space-between"} mt={"60px"} mr={"10px"}>
          <Flex gap={"10px"}>
            <Text textAlign={"left"} mt={"5px"}>
              Total Products:{productData?.totalPage}
            </Text>
            <Text textAlign={"left"} mt={"5px"}>
              Total Quantity:{productData?.totalQuantity}
            </Text>
          </Flex>
          <Box>
            <Select
              onChange={(e) => handleSortBy(e.target.value)}
              fontSize={"12px"}
              h={"30px"}
              cursor={"pointer"}
            >
              <option hidden>Sort By</option>
              <option value={"clicks-h2l"}>Clicks(High to Low)</option>
              <option value={"clicks-l2h"}>Clicks(Low to High)</option>
              <option value={"price-h2l"}>Price(High to Low)</option>
              <option value={"price-l2h"}>Price(Low to High)</option>
              <option value={"likes-h2l"}>Likes(High to Low)</option>
              <option value={"likes-l2h"}>Likes(Low to High)</option>
              <option value={"_id-h2l"}>Product(New to Old)</option>
              <option value={"_id-l2h"}>Product(Old to New)</option>
            </Select>
          </Box>
        </Flex>

        <Box
          mt={"20px"}
          h={window.innerHeight - 280}
          overflow={"scroll"}
          overflowX={"hidden"}
        >
          <table style={{ width: "100%" }}>
            <thead style={{ padding: "10px", height: "40px" }}>
              <tr
                style={{
                  position: "sticky",
                  backgroundColor: "white",
                  top: 0,
                  margin: "0px",
                  zIndex: 99,
                }}
              >
                <th>
                  <Center> SL No.</Center>
                </th>
                <th>
                  <Center>SKU ID</Center>
                </th>
                <th>
                  <Center>Title</Center>
                </th>
                <th>
                  <Center>Clicks</Center>
                </th>
                <th>
                  <Center>Like & Dislike</Center>
                </th>
                <th>
                  <Center>
                    <Text textAlign={"left"} ml={"15px"}>
                      Category
                    </Text>
                  </Center>
                </th>
                <th>
                  <Center ml={"-15px"}>Tag</Center>
                </th>
                <th>
                  <Center ml={"-15px"}>Selling Price</Center>
                </th>
                <th>
                  <Center ml={"-15px"}>MRP</Center>
                </th>
                <th>
                  <Center>Qty.</Center>
                </th>
                <th>
                  <Center>Color</Center>
                </th>
                <th>
                  <Center>Image</Center>
                </th>
                <th>
                  <Center>Status</Center>
                </th>
                <th>
                  <Center></Center>
                </th>
                <th>
                  <Center></Center>
                </th>
              </tr>
            </thead>
            <tbody>
              {productData?.data?.length > 0 &&
                productData?.data?.map((ele, index) => {
                  const {
                    skuID,
                    quantity,
                    color,
                    price,
                    title,
                    tag,
                    clicks,
                    status,
                    like,
                    dislike,
                    discount,
                    category,
                  } = ele;
                  const sellingPrice = Number(
                    Number(price) - Number(price) * (Number(discount) / 100)
                  ).toFixed(0);
                  return (
                    <tr style={{ borderBottom: "0.5px solid black" }} key={index}>
                      <td>
                        <Flex
                          gap={"5px"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <Checkbox
                            zIndex={"1"}
                            border={"0px solid gray"}
                            onChange={(event) =>
                              handleSKU(event.target.checked, skuID)
                            }
                          />
                          <Text>{limit * (page - 1) + (index + 1)}</Text>
                        </Flex>
                      </td>
                      <td>
                        <Center>
                          <Flex ml={"10px"} gap={"5px"}>
                            <Text
                              cursor={"pointer"}
                              color={"blue"}
                              textDecoration={"underline"}
                              onClick={() => handleSingleProduct(ele)}
                            >
                              {skuID}
                            </Text>
                            <Tooltip label="Copy to Clipboard">
                              <Box
                                mt={"-5px"}
                                cursor={"pointer"}
                                onClick={() => {
                                  navigator.clipboard.writeText(skuID);
                                  toast({
                                    title: "Copied to Clipboard",
                                    status: "success",
                                    duration: 2000,
                                    isClosable: true,
                                  });
                                }}
                              >
                                <HiOutlineClipboardDocumentList />
                              </Box>
                            </Tooltip>
                          </Flex>
                        </Center>
                      </td>
                      <td>
                        <Center pt={"15px"}>
                          <Box
                            textAlign={"left"}
                            fontSize={"12px"}
                            resize={"none"}
                            readOnly={true}
                            p={"0px"}
                            w={"120px"}
                            minH={"50px"}
                            sx={{
                              "::-webkit-scrollbar": {
                                display: "none",
                              },
                            }}
                          >
                            {title?.split("").splice(0, 50).join("") + "..."}
                          </Box>
                        </Center>
                      </td>
                      <td>
                        <Center>{clicks}</Center>
                      </td>
                      <td>
                        <Center>Like: {like || 0} </Center>
                        <Center>Dislike: {dislike || 0} </Center>
                      </td>
                      <td>
                        <Center>
                          <Text>{capitalizeWords(category)}</Text>
                        </Center>
                      </td>
                      <td>
                        <Center>
                          <Select
                            onChange={(e) => {
                              let newData = {
                                target: {
                                  name: "tag",
                                  value: e.target.value,
                                },
                              };
                              handleUpdateInstantUpdate(newData, skuID);
                            }}
                            defaultValue={tag}
                            fontSize={"12px"}
                            w={"120px"}
                            h={"30px"}
                          >
                            <option hidden>Select Tag</option>
                            <option
                              hidden={tag == "classicPlain"}
                              value={"classicPlain"}
                            >
                              Classic Plain
                            </option>
                            <option
                              hidden={tag == "classicPrinted"}
                              value={"classicPrinted"}
                            >
                              Classic Printed
                            </option>
                            <option hidden={tag == "Premium"} value={"Premium"}>
                              Premium
                            </option>
                            <option
                              hidden={tag == "ultraPremium"}
                              value={"ultraPremium"}
                            >
                              U Premium
                            </option>
                            <option hidden={tag == "sqfs"} value={"sqfs"}>
                              SQFS
                            </option>
                            <option hidden={tag == "scps"} value={"scps"}>
                              SCPS
                            </option>
                            <option
                              hidden={tag == "indianCan"}
                              value={"indianCan"}
                            >
                              INDIAN CAN
                            </option>
                            <option
                              hidden={tag == "CateringPlain"}
                              value={"CateringPlain"}
                            >
                              Catering Plain
                            </option>
                            <option
                              hidden={tag == "CateringPrinted"}
                              value={"CateringPrinted"}
                            >
                              Catering Printed
                            </option>
                          </Select>
                        </Center>
                      </td>
                      <td>
                        <Center>
                          <Input
                            name="discount"
                            textAlign={"center"}
                            _hover={{}}
                            type={"number"}
                            onChange={(e) => {
                              const MRP = Number(price);
                              const NewPrice = e.target.value;
                              if (NewPrice > MRP) {
                                e.preventDefault();
                                e.target.value = Number(
                                  e.target.value / 10
                                ).toFixed(0);
                                toast({
                                  title: "Selling price can not more than MRP",
                                  status: "warning",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              } else {
                                const updatedDiscount =
                                  ((MRP - NewPrice) / MRP) * 100;
                                let newData = {
                                  target: {
                                    name: "discount",
                                    value: updatedDiscount.toFixed(2),
                                  },
                                };
                                handleUpdateInstantUpdate(newData, skuID);
                              }
                            }}
                            defaultValue={sellingPrice}
                            bgColor={"gray.200"}
                            border={"1px solid black"}
                            w={"70px"}
                            fontSize={"12px"}
                            h={"30px"}
                            resize={"none"}
                            mr={"20px"}
                          ></Input>
                        </Center>
                      </td>
                      <td>
                        <Center ml={"-15px"}>
                          <Text>{price}</Text>
                        </Center>
                      </td>
                      <td>
                        <Center>
                          <Input
                            name="quantity"
                            textAlign={"center"}
                            _hover={{}}
                            onChange={(e) =>
                              handleUpdateInstantUpdate(e, skuID)
                            }
                            fontSize={"12px"}
                            bgColor={"gray.200"}
                            border={"1px solid black"}
                            w={"70px"}
                            type="number"
                            h={"30px"}
                            resize={"none"}
                            defaultValue={quantity}
                          ></Input>
                        </Center>
                      </td>
                      <td>
                        <Center>
                          <Text>{capitalizeWords(color)}</Text>
                        </Center>
                      </td>
                      <td>
                        <Center>
                          <Image
                            maxH={"50px"}
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${skuID}-1.jpg`}
                          />
                        </Center>
                      </td>
                      <td>
                        <Center>
                          <Tooltip
                            label={
                              status == "inactive"
                                ? "Product can not be seen by customer"
                                : "Product can be seen by customer"
                            }
                          >
                            <Text
                              cursor={"pointer"}
                              color={status == "inactive" ? "red" : "green"}
                              onClick={() => {
                                handleOpenStatus(skuID);
                              }}
                            >
                              {capitalizeWords(status)}
                            </Text>
                          </Tooltip>
                        </Center>
                      </td>
                      <td>
                        <Tooltip label="View on Rarecombee">
                          <Center>
                            <Link
                              target="_blank"
                              href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/allProducts/single/${skuID}`||""}
                            >
                              <Image h={"20px"} w={"20px"} src={view_test.src} />
                            </Link>
                          </Center>
                        </Tooltip>
                      </td>
                      <td>
                        <Center>
                          <Box
                            onClick={() => submitInstantUpdate(skuID)}
                            // hidden={() => instantHidden(skuID)}
                            p={"5px 15px"}
                            borderRadius={"15px"}
                            bgColor={"#f2c75d"}
                            cursor={"pointer"}
                          >
                            Save
                          </Box>
                        </Center>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Box>
        <Box mt={"10px"} borderBottom={"1px solid black"}></Box>
      </Box>
      <Flex mt={"8px"} h={"50px"} justifyContent={"space-between"}>
        <Box></Box>
        <Flex justifyContent={"center"} alignItems={"center"} gap={"10px"}>
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
              defaultValue={page}
              border={"1px solid black"}
            />
            <Center>out of {productData?.maxPage}</Center>
          </Flex>
          {/* <Box>Page {page} out of {max}</Box> */}
          <Button
            _hover={{}}
            onClick={() => setPage((res) => res + 1)}
            isDisabled={page >= productData?.maxPage}
          >
            <GrFormNextLink />
          </Button>
        </Flex>
        <Flex direction={"row-reverse"}>
          <Box textAlign={"right"} w={"100px"} mt={"5px"}>
            <Select
              fontSize={"12px"}
              border={"1px solid gray"}
              defaultValue={limit}
              onChange={(e) => setLimit(e.target.value)}
            >
              <option hidden>Number</option>
              <option value={"10"}>10</option>
              <option value={"20"}>20</option>
              <option value={"40"}>40</option>
            </Select>
          </Box>
        </Flex>
      </Flex>
    </Dashboard>
  );
};

export default Product;
