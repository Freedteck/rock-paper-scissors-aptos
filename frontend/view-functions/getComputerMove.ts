import { aptosClient } from "@/utils/aptosClient";

export type ComputerMoveArgument = {
  accountAddress: string;
};

export const getComputerMove = async (args: ComputerMoveArgument): Promise<number> => {
  const { accountAddress } = args;
  const move = await aptosClient().view<[number]>({
    payload: {
      function: `${import.meta.env.VITE_MODULE_ADDRESS}::rock_paper_scissors::get_computer_move`,
      functionArguments: [accountAddress],
    },
  });
  return move[0];
};
