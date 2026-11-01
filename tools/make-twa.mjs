// Generates the Play Store (Trusted Web Activity) Android project in ./android from the live web manifest,
// using Bubblewrap's library directly so no interactive prompts are needed.
// Usage: node tools/make-twa.mjs   (needs `npm i -g @bubblewrap/cli`; android/ is git-ignored)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const root = execSync('npm root -g').toString().trim();
const require = createRequire(path.join(root, '@bubblewrap/cli/node_modules/@bubblewrap/core/package.json'));
const { TwaManifest, TwaGenerator, ConsoleLog } = require('@bubblewrap/core');
const Color = require('color');

const dir = path.resolve('android');
fs.mkdirSync(dir, { recursive: true });

const twa = await TwaManifest.fromWebManifest('https://sedapa2010-k.github.io/best-bowling/manifest.webmanifest');
twa.packageId = 'io.github.sedapa2010k.bestbowling';
twa.launcherName = 'Best Bowling';
twa.themeColor = Color('#f5f2ec');
twa.themeColorDark = Color('#f5f2ec');
twa.navigationColor = Color('#f5f2ec');
twa.navigationColorDark = Color('#f5f2ec');
twa.navigationDividerColor = Color('#f5f2ec');
twa.navigationDividerColorDark = Color('#f5f2ec');
twa.backgroundColor = Color('#1f3449');
twa.enableNotifications = false;
twa.fallbackType = 'customtabs';
twa.appVersionName = '1.0.2';
twa.appVersionCode = 3;
twa.minSdkVersion = 24; // androidbrowserhelper 2.7+ needs 24
twa.signingKey = { path: path.join(dir, 'bestbowling-upload.jks'), alias: 'bestbowling' };

await twa.saveToFile(path.join(dir, 'twa-manifest.json'));
await new TwaGenerator().createTwaProject(dir, twa, new ConsoleLog('twa'));
console.log('Android project ready in', dir);
