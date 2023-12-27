import { Box, Image } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { magnifierOff, magnifierOn } from "../Redux/AppReducer/Action";
export const ImageMagnifier = ({
  src,
  skuID,
  width,
  height,
  magnifierHeight = 300,
  magnifieWidth = 300,
  zoomLevel = 2.5,
}) => {
  const dispatch = useDispatch();
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const showMagnifier = useSelector((store) => store.app.magnifier);
  return (
    <Box
      h={height}
      w={width}
      zIndex={"99"}
      style={{
        position: "relative",
      }}
    >
      <Image
        htmlHeight={height}
        htmlWidth={width}
        alt={skuID}
        title={skuID}
        loading="eager"
        src={src}
        h={height}
        w={width}
        onMouseEnter={(e) => {
          // update image size and turn-on magnifier
          const elem = e.currentTarget;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          dispatch(magnifierOn());
        }}
        onMouseMove={(e) => {
          // update cursor position
          const elem = e.currentTarget;
          const { top, left } = elem.getBoundingClientRect();

          // calculate cursor position on the image
          const x = e.pageX - left - window.scrollX;
          const y = e.pageY - top - window.scrollY;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          // close magnifier
          dispatch(magnifierOff());
        }}
      />

      <Box
        style={{
          display: showMagnifier ? "" : "none",
          position: "absolute",

          // prevent magnifier blocks the mousemove event of img
          pointerEvents: "none",
          // set size of magnifier
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth}px`,
          // move element center to cursor pos
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifieWidth / 2}px`,
          opacity: "1", // reduce opacity so you can verify position
          border: "1px solid lightgray",
          backgroundColor: "white",
          backgroundImage: `url('${src}')`,
          backgroundRepeat: "no-repeat",
          //calculate zoomed image size
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,

          //calculate position of zoomed image.
          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      ></Box>
    </Box>
  );
};
