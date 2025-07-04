const Parser = require('tree-sitter');
const Ass = require('..');
const fs = require('fs');
const path = require('path');

describe('ASS corpus compliance', () => {
  const corpusDir = path.join(__dirname, 'corpus');
  const files = fs.readdirSync(corpusDir).filter(f => f.endsWith('.ass'));
  const parser = new Parser();
  parser.setLanguage(Ass);

  test.each(files)('parses %s without errors', filename => {
    const source = fs.readFileSync(path.join(corpusDir, filename), 'utf8');
    const tree = parser.parse(source);
    expect(tree.rootNode.hasError()).toBe(false);
  });
});