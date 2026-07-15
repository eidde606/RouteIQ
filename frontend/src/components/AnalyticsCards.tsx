import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";
import type {RouteAssignment} from "../types/routeAssignment";
import RouteIcon from "@mui/icons-material/Route";
import MailIcon from "@mui/icons-material/Mail";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HandshakeIcon from "@mui/icons-material/Handshake";

interface AnalyticsCardsProps {
    assignments: RouteAssignment[];
    overloadedRouteId?: number;
    recommendedHelperId?: number;
}

function AnalyticsCards({
                            assignments,
                            overloadedRouteId,
                            recommendedHelperId,
                        }: AnalyticsCardsProps) {

    const totalRoutes = assignments.length;

    const averageDps =
        totalRoutes > 0
            ? Math.round(
                assignments.reduce(
                    (total, assignment) => total + assignment.dps,
                    0
                ) / totalRoutes
            )
            : 0;

    const averageParcels =
        totalRoutes > 0
            ? Math.round(
                assignments.reduce(
                    (total, assignment) => total + assignment.parcels,
                    0
                ) / totalRoutes
            )
            : 0;

    const averageAccountables =
        totalRoutes > 0
            ? (
                assignments.reduce(
                    (total, assignment) => total + assignment.accountables,
                    0
                ) / totalRoutes
            ).toFixed(1)
            : "0";

    const analytics = [
        {
            title: "Total Routes",
            value: totalRoutes,
            icon: <RouteIcon color="primary"/>,
        },
        {
            title: "Average DPS",
            value: averageDps.toLocaleString(),
            icon: <MailIcon color="primary"/>,
        },
        {
            title: "Average Parcels",
            value: averageParcels,
            icon: <Inventory2Icon color="primary"/>,
        },
        {
            title: "Average Accountables",
            value: averageAccountables,
            icon: <AssignmentTurnedInIcon color="primary"/>,
        },
        {
            title: "Predicted Overtime",
            value: overloadedRouteId
                ? `Route ${overloadedRouteId}`
                : "Not analyzed",
            icon: <WarningAmberIcon color="warning"/>,
        },
        {
            title: "Recommended Helper",
            value: recommendedHelperId
                ? `Route ${recommendedHelperId}`
                : "Not analyzed",
            icon: <HandshakeIcon color="success"/>,
        },
    ];

    return (
        <Grid container spacing={2} sx={{mb: 3}}>
            {analytics.map((item) => (
                <Grid
                    key={item.title}
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                    }}
                >
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 3,
                            transition: "0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mb={2}
                            >
                                {item.icon}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {item.title}
                                </Typography>
                            </Box>

                            <Typography
                                variant="h4"
                                fontWeight="bold"
                            >
                                {item.value}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default AnalyticsCards;