const Parser = require('tree-sitter');
const Ass = require('..');

const parser = new Parser();
parser.setLanguage(Ass);

describe('transform tag', () => {
  const cases = [
    '\\t(\\bord3)',
    '\\t(0,500,\\bord2)',
    '\\t(0,500,0.5,\\1c&H00FF00&)',
  ];

  test.each(cases)('parses %s', tag => {
    const src = `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,0:00:01.00,0:00:02.00,Default,,0,0,0,,{${tag}}abc`;
    const tree = parser.parse(src);
    expect(tree.rootNode.hasError()).toBe(false);
    const tnodes = tree.rootNode.descendantsOfType('transform_tag');
    expect(tnodes.length).toBe(1);
  });
});