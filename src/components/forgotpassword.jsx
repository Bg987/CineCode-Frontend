import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box, Container, CircularProgress } from "@mui/material";
import { forgotPassword } from "../services/api"; // Import API function
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await forgotPassword({ username });
       setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data.message || "Error sending reset link.");
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
        background: "url('/images/bg.jpg') center/cover no-repeat",
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
          <Typography variant="h4" sx={{ fontWeight: "light", color: "black", mb: 1 }}>
            Forgot Password 🔑
          </Typography>

          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{
              shrink: true,
              style: { color: "#444", fontSize: "14px", fontWeight: "bold" },
            }}
            sx={{
              mt: 2,
              input: { color: "#333", fontSize: "16px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.6)",
                border: "2px solid transparent",
                transition: "0.3s",
                "&:hover": { borderColor: "#ff6b6b" },
                "&.Mui-focused": { borderColor: "#ff6b6b", background: "rgba(255, 255, 255, 0.8)" },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleForgotPassword}
            disabled={loading}
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
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Password to registered Email"}
          </Button>

          {message && (
            <Typography align="center" sx={{ color: "red", marginTop: 2 }}>
              {message}
            </Typography>
          )}

          <Link to="/login" style={{ textDecoration: "none", color: "#00ffff", marginTop: "10px" }}>
            Back to Login
          </Link>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;