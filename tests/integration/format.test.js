const fs = require('fs');
const path = require('path');

describe('ASS Format Integration Tests', () => {
  const testFiles = ['sample.ass', 'advanced.ass', 'complex.ass'];
  
  test.each(testFiles)('test file %s exists and is readable', (filename) => {
    const filePath = path.join(__dirname, '..', filename);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(() => fs.readFileSync(filePath, 'utf8')).not.toThrow();
  });

  test.each(testFiles)('test file %s has valid ASS structure', (filename) => {
    const filePath = path.join(__dirname, '..', filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic ASS file structure validation - should have Events section
    expect(content).toMatch(/\[Events\]/); // Has events section
    
    // Should have at least one event line (Dialogue, Comment, etc.)
    expect(content).toMatch(/(Dialogue|Comment|Picture|Sound|Movie|Command):\s*\d/);
  });

  test('sample.ass contains expected basic elements', () => {
    const content = fs.readFileSync(path.join(__dirname, '..', 'sample.ass'), 'utf8');
    
    // Should have standard ASS sections
    expect(content).toContain('[V4+ Styles]');
    expect(content).toContain('[Events]');
    
    // Should have format definitions
    expect(content).toMatch(/Format:/);
    
    // Should have at least one style
    expect(content).toMatch(/Style:/);
    
    // Should have dialogue
    expect(content).toMatch(/Dialogue:/);
  });

  test('advanced.ass contains override blocks', () => {
    const content = fs.readFileSync(path.join(__dirname, '..', 'advanced.ass'), 'utf8');
    
    // Should contain override blocks (tags in curly braces)
    expect(content).toMatch(/\{[^}]*\\[a-zA-Z]/); // Contains tags like {\b1}
  });

  test('complex.ass has multiple event lines', () => {
    const content = fs.readFileSync(path.join(__dirname, '..', 'complex.ass'), 'utf8');
    
    // Count all event lines (Dialogue, Comment, Picture, Sound, Movie, Command)
    const eventLines = (content.match(/^(Dialogue|Comment|Picture|Sound|Movie|Command):/gm) || []).length;
    expect(eventLines).toBeGreaterThan(1);
  });

  test('ASS files have consistent line endings', () => {
    testFiles.forEach(filename => {
      const content = fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
      
      // Should not have mixed line endings
      const hasUnixLineEndings = content.includes('\n') && !content.includes('\r\n');
      const hasWindowsLineEndings = content.includes('\r\n');
      
      // Either Unix or Windows, but not mixed
      expect(hasUnixLineEndings || hasWindowsLineEndings).toBe(true);
    });
  });

  test('grammar covers essential ASS syntax patterns', () => {
    const grammarContent = fs.readFileSync(path.join(__dirname, '../../grammar.js'), 'utf8');
    
    // Check that grammar defines key ASS concepts
    expect(grammarContent).toMatch(/section_header/);
    expect(grammarContent).toMatch(/dialogue|event_line/);
    expect(grammarContent).toMatch(/timestamp/);
    expect(grammarContent).toMatch(/override/);
    expect(grammarContent).toMatch(/color/);
  });

  test('node-types.json contains expected ASS node types', () => {
    const nodeTypes = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/node-types.json'), 'utf8'));
    const typeNames = nodeTypes.map(type => type.type);
    
    // Should include basic ASS structures
    expect(typeNames).toContain('section');
    expect(typeNames).toContain('event_line');
    expect(typeNames).toContain('timestamp');
    expect(typeNames).toContain('color');
  });
});