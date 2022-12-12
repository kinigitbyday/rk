import { Adventofcode2022Command } from '../adventofcode-2022-command';
import { CliUx, Flags } from '@oclif/core';
import * as _ from 'lodash';

type BoxStacks = string[][];

interface CraneInstruction {
  take: number;
  fromIndex: number;
  toIndex: number;
}

export default class BoxStacking extends Adventofcode2022Command {
  static description =
    'Runs a set of crane restacking instructions on an initial stacked box state: https://adventofcode.com/2022/day/5';

  static flags = {
    file: Flags.file({
      exists: true,
      required: true,
      description: 'A file containing the initial stacks and the crane instructions',
    }),
    boxesMoveOneAtATime: Flags.boolean({
      required: false,
      default: true,
      allowNo: true,
    }),
  };

  async run() {
    const { flags } = await this.parse(BoxStacking);

    CliUx.ux.action.start('Running crane restacking instructions...');

    const file = await this.parseFile(flags.file!);

    const startOfInstructions = _.findIndex(file, line => _.isEmpty(line.trim()));

    // the line before the empty line between instructions is just the stack labels, which can be inferred
    const boxState = file.slice(0, startOfInstructions - 1);

    // the instructions start after the empty line
    const instructionState = file.slice(startOfInstructions + 1);

    const boxStacks = this.parseBoxStacks(boxState);
    const instructions = this.parseCraneInstructions(instructionState);

    CliUx.ux.debug(JSON.stringify(boxStacks));
    CliUx.ux.debug(JSON.stringify(instructions));

    const resultingBoxStacks = this.runCrane(boxStacks, instructions, flags.boxesMoveOneAtATime);

    CliUx.ux.debug(JSON.stringify(resultingBoxStacks));

    CliUx.ux.info(`Resulting top boxes: ${resultingBoxStacks.map(stack => stack[stack.length - 1] ?? '').join('')}`);

    CliUx.ux.action.stop();
  }

  parseBoxStacks(boxState: string[]): BoxStacks {
    const rows = boxState.reverse().map(i => {
      const split = i.split('');

      const byStack = _.chunk(split, 4);
      return byStack.map(chunk => chunk.find(c => /[A-Z]/.test(c)));
    });

    return _.zip(...rows).map(stack => stack.filter(box => box !== undefined).map(box => box!));
  }

  parseCraneInstructions(instructions: string[]): CraneInstruction[] {
    return instructions
      .map(i => {
        const split = i.split(' ');

        if (split.length !== 6) {
          return undefined;
        }

        // Adjust the indexes down 1 to account for 0-based indexing (stack labels are 1-based)
        return {
          take: Number(split[1]),
          fromIndex: Number(split[3]) - 1,
          toIndex: Number(split[5]) - 1,
        };
      })
      .filter(i => i !== undefined)
      .map(i => i!);
  }

  runCrane(boxStacks: BoxStacks, instructions: CraneInstruction[], boxesMoveOneAtATime: boolean): BoxStacks {
    return _.reduce(
      instructions,
      (stacks: BoxStacks, instruction: CraneInstruction) => {
        const clone = _.clone(stacks);

        const movingBoxes = clone[instruction.fromIndex].splice(instruction.take * -1, instruction.take);

        const orderAddedToNewStack = boxesMoveOneAtATime ? movingBoxes.reverse() : movingBoxes;

        clone[instruction.toIndex].push(...orderAddedToNewStack);

        return clone;
      },
      boxStacks
    );
  }
}
