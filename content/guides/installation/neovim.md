---
title: "Neovim"
date: 2025-02-20
authors: [Nykenik]
---

When using NeoVim for LÖVE we need to use S1M0N38's [`love2d.nvim`](https://github.com/S1M0N38/love2d.nvim) plugin.

## Disclaimer
This guide already supposes you have a proper [lsp configuration](https://github.com/neovim/nvim-lspconfig), `lua_lsp` installed and a plugin manager.

If you don't have any of these, the easiest way is to install an already made NeoVim configuration, or a "NeoVim distribution".

## Setup

### Installation
To setup the plugin, first we have to install it. The author of the plugin recommends to use `lazy.nvim`, so we are going to use it.

If you have a single-file setup, go to your `init.lua` and add this to your lazy setup:
```lua
require("lazy").setup({
  -- Other plugins...
  {
    "S1M0N38/love2d.nvim",
    cmd = "LoveRun",
    opts = {},
    keys = {
      { "<leader>v",   desc = "LÖVE", ft = "lua" },
      { "<leader>vv",  "<cmd>LoveRun<cr>", desc = "Run LÖVE", ft = "lua" },
      { "<leader>vs",  "<cmd>LoveStop<cr>", desc = "Stop LÖVE", ft = "lua" },
    },
  },
})
```

Otherwise, if you have a multi-file setup, create a new file in your plugins folder called `love2d.lua` and copy this into it:
```lua
return {
  "S1M0N38/love2d.nvim",
  cmd = "LoveRun",
  opts = {},
  keys = {
    { "<leader>v", ft = "lua", desc = "LÖVE" },
    { "<leader>vv", "<cmd>LoveRun<cr>", ft = "lua", desc = "Run LÖVE" },
    { "<leader>vs", "<cmd>LoveStop<cr>", ft = "lua", desc = "Stop LÖVE" },
  },
}
```

### Post-installation
After installing the plugin, we must configure it. It has three options:
- `path_to_love_bin`: The path to the `love` binary. Leave it empty if love is installed system-wide.
- `path_to_love_library`: The path to [the love lua annotation library](https://github.com/LuaCATS/love2d/tree/main/library). Obligatory if you want lsp to automatically setup love annotations. Otherwise, leave it empty.
- `restart_on_save`: If you want open love instances to restart when saving to any file, set this option to true.

To change this values, modify the `opts` table in the plugin installation:
```lua
return {
  -- other..
  opts = {
    -- this are the default values
    path_to_love_bin = "love",
    path_to_love_library = vim.fn.globpath(vim.o.runtimepath, "love2d/library"),
    restart_on_save = false,
  },
  -- keys...
}
```

## Usage
After completing the plugin's setup, we now can use it to develop games with LÖVE and NeoVim. 

To run a new LÖVE instance, run the command `:LoveRun` to start. You have to do this in the same directory with the `main.lua` file. To stop LÖVE, run the `:LoveStop` command.

The plugin will load when running `:LoveRun` by default, so it will not recognize the `love` variable until you run a LÖVE instance. To make it load when NeoVim is started, comment (or completely remove) the `cmd` line:
```lua
{
  "S1M0N38/love2d.nvim",
  --cmd = "LoveRun",
  opts = {},
  keys = {
    { "<leader>v", ft = "lua", desc = "LÖVE" },
    { "<leader>vv", "<cmd>LoveRun<cr>", ft = "lua", desc = "Run LÖVE" },
    { "<leader>vs", "<cmd>LoveStop<cr>", ft = "lua", desc = "Stop LÖVE" },
  },
}
```

## GLSL highlighting
As a bonus, we can also get shader syntax highlighting.

To do this, just install the parser for GLSL with `:TSInstall`. After doing so, NeoVim will recognize the strings passed to `love.graphics.newShader()` as GLSL code.


