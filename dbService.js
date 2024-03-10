const mysql = require('mysql');
const dotenv = require('dotenv');
const fs = require("fs");
let instance = null;
dotenv.config();

const data = JSON.parse(fs.readFileSync('data.json'));


const connection = mysql.createPool({
    host: process.env.HOSTNAMING,
    user: process.env.USERNAMING,
    password: process.env.PASSWORDNAMING,
    database: process.env.DATABASENAMING,
    port: process.env.DB_PORT
});


connection.getConnection((err) => {
    if (err){
        console.log(err);
    }
});
var ex;
connection.query(
    'SELECT * FROM exchange',
    function(err, results, fields) {
    console.log(results);
      ex = results[0]["exchange_rate"];
      console.log(ex); // results contains rows returned by server// fields contains extra meta data about results, if available
    }
);


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData(limit,page){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM products LIMIT ?,?;";
                connection.query(query, [(page-1)*limit,limit], (err, results) => {
                    if (err) reject(new Error(err.message));
                    for(let i = 0; i < results.length; i++){
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*ex+1900)*1.02 + 900);
                    }
                    resolve(results);
                })
            });

            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async getDataById(id){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM products WHERE spuId = ?;";
                console.log(id);
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    for(let i = 0; i < results.length; i++){
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*ex+1900)*1.02 + 900);
                    }
                    
                    resolve(results);
                })
            });
            const secondResponse = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM sizing WHERE product_id = ?;";
                
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    for(let i = 0; i < results.length; i++){
                        results[i]["price"] =  Math.round((results[i]["price"]*ex+1900)*1.02 + 900);
                    }
                    resolve(results);
                })
            });
            const thirdResponse = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM images WHERE product_id = ?;";
                
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return {
                base : response,
                sizes : secondResponse,
                images: thirdResponse
            };
        } catch(error){
            console.log(error);
        }

    }

    async searchByName(name,limit,page) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM products WHERE title LIKE CONCAT('%', ? , '%') LIMIT ?,?;";

                connection.query(query, [name,(page-1)*limit,limit], (err, results) => {
                    if (err) reject(new Error(err.message));
                    for(let i = 0; i < results.length; i++){
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*ex+1900)*1.02 + 900);
                    }
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchByNameFromStart(name,limit,page) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM products WHERE title LIKE CONCAT('%', ? , '%') LIMIT ?;";

                connection.query(query, [name,limit*page], (err, results) => {
                    if (err) reject(new Error(err.message));
                    for(let i = 0; i < results.length; i++){
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*ex+1900)*1.02 + 900);
                    }
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllDataFromStart(limit,page){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM products LIMIT ?;";

                connection.query(query, [limit*page], (err, results) => {
                    if (err) reject(new Error(err.message));
                    for(let i = 0; i < results.length; i++){
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*ex+1900)*1.02 + 900);
                    }
                    resolve(results);
                })
            });

            return response;

        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = DbService;