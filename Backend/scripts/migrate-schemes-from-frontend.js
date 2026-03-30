import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import connectDB from "../src/db/index.js";
import Scheme from "../src/models/scheme.model.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const DRY_RUN = process.argv.includes("--dry-run");

const frontendSchemesPath = path.resolve(
  process.cwd(),
  "..",
  "frontend",
  "src",
  "data",
  "schemes.ts"
);

const toSlug = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const extractArrayBlocks = (content) => {
  const blocks = [];
  const regex = /const\s+schemes(\d{4})\s*:\s*Scheme\[\]\s*=\s*\[(.*?)\];/gs;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({ year: Number(match[1]), body: match[2] });
  }
  return blocks;
};

const extractObjects = (arrayBody) => {
  const objectRegex = /\{([\s\S]*?)\}/g;
  const objects = [];
  let match;
  while ((match = objectRegex.exec(arrayBody)) !== null) {
    objects.push(match[1]);
  }
  return objects;
};

const parseField = (objectBody, key) => {
  const regex = new RegExp(`${key}:\\s*'([\\s\\S]*?)'`, "m");
  const match = objectBody.match(regex);
  return match ? match[1].trim() : "";
};

const parseSchemes = (content) => {
  const blocks = extractArrayBlocks(content);
  const schemes = [];
  blocks.forEach((block) => {
    const objects = extractObjects(block.body);
    objects.forEach((obj) => {
      const title = parseField(obj, "name");
      if (!title) return;
      schemes.push({
        title,
        slug: toSlug(title),
        description: parseField(obj, "description"),
        year: block.year,
        launchDate: parseField(obj, "launchDate"),
        eligibility: parseField(obj, "eligibility"),
        agency: parseField(obj, "agency"),
        thumbnailPath: parseField(obj, "imageUrl"),
        benefits: [],
        applicationProcess: [],
        isPublished: true,
        status: "active",
        displayOrder: 0,
        category: "general",
      });
    });
  });
  return schemes;
};

const run = async () => {
  if (!fs.existsSync(frontendSchemesPath)) {
    throw new Error(`Source file not found: ${frontendSchemesPath}`);
  }

  const content = fs.readFileSync(frontendSchemesPath, "utf8");
  const schemes = parseSchemes(content);

  console.log(`Parsed ${schemes.length} schemes from frontend file.`);
  if (DRY_RUN) {
    console.log("Dry run enabled. No database changes will be made.");
    console.log(JSON.stringify(schemes.slice(0, 3), null, 2));
    return;
  }

  await connectDB();

  let upserts = 0;
  for (const scheme of schemes) {
    await Scheme.updateOne(
      { title: scheme.title, year: scheme.year },
      { $set: scheme },
      { upsert: true }
    );
    upserts += 1;
  }

  console.log(`Migration completed. Upserted ${upserts} scheme records.`);
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
