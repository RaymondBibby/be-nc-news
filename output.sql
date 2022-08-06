\c nc_news_test

-- SELECT articles.article_id, * COUNT(*) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;

SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.title