; Section headers
(section_header) @markup.heading

; Keywords
((keyword) @keyword)

; Event types
(event_type) @constant.builtin

; Override blocks and tags
("\\" @punctuation.special)
(basic_tag (identifier) @function.builtin)
(transform_tag) @function.builtin

; Numbers & timestamps & karaoke duration
(number) @number
(timestamp) @constant.numeric
(draw_path) @string.special

; Colours
(color) @constant

; Text
(text_fragment) @string