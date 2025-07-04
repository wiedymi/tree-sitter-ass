const Parser = require('tree-sitter');
const Ass = require('..'); // root exports the compiled language
const fs = require('fs');
const path = require('path');

describe('ASS Tree-sitter grammar', () => {
  const parser = new Parser();
  parser.setLanguage(Ass);

  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.ass'));

  test.each(files)('parses %s without errors', (filename) => {
    const source = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    const tree = parser.parse(source);

    expect(tree.rootNode.hasError()).toBe(false);
  });
});