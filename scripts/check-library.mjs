import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const stylesDir = join(root, 'styles');
const indexPath = join(root, 'index.html');
const issues = [];

const styleFiles = readdirSync(stylesDir)
  .filter((name) => name.endsWith('.html'))
  .sort();

const expectedFiles = Array.from({ length: 57 }, (_, index) =>
  String(index + 1).padStart(2, '0'),
);

if (styleFiles.length !== expectedFiles.length) {
  issues.push(`Expected 57 style pages, found ${styleFiles.length}.`);
}

for (const number of expectedFiles) {
  if (!styleFiles.some((name) => name.startsWith(`${number}-`))) {
    issues.push(`Missing style page #${number}.`);
  }
}

const indexHtml = readFileSync(indexPath, 'utf8');

const closedCatalogClaims = [
  /完整收錄[^。\n]*所有/i,
  /(?:UI\s*)?風格[^。；\n]{0,12}完整展示/i,
  /完整(?:收錄|展示)[^。；\n]{0,30}(?:UI\s*)?風格/i,
  /complete\s+(?:collection|catalog(?:ue)?|list)/i,
  /(?:that(?:'s| is)|these are)\s+all\s+(?:the\s+)?styles/i,
];

if (closedCatalogClaims.some((pattern) => pattern.test(indexHtml))) {
  issues.push('index.html must not describe the 57 pages as a complete list of UI styles.');
}
const indexLinks = [
  ...indexHtml.matchAll(/href=["']styles\/([^"']+\.html)["']/gi),
].map((match) => match[1]);
const indexCards = [
  ...indexHtml.matchAll(
    /<a\s+href=["']styles\/([^"']+\.html)["'][^>]*>[\s\S]*?<span[^>]*>#(\d{2})<\/span>\s*<h4[^>]*>(.*?)<\/h4>/gi,
  ),
];

if (indexLinks.length !== 57) {
  issues.push(`Expected 57 style links in index.html, found ${indexLinks.length}.`);
}

if (new Set(indexLinks).size !== indexLinks.length) {
  issues.push('index.html contains duplicate style links.');
}

if (indexCards.length !== 57) {
  issues.push(`Expected 57 style cards in index.html, found ${indexCards.length}.`);
}

for (const [, fileName, cardNumber, cardTitleHtml] of indexCards) {
  const fileNumber = fileName.slice(0, 2);
  const cardTitle = cardTitleHtml.replace(/<[^>]+>/g, '').trim();
  const targetPath = join(stylesDir, fileName);

  if (cardNumber !== fileNumber) {
    issues.push(`Card #${cardNumber} points to style #${fileNumber}.`);
  }

  if (existsSync(targetPath)) {
    const targetHtml = readFileSync(targetPath, 'utf8');
    const targetTitle = targetHtml
      .match(/<title>(.*?)\s+-\s+UI Style #\d{2}<\/title>/i)?.[1]
      ?.trim();
    if (targetTitle && cardTitle !== targetTitle) {
      issues.push(
        `Card #${cardNumber} title "${cardTitle}" does not match "${targetTitle}".`,
      );
    }
  }
}

for (const [index, fileName] of indexLinks.entries()) {
  const expectedNumber = String(index + 1).padStart(2, '0');
  if (!fileName.startsWith(`${expectedNumber}-`)) {
    issues.push(
      `Index position #${expectedNumber} points to ${fileName}.`,
    );
  }
}

const htmlPaths = [indexPath, ...styleFiles.map((name) => join(stylesDir, name))];

for (const filePath of htmlPaths) {
  const html = readFileSync(filePath, 'utf8');
  const fileLabel = relative(root, filePath).replaceAll('\\', '/');
  const isStylePage = filePath !== indexPath;

  if (isStylePage && closedCatalogClaims.some((pattern) => pattern.test(html))) {
    issues.push(`${fileLabel}: must not describe the library as a complete list of UI styles.`);
  }

  if (!/<meta\s+[^>]*charset=/i.test(html)) {
    issues.push(`${fileLabel}: missing charset metadata.`);
  }

  if (!/<meta\s+[^>]*name=["']viewport["']/i.test(html)) {
    issues.push(`${fileLabel}: missing viewport metadata.`);
  }

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) {
    issues.push(`${fileLabel}: expected one h1, found ${h1Count}.`);
  }

  if (isStylePage) {
    const pageNumber = fileLabel.match(/styles\/(\d{2})-/)?.[1];
    const titleNumber = html.match(/<title>[^<]*#(\d{2})<\/title>/i)?.[1];

    if (!/<html\s+lang=["']en["']/i.test(html)) {
      issues.push(`${fileLabel}: English page must use lang="en".`);
    }

    if (titleNumber !== pageNumber) {
      issues.push(
        `${fileLabel}: title number ${titleNumber ?? 'missing'} does not match #${pageNumber}.`,
      );
    }

    if (!/href=["']\.\.\/index\.html["']/i.test(html)) {
      issues.push(`${fileLabel}: missing link back to ../index.html.`);
    }

    if (!/Best\s+For/i.test(html)) {
      issues.push(`${fileLabel}: missing a Best For section.`);
    }

    if (!/(?:Key\s+Elements|Characteristics)/i.test(html)) {
      issues.push(`${fileLabel}: missing key elements or characteristics.`);
    }
  }

  const ids = new Set();
  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) {
    const id = match[1];
    if (ids.has(id)) {
      issues.push(`${fileLabel}: duplicate id "${id}".`);
    }
    ids.add(id);
  }

  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const reference = match[1].trim();
    if (
      !reference ||
      /^(?:https?:|data:|mailto:|tel:|javascript:)/i.test(reference)
    ) {
      continue;
    }

    if (reference.startsWith('#')) {
      const anchor = reference.slice(1);
      if (!anchor) {
        issues.push(`${fileLabel}: empty placeholder link "href=\"#\"".`);
      } else if (!ids.has(anchor)) {
        issues.push(`${fileLabel}: missing anchor target "${reference}".`);
      }
      continue;
    }

    const localReference = reference.split(/[?#]/, 1)[0];
    const targetPath = resolve(dirname(filePath), localReference);
    if (!existsSync(targetPath)) {
      issues.push(`${fileLabel}: missing local file "${reference}".`);
    }
  }

  for (const match of html.matchAll(/<(input|textarea|select)\b([^>]*)>/gi)) {
    const [, tag, attributes] = match;
    if (/\btype=["'](?:hidden|submit|button|reset)["']/i.test(attributes)) {
      continue;
    }
    if (
      /\bplaceholder=/i.test(attributes) &&
      !/\b(?:aria-label|aria-labelledby|id)\s*=/i.test(attributes)
    ) {
      issues.push(`${fileLabel}: ${tag} with a placeholder has no accessible name.`);
    }
  }

  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const [, attributes, content] = match;
    const textContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!textContent && !/\b(?:aria-label|aria-labelledby|title)\s*=/i.test(attributes)) {
      issues.push(`${fileLabel}: icon-only button has no accessible name.`);
    }
  }

  for (const match of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    if (/<button\b/i.test(match[1])) {
      issues.push(`${fileLabel}: button is nested inside a link.`);
    }
  }
}

if (issues.length > 0) {
  console.error(`Library check failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log('Library check passed: 57 pages, links, metadata, and controls are consistent.');
}
