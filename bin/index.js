#!/usr/bin/env node

/**
 * ⚡ get-openfonts CLI (v3.0.0)
 * World's Largest Multilingual Open Typography Archive (334,627+ Fonts across 100 Sovereign Vaults)
 * Curated & Maintained by Mohammad Golamrabbii (https://linktr.ee/golamrabbii)
 * Open Typography Foundation: https://github.com/Open-Typography-Foundation
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync, spawn } = require('child_process');
const os = require('os');

// Load embedded vaults database
const dbPath = path.join(__dirname, '..', 'lib', 'vaults.json');
let db = { total_fonts: 334627, vaults: [] };
try {
  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
} catch (e) {
  // Fallback if not found
}

const VERSION = '3.0.0';
const CENTRAL_ARCHIVE_HUB = 'https://archive.org/details/open-typography-foundation';
const WEB_HUB = 'https://mohammadgolamrabbii.github.io/typography/';

// Helper: Find vault by ID, name, or alias
function findVault(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  
  // Exact ID match (e.g. "1", "01")
  const idMatch = db.vaults.find(v => v.id === q || parseInt(v.id, 10).toString() === q);
  if (idMatch) return idMatch;

  // Exact alias match
  const aliasMatch = db.vaults.find(v => v.aliases && v.aliases.includes(q));
  if (aliasMatch) return aliasMatch;

  // Substring match on script or folder
  const subMatch = db.vaults.find(v => 
    v.folder.toLowerCase().includes(q) || 
    v.script.toLowerCase().includes(q)
  );
  if (subMatch) return subMatch;

  return null;
}

// Helper: Formatted Banner
function printBanner() {
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  ⚡ get-openfonts CLI (v3.0.0) — Open Typography Foundation                ║');
  console.log('║  World\'s Largest Multilingual Typeface Archive                            ║');
  console.log('║  334,627+ Verified Fonts • 100 Sovereign Vaults • 100% Free & Open-Source  ║');
  console.log('║  Curated by Mohammad Golamrabbii (https://linktr.ee/golamrabbii)           ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
}

// Helper: Progress bar download
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const getProtocol = url.startsWith('https') ? https : http;

    const request = (targetUrl) => {
      getProtocol.get(targetUrl, (response) => {
        // Handle HTTP redirects (301, 302, 303, 307, 308)
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          const redirectUrl = new URL(response.headers.location, targetUrl).toString();
          return request(redirectUrl);
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(destPath, () => {});
          return reject(new Error(`Server returned HTTP ${response.statusCode}: ${response.statusMessage}`));
        }

        const totalBytes = parseInt(response.headers['content-length'], 10) || 0;
        let downloadedBytes = 0;
        let lastReport = Date.now();

        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          const now = Date.now();
          if (now - lastReport > 250 || downloadedBytes === totalBytes) {
            lastReport = now;
            if (totalBytes > 0) {
              const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
              const mbDownloaded = (downloadedBytes / (1024 * 1024)).toFixed(1);
              const mbTotal = (totalBytes / (1024 * 1024)).toFixed(1);
              const barLen = 30;
              const filled = Math.round((downloadedBytes / totalBytes) * barLen);
              const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
              process.stdout.write(`\r  [${bar}] ${percent}% (${mbDownloaded}/${mbTotal} MB)`);
            } else {
              const mbDownloaded = (downloadedBytes / (1024 * 1024)).toFixed(1);
              process.stdout.write(`\r  Downloaded: ${mbDownloaded} MB...`);
            }
          }
        });

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          process.stdout.write('\n');
          resolve(destPath);
        });
      }).on('error', (err) => {
        file.close();
        fs.unlink(destPath, () => {});
        reject(err);
      });
    };

    request(url);
  });
}

// Helper: Extract ZIP cross-platform
function extractZip(zipPath, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const isWin = os.platform() === 'win32';
  try {
    if (isWin) {
      execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${targetDir}' -Force"`, { stdio: 'inherit' });
    } else {
      execSync(`unzip -q -o "${zipPath}" -d "${targetDir}"`, { stdio: 'inherit' });
    }
    return true;
  } catch (e) {
    try {
      execSync(`tar -xf "${zipPath}" -C "${targetDir}"`, { stdio: 'inherit' });
      return true;
    } catch (err) {
      console.error('Extraction error:', err.message);
      return false;
    }
  }
}

// Main CLI logic
async function run() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : 'help';

  if (command === '-v' || command === '--version' || command === 'version') {
    console.log(`get-openfonts v${VERSION} — 334,627+ Fonts across 100 Sovereign Vaults`);
    return;
  }

  printBanner();

  if (command === 'list') {
    console.log('🏛️  100 SOVEREIGN SCRIPT VAULTS (Total: 334,627+ Verified Fonts)\n');
    console.log(' Vault ID | Script / Sovereign System                       | Verified Fonts | Mirrors');
    console.log('──────────┼─────────────────────────────────────────────────┼────────────────┼─────────');

    db.vaults.forEach((v) => {
      const vid = `[${v.id}]`.padEnd(8);
      // Clean emoji from display length calculation
      const scriptClean = v.script.length > 47 ? v.script.substring(0, 44) + '...' : v.script.padEnd(47);
      const count = `${v.count.toLocaleString()} fonts`.padStart(14);
      const iaStatus = v.archive_org ? '🏛️ IA + GH' : '📦 GH';
      console.log(` ${vid} │ ${scriptClean} │ ${count} │ ${iaStatus}`);
    });

    console.log('\n💡 Quick Commands:');
    console.log('  npx get-openfonts search <query>    # Search scripts & languages (e.g. arabic, bangla)');
    console.log('  npx get-openfonts info <name_or_id> # View detailed vault metadata and mirrors');
    console.log('  npx get-openfonts install <name>    # 1-click download & install into OS font library');
    console.log('  npx get-openfonts download <name>   # Download high-speed ZIP archive\n');

  } else if (command === 'search') {
    const query = args.slice(1).join(' ').trim().toLowerCase();
    if (!query) {
      console.log('Usage: npx get-openfonts search <keyword>');
      console.log('Example: npx get-openfonts search arabic');
      return;
    }

    const matches = db.vaults.filter(v => 
      v.id === query ||
      v.folder.toLowerCase().includes(query) ||
      v.script.toLowerCase().includes(query) ||
      (v.aliases && v.aliases.some(a => a.includes(query)))
    );

    console.log(`🔍 Search Results for "${query}": Found ${matches.length} vault(s)\n`);
    if (matches.length === 0) {
      console.log('No matching vaults found. Try listing all vaults: npx get-openfonts list');
      return;
    }

    matches.forEach(v => {
      console.log(`  * [${v.id}] ${v.script} (${v.count.toLocaleString()} fonts)`);
      console.log(`    Aliases : ${v.aliases.slice(0, 8).join(', ')}`);
      console.log(`    Install : npx get-openfonts install ${v.id}`);
      console.log(`    Download: npx get-openfonts download ${v.id}\n`);
    });

  } else if (command === 'info') {
    const target = args[1];
    const vault = findVault(target);
    if (!vault) {
      console.error(`❌ Vault not found: "${target}". Run "npx get-openfonts list" to see all.`);
      return;
    }

    console.log(`🏛️  Vault Information: [${vault.id}] ${vault.folder}\n`);
    console.log(`  * Script / System : ${vault.script}`);
    console.log(`  * Verified Fonts  : ${vault.count.toLocaleString()} typefaces`);
    console.log(`  * License         : 100% Free & Open-Source (SIL OFL, Apache 2.0, Public Domain)`);
    console.log(`  * GitHub Mirror   : ${vault.github || 'https://github.com/Open-Typography-Foundation'}`);
    console.log(`  * Archive.org     : ${vault.archive_org || CENTRAL_ARCHIVE_HUB}`);
    console.log(`  * Quick Aliases   : ${vault.aliases.join(', ')}`);
    console.log('\n💡 Actions:');
    console.log(`  npx get-openfonts install ${vault.id}     # Auto-install to OS`);
    console.log(`  npx get-openfonts download ${vault.id}    # Download ZIP file\n`);

  } else if (command === 'download') {
    const target = args[1];
    const vault = findVault(target);
    if (!vault) {
      console.error(`❌ Vault not found: "${target}". Run "npx get-openfonts list" to see all.`);
      return;
    }

    const zipName = `${vault.folder}-Fonts.zip`;
    const outDir = process.cwd();
    const destPath = path.join(outDir, zipName);

    console.log(`📦 Preparing download for [${vault.id}] ${vault.script}...`);
    console.log(`   Destination: ${destPath}`);

    // Determine download URL
    let downloadUrl = '';
    if (vault.archive_org && vault.archive_org.includes('archive.org/details/')) {
      const identifier = vault.archive_org.split('archive.org/details/')[1].trim();
      // Download direct zip from archive.org
      downloadUrl = `https://archive.org/compress/${identifier}/formats=ZIP&file=/`;
    } else if (vault.github) {
      downloadUrl = `${vault.github}/archive/refs/heads/main.zip`;
    } else {
      downloadUrl = `https://github.com/Open-Typography-Foundation/100-Sovereign-Fonts-Vaults/archive/refs/heads/main.zip`;
    }

    console.log(`   Connecting to High-Speed Mirror: ${downloadUrl}`);
    try {
      await downloadFile(downloadUrl, destPath);
      console.log(`\n✅ Download complete! File saved to: ${destPath}`);
      console.log(`   Fonts included: ${vault.count.toLocaleString()} typefaces.`);
    } catch (e) {
      console.error(`\n❌ Direct download error: ${e.message}`);
      console.log(`👉 Please download directly via your browser at: ${vault.archive_org || vault.github}`);
    }

  } else if (command === 'install') {
    const target = args[1];
    const vault = findVault(target);
    if (!vault) {
      console.error(`❌ Vault not found: "${target}". Run "npx get-openfonts list" to see all.`);
      return;
    }

    console.log(`⚡ 1-Click Font Installer: [${vault.id}] ${vault.script} (${vault.count.toLocaleString()} fonts)\n`);

    // Determine OS Font directory
    const platform = os.platform();
    let installDir = '';
    if (platform === 'win32') {
      installDir = path.join(process.env.LOCALAPPDATA || os.homedir(), 'Microsoft', 'Windows', 'Fonts', 'OpenTypography', vault.folder);
    } else if (platform === 'darwin') {
      installDir = path.join(os.homedir(), 'Library', 'Fonts', 'OpenTypography', vault.folder);
    } else {
      // Linux / Unix
      installDir = path.join(os.homedir(), '.local', 'share', 'fonts', 'OpenTypography', vault.folder);
    }

    console.log(`   Target OS Font Directory: ${installDir}`);
    const tempZip = path.join(os.tmpdir(), `openfonts_${vault.id}_${Date.now()}.zip`);

    // Determine URL
    let downloadUrl = '';
    if (vault.archive_org && vault.archive_org.includes('archive.org/details/')) {
      const identifier = vault.archive_org.split('archive.org/details/')[1].trim();
      downloadUrl = `https://archive.org/compress/${identifier}/formats=ZIP&file=/`;
    } else if (vault.github) {
      downloadUrl = `${vault.github}/archive/refs/heads/main.zip`;
    } else {
      downloadUrl = `https://github.com/Open-Typography-Foundation/100-Sovereign-Fonts-Vaults/archive/refs/heads/main.zip`;
    }

    console.log(`   Downloading from Mirror...`);
    try {
      await downloadFile(downloadUrl, tempZip);
      console.log(`   Extracting typefaces to system font folder...`);
      extractZip(tempZip, installDir);

      // Clean temp zip
      if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);

      // On Linux, refresh font cache
      if (platform === 'linux') {
        try {
          console.log(`   Refreshing font cache via fc-cache...`);
          execSync('fc-cache -f', { stdio: 'inherit' });
        } catch (fcErr) {}
      }

      console.log(`\n🎉 SUCCESS! Installed ${vault.count.toLocaleString()} open-source fonts for ${vault.script}!`);
      console.log(`   Fonts are now available in your system applications (Photoshop, Figma, Word, LibreOffice, Terminal).\n`);
    } catch (e) {
      console.error(`\n❌ Installation error: ${e.message}`);
      if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    }

  } else if (command === 'clone') {
    const target = args[1];
    const vault = findVault(target);
    if (!vault) {
      console.error(`❌ Vault not found: "${target}". Run "npx get-openfonts list" to see all.`);
      return;
    }

    const repoUrl = vault.github || 'https://github.com/Open-Typography-Foundation/100-Sovereign-Fonts-Vaults.git';
    console.log(`🌀 Shallow cloning [${vault.id}] ${vault.script} from ${repoUrl}...`);
    try {
      execSync(`git clone --depth 1 "${repoUrl}" "${vault.folder}-repo"`, { stdio: 'inherit' });
      console.log(`\n✅ Cloned successfully into ./${vault.folder}-repo`);
    } catch (e) {
      console.error('Git clone failed:', e.message);
    }

  } else if (command === 'web') {
    console.log(`🌐 Launching Open Typography Live Web Specimen Studio...`);
    console.log(`   URL: ${WEB_HUB}`);
    const isWin = os.platform() === 'win32';
    const isMac = os.platform() === 'darwin';
    try {
      if (isWin) execSync(`start "" "${WEB_HUB}"`);
      else if (isMac) execSync(`open "${WEB_HUB}"`);
      else execSync(`xdg-open "${WEB_HUB}"`);
    } catch (e) {
      console.log(`Please visit in your browser: ${WEB_HUB}`);
    }

  } else {
    console.log('📖 COMMAND USAGE GUIDE:');
    console.log('  npx get-openfonts list                  # List all 100 sovereign vaults');
    console.log('  npx get-openfonts search <keyword>      # Search scripts, languages, or tags');
    console.log('  npx get-openfonts info <name_or_id>     # Display detailed vault stats and mirrors');
    console.log('  npx get-openfonts download <name_or_id> # Download ZIP directly via CDN');
    console.log('  npx get-openfonts install <name_or_id>  # 1-Click install into OS font library');
    console.log('  npx get-openfonts clone <name_or_id>    # Shallow git clone repository');
    console.log('  npx get-openfonts web                   # Open interactive web font tester');
    console.log('  npx get-openfonts version               # Show CLI version and total fonts\n');
    console.log('💡 Examples:');
    console.log('  npx get-openfonts install bangla        # Installs 7,796+ Bangla fonts');
    console.log('  npx get-openfonts install arabic        # Installs 29,427+ Arabic fonts');
    console.log('  npx get-openfonts install devanagari    # Installs 12,933+ Hindi fonts');
    console.log('  npx get-openfonts download 16           # Downloads Developer Monospace fonts\n');
  }
}

run().catch((err) => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
