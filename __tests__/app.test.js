const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const { RowDescriptionMessage } = require('pg-protocol/dist/messages');

afterAll( () => {
    return db.end();
});

beforeEach(() => {
    return seed(data)
});

describe("GET: /api/topics", () => {
    it("Status 200: responds with an array of topic objects, each of which have the following properties: 'slug' and 'decsription'. ", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(( {body} ) => {
                const { topics } = body
                expect(topics).toBeInstanceOf(Array);
                
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String),
                      })
                    )
                })
            })
    }) 
})

describe("GET: /api/articles/:article_id", () => {
    describe("HAPPY path", () => {
        it("Status 200: responds with an article object which has the following properties:author which is the username from the users table, title, articel_id, body, topic, created_at, votes.", () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(( {body} ) => {
                    const { article } = body
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
                    )
                })
        })
    });
    describe("SAD Path", () => {
        it("Status 400: responds with a 400 and an appropriate message when a bad end point is provided", () => {
            return request(app)
                .get('/api/articles/banana')
                .expect(400)
                .then(( {body} )=> {
                    expect(body.msg).toBe("Invalid input");
                })
        });
        it("Status 404: responds with a 404 and an appropriate message when a valid end point is provided but the resource doesn't exist", () => {
            return request(app)
                .get('/api/articles/1000')
                .expect(404)
                .then(( {body} )=> {
                    expect(body.msg).toBe("No article found for article_id 1000");
                })
        })
    })
})

describe("ALL: /api/:any_unknown_endpoint", () => {
    it("Status 400: resposnds with a 400 bad request and an appropriate message when an invalid end point is provided.", () => {
        return request(app)
            .get('/api/load_of_rubbish123')
            .expect(400)
            .then((  {body} )=> {
                expect(body.msg).toBe("Invalid input, no such end point exists");
            })
    })
})

describe("PATCH: /api/articles/:article_id", () => {
    describe("HAPPY path", () => {
        it("Status 200: responds with a 200 to indicate that the patch was succesful and responds with the updated article.", () => {
            const incVotes = {
                inc_votes : 100
            };
            return request(app)
                .patch('/api/articles/2')
                .send(incVotes)
                .expect(200)
                .then(( {body} ) => {
                    const { article } = body
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
                    )
                    expect(article.votes).toBe(100)
                })
        });
    })
    describe("SAD path", () => {
        it("Status 400: responds with a 400 and an appropriate message when a bad end point is provided", () => {
            const incVotes = {
                inc_votes : 100
            };
            return request(app)
                .patch('/api/articles/banana')
                .send(incVotes)
                .expect(400) 
                .then(( {body} )=> {
                    expect(body.msg).toBe("Invalid input");
                })
        })
        it("Status 400: responds with a 400 and an appropriate message when a valid end point is provided, but the body is unacceptable", () => {
            const incVotes = {
                inc_votes : "banana"
            };
            return request(app)
                .patch('/api/articles/1')
                .send(incVotes)
                .expect(400) 
                .then(( {body} )=> {
                    expect(body.msg).toBe("Invalid input");
                })
        })
        it("Status 404: responds with a 404 and an appropriate message when a valid enp point is provided but the resource doesn't exist", () => {
            const incVotes = {
                inc_votes : 100
            };
            return request(app)
                .patch('/api/articles/1000')
                .send(incVotes)
                .expect(404)
                .then(( {body} )=> {
                    expect(body.msg).toBe("No article found for article_id 1000, patch unsuccessful");
                })
        })
    })
})