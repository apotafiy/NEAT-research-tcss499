/** Global Parameters Object */
const params = {
    CANVAS_SIZE: 800,
    FOOD_OUTSIDE: false,
    GEN_TICKS: 1000,
    AGENT_NEIGHBORS: false,
    FOOD_AGENT_RATIO: 5,
    COMPAT_THRESH: 0.075,
    ENFORCE_MIN_FOOD: false,
    AGENT_VISION_RADIUS: 500,
    RAND_FOOD_PHASES: true,
    RAND_FOOD_LIFETIME: false,
    FOOD_PERIODIC_REPOP: true,
    FREE_RANGE: false,
    SPLIT_SPECIES: true,
    RAND_DEFAULT_WEIGHTS: true
};

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = (n) => Math.floor(Math.random() * n);

/**
 * @param {Number} n
 * @returns Random Float Between 0 and n-1
 */
const randomFloat = (n) => Math.random() * n;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        })
    );
})();

/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
const distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Shuffles a provided array
 * @param {Array} a the array to be shuffled
 * @returns a shuffled copy of the array
 */
const shuffleArray = (a) => [...a].sort(() => Math.random() - 0.5);

/**
 *
 * @param {object} array array of html elements you want to put in slideshow
 * @param {String} id id of slideshow holder
 */
const createSlideShow = (array, id) => {
    const indicatorContainer = document.getElementById(`${id}-indicators`);
    const carouselContainer = document.getElementById(`${id}-carousel`);
    let activeSlide = 0;
    // check which slide was active before
    if (indicatorContainer.firstChild) {
        // first remove existing data
        while (indicatorContainer.firstChild) {
            indicatorContainer.removeChild(indicatorContainer.lastChild);
        }
        let count = 0;
        while (carouselContainer.firstChild) {
            if (
                carouselContainer.firstChild.classList &&
                carouselContainer.firstChild.classList.contains('active')
            ) {
                activeSlide = Math.min(count, array.length - 1);
            }
            carouselContainer.removeChild(carouselContainer.firstChild);
            count++;
        }
    }
    if (array.length < 1) {
        return;
    }

    array.forEach((elem, i) => {
        const indButton = document.createElement('button');
        indButton.setAttribute('type', 'button');
        indButton.setAttribute('data-bs-target', '#carouselExampleIndicators');
        indButton.setAttribute('data-bs-slide-to', `${i}`);
        if (i == activeSlide) {
            indButton.setAttribute('class', 'active');
            indButton.setAttribute('aria-current', 'true');
        }
        indButton.setAttribute('style', 'background-color: black');
        indButton.setAttribute('aria-current', 'true');
        indButton.setAttribute('aria-label', `Slide ${i + 1}`);
        indicatorContainer.appendChild(indButton);
    });

    let count = 0;
    array.forEach((elem) => {
        const div = document.createElement('div');
        div.setAttribute(
            'class',
            `carousel-item${count == activeSlide ? ' active' : ''}`
        );
        div.setAttribute('data-bs-interval', '999999999');
        div.appendChild(elem);
        carouselContainer.appendChild(div);
        count++;
    });
};
