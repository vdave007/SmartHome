let path = require('path')

module.exports = (app) => {

	app.get('*', (req, res) => {
		res.json({info: "This is my backend!"})
	})

}