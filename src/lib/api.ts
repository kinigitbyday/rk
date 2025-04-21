import { CreateStoryParams, ShortcutClient, Story, StorySearchResult } from '@shortcut/client';

export interface UserDetails {
  username: string;
  id: string;
}

export type StoryType = 'feature' | 'bug' | 'chore';

export interface CreatedBranchTicket {
  type: 'existing';
  name: string;
  id: string;
  url: string;
  storyType: StoryType;
  ownerIds?: string[];
}

export type BranchTicket =
  | CreatedBranchTicket
  | {
      type: 'new';
    };

export default class Shortcut {
  async listTickets(
    token: string,
    readyForDevState: string= 'Ready For Development',
    includeUnassigned: boolean = false
  ): Promise<{ tickets: StorySearchResult[]; user: UserDetails }> {
    const shortcut = new ShortcutClient(token);

    const me = await shortcut.getCurrentMemberInfo();

    const [assignedNonDone, unassignedReadyForDev] = await Promise.all([
      shortcut.searchStories({ query: `-is:done -is:archived owner:${me.data.mention_name}` }),
      shortcut.searchStories({
        query: `-owner:${me.data.mention_name} state:"${readyForDevState}"`,
      }),
    ]);

    return {
      tickets: includeUnassigned ? assignedNonDone.data.data.concat(unassignedReadyForDev.data.data) : assignedNonDone.data.data,
      user: { username: me.data.mention_name, id: me.data.id },
    };
  }

  async assignUserToTicket(token: string, ticketId: string, userId: string, existingOwners?: string[]): Promise<void> {
    const shortcut = new ShortcutClient(token);

    await shortcut.updateStory(Number(ticketId), { owner_ids: [...(existingOwners ?? []), userId] });
  }

  async createTicket(token: string, createTicket: CreateStoryParams): Promise<Story> {
    const shortcut = new ShortcutClient(token);

    const ticket = await shortcut.createStory({ ...createTicket, project_id: null });

    return ticket.data;
  }
}
