import { div, el } from '../utils.js';
import { store } from '../state.js';

export function Header() {
  function rightArea() {
    const s = store.session;
    if (s) {
      return div({ class: 'row' },
        el('span', { class: 'muted' }, s.name || s.email),
        el('button', { class: 'ghost-btn', onclick: () => (location.hash = '#/mypage') }, '내 정보'),
        el('button', { class: 'ghost-btn', onclick: () => { store.session = null; location.hash = '#/'; } }, '로그아웃'),
      );
    }
    return div({ class: 'row' },
      el('button', { class: 'ghost-btn', onclick: () => (location.hash = '#/login') }, '로그인')
    );
  }

  const node = el('header', { class: 'br-header' },
    div({ class: 'br-container row' },
      div({ class: 'brand', onclick: () => (location.hash = '#/') },
        el('span', { class: 'badge' }, 'B'),
        el('span', {}, '빙고루트')
      ),
      div({ class: 'search' }, el('input', { placeholder: '예: 경복궁, 근처 한옥카페…', oninput: onSearchInput })),
      rightArea()
    )
  );

  function onSearchInput(e) {
    document.dispatchEvent(new CustomEvent('br:search', { detail: e.target.value }));
  }

  return node;
}

