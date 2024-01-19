import { Document, Schema, model } from "mongoose";

interface IProduct extends Document {
   _id:any,
    title: string;
    price: number;
    file: {
        filename: string;
        contentType: string;
        s3Key: string;
    };
    type:string;
}

const productSchema = new Schema<IProduct>({
   
    title: String,
    price: Number,
    file: {
        filename: String,
        contentType: String,
        s3Key: String,
    },
    type:String
});

const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;
