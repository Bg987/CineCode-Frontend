import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddMovieApi } from "../services/api";

const genres = [
    "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "Historical", "Horror", "Musical", "Mystery",
    "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
];

const languages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese",
    "Hindi", "Arabic", "Portuguese", "Russian", "Italian", "Korean", "Other"
];

const AddMovie = () => {
    const initialMovieData = {
        name: "",
        releaseYear: "",
        language: "",
        type: [],
        description: "",
        duration: "",
        file: null,
    };

    const navigate = useNavigate();
    const [movieData, setMovieData] = useState(initialMovieData);
    const [loading, setLoading] = useState(false); // 👈 Loading state

    const handleReset = () => {
        setMovieData(initialMovieData);
        setLoading(false);
    };

    const handleChange = (e) => {
        setMovieData({ ...movieData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setMovieData((prev) => ({
            ...prev,
            type: checked ? [...prev.type, value] : prev.type.filter((genre) => genre !== value),
        }));
    };

    const handleFileChange = (e) => {
        setMovieData({ ...movieData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!movieData.file) {
            alert("Please upload an image file.");
            return;
        }

        setLoading(true); 

        const formData = new FormData();
        formData.append("name", movieData.name);
        formData.append("releaseYear", movieData.releaseYear);
        formData.append("language", movieData.language);
        formData.append("type", JSON.stringify(movieData.type));
        formData.append("description", movieData.description);
        formData.append("duration", movieData.duration);
        formData.append("movieImage", movieData.file);

        try {
            const res = await AddMovieApi(formData);
           
            if (res.status === 201) {
                alert(res.data.message);
                handleReset();
            } else {
                alert("Unexpected error occurred. Try again.");
            }
        } catch (error) {
            console.error("Error submitting movie:", error);
            if (error.response) {
                alert(error.response.data.message || "Failed to add movie.");
            } else {
                alert("Network error. Check your connection.");
            }
        } finally {
            setLoading(false); // 👈 Stop loading
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(90deg, #1D2671, #C33764)",
                color: "#ECF0F1",
                py: 4,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mb: 3,
                    paddingX: "10px",
                }}
            >
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
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

            <Card
                sx={{
                    maxWidth: 600,
                    margin: "auto",
                    padding: 3,
                    borderRadius: 3,
                    background: "rgba(44, 62, 80, 0.8)",
                    backdropFilter: "blur(10px)",
                    color: "#ECF0F1",
                    boxShadow: "0px 4px 15px rgba(231, 76, 60, 0.4)",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                    >
                        Add Movie Details
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Movie Name"
                            name="name"
                            value={movieData.name}
                            onChange={handleChange}
                            required
                            sx={{ mt: 2, background: "#2C3E50", borderRadius: 1 }}
                        />

                        <FormControl fullWidth sx={{ mt: 2, background: "#2C3E50", borderRadius: 1 }}>
                            <InputLabel sx={{ color: "white" }}>Release Year</InputLabel>
                            <Select
                                name="releaseYear"
                                value={movieData.releaseYear}
                                onChange={handleChange}
                                required
                            >
                                {Array.from({ length: 50 }, (_, i) =>
                                    new Date().getFullYear() - i
                                ).map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2, background: "#2C3E50", borderRadius: 1 }}>
                            <InputLabel sx={{ color: "white" }}>Language</InputLabel>
                            <Select
                                name="language"
                                value={movieData.language}
                                onChange={handleChange}
                                required
                            >
                                {languages.map((lang) => (
                                    <MenuItem key={lang} value={lang}>
                                        {lang}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography variant="body1" sx={{ fontWeight: "bold", mt: 3 }}>
                            Select Genres:
                        </Typography>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            {genres.map((genre) => (
                                <Grid item xs={6} key={genre}>
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            color: "white",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            name="type[]"
                                            value={genre}
                                            checked={movieData.type.includes(genre)}
                                            onChange={handleCheckboxChange}
                                        />
                                        {genre}
                                    </label>
                                </Grid>
                            ))}
                        </Grid>

                        <TextField
                            fullWidth
                            label="Description (max 200 words)"
                            name="description"
                            value={movieData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            required
                            sx={{ mt: 2, background: "#2C3E50", borderRadius: 1 }}
                        />

                        <TextField
                            fullWidth
                            label="Duration (in minutes)"
                            type="number"
                            name="duration"
                            value={movieData.duration}
                            onChange={handleChange}
                            required
                            sx={{ mt: 2, background: "#2C3E50", borderRadius: 1 }}
                        />

                        <Typography variant="body1" sx={{ fontWeight: "bold", mt: 3 }}>
                            Upload Poster:
                        </Typography>
                        <input
                            type="file"
                            name="movieImage"
                            accept="image/jpeg"
                            onChange={handleFileChange}
                            required
                            style={{ marginTop: "8px", color: "white" }}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                            <Button onClick={handleReset} type="reset" variant="outlined">
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AddMovie;
