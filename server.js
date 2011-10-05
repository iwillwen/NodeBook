var web = require('webjs'),
    mongoskin = require('mongoskin');
var Nodebook = mongoskin.db('mongodb://mj3koyq04eg4g:5h7cvsuy8xr@127.0.0.1:20088/t1eoypoj0g9s4'),
    Notes = Nodebook.collection('Notes');
var urlRouter = {
        'note/:id': 'index.html'
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
            var url = Math.random().toString(32).substring(2);
            Notes.insert({
                    content: req.data.content,
                    url: 'http://nodebook.cnodejs.net/note/' + url,
                    id: url
                }, function (err) {
                    res.send('http://nodebook.cnodejs.net/note/' + url);
                });
        }
    };
web.run(urlRouter, 8080)
    .get(getRouter)
    .post(postRouter);