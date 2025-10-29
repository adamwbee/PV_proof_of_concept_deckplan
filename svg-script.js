/**
 * SVG Text Click and ID Extraction Handler
 * This script now loads the SVG content dynamically using the Fetch API.
 */

const colorFromCat = {
	'D': 0xc6d5ed,
	'J': 0xd4e7f7
};


// --- CONFIGURATION ---
// This constant specifies the name of the local SVG file to load.
const SVG_FILE_PATH = 'HAL_ED_deckplan_D1-MAIN_V1.svg';
const STATEROOM_OUTLINE_ID = 'MA_stateroom_outlines';
const STATEROOM_TEXT_ID = 'MA_stateroom__x23_s';
const STATEROOM_SYMBOL_ID = 'Symbols';


// Global elements references
const svgLoadingContainer = document.getElementById('svg-loading-container');
const extractButton = document.getElementById('extract-button');
const clickedOutput = document.getElementById('clicked-output');
const resultCard = document.getElementById('result-card');

let interactiveSvg = null; // Reference to the dynamically loaded <svg> element


/**
 * Converts a clicked SVG element into a clean string.
 */
function getClickedText(element) {
    return element.textContent.trim();
}

/**
 * The main click handler attached to the parent SVG for event delegation.
 */
function handleSvgClick(event) {
    const target = event.target;
	return
	// Old functionality not used
    if (target && target.tagName === 'text') {
        const textContent = getClickedText(target);
        clickedOutput.textContent = `Clicked Text: ${textContent}`;
        resultCard.classList.add('animate-pulse');
        setTimeout(() => {
            resultCard.classList.remove('animate-pulse');
        }, 500);

        console.log(`[SVG Text Clicked]: ${textContent}`);
    } else if (target && target.id) {
        // Show the ID of a clicked shape (like a stateroom)
        clickedOutput.textContent = `Clicked Shape ID: ${target.id}`;
    } else if (target && target.tagName !== 'svg') {
        clickedOutput.textContent = `— Clicked a ${target.tagName} element —`;
    } else {
         clickedOutput.textContent = `— Clicked SVG background —`;
    }
}

function find_category(stateroom_id) {
	for (category of categories) {
		for (cabin of category.cabins) {
			if (cabin.id === stateroom_id) {
				console.log(`Category for Stateroom ${stateroom_id} is ${category.id}`);
				return category.id
			}
		}
	}
	return null
}
/**
 * TRICKY TASK LOGIC:
 * Finds the target group, extracts and trims IDs, and logs the array.
 */
function extractIDsFromGroup() {
    console.log("--- Starting SVG ID Extraction ---");

	debugger
    if (!interactiveSvg) {
        console.error("SVG is not loaded yet.");
        clickedOutput.textContent = "ERROR: SVG content not loaded.";
        return;
    }

    // Use getElementById on the loaded SVG element itself
	// const textGroup = interactiveSvg.getElementById(STATEROOM_TEXT_ID);
	// textGroup.style.display = 'none';
	const symbolGroup = interactiveSvg.getElementById(STATEROOM_SYMBOL_ID);
	symbolGroup.style.display = 'none';


    const targetGroup = interactiveSvg.getElementById(STATEROOM_OUTLINE_ID);
    
    if (!targetGroup) {
        console.error(`Group with ID '${STATEROOM_OUTLINE_ID}' not found in the loaded SVG.`);
        clickedOutput.textContent = `ERROR: Group '${STATEROOM_OUTLINE_ID}' not found.`;
        return;
    }
    
    const extractedIDs = [];
    const children = targetGroup.children;

    console.log(`Found group: #${STATEROOM_OUTLINE_ID} with ${children.length} potential IDs to process.`);

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const rawId = child.id;

        if (rawId) {
            const firstUnderscoreIndex = rawId.indexOf('_');
            
            if (firstUnderscoreIndex !== -1) {
                // Get the substring starting *after* the first underscore
                const trimmedValue = rawId.substring(1, firstUnderscoreIndex);
                extractedIDs.push(trimmedValue);
                console.log(`- Extracted ID from ${rawId}: ${trimmedValue}`);

				let cat = rawId.substring(0,1);
				let color = colorFromCat[cat];
				let shape = child.querySelector('rect') || child.querySelector('polygon');
				if (shape) {
					if (color) {
						shape.style.fill = `#${color.toString(16).padStart(6, '0')}`;
					} else {
						shape.style.fill = '#FFFFFF00';
					}
					
				}
				debugger
				// add text label to the stateroom
				if (child) {	
					// const labelText = trimmedValue;
					// const ns = "http://www.w3.org/2000/svg";
					// try {
					// 	const textEl = document.createElementNS(ns, 'text');
					// 	textEl.classList.add('stateroom-label');
					// 	textEl.textContent = labelText;
					// 	textEl.setAttribute('fill', '#000');
					// 	textEl.setAttribute('font-size', '10');
					// 	textEl.setAttribute('text-anchor', 'middle');
					// 	textEl.setAttribute('dominant-baseline', 'central');
					// 	// don't let the label intercept pointer events so group clicks still work
					// 	textEl.style.pointerEvents = 'none';

					// 	// position label centered on the rect
					// 	const bbox = rect.getBBox();
					// 	const cx = bbox.x + bbox.width / 2;
					// 	const cy = bbox.y + bbox.height / 2;
					// 	textEl.setAttribute('x', cx);
					// 	textEl.setAttribute('y', cy);

					// 	child.appendChild(textEl);
					// } catch (err) {
					// 	console.warn('Failed to add label for', trimmedValue, err);
					// }
					child.addEventListener('click', (e) => {
						console.log(`Clicked on stateroom ${trimmedValue} in category ${cat}`);
						clickedOutput.textContent = `Clicked on Stateroom ${trimmedValue} (Category: ${cat})`;
						e.stopPropagation();
						e.preventDefault();
					});
				}
            } else {
                console.warn(`- Skipped element with ID ${rawId}: No underscore found to trim.`);
            }
        }
    }

    console.log("--- Extraction Complete ---");
    console.log("%cFinal Extracted IDs Array:", "font-weight: bold; color: green;");
    console.log(extractedIDs);

    // Update the UI with the result summary
    clickedOutput.textContent = `SUCCESS: Extracted ${extractedIDs.length} Stateroom IDs. (Check Console)`;

	fixTextElements();
}

