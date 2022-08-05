const { query } = require('../db/connection');
const db = require('../db/connection');
const {
	getArticlesByIdForComment,
	getCommentCount,
	getCommentCountAllArticles,
	getAllArticles,
	createRefTable,
	updateArticles,
	fetchCommentByArticle_Id,
	checkArticleIdExists,
	fetchArticlesAll,
	fetchArticlesByQuerySortBy,
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

exports.fetchArticles = (sort_by) => {
	return db
		.query(
			'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;'
		)
		.then((result) => {
			const articles = result.rows;

			articles.map((article) => {
				article.comment_count = parseInt(article.comment_count);
				return article;
			});
			console.log(articles);
			return articles;
		});
};

exports.fetchArticleBy_Sort_OrderBy = (sortBy = 'created_at', order) => {
	const safeOrderValues = ['asc', 'desc'];
	const safeQueryValues = [
		'title',
		'topic',
		'author',
		'created_at',
		'votes',
		'article_id',
		'comment_count',
	];
	let err = false;

	let queryStr =
		'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ';

	safeQueryValues.forEach((value, index) => {
		if (value === sortBy) {
			queryStr += `ORDER BY ${sortBy} `;
		} else if (
			index === safeQueryValues.length - 1 &&
			order !== sortBy &&
			queryStr ===
				'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id '
		) {
			err = true;
		}
	});
	let queryStr2 = queryStr;

	safeOrderValues.forEach((value, index) => {
		console.log(value, order);
		if (value === order) {
			if (order === 'asc') {
				queryStr += 'ASC';
			} else {
				queryStr += 'DESC';
			}
		} else if (
			index === safeOrderValues.length - 1 &&
			value !== order &&
			queryStr === queryStr2
		) {
			err = true;
		}
	});

	return db.query(queryStr).then(({ rows: articles }) => {
		if (err === true) {
			return Promise.reject({
				status: 400,
				msg: 'Invalid input',
			});
		}

		articles.map((article) => {
			article.comment_count = parseInt(article.comment_count);
			return article;
		});

		return articles;
	});
};

exports.fetchArticlesByQuerySortBy = (sortBy = 'created_at') => {
	const safeQueryValues = [
		'title',
		'topic',
		'author',
		'created_at',
		'votes',
		'article_id',
		'comment_count',
	];
	let err = false;

	let queryStr =
		'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ';

	safeQueryValues.forEach((value, index) => {
		if (value === sortBy) {
			queryStr += `ORDER BY ${sortBy} ASC `;
		} else if (
			index === safeQueryValues.length - 1 &&
			value !== sortBy &&
			queryStr ===
				'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id '
		) {
			err = true;
		}
	});

	return db.query(queryStr).then(({ rows: articles }) => {
		if (err === true) {
			return Promise.reject({
				status: 400,
				msg: 'Invalid input',
			});
		}
		articles.map((article) => {
			article.comment_count = parseInt(article.comment_count);
			return article;
		});

		return articles;
	});
};

exports.fetchArticlesByQuerySortByDesc = async (sortBy = 'created_at') => {
	const safeQueryValues = [
		'title',
		'topic',
		'author',
		'created_at',
		'votes',
		'article_id',
		'comment_count',
	];

	let err = false;

	let queryStr =
		'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ';

	safeQueryValues.forEach((value, index) => {
		if (value === sortBy) {
			queryStr += `ORDER BY ${sortBy} DESC `;
		} else if (
			index === safeQueryValues.length - 1 &&
			value !== sortBy &&
			queryStr ===
				'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id '
		) {
			err = true;
		}
	});

	return db.query(queryStr).then(({ rows: articles }) => {
		if (err === true) {
			return Promise.reject({
				status: 400,
				msg: 'Invalid input',
			});
		}
		articles.map((article) => {
			article.comment_count = parseInt(article.comment_count);
			return article;
		});

		return articles;
	});
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
	return comment;
};

exports.fetchCommentsByArticleId = ({ article_id }) => {
	return Promise.all([
		getCommentCount(article_id),
		fetchCommentByArticle_Id(article_id),
		checkArticleIdExists(article_id),
	]).then(([commentCount, articleById, exists]) => {
		if (!exists.length) {
			return Promise.reject({
				status: 404,
				msg: `No article found for article_id ${article_id}`,
			});
		} else if (articleById.length == 0 && commentCount.comment_count == 0) {
			return Promise.reject({
				status: 404,
				msg: 'No comments exist for this article',
			});
		}
		return articleById;
	});
};

exports.fetchCommentsByTopic = (topic) => {
	return db
		.query(
			'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic=$1 GROUP BY articles.article_id ;',
			[topic]
		)
		.then(({ rows: articles }) => {
			if (!articles.length) {
				return Promise.reject({
					status: 400,
					msg: 'Invalid input',
				});
			}
			articles.map((article) => {
				article.comment_count = parseInt(article.comment_count);
				return article;
			});

			return articles;
		});
};
