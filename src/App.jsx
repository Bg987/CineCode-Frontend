import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import VerifyOTP from "./components/VerifyOTP";
import Login from "./components/login";
import Landing from "./components/landing";
import AboutPage from "./components/about";
import Contact from "./components/ContactPage";
import UserHome from "./components/userHome";
import ForgotPassword from "./components/forgotpassword";
import AdminHome from "./components/adminHome";
import AddMovie from "./components/AddMovie";
import SeeMovie from "./components/seeMovie";
import ReviewAdd from "./components/review";
import SeeReview from "./components/seeReview";
import Approve from "./components/ApproveMovies";
import AdminMovieDelete from "./components/AdminMovieDelete";
import EditReview from "./components/editReview";
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Uhome" element={<UserHome />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/AHome" element={<AdminHome />} />
                <Route path="/AddMovie" element={<AddMovie />} />
                <Route path="/SeeMovie" element={<SeeMovie />} />
                <Route path="/AddReview" element={<ReviewAdd />} />
                <Route path="/SeeReview" element={<SeeReview />} />
                <Route path="/Approve" element={< Approve />} />
                <Route path="/AdminDelete" element={< AdminMovieDelete />} />
                <Route path="/edit" element={< EditReview />} />
            </Routes>
        </Router>
    );
};

export default App;
