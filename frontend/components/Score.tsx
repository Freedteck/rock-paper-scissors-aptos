type ScoreProps = {
  playerScore: number;
  computerScore: number;
};
const Score: React.FC<ScoreProps> = ({ playerScore, computerScore }) => {
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
