# 010 — Currículo na ficha do herói, download do CV e coerência do site com o currículo

- **Domínio:** conteúdo + ui
- **Status:** aprovada para particionamento
- **Autor:** Arquiteto (Prisma)
- **Data:** 2026-11-15
- **Origem:** pedido do usuário em 2026-11-15, literal: *"Na parte de ficha do herói, quero que fique o mais próximo possível do meu currículo, e coloque um botão de download do meu currículo também. Revise o site como um todo para ficar coerente com o meu currículo. Na foto da sessão da ficha do herói pode usar a seguinte foto."*
- **Entradas (copiadas para `ref/`, não versionadas):**
  - `ref/Curriculo_Andre_Braga_de_Menezes_AI_Builder.docx` — currículo do usuário (PT). Fonte da verdade do conteúdo do Anexo B.
  - `ref/foto-ficha.png` — retrato P&B, em pé, `1365×2048`, ~960 KB.
- **Base git:** branch `feat/010-curriculo-ficha-heroi` **empilhada** sobre `origin/feat/009-revisao-ui` (`50b532e`), porque a 010 depende do conteúdo da 009 (`profile.name`, `hero.lines`, `page.tsx` enxuto). Estado confirmado pela Sentinela em 2026-11-15: PR #5 (009 → `development`) aberto/draft; `origin/development` em `bd47b61`. O PR da 010 aponta para `development` depois do merge do #5 (rebase sobre `origin/development` se necessário).

## Objetivo

1. A seção `#about` ("Ficha do herói" / "Hero profile") reproduz o currículo o mais fielmente possível: foto real, nome, headline, resumo profissional, experiência (com todos os tópicos do CV), formação, certificação e competências técnicas agrupadas como no CV.
2. Um botão de download do currículo em PDF na ficha do herói (e na placa de contato), com PDF em português em `/pt` e em inglês em `/en`.
3. O restante do site fica coerente com o currículo: headline **AI Builder** em todas as superfícies de identificação (h1, metadados, Open Graph, manifest, JSON-LD, falas do hero) e a tecnologia listada no site deixa de contradizer o CV.

## Descoberta no repositório (base `50b532e`)

| # | Caminho | Estado hoje | Destino na 010 |
|---|---------|-------------|----------------|
| 1 | `src/content/profile.ts` | `role` = `Endpoint Engineer`; `avatar: undefined`; `skills` = 12 itens planos (PowerShell, Docker, Supabase…) que não batem com o CV; `training` = CI/CD, Terraform, Kubernetes (fora do CV); `quests` = 3 itens genéricos; `cv: ""` (botão escondido) | Reescrito conforme contrato §1 e Anexo B |
| 2 | `src/app/[lang]/page.tsx` (`#about`) | `.hero-card` com `<NpcAvatar />` (fallback de `profile.avatar`), 2 stats, bio; `.about-side` com Equipamento, Em treinamento, Diário de missões; botão de CV só em `#contact` e só se `profile.cv` | Nova estrutura (contrato §4) |
| 3 | `src/lib/site.ts` (`personJsonLd`) | `jobTitle` = `profile.role`; `knowsAbout` = `profile.skills` (array plano) | `knowsAbout` achata os grupos; ganha `alternateName`, `worksFor`, `alumniOf` (contrato §3) |
| 4 | `src/dictionaries/{pt,en}.json` | `meta.description` e `hero.lines[0..1]` dizem `Endpoint Engineer`/"testo hardware"; `about.training` existe | Atualizados (contrato §2, Anexo A) |
| 5 | `src/app/manifest.ts` | `description`: `"..., Endpoint Engineer."` | `"..., AI Builder."` |
| 6 | `src/app/[lang]/opengraph-image.tsx` | Lê `profile.role[lang]` e `dict.meta.description` | Muda sozinho via dados; sem edição de código |
| 7 | `src/proxy.ts` | `matcher` exclui caminhos com `.` | `/cv/*.pdf` e `/profile/*.jpg` servidos como estáticos sem redirecionar; sem edição |
| 8 | `.claude/specs/termos-vedados.local` | 3 termos (nome do empregador, nome da área e um terceiro termo interno) | Os 2 primeiros removidos por DP-01 (feito pelo Arquiteto); o terceiro continua vedado e não é escrito nesta spec |
| 9 | CV (`ref/*.docx`) | Rodapé de contato aponta `portifolio.bragademenezes.com` (domínio antigo); nome `André Braga de Menezes` | PDFs gerados com `bragademenezes.com` (DP-04); nome do CV mantido (DP-02) |

## Decisões de produto

Decididas com o usuário neste terminal em 2026-11-15 (todas as recomendações do Arquiteto aceitas).

