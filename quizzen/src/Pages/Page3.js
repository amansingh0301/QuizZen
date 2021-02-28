import React, { Component, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import Message from "../Components/Message";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";

const url = "ws://localhost:4000";
var connection;

const useStyles = makeStyles(() => ({
  logoutbtn: {
    marginTop: "1rem",
  },
  copyright: {
    marginBottom: "1rem",
  },
}));

function Copyright() {
  const classes = useStyles();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      Team C {}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Room(props) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [refferrer, setRefferrer] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    connection = new WebSocket(url);
    connection.onopen = function () {
      console.log("connection open");
      if (localStorage.getItem("teacher") === "true") {
        connection.send(
          JSON.stringify({
            type: "create",
            user: window.$user,
            room: window.$roomName,
          })
        );
      } else {
        connection.send(
          JSON.stringify({
            type: "join",
            user: window.$user,
            room: window.$roomName,
          })
        );
      }
    };

    connection.onmessage = function (messa) {
      const data = JSON.parse(messa.data);
      if (data.type !== "error") {
        var member;
        if (data.user === window.$user) {
          member = "You";
        } else {
          member = data.user;
        }
        const newMessage = {
          type: data.type,
          user: member,
          msg: data.msg,
        };

        setMessages((oldMessages) => [...oldMessages, newMessage]);
        const elem = document.getElementById("textChat");
        elem.scrollTop = elem.scrollHeight;
      } else {
        setRefferrer(true);
      }
    };

    connection.onclose = function () {
      // Try to reconnect in 3 seconds
      setTimeout(function () {
        start(url);
      }, 3000);
    };
  }, []);

  function start(url) {
    connection = new WebSocket(url);
    connection.onclose = function () {
      // Try to reconnect in 3 seconds
      setTimeout(function () {
        start(url);
      }, 3000);
    };
  }

  const onMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = (e) => {
    if (message === "") {
      return;
    }
    connection.send(
      JSON.stringify({
        type: "message",
        user: window.$user,
        msg: message,
        room: window.$roomName,
      })
    );
    setMessage("");
  };

  const startTest = (e) => {
    connection.send(
      JSON.stringify({
        type: "test",
        user: window.$user,
        msg: message,
        room: window.$roomName,
      })
    );
  };

  function logout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("teacher");
  }
  return refferrer === true ? (
    <Redirect to="/ready" />
  ) : (
    <div>
      <Grid container>
        <Grid item xs={11}></Grid>
        <Grid item xs={1}>
          <Link to="/">
            <Button
              id="logout-btn"
              variant="contained"
              onClick={logout}
              className={classes.logoutbtn}
            >
              Logout
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Message messages={messages} />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <TextField
            id="msg"
            variant="filled"
            type="text"
            name="message"
            label="Message"
            value={message}
            required
            autoFocus
            onChange={onMessageChange}
          />
          <Button color="primary" variant="contained" onClick={sendMessage}>
            <Typography>Send</Typography>
          </Button>

          {localStorage.getItem("teacher") === "true" ? (
            <Button color="primary" variant="contained" onClick={startTest}>
              <Typography>Create Test</Typography>
            </Button>
          ) : (
            <br />
          )}
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      <Copyright className={classes.copyright} />
    </div>
  );
}

export default Room;
