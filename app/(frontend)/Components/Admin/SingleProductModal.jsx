import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  SimpleGrid,
  Flex,
  Text,
  Box,
  Textarea,
  Center,
} from "@chakra-ui/react";
import { capitalizeWords } from "../capital";
const SingleProductModal = ({ data, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>
          <Center>
            SKU-
            {data?.data?.skuID}
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={"10px"} direction={["column", "column", "row", "row"]}>
            <SimpleGrid gap={"10px"} columns={[1, 1, 2, 2]} w={"50%"}>
              {data?.images?.map((elem, i) => {
                return (
                  <Image
                    key={i}
                    borderRadius={"10px"}
                    border={`1px solid ${data?.data?.color}`}
                    src={elem.data}
                    alt={elem.name}
                  />
                );
              })}
            </SimpleGrid>
            <Box w={"50%"} fontSize={"17px"}>
              <Flex gap={"5px"}>
                <Text fontWeight={"bold"}>Title:</Text>
                <Text>{data?.data?.title}</Text>
              </Flex>
              <Flex gap={"5px"} mt={"10px"}>
                <Text fontWeight={"bold"} color={"cobalt blue"}>
                  Desc:
                </Text>
                <Textarea
                  cursor={"default"}
                  variant={"unstyled"}
                  readOnly
                  resize={"none"}
                >
                  {data?.data?.description}
                </Textarea>
              </Flex>
              <Flex gap={"10px"}>
                <Flex gap={"5px"} mt={"10px"}>
                  <Text fontWeight={"bold"}>Price:</Text>
                  <Text>{data?.data?.price}</Text>
                </Flex>
                <Flex gap={"5px"} mt={"10px"}>
                  <Text fontWeight={"bold"}>Color:</Text>
                  <Text>{data?.data?.color}</Text>
                </Flex>
                <Flex gap={"5px"} mt={"10px"}>
                  <Text fontWeight={"bold"}>Discount:</Text>
                  <Text>{data?.data?.discount}%</Text>
                </Flex>
              </Flex>
              <Flex gap={"5px"} mt={"10px"}>
                <Text fontWeight={"bold"}>Qty:</Text>
                <Text>{data?.data?.quantity}</Text>
              </Flex>
              <Flex gap={"5px"} mt={"10px"}>
                <Text fontWeight={"bold"}>Status:</Text>
                <Text>{data?.data?.status}</Text>
              </Flex>
              <Flex gap={"10px"}>
                <Flex gap={"5px"} mt={"10px"}>
                  <Text fontWeight={"bold"}>Sold:</Text>
                  <Text>{data?.data?.sold}</Text>
                </Flex>
                <Flex gap={"5px"} mt={"10px"}>
                  <Text fontWeight={"bold"}>Return:</Text>
                  <Text>{data?.data?.return}</Text>
                </Flex>
                <Flex gap={"5px"} mt={"10px"}>
                  <Text fontWeight={"bold"}>Clicks:</Text>
                  <Text>{data?.data?.clicks}</Text>
                </Flex>
              </Flex>
              <Flex gap={"5px"} mt={"10px"}>
                <Text fontWeight={"bold"}>Uploaded By:</Text>
                <Text>
                  {capitalizeWords(data?.data?.createdBy?.name)} (
                  {data?.data?.createdBy?.date} | {data?.data?.createdBy?.time})
                </Text>
              </Flex>
              <Flex gap={"5px"} mt={"10px"}>
                <Text fontWeight={"bold"}>Last Modified By:</Text>
                <Text>
                  {capitalizeWords(data?.data?.lastModified?.name)} (
                  {data?.data?.lastModified?.date} |{" "}
                  {data?.data?.lastModified?.time})
                </Text>
              </Flex>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SingleProductModal;
