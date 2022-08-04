const db = require('../db/connection');
const articles = require('../db/data/test-data/articles');

exports.getCommentCount = async (article_id) => {
	const dbresult = await db.query(
		'SELECT COUNT(articles.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1;',
		[article_id]
	);

	const [count] = dbresult.rows;
	return count;
};

exports.getArticlesByIdForComment = async (article_id) => {
	const dbresult = await db.query(
		'SELECT * FROM articles WHERE article_id=$1;',
		[article_id]
	);
	const [article] = dbresult.rows;

	if (!article) {
		return Promise.reject({
			status: 404,
			msg: `No article found for article_id ${article_id}`,
		});
	}

	return article;
};

exports.getCommentCountAllArticles = async () => {
	const dbresult = await db.query(
		'SELECT articles.article_id, COUNT(*) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;'
	);

	const { rows: comments } = dbresult;
	return comments;
};

exports.getAllArticles = async () => {
	const dbresult = await db.query('SELECT * FROM articles');
	const { rows: articles } = dbresult;
	return articles;
};

exports.createRefTable = (refArr, key, value) => {
	const refObj = {};

	refArr.forEach((articleObj) => {
		refObj[articleObj[key]] = articleObj[value];
	});

	return refObj;
};

exports.updateArticles = (
	refArr,
	refObj,
	key /*article_id*/,
	value /*comment_count */
) => {
	const arrayToReturn = refArr.map((article) => {
		const articleId = article[key];

		article[parseInt(value)] = refObj[articleId];

		if (article[value] === undefined) {
			article[value] = 0;
		}

		return article;
	});
	return arrayToReturn;
};

exports.fetchCommentByArticle_Id = async (article_id) => {
	const result = await db.query(
		'SELECT * FROM comments WHERE article_id=$1;',
		[article_id]
	);
	const article = result.rows;

	return article;
};

exports.checkArticleIdExists = async (article_id) => {
	const result = await db.query(
		'SELECT * FROM articles WHERE article_id=$1;',
		[article_id]
	);
	const returnVal = result.rows;
	return returnVal;
};
