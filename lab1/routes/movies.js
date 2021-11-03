const express = require('express');
const router = express.Router();
const data = require('../data');
const moviesData = data.movies;

router.get('/:id', async (req, res) => {
    try {
      const movie = await moviesData.getMovieById(req.params.id);
      res.json(movie);
    } catch (e) {
      res.status(404).json({ error: 'Movie not found' });
    }
  });

router.get('/', async (req, res) => {
    try {
        let skip = parseInt(req.query.skip,10)
        let take = parseInt(req.query.take,10)
        let result = [];
        let movieList = await moviesData.getAllMovies();
        if(skip<0 || take<0){
            res.status(400).json({error:"take/skip not positive values"})
            return
        }
        else if(skip){
            result = movieList.slice(skip,skip+20)
        }
        else if(take){
            if(take>100){
                result = movieList.slice(0,99);
            }else{
                result = movieList.slice(0, take);
            }
        }
        else{
            result = movieList.slice(0,20)
        }

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e});;
    }
});
router.post('/', async (req, res) => {
    try{
        if(!req.body.title){
            throw new Error("No title")
        }
        if(!req.body.plot){
            throw new Error("No plot")
        }
        if(!req.body.rating){
            throw new Error("No rating")
        }
        if(!req.body.cast){
            throw new Error("No cast")
        }
        if(!req.body.info){
            throw new Error("No info")
        }
    }catch(e){
        res.status(400).json({error:e});
        return;
    }
    try {
        let movie = await moviesData.createMovie(req.body.title,req.body.plot,req.body.rating,req.body.cast,req.body.info);
        res.status(200).json(movie);
    } catch (e) {
        res.status(500).json({ error: e});;
    }
});
router.put('/:id', async (req, res) => {
    if( !(req.body.title && req.body.plot && req.body.rating && req.body.cast && req.body.info)){
        res.status(400).json({error:"missing parameter"})
    }
    try{
        if(!req.body.title){
            throw new Error("No title")
        }
        if(!req.body.plot){
            throw new Error("No plot")
        }
        if(!req.body.rating){
            throw new Error("No rating")
        }
        if(!req.body.cast){
            throw new Error("No cast")
        }
        if(!req.body.info){
            throw new Error("No info")
        }
    }catch(e){
        res.status(400).json({error:e});
        return;
    }
    try {
        let movie = await moviesData.putMovie(req.params.id,req.body.title,req.body.plot,req.body.rating,req.body.cast,req.body.info);
        res.json(movie);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e});
    }
});
router.patch('/:id', async (req, res) => {
    if(!req.body.title && !req.body.plot && !req.body.rating && !req.body.cast && !req.body.info){
        res.status(400).json({error:"must include one parameter to update"})
    }
    let updatedMovie ={}
    if(req.body.title){
        updatedMovie.title = req.body.title
    }else{
        updatedMovie.title = null;
    }
    if(req.body.plot){
        updatedMovie.plot = req.body.plot
    }else{
        updatedMovie.plot = null;
    }
    if(req.body.rating){
        updatedMovie.rating = req.body.rating
    }else{
        updatedMovie.rating = null;
    }
    if(req.body.cast){
        updatedMovie.cast = req.body.cast
    }else{
        updatedMovie.cast = null;
    }
    if(req.body.info){
        updatedMovie.info = req.body.info
    }else{
        updatedMovie.info = null;
    }

    try {
        let movie = await moviesData.patchMovie(req.params.id,updatedMovie.title,updatedMovie.plot,updatedMovie.rating,updatedMovie.cast,updatedMovie.info);
        res.status(200).json(movie);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e});;
    }
});
router.post('/:id/comments', async (req, res) => {
    try{
        if(!req.body.name){
            throw new Error("No name")
        }
        if(!req.body.comment){
            throw new Error("No comment")
        }
        if(!req.params.id){
            throw new Error("No id")
        }
    }catch(e){
        res.status(400).json({error:e});
        return;
    }
    try {
        let movie = await moviesData.createComment(req.params.id,req.body.name,req.body.comment);
        res.status(200).json(movie);
    } catch (e) {
        res.status(500).json({ error: e});;
    }
});
router.delete('/:movieId/:commentId', async (req, res) => {
    try{
        if(!req.params.movieId){
            throw new Error("No movideId")
        }
        if(!req.params.commentId){
            throw new Error("No commentId")
        }
    }catch(e){
        res.status(400).json({error:e});
        return;
    }
    try {
        let movie = await moviesData.deleteComment(req.params.movieId,req.params.commentId);
        res.status(200).json(movie)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e});;
    }
});

module.exports = router;