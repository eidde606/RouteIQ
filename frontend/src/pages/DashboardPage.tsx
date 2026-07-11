import {Typography, TableCell, Table, TableHead, TableBody, TableRow, TableContainer, Paper} from "@mui/material"
import {useQuery} from "@tanstack/react-query";
import {getRouteAssignments} from "../services/routeAssignmentService";

function DashboardPage() {

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
