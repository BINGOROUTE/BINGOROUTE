import { div, el } from '../utils.js';
import { store } from '../state.js';

export function LoginView() {
  const wrapper = div({ class: 'br-container' },
    el('div', { class: 'panel', style: { maxWidth: '520px', margin: '22px auto' } },
      div({ class: 'row' }, el('button', { class: 'ghost-btn', onclick: () => history.back() }, '← 뒤로가기')),
      el('h2', {}, '로그인'),
      el('p', { class: 'muted' }, '빙고루트에 다시 오신 것을 환영합니다.'),
      el('form', { class: 'form', onsubmit: onSubmit },
        el('input', { class: 'input', name: 'email', placeholder: '아이디(이메일)를 입력해주세요', required: true, type: 'email' }),
        el('input', { class: 'input', name: 'password', placeholder: '비밀번호를 입력해주세요', required: true, type: 'password' }),
        el('button', { class: 'brand-btn', type: 'submit' }, '로그인')
      ),
      div({ class: 'row', style: { marginTop: '10px', justifyContent: 'space-between' } },
        el('button', { class: 'ghost-btn', onclick: () => (location.hash = '#/signup') }, '회원가입'),
        el('span', { class: 'muted' }, 'ID/PW 찾기는 데모에 포함되지 않습니다')
      )
    )
  );

  function onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const user = (store.users || []).find(u => u.email === data.email && u.password === data.password);
    if (!user) {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    store.session = { id: user.id, name: user.name, email: user.email };
    location.hash = '#/';
  }

  return wrapper;
}

