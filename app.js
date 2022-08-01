const express = require('express');
const app = express();

const { getTopics } = require('./controller/news_controller.js');

app.get('/api/topics', getTopics);



//app.all('/api/*', handleCatchAllError)


module.exports = app