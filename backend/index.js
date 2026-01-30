const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { error } = require("console");

app.use(express.json());
app.use(cors());

//Database connection
//Database connection
mongoose.connect("mongodb+srv://amjad:db%403150@cluster0.csd3nsa.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.error("MongoDB Connection Failed:", err));
//API creation
app.get("/", (req, res) => {
  res.send("Express App is running");
});

//Image storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//creating endpoint for images
app.use("/images", express.static("./upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//Schema for creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//Creating API for deleting a product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({
    id: req.body.id,
  });
  console.log("removed");
  res.json({
    success: 1,
    id: req.body.id,
  });
});

//creating API for get all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All products fetched");
  res.send(products);
});

//Schema creating for user model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Creating Endpoint for registering the user
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, error: "Existing user found" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  //creating json webtoken
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

//Creating Endpoint for registering the user
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    let passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "Wrong password" });
    }
    }
    else
    {
      res.json({success:false,error:"Wrong email id"})
    }
});

//Creating endpoints for newCollections data
app.get('/newcollections',async(req,res)=>{
  let products=await Product.find();
  let newCollections=products.slice(1).slice(-8);
  console.log("Newcollections Fetched");
  res.send(newCollections);
});

//Creating endpoints for popular in men
app.get('/popularinmen',async(req,res)=>{
  let products=await Product.find({category:'men'});
  let popular_in_men=products.slice(0,4);
  console.log("Popular in men fetched");
  res.send(popular_in_men);
});

//creating middleware to fetch user
const fetchUser=async(req,res,next)=>{
  const token=req.header('auth-token');
  if(!token)
  {
    res.status(401).send({error:'please authenticate using valid token'});
  }
  try {
    const data=jwt.verify(token,'secret_ecom');
    req.user=data.user;
    next();
  } catch (error) {
    res.status(401).send({error:'please authenticate a valid token'});
  }
};

//creating endpoints for adding products into cartdata
app.post('/addtocart',fetchUser,async(req,res)=>{
  let userData=await Users.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId]+=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
});

//creating endpoints for removing products into cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
  let userData=await Users.findOne({_id:req.user.id});
  if(userData.cartData[req.body.itemId]>0)
  userData.cartData[req.body.itemId]-=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
});

//Creating endpoints to get cartData
app.post('/getcart',fetchUser,async(req,res)=>{
  let userData=await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
});

//starting server
module.exports = app; 
