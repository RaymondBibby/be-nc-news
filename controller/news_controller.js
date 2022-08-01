const { fetchTopics, fetchArticlesById } = require("../models/news_models")

exports.getTopics = (req, res, next) => {
   fetchTopics().then(( {rows : topics} ) => {
       res.status(200).send({ "topics" : topics });
   })
}

exports.getArticleById = (req, res, next) => {
    fetchArticlesById(req.params)
    .then(({rows : [article] } )=> {
        res.status(200).send({ article  })
    })
    .catch(next)
}


/*

*/

/////ERROR HANDLING BLOCK///////