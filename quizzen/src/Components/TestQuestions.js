import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  question: {
    // fontSize:"00%"
    marginTop: "20%",
    marginLeft: "2rem",
    marginRight: "2rem",
  },
}));

function Questions() {
  const [questions, setQuestions] = useState();
  const [current, setCurrent] = useState({});
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const classes = useStyles();
  useEffect(async () => {
    const fetchedQuestions = await fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .catch((err) => alert(err));
    if (fetchedQuestions && fetchedQuestions.ques) {
      setCurrent(fetchedQuestions.ques[0]);
      setQuestions(fetchedQuestions.ques);
    }
  }, []);

  const handleClick = () => {
    if (answer === "") return;
    if (answer.toLocaleLowerCase() === questions[index].answer.toLowerCase()) {
      alert("Your answer is correct");
      setIndex(index + 1);
      setCorrect(correct + 1);
      if (index + 1 < questions.length) {
        setCurrent(questions[index + 1]);
        setAnswer("");
      } else alert(`End of test. Your Score is ${correct}/${questions.length}`);
    } else {
      alert("Wrong ans");
      setIndex(index + 1);
      if (index + 1 < questions.length) {
        setCurrent(questions[index + 1]);
        setAnswer("");
      } else {
        alert(`End of test. Your Score is ${correct}/${questions.length}`);
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

  return questions !== null && questions != undefined ? (
    <div className={classes.question}>
      <Typography variant="h3">{current.questionText}</Typography>
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
