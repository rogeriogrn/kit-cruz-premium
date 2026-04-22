# Changelog — Kit Cruz Premium Landing Page

Todas as alterações notáveis do projeto estão documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).

---

## [2.1.0] — 2026-04-22

### ✨ Verificação de Entrega por CEP + Bifurcação de Checkout

**Motivação:** Permitir que o cliente verifique disponibilidade de entrega agendada (Logzz) antes de ir para o checkout, e, quando a área não for atendida, redirecionar automaticamente para o fluxo de venda tradicional (pagamento antecipado + Correios), em vez de perder a venda.

### Added — Serverless
- `api/delivery.js` — Vercel Serverless Function. Proxy HTTP da API pública do Logzz (`/api/delivery-day/options/zip-code/{cep}`), com:
  - Timeout de 4s (evita página travada)
  - Cache de borda (`s-maxage=180, stale-while-revalidate=600`)
  - Normalização da resposta: `{ ok, reason, zip, city, state, dates[] }`
  - Razões possíveis: `available`, `unavailable`, `not_found`, `invalid_cep`, `fallback`

### Added — CTA Final (seção `#comprar`)
- Widget de CEP (`#cepWidget`) com 4 estados:
  1. **Input** — campo de CEP com máscara `00000-000` + botão desabilitado até 8 dígitos
  2. **Loading** — spinner enquanto consulta a API
  3. **Disponível** — lista de datas (data/tipo/preço), seleção clicável, botão `FINALIZAR PEDIDO` → Coinzz
  4. **Indisponível** — mensagem positiva + botão `COMPRAR COM ENVIO TRADICIONAL` → checkout tradicional
- Fallback gracioso: se a API do Logzz falhar/demorar, o cliente é redirecionado automaticamente para o fluxo tradicional (não trava venda).
- Placeholders de URL: `COINZZ_CHECKOUT_URL` e `TRADITIONAL_CHECKOUT_URL` (substituir no script antes de publicar).

### Changed — `Landing Page.html`
- Removido o botão direto `<a href="#link-do-checkout">` da seção `.cta-final`.
- Substituído por `<div id="cepWidget">` pré-renderizado com o estado inicial (preserva animação `data-reveal="up"`).
- Adicionado bloco CSS de `.cep-widget`, `.cep-input`, `.cep-date`, `.cep-alt`, `.cep-loading`, `.cep-final-btn` e `.cep-change`.
- Adicionado `<script id="cep-widget-script">` (rodapé) com lógica de estado, máscara, consulta, e construção de URL com query params (`cep`, `type_code`, `delivery_date`).

### Preservado
- Âncora `#comprar` continua a mesma — todos os CTAs da página (hero, kit, bandas, sticky mobile) seguem funcionando.
- Geolocalização, FAQ accordion, scroll reveal, sticky CTA: intocados.

---

## [2.0.0] — 2026-04-20

### 🔄 Rebranding Completo: Prata 925 → Aço Inox Eletropolido

**Motivação:** Vender como "prata R$ 99" gerava desconfiança ("barato demais, é golpe"). Aço inox premium a R$ 99 passa percepção de "preço justo por material durável". Reduz recusa no COD e abre novos ângulos de venda (hipoalergênico, resistente à água, sem manutenção).

### Changed — Marca
- **Marca**: `Argento BR · 925` → `Kit Cruz Premium`
- **Material**: Todas as referências a "prata 925" → "aço inox eletropolido"
- **Meta description**: Atualizada para mencionar aço inox e hipoalergênico

### Changed — Hero
- **Eyebrow tag**: `Kit 3 peças · Prata 925 · Edição 03` → `● EDIÇÃO LIMITADA · AÇO INOX PREMIUM`
- **Headline**: `Prata 925 por R$ 99` → `Não enegrece. Não mancha. Não irrita. R$ 99 na entrega.`
- **Subheadline**: Reescrita focando em hipoalergênico e resistência à água
- **Trust pills**: Removido "925 certificada" e "+12 mil clientes", adicionado "Pagamento na entrega", "Frete grátis", "Garantia de 7 dias"
- **CTA**: `Pedir o kit agora` → `QUERO MEU KIT AGORA`
- **Hero image tag**: `PRATA 925` → `AÇO INOX PREMIUM`

