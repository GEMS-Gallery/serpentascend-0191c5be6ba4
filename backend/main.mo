import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor SnakesAndLadders {
  type Player = {
    id: Nat;
    position: Nat;
  };

  type GameState = {
    players: [Player];
    currentPlayer: Nat;
    winner: ?Nat;
  };

  stable var gameState: GameState = {
    players = [
      { id = 0; position = 1 },
      { id = 1; position = 1 }
    ];
    currentPlayer = 0;
    winner = null;
  };

  stable let boardSize: Nat = 100;
  stable let snakesAndLadders: [(Nat, Nat)] = [
    (16, 6), (47, 26), (49, 11), (56, 53), (62, 19),
    (64, 60), (87, 24), (93, 73), (95, 75), (98, 78),
    (4, 14), (9, 31), (20, 38), (28, 84), (40, 59),
    (51, 67), (63, 81), (71, 91)
  ];

  public func initGame(): async GameState {
    gameState := {
      players = [
        { id = 0; position = 1 },
        { id = 1; position = 1 }
      ];
      currentPlayer = 0;
      winner = null;
    };
    gameState
  };

  public func rollDice(): async Nat {
    let seed = await Random.blob();
    let roll = Random.rangeFrom(6, seed) + 1;
    roll
  };

  public func movePlayer(playerId: Nat, steps: Nat): async Result.Result<GameState, Text> {
    if (gameState.winner != null) {
      return #err("Game has already ended");
    };

    if (playerId != gameState.currentPlayer) {
      return #err("Not your turn");
    };

    var updatedPlayers = Array.thaw<Player>(gameState.players);
    var currentPosition = updatedPlayers[playerId].position;
    currentPosition += steps;

    if (currentPosition > boardSize) {
      currentPosition := boardSize;
    };

    for ((start, end) in snakesAndLadders.vals()) {
      if (currentPosition == start) {
        currentPosition := end;
      };
    };

    updatedPlayers[playerId] := {
      id = playerId;
      position = currentPosition;
    };

    let nextPlayer = if (playerId == 0) 1 else 0;
    let winner = if (currentPosition == boardSize) ?playerId else null;

    gameState := {
      players = Array.freeze(updatedPlayers);
      currentPlayer = nextPlayer;
      winner = winner;
    };

    #ok(gameState)
  };

  public query func getCurrentPlayer(): async Nat {
    gameState.currentPlayer
  };

  public query func getGameState(): async GameState {
    gameState
  };

  public query func checkWinCondition(): async ?Nat {
    gameState.winner
  };
}