import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esm2umd from "esm2umd";
import prettier from "prettier";

const basePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const esmPath = path.join(basePath, "index.js");
const umdPath = path.join(basePath, "umd", "index.js");

const esmSource = fs.readFileSync(esmPath, "utf8");
const umdSource = esm2umd("bcrypt", esmSource);

async function formatWithPrettier(source, filepath) {
  const options = await prettier.resolveConfig(filepath);
  return await prettier.format(source, { ...options, filepath });
}

const prettierUmdSource = await formatWithPrettier(umdSource, umdPath);

fs.writeFileSync(umdPath, prettierUmdSource);

fs.copyFileSync(
  path.join(basePath, "types.d.ts"),
  path.join(basePath, "umd", "types.d.ts"),
);
