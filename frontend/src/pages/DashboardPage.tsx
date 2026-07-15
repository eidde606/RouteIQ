import {useNavigate} from "react-router-dom";
import {
    Typography,
    TableCell,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableContainer,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Stack,
    Container,
    Button,
    Box,
    Card,
    CardContent,
} from "@mui/material";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {
    getRouteAssignments,
    createRouteAssignment,
    deleteRouteAssignment,
    updateRouteAssignment
} from "../services/routeAssignmentService";
import {useState} from "react";
import RouteAssignmentForm from "../components/RouteAssignmentForm";
import type {RouteAssignment, RouteAssignmentCreate} from "../types/routeAssignment";
import useAuthStore from "../store/authStore";
import {analyzeRoutes} from "../services/aiService";

function DashboardPage() {

    const [open, setOpen] = useState(false);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [selectedAssignment, setSelectedAssignment] = useState<RouteAssignment | null>(null);

    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createRouteAssignment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["routeAssignments"],
            });

            setOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
                         id,
                         assignment,
                     }: {
            id: number;
            assignment: RouteAssignmentCreate;
        }) => updateRouteAssignment(id, assignment),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["routeAssignments"],
            });

            setOpen(false);
            setSelectedAssignment(null);
        },
    });

    const handleOpen = () => {
        setSelectedAssignment(null)
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedAssignment(null);
    }

    const handleSubmit = (formData: RouteAssignmentCreate) => {
        const assignmentData = {
            ...formData,
            dps: Number(formData.dps),
            parcels: Number(formData.parcels),
            accountables: Number(formData.accountables),
        };

        if (selectedAssignment) {
            updateMutation.mutate({
                id: selectedAssignment.id,
                assignment: assignmentData,
            });
        } else {
            createMutation.mutate(assignmentData);
        }
    };
    const deleteMutation = useMutation({
        mutationFn: deleteRouteAssignment, onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["routeAssignments"],});
        }
    });

    const aiMutation = useMutation({
        mutationFn: analyzeRoutes,
    })

    const {
        data,
        isLoading,
        error,

    } = useQuery({
        queryKey: ["routeAssignments"],
        queryFn: getRouteAssignments,
    });

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error loading route assignments.</Typography>;
    }

    return (
        <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mb: 3,
                    }}
                >
                    <Typography variant="h4">
                        RouteIQ Dashboard
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{mt: 1}}
                    >
                        Manage daily route assignments and workload recommendations.
                    </Typography>
                </Box>

                <Button
                    color="error"
                    variant="outlined"
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                >
                    Logout
                </Button>
            </Box>

            <Stack
                direction="row"
                spacing={2}
                sx={{mb: 3}}
            >
                <Button
                    variant="contained"
                    onClick={handleOpen}
                >
                    Create Assignment
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => aiMutation.mutate()}
                    disabled={aiMutation.isPending}
                >
                    {aiMutation.isPending
                        ? "Analyzing Route Assignments..."
                        : "Analyze Route Assignments"}
                </Button>
            </Stack>

            {aiMutation.isPending && (
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Typography>
                            Analyzing today's route assignments...
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {aiMutation.data && (
                <Card
                    sx={{
                        mb: 3,
                        maxWidth: 900,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Today's Workload Recommendation
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold" sx={{mt: 2}}>
                            Predicted to Exceed 8 Hours
                        </Typography>

                        <Typography>
                            Route {aiMutation.data.overloaded_route.route_id}
                        </Typography>

                        <Typography>
                            Carrier: {aiMutation.data.overloaded_route.carrier_name}
                        </Typography>

                        <Typography>
                            Workload Score: {aiMutation.data.overloaded_route.score}
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold" sx={{mt: 3}}>
                            Recommended Helper
                        </Typography>

                        <Typography>
                            Route {aiMutation.data.recommended_helper.route_id}
                        </Typography>

                        <Typography>
                            Carrier: {aiMutation.data.recommended_helper.carrier_name}
                        </Typography>

                        <Typography>
                            Workload Score: {aiMutation.data.recommended_helper.score}
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold" sx={{mt: 3}}>
                            Explanation
                        </Typography>

                        <Typography sx={{whiteSpace: "pre-line"}}>
                            {aiMutation.data.recommendation}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {aiMutation.error && (
                <Typography color="error" sx={{mb: 2}}>
                    Failed to analyze today's routes.
                </Typography>
            )}

            <RouteAssignmentForm
                open={open}
                onClose={handleClose}
                onSubmit={handleSubmit}
                assignment={selectedAssignment}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Route</TableCell>
                            <TableCell>Carrier</TableCell>
                            <TableCell>Office</TableCell>
                            <TableCell>DPS</TableCell>
                            <TableCell>Parcels</TableCell>
                            <TableCell>Accountables</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.data.map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell>{assignment.route_id}</TableCell>
                                <TableCell>{assignment.carrier_name}</TableCell>
                                <TableCell>{assignment.office}</TableCell>
                                <TableCell>{assignment.dps}</TableCell>
                                <TableCell>{assignment.parcels}</TableCell>
                                <TableCell>{assignment.accountables}</TableCell>
                                <TableCell>{assignment.date}</TableCell>

                                <TableCell>
                                    <Button
                                        variant="contained"
                                        sx={{mr: 1}}
                                        onClick={() => {
                                            setSelectedAssignment(assignment);
                                            setOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => setDeleteId(assignment.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
            >
                <DialogTitle>Delete Route Assignment</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this route assignment?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        onClick={() => {
                            if (deleteId !== null) {
                                deleteMutation.mutate(deleteId);
                            }

                            setDeleteId(null);
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )

}

export default DashboardPage;
