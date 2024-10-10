const express = require('express');
const {  createPost,
    editPost,
    getPost,
    getPosts,
    updatePost,
    likePost,
    dislikePost,
    commentPost,
    deletePost,
    deleteComment } = require('../controllers/postController');
const upload = require('../middleware/multer');


const router = express.Router();

// protecting the routes If user is not logged in, they cannot access the routes

//Get all posts
router.get('/posts', getPosts)

//Get a single post
router.get('/:id', getPost)
router.patch("/post/edit/:postId", editPost);

//Post a new posts
router.post('/post/create',upload.single("image"), createPost)


//Delete a post
router.delete('/:id', deletePost)

//Update a post
router.put('/post/:id', updatePost)

// like a post
router.patch('/post/like/:postId', likePost)

// dislike a post
router.patch('/post/dislike/:postId', dislikePost)

// comment on a post
router.post('/post/comment', commentPost)

// delete comment route
router.delete('/post/:id/comment', deleteComment)

// delete a post
router.delete('/post/:id', deletePost)


module.exports = router;