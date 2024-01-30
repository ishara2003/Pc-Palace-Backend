import { Document, Schema, model } from "mongoose";

interface IProduct extends Document {
   _id  : any,
   title: string;
   price: number;
   file : {
        filename   : string;
        contentType: string;
        s3Key      : string;
    };
    type               : string;
    qty                : number;
    manufacture       ?: string,
    gpu               ?: string,   // Desktop, Laptop, Component GPU, Gaming Desktop, Gaming Laptop 
    screen_size       ?: string,   // Monitor, Laptop
    processor         ?: string,   // Desktop, Laptop, Component CPU, Gaming Desktop, Gaming Laptop
    ram               ?: string,   // Desktop, Laptop, Component RAM, Gaming Desktop, Gaming Laptop
    workstation       ?: string,   // Desktop
    socket_type       ?: string,   // PROCESSOR, MOTHERBOARDS
    cores             ?: string,   // PROCESSOR
    chip_set          ?: string,   // MOTHERBOARDS, GPU
    speed             ?: string,   // MEMORY
    v_ram             ?: string,   // GRAPHIC CARDS
    storage_type      ?: string,   // STORAGES
    interface         ?: string,   // STORAGES
    efficiency        ?: string,   // POWER SUPPLY
    modular           ?: string,   // POWER SUPPLY
    cooler_type       ?: string,   // COOLERS
    resolution        ?: string,   // MONITOR
    refresh_rate      ?: string,   // MONITOR
    accessories_type  ?: string    // ACCESSORIES
    warranty          ?: string,
    additional_details?: string,
    productImage: {
        filename   : string;
        contentType: string;
        s3Key      : string;
    };
    discount?:number,
    isSpecial?:boolean
} 

const productSchema = new Schema<IProduct>({
   
    title: String,
    price: Number,
    file : {
        filename   : String,
        contentType: String,
        s3Key      : String,
    },
    type            : String,
    qty             : Number,
    manufacture     : String,
    gpu             : String,
    screen_size     : String,
    processor       : String,
    ram             : String,
    workstation     : String,
    socket_type     : String,
    cores           : String,
    chip_set        : String,
    speed           : String,
    v_ram           : String,
    storage_type    : String,
    interface       : String,
    efficiency      : String,
    modular         : String,
    cooler_type     : String,
    resolution      : String,
    refresh_rate    : String,
    accessories_type: String,
    warranty          : String,
    additional_details: String,
    productImage: {
        filename   : String,
        contentType: String,
        s3Key      : String,
    },
    discount:Number,
    isSpecial:Boolean

});
const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;
