
/**
 * ============================================================================
 * ORBITAGRO COPILOT - GLOBAL SOLUTION
 * Core Application Logic, API Integrations & WebGL Engine Completo
 * ============================================================================
 */

// ==========================================
// 1. INTERFACE DE UTILIZADOR (UI) & OBSERVERS
// ==========================================

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
            mobileMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Animação de entrada dos Títulos (Split Text)
 * Divide o texto em palavras (spans) para animar em cascata
 */
document.querySelectorAll('.split-text').forEach(title => {
    const text = title.innerText;
    title.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    text.split(' ').forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        
        const innerSpan = document.createElement('span');
        innerSpan.className = 'word-inner';
        innerSpan.innerText = word;
        innerSpan.style.transitionDelay = `${wordIndex * 60}ms`;
        
        wordSpan.appendChild(innerSpan);
        fragment.appendChild(wordSpan);
        fragment.appendChild(document.createTextNode(' '));
    });
    
    title.appendChild(fragment);
});

/**
 * Intersection Observer para revelar elementos (Fade Up)
 * ao fazer scroll na página
 */
const observerOptions = { root: null, threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
        }
    });
}, observerOptions);

document.querySelectorAll('.stage').forEach(stage => observer.observe(stage));


// ==========================================
// 2. BASE DE DADOS E INTELIGÊNCIA AGRONÓMICA
// ==========================================

const agroDB = {
    "soja": { 
        nome: "Soja", 
        ranking: "1º Liderança Nacional", 
        imagem: "assets/Soja.png",
        solo: "Solos profundos e bem drenados. Ph ideal 6.0 a 6.5.", 
        manejo: "Requer inoculação bacteriana. Plantio direto.",
        lat: -13.06, 
        lon: -55.90, 
        local: "Lucas do Rio Verde - MT",
        laudoSatelite: "O NDVI deve mostrar grandes áreas em verde intenso (> 0.7). Manchas amareladas indicam possível falha de plantio.",
        pragas: [ 
            { 
                nome: "Lagarta-elasmo (Elasmopalpus lignosellus)", 
                desc: "Conhecida como broca-do-colo. Penetra na haste das plântulas, podendo causar a morte da planta.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Lagarta-elasmo", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Morte+da+Planta" 
            },
            { 
                nome: "Corós (Diloboderus abderus)", 
                desc: "Larvas que vivem no solo e atacam o sistema radicular e as sementes, gerando reboleiras com falhas de estande.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Coros", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Raizes+Destruidas" 
            },
            { 
                nome: "Lagarta-rosca (Agrotis ipsilon)", 
                desc: "Corta as plantas jovens rente ao solo, causando tombamento e falhas na germinação.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Lagarta-rosca", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Tombamento" 
            },
            { 
                nome: "Lagarta-da-soja (Anticarsia gemmatalis)", 
                desc: "A mais clássica desfolhadora, tem coloração esverdeada e listras brancas. Alimenta-se vorazmente das folhas.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Lagarta-da-soja", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Desfolha+Severa" 
            },
            { 
                nome: "Falsa-medideira (Chrysodeixis includens)", 
                desc: "As lagartas movem-se curvando o corpo e consomem o limbo foliar. São de controle mais difícil e causam grandes prejuízos.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Falsa-medideira", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Folhas+Corroidas" 
            },
            { 
                nome: "Complexo Spodoptera", 
                desc: "Atacam desde folhas até flores e vagens, apresentando resistência a algumas tecnologias Bt.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Spodoptera", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Ataque+Vagens" 
            },
            { 
                nome: "Helicoverpa (Helicoverpa armigera)", 
                desc: "Altamente polífaga e destrutiva, consome folhas, brotos, flores e perfura vagens.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Helicoverpa", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Vagens+Perfuradas" 
            },
            { 
                nome: "Complexo de Percevejos", 
                desc: "Inserem seus estiletes nos grãos em formação, causando abortamento, grãos chochos, manchas (soja picada) e retenção foliar.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Percevejos", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Graos+Chochos" 
            },
            { 
                nome: "Mosca-branca (Bemisia tabaci)", 
                desc: "Suga a seiva da planta e expele substância que favorece a fumagina, prejudicando a fotossíntese, além de transmitir viroses.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Mosca-branca", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Fumagina" 
            },
            { 
                nome: "Ácaros (Tetranychus urticae)", 
                desc: "Atacam a parte inferior das folhas causando amarelamento e teias, especialmente em períodos de seca prolongada.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Acaros", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Folhas+Amareladas" 
            }
        ]
    },
    "milho": { 
        nome: "Milho", 
        ranking: "3º Commodity no Brasil", 
        imagem: "assets/Milho.png",
        solo: "Solos férteis, de textura média e ricos em matéria orgânica.", 
        manejo: "Sucessão de culturas (soja/milho) é crucial.",
        lat: -17.79, 
        lon: -50.92, 
        local: "Rio Verde - GO",
        laudoSatelite: "O verde uniforme garante boa taxa fotossintética. Zonas marrons no meio do ciclo da safrinha alertam para lagartas.",
        pragas: [ 
            { 
                nome: "Lagarta-do-cartucho (Spodoptera frugiperda)", 
                desc: "Principal praga. Alojam-se no cartucho e devoram folhas novas, podendo destruir o ponto de crescimento. Sintomas: Folhas raspadas, furos e serragem.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Lagarta-do-cartucho", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Cartucho+Destruido" 
            },
            { 
                nome: "Cigarrinha-do-milho (Dalbulus maidis)", 
                desc: "Vetor de patógenos (molicutes e vírus). Causa enfezamentos. Plantas amareladas, nanismo, espigas chochas e falhas severas.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Cigarrinha-do-milho", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Enfezamento" 
            },
            { 
                nome: "Percevejo-barriga-verde (Dichelops furcatus)", 
                desc: "Ataca a base do colmo de plantas jovens, sugando seiva e injetando toxinas. Causa 'coração morto', furos transversais e manchas.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Percevejo-barriga-verde", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Coracao+Morto" 
            },
            { 
                nome: "Lagarta-elasmo (Elasmopalpus lignosellus)", 
                desc: "Destrutiva em secas. Penetra no coleto da planta, alimentando-se de tecidos. Resulta em murchamento e falhas nas linhas.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Lagarta-elasmo", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Falhas+no+Plantio" 
            },
            { 
                nome: "Larva-alfinete (Diabrotica speciosa)", 
                desc: "Fase larval de um besouro comum. Representa grande ameaça ao sistema radicular da cultura do milho.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Larva-alfinete", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Raizes+Prejudicadas" 
            }
        ]
    },
    "cana": { 
        nome: "Cana-de-açúcar", 
        ranking: "2º Maior Valor Bruto", 
        imagem: "assets/cana.png", 
        solo: "Solos profundos (Latossolos), com boa aeração.", 
        manejo: "Colheita sem queima. Palhada protege o solo.",
        lat: -21.22, 
        lon: -47.80, 
        local: "Ribeirão Preto - SP",
        laudoSatelite: "Talhões marrons representam palhada no solo. Verde escuro indica canavial pronto para o corte.",
        pragas: [ 
            { 
                nome: "Broca-da-cana (Diatraea saccharalis)", 
                desc: "Abrem galerias no interior dos colmos, favorecendo fungos e tombamento. Reduz drasticamente açúcar e rendimento do etanol.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Broca-da-cana", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Galerias+no+Colmo" 
            },
            { 
                nome: "Cigarrinha-das-raízes (Mahanarva fimbriolata)", 
                desc: "Ninfas sugam raízes, adultos atacam folhas. Injetam toxinas que causam amarelecimento e queima da planta.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Cigarrinha-das-raizes", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Queima+da+Planta" 
            },
            { 
                nome: "Bicudo-da-cana (Sphenophorus levis)", 
                desc: "Larvas alimentam-se do rizoma (parte subterrânea). Compromete a brotação e causa falhas expressivas no canavial.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Bicudo-da-cana", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Falhas+na+Soqueira" 
            },
            { 
                nome: "Broca-gigante (Castnia licus)", 
                desc: "Perfuram galerias profundas nos colmos, causando a morte do coração da planta. Causa perdas significativas.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Broca-gigante", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Morte+da+Touceira" 
            },
            { 
                nome: "Cupins subterrâneos (Heterotermes tenuis)", 
                desc: "Atacam os toletes no plantio, consomem raízes e destroem a base dos colmos. Causam falhas na brotação.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Cupins", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Destruicao+da+Base" 
            }
        ]
    },
    "cafe": { 
        nome: "Café", 
        ranking: "4º Ouro Verde", 
        imagem: "assets/cafe.png", 
        solo: "Terrenos em altitude. Sensível ao alagamento.", 
        manejo: "Adoção de sistemas sombreados mitiga variações climáticas.",
        lat: -21.36, 
        lon: -45.45, 
        local: "Três Pontas - MG",
        laudoSatelite: "Cultivo perene. O mapa deve manter-se verde escuro estável o ano todo.",
        pragas: [ 
            { 
                nome: "Broca-do-café (Hypothenemus hampei)", 
                desc: "Praga-chave. Besouro fêmea perfura o fruto e abre galerias na semente. Deprecia fortemente o valor comercial da bebida.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Broca-do-cafe", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Graos+Perfurados" 
            },
            { 
                nome: "Bicho-mineiro (Leucoptera coffeella)", 
                desc: "A lagarta penetra nas folhas e consome o tecido, criando minas esbranquiçadas. Causa queda precoce das folhas.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Bicho-mineiro", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Minas+nas+Folhas" 
            },
            { 
                nome: "Nematoides (Meloidogyne spp.)", 
                desc: "Vermes microscópicos que atacam o sistema radicular. Formam galhas, causando amarelamento e plantas atrofiadas.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Nematoides", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Galhas+nas+Raizes" 
            },
            { 
                nome: "Cigarras (Quesada gigas)", 
                desc: "Na fase de ninfa fixam-se nas raízes. Sugam a seiva continuamente, drenando a vitalidade e causando definhamento.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Cigarras", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Definhamento" 
            },
            { 
                nome: "Ácaro-vermelho (Oligonychus ilicis)", 
                desc: "Atacam a parte superior das folhas. O sintoma é o bronzeamento das folhas, perda de brilho e queda precoce.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Acaro-vermelho", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Folhas+Bronzeadas" 
            }
        ]
    },
    "algodao": { 
        nome: "Algodão", 
        ranking: "5º Maior Exportação", 
        imagem: "assets/algodao.png", 
        solo: "Solos com boa umidade.", 
        manejo: "Requer agricultura de precisão.",
        lat: -12.09, 
        lon: -45.80, 
        local: "Barreiras - BA",
        laudoSatelite: "Na fase vegetativa deve apresentar verde intenso. Na época de desfolha, cores quentes são esperadas.",
        pragas: [ 
            { 
                nome: "Bicudo-do-algodoeiro (Anthonomus grandis)", 
                desc: "Inimigo nº1. Ataca botões florais e maçãs, causando queda ou má formação. Alto poder de destruição.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Bicudo-do-algodoeiro", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Botoes+Caidos" 
            },
            { 
                nome: "Mosca-branca (Bemisia tabaci)", 
                desc: "Suga a seiva, transmite viroses e expele honeydew, favorecendo a fumagina que deprecia a pluma.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Mosca-branca", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Fumagina+na+Pluma" 
            },
            { 
                nome: "Pulgão-do-algodoeiro (Aphis gossypii)", 
                desc: "Ataca brotações, causando enrolamento das folhas. Transmite viroses severas à cultura.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Pulgao", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Folhas+Enroladas" 
            },
            { 
                nome: "Ácaro-rajado e Ácaro-branco", 
                desc: "Atacam a face inferior das folhas, causando descoloração, necrose e teias. Reduzem a área fotossintética.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Acaros", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Necrose" 
            },
            { 
                nome: "Percevejo-castanho e Marrom", 
                desc: "Atacam raízes, botões e maçãs. Sugam a seiva causando abortamento ou manchas amareladas na pluma.", 
                imgBug: "https://placehold.co/600x400/222/4caf50?text=Foto:+Percevejos", 
                imgDamage: "https://placehold.co/600x400/222/f44336?text=Dano:+Pluma+Manchada" 
            }
        ]
    }
};

