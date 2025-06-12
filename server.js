import express from "express";
import mongoose from "mongoose";
import Product from "./collections/productSchema.js";
import Cart from "./collections/cartSchema.js";
import jwt from "jsonwebtoken";


// Initialize app on port 5100
const app = express();
const port = 5100;


//connecting with mongoose ShoppyGlobeDatabase
mongoose.connect("mongodb://localhost:27017/ShoppyGlobeDatabase");
const db = mongoose.connection;


// To convert the data 
app.use(express.json());

// For checking if the databbase is connected 
db.on('open',()=>{
    console.log("Connected with db");
})


// For Running port 
app.listen(port,()=>{
    console.log(`Connection running on port ${port}`);
})


//All the API calls :


// Api to get all the products in database
app.get("/products",async(req,res)=>{
    try{
        const products = await Product.find({});
        console.log(products);
        res.json(products);

    }catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Api to get particular database with given id

app.get("/products/:id",async(req,res)=>{
    const productId = req.params.id;
    try{
        const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
    }catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//Api to get all the data in the cart:
app.get("/cart",authenticateUser,async(req,res)=>{
      try{
        const cartData = await Cart.find({});
        if(!cartData){
          res.status(404).json({message: "No Product Found"})
        }
        res.json(cartData);
      }
      catch(error){
         console.error("Error fetching data", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
})



// Api To add product in the  cart :

app.post("/cart",authenticateUser, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Checking if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new Cart item
    const newCartItem = await Cart.create({
      productId,
      quantity: quantity || 1, 
    });
    res.status(201).json(newCartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Api to update the quantity of the product in the cart :

app.put("/cart/:id",authenticateUser, async (req, res) => {
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  try {
    const cartItem = await Cart.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Optional: validate quantity is positive
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    cartItem.quantity = quantity;
    const updatedItem = await cartItem.save();

    res.json({ message: "Cart updated", updatedItem });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Delete Item in cart by using product id :
app.delete("/cart/product/:productId", authenticateUser, async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedItem = await Cart.findOneAndDelete({ productId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found with given productId" });
    }

    res.json({ message: "Cart item deleted successfully", deletedItem });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Api to register user
app.post("/register", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ user: username }, "secretKey", { expiresIn: "15m" });
  res.status(201).json({ message: "User registered", token });
});


//Api to login user
app.post("/login",(req,res)=>{
  const user = req.body.username;
 const accessToken =  jwt.sign({user:user},"secretKey",{expiresIn: "15min"});
 res.send({token: accessToken});
})


function authenticateUser(req,res,next){
  const authHeader = req.headers['authorization'];
  const token  = authHeader && authHeader.split(" ")[1];

  jwt.verify(token,"secretKey",(err,user)=>{
    if(err){
      return res.status(403).json({message: "Invalid JWT token"})
    }
    req.user = user;
    next();
  })
}
