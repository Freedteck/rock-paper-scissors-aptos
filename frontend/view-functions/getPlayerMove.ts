import { aptosClient } from "@/utils/aptosClient";

export type PlayerMoveArgument = {
  accountAddress: string;
};

export const getPlayerMove = async (args: PlayerMoveArgument): Promise<number> => {
  const { accountAddress } = args;
  const move = await aptosClient().view<[number]>({
    payload: {
      function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::get_player_move`,
      functionArguments: [accountAddress],
    },
  });
  return move[0];
};
