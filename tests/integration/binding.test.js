const fs = require('fs');
const path = require('path');

describe('Tree-sitter ASS Binding Integration', () => {
  test('binding can be loaded', () => {
    expect(() => {
      require('../../build/Release/tree_sitter_ass_binding');
    }).not.toThrow();
  });

  test('binding exports a language object', () => {
    const binding = require('../../build/Release/tree_sitter_ass_binding');
    expect(typeof binding).toBe('object');
    expect(binding).toBeDefined();
  });

  test('index.js can be loaded', () => {
    expect(() => {
      require('../../index.js');
    }).not.toThrow();
  });

  test('index.js exports external object', () => {
    const ass = require('../../index.js');
    expect(typeof ass).toBe('object');
    expect(ass).toBeDefined();
  });

  test('grammar was generated correctly', () => {
    expect(fs.existsSync(path.join(__dirname, '../../src/parser.c'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../../src/scanner.c'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../../src/grammar.json'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../../src/node-types.json'))).toBe(true);
  });

  test('grammar.json is valid', () => {
    const grammarPath = path.join(__dirname, '../../src/grammar.json');
    const grammarContent = fs.readFileSync(grammarPath, 'utf8');
    expect(() => JSON.parse(grammarContent)).not.toThrow();
    
    const grammar = JSON.parse(grammarContent);
    expect(grammar).toHaveProperty('name');
    expect(grammar.name).toBe('ass');
    expect(grammar).toHaveProperty('rules');
  });

  test('node-types.json is valid', () => {
    const nodeTypesPath = path.join(__dirname, '../../src/node-types.json');
    const nodeTypesContent = fs.readFileSync(nodeTypesPath, 'utf8');
    expect(() => JSON.parse(nodeTypesContent)).not.toThrow();
    
    const nodeTypes = JSON.parse(nodeTypesContent);
    expect(Array.isArray(nodeTypes)).toBe(true);
    expect(nodeTypes.length).toBeGreaterThan(0);
  });

  test('scanner.c compiles without errors', () => {
    // The fact that we have a built binding means scanner.c compiled successfully
    const binding = require('../../build/Release/tree_sitter_ass_binding');
    expect(binding).toBeDefined();
  });

  test('parser.c compiles without errors', () => {
    // The fact that we have a built binding means parser.c compiled successfully
    const binding = require('../../build/Release/tree_sitter_ass_binding');
    expect(binding).toBeDefined();
  });

  test('native binding exists and can be required', () => {
    expect(fs.existsSync('build/Release/tree_sitter_ass_binding.node')).toBe(true);
    expect(() => {
      require('../../build/Release/tree_sitter_ass_binding');
    }).not.toThrow();
  });
});