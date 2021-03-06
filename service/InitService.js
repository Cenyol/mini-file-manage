const fs= require("fs");
const sqlite3 = require("sqlite3")
const dbName = "sqlite3.db"

exports.init = function() {
    fs.exists(dbName, function(exists) {
        // 防止多次重复执行初始化操作
        if (!exists) {
            initDB();
        }
    });
}



function initDB() {
    //创建数据库文件
    var database = new sqlite3.Database(dbName, function (err) {
        if (err) {
            console.log("new database error,", err.message);
            process.exit();
        } else {
            console.log("create database success");

            //创建表
            database.run("create table if not exists file_info(id integer primary key autoincrement, name varchar(128), status text, content text, lock_time integer, lock_keeper varchar(16))", function (err) {
                if (err) {
                    console.log("create database error,", err.message);
                    process.exit();
                } else {
                    console.log("create table success");

                    //插入数据
                    database.run("insert into file_info(name, status, content, lock_time) VALUES(?,?,?,?)", ["readme.txt", "free", "this is a introduction.", 0], function (err) {
                        if (err) {
                            console.log("insert data error,", err.message);
                        }
                    });
                    database.run("insert into file_info(name, status, content, lock_time) VALUES(?,?,?,?)", ["writeme.txt", "lock", "this is a introduction too.", 0], function (err) {
                        if (err) {
                            console.log("insert data error,", err.message);
                        }
                    });
                    database.run("insert into file_info(name, status, content, lock_time) VALUES(?,?,?,?)", ["execme.txt", "free", "this is a instructment.", 0], function (err) {
                        if (err) {
                            console.log("insert data error,", err.message);
                        }
                    });
                }
            });
        }
    });
}