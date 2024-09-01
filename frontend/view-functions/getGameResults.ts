import { aptosClient } from "@/utils/aptosClient";

export type GameResultsArgument = {
  accountAddress: string;
};

export const getGameResults = async (args: GameResultsArgument): Promise<number> => {
  const { accountAddress } = args;
  const results = await aptosClient().view<[number]>({
    payload: {
      function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::get_game_results`,
      functionArguments: [accountAddress],
    },
  });
  return results[0];
};
