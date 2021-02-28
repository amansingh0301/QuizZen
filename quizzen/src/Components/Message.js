import React, { Component, useState } from "react";
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  scrollMenu: {
    overflowY: "auto",
    height: "500px",
    width: "auto",
    border: "2px solid black",
    margin: "1rem",
    borderRadius: "1rem",
  },
  otherUserChat: {
    display: "inline-block",
    textAlign: "left",
    backgroundColor: "rgb(115, 177, 115)",
    fontSize: "150%",
    borderRadius: "0.3rem",
  },
  currentUserChat: {
    display: "inline-block",
    textAlign: "right",
    backgroundColor: "rgb(206, 201, 201)",
    fontSize: "150%",
    borderRadius: "0.3rem",
  },
  test: {
    display: "inline-block",
    textAlign: "center",
    backgroundColor: "rgb(156, 75, 79)",
    fontSize: "150%",
    borderRadius: "0.3rem",
  },
}));

function Message(props) {
  console.log("Activity : ", props);
  const classes = useStyles();
  const [refferrer, setRefferrer] = useState(false);

  const startTest = () => {
    setRefferrer(true);
  };

  function generateListItem(msg) {
    if (msg.type !== "test") {
      console.log(msg.user, window.$user);
      if (msg.user !== "You")
        return (
          <ListItem>
            {" "}
            <div className={classes.otherUserChat}>
              {msg.user} : {msg.msg}
            </div>
          </ListItem>
        );
      else
        return (
          <ListItem className={classes.currentUserChat}>{msg.msg}</ListItem>
        );
    } else
      return (
        <ListItem className={classes.test}>
          {msg.msg}
          {"  "}
          <Button variant="contained" onClick={startTest}>
            <Typography>Start test</Typography>
          </Button>
        </ListItem>
      );
  }

  return refferrer === true ? (
    <Redirect to="/test" />
  ) : (
    <div>
      <List className={classes.scrollMenu} id="textChat">
        {props.messages &&
          props.messages.map((message) => {
            return generateListItem(message);
          })}
      </List>
    </div>
  );
}
export default Message;
