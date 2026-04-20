# Kit Cruz Premium — Landing Page COD

> Landing page de alta conversão para venda de kit de acessórios em aço inox eletropolido com pagamento na entrega (COD).

---

## Quick Start

```bash
# 1. Servir localmente
npx -y http-server . -p 8080 -c-1

# 2. Abrir no navegador
# http://localhost:8080/Landing%20Page.html
```

> **Não precisa de build, bundler ou framework.** É um arquivo HTML único e autocontido.

---

## Visão Geral do Projeto

| Item | Detalhe |
|------|---------|
| **Produto** | Kit Cruz Premium (cordão + pingente cruz cravejado + pulseira) |
| **Material** | Aço inox eletropolido (316L) — hipoalergênico |
| **Preço** | R$ 99,00 (de R$ 297) — 66% OFF |
| **Modelo de venda** | COD (Cash on Delivery) — pagamento na entrega |
| **Regiões COD** | SP, RJ, BH, SC |
| **Marca** | Kit Cruz Premium |
| **Público-alvo** | Homens 18-45, tráfego Meta Ads |

---

## Estrutura de Arquivos

```
Pagina Joias/
├── Landing Page.html        ← Página principal (HTML + CSS + JS embutido)
├── README.md                ← Este documento
├── CHANGELOG.md             ← Histórico de mudanças
├── CODEBASE.md              ← Mapa técnico da codebase
│
├── assets/                  ← Imagens do kit (originais)
│   ├── kit-01.jpeg          → Galeria: "Na caixa"
│   ├── kit-02.jpeg          → Hero: Imagem principal
│   ├── kit-03.jpeg          → Disponível (não usada)
│   └── kit-04.jpeg          → Disponível (não usada)
│
├── uploads/                 ← Imagens de produto e depoimentos
│   ├── imgcordao.jpeg       → Card Peça 01: Cordão
│   ├── pintentecomcordao.jpeg → Card Peça 02: Pingente
│   ├── imgpulseira.jpeg     → Card Peça 03: Pulseira
│   ├── zoomupsclae corrente.png → Galeria: Macro do cordão
│   ├── zoomscalepingente.png → Galeria: Macro da cruz
│   ├── First-person_POV...png → Galeria: Experiência de receber
│   ├── depoimento1.png      → Disponível (não usada — trocado por depoimentos em texto)
│   ├── depoimento2.png      → Disponível
│   ├── depoimento3.png      → Disponível
│   ├── casalimg.png          → Disponível
│   ├── casal2img.png         → Disponível
│   ├── imgconceitual.png     → Disponível
│   ├── imgcordaopigenteepulseira.jpeg → Disponível
│   └── background.png       → Disponível
│
└── .agent/                  ← Configuração do agente AI
    ├── agents/              → Agentes especializados
    └── skills/              → Skills e scripts
```

---

## Arquitetura da Página

### Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| **Estrutura** | HTML5 semântico |
| **Estilo** | CSS puro (variáveis CSS / design tokens) |
| **Lógica** | JavaScript vanilla (sem dependências) |
| **Fontes** | Google Fonts (Fraunces, Space Grotesk, JetBrains Mono) |
| **Geolocalização** | ipapi.co (principal) + ip-api.com (fallback) |
| **Servidor** | Qualquer servidor estático (Vercel, Netlify, http-server) |

### Design System (CSS Tokens)

```css
/* Cores */
--ink: #0a0a0a        /* Fundo principal (preto) */
--ink-2: #141414      /* Fundo cards escuros */
--paper: #f5f4ef      /* Fundo claro (off-white) */
--neon: #d4ff00       /* Cor de destaque (amarelo-neon) */
--alert: #e63946      /* Cor de urgência (vermelho) */
--silver: #c5c7ca     /* Texto secundário */

/* Tipografia */
--f-display: "Fraunces"       /* Títulos e headlines */
--f-body: "Space Grotesk"     /* Corpo de texto */
--f-mono: "JetBrains Mono"    /* Labels, tags, badges */

/* Raios de borda */
--r-sm: 4px
--r-md: 10px
--r-lg: 18px
```

### Seções da Página (ordem de cima para baixo)

