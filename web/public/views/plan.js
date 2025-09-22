import { div, el, fmtDate } from '../utils.js';
import { DESTINATIONS, WEATHER_PRESETS } from '../data.js';
import { store } from '../state.js';

export function PlanView() {
  // Wizard state persisted in memory for this session
  let state = {
    start: new Date().toISOString().slice(0, 10),
    end: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    theme: null,
    areas: [],
    selected: [],
    step: 1,
  };

  const container = div({ class: 'br-container' });

  function headerBar() {
    return div({ class: 'section-header' },
      div({ class: 'row' },
        el('button', { class: 'ghost-btn', onclick: () => (location.hash = '#/') }, '← 홈으로'),
        el('strong', { style: { marginLeft: '8px' } }, '여행 계획 만들기')
      ),
      el('span', { class: 'muted' }, `단계 ${state.step} / 5`)
    );
  }

  function stepsBar() {
    return div({ class: 'steps' },
      ...Array.from({ length: 5 }).map((_, i) => div({ class: 'step' + (i < state.step ? ' active' : '') }))
    );
  }

  function viewStep1() {
    const wbox = renderWeatherBox();
    return div({},
      el('h2', { class: 'planner-title' }, '여행 날짜를 선택해주세요'),
      el('p', { class: 'planner-sub' }, '언제 여행을 떠나실 예정인가요?'),
      div({ class: 'grid-2', style: { margin: '12px 0' } },
        div({ class: 'panel' }, el('label', {}, '출발일'), el('input', { class: 'input', type: 'date', value: state.start, onchange: e => { state.start = e.target.value; } })),
        div({ class: 'panel' }, el('label', {}, '종료일'), el('input', { class: 'input', type: 'date', value: state.end, onchange: e => { state.end = e.target.value; } }))
      ),
      div({ class: 'panel' }, wbox),
      actions(() => { state.step = 2; render(); })
    );
  }

  function viewStep2() {
    const themes = ['역사/문화','쇼핑','맛집','자연/공원','야경','체험','전시/박물관','전통시장','카페','엔터테인먼트'];
    const grid = div({ class: 'wide-chips' }, ...themes.map(t => el('div', { class: 'wide-chip' + (state.theme === t ? ' active' : ''), onclick: () => { state.theme = t; render(); } }, '✓ ' + t)));
    return div({},
      el('h2', { class: 'planner-title' }, '어떤 테마의 여행을 원하시나요?'),
      el('p', { class: 'planner-sub' }, '다양한 테마 중에서 선택해보세요.'),
      grid,
      el('p', { class: 'planner-sub' }, `선택된 테마: ${state.theme || '없음'}`),
      actions(() => { state.step = 3; render(); })
    );
  }

  function viewStep3() {
    const seoulAreas = ['종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구','강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구','구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'];
    const chips = div({ class: 'chips-grid' }, ...seoulAreas.map(a => el('div', { class: 'chip' + (state.areas.includes(a) ? ' active' : ''), onclick: () => toggleArea(a) }, a)));
    function toggleArea(a){ const s=new Set(state.areas); s.has(a)?s.delete(a):s.add(a); state.areas=[...s]; render(); }
    return div({},
      el('h2', { class: 'planner-title' }, '관심 있는 지역을 선택해주세요'),
      el('p', { class: 'planner-sub' }, '서울의 어느 지역에 관심이 있으신가요?'),
      chips,
      el('p', { class: 'planner-sub' }, `선택된 지역: ${state.areas.join(', ') || '없음'}`),
      actions(() => { state.step = 4; render(); }, () => { state.step = 2; render(); })
    );
  }

  function viewStep4() {
    const { top, byArea } = generateRecommendations(state);

    const selectedSet = new Set(state.selected);
    const selectedList = div({ class: 'selected-list', style: { display: selectedSet.size ? 'block' : 'none' } },
      el('strong', {}, `선택된 여행지 (${selectedSet.size}개)`),
      ...Array.from(selectedSet).map(id => el('div', {}, '• ', findPOI(id).name))
    );

    function rows(items){
      return div({ class: 'box' }, ...items.map(p => poiRow(p)));
    }

    function poiRow(p){
      const picked = selectedSet.has(p.id);
      return div({ class: 'poi-row', style: { marginBottom: '10px' } },
        div({}, el('div', { class: 'meta' }, el('span', { class: 'score' }, p.score.toFixed(1)), ' ', p.name), el('div', { class: 'muted' }, `${p.area} · ★ ${p.rating}`)),
        el('button', { class: picked ? 'brand-btn' : 'neutral-btn', onclick: () => { picked?selectedSet.delete(p.id):selectedSet.add(p.id); state.selected = Array.from(selectedSet); render(); } }, picked ? '선택됨' : '선택')
      );
    }

    return div({},
      el('h2', { class: 'planner-title' }, 'AI가 추천하는 맞춤형 여행지'),
      el('p', { class: 'planner-sub' }, '입력하신 정보를 바탕으로 추천 결과를 확인하세요.'),
      selectedList,
      div({ class: 'band-purple' }, el('strong', {}, '최고 추천 여행지'), el('div', { class: 'muted', style: { color: 'rgba(255,255,255,.9)' } }, '종합 점수가 가장 높은 여행지입니다.')),
      rows(top),
      div({ class: 'band-blue' }, el('strong', {}, '지역 기반 추천'), el('div', { class: 'muted', style: { color: 'rgba(255,255,255,.9)' } }, '선택하신 관심 지역의 인기 여행지입니다.')),
      rows(byArea),
      actions(() => { state.step = 5; render(); }, () => { state.step = 3; render(); })
    );
  }

  function viewStep5() {
    const picks = state.selected.map(id => findPOI(id));
    const box = div({ class: 'panel' },
      el('h3', {}, '여행 계획 요약'),
      el('div', { class: 'muted' }, `${fmtDate(state.start)} ~ ${fmtDate(state.end)}`),
      el('p', {}, '선택한 테마'), el('div', { class: 'pill' }, state.theme || '미선택'),
      el('p', {}, '관심 지역'), el('div', {}, ...(state.areas.length? state.areas.map(a=>el('span',{class:'pill',style:{marginRight:'6px'}},a)):[el('span',{class:'muted'},'미선택')])) ,
      el('p', { style: { marginTop: '8px' } }, `선택한 여행지 (${picks.length}개)`),
      ...picks.map(p => div({ class: 'poi-row', style: { margin: '8px 0' } }, el('div', {}, p.name, el('div', { class: 'muted' }, p.area))))
    );
    return div({},
      el('h2', { class: 'planner-title' }, '여행 계획이 완성되었습니다!'),
      el('p', { class: 'planner-sub' }, '완성된 계획을 확인하고 저장하세요.'),
      box,
      div({ class: 'planner-actions' },
        el('button', { class: 'neutral-btn', onclick: () => { state.step = 4; render(); } }, '← 이전'),
        el('button', { class: 'brand-btn', onclick: savePlan }, '계획 저장하기')
      )
    );
  }

  function savePlan() {
    if (!store.session) {
      alert('로그인 후 계획을 저장할 수 있어요. 로그인 페이지로 이동합니다.');
      location.hash = '#/login';
      return;
    }
    const trips = store.trips || [];
    trips.push({ id: 't_' + Date.now(), title: `${state.theme || '서울 여행'}`, date: state.start, status: 'upcoming', places: state.selected.map(id => findPOI(id).name) });
    store.trips = trips;
    alert('여행 계획을 저장했습니다. 마이페이지에서 확인하세요.');
    location.hash = '#/mypage';
  }

  function renderWeatherBox() {
    const districts = ['강남구','서초구','마포구','종로구','송파구','성동구'];
    let current = districts[0];
    const wrap = div({},
      div({ class: 'row', style: { justifyContent: 'space-between' } },
        el('strong', {}, '날씨 정보'),
        el('select', { class: 'input', onchange: e => { current = e.target.value; update(); } }, ...districts.map(d => el('option', { selected: d===current }, d)))
      ),
      div({ class: 'meta', id: 'wx-meta' }),
      el('div', { class: 'muted', id: 'wx-adv', style: { marginTop: '6px' } })
    );
    function update(){
      const w = WEATHER_PRESETS['서울'];
      const nudge = (v, n) => Math.round((v + (Math.random()*n - n/2))*10)/10;
      wrap.querySelector('#wx-meta').textContent = `${current} 현재 ${nudge(w.temp,2)}°C · 습도 ${nudge(w.humidity,10)}% · 바람 ${w.wind} · 하늘 ${w.sky}`;
      wrap.querySelector('#wx-adv').textContent = w.advice;
    }
    update();
    return wrap;
  }

  function findPOI(id){
    return RECO_POIS().find(p => p.id === id) || DESTINATIONS.find(d=>d.id===id);
  }

  function RECO_POIS(){
    const base = DESTINATIONS.map(d => ({ id: d.id, name: d.name, area: d.area, rating: d.rating, tags: d.tags }));
    return base.concat([
      { id: 'seoultech', name: '서울과학기술대학교 일대', area: '노원구', rating: 3.8, tags: ['산책','캠퍼스','자연/공원'] },
      { id: 'itaewon', name: '이태원', area: '용산구', rating: 4.3, tags: ['맛집','쇼핑','야경'] },
      { id: 'seodaemunpark', name: '서대문독립공원', area: '서대문구', rating: 4.6, tags: ['역사/문화','공원'] },
    ]);
  }

  function generateRecommendations({ theme, areas }){
    const data = RECO_POIS();
    const tagMatch = (p) => theme ? (p.tags || []).some(t => t.includes(theme.split('/')[0])) : 0;
    const areaMatch = (p) => areas && areas.length ? (areas.some(a => (p.area||'').includes(a)) ? 1 : 0) : 0;
    const score = (p) => (p.rating || 4) * 10 + tagMatch(p)*8 + areaMatch(p)*12 + Math.random()*2;
    const enriched = data.map(p => ({ ...p, score: score(p) }));
    const top = enriched.sort((a,b)=>b.score-a.score).slice(0,4);
    const byArea = enriched.filter(p=>areaMatch(p)).sort((a,b)=>b.rating-a.rating).slice(0,4);
    return { top, byArea };
  }

  function actions(next, prev){
    return div({ class: 'planner-actions' },
      el('button', { class: 'neutral-btn', onclick: () => { if (prev) prev(); else history.back(); } }, '← 이전'),
      el('button', { class: 'brand-btn', onclick: next }, '다음 →')
    );
  }

  function render() {
    container.innerHTML = '';
    container.append(headerBar(), stepsBar());
    if (state.step === 1) container.append(viewStep1());
    else if (state.step === 2) container.append(viewStep2());
    else if (state.step === 3) container.append(viewStep3());
    else if (state.step === 4) container.append(viewStep4());
    else container.append(viewStep5());
  }

  render();
  return container;
}

