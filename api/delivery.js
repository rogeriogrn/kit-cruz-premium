// Serverless function (Vercel) — proxy de consulta de CEP na API Logzz.
// Endpoint: GET /api/delivery?cep=01010000
//
// Evita CORS chamando a API do Logzz pelo backend, aplica cache em borda,
// normaliza a resposta para o frontend e faz fallback gracioso quando a API
// retorna erro ou demora demais. O frontend SEMPRE recebe JSON com a chave
// `reason` — nunca HTTP 5xx — para que a experiência do cliente não trave.

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // Cache curto em borda: mesma região costuma repetir consultas próximas
  res.setHeader("Cache-Control", "s-maxage=180, stale-while-revalidate=600");

  const rawCep = (req.query && req.query.cep ? String(req.query.cep) : "").trim();
  const cep = rawCep.replace(/\D/g, "");

  if (cep.length !== 8) {
    return res.status(200).json({
      ok: false,
      reason: "invalid_cep",
      message: "CEP inválido. Informe 8 dígitos.",
    });
  }

  const url = `https://app.logzz.com.br/api/delivery-day/options/zip-code/${cep}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);

    let json = null;
    try {
      json = await response.json();
    } catch (_) {
      json = null;
    }

    const payload = json && json.data && json.data.response ? json.data.response : null;
    const dates = payload && Array.isArray(payload.dates_available) ? payload.dates_available : [];

    if (response.ok && json && json.success === true && dates.length > 0) {
      return res.status(200).json({
        ok: true,
        reason: "available",
        zip: cep,
        city: payload.city || null,
        state: payload.state || null,
        operation: payload.local_operation_name || null,
        dates: dates.map((d) => ({
          date: d.date,
          code: d.type_code,
          name: d.type_name,
          price: typeof d.price === "number" ? d.price : Number(d.price) || null,
        })),
      });
    }

    // Identifica o motivo do erro pelos textos retornados pela API
    const errors = Array.isArray(json && json.errors) ? json.errors : [];
    const joined = errors.join(" | ").toLowerCase();
    const notFound = /n[aã]o encontrado/.test(joined);
    const unavailable = /n[aã]o dispon[ií]vel|bloqueado/.test(joined);

    if (notFound) {
      return res.status(200).json({
        ok: false,
        reason: "not_found",
        zip: cep,
        message: "CEP não encontrado. Confira os números.",
      });
    }

    if (unavailable || response.status === 422) {
      return res.status(200).json({
        ok: false,
        reason: "unavailable",
        zip: cep,
        message: "Área sem entrega agendada para este CEP.",
      });
    }

    // Qualquer outro caso (retorno estranho): trata como indisponível para o
    // cliente ir para o fluxo tradicional. Melhor vender do que travar.
    return res.status(200).json({
      ok: false,
      reason: "fallback",
      zip: cep,
      message: "Não foi possível confirmar — usando envio tradicional.",
    });
  } catch (err) {
    clearTimeout(timer);
    // Timeout / rede / qualquer falha da API externa → fallback tradicional
    return res.status(200).json({
      ok: false,
      reason: "fallback",
      zip: cep,
      message: "Não foi possível verificar agora — usando envio tradicional.",
    });
  }
};
