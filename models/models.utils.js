const db = require('../db/connection');
const articles = require('../db/data/test-data/articles');

exports.getCommentCount = async (article_id) => {
    const dbresult = await db.query(
        'SELECT COUNT(articles.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1;', [article_id]
    )
    
    const [count] = dbresult.rows
   return count;
}

exports.getArticlesByIdForComment = async (article_id) => {
    const dbresult = await db.query(
       'SELECT * FROM articles WHERE article_id=$1;', [article_id] 
    )
    const [article] = dbresult.rows

    if(!article) {
        return Promise.reject({
        status: 404,
        msg : `No article found for article_id ${article_id}`
        })
    }
    
    return article
}


