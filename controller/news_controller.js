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
	deleteCommentById,
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

	if (Object.keys(req.query).length === 0) {
		fetchArticles().then((articles) => {
			res.status(200).send({ articles });
		});
	} else if (topic) {
		fetchCommentsByTopic(topic)
			.then((articles) => {
				res.status(200).send({ articles });
			})
			.catch(next);
	} else if (!order && sort_by) {
		fetchArticlesByQuerySortBy(sort_by)
			.then((articles) => {
				res.status(200).send({ articles });
			})
			.catch(next);
	} else if (sort_by && order) {
		fetchArticleBy_Sort_OrderBy(sort_by, order)
			.then((articles) => {
				res.status(200).send({ articles });
			})
			.catch(next);
	} else if (!sort_by && !order && !sort_by === '') {
		fetchArticlesByQuerySortByAsc('created_at')
			.then((articles) => {
				res.status(200).send({ articles });
			})
			.catch(next);
	} else if (!sort_by && order) {
		fetchArticleBy_Sort_OrderBy('created_at', order)
			.then((articles) => {
				res.status(200).send({ articles });
			})
			.catch(next);
	} else if (!sort_by && sort_by === undefined) {
		let input = 'banana';
		if (
			req.query.hasOwnProperty('sort_by') ||
			req.query.hasOwnProperty('order') ||
			req.query.hasOwnProperty('owner')
		) {
			input = 'created_at';
		}

		fetchArticlesByQuerySortByDesc(input)
			.then((articles) => {
				res.status(200).send({ articles });
			})
			.catch(next);
	} else {
		fetchArticlesByQuerySortBy('created_at')
			.then((articles) => {
				res.status(200).send({ articles });
			})
			.catch(next);
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
	const { body, username } = req.body;
	const { article_id } = req.params;

	postUpdateCommentByArticleId(article_id, username, body)
		.then((comment) => {
			res.status(201).send({ comment });
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

exports.deleteCommentsByCommentId = (req, res, next) => {
	deleteCommentById(req.params)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
};

exports.getAllApi = (req, res, next) => [
	res.status(200).send({
		'GET /api': {
			description:
				'serves up a json representation of all the available endpoints of the api',
		},
		'GET /api/topics': {
			description: 'serves an array of all topics',
			queries: [],
			exampleResponse: {
				topics: [{ slug: 'football', description: 'Footie!' }],
			},
		},
		'GET /api/articles': {
			description:
				'serves up an an array of articles complete with information on: author, title, article_id, topic, time stamp and comment count',
			queries: ['author', 'topic', 'sort_by', 'order'],
			exampleResponse: {
				articles: {
					title: 'Seafood substitutions are increasing',
					topic: 'cooking',
					author: 'weegembump',
					body: 'Text from the article..',
					created_at: 1527695953341,
					comment_count: 150,
				},
			},
		},
		'GET /api/:article_id': {
			description:
				'serves up an article object complete with information on: author, title, article_id, topic, time stamp and comment count',
			exampleResponse: {
				article: [
					{
						title: 'Seafood substitutions are increasing',
						topic: 'cooking',
						author: 'weegembump',
						body: 'Text from the article..',
						created_at: 1527695953341,
						comment_count: 150,
					},
				],
			},
		},
		'PATCH /api/articles/:article_id': {
			description:
				'updates the votes property on the relevant article by article_id and serves up the updated article ',
			'request body': { inc_votes: 'newVote' },
			exampleResponse: {
				article: {
					title: 'Seafood substitutions are increasing',
					topic: 'cooking',
					author: 'weegembump',
					body: 'Text from the article..',
					created_at: 1527695953341,
					comment_count: 150,
				},
			},
		},
		'GET /api/users': {
			description:
				'serves up an an array of users complete with information on: username, name, avatar_url',
			exampleResponse: {
				users: [
					{
						username: 'rogersop',
						name: 'paul',
						avatar_url:
							'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
					},
				],
			},
		},
		'POST /api/articles/:article_id/comments': {
			description:
				'adds a comment to the relevant article by article_id and responds with the posted comment',
			'request body': {
				username: 'rogersop',
				body: 'Mitch is so Lorem Ipsum',
			},
			exampleResponse: {
				comment: {
					username: 'butter_bridge',
					body: 'Post a comment from ya boy Butter Bridge',
				},
			},
		},
		'GET /api/articles/:article_id/comments': {
			description:
				'serves up an an array of users complete with information on: username, name, avatar_url',
			exampleResponse: [
				{
					comment: {
						article_id: 1,
						created_at: 1600820280000,
						votes: 1,
						comment_id: 1,
						author: 'jessyjelly',
						body: 'This is my first comment, oh my DAYS!! Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio',
					},
				},
			],
		},
		'DELETE /api/comments/:comment_id': {
			description:
				'deletes the given comment by comment_id and responds with no content',
		},
	}),
];
