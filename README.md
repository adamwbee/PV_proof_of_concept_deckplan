### Steps to Run Locally

The project requires a local web server because it uses the fetch API to load the external SVG file.

## Execution

1. Install Server: Install http-server globally (requires Node.js/npm):

	`npm install -g http-server`

2. Start Server: Navigate to the directory in your terminal and run:

	`http-server`


### Questions for implementation into PV

1. The SVG has symbols on each cabin do we want to display these converting as currently we do not in PV
2. Same with the category prefix for each cabin.
3. This SVG uses font AcuminProCond will PV be able to display this?
4. Will SVGs have outlines that are id'ed with there cabin id? If not this implementation will have to be altered signifigantly