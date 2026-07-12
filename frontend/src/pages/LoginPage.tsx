import {
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";
import useAuthStore from "../store/authStore";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const setToken = useAuthStore((state) => state.setToken);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = await login(username, password);
            setToken(data.access_token);
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f5f5f5",
            }}
        >
            <Card
                sx={{
                    width: 450,
                    borderRadius: 2,
                    boxShadow: 4,
                }}
            >
                <CardContent sx={{ p: 5 }}>
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                    >
                        RouteIQ
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        USPS Route Management System
                    </Typography>

                    <Stack spacing={3}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            fullWidth
                        />

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleLogin}
                        >
                            Sign In
                        </Button>
                    </Stack>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        align="center"
                        display="block"
                        sx={{ mt: 4 }}
                    >
                        Internal Use Only
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}

export default LoginPage;