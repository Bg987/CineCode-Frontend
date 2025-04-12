import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    Divider,
    Skeleton,
} from "@mui/material";
import { SeeR } from "../services/api";

const languages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese",
    "Hindi", "Arabic", "Portuguese", "Russian", "Italian", "Korean", "Other"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

const SeeReview = () => {
    const [filters, setFilters] = useState({ name: "", lang: "", year: "" });
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [expandedReviews, setExpandedReviews] = useState({});
    const navigate = useNavigate();

    const fetchReviews = async (customFilters = filters) => {
        setLoading(true);
        try {
            const response = await SeeR();
            const filtered = response.data.filter((movie) => {
                const matchLang = customFilters.lang ? movie.Language === customFilters.lang : true;
                const matchYear = customFilters.year ? movie.Year == customFilters.year : true;
                const matchName = customFilters.name
                    ? movie.Mname.toLowerCase().includes(customFilters.name.toLowerCase())
                    : true;
                return matchLang && matchYear && matchName;
            });
            setReviews(filtered);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        fetchReviews();
    };

    const handleReset = () => {
        const resetFilters = { name: "", lang: "", year: "" };
        setFilters(resetFilters);
        fetchReviews(resetFilters);
    };

    const toggleDescription = (movieId) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [movieId]: !prev[movieId],
        }));
    };

    const toggleReview = (reviewKey) => {
        setExpandedReviews((prev) => ({
            ...prev,
            [reviewKey]: !prev[reviewKey],
        }));
    };

    const getTruncatedText = (text, limit) => {
        if (text.length <= limit) return text;
        return text.slice(0, limit) + "...";
    };
    
    const renderedCards = useMemo(() => {
        return reviews.map((movie) => {
            const imageUrl = `https://res.cloudinary.com/ddlyq5ies/image/upload/v1744478351/CineCode/${movie.Mid}.webp`;
            return (
                <Grid item xs={12} key={movie.Mid}>
                    <Card sx={{ background: "#2C3E50", color: "#ECF0F1", borderRadius: 3, p: 2 }}>
                        <Grid container spacing={2}>
                            {/* Movie Image */}
                            <Grid item xs={12} sm={4}>
                                <Box
                                    component="img"
                                    src={imageUrl}
                                    alt={movie.Mname}
                                    loading="lazy"
                                    sx={{
                                        width: "100%",
                                        height: { xs: 250, sm: 300 },
                                        objectFit: "cover",
                                        borderRadius: 2,
                                        border: "2px solid #ECF0F1",
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
                                    }}
                                />
                            </Grid>

                            {/* Movie Details */}
                            <Grid item xs={12} sm={8}>
                                <Box>
                                    <Typography variant="h6">{movie.Mname}</Typography>
                                    <Typography variant="body2">Language: {movie.Language}</Typography>
                                    <Typography variant="body2">Year: {movie.Year}</Typography>
                                    <Typography variant="body2">Duration: {movie.Duration} min</Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1,
                                            whiteSpace: "pre-line",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {expandedDescriptions[movie.Mid]
                                            ? movie.Discription
                                            : getTruncatedText(movie.Discription, 150)}
                                        {movie.Discription.length > 150 && (
                                            <Box
                                                component="span"
                                                onClick={() => toggleDescription(movie.Mid)}
                                                sx={{ color: "#3498DB", cursor: "pointer", ml: 1, fontWeight: "bold" }}
                                            >
                                                {expandedDescriptions[movie.Mid] ? "See Less" : "See More"}
                                            </Box>
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Reviews */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2, borderColor: "#ECF0F1" }} />
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Reviews:
                                </Typography>
                                {movie.review.length === 0 ? (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        No reviews yet.
                                    </Typography>
                                ) : (
                                    movie.review.map((rev, idx) => {
                                        const reviewKey = `${movie.Mid}-${idx}`;
                                        return (
                                            <Box
                                                key={reviewKey}
                                                sx={{
                                                    my: 1,
                                                    p: 1,
                                                    backgroundColor: "#34495E",
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                    @{rev.username==localStorage.getItem("Uname")?"You":rev.username} — ⭐ {rev.rating}/5
                                                </Typography>
                                                <Typography variant="body2" sx={{ wordWrap: "break-word" }}>
                                                    {expandedReviews[reviewKey]
                                                        ? rev.review
                                                        : getTruncatedText(rev.review, 100)}
                                                    {rev.review.length > 100 && (
                                                        <Box
                                                            component="span"
                                                            onClick={() => toggleReview(reviewKey)}
                                                            sx={{
                                                                color: "#3498DB",
                                                                cursor: "pointer",
                                                                ml: 1,
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            {expandedReviews[reviewKey] ? "See Less" : "See More"}
                                                        </Box>
                                                    )}
                                                </Typography>
                                            </Box>
                                        );
                                    })
                                )}
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            );
        });
    }, [reviews, expandedDescriptions, expandedReviews]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(to right, #1D4350, #A43931)",
                py: 5,
                px: { xs: 2, sm: 3, md: 5 },
                color: "#fff",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
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
                Movie Reviews
            </Typography>

            {/* Filter Section */}
            <Grid container spacing={2} justifyContent="center" mb={4}>
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

            {/* Cards or Loader */}
            <Grid container spacing={3}>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Grid item xs={12} key={i}>
                            <Card sx={{ background: "#2C3E50", borderRadius: 3 }}>
                                <CardContent>
                                    <Skeleton variant="text" width="60%" height={30} />
                                    <Skeleton variant="text" width="40%" />
                                    <Skeleton variant="rectangular" height={80} />
                                    <Skeleton variant="text" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : reviews.length === 0 ? (
                    <Grid item xs={12}>
                        <Card sx={{ background: "#2C3E50", color: "#ECF0F1", borderRadius: 3 }}>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    No movies found
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (
                    renderedCards
                )}
            </Grid>
        </Box>
    );
};

export default SeeReview;
