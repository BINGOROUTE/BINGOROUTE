export const Router = (function () {
  let routes = [];
  let outlet = null;

  function norm(path) { return path.replace(/^#?\/?/, '/'); }

  function compile(pattern) {
    const parts = pattern.split('/').filter(Boolean);
    const keys = [];
    const rx = new RegExp('^/' + parts.map(p => p.startsWith(':') ? (keys.push(p.slice(1)), '([^/]+)') : p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('/') + '$');
    return { pattern, keys, rx };
  }

  function resolve(path) {
    for (const r of routes) {
      const m = r.rx.exec(path);
      if (m) {
        const params = {};
        r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i+1]));
        return { handler: r.handler, params };
      }
    }
    return null;
  }

  function render() {
    const path = norm(location.hash || '#/');
    const found = resolve(path) || resolve('/');
    if (!found) return;
    const node = found.handler(found.params || {});
    outlet.innerHTML = '';
    if (node) outlet.appendChild(node);
    document.documentElement.scrollTop = 0;
  }

  function mount(root, table) {
    outlet = root;
    routes = Object.entries(table).map(([pattern, handler]) => ({ ...compile(pattern), handler }));
    window.addEventListener('hashchange', render);
    if (!location.hash) location.hash = '#/';
    render();
  }

  return { mount };
})();

