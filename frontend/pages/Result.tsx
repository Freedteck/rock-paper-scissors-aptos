import React, { useEffect, useState } from "react";
import Score from "@/components/Score";
import SelectedOption from "@/components/SelectedOption";
import { StartGame } from "@/components/StartGame";
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { finalizeGame } from "@/view-functions/finalizeGame";
import { getComputerMove } from "@/view-functions/getComputerMove";
import { getGameResults } from "@/view-functions/getGameResults";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { Network } from "aptos";
import Waiting from "@/components/Waiting";
import Rules from "@/components/Rules";

type ResultsProps = {
  selected: "rock" | "paper" | "scissors";
  newMove: number | null;
  activeAccount: any;
  indexToSelection: { [key: number]: string };
};

const Results: React.FC<ResultsProps> = ({ selected, newMove, activeAccount, indexToSelection }) => {
  const [computerMove, setComputerMove] = useState<number | null>(null);
  const [gameResults, setGameResults] = useState<number | null>(null);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (newMove) {
      makeComputerMove();
    }
  }, [newMove]);

  const makeComputerMove = async () => {
    if (activeAccount) {
      try {
        const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
        const transaction = await aptos.transaction.build.simple({
          sender: activeAccount.accountAddress,
          data: {
            function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::randomly_set_computer_move`,
            functionArguments: [],
          },
        });

        const committedTransaction = await aptos.signAndSubmitTransaction({
          signer: activeAccount,
          transaction,
        });

        const executedTransaction = await aptosClient().waitForTransaction({
          transactionHash: committedTransaction.hash,
        });

        toast({
          title: "Computer move set",
          description: `hash: ${executedTransaction.hash}`,
        });

        fetchComputerMove();
        await finalizeGame(activeAccount);
        fetchGameResults();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchComputerMove = async () => {
    if (activeAccount) {
      try {
        const content = await getComputerMove({ accountAddress: activeAccount.accountAddress.toString() });
        setComputerMove(content);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

  const fetchGameResults = async () => {
    if (activeAccount) {
      try {
        const content = await getGameResults({ accountAddress: activeAccount.accountAddress.toString() });
        setGameResults(content);

        // Update the score in localStorage based on the game results
        if (content === 2) {
          // Player wins
          const playerScore = parseInt(localStorage.getItem("playerScore") || "0");
          localStorage.setItem("playerScore", (playerScore + 1).toString());
          return;
        } else if (content === 3) {
          // Computer wins
          const computerScore = parseInt(localStorage.getItem("computerScore") || "0");
          localStorage.setItem("computerScore", (computerScore + 1).toString());
          return;
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

  const housePick = computerMove;

  return (
    <main>
      {showRules && <Rules setShowRules={setShowRules} />}
      <Score />
      <div className="selection-result">
        <div className="picked">
          <p>You picked</p>
          <SelectedOption selected={selected} />
        </div>
        <div className="result">
          {housePick && (
            <p>
              {gameResults === 2
                ? "You Win"
                : gameResults === 1
                  ? "Draw"
                  : gameResults === 3
                    ? "Computer wins"
                    : "Waiting..."}
            </p>
          )}
          <StartGame activeAccount={activeAccount} isOver={true} setIsStarted={() => true} />
        </div>
        <div className="picked">
          <p>Computer picked</p>
          {!housePick && <Waiting />}
          {housePick && <SelectedOption selected={indexToSelection[housePick!] as "rock" | "paper" | "scissors"} />}
        </div>
      </div>
      <button className="rules-button" onClick={() => setShowRules(true)}>
        RULES
      </button>
    </main>
  );
};

export default Results;
