document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 1. LÓGICA DO CARROSSEL (UX de Abrir e Fechar Intocada)
    // =======================================================
    const secaoDetalhes = document.querySelector('#integrante-detalhes');
    const imagemDetalhe = document.querySelector('#detalhe-imagem');
    const nomeDetalhe = document.querySelector('#detalhe-nome');
    const cargoDetalhe = document.querySelector('#detalhe-cargo');
    const rmDetalhe = document.querySelector('#detalhe-rm');
    const descricaoDetalhe = document.querySelector('#detalhe-descricao');
    const turmaDetalhe = document.querySelector('#detalhe-turma');
    const linksDetalhe = document.querySelector('#detalhe-links');
    
    let integranteAberto = null; 

    const icones = {
        github: `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:100%;height:100%;fill:currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.01c-3.2.7-3.88-1.38-3.88-1.38-.53-1.33-1.29-1.68-1.29-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.11-.75.41-1.26.74-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.58.24 2.75.12 3.04.74.8 1.19 1.83 1.19 3.08 0 4.42-2.69 5.38-5.25 5.67.42.36.79 1.07.79 2.16v3.01c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>`,
        linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:100%;height:100%;fill:currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.4h3.96V21H3V9.4Zm6.24 0h3.79v1.58h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V21h-3.95v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9.24V9.4Z"/></svg>`
    };

    function limparSelecao() {
        document.querySelectorAll('.slide .item').forEach(el => el.classList.remove('selecionado'));
    }

    document.body.addEventListener('click', (event) => {
        const itemClicado = event.target.closest('.item');
        
        if (itemClicado) {
            const data = itemClicado.dataset;

            if (integranteAberto === data.rm && secaoDetalhes.classList.contains('ativo')) {
                secaoDetalhes.classList.remove('ativo');
                limparSelecao();
                integranteAberto = null; 
                setTimeout(() => { secaoDetalhes.style.display = 'none'; }, 400); 
            } else {
                imagemDetalhe.src = data.imagem;
                nomeDetalhe.textContent = data.nome;
                cargoDetalhe.textContent = data.cargo;
                rmDetalhe.textContent = `RM: ${data.rm}`;
                turmaDetalhe.textContent = `Turma: ${data.turma}`;
                descricaoDetalhe.textContent = data.descricao;

                linksDetalhe.innerHTML = `
                    <a class="social-link" href="${data.github}" target="_blank" rel="noopener noreferrer">
                        <span class="social-link__icon">${icones.github}</span><span>GitHub</span>
                    </a>
                    <a class="social-link" href="${data.linkedin}" target="_blank" rel="noopener noreferrer">
                        <span class="social-link__icon">${icones.linkedin}</span><span>LinkedIn</span>
                    </a>
                `;

                limparSelecao();
                itemClicado.classList.add('selecionado');
                integranteAberto = data.rm;

                secaoDetalhes.style.display = 'block';
                setTimeout(() => {
                    secaoDetalhes.classList.add('ativo');
                    secaoDetalhes.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        }
    });

    // =======================================================
    // 2. MOTOR WEBGL — Proto E (Gargantua Final, 60fps)
    //    Partículas claras (photon sphere + disco interno) = ESTÁTICAS
    //    Partículas externas/halo = DINÂMICAS (mouse trail completo)
    // =======================================================
    const canvas = document.getElementById('blackHoleCanvas');
    const gl = canvas ? canvas.getContext('webgl', {
        alpha: true, antialias: false, depth: false,
        premultipliedAlpha: false, preserveDrawingBuffer: false
    }) : null;

    if (!gl) return;

    // Dimensões lógicas fixas — correspondem ao CSS do canvas (1400×900)
    const CW = 1400, CH = 900;

    const C = {
        countD: 42000, countM: 16000,
        ptD: 2.6,      ptM: 3.0,
        INCLINE:     0.28,
        EH:          0.18,
        PS_END:      0.28,
        ID_END:      0.68,
        BEAM_BRIGHT: 3.4,
        BEAM_DIM:    0.16,
        returnIdle:   0.028,
        returnActive: 0.0022,
        friction:     0.954,
        maxSpeed:     0.065,
        noise:        0.00012,
        mouseFollowR: 195,
        mouseFollow:  0.00052,
        pathTube:     178,
        pathEdge:     62,
        pathFollow:   0.0065,
        pathTargetPull: 0.034,
        pathEdgePull: 0.0082,
        pathOrbit:    0.0023,
        flow:         0.00168,
        headPush:     0.0046,
        settleDelay:  190,
        releaseDelay: 520,
    };

    const S = {
        mob: false, dpr: 1, count: 0,
        pos: null, vel: null, alp: null, seeds: null, col: null,
        ang: null, rad: null, spd: null, dyn: null,
        trail: [],
        ptr: { px: 0, py: 0, lastX: 0, lastY: 0, lastT: 0 },
        lastMove: -9999,
    };

    const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
    const cx2px = x  => (x  + 1) * 0.5 * CW;
    const cy2py = y  => (1  - y)  * 0.5 * CH;
    const px2cx = px => (px / CW) * 2 - 1;
    const px2cy = py => 1 - (py / CH) * 2;

    // Shaders — qualidade idêntica à home
    const VERT = `
        attribute vec3  aPosition;
        attribute float aAlpha;
        attribute float aSeed;
        attribute vec3  aColor;
        uniform float   uPointSize;
        uniform float   uDpr;
        varying float   vAlpha;
        varying float   vSeed;
        varying vec3    vColor;
        void main() {
            vAlpha = aAlpha; vSeed = aSeed; vColor = aColor;
            gl_Position = vec4(aPosition, 1.0);
            float depth      = 1.0 + aPosition.z * 0.22;
            float outerBoost = 1.0 + max(0.0, length(aPosition.xy) - 0.45) * 0.48;
            gl_PointSize = uPointSize * uDpr * depth * 1.25 * outerBoost;
        }
    `;
    const FRAG = `
        precision highp float;
        varying float vAlpha; varying float vSeed; varying vec3 vColor;
        void main() {
            vec2  uv      = gl_PointCoord - 0.5;
            float d       = length(uv);
            float dotMask = smoothstep(0.48, 0.075, d);
            float core    = smoothstep(0.18, 0.0, d) * 0.22;
            float rim     = smoothstep(0.50, 0.26, d) * 0.16;
            float shimmer = 1.0 + sin(vSeed * 44.0) * 0.22;
            float alpha   = (dotMask + core + rim) * vAlpha * shimmer;
            gl_FragColor  = vec4(vColor, alpha);
        }
    `;

    function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s); return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const loc = {
        pos:  gl.getAttribLocation(prog,  'aPosition'),
        alp:  gl.getAttribLocation(prog,  'aAlpha'),
        seed: gl.getAttribLocation(prog,  'aSeed'),
        col:  gl.getAttribLocation(prog,  'aColor'),
        ps:   gl.getUniformLocation(prog, 'uPointSize'),
        dpr:  gl.getUniformLocation(prog, 'uDpr'),
    };
    const bufs = {
        pos:  gl.createBuffer(), alp:  gl.createBuffer(),
        seed: gl.createBuffer(), col:  gl.createBuffer(),
    };

    function buildParticles() {
        S.mob   = window.innerWidth < 720;
        S.dpr   = Math.min(window.devicePixelRatio || 1, S.mob ? 1.4 : 1.7);
        canvas.width  = Math.round(CW * S.dpr);
        canvas.height = Math.round(CH * S.dpr);
        S.count = S.mob ? C.countM : C.countD;

        S.pos   = new Float32Array(S.count * 3);
        S.vel   = new Float32Array(S.count * 3);
        S.alp   = new Float32Array(S.count);
        S.seeds = new Float32Array(S.count);
        S.col   = new Float32Array(S.count * 3);
        S.ang   = new Float32Array(S.count);
        S.rad   = new Float32Array(S.count);
        S.spd   = new Float32Array(S.count);
        S.dyn   = new Uint8Array(S.count);  // 0=estático, 1=dinâmico

        const aspect = CW / CH;
        const { EH, PS_END, ID_END, INCLINE, BEAM_BRIGHT, BEAM_DIM } = C;
        const rand = Math.random.bind(Math);

        for (let i = 0; i < S.count; i++) {
            const o    = i * 3;
            const zone = rand();
            S.seeds[i] = rand();
            const angle = rand() * Math.PI * 2;
            S.ang[i] = angle;

            let r, cr, cg, cb, alpha;

            if (zone < 0.28) {
                // Photon sphere — estática, branca-amarelada
                r = EH + (PS_END - EH) * Math.pow(rand(), 1.6);
                const heat = 1.0 - (r - EH) / (PS_END - EH);
                cr = 0.96 + heat * 0.04; cg = 0.88 + heat * 0.10; cb = 0.65 + heat * 0.14;
                alpha = 0.62 + heat * 0.38;
                S.dyn[i] = 0;

            } else if (zone < 0.52) {
                // Disco interno — estático, branco-quente → laranja-dourado
                r  = PS_END + Math.pow(rand(), 1.4) * (ID_END - PS_END);
                const t = (r - PS_END) / (ID_END - PS_END);
                cr = 1.0; cg = Math.max(0.10, 0.98 - t * 0.80); cb = Math.max(0.00, 0.28 - t * 0.26);
                alpha = (0.70 - t * 0.24) * (0.55 + rand() * 0.45);
                S.dyn[i] = 0;

            } else if (zone < 0.76) {
                // Disco externo — dinâmico, VIOLETA-ROXO
                r  = ID_END + Math.pow(rand(), 0.85) * 1.25;
                const t = (r - ID_END) / 1.25;
                cr = Math.max(0.10, 0.62 - t * 0.40);
                cg = Math.max(0.00, 0.04 - t * 0.03);
                cb = Math.max(0.20, 0.88 - t * 0.45);
                alpha = (0.32 - t * 0.26) * (0.42 + rand() * 0.58);
                S.dyn[i] = 1;

            } else {
                // Halo — dinâmico, ROXO PROFUNDO, mais espalhado
                r  = 1.55 + Math.pow(rand(), 0.38) * 1.20;
                cr = 0.30; cg = 0.00; cb = 0.80;
                alpha = 0.018 + rand() * 0.065;
                S.dyn[i] = 1;
            }

            S.rad[i] = r;
            S.spd[i] = (0.0019 / Math.sqrt(r)) * (0.74 + rand() * 0.52);

            const zJitter = zone < 0.28 ? 0.025 : zone < 0.52 ? 0.05 : 0.14;
            S.pos[o]   = (Math.cos(angle) * r) / aspect;
            S.pos[o+1] = Math.sin(angle) * r * INCLINE;
            S.pos[o+2] = (rand() - 0.5) * zJitter;

            const doppler = Math.sin(angle);
            const beam    = doppler > 0
                ? 1.0 + (BEAM_BRIGHT - 1.0) * doppler
                : 1.0 - (1.0 - BEAM_DIM) * (-doppler);
            const blue    = Math.max(0, doppler) * 0.45;

            S.col[o]   = clamp(cr * (1.0 - blue * 0.12) * beam, 0, 1);
            S.col[o+1] = clamp(cg * (1.0 + blue * 0.08) * beam, 0, 1);
            S.col[o+2] = clamp((cb + blue * 0.52) * beam, 0, 1);
            S.alp[i]   = clamp(alpha * beam, 0.004, 1.0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.alp);
        gl.bufferData(gl.ARRAY_BUFFER, S.alp,   gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.seed);
        gl.bufferData(gl.ARRAY_BUFFER, S.seeds, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.col);
        gl.bufferData(gl.ARRAY_BUFFER, S.col,   gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos);
        gl.bufferData(gl.ARRAY_BUFFER, S.pos,   gl.DYNAMIC_DRAW);
    }

    // Trail — reutiliza objeto para evitar alocação por frame
    const _hit = { x:0, y:0, d:0, tx:0, ty:0, nx:0, ny:0, vx:0, vy:0, score:0, head:false };
    let _hitValid = false;

    function sampleTrail(px, py) {
        _hitValid = false;
        if (S.trail.length < 2) return;
        let bestScore = 0;
        const R = C.pathTube;
        for (let i = 1; i < S.trail.length; i++) {
            const a = S.trail[i-1], b = S.trail[i];
            const abx = b.x-a.x, aby = b.y-a.y;
            const len2 = abx*abx + aby*aby || 1;
            const u = clamp(((px-a.x)*abx + (py-a.y)*aby) / len2, 0, 1);
            const cx = a.x+abx*u, cy = a.y+aby*u;
            const dx = px-cx, dy = py-cy, d2 = dx*dx+dy*dy;
            const age = (S.trail.length-i) / Math.max(1, S.trail.length);
            const r = R * (1.08 - age * 0.42);
            if (d2 < r*r) {
                const d = Math.sqrt(d2)||1, len = Math.sqrt(len2)||1;
                const sc = Math.pow(1-d/r, 1.25) * (a.life*(1-u)+b.life*u) * (1-age*0.18);
                if (sc > bestScore) {
                    bestScore = sc; _hitValid = true;
                    _hit.x = cx; _hit.y = cy; _hit.d = d;
                    _hit.tx = abx/len; _hit.ty = aby/len;
                    _hit.nx = d > 1 ? dx/d : -aby/len;
                    _hit.ny = d > 1 ? dy/d :  abx/len;
                    _hit.vx = a.vx*(1-u)+b.vx*u;
                    _hit.vy = a.vy*(1-u)+b.vy*u;
                    _hit.score = sc;
                    _hit.head  = i > S.trail.length - 5;
                }
            }
        }
    }

    function pushPointer(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        // Converte coordenadas da janela para o espaço lógico do canvas (CW×CH)
        const x = (clientX - rect.left) * (CW / (rect.width  || CW));
        const y = (clientY - rect.top)  * (CH / (rect.height || CH));
        const now = performance.now();
        const dt  = Math.max(16, now - (S.ptr.lastT || now));
        S.ptr.vx  = (x - S.ptr.lastX) / dt * 16.67;
        S.ptr.vy  = (y - S.ptr.lastY) / dt * 16.67;
        S.ptr.px = x; S.ptr.py = y;
        S.ptr.lastX = x; S.ptr.lastY = y; S.ptr.lastT = now;
        S.lastMove = now;
        const prev = S.trail[S.trail.length - 1];
        if (!prev || (x-prev.x)*(x-prev.x)+(y-prev.y)*(y-prev.y) > 7.8) {
            S.trail.push({ x, y, vx: S.ptr.vx, vy: S.ptr.vy, life: 1.0 });
            if (S.trail.length > 128) S.trail.shift();
        }
    }

    function updatePhysics(now) {
        const activating  = now - S.lastMove < C.settleDelay;
        const recentlyMvd = now - S.lastMove < C.releaseDelay;
        const rf  = recentlyMvd ? C.returnActive : C.returnIdle;
        const inv2W = 2 / CW, inv2H = 2 / CH;
        const asp   = CW / CH;
        const { INCLINE, friction, maxSpeed, noise } = C;

        for (let t = S.trail.length - 1; t >= 0; t--) {
            S.trail[t].life *= activating ? 0.968 : 0.87;
            if (S.trail[t].life < 0.025) S.trail.splice(t, 1);
        }

        for (let i = 0; i < S.count; i++) {
            const o = i * 3;
            let x = S.pos[o], y = S.pos[o+1], z = S.pos[o+2];
            let vx = S.vel[o], vy = S.vel[o+1], vz = S.vel[o+2];

            S.ang[i] += S.spd[i];
            const r  = S.rad[i];
            const hx = (Math.cos(S.ang[i]) * r) / asp;
            const hy = Math.sin(S.ang[i]) * r * INCLINE;

            if (S.dyn[i] === 0) {
                // ESTÁTICAS — mola rígida, sem mouse, sem ruído
                vx += (hx - x) * 0.058;
                vy += (hy - y) * 0.058;
                vz += (0  - z) * 0.040;
                vx *= 0.88; vy *= 0.88; vz *= 0.80;

            } else {
                // DINÂMICAS — mola normal + trail completo
                vx += (hx - x) * rf;
                vy += (hy - y) * rf;
                vz += (0  - z) * rf * 0.52;

                if (activating && S.trail.length > 0) {
                    const px = cx2px(x), py = cy2py(y);
                    const mdx = S.ptr.px - px, mdy = S.ptr.py - py;
                    const md2 = mdx*mdx + mdy*mdy;
                    const mR  = C.mouseFollowR;
                    if (md2 < mR*mR) {
                        const md = Math.sqrt(md2) || 1;
                        const ms = Math.pow(1 - md/mR, 1.45);
                        vx += (mdx/md) * C.mouseFollow * ms * inv2W * 260;
                        vy -= (mdy/md) * C.mouseFollow * ms * inv2H * 260;
                    }
                    sampleTrail(px, py);
                    if (_hitValid) {
                        const sc = _hit.score;
                        const gesture = Math.hypot(_hit.vx, _hit.vy);
                        let dirX = _hit.tx, dirY = _hit.ty;
                        if (gesture > 0.01 && dirX*_hit.vx + dirY*_hit.vy < 0) { dirX=-dirX; dirY=-dirY; }
                        const hb   = _hit.head ? 1.65 : 1.0;
                        const side = S.seeds[i] > 0.5 ? 1 : -1;
                        const dOff = C.pathEdge * side;
                        const tpx  = _hit.x + _hit.nx * dOff;
                        const tpy  = _hit.y + _hit.ny * dOff;
                        vx += (px2cx(tpx) - x) * Math.min(0.066, C.pathTargetPull * sc * hb);
                        vy += (px2cy(tpy) - y) * Math.min(0.066, C.pathTargetPull * sc * hb);
                        vx += (_hit.tx  * inv2W) * C.pathFollow   * sc * 430;
                        vy += (-_hit.ty * inv2H) * C.pathFollow   * sc * 430;
                        const ef = clamp((dOff - _hit.d*side) / 70, -1, 1);
                        vx += (_hit.nx  * inv2W) * C.pathEdgePull * ef * sc * 610 * hb;
                        vy += (-_hit.ny * inv2H) * C.pathEdgePull * ef * sc * 610 * hb;
                        vx += (-_hit.ty * inv2W) * C.pathOrbit    * sc * side * 165;
                        vy += (-_hit.tx * inv2H) * C.pathOrbit    * sc * side * 165;
                        vx += (_hit.tx  * inv2W) * C.flow         * sc * gesture * 1.45;
                        vy += (-_hit.ty * inv2H) * C.flow         * sc * gesture * 1.45;
                        vx += (_hit.nx  * inv2W) * C.headPush     * sc * (_hit.head ? 72 : 22);
                        vy += (-_hit.ny * inv2H) * C.headPush     * sc * (_hit.head ? 72 : 22);
                        vz += Math.sin(S.seeds[i] * 100) * 0.003 * sc;
                    }
                }
                vx += Math.sin(now * 0.0011 + S.seeds[i] * 78) * noise;
                vy += Math.cos(now * 0.0009 + S.seeds[i] * 43) * noise;
                vx *= friction; vy *= friction; vz *= 0.934;
            }

            const sp = vx*vx + vy*vy;
            if (sp > maxSpeed*maxSpeed) {
                const inv = maxSpeed / Math.sqrt(sp);
                vx *= inv; vy *= inv;
            }
            x += vx; y += vy; z = clamp(z + vz, -0.44, 0.44);
            S.pos[o]=x; S.pos[o+1]=y; S.pos[o+2]=z;
            S.vel[o]=vx; S.vel[o+1]=vy; S.vel[o+2]=vz;
        }
    }

    function render(now) {
        updatePhysics(now);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, S.pos);   // bufferSubData = sem GC
        gl.enableVertexAttribArray(loc.pos);
        gl.vertexAttribPointer(loc.pos, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.alp);
        gl.enableVertexAttribArray(loc.alp);
        gl.vertexAttribPointer(loc.alp, 1, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.seed);
        gl.enableVertexAttribArray(loc.seed);
        gl.vertexAttribPointer(loc.seed, 1, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.col);
        gl.enableVertexAttribArray(loc.col);
        gl.vertexAttribPointer(loc.col, 3, gl.FLOAT, false, 0, 0);

        gl.uniform1f(loc.ps,  S.mob ? C.ptM : C.ptD);
        gl.uniform1f(loc.dpr, S.dpr);
        gl.drawArrays(gl.POINTS, 0, S.count);
        requestAnimationFrame(render);
    }

    window.addEventListener('mousemove',  e => pushPointer(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove',  e => { if(e.touches[0]) pushPointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    function clearTrail() { S.ptr.lastT = 0; S.trail.length = 0; S.lastMove = -9999; }
    window.addEventListener('mouseleave', clearTrail);
    window.addEventListener('touchend',   clearTrail);

    let rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildParticles, 150); });

    buildParticles();
    requestAnimationFrame(render);
});
