import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AddReview, reviewsById } from "../services/api";

const ReviewAdd = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const movie = state?.movie;

  const [serverMessage, setServerMessage] = useState("");
  const [messageColor, setMessageColor] = useState("green");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");
  const [temp, setTemp] = useState(`Share your thoughts about ${movie?.Mname} (${movie?.Year})`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReviews, setExistingReview] = useState([]); // NEW

  useEffect(() => {
    if (!movie) {
      navigate("/SeeMovie");
      return;
    }
    fetchReview();
  }, []);
  const fetchReview = async () => {
    try {
      const response = await reviewsById(movie.Mid);
      console.log("Review response:", response);
      if (response?.status === 200 && response.data) {
        setExistingReview(response.data);
      } else {
        console.error("Failed to fetch review data");
      }
    } catch (error) {
      if(error?.response?.status === 404) {
         setTemp(`Be First reviewer of ${movie.Mname} (${movie.Year})`);
      }
      console.error("Error fetching review data:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText || !rating) {
      setServerMessage("Please fill all fields.");
      setMessageColor("red");
      return;
    }

    if (reviewText.split(" ").length > 125) {
      setServerMessage("Review exceeds 125 words limit.");
      setMessageColor("red");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AddReview(movie.Mid, movie.Mname, reviewText, rating);
      if (response?.status === 201) {
        setServerMessage("Review submitted successfully!");
        setMessageColor("green");
        setReviewText("");
        setRating("");
        setExistingReview({ review: reviewText, rating }); // Show new review
      } else {
        setServerMessage(response?.data?.message || "Unexpected response.");
        setMessageColor("red");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      setServerMessage(error?.response?.data?.message || "Failed to add review.");
      setMessageColor("red");
    } finally {
      setIsSubmitting(false);
      setTemp(`Great ! you give review about ${movie.Mname} (${movie.Year})`);
      fetchReview(); // Refresh existing reviews
    }
  };

  if (!movie) {
    return (
      <Typography sx={{ mt: 10, textAlign: "center", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
        No movie data found
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: 2,
        pt: { xs: 6, sm: 10 },
        pb: 4,
        background: "linear-gradient(90deg, #1D2671, #C33764)",
        overflowY: "auto",
      }}
    >
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/Uhome")}
            sx={{
              borderColor: "#ECF0F1",
              color: "#ECF0F1",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#ECF0F1", color: "#2C3E50" },
            }}
          >
            Home
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/SeeMovie")}
            sx={{ borderRadius: 2, fontWeight: "bold", px: 4 }}
          >
            Back
          </Button>
        </Stack>

        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: "bold", mb: 1, color: "#D32F2F", fontSize: { xs: "2rem", sm: "2.8rem" } }}
        >
          {movie.Mname} Review
        </Typography>

        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#ECEFF1", mb: 3, fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.3rem" } }}
        >
          {temp}
        </Typography>

        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            background: "linear-gradient(135deg, #1C1F2A, #242A37)",
            color: "#ECF0F1",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: "bold", mb: 1, color: "#B0BEC5" }}>
                  Enter Review (Max 125 words):
                </Typography>
                <TextField
                  multiline
                  rows={5}
                  fullWidth
                  variant="outlined"
                  sx={{
                    backgroundColor: "#2B2F3B",
                    borderRadius: 2,
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#78909C" },
                      "&:hover fieldset": { borderColor: "#90A4AE" },
                      "&.Mui-focused fieldset": { borderColor: "#78909C" },
                    },
                  }}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  inputProps={{ maxLength: 2200 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: "bold", mb: 2, color: "#CFD8DC" }}>
                  Select Rating:
                </Typography>
                <ToggleButtonGroup
                  value={rating}
                  exclusive
                  onChange={(e, newRating) => {
                    if (newRating !== null) setRating(newRating);
                  }}
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    "& .MuiToggleButton-root": {
                      backgroundColor: "#2B2F3B",
                      color: "#90A4AE",
                      fontWeight: "bold",
                      borderRadius: 2,
                      "&:hover": { backgroundColor: "#546E7A", color: "white" },
                      "&.Mui-selected": { backgroundColor: "#546E7A", color: "white" },
                    },
                  }}
                >
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <ToggleButton key={rate} value={String(rate)} sx={{ px: 3, py: 1 }}>
                      {rate}⭐
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    background: "linear-gradient(135deg, #D32F2F, #B71C1C)",
                    color: "#ECEFF1",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderRadius: 3,
                    padding: "10px 20px",
                    "&:hover": { background: "#C62828" },
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Review"}
                </Button>
              </Grid>
            </Grid>

            {serverMessage && (
              <Typography
                sx={{
                  mt: 3,
                  color: messageColor,
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  textAlign: "center",
                }}
              >
                {serverMessage}
              </Typography>
            )}
          </form>
        </Paper>
        {existingReviews.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#ECEFF1" }}>
              Existing Reviews:
            </Typography>
            {existingReviews.map((rev, index) => (
              <Paper
                key={index}
                elevation={4}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#37474F",
                  color: "#ECEFF1",
                }}
              >
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Review:</strong> {rev.review}
                </Typography>
                <Typography variant="body1">
                  <strong>Rating:</strong>{" "}
                  {[...Array(Number(rev.rating))].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ReviewAdd;
