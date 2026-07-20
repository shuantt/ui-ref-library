import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const definitionsPath = join(repoRoot, "scripts", "style-card-guides.js");
const catalogPath = join(repoRoot, "catalog", "ui-references.json");

function fail(message) {
    console.error(message);
    process.exitCode = 1;
}

function readGuideDefinitions() {
    const source = readFileSync(definitionsPath, "utf8");
    const startMarker = "const guideDefinitions = ";
    const nextMarker = "const styleGuides = new Map";
    const start = source.indexOf(startMarker);
    const next = source.indexOf(nextMarker, start);

    if (start === -1 || next === -1) {
        throw new Error("Unable to locate guideDefinitions in scripts/style-card-guides.js.");
    }

    const block = source.slice(start + startMarker.length, next);
    const semicolon = block.lastIndexOf(";");
    if (semicolon === -1) throw new Error("guideDefinitions is missing its closing semicolon.");

    const literal = block.slice(0, semicolon).trim();
    const definitions = vm.runInNewContext(literal, Object.create(null), { timeout: 1000 });
    if (!Array.isArray(definitions)) throw new Error("guideDefinitions did not evaluate to an array.");

    return definitions;
}

function buildCatalog() {
    const definitions = readGuideDefinitions();
    const seenIds = new Set();
    const seenPages = new Set();

    const references = definitions.map((definition, index) => {
        if (!Array.isArray(definition) || definition.length !== 6) {
            throw new Error(`Guide ${index + 1} must contain href, name, kind, summary, bestFor, and direction.`);
        }

        const [page, name, kind, summary, bestFor, direction] = definition;
        const match = page.match(/^styles\/(\d{2})-(.+)\.html$/);
        if (!match) throw new Error(`Guide ${index + 1} has an invalid page path: ${page}`);

        const [, id, slug] = match;
        if (seenIds.has(id)) throw new Error(`Duplicate guide id: ${id}`);
        if (seenPages.has(page)) throw new Error(`Duplicate guide page: ${page}`);
        if (!existsSync(join(repoRoot, page))) throw new Error(`Guide page does not exist: ${page}`);
        seenIds.add(id);
        seenPages.add(page);

        return {
            id,
            slug,
            name,
            kind,
            summary,
            bestFor,
            direction,
            page,
            sourceUrl: `https://github.com/shuantt/ui-ref-library/blob/main/${page}`
        };
    });

    if (references.length !== 57) {
        throw new Error(`Expected 57 references, found ${references.length}.`);
    }

    return {
        schemaVersion: 1,
        name: "UI Reference Library",
        repository: "https://github.com/shuantt/ui-ref-library",
        upstream: "https://github.com/joshhu/uitest",
        license: "MIT",
        generatedFrom: "scripts/style-card-guides.js",
        usagePolicy: "Optional personal reference source. It is not exhaustive, a style whitelist, or a substitute for project-specific design research.",
        count: references.length,
        references
    };
}

function serializeCatalog(catalog) {
    return `${JSON.stringify(catalog, null, 2)}\n`;
}

function build() {
    const catalog = buildCatalog();
    mkdirSync(dirname(catalogPath), { recursive: true });
    writeFileSync(catalogPath, serializeCatalog(catalog), "utf8");
    console.log(`Catalog built: ${relative(repoRoot, catalogPath)} (${catalog.count} references)`);
}

function check() {
    if (!existsSync(catalogPath)) {
        fail("Catalog is missing. Run: node scripts/catalog.mjs build");
        return;
    }

    const expected = serializeCatalog(buildCatalog());
    const actual = readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    if (actual !== expected) {
        fail("Catalog is stale. Run: node scripts/catalog.mjs build");
        return;
    }

    console.log("Catalog check passed: 57 references match scripts/style-card-guides.js.");
}

function normalize(value) {
    return String(value).normalize("NFKC").toLocaleLowerCase("en");
}

function parseSearchArgs(args) {
    const options = { query: [], kind: "", limit: 8, json: false };

    for (const arg of args) {
        if (arg === "--json") {
            options.json = true;
        } else if (arg.startsWith("--kind=")) {
            options.kind = arg.slice("--kind=".length).trim();
        } else if (arg.startsWith("--limit=")) {
            const limit = Number.parseInt(arg.slice("--limit=".length), 10);
            if (!Number.isInteger(limit) || limit < 1) throw new Error("--limit must be a positive integer.");
            options.limit = limit;
        } else if (arg.startsWith("--")) {
            throw new Error(`Unknown option: ${arg}`);
        } else {
            options.query.push(arg);
        }
    }

    return { ...options, query: options.query.join(" ").trim() };
}

function scoreReference(reference, tokens, kind) {
    if (kind && !normalize(reference.kind).includes(normalize(kind))) return -1;
    if (tokens.length === 0) return 1;

    const name = normalize(reference.name);
    const referenceKind = normalize(reference.kind);
    const summary = normalize(reference.summary);
    const bestFor = normalize(reference.bestFor);
    const bestForClauses = bestFor.split(/[。；;]/).filter(Boolean);
    const negativeBestFor = bestForClauses.filter((clause) => /不適合|不建議|避免/.test(clause));
    const positiveBestFor = bestForClauses.filter((clause) => !negativeBestFor.includes(clause)).join(" ");
    const direction = normalize(reference.direction);
    const slug = normalize(reference.slug);

    let score = 0;
    for (const token of tokens) {
        if (name.includes(token)) score += 8;
        if (referenceKind.includes(token)) score += 5;
        if (slug.includes(token)) score += 4;
        if (positiveBestFor.includes(token)) score += 3;
        if (negativeBestFor.some((clause) => clause.includes(token))) score -= 6;
        if (summary.includes(token)) score += 2;
        if (direction.includes(token)) score += 1;
    }
    return score;
}

function search(args) {
    if (!existsSync(catalogPath)) throw new Error("Catalog is missing. Run: node scripts/catalog.mjs build");
    const options = parseSearchArgs(args);
    const catalog = JSON.parse(readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, ""));
    const tokens = normalize(options.query).split(/[\s,，、/]+/).filter(Boolean);
    const matches = catalog.references
        .map((reference) => ({ reference, score: scoreReference(reference, tokens, options.kind) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.reference.id.localeCompare(b.reference.id))
        .slice(0, options.limit)
        .map(({ reference, score }) => ({ ...reference, score }));

    if (options.json) {
        console.log(JSON.stringify({ query: options.query, kind: options.kind || null, count: matches.length, matches }, null, 2));
        return;
    }

    if (matches.length === 0) {
        console.log("No matching references.");
        return;
    }

    for (const match of matches) {
        console.log(`#${match.id} ${match.name} · ${match.kind} · score ${match.score}`);
        console.log(`  ${match.summary}`);
        console.log(`  Best for: ${match.bestFor}`);
        console.log(`  Page: ${match.page}`);
    }
}

function usage() {
    console.log(`Usage:
  node scripts/catalog.mjs build
  node scripts/catalog.mjs check
  node scripts/catalog.mjs search [query] [--kind=<kind>] [--limit=<n>] [--json]

Examples:
  node scripts/catalog.mjs search "專業 高密度 dashboard" --limit=4
  node scripts/catalog.mjs search "Swiss" --kind=視覺風格 --json`);
}

const [command = "help", ...args] = process.argv.slice(2);

try {
    if (command === "build") build();
    else if (command === "check") check();
    else if (command === "search") search(args);
    else if (command === "help" || command === "--help" || command === "-h") usage();
    else {
        usage();
        fail(`Unknown command: ${command}`);
    }
} catch (error) {
    fail(error instanceof Error ? error.message : String(error));
}
