import express from 'express';
import usersController from '../controllers/users';

const router = express.Router();

router.use(express.urlencoded());
router.use(express.json());

router.get('/', usersController.getUsers);

export default router;
