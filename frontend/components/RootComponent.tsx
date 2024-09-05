import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { AptosClient, HexString, Network } from "aptos";
import { toast } from "@/components/ui/use-toast";
import MainGame from "../pages/MainGame";
import CallbackPage from "@/pages/CallbackPage";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { aptosClient } from "@/utils/aptosClient";
import { Header } from "./Header";
import Results from "@/pages/Result";
import { getPlayerScore } from "@/view-functions/getPlayerScore";
import { getComputerScore } from "@/view-functions/getComputerScore";

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const RootComponent: React.FC = () => {
  const { activeAccount } = useKeylessAccounts();
  const [selected, setSelected] = useState<"rock" | "paper" | "scissors" | null>(null);
  const [newMove, setNewMove] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const navigate = useNavigate();
  const started = localStorage.getItem("started");

  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

  const fetchScores = async () => {
    if (activeAccount && isStarted) {
      try {
        const playerScore = await getPlayerScore({ accountAddress: activeAccount.accountAddress.toString() });
        const computerScore = await getComputerScore({ accountAddress: activeAccount.accountAddress.toString() });
        setPlayerScore(playerScore);
        setComputerScore(computerScore);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

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

  // Player Move
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
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

  // Account Balance
  const fetchBalance = async () => {
    if (activeAccount) {
      try {
        const resources: any[] = await client.getAccountResources(
          HexString.ensure(activeAccount.accountAddress.toString()),
        );
        const accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
        if (accountResource) {
          const balanceValue = (accountResource.data as any).coin.value;
          setBalance(balanceValue ? parseInt(balanceValue) / 100000000 : 0); // Convert from Octas to APT
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  useEffect(() => {
    localStorage.removeItem("started");
  }, []);

  useEffect(() => {
    if (activeAccount) {
      fetchBalance();
    }
  }, [activeAccount]);

  useEffect(() => {
    if (activeAccount) {
      fetchScores();
    }
  }, [activeAccount]);

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
      <Header activeAccount={activeAccount} balance={balance} />
      <Routes>
        <Route
          path="/"
          element={
            <MainGame
              activeAccount={activeAccount}
              handleSelection={handleSelection}
              isStarted={isStarted}
              setIsStarted={setIsStarted}
              playerScore={playerScore}
              computerScore={computerScore}
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
              playerScore={playerScore}
              computerScore={computerScore}
              fetchScores={fetchScores}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default RootComponent;
