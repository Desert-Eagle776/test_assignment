import express from 'express';
import multer from 'multer';
import usersController from '../controllers/users.controller.js';
import validateRegistrData from '../validations/users.validation.js';
import tokenMiddleware from '../middlewares/token-middleware.js';
import validatePagination from '../validations/paginationValidator.js';
import validateUserIdParam from '../validations/userIdParam.validation.js';

const router = express.Router();
const upload = multer({ dest: "public/temp/" });

router.post('/register', tokenMiddleware, upload.single("photo"), validateRegistrData, usersController.createUser);
router.get('/register', usersController.registerPage);
router.get('/', validatePagination, usersController.getUsers);
router.get('/:user_id', validateUserIdParam, usersController.getUser);

export default router;