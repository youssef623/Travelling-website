var express = require('express');
const { request } = require('http');
const { Session } = require('inspector');
var path = require('path');
//const sessions = require('express-session');
var session = require('express-session');

//var alert= require('alert');
const { log } = require('console');
var cookieparser= require('cookie-parser');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
secret: "thisismysecrctekey",
saveUninitialized:false,
cookie: { maxAge: oneDay },
resave: false,

}));
const PORT = process.env.PORT || 3030;

const url='mongodb://127.0.0.1:27017';
var MongoClient=require('mongodb').MongoClient;

app.get('/', function(req, res){
  res.render('login',{invalid:""})
  
  
});

app.get('/login', function(req, res){
  res.render('login',{invalid:""})
 
});

app.post('/', function(req, res){
  //req.session.user=null
  if(req.body.username == "admin" && req.body.password == "admin")
  {
    req.session.authorized=true
    req.session.user= req.body.username
    console.log(req.session.user);
    res.render('home')
  }
  else
  {
    console.log("username or password is incorrect")
    res.render('login',{invalid:"username or password is incorrect"})
    
  }
  
  /*MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    collection.findOne({"username":req.body.username, "password":req.body.password}, function(err,result){

      if(err) console.log(err)
      
      else if(result==null){
        console.log("username or password is incorrect")
        res.render('login',{invalid:"username or password is incorrect"})
        

      }
      else if(result.username==req.body.username && result.password==req.body.password){
        req.session.authorized=true
        req.session.user= result.username
        console.log(req.session.user);
        res.render('home')
       
        
        
        
      }
      else{
        console.log("username or password is incorrect")
        res.render('login',{invalid:""})
        
      }
    });
  });
  */
});


app.post('/login', function(req, res){
  if(req.body.username == "admin" && req.body.password == "admin")
  {
    req.session.authorized=true
    req.session.user= req.body.username
    console.log(req.session.user);
    res.render('home')
  }
  else
  {
    console.log("username or password is incorrect")
    res.render('login',{invalid:"username or password is incorrect"})
  }
  /*MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    collection.findOne({"username":req.body.username, "password":req.body.password}, function(err,result){
      if(err) console.log(err)

      else if(result==null){
        console.log("username or password is incorrect")
        res.render('login',{invalid:"username or password is incorrect"})
      }
      else if(result.username==req.body.username && result.password==req.body.password){
        req.session.authorized=true
        req.session.user= result.username
        console.log(req.session.user);
        res.render('home')
      }
      else{
        console.log("username or password is incorrect")
        res.render('login',{invalid:""})
      }
    });
  });*/
  
});



app.get('/registration', function(req,res){
  res.render('registration',{taken:""})
});

app.get('/home', function(req,res){
  //res.render('home')
  res.redirect('/login')
});

app.post('/registration', function(req, res){
  MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    collection.findOne({"username":req.body.username}, function(err,result){

      if(err) console.log(err)

      else if(req.body.username=="" || req.body.password==""){
        console.log("username or password cannot be empty")
        res.render('registration',{taken:"username or password cannot be empty"})
        
      }
      else if(result==null){
        collection.insertOne({username:req.body.username, password:req.body.password,want_to_go:[]})
        
        //res.render('login',{invalid:"registration was successfull,use your credentials to log in"})
        res.redirect('/login')
      }
      else if(result.username==req.body.username){
        console.log("already taken")
        
        res.render('registration',{taken:"username is already taken"})
      }
    });
    
  });
  
});

app.get('/islands', function(req,res){
  
  if(req.session.authorized){
    console.log(req.session.user)
    res.render('islands')
   
  }
  else {
    res.redirect('/login')
  }
});

app.get('/bali', function(req,res){
  if(req.session.authorized){
    
    res.render('bali',{add:""})
  }
  else{
    res.redirect('/login')
  }
});


app.get('/santorini', function(req,res){
  if(req.session.authorized){
    res.render('santorini',{add:""})
  }
  else{
    res.redirect('/login')
  }
});

app.get('/cities', function(req,res){
  if(req.session.authorized){
    console.log(req.session.user)
    res.render('cities')
  }
  else{
    res.redirect('/login')
  }
});

app.get('/hiking', function(req,res){
  if(req.session.authorized){
    console.log(req.session.user)
    res.render('hiking',{add:""})
  }
  else{
    res.redirect('/login')
  }
});

app.get('/inca', function(req,res){
  if(req.session.authorized){
    res.render('inca',{add:""})
  }
  else{
    res.redirect('/login')
  }
});

app.get('/rome', function(req,res){
  if(req.session.authorized){
    res.render('rome',{add:""})
  }
  else{
    res.redirect('/login')
  }
});

