const { fetchTopics, fetchArticlesById } = require("../models/news_models")

exports.getTopics = (req, res, next) => {
   fetchTopics().then(( {rows : topics} ) => {
       res.status(200).send({ "topics" : topics });
   })
}

exports.getArticleById = (req, res, next) => {
    fetchArticlesById(req.params).then(({rows : [article] } )=> {
        res.status(200).send({ article  })
    })
}


/*
Responds with:

an article object, which should have the following properties:

author which is the username from the users table
title
article_id
body
topic
created_at
votes

*/

/////ERROR HANDLING BLOCK///////