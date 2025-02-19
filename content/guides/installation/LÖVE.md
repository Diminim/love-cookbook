---
title: "LÖVE installation"
authors: [Nykenik]
date: 2025-02-19
---

This page talks about installing LÖVE in every OS.

## Windows
The easiest way to run the game is to drag the folder onto either love.exe or a shortcut to love.exe. Remember to drag the folder containing `main.lua`, and not `main.lua` itself.

You can also launch the game from the command line:

```
"C:\Program Files\LOVE\love.exe" "C:\games\mygame"
"C:\Program Files\LOVE\love.exe" "C:\games\packagedgame.love"
```

You can create a shortcut to do this; simply make a shortcut to love.exe, right-click on it and select "Properties", and then put the command line you want in the "Target" box for the shortcut.

On Windows, there is a special command-line option which will attach a console to the window, allowing you to see the result of `print` calls (equivalent to setting `t.console=true` in [conf.lua](https://love2d.org/wiki/conf.lua "conf.lua") or running `lovec.exe` (since [0.10.2](https://love2d.org/wiki/0.10.2 "0.10.2"))):

```
"C:\Program Files\LOVE\love.exe" --console
```
## Linux
LÖVE is bundled in almost every package manager.
```bash
sudo pacman -S love # arch linux
sudo apt install love # ubuntu
```
You can also [download an Appimage](https://github.com/love2d/love/releases/download/11.5/love-11.5-x86_64.AppImage) or [an Ubuntu PPA](https://launchpad.net/~bartbes/+archive/ubuntu/love-stable).

## macOS
On macOS, a folder or .love file can be dropped onto the love application bundle. On the Mac Terminal (command line), you can use love like this (assuming it's installed to the Applications directory):
```bash
open -n -a love "~/path/to/mygame"
```

However, the above method will not output printed text to the terminal window. To do that, you will need to execute the love binary inside the application bundle directly:
```bash
/Applications/love.app/Contents/MacOS/love ~/path/to/mygame
```

You can set up an alias in your Terminal session to call the binary when you use `love` by adding an alias to your `~/.zshrc` file (Z shell configuration file).

Open the file with
```bash
open -a TextEdit ~/.zshrc
```


You may have to run
```bash
touch ~/.zshrc
```


first if the file does not yet exist.

Then paste in the following code and save the file:
```zsh
# alias to love
alias love="/Applications/love.app/Contents/MacOS/love"
```

Now you can call love from the command line like Linux and Windows:
```bash
love ~/path/to/mygame
```


if this doesn't works you should reload the .zshrc file like this:
```bash
source ~/.zshrc
```


and try it again.
