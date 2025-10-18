import { useState } from "react";

const RenderAnecdote = ({ index, anecdotes, votes }) => {
  return (
    <>
      <div>{anecdotes[index]}</div>
      <div>has {votes[index]} votes</div>
    </>
  );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const n = anecdotes.length;
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Uint8Array(n));
  const [mostVoted, setMostVoted] = useState(0);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const getIndexWithMaxVotes = () => {
    let max = 0;
    for (let i = 0; i < n; i++) {
      if (votes[i] > votes[max]) {
        max = i;
      }
    }
    console.log("index with max votes ", max);
    return max;
  };

  return (
    <>
      <h1>Anecdote of the day</h1>
      <RenderAnecdote index={selected} anecdotes={anecdotes} votes={votes} />
      <Button
        onClick={() =>
          setVotes(() => {
            const copy = [...votes];
            copy[selected] += 1;
            if (votes[mostVoted] < copy[selected]) setMostVoted(selected);
            return copy;
          })
        }
        text="vote"
      />
      <Button
        onClick={() => setSelected(getRandomInt(n))}
        text="next anecdote"
      />
      <h1>Anecdote with most votes</h1>
      <RenderAnecdote index={mostVoted} anecdotes={anecdotes} votes={votes} />
    </>
  );
};

export default App;
