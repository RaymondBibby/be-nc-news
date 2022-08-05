const articles = require('../db/data/test-data/articles');
const {
	fetchTopics,
	fetchArticlesById,
	updateArticleById,
	fetchUsers,
	fetchArticles,
	postUpdateCommentByArticleId,
	fetchCommentsByArticleId,
	fetchArticlesByQuerySortBy,
	fetchArticleBy_Sort_OrderBy,
	fetchArticlesByQuerySortByAsc,
	fetchArticlesByQuerySortByDesc,
	fetchCommentsByTopic,
} = require('../models/news_models');

const { checkIndexExists } = require('./controller.utils');

exports.getTopics = (req, res, next) => {
	fetchTopics().then(({ rows: topics }) => {
		res.status(200).send({ topics: topics });
	});
};

exports.getArticleById = (req, res, next) => {
	fetchArticlesById(req.params)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.catchAll = (req, res, next) => {
	res.status(404).send({ msg: 'Invalid input, no such end point exists' });
};

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;

	Promise.all([
		updateArticleById(req.params, req.body),
		checkIndexExists(article_id),
	])
		.then(([[article]]) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getArticles = (req, res, next) => {
	const { sort_by, order, topic } = req.query;

	if (!req.query) {
		fetchArticles().then((articles) => {
			res.status.send({ articles });
		});
	} else if (topic) {
		fetchCommentsByTopic(topic)
			.then((articles) => {
				res.status(200).send({ articles });
			})
			.catch(next);
	} else if (!req.query.order && req.query.sort_by) {
		fetchArticlesByQuerySortBy(sort_by).then((articles) => {
			res.status(200).send({ articles });
		});
	} else if (!req.query.sort_by && !req.query.order && !sort_by === '') {
		fetchArticlesByQuerySortByAsc('created_at').then((articles) => {
			res.status(200).send({ articles });
		});
	} else if (!req.query.sort_by && req.query.order) {
		fetchArticleBy_Sort_OrderBy('created_at', order).then((articles) => {
			res.status(200).send({ articles });
		});
	} else if (!req.query.sort_by && req.query.sort_by === undefined) {
		fetchArticlesByQuerySortByDesc('created_at').then((articles) => {
			res.status(200).send({ articles });
		});
	} else {
		fetchArticlesByQuerySortBy('created_at').then((articles) => {
			res.status(200).send({ articles });
		});
	}
};

exports.getUsers = (req, res, next) => {
	fetchUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
	postUpdateCommentByArticleId(req.params, req.body)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
	fetchCommentsByArticleId(req.params)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};
