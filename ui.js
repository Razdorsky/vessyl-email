export function setupDisclosureMotion(reducedMotion) {
  const variants = [...document.querySelectorAll('.install-variant')];
  const states = new Map();
  for (const variant of variants) {
    // Native grouping closes siblings immediately; animate that step ourselves.
    variant.removeAttribute('name');
    states.set(variant, { expanded: variant.open, animation: null, fade: null });
    variant.dataset.expanded = String(variant.open);
  }
  function toggle(variant, expanded, instant = false) {
    const state = states.get(variant);
    if (state.expanded === expanded && !state.animation && !instant) return;
    const summary = variant.querySelector('summary');
    const body = variant.querySelector('.variant-body');
    const startHeight = variant.getBoundingClientRect().height;
    const startOpacity = variant.open ? getComputedStyle(body).opacity : 0;
    variant.style.height = `${startHeight}px`;
    state.animation?.cancel();
    state.fade?.cancel();
    state.animation = state.fade = null;
    state.expanded = expanded;
    variant.dataset.expanded = String(expanded);
    summary.setAttribute('aria-expanded', String(expanded));
    body.inert = !expanded;
    if (instant || reducedMotion.matches) {
      variant.open = expanded;
      variant.style.height = variant.style.overflow = '';
      return;
    }
    variant.open = true;
    variant.style.overflow = 'hidden';
    const styles = getComputedStyle(variant);
    const border = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
    const endHeight = summary.getBoundingClientRect().height + border
      + (expanded ? body.getBoundingClientRect().height : 0);
    const animation = variant.animate([
      { height: `${startHeight}px` }, { height: `${endHeight}px` },
    ], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
    state.animation = animation;
    state.fade = body.animate([
      { opacity: startOpacity }, { opacity: expanded ? 1 : 0 },
    ], { duration: expanded ? 280 : 180, easing: 'ease', fill: 'forwards' });
    animation.onfinish = () => {
      if (state.animation !== animation) return;
      variant.open = expanded;
      variant.style.height = variant.style.overflow = '';
      state.fade?.cancel();
      animation.cancel();
      state.animation = state.fade = null;
    };
  }
  for (const variant of variants) {
    variant.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      const expanded = !states.get(variant).expanded;
      if (expanded) for (const sibling of variants) if (sibling !== variant) toggle(sibling, false);
      toggle(variant, expanded);
    });
  }
  const settle = () => {
    for (const variant of variants) toggle(variant, states.get(variant).expanded, true);
  };
  window.addEventListener('resize', settle);
  reducedMotion.addEventListener('change', settle);
  return settle;
}

export function setupLanguageMenu(onSelect, reducedMotion) {
  const selector = document.querySelector('.language-selector');
  const trigger = document.querySelector('#language-trigger');
  const menu = document.querySelector('#language-menu');
  const options = [...menu.querySelectorAll('[data-locale]')];
  let open = false;
  let animation;
  function setOpen(next, focus = false) {
    const opacity = menu.hidden ? 0 : getComputedStyle(menu).opacity;
    const transform = menu.hidden ? 'translateY(-5px) scale(.98)' : getComputedStyle(menu).transform;
    animation?.cancel();
    animation = null;
    open = next;
    trigger.setAttribute('aria-expanded', String(open));
    selector.classList.toggle('is-open', open);
    menu.inert = !open;
    if (open) menu.hidden = false;
    if (reducedMotion.matches) {
      menu.hidden = !open;
    } else if (!menu.hidden) {
      animation = menu.animate([
        { opacity, transform },
        { opacity: open ? 1 : 0, transform: open ? 'translateY(0) scale(1)' : 'translateY(-5px) scale(.98)' },
      ], { duration: open ? 260 : 180, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
      const current = animation;
      current.onfinish = () => {
        if (current !== animation) return;
        menu.hidden = !open;
        current.cancel();
        animation = null;
      };
    }
    if (focus && open) (options.find(item => item.getAttribute('aria-checked') === 'true') || options[0]).focus();
  }
  trigger.addEventListener('click', () => setOpen(!open));
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true, true);
    }
  });
  for (const option of options) option.addEventListener('click', () => {
    onSelect(option.dataset.locale);
    setOpen(false);
    trigger.focus();
  });
  menu.addEventListener('keydown', event => {
    const index = options.indexOf(document.activeElement);
    const next = event.key === 'ArrowDown' ? options[(index + 1) % options.length]
      : event.key === 'ArrowUp' ? options[(index + options.length - 1) % options.length]
      : event.key === 'Home' ? options[0] : event.key === 'End' ? options.at(-1) : null;
    if (next) { event.preventDefault(); next.focus(); }
    if (event.key === 'Tab') setOpen(false);
  });
  document.addEventListener('pointerdown', event => {
    if (open && !selector.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (open && event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.focus(); }
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) setOpen(open); });
}

export function setupLanguageTextMotion(reducedMotion) {
  let revision = 0;
  let animations = [];
  let pendingUpdate;
  const targets = () => [...document.querySelectorAll(
    '[data-i18n],[data-i18n-html],[data-i18n-placeholder],#signature-preview p,[data-signature-cta]',
  )].filter(element => element.getClientRects().length);
  const cancel = () => { for (const animation of animations) animation.cancel(); animations = []; };
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    revision += 1;
    cancel();
    const update = pendingUpdate;
    pendingUpdate = null;
    update?.();
  });
  return async update => {
    const current = ++revision;
    const departing = targets().map(element => {
      const style = getComputedStyle(element);
      return { element, opacity: style.opacity, transform: style.transform };
    });
    cancel();
    pendingUpdate = update;
    if (!reducedMotion.matches) {
      animations = departing.map(({ element, opacity, transform }) => element.animate([
        { opacity, transform }, { opacity: 0, transform },
      ], { duration: 120, easing: 'ease-out', fill: 'forwards' }));
      await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
    }
    if (current !== revision) return;
    pendingUpdate = null;
    update();
    cancel();
    if (reducedMotion.matches) return;
    // Blueprint copy arrival: 7px, 400ms, 240ms delay, the same easing curve.
    animations = targets().map(element => element.animate([
      { opacity: 0, transform: 'translateY(7px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 400, delay: 240, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }));
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
    if (current === revision) cancel();
  };
}
