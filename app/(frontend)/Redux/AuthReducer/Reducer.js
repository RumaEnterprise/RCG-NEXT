import * as types from "./ActionTypes";
const initialState = {
  user: {},
  isLoading: false,
  isError: false,
  token:"",
  otp:{}
};

export const Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SIGNIN_REQUEST:{
      return { ...state, isLoading: true, isError: false };
    }
    case types.SIGNIN_SUCCESS: {
      return { ...state,user:payload.user,token:payload.token, isLoading: false, isError: false };
    }
    case types.SIGNIN_FAILURE: {
      return { ...state, user:{},token:"", isLoading: false, isError: true };
    }

    case types.SIGNUP_REQUEST: {
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    }
    case types.SIGNUP_SUCCESS:{
      return { ...state, isLoading: false, isError: false };
    }
    case types.SIGNUP_FAILURE: {
      return { ...state,user:{},token:"", isLoading: false, isError: true };
    }

    case types.SIGNOUT_REQUEST: {
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    }
    case types.SIGNOUT_SUCCESS:{
      return { ...state,user:{},token:"", isLoading: false, isError: false };
    }
    case types.SIGNOUT_FAILURE: {
      return { ...state,user:{},token:"", isLoading: false, isError: true };
    }

    case types.USER_UPDATE_REQUEST:{
      return { ...state, isLoading: true, isError: false };
    }
    case types.USER_UPDATE_SUCCESS: {
      return { ...state,user:{...state.user,...payload}, isLoading: false, isError: false };
    }
    case types.USER_UPDATE_FAILURE: {
      return { ...state, user:{},token:"", isLoading: false, isError: true };
    }

    case types.GET_OTP_REQUEST:{
      return { ...state, isLoading: true, isError: false,otp:{} };
    }
    case types.GET_OTP_SUCCESS: {
      return { ...state,otp:payload, isLoading: false, isError: false };
    }
    case types.GET_OTP_FAILURE: {
      return { ...state, otp:{}, isLoading: false, isError: true };
    }
    default:
      return state;
  }
};
