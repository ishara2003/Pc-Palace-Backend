import * as process from "process";
import ProductModel from "../models/ProductSave";
import express from "express";
import UserResponse from "../dtos/UserResponse";

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Readable }                   = require("stream");
const multer                         = require("multer");

const storage = multer.memoryStorage();
const upload  = multer({ storage: storage });

const s3Client = new S3Client({
  region     : process.env.AWS_REGION,
  credentials: {
    accessKeyId    : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
  //@ts-ignore
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};




  /**final try
 * 
 *  //@ts-ignore
export const uploadProduct = async (
  req: express.Request,
  res: express.Response
) => {
        // const file = req.file;
        // console.log("fuck");

        // const params = {
        //   Bucket: process.env.AWS_S3_BUCKET_NAME,
        //       //@ts-ignore
        //   Key: file.originalname,
        //       //@ts-ignore
        //   Body: req.file.buffer,
        //       //@ts-ignore
        //   ContentType: file.mimetype,
        // };

  try {
    const files = req.files as Express.Multer.File[];

    const uploadTasks = files.map(async (file: Express.Multer.File) => {
      const params = {
        Bucket     : process.env.AWS_S3_BUCKET_NAME,
        Key        : file.originalname,
        Body       : file.buffer,
        ContentType: file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(params));
      const productModel = new ProductModel({
        title: req.body.title,
        price: req.body.price,
        file : {
                //@ts-ignore
          filename: files.originalname,
                //@ts-ignore
          contentType: files.mimetype,
          s3Key      : params.Key,       // Save the S3 object key
        },
        
        type              : req.body.type,
        qty               : req.body.qty,
        manufacture       : req.body.manufacture,
        gpu               : req.body.gpu,
        screen_size       : req.body.screen_size,
        processor         : req.body.processor,
        ram               : req.body.ram,
        workstation       : req.body.workstation,
        socket_type       : req.body.socket_type,
        cores             : req.body.cores,
        chip_set          : req.body.chip_set,
        speed             : req.body.speed,
        v_ram             : req.body.v_ram,
        storage_type      : req.body.storage_type,
        interface         : req.body.interface,
        efficiency        : req.body.efficiency,
        modular           : req.body.modular,
        cooler_type       : req.body.cooler_type,
        resolution        : req.body.resolution,
        refresh_rate      : req.body.refresh_rate,
        accessories_type  : req.body.accessories_type,
        warranty          : req.body.warranty,
        additional_details: req.body.additional_details,
        productImage      : {
              //@ts-ignore
        filename: files.originalname,
              //@ts-ignore
        contentType: files.mimetype,
        s3Key      : params.Key,       // Save
      },
    discount : req.body.discount,
    isSpecial: req.body.isSpecial
      });
      const product = await productModel.save();
    });

    await Promise.all(uploadTasks);

          // Handle product creation or other operations here

    res.status(200).send("Files uploaded to S3 successfully!");

          // await s3Client.send(new PutObjectCommand(params));

    res
      .status(200)
      .send("File uploaded to S3 and metadata saved to MongoDB successfully!");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error uploading file to S3 or saving metadata to MongoDB");
  }
};

// export const uploadMiddleware = upload.single("file");
export const uploadMiddleware = upload.array("files", 2);  // Change 2 to the maximum number of files allowed

 * 
 */


//@ts-ignore
export const uploadProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const files = req.files as Express.Multer.File[];

    // Check if a product with the same title already exists
    const existingProduct = await ProductModel.findOne({ title: req.body.title });
    if (existingProduct) {
      return res.status(400).send("A product with the same title already exists.");
    }
  
    const uploadTasks = files.map(async (file: Express.Multer.File) => {
      const params = {
        Bucket     : process.env.AWS_S3_BUCKET_NAME,
        Key        : file.originalname,
        Body       : file.buffer,
        ContentType: file.mimetype,
      };
  
      await s3Client.send(new PutObjectCommand(params));
  
      return params; // Return params so it can be accessed later
    });
  
    const uploadedParams = await Promise.all(uploadTasks); // Wait for all uploads to complete
  
    // Save the product data to MongoDB
    const productModel = new ProductModel({
      title: req.body.title,
      price: req.body.price,
      file: {
        filename   : files[0].originalname, // Access filename from the first file
        contentType: files[0].mimetype,     // Access mimetype from the first file
        s3Key      : uploadedParams[0].Key, // Access s3Key from the first uploadedParams
      },
      type              : req.body.type,
      qty               : req.body.qty,
      manufacture       : req.body.manufacture,
      gpu               : req.body.gpu,
      screen_size       : req.body.screen_size,
      processor         : req.body.processor,
      ram               : req.body.ram,
      workstation       : req.body.workstation,
      socket_type       : req.body.socket_type,
      cores             : req.body.cores,
      chip_set          : req.body.chip_set,
      speed             : req.body.speed,
      v_ram             : req.body.v_ram,
      storage_type      : req.body.storage_type,
      interface         : req.body.interface,
      efficiency        : req.body.efficiency,
      modular           : req.body.modular,
      cooler_type       : req.body.cooler_type,
      resolution        : req.body.resolution,
      refresh_rate      : req.body.refresh_rate,
      accessories_type  : req.body.accessories_type,
      warranty          : req.body.warranty,
      additional_details: req.body.additional_details,
      productImage      : {
        filename   : files[1].originalname, // Access filename from the second file
        contentType: files[1].mimetype,     // Access mimetype from the second file
        s3Key      : uploadedParams[1].Key, // Access s3Key from the second uploadedParams
      },
      discount : req.body.discount,
      isSpecial: req.body.isSpecial,
    });

    await productModel.save();

    res.status(200).send("Files uploaded to S3 and metadata saved to MongoDB successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file to S3 or saving metadata to MongoDB");
  }
};

export const uploadMiddleware = upload.array("files", 2);  

export const getAllProduct = async (
  req: express.Request,
  res: express.Response
) => {
  console.log();

  try {
    const query: any   = req.query;
    const size: number = query.size;
    const page: number = query.page;

    console.log(size);
    console.log(page);

    const product = await ProductModel.find()
      .limit(size)
      .skip(size * (page - 1));

    const query1 = await ProductModel.countDocuments();
    const number = Math.ceil(query1 / size);
    console.log(query1);

    console.log(number);

    res.status(200).send(new UserResponse(200, "User Data", product));
  } catch (e) {
    console.log(e);

    res.status(200).send(new UserResponse(200, "User Data", e));
  }
};

export const getSpecificProduct = async (
  req: express.Request,
  res: express.Response
) => {
  console.log();

  try {
    const query: any = req.query;

    const req_id = query.id;

    console.log(req_id);

    const product = await ProductModel.find({ _id: Object(req_id) });

    res.status(200).send(new UserResponse(200, "Product Details", product));
  } catch (e) {
    res
      .status(200)
      .send(new UserResponse(200, "Product Details not to be found", e));
  }
};

const  app        = express();
export const cors = require("cors");

const corsOptions = {
  origin              : "http://localhost:3000",   // Replace with the actual URL of your React app
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/products/images", express.static("uploads"));
