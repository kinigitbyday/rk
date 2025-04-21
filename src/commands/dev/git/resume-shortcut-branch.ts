import { Command, Flags } from '@oclif/core';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { select } from '@inquirer/prompts';
import _ from 'lodash';
import Shortcut from '../../../lib/api';

const exec = util.promisify(execNonPromise);

export default class ResumeShortcutBranch extends Command {
  static description = 'Resumes shortcut branches';

  static flags = {
    token: Flags.string({ required: false, default: process.env.SHORTCUT_API_TOKEN }),
    readyForDevState: Flags.string({ required: false, default: 'Ready For Development' }),
  };

  async run() {
    const { flags } = await this.parse(ResumeShortcutBranch);

    const tickets = await new Shortcut().listTickets(flags.token!, flags.readyForDevState )

    const branches = (
      await exec("git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short)'")
    ).stdout
      .split('\n')
      .flatMap((branch: string) => {
        if (branch.length <= 0) {
          return undefined;
        }

        const ticket = branch.split('/')[1]?.toLowerCase().replace(/sc-/g, '');

        if (_.isNil(ticket)) {
          return undefined
        }

        return { ticket, branch }
      }).filter((value: undefined | { ticket: string, branch: string}) => {
        if (_.isNil(value)) {
          return false
        }

        return !_.isNil(tickets.tickets.find(i => i.id.toString() === value.ticket))
      }).flatMap((value: undefined | { ticket: string, branch: string }) => {
        return value?.branch!
      })

    const result = await select<{ name: string }>({
      message: 'Resume?',
      choices: branches.map((branch: string) => ({
        name: branch,
        value: {
          name: branch,
        },
      })),
      loop: false,
    });

    await exec(`git checkout ${result.name}`);
  }
}
