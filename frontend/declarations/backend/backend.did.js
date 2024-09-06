export const idlFactory = ({ IDL }) => {
  const Player = IDL.Record({ 'id' : IDL.Nat, 'position' : IDL.Nat });
  const GameState = IDL.Record({
    'currentPlayer' : IDL.Nat,
    'winner' : IDL.Opt(IDL.Nat),
    'players' : IDL.Vec(Player),
  });
  const Result = IDL.Variant({ 'ok' : GameState, 'err' : IDL.Text });
  return IDL.Service({
    'checkWinCondition' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'getCurrentPlayer' : IDL.Func([], [IDL.Nat], ['query']),
    'getGameState' : IDL.Func([], [GameState], ['query']),
    'initGame' : IDL.Func([], [], []),
    'movePlayer' : IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
    'rollDice' : IDL.Func([], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
