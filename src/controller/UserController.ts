import jwt, { Secret } from 'jsonwebtoken'
import UserResponse from "../dtos/UserResponse";
import Usermodel from "../models/UserRegitration";
import express from "express";
import * as process from 'process';
const app = express();
export const getAllUsers =async (req:express.Request,res:express.Response)=>{

    try {
        const find =await Usermodel.find();
        res.status(200).send(new UserResponse(200,'User Data',find));

    }catch (e) {
        console.log("Error", e);
    }

}

export const userRegister =async (req:express.Request,res:express.Response)=>{

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
}

export const userVreify =async (req:express.Request, res:express.Response)=>{

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
}

// const express = require('express');
    const nodemailer = require('nodemailer');
    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port:465,
  secure:true,
  auth: {
    user: 'sankalpaishara4@gmail.com',
    pass: process.env.PASSWORD,
  },
});


export const userEmail=(req:express.Request, res:express.Response) => {
    const { recipient, subject, text } = req.body;
  
    const mailOptions = {
      from: 'sankalpaishara4@gmail.com',
      to: 'cocjoker805@gmail.com',
      subject: 'subject',
      text: 'Testing',
    };
  //@ts-ignore
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error: Could not send email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });
}