const {
	fetchTopics,
	fetchArticlesById,
	updateArticleById,
	fetchUsers,
	fetchArticles,
} = require("../models/news_models");
const { checkIndexExists } = require("./controller.utils");

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
	res.status(404).send({ msg: "Invalid input, no such end point exists" });
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
	fetchArticles().then((articles) => {
		res.status(200).send({ articles });
	});
};

exports.getUsers = (req, res, next) => {
	fetchUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};