### Changed — Topbar
- **Background**: Preto sem destaque → **Vermelho de urgência** (`--alert`)
- **Copy**: `LOTE 03/08 — Frete grátis hoje` → `🔥 ÚLTIMAS UNIDADES EM SUA CIDADE · FRETE GRÁTIS · PAGUE SÓ NA ENTREGA`

### Changed — Ticker (marquee)
- Antes: `COD em SP · RJ · BH · SC`
- Agora: `Aço inox premium · Não enegrece · Hipoalergênico · Sem risco · Frete grátis`

### Changed — Seção COD
- Adicionado **label** "COMO FUNCIONA" acima do título
- **Título**: `PAGUE SÓ QUANDO CHEGAR NA SUA MÃO` → `Você só paga quando o entregador chegar na sua porta.`
- **Parágrafo**: Reescrito com mais detalhe (aceita dinheiro, PIX e cartão na maquininha)
- **Passo 3**: Adicionada menção a "cartão na maquininha do entregador"
- **Adicionado**: Botão CTA "GARANTIR O MEU" ao final da seção

### Changed — Seção Kit
- **Label**: `01 — O KIT` → `O QUE VEM NA SUA CAIXA`
- **Título**: `3 peças. 1 preço. Zero risco.` → `Três peças. Uma caixa. Zero problema.`
- **Subtítulo**: Adicionado texto sobre aço inox eletropolido e relógios de luxo
- **Card Cordão**: `Cable 60 cm` → `Cordão em aço inox` com copy sobre resistência à água
- **Card Pingente**: Mantido "Cruz Cravejada", atualizado para "base em aço inox premium"
- **Card Pulseira**: `Cable 21 cm` → `Pulseira combinando`, 19cm com copy atualizada
- **Specs**: `PRATA .925` → `AÇO INOX`, `42 PEDRAS` → `42 ZIRCÔNIAS`
- **Box total**: Label mudado para "VALOR COMPRADO SEPARADO" + texto de economia
- **Adicionado**: Botão CTA "PEGAR O MEU KIT" com estilo invertido (fundo escuro)

### Changed — Seção Benefícios
- **Label**: `02 — POR QUE ARGENTO` → `POR QUE VALE A PENA`
- **Título**: `Joia sem papo furado.` → `Quatro motivos pra clicar agora.`
- **Card 01**: `Zero risco.` → `💰 Pague na entrega.`
- **Card 02**: `R$ 99 fechado.` → `💧 Não enegrece nunca.` (novo ângulo)
- **Card 03**: `Prata 925 real.` → `✨ Hipoalergênico.` (novo ângulo)
- **Card 04**: `3–5 dias úteis.` → `🛡️ Garantia de 7 dias.`
- **Visual**: Removidos ícones SVG, adicionados emojis grandes como visual highlight

### Changed — Seção Depoimentos
- **Label**: `03 — QUEM JÁ PEDIU` → `QUEM JÁ RECEBEU`
- **Título**: `12.847 pessoas pagaram só quando chegou.` → `Mais de 8.000 clientes satisfeitos.`
- **Formato**: Screenshot de imagem → **Depoimentos em texto** (melhor para SEO e carregamento)
- **Depoimento 1** (Diego, SP): Foca em "tomo banho, treino, vou pra praia — continua brilhando"
- **Depoimento 2** (Mônica, BH): Foca em "pagar quando chegar" e "não escurece com suor"
- **Depoimento 3** (Rafael, SC): Foca em "pele sensível" e hipoalergênico

### Changed — Seção Galeria
- **Label**: Mantido `VEJA DE PERTO`
- **Título**: `Prata na luz.` → `Cada detalhe importa.`
- **Subtítulo**: Reescrito — "Sem filtro, sem truque, sem photoshop"
- **Imagens**: Mantidas as mesmas

