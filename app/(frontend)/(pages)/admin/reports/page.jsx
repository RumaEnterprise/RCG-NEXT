"use client";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import { useSelector } from "react-redux";
import axios from "axios";
import { capitalizeWords } from "../../../Components/capital";
const SingleReport = ({
  ele,
  finalTime,
  handleDownloadProductReport,
  handleOpenPreview,
}) => {
  const [downLoad, setDownLoad] = useState(false);
  return (
    <Tr>
      <Td>
        <Center>{ele}</Center>
      </Td>
      <Td>
        <Center>{finalTime}</Center>
      </Td>
      <Td>
        <Center>Ready</Center>
      </Td>
      <Td>
        <Center>
          <Button
            colorScheme="green"
            isLoading={downLoad}
            onClick={() => handleDownloadProductReport(ele, setDownLoad)}
          >
            Download
          </Button>
        </Center>
      </Td>
      <Td>
        <Center>
          <Button colorScheme="blue" onClick={() => handleOpenPreview(ele)}>
            Preview
          </Button>
        </Center>
      </Td>
    </Tr>
  );
};
const ProductReport = () => {
  const [list, setList] = useState([]);
  const [load, setLoad] = useState(false);
  const [fullImage, setFullImage] = useState("");
  const [preview, setPreview] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();
  const {
    isOpen: isFullImageOpen,
    onOpen: onFullImageOpen,
    onClose: onFullImageClose,
  } = useDisclosure();
  const token = useSelector((store) => store.auth.token);
  const toast = useToast();
  const getReport = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/productreport`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const genData = res.data.data;
        setList(genData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getReport();
  }, []);
  useEffect(() => {
    try {
      if (preview !== "") {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/getreportdata?name=${preview}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setPreviewData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [preview]);
  const handleDownloadProductReport = (name, setLoading) => {
    try {
      setLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/downloadreport?file=${name}`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(
            new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          const customHeader = res.headers["custom-header"];
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", customHeader);
          document.body.appendChild(link);
          link.click();
          setLoading(false);
          toast({
            title: "Downloaded",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleProductReport = () => {
    try {
      setLoad(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/generatereport`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setLoad(false);
          getReport();
          toast({
            title: "Generated",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };
  const handleOpenPreview = (name) => {
    console.log(name);
    setPreview(name);
    onPreviewOpen();
  };
  return (
    <Box textAlign={"left"}>
      <Button
        colorScheme="green"
        onClick={handleProductReport}
        isLoading={load}
      >
        Generate Report
      </Button>
      <Box
        mt={"7px"}
        h={window.innerHeight - 235}
        overflow={"scroll"}
        overflowX={"hidden"}
      >
        <Modal
          isCentered
          size={"3xl"}
          isOpen={isPreviewOpen}
          onClose={() => {
            setPreview("");
            onPreviewClose();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{preview}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box
                h={window.innerHeight - 200}
                overflow={"scroll"}
                overflowX={"hidden"}
              >
                <table style={{ width: "100%" }}>
                  <thead
                    style={{
                      position: "sticky",
                      top: "0",
                      zIndex: 1,
                      backgroundColor: "white",
                    }}
                  >
                    <tr>
                      <th>Image</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.length > 0 &&
                      previewData.map((ele) => {
                        return (
                          <tr
                            style={{
                              color:
                                ele.quantity >= 10
                                  ? "black"
                                  : ele.quantity == 0
                                  ? "white"
                                  : "white",
                              fontWeight: "bold",
                              backgroundColor:
                                ele.quantity >= 10
                                  ? "white"
                                  : ele.quantity == 0
                                  ? "red"
                                  : "orange",
                            }}
                          >
                            <td>
                              <Center>
                                <Box cursor={"pointer"}
                                  onClick={() => {
                                    setFullImage(ele.image.text);
                                    onFullImageOpen();
                                  }}
                                >
                                  <Image h={"50px"} src={ele.image.text} />
                                </Box>
                              </Center>
                            </td>
                            <td>
                              <Center>{ele.skuID}</Center>
                            </td>
                            <td>
                              <Center>{capitalizeWords(ele.category)}</Center>
                            </td>
                            <td>
                              <Center>{ele.price}</Center>
                            </td>
                            <td>
                              <Center>{ele.quantity}</Center>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal
          isCentered
          size={"3xl"}
          isOpen={isFullImageOpen}
          onClose={() => {
            onFullImageClose();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <Image src={fullImage} />
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
        <TableContainer>
          <Table variant="striped" colorScheme={"teal"}>
            <Thead>
              <Tr>
                <Th>
                  <Center>Report Name</Center>
                </Th>
                <Th>
                  <Center>Generated Time</Center>
                </Th>
                <Th>
                  <Center>Status</Center>
                </Th>
                <Th>
                  <Center>Download</Center>
                </Th>
                <Th>
                  <Center>Preview</Center>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {list.length > 0 &&
                list.map((ele) => {
                  const time = ele.split("_").splice(2);
                  const finalTime = `${time[0]} | ${time[1]
                    .split("-")
                    .splice(0, 2)
                    .join(":")}${time[2].split(".")[0]}`;
                  return (
                    <SingleReport
                      ele={ele}
                      finalTime={finalTime}
                      handleDownloadProductReport={handleDownloadProductReport}
                      handleOpenPreview={handleOpenPreview}
                    />
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const Reports = () => {
  return (
    <Dashboard>
      <Tabs>
        <TabList>
          <Tab>Product</Tab>
          <Tab>Sales</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProductReport />
          </TabPanel>
          <TabPanel>
            <p>Under Development!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
};

export default Reports;