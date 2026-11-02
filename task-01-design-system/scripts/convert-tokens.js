/**
 * convert-tokens.js
 * 
 * Design System Token Converter:
 * Converts DTCG-compliant tokens JSON (e.g. evidence/tokens-complete.json) into CSS custom properties (variables).
 * 
 * Architecture Principles:
 * 1. Primitive colors (foundational palette) are declared on :root as base tokens (--primitive-*).
 *    - NOT to be used directly on the UI components.
 * 2. Color roles (semantic design tokens) are declared on :root, [data-theme="light"] and [data-theme="dark"].
 *    - Color roles map directly to primitive tokens using var(--primitive-*).
 *    - ONLY color roles are used directly on the UI, enabling seamless theme switching.
 * 3. Typography and Effect (Shadow) styles are converted into standard CSS variables and utilities.
 * 4. The JSON token file remains the single source of truth.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Helper to convert arbitrary string to kebab-case
function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
}

function formatToneVar(prefix, toneKey) {
  const toneNumMatch = toneKey.match(/(\d+)$/);
  if (toneNumMatch) {
    return `--primitive-${prefix}-${toneNumMatch[1]}`;
  }
  return `--primitive-${prefix}-${toKebabCase(toneKey)}`;
}

/**
 * Converts letter spacing from % to em (-2% = -0.02em, 0% = 0)
 */
function formatLetterSpacing(val) {
  if (typeof val === 'string' && val.endsWith('%')) {
    const num = parseFloat(val);
    if (num === 0) return '0';
    return `${num / 100}em`;
  }
  if (val === 0 || val === '0' || val === '0%') return '0';
  return val;
}

/**
 * Converts line height from percentage to unitless number (120% = 1.2, 140% = 1.4)
 */
function formatLineHeight(val) {
  if (typeof val === 'string' && val.endsWith('%')) {
    const num = parseFloat(val);
    return `${num / 100}`;
  }
  return val;
}

/**
 * Resolves a token reference like:
 * "{Primitive colors.Color Palette.Primary.primary40}"
 * into its corresponding CSS variable name, e.g. "var(--primitive-primary-40)".
 * 
 * Throws an explicit error if the reference cannot be found.
 */
function createTokenResolver(primitiveMap, roleMap) {
  return function resolveRef(refString) {
    if (typeof refString !== 'string') return refString;
    const match = refString.match(/^\{(.+)\}$/);
    if (!match) return refString;

    const tokenPath = match[1];

    if (primitiveMap.has(tokenPath)) {
      return `var(${primitiveMap.get(tokenPath)})`;
    }
    if (roleMap.has(tokenPath)) {
      return `var(${roleMap.get(tokenPath)})`;
    }

    throw new Error(`Token reference could not be found: "${refString}" (path: "${tokenPath}")`);
  };
}

