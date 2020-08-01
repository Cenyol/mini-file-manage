let sqlite3 = require("sqlite3")
let express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
let app = express()

var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json())

nunjucks.configure(path.resolve(__dirname,'view'),{
  autoescape:true,
  express:app
});

//创建数据库文件
let database = new sqlite3.Database("sqlite3.db", function(err) {
  if (err) {
      console.log("new database error,", err.message);
      process.exit();
  }
});


app.get('/', function(req,res) {
  let data = {};

  //查询
  database.all("select * from file_info", function(err, files) {
    if (err) {
        console.log("select from file_info error,", err.message);
    } else {
      data['files'] = files
      res.render('index.html', data);
    }
  });
});


app.get('/create', function(req, res) {
  let data = {submit: 'Create'};
  res.render('create.html', data);
});
app.get('/update/:name',function(req,res){
  let data = {submit: 'Update'};
  //查询
  database.all("select * from file_info where name=? limit 1", [req.params.name],function(err, files) {
    if (err) {
        console.log("select from file_info error,", err.message);
    } else {
      if (files.length > 0) {
        data['file'] = files[0]
        res.render('update.html', data);
      }
    }
  });
});

app.post('/save', function(req, res) {
  let {name, content, submit} = req.body
  if (submit === "Update") {

  } else if (submit === "Create") {
    // 插入数据
    database.run("insert into file_info(name, status, content) VALUES(?,?,?)", [name, "free", content], function (err) {
      if (err) {
          console.log("insert data error,", err.message);
      }
    });
  }
  console.log(req.body);
  res.redirect('http://localhost:8080');
});


app.listen(8080);

console.log('server is running in 8080...');
