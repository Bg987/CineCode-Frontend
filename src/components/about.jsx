import React from "react";
import { Container, Typography, Card, CardContent, Grid, Box, Link, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const teamMembers = [
  { name: "Godhaniya Bhavya", email: "220170116016@vgecg.ac.in", phone: "9979710503" },
  { name: "Pipalva Smit", email: "220170116050@vgecg.ac.in", phone: "987-654-3210" },
  { name: "Shah Kavan", email: "220170116059@vgecg.ac.in", phone: "555-123-4567" },
  { name: "Patel Roshni", email: "bob.brow", phone: "666-234-5678" },
  { name: "Bhuriya Dharini", email: "charlie.white@example.com", phone: "777-345-6789" },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 5, textAlign: "center" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3, fontSize: { xs: "2rem", md: "3rem" } }}>
        About Us
      </Typography>
      <Typography variant="h6" sx={{ color: "gray", mb: 2, fontSize: { xs: "1rem", md: "1.25rem" } }}>
        Meet our dedicated team behind CineCode
      </Typography>
      <Typography variant="h6" sx={{ color: "gray", mb: 5, fontSize: { xs: "1rem", md: "1.25rem" } }}>
        Vishwakarma Government Engineering College - Computer Engineering Department
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                background: "#2C3E50",
                color: "#ECF0F1",
                textAlign: "center",
                borderRadius: "15px",
                padding: { xs: 2, md: 3 },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", md: "1.25rem" } }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                  <Link href={`mailto:${member.email}`} sx={{ color: "#E74C3C", textDecoration: "none" }}>
                    {member.email}
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                  <Link href={`tel:${member.phone}`} sx={{ color: "#E74C3C", textDecoration: "none" }}>
                    {member.phone}
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" sx={{ mr: 2, backgroundColor: "#E74C3C" }} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#2C3E50" }} onClick={() => navigate("/login") }>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default AboutUs;