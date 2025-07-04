#include "tree_sitter/parser.h"
#include <stdbool.h>
#include <stdlib.h>
#include <wctype.h>
#include <ctype.h>

// External token indices must follow the order declared in grammar.js
enum TokenType {
  _BLOCK_CLOSE,
  _OVERRIDE_OPEN,
  _OVERRIDE_CLOSE,
  _CLIP_POLY_START,
  _DRAW_PATH,
};

typedef struct {
  uint8_t override_depth;
  bool drawing_mode;
  bool in_clip_poly;
} Scanner;

static inline void skip_ws(TSLexer *lexer) {
  while (iswspace(lexer->lookahead)) lexer->advance(lexer, false);
}

static inline bool is_path_cmd(int c) {
  switch (c) {
    case 'm': case 'n': case 'l': case 'b': case 's': case 'p':
    case 'M': case 'N': case 'L': case 'B': case 'S': case 'P':
      return true;
    default:
      return false;
  }
}

bool tree_sitter_ass_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid) {
  Scanner *state = (Scanner *)payload;
  skip_ws(lexer);

  // Auto close at EOF (used by grammar for cleanup)
  if (lexer->eof(lexer)) {
    if (valid[_BLOCK_CLOSE]) {
      lexer->result_symbol = _BLOCK_CLOSE;
      return true;
    }
    return false;
  }

  // Override delimiters { }
  if (lexer->lookahead == '{' && valid[_OVERRIDE_OPEN]) {
    state->override_depth++;
    lexer->advance(lexer, false);
    lexer->result_symbol = _OVERRIDE_OPEN;
    return true;
  }
  if (lexer->lookahead == '}' && valid[_OVERRIDE_CLOSE]) {
    if (state->override_depth > 0) state->override_depth--; // safety
    lexer->advance(lexer, false);
    lexer->result_symbol = _OVERRIDE_CLOSE;
    return true;
  }

  // Detect start of \clip()/\iclip() polygon – emit token before '('
  if (valid[_CLIP_POLY_START] && lexer->lookahead == '\\') {
    lexer->mark_end(lexer);
    lexer->advance(lexer, false); // consume '\\'
    const char *kw = "clip";
    const char *p = kw;
    while (*p && tolower(lexer->lookahead) == *p) {
      lexer->advance(lexer, false);
      ++p;
    }
    if (!*p) { // matched "clip"
      skip_ws(lexer);
      if (lexer->lookahead == '(') {
        lexer->result_symbol = _CLIP_POLY_START;
        state->in_clip_poly = true;
        return true;
      }
    }
    // rewind not possible; fallthrough – treat as normal text.
    return false;
  }

  // Drawing path token when drawing_mode active
  if (valid[_DRAW_PATH] && state->drawing_mode) {
    if (is_path_cmd(lexer->lookahead) || lexer->lookahead == '-' || iswdigit(lexer->lookahead)) {
      lexer->mark_end(lexer);
      do {
        lexer->advance(lexer, false);
      } while (is_path_cmd(lexer->lookahead) || lexer->lookahead == '-' || iswdigit(lexer->lookahead) || lexer->lookahead == ' ');
      lexer->result_symbol = _DRAW_PATH;
      return true;
    }
  }

  return false;
}

void *tree_sitter_ass_external_scanner_create(void) {
  Scanner *state = (Scanner *)calloc(1, sizeof(Scanner));
  return state;
}

void tree_sitter_ass_external_scanner_destroy(void *payload) {
  free(payload);
}

unsigned tree_sitter_ass_external_scanner_serialize(void *payload, char *buffer) {
  Scanner *state = (Scanner *)payload;
  buffer[0] = (char)state->override_depth;
  buffer[1] = state->drawing_mode;
  buffer[2] = state->in_clip_poly;
  return 3;
}

void tree_sitter_ass_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  if (length < 3) return;
  Scanner *state = (Scanner *)payload;
  state->override_depth = (uint8_t)buffer[0];
  state->drawing_mode   = buffer[1];
  state->in_clip_poly   = buffer[2];
}