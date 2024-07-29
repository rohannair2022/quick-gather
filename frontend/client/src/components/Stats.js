import React, { useEffect, useState } from "react";

const Stats = (props) => {
  const [mood, setMood] = useState(0);
  const [budget, setBudget] = useState(0);
  const [travel, setTravel] = useState(0);
  const [number, setNumber] = useState(0);

  const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`blog/stats/${parseInt(props.id)}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMood(data.mood);
        setBudget(data.budget);
        setNumber(data.number);
        setTravel(data.travel);
      });
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        padding: "10px",
      }}
    >
      <p>
        <strong>Mood :</strong> {mood}
      </p>
      <p>
        <strong>Budget :</strong> {budget}
      </p>
      <p>
        <strong>Travel :</strong> {travel}
      </p>
      <p>
        <strong>Members :</strong> {number}
      </p>
    </div>
  );
};

export default Stats;
