import { CliUx, Command, Flags } from '@oclif/core';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as _ from 'lodash';
import { bottom } from '../../../../util';
import { Day2Command, GameResult, PlayerResult, prettyOption, Result, RPS } from './day2';

type EncodedRPS = 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z';

export default class RockPaperScissors extends Day2Command {
  static description =
    'Given a list of pairs of head to head rock paper scissors, calculate the score for both players. https://adventofcode.com/2022/day/2';

  static flags = {
    groupingsFile: Flags.file({
      exists: true,
      required: true,
      description:
        'A file containing pairs of encoded rock, paper, scissors games. Each game is a line. Two encoded letters representing player selections per line',
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
    ['X', RPS.Rock],
    ['Y', RPS.Paper],
    ['Z', RPS.Scissors],
  ]);

  async run() {
    const { flags } = await this.parse(RockPaperScissors);

    CliUx.ux.action.start(`Calculating player scores`);

    const matches = (await fs.readFile(flags.groupingsFile!)).toString().split(os.EOL);

    const matchResults = matches.map<GameResult | undefined>(encodedMatch => {
      const [player1Encoded, player2Encoded] = encodedMatch.split(' ');

      if (player1Encoded === undefined || player2Encoded === undefined) {
        return undefined;
      }

      const [player1Option, player2Option] = [this.decryptOption(player1Encoded), this.decryptOption(player2Encoded)];

      if (player1Option === undefined || player2Option === undefined) {
        throw new Error(`Invalid encoded match: ${encodedMatch}`);
      }

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

  isEncodedRPS(option: string): option is EncodedRPS {
    switch (option) {
      case 'A':
      case 'B':
      case 'C':
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
