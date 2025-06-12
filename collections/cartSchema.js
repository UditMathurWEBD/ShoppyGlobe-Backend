import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId,
     ref: "Product", 
     required: true },
  quantity: { 
    type: Number, 
    default: 1 
},
});


const cart = mongoose.model("Cart",cartSchema);

export default cart;