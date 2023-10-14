import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VendorTable from './components/VendorTable';
import VendorDetails from './components/VendorDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VendorTable />} />
                <Route path="/vendor/:id" element={<VendorDetails />} />
            </Routes>
        </Router>
    );
}

export default App;