app.get('/paris', function(req,res){
  if(req.session.authorized){
    res.render('paris',{add:""})
  }
  else{
    res.redirect('/login')
  }
});

app.get('/annapurna', function(req,res){
  if(req.session.authorized){
    res.render('annapurna',{add:""})
  }
  else{
    res.redirect('/login')
  }
});


app.post('/bali', function(req,res){
  MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    var flag=true
    collection.findOne({username:req.session.user,want_to_go:{$elemMatch:{$regex:'bali'}}}, function(err,result){
      if(err){
        console.log(err)
      }
      else if(result==null){
        collection.updateOne({username:req.session.user},{$push:{want_to_go:"bali"}})
        res.render('bali',{add:"bali is added successfully"})
      }
      else{
        res.render('bali',{add:"bali is already in your want-to-go list"})
      }
    })
    
  })
});


app.post('/paris', function(req,res){
  MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    var flag=true
    collection.findOne({username:req.session.user,want_to_go:{$elemMatch:{$regex:'paris'}}}, function(err,result){
      if(err){
        console.log(err)
      }
      else if(result==null){
        collection.updateOne({username:req.session.user},{$push:{want_to_go:"paris"}})
        res.render('paris',{add:"paris is added successfully"})
      }
      else{
        res.render('paris',{add:"paris is already in your want-to-go list"})
      }
    })
    
  })
});

app.post('/annapurna', function(req,res){
  MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    var flag=true
    collection.findOne({username:req.session.user,want_to_go:{$elemMatch:{$regex:'annapurna'}}}, function(err,result){
      if(err){
        console.log(err)
      }
      else if(result==null){
        collection.updateOne({username:req.session.user},{$push:{want_to_go:"annapurna"}})
        res.render('annapurna',{add:"annapurna is added successfully"})
      }
      else{
        res.render('annapurna',{add:"annapurna is already in your want-to-go list"})
      }
    })
    
  })
});


app.post('/inca', function(req,res){
  MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    var flag=true
    collection.findOne({username:req.session.user,want_to_go:{$elemMatch:{$regex:'inca'}}}, function(err,result){
      if(err){
        console.log(err)
      }
      else if(result==null){
        collection.updateOne({username:req.session.user},{$push:{want_to_go:"inca"}})
        res.render('inca',{add:"inca is added successfully"})
      }
      else{
        res.render('inca',{add:"inca is already in your want-to-go list"})
      }
    })
    
  })
});


app.post('/rome', function(req,res){
  MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    var flag=true
    collection.findOne({username:req.session.user,want_to_go:{$elemMatch:{$regex:'rome'}}}, function(err,result){
      if(err){
        console.log(err)
      }
      else if(result==null){
        collection.updateOne({username:req.session.user},{$push:{want_to_go:"rome"}})
        res.render('rome',{add:"rome is added successfully"})
      }
      else{
        res.render('rome',{add:"rome is already in your want-to-go list"})
      }
    })
    
  })
});


app.post('/santorini', function(req,res){
  MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    var flag=true
    collection.findOne({username:req.session.user,want_to_go:{$elemMatch:{$regex:'santorini'}}}, function(err,result){
      if(err){
        console.log(err)
      }
      else if(result==null){
        collection.updateOne({username:req.session.user},{$push:{want_to_go:"santorini"}})
        res.render('santorini',{add:"santorini is added successfully"})
      }
      else{
        res.render('santorini',{add:"santorini is already in your want-to-go list"})
      }
    })
    
  })
});

app.post('/search', function(req,res)
{
  const destinations = ["annapurna", "bali", "santorini","Inca Trail to Machu Picchu","Paris","Rome"];
  const searchresults = [];
  var x = req.body.Search;
  let count = 0;
  for (let i = 0; i < destinations.length; i++) 
  {
    if(destinations[i].toLowerCase().includes(x.toLowerCase()))
    {
      if(i==3)
      {
        searchresults[count] = "inca";
        count++;
      }
      else
      {
        searchresults[count] = destinations[i].toLowerCase();
        count++;
      }
    }
  }
  res.render('searchresults',{searchresults:searchresults});
});


app.get('/wanttogo', function(req,res){
  MongoClient.connect(url, function(err,client){
    if (err) throw err;
    var db =client.db('myDB');
    const collection =db.collection("myCollection");
    collection.findOne({username:req.session.user},function(err,result){
      if(err){
        console.log(err)
      }
      else {
        if(req.session.authorized){
          //console.log(req.session.user)
          res.render('wanttogo',{places:result.want_to_go})
          
        }
        else{
          res.redirect('/login')
        }
      }
      })
    })
  });

  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });





