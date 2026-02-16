#!/usr/bin/env bun
const NIXTRIX_SOURCE = 'https://github.com/maietta/nixtrix/raw/main/cli/src/index.ts';

async function bootstrap() {
  console.log('Bootstrapping nixtrix CLI...\n');
  
  const { existsSync, writeFileSync } = await import('fs');
  const { execSync } = await import('child_process');
  
  const cliPath = 'node_modules/nixtrix/index.ts';
  const packageJsonPath = 'package.json';
  
  console.log('1. Downloading latest CLI...');
  try {
    const response = await fetch(NIXTRIX_SOURCE);
    const content = await response.text();
    
    const dir = cliPath.replace('/index.ts', '');
    execSync(`mkdir -p ${dir}`, { stdio: 'inherit' });
    
    writeFileSync(cliPath, content);
    console.log('   ✓ Downloaded\n');
  } catch (err) {
    console.error('   ✗ Failed to download:', err.message);
    process.exit(1);
  }
  
  console.log('2. Updating package.json...');
  try {
    const pkg = JSON.parse(await import('fs').then(fs => fs.promises.readFile(packageJsonPath, 'utf-8')));
    
    if (!pkg.scripts) pkg.scripts = {};
    pkg.scripts.nixtrix = 'bun node_modules/nixtrix/index.ts';
    
    await import('fs').then(fs => 
      fs.promises.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')
    );
    console.log('   ✓ Updated\n');
  } catch (err) {
    console.error('   ✗ Failed to update package.json:', err.message);
  }
  
  console.log(`
Done! Run:
  bun nixtrix --version   # Check version
  bun nixtrix upgrade    # Upgrade later
  bun nixtrix list       # List packages
`);
}

bootstrap().catch(console.error);
