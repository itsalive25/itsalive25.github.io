
// --- src/renderer/CustomRenderer.js ---
import DefaultRenderer from './DefaultRenderer.js';

// Erweitere die originale Renderer-Klasse
class CustomRenderer extends DefaultRenderer {
  // Überschreibe nur die paragraph-Methode
  paragraph(text) {
    if (text.includes('<img')) {
      return `<p class=\"contains-images\">${text}</p>\n`;
    }
    return super.paragraph(text);
  }
}

export default CustomRenderer;
