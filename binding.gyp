{
  "targets": [
    {
      "target_name": "tree_sitter_ass_binding",
      "sources": [
        "src/parser.c",
        "src/scanner.c",
        "src/binding.cc"
      ],
      "include_dirs": [
        "<!(node -p \"require('path').dirname(require.resolve('tree-sitter')) + '/vendor/tree-sitter/lib/include'\")",
        "<!(node -e \"require('nan')\")"
      ],
      "cflags_c": ["-std=c99"],
      "cflags_cc": ["-std=c++17", "-fexceptions"],
      "conditions": [
        ["OS=='mac'", {
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
            "CLANG_CXX_LANGUAGE_STANDARD": "c++17"
          }
        }]
      ]
    }
  ]
}