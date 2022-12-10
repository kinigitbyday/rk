import { Adventofcode2022Command } from '../adventofcode-2022-command';
import { CliUx, Flags } from '@oclif/core';
import * as _ from 'lodash';

interface Range {
  start: number;
  end: number;
}

interface RangePair {
  range1: Range;
  range2: Range;
}

enum OverlapType {
  None,
  Partial,
  Full,
}

export default class CampCleanupOverlap extends Adventofcode2022Command {
  static description =
    'Given pairs of ranges of cleaning zones, find the number with overlapped sections: https://adventofcode.com/2022/day/4';

  static flags = {
    file: Flags.file({
      exists: true,
      required: true,
      description: 'A file containing pairs of numerical ranges. One pair per line.',
    }),
  };

  async run() {
    const { flags } = await this.parse(CampCleanupOverlap);

    CliUx.ux.action.start('Finding cleaning assignment pairs with overlap...');

    const file = await this.parseFile(flags.file!);

    const ranges = file
      .filter(line => !_.isEmpty(line))
      .map(line => line.split(','))
      .map<RangePair>(([range1String, range2String]) => {
        const range1 = range1String?.split('-');
        const range2 = range2String?.split('-');

        if (range1 === undefined || range1.length !== 2 || range2 === undefined || range2.length !== 2) {
          throw new Error(`Invalid range input: ${range1String}, ${range2String}`);
        }

        return {
          range1: {
            start: Number(range1[0]),
            end: Number(range1[1]),
          },
          range2: {
            start: Number(range2[0]),
            end: Number(range2[1]),
          },
        };
      });

    const countWithOverlap = _.countBy(ranges, range => {
      const overlap = this.overlappingRange(range.range1, range.range2);

      if (overlap === undefined) {
        return OverlapType.None;
      }

      return this.rangeEquals(overlap, range.range1) || this.rangeEquals(overlap, range.range2)
        ? OverlapType.Full
        : OverlapType.Partial;
    });

    CliUx.ux.info(`Count with no overlap: ${countWithOverlap[OverlapType.None]}`);
    CliUx.ux.info(`Count with complete overlap: ${countWithOverlap[OverlapType.Full]}`);
    CliUx.ux.info(
      `Count with any overlap: ${countWithOverlap[OverlapType.Full] + countWithOverlap[OverlapType.Partial]}`
    );
    CliUx.ux.action.stop();
  }

  overlappingRange(range1: Range, range2: Range): Range | undefined {
    const hasOverlap =
      (range1.start >= range2.start && range1.start <= range2.end) ||
      (range2.start >= range1.start && range2.start <= range1.end);

    if (!hasOverlap) {
      CliUx.ux.debug(`${JSON.stringify(range1)} does not overlap ${JSON.stringify(range2)}`);

      return undefined;
    }

    const overlap = {
      start: Math.max(range1.start, range2.start),
      end: Math.min(range1.end, range2.end),
    };

    CliUx.ux.debug(`${JSON.stringify(range1)} overlaps ${JSON.stringify(range2)}: ${JSON.stringify(overlap)}`);
    return overlap;
  }

  rangeEquals(range1: Range, range2: Range): boolean {
    return range1.start === range2.start && range1.end === range2.end;
  }
}
