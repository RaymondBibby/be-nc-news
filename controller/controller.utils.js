const db = require('../db/connection')

exports.checkIndexExists = async (article_id) => {
    const dbOutput = await db.query(
        'SELECT * FROM articles WHERE article_id=$1;', [article_id]
    );
    if(dbOutput.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: `No article found for article_id ${article_id}, patch unsuccessful`,
        })
    }
}