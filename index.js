let sqlite3 = require("sqlite3")
let express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
let app = express()
const StandardBasicTime = 1596271531000;

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

// 定时清理60秒以上的lock
setInterval(() => {
  let _60SecondsAgo = Date.now() - 60000 - StandardBasicTime;

  database.run("update file_info set status='free' where status='lock' and lock_time < ?", [_60SecondsAgo], function (err) {
    if (err) {
      console.log("unlock data error,", err.message);
    }
  });
}, 1000);


app.get('/', function(req,res) {
  let data = {};

  //查询
  database.all("select * from file_info", function(err, files) {
    if (err) {
        console.log("select from file_info error,", err.message);
    } else {
      data['files'] = files;
      res.render('index.html', data);
    }
  });
});


app.get('/create', function(req, res) {
  let data = {submit: 'Create'};
  res.render('create.html', data);
});
app.get('/update/:id', function(req,res){
  let data = {submit: 'Update'};
  //查询
  database.serialize(function() {
    database.run('BEGIN TRANSACTION;');
    
    database.all("select * from file_info where id=? limit 1", [req.params.id],function(err, files) {
      if (err) {
          console.log("select from file_info error,", err.message);
      } else if (files.length > 0 && files[0].status === "free") {
          let _NowBaseOnStandardTime = Date.now() - StandardBasicTime;
          database.run("update file_info set status=?,lock_time=? where id=?", ["lock", _NowBaseOnStandardTime, req.params.id], function (err) {
            if (err) {
                console.log("lock data error,", err.message);
            } else {
              data['file'] = files[0]
              res.render('update.html', data);
            }
          });
        } else {
          res.redirect('http://localhost:8080');
        }
    });

    database.run('COMMIT TRANSACTION;');
  });
});

app.post('/save', function(req, res) {
  let {id, name, content, submit} = req.body
  if (submit === "Update") {
    database.run("update file_info set name=?,status=?,content=? where id=?", [name, "free", content, id], function (err) {
      if (err) {
          console.log("update data error,", err.message);
      }
    });
  } else if (submit === "Create") {
    // 插入数据
    database.run("insert into file_info(name, status, content, lock_time) VALUES(?,?,?,?)", [name, "free", content,0], function (err) {
      if (err) {
          console.log("insert data error,", err.message);
      }
    });
  }
  
  res.redirect('http://localhost:8080');
});


app.listen(8080);

console.log('server is running in 8080...');
