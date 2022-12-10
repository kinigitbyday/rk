import { bottom } from '../../../../util';
import { Adventofcode2022Command } from '../adventofcode-2022-command';

export enum RPS {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

export enum Result {
  Lose = 0,
  Draw = 3,
  Win = 6,
}

export interface PlayerResult {
  choice: RPS;
  pretty: string;
  result: Result;
}

export interface GameResult {
  player1: PlayerResult;
  player2: PlayerResult;
}

export function prettyOption(rps: RPS) {
  switch (rps) {
    case RPS.Rock:
      return 'Rock';
    case RPS.Paper:
      return 'Paper';
    case RPS.Scissors:
      return 'Scissors';
    default:
      throw bottom(rps);
  }
}

export abstract class Day2Command extends Adventofcode2022Command {}
