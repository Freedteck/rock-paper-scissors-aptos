import React from "react";
import iconScissors from "../assets/icon-scissors.svg";
import iconRock from "../assets/icon-rock.svg";
import iconPaper from "../assets/icon-paper.svg";

type SelectedOptionProps = {
  selected: "rock" | "paper" | "scissors";
};

const SelectedOption: React.FC<SelectedOptionProps> = ({ selected }) => {
  const icons = {
    paper: iconPaper,
    scissors: iconScissors,
    rock: iconRock,
  };

  return (
    <div className={`${selected}`}>
      <img src={icons[selected]} alt={`${selected} icon`} />
    </div>
  );
};

export default SelectedOption;
