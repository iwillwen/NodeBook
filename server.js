var web = require('webjs'),
    urlmu = require('url'),
    mongoskin = require('mongoskin');
var Nodebook = mongoskin.db('mongodb://localhost/nodebook'),
    Notes = Nodebook.collection('Notes');
var urlRouter = {
        '/:id.html': 'index.html'
    },
    getRouter = {
        'getnote': function (req, res) {
            Notes.findOne({id: req.qs.id}, function (err, note) {
                if (err) return res.send('获取失败');
                res.send(note.content);
            });
        }
    },
    postRouter = {
        'postnote': function (req, res) {
            var url = Math.random().toString(32).substring(2),
                host = urlmu.parse(req.headers.referer).protocol + '//' + urlmu.parse(req.headers.referer).hostname + '/';
            Notes.insert({
                    content: req.data.content,
                    url: host + url + '.html',
                    id: url
                }, function (err) {
                    if (err) return res.send404();
                    res.send(host + url + '.html');
                });
        }
    };
web.run(urlRouter, 80)
    .get(getRouter)
    .post(postRouter);
