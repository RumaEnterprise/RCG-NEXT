import Image from "next/image";
import React from "react";

const New_gif = ({ image, index }) => {
  return (
    <div>
      <Image src={image} height={40}width={40} alt={index} position={"relative"} top={"0"} />
    </div>
  );
};

export default New_gif;
