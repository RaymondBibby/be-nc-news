const db = require('../db/connection');
const { commentData } = require('../db/data/test-data');
const {
	getArticlesByIdForComment,
	getCommentCount,
	getCommentCountAllArticles,
	getAllArticles,
	createRefTable,
	updateArticles,
} = require('./models.utils');

exports.fetchTopics = () => {
	return db.query('SELECT * FROM topics');
};

exports.fetchArticlesById = ({ article_id }) => {
	return Promise.all([
		getArticlesByIdForComment(article_id),
		getCommentCount(article_id),
	]).then(([articleById, commentCount]) => {
		const { comment_count } = commentCount;
		const article = articleById;
		article.comment_count = parseInt(comment_count);

		return article;
	});
};

exports.fetchUsers = async () => {
	const result = await db.query('SELECT * FROM users');
	return result.rows;
};

exports.updateArticleById = async ({ article_id }, { inc_votes }) => {
	const result = await db.query(
		'UPDATE articles SET votes = votes + $1 WHERE article_id=$2 RETURNING *;',
		[inc_votes, article_id]
	);
	return result.rows;
};

exports.fetchArticles = () => {
	return Promise.all([getAllArticles(), getCommentCountAllArticles()]).then(
		([allArticles, allCommentCounts]) => {
			const refObj = createRefTable(
				allCommentCounts,
				'article_id',
				'comment_count'
			);
			const updatedArticles = updateArticles(
				allArticles,
				refObj,
				'article_id',
				'comment_count'
			);

			return updatedArticles;
		}
	);
};

exports.postUpdateCommentByArticleId = async (
	{ article_id },
	{ username, body }
) => {
	const result = await db.query(
		'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
		[article_id, username, body]
	);
	const [comment] = result.rows;
	console.log(result);
	return comment;
};
