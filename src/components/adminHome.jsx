import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, Avatar, Box } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { logoutAdmin } from "../services/api";


const socket = io("http://192.168.121.47:4000");

const AdminHome = () => {
    const [dashboardData, setDashboardData] = useState({});
    const [Lulr, setLurl] = useState(null);
    const [Sulr, setSurl] = useState(null);
    const [ActiveU, setActiveU] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const Aname = localStorage.getItem("Aname");
        if (!Aname) {
            navigate("/login");
        }
        socket.emit("req");//send real time data req to server
        socket.on("dashboard", (data) => {
            setDashboardData(data);
            if (data.LongestMovie?.Mid) {
                setLurl(`http://192.168.121.47:4000/apiSeeM/images/${data.LongestMovie.Mid}.jpg`);
            }
            if (data.SmallestMovie?.Mid) {
                setSurl(`http://192.168.121.47:4000/apiSeeM/images/${data.SmallestMovie.Mid}.jpg`);
            }
        });
        socket.on("ActiveU", (data) => setActiveU(data));

        return () => {
            socket.off("dashboard");
            socket.off("ActiveU");
        };
    }, []);

    const handleLogout = async () => {
        const res = await logoutAdmin();
        if (res.status === 200) {
            localStorage.clear();
            navigate("/login");
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", py: 3 }}>
            {/* 🔹 Header */}
            <AppBar position="static" sx={{ background: "linear-gradient(90deg, #1D2671, #C33764)" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h5" sx={{ color: "#ECF0F1", fontWeight: "bold" }}>
                        Welcome Admin
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#E74C31",
                            "&:hover": { backgroundColor: "#C0392B" },
                            fontWeight: "bold",
                            color: "#FFF",
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={() => alert("Feature coming soon!")}
                        sx={{
                            backgroundColor: "#E74C3C",
                            "&:hover": { backgroundColor: "#C0392B" },
                            fontSize: "1.2rem",
                            color: "#FFF",
                            fontWeight: "bold",
                        }}
                    >
                        Add Movie
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/Approve")}
                        sx={{
                            backgroundColor: "#E74C3C",
                            "&:hover": { backgroundColor: "#C0392B" },
                            fontSize: "1.2rem",
                            color: "#FFF",
                            fontWeight: "bold",
                        }}
                    >
                        Approve Movies
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/AdminDelete")}
                        sx={{
                            backgroundColor: "#E74C3C",
                            "&:hover": { backgroundColor: "#C0392B" },
                            fontSize: "1.2rem",
                            color: "#FFF",
                            fontWeight: "bold",
                        }}
                    >
                        Delete Movie
                    </Button>
                </Grid>
            </Grid>
            {/* 🔹 Dashboard Cards */}
            <Grid container spacing={2} sx={{ mt: 4, px: 3 }}>
    <Grid item xs={12} sm={6} md={4}>
        <Card
            sx={{
                background: "rgba(44, 62, 80, 0.8)",
                backdropFilter: "blur(10px)",
                color: "#ECF0F1",
                textAlign: "center",
                p: 2,
                borderRadius: "15px",
            }}
        >
            <CardContent>
                <Typography variant="h6">Total Movies</Typography>
                <Typography variant="h4" color="#E67E22">
                    {dashboardData.movieNo?.count || "--"}
                </Typography>

                <Box mt={2}>
                    <Typography variant="subtitle2" color="#3498DB">
                        By Admin: {dashboardData.AdminMovieNo?.count || "--"}
                    </Typography>
                    <Typography variant="subtitle2" color="#2ECC71">
                        By User: {(dashboardData.movieNo?.count - dashboardData.AdminMovieNo?.count) || "--"}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    </Grid>

    {[
         { label: dashboardData.AppMovieNo?.count?  "Movies to Approve":"No Movie for Approval", value: dashboardData.AppMovieNo?.count || "--" },
        { label: "Total Users", value: dashboardData.userNo?.count || "--" },
        { label: "Active Users", value: ActiveU || "--" },
    ].map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
                sx={{
                    background: "rgba(44, 62, 80, 0.8)",
                    backdropFilter: "blur(10px)",
                    color: "#ECF0F1",
                    textAlign: "center",
                    p: 2,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                    borderRadius: "15px",
                }}
            >
                <CardContent>
                    <Typography variant="h6">{item.label}</Typography>
                    <Typography variant="h4" color="#E74C3C">
                        {item.value}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    ))}
</Grid>

            {/* 🔹 Movie Details */}
            <Grid container spacing={2} sx={{ mt: 4, px: 3 }} justifyContent="center">
                {["LongestMovie", "SmallestMovie"].map((movieType, index) => {
                    const movie = dashboardData[movieType];
                    const imgUrl = movieType === "LongestMovie" ? Lulr : Sulr;

                    return (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card
                                sx={{
                                    background: "rgba(44, 62, 80, 0.8)",
                                    backdropFilter: "blur(10px)",
                                    color: "#ECF0F1",
                                    p: 2,
                                    textAlign: "center",
                                    borderRadius: "15px",
                                }}
                            >
                                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography variant="h6">
                                        {movieType === "LongestMovie" ? "Longest Movie" : "Smallest Movie"}
                                    </Typography>
                                    {movie ? (
                                        <>
                                            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                                <Avatar
                                                    variant="square"
                                                    src={imgUrl || ""}
                                                    sx={{
                                                        width: 180,
                                                        height: 180,
                                                        mb: 2,
                                                        borderRadius: "10px",
                                                    }}
                                                />
                                            </Box>
                                            <Typography><strong>Name:</strong> {movie.Mname}</Typography>
                                            <Typography><strong>Duration:</strong> {movie.Duration} mins</Typography>
                                            <Typography><strong>Language:</strong> {movie.Language}</Typography>
                                            <Typography><strong>Year:</strong> {movie.Year}</Typography>
                                            <Typography>
                                                <strong>Type:</strong>{" "}
                                                {Array.isArray(movie.Type)
                                                    ? movie.Type.join(", ")
                                                    : JSON.parse(movie.Type || "[]").join(", ")}
                                            </Typography>
                                            <Typography><strong>Description:</strong> {movie.Discription}</Typography>
                                        </>
                                    ) : (
                                        <Typography>--</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default AdminHome;
