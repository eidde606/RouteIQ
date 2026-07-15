import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

interface Props {
    data: any;
    isPending: boolean;
    error: boolean;
}

function AIRecommendationCard({
    data,
    isPending,
    error,
}: Props) {

    if (isPending) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <CircularProgress size={24} />
                        <Typography>
                            AI is analyzing today's workload...
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 3 }}>
                Failed to analyze today's routes.
            </Alert>
        );
    }

    if (!data) return null;

    return (
        <Card
            sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: 3,
            }}
        >
            <CardContent>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={3}
                >
                    <SmartToyIcon color="primary" />

                    <Typography variant="h5" fontWeight="bold">
                        AI Workload Recommendation
                    </Typography>
                </Stack>

                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Card variant="outlined">

                            <CardContent>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    mb={2}
                                >
                                    <WarningAmberIcon color="warning" />

                                    <Typography
                                        variant="h6"
                                        color="warning.main"
                                    >
                                        Predicted Overtime
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    sx={{color: "warning.main"}}
                                >
                                    Route {data.overloaded_route.route_id}
                                </Typography>

                                <Typography variant="h6">
                                    {data.overloaded_route.carrier_name}
                                </Typography>

                                <Chip
                                    sx={{ mt: 2 }}
                                    color="warning"
                                    label={`Score ${data.overloaded_route.score}`}
                                />

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Card variant="outlined">

                            <CardContent>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    mb={2}
                                >
                                    <HandshakeIcon color="success" />

                                    <Typography
                                        variant="h6"
                                        color="success.main"
                                    >
                                        Recommended Helper
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    sx={{color: "success.main"}}
                                >
                                    Route {data.recommended_helper.route_id}
                                </Typography>

                                <Typography variant="h6">
                                    {data.recommended_helper.carrier_name}
                                </Typography>

                                <Chip
                                    sx={{ mt: 2 }}
                                    color="success"
                                    label={`Score ${data.recommended_helper.score}`}
                                />

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

                <Divider sx={{ my: 4 }} />

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={2}
                >
                    <LightbulbIcon color="info" />

                    <Typography variant="h6">
                        AI Reasoning
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        bgcolor: "grey.100",
                        p: 2,
                        borderRadius: 2,
                    }}
                >
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                        {data.recommendation}
                    </Typography>
                </Box>

            </CardContent>
        </Card>
    );
}

export default AIRecommendationCard;