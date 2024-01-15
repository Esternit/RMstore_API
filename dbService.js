const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOSTNAMING,
    user: process.env.USERNAMING,
    password: process.env.PASSWORDNAMING,
    database: process.env.DATABASENAMING,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err){
        console.log(err);
    }
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM products;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;