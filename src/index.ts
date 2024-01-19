import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import Usermodel from "./models/UserRegitration";
import UserResponse from "./dtos/UserResponse";
import * as process from "process";
import ProductModel from "./models/ProductSave";
import jwt, { Secret } from 'jsonwebtoken'
import { error } from 'console';
import e from 'express';

const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the actual URL of your React app
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



mongoose.connect(process.env.Mongo_DB as string)

const connection = mongoose.connection;

connection.on('error',(error)=>{
    console.log("Connecti on Failed : ", error);
})


connection.on('open',()=>{
    console.log("Connection passed");
})


// Assuming your images are stored in a directory named 'uploads'
app.use('/products/images', express.static('uploads'));


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
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



app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;

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
                s3Key: params.Key, // Save the S3 object key
            },
            type:req.body.type
        });

        const product = await productModel.save();

        res.status(200).send('File uploaded to S3 and metadata saved to MongoDB successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file to S3 or saving metadata to MongoDB');
    }
});

app.get('/products/all',cors(), async (req:express.Request,res:express.Response)=>{

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

   }

});


app.get('/products/filterbyId',cors(), async (req:express.Request,res:express.Response)=>{

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

});


app.post('/user', async (req:express.Request,res:express.Response)=>{

    try {
        const usermodel = new Usermodel({

            userName:req.body.userName,
            email:req.body.email,
            contactNumber:req.body.contactNumber,
            password:req.body.password

        });

        let  newVar = await usermodel.save();
        newVar.password="";

        res.status(200).send('User Created successfully');
    }catch (e){
        console.log("Error");
    }
});

app.post('/user/verify', async (req:express.Request, res:express.Response)=>{

    const body = req.body;


    const findOne =await Usermodel.findOne({email: body.email});


    if (findOne){
//@ts-ignore
        if(findOne.password === body.password){

            findOne.password="";

            jwt.sign({findOne}, process.env.SECRET as Secret,(error:any,token:any)=>{

                if(error){

                    res.status(100).send(
                        new UserResponse(100,"Somthing Wen Wrong"));
                }else{

                    let r_body={

                        findOne:findOne,
                        accessToken:token

                    }


                    res.status(200).send(
                        new UserResponse(200,"Access compleat",r_body));
                }

            })



        }else {
            res.status(401).send(
            new UserResponse(401,"User Unknown",null));
        }

    }else{
        res.status(404).send(
            new UserResponse(401,"User is not registered",null));
    }
})

app.get('/user/all', async (req:express.Request,res:express.Response)=>{

    try {
        const find =await Usermodel.find();
        res.status(200).send(new UserResponse(200,'User Data',find));

    }catch (e) {
        console.log("Error", e);
    }

});

app.listen(5050,()=>{

    console.log("Server Started Successfully on port 5050");

})