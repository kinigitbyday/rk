import { CreateStoryParams, EpicSearchResults, ShortcutClient, Story, StorySearchResult } from '@shortcut/client';
import { EpicSlim } from '@shortcut/client/lib/generated/data-contracts';
import _ from 'lodash';

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
  private readonly client: ShortcutClient;

  constructor(private readonly token: string = process.env.SHORTCUT_API_TOKEN!) {
    this.client = new ShortcutClient(this.token);
  }

  async listTickets(
    readyForDevState: string = 'Ready For Development',
    includeUnassigned: boolean = false
  ): Promise<{ tickets: StorySearchResult[]; user: UserDetails }> {
    const me = await this.client.getCurrentMemberInfo();

    const [assignedNonDone, unassignedReadyForDev] = await Promise.all([
      this.client.searchStories({ query: `-is:done -is:archived owner:${me.data.mention_name}` }),
      this.client.searchStories({
        query: `-owner:${me.data.mention_name} state:"${readyForDevState}"`,
      }),
    ]);

    return {
      tickets: includeUnassigned
        ? assignedNonDone.data.data.concat(unassignedReadyForDev.data.data)
        : assignedNonDone.data.data,
      user: { username: me.data.mention_name, id: me.data.id },
    };
  }

  async assignUserToTicket(ticketId: string, userId: string, existingOwners?: string[]): Promise<void> {
    await this.client.updateStory(Number(ticketId), { owner_ids: [...(existingOwners ?? []), userId] });
  }

  async createTicket(createTicket: CreateStoryParams): Promise<Story> {
    const ticket = await this.client.createStory({ ...createTicket, project_id: null });

    return ticket.data;
  }

  async listEpics(teams: string[]): Promise<EpicSlim[]> {
    const data: EpicSlim[] = [];

    let next = undefined;
    do {
      const result: EpicSearchResults = await this.client
        .searchEpics({
          detail: 'slim',
          entity_types: ['epic'],
          page_size: 25,
          query: next ?? `-is:done -is:archived ${teams.map(i => `team:${i}`).join(' OR ')}`,
          // next: next
        })
        .then(x => x.data);

      data.push(...result.data);

      next = result.next;
    } while (!_.isNil(next));

    return _.sortBy(data.filter(i => !i.completed), i => i.name);
  }
}
