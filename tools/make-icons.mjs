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
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b7f9e"/><stop offset=".55" stop-color="#34536f"/><stop offset="1" stop-color="#1f3449"/></linearGradient>
  <radialGradient id="spot" cx="0.5" cy="0.36" r="0.62"><stop offset="0" stop-color="#cfe2f2" stop-opacity=".35"/><stop offset=".6" stop-color="#cfe2f2" stop-opacity=".08"/><stop offset="1" stop-color="#cfe2f2" stop-opacity="0"/></radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbedc4"/><stop offset=".35" stop-color="#e2c27e"/><stop offset=".7" stop-color="#b88f45"/><stop offset="1" stop-color="#8a6428"/></linearGradient>
  <linearGradient id="goldH" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="100" y2="0"><stop offset="0" stop-color="#e2c27e" stop-opacity="0"/><stop offset="1" stop-color="#f1d79c"/></linearGradient>
  <radialGradient id="ball" cx=".34" cy=".28" r=".9"><stop offset="0" stop-color="#fff1c4"/><stop offset=".22" stop-color="#f2c45e"/><stop offset=".58" stop-color="#c98a24"/><stop offset=".85" stop-color="#8a5612"/><stop offset="1" stop-color="#4f2f07"/></radialGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset=".4" stop-color="#fff3cf" stop-opacity="0"/><stop offset="1" stop-color="#fff3cf" stop-opacity=".9"/></linearGradient>
  <radialGradient id="hole" cx=".42" cy=".35" r=".7"><stop offset="0" stop-color="#1c1003"/><stop offset=".7" stop-color="#3d2608"/><stop offset="1" stop-color="#6b4612"/></radialGradient>
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
  <ellipse cx="270" cy="418" rx="200" ry="15" fill="#0b1622" opacity=".4"/>
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
  <circle cx="190" cy="322" r="96" fill="url(#ball)" stroke="#5c3a0e" stroke-width="3"/>
  <circle cx="190" cy="322" r="94.5" fill="none" stroke="url(#rim)" stroke-width="3.5"/>
  <ellipse cx="152" cy="268" rx="36" ry="20" fill="url(#shine)" transform="rotate(-36 152 268)"/>
  <!-- Finger holes: two fingers side by side, thumb hole larger and further down, tilted to follow the ball's curve -->
  <g transform="rotate(-38 218 276)">
    <g fill="url(#hole)" stroke="#fff3cf" stroke-opacity=".55" stroke-width="1.8">
      <ellipse cx="206" cy="252" rx="8.5" ry="9.5"/><ellipse cx="230" cy="252" rx="8.5" ry="9.5"/><ellipse cx="218" cy="304" rx="11" ry="12"/>
    </g>
  </g>`;


// Wooden lane floor in perspective (boards, arrows, gutters) behind the ball and pins.
const floor = (clip) => `
  <defs>
    <clipPath id="round"><rect width="512" height="512" rx="112"/></clipPath>
    <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b98a52"/><stop offset=".45" stop-color="#dcb57c"/><stop offset="1" stop-color="#f3d7a3"/></linearGradient>
    <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34536f" stop-opacity="1"/><stop offset="1" stop-color="#34536f" stop-opacity="0"/></linearGradient>
  </defs>
  <g ${clip ? 'clip-path="url(#round)"' : ''}>
    <rect x="0" y="252" width="512" height="260" fill="#1d3044"/>
    <polygon points="148,252 364,252 600,512 -88,512" fill="url(#wood)"/>
    <g stroke="#7a5626" stroke-opacity=".28" stroke-width="1.4">
      ${Array.from({ length: 15 }, (_, i) => { const k = (i + 1) / 16; return `<line x1="${148 + 216 * k}" y1="252" x2="${-88 + 688 * k}" y2="512"/>`; }).join('')}
    </g>
    <g stroke="#7a5626" stroke-opacity=".18" stroke-width="1">
      <line x1="${(148 - 88) / 2}" y1="382" x2="${(364 + 600) / 2}" y2="382"/>
    </g>
    <g fill="#5a3f14" fill-opacity=".55">
      ${[5, 10, 15, 20, 25, 30, 35].map((board) => {
        // 7 lane arrows on boards 5…35 of 39, forming a ^ toward the pins: the middle one is farthest out
        // and each step outward sits a little closer, all following the floor's perspective.
        const step = Math.abs(board - 20) / 5;
        const at = (y) => { const t = (512 - y) / 260, l = -88 + 236 * t, r = 600 - 236 * t; return { x: l + (r - l) * board / 39, w: r - l }; };
        const base = 438 + step * 8, tip = base - 18 + step * 1.5;
        const b0 = at(base), b1 = at(tip), hw = b0.w * 0.022;
        return `<polygon points="${b1.x.toFixed(1)},${tip.toFixed(1)} ${(b0.x - hw).toFixed(1)},${base} ${(b0.x + hw).toFixed(1)},${base}"/>`;
      }).join('')}
    </g>
    <polygon points="148,252 364,252 600,512 -88,512" fill="url(#gloss)"/>
    <polygon points="148,252 156,252 -60,512 -88,512" fill="#0f1d2b" opacity=".55"/>
    <polygon points="356,252 364,252 600,512 572,512" fill="#0f1d2b" opacity=".55"/>
    <rect x="0" y="246" width="512" height="44" fill="url(#fade)"/>
  </g>`;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">${defs}${body}</svg>`;

const icon = svg(`
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <rect width="512" height="512" rx="112" fill="url(#spot)"/>
  ${floor(true)}
  ${art}
  <rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="url(#gold)" stroke-width="5"/>
  <rect x="22" y="22" width="468" height="468" rx="94" fill="none" stroke="url(#gold)" stroke-width="1.2" opacity=".55"/>`);

// Full-bleed square with the art inside the maskable safe zone (and for iOS, which rounds corners itself).
const square = (scale) => svg(`
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#spot)"/>
  ${floor(false)}
  <g transform="translate(${256 - 256 * scale} ${256 - 256 * scale}) scale(${scale})">${art}</g>`);

writeFileSync(join(out, 'icon.svg'), icon);
const png = (src, size, name) => sharp(Buffer.from(src)).resize(size, size).png().toFile(join(out, name));
await png(icon, 192, 'icon-192.png');
await png(icon, 512, 'icon-512.png');
await png(square(0.8), 512, 'icon-maskable-512.png');
await png(square(0.92), 180, 'apple-touch-icon.png');
console.log('icons written to', out);
