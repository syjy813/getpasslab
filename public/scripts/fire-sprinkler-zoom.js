(() => {
  const dialog = document.getElementById('image-dialog');
  if (!(dialog instanceof HTMLDialogElement)) return;
  let opener;
  let snapshot;
  const properties = ['position', 'top', 'left', 'right', 'overflow', 'padding-right'];
  const restore = () => {
    if (!snapshot) return;
    for (const [key, value, priority] of snapshot.styles) {
      if (value) document.body.style.setProperty(key, value, priority);
      else document.body.style.removeProperty(key);
    }
    window.scrollTo(snapshot.x, snapshot.y);
    snapshot = undefined;
    opener?.focus({ preventScroll: true });
    opener = undefined;
  };
  const close = () => { dialog.close(); restore(); };
  document.querySelectorAll('.zoom-button').forEach(button => {
    button.addEventListener('click', () => {
      if (dialog.open) return;
      opener = button;
      const crop = dialog.querySelector('.zoom-crop');
      crop.className = 'sprinkler-crop zoom-crop ' + button.dataset.position;
      crop.querySelector('img').alt = button.closest('figure').querySelector('img').alt;
      dialog.querySelector('h2').textContent = button.dataset.title;
      snapshot = {
        x: scrollX, y: scrollY,
        styles: properties.map(key => [key, document.body.style.getPropertyValue(key), document.body.style.getPropertyPriority(key)]),
      };
      const scrollbar = innerWidth - document.documentElement.clientWidth;
      const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.setProperty('position', 'fixed');
      document.body.style.setProperty('top', `-${snapshot.y}px`);
      document.body.style.setProperty('left', `-${snapshot.x}px`);
      document.body.style.setProperty('right', '0');
      document.body.style.setProperty('overflow', 'hidden');
      document.body.style.setProperty('padding-right', `${padding + scrollbar}px`);
      dialog.showModal();
      dialog.querySelector('.zoom-scroll').scrollTo(0, 0);
    });
  });
  dialog.querySelector('[data-close-modal]').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', restore);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
})();
