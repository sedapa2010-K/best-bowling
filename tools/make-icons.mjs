// Generates the app icons (SVG + PNG) for Best Bowling.
// Usage: node tools/make-icons.mjs   (needs `sharp`; set SHARP_FROM to a path inside a folder where it is installed)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(process.env.SHARP_FROM || import.meta.url);
const sharp = require('sharp');
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'icons');
mkdirSync(out, { recursive: true });

const defs = `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf8"/><stop offset=".55" stop-color="#f6efe1"/><stop offset="1" stop-color="#e8dbc0"/></linearGradient>
  <radialGradient id="spot" cx="0.5" cy="0.36" r="0.62"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".6" stop-color="#ffffff" stop-opacity=".2"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbedc4"/><stop offset=".35" stop-color="#e2c27e"/><stop offset=".7" stop-color="#b88f45"/><stop offset="1" stop-color="#8a6428"/></linearGradient>
  <linearGradient id="goldH" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="100" y2="0"><stop offset="0" stop-color="#c9a052" stop-opacity="0"/><stop offset="1" stop-color="#a87d34"/></linearGradient>
  <radialGradient id="ball" cx=".34" cy=".28" r=".9"><stop offset="0" stop-color="#fff6d8"/><stop offset=".25" stop-color="#f0d38f"/><stop offset=".6" stop-color="#cfa252"/><stop offset=".85" stop-color="#9c7230"/><stop offset="1" stop-color="#6e4e1c"/></radialGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset=".4" stop-color="#fff3cf" stop-opacity="0"/><stop offset="1" stop-color="#fff3cf" stop-opacity=".9"/></linearGradient>
  <radialGradient id="shine" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <linearGradient id="ivory" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f7f4ee"/><stop offset="1" stop-color="#d3cbbb"/></linearGradient>
  <path id="pinpath" d="M0,-150 C14,-150 19,-137 19,-123 C19,-109 11,-101 10,-91 C9,-80 27,-63 31,-40 C35,-17 25,-4 19,0 L-19,0 C-25,-4 -35,-17 -31,-40 C-27,-63 -9,-80 -10,-91 C-11,-101 -19,-109 -19,-123 C-19,-137 -14,-150 0,-150 Z"/>
  <g id="pin">
    <use xlink:href="#pinpath" fill="url(#ivory)" stroke="#a87d34" stroke-opacity=".9" stroke-width="3"/>
    <path d="M-11,-108 Q0,-104 11,-108" stroke="url(#gold)" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-10,-97 Q0,-93 10,-97" stroke="url(#gold)" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
  <path id="spark" d="M0,-1 C.12,-.12 .12,-.12 1,0 C.12,.12 .12,.12 0,1 C-.12,.12 -.12,.12 -1,0 C-.12,-.12 -.12,-.12 0,-1Z"/>
</defs>`;

const art = `
  <ellipse cx="270" cy="418" rx="200" ry="15" fill="#6e4e1c" opacity=".18"/>
  <path d="M86 416 H456" stroke="url(#gold)" stroke-width="2" opacity=".55"/>
  <use xlink:href="#pin" transform="translate(436 410) rotate(8)"/>
  <use xlink:href="#pin" transform="translate(320 412) rotate(36)"/>
  <use xlink:href="#pin" transform="translate(374 236) rotate(-60) scale(.72)"/>
  <use xlink:href="#pin" transform="translate(306 152) rotate(36) scale(.56)"/>
  <use xlink:href="#spark" transform="translate(428 124) scale(20)" fill="url(#gold)"/>
  <use xlink:href="#spark" transform="translate(236 118) scale(11)" fill="url(#gold)" opacity=".85"/>
  <use xlink:href="#spark" transform="translate(470 232) scale(10)" fill="url(#gold)" opacity=".9"/>
  <g stroke="url(#goldH)" stroke-linecap="round">
    <path d="M36 288h52" stroke-width="7"/><path d="M22 326h62" stroke-width="9"/><path d="M42 364h44" stroke-width="7"/>
  </g>
  <g stroke="url(#gold)" stroke-width="5" stroke-linecap="round">
    <path d="M286 262l-4-16"/><path d="M300 270l12-12"/><path d="M306 288l16-4"/>
  </g>
  <circle cx="190" cy="322" r="96" fill="url(#ball)" stroke="#8a6428" stroke-width="2.5"/>
  <circle cx="190" cy="322" r="94.5" fill="none" stroke="url(#rim)" stroke-width="3.5"/>
  <ellipse cx="152" cy="268" rx="36" ry="20" fill="url(#shine)" transform="rotate(-36 152 268)"/>
  <g fill="#5a3f14" stroke="#fff3cf" stroke-opacity=".6" stroke-width="2">
    <circle cx="180" cy="258" r="8.5"/><circle cx="204" cy="252" r="8.5"/><circle cx="190" cy="280" r="9.5"/>
  </g>`;

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">${defs}${body}</svg>`;

const icon = svg(`
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <rect width="512" height="512" rx="112" fill="url(#spot)"/>
  ${art}
  <rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="url(#gold)" stroke-width="5"/>
  <rect x="22" y="22" width="468" height="468" rx="94" fill="none" stroke="url(#gold)" stroke-width="1.2" opacity=".55"/>`);

// Full-bleed square with the art inside the maskable safe zone (and for iOS, which rounds corners itself).
const square = (scale) => svg(`
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#spot)"/>
  <g transform="translate(${256 - 256 * scale} ${256 - 256 * scale}) scale(${scale})">${art}</g>`);

writeFileSync(join(out, 'icon.svg'), icon);
const png = (src, size, name) => sharp(Buffer.from(src)).resize(size, size).png().toFile(join(out, name));
await png(icon, 192, 'icon-192.png');
await png(icon, 512, 'icon-512.png');
await png(square(0.8), 512, 'icon-maskable-512.png');
await png(square(0.92), 180, 'apple-touch-icon.png');
console.log('icons written to', out);
