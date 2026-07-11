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
} from "@mui/material";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getRouteAssignments, createRouteAssignment, deleteRouteAssignment} from "../services/routeAssignmentService";
import {useState} from "react";
import RouteAssignmentForm from "../components/RouteAssignmentForm";
import type {RouteAssignmentCreate} from "../types/routeAssignment";
import Button from "@mui/material/Button";

function DashboardPage() {

    const [open, setOpen] = useState(false);

    const [deleteId, setDeleteId] = useState<number | null>(null);

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

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = (formData: RouteAssignmentCreate) => {
        createMutation.mutate({
            ...formData,
            dps: Number(formData.dps),
            parcels: Number(formData.parcels),
            accountables: Number(formData.accountables),
        });
    };

    const deleteMutation = useMutation({
        mutationFn: deleteRouteAssignment, onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["routeAssignments"],});
        }
    });

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


        <>

            <Button
                variant="contained"
                onClick={handleOpen}
            >
                Create Assignment
            </Button>

            <RouteAssignmentForm
                open={open}
                onClose={handleClose}
                onSubmit={handleSubmit}
            />

            <Typography variant="h4">Dashboard</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Route</TableCell>
                            <TableCell>Carrier</TableCell>
                            <TableCell>Office</TableCell>
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
                                <TableCell>{assignment.date}</TableCell>

                                <TableCell>
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
        </>
    )

}

export default DashboardPage;
