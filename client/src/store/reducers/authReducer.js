const intialState = {
  token: null,
  otpCheck: false,
  isLoading: false,
  error: null,
  isAdmin: false,
  msg: [],
};

const reducer = (state = intialState, action) => {
  if (action.type === "AUTH_OTP") {
    return {
      ...state,
      otpCheck: true,
      otp: action.otp,
      isLoading: false,
      token: action.token,
      error: null,
      isAdmin: false,
    };
  }
  if (action.type === "CLEAR") {
    return {
      ...state,
      error: null,
    };
  }
  if (action.type === "OTP_CLEAR") {
    return {
      ...state,
      otpCheck: false,
    };
  }

  if (action.type === "AUTH_START") {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  }

  if (action.type === "AUTH_LOGOUT") {
    console.log(state);
    return {
      ...state,
      token: null,
      isAdmin: false,
    };
  }

  if (action.type === "MSG") {
    return {
      ...state,
      msg: action.msg,
    };
  }

  if (action.type === "AUTH_SUCCESS") {
    console.log(state);
    return {
      ...state,
      isLoading: false,
      token: action.token,
      isAdmin: true,
    };
  }

  if (action.type === "AUTH_FAIL") {
    return {
      ...state,
      isLoading: false,
      token: null,
      error: action.error,
      userId: null,
      isAdmin: false,
    };
  }

  return state;
};

export default reducer;
