import { Router } from 'express';
import validate from 'express-validation';

import * as userController from './user.controller';
import userValaidation from './user.validations';
import { authLocal } from '../services/auth.services';

const router = new Router();

router.post('/signup', validate(userValaidation.signup), userController.signUp);
router.get('/exist', userController.checkExist);
router.post('/login', authLocal, userController.login);
router.delete('/delete', userController.deleteUser);
router.patch('/update', userController.updateUser);
router.get('/verify', userController.verifyEmail);
router.get('/', userController.getUserData);
router.get('/exist', userController.checkExist);
router.get('/sendVerificationEmail', userController.sendNewVerificationEmail);

export default router;
