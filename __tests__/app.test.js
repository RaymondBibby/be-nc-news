const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

afterAll(() => {
	return db.end();
});

beforeEach(() => {
	return seed(data);
});

describe('GET: /api/topics', () => {
	it("Status 200: responds with an array of topic objects, each of which have the following properties: 'slug' and 'decsription'. ", () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				const { topics } = body;
				expect(topics).toBeInstanceOf(Array);

				topics.forEach((topic) => {
					expect(topic).toEqual(
						expect.objectContaining({
							slug: expect.any(String),
							description: expect.any(String),
						})
					);
				});
			});
	});
});

describe('GET: /api/articles/:article_id', () => {
	describe('HAPPY path', () => {
		it('Status 200: responds with an article object which has the following properties:author which is the username from the users table, title, articel_id, body, topic, created_at, votes.', () => {
			return request(app)
				.get('/api/articles/1')
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toBeInstanceOf(Object);
					expect(article.comment_count).toBe(11);

					expect(article).toEqual(
						expect.objectContaining({
							article_id: expect.any(Number),
							author: expect.any(String),
							title: expect.any(String),
							topic: expect.any(String),
							body: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
						})
					);
				});
		});
	});
	describe('SAD Path', () => {
		it('Status 400: responds with a 400 and an appropriate message when a bad end point is provided', () => {
			return request(app)
				.get('/api/articles/banana')
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe('Invalid input');
				});
		});
		it("Status 404: responds with a 404 and an appropriate message when a valid end point is provided but the resource doesn't exist", () => {
			return request(app)
				.get('/api/articles/1000')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe('No article found for article_id 1000');
				});
		});
	});
});

describe('ALL: /api/:any_unknown_endpoint', () => {
	it('Status 404: resposnds with a 404 bad request and an appropriate message when an invalid end point is provided.', () => {
		return request(app)
			.get('/api/load_of_rubbish123')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid input, no such end point exists');
			});
	});
});

describe('PATCH: /api/articles/:article_id', () => {
	describe('HAPPY path', () => {
		it('Status 200: responds with a 200 to indicate that the patch was succesful and responds with the updated article.', () => {
			const incVotes = {
				inc_votes: 100,
			};
			return request(app)
				.patch('/api/articles/2')
				.send(incVotes)
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toBeInstanceOf(Object);

					expect(article).toEqual(
						expect.objectContaining({
							article_id: expect.any(Number),
							author: expect.any(String),
							title: expect.any(String),
							topic: expect.any(String),
							body: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
						})
					);
					expect(article.votes).toBe(100);
				});
		});
	});
	describe('SAD path', () => {
		it('Status 400: responds with a 400 and an appropriate message when a bad end point is provided', () => {
			const incVotes = {
				inc_votes: 100,
			};
			return request(app)
				.patch('/api/articles/banana')
				.send(incVotes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe('Invalid input');
				});
		});
		it('Status 400: responds with a 400 and an appropriate message when a valid end point is provided, but the body is unacceptable', () => {
			const incVotes = {
				inc_votes: 'banana',
			};
			return request(app)
				.patch('/api/articles/1')
				.send(incVotes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe('Invalid input');
				});
		});
		it("Status 404: responds with a 404 and an appropriate message when a valid end point is provided but the resource doesn't exist", () => {
			const incVotes = {
				inc_votes: 100,
			};
			return request(app)
				.patch('/api/articles/1000')
				.send(incVotes)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe(
						'No article found for article_id 1000, patch unsuccessful'
					);
				});
		});
		it('Status 400: responds with a 400 and an appropriate message when a valid end point is provided, but the body does not contain a required field', () => {
			const incVotes = {};

			return request(app)
				.patch('/api/articles/1')
				.send(incVotes)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe(
						'Missing column value violating non-null constraint'
					);
				});
		});
	});
});

describe('GET: /api/users', () => {
	it("Status 200: responds with an array of user objects, each of which have the following properties: 'username', 'name' and 'avatar_url'. ", () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body }) => {
				const { users } = body;
				expect(users).toBeInstanceOf(Array);
				expect(users.length).toBe(4);

				users.forEach((user) => {
					expect(user).toEqual(
						expect.objectContaining({
							username: expect.any(String),
							name: expect.any(String),
							avatar_url: expect.any(String),
						})
					);
				});
			});
	});
	it('Status 404: resposnds with a 404 bad request and an appropriate message when an invalid end point is provided, e.g., misspelling', () => {
		return request(app)
			.get('/api/userrs')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid input, no such end point exists');
			});
	});
});

