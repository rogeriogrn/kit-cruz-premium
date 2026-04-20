# CODEBASE — Kit Cruz Premium

> Mapa técnico da codebase para referência rápida de localização e dependências.

---

## Arquivo Principal

### `Landing Page.html`
Arquivo único autocontido com HTML + CSS + JS inline.

**Responsabilidades:**
- Layout e estrutura semântica de todas as seções
- Design system completo (tokens CSS, tipografia, cores)
- Lógica client-side (geolocation, accordion, scroll reveal, sticky CTA)

**Dependências externas (CDN):**
- Google Fonts: `Fraunces`, `Space Grotesk`, `JetBrains Mono`
- API de geolocalização: `ipapi.co/json/` + `ip-api.com/json/`

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

### Para definir link do checkout
Buscar `#link-do-checkout` no HTML e substituir pela URL real do checkout:
```html
<!-- Localização: seção .cta-final -->
<a href="https://seu-checkout.com/kit-cruz" class="btn-neon">
```

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
└── [4] Clica no CTA:
    └── Redireciona para checkout externo (#link-do-checkout)
```
