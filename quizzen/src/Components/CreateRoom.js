import { React, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Redirect, Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      Team C {}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [roomName, setRoomName] = useState("");
  const [refferrer, setRefferrer] = useState(false);
  const onRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const createRoom = (e) => {
    window.$roomName = roomName;
    setRefferrer(true);
  };

  const logout = (e) => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("teacher");
  };
  console.log("teacher");

  return refferrer === true ? (
    <Redirect to="room" />
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="room-name"
          type="text"
          name="roomName"
          label="Room Name"
          value={roomName}
          onChange={onRoomNameChange}
          autoFocus
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={createRoom}
        >
          Create Room
        </Button>
        <Link to="/">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={logout}
          >
            Logout
          </Button>
        </Link>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
