import express from 'express';
import * as UserController from '../controller/UserController';

const routes=express.Router();

routes.get('/all',UserController.getAllUsers)

routes.post('/',UserController.userRegister)

routes.post('/verify',UserController.userVreify)

export default routes;