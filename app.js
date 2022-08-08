const express = require('express');
const app = express();

app.use(express.json());

const {
	getTopics,
	getArticleById,
	catchAll,
	getUsers,
	patchArticleById,
	getArticles,
	postCommentByArticleId,
	getCommentsByArticleId,
	deleteCommentsByCommentId,
	getAllApi,
} = require('./controller/news_controller.js');

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/users', getUsers);

app.get('/api/articles', getArticles);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentsByCommentId);

app.get('/api', getAllApi);

app.all('/api/*', catchAll);

// Error handling block

app.use((err, req, res, next) => {
	console.log('Entering Error handling block', err);
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
});

app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Invalid input' });
	} else next(err);
});

app.use((err, req, res, next) => {
	if (err.code === '23502') {
		res.status(400).send({
			msg: 'Missing column value violating non-null constraint',
		});
	} else next(err);
});

app.use((err, req, res, next) => {
	if (err.code === '23503') {
		res.status(404).send({
			msg: `article_id does not exist, post unsuccessful`,
		});
	} else next(err);
});

module.exports = app;
