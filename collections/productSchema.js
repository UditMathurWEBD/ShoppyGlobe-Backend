import mongoose from "mongoose";


const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type:Number,
        required: true
    },
    description : String,
    stock_qty : {
        type: Number,
        default : 1
    }
})


const product = mongoose.model("Product", productSchema, "product");

export default product;