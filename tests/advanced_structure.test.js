const Parser = require('tree-sitter');
const Ass = require('..');
const fs = require('fs');
const path = require('path');

describe('Advanced ASS feature parsing', () => {
  const source = fs.readFileSync(path.join(__dirname, 'advanced.ass'), 'utf8');
  const parser = new Parser();
  parser.setLanguage(Ass);
  const tree = parser.parse(source);

  it('parses without error', () => {
    expect(tree.rootNode.hasError()).toBe(false);
  });

  it('recognises override blocks', () => {
    const overrides = tree.rootNode.descendantsOfType('override_block');
    expect(overrides.length).toBeGreaterThan(2);
  });

  it('recognises drawing path token', () => {
    const drawPaths = tree.rootNode.descendantsOfType('draw_path');
    expect(drawPaths.length).toBeGreaterThan(0);
  });

  it('recognises karaoke tags', () => {
    const karaTags = tree.rootNode.descendantsOfType('basic_tag').filter(n => /^\\(k|K|kf|ko|kt)/i.test(n.text));
    expect(karaTags.length).toBeGreaterThan(0);
  });
});