import { Command, Flags } from '@oclif/core';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { select } from '@inquirer/prompts';
import _ from 'lodash';
import Shortcut from '../../../lib/api';
import { StorySearchResult } from '@shortcut/client';

const exec = util.promisify(execNonPromise);

export default class ResumeShortcutBranch extends Command {
  static description = 'Resumes shortcut branches';

  static flags = {
    token: Flags.string({ required: false, default: process.env.SHORTCUT_API_TOKEN }),
    readyForDevState: Flags.string({ required: false, default: 'Ready For Development' }),
  };



  async run() {
    const { flags } = await this.parse(ResumeShortcutBranch);

    const shortcut = await new Shortcut(flags.token!).listTickets( flags.readyForDevState )

    const branches = await this.getBranches(shortcut.tickets)

    const byTicketId = _.groupBy(branches, x => x.ticket.id.toString())

    const result = await select<{ name: string }>({
      message: 'Resume?',
      choices: Object.keys(byTicketId).map(id => ({
        name: byTicketId[id][0].ticket.name,
        value: {
          name: byTicketId[id][0].ticket.id.toString()
        },
      })),
      loop: false,
    });

    const branch = await select<{ name: string }>({
      message: 'Which branch?',
      choices: byTicketId[result.name].map(branch => ({
        name: branch.value.branch,
        value: {
          name: branch.value.branch
        },
      })),
      loop: false,
    });

    await exec(`git checkout ${branch.name}`);
  }

  private ticket(name: string): string {
    return name.split('/')[1]?.toLowerCase().replace(/sc-/g, '');
  }

  private async getBranches(tickets: StorySearchResult[]): Promise<Array<{ ticket: StorySearchResult, value: { ticket: string, branch: string }}>> {
    const branches = (
      await exec("git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short)'")
    ).stdout
      .split('\n')
      .flatMap((branch: string) => {
        if (branch.length <= 0) {
          return undefined;
        }

        const ticket = this.ticket(branch)

        if (_.isNil(ticket)) {
          return undefined
        }

        return { ticket, branch }
      })

      const pairings: Array<undefined | { ticket: StorySearchResult, value: { ticket: string, branch: string }}> = branches.map((value: undefined | { ticket: string, branch: string}) => {
        if (_.isNil(value)) {
          return undefined
        }

        const ticket = tickets.find((ticket) =>
          ticket.id.toString() === value?.ticket
        );

        if(!_.isNil(ticket)) {
          return { ticket, value: value!}
        }

        return undefined
      })

    return _.compact(pairings)
  }
}
