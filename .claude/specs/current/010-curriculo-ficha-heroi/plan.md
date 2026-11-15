# Plano — 010 Currículo na ficha do herói, download do CV e coerência com o currículo

Lê-se junto com `spec.md`. Critérios (CA-01 a CA-29), decisões (DP-01 a DP-08), contratos, fronteiras e conteúdo (Anexos A e B) estão lá.

## Decisões técnicas

- **T1 — `profile.ts` é a fonte única.** Ficha, JSON-LD (`knowsAbout`, `jobTitle`, `image`), OG da home (`role`), `<h1>` sr-only e botões de CV leem de `profile`. Os únicos textos literais fora de `profile.ts` são `meta.description` (dicionários) e `manifest.description`.
- **T2 — Foto via `next/image`, sem `priority`.** Já usado em `Inventory.tsx`/`Gallery.tsx`; CSP `img-src 'self'` cobre `/_next/image`. `width={800} height={1000}` + `sizes="(min-width: 900px) 240px, 200px"`. Recorte feito uma vez (asset estático), não em runtime. Ferramenta sugerida: `sips` (nativo do macOS): `sips -c 1000 800 --cropOffset 300 283 ref/foto-ficha.png --out /tmp/x.png` e depois `sips -s format jpeg -s formatOptions 80 -s dpiWidth 72 -s dpiHeight 72` para `800×1000`; conferir que não há EXIF de GPS (`mdls`/`sips -g all`). Qualquer ferramenta vale se o CA-01/02/26 passar.
- **T3 — PDFs estáticos em `public/cv/`.** Sem `soffice`/`pandoc` na máquina. Caminho recomendado: (1) copiar o docx para o scratchpad, trocar `portifolio.bragademenezes.com` → `bragademenezes.com` e exportar PDF pelo ONLYOFFICE (`/Applications/ONLYOFFICE.app`, Arquivo → Baixar como → PDF), preservando o layout do usuário; (2) para EN, duplicar esse docx, substituir os textos pelo Anexo B (colunas EN) e exportar do mesmo jeito. Alternativa: `textutil -convert html` + Chrome headless `--print-to-pdf` (A4). Os docx intermediários **não** vão para o repo; guardar cópia em `.claude/specs/current/010-curriculo-ficha-heroi/ref/` (não versionado) para manutenção futura.
- **T4 — `proxy.ts` e `next.config.ts` sem mudança.** O `matcher` ignora caminhos com `.`, então `/cv/*.pdf` e `/profile/*.jpg` saem estáticos. O header `Content-Disposition` não é necessário: o atributo `download` do `<a>` basta (mesma origem).
- **T5 — Analytics.** Reusar o mecanismo `data-track` de `src/components/Analytics.tsx` (aceita qualquer nome de evento e repassa `data-track-channel`): `data-track="cv_download" data-track-channel={lang}` nos dois links de CV. Nenhuma edição em componentes.
- **T6 — CSS da ficha (Dono B), bloco "Sobre" de `globals.css`.**
  - `.avatar-photo`: `width: 240px; height: 300px` (≤ `899px`: `200×250`), `.avatar-photo img { width: 100%; height: 100%; object-fit: cover; }`; manter borda/raio de `.avatar`; remover o gradiente de céu do fundo quando for foto.
  - `.hero-card-name` (peso 800, ~1.15rem) e `.hero-card-headline` (`var(--frame-muted)`, ~0.9rem) logo abaixo da foto.
  - `.stats` segue 2 colunas (4 pares = 2×2).
  - `.cv-download`: `justify-self: start`; no celular `justify-self: stretch`.
  - `.quests`: manter a linha tracejada; `.quest-detail` (`0.82rem`, muted); `.quest-points` lista com marcador discreto, `font-size ≤ 0.92rem`, `gap` 4–6 px.
  - `.scrolls`: lista simples (título forte, instituição e período muted).
  - `.equipment-groups`: grid vertical de grupos; `.equipment-group-title` (h4, `0.78rem`, caixa alta, `var(--accent)`); `.equipment` mantém o grid de chips. Remover `.equipment-training`.
  - Contraste ≥ 4,5:1 nos temas `day`, `night`, `temple` (CA-25).
- **T7 — Base git.** `feat/010-curriculo-ficha-heroi` a partir de `origin/feat/009-revisao-ui` (`50b532e`). Interseção com a 009: `profile.ts`, dicionários, `page.tsx`, `globals.css` — por isso empilhada. Após merge do PR #5, Sentinela rebasa em `origin/development` e o PR da 010 aponta para `development`.

## Pacotes de trabalho

Numeração continua a da nota `tasks` (última: WP-35).

### WP-36 — Foto e CSS da ficha (Dono B, Pixel)

- **Possui:** `public/profile/andre-braga-de-menezes.jpg`, `src/app/globals.css` (só o bloco "Sobre").
- **Fora de escopo:** `.ts`, `.tsx`, `.json`, `public/cv/**`, `src/app/projects.css`.
- **Objetivo:** entregar primeiro a foto recortada (desbloqueia o build da WP-37), depois o CSS das classes do contrato §4.
- **Aceite:** CA-01 (asset), CA-01b, CA-02, CA-24, CA-25, CA-26, CA-27, CA-28, CA-29.
- **Depende de:** branch criada (WP-39 passo 1).

### WP-37 — Conteúdo, dicionários, JSON-LD e JSX da ficha (Dono A, Forja)

