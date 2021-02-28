import React, { Component } from 'react';
import Questions from '../Components/TestQuestions'

function Test(props){
    console.log(props.location.state);
    console.log(props.location.state);
    return(<Questions topic={props.location.state.topic}/>)
}

export default Test;