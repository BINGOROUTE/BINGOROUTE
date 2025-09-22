import { div, el } from '../utils.js';
import { DESTINATIONS, WEATHER_PRESETS } from '../data.js';
import { DestinationCard } from '../components/destinationCard.js';
import { store } from '../state.js';

export function MainView() {
  const container = div({ class: 'br-container' });

  const hero = div({ class: 'hero' },
    el('div', { class: 'pill', style: { display: 'inline-block', marginBottom: '8px' } }, '서울 추천 가이드'),
    el('h1', {}, '서울을 더 스마트하게 여행하세요'),
    el('p', {}, '서울의 흥미로운 로컬 명소를 발견하고, 나만의 여행 루트를 만들어 보세요.'),
    div({ style: { marginTop: '10px' } },
      el('button', { class: 'brand-btn', onclick: () => (location.hash = store.session ? '#/plan' : '#/login') }, '여행 계획 시작하기')
    )
  );

  const cities = Object.keys(WEATHER_PRESETS);
  let city = cities[0];
  const weatherBox = div({ class: 'panel' });
  function renderWeather() {
    const w = WEATHER_PRESETS[city];
    weatherBox.innerHTML = '';
    weatherBox.append(
      div({ class: 'row', style: { justifyContent: 'space-between', marginBottom: '8px' } },
        el('strong', {}, '날씨 정보'),
        el('select', { class: 'input', onchange: (e) => { city = e.target.value; renderWeather(); } },
          ...cities.map(c => el('option', { value: c, selected: c === city }, c))
        )
      ),
      el('div', { class: 'meta' }, `${city} 현재 ${w.temp}°C · 습도 ${w.humidity}% · 바람 ${w.wind} · 하늘 ${w.sky}`),
      el('div', { class: 'muted', style: { marginTop: '6px' } }, w.advice)
    );
  }
  renderWeather();

  let filter = '';
  const tabs = ['전체', '인기', '산책', '전통'];
  let activeTab = '전체';

  const tabBar = div({ class: 'tabs' },
    ...tabs.map(t => el('div', { class: 'tab' + (t === activeTab ? ' active' : ''), onclick: () => { activeTab = t; renderCards(); } }, t))
  );

  const cardsWrap = div({ class: 'cards' });
  function renderCards() {
    tabBar.querySelectorAll('.tab').forEach((n, i) => n.classList.toggle('active', tabs[i] === activeTab));
    const q = filter.trim().toLowerCase();
    const data = DESTINATIONS.filter(d => {
      const tabOk = activeTab === '전체' || (activeTab === '인기' ? d.rating >= 4.6 : d.tags.some(x => (activeTab === '산책' && x === '산책') || (activeTab === '전통' && x === '전통')));
      const qOk = !q || [d.name, d.area, d.short, d.tags.join(' ')].join(' ').toLowerCase().includes(q);
      return tabOk && qOk;
    });
    cardsWrap.innerHTML = '';
    cardsWrap.append(...data.map(DestinationCard));
  }
  renderCards();

  container.append(hero, div({ class: 'section' }, weatherBox), div({ class: 'section' }, el('h3', {}, '추천 여행지'), tabBar, cardsWrap));

  const onSearch = (e) => { filter = e.detail || ''; renderCards(); };
  document.addEventListener('br:search', onSearch);

  return container;
}

