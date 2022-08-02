const { fetchTopics, fetchArticlesById, updateArticleById } = require("../models/news_models");
const { checkIndexExists } = require("./controller.utils");

exports.getTopics = (req, res, next) => {
   fetchTopics().then(( {rows : topics} ) => {
       res.status(200).send({ "topics" : topics });
   })
}

exports.getArticleById = (req, res, next) => {
    fetchArticlesById(req.params)
    .then((article )=> {
        res.status(200).send({ article  })
    })
    .catch(next)
}

exports.catchAll = (req, res, next) => {
    res.status(400).send({msg : "Invalid input, no such end point exists"})
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params

    Promise.all([updateArticleById(req.params, req.body), checkIndexExists(article_id)])
    .then(([[article]])=> {
        res.status(200).send( {article} )
    })
    .catch(next)
}


