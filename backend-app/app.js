const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const routes = require('./routes');

app.use(bodyParser.json());
app.use(cors());

const url = "mongodb+srv://user:12345@cluster0.z2q5bhi.mongodb.net/lonca-db?retryWrites=true&w=majority";

mongoose.connect(url , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
