import express from 'express'
import {getFeedPosts,getUserPosts,likePost, getPostById,commentPost,deletePost, deleteComment} from '../controllers/posts.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router();

// READ

router.get('/',verifyToken,getFeedPosts);
router.get('/:userId/posts',verifyToken,getUserPosts);
router.get('/:postId',verifyToken, getPostById)
//UPDATE

router.patch('/:id/like',verifyToken,likePost);
router.post('/:id/comment', verifyToken, commentPost);

//DELETE
router.delete('/:id', verifyToken, deletePost);
router.delete('/:postId/comment/:commentId', verifyToken, deleteComment);


export default router;