| # | Seção | Classe CSS | Fundo | Propósito |
|---|-------|-----------|-------|-----------|
| 0 | **Topbar** | `.topbar` | `--alert` (vermelho) | Urgência: "ÚLTIMAS UNIDADES" |
| 1 | **Nav** | `.nav` | — | Logo + CTA rápido |
| 2 | **Hero** | `.hero` | `--ink` | Headline + Preço + CTA + Imagem |
| 3 | **Ticker** | `.ticker` | `--neon` | Marquee animado com benefícios |
| 4 | **COD Band** | `.cod-band` | `--ink` | "Como funciona" — 3 passos |
| 5 | **Kit** | `.kit` | `--paper` | 3 cards de produto + total |
| 6 | **Benefits** | `.why` | `--ink` | 4 cards de benefícios |
| 7 | **Ticker Alt** | `.ticker.alt` | `--ink` | Segundo marquee (direção reversa) |
| 8 | **Reviews** | `.reviews` | `--paper` | 3 depoimentos em texto |
| 9 | **Gallery** | `.gallery` | `--ink` | Grid de 4 fotos macro |
| 10 | **FAQ** | `.faq` | `--paper` | 8 perguntas com accordion |
| 11 | **CTA Final** | `.cta-final` | `--ink` | Preço gigante + CTA final |
| 12 | **Footer** | `footer` | `--ink` | Links + selos + CNPJ |
| 13 | **Sticky CTA** | `.sticky-cta` | `--ink` | CTA fixo mobile (aparece no scroll) |

---

## Funcionalidades JavaScript

### 1. Geolocalização por IP
- **Fonte principal**: `https://ipapi.co/json/` (1000 req/dia gratuito)
- **Fallback**: `https://ip-api.com/json/`
- **IDs atualizados**: `#topbar-city`, `#faq-city`, `#footer-city`, `#footer-cod-list`, `#footbot-city`
- **Comportamento**: Detecta cidade/estado do visitante e personaliza textos
- **Fallback de conteúdo**: "todo o Brasil" / "SUA CIDADE"

### 2. Reveal on Scroll
- **Atributo**: `data-reveal` nos elementos
- **API**: IntersectionObserver com threshold 0.12
- **Efeito**: Fade-in + slide-up (opacity + translateY)

### 3. FAQ Accordion
- **Classe**: `.faq-item` com toggle de `.open`
- **Comportamento**: max-height animado, aria-expanded correto
- **Primeiro item**: Aberto por padrão

### 4. Sticky CTA Mobile
- **Aparece**: Após scrollar 70% do hero
- **Desaparece**: Quando seção de checkout (#comprar) entra na viewport
- **Escondido em desktop**: `display:none` acima de 980px

---

## Copy — Ângulos de Venda Principais

### Headline Principal
> "Não enegrece. Não mancha. Não irrita. R$ 99 na entrega."

### 3 Ângulos para Meta Ads

| Ângulo | Copy |
|--------|------|
| **Diferenciação técnica** | "Esqueça a prata que enegrece. Aço inox eletropolido não mancha, não irrita, não perde brilho. R$ 99 pago na entrega." |
| **Lifestyle à prova de tudo** | "Toma banho com ele. Malha com ele. Vai pra praia com ele. Kit cordão + pulseira + cruz feito pra uso diário. R$ 99 na entrega." |
| **Hipoalergênico** | "Se você já teve alergia a corrente barata, esse kit é pra você. Aço inox eletropolido, o mesmo usado em relógios Rolex. R$ 99 pago na entrega." |

### Objeções Tratadas no FAQ

| Objeção | Resposta-chave |
|---------|---------------|
| "É golpe?" | Pagamento só na entrega = zero risco |
| "É prata?" | Não, é aço inox eletropolido — melhor pra uso diário |
| "Demora?" | Até 3 dias úteis |
| "Pode molhar?" | Pode tudo: banho, praia, piscina, suor |
| "Alergia?" | Hipoalergênico, usado em próteses médicas |
| "Não gostei?" | Recusa na porta ou 7 dias de garantia |
| "Entrega na minha cidade?" | Geolocalização automática |
| "Serve pra presente?" | Sim, caixa de veludo vermelho |

---

## ⚠️ Regras de Compliance

> **NUNCA** usar a palavra "prata" para descrever o material em anúncios ou na página.

| ✅ Pode usar | ❌ Nunca usar |
|-------------|--------------|
| Aço inox eletropolido | Prata |
| Aço inox premium | Prata 925 |
| Aço cirúrgico (316L) | Banhado a prata |
| Material hipoalergênico | Prata legítima |

**Motivos**: Publicidade enganosa → PROCON, Reclame Aqui, penalização Meta Ads.

---

## Deploy

### Vercel (recomendado)

```bash
# Na raiz do projeto
npx -y vercel --prod
```

### Qualquer servidor estático
Basta servir a pasta como arquivos estáticos. A página é autocontida — não precisa de Node.js, build, ou configuração.

---

## Pontos de Personalização

| O que alterar | Onde no HTML |
|--------------|-------------|
| **Link do checkout** | `href="#link-do-checkout"` no botão CTA final |
| **Número WhatsApp** | Não está na página atual — adicionar se necessário |
| **CNPJ** | Tag `<small>` no footer |
| **Imagens dos produtos** | Pastas `assets/` e `uploads/` |
| **Preço** | Múltiplos locais (buscar por "99" e "297") |
| **Pixel Meta / Clarity** | Adicionar no `<head>` antes do `</head>` |
