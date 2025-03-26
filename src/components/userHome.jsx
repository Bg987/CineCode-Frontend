import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import {logoutUser} from "../services/api"; 

const UserHome = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("Uname");
    if (storedUser) {
      setUsername(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);
  const handleLogout =async () => {
    const res = await logoutUser();
    if(res.status===200){
        localStorage.clear();
        navigate("/login");
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #141E30, #243B55)", // Gradient background
        padding: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 5,
          borderRadius: "20px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
          color: "#fff",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "#ffcc00" }}>
          🎬 Welcome, {username || "User"}
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={() => alert("Feature coming soon!")}
            sx={{
              background: "linear-gradient(45deg, #ff6b6b, #ff4757)",
              "&:hover": { background: "linear-gradient(45deg, #ff4757, #ff0000)" },
            }}
          >
            ➕ Add Movie
          </Button>
          <Button
            variant="contained"
            onClick={() => alert("Feature coming soon!")}
            sx={{
              background: "linear-gradient(45deg, #ffa502, #ff7f50)",
              "&:hover": { background: "linear-gradient(45deg, #ff7f50, #ff4500)" },
            }}
          >
            ✏️ Edit Review
          </Button>
          <Button
            variant="contained"
            onClick={() => alert("Feature coming soon!")}
            sx={{
              background: "linear-gradient(45deg, #1e90ff, #0077b6)",
              "&:hover": { background: "linear-gradient(45deg, #0077b6, #003566)" },
            }}
          >
            👀 See Reviews
          </Button>
          <Button
            variant="contained"
            onClick={() => alert("Feature coming soon!")}
            sx={{
              background: "linear-gradient(45deg, #2ed573, #1e9c6a)",
              "&:hover": { background: "linear-gradient(45deg, #1e9c6a, #147d50)" },
            }}
          >
            📝 Write Review
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              fontWeight: "bold",
              mt: 2,
              "&:hover": { background: "#b30000" },
            }}
          >
            🚪 Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UserHome;
