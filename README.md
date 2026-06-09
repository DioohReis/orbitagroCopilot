# OrbitAgro Copilot

> Plataforma de monitoramento agricola por satelite em tempo real, com inteligencia analitica, visualizacao WebGL e diagnostico agronomico interativo.

FIAP — Global Solution 2026/1 | Disciplina: Front-End Design Engineering | Turma: 1TDSPF

### [github.com/DioohReis/orbitagroCopilot](https://github.com/DioohReis/orbitagroCopilot)

---

## Sumario

1. [Visao Geral](#visao-geral)
2. [Como Rodar Localmente](#como-rodar-localmente)
   - [Pre-requisito — Extensao CORS](#pre-requisito-obrigatorio--extensao-cors)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Arquitetura do Projeto](#arquitetura-do-projeto)
5. [Funcionalidades por Pagina](#funcionalidades-por-pagina)
6. [Motor de Particulas WebGL](#motor-de-particulas-webgl)
7. [Integracoes com APIs Externas](#integracoes-com-apis-externas)
8. [Responsividade](#responsividade)
9. [Boas Praticas Aplicadas](#boas-praticas-aplicadas)
10. [Screenshots](#screenshots)
11. [Equipe](#equipe)
12. [Contato](#contato)

---

## Visao Geral

O **OrbitAgro Copilot** e um copiloto agricola digital que usa imagens de satelite, dados climaticos em tempo real e inteligencia computacional para ajudar produtores rurais a tomarem decisoes precisas sobre suas lavouras sem precisar de equipamento especializado.

O produtor informa o tipo de cultura, e o sistema cruza automaticamente:
- **Imagens NDVI** (saude das folhas via satelite Sentinel-2)
- **Mapas NDMI** (umidade do solo via satelite)
- **Dados climaticos** (temperatura, vento, chuva acumulada — Open-Meteo API)
- **Mapa interativo de pragas** (focos identificados por regiao e cultura)

O resultado e um **laudo analitico inteligente** com nivel de risco (NOMINAL / ATENCAO / CRITICO) e recomendacoes de acao especificas para a cultura selecionada.

---

## Como Rodar Localmente

O projeto e **100% front-end** — sem servidor de aplicacao, sem banco de dados, sem dependencias externas que precisem de instalacao.

```bash
# 1. Clone o repositorio
git clone https://github.com/DioohReis/orbitagroCopilot.git

# 2. Entre na pasta
cd orbitagroCopilot

# 3. Abra com Live Server (recomendado)
#    No VS Code: instale a extensao Live Server
#    Clique com botao direito em index.html -> Open with Live Server

# 4. OU abra diretamente no navegador
#    Arraste o arquivo index.html para o Chrome ou Firefox
```

**Atencao:** Para que as APIs de geolocalizacao e clima funcionem corretamente, e recomendado usar um servidor local (como o Live Server do VS Code) em vez de abrir o arquivo diretamente (`file://`), pois navegadores modernos restringem acesso a APIs de localizacao em contextos inseguros.

---

### Pre-requisito Obrigatorio — Extensao CORS

As imagens NDVI e NDMI do satelite Sentinel-2 sao carregadas diretamente da API da ESA (European Space Agency). O navegador bloqueia essas requisicoes por padrao (politica de seguranca CORS — Cross-Origin Resource Sharing). **Sem a extensao, as imagens de satelite nao aparecem.**

**Solucao:** Instale a extensao gratuita **Allow CORS: Access-Control-Allow-Origin** no Google Chrome:

> 🔗 [Instalar Allow CORS — Chrome Web Store](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=pt-PT&utm_source=ext_sidebar)

**Como ativar:**

1. Acesse o link acima e clique em **Usar no Chrome**
2. Apos instalada, clique no icone da extensao (canto superior direito do Chrome)
3. Ative o toggle para habilitar
4. Recarregue o OrbitAgro Copilot — as imagens do satelite carregarao normalmente

> **Obs:** A extensao so precisa estar ativa durante o uso do site. Pode ser desativada a qualquer momento pelo mesmo icone.

---
## Tecnologias Utilizadas

### HTML5 — A Estrutura Semantica

**O que e:** HTML5 (HyperText Markup Language versao 5) e a linguagem que define a **estrutura e o significado** do conteudo de uma pagina web. E o "esqueleto" do projeto — define o que existe, enquanto o CSS define como parece e o JavaScript define como se comporta.

**Como usamos:**

- Tags semanticas: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>` — dizem ao navegador e aos leitores de tela qual e o **proposito** de cada bloco de conteudo (em vez de usar `<div>` para tudo)
- `<canvas>` para renderizacao 3D das particulas via WebGL (sem plugins)
- Atributos ARIA (Accessible Rich Internet Applications): `aria-label`, `aria-expanded`, `aria-live`, `aria-current`, `aria-hidden` — fundamentais para acessibilidade de usuarios com deficiencia visual
- `<fieldset>` e `<legend>` para agrupar semanticamente os campos do laudo analitico
- Formularios com atributos `required`, `type="email"`, `type="number"` e validacao via JavaScript

**Por que importa:** HTML semantico correto melhora o SEO (posicionamento no Google), acessibilidade para leitores de tela e a manutenibilidade do codigo. E tambem um dos criterios avaliados na disciplina de Front-End Design Engineering.

---

### CSS3 — Estilo, Layout e Animacoes

**O que e:** CSS3 (Cascading Style Sheets versao 3) e a linguagem que define a **aparencia visual** dos elementos HTML. "Cascading" significa que regras mais especificas sobrepoe regras mais gerais — a ordem e especificidade importam.

**Modulos CSS3 utilizados:**

#### CSS Grid Layout

Permite criar layouts **bidimensionais** (linhas E colunas simultaneamente) sem usar tabelas ou frameworks. E o modulo de layout mais poderoso do CSS moderno.

```css
/* Secao em duas colunas: formulario a esquerda, painel de preview a direita */
.split-layout {
  display: grid;
  grid-template-columns: 500px 1fr; /* coluna fixa de 500px + coluna flexivel */
  gap: 80px;                        /* espaco entre colunas */
}

/* Grade responsiva automatica: quantas colunas couberem */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

#### CSS Flexbox

Layout **unidimensional** para alinhar e distribuir elementos em uma linha ou coluna. Complementa o Grid para alinhamentos menores.

```css
/* Centraliza logo e menu na mesma linha, com espaco entre eles */
.header-inner {
  display: flex;
  align-items: center;        /* centraliza verticalmente */
  justify-content: space-between; /* logo a esquerda, menu a direita */
}
```

#### CSS Custom Properties (Variaveis CSS)

Variaveis **nativas do CSS** (sem pre-processadores como Sass) que permitem reutilizar valores e mudar o tema dinamicamente via JavaScript.

```css
:root {
  --primary: #4caf50;                  /* verde — muda para vermelho em risco critico */
  --glow: rgba(76, 175, 80, 0.4);
  --ease: cubic-bezier(0.16, 1, 0.3, 1); /* curva de aceleracao "spring" */
  --glass-border: rgba(255, 255, 255, 0.1);
}

/* O JavaScript muda --primary e --glow ao gerar o diagnostico */
document.documentElement.style.setProperty('--primary', '#d32f2f'); /* vermelho critico */
```

#### CSS Scroll Snap

Permite que o scroll "encaixe" em secoes especificas, criando navegacao por etapas (como slides) sem JavaScript.

```css
.journey-container {
  scroll-snap-type: y mandatory; /* snap vertical obrigatorio */
  overflow-y: scroll;
  height: 100vh;
}

.stage {
  scroll-snap-align: start; /* cada secao e um ponto de encaixe */
  height: 100vh;
}
```

#### CSS Backdrop Filter

Efeito de **vidro fosco** (*glassmorphism*) — desfoca o conteudo atras de um elemento semi-transparente.

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);          /* desfoque do fundo */
  -webkit-backdrop-filter: blur(20px);  /* prefixo para Safari */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}
```

#### CSS Animations e Keyframes

Animacoes **declarativas** — definidas 100% em CSS, sem JavaScript.

```css
/* Anel pulsante no botao de diagnostico */
@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0;   }
}

/* Indicador LIVE piscando no painel de preview */
@keyframes pulse-tag {
  0%, 100% { opacity: 1;    }
  50%       { opacity: 0.45; }
}
```

#### CSS clamp() — Tipografia Fluida

A funcao `clamp(minimo, preferido, maximo)` ajusta automaticamente valores (tipicamente font-size) conforme a largura do viewport, eliminando dezenas de media queries.

```css
h1 { font-size: clamp(2rem, 5vw, 4.5rem); }
/* → minimo 32px | cresce 5% da largura da tela | maximo 72px */
```

#### mix-blend-mode

Modo de fusao entre camadas — define como pixels de elementos sobrepostos se combinam. As particulas WebGL usam `screen` para simular **luz aditiva** real (cores que se somam como luz, nao pigmento).

```css
#particleCanvas    { mix-blend-mode: screen; } /* home: particulas verdes/brancas */
#blackHoleCanvas   { mix-blend-mode: screen; } /* equipe: disco de acrecao laranja */
```

---

### JavaScript ES6+ — Logica e Interatividade

**O que e:** JavaScript e a unica linguagem de programacao nativa dos navegadores. "ES6+" refere-se as versoes modernas do ECMAScript (padrao que define a linguagem), a partir de 2015, que introduziram sintaxes expressivas e recursos poderosos.

**Recursos ES6+ utilizados no projeto:**

| Recurso | O que faz | Exemplo no projeto |
|---|---|---|
| `const` / `let` | Variaveis com escopo de bloco (mais seguras que `var`) | Configuracoes fisicas das particulas |
| Arrow functions `() =>` | Funcoes compactas sem contexto `this` proprio | Todos os event listeners |
| Template literals `` `${var}` `` | Strings com interpolacao de variaveis | Geracao de HTML dinamico nas recomendacoes |
| Destructuring | Extrai propriedades de objetos/arrays | `const { nome, pragas } = agroDB[crop]` |
| Optional chaining `?.` | Acessa propriedade sem erro se null | `element?.classList.add('active')` |
| Nullish coalescing `??` | Valor padrao quando null/undefined | `input?.value ?? 0` |
| `async/await` | Codigo assincrono legivel (sem callback hell) | Chamadas as APIs de clima e satelite |
| Spread operator `...` | Copia e mescla arrays/objetos | Configuracoes de WebGL context |
| IIFE `(() => { })()` | Funcao auto-invocada que isola escopo | Motor WebGL (evita poluir o escopo global) |
| `Float32Array` | Array tipado de 32 bits de alta performance | Buffers de posicao/cor/alpha das particulas |
| `Promise` + `fetch` | Requisicoes HTTP assincronas | Open-Meteo API |
| `IntersectionObserver` | Observa elementos entrando no viewport | Animacoes de scroll reveal |
| `navigator.geolocation` | Localizacao GPS do usuario | Coordenadas para busca de dados climaticos |
| `navigator.vibrate` | Feedback haptico no mobile | Clique no botao de diagnostico |

---

### WebGL — Graficos 3D no Navegador (sem plugins)

**O que e:** WebGL (Web Graphics Library) e uma API JavaScript baseada no padrao **OpenGL ES 2.0** que permite renderizar graficos 2D e 3D com aceleracao de GPU diretamente no elemento `<canvas>`. Nao precisa de Flash, Unity Web Player ou qualquer plugin — e 100% nativo e padrao em todos os browsers modernos.

**Como funciona em alto nivel:**

```
JavaScript (CPU)           WebGL (GPU)
─────────────────────────────────────────────────────
1. Cria buffers de dados   → gl.createBuffer()
2. Envia posicoes/cores    → gl.bufferData()
3. Compila shaders GLSL    → gl.compileShader()
4. Chama draw call         → gl.drawArrays()
                           ← GPU processa 40.000+ vertices em paralelo
                           ← Tela atualizada a 60fps
```

**Por que usamos em vez de CSS/SVG:** Animar 40.000 elementos via CSS/SVG causaria queda de desempenho severa (cada elemento e um no separado no DOM). Com WebGL, todos os 40.000 pontos sao enviados como um unico buffer de dados e processados em paralelo pela GPU — tipicamente em menos de 2ms por frame.

#### Buffers de Dados (Float32Array)

```javascript
// Cada particula ocupa 3 floats (x, y, z) no buffer de posicoes
state.positions  = new Float32Array(count * 3);  // x,y,z de cada particula
state.velocities = new Float32Array(count * 3);  // velocidade em 3 eixos
state.colors     = new Float32Array(count * 3);  // R, G, B de cada particula
state.alphas     = new Float32Array(count);       // transparencia individual
```

`Float32Array` e um **TypedArray** — um array de 32 bits de ponto flutuante armazenado em memoria contigua. E ate 10x mais rapido que arrays JavaScript comuns para esta tarefa porque pode ser transferido diretamente para a GPU sem conversao.

#### Blending Aditivo

```javascript
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // gl.ONE = modo ADITIVO
```

Com blending aditivo, quando duas particulas se sobrepoem, suas cores **somam** — exatamente como fisica de luz real. Uma area com muitas particulas fica mais brilhante, simulando plasma incandescente ou campos de estrelas. E o oposto do blending normal onde cores escurecem ao se sobrepor.

---

### GLSL — A Linguagem dos Shaders

**O que e:** GLSL (OpenGL Shading Language) e uma linguagem de programacao **tipada e compilada**, sintaticamente parecida com C, que roda **diretamente na GPU** em paralelo massivo. Cada "shader" e um programa minusculo que roda milhoes de vezes por frame.

**Vertex Shader** — Roda uma vez para cada VERTICE (particula). Define ONDE aparece na tela.

```glsl
attribute vec3 aPosition;    /* posicao 3D recebida do JavaScript */
attribute float aAlpha;      /* transparencia por particula */
attribute vec3 aColor;       /* cor RGB por particula */
uniform float uPointSize;    /* tamanho do ponto (uniforme para todas) */
uniform float uDpr;          /* Device Pixel Ratio para telas Retina */
varying float vAlpha;        /* passa alpha para o Fragment Shader */
varying vec3 vColor;         /* passa cor para o Fragment Shader */

void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    gl_Position = vec4(aPosition, 1.0);       /* posicao no espaco de clip [-1, +1] */
    float depth = 1.0 + aPosition.z * 0.2;   /* profundidade simula perspectiva */
    gl_PointSize = uPointSize * uDpr * depth; /* pontos mais proximos = maiores */
}
```

**Fragment Shader** — Roda para cada PIXEL dentro de cada ponto. Define a COR de cada pixel.

```glsl
precision highp float;    /* precisao alta para gradientes suaves */
varying float vAlpha;
varying vec3 vColor;

void main() {
    vec2 uv = gl_PointCoord - 0.5;         /* centro do ponto em (0,0) */
    float d = length(uv);                  /* distancia ao centro [0, 0.5] */
    float mask = smoothstep(0.48, 0.1, d); /* circulo suave (borda esfumada) */
    float core = smoothstep(0.18, 0.0, d) * 0.5; /* nucleo mais brilhante */
    gl_FragColor = vec4(vColor, (mask + core) * vAlpha);
}
```

`smoothstep(a, b, x)` e uma funcao matematica que interpola suavemente entre 0 e 1 quando x vai de `a` ate `b` — cria bordas suaves sem aliasing.

---

### Fisica Kepleriana — Simulacao Orbital Real

**O que e:** A **Terceira Lei de Kepler** (Johannes Kepler, 1619) descreve como corpos orbitam outros por gravidade: objetos mais proximos do centro gravitacional orbitam **muito mais rapido**. A velocidade orbital e inversamente proporcional a raiz quadrada do raio orbital.

**Formula:**
```
v = k / sqrt(r)
```
Onde `v` e a velocidade orbital, `r` e o raio e `k` e uma constante dependente da massa central.

**Implementacao no disco de acrecao do buraco negro:**

```javascript
// Cada particula tem velocidade Kepleriana baseada no seu raio
// Particulas internas (proximas ao buraco negro) orbitam muito mais rapido
state.speeds[i] = (0.0019 / Math.sqrt(r)) * (0.76 + Math.random() * 0.48);
// A variacao aleatoria simula excentricidades orbitais reais

// A cada frame, avancamos o angulo orbital pela velocidade
state.angles[i] += state.speeds[i];
const hx = (Math.cos(state.angles[i]) * r) / aspect; // posicao alvo X
const hy =  Math.sin(state.angles[i]) * r * 0.26;     // posicao alvo Y (disco inclinado)
```

A inclinacao de `0.26` faz o disco aparecer inclinado ~15 graus em relacao ao plano frontal, exatamente como visto em imagens do Event Horizon Telescope (EHT) do buraco negro M87*.

---

### Efeito Doppler — Shift de Cor Fisicamente Correto

**O que e:** O **Efeito Doppler Relativistico** (previsto pela Relatividade Especial de Albert Einstein, 1905) descreve a mudanca na frequencia (e portanto cor) da luz emitida por objetos em movimento relativo ao observador:

- Objeto **se aproximando**: frequencia aumenta → luz parece mais **azul** (blueshift)
- Objeto **se afastando**: frequencia diminui → luz parece mais **vermelha** (redshift)

Em discos de acrecao de buracos negros, este efeito e extremamente pronunciado pois o gas orbita a fracao significativa da velocidade da luz.

**Implementacao:**

```javascript
// Para um disco girando no sentido anti-horario:
// sin(angle) > 0: lado esquerdo aproximando-se do observador -> blueshift
// sin(angle) < 0: lado direito afastando-se do observador -> redshift
const doppler = Math.sin(angle);      // [-1.0, +1.0]
const blueAmt = doppler * 0.30;       // intensidade do shift

// Componente azul aumenta no lado de aproximacao
state.colors[o+2] = clamp(cb + Math.max(0, blueAmt) * 0.48, 0, 1);
// Transparencia aumenta no lado mais brilhante (blueshift = mais energia)
state.alphas[i]   = clamp(alpha * (0.68 + Math.max(0, doppler) * 0.32), 0.01, 1.0);
```

O resultado visual: o lado esquerdo do disco aparece mais brilhante e azulado, o lado direito mais escuro e avermelhado — identico ao que foi fotografado pelo EHT em 2019.

---

### Geolocation API — Localizacao do Usuario

**O que e:** A `navigator.geolocation` e uma **API nativa do navegador** (W3C Geolocation API Specification) que solicita permissao ao usuario para acessar suas coordenadas GPS (latitude e longitude) com precisao de metros a dezenas de metros, dependendo do hardware.

**Implementacao:**

```javascript
navigator.geolocation.getCurrentPosition(
    position => {
        const lat = position.coords.latitude;   // Ex: -23.5505 (Sao Paulo)
        const lon = position.coords.longitude;  // Ex: -46.6333
        const acc = position.coords.accuracy;   // Precisao em metros

        // Atualiza HUD com coordenadas reais da fazenda
        document.getElementById('hud-location').textContent =
            `LAT ${lat.toFixed(4)}° LON ${lon.toFixed(4)}°`;

        // Passa para API de clima e satelite
        fetchWeatherData(lat, lon);
    },
    error => {
        // Erro 1: usuario negou permissao
        // Erro 2: localizacao indisponivel
        // Erro 3: timeout
        console.warn('Geolocalizacao negada, usando dados simulados');
    },
    { timeout: 10000, maximumAge: 300000 } // 5 min de cache
);
```

---

### Open-Meteo API — Dados Climaticos em Tempo Real

**O que e:** A [Open-Meteo](https://open-meteo.com/) e uma API meteorologica **gratuita, open-source e sem necessidade de chave de API** que fornece previsoes e dados historicos usando modelos numericos de previsao do tempo (NWP — Numerical Weather Prediction) de varios centros meteorologicos globais (ECMWF, NOAA, DWD).

**Dados que buscamos e exibimos:**

| Parametro API | Dado Exibido | Unidade |
|---|---|---|
| `temperature_2m` | Temperatura do ar | °C |
| `windspeed_10m` | Velocidade do vento | km/h |
| `precipitation` | Chuva acumulada (1h) | mm |
| `weathercode` | Estado do tempo (WMO code) | — |
| `european_aqi` | Indice de Qualidade do Ar | AQI |

**Endpoint:**

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current_weather=true
  &hourly=temperature_2m,precipitation,european_aqi
  &forecast_days=1
```

---

### NDVI — Indice de Vegetacao por Diferenca Normalizada

**O que e:** NDVI (Normalized Difference Vegetation Index) e um indice espectral calculado a partir de imagens multiespectrais de satelite que quantifica a **densidade e saude da vegetacao**. Foi desenvolvido pela NASA na decada de 1970 e e ate hoje o indice mais usado em sensoriamento remoto agricola.

**Formula matematica:**

```
NDVI = (NIR - RED) / (NIR + RED)
```

- `NIR` = reflectancia na faixa do infravermelho proximo (comprimento de onda ~842nm)
- `RED` = reflectancia na faixa do vermelho visiivel (~665nm)

**Interpretacao dos valores:**

| Faixa NDVI | Significado Agricola | Cor no mapa |
|---|---|---|
| -1.0 a 0.0 | Agua, rocha, edificacoes | Azul/Cinza |
| 0.0 a 0.2 | Solo exposto, vegetacao morta | Vermelho |
| 0.2 a 0.4 | Vegetacao esparsa, lavoura em estresse | Amarelo/Laranja |
| 0.4 a 0.7 | Lavoura saudavel | Verde claro |
| 0.7 a 1.0 | Vegetacao muito densa e saudavel | Verde escuro |

---

### NDMI — Indice de Umidade por Diferenca Normalizada

**O que e:** NDMI (Normalized Difference Moisture Index) mede o teor de **agua na vegetacao e no solo** usando bandas espectrais diferentes do NDVI.

**Formula matematica:**

```
NDMI = (NIR - SWIR) / (NIR + SWIR)
```

- `NIR` = infravermelho proximo (~842nm)
- `SWIR` = infravermelho de onda curta (~1610nm) — esta banda e fortemente absorvida pela agua

**Interpretacao:**

| Faixa NDMI | Condicao Hidrica | Acao Recomendada |
|---|---|---|
| < -0.2 | Seca severa | Irrigacao emergencial |
| -0.2 a 0.0 | Estresse hidrico moderado | Monitorar e planejar irrigacao |
| 0.0 a 0.4 | Umidade normal | Manter manejo atual |
| > 0.4 | Solo encharcado | Avaliar drenagem |

Zonas amarelas/marrons no Mapa Hidrico do OrbitAgro indicam onde o agricultor deve acionar o pivo central de irrigacao.

---

### Sentinel-2 — Satelite de Observacao da Terra (ESA)

**O que e:** Sentinel-2 e uma constelacao de dois satelites (Sentinel-2A e Sentinel-2B) operados pela **ESA (European Space Agency)** como parte do programa **Copernicus** da Uniao Europeia. Fornecem imagens multiespectrais gratuitas de toda a superficie terrestre.

**Especificacoes tecnicas:**

| Parametro | Valor |
|---|---|
| Resolucao espacial | 10m (bandas visivel/NIR), 20m (SWIR) |
| Revisita | A cada 5 dias (com os dois satelites) |
| Bandas espectrais | 13 bandas (443nm a 2190nm) |
| Cobertura | Global — toda a Terra a cada 5 dias |

**Bandas utilizadas:**

- **Banda 4** (Red, 665nm): Absorcao de clorofila — vegetacao saudavel absorve muito vermelho
- **Banda 8** (NIR, 842nm): Reflectancia de celulas vegetais saudaveis
- **Banda 11** (SWIR, 1610nm): Conteudo de agua nas folhas e no solo

O NDVI e calculado com Bandas 8 e 4. O NDMI e calculado com Bandas 8 e 11.

---

### IntersectionObserver API — Animacoes ao Entrar na Tela

**O que e:** `IntersectionObserver` e uma API JavaScript moderna que observa quando elementos HTML entram ou saem da area visivel da tela (viewport), de forma eficiente sem usar eventos de scroll (que sao muito custosos em desempenho).

**Implementacao:**

```javascript
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-active'); // dispara animacao CSS
        }
    });
}, {
    threshold: 0.15, // 15% do elemento deve estar visivel
    rootMargin: '0px 0px -50px 0px' // margem de 50px antes do fim da tela
});

// Observa todos os elementos com animacao
document.querySelectorAll('.animate-fade-up, .step-item, .solution-card').forEach(el => {
    observer.observe(el);
});
```

O CSS inicial oculta os elementos e o `is-active` dispara a animacao:

```css
.animate-fade-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
}
.animate-fade-up.is-active {
    opacity: 1;
    transform: translateY(0);
}
```

---

### Menu Hamburger — Acessibilidade e Animacao

**O que e:** Padrao de UI (User Interface) onde tres linhas horizontais (chamadas de "hamburger" em design) representam o menu de navegacao em telas pequenas. Ao clicar, abre um menu overlay em tela cheia.

**Implementacao com ARIA completo:**

```html
<button class="menu-toggle" 
        aria-label="Abrir menu mobile" 
        aria-expanded="false"           <!-- estado comunicado para leitores de tela -->
        aria-controls="mobileMenu">     <!-- referencia o menu que controla -->
    <span></span>
    <span></span>
    <span></span>
</button>
```

**Animacao de X via CSS puro** (sem JavaScript para a animacao):

```css
/* Quando aria-expanded="true", as 3 linhas formam um X */
.menu-toggle[aria-expanded="true"] span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);  /* gira 45 graus para cima */
}
.menu-toggle[aria-expanded="true"] span:nth-child(2) {
    opacity: 0; width: 0; /* linha do meio desaparece */
}
.menu-toggle[aria-expanded="true"] span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg); /* gira 45 graus para baixo */
}
```

**JavaScript:** Apenas atualiza `aria-expanded` e a classe `is-open`, sem manipular estilos diretamente. O CSS faz todo o trabalho visual baseado no estado ARIA.

---

## Arquitetura do Projeto

```
orbitagroCopilot/
|
+-- index.html              # Home: Copiloto principal (scroll-snap 7 estagios)
|
+-- pages/
|   +-- sobre.html          # Sobre o projeto e a solucao
|   +-- solucao.html        # Problema + tecnologia + impacto (cards interativos)
|   +-- como-funciona.html  # Guia passo a passo (5 etapas numeradas)
|   +-- faq.html            # Perguntas frequentes (acordeao JavaScript)
|   +-- contato.html        # Formulario com validacao JS (preventDefault)
|   +-- integrantes.html    # Equipe (carrossel 3D CSS + buraco negro WebGL)
|
+-- css/
|   +-- style.css           # Estilos globais: variaveis, layout home, responsivo
|   +-- pages.css           # Estilos sub-paginas: FAQ, contato, solucao, etc.
|   +-- integrantes.css     # Estilos exclusivos: carrossel 3D + buraco negro
|
+-- js/
|   +-- script.js           # Logica principal: APIs, WebGL home, hamburger, laudo
|   +-- pages.js            # FAQ acordeao + animacoes scroll das sub-paginas
|   +-- integrantes.js      # Carrossel 3D + motor WebGL do buraco negro
|
+-- assets/
    +-- DiogoRM573301.jpg
    +-- Gabriel_Ricardo-01.jpeg
    +-- Matheus_Rodrigues.jpeg
    +-- LuizHenrique572727.jpeg
    +-- razo.01.jpeg
```

### Separacao de Responsabilidades

Cada arquivo CSS tem uma responsabilidade clara:

- `style.css` — Base global: variaveis CSS, tipografia, header, home page, responsividade global
- `pages.css` — Sub-paginas: FAQ acordeao, formulario de contato, cards de solucao, steps do como-funciona
- `integrantes.css` — Pagina da equipe: carrossel 3D, canvas do buraco negro, card de detalhes

Cada arquivo JavaScript tambem tem escopo definido:

- `script.js` — Motor WebGL da home, logica de APIs, hamburger menu, laudo analitico
- `pages.js` — Interatividade das sub-paginas (FAQ, animacoes de scroll)
- `integrantes.js` — Carrossel 3D + motor WebGL do buraco negro

---

## Funcionalidades por Pagina

### `index.html` — Copiloto (7 Estagios)

A home page divide a jornada do agricultor em **7 estagios de scroll-snap**, cada um mapeando uma etapa da analise agronomica:

| Estagio | ID do Elemento | Conteudo |
|---|---|---|
| 1 | `#stage-hero` | Apresentacao do Copilot + botao "Iniciar Missao" |
| 2 | `#stage-plantacao` | Selecao de cultura (chips) + painel holografico com dados NDVI/clima |
| 3 | `#stage-sol` | Mapa NDVI do satelite Sentinel-2 + temperatura/vento em tempo real |
| 4 | `#stage-chuva` | Mapa NDMI (umidade do solo) + interpretacao hidrica |
| 5 | `#stage-pragas-interativas` | Mapa interativo com hotspots de pragas por cultura selecionada |
| 6 | `#stage-inspecao` | Laudo Analitico: formulario + preview de risco em tempo real |
| 7 | `#stage-resultado` | Dashboard final: gauge de risco, barras de fatores, recomendacoes |

**Laudo Analitico (Estagio 6):**
O produtor responde 4 perguntas baseadas no que observou nos mapas satelitais e na lavoura fisica. O sistema cruza as respostas com os dados de satelite e calcula um score de risco de 0 a 10:

- `ptsNDVI`: 0 (saudavel) ou 3 (estressado)
- `ptsSeca`: 0 (sem seca), 1 (5+ dias secos) ou 3 (deficit hidrico critico)
- `ptsPraga`: 0 (sem pragas), 2 (foco isolado) ou 4 (infestacao)
- Score total 0-2 = NOMINAL, 3-5 = ATENCAO, 6+ = CRITICO

### `pages/faq.html` — Perguntas Frequentes

Acordeao JavaScript com 10 perguntas. Ao clicar em uma pergunta, a resposta expande com animacao CSS (`max-height` transition de 0 para 600px). Apenas uma resposta fica aberta por vez — as demais fecham automaticamente.

### `pages/contato.html` — Contato

Formulario com validacao JavaScript:
- `e.preventDefault()` impede o envio e recarregamento da pagina
- Regex de e-mail: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Mensagens de erro inline abaixo de cada campo invalido
- Feedback visual de sucesso apos envio simulado

### `pages/integrantes.html` — Equipe

**Carrossel 3D CSS:**
5 cards com `transform: rotateY() translateZ(550px)` criam o efeito de cilindro 3D. A animacao `autoRun` gira continuamente com `@keyframes`. Ao clicar em um card, a seccao de detalhes expande com informacoes do membro.

**Motor WebGL (Buraco Negro):**
50.000 particulas simulando um disco de acrecao com:
- Physics: velocidade Kepleriana por zona radial
- Visual: Efeito Doppler de cor baseado na posicao orbital
- Interacao: mouse trail atrai/empurra particulas (mesma logica da home)
- 4 zonas: Photon Sphere (20%), Disco Interno (38%), Disco Externo (32%), Halo (10%)

---

## Motor de Particulas WebGL

### Buraco Negro (integrantes.js) — 4 Zonas Fisicas

O disco de acrecao e construido com 4 zonas que refletem fisica real de buracos negros:

| Zona | Raio | Particulas | Cor | Temperatura Estimada |
|---|---|---|---|---|
| Event Horizon | r < 0.20 | 0% (vazio) | — | Luz nao escapa |
| Photon Sphere | 0.20 – 0.28 | 20% | Branco-azulado | > 10^9 K |
| Disco Interno | 0.28 – 0.72 | 38% | Branco-laranja | 10^6 – 10^8 K |
| Disco Externo | 0.72 – 1.64 | 32% | Laranja-vermelho | 10^4 – 10^6 K |
| Halo | > 1.64 | 10% | Vermelho difuso | < 10^4 K |

**Interacao com o mouse:** O rastro do cursor e registrado como uma sequencia de pontos com velocidade. As particulas proximas ao rastro sao atraidas pela direcao do movimento — criando um efeito de "arrastar plasma" com a mao.

### Home Page (script.js) — 7 Mascaras de Forma

40.000 particulas com posicoes alvo que mudam conforme o scroll. Cada estagio define uma "mascara" diferente:
- Estagio 1: Particulas distribuidas em campo aberto (hero)
- Estagio 2: Particulas formam silhueta de planta
- Estagio 3: Particulas formam globo/satelite
- E assim por diante...

A particula nao teleporta — ela tem uma "casa" (posicao alvo) e uma velocidade de retorno (`returnForce = 0.024`) que a puxa suavemente para a posicao correta a cada frame.

### Stage Chuva (script.js) — Chuva WebGL + Matrix Rain

Dois sistemas de particulas sobrepostos criam o visual do estagio hidrico:

| Sistema | Canvas | Tecnica | Detalhes |
|---|---|---|---|
| Matrix Rain | `#rainCanvas` | Canvas 2D | Colunas de caracteres com rastro de fade, classico efeito "Matrix" |
| Chuva WebGL | `#glRainCanvas` | WebGL — `gl.TRIANGLES` | 320 gotas renderizadas como quads com gradiente alpha cabeca-cauda |

**Geometria da gota WebGL:**

Cada gota e representada por 2 triangulos (6 vertices). A cabeca da gota tem alpha maximo e a cauda vai a zero, simulando a perspectiva de uma gota em queda. O shader usa `blendFunc(SRC_ALPHA, ONE)` para blending aditivo — gotas sobrepostas ficam mais brilhantes.

```glsl
/* Fragment shader da chuva — cor azulada com transparencia variavel */
gl_FragColor = vec4(0.82, 0.95, 1.0, v_t * 0.72);
```

**Interacao com `particleCanvas`:** O `IntersectionObserver` do stage-chuva também oculta o canvas global de estrelas (`particleCanvas`) via `display: none` ao entrar no viewport, evitando poluicao visual.

### Stage Pragas (script.js) — Folhas WebGL

65 folhas botanicamente corretas renderizadas com `GL_POINTS` e shader de forma no fragment:

```glsl
/* Forma de folha no fragment shader via gl_PointCoord */
float H    = 0.44;            /* meia-altura */
float W    = 0.20;            /* meia-largura maxima */
float halfW = W * pow(1.0 - t, 0.55); /* afila nas pontas */
float edge = 1.0 - smoothstep(halfW * 0.55, halfW, abs(r.x));
```

Cada folha tem: posicao (x, y), tamanho (42–88 px), rotacao, alpha (0.70–0.98) e cor de 7 variacoes de verde. A animacao usa movimento sinusoidal (sway) para simular folhas flutuando ao vento.

---

## Integracoes com APIs Externas

```
Fluxo de dados ao iniciar o Copilot:

1. navigator.geolocation.getCurrentPosition()
      |
      v (lat, lon)
2. fetch('https://api.open-meteo.com/...')
      |
      v (temperatura, vento, chuva, AQI)
3. Sentinel Hub OAuth  -->  token de acesso  -->  URL NDVI do Sentinel-2
4. Sentinel Hub OAuth  -->  token de acesso  -->  URL NDMI do Sentinel-2
5. agroDB[cultura].pragas  -->  hotspots calculados localmente (sem API)
```

Todos os dados sao exibidos nos paineis flutuantes da home e atualizados a cada selecao de cultura pelo usuario.


> **Importante — CORS:** As requisicoes ao Sentinel Hub passam por um proxy CORS (`corsproxy.io`) pois o browser bloqueia chamadas cross-origin por padrao. Alem disso, o usuario precisa ter a extensao **Allow CORS** ativa no Chrome para que as imagens sejam exibidas. Veja a secao [Pre-requisito](#pre-requisito-obrigatorio--extensao-cors) acima.

---

## Responsividade

O projeto usa **4 breakpoints** sem nenhum framework CSS:

| Breakpoint | Contexto | Principais Mudancas |
|---|---|---|
| `max-width: 1024px` | Tablet paisagem / laptop pequeno | Menu hamburger ativo, split-layout em coluna unica, scroll-snap desativado |
| `max-width: 768px` | Tablet retrato | Floating corners tornam-se grade 2x2 abaixo do card de resultado |
| `max-width: 480px` | Mobile | Tipografia reduzida com `clamp()`, tudo em coluna, buraco negro compacto |
| `max-width: 360px` | Mobile XS | Ajustes minimos de padding |

**Tecnicas de responsividade usadas:**

- `clamp(min, ideal, max)` para tipografia fluida sem media queries
- `min(valor, 100%)` para larguras maximas adaptativas
- `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` para grades automaticas
- Substituicao de layouts absolutos (floating corners) por grades CSS fluidas no mobile
- `scroll-snap-type: none` no tablet — scroll livre e mais adequado para touch

---

## Boas Praticas Aplicadas

| Pratica | Implementacao |
|---|---|
| Zero frameworks | Sem Bootstrap, jQuery, React, Vue ou similar |
| CSS externo | Todos estilos em `/css` — nenhuma prop `style=""` no HTML |
| JavaScript externo | Toda logica em `/js` — nenhum `<script>` inline |
| HTML5 semantico | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` |
| Acessibilidade ARIA | `aria-label`, `aria-expanded`, `aria-live`, `aria-current`, `aria-hidden` |
| Validacao de formulario | `preventDefault()` + feedback visual inline |
| Menu hamburger acessivel | Animacao CSS pura, fecha com ESC e clique em link |
| IntersectionObserver | Animacoes de scroll sem polling custoso |
| Scroll Snap | Navegacao entre secoes sem JavaScript |
| Guard clause WebGL | `if (!canvas) return` — motor nao executa sem canvas |
| Geolocalizacao segura | Tratamento de erro ao negar permissao |
| Commits semanticos | Prefixos `feat:`, `fix:`, `docs:`, `refactor:` |
| README completo | Este documento |

---

## Screenshots

> Projeto rodando localmente — abra `index.html` com Live Server para ver a versão interativa completa.

| Home — Copiloto (Stage Hero) | Laudo Analitico — Stage 6 | Equipe — Buraco Negro WebGL |
|---|---|---|
| Particulas WebGL orbitando em campo aberto | Formulario de diagnostico + preview de risco em tempo real | Disco de acrecao com fisica Kepleriana + carrossel 3D |

**Repositorio publico:** [github.com/DioohReis/orbitagroCopilot](https://github.com/DioohReis/orbitagroCopilot)

---

## Equipe

Turma **1TDSPF** — FIAP Sao Paulo — Global Solution 2026/1

| Foto | Nome | RM | Disciplina | Links |
|:---:|---|:---:|---|---|
| <img src="assets/DiogoRM573301.jpg" width="80" alt="Diogo Guilherme de Assis Reis"> | **Diogo Guilherme de Assis Reis** | 573301 | Front-End Design Engineering | [GitHub](https://github.com/DioohReis) · [LinkedIn](https://www.linkedin.com/in/diogo-guilherme-de-assis-reis-95b11624b/) |
| <img src="assets/Gabriel_Ricardo-01.jpeg" width="80" alt="Gabriel Ricardo Lima"> | **Gabriel Ricardo Lima** | 572279 | Software Engineering | [GitHub](https://github.com/gabriel-ricardo-ADS) · [LinkedIn](https://www.linkedin.com/in/gabriel-ricardo-lima/) |
| <img src="assets/Matheus_Rodrigues.jpeg" width="80" alt="Matheus Rodrigues Serrão"> | **Matheus Rodrigues Serrão** | 570469 | Relational Database | [GitHub](https://github.com/MatheusRodriguesSerrao) · [LinkedIn](https://www.linkedin.com/in/matheus-rodrigues-06060a3a6/) |
| <img src="assets/LuizHenrique572727.jpeg" width="80" alt="Luiz Henrique Alves Albarello"> | **Luiz Henrique Alves Albarello** | 572727 | Computational Thinking | [GitHub](https://github.com/LuizHenriqueAAlbarello) · [LinkedIn](https://www.linkedin.com/in/luiz-henrique-alves-albarello-82297b410/) |
| <img src="assets/razo.01.jpeg" width="80" alt="Gabriel Razo Dantas"> | **Gabriel Razo Dantas** | 572244 | AI & Chatbot | [GitHub](https://github.com/gabrielrazod9j-ops) · [LinkedIn](https://www.linkedin.com/in/gabriel-razo-dantas-34724b301) |

---

## Contato

Para duvidas tecnicas, sugestoes ou parceria academica:

| Integrante | Email / LinkedIn |
|---|---|
| Diogo Guilherme de Assis Reis (lead dev) | [linkedin.com/in/diogo-guilherme-de-assis-reis-95b11624b](https://www.linkedin.com/in/diogo-guilherme-de-assis-reis-95b11624b/) |
| Gabriel Ricardo Lima | [linkedin.com/in/gabriel-ricardo-lima](https://www.linkedin.com/in/gabriel-ricardo-lima/) |
| Matheus Rodrigues Serrão | [linkedin.com/in/matheus-rodrigues-06060a3a6](https://www.linkedin.com/in/matheus-rodrigues-06060a3a6/) |
| Luiz Henrique Alves Albarello | [linkedin.com/in/luiz-henrique-alves-albarello-82297b410](https://www.linkedin.com/in/luiz-henrique-alves-albarello-82297b410/) |
| Gabriel Razo Dantas | [linkedin.com/in/gabriel-razo-dantas-34724b301](https://www.linkedin.com/in/gabriel-razo-dantas-34724b301) |

Repositorio: [github.com/DioohReis/orbitagroCopilot](https://github.com/DioohReis/orbitagroCopilot)

---

OrbitAgro Copilot — Tecnologia orbital a servico do agronegocio brasileiro.
FIAP — Faculdade de Informatica e Administracao Paulista — 2026
