import express from 'express';
import * as ProductController from '../controller/ProductControllers';


const routes=express.Router();


routes.post('/',ProductController.uploadMiddleware,ProductController.uploadProduct)

routes.get('/all',ProductController.cors(),ProductController.getAllProduct)

routes.get('/filterbyId',ProductController.cors(),ProductController.getSpecificProduct)


export default routes;