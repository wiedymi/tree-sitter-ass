const Parser = require('tree-sitter');
const Ass = require('..');

const parser = new Parser();
parser.setLanguage(Ass);

const tags = [
  '\\k50', '\\K30', '\\kf25', '\\ko12', '\\kt200',
  '\\fad(250,250)', '\\fade(0,0,255,0,0,255)',
  '\\alpha&H80&', '\\1a&HFF&', '\\2a&H20&',
  '\\c&H00FF00&', '\\1c&HFF0000&', '\\2c&red&',
  '\\fe128', '\\q2', '\\r',
];

describe('override tag variants', () => {
  test.each(tags)('parses %s in dialogue line', tag => {
    const src = `[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,0:00:01.00,0:00:02.00,Default,,0,0,0,,{${tag}}text`;
    const tree = parser.parse(src);
    expect(tree.rootNode.hasError()).toBe(false);
    // ensure we get an override_tag node
    const tagNodes = tree.rootNode.descendantsOfType('basic_tag');
    expect(tagNodes.length).toBeGreaterThan(0);
  });
});