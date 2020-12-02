const express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyparser = require('body-parser')
var validator = require('validator');
//var mango = require('mongoose')
app = express()
app.listen(3000)
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:false}))
console.log('listening on port 3000')





MongoClient.connect("mongodb://localhost:27017/MyDb", function (err, db) {
   
    if(err){
         
        console.log(err) }
    else{
         console.log('connected to local mongo')
    }    
    var dbobj = db.db('MyDb')
    dbobj.createCollection( "Users", function(err,res){
        if(err) {console.log(err)}
        console.log('user collection created')
        db.close()
    });

});


app.get('/', (req,res)=>{

    res.render('home')

});

app.get('/register', (req,res)=>{

    res.render('Register')
});

app.post('/register', (req,res)=>{

    console.log(req.body)
    user1= req.body
    MongoClient.connect("mongodb://localhost:27017/MyDb", function (err, db) {
    
    if(err){
         
        console.log(err) }
    else{
         console.log('connected to local mongo')
    }   
    var dbobj = db.db('MyDb')
    dbobj.collection('Users').find(user1).toArray(function(err,result) {

        if (err){
            console.log(err)
            
        }
        
        if (result.length>0){
           console.log(result) 
           res.send('user allready exists try something else')
        }
        
        else{
            
            Object.assign(user1,{
                is_active : false} )
            dbobj.collection('Users').insertOne(user1,function(err,response){
                if(err){
                    console.log(err)
                }
                else{
                    console.log('data inserted')
                    res.send('inserted in database')
                }
            })

        }

    })
    

    
    

});


    
});


app.get('/login', (req,res)=>{

    res.render('login')

});


app.post('/login', (req,res)=>{

    //console.dir(req.body)
    user_credentials=req.body

    MongoClient.connect("mongodb://localhost:27017/MyDb", function (err, db) {
   
        if(err){
             
            console.log(err) }
        else{
             console.log('connected to local mongo')
        }    
        var dbobj = db.db('MyDb')
        dbobj.collection('Users').findOne(user_credentials).toArray(function(err,result) {

            if (err){
                console.log(err)
                
            }
            
            if (result.is_active === false){
               console.log(result) 
               res.send('get authenticated by admin')
            }
            else{
                console.log(result) 
                res.send('login_successful')

            }
            });
    
        
    });
    
});
app.get('/logout', (req,res)=>{

    res.send('you are logged out')

});

app.get('/getalluser', (req,res)=>{
    
    MongoClient.connect("mongodb://localhost:27017/MyDb", function (err, db) {
   
        if(err){
             
            console.log(err) }
        else{
             console.log('connected to local mongo')
        }    
    
    
    var dbobj = db.db('MyDb')
    dbobj.collection('Users').find().toArray(function(err,result) { 

        res.render('getallusers.ejs', {data : result})

    } );    
});
});


