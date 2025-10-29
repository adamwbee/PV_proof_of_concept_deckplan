/**
 * SVG Text Click and ID Extraction Handler
 * This script combines the previous click detection (Event Delegation)
 * with a new function to extract and trim IDs from a specific SVG group.
 */

// Global elements references
const svgContainer = document.getElementById('interactive-svg');
const clickedOutput = document.getElementById('clicked-output');
const resultCard = document.getElementById('result-card');
const extractButton = document.getElementById('extract-button');


/**
 * Converts a clicked SVG element into a clean string.
 * (Retained from previous task for continued text clicking functionality)
 * @param {Element} element - The target SVG element.
 * @returns {string} The text content of the element.
 */
function getClickedText(element) {
    return element.textContent.trim();
}

/**
 * The main click handler attached to the parent SVG for event delegation.
 * (Retained from previous task for continued text clicking functionality)
 * @param {Event} event - The click event object.
 */
function handleSvgClick(event) {
    const target = event.target;

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

/**
 * TRICKY TASK LOGIC:
 * 1. Finds the group with ID 'MA_stateroom_outlines'.
 * 2. Iterates through its children.
 * 3. Extracts the ID, splits it by the first underscore, and takes the remaining part.
 * 4. Puts the trimmed ID into an array and logs it.
 */
function extractIDsFromGroup() {
    console.log("--- Starting SVG ID Extraction ---");

	debugger
    const targetGroupId = 'MA_stateroom_outlines';
    const targetGroup = document.getElementById(targetGroupId);
    
    if (!targetGroup) {
        console.error(`Group with ID '${targetGroupId}' not found.`);
        clickedOutput.textContent = `ERROR: Group '${targetGroupId}' not found.`;
        return;
    }
    
    const extractedIDs = [];
    const children = targetGroup.children;

    console.log(`Found group: #${targetGroupId} with ${children.length} potential IDs to process.`);

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const rawId = child.id;

        if (rawId) {
            // Trim the ID: find the index of the first underscore and slice the string from there, 
            // skipping the underscore itself (+1).
            const firstUnderscoreIndex = rawId.indexOf('_');
            
			debugger
            if (firstUnderscoreIndex !== -1) {
                // Get the substring starting *after* the first underscore
                const trimmedValue = rawId.substring(0, firstUnderscoreIndex);
                extractedIDs.push(trimmedValue);
                console.log(`- Extracted ID from ${rawId}: ${trimmedValue}`);
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
}


// --- Initialize Listeners ---
if (svgContainer) {
    // Add event delegation for clicking on text and shapes
    svgContainer.addEventListener('click', handleSvgClick);
}

if (extractButton) {
    // Add listener for the new extraction button
    extractButton.addEventListener('click', extractIDsFromGroup);
}
