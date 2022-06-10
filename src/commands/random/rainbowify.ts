import { Command, Flags } from '@oclif/core';
import * as fs from 'fs';
import * as path from 'path';
import * as Jimp from 'jimp';

const del = require('del');
const pngFileStream = require('png-file-stream');
const gifEncoder = require('gifencoder');

export default class Rainbowify extends Command {
  static description = 'Creates a rainbowified/party-fied gif from an image for slack';

  static flags = {
    image: Flags.string({
      description: 'Image to use',
      required: true,
    }),
    outDir: Flags.string({
      description: 'Output file dir',
      required: false,
      default: '.',
    }),
    colors: Flags.integer({
      description: 'Number of colors to use',
      required: false,
      default: 10,
    }),
    delay: Flags.integer({
      description: 'Frame delay for the gif',
      required: false,
      default: 30,
    }),
    saturation: Flags.integer({
      description: 'Saturation level to apply to each frame',
      required: false,
      default: 50,
    }),
    lighten: Flags.integer({
      description: 'Lightening level to apply to each frame',
      required: false,
      default: 10,
    }),
  };

  async run() {
    const { flags } = await this.parse(Rainbowify);
    const tmpDir = path.join(flags.outDir, 'tmp');

    try {
      fs.mkdirSync(tmpDir, { recursive: true });
    } catch (err) {
      // @ts-ignore
      if (err.code !== 'EEXIST') {
        this.error('Failed to create a tmp folder in outDir');
        throw err;
      } else {
        this.error('tmp folder already exists in outDir. Bailing so we avoid deleting something we should not');
        throw err;
      }
    }

    const image = (await Jimp.read(flags.image)).scaleToFit(128, 128);

    for (let i = 0; i < flags.colors; i++) {
      image
        .clone()
        .color([{ apply: 'hue', params: [(360.0 / flags.colors) * i] }])
        // these are missing from the type of ColorActionName
        .color([
          // @ts-ignore
          { apply: 'saturate', params: [flags.saturation] },
          // @ts-ignore
          { apply: 'lighten', params: [flags.lighten] },
        ])
        .write(path.join(tmpDir, `frame${i.toString().padStart(flags.colors.toString().length, '0')}.png`));
    }

    const gif = new gifEncoder(image.bitmap.width, image.bitmap.height);
    gif.setTransparent();
    await pngFileStream(`${tmpDir}/frame*.png`)
      .pipe(
        gif.createWriteStream({
          repeat: 0,
          delay: flags.delay,
          quality: 10,
        })
      )
      .pipe(fs.createWriteStream(`${flags.outDir}/party_${path.basename(flags.image, path.extname(flags.image))}.gif`))
      .on('close', async () => {
        await del(tmpDir, { force: true });
      });
  }
}