| ID | Decisão | Alternativa rejeitada | Custo de reverter |
|----|---------|----------------------|-------------------|
| DP-01 | **Empregador liberado.** `Stone` e `InfraCorp` podem aparecer no site (diário de missões, JSON-LD `worksFor`) e nos PDFs, como no CV. Os dois termos correspondentes saem de `termos-vedados.local`; o terceiro termo da lista segue vedado. As fichas dos projetos privados de laboratório (`src/content/projects.ts`) **não** passam a citar o empregador (continuam "fintech"). | Site anônimo e só o PDF com o nome; ou anônimo em tudo | Baixo (texto) |
| DP-02 | **Nome do site continua `Andre Renato Silva Braga de Menezes`** (DP-01 da 009). O CV/PDF mantém `André Braga de Menezes`. O JSON-LD ganha `alternateName: "André Braga de Menezes"` para ligar as duas grafias em busca. | Adotar `André Braga de Menezes` no site inteiro (reverteria a 009) | Baixo |
| DP-03 | **Headline `AI Builder`.** `profile.role` = `AI Builder` (pt e en). Aparece no `<h1>` sr-only, stat "Classe", JSON-LD `jobTitle`, OG da home, `meta.description`, `manifest.description` e fala 1 do hero. `Endpoint Engineer (Infra Automation)` vira o cargo atual no diário de missões. Nova chave `profile.headline` com a linha completa do CV (`AI Builder \| Automação de Infraestrutura \| Agentes de IA e Python`) exibida na ficha. | `Endpoint Engineer · AI Builder`; manter `Endpoint Engineer` | Baixo |
| DP-04 | **Download em PDF, PT e EN.** Dois arquivos estáticos: `public/cv/andre-braga-de-menezes-cv-pt.pdf` (conteúdo do docx, com a URL corrigida para `bragademenezes.com`) e `public/cv/andre-braga-de-menezes-cv-en.pdf` (tradução do Anexo B, colunas EN). `/pt` baixa o PT, `/en` baixa o EN. O `.docx` não é publicado. | Só PT; publicar o docx | Baixo |
| DP-05 | **Dados pessoais públicos.** Na página: cidade (`Rio de Janeiro`), e-mail, LinkedIn, GitHub e WhatsApp — todos já públicos hoje; o número de telefone **não** é impresso como texto na página (segue só como botão WhatsApp e `telephone` no JSON-LD, como hoje). No PDF: o cabeçalho do CV como está (cidade, telefone, e-mail, site, LinkedIn, GitHub). Endereço de rua não existe no CV e não entra. | Imprimir o telefone na ficha | Baixo |
| DP-06 | **Foto real substitui o `<NpcAvatar />` só na ficha do herói.** O NPC pixel-art continua na `<DialogBox />` do hero. A foto mantém o P&B original, recortada em retrato `4:5` (cabeça e tronco), servida por `next/image`. | Foto colorida/filtro pixel-art; trocar também o NPC do diálogo | Baixo |
| DP-07 | **Ficha segue a ordem do CV.** `.hero-card`: foto, nome, headline, stats (Classe, Vila natal, Experiência, Formação), resumo profissional, botão de download. `.about-side`: Diário de missões (experiência, com todos os tópicos do CV + consultoria independente), Pergaminhos (formação e certificação), Equipamento (competências técnicas nos 6 grupos do CV). A lista "Em treinamento" sai (CI/CD, Terraform, Kubernetes não estão no CV). | Manter a ficha resumida; manter "Em treinamento" | Baixo |
| DP-08 | **Projetos do inventário não mudam.** Os 8 projetos de `src/content/projects.ts` já cobrem os projetos do CV (SDD, Índice, OpenWeddy) e as ferramentas do laboratório; "Consultoria independente de TI" entra como missão no diário, não como item do inventário. | Reescrever o inventário a partir do CV | — |

## Dentro do escopo

1. Reescrita de `src/content/profile.ts` (contrato §1, Anexo B).
2. Atualização de `src/dictionaries/pt.json` e `src/dictionaries/en.json` (contrato §2, Anexo A).
3. `personJsonLd` em `src/lib/site.ts` (contrato §3) e `description` de `src/app/manifest.ts`.
4. Nova marcação da seção `#about` e do botão de CV em `src/app/[lang]/page.tsx` (contrato §4).
5. Geração dos 2 PDFs em `public/cv/` (contrato §5).
6. Recorte e otimização da foto em `public/profile/` (contrato §6) e CSS da ficha em `src/app/globals.css`.

## Fora de escopo

- `src/content/projects.ts` e o inventário (DP-08); `src/content/privacy.ts` (nome e controlador inalterados).
- `src/components/**` (DialogBox, NpcAvatar, Inventory, HeroScene etc.), `src/app/projects.css`, `src/app/[lang]/layout.tsx`, `src/app/[lang]/opengraph-image.tsx` (mudam só por dados), `src/proxy.ts`, `next.config.ts`.
- Publicar o `.docx`; versão de CV além de PT/EN; geração dinâmica de PDF (rota/servidor).
- Editar o docx-mestre do usuário em `~/Downloads` (o usuário corrige a URL antiga no arquivo dele quando quiser; registrado em Riscos).

## Contratos nomeados

### 1. `src/content/profile.ts`

```ts
import type { Locale, Localized } from "@/lib/i18n";

export const profile = {
  name: "Andre Renato Silva Braga de Menezes",
  /** Grafia usada no currículo; vai para Person.alternateName. */
  cvName: "André Braga de Menezes",
  initials: "AM",
  /** Foto da ficha do herói (retrato 4:5, P&B). */
  avatar: "/profile/andre-braga-de-menezes.jpg",
  role: { pt: "AI Builder", en: "AI Builder" } satisfies Localized,
  headline: { pt: "…", en: "…" } satisfies Localized,          // Anexo B.1
  home: { pt: "Rio de Janeiro", en: "Rio de Janeiro" } satisfies Localized,   // inalterado (OG da home lê este campo)
  experience: { pt: "5+ anos", en: "5+ years" } satisfies Localized,
  bio: { pt: "…", en: "…" } satisfies Localized,                // Anexo B.2 (resumo profissional)
  /** Experiência profissional, mais recente primeiro (Anexo B.3). */
  quests: [
    {
      when: Localized;        // ex.: { pt: "03/2026 – Atual", en: "Mar 2026 – Present" }
      title: Localized;       // cargo
      org: string;            // "Stone", "OceanPact Serviços Marítimos", "Synapse Brasil", ""
      detail?: Localized;     // linha secundária do CV (área/local ou progressão de cargos)
      points: Localized[];    // todos os tópicos do CV, na ordem do CV
    },
  ],
  /** Formação e certificações (Anexo B.4). */
  education: [{ when: Localized; title: Localized; org: string }],
  certifications: [{ title: string; org: string }],
  /** Competências técnicas em grupos, na ordem do CV (Anexo B.5). */
  skills: [{ group: Localized; items: Localized[] }],
  contacts: { /* inalterado */ },
  /** PDF do currículo por idioma (em /public). */
  cv: {
    pt: "/cv/andre-braga-de-menezes-cv-pt.pdf",
    en: "/cv/andre-braga-de-menezes-cv-en.pdf",
  } satisfies Localized,
};
```

