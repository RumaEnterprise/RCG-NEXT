import axios from "axios";
import * as types from "./ActionTypes";

const getAllCourier = () => (dispatch) => {
  try {
    dispatch({ type: types.GET_ALL_COURIER_REQUEST });
    axios
      .get("https://queries-test.envia.com/available-carrier/IN/0", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENVIA_KEY}`,
        },
      })
      .then((res) => {
        dispatch({
          type: types.GET_ALL_COURIER_SUCCESS,
          payload: res.data.data,
        });
      });
  } catch (error) {
    dispatch({ type: types.GET_ALL_COURIER_FAILURE });
    console.log(error);
  }
};

export { getAllCourier };
