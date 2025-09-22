import { store } from './state.js';

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'style') Object.assign(node.style, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v);
  });
  children.flat().forEach((c) => {
    if (c == null) return;
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  });
  return node;
}

export function div(attrs, ...children) { return el('div', attrs, ...children); }
export function btn(label, props = {}) { return el('button', { class: 'brand-btn', ...props }, label); }

export function fmtDate(isoLike) {
  try { return new Date(isoLike).toLocaleDateString('ko-KR'); } catch { return isoLike; }
}

export function requireAuth() {
  const s = store.session;
  if (!s) location.hash = '#/login';
  return !!s;
}

