/* Saturno Security Scanner
 * Passive browser-only checks. DNS records use Cloudflare DNS-over-HTTPS.
 * Browser CORS/header visibility limits are represented as UNVERIFIABLE.
 */
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const panel = $("#security-headers-panel");
  if (!panel) return;

  const statusEl = $("#headers-status");
  const resultArea = $("#scanner-results-area");
  const resultsEl = $("#headers-results");
  const rows = [];
  let report = null;
  const HISTORY_KEY = "saturnoScannerHistoryV1";
  const STATUS_LABEL = { SECURE: "APROVADO", REVIEW: "REVISAR", MISSING: "AUSENTE", INSECURE: "INSEGURO", UNVERIFIABLE: "NÃO VERIFICÁVEL", ERROR: "ERRO" };
  const STATUS_ICON = { SECURE: "✓", REVIEW: "!", MISSING: "−", INSECURE: "×", UNVERIFIABLE: "?", ERROR: "!" };

  const recommendation = (name, status) => {
    const advice = {
      "Strict-Transport-Security": ["HSTS reduz o risco de downgrade para HTTP após a primeira conexão segura.", "Habilite HTTPS em todo o site e configure max-age progressivamente; inclua subdomínios somente após validá-los.", "Strict-Transport-Security: max-age=31536000; includeSubDomains", "HSTS só é efetivo quando enviado em HTTPS. Preload é opcional e exige compromisso com HTTPS permanente."],
      "Content-Security-Policy": ["CSP limita as origens de scripts, estilos e outros recursos carregados pelo navegador.", "Defina uma política baseada nos recursos realmente necessários. Evite unsafe-inline e curingas amplos; use nonce/hash para scripts quando possível.", "Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'", "Teste inicialmente em Content-Security-Policy-Report-Only para evitar bloquear recursos legítimos."],
      "X-Content-Type-Options": ["Este header reduz a interpretação de conteúdo em um tipo diferente do declarado pelo servidor.", "Configure nosniff em todas as respostas HTML e de recursos.", "X-Content-Type-Options: nosniff", "Vercel/Netlify: regra de headers; Nginx: add_header; Apache: mod_headers."],
      "X-Frame-Options": ["Este header oferece proteção legada contra incorporação da página em frames.", "Use DENY ou SAMEORIGIN se a página não precisar ser incorporada. CSP frame-ancestors oferece controle moderno.", "X-Frame-Options: SAMEORIGIN", "Defina também frame-ancestors na CSP para navegadores modernos."],
      "Referrer-Policy": ["Controla quanto da URL de origem é compartilhado em navegações e requisições.", "Prefira strict-origin-when-cross-origin ou uma política mais restritiva compatível com o produto.", "Referrer-Policy: strict-origin-when-cross-origin", "Configure no host/CDN para cobrir todas as rotas e respostas."],
      "Permissions-Policy": ["Restringe recursos do navegador, como câmera, microfone e geolocalização.", "Desative recursos que a aplicação não utiliza e autorize apenas origens necessárias.", "Permissions-Policy: camera=(), microphone=(), geolocation=()", "Ajuste a lista conforme as funcionalidades e integrações da aplicação."],
      "Cross-Origin-Opener-Policy": ["COOP controla o isolamento da janela em relação a documentos de outras origens.", "Considere same-origin quando a aplicação não depender de integrações que exigem contexto compartilhado.", "Cross-Origin-Opener-Policy: same-origin", "Valide fluxos OAuth, pagamentos e pop-ups antes de aplicar."],
      "Cross-Origin-Resource-Policy": ["CORP limita quais origens podem carregar os recursos do site.", "Use same-origin para recursos privados, ou same-site/cross-origin apenas quando necessário.", "Cross-Origin-Resource-Policy: same-origin", "Aplicar política muito restritiva pode interromper recursos CDN legítimos."],
      "Cross-Origin-Embedder-Policy": ["COEP exige que recursos incorporados permitam explicitamente o carregamento cross-origin.", "Use require-corp apenas se a aplicação precisar de isolamento cross-origin e os recursos estiverem preparados.", "Cross-Origin-Embedder-Policy: require-corp", "Pode bloquear fontes, imagens e scripts de terceiros sem CORS/CORP adequado."],
      "Access-Control-Allow-Origin": ["CORS define quais origens de navegador podem ler a resposta.", "Restrinja a origens confiáveis. A presença de * pode ser aceitável para conteúdo público sem credenciais.", "Access-Control-Allow-Origin: https://app.example.com", "Não reflita a origem recebida sem validação. CORS não substitui autenticação/autorização."],
      "Access-Control-Allow-Credentials": ["Permite credenciais cross-origin quando combinado com uma origem explícita.", "Se habilitado, use uma lista estrita de origens e nunca combine com Access-Control-Allow-Origin: *.", "Access-Control-Allow-Credentials: true", "Revise cookies, tokens e a necessidade real de chamadas autenticadas entre origens."],
      "Server / X-Powered-By": ["Headers de tecnologia podem facilitar o reconhecimento da pilha usada.", "Remova versões e detalhes desnecessários quando possível; isso reduz exposição, mas não substitui atualização e hardening.", "Server: (omitido ou genérico)", "Configure a aplicação, servidor de origem ou CDN para remover banners de versão."],
      "Set-Cookie": ["Atributos de cookie ajudam a proteger sessões e dados associados.", "Para cookies de sessão, avalie Secure, HttpOnly e SameSite=Lax/Strict conforme os fluxos do produto.", "Set-Cookie: session=…; Secure; HttpOnly; SameSite=Lax", "Set-Cookie normalmente não é acessível ao JavaScript via fetch; verifique no DevTools ou em resposta manual autorizada."]
    };
    const item = advice[name];
    if (!item) return ["A interpretação depende do contexto da aplicação e da resposta disponível.", status === "MISSING" ? "Confirme se a configuração é necessária para este serviço e se está definida no host, CDN ou aplicação." : "Revise o valor observado e valide se corresponde às origens e recursos legítimos.", "", "Ajuste no provedor de hospedagem, servidor web ou CDN responsável pela resposta."];
    return item;
  };

  function add(name, category, state, found, weight = 1, reference = "") {
    const [explanation, fix, example, hosting] = recommendation(name, state);
    rows.push({ name, category, state, found: found || "", risk: ({ INSECURE: "Alto", MISSING: weight >= 3 ? "Moderado" : "Baixo", REVIEW: "Revisão", ERROR: "Indisponível" })[state] || (state === "UNVERIFIABLE" ? "Não avaliado" : "Informativo"), explanation, recommendation: fix, example, hosting, weight, reference });
  }

  function normalizeHeaders(raw) {
    const map = new Map();
    String(raw).slice(0, 100000).split(/\r?\n/).forEach(line => {
      const at = line.indexOf(":");
      if (at < 1) return;
      const key = line.slice(0, at).trim().toLowerCase();
      const value = line.slice(at + 1).trim().slice(0, 4000);
      if (!/^[!#$%&'*+.^_`|~0-9a-z-]+$/i.test(key)) return;
      map.set(key, map.has(key) ? `${map.get(key)}\n${value}` : value);
    });
    return map;
  }

  function analyzeHeaderSet(headers, source, complete) {
    const specs = [
      ["strict-transport-security", "Strict-Transport-Security", 3], ["content-security-policy", "Content-Security-Policy", 3],
      ["x-content-type-options", "X-Content-Type-Options", 2], ["x-frame-options", "X-Frame-Options", 1],
      ["referrer-policy", "Referrer-Policy", 1], ["permissions-policy", "Permissions-Policy", 1],
      ["cross-origin-opener-policy", "Cross-Origin-Opener-Policy", 1], ["cross-origin-resource-policy", "Cross-Origin-Resource-Policy", 1],
      ["cross-origin-embedder-policy", "Cross-Origin-Embedder-Policy", 1]
    ];
    for (const [key, name, weight] of specs) {
      const value = headers.get(key);
      if (value === undefined) { add(name, "HTTP security headers", complete ? "MISSING" : "UNVERIFIABLE", complete ? "Header ausente nos dados fornecidos." : "Fetch não expõe ausência de headers que não estejam na lista CORS-safelisted ou Access-Control-Expose-Headers.", weight, "https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Expose-Headers"); continue; }
      let state = "REVIEW", found = value;
      if (key === "strict-transport-security") {
        const age = Number(value.match(/(?:^|;)\s*max-age\s*=\s*(\d+)/i)?.[1]);
        state = Number.isFinite(age) && age >= 31536000 ? "SECURE" : "REVIEW";
        found = `${value}${/includesubdomains/i.test(value) ? " · includeSubDomains" : " · sem includeSubDomains"}${/preload/i.test(value) ? " · preload declarado" : ""}`;
      } else if (key === "content-security-policy") {
        const directives = value.toLowerCase().split(";").map(x => x.trim());
        const unsafe = /'unsafe-(?:inline|eval)'|\*/i.test(value);
        const defaultSrc = directives.some(x => /^default-src\s+/.test(x));
        const objectNone = directives.some(x => /^object-src\s+[^;]*'none'/.test(x));
        state = unsafe ? "REVIEW" : defaultSrc && objectNone ? "SECURE" : "REVIEW";
        found = `Diretivas: ${value.slice(0, 1200)}${value.length > 1200 ? "…" : ""}`;
      } else if (key === "x-content-type-options") state = /^nosniff$/i.test(value) ? "SECURE" : "INSECURE";
      else if (key === "x-frame-options") state = /^(deny|sameorigin)$/i.test(value) ? "SECURE" : "REVIEW";
      else if (key === "referrer-policy") state = /^(no-referrer|same-origin|strict-origin|strict-origin-when-cross-origin)$/i.test(value) ? "SECURE" : "REVIEW";
      else if (key === "permissions-policy") {
        const directives = value.split(",").map(part => part.trim().toLowerCase());
        const restrictedCore = ["camera=()", "microphone=()", "geolocation=()"].every(name => directives.some(part => part.startsWith(name)));
        state = restrictedCore ? "SECURE" : "REVIEW";
      }
      else if (key === "cross-origin-opener-policy") state = /^(same-origin|same-origin-allow-popups|noopener-allow-popups)$/i.test(value) ? "SECURE" : "REVIEW";
      else if (key === "cross-origin-resource-policy") state = /^(same-origin|same-site|cross-origin)$/i.test(value) ? "REVIEW" : "INSECURE";
      else if (key === "cross-origin-embedder-policy") state = /^(require-corp|credentialless)$/i.test(value) ? "SECURE" : "REVIEW";
      add(name, "HTTP security headers", state, found, weight, "https://owasp.org/www-project-secure-headers/");
      if (key === "content-security-policy" && value) {
        const directives = value.toLowerCase();
        for (const [label, pattern, bad] of [["script-src", /(?:^|;)\s*script-src\s+([^;]+)/, /\*|'unsafe-inline'|'unsafe-eval'/], ["object-src", /(?:^|;)\s*object-src\s+([^;]+)/, /\*/]]) {
          const match = directives.match(pattern);
          if (match) add(`CSP ${label}`, "HTTP security headers", bad.test(match[1]) ? "REVIEW" : "SECURE", match[1], 1, "https://developer.mozilla.org/docs/Web/HTTP/CSP");
        }
      }
    }
    const server = ["server", "x-powered-by", "x-aspnet-version", "x-generator"].filter(k => headers.has(k)).map(k => `${k}: ${headers.get(k)}`);
    add("Server / X-Powered-By", "Exposição de informações", server.length ? "REVIEW" : complete ? "SECURE" : "UNVERIFIABLE", server.join("; ") || (complete ? "Nenhum banner comum observado." : "Headers de identificação podem estar ocultos pelo CORS."), 0, "https://owasp.org/www-project-web-security-testing-guide/");
    const origin = headers.get("access-control-allow-origin"), credentials = headers.get("access-control-allow-credentials");
    if (origin === undefined && credentials === undefined) add("Política CORS", "CORS", complete ? "SECURE" : "UNVERIFIABLE", complete ? "Nenhuma permissão CORS explícita informada; a política padrão do navegador restringe leituras cross-origin." : "Headers CORS não expostos pelo navegador; isso não indica vulnerabilidade.", 0, "https://developer.mozilla.org/docs/Web/HTTP/CORS");
    else {
      const wildcardCreds = origin === "*" && /^true$/i.test(credentials || "");
      add("Access-Control-Allow-Origin", "CORS", wildcardCreds ? "INSECURE" : origin === "*" ? "REVIEW" : "REVIEW", origin || "Ausente na resposta fornecida.", 2, "https://developer.mozilla.org/docs/Web/HTTP/CORS");
      if (credentials !== undefined) add("Access-Control-Allow-Credentials", "CORS", wildcardCreds ? "INSECURE" : /^true$/i.test(credentials) ? "REVIEW" : "SECURE", credentials, 2, "https://developer.mozilla.org/docs/Web/HTTP/CORS");
    }
    const cookies = headers.get("set-cookie");
    if (cookies === undefined) add("Atributos de cookies", "Cookies", complete ? "UNVERIFIABLE" : "UNVERIFIABLE", "Set-Cookie não pode ser lido por fetch no navegador. Nenhum cookie foi inspecionado.", 0, "https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie");
    else {
      const cookieLines = cookies.split(/\n/);
      for (const line of cookieLines) {
        const cookieName = line.split("=", 1)[0].trim();
        const safe = /(?:^|;)\s*secure(?:;|$)/i.test(line) && /(?:^|;)\s*httponly(?:;|$)/i.test(line) && /(?:^|;)\s*samesite=(strict|lax|none)(?:;|$)/i.test(line);
        add(`Cookie ${cookieName || "sem nome"}`, "Cookies", safe ? "SECURE" : "REVIEW", line.replace(/^([^=]+=)[^;]*/, "$1[REDACTED]"), 1, "https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie");
      }
    }
    if (source.protocol === "http:") add("Transporte HTTPS", "HTTPS e TLS", "INSECURE", "A URL analisada usa HTTP sem criptografia.", 3, "https://developer.mozilla.org/docs/Web/HTTP/HTTPS");
    else if (source.protocol === "https:") add("Transporte HTTPS e certificado", "HTTPS e TLS", "SECURE", "A URL usa HTTPS e o navegador aceitou a conexão TLS. Detalhes da cadeia, validade futura e configurações de cipher não são expostos ao JavaScript.", 3, "https://developer.mozilla.org/docs/Web/HTTP/HTTPS");
    else add("Transporte HTTPS e certificado", "HTTPS e TLS", "UNVERIFIABLE", "Headers fornecidos manualmente não incluem dados suficientes para confirmar HTTPS ou a validade do certificado.", 0, "https://developer.mozilla.org/docs/Web/HTTP/HTTPS");
    return headers;
  }

  function validateTarget(raw) {
    let url;
    try { url = new URL(raw); } catch { throw new Error("Informe uma URL válida, incluindo https:// ou http://."); }
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) throw new Error("Use uma URL HTTP/HTTPS sem credenciais embutidas.");
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    const privateV4 = /^(0|10|127|169\.254|192\.168|172\.(1[6-9]|2\d|3[01]))\./.test(host);
    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || privateV4 || host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:")) throw new Error("Por segurança, o scanner aceita apenas domínios públicos, não endereços locais ou privados.");
    url.hash = "";
    return url;
  }

  async function fetchTarget(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try { return await fetch(url.href, { method: "GET", mode: "cors", credentials: "omit", redirect: "follow", cache: "no-store", signal: controller.signal, headers: { Accept: "text/html,application/xhtml+xml" } }); }
    finally { clearTimeout(timer); }
  }

  async function queryDNS(name, type) {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`, { headers: { Accept: "application/dns-json" }, mode: "cors", credentials: "omit", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("DNS query failed");
    return response.json();
  }

  async function analyzeDNS(host) {
    let txt, dmarc, dnssec;
    try {
      [txt, dmarc] = await Promise.all([queryDNS(host, "TXT"), queryDNS(`_dmarc.${host}`, "TXT")]);
      dnssec = txt.AD === true;
      add("DNSSEC (resposta validada)", "DNS e domínio", dnssec ? "SECURE" : "UNVERIFIABLE", dnssec ? "A consulta DNS foi marcada como autenticada pelo resolvedor." : "O resolvedor não marcou a resposta TXT como autenticada (AD=false); isso não permite concluir se DNSSEC está ausente.", 0, "https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/");
      const txtValues = (txt.Answer || []).map(r => r.data.replace(/^"|"$/g, ""));
      const spf = txtValues.find(x => /(?:^|\s)v=spf1(?:\s|$)/i.test(x));
      add("Registro SPF", "DNS e domínio", spf ? "REVIEW" : txt.Status === 0 ? "MISSING" : "UNVERIFIABLE", spf || (txt.Status === 0 ? "Nenhum SPF encontrado nos TXT consultados." : "Consulta DNS sem resposta conclusiva."), 1, "https://www.rfc-editor.org/rfc/rfc7208");
      const dmarcValues = (dmarc.Answer || []).map(r => r.data.replace(/^"|"$/g, ""));
      const dmarcRecord = dmarcValues.find(x => /^v=DMARC1\s*;/i.test(x));
      const policy = dmarcRecord?.match(/(?:^|;)\s*p\s*=\s*(none|quarantine|reject)/i)?.[1]?.toLowerCase();
      add("Registro DMARC", "DNS e domínio", !dmarcRecord ? (dmarc.Status === 0 ? "MISSING" : "UNVERIFIABLE") : policy === "reject" || policy === "quarantine" ? "SECURE" : "REVIEW", dmarcRecord || (dmarc.Status === 0 ? "Nenhum DMARC encontrado em _dmarc." : "Consulta DNS sem resposta conclusiva."), 1, "https://www.rfc-editor.org/rfc/rfc7489");
      const mx = await queryDNS(host, "MX");
      add("Registros MX", "DNS e domínio", mx.Answer?.length ? "SECURE" : mx.Status === 0 ? "REVIEW" : "UNVERIFIABLE", mx.Answer?.map(x => x.data).join("; ") || "Nenhum MX retornado; pode ser esperado para um domínio sem e-mail.", 0, "https://www.rfc-editor.org/rfc/rfc1035");
    } catch {
      add("Registros DNS / SPF / DMARC / DNSSEC", "DNS e domínio", "UNVERIFIABLE", "Consulta ao DNS público indisponível ou bloqueada pela rede/CORS. Nenhum resultado foi inferido.", 0, "https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/");
    }
    const selectors = ["default", "google", "selector1", "selector2"];
    let found = false;
    for (const selector of selectors) {
      try { const answer = await queryDNS(`${selector}._domainkey.${host}`, "TXT"); if (answer.Answer?.some(x => /v=DKIM1/i.test(x.data))) { add("DKIM (seletores comuns)", "DNS e domínio", "REVIEW", `Registro encontrado para seletor ${selector}; confirme a chave e o alinhamento com o serviço de e-mail.`, 0, "https://www.rfc-editor.org/rfc/rfc6376"); found = true; break; } } catch { break; }
    }
    if (!found) add("DKIM (seletores comuns)", "DNS e domínio", "UNVERIFIABLE", "Nenhum registro foi encontrado nos seletores comuns consultados. DKIM usa seletores definidos pelo serviço e não há como confirmar ausência sem conhecê-los.", 0, "https://www.rfc-editor.org/rfc/rfc6376");
  }

  function analyzeMarkup(markup, pageURL) {
    const doc = new DOMParser().parseFromString(markup, "text/html");
    const scripts = [...doc.querySelectorAll("script[src]")];
    const external = scripts.filter(s => { try { return new URL(s.getAttribute("src"), pageURL).origin !== pageURL.origin; } catch { return false; } });
    const withoutSRI = external.filter(s => !s.integrity || !/\bsha(?:256|384|512)-/.test(s.integrity));
    add("Scripts externos e SRI", "Segurança do frontend", withoutSRI.length ? "REVIEW" : "SECURE", `${external.length} scripts externos identificados; ${withoutSRI.length} sem atributo integrity. Análise baseada apenas no HTML lido, sem executar scripts.`, 1, "https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity");
    const insecure = [...doc.querySelectorAll("script[src],link[href],img[src],iframe[src],source[src]")].filter(el => { const raw = el.getAttribute("src") || el.getAttribute("href"); try { return pageURL.protocol === "https:" && new URL(raw, pageURL).protocol === "http:"; } catch { return false; } });
    add("Recursos HTTP em página HTTPS", "Segurança do frontend", insecure.length ? "INSECURE" : "SECURE", insecure.length ? `${insecure.length} URL(s) HTTP encontradas em elementos carregáveis no HTML.` : "Nenhum recurso HTTP observado nos elementos analisados. CSS dinâmico e recursos criados em runtime não são cobertos.", 2, "https://developer.mozilla.org/docs/Web/Security/Mixed_content");
    const unsafeLinks = [...doc.querySelectorAll('a[target="_blank"][href]')].filter(a => { try { const u = new URL(a.href, pageURL); return u.origin !== pageURL.origin && !/\bnoopener\b/i.test(a.rel) && !/\bnoreferrer\b/i.test(a.rel); } catch { return false; } });
    add("Links externos com target=_blank", "Segurança do frontend", unsafeLinks.length ? "REVIEW" : "SECURE", `${unsafeLinks.length} links externos sem rel=noopener/noreferrer encontrados no HTML analisado.`, 1, "https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/noopener");
  }

  function scoreRows(items) {
    const relevant = items.filter(x => x.weight > 0 && ["SECURE", "REVIEW", "MISSING", "INSECURE"].includes(x.state));
    if (relevant.length < 4) return null;
    const max = relevant.reduce((sum, x) => sum + x.weight, 0);
    const earned = relevant.reduce((sum, x) => sum + x.weight * (x.state === "SECURE" ? 1 : x.state === "REVIEW" ? 0.5 : 0), 0);
    return { value: Math.round(earned / max * 100), evaluated: relevant.length, method: "Weighted ratio: SECURE=1, REVIEW=0.5, MISSING/INSECURE=0; only observable, weighted checks count. UNVERIFIABLE and informational checks are excluded." };
  }

  function render() {
    const count = state => rows.filter(r => r.state === state).length;
    $("#headers-secure-count").textContent = count("SECURE");
    $("#headers-review-count").textContent = count("REVIEW") + count("INSECURE");
    $("#headers-missing-count").textContent = count("MISSING");
    $("#headers-unverifiable-count").textContent = count("UNVERIFIABLE") + count("ERROR");
    const score = scoreRows(rows);
    $("#headers-score").textContent = score ? `${score.value}%` : "—";
    const groups = [...new Set(rows.map(r => r.category))];
    resultsEl.replaceChildren();
    for (const group of groups) {
      const section = document.createElement("section"); section.className = "scanner-category";
      const heading = document.createElement("h4"); heading.textContent = group; section.append(heading);
      for (const row of rows.filter(r => r.category === group)) {
        const article = document.createElement("article"); article.className = `headers-result-row state-${row.state.toLowerCase()}`;
        const icon = document.createElement("div"); icon.className = "headers-result-icon"; icon.setAttribute("aria-hidden", "true"); icon.textContent = STATUS_ICON[row.state];
        const main = document.createElement("div"); main.className = "headers-result-main";
        const title = document.createElement("div"); title.className = "headers-result-title";
        const name = document.createElement("strong"); name.textContent = row.name;
        const badge = document.createElement("span"); badge.textContent = STATUS_LABEL[row.state];
        title.append(name, badge); main.append(title);
        const description = document.createElement("p"); description.textContent = row.explanation; main.append(description);
        const found = document.createElement("p"); found.className = "scanner-found"; found.textContent = `Encontrado: ${row.found || "sem valor informado"}`; main.append(found);
        const details = document.createElement("details"); details.className = "scanner-row-details";
        const summary = document.createElement("summary"); summary.textContent = `Risco ${row.risk} · recomendação e correção`;
        const body = document.createElement("div"); body.className = "scanner-detail-body";
        for (const [label, value] of [["Impacto", row.explanation], ["Recomendação", row.recommendation], ["Como corrigir", row.hosting], ...(row.example ? [["Exemplo", row.example]] : [])]) { const p = document.createElement("p"); const b = document.createElement("b"); b.textContent = `${label}: `; p.append(b, document.createTextNode(value)); body.append(p); }
        if (row.reference) { const a = document.createElement("a"); a.href = row.reference; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "Documentação de referência"; body.append(a); }
        details.append(summary, body); main.append(details); article.append(icon, main); section.append(article);
      }
      resultsEl.append(section);
    }
    resultArea.hidden = false;
    report = { tool: "Saturno Security Scanner", generatedAt: new Date().toISOString(), url: report?.url || "Headers fornecidos manualmente", source: report?.source || "manual", summary: { secure: count("SECURE"), review: count("REVIEW"), missing: count("MISSING"), insecure: count("INSECURE"), unverifiable: count("UNVERIFIABLE"), error: count("ERROR"), score }, findings: rows.map(x => ({ ...x })), limitations: ["CORS pode ocultar headers da resposta. Ausência não exposta é UNVERIFIABLE.", "O navegador não permite inspeção detalhada do certificado TLS nem leitura de Set-Cookie por fetch.", "DNSSEC reflete o bit AD da consulta feita ao resolvedor DNS-over-HTTPS; DNS usa Cloudflare.", "A inspeção de HTML só ocorre quando a resposta é legível via CORS; scripts não são executados."] };
    const meta = $("#scanner-report-meta");
    if (meta) meta.textContent = `${report.url} · ${new Date(report.generatedAt).toLocaleString("pt-BR")}${report.httpStatus ? ` · HTTP ${report.httpStatus}` : ""}`;
  }

  function setStatus(message) { statusEl.textContent = message; }
  function setBusy(busy) { $("#headers-analyze-btn").disabled = busy; $("#headers-manual-analyze-btn").disabled = busy; $("#headers-analyze-btn").textContent = busy ? "ANALISANDO..." : "ANALISAR"; }
  function saveHistory(url) {
    const safeURL = `${url.origin}${url.pathname}`;
    try { const current = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); const next = [{ url: safeURL, at: new Date().toISOString() }, ...current.filter(x => x.url !== safeURL)].slice(0, 5); localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); renderHistory(); } catch { /* local storage is optional */ }
  }
  function renderHistory() {
    const box = $("#scanner-history"), list = $("#scanner-history-list");
    let items = []; try { items = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { items = []; }
    list.replaceChildren();
    for (const item of items) { const button = document.createElement("button"); button.type = "button"; button.className = "scanner-history-item"; button.textContent = item.url; button.addEventListener("click", () => { $("#headers-url-input").value = item.url; analyzeURL(); }); list.append(button); }
    box.hidden = !items.length;
  }

  async function analyzeURL() {
    rows.length = 0;
    let url;
    try { url = validateTarget($("#headers-url-input").value.trim()); }
    catch (error) { resultArea.hidden = true; setStatus(error.message); $("#headers-url-input").focus(); return; }
    setBusy(true); resultArea.hidden = true; setStatus("Consultando uma resposta pública e registros DNS...");
    report = { url: `${url.origin}${url.pathname}`, source: "url" };
    try {
      const response = await fetchTarget(url);
      const finalURL = new URL(response.url || url.href);
      const headers = new Map(); response.headers.forEach((value, key) => headers.set(key.toLowerCase(), value));
      analyzeHeaderSet(headers, url, false);
      add("Redirecionamento HTTP", "HTTPS e TLS", url.protocol === "https:" ? "UNVERIFIABLE" : finalURL.protocol === "https:" ? "SECURE" : "REVIEW", url.protocol === "https:" ? "A URL inicial já é HTTPS; o redirecionamento HTTP→HTTPS não foi testado para evitar uma segunda requisição." : `Destino final observado: ${finalURL.href}. A cadeia intermediária não fica disponível ao JavaScript.`, 0, "https://developer.mozilla.org/docs/Web/HTTP/Redirections");
      if (finalURL.origin !== url.origin) add("Redirecionamento cross-origin", "HTTPS e TLS", "REVIEW", `A URL final mudou de origem para ${finalURL.origin}. Confirme que o destino é esperado.`, 0, "https://developer.mozilla.org/docs/Web/HTTP/Redirections");
      let markup = "";
      if (/text\/html|application\/xhtml\+xml/i.test(response.headers.get("content-type") || "")) {
        try { markup = await readLimited(response, 1500000); analyzeMarkup(markup, finalURL); }
        catch { add("Análise do HTML", "Segurança do frontend", "UNVERIFIABLE", "O navegador não conseguiu ler o corpo da resposta.", 0); }
      } else add("Análise do HTML", "Segurança do frontend", "UNVERIFIABLE", "A resposta não foi identificada como HTML; análise de markup não realizada.", 0);
      if (response.type === "opaque") add("Acesso CORS", "Disponibilidade da análise", "UNVERIFIABLE", "Resposta opaca por CORS; não é evidência de vulnerabilidade.", 0);
      await analyzeDNS(url.hostname);
      report.url = `${url.origin}${url.pathname}`; report.finalURL = `${finalURL.origin}${finalURL.pathname}`; report.httpStatus = response.status; report.source = "url";
      saveHistory(url.href);
      render(); setStatus(`Análise passiva concluída. Resposta HTTP ${response.status}; ${rows.length} verificações registradas.`);
    } catch (error) {
      if (!rows.length) {
        for (const name of ["Headers HTTP", "HTML e recursos frontend"]) add(name, "Disponibilidade da análise", "UNVERIFIABLE", error?.name === "AbortError" ? "A requisição excedeu 12 segundos." : "O navegador bloqueou a leitura da resposta (CORS, rede ou TLS). Isso não confirma falha no website. Use o modo de headers manuais.", 0);
        await analyzeDNS(url.hostname);
      }
      report.url = `${url.origin}${url.pathname}`; report.source = "url"; render(); setStatus("A leitura HTTP não foi possível; veja os itens não verificáveis e os resultados DNS, se disponíveis.");
    } finally { setBusy(false); }
  }

  async function readLimited(response, maxBytes) {
    const declared = Number(response.headers.get("content-length") || 0);
    if (declared > maxBytes) throw new Error("HTML exceeds passive inspection size limit");
    if (!response.body) return (await response.text()).slice(0, maxBytes);
    const reader = response.body.getReader();
    const chunks = []; let size = 0;
    while (size < maxBytes) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = value.subarray(0, maxBytes - size); chunks.push(chunk); size += chunk.length;
      if (chunk.length < value.length) { await reader.cancel(); break; }
    }
    if (size >= maxBytes) await reader.cancel();
    const joined = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length; }
    return new TextDecoder().decode(joined);
  }

  function analyzeManual() {
    rows.length = 0;
    const raw = $("#headers-manual-input").value.trim();
    if (!raw) { setStatus("Cole pelo menos um header no formato Nome: valor."); return; }
    const headers = normalizeHeaders(raw);
    if (!headers.size) { setStatus("Nenhum header válido foi encontrado. Use linhas no formato Nome: valor."); return; }
    const sourceWithoutURL = { protocol: null };
    analyzeHeaderSet(headers, sourceWithoutURL, true);
    report = { url: "Headers fornecidos manualmente", source: "manual" };
    render(); setStatus(`Análise local concluída: ${rows.length} verificações. Nenhum dado foi enviado.`);
  }

  function exportReport() {
    if (!report) return null;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `saturno-security-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    return JSON.stringify(report, null, 2);
  }

  document.querySelectorAll("[data-open-headers]").forEach(button => button.addEventListener("click", () => { panel.hidden = false; panel.scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(() => $("#headers-url-input").focus(), 250); }));
  $("[data-close-headers]").addEventListener("click", () => { panel.hidden = true; });
  document.querySelectorAll("[data-headers-mode]").forEach(button => button.addEventListener("click", () => {
    const mode = button.dataset.headersMode;
    document.querySelectorAll("[data-headers-mode]").forEach(b => b.classList.toggle("is-active", b === button));
    document.querySelectorAll("[data-headers-view]").forEach(view => { view.hidden = view.dataset.headersView !== mode; });
    setStatus(mode === "url" ? "URL mode performs passive GET and optional public DNS lookups." : "Cole os headers HTTP para uma avaliação local.");
  }));
  $("#headers-analyze-btn").addEventListener("click", analyzeURL);
  $("#headers-manual-analyze-btn").addEventListener("click", analyzeManual);
  $("#headers-url-input").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); analyzeURL(); } });
  $("#headers-manual-input").addEventListener("keydown", event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") analyzeManual(); });
  $("#headers-clear-btn").addEventListener("click", () => { $("#headers-manual-input").value = ""; rows.length = 0; resultArea.hidden = true; setStatus("Campos limpos."); });
  $("#scanner-history-clear").addEventListener("click", () => { try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignored */ } renderHistory(); });
  $("#scanner-copy-report").addEventListener("click", async () => { if (!report) return; try { await navigator.clipboard.writeText(JSON.stringify(report, null, 2)); setStatus("Relatório JSON copiado para a área de transferência."); } catch { setStatus("A área de transferência não está disponível neste contexto."); } });
  $("#scanner-export-json").addEventListener("click", exportReport);
  $("#scanner-print-report").addEventListener("click", () => window.print());
  renderHistory();
})();
