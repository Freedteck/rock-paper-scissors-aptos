import React, { useState } from "react";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { Button } from "@/components/ui/button";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { Network } from "aptos";
import { useNavigate } from "react-router-dom";

type StartGameProps = {
  activeAccount: any;
  isOver: boolean;
  setIsStarted: (isStarted: boolean) => void;
};

export const StartGame: React.FC<StartGameProps> = ({ activeAccount, setIsStarted, isOver }) => {
  const [text, setText] = useState<string | null>();
  const navigate = useNavigate();

  const onClickButton = async () => {
    if (!activeAccount) {
      setText("Please Connect to your Account");
      return;
    }
    toast({
      title: "Starting Game",
      description: "Waiting...",
    });
    try {
      const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

      const transaction = await aptos.transaction.build.simple({
        sender: activeAccount.accountAddress,
        data: {
          function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::start_game`,
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
      console.log("executedTransaction", executedTransaction);
      localStorage.removeItem("started");
      localStorage.setItem("started", "true");
      setIsStarted(true);
      navigate("/");
      toast({
        title: "Game started",
        description: `You can now make your move, hash: ${executedTransaction.hash}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="start">
      <p>{text}</p>
      <Button onClick={onClickButton}>{isOver ? "Play Again" : "Start Game"}</Button>
    </div>
  );
};
