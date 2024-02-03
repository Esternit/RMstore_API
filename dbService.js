const mysql = require('mysql');
const dotenv = require('dotenv');
const fs = require("fs");
let instance = null;
dotenv.config();

const data = JSON.parse(fs.readFileSync('data.json'));


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

    async getAllData(limit,page){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM products LIMIT ?,?;";

                connection.query(query, [(page-1)*limit,limit], (err, results) => {
                    if (err) reject(new Error(err.message));
                    for(let i = 0; i < results.length; i++){
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*data["exchange"]+1900)*1.02 + 900);
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
                const query = "SELECT * FROM products WHERE id = ?;";
    
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            const secondResponse = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM sizing WHERE product_id = ?;";
                
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    for(let i = 0; i < results.length; i++){
                        results[i]["price"] =  Math.round((results[i]["price"]*data["exchange"]+1900)*1.02 + 900);
                    }
                    resolve(results);
                })
            });
            return {
                base : response,
                sizes : secondResponse
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
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*data["exchange"]+1900)*1.02 + 900);
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
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*data["exchange"]+1900)*1.02 + 900);
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
                        results[i]["start_price"] =  Math.round((results[i]["start_price"]*data["exchange"]+1900)*1.02 + 900);
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