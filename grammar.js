const PREC = {
  OVERRIDE: 1,
};

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(seq(rule, repeat(seq(',', rule))));
}

module.exports = grammar({
  name: 'ass',

  /*
   * ───────────────────────── Extras ─────────────────────────
   *  • Whitespace is insignificant.
   *  • Lines starting with `;` are comments.
   */
  extras: $ => [/[^\S\r\n]+/, $.comment],

  externals: $ => [
    $._block_close,
    $._override_open,
    $._override_close,
    $._clip_poly_start,
    $._draw_path,
  ],

  //--------------------------------------------------------------------------
  //  Top level – entire file is a list of sections
  //--------------------------------------------------------------------------
  rules: {
    source_file: $ => repeat($.section),

    //-----------------------------------------------------------------------
    //  Lexical tokens (trivial regex or literals)
    //-----------------------------------------------------------------------

    comment: _ => token(seq(';', /.*/)),

    section_header: _ => token(seq('[', /[^\]\r\n]+/, ']')),
    blank_line:   _ => token(/\r?\n/),
    identifier:   _ => token(/[A-Za-z_][A-Za-z0-9_]*/),
    number:       _ => token(/[-+]?[0-9]+(?:\.[0-9]+)?/),
    timestamp:    _ => token(/\d+:\d{2}:\d{2}\.\d{2}/), // HH:MM:SS.cs
    // Colours: &HBBGGRR&  or &HAABBGGRR& or named (&red&)
    color: _ => token(/&(?:H[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?|[A-Za-z]+)&?/),
    newline_escape: _ => token(seq('\\', /[Nn]/)),
    text_fragment: _ => token(/[^\\{}\r\n]+/),
    draw_path: _ => token(/[-0-9 ]*(?:[mnlbscpMNLBSCP][-0-9 ]+)*/),

    //-----------------------------------------------------------------------
    //  Sections
    //-----------------------------------------------------------------------
    section: $ => seq(
      field('name', $.section_header),
      repeat($.section_line),
    ),

    //-----------------------------------------------------------------------
    //  Section content lines
    //-----------------------------------------------------------------------

    section_line: $ => choice(
      $.blank_line,
      $.format_line,
      $.style_line,
      $.event_line,
      $.kv_line,
    ),

    // Format: Name,Fontname,...  – field list captured as identifiers
    format_line: $ => seq(
      alias('Format', $.keyword), ':',
      field('fields', commaSep1($.identifier)),
    ),

    // Style line – same #fields as current Format
    style_line: $ => seq(
      alias('Style', $.keyword), ':',
      field('values', commaSep1($.style_value)),
    ),

    // Generic key:value for unknown lines
    kv_line: $ => seq($.identifier, ':', /.*/),

    //-----------------------------------------------------------------------
    //  Event lines (Dialogue, Comment, Picture, ...)
    //-----------------------------------------------------------------------
    event_line: $ => seq(
      field('type', $.event_type), ':',
      field('layer', optional($.number)), ',',
      field('start', $.timestamp), ',',
      field('end',   $.timestamp), ',',
      field('style', $.identifier), ',',
      field('name',  optional($.identifier)), ',',
      field('margin_l', optional($.number)), ',',
      field('margin_r', optional($.number)), ',',
      field('margin_v', optional($.number)), ',',
      field('effect', optional($.identifier)), ',',
      field('text', $.text_field),
    ),

    event_type: _ => token(choice(
      'Dialogue', 'Comment', 'Picture', 'Sound', 'Movie', 'Command',
      'Text', 'Karaoke', 'Graphic', 'Box', 'Script',
    )),

    //-----------------------------------------------------------------------
    //  Components – style values, text field, override blocks, etc.
    //-----------------------------------------------------------------------
    style_value: $ => choice($.color, $.number, $.identifier),

    // Text
    text_field: $ => repeat1(choice(
      $.override_block,
      $.newline_escape,
      $.draw_path,
      $.text_fragment,
    )),

    override_block: $ => seq('{', repeat($.override_tag), '}'),

    override_tag: $ => choice($.transform_tag, $.basic_tag),

    // \t( start?, end?, accel?, <nested overrides> )
    transform_tag: $ => seq('\\t', '(', commaSep1(choice($.number, $.basic_tag)), ')'),

    basic_tag: $ => seq('\\', $.identifier, optional($.basic_params)),

    basic_params: $ => choice(
      seq('(', commaSep($.param_value), ')'),
      $.param_value,
    ),

    param_value: $ => choice($.number, $.color, $.identifier, $.draw_path),

    //-----------------------------------------------------------------------
    keyword: _ => token('Format'), // reused literal helper (any keyword token)
  },

  //--------------------------------------------------------------------------
  //  Conflicts & helpers
  //--------------------------------------------------------------------------
  conflicts: $ => [
    [$.basic_tag, $.param_value],
    [$.basic_tag, $.transform_tag],
  ],
});

//────────────────────────── helpers ─────────────────────────────────────────
function commaSep(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}