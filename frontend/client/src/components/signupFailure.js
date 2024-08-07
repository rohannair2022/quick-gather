import React from "react";

const Failure = () => {
  return (
    <div style={{ alignItems: "center", marginTop: "20px" }}>
      <center>
        <h1>
          There is an error. Either your token expired or you have used this
          email already
        </h1>
        <br></br>
        <h1>Please try signing up again.</h1>
      </center>
    </div>
  );
};

export default Failure;
