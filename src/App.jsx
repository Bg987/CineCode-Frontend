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
            </Routes>
        </Router>
    );
};

export default App;
