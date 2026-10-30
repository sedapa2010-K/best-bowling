// Renders the privacy policy (both languages) on privacy.html from the shared documents in docs.js.
['ko', 'en'].forEach((l) => {
  const d = window.BB_DOCS[l].privacy;
  document.getElementById(l).innerHTML = `<h2>${d.title}</h2>${d.html}`;
});
