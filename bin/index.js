#!/usr/bin/env node

/**
 * get-openfonts CLI
 * World's Largest Multilingual Open Typography Archive (80,000+ Fonts)
 * Author: Mohammad Golamrabbii (https://linktr.ee/golamrabbii)
 */

const { execSync } = require('child_process');
const fs = require('fs');

const collections = {
  bangla: {
    name: 'Open Bangla Fonts Mega Collection (2,600+ Fonts)',
    repo: 'https://github.com/mohammadgolamrabbii/Bangla-Fonts-Mega-Collection.git',
    zip: 'https://github.com/mohammadgolamrabbii/Bangla-Fonts-Mega-Collection/archive/refs/tags/v1.0.0.zip'
  },
  english: {
    name: 'English & Western Open Typography Mega Archive (50,000+ Fonts)',
    repo: 'https://github.com/mohammadgolamrabbii/English-Fonts-Mega-Archive.git',
    zip: 'https://github.com/mohammadgolamrabbii/English-Fonts-Mega-Archive/archive/refs/tags/v1.0.0.zip'
  },
  arabic: {
    name: 'Arabic & Islamic Typography Mega Archive (13,856+ Fonts)',
    repo: 'https://github.com/mohammadgolamrabbii/Arabic-Fonts-Mega-Archive.git',
    zip: 'https://github.com/mohammadgolamrabbii/Arabic-Fonts-Mega-Archive/archive/refs/tags/v1.0.0.zip'
  },
  hindi: {
    name: 'Hindi & Devanagari Fonts Mega Archive (6,009+ Fonts)',
    repo: 'https://github.com/mohammadgolamrabbii/Hindi-Fonts-Mega-Archive.git',
    zip: 'https://github.com/mohammadgolamrabbii/Hindi-Fonts-Mega-Archive/archive/refs/tags/v1.0.0.zip'
  },
  german: {
    name: 'German Fonts Mega Archive (5,000 Fonts)',
    repo: 'https://github.com/mohammadgolamrabbii/German-Fonts-Mega-Archive.git',
    zip: 'https://github.com/mohammadgolamrabbii/German-Fonts-Mega-Archive/archive/refs/tags/v1.0.0.zip'
  },
  icons: {
    name: 'Icons & Vector Symbols Typography (225+ Fonts)',
    repo: 'https://github.com/mohammadgolamrabbii/Icons-and-Symbols-Fonts.git',
    zip: 'https://github.com/mohammadgolamrabbii/Icons-and-Symbols-Fonts/archive/refs/tags/v1.0.0.zip'
  }
};

const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'help';

console.log('\n🌍 get-openfonts CLI — World\'s Largest Open Typography Vault (80,000+ Fonts)');
console.log('Maintained by Mohammad Golamrabbii (https://linktr.ee/golamrabbii)\n');

if (command === 'list') {
  console.log('Available Font Collections:');
  for (const [key, val] of Object.entries(collections)) {
    console.log(`  * ${key.padEnd(8)} : ${val.name}`);
  }
  console.log('\nUsage:');
  console.log('  npx get-openfonts download <collection>   # Download release ZIP');
  console.log('  npx get-openfonts clone <collection>      # Shallow git clone');
  console.log('  npx get-openfonts install-linux <collection> # Install & refresh font cache\n');
} else if (command === 'download') {
  const target = args[1] ? args[1].toLowerCase() : null;
  if (!target || !collections[target]) {
    console.error('Error: Please specify a valid collection name (bangla, english, arabic, hindi, german, icons).');
    process.exit(1);
  }
  const item = collections[target];
  console.log(`Downloading official v1.0.0 ZIP for ${item.name}...`);
  console.log(`Direct URL: ${item.zip}`);
  try {
    execSync(`curl -L "${item.zip}" -o "${target}-fonts-v1.0.0.zip"`, { stdio: 'inherit' });
    console.log(`\n✓ Downloaded successfully: ${target}-fonts-v1.0.0.zip`);
  } catch (e) {
    console.log('Please download directly via browser:', item.zip);
  }
} else if (command === 'clone') {
  const target = args[1] ? args[1].toLowerCase() : null;
  if (!target || !collections[target]) {
    console.error('Error: Please specify a valid collection name (bangla, english, arabic, hindi, german, icons).');
    process.exit(1);
  }
  const item = collections[target];
  console.log(`Cloning ${item.name}...`);
  execSync(`git clone --depth 1 ${item.repo} ${target}-fonts`, { stdio: 'inherit' });
  console.log(`\n✓ Cloned into ./${target}-fonts`);
} else {
  console.log('Usage:');
  console.log('  npx get-openfonts list                   # Show all collections');
  console.log('  npx get-openfonts download <name>        # Download 1-click ZIP (e.g. bangla, english)');
  console.log('  npx get-openfonts clone <name>           # Clone repo into local folder');
  console.log('  Browse web previewer: https://mohammadgolamrabbii.github.io/typography/\n');
}
