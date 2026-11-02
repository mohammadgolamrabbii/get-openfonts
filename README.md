# ⚡ get-openfonts CLI (v3.0.0)
> **The Universal Cross-Platform Command-Line Font Manager for 400,237+ Verified Open-Source Typefaces across 100 Sovereign Script Vaults.**

[![NPM Version](https://img.shields.io/badge/version-3.0.0-blue.svg?style=for-the-badge)](https://github.com/mohammadgolamrabbii/get-openfonts)
[![Total Fonts](https://img.shields.io/badge/Verified%20Fonts-400%2C237%2B-gold.svg?style=for-the-badge)](https://github.com/Open-Typography-Foundation/100-Sovereign-Fonts-Vaults)
[![Sovereign Vaults](https://img.shields.io/badge/Script%20Vaults-100-brightgreen.svg?style=for-the-badge)](https://github.com/Open-Typography-Foundation/100-Sovereign-Fonts-Vaults)
[![Platforms](https://img.shields.io/badge/Platforms-Linux%20%7C%20macOS%20%7C%20Windows-blueviolet.svg?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT%20%2F%20SIL%20OFL-green.svg?style=for-the-badge)](LICENSE)

Architected & Curated by **[Mohammad Golamrabbii](https://linktr.ee/golamrabbii)**  
Founder & Executive Director, **[Open Typography Foundation](https://github.com/Open-Typography-Foundation)**  
Live Interactive Specimen Studio: **[mohammadgolamrabbii.github.io/typography](https://mohammadgolamrabbii.github.io/typography/)**

---

## 🚀 Instant Usage (Zero Installation Required via NPX)

No need to install globally! Run directly in your terminal:

```bash
# 1. Search for any language, script, or style
npx get-openfonts search bangla
npx get-openfonts search arabic
npx get-openfonts search monospace

# 2. 1-Click Install directly into your OS font directory (Linux, macOS, Windows)
npx get-openfonts install bangla      # Installs 7,796+ Bangla fonts
npx get-openfonts install arabic      # Installs 29,427+ Arabic & Islamic fonts
npx get-openfonts install hindi       # Installs 12,933+ Devanagari fonts
npx get-openfonts install coding      # Installs 7,116+ Developer Monospace fonts

# 3. Download high-speed ZIP archive to current folder
npx get-openfonts download 01
npx get-openfonts download german
npx get-openfonts download khmer

# 4. View all 100 Sovereign Vaults
npx get-openfonts list

# 5. Open interactive web font tester in browser
npx get-openfonts web
```

---

## 📦 Global Installation (Optional)

Install once to get the `openfonts` and `get-openfonts` aliases available everywhere:

```bash
npm install -g get-openfonts
```

Now you can run:
```bash
openfonts search cyrillic
openfonts install cyrillic
openfonts info 10
```

---

## 💻 Cross-Platform OS Auto-Installation Details

The `install` command automatically detects your operating system and places the fonts into the correct system directory:

| Operating System | Target Installation Directory | Font Cache Refresh |
| :--- | :--- | :--- |
| 🐧 **Linux** | `~/.local/share/fonts/OpenTypography/<Vault>` | Automatically executes `fc-cache -f` |
| 🍏 **macOS** | `~/Library/Fonts/OpenTypography/<Vault>` | Immediately available in Font Book |
| 🪟 **Windows** | `%LOCALAPPDATA%\Microsoft\Windows\Fonts\OpenTypography\<Vault>` | Available in system apps |

---

## 🏛️ Comprehensive Sovereign Vault Coverage (400,237+ Fonts)

`get-openfonts` provides direct access to 100 sovereign script vaults:

* 🇧🇩 **Bangla & Assamese (`bangla`, `01`):** 7,796+ typefaces (Unicode & Bijoy ANSI)
* 🇬🇧 **English & Modern Latin (`english`, `02`):** 198,347+ fonts (Serif, Sans, Display, Vintage)
* 🕌 **Arabic & Islamic (`arabic`, `03`):** 29,427+ fonts (Naskh, Thuluth, Kufic, Ruq'ah)
* 🇮🇳 **Hindi & Classical Devanagari (`hindi`, `07`):** 12,933+ fonts (Kruti Dev, DevLys, Poppins)
* 🇩🇪 **German Fraktur & Blackletter (`german`, `08`):** 10,283+ fonts (Gebrochene Schriften)
* 🇷🇺 **Cyrillic & Slavic (`cyrillic`, `10`):** 20,855+ fonts (Russian, Ukrainian, Serbian)
* 💻 **Developer & Monospace (`coding`, `16`):** 7,116+ fonts (Fira Code, JetBrains, Cascadia)
* 🏛️ **Dravidian Indic (`dravidian`, `17`):** 1,612+ fonts (Tamil, Telugu, Malayalam, Kannada)
* 🇰🇭 **Khmer Angkor (`khmer`, `22`):** 1,244+ fonts
* 🇱🇦 **Lao Lan Xang (`lao`, `25`):** 1,155+ fonts
* 🇬🇪 **Georgian Mkhedruli (`georgian`, `27`):** 634+ fonts
* 🇦🇲 **Armenian Haykakan (`armenian`, `28`):** 724+ fonts
* 🇲🇳 **Mongolian Classical (`mongolian`, `29`):** 109+ vertical typefaces
* 🇮🇩 **Javanese Aksara Jawa (`javanese`, `30`):** 90+ heritage typefaces
* 🇲🇻 **Thaana Dhivehi (`thaana`, `36`):** 113+ Maldivian typefaces
* 🪶 **Chakma Ajha Path (`chakma`, `37`):** 64+ indigenous typefaces
* 📜 **Sylheti Nagri (`sylheti`, `38`):** 70+ historical typefaces
* 🏛️ **Meetei Mayek (`meetei`, `39`):** 160+ Manipuri typefaces
* ⚔️ **Gurmukhi Punjabi (`gurmukhi`, `42`):** 410+ Khalsa typefaces
* 🏹 **Santali Ol Chiki (`santali`, `44`):** 130+ Adivasi typefaces
* 🇪🇬 **Coptic Liturgical (`coptic`, `51`):** 70+ Alexandrian typefaces
* ⵣ **Tifinagh Amazigh (`tifinagh`, `52`):** 241+ North African Berber typefaces
* *...and 80+ additional ancient, classical, and indigenous scripts.*

---

## 📖 Command Reference Guide

```
Usage: get-openfonts <command> [options]

Commands:
  list                  List all 100 sovereign script vaults and font counts
  search <query>        Search scripts, languages, or aliases (e.g. "arabic", "fraktur")
  info <name_or_id>     Display rich vault metadata, verified counts, and mirror links
  install <name_or_id>  1-Click download and auto-install into your OS font directory
  download <name_or_id> Download clean ZIP archive directly via high-speed CDN
  clone <name_or_id>    Shallow git clone repository into local folder
  web                   Open interactive web specimen browser in default browser
  version               Display current CLI version and foundation statistics
  help                  Display command help and usage examples
```

---

## ⚖️ Open-Source Permissive Licensing
All code in `get-openfonts` is licensed under the **[MIT License](LICENSE)**.  
All typography collections curated and provided by the Open Typography Foundation are 100% free under permissive open-source licenses (**SIL Open Font License 1.1**, **Apache 2.0**, **Ubuntu Font License**, and **Public Domain**).
