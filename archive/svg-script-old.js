/**
 * SVG Text Click Handler
 * This script uses event delegation to detect clicks on <text> elements
 * within the SVG and updates the display area.
 */

// Global elements references
const svgContainer = document.getElementById('interactive-svg');
const clickedOutput = document.getElementById('clicked-output');
const resultCard = document.getElementById('result-card');

/**
 * Converts a clicked SVG element into a clean string.
 * @param {Element} element - The target SVG element.
 * @returns {string} The text content of the element.
 */
function getClickedText(element) {
    // .trim() removes any leading/trailing whitespace which can be common in SVG source.
    return element.textContent.trim();
}

/**
 * The main click handler attached to the parent SVG for event delegation.
 * @param {Event} event - The click event object.
 */
function handleSvgClick(event) {
    const target = event.target;

    // 1. Check if the element that was clicked is specifically an SVG <text> element.
    if (target && target.tagName === 'text') {
        const textContent = getClickedText(target);

        // 2. Update the display area with the detected text
        clickedOutput.textContent = textContent;

        // Optional: Add a visual feedback/animation to the result card
        resultCard.classList.add('animate-pulse');
        setTimeout(() => {
            resultCard.classList.remove('animate-pulse');
        }, 500);

        console.log(`[SVG Text Clicked]: ${textContent}`);
    } else if (target && target.tagName !== 'svg') {
        // If a non-text element (like a circle or path) was clicked
        clickedOutput.textContent = `— Clicked a ${target.tagName} element —`;
    } else {
         // If the main SVG background was clicked
         clickedOutput.textContent = `— Clicked SVG background —`;
    }
}

// Use event delegation on the main SVG container
// Check if the element exists before adding the listener to prevent errors
if (svgContainer) {
    svgContainer.addEventListener('click', handleSvgClick);
} else {
    console.error('Interactive SVG container not found.');
}
