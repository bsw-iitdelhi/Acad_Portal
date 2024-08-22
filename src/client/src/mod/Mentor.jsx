import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { MentNav } from './myNav';

const dummyMentors = [
    { id: 1, name: 'Amit Sharma', course: 'COL 100', hours: 30, profileLink: '/profiles/amit' },
    { id: 2, name: 'Priya Patel', course: 'MTL 100', hours: 25, profileLink: '/profiles/priya' },
    { id: 3, name: 'Ravi Kumar', course: 'MTL 101', hours: 20, profileLink: '/profiles/ravi' },
    { id: 4, name: 'Sita Rani', course: 'COL 106', hours: 35, profileLink: '/profiles/sita' },
    { id: 5, name: 'Vikram Singh', course: 'MTL 106', hours: 40, profileLink: '/profiles/vikram' },
    { id: 6, name: 'Anjali Mehta', course: 'MTL 108', hours: 22, profileLink: '/profiles/anjali' },
    { id: 7, name: 'Arun Verma', course: 'PYL 101', hours: 28, profileLink: '/profiles/arun' },
    { id: 8, name: 'Neha Desai', course: 'ELL 100', hours: 31, profileLink: '/profiles/neha' },
    { id: 9, name: 'Rohit Joshi', course: 'CML 100', hours: 27, profileLink: '/profiles/rohit' },
    { id: 10, name: 'Kavita Sharma', course: 'CVL 141', hours: 33, profileLink: '/profiles/kavita' },
    { id: 11, name: 'Rajesh Gupta', course: 'ELL 203', hours: 29, profileLink: '/profiles/rajesh' },
    { id: 12, name: 'Pooja Nair', course: 'ELL 205', hours: 25, profileLink: '/profiles/pooja' },
];

const Mentors = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
            {/* Integrated PrimarySearchAppBar */}
            <MentNav />

            <div style={{ paddingTop: 64, paddingLeft: 20, paddingRight: 20 }}>
                <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    Mentors
                </Typography>
                <TableContainer component={Paper} style={{ maxWidth: '100%', overflowX: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>Hours</TableCell>
                                <TableCell>Profile</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dummyMentors.map((mentor) => (
                                <TableRow key={mentor.id}>
                                    <TableCell>{mentor.name}</TableCell>
                                    <TableCell>{mentor.course}</TableCell>
                                    <TableCell>{mentor.hours}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            href={mentor.profileLink}
                                        >
                                            View Profile
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Mentors;
