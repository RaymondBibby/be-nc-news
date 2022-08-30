# Northcoders News API

## Description of App

This back-end API, **nc-news**, is the product of a one week solo project
undertaken as part of the Northcoders (hence Northcoders-news) bootcamp.

The API will serve up various news content, related comments and user driven
content such as upvotes. It was designed with RESTful principles in mind, built
using Express, Node Postgres and Jest for the test suite. The API will allow
users to:

GET:

-  A list of all **end-points** (https://be-nc-news-rayb.herokuapp.com/api)
-  A list of all **topics**
-  A list of all **articles**
-  Any article by **article id**
-  A list of all **users**
-  A list of **comments** by article id

PATCH:

-  Update **upvotes** on article for a given article id

POST:

-  Post a **comment** on a given article by article id

DELETE:

-  Post a **comment** on a given article by article id

The API will support a front end app that will also be undertaken as part of the
Northcoders Bootcamp.

## 1. Neccesary set-up to be able to clone and use this repository locally.

### Envioronmental variable files

In order to correctly set the PGDATABASE depending on which environment and
hence script you choose to run (test/ development), you first must set-up some
environmental variables locally by creating two new .env files (which will have
been/ will continue to be gitignored whenever this repo is pushed/ pulled).

This will allow the correct PG database to be established on your local machine:

.env.development //file created in the root of be-nc-news with the following
script:

PGDATABASE=nc_news

.env.test // file created in the root of be-nc-news with the following script:

PGDATABASE=nc_news_test

## `node minimum requirements to run the project locally`

Before running the project locally please ensure that you are running at least
node v16.15.

## `postgres minimum requirements to run the project locally`

Before running the project locally please ensure that you are running at least
postgres v14.4.

## Running the project locally

To run the project locally, please follow the steps outlined below:

1. Move to a local directory where you wish the repo to be rooted using the CL.
2. On the CL run: `git clone https://github.com/RaymondBibby/be-nc-news.git`
3. On the CL run:`cd be-nc-news`, this should default to the main branch.
4. On the CL run: `npm i` to install all node dependencies.
5. To set up the databases run: `npm setup-dbs`. You only need to do this once.
6. To seed the database run: `npm seed`. This will allow you to run all tests
7. To run test suite run `npm test`

**Note: this is a still a live project. You can think of the app as
`still under construction`, with other features still to be added!**

## Front-end

URL front-end app: `https://nc-news-rb.netlify.app` Git Repo front-end:
`https://github.com/RaymondBibby/nc-news`

## Back-end

Resources for the back-end:

URL back-end API: `https://be-nc-news-rayb.herokuapp.com/api` Git Repo back-end:
`https://github.com/RaymondBibby/be-nc-news`
