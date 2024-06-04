import {Command, Flags} from "@oclif/core";

import {ShortcutClient, Story, StorySearchResult} from "@shortcut/client";

import { select, input } from "@inquirer/prompts";

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
const exec = util.promisify(execNonPromise);

type BranchTicket = {
  type: 'existing';
  name: string;
  id: string;
  url: string;
} | {
  type: 'new';
};

export default class SwitchShortcutBranch extends Command {
  static description = 'Switches to a branch by a shortcut name';

  static flags = {
      token: Flags.string({ required: true}),
  };

  async run() {
    const { flags } = await this.parse(SwitchShortcutBranch);

    const tickets = await this.listTickets(flags.token);

    const ticket: BranchTicket = await select<BranchTicket>({
      message: 'What are you working on?',
      choices: tickets.tickets.map((ticket: StorySearchResult) => ({
        name: ticket.name,
        value: {
          type: 'existing',
          name: ticket.name,
          id: ticket.id.toString(),
          url: ticket.app_url,
        } as BranchTicket,
      })).concat([{ name: 'New ticket', value: { type: 'new' } as BranchTicket }]),
    });

    if (ticket.type === 'new') {
      const name = await input({ message: 'Ticket title?' });

      const newTicket = await this.createTicket(flags.token, name);

      const branch = `${tickets.user.name}/sc-${newTicket.id}/${name
          .replace(/[^a-zA-Z0-9\[\]]/g, '-').replace(/[\[\]]/g, '')}`.slice(0, 244);

      this.log(`Switching to branch ${branch} for new ticket ${newTicket.app_url}`);

      await exec(`git sb ${branch}`);
    } else {
      const branch = `${tickets.user.name}/sc-${ticket.id}/${ticket.name
          .replace(/[^a-zA-Z0-9\[\]]/g, '-').replace(/[\[\]]/g, '')}`.slice(0, 244);

      this.log(`Switching to branch ${branch} for existing ticket ${ticket.url}`);

      await exec(`git sb ${branch}`);
    }
  }

  private async createTicket(token: string, name: string): Promise<Story> {
    const shortcut = new ShortcutClient(token);

    const ticket = await shortcut.createStory({
      name,
      description: 'Created by nb',
    });

    return ticket.data;
  }

  private async listTickets(token: string): Promise<{ tickets: StorySearchResult[], user: { name: string; id: string; }}> {
    const shortcut = new ShortcutClient(token);

    const me = await shortcut.getCurrentMemberInfo();

    const tickets = await shortcut.searchStories({ query: `-is:done owner:${me.data.mention_name}`});

    return { tickets: tickets.data.data, user: { name: me.data.mention_name, id: me.data.id } };
  }
}