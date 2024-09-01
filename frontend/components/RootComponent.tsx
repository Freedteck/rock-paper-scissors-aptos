import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { Network } from "aptos";
import { toast } from "@/components/ui/use-toast";
import MainGame from "../pages/MainGame";
import CallbackPage from "@/pages/CallbackPage";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { aptosClient } from "@/utils/aptosClient";
import { Header } from "./Header";
import Results from "@/pages/Result";

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const RootComponent: React.FC = () => {
  const { activeAccount } = useKeylessAccounts();
  const [selected, setSelected] = useState<"rock" | "paper" | "scissors" | null>(null);
  const [newMove, setNewMove] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const navigate = useNavigate();
  const started = localStorage.getItem("started");

  const handleSelection = async (selection: "rock" | "paper" | "scissors") => {
    if (!activeAccount) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }

    const move = selection === "rock" ? ROCK : selection === "paper" ? PAPER : SCISSORS;
    setNewMove(move);

    await onPlayerClick(move);
    navigate("/results");
  };

  const onPlayerClick = async (move: number) => {
    if (move !== null) {
      toast({
        title: "In progress",
        description: "Waiting...",
      });

      try {
        const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
        const transaction = await aptos.transaction.build.simple({
          sender: activeAccount!.accountAddress,
          data: {
            function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::set_player_move`,
            functionArguments: [move],
          },
        });

        const committedTransaction = await aptos.signAndSubmitTransaction({
          signer: activeAccount!,
          transaction,
        });

        const executedTransaction = await aptosClient().waitForTransaction({
          transactionHash: committedTransaction.hash,
        });

        toast({
          title: "Success, You've selected your choice",
          description: `Waiting for Computer... hash: ${executedTransaction.hash}`,
        });

        setSelected(indexToSelection[move]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (started) {
      setIsStarted(true);
    } else {
      setIsStarted(false);
    }
  }, []);

  const indexToSelection: { [key: number]: "rock" | "paper" | "scissors" } = {
    [ROCK]: "rock",
    [PAPER]: "paper",
    [SCISSORS]: "scissors",
  };

  return (
    <div className="App">
      <Header activeAccount={activeAccount} />
      <Routes>
        <Route
          path="/"
          element={
            <MainGame
              activeAccount={activeAccount}
              handleSelection={handleSelection}
              isStarted={isStarted}
              setIsStarted={setIsStarted}
            />
          }
        />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/results"
          element={
            <Results
              activeAccount={activeAccount}
              indexToSelection={indexToSelection}
              newMove={newMove}
              selected={selected!}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default RootComponent;
