const express = require('express');
const app = express();

const { 
    getTopics, 
    getArticleById,
    catchAll, 
} 
= require('./controller/news_controller.js');

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.all('/api/*',catchAll);



//app.all('/api/*', handleCatchAllError)

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