function fixTextElements() {
	if (!interactiveSvg) return;

	debugger
	const textGroup = interactiveSvg.getElementById(STATEROOM_TEXT_ID);
	if (!textGroup) {
		console.error(`Text group with ID '${STATEROOM_TEXT_ID}' not found.`);
		return;
	}

	for (let textElement of textGroup.children) {
		if (textElement) {
			let text = textElement.textContent.trim();
			textElement.textContent = text.replaceAll(/[a-zA-Z]/g, ''); // Remove Letters
		}
	}
}



/**
 * Attaches all necessary event listeners after the SVG content has been inserted.
 */
function setupListeners() {
    // 1. Get the reference to the *newly inserted* <svg> element
    // Since the injected content has the ID 'interactive-svg', we retrieve it here
    interactiveSvg = document.getElementsByTagName('svg')[0];

    if (interactiveSvg) {
        // 2. Add event delegation for clicking on text and shapes
        interactiveSvg.addEventListener('click', handleSvgClick);
    } else {
        console.error("The loaded SVG content is missing the 'interactive-svg' ID. Check the SVG file content.");
    }
    
    // 3. Add listener for the extraction button
    if (extractButton) {
        extractButton.addEventListener('click', extractIDsFromGroup);
    }
}


/**
 * Loads the external SVG file content and injects it into the DOM.
 */
async function loadExternalSvgAndInitInteractivity() {
    if (!svgLoadingContainer) {
        console.error("SVG loading container not found.");
        return;
    }

    clickedOutput.textContent = `Loading SVG from ${SVG_FILE_PATH}...`;
    
    // Use exponential backoff for robustness
    const maxRetries = 3;
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
        try {
            const response = await fetch(SVG_FILE_PATH);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let svgText = await response.text();


			svgText = svgText.replace(
				/AcuminProCond-Semibold/g, 
				'Roboto Condensed'
			);
			svgText = svgText.replace(
				/AcuminProCond-Medium/g, 
				'Roboto Condensed'
			);

            // Inject the SVG text content into the container
            // WARNING: Injecting raw SVG text can strip namespaces if done directly on an 
            // <svg> element, but injecting into a <div> (svg-loading-container) 
            // then pulling the <svg> out works for most modern browsers.
            svgLoadingContainer.innerHTML = svgText;
            
            // Setup interactivity now that the SVG is in the DOM
            setupListeners();
            clickedOutput.textContent = `SVG Loaded from ${SVG_FILE_PATH}. Ready to click or extract.`;
            return; // Success, exit the loop
        } catch (error) {
            currentRetry++;
            console.error(`Failed to load SVG (Attempt ${currentRetry}/${maxRetries}):`, error.message);
            if (currentRetry < maxRetries) {
                const delay = Math.pow(2, currentRetry) * 1000;
                clickedOutput.textContent = `Load failed. Retrying in ${delay / 1000}s...`;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                clickedOutput.textContent = `ERROR: Failed to load SVG after ${maxRetries} attempts.
                Please ensure you are running a local server and the file exists.`;
            }
        }
    }
}

// Start the whole process when the script loads
loadExternalSvgAndInitInteractivity();