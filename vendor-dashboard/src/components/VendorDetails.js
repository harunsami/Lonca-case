import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AgGridReact } from "ag-grid-react";
import { Chart } from "react-google-charts";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const VendorDetails = ({ match }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    useEffect(() => {
        fetch(`http://localhost:3001/api/vendor/${id}/getOrders`)
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((error) => console.error('Error:', error));
    }, [id]);


    const startDate = new Date('2021-12-01')
    const endDate = new Date('2023.03.01')
    var dates = []
    var monthlyIncome = []
    var monthlySoldProduct = []

    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
        dates.push(new Date(currentDate));
        monthlyIncome.push(0)
        monthlySoldProduct.push(0)
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    }
    dates.push(currentDate)
    monthlyIncome.push(0)
    monthlySoldProduct.push(0)

    const productNumbers= new Map();
    var paymentDates = []
    orders.map((order) => {
        const date = new Date(order.payment_at);
        var index= 0;
        for(index = 0; index < dates.length; index++){
            if( dates[index] > date){
                index--;
                break
            }
        }
        const cart_item = order.cart_item;

        cart_item.map((item) => {
            if(item.vendorId == id){
                monthlyIncome[index] += item.cogs * item.item_count * item.quantity;
                monthlySoldProduct[index] += item.item_count * item.quantity;

                if(!productNumbers.has(item.productId)) {
                    productNumbers.set(item.productId, {name: item.productName, quantity: 0})
                }
                const quantity = productNumbers.get(item.productId).quantity;
                productNumbers.set(item.productId, {name: item.productName, quantity: quantity + item.item_count * item.quantity})

            }
        });

        paymentDates.push(date)
    });

    const productsRowData = []
    for (var [key, value] of productNumbers.entries()) {
        productsRowData.push({productId: key , "Product Name": value.name,quantity: value.quantity })
    }


    const [columnDefs] = useState([
        { field: "productId" , resizable: true, width: 240,  suppressSizeToFit: true},
        { field: "Product Name", filter: true , resizable: true, width: 270},
        { field: "quantity", filter: true ,  resizable: true, width: 120}
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun" , "Jul" , "Aug" , "Sep",
        "Oct", "Nov", "Dec"];

    const chartOptions = {
        chart: {
            title: "Monthly sales",
            subtitle: "Sales, Expenses, and Profit: 2021 Dec - 2023 Mar",
        },
    };

    var chartData =  [ ["Month", "Income ($)" , "Number of Products"] ];

    for (var i = 0; i < dates.length; i++){
        const date = dates[i];
        chartData.push([ months[date.getMonth()] + ' ' + date.getFullYear() , monthlyIncome[i] , monthlySoldProduct[i]])
    }


    return (
        <div>
            <h2>Vendor Details</h2>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>

                    <div>
                        <Chart
                            chartType="Bar"
                            width="100%"
                            height="400px"
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>
                    <br/>
                    <br/>
                    <h3>Sold Products:</h3>
                    <div className="ag-theme-alpine" style={{ height: 600, width: 630 }}>
                        <AgGridReact rowData={productsRowData} columnDefs={columnDefs}></AgGridReact>
                    </div>


                </div>
            )}
        </div>
    );
};

export default VendorDetails;
