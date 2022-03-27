var express = require('express');
var db = require("../repository/db1")
var bodyParser = require("body-parser");
var md5 = require('md5')
var router = express.Router();

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
router.get("/", (req, res, next) => {
  var sql = "select * from user"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});
router.get("/:id", (req, res, next) => {
  var sql = "select * from user where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});
router.post("/", (req, res, next) => {

  var errors=[]
  if (!req.body.password){
      errors.push("No password specified");
  }
  if (!req.body.email){
      errors.push("No email specified");
  }
  if (errors.length){
    
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : md5(req.body.password)
  }
  var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)';
  var params =[data.name, data.email, data.password]
  db.run(sql, params, function (err, result) {
      if (err){
        console.error(err.message);
          res.status(400).json({"error": err.message})
          return;
      }
      
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
})
module.exports = router;
