const express = require("express");
const path = require("path");
const Socket = require("websocket").server;
const http = require("http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./serverUtils/user-schema");
const cors = require("cors");
require("dotenv").config();
const dbUri = process.env.MONGO_ATLAS_URI;
// const publicPath = path.join(__dirname +".."+ "public");
const port = process.env.PORT || 4000;
//==========================================================

var rooms = [];

var app = express();
// app.use(express.static(publicPath));

mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    server.listen(port, () => console.log(`Server running on ${port}`))
  )
  .catch((err) => console.log(err));

// =============MIDDLEWARES============================
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.raw());
app.use(express.text());
app.use(cors());

let server = http.createServer(app);

// ==========ROUTES=============================================

app.get("/check", authenticateToken, (req, res) => {
  console.log('checking..')
  res.send(true);
});

app.post("/login", async (req, res) => {
  User.findOne({ username: req.body.username })
    .then(async (user) => {
      if (!user) {
        res.status(400).json({
          msg: "No user found",
          login: false,
        });
      }
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          const foundUser = { username: user.username };
          const accessToken = jwt.sign(foundUser, process.env.TOKEN_SECRET);
          res.json({
            accessToken: accessToken,
            login: true,
            teacher:user.teacher
          });
        } else {
          res.status(400).json({
            msg: "wrong password",
            login: false,
          });
        }
      } catch {
        res.status(500).json({
          msg: "Some error Occured",
          login: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        msg: err,
        login: false,
      });
    });
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      teacher:req.body.teacher
    });
    user
      .save()
      .then(() => {
        res.json({
          Registered: user,
        });
      })
      .catch((err) =>
        res.json({
          msg: err,
        })
      );
  } catch {
    res.json({
      msg: "Cannot register Please try again later",
    });
  }
});

app.get("/questions", (req,res)=> {
  res.json({ 
      ques:[
          {
              questionText: 'What is the capital of France?',
              answer:"Paris"
          },
          {
              questionText: 'Who is CEO of Tesla?',
              answer:"Elon Musk"
          },
          {
              questionText: 'The iPhone was created by which company?',
              answer:"Apple"
          },
          {
              questionText: 'How many Harry Potter books are there?',
              answer:"7"
          },
    ]
   });
})


if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static(path.join(__dirname,'quizzen/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'quizzen/build','index.html'));
  });
}

//===================AUTH============================

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.send(false);
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.send(false);
    }
    req.user = user;
    next();
  });
}

//===================WEBSOCKET============================

const webSocket = new Socket({ httpServer: server });
var rooms = [];
webSocket.on("request", async (req) => {
  const connection = req.accept();
  console.log('new connection');
  connection.on("message", (message) => {
    const data = JSON.parse(message.utf8Data);
    const roomIndex = findRoom(data,connection);
    console.log('rooms : ');
    console.log(rooms);
    console.log(data)
    console.log('roomIndex : ',roomIndex);
    if(roomIndex===-1){
      connection.send(JSON.stringify({
        type:'error'
      }))
      return;
    }
    switch (data.type) {
      case 'create':
        connection.send(JSON.stringify({
          type:'message',
          msg:'room created',
          user:data.user
        }))
        break;
      case 'join':
        rooms[roomIndex].users.forEach((user) => {
          user.conn.send(JSON.stringify({
            type:'message',
            user:data.user,
            msg:'room joined'
          }))
        })
        // connection.send(JSON.stringify({
        //   type:'message',
        //   msg:'room joined',
        //   user:data.user
        // }))
        break;

      case 'message':
        console.log('received message : ',data.msg)
        rooms[roomIndex].users.forEach((user) => {
          user.conn.send(JSON.stringify({
            type:'message',
            user:data.user,
            msg:data.msg
          }))
        })
        break;
      
      case 'test':
        console.log('received message : ',data.msg)
        rooms[roomIndex].users.forEach((user) => {
          user.conn.send(JSON.stringify({
            type:'test',
            user:data.user,
            msg:data.msg
          }))
        })
        break;
    }
  })

  connection.on('close',(reason,desc) => {
    for(var i=0;i<rooms.length;i++){
      var found=-1;
      for(var j=0;j<rooms[i].users;j++){
        if(rooms[i].users[j].conn === connection){
          found = i;
          rooms[i].users.splice(j,1);
          break;
        }
      }
      if(found!==-1){
        rooms[found].users.forEach((user) => {
          user.conn.send(JSON.stringify({
            type:'message',
            user:"Bot",
            msg:'Left'
          }))
        })
      }
      // rooms.splice(rooms.indexOf(rooms[found]),1);
    }
  })
})

const findRoom = (data,connection) => {
  const roomName = data.room;
  if(rooms.length === 0 && data.type==='create'){
    rooms.push({
      room:roomName,
      users :[
        {
          user:data.user,
          conn:connection
        }
      ]
    })
    return 0;
  }else if(rooms.length > 0 && data.type === 'join'){
    for(var i=0;i<rooms.length;i++){
      if(rooms[i].room == roomName){
        rooms[i].users.push({
          user:data.user,
          conn:connection
        })
        return i;
      }
    }
  }else if(rooms.length > 0 && data.type === 'message'){
    for(var i=0;i<rooms.length;i++){
      if(rooms[i].room === roomName){
        return i;
      }
    }
  }else if(rooms.length > 0 && data.type === 'test'){
    for(var i=0;i<rooms.length;i++){
      if(rooms[i].room === roomName){
        return i;
      }
    }
  }
  return -1;
}