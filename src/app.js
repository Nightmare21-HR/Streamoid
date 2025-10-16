
const express = require('express');
const productRoutes = require('./routes/productroutes');
const app = express();
app.use(express.json());
app.use('/', productRoutes);
module.exports = app;