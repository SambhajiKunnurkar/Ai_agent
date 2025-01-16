import {Router} from 'express';
import * as userControler from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js'
const router = Router();


router.post('/register',
    body('email').isEmail().withMessage('email must be valid email'),
    body('password').isLength({min: 3}).withMessage('password must be at'),

    userControler.creatUserController);
router.post('/login',
    body('email').isEmail().withMessage('email must be valid email'),
    body('password').isLength({min: 3}).withMessage('password must be at'),
    userControler.loginController

);


router.get('/profile', authMiddleware.authUser, userControler.profileController);

router.get('/logout', authMiddleware.authUser, userControler.logoutController);

router.get('/all', authMiddleware.authUser, userControler.getAllUsersController);


export default router;