const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require('../database');
const {requireUser} = require('./utils')

postsRouter.post('/', requireUser, async (req, res, next) => {

  const { title, content, tags = "" } =req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  if(tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    postData.title = title;
    postData.content = content;
    postData.authorId = req.user.id
    const post = await createPost(postData);

    if(post){
      res.send(post)
    }
    else next();
  } catch (error) {
    next({name: "You need a username", message: "Working on it"})
  }

  // res.send({ message: 'under construction' });
});

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    next(); 
  });
  
  postsRouter.get('/', async (req, res) => {
    const users = await getAllPosts();
  
    res.send({
      users
    });
  });

  postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

module.exports = postsRouter;

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NDk1MjA4NjcsImV4cCI6MTY1MDEyNTY2N30.oxz-fs1WCmDBaYun0r-nnqscNT1QkUh1eWIhnP362NU"

// curl http://localhost:3000/api/posts/1 -X PATCH -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NDk1MjA4NjcsImV4cCI6MTY1MDEyNTY2N30.oxz-fs1WCmDBaYun0r-nnqscNT1QkUh1eWIhnP362NU' -H 'Content-Type: application/json' -d '{"title": "updating my old stuff", "tags": "#oldisnewagain"}'


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NDk1MjA4NjcsImV4cCI6MTY1MDEyNTY2N30.oxz-fs1WCmDBaYun0r-nnqscNT1QkUh1eWIhnP362NU