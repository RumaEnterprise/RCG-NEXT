import { Button } from "@chakra-ui/react";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const Buy_Cart = ({
  setBtnHover,
  name,
  functionAPI,
  bgColor,
  color,
  fs,
  p = "0px 15px",
  view = false,
}) => {
  return (
    <Button
      onMouseEnter={() => setBtnHover(true)}
      mb={"10px"}
      fontSize={fs}
      fontWeight={"bold"}
      borderRadius="5px"
      onClick={functionAPI}
      variant="unstyled"
      bgColor={bgColor}
      color={color}
      h="30px"
      p={p}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: "8px", fontSize: "15px" }}>
        {view ? null : <FaShoppingCart />}
      </span>
      {name}
    </Button>
  );
};

export default Buy_Cart;
