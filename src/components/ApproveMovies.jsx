import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    Snackbar,
    Alert,
    Skeleton,
} from "@mui/material";

const ApproveMovies = () => {
    const [pendingMovies, setPendingMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCards, setExpandedCards] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const navigate = useNavigate();
    const toggleDescription = (movieId) => {
        setExpandedCards((prev) => ({
            ...prev,
            [movieId]: !prev[movieId],
        }));
    };

    useEffect(() => {
        fetchPendingMovies();
    }, []);

    const fetchPendingMovies = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "http://192.168.121.47:4000/ApiApprove/MFApprovence",
                { withCredentials: true }
            );
            console.log(res.data)
            setPendingMovies(res.data);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || "Error fetching movies",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };
    const handleDecision = async (movieId, status) => {
        try {
            const res = await axios.post(
                `http://192.168.121.47:4000/ApiApprove/AOrD`,
                { movieId, status },
                { withCredentials: true }
            );
            setSnackbar({
                open: true,
                message: res.data.message || (status === 1 ? "Movie approved" : "Movie rejected"),
                severity: "success",
            });
            setPendingMovies((prev) => prev.filter((movie) => movie.Mid !== movieId));
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || "Operation failed",
                severity: "error",
            });
        }
    };

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
                    paddingX: "10px",
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
            <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4} >
                Pending Movie Approvals
            </Typography>

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
                    : pendingMovies.map((movie) => {
                        const isExpanded = expandedCards[movie.Mid];
                        const description = movie.Discription || "";
                        const shortDesc = description.slice(0, 100);

                        return (
                            <Grid item xs={12} sm={6} md={4} key={movie.Mid}>
                                <Card
                                    sx={{
                                        background: "#2C3E50",
                                        color: "#ECF0F1",
                                        borderRadius: 3,
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={`http://192.168.121.47:4000/apiSeeM/images/${movie.Mid}.jpg`}
                                        alt={movie.MovieName}
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
                                        <Typography variant="body2" sx={{ mt: 1, wordBreak: "break-word", overflowWrap: "break-word" }}>
                                            <strong>Description:</strong>{" "}
                                            {description.length > 100 ? (
                                                <>
                                                    {isExpanded ? description : `${shortDesc}... `}
                                                    <Button
                                                        size="small"
                                                        onClick={() => toggleDescription(movie.Mid)}
                                                        sx={{ textTransform: "none", color: "#90caf9" }}
                                                    >
                                                        {isExpanded ? "Read Less" : "Read More"}
                                                    </Button>
                                                </>
                                            ) : (
                                                description
                                            )}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <strong>Type:</strong>{" "}
                                            {Array.isArray(movie.Type)
                                                ? movie.Type.join(", ")
                                                : JSON.parse(movie.Type).join(", ")}
                                        </Typography>

                                        <Box mt={2} display="flex" gap={1}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleDecision(movie.Mid, 1)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDecision(movie.Mid, -1)}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
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

export default ApproveMovies;
