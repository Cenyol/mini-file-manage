const fs= require("fs")
const sqlite3 = require("sqlite3")
const StandardBasicTime = 1596271531000
let database = null

//连接数据库文件
const interval = setInterval(() => {
    fs.exists("sqlite3.db", function(exists) {
        if (exists) {
            console.log("connected to db.")
            database = new sqlite3.Database("sqlite3.db", sqlite3.OPEN_READWRITE);
            clearInterval(interval);
        }
    });
}, 500);

  
exports.index = function(req, res){
  const uuid = getUuidFromCookie(req, res);

  let data = {};
  //查询
  database.all("select * from file_info", function(err, files) {
    if (err) {
        console.log("select from file_info error,", err.message);
    } else {
      data['files'] = files;
      data['uuid'] = uuid;
      res.render('index.html', data);
    }
  });
}
function getUuidFromCookie(req, res) {
  if (req.cookies.uuid === undefined) {
    let uuid = "demo-" + Math.random().toString(36).slice(-8);
    res.cookie("uuid", uuid ,{maxAge: 900000, httpOnly: true});
    return uuid;
  }
  return req.cookies.uuid;
}

exports.create = function(req, res) {
    let data = {submit: 'Create'};
    res.render('create.html', data);
  }


// 更新之前先查看是否已有其他用户占用该条记录，锁
exports.updateWithLock = function(req, res){
  const uuid = getUuidFromCookie(req, res);
  let data = {submit: 'Update'};

  // 以事务的原子性的形式来执行获取锁操作
  database.serialize(function() {
      database.run('BEGIN TRANSACTION;');

      database.all("select * from file_info where id=? limit 1", [req.params.id],function(err, files) {
      if (err) {
          console.log("select from file_info error,", err.message);
      } else if (files.length > 0 && (files[0].status === "free" || files[0].lock_keeper == uuid)) {
          let _NowBaseOnStandardTime = Date.now() - StandardBasicTime;
          database.run("update file_info set status='lock',lock_time=?,lock_keeper=? where id=? and status='free';", [_NowBaseOnStandardTime, uuid, req.params.id], function (err) {
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
}

exports.save = function(req, res) {
    let {id, name, content, submit} = req.body
    if (submit === "Update") {
      database.run("update file_info set name=?,status='free',content=?,lock_keeper=null where id=?", [name, content, id], function (err) {
        if (err) {
            console.log("update data error,", err.message);
        }
      });
    } else if (submit === "Create") {
      // 插入数据
      database.run("insert into file_info(name, status, content, lock_time) VALUES(?,'free',?,0)", [name, content], function (err) {
        if (err) {
            console.log("insert data error,", err.message);
        }
      });
    }
    
    res.redirect('http://localhost:8080');
  }