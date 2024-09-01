import React from "react";
import Selections from "../components/Selections";
import Score from "../components/Score";
import { StartGame } from "../components/StartGame";
import Rules from "@/components/Rules";

type MainGameProps = {
  activeAccount: any;
  isStarted: boolean;
  handleSelection: (selection: "rock" | "paper" | "scissors") => void;
  setIsStarted: (isStarted: boolean) => void;
};

const MainGame: React.FC<MainGameProps> = ({ activeAccount, isStarted, handleSelection, setIsStarted }) => {
  const [showRules, setShowRules] = React.useState(false);
  return (
    <main className="main-game">
      {isStarted ? (
        <>
          <Score />
          <Selections onSelect={handleSelection} />
          <button className="rules-button" onClick={() => setShowRules(true)}>
            RULES
          </button>
        </>
      ) : (
        <StartGame activeAccount={activeAccount} setIsStarted={setIsStarted} isOver={false} />
      )}
      {showRules && <Rules setShowRules={setShowRules} />}
    </main>
  );
};

export default MainGame;