let activeCrop = null;


// ==========================================
// 3. API OPEN-METEO (CLIMA E CHUVA EM TEMPO REAL)
// ==========================================

const getWeatherEmoji = (code) => {
    if ([0, 1].includes(code)) return '☀️';
    if ([2, 3].includes(code)) return '⛅';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
    if ([95, 96, 99].includes(code)) return '⛈️';
    return '🌤️';
};

async function fetchWeatherTelemetrics(lat, lon) {
    if (!document.getElementById('rt-temp')) return;
    document.getElementById('rt-temp').innerText = `--°C`;
    document.getElementById('rt-aqi').innerText = `Buscando...`;
    document.getElementById('rt-chuva-chance').innerText = `--%`;
    document.getElementById('rt-chuva-vol').innerText = `Volume: -- mm`;

    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,precipitation_probability_max,precipitation_sum&timezone=America%2FSao_Paulo&forecast_days=6`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;
        const aqiRes = await fetch(aqiUrl);
        const aqiData = await aqiRes.json();

        // --- Atualiza Dados Atmosféricos ---
        const currentTemp = Math.round(weatherData.current.temperature_2m);
        document.getElementById('rt-temp').innerText = `${currentTemp}°C`;

        const aqi = aqiData.current.us_aqi || 45; 
        let aqiText = "Boa"; 
        let aqiColor = "#4caf50";

        if (aqi > 50) { aqiText = "Moderada"; aqiColor = "#ff9800"; }
        if (aqi > 100) { aqiText = "Ruim"; aqiColor = "#f44336"; }
        
        document.getElementById('rt-aqi').innerText = `${Math.round(aqi)} - ${aqiText}`;
        document.getElementById('rt-aqi').style.color = aqiColor;

        const daily = weatherData.daily;
        document.getElementById('rt-forecast').innerHTML = `
            <li><span>Amanhã</span> <span>${getWeatherEmoji(daily.weather_code[1])} ${Math.round(daily.temperature_2m_max[1])}°C</span></li>
            <li><span>2 Dias</span> <span>${getWeatherEmoji(daily.weather_code[2])} ${Math.round(daily.temperature_2m_max[2])}°C</span></li>
            <li><span>3 Dias</span> <span>${getWeatherEmoji(daily.weather_code[3])} ${Math.round(daily.temperature_2m_max[3])}°C</span></li>
        `;

        // --- Atualiza Dados Hídricos (Chuva) ---
        const rainChanceToday = daily.precipitation_probability_max[0];
        const rainVolToday = daily.precipitation_sum[0];
        
        document.getElementById('rt-chuva-chance').innerText = `${rainChanceToday}%`;
        document.getElementById('rt-chuva-vol').innerText = `Volume: ${rainVolToday} mm`;

        document.getElementById('rt-chuva-semana').innerHTML = `
            <li><span>Amanhã</span> <span>${daily.precipitation_probability_max[1]}% (${daily.precipitation_sum[1]}mm)</span></li>
            <li><span>2 Dias</span> <span>${daily.precipitation_probability_max[2]}% (${daily.precipitation_sum[2]}mm)</span></li>
            <li><span>3 Dias</span> <span>${daily.precipitation_probability_max[3]}% (${daily.precipitation_sum[3]}mm)</span></li>
            <li><span>4 Dias</span> <span>${daily.precipitation_probability_max[4]}% (${daily.precipitation_sum[4]}mm)</span></li>
            <li><span>5 Dias</span> <span>${daily.precipitation_probability_max[5]}% (${daily.precipitation_sum[5]}mm)</span></li>
        `;

        // --- Lógica de IA para Irrigação ---
        let irrigacaoMsg = "";
        if (rainChanceToday > 60 && rainVolToday > 5) {
            irrigacaoMsg = "Alerta de temporal. Suspender pivô central para evitar lixiviação de fertilizantes e asfixia radicular.";
        } else if (rainChanceToday < 30) {
            irrigacaoMsg = "Céu limpo. Acionar sistema de irrigação artificial com base nas manchas marrons (déficit) do mapa NDMI.";
        } else {
            irrigacaoMsg = "Previsão instável. Manter irrigação em regime de prontidão (standby).";
        }
        document.getElementById('res-irrigacao-info').innerText = irrigacaoMsg;

    } catch (error) {
        console.error("Erro ao buscar dados de clima:", error);
    }
}

// Inicia com localização base
fetchWeatherTelemetrics(-23.55, -46.63);


// ==========================================
// 4. INTEGRAÇÃO API SATÉLITE (SENTINEL HUB)
// ==========================================

const SENTINEL_CONFIG = {
    clientId:     'a4eb4d97-3d8e-4c7c-a571-7d44816fbc3d',
    clientSecret: 'Bt1GEagIaKmGDR8d3yAP0RoUpWmVNflp'
};

// O endpoint /oauth/token do Sentinel Hub bloqueia CORS em browser por design (OAuth client_credentials).
// Roteamos APENAS o pedido de token por um proxy CORS público — o /api/v1/process já aceita browser diretamente.
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Função responsável por chamar e desenhar os Mapas NDVI e NDMI
 * via Sentinel-2 L2A (10 m de resolução)
 */
async function buscarImagemSatelite(data) {
    const { lat, lon } = data;

    // Referências do DOM - NDVI (Saúde)
    const imgNDVI = document.getElementById('img-satelite-real');
    const infoSolo = document.getElementById('res-solo-info');
    const infoNdvi = document.getElementById('res-ndvi');
    const hudLegendNDVI = document.getElementById('ndviLegend');

    // Referências do DOM - NDMI (Umidade)
    const imgNDMI = document.getElementById('img-satelite-umidade');
    const infoLaudoNDMI = document.getElementById('res-ndmi-laudo');
    const hudLegendNDMI = document.getElementById('ndmiLegend');

    // Reset da UI
    infoSolo.innerText = `Calibrando satélites para ${data.local}...`;
    infoNdvi.innerText = 'Processando bandas Sentinel-2...';
    infoLaudoNDMI.innerText = 'Calculando absorção hídrica do terreno...';

    imgNDVI.classList.remove('loaded');
    hudLegendNDVI.classList.remove('visible');
    imgNDMI.classList.remove('loaded');
    hudLegendNDMI.classList.remove('visible');

    try {
        // 1. Autenticação — token OAuth roteado por proxy CORS (o Process API aceita browser diretamente)
        const tokenUrl = 'https://services.sentinel-hub.com/oauth/token';
        const tokenResponse = await fetch(CORS_PROXY + encodeURIComponent(tokenUrl), {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=client_credentials&client_id=${SENTINEL_CONFIG.clientId}&client_secret=${SENTINEL_CONFIG.clientSecret}`
        });

        if (!tokenResponse.ok) throw new Error('Falha na autenticação Sentinel Hub.');

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) throw new Error('Token inválido.');

        // Janela de 3 meses (filtra nuvens) e bounding box
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setMonth(toDate.getMonth() - 3);
        const bbox = [lon - 0.03, lat - 0.03, lon + 0.03, lat + 0.03];

        // 2. Mapa NDVI (Saúde Vegetativa)
        const evalscriptNDVI = `
            //VERSION=3
            function setup() { return { input: ["B08", "B04", "dataMask"], output: { bands: 4 } }; }
            function evaluatePixel(sample) {
                let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04 + 0.0001);
                if (ndvi < 0.1) return [0.5, 0.5, 0.5, sample.dataMask];
                if (ndvi < 0.3) return [0.65, 0.35, 0.07, sample.dataMask];
                if (ndvi < 0.5) return [0.9, 0.9, 0.2, sample.dataMask];
                if (ndvi < 0.7) return [0.3, 0.8, 0.3, sample.dataMask];
                return [0.0, 0.4, 0.0, sample.dataMask];
            }
        `;

        const sentinelBody = (evalscript) => JSON.stringify({
            input: {
                bounds: { bbox },
                data: [{ type: 'sentinel-2-l2a', dataFilter: { timeRange: { from: fromDate.toISOString(), to: toDate.toISOString() }, maxCloudCoverage: 10 } }]
            },
            output: { width: 800, height: 450, responses: [{ identifier: 'default', format: { type: 'image/png' } }] },
            evalscript
        });

        const authHeaders = {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/json'
        };

        fetch('https://services.sentinel-hub.com/api/v1/process', {
            method: 'POST', headers: authHeaders, body: sentinelBody(evalscriptNDVI)
        })
        .then(res => res.blob())
        .then(blob => {
            imgNDVI.src = URL.createObjectURL(blob);
            imgNDVI.onload = () => {
                imgNDVI.classList.add('loaded');
                hudLegendNDVI.classList.add('visible');
                infoSolo.innerText = data.manejo;
                infoNdvi.innerHTML = `<strong>Análise Biológica:</strong> ${data.laudoSatelite}`;
            };
        });

        // 3. Mapa NDMI (Umidade do Solo)
        const evalscriptNDMI = `
            //VERSION=3
            function setup() { return { input: ["B08", "B11", "dataMask"], output: { bands: 4 } }; }
            function evaluatePixel(sample) {
                let ndmi = (sample.B08 - sample.B11) / (sample.B08 + sample.B11 + 0.0001);
                if (ndmi < -0.2) return [0.54, 0.27, 0.07, sample.dataMask];
                if (ndmi < 0.0)  return [0.82, 0.70, 0.54, sample.dataMask];
                if (ndmi < 0.2)  return [1.0,  1.0,  1.0,  sample.dataMask];
                if (ndmi < 0.4)  return [0.53, 0.80, 0.92, sample.dataMask];
                return [0.0, 0.0, 1.0, sample.dataMask];
            }
        `;

        fetch('https://services.sentinel-hub.com/api/v1/process', {
            method: 'POST', headers: authHeaders, body: sentinelBody(evalscriptNDMI)
        })
        .then(res => res.blob())
        .then(blob => {
            imgNDMI.src = URL.createObjectURL(blob);
            imgNDMI.onload = () => {
                imgNDMI.classList.add('loaded');
                hudLegendNDMI.classList.add('visible');
                infoLaudoNDMI.innerText = 'Identificadas faixas de absorção hídrica. Avalie zonas marrons para ajustar a pressão do pivô central de irrigação.';
            };
        });

    } catch (error) {
        console.error('Erro Sentinel Hub:', error);
        infoNdvi.innerText = 'Falha na autenticação. Verifique as credenciais Sentinel Hub.';
    }
}


