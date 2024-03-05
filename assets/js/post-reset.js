if (new URLSearchParams(new URL(document.URL).search).get('reset')) {
  window.history.replaceState({}, document.title, '/')
}