- `training` **removido**. Tipos exatos ficam a critério do executor (podem ser declarados como `type Quest = …`), desde que os nomes de campo acima sejam respeitados.
- Itens de competência cujo texto não muda entre idiomas usam o mesmo valor em `pt` e `en` (ex.: `{ pt: "Python", en: "Python" }`).

### 2. `src/dictionaries/pt.json` e `src/dictionaries/en.json`

Chaves alteradas/adicionadas/removidas (as demais ficam como estão; os dois arquivos mantêm o mesmo conjunto de chaves):

| Chave | `pt.json` | `en.json` |
|-------|-----------|-----------|
| `meta.description` | `Andre Renato Silva Braga de Menezes, AI Builder: automação de infraestrutura, agentes de IA e Python, com produtos construídos com Spec-Driven Development.` | `Andre Renato Silva Braga de Menezes, AI Builder: infrastructure automation, AI agents and Python, with products built through Spec-Driven Development.` |
| `hero.lines` | Anexo A | Anexo A |
| `about.class` | `Classe` (inalterado) | `Class` (inalterado) |
| `about.home` | `Vila natal` (inalterado) | `Home village` (inalterado) |
| `about.experience` (nova) | `Experiência` | `Experience` |
| `about.degree` (nova) | `Formação` | `Education` |
| `about.questLog` | `Diário de missões · Experiência` | `Quest log · Experience` |
| `about.scrolls` (nova) | `Pergaminhos · Formação e certificações` | `Scrolls · Education and certifications` |
| `about.equipment` | `Equipamento · Competências técnicas` | `Equipment · Technical skills` |
| `about.cv` (nova) | `Baixar currículo (PDF)` | `Download résumé (PDF)` |
| `about.training` | **removida** | **removida** |
| `contact.cv` | `Baixar currículo` (inalterado) | `Download résumé` (inalterado) |

### 3. `src/lib/site.ts` (`personJsonLd`)

```ts
export const personJsonLd = (lang: "pt" | "en") => ({
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: profile.name,
  alternateName: profile.cvName,
  jobTitle: profile.role[lang],
  url: `${siteUrl}/${lang}`,
  image: absoluteUrl(profile.avatar),
  address: { "@type": "PostalAddress", addressLocality: "Rio de Janeiro", addressRegion: "RJ", addressCountry: "BR" },
  worksFor: { "@type": "Organization", name: "Stone" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Centro Universitário União das Américas" },
  ...(email), ...(telephone),           // inalterados
  sameAs: [github, linkedin],           // inalterado
  knowsAbout: profile.skills.flatMap((g) => g.items.map((i) => i[lang])),
});
```

(`absoluteUrl` já existe no mesmo arquivo; se for declarado abaixo de `personJsonLd`, mover a declaração ou usar `${siteUrl}${profile.avatar}`.)

### 4. `src/app/[lang]/page.tsx` — seção `#about`

Estrutura (classes novas em negrito; o CSS delas é do Dono B):

```tsx
<div className="about-grid">
  <div className="hero-card dialog-frame">
    <div className="avatar **avatar-photo**">
      <Image src={profile.avatar} alt={profile.name} width={800} height={1000}
             sizes="(min-width: 900px) 240px, 200px" />
    </div>
    <p className="**hero-card-name**">{profile.name}</p>
    <p className="**hero-card-headline**">{profile.headline[lang]}</p>
    <dl className="stats">
      {/* 4 pares dt/dd: about.class→role, about.home→home, about.experience→experience, about.degree→education[0].title */}
    </dl>
    <p>{profile.bio[lang]}</p>
    <a className="btn btn-primary **cv-download**" href={profile.cv[lang]}
       download data-track="cv_download" data-track-channel={lang}>
      ⬇ {dict.about.cv}
    </a>
    <Gem id="about" … className="gem-corner" />
  </div>
  <div className="about-side">
    <h3 className="subhead">{dict.about.questLog}</h3>
    <ol className="quests">
      {/* por quest: span.quest-when, strong (title + " · " + org quando org existe),
          span.**quest-detail** (detail, se houver), ul.**quest-points** > li (points) */}
    </ol>
    <h3 className="subhead">{dict.about.scrolls}</h3>
    <ul className="**scrolls**">{/* education + certifications: título, instituição, quando */}</ul>
    <h3 className="subhead">{dict.about.equipment}</h3>
    <div className="**equipment-groups**">
      {/* por grupo: h4.**equipment-group-title** + ul.equipment > li.dialog-frame (items[lang]) */}
    </div>
  </div>
</div>
```

