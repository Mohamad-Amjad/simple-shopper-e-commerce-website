const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { error } = require("console");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.set('trust proxy', 1); // Enable trusting proxy for correct protocol detection on Vercel

require("dotenv").config();

// Database connection logic for serverless
let cachedDb = null;
const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  
  console.log("No cached database connection. Connecting now...");
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    cachedDb = db;
    console.log("MongoDB Connected Successfully");
    return db;
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
    throw err;
  }
};

//API creation
app.get("/", (req, res) => {
  res.send("Express App is running");
});

// GET /status - verify deployment and file system
app.get("/status", (req, res) => {
  const imagesPath = path.resolve(__dirname, "upload", "images");
  const fs = require('fs');
  let imagesFound = [];
  try {
    if (fs.existsSync(imagesPath)) {
      imagesFound = fs.readdirSync(imagesPath);
    }
  } catch (e) {
    console.error("Status error:", e);
  }
  
  res.json({
    status: "online",
    version: "v3-robust-urls",
    host: req.get("host"),
    protocol: req.headers['x-forwarded-proto'] || req.protocol,
    imagesPath: imagesPath,
    imagesCount: imagesFound.length,
    trustProxy: app.get('trust proxy')
  });
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if running on Vercel
    if (process.env.VERCEL) {
      cb(null, '/tmp'); 
    } else {
      cb(null, "./upload/images");
    }
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ 
  storage: process.env.VERCEL ? multer.memoryStorage() : storage 
});

// Utility to normalize image URLs for any host
const getNormalizedImageUrl = (image, req) => {
  if (!image) return image;
  
  // 1. Handle Base64 Data URIs (Vercel Persistence)
  if (image.startsWith("data:")) return image;

  const host = req.get("host");
  // Check both req.protocol and x-forwarded-proto for Vercel/proxies
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const baseUrl = `${protocol}://${host}`;

  // 2. Handle Absolute URLs (even stale ones like localhost:4000)
  if (image.includes("://")) {
    try {
      // Extract filename from the URL, handling backslashes just in case
      const normalizedPath = image.replace(/\\/g, '/');
      const url = new URL(normalizedPath);
      const filename = path.basename(url.pathname);
      return `${baseUrl}/images/${filename}`;
    } catch (e) {
      // Fallback: extract last part of path
      const parts = image.replace(/\\/g, '/').split("/");
      const filename = parts[parts.length - 1];
      return `${baseUrl}/images/${filename}`;
    }
  }

  // 3. Handle Relative Paths or just filenames
  let filename = image.replace(/\\/g, '/'); // Normalize slashes
  if (filename.includes("/")) {
    filename = path.basename(filename);
  }
  
  return `${baseUrl}/images/${filename}`;
};

//creating endpoint for images
// Use an absolute path for express.static to be safer on Vercel
const imagesPath = path.resolve(__dirname, "upload", "images");
app.use("/images", express.static(imagesPath));
console.log(`Static images path configured at: ${imagesPath}`);
app.post("/upload", upload.single("product"), (req, res) => {
  if (process.env.VERCEL) {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    // Convert image buffer to Base64 Data URI for Vercel persistence
    const base64Image = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
    
    return res.status(200).json({
      success: 1,
      image_url: dataUri,
      message: "Image converted to Base64 for Vercel persistence."
    });
  }

  const host = req.get("host"); // gets host dynamically
  const protocol = req.protocol; // gets http or https
  res.json({
    success: 1,
    image_url: `${protocol}://${host}/images/${req.file.filename}`,
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
  try {
    await connectToDatabase();
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      // Robust calculation of next ID: find max and add 1
      const maxId = Math.max(...products.map(p => p.id || 0));
      id = maxId + 1;
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
    console.log("Saving product:", product);
    await product.save();
    console.log("Saved successfully");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ success: false, error: "Server Error: " + err.message });
  }
});

//Creating API for deleting a product
app.post("/removeproduct", async (req, res) => {
  try {
    await connectToDatabase();
    await Product.findOneAndDelete({
      id: req.body.id,
    });
    console.log("removed");
    res.json({
      success: 1,
      id: req.body.id,
    });
  } catch (err) {
    console.error("Remove Product Error:", err);
    res.status(500).json({ success: false, error: "Failed to remove product" });
  }
});

//creating API for get all products
app.get("/allproducts", async (req, res) => {
  try {
    await connectToDatabase();
    let products = await Product.find({});
    // Dynamically adjust image URLs to the current host using normalization utility
    const productsWithNormalizedImages = products.map(product => {
      let productObj = product.toObject();
      productObj.image = getNormalizedImageUrl(productObj.image, req);
      return productObj;
    });
    console.log("All products fetched and URLs normalized");
    res.send(productsWithNormalizedImages);
  } catch (err) {
    console.error("All Products Fetch Error:", err);
    res.status(500).send({ error: "Failed to fetch products" });
  }
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
  try {
    await connectToDatabase();
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
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, error: "Failed to signup" });
  }
});

//Creating Endpoint for registering the user
app.post("/login", async (req, res) => {
  try {
    await connectToDatabase();
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
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, error: "Failed to login" });
  }
});

//Creating endpoints for newCollections data
app.get('/newcollections',async(req,res)=>{
  try {
    await connectToDatabase();
    let products=await Product.find();
    let newCollections=products.slice(1).slice(-8);
    // Dynamically adjust image URLs using normalization utility
    const normalizedCollections = newCollections.map(product => {
      let productObj = product.toObject();
      productObj.image = getNormalizedImageUrl(productObj.image, req);
      return productObj;
    });
    console.log("Newcollections Fetched and URLs normalized");
    res.send(normalizedCollections);
  } catch (err) {
    console.error("NewCollections Fetch Error:", err);
    res.status(500).send({ error: "Failed to fetch new collections" });
  }
});

//Creating endpoints for popular in men
app.get('/popularinmen',async(req,res)=>{
  try {
    await connectToDatabase();
    let products=await Product.find({category:'men'});
    let popular_in_men=products.slice(0,4);
    // Dynamically adjust image URLs using normalization utility
    const normalizedPopular = popular_in_men.map(product => {
      let productObj = product.toObject();
      productObj.image = getNormalizedImageUrl(productObj.image, req);
      return productObj;
    });
    console.log("Popular in men fetched and URLs normalized");
    res.send(normalizedPopular);
  } catch (err) {
    console.error("Popular in Men Fetch Error:", err);
    res.status(500).send({ error: "Failed to fetch popular items" });
  }
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
  try {
    await connectToDatabase();
    console.log("added",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ success: true, cartData: userData.cartData });
  } catch (err) {
    console.error("AddToCart Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//creating endpoints for removing products into cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
  try {
    await connectToDatabase();
    console.log("removed",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ success: true, cartData: userData.cartData }); 
  } catch (err) {
    console.error("RemoveFromCart Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//Creating endpoints to get cartData
app.post('/getcart',fetchUser,async(req,res)=>{
  try {
    await connectToDatabase();
    console.log("GetCart");
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
  } catch (err) {
    console.error("GetCart Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//starting server
const port = process.env.PORT || 4000;

// Only listen if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running locally on http://localhost:${port}`);
  });
}

// Export app for Vercel
module.exports = app;