// ==========================================
// 5. HOTSPOTS E CARROSSEL DE PRAGAS (ESTÁGIO 5)
// ==========================================
const hotspotLayer = document.getElementById('hotspot-layer');
const pestModal = document.getElementById('pestModal');
const carouselTrack = document.getElementById('carouselTrack');
let currentPestIndex = 0;

if (hotspotLayer) hotspotLayer.style.pointerEvents = 'none';

/**
 * Cria os pontos de luz sobre as folhas baseados nas pragas da cultura
 */
function setupPestHotspots(pragas) {
    hotspotLayer.innerHTML = '';

    const hudCount = document.getElementById('pestHudCount');
    const hudRisk  = document.getElementById('pestHudRisk');
    if (hudCount) hudCount.textContent = pragas.length;
    if (hudRisk) {
        const isHigh = pragas.length >= 3;
        hudRisk.textContent = pragas.length >= 5 ? 'CRÍTICO' : isHigh ? 'ALTO' : 'MÉDIO';
        hudRisk.className   = isHigh ? 'pest-hud-value pest-hud-critical' : 'pest-hud-value';
    }

    pragas.forEach((praga) => {
        const spot = document.createElement('div');
        spot.className = 'hotspot';
        // Apenas o hotspot reage ao rato
        spot.style.pointerEvents = 'auto';
        
        // Espalhados no centro para encaixar nas folhas do WebGL
        spot.style.left = `${20 + Math.random() * 60}%`;
        spot.style.top = `${20 + Math.random() * 60}%`;
        
        spot.addEventListener('click', () => openPestModal(praga));
        hotspotLayer.appendChild(spot);
    });
}

function openPestModal(praga) {
    document.getElementById('modalPestName').innerText = praga.nome;
    document.getElementById('modalPestDesc').innerText = praga.desc;
    
    // Injeta as duas imagens no Carrossel
    carouselTrack.innerHTML = `
        <div class="carousel-slide"><img src="${praga.imgBug}" alt="Inseto da Praga"></div>
        <div class="carousel-slide"><img src="${praga.imgDamage}" alt="Sintoma da Praga na Folha"></div>
    `;
    
    currentPestIndex = 0;
    updateCarousel();
    pestModal.classList.add('open');
}