- `#contact`: a placa existente passa a usar `profile.cv[lang]` (condição `profile.cv` removida, sempre visível), com `download` e `data-track="cv_download"`.
- `<NpcAvatar />` deixa de ser importado em `page.tsx` (continua dentro da `DialogBox`).
- `<h1 className="sr-only">` inalterado no JSX; passa a ler `AI Builder` via `profile.role`.

### 5. `public/cv/*.pdf`

| Arquivo | Conteúdo | Regras |
|---------|----------|--------|
| `public/cv/andre-braga-de-menezes-cv-pt.pdf` | Todo o texto do docx, na ordem e com a formatação de seções do docx | `portifolio.bragademenezes.com` substituído por `bragademenezes.com`; nenhuma outra alteração de texto; A4; ≤ 2 páginas; ≤ 300 KB; texto selecionável (não imagem) |
| `public/cv/andre-braga-de-menezes-cv-en.pdf` | Tradução: colunas EN do Anexo B + cabeçalho e títulos de seção em inglês (`PROFESSIONAL SUMMARY`, `PROFESSIONAL EXPERIENCE`, `AI AND AUTOMATION PROJECTS`, `EDUCATION`, `CERTIFICATIONS`, `TECHNICAL SKILLS`) | Mesmo layout do PT; mesmas regras de URL, A4, páginas, tamanho e texto selecionável |

A seção "Projetos em IA e Automação" do CV entra nos PDFs (Anexo B.6) mesmo não aparecendo como bloco na ficha (os projetos estão no inventário).

### 6. `public/profile/andre-braga-de-menezes.jpg`

- Recorte de `ref/foto-ficha.png` em `4:5`, cabeça e tronco (referência: retângulo `x 283–1083`, `y 300–1300` do original, ajustável para enquadrar o rosto no terço superior), redimensionado para `800×1000`, JPEG em tons de cinza (P&B do original preservado), ≤ 180 KB, sem metadados EXIF/GPS.
- Exibição: `240×300` CSS px no desktop, `200×250` no celular, borda `2px solid var(--frame-border)` e raio igual ao `.avatar` atual; `object-fit: cover`.

## Critérios de aceite (binários)

Valem em `/pt` e `/en` salvo indicação. "Desktop" = `1366×768`; "celular" = `390×844`.

### Ficha do herói

| ID | Critério |
|----|----------|
| CA-01 | Em `#about .hero-card` existe exatamente 1 `img` cujo `currentSrc` deriva de `/profile/andre-braga-de-menezes.jpg` (via `/_next/image`), com `alt` = `"Andre Renato Silva Braga de Menezes"`, e não existe `.npc-avatar` dentro de `.hero-card` |
| CA-01b | A origem `public/profile/andre-braga-de-menezes.jpg` mede exatamente `800×1000` (`sips -g pixelWidth -g pixelHeight`), e o parâmetro `w` da URL em `img.currentSrc` (`/_next/image?url=…&w=N`) satisfaz `N >= img.getBoundingClientRect().width * devicePixelRatio` (bitmap servido não é ampliado). `naturalWidth` **não** é medido: com `srcset` em `w` o navegador o reporta corrigido pela densidade |
| CA-02 | A `img` da foto renderiza com proporção `4:5` (`abs(w/h - 0.8) <= 0.01`) e largura `240 ± 2` px no desktop e `200 ± 2` px no celular |
| CA-03 | `.hero-card-name` contém `Andre Renato Silva Braga de Menezes` e `.hero-card-headline` contém exatamente o texto do Anexo B.1 do idioma |
| CA-04 | `.hero-card .stats` tem 4 pares `dt/dd`, na ordem Classe/Vila natal/Experiência/Formação (`Class/Home village/Experience/Education` em `/en`), com `dd` = `AI Builder`, `Rio de Janeiro`, `5+ anos` (`5+ years`) e o título do curso do Anexo B.4 |
| CA-05 | O parágrafo de bio do `.hero-card` é exatamente o resumo profissional do Anexo B.2 do idioma |
| CA-06 | `.about-side .quests` tem 4 itens na ordem do Anexo B.3 (Stone, OceanPact, Synapse, Consultoria); cada item mostra período, cargo, organização (quando houver) e uma `ul.quest-points` cujo número e texto de `li` batem exatamente com o Anexo B.3 do idioma (7, 3, 2 e 1 tópicos) |
| CA-07 | A lista `.scrolls` mostra o bacharelado (curso, instituição, `Previsão: 12/2026` / `Expected: Dec 2026`) e a certificação `TOTVS Fluig Voyager 2.0 — TOTVS` |
| CA-08 | `.equipment-groups` tem 6 grupos na ordem do Anexo B.5, cada um com título e exatamente os itens do Anexo B.5 do idioma (contagem e texto) |
| CA-09 | Não existe no DOM nenhum texto de `about.training` (`Em treinamento` / `In training`) nem os itens `Terraform`, `Kubernetes`, `Docker`, `Supabase` dentro de `#about`; `grep -n "training" src/content/profile.ts src/dictionaries/*.json` = 0 linhas |
| CA-10 | Os subtítulos `h3.subhead` de `.about-side` aparecem na ordem `about.questLog`, `about.scrolls`, `about.equipment` e a hierarquia de títulos continua `h1 → h2 → h3 → h4` sem saltos |

### Download do currículo

