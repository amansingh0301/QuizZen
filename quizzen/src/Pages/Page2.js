import React, { Component, useEffect, useState } from "react";
import CreateRoom from "../Components/CreateRoom";
import JoinRoom from "../Components/JoinRoom";

function Ready() {
  var teacher = false;

  if (localStorage.getItem("teacher") === "true") {
    teacher = true;
  }

  return teacher === true ? <CreateRoom /> : <JoinRoom />;
}

export default Ready;
