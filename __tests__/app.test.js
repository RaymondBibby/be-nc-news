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

