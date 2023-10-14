import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import the Link component
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const VendorTable = () => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {

        fetch('http://localhost:3001/api/vendors')
            .then((response) => response.json())
            .then((data) => {
                setVendors(data);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (

        <div>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
            }}>

                <Box sx={{ width: '10%' }}>
                    <h2>Vendor List</h2>
                    <Stack spacing={1}>
                        {vendors.map((vendor) => (
                            <Item><Link to={`/vendor/${vendor.id}`}>{vendor.name}</Link></Item>

                        ))}

                    </Stack> </Box> </Box>
        </div>

    );
};

export default VendorTable;
