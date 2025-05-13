import { Command, Flags } from '@oclif/core';

import * as util from 'util';
import { exec as execNonPromise } from 'child_process';
import { branchToTicket } from '../../../lib/git';

const exec = util.promisify(execNonPromise);

export default class OpenShortcutBranch extends Command {
  static description = 'Opens a shortcut ticket for the current branch';

  static flags = {
    token: Flags.string({ required: false, default: process.env.SHORTCUT_API_TOKEN }),
  };

  async run() {
    const { flags } = await this.parse(OpenShortcutBranch);

    if (flags.token === undefined) {
      throw new Error('Shortcut API token is required. Use --token or SHORTCUT_API_TOKEN env variable');
    }

    const branch = await exec('git rev-parse --abbrev-ref HEAD');

    const ticket = branchToTicket(branch.stdout)

    const url = `https://app.shortcut.com/coast/story/${ticket}`

    await exec(`open ${url}`);

    this.log(`Opening ticket ${url}`);
  }
}
