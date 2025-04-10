import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
  Skeleton,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const AdminMovieDelete = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [nameFilter, setNameFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://192.168.121.47:4000/apifAndD/getMovies", { withCredentials: true });
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies", err);
      setSnackbar({ open: true, message: 'Failed to load movies', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    try {
      const response = await axios.delete("http://192.168.121.47:4000/apifAndD/deleteMovie", {
        data: { movieId },
        withCredentials: true
      });
      setMovies(prev => prev.filter(movie => movie.Mid !== movieId));
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
    } catch (err) {
      console.error("Error deleting movie", err);
      setSnackbar({ open: true, message: 'Failed to delete movie', severity: 'error' });
    }
  };

  const filteredMovies = movies.filter((movie) => {
    return (
      movie.Mname.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (yearFilter === '' || movie.Year === yearFilter) &&
      (languageFilter === '' || movie.Language.toLowerCase() === languageFilter.toLowerCase())
    );
  });

  const uniqueYears = [...new Set(movies.map(m => m.Year))];
  const uniqueLanguages = [...new Set(movies.map(m => m.Language))];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #1D4350, #A43931)",
        py: 5,
        px: 3,
        color: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/AHome")}
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

      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        Manage Approved Movies
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }} justifyContent="center">
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#2C3E50" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            select
            label="Filter by Year"
            variant="outlined"
            fullWidth
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          >
            <MenuItem value="">All Years</MenuItem>
            {uniqueYears.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            select
            label="Filter by Language"
            variant="outlined"
            fullWidth
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          >
            <MenuItem value="">All Languages</MenuItem>
            {uniqueLanguages.map((lang) => (
              <MenuItem key={lang} value={lang}>{lang}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

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
                  </CardContent>
                </Card>
              </Grid>
            ))
          : filteredMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} key={movie.Mid}>
                <Card sx={{ background: "#2C3E50", color: "#ECF0F1", borderRadius: 3 }}>
                  <CardMedia
                    component="img"
                    image={`http://192.168.121.47:4000/apiSeeM/images/${movie.Mid}.jpg`}
                    alt={movie.Mname}
                    sx={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      backgroundColor: "#1c1c1c",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{movie.Mname}</Typography>
                    <Typography variant="body2" mt={1}><strong>Language:</strong> {movie.Language}</Typography>
                    <Typography variant="body2"><strong>Year:</strong> {movie.Year}</Typography>
                    <Typography variant="body2"><strong>Duration:</strong> {movie.Duration} mins</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Type:</strong>{" "}
                      {Array.isArray(movie.Type)
                        ? movie.Type.join(", ")
                        : JSON.parse(movie.Type).join(", ")}
                    </Typography>

                    <Box mt={2} display="flex" justifyContent="flex-start">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(movie.Mid)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminMovieDelete;
