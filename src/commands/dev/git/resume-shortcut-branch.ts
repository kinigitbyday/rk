import { Command, Flags } from '@oclif/core';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { select } from '@inquirer/prompts';
import _ from 'lodash';
import Shortcut from '../../../lib/api';
import { StorySearchResult } from '@shortcut/client';
import { GitBranch, gitBranchTickets, ShortcutTicket } from '../../../lib/git';

const exec = util.promisify(execNonPromise);

export default class ResumeShortcutBranch extends Command {
  static description = 'Resumes shortcut branches';

  static flags = {
    token: Flags.string({ required: false, default: process.env.SHORTCUT_API_TOKEN }),
    readyForDevState: Flags.string({ required: false, default: 'Ready For Development' }),
  };

  async run() {
    const { flags } = await this.parse(ResumeShortcutBranch);

    const shortcut = await new Shortcut(flags.token!).listTickets(flags.readyForDevState);

    const branches = await this.getBranches(shortcut.tickets);

    const byTicketId = _.groupBy(branches, x => x.ticket.id.toString());

    const result = await select<{ name: string }>({
      message: 'Resume?',
      choices: Object.keys(byTicketId).map(id => ({
        name: byTicketId[id][0].ticket.name,
        value: {
          name: byTicketId[id][0].ticket.id.toString(),
        },
      })),
      loop: false,
    });

    const branch = await select<{ name: string }>({
      message: 'Which branch?',
      choices: byTicketId[result.name].map(branch => ({
        name: branch.value.branch,
        value: {
          name: branch.value.branch,
        },
      })),
      loop: false,
    });

    await exec(`git checkout ${branch.name}`);
  }

  private async getBranches(
    tickets: StorySearchResult[]
  ): Promise<Array<{ ticket: StorySearchResult; value: GitBranch }>> {
    const branches = await gitBranchTickets();

    const pairings: Array<
      undefined | { ticket: StorySearchResult; value: GitBranch }
    > = branches.map(
      (
        value:
          | undefined
          | {
              ticket: ShortcutTicket;
              branch: string;
            }
      ) => {
        if (_.isNil(value)) {
          return undefined;
        }

        const ticket = tickets.find(ticket => ticket.id.toString() === value?.ticket);

        if (!_.isNil(ticket)) {
          return { ticket, value: value! };
        }

        return undefined;
      }
    );

    return _.compact(pairings);
  }
}
