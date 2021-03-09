const orm = require('../config/orm');

let bachelor_scraper = {
    get_all: (cb) => {
        orm.get_all(res => {
            cb(res);
        });
    }
};

module.exports = bachelor_scraper;