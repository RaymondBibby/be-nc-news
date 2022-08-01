# Northcoders News API

## 1. Neccesary set-up to be able to clone and use this repository locally.

### Envioronmental variable files

In order to correctly set the PGDATABASE depending on which environment and
hence script you choose to run (test/ development), you first must set-up some
environmental variables locally by creating two new .env files (which will have
been/ will continue to be gitignored whenever this repo is pushed/ pulled).

This will allow the correct PG database to be established:

.env.development //file created in the root of be-nc-news with the following
script:

PGDATABASE=nc_news

.env.test // file created in the root of be-nc-news with the following script:

PGDATABASE=nc_news_test
