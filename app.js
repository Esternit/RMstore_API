const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require("fs");
const https = require('node:https');
dotenv.config();

const dbService = require('./dbService');
const dbServiceLoggi = require('./dbserviceloggi');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.post('/getById', (request, response) => {
    
    const  id  = request.body['productId'];
    const store = request.body['store'];
    var db;
    if(store == "RM"){
        db = dbService.getDbServiceInstance();
    }
    else{
        db = dbServiceLoggi.getDbServiceInstance();
    }
    

    const result = db.getDataById(id);
    result
    .then(data => response.json({ data : data}))
    .catch(err => console.log(err));
});

app.post('/getAllDataFromStart', (request, response) => {
    
    const limit = request.body['limiter'];
    const page = request.body['paging'];
    const store = request.body['store'];
    var db;
    if(store == "RM"){
        db = dbService.getDbServiceInstance();
    }
    else{
        db = dbServiceLoggi.getDbServiceInstance();
    }

    const result = db.getAllDataFromStart(limit,page);
    result
    .then(data => response.json({ data : data}))
    .catch(err => console.log(err));
});

app.post('/getAll', (request, response) => {
    const limit = request.body['limiter'];
    const page = request.body['paging'];

    const store = request.body['store'];
    var db;
    if(store == "RM"){
        db = dbService.getDbServiceInstance();
    }
    else{
        db = dbServiceLoggi.getDbServiceInstance();
    }
    const result = db.getAllData(limit,page);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

app.post('/search/:name', (request, response) => {
    const { name } = request.params;
    const limit = request.body['limiter'];
    const page = request.body['paging'];
    const store = request.body['store'];
    var db;
    if(store == "RM"){
        db = dbService.getDbServiceInstance();
    }
    else{
        db = dbServiceLoggi.getDbServiceInstance();
    }
    const result = db.searchByName(name,limit,page);
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
    const store = request.body['store'];
    var db;
    if(store == "RM"){
        db = dbService.getDbServiceInstance();
    }
    else{
        db = dbServiceLoggi.getDbServiceInstance();
    }
    const result = db.searchByNameFromStart(name,limit,page);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.post('/sendMessage',(request, response) => {
    console.log(request.body);
    var admin_chat;
    var bot_id;
    var admin_link;


    if(request.body["store"] == "RM"){
        admin_chat = -1002050701256;
        bot_id = "6921027076:AAFQJTnEZQAyq7hOfpnXpwZouAFe5NNdu9o";
        admin_link = "https://t.me/HKpozion";
    }
    else{
        admin_chat = -1001845802930;
        bot_id = "7128439871:AAHw0aghCksYQjPKQHcE9coc74e1vDi54yI";
        admin_link = "https://t.me/workisthebest";
    }
    var text;
    var admin_text;
    if(request.body["user_name"].length == 0){
        text = "Наименование: " + request.body["title"] +"%0AРазмер/цена: "+ request.body["size_name"] + "EU / " + request.body["pricing"] + "руб." + "Заказ создан, но так как у Вас отсутствует ник, мы не можем с вами связаться🙁 %0AПожалуйста, напишите менеджеру по ссылке ниже: %0A" + admin_link;
        admin_text = "✅ Имя пользователя: " +request.body["user_first"]+ "✅%0A Ссылка на пользователя: отсутсвует -> пользователь напишет сам" + "%0AНаименование: " + request.body["title"] +"%0AРазмер/цена: "+ request.body["size_name"] + "EU / " + request.body["pricing"] + "руб.%0AАртикул: " +request.body["article"]+ "%0Ahttps://m.dewu.com/router/product/ProductDetail?spuId="+request.body["id"];
    }
    else{
        text = "Наименование: " + request.body["title"] +"%0AРазмер/цена: "+ request.body["size_name"] + "EU / " + request.body["pricing"] + "руб.";
        admin_text = "✅ Имя пользователя: " +request.body["user_first"]+ "✅%0A Ссылка на пользователя: @" +request.body["user_name"]+ "%0AНаименование: " + request.body["title"] +"%0AРазмер/цена: "+ request.body["size_name"] + "EU / " + request.body["pricing"] + "руб.%0AАртикул: " +request.body["article"]+ "%0Ahttps://m.dewu.com/router/product/ProductDetail?spuId="+request.body["id"];
    }
    
    let url = "https://api.telegram.org/bot" + bot_id+ "/sendPhoto?chat_id=" + request.body["user_id"].toString() + "&photo=" + request.body["img"] + "&caption=" + text;
    let url_admin = "https://api.telegram.org/bot" + bot_id+ "/sendPhoto?chat_id=" + admin_chat.toString() + "&photo=" + request.body["img"] + "&caption=" + admin_text;
    console.log(url_admin);
    console.log(url);
    https
    .get(url, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
    })
    .on('error', (e) => {
        console.error(e);
    });
    https
    .get(url_admin, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
    })
    .on('error', (e) => {
        console.error(e);
    });
})

app.listen(process.env.PORT, () => console.log('app is running'));

module.exports = app;