import { Adventofcode2022Command } from '../adventofcode-2022-command';
import { CliUx, Flags } from '@oclif/core';
import * as _ from 'lodash';

interface UniqueNGramLocation {
  startIndex: number;
  endIndex: number;
  fullSequence: string;
  nGram: string;
}
export default class UniqueNGram extends Adventofcode2022Command {
  static description =
    'Finds the first n-gram where all the characters are unique: https://adventofcode.com/2022/day/6';

  static flags = {
    file: Flags.file({
      exists: true,
      required: true,
      description: 'A file containing sequences of characters, each sequence on its own line',
    }),
    n: Flags.integer({
      required: false,
      default: 4,
      description: 'The size of the n-gram to detect',
    }),
  };

  async run() {
    const { flags } = await this.parse(UniqueNGram);

    CliUx.ux.action.start('Finding first unique n-grams...');

    const file = await this.parseFile(flags.file!);

    const uniqueNGrams = file.map(sequence => this.findUniqueNGram(sequence, flags.n));

    CliUx.ux.styledJSON(uniqueNGrams);

    CliUx.ux.action.stop();
  }

  findUniqueNGram(charSequence: string, nGramSize: number): UniqueNGramLocation | undefined {
    if (charSequence.length < nGramSize) {
      return undefined;
    }

    const chars = charSequence.split('');

    let nGramStartIndex = 0;
    let nGramEndIndex = nGramSize - 1;

    while (nGramEndIndex < chars.length) {
      const potentialNGram = chars.slice(nGramStartIndex, nGramEndIndex + 1);
      if (new Set(chars.slice(nGramStartIndex, nGramEndIndex + 1)).size === nGramSize) {
        return {
          startIndex: nGramStartIndex,
          endIndex: nGramEndIndex,
          fullSequence: charSequence,
          nGram: potentialNGram.join(''),
        };
      }

      nGramStartIndex++;
      nGramEndIndex++;
    }

    return undefined;
  }
}
