// A-Frame Gallery Design Component
import { artPositions }   from './art-config.js';
import { lightPositions } from './light-config.js';

AFRAME.registerComponent('gallery-design', {
  init () {
    const scene = this.el;

    /* 0. target dummy 설치 ─ 그림 정중앙(y + tgtDy) */
    lightPositions.forEach(({ id, tgtDy }) => {
      const art = scene.querySelector(`#${id}`);
      const tgt = document.createElement('a-entity');
      tgt.setAttribute('id', `tgt-${id}`);
      const { x, y, z } = art.getAttribute('position');
      tgt.setAttribute('position', `${x} ${y + tgtDy} ${z}`);
      scene.appendChild(tgt);
    });

    /* 1. 그림용 스포트라이트 */
    lightPositions.forEach(({ id, pos, out = 0 }) => {
      const lamp = document.createElement('a-entity');

      /* 벽 법선 방향으로 out 만큼 전진 */
      const p = { ...pos };
      if (id.startsWith('F')) p.z += out;   // front  : +z
      if (id.startsWith('B')) p.z -= out;   // back   : –z
      if (id.startsWith('L')) p.x -= out;   // left   : –x
      if (id.startsWith('R')) p.x += out;   // right  : +x

      lamp.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
      lamp.setAttribute('light',
        `type: spot; color:#ffffff; intensity:2.4;
         angle:18; penumbra:1; distance:6.5; decay:2;
         castShadow:true; target:#tgt-${id}`);

      scene.appendChild(lamp);
    });

    /* 2. 부드러운 그림자 */
    scene.setAttribute('shadow', 'type: pcfsoft');

    /* 3. 글로벌 라이트 */
    scene.appendChild(makeLight('ambient',    { color:'#fff8e1', intensity:0.2 }));
    scene.appendChild(makeLight('hemisphere', { skyColor:'#ffe4e1', groundColor:'#e1ffe4', intensity:0.3 }));

    /* 4. 파스텔 재질 적용 */
    const pastel = {front:'#f0e1da',back:'#daf0f0',left:'#eadcf0',right:'#f0e1df',floor:'#dfe7e0',ceiling:'#f4f4f4'};
    apply('.wall.front', pastel.front);  apply('.wall.back',  pastel.back);
    apply('.wall.left',  pastel.left);   apply('.wall.right', pastel.right);
    apply('.floor',      pastel.floor);  apply('.ceiling',    pastel.ceiling);

    /* ───────────────── util ───────────────── */
    function makeLight (type, attrs) {
      const e = document.createElement('a-entity');
      e.setAttribute('light',
        Object.entries(attrs).reduce((s,[k,v]) => `${s}${k}:${v}; `, `type:${type}; `).trim());
      return e;
    }
    function apply (sel, color) {
      const mat = `shader:standard;flatShading:true;roughness:1;metalness:0;color:${color};side:double`;
      scene.querySelectorAll(sel).forEach(el => el.setAttribute('material', mat));
    }
  }
});
