// ES module entry: boot app, mount router
import { insertBaseStyles } from './styles.js';
import { Router } from './router.js';
import { Header } from './views/header.js';
import { MainView } from './views/main.js';
import { LoginView } from './views/login.js';
import { SignupView } from './views/signup.js';
import { MyPageView } from './views/mypage.js';
import { PlanView } from './views/plan.js';
import { PlaceView } from './views/place.js';
import { store } from './state.js';

insertBaseStyles();

const appRoot = document.getElementById('app');
const layout = document.createElement('div');
layout.className = 'br-layout';
const header = Header();
const outlet = document.createElement('main');
outlet.id = 'outlet';
layout.appendChild(header);
layout.appendChild(outlet);
appRoot.innerHTML = '';
appRoot.appendChild(layout);

Router.mount(outlet, {
  '/': () => MainView(),
  '/login': () => LoginView(),
  '/signup': () => SignupView(),
  '/mypage': () => MyPageView(),
  '/plan': () => PlanView(),
  '/place/:id': (params) => PlaceView(params),
});

// Expose store for debugging
window.BR = { store };

