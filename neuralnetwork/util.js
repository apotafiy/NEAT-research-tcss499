const normalizeHue = (hue) => Math.min(1, hue / 360);

const normalizeDistance = (distance) => Math.min(1, distance / params.CANVAS_SIZE);
