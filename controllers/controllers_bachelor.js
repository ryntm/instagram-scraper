// const router = require('../../contractor-report-sql/controllers/data-controller-gig-data-admin');
const models = require('../models/bachelor_scraper');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    models.get_all(data => {
        res.json(data);
    });
});



module.exports = router;