import { div, el, fmtDate, requireAuth } from '../utils.js';
import { DestinationCard } from '../components/destinationCard.js';
import { DESTINATIONS } from '../data.js';
import { store } from '../state.js';

export function MyPageView() {
  if (!requireAuth()) return div({});
  const s = store.session;

  if ((store.trips || []).length === 0) {
    store.trips = [
      { id: 't1', title: '친구들과 홍대 나들이', date: '2024-01-20', status: 'done', places: ['홍대거리', '연남공원'] },
      { id: 't2', title: '서울 역사 탐방', date: '2024-03-15', status: 'upcoming', places: ['경복궁', '인사동'] },
    ];
  }

  let tab = 'upcoming';
  const container = div({ class: 'br-container' });

  const header = div({ class: 'panel' },
    div({ class: 'row', style: { justifyContent: 'space-between' } },
      div({}, el('strong', {}, s.name || s.email), el('div', { class: 'muted' }, s.email)),
      el('span', { class: 'muted' }, `완료한 여행 ${store.trips.filter(t=>t.status==='done').length}개`)
    )
  );

  const tabBar = div({ class: 'tabs' },
    Tab('다가오는 여행', 'upcoming'),
    Tab('찜목록', 'saved'),
    Tab('지난 여행', 'done'),
  );

  function Tab(label, key) {
    const node = el('div', { class: 'tab' + (tab === key ? ' active' : ''), onclick: () => { tab = key; renderList(); } }, label);
    return node;
  }

  const list = div({ class: 'section' });

  function renderList() {
    tabBar.querySelectorAll('.tab').forEach(n => n.classList.remove('active'));
    const idx = ['upcoming','saved','done'].indexOf(tab);
    if (idx >= 0) tabBar.querySelectorAll('.tab')[idx].classList.add('active');

    list.innerHTML = '';
    if (tab === 'saved') {
      const ids = new Set(store.wishlist || []);
      const data = DESTINATIONS.filter(d => ids.has(d.id));
      if (data.length === 0) {
        list.append(
          div({ class: 'center panel' },
            el('div', { style: { fontSize: '24px' } }, '♡'),
            el('p', { class: 'muted' }, '찜한 여행지가 없습니다'),
            el('button', { class: 'brand-btn', onclick: () => (location.hash = '#/') }, '여행지 둘러보기')
          )
        );
      } else {
        list.append(div({ class: 'cards' }, ...data.map(DestinationCard)));
      }
      return;
    }

    const items = (store.trips || []).filter(t => t.status === tab);
    if (items.length === 0) {
      list.append(div({ class: 'center panel' }, el('p', {}, '표시할 여행이 없습니다.')));
      return;
    }
    items.forEach(t => {
      list.append(
        div({ class: 'panel', style: { marginBottom: '10px' } },
          div({ class: 'row', style: { justifyContent: 'space-between' } },
            el('div', {}, el('strong', {}, t.title), el('div', { class: 'muted' }, fmtDate(t.date))),
            el('button', { class: 'ghost-btn', onclick: () => alert('데모: 수정/공유 기능은 추후 구현 예정') }, '⋯')
          ),
          el('div', { class: 'meta' }, t.places.join(' · ')),
          tab === 'done' ? el('button', { class: 'brand-btn', style: { marginTop: '8px' }, onclick: () => alert('데모: 다시 계획하기는 미구현') }, '다시 계획하기') : null
        )
      );
    });
  }
  renderList();

  container.append(header, tabBar, list);
  return container;
}

