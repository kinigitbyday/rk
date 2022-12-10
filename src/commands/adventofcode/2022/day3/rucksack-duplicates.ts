import { CliUx, Flags } from '@oclif/core';
import { Adventofcode2022Command } from '../adventofcode-2022-command';
import * as _ from 'lodash';

enum ItemPriority {
  a = 1,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k,
  l,
  m,
  n,
  o,
  p,
  q,
  r,
  s,
  t,
  u,
  v,
  w,
  x,
  y,
  z,
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z,
}

interface ProcessedRucksack {
  fullRucksack: ItemPriority[];
  compartments: Array<{ itemList: ItemPriority[] }>;
  itemsInMoreThanOneCompartment: ItemPriority[];
}

export default class RucksackDuplicates extends Adventofcode2022Command {
  static description =
    'Given a list of items per rucksack, find the items that exist in both compartments and score them on priority: https://adventofcode.com/2022/day/3\n' +
    'Also finds the badge to label the rucksacks with. Rucksacks are grouped into sets of three and the badge can be identified as the only item contained in all three: https://adventofcode.com/2022/day/3#part2';

  static flags = {
    groupingsFile: Flags.file({
      exists: true,
      required: true,
      description:
        'A file containing the items in each rucksack. Each line is a rucksack, each letter is an item. Each rucksack has a variable number of compartments (but all have the same number).',
    }),
    compartmentsPerRucksack: Flags.integer({
      required: false,
      char: 'c',
      description: 'The number of compartments per rucksack. Defaults to 2.',
      default: 2,
    }),
    verbose: Flags.boolean({
      required: false,
      default: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(RucksackDuplicates);

    CliUx.ux.action.start('Finding errors in rucksack packing...');

    const rucksacks = await this.parseFile(flags.groupingsFile!);

    const asItems = rucksacks.map(r =>
      r.split('').map<ItemPriority>(c => ItemPriority[c as keyof typeof ItemPriority])
    );

    if (flags.verbose) {
      CliUx.ux.styledJSON(rucksacks);
    }

    const processed = asItems.map(r => this.processRucksack(r, flags.compartmentsPerRucksack));

    const badges = this.calculateRucksackBadges(asItems);

    if (flags.verbose) {
      CliUx.ux.styledJSON(processed);
    }

    CliUx.ux.info(`Sum of error priorities: ${_.sum(_.flatMap(processed, p => p.itemsInMoreThanOneCompartment))}`);
    CliUx.ux.info(`Sum of badges: ${_.sum(badges)}`);

    CliUx.ux.action.stop();
  }

  processRucksack(rucksack: ItemPriority[], numCompartments: number): ProcessedRucksack {
    // this isn't unicode safe but that's fine here
    const compartments = _.chunk(rucksack, rucksack.length / numCompartments);

    // if the rucksack didn't divide evenly, combine the last two elements to create the correct number of compartments
    if (compartments.length === numCompartments + 1) {
      compartments[compartments.length - 2].push(...compartments[compartments.length - 1]);
      compartments.pop();
    }

    const duplicateItems = new Set<ItemPriority>();

    _.reduce(
      compartments,
      (accum: ItemPriority[], currentCompartment) => {
        const inBoth = _.intersection(accum, currentCompartment);
        inBoth.forEach(i => duplicateItems.add(i));

        return accum.concat(currentCompartment);
      },
      []
    );

    return {
      fullRucksack: rucksack,
      compartments: compartments.map(c => ({ itemList: c })),
      itemsInMoreThanOneCompartment: Array.from(duplicateItems),
    };
  }

  calculateRucksackBadges(rucksacks: Array<ItemPriority[]>): ItemPriority[] {
    const chunked = _.chunk(rucksacks, 3);

    const badges = chunked.map(group => {
      const badge = _.reduce(
        group,
        (accum: ItemPriority[], currentRucksack) => _.intersection(accum, currentRucksack),
        // need to start with group 1 otherwise the intersection is always empty
        group[0]
      );

      if (badge.length !== 1) {
        CliUx.ux.warn(`Expected one badge in the group of three, found ${badge.length}`);
      }

      return badge[0];
    });

    return badges;
  }
}