### Changed — Seção FAQ
- **Label**: `05 — TIRAR A DÚVIDA` → `TIRA DÚVIDAS`
- **Título**: `Perguntas que você tá pensando.` → `Perguntas que todo mundo faz.`
- **Quantidade**: 6 perguntas → **8 perguntas**
- **Novas perguntas**:
  - "O kit é de prata?" (explica que aço inox é melhor pro uso diário)
  - "Posso tomar banho e ir à praia com o kit?"
  - "E se eu tiver alergia a metais?"
  - "Vem em caixinha? Serve pra presente?"
- **Perguntas atualizadas**:
  - Pagamento na entrega: Agora menciona cartão na maquininha
  - Tempo de entrega: Até 3 dias úteis (antes 3-5)
  - Não gostar: Menção a "não aceitar na porta"

### Added — Seção CTA Final (NOVA)
- **Nova seção inteira** com ID `#comprar` (antes era o formulário)
- **Badge**: "● OFERTA VÁLIDA ENQUANTO DURAR O ESTOQUE"
- **Headline**: "Último aviso: só R$ 99 com pagamento na entrega."
- **Preço gigante**: R$ 297 → R$ 99,00 (tamanho clamp 64px–140px)
- **CTA**: "QUERO MEU KIT AGORA" com botão neon grande
- **Trust pills**: 4 ícones de confiança
- **Efeito visual**: Radial gradient sutil no fundo

### Removed — Formulário de Checkout
- **Removido**: Formulário embutido com campos (nome, WhatsApp, endereço, cidade, CEP)
- **Substituído por**: Botão CTA que direciona para checkout externo (`#link-do-checkout`)
- **Motivo**: Checkout externo é mais escalável e seguro para COD

### Changed — Footer
- **Marca**: `Argento BR · 925` → `Kit Cruz Premium`
- **Descrição**: Atualizada para "acessórios em aço inox eletropolido"
- **Coluna "Entrega COD"**: Cidades fixas → Info genérica (SP · RJ · MG · SC + frete + prazo)
- **Coluna nova**: "Material" com benefícios do aço inox
- **Coluna "Ajuda"**: Renomeada para "Navegação" com links

### Changed — Sticky CTA Mobile
- **Antes**: `R$ 99 · Kit 3 peças` + `Pague só quando chegar` + `Pedir →`
- **Agora**: `De R$ 297` + `R$ 99,00` + `PEGAR O MEU →`

---

## [1.1.0] — 2026-04-20

### Added — Geolocalização Automática
- Script de geolocalização por IP usando `ipapi.co` + `ip-api.com` (fallback)
- Detecta cidade/estado do visitante e personaliza:
  - Topbar (`#topbar-city`)
  - FAQ sobre entrega (`#faq-city`)
  - Footer descrição (`#footer-city`)
  - Footer lista COD (`#footer-cod-list`)
  - Footer rodapé (`#footbot-city`)
- Fallback: "todo o Brasil" / "SUA CIDADE" se a API falhar

### Removed — Cidades hardcoded
- Removidas todas as referências fixas a "SP · RJ · BH · SC" dos textos dinâmicos
- Ticker: `COD em SP · RJ · BH · SC` → `Entregamos na sua cidade`
- FAQ: Lista fixa de cidades → detecção automática

---

## [1.0.0] — 2026-04-20

### Added — Versão Inicial (Argento BR)
- Landing page completa para venda de kit de prata 925 via COD
- Design system com tokens CSS (ink, paper, neon, alert)
- Tipografia: Fraunces (display), Space Grotesk (body), JetBrains Mono (labels)
- Hero com preço ancorado R$ 297 → R$ 99
- Ticker animado (marquee infinito)
- 3 cards de produto com zoom hover
- 4 benefícios com animação de borda
- 3 depoimentos em screenshot (imagem)
- Galeria grid 4 fotos com captions
- FAQ accordion (6 perguntas)
- Formulário de checkout embutido (nome, WhatsApp, endereço)
- Footer com selos de confiança
- Sticky CTA mobile com show/hide baseado no scroll
- Scroll reveal animations (IntersectionObserver)
- Meta Pixel pronto para integração
- Microsoft Clarity pronto para integração
