import axios from "axios";

const API = axios.create({
  baseURL: "https://cinecode-backend.onrender.com/", // Backend URL , change in seereview.jsx and seeMoview.jsx approvemoview.jsx adminhome.jsx Adminmoviedelete.jsx
  withCredentials: true, 
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
export const seeMovies = (name, lang, year) =>//filters
  API.get(`/apiSeeM`, {
    params: { name, lang, year },
  });
export const AddReview = (id,name,review,rating) => API.post("/apiAddR/AddR", { Mid: id, Mname: name, review: review, rating: rating });
export const SeeR = () => API.get("/apiSeeR/seeR");
export const MFA = () => API.get("/ApiApprove/MFApprovence");
export const Approve = (movieId, status) => API.post("ApiApprove/AOrD",{ movieId, status });
export default API;
