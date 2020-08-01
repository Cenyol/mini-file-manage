const fs= require("fs")
const sqlite3 = require("sqlite3")

const StandardBasicTime = 1596271531000
let database = null

//连接数据库文件
const interval = setInterval(() => {
    fs.exists("sqlite3.db", function(exists) {
        if (exists) {
            database = new sqlite3.Database("sqlite3.db", sqlite3.OPEN_READWRITE);
            clearInterval(interval);
        }
    });
}, 500);


exports.unlock = function() {
    // 定时清理60秒以上的lock
    setInterval(() => {
        let _60SecondsAgo = Date.now() - 60000 - StandardBasicTime;
    
        database.run("update file_info set status='free' where status='lock' and lock_time < ?", [_60SecondsAgo], function (err) {
        if (err) {
            console.log("unlock data error,", err.message);
        }
        });
    }, 1000);
}