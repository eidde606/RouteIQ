import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, TextField,
} from "@mui/material";
import {useState} from "react";

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
}


function RouteAssignmentForm({open, onClose, onSubmit,}: RouteAssignmentFormProps) {
    const [formData, setFormData] = useState({
        carrier_name: "",
        route_id: "",
        office: "",
        dps: 0,
        parcels: 0,
        accountables: 0,
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Route Assignment</DialogTitle>

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
                    fullWidth margin="normal"
                    value={formData.route_id}
                    onChange={handleChange}
                />

                <TextField
                    label="Office"
                    name="office"
                    fullWidth margin="normal"
                    value={formData.office}
                    onChange={handleChange}
                />

                <TextField
                    label="DPS"
                    name="dps"
                    type="number"
                    fullWidth margin="normal"
                    value={formData.dps}
                    onChange={handleChange}
                />
                <TextField
                    label="Parcels"
                    name="parcels"
                    type="number"
                    fullWidth margin="normal"
                    value={formData.parcels}
                    onChange={handleChange}
                />
                <TextField
                    label="Accountables"
                    name="accountables"
                    type="number"
                    fullWidth margin="normal"
                    value={formData.accountables}
                    onChange={handleChange}
                />

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>

                <Button variant="contained" onClick={() => onSubmit(formData)}>
                    Save
                </Button>

            </DialogActions>
        </Dialog>
    );
}

export default RouteAssignmentForm;