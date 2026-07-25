import {
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {login} from "../services/authService";
import useAuthStore from "../store/authStore";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import axios from "axios";

const schema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
});

type LoginFormData = z.infer<typeof schema>;

function LoginPage() {
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);

    const [loginError, setLoginError] = useState("");

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LoginFormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoginError("");

        try {
            const response = await login(
                data.username,
                data.password
            );

            setToken(response.access_token);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setLoginError("Invalid username or password.");
                } else {
                    setLoginError("Unable to sign in. Please try again.");
                }
            } else {
                setLoginError("An unexpected error occurred.");
            }
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
                <CardContent sx={{p: 5}}>
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
                        sx={{mb: 4}}
                    >
                        USPS Route Management System
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <TextField
                                label="Email"
                                placeholder="you@example.com"
                                fullWidth
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                {...register("username")}
                            />

                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                {...register("password")}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing In..." : "Sign In"}
                            </Button>
                        </Stack>
                    </form>

                    {loginError && (
                        <Typography
                            color="error"
                            align="center"
                            sx={{mt: 2}}
                        >
                            {loginError}
                        </Typography>
                    )}

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        align="center"
                        display="block"
                        sx={{mt: 4}}
                    >
                        Internal Use Only
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}

export default LoginPage;