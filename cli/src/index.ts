#!/usr/bin/env bun
import { readFile, writeFile, readdir, stat, mkdir, copyFile, rm, appendFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const NIXTRIX_DIR = process.env.NIXTRIX_DIR || path.join(process.env.HOME || '', 'Projects/nixtrix');
const MANIFEST_PATH = path.join(NIXTRIX_DIR, 'src/lib/packages/manifest.json');
const VERSION = '1.0.0';

interface Manifest {
  components: Record<string, { path: string; description: string }>;
  routes: Record<string, { path: string; description: string }>;
  libs: Record<string, { path: string; description: string }>;
}

function getManifest(): Manifest {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`Error: Manifest not found at ${MANIFEST_PATH}`);
    console.error(`Set NIXTRIX_DIR environment variable to your NixTrix path.`);
    process.exit(1);
  }
  return JSON.parse(require('fs').readFileSync(MANIFEST_PATH, 'utf-8'));
}

function getPackageType(pkg: string, manifest: Manifest): 'components' | 'routes' | 'libs' | null {
  if (manifest.components?.[pkg]) return 'components';
  if (manifest.routes?.[pkg]) return 'routes';
  if (manifest.libs?.[pkg]) return 'libs';
  return null;
}

function getPackagePath(type: string, pkg: string): string {
  return path.join(NIXTRIX_DIR, 'src/lib/packages', type, pkg);
}

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

