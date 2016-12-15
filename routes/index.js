var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

/* GET all posts. */ 
router.get('/posts', function(req, res, next){
    Post.find(function(err, posts){
        if(err){return next(err); }

        res.json(posts);
    });
});


/* POST a post to the DB */
router.post('/posts',function(req,res,next){
    var post = new Post(req.body);

    post.save(function(err,post){
        if(err) {return next(err); }

        res.json(post)
    });
});

/* Preloading post objects */
router.param('post',function(req,res,next,id){
    var query = Post.findById(id);

    query.exec(function(err,post){
        if (err) {return next(err); }
        if (!post) {return next(new Error('Can\'t find post!')); }

        req.post = post;
        return next();
    });
});

/* Get a single post object */
router.get('/posts/:post',function(req,res){
    req.post.populate('comments',function(err,post){
        if (err){ return next(err); }

        res.json(post)
    });
});

/* PUT Upvote a post */
router.put('/posts/:post/upvote',function(req,res,next){
    req.post.upvote(function(err,post){
        if (err) {return next(err); }

        res.json(post);
    });
});

/* POST Creating a comment on a post */
router.post('/posts/:post/comments', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function(err, comment){
        if (err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post){
            if (err) { return next(err); }

            res.json(comment);
        });
    });
});

/* Preloading comment object */
router.param('comment',function(req,res,next,id){
    var query = Comment.findById(id);

    query.exec(function(err,comment){
        if (err) {return next(err); }
        if (!comment) {return next(new Error('Can\'t find comment!')); }

        req.comment = comment;
        return next();
    });
});

/* PUT Upvoting a comment */
router.put('/posts/:post/comments/:comment/upvote',function(req,res,next){
    req.comment.upvote(function(err,comment){
        if (err){ return next(err); }

        res.json(comment);
    });
});



