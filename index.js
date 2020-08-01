const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const bodyparser = require('body-parser')
const fileService = require("./service/FileService")
const initService = require("./service/InitService")
const scheduleService = require("./service/ScheduleService")

const app = express()
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json())
nunjucks.configure(path.resolve(__dirname,'view'),{ autoescape: true, express: app });

initService.init();

// 定时查表，释放一分钟前的lock
scheduleService.unlock();

// 页面路由
app.get('/', fileService.index);
app.get('/create', fileService.create);
app.get('/update/:id', fileService.updateWithLock);
app.post('/save', fileService.save);

app.listen(8080);
console.log('server is running in 8080...');
