import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GameState {
  'currentPlayer' : bigint,
  'winner' : [] | [bigint],
  'players' : Array<Player>,
}
export interface Player { 'id' : bigint, 'position' : bigint }
export type Result = { 'ok' : GameState } |
  { 'err' : string };
export interface _SERVICE {
  'checkWinCondition' : ActorMethod<[], [] | [bigint]>,
  'getCurrentPlayer' : ActorMethod<[], bigint>,
  'getGameState' : ActorMethod<[], GameState>,
  'initGame' : ActorMethod<[], undefined>,
  'movePlayer' : ActorMethod<[bigint, bigint], Result>,
  'rollDice' : ActorMethod<[], bigint>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
