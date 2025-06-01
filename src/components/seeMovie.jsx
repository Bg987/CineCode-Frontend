import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CardMedia,
  Skeleton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { seeMovies } from "../services/api";

const languages = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese",
  "Hindi", "Arabic", "Portuguese", "Russian", "Italian", "Korean", "Other"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

const ReadMoreText = ({ text = "", maxChars = 200 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > maxChars;
  const displayText = expanded || !isLong ? text : text.substring(0, maxChars) + "...";

  return (
    <Typography
      variant="body2"
      sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
    >
      Description: {displayText}{" "}
      {isLong && (
        <Box
          component="span"
          onClick={() => setExpanded(!expanded)}
          sx={{
            color: "#00BFFF",
            cursor: "pointer",
            fontWeight: 500,
            ml: 1,
          }}
        >
          {expanded ? "Show less" : "Read more"}
        </Box>
      )}
    </Typography>
  );
};

const SeeMovie = () => {
  const [filters, setFilters] = useState({ name: "", lang: "", year: "" });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [byYouOnly, setByYouOnly] = useState(false);
  const navigate = useNavigate();

  const fetchMovies = async (customFilters = filters) => {
    setLoading(true);
    try {
      const response = await seeMovies(
        customFilters.name,
        customFilters.lang,
        customFilters.year
      );
      if (response.data.length === 0) {
        //alert("No movies found");
        setMovies([]);
      } else {
        setMovies(response.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchMovies();
  };

  const handleReset = () => {
    const resetFilters = { name: "", lang: "", year: "" };
    setFilters(resetFilters);
    fetchMovies(resetFilters);
    setByYouOnly(false); // Also reset the "By You" filter
  };

  const renderedMovies = useMemo(() => {
    const filtered = byYouOnly
      ? movies.filter((movie) => movie.By === "You")
      : movies;

    return filtered.map((movie) => (
      <Grid item xs={12} sm={6} md={4} key={movie.Mid}>
        <Card
          sx={{
            background: movie.By === "You" ? "linear-gradient(135deg, #2C3E50, #34495E)" : "#2C3E50",
            color: "#ECF0F1",
            borderRadius: 3,
            boxShadow: movie.By === "You" ? "0 4px 20px rgba(41, 128, 185, 0.6)" : "none",
            transform: movie.By === "You" ? "scale(1.01)" : "none",
            transition: "all 0.3s ease-in-out",
            border: movie.By === "You" ? "2px solid #2980B9" : "none",
          }}
        >
          <CardMedia
            component="img"
            loading="lazy"
            onLoad={(e) => {
              e.target.style.opacity = 1;
            }}
            sx={{
              transition: "opacity 0.5s ease-in-out",
              opacity: 0,
              width: "100%",
              height: "300px",
              objectFit: "cover",
              backgroundColor: "#1c1c1c",
            }}
            image={`https://res.cloudinary.com/ddlyq5ies/image/upload/v1744478351/CineCode/${movie.Mid}.webp`}
            alt={movie.Mname}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>{movie.Mname}</Typography>
            <Typography variant="body2">Language: {movie.Language}</Typography>
            <Typography variant="body2">Year: {movie.Year}</Typography>
            <Typography variant="body2">Duration: {movie.Duration} min</Typography>
            <Typography variant="body2" fontWeight="bold">
              {movie.By === "You" ? "🎬 Your Movie" : movie.By === "Admin" ? "🛡️ By Admin" : "📽️ Listed by someone else"}
            </Typography>
            <ReadMoreText text={movie.Discription} maxChars={40} />
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#2980B9" }}
              onClick={() => navigate("/AddReview", { state: { movie } })}
            >
              Want to give review ?
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ));
  }, [movies, byYouOnly]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #1D4350, #A43931)",
        py: 5,
        px: 3,
        color: "#fff",
        scrollBehavior: "smooth",
        willChange: "transform",
        transform: "translateZ(0)",
        WebkitFontSmoothing: "antialiased"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
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
          Back
        </Button>
      </Box>

      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
        Explore Movies
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} justifyContent="center" mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search by Name"
            name="name"
            value={filters.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ backgroundColor: "#ffffff" }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            select
            fullWidth
            label="Language"
            name="lang"
            value={filters.lang}
            onChange={handleChange}
            variant="outlined"
            sx={{ backgroundColor: "#ffffff" }}
          >
            <MenuItem value="">All</MenuItem>
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>{lang}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            select
            fullWidth
            label="Year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            variant="outlined"
            sx={{ backgroundColor: "#ffffff" }}
          >
            <MenuItem value="">All</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center" gap={1}>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleReset} sx={{ color: "#fff", borderColor: "#fff" }}>
            Reset
          </Button>
        </Grid>
      </Grid>

      {/* By You Toggle */}
      <Box display="flex" justifyContent="center" mb={3}>
        <FormControlLabel
          control={
            <Switch
              checked={byYouOnly}
              onChange={(e) => setByYouOnly(e.target.checked)}
              sx={{ color: "#fff" }}
            />
          }
          label="Only show my movies"
          sx={{ color: "#fff" }}
        />
      </Box>

      {/* Movie Cards or Skeletons */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ background: "#2C3E50", borderRadius: 3 }}>
                  <Skeleton variant="rectangular" height={300} animation="wave" />
                  <CardContent>
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="90%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : renderedMovies}
      </Grid>
    </Box>
  );
};

export default SeeMovie;
