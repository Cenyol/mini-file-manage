var sqlite3 = require("sqlite3");

//创建数据库文件
var database = new sqlite3.Database("sqlite3.db", function (err) {
    if (err) {
        console.log("new database error,", err.message);
        process.exit();
    } else {
        console.log("create database success");
    }
});

//创建表
database.run("create table if not exists file_info(name TEXT, status TEXT, content TEXT, update_time INTEGER)", function (err) {
    if (err) {
        console.log("create database error,", err.message);
        process.exit();
    } else {
        console.log("create table success");

        //插入数据
        database.run("insert into file_info(name, status, content, update_time) VALUES(?,?,?,?)", ["readme.txt", "free", "this is a introduction.", 0], function (err) {
            if (err) {
                console.log("insert data error,", err.message);
            }
        });
        database.run("insert into file_info(name, status, content, update_time) VALUES(?,?,?,?)", ["writeme.txt", "lock", "this is a introduction too.", 0], function (err) {
            if (err) {
                console.log("insert data error,", err.message);
            }
        });
        database.run("insert into file_info(name, status, content, update_time) VALUES(?,?,?,?)", ["execme.txt", "free", "this is a instructment.", 0], function (err) {
            if (err) {
                console.log("insert data error,", err.message);
            }
        });
    }
});


//查询
database.all("select * from file_info", function (err, rows) {
    if (err) {
        console.log("select from file_info error,", err.message);
    } else {
        console.log(rows);
    }
});