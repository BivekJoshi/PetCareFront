import { Button, Paper, TextField, useTheme } from '@mui/material';
import React from 'react';

const RequestForm = () => {
    const theme = useTheme();

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", position: "relative", top: "-96px" }}>
                <Paper elevation={2} style={{ padding: "2rem", width: "300px", display: "flex", flexDirection: "column", gap: "1rem", position: "relative", zIndex: 1 }}>
                    <div style={{ color: "#4273C1", fontWeight: 900, fontSize: "25px", marginBottom: ".2rem" }}>Request Form</div>
                    <TextField
                        label="Full Name"
                        fullWidth
                        size="small"
                        InputLabelProps={{
                            shrink: false,
                        }}
                    />
                    <TextField
                        label="Email Address"
                        fullWidth
                        size="small"
                        InputLabelProps={{
                            shrink: false,
                        }}
                    />
                    <TextField
                        label="Contact Number"
                        fullWidth
                        size="small"
                        InputLabelProps={{
                            shrink: false,
                        }}
                    />
                    <TextField
                        label="Service title"
                        fullWidth
                        size="small"
                        InputLabelProps={{
                            shrink: false,
                        }}
                    />
                    <TextField
                        label="Service Description"
                        fullWidth
                        multiline
                        rows={4}
                        InputLabelProps={{
                            shrink: false,
                        }}
                        sx={{ '& input': { fontSize: '8px' } }}
                    />
                    <Button variant='contained'>Submit</Button>
                </Paper>
                <Paper style={{ width: "300px", backgroundColor: theme?.palette?.primary?.main, height: "515px", position: "absolute", top: "52%", left: "52%", transform: "translate(-50%, -50%)", zIndex: 0 }}></Paper>
            </div>
        </>
    );
}

export default RequestForm;
