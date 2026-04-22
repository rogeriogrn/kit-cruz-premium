# CODEBASE — Kit Cruz Premium

> Mapa técnico da codebase para referência rápida de localização e dependências.

---

## Arquivo Principal

### `Landing Page.html`
Arquivo único autocontido com HTML + CSS + JS inline.

**Responsabilidades:**
- Layout e estrutura semântica de todas as seções
- Design system completo (tokens CSS, tipografia, cores)
- Lógica client-side (geolocation, accordion, scroll reveal, sticky CTA, widget de CEP)

**Dependências externas (CDN):**
- Google Fonts: `Fraunces`, `Space Grotesk`, `JetBrains Mono`
- API de geolocalização: `ipapi.co/json/` + `ip-api.com/json/`
- API de entrega (via proxy próprio): `api/delivery.js` → `app.logzz.com.br`

---

## Backend (Vercel Serverless)

### `api/delivery.js`
Função serverless Node.js (CommonJS) executada na edge da Vercel.

**Endpoint público:** `GET /api/delivery?cep=XXXXXXXX`

**Responsabilidades:**
- Normaliza o CEP (só dígitos, 8 caracteres)
- Chama `GET https://app.logzz.com.br/api/delivery-day/options/zip-code/{cep}` com timeout de 4s
- Traduz a resposta em um payload simplificado: `{ ok, reason, zip, city, state, dates[] }`
- Sempre retorna HTTP 200 com `reason` → o frontend nunca precisa tratar 5xx
- Cache em borda: `s-maxage=180, stale-while-revalidate=600`

**Valores possíveis de `reason`:**
| Valor | Significado |
|-------|-------------|
| `available` | API retornou `success: true` e `dates_available[]` não vazio |
| `unavailable` | API retornou 422 ou erro "Área não disponível" |
| `not_found` | API retornou erro "CEP não encontrado" |
| `invalid_cep` | CEP informado não tem 8 dígitos |
| `fallback` | Falha de rede, timeout, ou retorno inesperado (segue no modo tradicional) |

---

## Mapa de Imagens

### Em uso na página (v2.0.0)

| Arquivo | Seção | Elemento |
|---------|-------|----------|
| `assets/kit-02.jpeg` | Hero | Imagem principal do kit |
| `uploads/imgcordao.jpeg` | Kit | Card Peça 01 — Cordão |
| `uploads/pintentecomcordao.jpeg` | Kit | Card Peça 02 — Pingente |
| `uploads/imgpulseira.jpeg` | Kit | Card Peça 03 — Pulseira |
| `uploads/zoomupsclae corrente.png` | Galeria | Foto 01 — Macro cordão |
| `uploads/zoomscalepingente.png` | Galeria | Foto 02 — Macro cruz |
| `uploads/First-person_POV_photograph_202604201425.png` | Galeria | Foto 03 — Experiência de receber |
| `assets/kit-01.jpeg` | Galeria | Foto 04 — Na caixa |

### Disponíveis (não usadas na v2.0.0)

| Arquivo | Nota |
|---------|------|
| `assets/kit-03.jpeg` | Foto alternativa do kit |
| `assets/kit-04.jpeg` | Foto alternativa do kit |
| `uploads/depoimento1.png` | Screenshot de depoimento (era usado na v1.0) |
| `uploads/depoimento2.png` | Screenshot de depoimento |
| `uploads/depoimento3.png` | Screenshot de depoimento |
| `uploads/casalimg.png` | Imagem conceitual casal |
| `uploads/casal2img.png` | Imagem conceitual casal #2 |
| `uploads/imgconceitual.png` | Imagem conceitual |
| `uploads/imgcordaopigenteepulseira.jpeg` | Foto combinada das 3 peças |
| `uploads/background.png` | Background genérico |

---

## Mapa de IDs Importantes

### IDs dinâmicos (atualizados por JavaScript)

