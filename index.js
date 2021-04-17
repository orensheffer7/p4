const express=require('express');
const mongoose= require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const url = require('url');
const User=require('./app/models/user');
const Data=require('./app/models/data');
const {auth} =require('./app/auth/auth');
const db=require('./app/config/config').get(process.env.NODE_ENV);


const app=express();

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());

// database connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise=global.Promise;
mongoose.connect(db.DATABASE,{ useNewUrlParser: true,useUnifiedTopology:true },function(err){
    if(err) console.log(err);
    console.log("mongoDB is connected");
});


// adding new user (sign-up route)
app.post('/api/register',function(req,res){
    const newuser=new User(req.body);

    newuser.save((err,doc)=>{
        if(err) {console.log(err);
            return res.status(400).json({ success : false});}
        res.status(200).json({
            succes:true,
            user : doc
        });
    });
});


// login user
app.post('/api/login', function(req,res){
    let token=req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            message:"You are already logged in"
        });
    
        else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
        
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).json({
                        isAuth : true,
                        id : user._id
                        ,email : user.email
                    });
                });    
            });
          });
        }
    });
});


// Logout user
 app.get('/api/logout',auth,function(req,res){
        req.user.deleteToken(req.token,(err,user)=>{
            if(err) return res.status(400).send(err);
            res.sendStatus(200);
        });

    }); 


app.post('/api/adddata',function(req,res){
    const newData=new Data(req.body);
    
    newData.save((err,doc)=>{
        if(err) {console.log(err);
            return res.status(400).json({ success : false});}
        res.status(200).json({
            succes:true,
            data : doc
        });
    });
    });


// Get data
app.get('/api/data',function(req,res){
    const queryObject = url.parse(req.url,true).query;

    Data.find({"procedure":queryObject["procedure"]}, function(err,doc){
        if(err) return res.status(400).send(err);
        res.status(200).json(doc);
    })

}); 


app.get('/',function(req,res){
    res.status(200).send(`Hello World`);
});


// listening port
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`App on ${PORT}`);
});