| ID | Critério |
|----|----------|
| CA-11 | Em `/pt`, `.hero-card a.cv-download` tem `href="/cv/andre-braga-de-menezes-cv-pt.pdf"`, atributo `download`, texto `Baixar currículo (PDF)`; em `/en`, `href="/cv/andre-braga-de-menezes-cv-en.pdf"` e texto `Download résumé (PDF)` |
| CA-12 | Em `#contact .signposts` existe placa com `href` igual ao do CA-11 no mesmo idioma e atributo `download` |
| CA-13 | `GET /cv/andre-braga-de-menezes-cv-pt.pdf` e `GET /cv/andre-braga-de-menezes-cv-en.pdf` (em `next start`) respondem `200` com `content-type: application/pdf`, sem redirect para `/pt` ou `/en` |
| CA-14 | Cada PDF: A4 (`595×842` pt ± 2), 1 ou 2 páginas, ≤ 300 KB, texto extraível (ex.: `pdftotext`, PDFKit ou `pypdf`) |
| CA-15 | Texto extraído do PDF PT contém `André Braga de Menezes`, `bragademenezes.com`, `Stone`, `RESUMO PROFISSIONAL` e todos os tópicos do Anexo B.3 PT; **não** contém `portifolio.bragademenezes.com` |
| CA-16 | Texto extraído do PDF EN contém `André Braga de Menezes`, `bragademenezes.com`, `PROFESSIONAL SUMMARY`, `PROFESSIONAL EXPERIENCE`, `TECHNICAL SKILLS` e todos os tópicos do Anexo B.3 EN; **não** contém `portifolio.bragademenezes.com` nem os títulos de seção em português |
| CA-17 | Clique em `a.cv-download` dispara o evento de analytics `cv_download` pelo mecanismo `data-track` existente (verificado no `dataLayer` com consentimento aceito) |

### Coerência do site com o CV

| ID | Critério |
|----|----------|
| CA-18 | `profile.role` = `{ pt: "AI Builder", en: "AI Builder" }`; o `<h1>` sr-only contém `Andre Renato Silva Braga de Menezes — AI Builder`; `document.querySelectorAll('h1').length === 1` (substitui o CA-13 da 009 quanto ao cargo) |
| CA-19 | `meta[name="description"]` e `og:description` são exatamente os textos do contrato §2 do idioma; a imagem `/{lang}/opengraph-image` responde `200` (`1200×630`) e mostra `AI BUILDER · …` sem corte |
| CA-20 | `/manifest.webmanifest` `description` = `Portfólio de Andre Renato Silva Braga de Menezes, AI Builder.` |
| CA-21 | O JSON-LD `Person` da home tem `jobTitle: "AI Builder"`, `alternateName: "André Braga de Menezes"`, `worksFor.name: "Stone"`, `alumniOf.name: "Centro Universitário União das Américas"`, `image` absoluto terminando em `/profile/andre-braga-de-menezes.jpg` e `knowsAbout` igual aos itens do Anexo B.5 no idioma (mesma ordem) |
| CA-22 | `hero.lines` em `pt.json` e `en.json` são exatamente as 3 falas do Anexo A; `grep -rn "Endpoint Engineer" src --include=*.json --include=*.ts --include=*.tsx` retorna apenas linhas de `src/content/profile.ts` (cargo no diário de missões) |
| CA-23 | `pt.json` e `en.json` têm exatamente o mesmo conjunto de chaves (diff de chaves aninhadas = vazio) |

### Regressão e qualidade

| ID | Critério |
|----|----------|
| CA-24 | Em `360`, `390`, `768` e `1366` px de largura, `document.documentElement.scrollWidth === document.documentElement.clientWidth` em `/pt` e `/en`; nenhum texto da ficha é truncado (`text-overflow: ellipsis`/`line-clamp` ausentes em `#about`) |
| CA-25 | Lighthouse Acessibilidade = 100 em `/pt` e `/en` (desktop e celular); contraste ≥ 4,5:1 dos textos novos (`.hero-card-name`, `.hero-card-headline`, `.quest-points`, `.equipment-group-title`, `.scrolls`) nos temas `day`, `night` e `temple` |
| CA-26 | A foto não é carregada com `priority`/`fetchpriority="high"` (fica abaixo da dobra) e a imagem servida em `/_next/image` no desktop tem ≤ 60 KB |
| CA-27 | CAs da 009 que não tratam de cargo continuam valendo: primeira dobra (CA-15 da 009), fichas do inventário iguais (CA-07/CA-08 da 009) e cabeçalho com nome completo (CA-05 da 009) |
| CA-28 | `npm run lint`, `npx tsc --noEmit` e `npm run build` saem com código `0` |
| CA-29 | `grep -rniE -f .claude/specs/termos-vedados.local --exclude='*.local' src public .claude/specs ACOES-PENDENTES.md README.md` = 0 linhas (lista vigente: 1 termo; nenhuma spec cita o literal); `grep -rniE "stone|infracorp" src/content/projects.ts` = 0 linhas; `public/` não contém `.docx`; o diff toca só os caminhos de "Fronteiras de arquivo sugeridas" |

## Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Ficha muito longa com 13 tópicos de experiência + 6 grupos de competências, empurrando `#contact` | Médio | DP-07 aceita o comprimento (pedido: "o mais próximo possível"); Pixel usa tipografia compacta em `.quest-points` (≤ `0.92rem`) e grupos em grid; CA-24 garante sem estouro horizontal |
| Tradução EN imprecisa de termos do CV | Médio | Anexo B traz a tradução fechada pelo Arquiteto; o usuário revisa o Anexo B antes da WP-36 começar (Maestro confirma) |
| PDFs divergirem do docx-mestre do usuário com o tempo | Baixo | O PDF PT é o docx + 1 correção de URL; registrar no `INBOX.md` que o docx-mestre ainda tem `portifolio.bragademenezes.com` |
| Sem `soffice`/`pandoc` na máquina para gerar PDF | Médio | Caminhos disponíveis: ONLYOFFICE (instalado) exportando PDF de docx; ou HTML + Chrome headless `--print-to-pdf`. CA-14 a CA-16 validam o resultado, não o método |
| Liberar `stone` reabrir exposição de detalhes internos do laboratório | Médio | DP-01 limita a liberação ao nome do empregador e ao texto do CV; `projects.ts` fora de escopo e CA-29 verifica que continua sem o nome |
| Foto pesada derrubar LCP/peso da página | Baixo | `next/image` com `sizes`, sem `priority`, JPEG ≤ 180 KB na origem (CA-26) |
| Base empilhada na 009 (PR #5 ainda draft) | Médio | Sentinela rebasa `feat/010` sobre `origin/development` após o merge do #5; interseção de arquivos com a 009 é esperada (`profile.ts`, dicionários, `page.tsx`, `globals.css`) e sem conflito se o #5 não mudar mais |

## Fronteiras de arquivo sugeridas

| Dono sugerido | Possui | Fora de escopo |
|---------------|--------|----------------|
| **A — Engineer (Forja): conteúdo, dicionários, JSX e PDFs** | `src/content/profile.ts`, `src/dictionaries/pt.json`, `src/dictionaries/en.json`, `src/lib/site.ts`, `src/app/manifest.ts`, `src/app/[lang]/page.tsx`, `public/cv/andre-braga-de-menezes-cv-pt.pdf`, `public/cv/andre-braga-de-menezes-cv-en.pdf` | Qualquer `.css`, `public/profile/**`, `src/components/**`, `src/content/projects.ts`, `src/content/privacy.ts` |
| **B — UI (Pixel): foto e CSS da ficha** | `public/profile/andre-braga-de-menezes.jpg`, `src/app/globals.css` (bloco "Sobre": `.hero-card`, `.avatar*`, `.stats`, `.hero-card-name`, `.hero-card-headline`, `.cv-download`, `.quests`, `.quest-detail`, `.quest-points`, `.scrolls`, `.equipment-groups`, `.equipment-group-title`, `.equipment`; remoção de `.equipment-training`) | Qualquer `.ts`, `.tsx`, `.json`, `public/cv/**`, `src/app/projects.css` |
| **Reviewer (Lupa)** | Evidências dos 29 CAs | Não edita código |
| **Git Master (Sentinela)** | Branch `feat/010-curriculo-ficha-heroi` empilhada em `origin/feat/009-revisao-ui`, commits por WP, rebase em `development` após merge do #5, PR quando autorizado | Não edita código |
| **Arquiteto (Prisma)** | `.claude/specs/current/010-curriculo-ficha-heroi/**`, `.claude/specs/termos-vedados.local`, `.claude/specs/INBOX.md` | Código de produto e git |

Interface entre A e B: nomes de classe do contrato §4 e caminho da foto do contrato §6. A pode trabalhar antes da foto existir (o build falha sem o arquivo; B entrega a foto primeiro, é tarefa curta).

## Anexo A — Falas do diálogo (`hero.lines`)

`pt.json`:

1. `Olá, viajante! Sou AI Builder no Rio de Janeiro: construo soluções de ponta a ponta com IA, automatizo infraestrutura com Python e oriento times de agentes de IA guiados por spec.`
2. `Meu ofício é tirar trabalho manual do caminho: automatizo testes de performance e benchmark, homologo atualizações de sistema e de agentes de segurança e digitalizo fluxos de negócio. Cada teste devolve PASS ou FAIL.`
3. `Este portfólio é um jogo: explore o inventário abaixo, siga a fada e procure as gemas escondidas. Se a jornada pedir um aliado, as placas do caminho levam até mim.` (inalterada)

`en.json`:

1. `Hello, traveler! I'm an AI Builder in Rio de Janeiro: I build end-to-end solutions with AI, automate infrastructure with Python and guide spec-driven AI agent teams.`
2. `My craft is getting manual work out of the way: I automate performance and benchmark testing, certify operating system and security agent updates and digitize business workflows. Every test returns PASS or FAIL.`
3. `This portfolio is a game: explore the inventory below, follow the fairy and look for hidden gems. If your journey calls for an ally, the signposts lead to me.` (inalterada)

## Anexo B — Conteúdo do currículo (PT literal do docx · EN tradução)

### B.1 Headline (`profile.headline`)

- PT: `AI Builder | Automação de Infraestrutura | Agentes de IA e Python`
- EN: `AI Builder | Infrastructure Automation | AI Agents and Python`

### B.2 Resumo profissional (`profile.bio`)

- PT: `Profissional de tecnologia com 5+ anos de experiência em infraestrutura, sistemas corporativos e automação de processos, hoje focado em construir soluções de ponta a ponta com Inteligência Artificial. Como Endpoint Engineer na Stone, desenvolvo automações em Python e ferramentas com IA para testes de performance, benchmark e homologação de atualizações de sistema operacional e agentes de segurança. Experiência em orquestração de agentes de IA (Claude Code, Gemini API), desenvolvimento multiagente orientado a especificações (Spec-Driven Development), integrações via APIs, SQL, JavaScript/TypeScript e digitalização de fluxos de negócio (TOTVS Fluig e Protheus).`
- EN: `Technology professional with 5+ years of experience in infrastructure, enterprise systems and process automation, now focused on building end-to-end solutions with Artificial Intelligence. As an Endpoint Engineer at Stone, I build Python automation and AI-powered tools for performance testing, benchmarking and certification of operating system and security agent updates. Experienced in AI agent orchestration (Claude Code, Gemini API), spec-driven multi-agent development (Spec-Driven Development), API integrations, SQL, JavaScript/TypeScript and business workflow digitization (TOTVS Fluig and Protheus).`

### B.3 Experiência (`profile.quests`)

**1. Stone** — `when`: `03/2026 – Atual` / `Mar 2026 – Present` · `title`: `Endpoint Engineer (Infra Automation)` (igual nos dois) · `org`: `Stone` · `detail`: `InfraCorp – Laboratório de Endpoints · Rio de Janeiro, RJ` / `InfraCorp – Endpoint Lab · Rio de Janeiro, Brazil`

| # | PT | EN |
|---|----|----|
| 1 | Desenvolvi automação em Python para testes de performance com Windows Performance Analyzer (WPA), consolidando métricas em CSV e gerando relatórios HTML automaticamente, reduzindo trabalho manual na homologação. | Built Python automation for performance testing with Windows Performance Analyzer (WPA), consolidating metrics into CSV and generating HTML reports automatically, reducing manual work in certification. |
| 2 | Executo testes de performance, benchmark e regressão que liberam o rollout de novas versões do Windows e de agentes de segurança, identificando regressões que afetam a experiência do usuário final. | Run performance, benchmark and regression tests that clear the rollout of new Windows and security agent versions, identifying regressions that affect the end-user experience. |
| 3 | Conduzi análise comparativa de performance entre Windows 10 e Windows 11 (23H2, 24H2 e 25H2) em notebooks corporativos, avaliando a eficiência dos agentes instalados e apresentando os resultados aos times internos. | Led a comparative performance analysis of Windows 10 and Windows 11 (23H2, 24H2 and 25H2) on corporate laptops, assessing the efficiency of installed agents and presenting the results to internal teams. |
| 4 | Desenvolvo ferramentas internas com apoio de IA generativa e agentes de código para otimizar rotinas operacionais do laboratório. | Build internal tools with generative AI and coding agents to streamline the lab's operational routines. |
| 5 | Desenvolvi dashboard de controle do estoque de equipamentos de rede com rastreio de localização física, dando visibilidade do inventário ao time de Ativos. | Built a network equipment inventory dashboard with physical location tracking, giving the Assets team visibility into inventory. |
| 6 | Estruturei bases de conhecimento técnicas no Confluence para onboarding de novos integrantes e investigação de incidentes. | Structured technical knowledge bases in Confluence for onboarding new team members and investigating incidents. |
| 7 | Apoio o troubleshooting de rede em switches Cisco Catalyst (IOS/IOS-XE). | Support network troubleshooting on Cisco Catalyst switches (IOS/IOS-XE). |

**2. OceanPact** — `when`: `12/2022 – 02/2026` / `Dec 2022 – Feb 2026` · `title`: `Analista de Sistemas` / `Systems Analyst` · `org`: `OceanPact Serviços Marítimos` · `detail`: `Analista de Sistemas (01/2025 – 02/2026) · Assistente de Sistemas (03/2024 – 12/2024) · Estagiário de Sistemas (12/2022 – 03/2024)` / `Systems Analyst (Jan 2025 – Feb 2026) · Systems Assistant (Mar 2024 – Dec 2024) · Systems Intern (Dec 2022 – Mar 2024)`

| # | PT | EN |
|---|----|----|
| 1 | Sustentei e evoluí as plataformas TOTVS Fluig, Protheus e Movidesk, garantindo estabilidade operacional e cumprimento de SLAs. | Maintained and evolved the TOTVS Fluig, Protheus and Movidesk platforms, ensuring operational stability and SLA compliance. |
| 2 | Digitalizei e automatizei processos de negócio com formulários e workflows no Fluig (JavaScript), integrações via APIs REST entre Fluig, Narwal, WMS e Protheus e consultas SQL (SQL Server). | Digitized and automated business processes with Fluig forms and workflows (JavaScript), REST API integrations between Fluig, Narwal, WMS and Protheus, and SQL queries (SQL Server). |
| 3 | Realizei levantamento de requisitos, documentação técnica e governança de fluxos, contribuindo para melhorias de arquitetura e eficiência operacional. | Gathered requirements, wrote technical documentation and governed workflows, contributing to architecture improvements and operational efficiency. |

**3. Synapse** — `when`: `02/2021 – 11/2022` / `Feb 2021 – Nov 2022` · `title`: `Técnico de Suporte de TI` / `IT Support Technician` · `org`: `Synapse Brasil` · `detail`: `Terceirizado (BPO) alocado no cliente FSB Comunicação · Rio de Janeiro, RJ` / `Outsourced (BPO) at client FSB Comunicação · Rio de Janeiro, Brazil`

| # | PT | EN |
|---|----|----|
| 1 | Prestei atendimento N1 e N2 (presencial e remoto), diagnosticando e resolvendo incidentes em ambientes corporativos e sistemas internos. | Provided L1 and L2 support (on-site and remote), diagnosing and resolving incidents in corporate environments and internal systems. |
| 2 | Administrei ambientes Google Workspace e Microsoft 365 e gerenciei usuários, permissões e políticas no Active Directory. | Administered Google Workspace and Microsoft 365 environments and managed users, permissions and policies in Active Directory. |

**4. Consultoria** — `when`: `Projeto paralelo` / `Side quest` · `title`: `Consultoria independente de TI` / `Independent IT consulting` · `org`: `""`

| # | PT | EN |
|---|----|----|
| 1 | Serviços de infraestrutura para pequenas empresas: domínios, e-mail corporativo, servidores de arquivos e sistemas de ponto eletrônico; manutenção do site institucional de uma organização sem fins lucrativos. | Infrastructure services for small businesses: domains, corporate email, file servers and time-tracking systems; maintenance of a nonprofit organization's institutional website. |

### B.4 Formação e certificações

- `education[0]`: `title` `Bacharelado em Engenharia da Computação` / `Bachelor's in Computer Engineering` · `org` `Centro Universitário União das Américas` · `when` `Previsão: 12/2026` / `Expected: Dec 2026`. Stat "Formação" (`dd`): `Eng. da Computação` / `Computer Engineering`.
- `certifications[0]`: `TOTVS Fluig Voyager 2.0` · `TOTVS`.

### B.5 Competências técnicas (`profile.skills`)

| # | Grupo PT / EN | Itens PT | Itens EN |
|---|---------------|----------|----------|
| 1 | `IA e Agentes` / `AI and Agents` | IA Generativa, LLMs, Engenharia de Prompt, Agentes de IA, Sistemas Multiagente, Claude Code, Gemini API, Google AI Studio, Spec-Driven Development | Generative AI, LLMs, Prompt Engineering, AI Agents, Multi-Agent Systems, Claude Code, Gemini API, Google AI Studio, Spec-Driven Development |
| 2 | `Automação` / `Automation` | Python, Automação de Testes, Testes de Performance, Benchmark, Windows Performance Analyzer, Power Automate (RPA), Workflows TOTVS Fluig | Python, Test Automation, Performance Testing, Benchmarking, Windows Performance Analyzer, Power Automate (RPA), TOTVS Fluig Workflows |
| 3 | `Desenvolvimento e Dados` / `Development and Data` | JavaScript, TypeScript, Node.js, Next.js, Kotlin, SQL, SQL Server, APIs REST, Integração de Sistemas | JavaScript, TypeScript, Node.js, Next.js, Kotlin, SQL, SQL Server, REST APIs, Systems Integration |
| 4 | `Cloud e DevOps` / `Cloud and DevOps` | Google Cloud Run, Git, GitHub, GitHub Actions, CI/CD, Vercel | (iguais ao PT) |
| 5 | `Infraestrutura e Plataformas` / `Infrastructure and Platforms` | Windows 10/11, Endpoint Engineering, Active Directory, Microsoft 365, Google Workspace, Cisco Catalyst (IOS/IOS-XE), ServiceNow, Confluence, TOTVS Fluig, TOTVS Protheus, Movidesk | (iguais ao PT) |
| 6 | `Competências complementares` / `Complementary skills` | Levantamento de requisitos, Documentação técnica, Governança de processos, Resolução de problemas, Melhoria contínua | Requirements gathering, Technical documentation, Process governance, Problem solving, Continuous improvement |

Contagens: 9, 7, 9, 6, 11, 5 itens.

### B.6 Projetos em IA e Automação (só nos PDFs)

| PT (literal do docx) | EN |
|----------------------|----|
| **Spec-Driven Development – Skill multiagente para Claude (open source):** Workflow de desenvolvimento com três agentes especializados (Spec Architect, Software Engineer e Review Agent), em que especificações em Markdown são a fonte da verdade (spec, plano e tarefas). Estruturado para distribuição open source (licença MIT), com CI via GitHub Actions, Conventional Commits e fluxo de branches protegidas. | **Spec-Driven Development – Multi-agent skill for Claude (open source):** Development workflow with three specialized agents (Spec Architect, Software Engineer and Review Agent), where Markdown specifications are the source of truth (spec, plan and tasks). Structured for open-source distribution (MIT license), with CI via GitHub Actions, Conventional Commits and a protected-branch flow. |
| **Índice – Sistema de Gestão Pessoal (Web e Android):** Aplicação inspirada no Bullet Journal que unifica finanças, tarefas, hábitos e metas, com arquitetura API-first (Node.js/TypeScript no Google Cloud Run, Next.js e Kotlin/Jetpack Compose), construída com orquestração de agentes de IA (Claude Code), Google AI Studio e Gemini API. | **Índice – Personal Management System (Web and Android):** Bullet Journal–inspired app that unifies finances, tasks, habits and goals, with an API-first architecture (Node.js/TypeScript on Google Cloud Run, Next.js and Kotlin/Jetpack Compose), built with AI agent orchestration (Claude Code), Google AI Studio and the Gemini API. |
| **OpenWeddy – Plataforma open source de gestão de eventos:** Sistema web publicado no GitHub com convites digitais, cadastro de famílias, controle de RSVP e lista de presentes virtual. | **OpenWeddy – Open-source event management platform:** Web system published on GitHub with digital invitations, family registration, RSVP tracking and a virtual gift registry. |
| **Consultoria independente de TI:** (texto do B.3 item 4) | **Independent IT consulting:** (B.3 item 4 text) |

Cabeçalho do PDF EN: `André Braga de Menezes` / `AI Builder | Infrastructure Automation | AI Agents and Python` / `Rio de Janeiro, Brazil | +55 (21) 97276-4096 | andre@bragademenezes.com | bragademenezes.com` / `LinkedIn: linkedin.com/in/andrerenatomenezes | GitHub: github.com/AndreRenatoMenezes`.
