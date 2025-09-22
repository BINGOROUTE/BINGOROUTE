import { div, el } from '../utils.js';
import { DESTINATIONS } from '../data.js';
import { store } from '../state.js';

export function PlaceView(params) {
  const id = params.id;
  const d = DESTINATIONS.find(x => x.id === id);
  if (!d) {
    return div({ class: 'br-container' }, el('p', {}, '해당 여행지를 찾을 수 없습니다.'), el('button', { class: 'ghost-btn', onclick: () => history.back() }, '← 뒤로'));
  }
  const saved = new Set(store.wishlist || []);
  const isSaved = saved.has(d.id);

  const saveBtn = el('button', { class: isSaved ? 'brand-btn' : 'ghost-btn', onclick: toggleSave }, isSaved ? '찜 해제' : '찜하기');
  function toggleSave(){ if(saved.has(d.id)) saved.delete(d.id); else saved.add(d.id); store.wishlist = Array.from(saved); saveBtn.textContent = saved.has(d.id)?'찜 해제':'찜하기'; saveBtn.className = saved.has(d.id)?'brand-btn':'ghost-btn'; }

  const container = div({ class: 'br-container' },
    div({ class: 'section-header' },
      el('button', { class: 'ghost-btn', onclick: () => history.back() }, '← 뒤로가기'),
      el('span', { class: 'muted' }, d.area)
    ),
    div({ class: 'panel' },
      div({ class: 'img', style: { height: '240px', borderRadius: '12px', marginBottom: '10px', background: '#dbeafe' } }),
      el('h2', {}, d.name),
      el('div', { class: 'meta' }, `${d.area} · 평점 ${d.rating} · 소요시간 ${d.duration}`),
      el('p', { style: { marginTop: '6px' } }, d.long),
      div({ class: 'row', style: { marginTop: '10px' } }, saveBtn, el('button', { class: 'brand-btn', onclick: () => (location.hash = '#/plan') }, '여행 계획 시작하기'))
    )
  );

  return container;
}