- **Possui:** `src/content/profile.ts`, `src/dictionaries/pt.json`, `src/dictionaries/en.json`, `src/lib/site.ts`, `src/app/manifest.ts`, `src/app/[lang]/page.tsx`.
- **Fora de escopo:** qualquer `.css`, `public/profile/**`, `src/components/**`, `src/content/projects.ts`, `src/content/privacy.ts`.
- **Objetivo:** aplicar o contrato §1–§4 com o texto exato dos Anexos A e B.
- **Aceite:** CA-01, CA-03 a CA-12, CA-17 a CA-23, CA-28, CA-29.
- **Depende de:** branch criada; foto da WP-36 para o build passar.

### WP-38 — PDFs do currículo PT e EN (Dono A, Forja)

- **Possui:** `public/cv/andre-braga-de-menezes-cv-pt.pdf`, `public/cv/andre-braga-de-menezes-cv-en.pdf`.
- **Objetivo:** gerar os 2 PDFs (T3, contrato §5, Anexo B).
- **Aceite:** CA-13 a CA-16, CA-29 (sem `.docx` em `public/`).
- **Depende de:** revisão do Anexo B (tradução EN) pelo usuário — o Maestro confirma antes de exportar o EN; o PDF PT pode sair já.

### WP-39 — Git (Sentinela)

1. Criar `feat/010-curriculo-ficha-heroi` a partir de `origin/feat/009-revisao-ui` (`50b532e`).
2. Após aprovação da Lupa: commits por WP com caminhos explícitos (`.claude/specs/**` em commit de docs separado; `termos-vedados.local` é ignorado pelo git e não entra).
3. Após merge do PR #5: rebase em `origin/development`; push e PR para `development` só com autorização do usuário.

### WP-40 — Revisão independente (Lupa)

- **Possui:** evidências. Não edita código.
- **Objetivo:** validar os 29 CAs em `/pt` e `/en`, desktop `1366×768` e celular `390×844` (mais `360`, `768` para CA-24).
- **Depende de:** WP-36, WP-37, WP-38.

## Ordem de execução

1. WP-39 passo 1 (branch).
2. WP-36 (foto primeiro) ∥ WP-37 ∥ WP-38 (PT). WP-38 (EN) após o usuário aprovar o Anexo B.
3. WP-40.
4. WP-39 passos 2–3.

## Verificação

- **Estático:**
  - `npm run lint && npx tsc --noEmit && npm run build` → exit 0 (CA-28)
  - `grep -n "training" src/content/profile.ts src/dictionaries/*.json` → 0 linhas (CA-09)
  - `grep -rn "Endpoint Engineer" src --include=*.json --include=*.ts --include=*.tsx` → só `src/content/profile.ts` (CA-22)
  - `grep -rniE -f .claude/specs/termos-vedados.local --exclude='*.local' src public .claude/specs ACOES-PENDENTES.md README.md` → 0; `grep -rniE "stone|infracorp" src/content/projects.ts` → 0; `find public -name '*.docx'` → vazio (CA-29)
  - Chaves dos dicionários (CA-23):
    ```bash
    node -e 'const k=(o,p="")=>Object.entries(o).flatMap(([a,v])=>v&&typeof v==="object"&&!Array.isArray(v)?k(v,p+a+"."):[p+a]);const a=k(require("./src/dictionaries/pt.json")).sort(),b=k(require("./src/dictionaries/en.json")).sort();console.log(JSON.stringify(a)===JSON.stringify(b)?"OK":"DIFF")'
    ```
- **PDFs (CA-13 a CA-16):** `curl -sI http://localhost:3000/cv/andre-braga-de-menezes-cv-pt.pdf` (200, `application/pdf`); tamanho com `stat -f%z`; páginas/A4 e texto com o extrator disponível (`pdftotext`, `python3 -I -c` com `pypdf`, ou `swift` + PDFKit); procurar as strings exigidas e a ausência de `portifolio.bragademenezes.com`.
- **Navegador (`/pt` e `/en`, desktop e celular):**
  ```js
  const card = document.querySelector('#about .hero-card');
  const img = card.querySelector('img'); const r = img.getBoundingClientRect();
  ({ src: img.currentSrc, alt: img.alt, wParam: +new URL(img.currentSrc).searchParams.get('w'), need: r.width * devicePixelRatio, ratio: r.width / r.height, w: r.width,
     npc: !!card.querySelector('.npc-avatar'),
     stats: [...card.querySelectorAll('.stats dt')].map((d) => [d.textContent, d.nextElementSibling.textContent]),
     cv: (({ href, download, textContent }) => ({ href, download: card.querySelector('a.cv-download').hasAttribute('download'), textContent }))(card.querySelector('a.cv-download')),
     quests: [...document.querySelectorAll('#about .quests > li')].map((li) => li.querySelectorAll('.quest-points li').length),
     groups: [...document.querySelectorAll('.equipment-groups .equipment')].map((u) => u.children.length),
     h1: [...document.querySelectorAll('h1')].map((h) => h.textContent),
     overflowX: document.documentElement.scrollWidth !== document.documentElement.clientWidth });
  ```
  Esperado: `wParam >= need` (CA-01b), `quests` = `[7,3,2,1]`, `groups` = `[9,7,9,6,11,5]`, `npc` = `false`, `overflowX` = `false`.
- **JSON-LD (CA-21):** `JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)` e conferir campos.
- **Lighthouse (CA-25)** e regressão da 009 (CA-27) com os scripts do `plan.md` da 009.
