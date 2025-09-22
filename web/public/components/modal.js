import { div } from '../utils.js';

export function Modal({ title, content, onClose }) {
  const close = () => { document.body.removeChild(backdrop); onClose && onClose(); };
  const backdrop = div({ class: 'modal-backdrop', onclick: (e) => { if (e.target === backdrop) close(); } },
    div({ class: 'modal', role: 'dialog', 'aria-modal': 'true' },
      div({ class: 'header' },
        document.createElement('strong').appendChild(document.createTextNode(title || '상세 정보')) && document.createElement('div'),
        (()=>{ const b=document.createElement('button'); b.className='ghost-btn'; b.textContent='닫기'; b.onclick=close; return b; })()
      ),
      div({ class: 'content' }, content)
    )
  );
  document.body.appendChild(backdrop);
  return backdrop;
}

