; Inject vector drawing path into ass-draw when \p>0 is active
((draw_path) @injection.content
 (#set! injection.language "ass-draw"))

; Inject polygon coordinate list inside clip/ iclip
((basic_tag
   (identifier) @_id
   (_)
   (#match? @_id "^(clip|iclip)$")) @injection.language)