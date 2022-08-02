const { fetchTopics, fetchArticlesById, fetchUsers } = require("../models/news_models")

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


















exports.getUsers = (req, res, next) => {

    fetchUsers()
    .then((users) => {
        res.status(200).send( {users} )
    })
    .catch(next);
}