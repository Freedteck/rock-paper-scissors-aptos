import { aptosClient } from "@/utils/aptosClient";

export type PlayerScoreArgument = {
  accountAddress: string;
};

export const getPlayerScore = async (args: PlayerScoreArgument): Promise<number> => {
  const { accountAddress } = args;
  const Score = await aptosClient().view<[number]>({
    payload: {
      function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::get_player_score`,
      functionArguments: [accountAddress],
    },
  });
  return Score[0];
};
