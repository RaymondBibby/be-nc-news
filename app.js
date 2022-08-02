const express = require('express');
const app = express();

app.use(express.json())

const { 
    getTopics, 
    getArticleById,
    catchAll,
    patchArticleById, 
} 
= require('./controller/news_controller.js');

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticleById)

app.all('/api/*',catchAll);


/////ERROR HANDLING BLOCK///////
app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg : err.msg});
    } else next(err);
})

app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg : "Invalid input" })
    }
})




module.exports = app