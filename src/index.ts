import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import UserResponse from "./dtos/UserResponse";
import * as process from "process";
import ProductModel from "./models/ProductSave";
import UserRoute from './routes/UserRoutes'
import ProductRoute from './routes/ProductRoutes'
const app  = express();
const cors = require('cors');


const corsOptions = {
    origin              : 'http://localhost:3000',   // Replace with the actual URL of your React app
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


const multer = require('multer');

const storage = multer.memoryStorage();

mongoose.connect(process.env.Mongo_DB as string)

const connection = mongoose.connection;

connection.on('error',(error)=>{
    console.log("Connecti on Failed : ", error);
})


connection.on('open',()=>{
    console.log("Connection passed");
})


  /** Product handler before Route
 * 
  // // Assuming your images are stored in a directory named 'uploads'
  // app.use('/products/images', express.static('uploads'));
  // const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
  // const { Readable } = require('stream');
  // const upload = multer({ storage: storage });

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

app.post('/product', upload.single('file'), async (req, res) => {
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
            file : {
                  //@ts-ignore
                filename: file.originalname,
                  //@ts-ignore
                contentType: file.mimetype,
                s3Key      : params.Key,      // Save the S3 object key
            },
            type: req.body.type
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
        const query:any   = req.query;
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

        const req_id = query.id;

        console.log(req_id);
        

        const product = await ProductModel.find({_id: Object(req_id)});

      

        res.status(200).send(new UserResponse(200,'Product Details',product));
   }catch (e) {

    res.status(200).send(new UserResponse(200,'Product Details not to be found',e));

   }

});
 */
 
  /** User part before routes & controller
 * 
 *  // app.post('/user', async (req:express.Request,res:express.Response)=>{

    try {
        const usermodel = new Usermodel({

            userName     : req.body.userName,
            email        : req.body.email,
            contactNumber: req.body.contactNumber,
            password     : req.body.password

        });

        let newVar          = await usermodel.save();
            newVar.password = "";

        res.status(200).send('User Created successfully');
    }catch (e){
        console.log("Error");
    }
});

app.post('/user/verify', async (req:express.Request, res:express.Response)=>{

    const body = req.body;


    const findOne = await Usermodel.findOne({email: body.email});


    if (findOne){
  //@ts-ignore
        if(findOne.password === body.password){

            findOne.password = "";

            jwt.sign({findOne}, process.env.SECRET as Secret,(error:any,token:any)=>{

                if(error){

                    res.status(100).send(
                        new UserResponse(100,"Somthing Wen Wrong"));
                }else{

                    let r_body={

                        findOne    : findOne,
                        accessToken: token

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
        const find = await Usermodel.find();
        res.status(200).send(new UserResponse(200,'User Data',find));

    }catch (e) {
        console.log("Error", e);
    }

});


 */


app.use('/user', UserRoute)

app.use('/products', ProductRoute)







// const nodemailer = require("nodemailer");
// // Import NodeMailer (after npm install)

// async function main() {
// // Async function enables allows handling of promises with await

//   // First, define send settings by creating a new transporter: 
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
//     port: 465, // Port for SMTP (usually 465)
//     secure: true, // Usually true if connecting to port 465
//     auth: {
//       user: "handapangodasankapa@gmail.com", // Your email address
//       pass: "ishara0762269260#", // Password (for gmail, your app password)
//       // ⚠️ For better security, use environment variables set on the server for these values when deploying
//     },
//   });
  
//   // Define and send message inside transporter.sendEmail() and await info about send from promise:
//   let info = await transporter.sendMail({
//     from: 'sankalpaishara4@gmail.com>',
//     to: "cocjoker805@gmail.com",
//     subject: "Testing, testing, 123",
//     html: `
//     <h1>Hello there</h1>
//     <p>Isn't NodeMailer useful?</p>
//     `,
//   });

//   console.log(info.messageId); // Random ID generated after successful send (optional)
// }

// main()
// .catch(err => console.log(err));






app.listen(5050,()=>{

    console.log("Server Started Successfully on port 5050");

})