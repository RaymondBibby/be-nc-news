\c nc_news_test

SELECT articles.article_id, COUNT(articles.article_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=1;