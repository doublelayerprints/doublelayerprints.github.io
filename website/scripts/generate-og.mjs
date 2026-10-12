import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const publicDir = resolve(rootDir, 'public');

const clashFont = readFileSync(resolve(publicDir, 'fonts/clash-display-600.woff2')).toString('base64');
const satoshiFont = readFileSync(resolve(publicDir, 'fonts/satoshi-500.woff2')).toString('base64');
const monoFont = readFileSync(resolve(publicDir, 'fonts/space-mono-400.woff2')).toString('base64');

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Clash Display';
    font-weight: 600;
    src: url('data:font/woff2;base64,${clashFont}') format('woff2');
  }
  @font-face {
    font-family: 'Satoshi';
    font-weight: 500;
    src: url('data:font/woff2;base64,${satoshiFont}') format('woff2');
  }
  @font-face {
    font-family: 'Space Mono';
    font-weight: 400;
    src: url('data:font/woff2;base64,${monoFont}') format('woff2');
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background-color: #EFF0F2;
    color: #241A30;
    font-family: 'Satoshi', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px 84px;
    position: relative;
    border: 1px solid #C3C0CB;
  }

  /* Watermark G-code a destra */
  .gcode-bg {
    position: absolute;
    top: 60px;
    right: 84px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #C3C0CB;
    opacity: 0.6;
    text-align: right;
    pointer-events: none;
  }
  .gcode-bg .layer {
    color: #8B68C9;
  }

  .brand-area {
    position: relative;
    z-index: 2;
  }

  .mark {
    font-family: 'Clash Display', sans-serif;
    font-weight: 600;
    font-size: 96px;
    letter-spacing: -0.02em;
    line-height: 0.94;
  }
  .mark__a {
    color: #5B2E91;
    display: block;
  }
  .mark__b {
    position: relative;
    display: block;
    color: #241A30;
  }
  .mark__b-echo {
    position: absolute;
    inset: 0;
    color: #FFCE00;
    z-index: -1;
    transform: translate(0.085em, 0.05em);
  }
  .mark__sub {
    display: block;
    margin-top: 18px;
    font-family: 'Space Mono', monospace;
    font-weight: 400;
    font-size: 22px;
    letter-spacing: 0.04em;
    color: #625D6E;
  }

  /* Layer lines */
  .layers {
    display: block;
    width: 100%;
    margin-top: 36px;
  }
  .layers i {
    display: block;
    height: 1px;
    background: #C3C0CB;
  }
  .layers i + i {
    margin-top: 5px;
  }
  .layers i:nth-child(2) {
    margin-top: 11px;
    height: 2px;
  }
  .layers i:nth-child(3) {
    margin-top: 4px;
    height: 2px;
    background: #FFCE00;
  }
  .layers i:nth-child(4) {
    margin-top: 13px;
  }

  .bottom-area {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;
    z-index: 2;
  }

  .tagline {
    font-size: 28px;
    font-weight: 500;
    color: #3A2E4A;
    line-height: 1.35;
    max-width: 650px;
  }

  .meta-badges {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    color: #625D6E;
    text-align: right;
    line-height: 1.7;
    border-left: 2px solid #5B2E91;
    padding-left: 18px;
  }
  .meta-badges span {
    display: block;
  }
  .meta-badges .accent {
    color: #5B2E91;
    font-weight: 700;
  }
</style>
</head>
<body>
  <div class="gcode-bg" aria-hidden="true">
    <div>; DOUBLE LAYER PRINTS</div>
    <div>; SLICER CONFIG V1</div>
    <div class="layer">; LAYER:001 / NOZZLE:0.4</div>
    <div>G1 X120.4 Y95.2 E0.045</div>
    <div>G1 X125.8 Y98.1 E0.082</div>
    <div class="layer">; PRINT IN PROGRESS</div>
  </div>

  <div class="brand-area">
    <div class="mark">
      <span class="mark__a">Double</span>
      <span class="mark__b">
        <span class="mark__b-echo">LayeR</span>
        <span>LayeR</span>
      </span>
      <span class="mark__sub">prints</span>
    </div>
    <div class="layers">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  </div>

  <div class="bottom-area">
    <p class="tagline">
      Laboratorio di stampa 3D a Bologna.<br>
      Pezzi unici, prototipi e design FDM layer by layer.
    </p>
    <div class="meta-badges">
      <span class="accent">TANCREDI &amp; RACHELE</span>
      <span>ANYCUBIC KOBRA 3</span>
      <span>ANYCUBIC KOBRA X</span>
      <span>0.12 &ndash; 0.28 MM</span>
    </div>
  </div>
</body>
</html>`;

const tmpHtmlPath = resolve(rootDir, 'og-template.html');
const outPngPath = resolve(publicDir, 'og.png');

writeFileSync(tmpHtmlPath, html, 'utf8');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
execFileSync(chromePath, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1200,630',
  `--screenshot=${outPngPath}`,
  `file://${tmpHtmlPath}`
]);

unlinkSync(tmpHtmlPath);
console.log(`OG image generated at ${outPngPath}`);
