
(function() {
  const selector = ['#minutes-pad','#submissions-pad'];

  // Utility: sucht alle <p> und fügt contains-images hinzu, wenn sie ein <img> haben
  function markImages(root) {
    root.querySelectorAll('p').forEach(p => {
      if (p.querySelector('img')) {
        p.classList.add('contains-images');
      }
    });
  }

  // Poll-Loop: jede 200 ms prüfen, ob Pad fertig ist
  const interval = setInterval(() => {
    const pad = document.querySelector(selector);
    if (!pad) return;

    // Wenn der Loading-Text weg ist (Pad hat echten Inhalt gerendert)...
    if (!pad.textContent.includes('Loading Content')) {
      // füge die Klassen hinzu und beende das Polling
      markImages(pad);
      clearInterval(interval);
    }
  }, 200);
})();
