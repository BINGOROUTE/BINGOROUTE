import { div, el } from '../utils.js';
import { store } from '../state.js';

export function SignupView() {
  const wrapper = div({ class: 'br-container' },
    el('div', { class: 'panel', style: { maxWidth: '640px', margin: '22px auto' } },
      div({ class: 'row' }, el('button', { class: 'ghost-btn', onclick: () => history.back() }, '← 뒤로가기')),
      el('h2', {}, '회원가입'),
      el('p', { class: 'muted' }, '빙고루트와 함께 서울여행을 시작해보세요'),
      el('form', { class: 'form', onsubmit: onSubmit },
        el('input', { class: 'input', name: 'name', placeholder: '이름', required: true }),
        el('input', { class: 'input', name: 'email', placeholder: '이메일', type: 'email', required: true }),
        el('input', { class: 'input', name: 'id', placeholder: '아이디', required: true }),
        el('input', { class: 'input', name: 'password', placeholder: '비밀번호 (8자 이상)', type: 'password', minlength: 8, required: true }),
        el('input', { class: 'input', name: 'password2', placeholder: '비밀번호 확인', type: 'password', minlength: 8, required: true }),
        el('input', { class: 'input', name: 'phone', placeholder: '휴대전화 (선택)' }),
        div({}, el('label', {}, el('input', { type: 'checkbox', required: true }), ' 이용약관 및 개인정보에 동의합니다.')),
        el('button', { class: 'brand-btn', type: 'submit' }, '회원가입')
      )
    )
  );

  function onSubmit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target).entries());
    if (f.password !== f.password2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    const users = store.users || [];
    if (users.some(u => u.email === f.email)) {
      alert('이미 가입된 이메일입니다.');
      return;
    }
    const user = { id: 'u_' + Date.now(), name: f.name, email: f.email, loginId: f.id, password: f.password, phone: f.phone };
    users.push(user);
    store.users = users;
    alert('가입이 완료되었습니다. 로그인 해주세요.');
    location.hash = '#/login';
  }

  return wrapper;
}

