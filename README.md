# README

A series of JavaScript-based game development examples for learning purposes.

## Running the Examples

NOTE: This project provides settings for VS Code to demonstrate how we can provide a consistent development environment across separate machines.

This project can also optionally be run from within a [devcontainer](https://containers.dev/overview) (settings are in `.devcontainer/devcontainer.json`). If you aren't using the development container, you will want to ensure you install all the recommended extensions for VS Code. You should get a pop-up when you open the project, prompting you to install them. If you missed it, though, the list can be found in `.vscode/extensions.json`.

This project is also built to work with [VS Code's built-in debugger](https://code.visualstudio.com/docs/editor/debugging) (settings are in `.vscode/launch.json`). You may be able to just press `F5` to launch the server (and open Chrome with the debugger attached). If that doesn't work for whatever reason (not on Windows? using a laptop where `F5` is hard to get to?), see the link to find the button in VS Code. Alternatively, you can also run `npm start` from the `examples` root folder.

Once the server is running and a browser is opened, click into the example you'd like to view. If using the debugger, VS Code should allow you to place breakpoints.

## Other Notes About Configuration

This project uses eslint and prettier to ensure consistent coding style. The settings we configured will tell VS Code to automatically fix files on save. (see `.vscode/settings.json`)
