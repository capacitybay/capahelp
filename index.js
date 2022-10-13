require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const TimeAgo = require('javascript-time-ago')

// English.
const en = require('javascript-time-ago/locale/en');

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');


const app = express();
const port = 5200;

app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.use(session({
  secret: 'our secret to greatness',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


//TODO

//Schema
mongoose.connect("mongodb://0.0.0.0:27017/messageDB")
mongoose.connection
.once("open", ()=> console.log("Connected"))
.on("error", (err)=> console.log(err));


const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  acct_type: String
});

const conversationSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description:{
    type: String
  },
  attachment: {
    type: Array,
  },
  chat_type: {
    type: String
  }
}, { timestamps: true })
const ticketSchema = new mongoose.Schema({
    ticket_type: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    customer_id: {
      type: String,
    },
    assignee_id: {
      type: String,
    },
    dept_id: {
      type: String,
    },
    urgency: {
      type: String,
    },
    priority: {
      type: String,
    },
    ticket_status: {
      type: String,
    },
    attachment: {
      type: Array,
    },
    conversation: [conversationSchema]
  },
  { timestamps: true }
);


userSchema.plugin(passportLocalMongoose);
//Create User Model
const Users = mongoose.model("Users", userSchema);
const Conversation = mongoose.model('chat', conversationSchema);
const Tickets = mongoose.model("message", ticketSchema);

//Create Passport Strategy 
passport.use(Users.createStrategy());

//Serialize
passport.serializeUser(Users.serializeUser());
//Deserialize
passport.deserializeUser(Users.deserializeUser());




app.get("/", (req, res)=>{

  // Tickets.find({}, (err, result)=>{
  //   console.log(result);
  //   for(let i = 0; i < result.length; i++){
  //     // console.log(result[i])
  //     if(result[i].customer_id == 134){
        
  //       res.render("ticket", {time: timeAgo.format(result[i].createdAt), status:result[i].status, conversation: result[i].conversation, description: result[i].description, title: result[i].title})
  //     }
  //   }
  // })
  res.redirect("/login")
})
app.post("/", (req, res)=>{
  // console.log(req.body);
  // const newChat = new Conversation({
  //   description: req.body.editor,
  //   chat_type: "user"
  // })
  // const newTicket = new Tickets({
  //   ticket_type: "Work",
  //   title: "I need a Website",
  //   description: "Hello Team, I want you to create a website for Mai Tea",
  //   customer_id: 134,
  //   urgency: "normal",
  //   priority: "normal",
  //   ticket_status: "In Progress",
  //   conversation: newChat
  // })
  // newTicket.save((err)=>{
  //   if(err){
  //     console.log(err);
  //   }
  // })
  res.render("login")
})

app.get("/login", (req, res)=>{
  res.render("login")
})

app.post("/login", (req, res)=>{
  const newUser = new Users({
    username: req.body.username,
    password: req.body.password
  })

  req.login(newUser, (err)=>{
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/ticket");
      })
    }
  })
})

app.get("/ticket", (req, res)=>{
  if(req.isAuthenticated()){
    fullname = req.user.first_name + " " + req.user.last_name;
    Tickets.find({}, (err, result)=>{
      // console.log(result);
      for(let i = 0; i < result.length; i++){
        // console.log(result[i].id)
          
          res.render("ticket", {time: timeAgo.format(result[i].createdAt), status:result[i].status, conversation: result[i].conversation, description: result[i].description, title: result[i].title, ticketId: result[i].id, fullname: fullname, loggedOn: req.user.acct_type})
      }
    })
  }else{
    res.redirect("/login");
  }
})
app.get("/register", (req, res)=>{
  res.render("register")
})
app.post("/register", (req, res)=>{
  Users.register({first_name: req.body.fname, last_name: req.body.lname, username: req.body.email, acct_type: req.body.type }, req.body.password, (err, result)=>{
    if(err){
      console.log(err);
      res.render("/");
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/home");
      })
    }
  })
})
app.post("/chat", (req, res)=>{
  user_fname = req.user.first_name;
  user_lname = req.user.last_name;
  ticketId = req.body.ticketId;
  console.log(ticketId);
  if(req.isAuthenticated()){
    if(req.user.acct_type == "user"){
      const newChat = new Conversation({
        name: `${user_fname} ${user_lname}`,
        description: req.body.editor,
        chat_type: "user"
      })
      Tickets.findOne({_id: ticketId}, (err, result)=>{
        result.conversation.push(newChat)
        result.save();
        res.redirect('/ticket')
      })
    }else if(req.user.acct_type == "agent"){
      const newChat = new Conversation({
        name: `${user_fname} ${user_lname}`,
        description: req.body.editor,
        chat_type: "agent"
      })
      Tickets.findOne({_id: ticketId}, (err, result)=>{
        result.conversation.push(newChat)
        result.save();
        res.redirect('/ticket')
      })
    }
    
  }else{
    res.redirect("/login")
  }
})

app.listen(port, ()=> console.log(`Server running at port ${port}`))