document.querySelectorAll('p').forEach(p => {
  if (p.querySelectorAll('img').length > 0) {
    p.classList.add('contains-images');
  }
});
