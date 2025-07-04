const Parser = require('tree-sitter');
const Ass = require('..');

const parser = new Parser();
parser.setLanguage(Ass);

describe('timestamp parsing', () => {
  const good = ['0:00:00.00', '12:34:56.78', '99:59:59.99'];
  test.each(good)('accepts %s', ts => {
    const src = `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,${ts},${ts},Default,,0,0,0,,text`;
    const tree = parser.parse(src);
    expect(tree.rootNode.hasError()).toBe(false);
  });

  const bad = ['0:60:00.00', 'aa:bb:cc.dd'];
  test.each(bad)('flags error for %s', ts => {
    const src = `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,${ts},${ts},Default,,0,0,0,,text`;
    const tree = parser.parse(src);
    expect(tree.rootNode.hasError()).toBe(true);
  });
});