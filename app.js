const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.post('/getById', (request, response) => {
    
    const  id  = request.body['productId'];
    const db = dbService.getDbServiceInstance();

    const result = db.getDataById(id);
    result
    .then(data => response.json({ data : data}))
    .catch(err => console.log(err));
});

app.post('/getAll', (request, response) => {
    const limit = request.body['limiter'];
    const page = request.body['paging'];

    const db = dbService.getDbServiceInstance();
    const result = db.getAllData(limit,page);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

app.post('/search/:name', (request, response) => {
    const { name } = request.params;
    const limit = request.body['limiter'];
    const page = request.body['paging'];
    const db = dbService.getDbServiceInstance();
    console.log(limit,page);
    const result = db.searchByName(name,limit,page);
    console.log(result);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.listen(process.env.PORT, () => console.log('app is running'));