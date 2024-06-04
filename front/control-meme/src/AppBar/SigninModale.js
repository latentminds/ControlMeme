import React, { useContext, useState } from 'react';
import { Button, TextField, Tab, Tabs, Box, Typography, Modal } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { loginWithEmail, registerWithEmail } from '../firebase/authCalls';
import { UserContext } from '../UserContext';

export const SigninModal = ({ open, onClose }) => {
    const [tabValue, setTabValue] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { user, setUser } = useContext(UserContext);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        loginWithEmail(email, password)
            .then((userResp) => {
                console.log(userResp);
                setUser(userResp);
                onClose();
            })

            .catch((error) => {
                console.log(error.message);
            });
    };

    const handleSignUp = () => {
        registerWithEmail(email, password)
            .then(() => {
                onClose();
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 400, minWidth: 300 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {tabValue === 0 ? 'Login' : 'Create an account'}
                </Typography>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Login" />
                    <Tab label="Sign Up" />
                </Tabs>
                <Box sx={{ mt: 2 }}>
                    <TextField fullWidth label="Email" variant="outlined" onChange={handleEmailChange} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TextField fullWidth label="Password" type="password" variant="outlined" onChange={handlePasswordChange} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    {tabValue === 0 ? (
                        <Button variant="contained" startIcon={<Lock />} onClick={handleLogin}>
                            Login
                        </Button>
                    ) : (
                        <Button variant="contained" startIcon={<AccountCircle />} onClick={handleSignUp}>
                            Sign Up
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default SigninModal;
