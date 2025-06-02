import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const dtsPath = path.join(__dirname, 'src/parser/parser.d.ts');
const importLine = `import { LogicalCondition } from "./types";`;

if (!fs.existsSync(dtsPath)) {
  console.error('parser.d.ts not found at :', dtsPath);
  process.exit(1);
}

const content = fs.readFileSync(dtsPath, 'utf-8');

if (!content.includes(importLine)) {
  fs.writeFileSync(dtsPath, `${importLine}\n${content}`);
  console.log('Import added to parser.d.ts');
} else {
  console.log('Import already present');
}
