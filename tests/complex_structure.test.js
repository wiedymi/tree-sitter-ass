const Parser = require('tree-sitter');
const Ass = require('..');
const fs = require('fs');
const path = require('path');

describe('Complex ASS structure', () => {
  const source = fs.readFileSync(path.join(__dirname, 'complex.ass'), 'utf8');
  const parser = new Parser();
  parser.setLanguage(Ass);
  const tree = parser.parse(source);

  it('contains expected number of event lines', () => {
    const eventLines = tree.rootNode.descendantsOfType('event_line');
    expect(eventLines.length).toBe(6);
  });

  it('contains expected format and style lines', () => {
    const formatLines = tree.rootNode.descendantsOfType('format_line');
    const styleLines = tree.rootNode.descendantsOfType('style_line');

    expect(formatLines.length).toBe(2); // events + styles format
    expect(styleLines.length).toBe(1);
  });
});