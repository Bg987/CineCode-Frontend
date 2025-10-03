import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, TextField, Button,
    Grid, Rating, Box, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getuserMovie, editReview } from '../services/api';

const EditReview = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingIndex, setUpdatingIndex] = useState(null); // to track which movie is updating
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await getuserMovie();
                setMovies(res.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user movies:', error);
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const handleInputChange = (index, field, value) => {
        const updatedMovies = [...movies];
        updatedMovies[index][field] = value;
        setMovies(updatedMovies);
    };

    const handleUpdate = async (index) => {
        setUpdatingIndex(index);
        const updatedMovie = movies[index];

        const data = {
            Mid: updatedMovie.Mid,
            Rid: updatedMovie.id,
            review: updatedMovie.review,
            rating: updatedMovie.rating,
        };

        try {
            const res = await editReview(data);
            setSnackbar({ open: true, message: res.data.message || "Review updated!", severity: "success" });
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: err.response?.data?.error || "Something went wrong", severity: "error" });
        }
        setUpdatingIndex(null);
    };

    return (
        <Box sx={{ background: "linear-gradient(to right, #1D4350, #A43931)", minHeight: '100vh', py: 4 }}>
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

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularProgress sx={{ color: "#ECF0F1" }} />
                </Box>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {movies.map((movie, index) => (
                        <Grid item xs={12} md={10} key={movie.Mid}>
                            <Card sx={{ backgroundColor: '#1e1e1e', color: '#fff', p: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <img
                                            src={`https://res.cloudinary.com/ddlyq5ies/image/upload/v1744478351/CineCode/${movie.Mid}.webp`}
                                            alt={movie.Mname}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '10px',
                                                objectFit: 'cover',
                           4444444444444444444444444444                 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <CardContent>
                                            <Typography variant="h5" gutterBottom>{movie.Mname}</Typography>
                                            <Typography variant="body2" color="#aaa">Year: {movie.Year}</Typography>
                                            <Typography variant="body2" color="#aaa">Duration: {movie.Duration} min</Typography>
                                            <Typography variant="body2" color="#aaa">Language: {movie.Language}</Typography>
                                            <Typography variant="body2" color="#aaa">
                                                Genres: {JSON.parse(movie.Type).join(', ')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }} color="#aaa">
                                                Description: {movie.Discription}
                                            </Typography>

                                            <Box sx={{ mt: 3 }}>
                                                <TextField
                                                    label="Your Review"
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={movie.review}
                                                    onChange={(e) => handleInputChange(index, 'review', e.target.value)}
                                                    sx={{
                                                        '& .MuiInputBase-root': { color: '#fff' },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': { borderColor: '#555' },
                                                            '&:hover fieldset': { borderColor: '#888' },
                                                            '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                                                        },
                                                        '& .MuiInputLabel-root': { color: '#aaa' },
                                                        '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
                                                    }}
                                                />

                                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                                    <Typography sx={{ mr: 1, color: '#aaa' }}>Rating:</Typography>
                                                    <Rating
                                                        value={movie.rating}
                                                        onChange={(e, newValue) => handleInputChange(index, 'rating', newValue)}
                                                        precision={1}
                                                    />
                                                </Box>

                                                <Box sx={{ mt: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleUpdate(index)}
                                                        disabled={updatingIndex === index}
                                                        sx={{
                                                            backgroundColor: '#1976d2',
                                                            '&:hover': { backgroundColor: '#115293' }
                                                        }}
                                                    >
                                                        {updatingIndex === index ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Update Review"}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Snackbar for messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EditReview;
