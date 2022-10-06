import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import * as Jimp from 'jimp';
import { GifFrame, GifUtil } from 'gifwrap';
import { bottom } from '../../util';
import * as _ from 'lodash';

export default class Rainbowify extends Command {
  static description = 'Creates a rainbowified/party-fied gif from an image for slack';

  static flags = {
    image: Flags.string({
      description: 'Image to use',
      required: false,
      exactlyOne: ['image', 'gif'],
    }),
    gif: Flags.string({
      description: 'Gif to use',
      required: false,
      exactlyOne: ['image', 'gif'],
      exclusive: ['colors'],
    }),
    useGifIntermediateFrames: Flags.boolean({
      description:
        'Whether or not to add intermediate frames to gifs to keep the fast rainbow effect. Can increase the size of the gif.',
      required: false,
      default: true,
      allowNo: true,
      exclusive: ['image'],
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
      default: 3,
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
    size: Flags.integer({
      description: 'Squared size of the output image (scaled to fit)',
      required: false,
      default: 128,
    }),
  };

  async run() {
    const { flags } = await this.parse(Rainbowify);

    if (flags.image === undefined && flags.gif === undefined) {
      throw new Error('Requires one of image or gif');
    }

    const frames = await this.getFramesAndOptions(
      flags.image
        ? { type: 'image', frameCount: flags.colors, imagePath: flags.image }
        : { type: 'gif', gifPath: flags.gif!, useIntermediates: flags.useGifIntermediateFrames },
      {
        saturation: flags.saturation,
        lighten: flags.lighten,
        size: flags.size,
        frameDelay: flags.delay,
      }
    );

    //.write(path.join(tmpDir, `frame${index.toString().padStart(flags.colors.toString().length, '0')}.png`));

    await GifUtil.write(
      `${flags.outDir}/party_${path.basename(
        (flags.image ?? flags.gif)!,
        path.extname((flags.image ?? flags.gif)!)
      )}.gif`,
      frames
    );
  }

  private async getFramesAndOptions(
    input:
      | { type: 'image'; imagePath: string; frameCount: number }
      | { type: 'gif'; gifPath: string; useIntermediates: boolean },
    options: GifFrameOptions
  ): Promise<GifFrame[]> {
    switch (input.type) {
      case 'image': {
        const image = (await Jimp.read(input.imagePath)).scaleToFit(options.size, options.size);

        const frames: GifFrame[] = [];
        for (let i = 0; i < input.frameCount; i++) {
          const coloredImage = image
            .clone()
            .color([{ apply: 'hue', params: [(360.0 / input.frameCount) * i] }])
            // these are missing from the type of ColorActionName
            .color([
              // @ts-ignore
              { apply: 'saturate', params: [options.saturation] },
              // @ts-ignore
              { apply: 'lighten', params: [options.lighten] },
            ]);

          frames.push(new GifFrame(coloredImage.bitmap, { delayCentisecs: options.frameDelay }));
        }

        GifUtil.quantizeDekker(frames, 256);

        return frames;
      }
      case 'gif': {
        const gif = await GifUtil.read(input.gifPath);

        const frames: GifFrame[] = [];

        const intermediateFramesForFrame = (frame: GifFrame): number => {
          if (true) {
            Math.ceil(frame.delayCentisecs / options.frameDelay);
          }

          return 1;
        };

        let frameCount = 0;

        gif.frames.forEach(frame => {
          const image = GifUtil.copyAsJimp(Jimp, frame).scaleToFit(options.size, options.size);
          const intermediateFrameCount = intermediateFramesForFrame(frame);

          for (let j = 0; j < intermediateFrameCount; j++) {
            frameCount++;

            const coloredImage = image
              .clone()
              .color([{ apply: 'hue', params: [((360.0 / gif.frames.length) * frameCount) % 360] }])
              // these are missing from the type of ColorActionName
              .color([
                // @ts-ignore
                { apply: 'saturate', params: [options.saturation] },
                // @ts-ignore
                { apply: 'lighten', params: [options.lighten] },
              ]);

            frames.push(
              new GifFrame(coloredImage.bitmap, {
                delayCentisecs: Math.min(options.frameDelay, frame.delayCentisecs),
                yOffset: frame.yOffset,
                xOffset: frame.xOffset,
                disposalMethod: frame.disposalMethod,
                isInterlaced: frame.interlaced,
              })
            );
          }
        });

        GifUtil.quantizeDekker(frames, 256);

        return frames;
      }
      default:
        return bottom(input);
    }
  }
}

interface GifFrameOptions {
  saturation: number;
  lighten: number;
  size: number;
  frameDelay: number;
}
