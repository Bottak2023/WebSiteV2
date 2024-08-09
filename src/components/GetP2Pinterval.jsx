'use client'




import React, { useState, useEffect } from "react";
const Timer = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div
      style={{
        display: "flexbox",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "green" }}>
        GeeksforGeeks
      </h1>
      <h3>
        React Example for using setInterval method
      </h3>
      <h1>{count}</h1>
    </div>
  );
};


// import "./StopWatch.css";
// import Timer from "../Timer/Timer";


function ControlButtons(props) {
  const StartButton = (
    <button className="bg-green-500 text-center w-[150px] py-1 rounded-full"
      onClick={props.handleStart}>
      Start
    </button>
  );
  const ActiveButtons = (
    <button className="bg-red-500 text-center w-[150px] py-1 rounded-full"
      onClick={props.handleReset}>
      Stop
    </button>
  );

  return (
    <div className="Control-Buttons">
      <div>{props.active ? ActiveButtons : StartButton}</div>
    </div>
  );
}





function StopWatch() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);


  async function getAllExchage(i) {
    try {
      const responseData = await fetch('/api/getUsdtP2P')
      const jsonData = await responseData.json();
      console.log(jsonData)
    } catch (error) {
      console.error(error);
    }
  }


  React.useEffect(() => {
    let interval = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {

        setTime(time * 1 + 10000);
        getAllExchage()



      }, 10000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  return (
    <div className="stop-watch">
      {    isActive && <Timer time={time} />}
      <ControlButtons
        active={isActive}
        isPaused={isPaused}
        handleStart={handleStart}
        handlePauseResume={handlePauseResume}
        handleReset={handleReset}
      />
    </div>
  );
}

export default StopWatch;











// import React, { useState, useEffect } from "react";

