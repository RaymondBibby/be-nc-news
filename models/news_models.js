const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics')
   
}

exports.fetchArticlesById = ( {article_id} ) => {
    return db
    .query('SELECT * FROM articles WHERE article_id=$1;', [article_id])
    .then(( {rows} ) => {
        const article = rows[0];
        if(!article) {
            return Promise.reject({
                status: 404,
                msg : `No article found for article_id ${article_id}`
            })
        }
        return article;
    })
}

exports.updateArticleById = async ( { article_id }, { inc_votes } ) => {
    const result = await db.query('UPDATE articles SET votes = votes + $1 WHERE article_id=$2 RETURNING *;', [inc_votes, article_id])

    return result.rows
}