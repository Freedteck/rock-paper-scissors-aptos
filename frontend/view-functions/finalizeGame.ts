import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { Network } from "aptos";

export const finalizeGame = async (activeAccount: any) => {
  if (!activeAccount) {
    return;
  }

  try {
    const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET })); // Configure your network here
    const transaction = await aptos.transaction.build.simple({
      sender: activeAccount.accountAddress,
      data: {
        function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::finalize_game_results`,
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
      title: "Game finalized",
      description: `Waiting for result..., hash: ${executedTransaction.hash}`,
    });
  } catch (error) {
    console.error(error);
  }
};
