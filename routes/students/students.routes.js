const app               = require('../../bin/www');
const express           = require('express');
const router            = express.Router();

const connection        = require('../connection');
const jwt               = require('jsonwebtoken');

const student           = require('./routes/routes');

console.log("here11");

router.use((req, res, next) => {
    var token = req.headers['x-access-token'];
    
	if (token) {
		jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {			
			if (err) {
				return res.status(401).send({
                    message: 'Failed to authenticate token.'
                });
			} else {
                req.decoded = decoded;
                next();
			}
		});
	} else {
		return res.status(401).send({
			message: 'No token providedsss.'
		});
	}
});

// router.use('/ceva', student);


router.use((req, res) => {
    res.status(404).send({
        message: "Resources not found."
    });
});

module.exports = router;