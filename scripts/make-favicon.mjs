// Gera favicon.ico (16/32/48) e os ícones PWA a partir da gema do site.
// Uso: node scripts/make-favicon.mjs   (rodar de novo só se o ícone mudar)
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const BG = "#0d1430";
const gem = (scale) => `
  <g transform="translate(16 16) scale(${scale}) translate(-16 -16)">
    <path d="M16 4 25 11v10l-9 7-9-7V11z" fill="#3fd17a" stroke="#0f5e30" stroke-width="1.5"/>
    <path d="M16 4v24M7 11l9 4.5 9-4.5" stroke="#0f5e30" stroke-width="1" fill="none" opacity=".6"/>
    <path d="M11 12.5l3-1.5" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
  </g>`;
const square = (scale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${BG}"/>${gem(scale)}</svg>`;

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

/** ICO com PNGs embutidos (formato aceito por todos os navegadores desde o Vista). */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

const iconSvg = await readFile("src/app/icon.svg", "utf8");
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(iconSvg, size) })));
await writeFile("src/app/favicon.ico", ico(images));
await writeFile("public/icons/icon-192.png", await png(square(1.15), 192));
await writeFile("public/icons/icon-512.png", await png(square(1.15), 512));
// Maskable: a gema fica dentro da zona segura (80% central).
await writeFile("public/icons/icon-maskable-512.png", await png(square(0.85), 512));
console.log("favicon.ico + 3 PNGs gerados");
