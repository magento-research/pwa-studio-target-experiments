const fsRoutes = require('./simple-fs-routes');
const markdownPages = require('./markdown-pages');

module.exports = targets => fsRoutes(markdownPages(targets));
