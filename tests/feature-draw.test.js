const Parser = require('tree-sitter');
const Ass = require('..');
const fs = require('fs');

const parser = new Parser();
parser.setLanguage(Ass);

describe('vector drawing paths', () => {
  const paths = [
    'm 0 0 l 100 0 l 100 100 l 0 100',
    'M 0 0 L 50 50',
    'm 0 0 b 0 50 50 50 50 0',
    'm 0 0 s 25 25 50 0',
    'm 0 0 p',
  ];

  test.each(paths)('parses draw path "%s"', path => {
    const src = `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,0:00:01.00,0:00:02.00,Default,,0,0,0,,{\\p1}${path}{\\p0}`;
    const tree = parser.parse(src);
    expect(tree.rootNode.hasError()).toBe(false);
    const draw = tree.rootNode.descendantsOfType('draw_path');
    expect(draw.length).toBe(1);
  });
});