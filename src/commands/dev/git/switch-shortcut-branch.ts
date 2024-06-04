import {Command, Flags} from "@oclif/core";

import {CreateStoryParams, ShortcutClient, Story, StorySearchResult} from "@shortcut/client";

import { select, input } from "@inquirer/prompts";

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import {table} from "@oclif/core/lib/cli-ux/styled/table";
import flags = table.flags;
const exec = util.promisify(execNonPromise);

type StoryType = 'feature' | 'bug' | 'chore';

interface CreatedBranchTicket {
  type: 'existing';
  name: string;
  id: string;
  url: string;
  storyType: StoryType;
  ownerIds?: string[];
}

type BranchTicket = CreatedBranchTicket | {
  type: 'new';
};

interface UserDetails {
  username: string;
  id: string;
}

export default class SwitchShortcutBranch extends Command {
  static description = 'Switches to a branch by a shortcut name';

  static flags = {
    token: Flags.string({ required: false, default: process.env.SHORTCUT_API_TOKEN }),
    readyForDevState: Flags.string({ required: false, default: 'Ready For Development' }),
  };

  async run() {
    const { flags } = await this.parse(SwitchShortcutBranch);

    if (flags.token === undefined) {
      throw new Error('Shortcut API token is required. Use --token or SHORTCUT_API_TOKEN env variable');
    }

    const tickets = await this.listTickets(flags.token, flags.readyForDevState);

    const ticket: BranchTicket = await select<BranchTicket>({
      message: 'What are you working on?',
      choices: tickets.tickets.map((ticket: StorySearchResult) => ({
        name: ticket.name,
        value: {
          type: 'existing',
          name: ticket.name,
          id: ticket.id.toString(),
          url: ticket.app_url,
          storyType: ticket.story_type as StoryType,
          ownerIds: ticket.owner_ids,
        } as BranchTicket,
      })).concat([{ name: 'New ticket', value: { type: 'new' } as BranchTicket }]),
      loop: false
    });

    if (ticket.type === 'new') {
      const name = await input({ message: 'Ticket title?' });

      const type: 'feature' | 'chore' | 'bug' = await select({
        message: 'Ticket type?',
        choices: [{ name: 'Feature', value: 'feature' }, { value: 'bug', name: 'Bug' }, { value: 'chore', name: 'Chore' }],
      });

      const newTicket = await this.createTicket(flags.token, {
        name,
        story_type: type,
        owner_ids: [tickets.user.id],
        workflow_state_id: 1,
      });

      const branchName = this.ticketBranchName(tickets.user, {
        type: 'existing',
        storyType: newTicket.story_type as StoryType,
        url: newTicket.app_url,
        id: newTicket.id.toString(),
        name: newTicket.name,
      });

      this.log(`Switching to branch ${branchName} for new ticket ${newTicket.app_url}`);

      await exec(`git sb ${branchName}`);
    } else {
      const branchName = this.ticketBranchName(tickets.user, ticket)

      if (!ticket.ownerIds?.includes(tickets.user.id)) {
        await this.assignUserToTicket(flags.token, ticket.id, tickets.user.id);
      }

      this.log(`Switching to branch ${branchName} for existing ticket ${ticket.url}`);

      await exec(`git sb ${branchName}`);
    }
  }

  private async assignUserToTicket(token: string, ticketId: string, userId: string): Promise<void> {
    const shortcut = new ShortcutClient(token);

    await shortcut.updateStory(Number(ticketId), { owner_ids: [userId] });
  }

  private async createTicket(token: string, createTicket: CreateStoryParams): Promise<Story> {
    const shortcut = new ShortcutClient(token);

    const ticket = await shortcut.createStory({ ...createTicket, project_id: null });

    return ticket.data;
  }

  private async listTickets(token: string, readyForDevState: string): Promise<{ tickets: StorySearchResult[], user: UserDetails}> {
    const shortcut = new ShortcutClient(token);

    const me = await shortcut.getCurrentMemberInfo();

    const assignedNonDone = await shortcut.searchStories({ query: `!is:done owner:${me.data.mention_name}`});
    const unassignedReadyForDev = await shortcut.searchStories({ query: `-has:owner state:"${readyForDevState}"` });

    return { tickets: assignedNonDone.data.data.concat(unassignedReadyForDev.data.data), user: { username: me.data.mention_name, id: me.data.id } };
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
}