// Makes the Android app's launch screens match Android 12+'s own round icon screen, so launch shows one steady icon:
//  - res/drawable-*/splash.png: icons/launch.svg (the launcher icon cut to its circle) at 192dp per density
//  - res/values(-v31)/styles.xml + manifest: launch theme whose system splash background is #1f3449
// Usage: node tools/twa-splash.mjs <android project dir>   (needs `sharp`, see make-icons.mjs; run after make-twa.mjs)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(process.env.SHARP_FROM || import.meta.url);
const sharp = require('sharp');
const proj = process.argv[2];
if (!proj) throw new Error('usage: node tools/twa-splash.mjs <android project dir>');
const res = join(proj, 'app', 'src', 'main', 'res');
const svg = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'icons', 'launch.svg'));

const DP = 192;
for (const [dir, scale] of [['mdpi', 1], ['hdpi', 1.5], ['xhdpi', 2], ['xxhdpi', 3], ['xxxhdpi', 4]]) {
  const px = Math.round(DP * scale);
  await sharp(svg, { density: 72 * px / 405 * 4 }).resize(px, px).png().toFile(join(res, `drawable-${dir}`, 'splash.png'));
}

const style = (extra) => `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="LaunchTheme" parent="@android:style/Theme.Translucent.NoTitleBar">${extra}
    </style>
</resources>
`;
writeFileSync(join(res, 'values', 'launch_theme.xml'), style(''));
mkdirSync(join(res, 'values-v31'), { recursive: true });
writeFileSync(join(res, 'values-v31', 'launch_theme.xml'), style(`
        <item name="android:windowSplashScreenBackground">#1F3449</item>`));

const manifest = join(proj, 'app', 'src', 'main', 'AndroidManifest.xml');
const m = readFileSync(manifest, 'utf8');
writeFileSync(manifest, m.replace('android:theme="@android:style/Theme.Translucent.NoTitleBar"', 'android:theme="@style/LaunchTheme"'));
console.log('splash updated in', res);
