import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import M from 'materialize-css'

const useStyles = makeStyles((theme) => ({
  question: {
    // fontSize:"00%"
    marginTop: "20%",
    // marginBottom:"50%",
    marginLeft: "2rem",
    marginRight: "2rem",
  },
}));

function Questions(props) {
  const [questions, setQuestions] = useState();
  const [current, setCurrent] = useState({});
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [refferrer,setRefferrer] = useState(false);
  const classes = useStyles();
  useEffect(async () => {
    console.log('fetching from:',props.topic);
    const fetchedQuestions = await fetch(`https://quizzendeepayush.herokuapp.com/?topic=${props.topic}`)
      .then(async(res) => {
        // console.log(res.body);
        // const t = await JSON.parse(res.body);
        // console.log(t);
        return res.json()
      })
      .catch((err) => console.log(err));
      console.log('fetched questions : ',fetchedQuestions);
    if (fetchedQuestions.length && fetchedQuestions[0]) {
      setCurrent(fetchedQuestions[0]);
      setQuestions(fetchedQuestions);
    }
  }, []);

  const handleClick = () => {
    if (answer === "") return;
    if (index < Math.min(10,questions.length) && answer.toLocaleLowerCase() === questions[index].answer.toLowerCase()) {
      // alert("Your answer is correct");
      M.toast({ html: "Your answer is correct", classes: '#42a5f5 blue lighten-1' })
      setIndex(index + 1);
      setCorrect(correct + 1);
      if (index + 1 < Math.min(10,questions.length)) {
        setCurrent(questions[index + 1]);
        setAnswer("");
      } else {
        // alert(`End of test. Your Score is ${correct}/${Math.min(10,questions.length)}`);
        M.toast({ html: `End of test. Your Score is ${correct}/${Math.min(10,questions.length)}`, classes: '#81c784 green lighten-2' })
        setRefferrer(true);
      }
    } else {
      // alert(`Wrong ans, Correct answer is ${current.answer}`);
      M.toast({ html: `Wrong ans, Correct answer is ${current.answer}`, classes: '#42a5f5 blue lighten-1' })
      setIndex(index + 1);
      if (index + 1 < Math.min(10,questions.length)) {
        setCurrent(questions[index + 1]);
        setAnswer("");
      } else {
        // alert(`End of test. Your Score is ${correct}/${Math.min(10,questions.length)}`);
        M.toast({ html: `End of test. Your Score is ${correct}/${Math.min(10,questions.length)}`, classes: '#f44336 red lighten-1' })
        setRefferrer(true)
      }
    }
  };

  const onAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  // const generateOptions = (answerOptions) => {
  //     if(answerOptions){
  //         return answerOptions.map((option) => {
  //             return <button onClick={() => handleClick(option.isCorrect)}>{option.answerText}</button>
  //         })
  //     }
  // }

  if(refferrer === true){
    return <Redirect to='/ready'/>
  }

  return questions !== null && questions != undefined ? (
    <div className={classes.question}>
      <Typography variant="h3">{current.question}</Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="answer"
        label="Answer"
        type="text"
        value={answer}
        onChange={onAnswerChange}
      />
      <Button variant="contained" color="primary" onClick={handleClick}>
        <Typography>Next</Typography>
      </Button>
      {/* {generateOptions(current.answerOptions)} */}
    </div>
  ) : (
    <p></p>
  );
}
export default Questions;
