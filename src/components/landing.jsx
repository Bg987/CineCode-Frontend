import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Box } from "@mui/material";
import { Movie, Star, People, Facebook, Twitter, Instagram } from "@mui/icons-material";
import { useGlobalState } from "./GS";
import { logoutUser } from "../services/api";

const CineCodeLanding = () => {
  const { isLoggedIn, dologout } = useGlobalState();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isLoggedIn) {
      await logout();
      localStorage.removeItem("User");
      dologout();

    }
      navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ background: "linear-gradient(90deg, #1D2671, #C33764)" }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, color: "#ECF0F1", fontWeight: "bold" }}>
            CineCode
          </Typography>
          <Button sx={{ color: "#ECF0F1", fontWeight: "bold" }} onClick={handleClick}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
          <Button sx={{ color: "#ECF0F1", fontWeight: "bold" }} onClick={() => navigate("/about")}>
            About
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 8, background: "url('/images/hero-bg.jpg') center/cover", color: "#2C3E50" }}>
        <Typography variant="h2" sx={{ fontWeight: "bold" , color : '#34495E' }} gutterBottom>
          Discover & Review Your Favorite Movies
        </Typography>
        <Typography variant="h6" color="#1C3E50" gutterBottom>
          Join CineCode to explore, review, and rate movies with a passionate community.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#E74C3C",
            color: "#FFF",
            mt: 3,
            fontSize: "1.2rem",
            px: 3,
            "&:hover": { backgroundColor: "#C0392B" },
          }}
          onClick={() => navigate(isLoggedIn ? "/explore" : "/signup")}
        >
          {isLoggedIn ? "Explore Now" : "Join CineCode"}
        </Button>
      </Box>

      {/* Features Section */}
      <Container sx={{ my: 6 }}>
        <Grid container spacing={4}>
          {[
            { icon: <Movie fontSize="large" sx={{ color: "#E74C3C" }} />, title: "Extensive Movie Database", desc: "Explore a vast collection of movies and their details." },
            { icon: <Star fontSize="large" sx={{ color: "#E74C3C" }} />, title: "Rate & Review", desc: "Share your thoughts and ratings on movies." },
            { icon: <People fontSize="large" sx={{ color: "#E74C3C" }} />, title: "Community Driven", desc: "Engage with fellow movie lovers and discuss films." },
          ].map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  background: "rgba(44, 62, 80, 0.8)",
                  backdropFilter: "blur(10px)",
                  color: "#ECF0F1",
                  textAlign: "center",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                  borderRadius: "15px",
                }}
              >
                <CardContent>
                  {feature.icon}
                  <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="#BDC3C7">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#2C3E50", py: 3, textAlign: "center" }}>
        <Typography variant="body1" sx={{ color: "#E74C3C", fontWeight: "bold" }}>
          &copy; 2025 CineCode. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default CineCodeLanding;
