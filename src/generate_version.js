import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// read package.json manually
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Split the version (assuming semantic versioning: MAJOR.MINOR.PATCH)
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// Bump patch version
const newPatch = patch + 1;
const newVersion = `${major}.${minor}.${newPatch}`;

// Update package.json version
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Prepare version info
const versionInfo = {
  version: newVersion,
  updated: new Date().toISOString(),
};

// write version.json to public/
const outputPath = path.join(__dirname, '..', 'public', 'version.json');
fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));

console.log('✅ version bumped and version.json created:', versionInfo);