| ID | Localização | Atualizado por |
|----|------------|---------------|
| `#topbar-city` | Barra de urgência | Geolocalização |
| `#faq-city` | FAQ — pergunta sobre entrega | Geolocalização |
| `#footer-city` | Footer — descrição da marca | Geolocalização |
| `#footer-cod-list` | Footer — lista de entrega COD | Geolocalização |
| `#footbot-city` | Footer — barra inferior | Geolocalização |
| `#stickyCta` | CTA móvel fixo | Scroll listener |
| `#comprar` | Seção CTA final (âncora) | Target de scroll |
| `#cepWidget` | Seção CTA final — widget de CEP | Script `#cep-widget-script` |
| `#cepInput` | Campo de CEP (estado input) | Máscara 00000-000 |
| `#cepBtn` | Botão "VERIFICAR" (estado input) | Habilita com 8 dígitos |
| `#cepHelp` | Mensagem abaixo do input | Feedback de estado/erro |

### Classes CSS principais

| Classe | Tipo | Uso |
|--------|------|-----|
| `.topbar` | Seção | Barra de urgência (sticky top) |
| `.hero` | Seção | Bloco principal |
| `.ticker` / `.ticker.alt` | Seção | Marquee animado |
| `.cod-band` | Seção | Como funciona COD |
| `.kit` | Seção | Cards de produto |
| `.why` | Seção | Benefícios |
| `.reviews` | Seção | Depoimentos |
| `.gallery` | Seção | Galeria de fotos |
| `.faq` | Seção | Perguntas frequentes |
| `.cta-final` | Seção | CTA gigante final |
| `.btn-neon` | Componente | Botão principal (neon) |
| `.mark` | Componente | Highlight de texto (skew neon) |
| `.strike` | Componente | Preço riscado |
| `.piece` | Componente | Card de produto |
| `.ben` | Componente | Card de benefício |
| `.card` | Componente | Card de depoimento |
| `.faq-item` | Componente | Item do accordion |
| `.sticky-cta` | Componente | CTA fixo mobile |
| `[data-reveal]` | Utilitário | Scroll reveal animation |

---

## Pontos de Integração

### Para adicionar Meta Pixel
```html
<!-- Adicionar antes do </head> -->
<script>
  !function(f,b,e,v,n,t,s)
  {/* ... código do Meta Pixel ... */}
  fbq('init', 'SEU_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

### Para adicionar Microsoft Clarity
```html
<!-- Adicionar antes do </head> -->
<script>
  (function(c,l,a,r,i,t,y){/* ... código do Clarity ... */})(window,document,"clarity","script","SEU_ID");
</script>
```

### Para definir links dos checkouts (widget de CEP)
Editar `Landing Page.html`, bloco `<script id="cep-widget-script">`, e substituir:

```js
const COINZZ_CHECKOUT_URL      = 'COINZZ_CHECKOUT_URL';       // URL real do Coinzz
const TRADITIONAL_CHECKOUT_URL = 'TRADITIONAL_CHECKOUT_URL';  // URL real do checkout tradicional
```

**Query params enviados automaticamente:**
- Coinzz: `cep`, `type_code` (da data escolhida), `delivery_date` (YYYY-MM-DD)
- Tradicional: `cep`

Se for preciso mudar os nomes dos params para combinar com o que o checkout aceita, editar `buildCoinzzUrl()` e `buildTraditionalUrl()` no mesmo script.

---

## Fluxo de Dados

```
Visitante acessa a página
│
├── [1] Carrega HTML + CSS + Fontes
│
├── [2] JavaScript executa:
│   ├── Geolocalização (ipapi.co → ip-api.com → fallback)
│   │   └── Atualiza: topbar, FAQ, footer
│   ├── IntersectionObserver → reveal animations
│   ├── FAQ accordion listeners
│   └── Sticky CTA scroll listener
│
├── [3] Visitante navega:
│   ├── Scroll → elementos fazem fade-in
│   ├── 70% do hero → sticky CTA aparece
│   └── Seção #comprar → sticky CTA desaparece
│
└── [4] Clica em qualquer CTA da página:
    └── Scroll suave até a seção #comprar (CTA final)
        │
        └── [5] Digita o CEP no widget:
            ├── /api/delivery?cep=... (serverless → Logzz)
            │
            ├── reason = "available"
            │   └── Renderiza lista de datas → clica FINALIZAR PEDIDO
            │       └── Redireciona para Coinzz com cep, type_code, delivery_date
            │
            ├── reason = "unavailable" | "fallback"
            │   └── Renderiza mensagem + botão ENVIO TRADICIONAL
            │       └── Redireciona para checkout tradicional com cep
            │
            └── reason = "not_found" | "invalid_cep"
                └── Volta ao input com mensagem de erro
```
