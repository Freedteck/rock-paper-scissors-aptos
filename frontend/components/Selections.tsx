import React from "react";
import iconScissors from "../assets/icon-scissors.svg";
import iconRock from "../assets/icon-rock.svg";
import iconPaper from "../assets/icon-paper.svg";

type SelectionsProps = {
  onSelect: (selection: "rock" | "paper" | "scissors") => void;
};

const Selections: React.FC<SelectionsProps> = ({ onSelect }) => {
  return (
    <div className="selections">
      <div className="paper-scissors">
        <div className="paper" onClick={() => onSelect("paper")}>
          <img src={iconPaper} alt="paper icon" />
        </div>
        <div className="scissors" onClick={() => onSelect("scissors")}>
          <img src={iconScissors} alt="scissors icon" />
        </div>
      </div>
      <div className="rock" onClick={() => onSelect("rock")}>
        <img src={iconRock} alt="rock icon" />
      </div>
    </div>
  );
};

export default Selections;
