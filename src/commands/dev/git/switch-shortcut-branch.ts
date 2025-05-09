import { Command, Flags } from '@oclif/core';

import { StorySearchResult } from '@shortcut/client';

import { input, select } from '@inquirer/prompts';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import Shortcut, { BranchTicket, CreatedBranchTicket, StoryType, UserDetails } from '../../../lib/api';
import { readJson } from 'fs-extra';
import { EpicSlim } from '@shortcut/client/lib/generated/data-contracts';
import _ from 'lodash';

const exec = util.promisify(execNonPromise);

export default class SwitchShortcutBranch extends Command {
  static description = 'Switches to a branch by a shortcut name';

  static flags = {
    token: Flags.string({ required: false, default: process.env.SHORTCUT_API_TOKEN }),
    readyForDevState: Flags.string({ required: false, default: 'Ready For Development' }),
    configFile: Flags.string({ required: false, default: '.shortcut-config.json' }),
    all: Flags.boolean({ char: 'a', required: false, default: false }),
  };

  async run() {
    const { flags } = await this.parse(SwitchShortcutBranch);

    if (flags.token === undefined) {
      throw new Error('Shortcut API token is required. Use --token or SHORTCUT_API_TOKEN env variable');
    }

    const api = new Shortcut();

    const config = await this
      .loadConfig(flags.configFile);

    const [tickets, epics] = await Promise.all([
      api.listTickets(flags.readyForDevState, flags.all),
      api.listEpics(),
    ]);

    const ticket: BranchTicket = await select<BranchTicket>({
      message: 'What are you working on?',
      choices: [{ name: 'New ticket', value: { type: 'new' } as BranchTicket }, ...tickets.tickets
        .map((ticket: StorySearchResult) => ({
          name: ticket.name,
          value: {
            type: 'existing',
            name: ticket.name,
            id: ticket.id.toString(),
            url: ticket.app_url,
            storyType: ticket.story_type as StoryType,
            ownerIds: ticket.owner_ids,
          } as BranchTicket,
        }))],
      loop: false,
    });

    try {
      if (ticket.type === 'new') {
        const name = await input({ message: 'Ticket title?' });

        const type: 'feature' | 'chore' | 'bug' = await select({
          message: 'Ticket type?',
          choices: [
            { name: 'Feature', value: 'feature' },
            { value: 'bug', name: 'Bug' },
            { value: 'chore', name: 'Chore' },
          ],
        });

        const epicId: number = await select<number>({
          message: 'Which epic?',
          choices: epics.filter(i => {
              const explicit = config.epicIds.includes(i.id)

              const byGroupAssociation = _.difference(config.epicRelatedGroupIds, i?.associated_groups?.map(j => j.group_id)).length === 0

              return explicit || byGroupAssociation;
            }
          )
              .map((epic: EpicSlim) => ({
                name: epic.name,
                value: epic.id,
              })),
            loop
      :
        false,
      })

        const newTicket = await api.createTicket({
          name,
          story_type: type,
          owner_ids: [tickets.user.id],
          workflow_state_id: config.workflowId,
          group_id: config.groupId,
          epic_id: epicId,
        });

        const branchName = this.ticketBranchName(tickets.user, {
          type: 'existing',
          storyType: newTicket.story_type as StoryType,
          url: newTicket.app_url,
          id: newTicket.id.toString(),
          name: newTicket.name,
        });

        this.log(`Switching to branch ${branchName} for new ticket ${newTicket.app_url}`);

        await exec(`git checkout -b ${branchName}`);
      } else {
        const nameOverride: string = await input({ message: 'Branch name?', default: ticket.name });

        const branchName = this.ticketBranchName(tickets.user, { ...ticket, name: nameOverride });

        if (!ticket.ownerIds?.includes(tickets.user.id)) {
          await api.assignUserToTicket(ticket.id, tickets.user.id, ticket.ownerIds);
        }

        this.log(`Switching to branch ${branchName} for existing ticket ${ticket.url}`);

        await exec(`git checkout -b ${branchName}`);
      }
    } catch (e) {
      this.error(`Error switching to branch: ${e}`);
    }
  }

  private ticketBranchName(user: UserDetails, ticket: CreatedBranchTicket): string {
    const prefix = `${user.username}/sc-${ticket.id}/${ticket.storyType}`;

    let name = ticket.name
      .toLowerCase()
      .replace(/[\[\]]/g, '')
      .replace(/\W/g, '-')
      .replace(/--+/, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 50)
      .replace(/-$/, '');

    return `${prefix}/${name}`;
  }

  private async loadConfig(path: string): Promise<{ workflowId?: number, groupId: string, epicIds: number[], epicRelatedGroupIds: string[] }> {
    return readJson(path);
  }
}
