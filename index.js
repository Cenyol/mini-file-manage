let sqlite3 = require("sqlite3")
let express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
let app = express()

nunjucks.configure(path.resolve(__dirname,'view'),{
  autoescape:true,
  express:app
})

//创建数据库文件
let database = new sqlite3.Database("sqlite3.db", function (err) {
  if (err) {
      console.log("new database error,", err.message);
      process.exit();
  }
});


app.get('/',function(req,res){
  var data = { name: 'cenyol' };

  //查询
  database.all("select * from file_info", function (err, files) {
    if (err) {
        console.log("select from file_info error,", err.message);
    } else {
      data['files'] = files
      res.render('user.html', data);
    }
  });
})

app.listen(8080)

console.log('server is running in 8080...')
