const Parser = require('tree-sitter');
const Ass = require('..');

const parser = new Parser();
parser.setLanguage(Ass);

describe('colour literal forms', () => {
  const colours = ['&HFF00FF&', '&H80FF00FF&', '&red&'];
  test.each(colours)('parses %s', col => {
    const src = `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,0:00:00.00,0:00:01.00,Default,,0,0,0,,{\\c${col}}text`;
    const tree = parser.parse(src);
    expect(tree.rootNode.hasError()).toBe(false);
    const nodes = tree.rootNode.descendantsOfType('color');
    expect(nodes.length).toBeGreaterThan(0);
  });
});