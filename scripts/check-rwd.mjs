import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const widthArgument = process.argv.find((argument) => argument.startsWith('--width='));
const viewportWidth = Number(widthArgument?.split('=')[1] ?? 375);
const viewportHeight = 812;
const captureArgument = process.argv.find((argument) => argument.startsWith('--capture='));
const captureDirectoryArgument = process.argv.find((argument) =>
  argument.startsWith('--capture-dir='),
);
const captures = new Set(
  captureArgument
    ?.split('=')[1]
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean) ?? [],
);
const captureDirectory = captureDirectoryArgument
  ? resolve(captureDirectoryArgument.split('=')[1])
  : join(root, 'rwd-captures');
const profilePath = mkdtempSync(join(tmpdir(), 'ui-ref-library-rwd-'));

if (captures.size > 0) mkdirSync(captureDirectory, { recursive: true });

const browserCandidates =
  process.platform === 'win32'
    ? [
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      ]
    : process.platform === 'darwin'
      ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
      : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];

const browserPath = browserCandidates.find(existsSync);
if (!browserPath) {
  console.error('Chrome or Edge is required for the RWD check.');
  process.exit(1);
}

const pagePaths = [
  join(root, 'index.html'),
  ...readdirSync(join(root, 'styles'))
    .filter((name) => name.endsWith('.html'))
    .sort()
    .map((name) => join(root, 'styles', name)),
];

const browser = spawn(
  browserPath,
  [
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-crash-reporter',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${profilePath}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const delay = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

async function waitForDebuggingPort() {
  const portFile = join(profilePath, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (existsSync(portFile)) {
      return Number(readFileSync(portFile, 'utf8').split(/\r?\n/, 1)[0]);
    }
    if (browser.exitCode !== null) {
      throw new Error(`Browser exited before debugging started (${browser.exitCode}).`);
    }
    await delay(100);
  }
  throw new Error('Timed out while starting the browser.');
}

function connect(webSocketUrl) {
  return new Promise((resolvePromise, rejectPromise) => {
    const socket = new WebSocket(webSocketUrl);
    socket.addEventListener('open', () => resolvePromise(socket), { once: true });
    socket.addEventListener(
      'error',
      () => rejectPromise(new Error('Could not connect to Chrome DevTools.')),
      { once: true },
    );
  });
}

function createProtocol(socket) {
  let nextId = 0;
  const pending = new Map();
  const eventWaiters = new Map();

  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
      return;
    }

    const waiters = eventWaiters.get(message.method) ?? [];
    eventWaiters.delete(message.method);
    for (const waiter of waiters) waiter(message.params);
  });

  return {
    send(method, params = {}) {
      const id = ++nextId;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolvePromise, rejectPromise) => {
        pending.set(id, { resolve: resolvePromise, reject: rejectPromise });
      });
    },
    once(method, timeout = 10_000) {
      return new Promise((resolvePromise, rejectPromise) => {
        const timer = setTimeout(
          () => rejectPromise(new Error(`Timed out waiting for ${method}.`)),
          timeout,
        );
        const waiters = eventWaiters.get(method) ?? [];
        waiters.push((params) => {
          clearTimeout(timer);
          resolvePromise(params);
        });
        eventWaiters.set(method, waiters);
      });
    },
  };
}

