const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const routes = require('./routes');

app.use(bodyParser.json());
app.use(cors());

const url = "mongodb+srv://harun:12345@cluster0.z2q5bhi.mongodb.net/lonca-db?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(url , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define your routes here
app.use('/api', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
