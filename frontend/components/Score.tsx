import { useEffect, useState } from "react";

const Score = () => {
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const storedPlayerScore = parseInt(localStorage.getItem("playerScore") || "0");
  const storedComputerScore = parseInt(localStorage.getItem("computerScore") || "0");

  useEffect(() => {
    if (storedPlayerScore || storedComputerScore) {
      setPlayerScore(storedPlayerScore);
      setComputerScore(storedComputerScore);
    }
  }, [storedComputerScore, storedPlayerScore]);

  return (
    <div className="score">
      <p>Score</p>
      <div>
        <div className="player">
          You
          <h2>{playerScore}</h2>
        </div>
        :
        <div className="player">
          Computer
          <h2>{computerScore}</h2>
        </div>
      </div>
    </div>
  );
};

export default Score;