let socket;
try {
  const port = await waitForDebuggingPort();
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) =>
    response.json(),
  );
  const pageTarget = targets.find((target) => target.type === 'page');
  if (!pageTarget) throw new Error('No browser page target was created.');

  socket = await connect(pageTarget.webSocketDebuggerUrl);
  const protocol = createProtocol(socket);
  await protocol.send('Page.enable');
  await protocol.send('Runtime.enable');
  await protocol.send('Emulation.setDeviceMetricsOverride', {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: viewportWidth,
    screenHeight: viewportHeight,
  });

  const failures = [];
  const interactionFailures = [];
  for (const pagePath of pagePaths) {
    const loaded = protocol.once('Page.loadEventFired');
    await protocol.send('Page.navigate', { url: pathToFileURL(pagePath).href });
    await loaded;
    await delay(250);

    if (basename(pagePath) === 'index.html') {
      const { result: guideResult } = await protocol.send('Runtime.evaluate', {
        awaitPromise: true,
        returnByValue: true,
        expression: `(async () => {
          const cards = [...document.querySelectorAll('.style-card')];
          const actions = [...document.querySelectorAll('.style-card-action')];
          const dialog = document.querySelector('#style-guide-dialog');
          const descriptionPanel = dialog?.querySelector('[data-description-panel]');
          const promptPanel = dialog?.querySelector('[data-prompt-panel]');
          const promptOutput = dialog?.querySelector('[data-prompt-output]');
          const copyButton = dialog?.querySelector('[data-copy-prompt]');
          const copyStatus = dialog?.querySelector('[data-copy-status]');

          let invalidDescriptions = 0;
          let invalidPrompts = 0;
          for (const card of cards) {
            card.querySelector('.style-card-action--description')?.click();
            if (!dialog?.open || descriptionPanel?.hidden || descriptionPanel?.textContent.trim().length <= 80) {
              invalidDescriptions += 1;
            }
            dialog?.close();

            card.querySelector('.style-card-action--prompt')?.click();
            if (!dialog?.open || promptPanel?.hidden || promptOutput?.value.length <= 500) {
              invalidPrompts += 1;
            }
            dialog?.close();
          }

          cards[0]?.querySelector('.style-card-action--prompt')?.click();
          copyButton?.click();
          await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
          const copyFeedback = Boolean(copyStatus?.textContent.trim());
          dialog?.close();

          return {
            cards: cards.length,
            actions: actions.length,
            nestedInteractive: document.querySelectorAll('a button, button a').length,
            invalidDescriptions,
            invalidPrompts,
            copyFeedback,
          };
        })()`,
      });

      const guideState = guideResult.value;
      if (
        guideState.cards !== 57 ||
        guideState.actions !== 114 ||
        guideState.nestedInteractive !== 0 ||
        guideState.invalidDescriptions !== 0 ||
        guideState.invalidPrompts !== 0 ||
        !guideState.copyFeedback
      ) {
        interactionFailures.push(guideState);
      }
    }

    const { result } = await protocol.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const viewport = document.documentElement.clientWidth;
        const pageWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body?.scrollWidth || 0
        );
        const offenders = [...document.querySelectorAll('body *')]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              className: typeof element.className === 'string' ? element.className : '',
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            };
          })
          .filter((item) => item.width > 0 && (item.right > viewport + 2 || item.left < -2))
          .sort((a, b) => (b.right - viewport) - (a.right - viewport))
          .slice(0, 3);
        return { viewport, pageWidth, offenders };
      })()`,
    });

    const metrics = result.value;
    if (captures.has(basename(pagePath))) {
      const { contentSize } = await protocol.send('Page.getLayoutMetrics');
      const screenshot = await protocol.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        clip: {
          x: 0,
          y: 0,
          width: viewportWidth,
          height: Math.min(Math.ceil(contentSize.height), 6000),
          scale: 1,
        },
      });
      const outputName = `${basename(pagePath, '.html')}-${viewportWidth}px.png`;
      writeFileSync(join(captureDirectory, outputName), Buffer.from(screenshot.data, 'base64'));
      console.log(`Captured ${outputName}`);

      if (basename(pagePath) === 'index.html') {
        for (const mode of ['description', 'prompt']) {
          await protocol.send('Runtime.evaluate', {
            expression: `document.querySelector('.style-card-action--${mode}')?.click()`,
          });
          await delay(150);
          const dialogScreenshot = await protocol.send('Page.captureScreenshot', {
            format: 'png',
            captureBeyondViewport: false,
          });
          const dialogOutputName = `index-${mode}-${viewportWidth}px.png`;
          writeFileSync(
            join(captureDirectory, dialogOutputName),
            Buffer.from(dialogScreenshot.data, 'base64'),
          );
          console.log(`Captured ${dialogOutputName}`);
          await protocol.send('Runtime.evaluate', {
            expression: `document.querySelector('#style-guide-dialog')?.close()`,
          });
        }
      }
    }

    if (metrics.pageWidth > metrics.viewport + 2) {
      failures.push({
        page: basename(pagePath),
        overflow: metrics.pageWidth - metrics.viewport,
        offenders: metrics.offenders,
      });
    }
  }

  if (failures.length > 0 || interactionFailures.length > 0) {
    console.error(
      `RWD check failed at ${viewportWidth}px: ${failures.length}/${pagePaths.length} pages overflow.`,
    );
    for (const failure of failures) {
      console.error(`- ${failure.page}: +${failure.overflow}px`);
      for (const offender of failure.offenders) {
        console.error(
          `  ${offender.tag}.${offender.className.split(/\s+/).slice(0, 4).join('.')} ` +
            `[${offender.left}, ${offender.right}]`,
        );
      }
    }
    for (const failure of interactionFailures) {
      console.error(`- index.html style guide interaction failed: ${JSON.stringify(failure)}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`RWD check passed: ${pagePaths.length} pages fit ${viewportWidth}px.`);
    console.log('Index guide check passed: 57 cards, 114 actions, dialogs, and copy feedback work.');
  }
} finally {
  socket?.close();
  browser.kill();
  await delay(300);
  rmSync(profilePath, { recursive: true, force: true });
}
