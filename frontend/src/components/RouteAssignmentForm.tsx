import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, TextField,
} from "@mui/material";
import {useEffect, useState} from "react";
import type {RouteAssignment} from "../types/routeAssignment.ts";

interface RouteAssignmentFormData {
    carrier_name: string;
    route_id: string;
    office: string;
    dps: number;
    parcels: number;
    accountables: number;
}

interface RouteAssignmentFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: RouteAssignmentFormData) => void;
    assignment: RouteAssignment | null;
}

const emptyForm = {
    carrier_name: "",
    route_id: "",
    office: "",
    dps: 0,
    parcels: 0,
    accountables: 0,
};


function RouteAssignmentForm({open, onClose, onSubmit, assignment,}: RouteAssignmentFormProps) {

    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (assignment) {
            setFormData({
                carrier_name: assignment.carrier_name,
                route_id: assignment.route_id,
                office: assignment.office,
                dps: assignment.dps,
                parcels: assignment.parcels,
                accountables: assignment.accountables,
            });
        } else {
            setFormData(emptyForm);
        }
    }, [assignment]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(formData);
                }}
            >
                <DialogTitle>
                    {assignment ? "Edit Route Assignment" : "Create Route Assignment"}
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Carrier Name"
                        name="carrier_name"
                        fullWidth
                        margin="normal"
                        value={formData.carrier_name}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Route Number"
                        name="route_id"
                        fullWidth
                        margin="normal"
                        value={formData.route_id}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Office"
                        name="office"
                        fullWidth
                        margin="normal"
                        value={formData.office}
                        onChange={handleChange}
                    />

                    <TextField
                        label="DPS"
                        name="dps"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.dps}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Parcels"
                        name="parcels"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.parcels}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Accountables"
                        name="accountables"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.accountables}
                        onChange={handleChange}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                    >
                        {assignment ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default RouteAssignmentForm;