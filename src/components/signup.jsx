import { useState } from "react";
import { Link,useNavigate } from "react-router-dom"; // Import useNavigate
import { Box, TextField, Button, Typography, Container, Paper, CircularProgress } from "@mui/material";
import { signup, verifyOTP } from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otpDisabled, setOtpDisabled] = useState(true);
  
  const navigate = useNavigate(); // Initialize navigate

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await signup(formData);
      if (response.status === 201) {
        setOtpToken(response.data.otpToken);
        setOtpDisabled(false);
        setMessage("✅ OTP sent! Please enter to verify.");
      } else {
        setMessage("❌ Error occurred while sending OTP.");
      }
    } catch (error) {
      setMessage("❌ An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await verifyOTP({ otp, otpToken });

      if (response.status === 200) {
        setMessage("✅ Registration successful! Redirecting to login...");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (response.status === 409) {
        setMessage("❌ Email already registered.");
      } else {
        const result = await response.json();
        setMessage(`❌ OTP verification failed: ${result.message}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage("❌ " + error.response.data.message);
      } else {
        setMessage("❌ An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(5px)",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#20f000", mb: 2 }}>
            Welcome To Cinecode 🎭
          </Typography>

          {/* Signup Form */}
          <form onSubmit={handleSignup} style={{ width: "100%" }}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              variant="outlined"
              value={formData.username}
              onChange={handleInputChange}
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mt: 2 }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: "20px",
                background: "linear-gradient(45deg, #ff6b6b, #ff8e53)",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                transition: "0.3s",
                "&:hover": { background: "linear-gradient(45deg, #ff4757, #ff6b6b)" },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up & Get OTP"}
            </Button>
          </form>

          {/* OTP Verification Form */}
          <form onSubmit={handleVerifyOtp} style={{ width: "100%", marginTop: "16px" }}>
            <TextField
              label="Enter OTP"
              fullWidth
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={otpDisabled}
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={otpDisabled || loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
            </Button>
          </form>

          {message && (
            <Typography sx={{ mt: 2, color: message.includes("✅") ? "green" : "red" }}>
              {message}
            </Typography>
          )}
           <Link to="/forgotpassword" style={{ textDecoration: "none", color: "#ff6b6b", marginTop: "10px" }}>
                      <Typography variant="body2">Forgot Password?</Typography></Link>
                    <Link to="/login" style={{ textDecoration: "none", color: "#00ffff", marginTop: "10px" }}>
                        Already User? Login
                      </Link>
                   
        </Paper>
        
      </Container>
    </Box>
  );
};

export default Signup;
