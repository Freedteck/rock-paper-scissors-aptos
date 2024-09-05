module rock_paper_scissors_addr::rock_paper_scissors {
    use std::signer;
    use aptos_framework::randomness;

    const ROCK: u8 = 1;
    const PAPER: u8 = 2;
    const SCISSORS: u8 = 3;

    struct Game has key {
        player: address,
        player_move: u8,   
        computer_move: u8,
        result: u8,
        is_active: bool,
        player_score: u8,   // Player score
        computer_score: u8, // Computer score
    }

    public entry fun start_game(account: &signer) acquires Game {
        let player = signer::address_of(account);

        if (!exists<Game>(player)) {
            move_to(account, Game {
                player,
                player_move: 0,
                computer_move: 0,
                result: 0,
                is_active: true,
                player_score: 0,   // Initialize scores
                computer_score: 0, // Initialize scores
            });
        } else {
            let game = borrow_global_mut<Game>(player);
            game.player_move = 0;
            game.computer_move = 0;
            game.result = 0;
            game.is_active = true;
        }
    }

    public entry fun set_player_move(account: &signer, player_move: u8) acquires Game {
        let game = borrow_global_mut<Game>(signer::address_of(account));
        game.player_move = player_move;
    }

    #[randomness]
    entry fun randomly_set_computer_move(account: &signer) acquires Game {
        randomly_set_computer_move_internal(account);
    }

    public(friend) fun randomly_set_computer_move_internal(account: &signer) acquires Game {
        let game = borrow_global_mut<Game>(signer::address_of(account));
        let random_number = randomness::u8_range(1, 4);
        game.computer_move = random_number;
    }

    public entry fun finalize_game_results(account: &signer) acquires Game {
        let game = borrow_global_mut<Game>(signer::address_of(account));
        game.result = determine_winner(game.player_move, game.computer_move);
        game.is_active = false;

        // Update scores based on the result
        if (game.result == 2) {
            game.player_score = game.player_score + 1;  // Player wins, increment player score
        } else if (game.result == 3) {
            game.computer_score = game.computer_score + 1;  // Computer wins, increment computer score
        }
    }


    fun determine_winner(player_move: u8, computer_move: u8): u8 {
        if (player_move == ROCK && computer_move == SCISSORS) {
            2 // player wins
        } else if (player_move == PAPER && computer_move == ROCK) {
            2 // player wins
        } else if (player_move == SCISSORS && computer_move == PAPER) {
            2 // player wins
        } else if (player_move == computer_move) {
            1 // draw
        } else {
            3 // computer wins
        }
    }

    #[view]
    public fun get_player_move(account_addr: address): u8 acquires Game {
        borrow_global<Game>(account_addr).player_move
    }

    #[view]
    public fun get_computer_move(account_addr: address): u8 acquires Game {
        borrow_global<Game>(account_addr).computer_move
    }

    #[view]
    public fun get_game_results(account_addr: address): u8 acquires Game {
        borrow_global<Game>(account_addr).result
    }

    // New functions to get the player's and computer's scores
    #[view]
    public fun get_player_score(account_addr: address): u8 acquires Game {
        borrow_global<Game>(account_addr).player_score
    }

    #[view]
    public fun get_computer_score(account_addr: address): u8 acquires Game {
        borrow_global<Game>(account_addr).computer_score
    }
}
