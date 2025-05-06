import { marked } from 'marked';
import CustomRenderer from './renderer/CustomRenderer.js';

// Verwende deinen lokalen Renderer
marked.use({ renderer: new CustomRenderer() });

// Beispiel:
// const markdown = '![Alt Text](bild.png)\n\nEin Text.';
// console.log(marked(markdown));

export { marked };