describe('GET: /api/articles', () => {
	it('Status 200: responds with an array of article objects, each of which have the following properties: author, title, article_id, topic, created_at, votes, comment_count ', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toBeInstanceOf(Array);
				expect(articles.length).toBe(12);

				articles.forEach((article) => {
					expect(article).toEqual(
						expect.objectContaining({
							author: expect.any(String),
							title: expect.any(String),
							article_id: expect.any(Number),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
						})
					);
				});
			});
	});
	it('Status 404: resposnds with a 404 bad request and an appropriate message when an invalid end point is provided, e.g., misspelling', () => {
		return request(app)
			.get('/api/articlles')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid input, no such end point exists');
			});
	});
});

describe('POST: /api/articles/:article_id/comments', () => {
	describe('HAPPY path', () => {
		it('Status 200: responds with a 200 to indicate that the comment post was succesful and responds with the posted comment.', () => {
			const postComment = {
				username: 'butter_bridge',
				body: 'Post a comment from ya boy Butter Bridge',
			};
			return request(app)
				.post('/api/articles/1/comments')
				.send(postComment)
				.expect(200)
				.then(({ body }) => {
					const { comment } = body;
					expect(comment).toBeInstanceOf(Object);
					expect(comment.comment_id).toBe(19);

					expect(comment).toEqual(
						expect.objectContaining({
							comment_id: expect.any(Number),
							body: expect.any(String),
							article_id: expect.any(Number),
							author: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
						})
					);
				});
		});
	});
	describe('SAD path', () => {
		it('Status 400: responds with a 400 and an appropriate message when a bad end point is provided', () => {
			const postComment = {
				username: 'butter_bridge',
				body: 'Post a comment from ya boy Butter Bridge',
			};
			return request(app)
				.post('/api/articles/banana/comments')
				.send(postComment)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe('Invalid input');
				});
		});
		it('Status 400: responds with a 400 and an appropriate message when a valid end point is provided, but the body is unacceptable', () => {
			const postComment = {
				username: 'butter_bridge',
			};
			return request(app)
				.post('/api/articles/1/comments')
				.send(postComment)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe(
						'Missing column value violating non-null constraint'
					);
				});
		});
		it("Status 404: responds with a 404 and an appropriate message when a valid end point is provided but the resource doesn't exist", () => {
			const postComment = {
				username: 'butter_bridge',
				body: 'Post a comment from ya boy Butter Bridge',
			};
			return request(app)
				.post('/api/articles/1000/comments')
				.send(postComment)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe(
						`article_id does not exist, post unsuccessful`
					);
				});
		});
		it('Status 400: responds with a 400 and an appropriate message when a valid end point is provided, but the body does not contain a required field', () => {
			const postComment = {};

			return request(app)
				.post('/api/articles/1/comments')
				.send(postComment)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe(
						'Missing column value violating non-null constraint'
					);
				});
		});
		it("Status 404: responds with a 404 and an appropriate message when a valid end point is provided but the resource doesn't exist", () => {
			const postComment = {
				username: 'butter_bridge',
				body: 'Post a comment from ya boy Butter Bridge',
			};
			return request(app)
				.patch('/api/articlees/1/commeents')
				.send(postComment)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe('Invalid input, no such end point exists');
				});
		});
	});
});

describe('GET: /api/articles/:article_id/comments', () => {
	describe('HAPPPY  path', () => {
		it('responds with an array of comment objects with the following properties: comment _id, votes, created_at, author and body', () => {
			return request(app)
				.get('/api/articles/3/comments')
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments).toBeInstanceOf(Array);
					expect(comments.length).toBe(2);

					comments.forEach((comment) => {
						expect(comment).toEqual(
							expect.objectContaining({
								article_id: expect.any(Number),
								created_at: expect.any(String),
								votes: expect.any(Number),
								comment_id: expect.any(Number),
								author: expect.any(String),
								body: expect.any(String),
							})
						);
					});
				});
		});
	});
	describe('SAD Path', () => {
		it('Status 400: responds with a 400 and an appropriate message when a bad end point is provided', () => {
			return request(app)
				.get('/api/articles/banana/comments')
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe('Invalid input');
				});
		});
		it("Status 404: responds with a 404 and an appropriate message when a valid end point is provided but the resource doesn't exist", () => {
			return request(app)
				.get('/api/articles/999/comments')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe('No article found for article_id 999');
				});
		});
		it('Status 404: resposnds with a 404 bad request and an appropriate message when an invalid end point is provided, e.g., misspelling', () => {
			return request(app)
				.get('/api/articlles/1/comments')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe('Invalid input, no such end point exists');
				});
		});
		it('Status 404: resposnds with a 404 and an appropriate message when a valid end point is provided, but when no comments exist for the article', () => {
			return request(app)
				.get('/api/articles/2/comments')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe('No comments exist for this article');
				});
		});
	});
});
