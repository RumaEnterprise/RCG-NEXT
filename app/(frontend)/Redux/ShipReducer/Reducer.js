import * as types from "./ActionTypes";
const initialState = {
  allCourier: [],
  isError: false,
};

export const Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.GET_ALL_COURIER_REQUEST: {
      return { ...state, allCourier: [], isError: false };
    }
    case types.GET_ALL_COURIER_SUCCESS: {
      return {
        ...state,
        allCourier: payload,
        isError: false,
      };
    }
    case types.GET_ALL_COURIER_FAILURE: {
      return { ...state, allCourier: [], isError: true };
    }
    default:
      return state;
  }
};
