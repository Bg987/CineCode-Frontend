import axios from "axios";

const API = axios.create({
    baseURL: "http://192.168.254.47:4000", // Backend URL
    withCredentials: true, // Required for cookies (JWT authentication)
});

// Authentication
export const login = (credentials) => API.post("/apiLogin/login", credentials);
export const logoutUser = () => API.get("/apiLogOut/logoutUser");
export const logoutAdmin = () => API.get("/apiLogOut/logoutAdmin");

// Signup & OTP
export const signup = (credentials) => API.post("/apiSignup/register", credentials);
export const verifyOTP = (data) => API.post("/apiSignup/verify-otp", data);

// Forgot Password
export const forgotPassword = (username) => API.post("/apiForget/forgetPassword", username);

export default API;