export function convertTokensToCss(tokensJson) {
  const primitiveMap = new Map(); // path -> css var name
  const roleMap = new Map();      // path -> css var name

  const primitiveCssVars = [];
  const lightRoleVars = [];
  const darkRoleVars = [];
  const typographyVars = [];
  const typographyUtilityClasses = [];
  const shadowVars = [];

  // ==========================================
  // 1. Traverse & Collect Primitive Colors
  // ==========================================
  const primitiveColors = tokensJson['Primitive colors'] || {};

  // 1a. Key Colors
  if (primitiveColors['Key colors']) {
    primitiveCssVars.push('  /* Key Colors (Source Anchors) */');
    for (const [key, token] of Object.entries(primitiveColors['Key colors'])) {
      const varName = `--primitive-key-${toKebabCase(key.replace(/ key color$/i, ''))}`;
      const jsonPath = `Primitive colors.Key colors.${key}`;
      primitiveMap.set(jsonPath, varName);
      primitiveCssVars.push(`  ${varName}: ${token.$value};`);
    }
    primitiveCssVars.push('');
  }

  // 1b. Color Palette
  if (primitiveColors['Color Palette']) {
    const palette = primitiveColors['Color Palette'];

    const processPaletteGroup = (groupName, groupObj, prefix) => {
      primitiveCssVars.push(`  /* ${groupName} Tonal Palette */`);
      for (const [toneKey, token] of Object.entries(groupObj)) {
        const varName = formatToneVar(prefix, toneKey);
        const jsonPath = `Primitive colors.Color Palette.${groupName}.${toneKey}`;
        primitiveMap.set(jsonPath, varName);
        primitiveCssVars.push(`  ${varName}: ${token.$value};`);
      }
      primitiveCssVars.push('');
    };

    if (palette['Primary']) {
      processPaletteGroup('Primary', palette['Primary'], 'primary');
    }
    if (palette['Neutral Variant']) {
      processPaletteGroup('Neutral Variant', palette['Neutral Variant'], 'neutral-variant');
    }
    if (palette['Neutral']) {
      processPaletteGroup('Neutral', palette['Neutral'], 'neutral');
    }

    if (palette['Function Colors']) {
      const funcColors = palette['Function Colors'];
      for (const [funcName, tones] of Object.entries(funcColors)) {
        primitiveCssVars.push(`  /* Functional Palette: ${funcName} */`);
        for (const [toneKey, token] of Object.entries(tones)) {
          const varName = formatToneVar(toKebabCase(funcName), toneKey);
          const jsonPath = `Primitive colors.Color Palette.Function Colors.${funcName}.${toneKey}`;
          primitiveMap.set(jsonPath, varName);
          primitiveCssVars.push(`  ${varName}: ${token.$value};`);
        }
        primitiveCssVars.push('');
      }
    }
  }

  // ==========================================
  // 2. Color Roles (Semantic UI Tokens)
  // ==========================================
  const colorRoles = tokensJson['Color roles'] || {};
  const resolver = createTokenResolver(primitiveMap, roleMap);

  for (const [roleName, token] of Object.entries(colorRoles)) {
    const varName = `--color-${toKebabCase(roleName)}`;
    const rolePath = `Color roles.${roleName}`;
    roleMap.set(rolePath, varName);

    const lightModeRef = token.$extensions?.mode?.['Light Mode'] || token.$value;
    const darkModeRef = token.$extensions?.mode?.['Dark Mode'] || token.$value;

    const lightResolved = resolver(lightModeRef);
    const darkResolved = resolver(darkModeRef);

    lightRoleVars.push(`  ${varName}: ${lightResolved};`);
    darkRoleVars.push(`  ${varName}: ${darkResolved};`);
  }

  // ==========================================
  // 3. Effect Styles (Box Shadows)
  // ==========================================
  const effectStyles = tokensJson['Effect-styles'] || {};
  for (const [effectName, token] of Object.entries(effectStyles)) {
    const varName = `--effect-${toKebabCase(effectName)}`;
    if (Array.isArray(token.$value)) {
      const shadowParts = token.$value.map(s => {
        const inset = s.inset ? 'inset ' : '';
        const x = `${s.offsetX.value}${s.offsetX.unit}`;
        const y = `${s.offsetY.value}${s.offsetY.unit}`;
        const blur = `${Math.round(s.blur.value * 10) / 10}${s.blur.unit}`;
        const spread = `${s.spread.value}${s.spread.unit}`;
        const color = resolver(s.color);
        return `${inset}${x} ${y} ${blur} ${spread} ${color}`;
      });
      shadowVars.push(`  ${varName}: ${shadowParts.join(', ')};`);
    }
  }

  // ==========================================
  // 4. Typography Styles
  // ==========================================
  const typoStyles = tokensJson['Typography-styles'] || {};
  for (const [styleName, token] of Object.entries(typoStyles)) {
    const val = token.$value;
    if (!val) continue;

    const prefix = `--typography-${toKebabCase(styleName)}`;
    const genericFamily = val.fontFamily.toLowerCase().includes('sans') 
      ? 'sans-serif' 
      : (val.fontFamily.toLowerCase().includes('sil') ? 'serif' : 'sans-serif');

    const formattedLineHeight = formatLineHeight(val.lineHeight);
    const formattedLetterSpacing = formatLetterSpacing(val.letterSpacing);

    typographyVars.push(`  /* ${styleName} */`);
    typographyVars.push(`  ${prefix}-font-family: '${val.fontFamily}', ${genericFamily};`);
    typographyVars.push(`  ${prefix}-font-weight: ${val.fontWeight};`);
    typographyVars.push(`  ${prefix}-font-style: ${val.fontStyle};`);
    typographyVars.push(`  ${prefix}-font-size: ${val.fontSize.value}${val.fontSize.unit};`);
    typographyVars.push(`  ${prefix}-line-height: ${formattedLineHeight};`);
    typographyVars.push(`  ${prefix}-letter-spacing: ${formattedLetterSpacing};`);
    typographyVars.push('');

    // Utility class representation
    typographyUtilityClasses.push(`.type-${toKebabCase(styleName)} {`);
    typographyUtilityClasses.push(`  font-family: var(${prefix}-font-family);`);
    typographyUtilityClasses.push(`  font-weight: var(${prefix}-font-weight);`);
    typographyUtilityClasses.push(`  font-style: var(${prefix}-font-style);`);
    typographyUtilityClasses.push(`  font-size: var(${prefix}-font-size);`);
    typographyUtilityClasses.push(`  line-height: var(${prefix}-line-height);`);
    typographyUtilityClasses.push(`  letter-spacing: var(${prefix}-letter-spacing);`);
    typographyUtilityClasses.push(`}`);
    typographyUtilityClasses.push('');
  }

  // ==========================================
  // Assemble CSS Document
  // ==========================================
  const css = `/**
 * MyFee Design System - Generated CSS Custom Properties
 * 
 * AUTO-GENERATED from evidence/tokens-complete.json
 * Single Source of Truth for all UI Implementation.
 * 
 * ARCHITECTURE GUIDELINES:
 * 1. PRIMITIVE COLORS (--primitive-*):
 *    These represent raw chromatic and tonal palettes.
 *    DO NOT use primitive colors directly on UI components.
 * 
 * 2. COLOR ROLES (--color-*):
 *    These are semantic tokens with dedicated Light Mode and Dark Mode mappings.
 *    ALWAYS use color roles on UI components.
 * 
 * 3. THEME SWITCHING:
 *    Light mode is applied by default on :root or [data-theme="light"].
 *    Dark mode is triggered by [data-theme="dark"] or prefers-color-scheme: dark.
 */

/* ==========================================================================
   1. Foundational Primitive Colors (Do NOT use directly in UI)
   ========================================================================== */
:root {
${primitiveCssVars.join('\n')}
}

/* ==========================================================================
   2. Semantic Color Roles - Light Mode (Default & [data-theme="light"])
   ========================================================================== */
:root,
[data-theme="light"] {
  color-scheme: light;

${lightRoleVars.join('\n')}
}

/* ==========================================================================
   3. Semantic Color Roles - Dark Mode ([data-theme="dark"] & prefers-color-scheme)
   ========================================================================== */
[data-theme="dark"] {
  color-scheme: dark;

${darkRoleVars.join('\n')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;

${darkRoleVars.join('\n')}
  }
}

/* ==========================================================================
   4. Effect Styles (Box Shadows)
   ========================================================================== */
:root {
  /* Dynamic shadows: colors automatically adjust with current color role */
${shadowVars.join('\n')}
}

/* ==========================================================================
   5. Typography Styles
   ========================================================================== */
:root {
${typographyVars.join('\n')}
}

/* Typography Utility Classes */
${typographyUtilityClasses.join('\n')}
`;

  return css;
}

// CLI Execution Support
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const baseDir = path.resolve(scriptDir, '..'); // task-01-design-system

  const args = process.argv.slice(2);
  const inputPath = args[0] ? path.resolve(process.cwd(), args[0]) : path.resolve(baseDir, 'evidence/tokens-complete.json');
  const outputPath = args[1] ? path.resolve(process.cwd(), args[1]) : path.resolve(baseDir, 'styles/tokens.css');

  console.log(`Reading design tokens from: ${inputPath}`);
  const tokensRaw = fs.readFileSync(inputPath, 'utf8');
  const tokensJson = JSON.parse(tokensRaw);

  const css = convertTokensToCss(tokensJson);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, css, 'utf8');
  console.log(`Successfully generated CSS variables at: ${outputPath}`);
}
