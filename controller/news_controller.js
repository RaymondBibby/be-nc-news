const { fetchTopics } = require("../models/news_models")

exports.getTopics = (req, res, next) => {
   fetchTopics().then(( {rows : topics} ) => {
       res.status(200).send({ "topics" : topics });
   })
}


/////ERROR HANDLING BLOCK///////