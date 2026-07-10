import {Box, Container, TextField, Stack, Typography, Button} from "@mui/material";
import {useState} from "react";
import {login} from "../services/authService"
import useAuthStore from "../store/authStore"
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const setToken = useAuthStore((state) => state.setToken)
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = await login(username, password);
            setToken(data.access_token)
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container maxWidth="sm">
            <Box mt={10}>
                <Typography variant="h4" gutterBottom>
                    RouteIQ Login
                </Typography>
                <Stack spacing={2} sx={{mt: 2}}>
                    <TextField
                        label="username"
                        name="username"
                        variant="outlined"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        value={password}
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}>Login
                    </Button>

                </Stack>
            </Box>
        </Container>


    );
}

export default LoginPage;