const connection = require('./connection');

let orm =  {



    
    get_all: (cb) => {
        connection.query(
            'SELECT * FROM bachelornation',
            (err, res) => {
                if (err) {
                    throw err;
                } else {
                    cb(res);
                }
            }
        )
    }


};

module.exports = orm;