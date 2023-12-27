import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { BsStarFill, BsStar } from "react-icons/bs";
import guest1 from "../Resources/guest1.png";
import Image from "next/image";
const Review = ({ name, rate, date, feedback,index }) => {
  const rating = [0, 0, 0, 0, 0];
  return (
    <Box
      key={index}
      p={"10px"}
      border={"1px solid gray"}
      borderRadius={"15px"}
      h={["200px", "200px", "200px", "300px"]}
      overflow={"scroll"}
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Flex>
        <Box>
          <Image
            loading="eager"
            title={index}
            alt={index}
            htmlWidth={"80px"}
            htmlHeight={"80px"}
            width={80}
            height={80}
            borderRadius={"50%"}
            src={guest1}
          />
        </Box>
        <Flex
          direction={"column"}
          textAlign={"left"}
          gap={"5px"}
          mt={"8px"}
          ml={"6px"}
        >
          <Text fontWeight={"600"}>{name}</Text>
          <Flex gap={"3px"}>
            {rating.map((ele, i) => {
              if (i + 1 <= rate) {
                return (
                  <Box key={i}>
                    <BsStarFill />
                  </Box>
                );
              } else {
                return (
                  <Box key={i}>
                    <BsStar />
                  </Box>
                );
              }
            })}
          </Flex>
          <Text>{date}</Text>
        </Flex>
      </Flex>
      <Text color={"gray"} mt={"5px"} textAlign={"left"}>
        {feedback}
      </Text>
    </Box>
  );
};

export default Review;
