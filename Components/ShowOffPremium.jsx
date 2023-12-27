import { Box, Center, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ShowOffPremium = ({ h }) => {
  const navigate = useRouter();
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const [premium, setPremium] = useState([]);
  useEffect(() => {
    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product?category=premium`)
        .then((res) => {
          setPremium(shuffleArray(res.data.data));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <Flex direction={"column"}>
      <Center>
        <Text
          margin={"10px 0px"}
          fontSize={["10px", "11px", "12px", "20px"]}
          fontWeight={"bold"}
        >
          PREMIUM PRODUCT
        </Text>
      </Center>
      <Box
        h={h ? window.innerHeight + h : window.innerHeight}
        overflow={"scroll"}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
        style={{ transition: "height 0.3s linear" }}
      >
        {premium?.map(({ skuID, description, category, title }, i) => {
          const tempDescription = `${description
            .split("")
            .splice(0, 90)
            .join("")}...`;
          const tempTitle = `${title.split("").splice(0, 40).join("")}...`;
          return (
            <Box
              key={i}
              cursor={"pointer"}
              onClick={() => {
                navigate.push(`/allProducts/single/${skuID}`);
              }}
            >
              <Box borderBottom={"1px solid black"}></Box>

              <Flex gap={"10px"} mt={"10px"} mb={"10px"}>
                <Image
                  h={["20%", "20%", "20%", "100px"]}
                  w={["20%", "20%", "20%", "110px"]}
                  borderRadius={"50%"}
                  border={"2px solid black"}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${skuID}-1.jpg`}
                />
                <Flex direction={"column"} p={"0px 4px"}>
                  <Box textAlign={"left"}>
                    <Text>{category.toUpperCase()}</Text>
                  </Box>
                  <Box fontSize={"25pxpx"} fontWeight={"bold"}>
                    <Text textAlign={"left"}>{tempTitle}</Text>
                  </Box>
                  <Text textAlign={"left"} fontSize={"12.5px"} w={"250px"}>
                    {tempDescription}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </Box>
    </Flex>
  );
};

export default ShowOffPremium;
