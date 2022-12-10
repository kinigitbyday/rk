import { CliUx, Flags } from '@oclif/core';
import * as _ from 'lodash';
import { Day2Command, GameResult, PlayerResult, prettyOption, Result, RPS } from './day2';
import { bottom } from '../../../../util';

type EncodedRPS = 'A' | 'B' | 'C';
type EncodedResult = 'X' | 'Y' | 'Z';

export default class RockPaperScissors2 extends Day2Command {
  static description =
    "Given a list of pairs of one player's rock, paper, scissors choices and the desired result, calculate the scores for each players. https://adventofcode.com/2022/day/2#part2";

  static flags = {
    groupingsFile: Flags.file({
      exists: true,
      required: true,
      description:
        'A file containing pairs of encoded rock, paper, scissors games. Each game is a line. One encoded letter representing player selection and one encoded letter representing the desired result per line',
    }),
    verbose: Flags.boolean({
      required: false,
      default: false,
    }),
  };

  private rpsMap: Map<EncodedRPS, RPS> = new Map([
    ['A', RPS.Rock],
    ['B', RPS.Paper],
    ['C', RPS.Scissors],
  ]);

  private resultMap: Map<EncodedResult, Result> = new Map([
    ['X', Result.Lose],
    ['Y', Result.Draw],
    ['Z', Result.Win],
  ]);

  async run() {
    const { flags } = await this.parse(RockPaperScissors2);

    CliUx.ux.action.start(`Calculating player scores`);

    const matches = await this.parseFile(flags.groupingsFile!);

    const matchResults = matches.map<GameResult | undefined>(encodedMatch => {
      const [player1Encoded, player2ResultEncoded] = encodedMatch.split(' ');

      if (player1Encoded === undefined || player2ResultEncoded === undefined) {
        return undefined;
      }

      const [player1Option, player2Result] = [
        this.decryptOption(player1Encoded),
        this.decryptResult(player2ResultEncoded),
      ];

      if (player1Option === undefined || player2Result === undefined) {
        throw new Error(`Invalid encoded match: ${encodedMatch}`);
      }

      const player2Option = this.otherPlayerOptionToAchieveResult(player1Option, player2Result);

      const result = this.gameResult({ player1: player1Option, player2: player2Option });

      return {
        player1: {
          choice: player1Option,
          pretty: prettyOption(player1Option),
          result: result.player1,
        },
        player2: {
          choice: player2Option,
          pretty: prettyOption(player2Option),
          result: result.player2,
        },
      };
    });

    if (flags.verbose) {
      CliUx.ux.styledJSON(matchResults);
    }

    CliUx.ux.info(`Player1: ${_.sum(matchResults.map(r => (r ? this.scoreMatch(r.player1) : 0)))}`);
    CliUx.ux.info(`Player2: ${_.sum(matchResults.map(r => (r ? this.scoreMatch(r.player2) : 0)))}`);
    CliUx.ux.action.stop();
  }

  decryptOption(option: string): RPS | undefined {
    if (!this.isEncodedRPS(option)) {
      return undefined;
    }

    if (!this.rpsMap.has(option)) {
      return undefined;
    }

    return this.rpsMap.get(option);
  }

  decryptResult(option: string): Result | undefined {
    if (!this.isEncodedResult(option)) {
      return undefined;
    }

    if (!this.resultMap.has(option)) {
      return undefined;
    }

    return this.resultMap.get(option);
  }

  isEncodedRPS(option: string): option is EncodedRPS {
    switch (option) {
      case 'A':
      case 'B':
      case 'C':
        return true;
      default:
        return false;
    }
  }

  isEncodedResult(option: string): option is EncodedResult {
    switch (option) {
      case 'X':
      case 'Y':
      case 'Z':
        return true;
      default:
        return false;
    }
  }

  scoreMatch(result: PlayerResult): number {
    return result.choice + result.result;
  }

  otherPlayerOptionToAchieveResult(playerOption: RPS, desiredResult: Result): RPS {
    if (desiredResult === Result.Draw) {
      return playerOption;
    }

    switch (playerOption) {
      case RPS.Rock:
        return desiredResult === Result.Lose ? RPS.Scissors : RPS.Paper;
      case RPS.Paper:
        return desiredResult === Result.Lose ? RPS.Rock : RPS.Scissors;
      case RPS.Scissors:
        return desiredResult === Result.Lose ? RPS.Paper : RPS.Rock;
      default:
        return bottom(playerOption);
    }
  }

  gameResult({ player1, player2 }: { player1: RPS; player2: RPS }): { player1: Result; player2: Result } {
    if (player1 === player2) {
      return {
        player1: Result.Draw,
        player2: Result.Draw,
      };
    }

    if ((player1 + 1) % 3 === player2 - 1) {
      return {
        player1: Result.Win,
        player2: Result.Lose,
      };
    }

    return {
      player1: Result.Lose,
      player2: Result.Win,
    };
  }
}
