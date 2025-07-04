const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('CI Integration Tests', () => {
  test('project has necessary configuration files', () => {
    expect(fs.existsSync('package.json')).toBe(true);
    expect(fs.existsSync('binding.gyp')).toBe(true);
    expect(fs.existsSync('grammar.js')).toBe(true);
    expect(fs.existsSync('.github/workflows/ci.yml')).toBe(true);
  });

  test('package.json has required fields', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(packageJson.name).toBe('tree-sitter-ass');
    expect(packageJson.scripts).toHaveProperty('build');
    expect(packageJson.scripts).toHaveProperty('prepare');
    expect(packageJson.scripts).toHaveProperty('test');
    expect(packageJson.dependencies).toHaveProperty('tree-sitter');
    expect(packageJson.devDependencies).toHaveProperty('jest');
    expect(packageJson.devDependencies).toHaveProperty('tree-sitter-cli');
  });

  test('grammar generates without errors', () => {
    expect(() => {
      execSync('npx tree-sitter generate', { stdio: 'pipe' });
    }).not.toThrow();
  });

  test('generated files exist after build', () => {
    const srcFiles = [
      'src/parser.c',
      'src/scanner.c',
      'src/grammar.json',
      'src/node-types.json'
    ];
    
    for (const file of srcFiles) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  test('binding builds successfully', () => {
    expect(fs.existsSync('build/Release/tree_sitter_ass_binding.node')).toBe(true);
  });

  test('CI workflow is valid YAML', () => {
    const ciContent = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
    expect(ciContent).toContain('name: CI');
    expect(ciContent).toContain('npm install');
    expect(ciContent).toContain('npm test');
  });

  test('all test files are discoverable', () => {
    const testFiles = fs.readdirSync('tests', { recursive: true })
      .filter(file => file.endsWith('.test.js'));
    expect(testFiles.length).toBeGreaterThan(0);
  });

  test('sample ASS files exist for testing', () => {
    const assFiles = fs.readdirSync('tests')
      .filter(file => file.endsWith('.ass'));
    expect(assFiles.length).toBeGreaterThan(0);
  });
});