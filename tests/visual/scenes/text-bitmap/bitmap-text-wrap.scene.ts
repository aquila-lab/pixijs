import { Assets } from '~/assets';
import { BitmapText } from '~/scene';

import type { TestScene } from '../../types';
import type { Container } from '~/scene';

export const scene: TestScene = {
    it: 'should wrap bitmap text with CSS-like word breaking behavior',
    create: async (scene: Container) =>
    {
        await Assets.load('fonts/outfit.woff2');

        const style = {
            fontFamily: 'Outfit',
            fontSize: 18,
            wordWrap: true,
            wordWrapWidth: 60,
        };

        // breakWords: true (CSS break-all)
        // Breaks at ANY character when line would overflow
        const breakAllText = new BitmapText({
            text: 'Hello World',
            style: {
                ...style,
                breakWords: true,
            },
        });

        // breakWords: false (CSS break-word)
        // Short words stay intact, wrap to next line
        const breakWordText = new BitmapText({
            text: 'Hello World',
            style: {
                ...style,
                breakWords: false,
            },
            position: { x: 70, y: 0 }
        });

        // breakWords: false with long word
        // Breaks as last resort when word is too long for any line
        const longWordText = new BitmapText({
            text: 'Longword',
            style: {
                ...style,
                breakWords: false,
            },
            position: { x: 0, y: 50 }
        });

        // breakWords: false with hyphenated word
        // Breaks after hyphens (CSS break-word behavior)
        const hyphenText = new BitmapText({
            text: 'well-known',
            style: {
                ...style,
                breakWords: false,
            },
            position: { x: 70, y: 50 }
        });

        scene.addChild(breakAllText);
        scene.addChild(breakWordText);
        scene.addChild(longWordText);
        scene.addChild(hyphenText);
    },
};
