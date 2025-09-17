const express=require('express');
const app=express();
const dotenv=require('dotenv');
const path=require('path');
const cors=require('cors');
//routes
const products=require('./routes/Product')
const orders=require('./routes/Orders');
const connectDatabase = require('./config/connectDatabase');

dotenv.config({path:path.join(__dirname,'config','config.env')});
connectDatabase();

//use a middleware to get rq.body json data
app.use(express.json());
app.use(cors());
app.use('/api/v1/',products);
app.use('/api/v1/',orders);
app.listen(process.env.PORT,()=>{
    console.log(`Server listening to Port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});