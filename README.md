# tree-sitter-ass

A **Tree-sitter** grammar for the Advanced SubStation Alpha (ASS/SSA) subtitle
format – used by Aegisub, ffmpeg, mpv, Zed, Neovim and many other tools.

The grammar is feature-complete for the v4.00+ specification: every section,
field, event line, timestamp form, override tag, karaoke/transform variant,
vector-drawing path and colour literal parses without error.

---

## 📦 Installation

```bash
# 1. clone
 git clone https://github.com/wiedymi/tree-sitter-ass.git
 cd tree-sitter-ass

# 2. build & run tests
 npm install        # installs exact tree-sitter ABI + builds native module
 npm test           # all suites green
```

After the first build the **native addon** is located in
`build/Release/tree_sitter_ass_binding.node` and will be reused by editors that
load the grammar via `require()` (VS Code, Zed, etc).

---

## 🚀 Quick usage (Node)

```js
const Parser = require('tree-sitter');
const Ass    = require('tree-sitter-ass');

const parser = new Parser();
parser.setLanguage(Ass);

const source = `[Events]\n`
             + `Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`
             + `Dialogue: 0,0:00:10.00,0:00:15.00,Default,,0,0,0,,{\\k50}Hello!`;

console.log(parser.parse(source).rootNode.toString());
```

---

## 🗺 Specification coverage

| Category             | Supported |
|----------------------|-----------|
| Sections             | Script Info, [V4], [V4+ Styles], [Events], [Fonts], [Graphics] |
| Field lines          | `Format:` / `Style:` – arbitrary column count |
| Event lines          | Dialogue / Comment / Picture / Sound / Movie / Command / Text / Karaoke / Graphic / Box / Script |
| Timestamps           | `HH:MM:SS.cs` (centisecond) – HH 0-99 |
| Text override tags   | Full list – position/clip/fade/move/fad/alpha/colour (`\1c` … `\4a`) / karaoke (`\k` `\K` `\kf` `\ko` `\kt`) / font encoding (`\fe`) / wrap-style (`\q`) / reset (`\r`) / transform (`\t`) inc. accel / drawing mode (`\p`) |
| Vector drawing       | Commands **m n l b s p c** (upper/lower) & coordinates |
| Colours              | `&HBBGGRR&`, `&HAABBGGRR&`, `&red&` named |

---

## 🖍 Editor integration

The repository ships

```
queries/
  highlights.scm   # syntax colours
  injections.scm   # language injection for drawing/clip polygons
```

Neovim (`nvim-treesitter`):

```lua
require'nvim-treesitter.parsers'.get_parser_configs().ass = {
  install_info = {
    url = '~/tree-sitter-ass', files = {'src/parser.c', 'src/scanner.c'},
  },
  filetype = 'ass',
}
```

Zed & VS Code pick up the grammar automatically when the directory is on
`NODE_PATH` or inside the extension bundle.

---

## 🛠 Development

* `npm run build`   – re-generate C parser after editing `grammar.js`
* `npm test        ` – run Jest corpus & feature suites
* `npm run corpus:watch` – (extra) watch tests while editing corpus files

PRs / issues welcome! – Feel free to submit edge-cases or real-world samples
that fail to parse, we aim for **zero error nodes** on the wild.

Author © [wiedymi](https://github.com/wiedymi) · contact ✉︎ <contact@wiedymi.com>

## 🎯 Supported Features

* Sections: Script Info, Styles (V4 / V4+), Events, Unknown custom sections
* Format & Style lines with field/value lists
* Event lines with full field parsing (layer, timing, margins, effect, text)
* Override block parsing with:
  * Generic parameter tags (\\bord, \\shad …)
  * Karaoke tags: \\k, \\K, \\kf, \\ko, \\kt (duration validated as numeric)
  * Transform tags `\\t()` with optional start, end, acceleration and nested overrides
  * Fade (fad) / Move / Wrap style / Font encoding / Colour changes etc.
* Vector drawing paths when `\\pN` is active:
  * Commands **m, n, l, b, s, p** with validated coordinate pairs
* Colour parsing:
  * Hex BGR `&HBBGGRR&` and ABGR `&HAABBGGRR&`
  * Named colours `&red&`, `&blue&`, …
* Font encoding tag `\\fe<enc>` (0–255)
* Hard/soft line-break escapes `\\N` / `\\n`

See `tests/` directory for real-world examples touching every feature.

## 🔧 Usage

```js
const Parser = require('tree-sitter');
const Ass = require('tree-sitter-ass');

const parser = new Parser();
parser.setLanguage(Ass);

const source = `[Script Info]\nTitle: Example`;
const tree = parser.parse(source);

console.log(tree.rootNode.toString());
```

## 🤖 Continuous Integration

All pushes and pull-requests are built and tested on Linux, macOS and Windows using GitHub Actions. See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.

## 💼 License

Released under the MIT license. See [LICENSE](LICENSE) for the full text.