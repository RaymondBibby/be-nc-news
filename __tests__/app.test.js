const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index')

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

describe.only("GET: /api/articles/:article_id", () => {
    describe("Happy path", () => {
        it("Status 200: responds with an article object which has the following properties:author which is the username from the users table, title, articel_id, body, topic, created_at, votes.", () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(( {body} ) => {
                    const { article } = body
                    // console.log("testsuite", article)
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
    })
})

