const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require("fs");
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.post('/getById', (request, response) => {
    
    const  id  = request.body['productId'];
    const store  = request.body["store"];
    const db = dbService.getDbServiceInstance();

    const result = db.getDataById(id,store);
    result
    .then(data => response.json({ data : data}))
    .catch(err => console.log(err));
});

app.post('/getAllDataFromStart', (request, response) => {
    
    const limit = request.body['limiter'];
    const page = request.body['paging'];
    const store  = request.body["store"];
    const db = dbService.getDbServiceInstance();

    const result = db.getAllDataFromStart(limit,page,store);
    result
    .then(data => response.json({ data : data}))
    .catch(err => console.log(err));
});

app.post('/getAll', (request, response) => {
    const limit = request.body['limiter'];
    const page = request.body['paging'];
    const store  = request.body["store"];
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData(limit,page,store);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

app.post('/search/:name', (request, response) => {
    const { name } = request.params;
    const limit = request.body['limiter'];
    const page = request.body['paging'];
    const store  = request.body["store"];
    const db = dbService.getDbServiceInstance();
    const result = db.searchByName(name,limit,page,store);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.post('/newExchange/:name', (request, response) => {
    console.log('here');
    let { name } = request.params;
    if(name.includes(',')){
        name=parseFloat(name.replace(",", "."));
    }
    else{
        name=parseFloat(name);
    }
    let data = JSON.parse(fs.readFileSync('data.json'));
    data["exchange"]=name;
    console.log(data);
    fs.writeFileSync("data.json",  JSON.stringify(data));
    response.send("<h2>Курс обновлён</h2>");
})

app.post('/searchDataFromStart/:name', (request, response) => {
    const { name } = request.params;
    const limit = request.body['limiter'];
    const page = request.body['paging'];
    const store  = request.body["store"];
    const db = dbService.getDbServiceInstance();
    const result = db.searchByNameFromStart(name,limit,page,store);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.listen(process.env.PORT, () => console.log('app is running'));