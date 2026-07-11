import {Typography, TableCell, Table, TableHead, TableBody, TableRow, TableContainer, Paper} from "@mui/material"
import {useQuery} from "@tanstack/react-query";
import {getRouteAssignments} from "../services/routeAssignmentService";
import {useState} from "react";
import RouteAssignmentForm from "../components/RouteAssignmentForm";
import Button from "@mui/material/Button";

function DashboardPage() {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = () => {
        console.log("Submit route assignment");
        setOpen(false);
    }

    const {
        data,
        isLoading,
        error,

    } = useQuery({
        queryKey: ["routeAssignment"],
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
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.data.map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell>{assignment.route_id}</TableCell>
                                <TableCell>{assignment.carrier_name}</TableCell>
                                <TableCell>{assignment.office}</TableCell>
                                <TableCell>{assignment.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )

}

export default DashboardPage;
