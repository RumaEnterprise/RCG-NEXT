import {
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomSlider from "./CustomSlider";
import SingleHomeCard from "./SingleHomeCard";

const HomeCard = ({
  scroll = false,
  settings = {},
  buyFont = "10px",
  cartFont = "10px",
  category,
  tag,
  view = false,
  p,
  hover = true,
  button = true,
  buynow = false,
  items = 0,
  column,
  height = "auto",
  title = true,
  price = true,
  imgHeight = "190px",
  sale = true,
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/random?`;
    let query = [];
    if (category !== undefined) {
      query.push(`category=${category}`);
    }
    if (tag !== undefined) {
      query.push(`tag=${tag}`);
    }
    if (items > 0) {
      query.push(`items=${items}`);
    }
    axios
      .get(BASE_URL + query.join("&"))
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (scroll) {
    return (
      <CustomSlider
        h={"150px"}
        text={true}
        button={true}
        redirect={true}
        cursor={true}
        data={data}
        settings={settings}
      />
    );
  }
  return (
    <Box>
      <SimpleGrid gap={"10px"} justifyContent={"space-around"} columns={column}>
        {data.map((ele, i) => {
          return (
            <SingleHomeCard key={i}
              p={p}
              ele={ele}
              i={i}
              buyFont={buyFont}
              cartFont={cartFont}
              view={view}
              hover={hover}
              button={button}
              buynow={buynow}
              height={height}
              title={title}
              price={price}
              imgHeight={imgHeight}
              sale={sale}
            />
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default HomeCard;
