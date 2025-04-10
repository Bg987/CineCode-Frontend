import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.121.47:4000", // Backend URL , change in seereview.jsx and seeMoview.jsx approvemoview adminhome.jsx
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
export const AddMovieApi = (data) => API.post("/apiMovie/AddMovie", data, {
  headers: {
    "Content-Type": "multipart/form-data"  // ✅ Set Content-Type here
  }
});
export const seeMovies = (name, lang, year) =>
  API.get(`/apiSeeM`, {
    params: { name, lang, year },
  });
export const AddReview = (id,name,review,rating) => API.post("/apiAddR/AddR", { Mid: id, Mname: name, review: review, rating: rating });
export const SeeR = () => API.get("/apiSeeR/seeR");
export default API;
