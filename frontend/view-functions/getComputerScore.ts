import { aptosClient } from "@/utils/aptosClient";

export type ComputerScoreArgument = {
  accountAddress: string;
};

export const getComputerScore = async (args: ComputerScoreArgument): Promise<number> => {
  const { accountAddress } = args;
  const Score = await aptosClient().view<[number]>({
    payload: {
      function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::get_computer_score`,
      functionArguments: [accountAddress],
    },
  });
  return Score[0];
};
