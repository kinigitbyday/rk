import { CliUx, Flags } from '@oclif/core';
import * as _ from 'lodash';
import { Adventofcode2022Command } from '../adventofcode-2022-command';

export default class MaxSum extends Adventofcode2022Command {
  static description =
    'Given a list of groups of numbers, calculates the top groups with the highest total and returns their sum. https://adventofcode.com/2022/day/2';

  static flags = {
    groupingsFile: Flags.file({
      exists: true,
      required: true,
      description:
        'A file containing groups of numbers. Numbers are one per line and group are separated by empty lines.',
    }),
    top: Flags.integer({
      required: false,
      default: 1,
      description: 'The number of maximum values to take and sum together.',
    }),
  };

  async run() {
    const { flags } = await this.parse(MaxSum);

    CliUx.ux.action.start(`Calculating max, top ${flags.top}`);

    const numbers = await this.parseFile(flags.groupingsFile!);

    const sums = [];

    let currentSum = 0;
    let currentGroupId = 1;
    for (const numberString of numbers) {
      const asNumber = Number.parseInt(numberString);

      if (isNaN(asNumber)) {
        sums.push(currentSum);
        currentGroupId++;
        currentSum = 0;
        continue;
      }

      currentSum += asNumber;
    }

    const topSums = _.takeRight(_.sortBy(sums), flags.top);

    CliUx.ux.info(`Sum: ${_.sum(topSums)}`);
    CliUx.ux.action.stop();
  }
}
