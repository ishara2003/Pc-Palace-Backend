import {Document, Schema, model} from "mongoose";

interface IUser extends Document{
    userName: string,
    email: string,
    contactNumber: string,
    password: string,

}

const Userschema = new Schema({

    userName: {type: String, required: true},
    email: {type: String, required: true},
    contactNumber: {type: String, required: true},
    password: {type: String, required: true},


});

const Usermodel = model<IUser>("User",Userschema);

export  default Usermodel;
