var web = require('webjs');

var getRouter = {
	'name\/(.*)': function (req, res) {
		res.send('Hey! Mr. ' + decodeURI(req.path[0]) + '! Nice to meet you.');
	}
};
web.run({}, 45678)
	.get(getRouter);