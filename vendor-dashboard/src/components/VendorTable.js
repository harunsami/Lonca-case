import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import the Link component
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const VendorTable = () => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {

        fetch('http://localhost:3001/api/vendors')
            .then((response) => response.json())
            .then((data) => {
                console.log('Data:', data);
                setVendors(data);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <h2>Vendor Name</h2>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                            <TableCell>
                                <Link to={`/vendor/${vendor.id}`}>{vendor.name}</Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default VendorTable;
