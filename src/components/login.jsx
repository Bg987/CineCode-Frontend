import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Container, Paper, Radio,
  RadioGroup, FormControlLabel, CircularProgress
} from "@mui/material";
import { login } from "../services/api";

const Login = () => {
  const [data, setData] = useState({ Username: "", password: "" });
  const [role, setRole] = useState("user");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const response = await login({ ...data, role }); // Send role in request
      if (response.data) {
        localStorage.setItem(role === "user" ? "Uname" : "Aname", data.Username);
        navigate(role === "user" ? "/Uhome" : "/AHome");
      }
    } catch (error) {
      console.log(error);
      setMsg(error.response?.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "url('/images/bg.jpg') center/cover no-repeat", padding: 2 }}>
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "20px", background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", border: "2px solid rgba(255, 255, 255, 0.2)", boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.2)" }}>
          <Typography variant="h4" sx={{ fontWeight: "light", color: "black", mb: 1 }}>
            Welcome Back 🎬
          </Typography>

          <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)} sx={{ mb: 2 }}>
            <FormControlLabel value="user" control={<Radio color="secondary" />} label="User" />
            <FormControlLabel value="admin" control={<Radio color="secondary" />} label="Admin" />
          </RadioGroup>

          <TextField label="Username" type="text" name="Username" fullWidth variant="outlined" onChange={handleChange} sx={{ mt: 2 }} />
          <TextField label="Password" type="password" name="password" fullWidth variant="outlined" onChange={handleChange} sx={{ mt: 2 }} />

          <Button variant="contained" fullWidth onClick={handleLogin} disabled={loading} sx={{ mt: 3 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </Button>

          {msg && <Typography align="center" sx={{ color: "red", marginTop: 2 }}>{msg}</Typography>}
          <Link to="/forgotpassword" style={{ textDecoration: "none", color: "#ff6b6b", marginTop: "10px", fontWeight: "bold" }}>
            <Typography variant="body2">Forgot Password?</Typography>
          </Link>
          <Link to="/Uhome" style={{ textDecoration: "none", color: "#af6b6c", marginTop: "10px", fontWeight: "bold" }}>
            <Typography variant="body2">Forgot Logout in last session!?</Typography>
          </Link>
         
          <Link to="/signup" style={{ textDecoration: "none", color: "#00ffff", marginTop: "10px", fontWeight: "bold" }}>
            <Typography variant="body2">New User? Sign Up</Typography>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
