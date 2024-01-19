import * as process from "process";
import ProductModel from "../models/ProductSave";
import express from "express";
import UserResponse from "../dtos/UserResponse";

   
    

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Readable }                   = require('stream');
const multer                         = require('multer');

const storage = multer.memoryStorage();
const upload  = multer({ storage: storage });


const s3Client = new S3Client({
    region     : process.env.AWS_REGION,
    credentials: {
        accessKeyId    : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
    //@ts-ignore
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//@ts-ignore
export const uploadProduct = async (req: express.Request, res: express.Response) => {
    const file = req.file;
    console.log("fuck");

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        //@ts-ignore
        Key: file.originalname,
        //@ts-ignore
        Body: req.file.buffer,
        //@ts-ignore
        ContentType: file.mimetype
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        const productModel = new ProductModel({
            title: req.body.title,
            price: req.body.price,
            file: {
                //@ts-ignore
                filename: file.originalname,
                //@ts-ignore
                contentType: file.mimetype,
                s3Key: params.Key,      // Save the S3 object key
            },
            type: req.body.type
        });

        const product = await productModel.save();

        res.status(200).send('File uploaded to S3 and metadata saved to MongoDB successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file to S3 or saving metadata to MongoDB');
    }
};

export const uploadMiddleware = upload.single('file');


export const getAllProduct= async (req:express.Request,res:express.Response)=>{

    console.log();

    try {
        const query:any = req.query;
        const size:number = query.size;
        const page:number = query.page;

        console.log(size);
        console.log(page);


        const product = await ProductModel.find().limit(size).skip(size * (page - 1));

        const query1 = await ProductModel.countDocuments();
        const number = Math.ceil(query1/size);
        console.log(query1);
        
        console.log(number);

        res.status(200).send(new UserResponse(200,'User Data',product));

   }catch (e) {

console.log(e);

res.status(200).send(new UserResponse(200,'User Data',e));

   }

}


export const getSpecificProduct= async (req:express.Request,res:express.Response)=>{

    console.log();

    try {
        const query:any = req.query;

        const req_id= query.id;

        console.log(req_id);
        

        const product = await ProductModel.find({_id: Object(req_id)});

      

        res.status(200).send(new UserResponse(200,'Product Details',product));
   }catch (e) {

    res.status(200).send(new UserResponse(200,'Product Details not to be found',e));

   }

}


const app = express();
export const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the actual URL of your React app
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use('/products/images', express.static('uploads'));