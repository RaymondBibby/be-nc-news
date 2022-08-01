const express = require('express');
const app = express();

const { 
    getTopics, 
    getArticleById, 
} 
= require('./controller/news_controller.js');

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById)



//app.all('/api/*', handleCatchAllError)


module.exports = app