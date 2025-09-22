import { Modal } from './modal.js';
import { div, el } from '../utils.js';
import { store } from '../state.js';

export function DestinationCard(dest) {
  const isSaved = (store.wishlist || []).includes(dest.id);

  const saveBtn = el('button', { class: 'ghost-btn right', onclick: toggleSave }, isSaved ? '찜 해제' : '찜하기');

  function toggleSave() {
    const list = new Set(store.wishlist || []);
    if (list.has(dest.id)) list.delete(dest.id); else list.add(dest.id);
    store.wishlist = Array.from(list);
    saveBtn.textContent = list.has(dest.id) ? '찜 해제' : '찜하기';
  }

  const moreBtn = el('button', { class: 'brand-btn', onclick: () => (location.hash = '#/place/' + dest.id) }, '자세히 보기');

  return div({ class: 'card' },
    div({ class: 'img' }),
    div({ class: 'body' },
      div({ class: 'row' }, el('strong', {}, dest.name), el('span', { class: 'pill' }, dest.duration), saveBtn),
      div({ class: 'meta' }, `${dest.area}`, `· 평점 ${dest.rating}`),
      el('p', { class: 'muted' }, dest.short),
      div({}, moreBtn)
    )
  );
}

