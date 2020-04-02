const express = require('express');

const router = express.Router();

router.route('/').get(
    async (req, res) => {
        try {
            console.log('GET /')
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Tracker online.',
            });
        }
        catch (err) {
            res.status(400).json(err);
        }
    });

module.exports = router;