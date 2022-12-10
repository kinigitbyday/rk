import { Command } from '@oclif/core';
import * as fs from 'fs-extra';
import * as os from 'os';

export abstract class Adventofcode2022Command extends Command {
  async parseFile(file: string): Promise<string[]> {
    const readFile = await fs.readFile(file);
    return readFile.toString().split(os.EOL);
  }
}
