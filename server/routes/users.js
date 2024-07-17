import express from 'express'
import {
    getAllUsers,
    getUser,
    getUserFriends,
    addRemoveFriend
} from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// read update delete

router.get('/allUsers', getAllUsers)

router.get('/:id',verifyToken,getUser);

router.get('/:id/friends',verifyToken,getUserFriends);

router.patch('/:id/:friendId',verifyToken,addRemoveFriend);

export default router;