// Controlos do Carrossel
document.getElementById('closeModal')?.addEventListener('click', () => pestModal.classList.remove('open'));
document.getElementById('btnNext')?.addEventListener('click', () => { currentPestIndex = 1; updateCarousel(); });
document.getElementById('btnPrev')?.addEventListener('click', () => { currentPestIndex = 0; updateCarousel(); });

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentPestIndex * 100}%)`;
}


// ==========================================
// 6. SELEÇÃO DA CULTURA E FORMULÁRIO (LAUDO FINAL)
// ==========================================

function updateCropInsights(cropKey) {
    const data = agroDB[cropKey];
    if (!data) return;

    // Status do scanner: "escaneando..."
    const status = document.getElementById('scanner-status');
    if (status) {
        status.textContent = `ESCANEANDO: ${data.nome.toUpperCase()}...`;
        status.classList.add('scanning');
        setTimeout(() => {
            status.textContent = `CULTURA CONFIRMADA — ${data.nome.toUpperCase()}`;
            status.classList.remove('scanning');
        }, 1400);
    }

    // Atualiza UI
    document.getElementById('info-nome-cultura').innerText = data.nome;
    document.getElementById('info-ranking').innerText = data.ranking;
    document.getElementById('info-img-cultura').src = data.imagem;
    document.getElementById('info-solo-tipo').innerText = data.solo;
    document.getElementById('info-solo-manejo').innerText = data.manejo;
    document.getElementById('rt-local').innerText = `LAT ${data.lat} | LON ${data.lon} (${data.local})`;

    document.getElementById('panel-plantacao').classList.add('visible');

    // Prepara os hotspots e as APIs
    setupPestHotspots(data.pragas);
    fetchWeatherTelemetrics(data.lat, data.lon);
    buscarImagemSatelite(data);
}

// Cultura cards (seleção de cultura)
document.querySelectorAll('.cultura-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    card.addEventListener('click', function(e) {
        e.preventDefault();

        if (activeCrop === radio.value) {
            radio.checked = false;
            activeCrop = null;
            localStorage.removeItem('orbitagro_cultura');
            document.getElementById('panel-plantacao').classList.remove('visible');
            document.querySelectorAll('.ndvi-legend').forEach(el => el.classList.remove('visible'));
            hotspotLayer.innerHTML = '';
            const status = document.getElementById('scanner-status');
            if (status) status.textContent = 'AGUARDANDO CULTURA...';
        } else {
            radio.checked = true;
            activeCrop = radio.value;
            localStorage.setItem('orbitagro_cultura', radio.value);
            updateCropInsights(radio.value);

            // Auto-scroll para NDVI se o talhão já foi preenchido
            if (inputTalhao && inputTalhao.value.trim()) {
                setTimeout(() => {
                    document.querySelector('.journey-container')?.scrollTo({
                        top: document.getElementById('stage-sol')?.offsetTop,
                        behavior: 'smooth'
                    });
                }, 750);
            }
        }
        updateLaudoPreview();
    });
});

// Persiste o nome do talhão entre visitas
const inputTalhao = document.getElementById('talhao');
if (inputTalhao) {
    const savedTalhao = localStorage.getItem('orbitagro_talhao');
    if (savedTalhao) inputTalhao.value = savedTalhao;
    inputTalhao.addEventListener('input', () => {
        if (inputTalhao.value.trim()) {
            localStorage.setItem('orbitagro_talhao', inputTalhao.value.trim());
        } else {
            localStorage.removeItem('orbitagro_talhao');
        }
    });
}

// Stepper de Dias Secos
const inputDias = document.getElementById('diasSeca');
document.getElementById('btnMinus')?.addEventListener('click', () => {
    let v = parseInt(inputDias.value) || 0;
    if (v > 0) inputDias.value = v - 1;
    updateLaudoPreview();
});
document.getElementById('btnPlus')?.addEventListener('click', () => {
    inputDias.value = (parseInt(inputDias.value) || 0) + 1;
    updateLaudoPreview();
});

// Atualiza a pré-visualização em tempo real ao mudar qualquer radio do laudo
document.querySelectorAll('input[name="saudeFoliar"], input[name="stressHidrico"], input[name="nivelPragas"]').forEach(r => {
    r.addEventListener('change', updateLaudoPreview);
});

// PRÉ-VISUALIZAÇÃO DO LAUDO EM TEMPO REAL
function updateLaudoPreview() {
    const sf = Number(document.querySelector('input[name="saudeFoliar"]:checked')?.value ?? 1);
    const sh = Number(document.querySelector('input[name="stressHidrico"]:checked')?.value ?? 1);
    const ds = parseInt(inputDias?.value) || 0;
    const np = Number(document.querySelector('input[name="nivelPragas"]:checked')?.value ?? 1);

    const ptsNDVI  = sf === 2 ? 3 : 0;
    const ptsSeca  = sh === 2 ? 3 : (ds > 5 ? 1 : 0);
    const ptsPraga = np === 3 ? 4 : (np === 2 ? 2 : 0);
    const pontos   = ptsNDVI + ptsSeca + ptsPraga;

    const nivel = pontos > 5 ? 'CRÍTICO' : pontos > 2 ? 'ATENÇÃO' : 'NOMINAL';
    const cor   = pontos > 5 ? '#d32f2f' : pontos > 2 ? '#ff9800' : '#4caf50';

    const badge   = document.getElementById('preview-risk-badge');
    const fill    = document.getElementById('preview-bar-fill');
    const cultEl  = document.getElementById('preview-cultura-nome');
    const bNdvi   = document.getElementById('prev-bar-ndvi');
    const bSeca   = document.getElementById('prev-bar-seca');
    const bPraga  = document.getElementById('prev-bar-praga');

    if (!badge) return;

    if (cultEl) cultEl.textContent = activeCrop ? (agroDB[activeCrop]?.nome ?? activeCrop) : 'Nenhuma selecionada';
    badge.textContent = nivel;
    badge.style.color = cor;

    if (fill) { fill.style.width = Math.min(100, (pontos / 10) * 100) + '%'; fill.style.background = cor; }
    if (bNdvi)  { bNdvi.style.width = ptsNDVI ? '100%' : '15%'; bNdvi.style.background = ptsNDVI ? '#f44336' : '#4caf50'; }
    if (bSeca)  { bSeca.style.width = ptsSeca > 2 ? '100%' : ptsSeca > 0 ? '50%' : '15%'; bSeca.style.background = ptsSeca > 2 ? '#f44336' : ptsSeca > 0 ? '#ff9800' : '#4caf50'; }
    if (bPraga) { bPraga.style.width = ptsPraga > 2 ? '100%' : ptsPraga > 0 ? '50%' : '15%'; bPraga.style.background = ptsPraga > 2 ? '#f44336' : ptsPraga > 0 ? '#ff9800' : '#4caf50'; }
}


// Botão de Gerar o Laudo Final (Estágio 6 para 7)
document.getElementById('btnDiagnostico')?.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    
    if (!activeCrop) { 
        alert("Inicie selecionando a Cultura Predominante da Lavoura no Passo 1."); 
        return; 
    }
  
    const culturaStr = activeCrop;
    const diasSeca = parseInt(inputDias.value) || 0;
    
    // Lê os novos inputs do formulário do produtor
    const saudeFoliar = document.querySelector('input[name="saudeFoliar"]:checked').value;
    const stressHidrico = document.querySelector('input[name="stressHidrico"]:checked').value;
    const nivelPragas = document.querySelector('input[name="nivelPragas"]:checked').value;
  
    let ptsNDVI = 0, ptsSeca = 0, ptsPraga = 0;
    
    // Cálculo do Risco
    if (saudeFoliar === "2") ptsNDVI = 3;
    if (stressHidrico === "2") ptsSeca = 3; else if (diasSeca > 5) ptsSeca = 1;
    if (nivelPragas === "3") ptsPraga = 4; else if (nivelPragas === "2") ptsPraga = 2;

    const pontos = ptsNDVI + ptsSeca + ptsPraga;

    let nivel = "NOMINAL";
    let colorBadge = "#4caf50";
    let glowBadge = "rgba(76, 175, 80, 0.4)";
    
    if (pontos > 2 && pontos <= 5) { 
        nivel = "ATENÇÃO"; colorBadge = "#ff9800"; glowBadge = "rgba(255, 152, 0, 0.4)"; 
    } else if (pontos > 5) { 
        nivel = "CRÍTICO"; colorBadge = "#d32f2f"; glowBadge = "rgba(211, 47, 47, 0.4)"; 
    }

    const dbCultura = agroDB[culturaStr];
    
    // Atualiza Painéis do Rodapé (Dashboard)
    document.getElementById('res-praga').innerText = nivelPragas === "1" ? `Índice biológico estável para ${dbCultura.nome}.` : `Alerta: Foco detetado na inspeção local.`;
    document.getElementById('res-solo').innerText = saudeFoliar === "1" ? `Biomassa foliar saudável e fotossinteticamente ativa.` : `Alerta: Falhas no desenvolvimento foliar mapeadas pelo NDVI.`;
    document.getElementById('res-chuva').innerText = stressHidrico === "2" ? `Déficit hídrico crítico. Risco de quebra de safra.` : `Equilíbrio Hídrico. Umidade validada.`;
    document.getElementById('res-clima').innerText = `Satélite regista ${document.getElementById('rt-temp').innerText} com AQI ${document.getElementById('rt-aqi').innerText.split('-')[0]}.`;

    // Atualiza Risco Visual
    document.getElementById('riskBadge').innerText = nivel;
    document.getElementById('riskBadge').style.color = colorBadge;

    const gaugeFill = document.getElementById('gaugeFill');
    if (gaugeFill) {
        const percent = Math.min(pontos / 10, 1);
        setTimeout(() => {
            gaugeFill.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 1s';
            gaugeFill.style.strokeDashoffset = 126 - (126 * percent);
            gaugeFill.style.stroke = colorBadge;
        }, 400);
    }

    // Anima Barras do Dashboard
    setTimeout(() => { 
        document.getElementById('barNdvi').style.width = (saudeFoliar === "2" ? '100%' : '15%');
        document.getElementById('barNdvi').style.background = (saudeFoliar === "2" ? '#f44336' : '#4caf50');
        
        document.getElementById('barSeca').style.width = (stressHidrico === "2" ? '100%' : (diasSeca > 5 ? '50%' : '15%')); 
        document.getElementById('barSeca').style.background = (stressHidrico === "2" ? '#f44336' : (diasSeca > 5 ? '#ff9800' : '#4caf50'));
        
        document.getElementById('barPraga').style.width = (nivelPragas === "3" ? '100%' : (nivelPragas === "2" ? '50%' : '15%'));
        document.getElementById('barPraga').style.background = (nivelPragas === "3" ? '#f44336' : (nivelPragas === "2" ? '#ff9800' : '#4caf50'));

        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setVal('valNdvi',  saudeFoliar   === "2" ? 'ALTO' : 'OK');
        setVal('valSeca',  stressHidrico === "2" ? 'ALTO' : (diasSeca > 5 ? 'MED' : 'OK'));
        setVal('valPraga', nivelPragas   === "3" ? 'ALTO' : (nivelPragas === "2" ? 'MED' : 'OK'));
    }, 500);

    // Recomendações Dinâmicas da Inteligência
    const recList = document.getElementById('recList');
    recList.innerHTML = '';
    
    if (pontos === 0) {
        recList.innerHTML = "<li>Lavoura em perfeito estado. Mantenha os padrões atuais de manejo.</li>";
    }
    if (saudeFoliar === "2") {
        recList.innerHTML += `<li>Mapeamento NDVI indicou falhas foliares. Realize amostragem de solo localizada para corrigir deficiência nutricional.</li>`;
    }
    if (stressHidrico === "2") {
        recList.innerHTML += `<li>Índice NDMI em estado crítico. Acione pivô central nas zonas marrons (Seca Severa) com taxa de 15mm.</li>`;
    }
    if (nivelPragas !== "1") {
        recList.innerHTML += `<li>Infestação validada em campo. Programe aplicação de defensivos biológicos específicos para a cultura da ${dbCultura.nome}.</li>`;
    }

    document.documentElement.style.setProperty('--primary', colorBadge);
    document.documentElement.style.setProperty('--glow', glowBadge);
    document.querySelector('.journey-container')?.scrollTo({ top: document.getElementById('stage-resultado')?.offsetTop, behavior: 'smooth' });
});

document.getElementById('btnRecomecar')?.addEventListener('click', () => {
    document.querySelector('.journey-container')?.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        document.getElementById('gaugeFill').style.strokeDashoffset = 126;
        document.querySelectorAll('.factor-fill').forEach(el => el.style.width = '0%');
        document.documentElement.style.setProperty('--primary', '#4caf50');

        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        activeCrop = null;
        document.getElementById('panel-plantacao')?.classList.remove('visible');
        document.querySelectorAll('.ndvi-legend').forEach(el => el.classList.remove('visible'));
        if (hotspotLayer) hotspotLayer.innerHTML = '';
    }, 500);
});

// Controla visualização dos Hotspots baseado no Scroll (Apenas no Estágio 5 - Pragas)
const _journeyContainer = document.querySelector('.journey-container');
if (_journeyContainer) {
    _journeyContainer.addEventListener('scroll', (e) => {
        const scrollP = (e.target.scrollTop / (e.target.scrollHeight - window.innerHeight)) * 6.0;
        if (scrollP >= 3.5 && scrollP <= 4.5 && activeCrop) {
            if (hotspotLayer) hotspotLayer.style.opacity = '1';
        } else {
            if (hotspotLayer) hotspotLayer.style.opacity = '0';
            if (pestModal) pestModal.classList.remove('open');
        }
    });
}


// Restaura cultura selecionada da sessão anterior (após inputDias estar declarado)
const savedCrop = localStorage.getItem('orbitagro_cultura');
if (savedCrop && agroDB[savedCrop]) {
    const chipToRestore = document.querySelector(`.cultura-card input[value="${savedCrop}"]`);
    if (chipToRestore) {
        chipToRestore.checked = true;
        activeCrop = savedCrop;
        updateCropInsights(savedCrop);
        updateLaudoPreview();
    }
}

// ==========================================
// 7. ENGINE WEBGL 3D (O MOTOR ORIGINAL EXPANDIDO)
// ==========================================

(() => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
        alpha: true, 
        antialias: false, 
        depth: false, 
        stencil: false, 
        premultipliedAlpha: false, 
        preserveDrawingBuffer: false 
    });

    if (!gl) return;

    // Configurações Globais da Física das Partículas (FÍSICA ORIGINAL INTACTA)
    const config = { 
        maxDesktop: 40000, // Aumentado para MAIS VIDA (era 28000)
        maxMobile: 18000,  // Aumentado
        sampleDesktop: 2,  // Modificado de 3 para 2 (Partículas muito mais densas e definidas)
        sampleMobile: 3, 
        pointDesktop: 2.6, // Partículas ligeiramente maiores (era 2.3)
        pointMobile: 2.8, 
        returnIdle: 0.024, 
        returnActive: 0.0026, 
        friction: 0.953, 
        maxSpeed: 0.067, 
        mouseFollow: 0.00055, 
        mouseFollowRadiusDesktop: 185, 
        mouseFollowRadiusMobile: 128, 
        pathFollow: 0.0068, 
        pathTargetPull: 0.038, 
        pathEdgePull: 0.0085, 
        pathOrbit: 0.0024, 
        pathTubeDesktop: 178, 
        pathTubeMobile: 122, 
        pathEdgeDesktop: 64, 
        pathEdgeMobile: 42, 
        flow: 0.00172, 
        headPush: 0.0048, 
        noise: 0.00013, 
        settleDelay: 190, 
        releaseDelay: 520, 
        scrollEase: 0.045 
    };

    // Estado Interno do Motor
    const state = { 
        width: 1, 
        height: 1, 
        dpr: 1, 
        mobile: false, 
        count: 0, 
        positions: null, 
        currentHomes: null, 
        velocities: null, 
        alphas: null, 
        seeds: null, 
        homes: null, 
        scrollTarget: 0, 
        scrollProgress: 0, 
        trail: [], 
        pointer: { active: false, px: 0, py: 0, lastX: 0, lastY: 0, lastTime: 0 }, 
        lastMove: 0 
    };

    // Funções Utilitárias Matemáticas
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v)); 
    const pxToClipX = px => (px / state.width) * 2 - 1; 
    const pxToClipY = py => 1 - (py / state.height) * 2; 
    const clipToPxX = x => (x + 1) * 0.5 * state.width; 
    const clipToPxY = y => (1 - y) * 0.5 * state.height;

    // --- Shaders WebGL Originais ---
    const vertexSource = `
        attribute vec3 aPosition;
        attribute float aAlpha;
        attribute float aSeed;
        
        uniform float uPointSize;
        uniform float uDpr;
        uniform float uProgress;
        
        varying float vAlpha;
        varying float vSeed;

        void main() {
            vAlpha = aAlpha;
            vSeed = aSeed;
            gl_Position = vec4(aPosition, 1.0);
            float depth = 1.0 + aPosition.z * 0.22;
            
            float isPestBug = step(0.92, vSeed) * clamp(1.0 - abs(uProgress - 4.0), 0.0, 1.0);
            float mixFactor = fract(uProgress) + (isPestBug * 0.5);
            
            gl_PointSize = uPointSize * uDpr * depth * (1.2 + mixFactor * 0.2); // Tamanho base ligeiramente maior
        }
    `;

    const fragmentSource = `
        precision highp float;
        
        varying float vAlpha;
        varying float vSeed;
        uniform float uProgress;

        void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            
            float dotMask = smoothstep(0.48, 0.075, d);
            float core = smoothstep(0.18, 0.0, d) * 0.22;
            float rim = smoothstep(0.50, 0.26, d) * 0.16;
            
            // Aumentado o brilho do Shimmer (efeito piscar) de 0.92 para 1.0 base
            float shimmer = 1.0 + sin(vSeed * 44.0) * 0.2;
            float alpha = (dotMask + core + rim) * vAlpha * shimmer;

            vec3 c0 = vec3(0.965, 0.955, 0.925); 
            vec3 c1 = vec3(0.58, 0.34, 0.18);    
            vec3 c2 = vec3(1.0, 0.65, 0.12);     
            vec3 c3 = vec3(0.45, 0.75, 0.98);    
            vec3 leafGreen = vec3(0.4, 0.55, 0.15); 
            vec3 bugWhite = vec3(0.95, 0.95, 0.95); 
            
            float isPestBug = step(0.92, vSeed) * clamp(1.0 - abs(uProgress - 4.0), 0.0, 1.0); 
            vec3 c4 = mix(leafGreen, bugWhite, isPestBug); 
            
            vec3 c5 = vec3(0.8, 0.8, 0.8);      
            vec3 c6 = vec3(0.2, 0.9, 0.65); 

            vec3 color = mix(c0, c1, clamp(uProgress, 0.0, 1.0));
            color = mix(color, c2, clamp(uProgress - 1.0, 0.0, 1.0));
            color = mix(color, c3, clamp(uProgress - 2.0, 0.0, 1.0));
            color = mix(color, c4, clamp(uProgress - 3.0, 0.0, 1.0));
            color = mix(color, c5, clamp(uProgress - 4.0, 0.0, 1.0));
            color = mix(color, c6, clamp(uProgress - 5.0, 0.0, 1.0));

            gl_FragColor = vec4(color, alpha);
        }
    `;

    function createShader(type, source) { 
        const shader = gl.createShader(type); 
        gl.shaderSource(shader, source); 
        gl.compileShader(shader); 
        return shader; 
    }

    const program = gl.createProgram(); 
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexSource)); 
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentSource)); 
    gl.linkProgram(program);

    const locations = { 
        position: gl.getAttribLocation(program, 'aPosition'), 
        alpha: gl.getAttribLocation(program, 'aAlpha'), 
        seed: gl.getAttribLocation(program, 'aSeed'), 
        pointSize: gl.getUniformLocation(program, 'uPointSize'), 
        dpr: gl.getUniformLocation(program, 'uDpr'), 
        progress: gl.getUniformLocation(program, 'uProgress') 
    };
    
    const bufs = { pos: gl.createBuffer(), alpha: gl.createBuffer(), seed: gl.createBuffer() };

    function readMaskCandidates(mask, sample) { 
        const ctx = mask.getContext('2d', { willReadFrequently: true }); 
        const data = ctx.getImageData(0, 0, mask.width, mask.height).data; 
        const candidates = []; 
        for (let y = 0; y < mask.height; y += sample) { 
            for (let x = 0; x < mask.width; x += sample) { 
                if (data[(y * mask.width + x) * 4 + 3] > 24) candidates.push([pxToClipX(x), pxToClipY(y)]);
            } 
        } 
        for (let i = candidates.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]]; 
        } 
        return candidates; 
    }

    function getCanvas() { 
        const c = document.createElement('canvas'); 
        c.width = Math.max(360, Math.floor(state.width)); 
        c.height = Math.max(360, Math.floor(state.height)); 
        const ctx = c.getContext('2d', { willReadFrequently: true }); 
        ctx.clearRect(0, 0, c.width, c.height); 
        ctx.lineCap = 'round'; ctx.lineJoin = 'round'; 
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; 
        return { c, ctx, w: c.width, h: c.height }; 
    }

    // --- AS 7 MÁSCARAS GRÁFICAS INTOCADAS ---
    
    function createTextMask() { 
        const { c, ctx, w, h } = getCanvas(); 
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; 
        const fs = clamp(w * (state.mobile ? 0.18 : 0.14), 50, state.mobile ? 100 : 180); 
        ctx.font = `900 ${fs}px "SF Pro Display", Inter, sans-serif`; 
        ctx.lineWidth = Math.max(1.5, fs * 0.02); 
        const lh = fs * 0.85; 
        ['OrbitAgro', 'Copilot'].forEach((line, i) => { 
            ctx.strokeText(line, w/2, h/2 + (i - 0.5) * lh); 
            ctx.fillText(line, w/2, h/2 + (i - 0.5) * lh); 
        }); 
        return c; 
    }

    function createFieldMask() { 
        const { c, ctx, w, h } = getCanvas(); 
        const rows = state.mobile ? 10 : 15; 
        const horizonY = h * 0.62; const baseY = h * 0.96; const cx = w * 0.5; 
        for (let r = 0; r < rows; r++) { 
            const t = r / Math.max(1, rows - 1); 
            const y = horizonY + Math.pow(t, 1.72) * (baseY - horizonY); 
            const spread = w * (0.10 + t * 0.58); 
            const curve = h * (0.018 + t * 0.035); 
            ctx.globalAlpha = 0.18 + t * 0.74; 
            ctx.lineWidth = Math.max(1.1, 1.2 + t * 3.6); 
            ctx.beginPath(); 
            ctx.moveTo(cx - spread, y); 
            ctx.bezierCurveTo(cx - spread*0.48, y - curve, cx + spread*0.48, y + curve*0.55, cx + spread, y); 
            ctx.stroke(); 

            const seeds = Math.floor(42 + t * 128); 
            for (let p = 0; p < seeds; p++) { 
                const u = p / Math.max(1, seeds - 1); 
                const wave = Math.sin(u * Math.PI * 2 + r * 0.62) * curve * 0.42; 
                ctx.globalAlpha = 0.26 + t * 0.68; 
                ctx.beginPath(); 
                ctx.arc(cx - spread + u * spread * 2.0 + (Math.random()-0.5)*(2.5+t*7), y + wave + (Math.random()-0.5)*(1.5+t*5), 1.1 + t * 3.2, 0, Math.PI * 2); 
                ctx.fill(); 
            } 
        } 
        return c; 
    }

    function createSunMask() { 
        const { c, ctx, w, h } = getCanvas(); 
        const cx = 0; const cy = h * 0.20; const r = Math.min(w, h) * (state.mobile ? 0.25 : 0.35); 
        const sunGlow = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r); 
        sunGlow.addColorStop(0, 'rgba(255, 255, 255, 1)'); sunGlow.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)'); sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)'); 
        ctx.fillStyle = sunGlow; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); 

        const numRays = 26; 
        for(let i = 0; i < numRays; i++) { 
            const baseAngle = -Math.PI * 0.15 + (i / 26) * Math.PI * 0.75 + (Math.random() * 0.08); 
            const r1 = r * 0.2; const r2 = Math.max(w, h) * 1.5; 
            const rayGrad = ctx.createLinearGradient(cx + Math.cos(baseAngle)*r1, cy + Math.sin(baseAngle)*r1, cx + Math.cos(baseAngle)*r2, cy + Math.sin(baseAngle)*r2); 
            rayGrad.addColorStop(0, `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`); rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)'); 
            ctx.strokeStyle = rayGrad; ctx.lineWidth = Math.max(4, r * 0.01 + Math.random() * 20); ctx.beginPath(); 
            
            const waves = 1.5 + Math.random() * 2.5; const amplitude = r * (0.05 + Math.random() * 0.08); 
            for (let t = 0; t <= 1; t += 0.01) { 
                const curR = r1 + (r2 - r1) * t; const wOffset = Math.sin(t * Math.PI * 2 * waves) * amplitude; 
                const px = cx + Math.cos(baseAngle)*curR + Math.cos(baseAngle + Math.PI/2)*wOffset; 
                const py = cy + Math.sin(baseAngle)*curR + Math.sin(baseAngle + Math.PI/2)*wOffset; 
                if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); 
            } 
            ctx.stroke(); 
        } 
        return c; 
    }

    function createRainMask() { 
        const { c, ctx, w, h } = getCanvas(); 
        const numNuvens = 12; 
        for(let i = 0; i < numNuvens; i++) { 
            const px = (i/numNuvens) * w + (Math.random()-0.5)*100;
            const py = -h*0.05 + Math.random()*h*0.15;
            const raio = h*0.15 + Math.random()*h*0.1; 
            const grad = ctx.createRadialGradient(px, py, 0, px, py, raio); 
            grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)'); 
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(px, py, raio, 0, Math.PI*2); ctx.fill(); 
        } 
        ctx.lineWidth = 2; 
        for(let i = 0; i < 150; i++) { 
            const px = Math.random() * w; const py = Math.random() * h; const comp = 20 + Math.random() * 60; 
            ctx.strokeStyle = `rgba(255,255,255,${0.2 + Math.random()*0.5})`; 
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - comp*0.2, py + comp); ctx.stroke(); 
        } 
        return c; 
    }

    function createPestMask() { 
        const { c, ctx, w, h } = getCanvas(); 
        
        function drawLeaf(lx, ly, s, angle) { 
            ctx.save(); ctx.translate(lx, ly); ctx.rotate(angle); ctx.beginPath(); 
            ctx.moveTo(0, -s); ctx.bezierCurveTo(s*0.6, -s*0.5, s*0.6, s*0.5, 0, s); 
            ctx.bezierCurveTo(-s*0.6, s*0.5, -s*0.6, -s*0.5, 0, -s); 
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s); 
            grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0.2)'); 
            ctx.fillStyle = grad; ctx.fill(); ctx.restore(); 
        } 

        // Folhas desenhadas mais espaçadas para coincidir perfeitamente com os hotspots HTML
        const numLeaves = state.mobile ? 12 : 20; 
        const baseS = Math.min(w, h) * (state.mobile ? 0.08 : 0.12); 
        for(let i = 0; i < numLeaves; i++) { 
            const lx = w * 0.2 + Math.random() * (w * 0.6); 
            const ly = h * 0.2 + Math.random() * (h * 0.6); 
            const leafAngle = Math.random() * Math.PI * 2; 
            const lSize = baseS * (0.8 + Math.random() * 0.6); 
            drawLeaf(lx, ly, lSize, leafAngle); 
        } 
        
        // Buracos nas folhas para indicar pragas
        ctx.globalCompositeOperation = 'destination-out'; 
        const numHoles = state.mobile ? 120 : 250; 
        for(let i = 0; i < numHoles; i++) { 
            const leafX = w * 0.2 + Math.random() * (w * 0.6); 
            const leafY = h * 0.2 + Math.random() * (h * 0.6);
            const ang = Math.random() * Math.PI * 2; 
            const dist = Math.random() * 40; 
            const bX = leafX + Math.cos(ang) * dist; 
            const bY = leafY + Math.sin(ang) * dist; 
            const holeSize = Math.random() * 10; 
            
            ctx.beginPath(); ctx.arc(bX, bY, holeSize, 0, Math.PI*2); ctx.fill(); 
        } 
        
        return c; 
    }

    function createFormMask() {
        const { c, ctx, w, h } = getCanvas(); 
        ctx.lineWidth = 4;
        const cardW = w * 0.5; const cardH = h * 0.5;
        const cx = w/2 - cardW/2; const cy = h/2 - cardH/2;
        ctx.strokeRect(cx, cy, cardW, cardH); 
        
        ctx.globalAlpha = 0.5;
        ctx.fillRect(cx + 20, cy + 40, cardW * 0.4, 10); 
        ctx.fillRect(cx + 20, cy + 80, cardW * 0.8, 10); 
        ctx.fillRect(cx + 20, cy + 120, cardW * 0.6, 10); 
        return c;
    }

    function createResultMask() { 
        const { c, ctx, w, h } = getCanvas(); 
        const cx = w/2; const cy = h/2; const rBase = Math.min(w,h) * 0.4; 
        for(let i = 0; i < 5; i++) { 
            ctx.lineWidth = 1 + Math.random()*4; ctx.strokeStyle = `rgba(255,255,255,${1.0 - i*0.2})`; 
            if (i % 2 === 0) ctx.setLineDash([10 + Math.random()*30, 10 + Math.random()*20]); else ctx.setLineDash([]); 
            ctx.beginPath(); ctx.arc(cx, cy, rBase + (i * 25), 0, Math.PI*2); ctx.stroke(); 
        } 
        ctx.globalCompositeOperation = 'source-over'; 
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, rBase*1.5); 
        glow.addColorStop(0, 'rgba(255,255,255,0.15)'); glow.addColorStop(1, 'rgba(255,255,255,0)'); 
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, rBase*1.5, 0, Math.PI*2); ctx.fill(); 
        return c; 
    }

    /**
     * Allocação de Memória para os 7 Estágios
     */
    function buildParticles() { 
        state.mobile = window.innerWidth < 720; 
        state.width = window.innerWidth; state.height = window.innerHeight; 
        const sample = state.mobile ? config.sampleMobile : config.sampleDesktop; 
        
        const m1 = readMaskCandidates(createTextMask(), sample); 
        const m2 = readMaskCandidates(createFieldMask(), sample); 
        const m3 = readMaskCandidates(createSunMask(), sample); 
        const m4 = readMaskCandidates(createRainMask(), sample); 
        const m5 = readMaskCandidates(createPestMask(), sample); 
        const m6 = readMaskCandidates(createFormMask(), sample); 
        const m7 = readMaskCandidates(createResultMask(), sample); 

        const maxParticles = state.mobile ? config.maxMobile : config.maxDesktop; 
        const count = Math.min(maxParticles, m1.length, m2.length, m3.length, m4.length, m5.length, m6.length, m7.length); 
        state.count = count; 

        state.positions = new Float32Array(count * 3); 
        state.currentHomes = new Float32Array(count * 3); 
        state.velocities = new Float32Array(count * 3); 
        state.alphas = new Float32Array(count); state.seeds = new Float32Array(count); 

        state.homes = [
            new Float32Array(count * 2), new Float32Array(count * 2), new Float32Array(count * 2), 
            new Float32Array(count * 2), new Float32Array(count * 2), new Float32Array(count * 2),
            new Float32Array(count * 2) 
        ]; 

        for (let i = 0; i < count; i++) { 
            const o = i * 3, o2 = i * 2; const z = (Math.random() - 0.5) * 0.18; 
            
            state.homes[0][o2] = m1[i][0]; state.homes[0][o2+1] = m1[i][1]; 
            state.homes[1][o2] = m2[i][0]; state.homes[1][o2+1] = m2[i][1]; 
            state.homes[2][o2] = m3[i][0]; state.homes[2][o2+1] = m3[i][1]; 
            state.homes[3][o2] = m4[i][0]; state.homes[3][o2+1] = m4[i][1]; 
            state.homes[4][o2] = m5[i][0]; state.homes[4][o2+1] = m5[i][1]; 
            state.homes[5][o2] = m6[i][0]; state.homes[5][o2+1] = m6[i][1]; 
            state.homes[6][o2] = m7[i][0]; state.homes[6][o2+1] = m7[i][1]; 

            state.positions[o] = m1[i][0] + (Math.random()-0.5)*0.012; 
            state.positions[o+1] = m1[i][1] + (Math.random()-0.5)*0.012; 
            state.positions[o+2] = z; 

            state.alphas[i] = 0.28 + Math.random() * 0.72; state.seeds[i] = Math.random(); 
        } 

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.alpha); gl.bufferData(gl.ARRAY_BUFFER, state.alphas, gl.STATIC_DRAW); 
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.seed); gl.bufferData(gl.ARRAY_BUFFER, state.seeds, gl.STATIC_DRAW); 
    }

    function updateScrollTarget() { 
        const scroller = document.querySelector('.journey-container'); 
        let currentScroll = 0; let maxScroll = 1; 

        if (scroller) { 
            currentScroll = scroller.scrollTop; maxScroll = Math.max(scroller.scrollHeight - (window.innerHeight || 1), 1); 
        } else { 
            currentScroll = window.scrollY; maxScroll = Math.max(document.body.scrollHeight - (window.innerHeight || 1), 1); 
        } 
        
        const ratio = clamp(currentScroll / maxScroll, 0, 1); 
        state.scrollTarget = ratio * 6.0; // Multiplicado por 6 para cruzar os 7 estágios reais
    }

    // A Física da interação do rato com o rasto
    function sampleTrail(px, py) { 
        const tubeRadius = state.mobile ? config.pathTubeMobile : config.pathTubeDesktop; 
        let best = null; let bestScore = 0; 
        
        if (state.trail.length < 2) return null; 

        for (let i = 1; i < state.trail.length; i++) { 
            const a = state.trail[i - 1]; const b = state.trail[i]; 
            const abx = b.x - a.x; const aby = b.y - a.y; const len2 = abx * abx + aby * aby || 1; 
            
            const u = clamp(((px - a.x) * abx + (py - a.y) * aby) / len2, 0, 1); 
            const cx = a.x + abx * u; const cy = a.y + aby * u; 
            const dx = px - cx; const dy = py - cy; const d2 = dx * dx + dy * dy; 
            const trailAge = (state.trail.length - i) / Math.max(1, state.trail.length); 
            const r = tubeRadius * (1.08 - trailAge * 0.42); 

            if (d2 < r * r) { 
                const d = Math.sqrt(d2) || 1; const len = Math.sqrt(len2) || 1; 
                const life = (a.life * (1.0 - u) + b.life * u) * (1.0 - trailAge * 0.18); 
                const score = Math.pow(1.0 - d / r, 1.25) * life; 

                if (score > bestScore) { 
                    bestScore = score; 
                    best = { 
                        x: cx, y: cy, d, tx: abx/len, ty: aby/len, 
                        nx: d > 1 ? dx/d : -aby/len, ny: d > 1 ? dy/d : abx/len, 
                        vx: a.vx*(1-u) + b.vx*u, vy: a.vy*(1-u) + b.vy*u, 
                        score, head: i > state.trail.length - 5 
                    }; 
                } 
            } 
        } 
        return best; 
    }

    function pushPointer(x, y) { 
        const now = performance.now(); const dt = Math.max(16, now - (state.pointer.lastTime || now)); 
        const vx = state.pointer.lastTime ? (x - state.pointer.lastX) / dt * 16.67 : 0; 
        const vy = state.pointer.lastTime ? (y - state.pointer.lastY) / dt * 16.67 : 0; 
        
        state.pointer.active = true; state.pointer.px = x; state.pointer.py = y; 
        state.pointer.lastX = x; state.pointer.lastY = y; state.pointer.lastTime = now; state.lastMove = now; 

        const prev = state.trail[state.trail.length - 1]; 
        if (!prev || Math.hypot(x - prev.x, y - prev.y) > 2.8) { 
            state.trail.push({ x, y, vx, vy, life: 1.0 }); 
            while (state.trail.length > 128) state.trail.shift(); 
        } 
    }

    function bindEvents() { 
        const scroller = document.querySelector('.journey-container') || window; 
        scroller.addEventListener('scroll', updateScrollTarget, { passive: true }); 
        window.addEventListener('mousemove', e => pushPointer(e.clientX, e.clientY), { passive: true }); 
        window.addEventListener('touchstart', e => { if(e.touches[0]) pushPointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true }); 
        window.addEventListener('touchmove', e => { if(e.touches[0]) pushPointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true }); 
        window.addEventListener('mouseleave', () => { state.pointer.active = false; state.pointer.lastTime = 0; state.trail.length = 0; }); 
        window.addEventListener('touchend', () => { state.pointer.active = false; state.pointer.lastTime = 0; state.trail.length = 0; }); 
    }

    /**
     * O Loop Gigante da Física e Magnetismo das Partículas (Original e Completo)
     */
    function updatePhysics(now) { 
        state.scrollProgress += (state.scrollTarget - state.scrollProgress) * config.scrollEase; 
        const p = state.scrollProgress; 
        
        const stage = clamp(Math.floor(p), 0, 6); 
        const nextStage = clamp(stage + 1, 0, 6); 
        const fract = clamp(p - stage, 0, 1); 

        const activelyMoving = now - state.lastMove < config.settleDelay; 
        const recentlyTouched = now - state.lastMove < config.releaseDelay; 
        const globalReturnForce = (recentlyTouched || Math.abs(state.scrollTarget - state.scrollProgress) > 0.006) ? config.returnActive : config.returnIdle; 

        const invW = 2 / state.width; const invH = 2 / state.height; 

        for (let t = state.trail.length - 1; t >= 0; t--) { 
            state.trail[t].life *= activelyMoving ? 0.965 : 0.88; 
            if (state.trail[t].life < 0.028) state.trail.splice(t, 1); 
        } 

        const maskA = state.homes[stage]; const maskB = state.homes[nextStage]; 

        for (let i = 0; i < state.count; i++) { 
            const o = i * 3, o2 = i * 2; 
            let x = state.positions[o], y = state.positions[o+1], z = state.positions[o+2]; 
            let vx = state.velocities[o], vy = state.velocities[o+1], vz = state.velocities[o+2]; 
            
            const hx = maskA[o2] + (maskB[o2] - maskA[o2]) * fract; 
            const hy = maskA[o2+1] + (maskB[o2+1] - maskA[o2+1]) * fract; 

            vx += (hx - x) * globalReturnForce; 
            vy += (hy - y) * globalReturnForce; 
            vz += (0 - z) * globalReturnForce * 0.55; 

            if (activelyMoving && state.trail.length) { 
                const px = clipToPxX(x), py = clipToPxY(y); 
                const mx = state.pointer.px, my = state.pointer.py; 
                const mdx = mx - px, mdy = my - py; 
                const mR = state.mobile ? config.mouseFollowRadiusMobile : config.mouseFollowRadiusDesktop; 
                const md2 = mdx * mdx + mdy * mdy; 

                if (md2 < mR * mR) { 
                    const md = Math.sqrt(md2) || 1.0; 
                    const ms = Math.pow(1.0 - md / mR, 1.45); 
                    vx += (mdx / md) * config.mouseFollow * ms * invW * 260.0; 
                    vy += -(mdy / md) * config.mouseFollow * ms * invH * 260.0; 
                } 

                const hit = sampleTrail(px, py); 
                if (hit) { 
                    const s = hit.score; const gesture = Math.hypot(hit.vx, hit.vy); 
                    let dirX = hit.tx, dirY = hit.ty; 
                    if (gesture > 0.01 && dirX * hit.vx + dirY * hit.vy < 0.0) { dirX *= -1; dirY *= -1; } 

                    const headBoost = hit.head ? 1.65 : 1.0; const side = state.seeds[i] > 0.5 ? 1.0 : -1.0; 
                    const desiredOffset = (state.mobile ? config.pathEdgeMobile : config.pathEdgeDesktop) * side; 
                    const targetPx = hit.x + hit.nx * desiredOffset; const targetPy = hit.y + hit.ny * desiredOffset; 
                    const targetPull = Math.min(0.066, config.pathTargetPull * s * headBoost); 
                    const edgeForce = clamp((desiredOffset - hit.d * side) / 70.0, -1.0, 1.0); 

                    vx += (pxToClipX(targetPx) - x) * targetPull; vy += (pxToClipY(targetPy) - y) * targetPull; 
                    vx += (dirX * invW) * config.pathFollow * s * 430.0; vy += (-dirY * invH) * config.pathFollow * s * 430.0; 
                    vx += (hit.nx * invW) * config.pathEdgePull * edgeForce * s * 610.0 * headBoost; vy += (-hit.ny * invH) * config.pathEdgePull * edgeForce * s * 610.0 * headBoost; 
                    vx += (-hit.ty * invW) * config.pathOrbit * s * side * 165.0; vy += (-hit.tx * invH) * config.pathOrbit * s * side * 165.0; 
                    vx += (dirX * invW) * config.flow * s * gesture * 1.45; vy += (-dirY * invH) * config.flow * s * gesture * 1.45; 
                    vx += (hit.nx * invW) * config.headPush * s * (hit.head ? 72.0 : 22.0); vy += (-hit.ny * invH) * config.headPush * s * (hit.head ? 72.0 : 22.0); 
                    vz += (Math.sin(state.seeds[i] * 100.0) * 0.0032) * s; 
                } 
            } 

            // EFEITO DA CHUVA (Acontece APENAS no Estágio 3 = Índice 3, Sessão NDMI/Água)
            const distRain = Math.max(0, 1.0 - Math.abs(p - 3.0)); 
            if (distRain > 0.8) { 
                vy -= 0.012 * distRain * (1.0 + state.seeds[i]); 
                if (y < -1.2) { 
                    y = 1.2; 
                    x = hx + (Math.random() - 0.5) * 0.2; // Suaviza a queda e cria uma dispersão no eixo X
                    vy = 0; 
                } 
            } 

            // Rotação Constante do Resultado Final (Estágio 6)
            const distResult = Math.max(0, 1.0 - Math.abs(p - 6.0)); 
            if (distResult > 0.1) { 
                vx += Math.sin(Math.atan2(y, x)) * 0.004 * distResult; 
                vy -= Math.cos(Math.atan2(y, x)) * 0.004 * distResult; 
            } 

            // Ruído ambiente
            vx += Math.sin(now * 0.0012 + state.seeds[i] * 80.0) * config.noise; 
            vy += Math.cos(now * 0.0010 + state.seeds[i] * 44.0) * config.noise; 

            vx *= config.friction; vy *= config.friction; vz *= 0.94; 
            
            const speed = Math.hypot(vx, vy); 
            if (speed > config.maxSpeed) { 
                vx *= config.maxSpeed / speed; vy *= config.maxSpeed / speed; 
            } 

            x += vx; y += vy; z = clamp(z + vz, -0.42, 0.42); 

            state.positions[o] = x; state.positions[o+1] = y; state.positions[o+2] = z; 
            state.velocities[o] = vx; state.velocities[o+1] = vy; state.velocities[o+2] = vz; 
        } 
    }

    let lastTime = 0;
    
    function render(now) { 
        if (!state.positions || !state.count) { requestAnimationFrame(render); return; } 
        
        const dt = now - lastTime; 
        if (dt < 16) { requestAnimationFrame(render); return; } 
        lastTime = now; 

        updatePhysics(now); 

        // Transição Suave das 7 Cores de Fundo da Aplicação
        const bgColors = [ 
            [0.02, 0.03, 0.08], // 0. Início
            [0.07, 0.04, 0.02], // 1. Lavoura
            [0.10, 0.03, 0.00], // 2. NDVI (Quente)
            [0.01, 0.04, 0.09], // 3. NDMI (Chuva - Azul)
            [0.03, 0.06, 0.04], // 4. Pragas (Verde Foliar)
            [0.02, 0.02, 0.03], // 5. Formulário (Cinza Escuro)
            [0.01, 0.07, 0.08]  // 6. Resultado Final
        ]; 

        const p = clamp(state.scrollProgress, 0, 6); 
        const stage = Math.floor(p); 
        const nextStage = Math.min(stage + 1, 6); 
        const fract = p - stage; 

        const r = bgColors[stage][0] + (bgColors[nextStage][0] - bgColors[stage][0]) * fract; 
        const g = bgColors[stage][1] + (bgColors[nextStage][1] - bgColors[stage][1]) * fract; 
        const b = bgColors[stage][2] + (bgColors[nextStage][2] - bgColors[stage][2]) * fract; 

        gl.viewport(0, 0, canvas.width, canvas.height); 
        gl.clearColor(r, g, b, 1); 
        gl.clear(gl.COLOR_BUFFER_BIT); 
        
        gl.useProgram(program); 
        gl.enable(gl.BLEND); 
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE); 

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos); gl.bufferData(gl.ARRAY_BUFFER, state.positions, gl.DYNAMIC_DRAW); 
        gl.enableVertexAttribArray(locations.position); gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 0, 0); 

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.alpha); gl.enableVertexAttribArray(locations.alpha); gl.vertexAttribPointer(locations.alpha, 1, gl.FLOAT, false, 0, 0); 

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.seed); gl.enableVertexAttribArray(locations.seed); gl.vertexAttribPointer(locations.seed, 1, gl.FLOAT, false, 0, 0); 

        gl.uniform1f(locations.pointSize, state.mobile ? config.pointMobile : config.pointDesktop); 
        gl.uniform1f(locations.dpr, state.dpr); 
        gl.uniform1f(locations.progress, state.scrollProgress); 

        gl.drawArrays(gl.POINTS, 0, state.count); 
        requestAnimationFrame(render); 
    }

    function resize() { 
        state.width = window.innerWidth || 1200; state.height = window.innerHeight || 700; 
        state.mobile = state.width < 720; 
        state.dpr = Math.min(window.devicePixelRatio || 1, state.mobile ? 1.4 : 1.6); 
        
        canvas.width = Math.floor(state.width * state.dpr); 
        canvas.height = Math.floor(state.height * state.dpr); 
        
        buildParticles(); updateScrollTarget(); 
    }

    let resizeTimer = 0; 
    window.addEventListener('resize', () => { 
        clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 140); 
    }); 

    resize(); bindEvents(); requestAnimationFrame(render); 
})();

// ==========================================
// 8. RAIN CANVAS (ETAPA CHUVA)
// ==========================================
(() => {
    const canvas = document.getElementById('rainCanvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    const CHARS  = '01%°~·×▪01%'.split('');
    const FS     = 13;
    const TRAIL  = 7;
    let cols = [], animId, running = false;

    function randChar() { return CHARS[Math.floor(Math.random() * CHARS.length)]; }

    function resize() {
        const p = canvas.parentElement;
        canvas.width  = p ? p.offsetWidth  : window.innerWidth;
        canvas.height = p ? p.offsetHeight : window.innerHeight;
        init();
    }

    function init() {
        const spacing = Math.max(28, Math.floor(canvas.width / 14));
        const count   = Math.floor(canvas.width / spacing);
        cols = [];
        for (let i = 0; i < count; i++) {
            cols.push({
                x:     spacing * i + spacing / 2,
                y:     -Math.random() * canvas.height,
                speed: 1.2 + Math.random() * 1.4,
                head:  randChar(),
            });
        }
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `bold ${FS}px monospace`;

        cols.forEach(col => {
            for (let t = TRAIL; t >= 0; t--) {
                const yy = col.y - t * FS;
                if (yy < -FS || yy > canvas.height) continue;
                const alpha = t === 0 ? 0.80 : ((TRAIL - t) / TRAIL) * 0.22;
                ctx.fillStyle = t === 0
                    ? `rgba(190, 240, 255, ${alpha})`
                    : `rgba(30, 160, 255, ${alpha})`;
                ctx.fillText(t === 0 ? col.head : randChar(), col.x, yy);
            }
            col.y += col.speed;
            if (Math.random() < 0.06) col.head = randChar();
            if (col.y - TRAIL * FS > canvas.height) {
                col.y     = -FS * 2;
                col.speed = 1.2 + Math.random() * 1.4;
                col.head  = randChar();
            }
        });
        animId = requestAnimationFrame(tick);
    }

    function start() { if (!running) { running = true;  tick(); } }
    function stop()  { if (running)  { running = false; cancelAnimationFrame(animId); } }

    resize();
    window.addEventListener('resize', resize);

    const stageEl = document.getElementById('stage-chuva');
    const particleCanvasEl = document.getElementById('particleCanvas');
    if (stageEl) {
        new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                start();
                if (particleCanvasEl) particleCanvasEl.style.display = 'none';
            } else {
                stop();
                if (particleCanvasEl) particleCanvasEl.style.display = '';
            }
        }, { threshold: 0.05 }).observe(stageEl);
    }
})();

// ==========================================
// 9. WEBGL RAIN DROPS (ETAPA CHUVA)
// ==========================================
(() => {
    const canvas = document.getElementById('glRainCanvas');
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const VS = `
        attribute vec2  a_pos;
        attribute float a_t;
        varying   float v_t;
        void main() {
            gl_Position = vec4(a_pos, 0.0, 1.0);
            v_t = a_t;
        }
    `;
    const FS = `
        precision mediump float;
        varying float v_t;
        void main() {
            gl_FragColor = vec4(0.82, 0.95, 1.0, v_t * 0.72);
        }
    `;

    function compileShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const aPosLoc = gl.getAttribLocation(prog, 'a_pos');
    const aTLoc   = gl.getAttribLocation(prog, 'a_t');
    const glBuf   = gl.createBuffer();

    const N     = 320;
    const VERTS = 6;
    const STR   = 3;
    const vData = new Float32Array(N * VERTS * STR);

    const ANG  = 12 * Math.PI / 180;
    const SINR = Math.sin(ANG);
    const COSR = Math.cos(ANG);

    let W = 1, H = 1;
    const drops = [];

    function makeDrop() {
        return {
            x:   Math.random() * W,
            y:   Math.random() * H,
            len: 28 + Math.random() * 60,
            wid: 1.5 + Math.random() * 2.5,
            spd: 9   + Math.random() * 16,
            alp: 0.45 + Math.random() * 0.55,
        };
    }

    function initDrops() {
        drops.length = 0;
        for (let i = 0; i < N; i++) drops.push(makeDrop());
    }

    function ndcX(x) { return  x / W * 2 - 1; }
    function ndcY(y) { return  1 - y / H * 2; }

    function buildVerts() {
        let i = 0;
        for (const d of drops) {
            const hx = d.x + SINR * d.len * 0.5;
            const hy = d.y + COSR * d.len * 0.5;
            const tx = d.x - SINR * d.len * 0.5;
            const ty = d.y - COSR * d.len * 0.5;
            const hw = d.wid * 0.5;

            const hrx = hx + COSR * hw, hry = hy - SINR * hw;
            const hlx = hx - COSR * hw, hly = hy + SINR * hw;
            const trx = tx + COSR * hw, trY = ty - SINR * hw;
            const tlx = tx - COSR * hw, tly = ty + SINR * hw;
            const a = d.alp;

            vData[i++]=ndcX(hlx); vData[i++]=ndcY(hly); vData[i++]=a;
            vData[i++]=ndcX(hrx); vData[i++]=ndcY(hry); vData[i++]=a;
            vData[i++]=ndcX(tlx); vData[i++]=ndcY(tly); vData[i++]=0;
            vData[i++]=ndcX(hrx); vData[i++]=ndcY(hry); vData[i++]=a;
            vData[i++]=ndcX(trx); vData[i++]=ndcY(trY); vData[i++]=0;
            vData[i++]=ndcX(tlx); vData[i++]=ndcY(tly); vData[i++]=0;
        }
    }

    function resize() {
        const p = canvas.parentElement;
        W = canvas.width  = p ? p.offsetWidth  : window.innerWidth;
        H = canvas.height = p ? p.offsetHeight : window.innerHeight;
        gl.viewport(0, 0, W, H);
        initDrops();
    }

    let animId, running = false;

    function tick() {
        for (const d of drops) {
            d.x += SINR * d.spd;
            d.y += COSR * d.spd;
            if (d.y - d.len * 0.5 > H) {
                const r = makeDrop();
                Object.assign(d, r);
                d.y = -d.len;
            }
        }
        buildVerts();

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        gl.bindBuffer(gl.ARRAY_BUFFER, glBuf);
        gl.bufferData(gl.ARRAY_BUFFER, vData, gl.DYNAMIC_DRAW);

        const bytes = STR * 4;
        gl.enableVertexAttribArray(aPosLoc);
        gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, bytes, 0);
        gl.enableVertexAttribArray(aTLoc);
        gl.vertexAttribPointer(aTLoc,   1, gl.FLOAT, false, bytes, 8);

        gl.drawArrays(gl.TRIANGLES, 0, N * VERTS);
        animId = requestAnimationFrame(tick);
    }

    function start() { if (!running) { running = true;  tick(); } }
    function stop()  { if (running)  { running = false; cancelAnimationFrame(animId); } }

    resize();
    window.addEventListener('resize', resize);

    const stageEl = document.getElementById('stage-chuva');
    if (stageEl) {
        new IntersectionObserver(entries => {
            entries[0].isIntersecting ? start() : stop();
        }, { threshold: 0.05 }).observe(stageEl);
    }
})();

// ==========================================
// 10. WEBGL LEAF PARTICLES (STAGE PRAGAS)
// ==========================================
(() => {
    const canvas = document.getElementById('leafCanvas');
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const VS = `
        attribute vec2  a_pos;
        attribute float a_size;
        attribute float a_rot;
        attribute float a_alpha;
        attribute vec3  a_col;
        varying   float v_rot;
        varying   float v_alpha;
        varying   vec3  v_col;
        void main() {
            gl_Position = vec4(a_pos, 0.0, 1.0);
            gl_PointSize = a_size;
            v_rot   = a_rot;
            v_alpha = a_alpha;
            v_col   = a_col;
        }
    `;
    const FS = `
        precision mediump float;
        varying float v_rot;
        varying float v_alpha;
        varying vec3  v_col;
        void main() {
            vec2  uv   = gl_PointCoord - 0.5;
            float cosA = cos(v_rot);
            float sinA = sin(v_rot);
            vec2  r    = vec2(cosA * uv.x - sinA * uv.y,
                              sinA * uv.x + cosA * uv.y);
            float H    = 0.44;
            float W    = 0.20;
            if (abs(r.y) > H) discard;
            float t     = abs(r.y) / H;
            float halfW = W * pow(1.0 - t, 0.55);
            if (abs(r.x) > halfW) discard;
            float edge = 1.0 - smoothstep(halfW * 0.55, halfW, abs(r.x));
            float vein = 1.0 - smoothstep(0.0, 0.015, abs(r.x));
            vec3  col  = mix(v_col, v_col * 1.6, vein * 0.4);
            gl_FragColor = vec4(col, v_alpha * edge);
        }
    `;

    function compileShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const locs = {
        pos:  gl.getAttribLocation(prog, 'a_pos'),
        size: gl.getAttribLocation(prog, 'a_size'),
        rot:  gl.getAttribLocation(prog, 'a_rot'),
        alp:  gl.getAttribLocation(prog, 'a_alpha'),
        col:  gl.getAttribLocation(prog, 'a_col'),
    };
    const glBuf = gl.createBuffer();

    const N      = 65;
    const STRIDE = 8;
    const data   = new Float32Array(N * STRIDE);

    const LEAF_COLS = [
        [0.10, 0.48, 0.12],
        [0.16, 0.64, 0.15],
        [0.22, 0.70, 0.16],
        [0.08, 0.38, 0.10],
        [0.24, 0.58, 0.10],
        [0.13, 0.52, 0.08],
        [0.28, 0.65, 0.13],
    ];

    let W = 1, H = 1;
    const leaves = [];

    function randLeaf(startY) {
        const col = LEAF_COLS[Math.floor(Math.random() * LEAF_COLS.length)];
        return {
            x:     Math.random() * W,
            y:     startY !== undefined ? startY : -20,
            vx:    (Math.random() - 0.5) * 0.45,
            vy:    0.25 + Math.random() * 0.65,
            rot:   Math.random() * Math.PI * 2,
            rotS:  (Math.random() - 0.5) * 0.024,
            size:  42 + Math.random() * 46,
            alpha: 0.70 + Math.random() * 0.28,
            col:   col,
            sway:  Math.random() * Math.PI * 2,
            swayS: 0.008 + Math.random() * 0.018,
            swayA: 0.18  + Math.random() * 0.45,
        };
    }

    function initLeaves() {
        leaves.length = 0;
        for (let i = 0; i < N; i++) leaves.push(randLeaf(Math.random() * H));
    }

    function buildData() {
        let i = 0;
        for (const l of leaves) {
            data[i++] = l.x / W * 2 - 1;
            data[i++] = 1 - l.y / H * 2;
            data[i++] = l.size;
            data[i++] = l.rot;
            data[i++] = l.alpha;
            data[i++] = l.col[0];
            data[i++] = l.col[1];
            data[i++] = l.col[2];
        }
    }

    function resize() {
        const p = canvas.parentElement;
        W = canvas.width  = p ? p.offsetWidth  : window.innerWidth;
        H = canvas.height = p ? p.offsetHeight : window.innerHeight;
        gl.viewport(0, 0, W, H);
        initLeaves();
    }

    let animId, running = false;

    function tick() {
        for (const l of leaves) {
            l.sway += l.swayS;
            l.x    += l.vx + Math.sin(l.sway) * l.swayA;
            l.y    += l.vy;
            l.rot  += l.rotS;
            if (l.y > H + l.size)     { Object.assign(l, randLeaf()); l.x = Math.random() * W; }
            if (l.x < -(l.size + 20)) l.x = W + l.size;
            if (l.x >   W + l.size)   l.x = -(l.size);
        }
        buildData();

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.bindBuffer(gl.ARRAY_BUFFER, glBuf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

        const bytes = STRIDE * 4;
        gl.enableVertexAttribArray(locs.pos);
        gl.vertexAttribPointer(locs.pos,  2, gl.FLOAT, false, bytes,  0);
        gl.enableVertexAttribArray(locs.size);
        gl.vertexAttribPointer(locs.size, 1, gl.FLOAT, false, bytes,  8);
        gl.enableVertexAttribArray(locs.rot);
        gl.vertexAttribPointer(locs.rot,  1, gl.FLOAT, false, bytes, 12);
        gl.enableVertexAttribArray(locs.alp);
        gl.vertexAttribPointer(locs.alp,  1, gl.FLOAT, false, bytes, 16);
        gl.enableVertexAttribArray(locs.col);
        gl.vertexAttribPointer(locs.col,  3, gl.FLOAT, false, bytes, 20);

        gl.drawArrays(gl.POINTS, 0, N);
        animId = requestAnimationFrame(tick);
    }

    function start() { if (!running) { running = true;  tick(); } }
    function stop()  { if (running)  { running = false; cancelAnimationFrame(animId); } }

    resize();
    window.addEventListener('resize', resize);

    const stageEl = document.getElementById('stage-pragas-interativas');
    if (stageEl) {
        new IntersectionObserver(entries => {
            entries[0].isIntersecting ? start() : stop();
        }, { threshold: 0.05 }).observe(stageEl);
    }
})();

// ==========================================
// 11. SATELLITE LIGHTBOX
// ==========================================
(() => {
    const lightbox   = document.getElementById('satelliteLightbox');
    const lbImg      = document.getElementById('lightboxImg');
    const lbLabel    = document.getElementById('lightboxLabel');
    const lbImgWrap  = document.getElementById('lightboxImgWrap');
    const btnClose   = document.getElementById('btnCloseLightbox');
    if (!lightbox || !lbImg) return;

    function open(srcId, label, isNdmi) {
        const src = document.getElementById(srcId)?.src || '';
        if (!src || src === location.href) return;
        lbImg.src          = src;
        lbImg.alt          = label;
        if (lbLabel)   { lbLabel.textContent = label; lbLabel.className = isNdmi ? 'lightbox-sat-label ndmi' : 'lightbox-sat-label'; }
        if (lbImgWrap) { lbImgWrap.className = isNdmi ? 'lightbox-img-wrap ndmi-wrap' : 'lightbox-img-wrap'; }
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.getElementById('btnExpandNdvi')?.addEventListener('click', () =>
        open('img-satelite-real',     'SENTINEL-2 // NDVI', false));

    document.getElementById('btnExpandNdmi')?.addEventListener('click', () =>
        open('img-satelite-umidade',  'SENTINEL-2 // NDMI', true));

    btnClose?.addEventListener('click', close);

    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// ==========================================
// 10. VALIDAÇÃO DE FORMULÁRIO (PÁGINA CONTATO)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', function (event) {
            // Exigência da FIAP: Impedir o recarregamento automático da página
            event.preventDefault();

            // Captura os valores dos campos removendo espaços em branco extras
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();

            if (nome === '' || email === '' || mensagem === '') {
                formFeedback.className = 'feedback--erro';
                formFeedback.innerText = '❌ Todos os campos são obrigatórios. Por favor, preencha-os.';
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                formFeedback.className = 'feedback--aviso';
                formFeedback.innerText = '⚠️ Por favor, insira um e-mail válido.';
                return;
            }

            formFeedback.className = 'feedback--sucesso';
            formFeedback.innerText = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
            contactForm.reset();

            setTimeout(() => {
                formFeedback.className = '';
                formFeedback.innerText = '';
            }, 5000);
        });
    }
});