function findLayoutFile(): string | null {
  const candidates = [
    'src/routes/+layout.svelte',
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function capitalize(str: string): string {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

async function injectIntoLayout(pkg: string, type: string): Promise<boolean> {
  const layoutPath = findLayoutFile();
  
  if (!layoutPath) {
    console.log('No +layout.svelte found. Skipping auto-injection.');
    return false;
  }

  console.log(`\nFound ${layoutPath}. How would you like to add ${pkg}?`);
  console.log('  1) Auto-inject (add import and render)');
  console.log('  2) Helper comments (<!-- nixtrix:import -->)');
  console.log('  3) Manual (show instructions only)');
  console.log('  4) Skip (no layout integration)');
  console.log('');
  
  const readline = await import('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  const answer = await new Promise<string>(resolve => {
    rl.question('Choose (1-4) [1]: ', (a) => {
      rl.close();
      resolve(a.trim() || '1');
    });
  });
  
  if (answer === '1') {
    return await autoInject(layoutPath, pkg, type);
  } else if (answer === '2') {
    return await helperCommentInject(layoutPath, pkg, type);
  } else if (answer === '3') {
    showManualInstructions(pkg, type);
    return false;
  } else {
    console.log('Skipped layout injection.');
    return false;
  }
}

function showManualInstructions(pkg: string, type: string) {
  const importName = capitalize(pkg);
  const importPath = type === 'routes' 
    ? `./${pkg}` 
    : `$lib/${type}/${pkg}`;
  
  console.log(`\n=== Manual Setup for ${pkg} ===`);
  console.log(`Add to your +layout.svelte:`);
  console.log(`  <script>`);
  console.log(`    import ${importName} from '${importPath}';`);
  console.log(`  </script>`);
  console.log(`  <${importName} />`);
  console.log('================================\n');
}

async function autoInject(layoutPath: string, pkg: string, type: string): Promise<boolean> {
  try {
    let content = await readFile(layoutPath, 'utf-8');
    const importName = capitalize(pkg);
    const importPath = type === 'routes' 
      ? `./${pkg}` 
      : `$lib/${type}/${pkg}`;
    
    const importStmt = `import ${importName} from '${importPath}';`;
    const componentTag = `<${importName} />`;
    
    if (!content.includes(importStmt)) {
      const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
      if (scriptMatch) {
        let scriptContent = scriptMatch[1];
        if (scriptContent.includes('$props()') || scriptContent.includes('$state') || scriptContent.includes('$derived')) {
          const propsMatch = scriptContent.match(/let\s+\{([^}]+)\}\s*=\s*\$props\(\)/);
          if (propsMatch) {
            const existing = propsMatch[1];
            if (!existing.includes('children')) {
              scriptContent = scriptContent.replace(
                `let { ${existing} } = $props()`,
                `let { ${existing}, children } = $props()`
              );
            }
          }
        }
        content = content.replace(
          scriptMatch[0],
          `<script>\n${scriptContent.trim()}\n\t${importStmt}\n</script>`
        );
      } else {
        content = `<script>\n\t${importStmt}\n</script>\n\n` + content;
      }
    } else {
      console.log('Import already exists.');
    }
    
    if (!content.includes(componentTag)) {
      if (content.includes('<slot />')) {
        content = content.replace('<slot />', `${componentTag}\n\t<slot />`);
      } else if (content.includes('{@render children()}')) {
        content = content.replace('{@render children()}', `${componentTag}\n\t{@render children()}`);
      } else {
        content = content + `\n\n${componentTag}`;
      }
    } else {
      console.log('Component already rendered.');
    }
    
    await writeFile(layoutPath, content, 'utf-8');
    console.log(`✓ Added import and component to ${layoutPath}`);
    return true;
  } catch (err) {
    console.error('Failed to inject:', err);
    return false;
  }
}

async function helperCommentInject(layoutPath: string, pkg: string, type: string): Promise<boolean> {
  try {
    let content = await readFile(layoutPath, 'utf-8');
    const marker = `<!-- nixtrix:${pkg} -->`;
    
    if (content.includes(marker)) {
      console.log('Marker already exists.');
    } else {
      const importName = capitalize(pkg);
      const importPath = type === 'routes' 
        ? `./${pkg}` 
        : `$lib/${type}/${pkg}`;
      
      const comment = `
<!-- nixtrix:${pkg}:import -->
<script>
  import ${importName} from '${importPath}';
</script>
<!-- nixtrix:${pkg}:render -->
<${importName} />
<!-- nixtrix:end -->`;
      
      const slotMatch = content.match(/<slot\s*\/>/);
      if (slotMatch) {
        content = content.replace(slotMatch, `${comment}\n\t<slot />`);
      } else {
        content = content.replace(/(<[a-z]+[^>]*>)/i, `$1\n\t${comment}`);
      }
      
      await writeFile(layoutPath, content, 'utf-8');
      console.log(`✓ Added helper comments to ${layoutPath}`);
    }
    return true;
  } catch (err) {
    console.error('Failed to inject:', err);
    return false;
  }
}

async function add(pkg: string) {
  const manifest = getManifest();
  const type = getPackageType(pkg, manifest);
  
  if (!type) {
    console.error(`Error: Package '${pkg}' not found.`);
    console.error('Run "nixtrix list" to see available packages.');
    process.exit(1);
  }
  
  const srcPath = getPackagePath(type, pkg);
  
  if (!existsSync(srcPath)) {
    console.error(`Error: Package source not found at ${srcPath}`);
    process.exit(1);
  }
  
  let destPath: string;
  if (type === 'routes') {
    destPath = path.join('src/routes', pkg);
  } else if (type === 'components') {
    destPath = path.join('src/lib/components', pkg);
  } else {
    destPath = path.join('src/lib', pkg);
  }
  
  console.log(`Adding ${pkg} (${type})...`);
  
  await ensureDir(destPath);
  
  const files = await readdir(srcPath);
  for (const file of files) {
    const srcFile = path.join(srcPath, file);
    const destFile = path.join(destPath, file);
    const fileStat = await stat(srcFile);
    
    if (fileStat.isDirectory()) {
      await ensureDir(destFile);
      await copyDir(srcFile, destFile);
    } else {
      await copyFile(srcFile, destFile);
    }
  }
  
  console.log(`✓ Copied to ${destPath}/`);
  
  if (type === 'components' || type === 'routes') {
    await injectIntoLayout(pkg, type);
  }
}

async function copyDir(src: string, dest: string) {
  await ensureDir(dest);
  const entries = await readdir(src);
  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const fileStat = await stat(srcPath);
    if (fileStat.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function remove(pkg: string) {
  const manifest = getManifest();
  const type = getPackageType(pkg, manifest);
  
  if (!type) {
    console.error(`Error: Package '${pkg}' not found.`);
    process.exit(1);
  }
  
  let destPath: string;
  if (type === 'routes') {
    destPath = path.join('src/routes', pkg);
  } else if (type === 'components') {
    destPath = path.join('src/lib/components', pkg);
  } else {
    destPath = path.join('src/lib', pkg);
  }
  
  if (!existsSync(destPath)) {
    console.log(`Package ${pkg} not found in project.`);
    return;
  }
  
  await rm(destPath, { recursive: true });
  console.log(`✓ Removed from ${destPath}/`);
}

function list() {
  const manifest = getManifest();
  
  console.log('Available packages:\n');
  
  if (manifest.components) {
    console.log('Components:');
    for (const [name, info] of Object.entries(manifest.components)) {
      console.log(`  ${name} - ${info.description}`);
    }
    console.log('');
  }
  
  if (manifest.routes) {
    console.log('Routes:');
    for (const [name, info] of Object.entries(manifest.routes)) {
      console.log(`  ${name} - ${info.description}`);
    }
    console.log('');
  }
  
  if (manifest.libs) {
    console.log('Libraries:');
    for (const [name, info] of Object.entries(manifest.libs)) {
      console.log(`  ${name} - ${info.description}`);
    }
  }
}

async function upgrade() {
  const cliPath = process.argv[1];
  const cliDir = path.dirname(cliPath);
  
  console.log('Upgrading nixtrix CLI...');
  
  try {
    const { execSync } = require('child_process');
    
    const tmpDir = '/tmp/nixtrix-upgrade';
    execSync(`rm -rf ${tmpDir} && git clone --depth 1 https://github.com/maietta/nixtrix.git ${tmpDir}`, { stdio: 'inherit' });
    
    const newCliSrc = path.join(tmpDir, 'cli/src/index.ts');
    const currentCliSrc = cliPath;
    
    await copyFile(newCliSrc, currentCliSrc);
    
    console.log('✓ Upgraded to latest version!');
    console.log(`   Run "bun nixtrix --version" to verify.`);
    
    execSync(`rm -rf ${tmpDir}`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to upgrade:', err);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
NixTrix - SvelteKit Package Manager v${VERSION}

Usage: nixtrix <command> [options]

Commands:
  list              List available packages
  add <package>     Add a package to your project
  remove <package>  Remove a package from your project
  upgrade           Upgrade nixtrix CLI to latest version

Options:
  --version, -v     Show version number
  --help, -h        Show this help message

Examples:
  nixtrix list
  nixtrix add sticky-header
  nixtrix add blog
  nixtrix remove sticky-header
  nixtrix upgrade
`);
    process.exit(0);
  }
  
  if (args[0] === '--version' || args[0] === '-v') {
    console.log(`nixtrix v${VERSION}`);
    process.exit(0);
  }
  
  const cmd = args[0];
  
  switch (cmd) {
    case 'list':
    case 'ls':
      list();
      break;
    case 'add':
      if (!args[1]) {
        console.error('Error: Package name required.');
        console.error('Usage: nixtrix add <package>');
        process.exit(1);
      }
      await add(args[1]);
      break;
    case 'remove':
    case 'rm':
      if (!args[1]) {
        console.error('Error: Package name required.');
        console.error('Usage: nixtrix remove <package>');
        process.exit(1);
      }
      await remove(args[1]);
      break;
    case 'upgrade':
    case 'up':
      await upgrade();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Run "nixtrix" for usage information.');
      process.exit(1);
  }
}

main().catch(console.error);
