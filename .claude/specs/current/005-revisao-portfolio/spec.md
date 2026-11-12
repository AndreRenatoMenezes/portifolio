# 005 — Revisão do portfólio: novos projetos e apresentação para recrutadores

- **Domínio:** ui
- **Status:** especificada (aguardando particionamento do Maestro)
- **Autor:** Arquiteto (Prisma)
- **Data:** 2026-11-12
- **Origem:** pedido do usuário (nota `decisoes`, 2026-11-12); INBOX ("prints reais", "MacBenchmark")
- **Descoberta:** feita com o usuário em 2026-11-12. As respostas estão em [Decisões de produto](#decisões-de-produto).

## Problema

O público do site são recrutadores, e a página hoje falha com eles em dois pontos.

1. **A leitura profissional depende de interação.** Na home, a stack, o resultado e os links de um projeto só aparecem depois de passar o mouse ou clicar num slot do inventário. Na primeira dobra, a proposta de valor está dentro de uma caixa de diálogo com botão "Continuar". Os rótulos são de jogo ("Inventário", "Ficha do herói", "Placas do caminho", "Equipamento usado"), então quem lê rápido não acha "Projetos", "Sobre" e "Contato".
2. **A referência a games não é explícita.** Quem não reconhece o gênero vê só uma página com rótulos estranhos; nada diz "isto é um modo de jogo, e há uma versão direta".

Além disso, o contrato `src/content/projects.ts` tem 4 projetos e o GitHub do usuário tem mais 4 relevantes. O OpenWeddy tem um exemplo real em produção (`https://www.emanuele-andre.site/`) que não aparece no portfólio, e todas as capas são ilustrações.

## Objetivo

Um recrutador que abre a home entende em uma tela quem é o André, o que ele faz e onde clicar, e vê os 8 projetos com papel, stack, resultado e links sem nenhuma interação. A experiência de aventura continua existindo, a um clique, apresentada como o que é: um modo de jogo.

## Decisões de produto

| # | Decisão | Autor | Alternativas rejeitadas |
|---|---|---|---|
| DP-1 | Entram 4 projetos novos: MacBenchmark, bancada Linux de endpoints (repo `ELV`), gerador de relatórios de homologação (repo `relatorio_lab`) e Índice. Total: 8. | Usuário | Só o Índice |
| DP-2 | Os 3 projetos do laboratório aparecem **sem o nome do empregador** (nem de marcas internas) e como privados, até o usuário registrar autorização. | Usuário | Citar a empresa já; segurar a publicação |
| DP-3 | OpenWeddy ganha link "ao vivo" para `https://www.emanuele-andre.site/` **e** prints reais na galeria. | Usuário | Só prints; só link |
| DP-4 | Dois modos de apresentação com alternador: **direto** e **aventura**. | Usuário | Um modo só com tema como pele (recomendação do Arquiteto); manter o inventário e só reforçar |
| DP-5 | O modo **direto** é o padrão na primeira visita. A escolha do visitante fica salva. | Usuário | Aventura por padrão; alternar só a seção de projetos |
| DP-6 | No modo direto ficam a identidade visual (paisagem do hero, paleta, fontes, molduras) e saem as mecânicas de jogo (diálogo, HUD, fada, gemas, som, dica da melodia). O alternador, com rótulo de jogo, é o que torna a referência explícita. | Arquiteto | Remover também a paisagem (perde identidade); manter fada/gemas (volta o ruído) |
| DP-7 | Os dois modos saem no mesmo HTML e o CSS mostra um deles conforme `html[data-mode]`. Sem JavaScript, o visitante vê o modo direto. | Arquiteto | Rotas separadas (`/pt/aventura`); renderizar o modo só no cliente (pisca na hidratação) |
| DP-8 | Projetos novos estreiam com capa ilustrada em SVG, no padrão atual. Print real de projeto do laboratório só entra com aprovação do usuário, imagem a imagem. | Arquiteto | Bloquear a entrega até ter prints aprovados |

O trade-off da DP-4, registrado para o Maestro: dois modos dobram a superfície de teste (cada critério de home vale nos dois). A DP-7 limita o custo: o conteúdo vem de uma fonte só (`projects.ts` + dicionários) e só a casca muda.

## Dentro do escopo

- Contrato `src/content/projects.ts`: dois campos novos (`role`, `outcome`), 4 projetos novos, link ao vivo e prints reais do OpenWeddy.
- Modo de apresentação (`direct` | `adventure`): estado, aplicação antes da pintura, alternador, persistência.
- Home nos dois modos: primeira dobra, seção de projetos, rótulos das seções.
- Página `projects/[slug]`: papel, resultado, links e rótulos nos dois modos.
- Dicionários `pt.json` e `en.json` com as chaves novas.
- Acessibilidade dos dois modos e do alternador.
- Evento de analytics `mode_switch` (só com consentimento, pelo mecanismo existente).

## Fora de escopo

- Currículo em PDF e foto no "Sobre" (`profile.cv`, `profile.avatar`).
- Filtro ou busca de projetos, paginação do inventário.
- Mudanças no formulário de contato, na política de cookies e no consentimento.
- Novo tema, nova arte do hero, novos ícones de item (usar os 12 existentes).
- Link compartilhável de modo (`?mode=`).
- Publicar o nome do empregador nos projetos do laboratório (depende de autorização; ver T12).
- Alterações no site do casamento.

## Contratos de dado

### `src/content/projects.ts` — tipo `Project`

Campos novos, ambos obrigatórios:

```ts
/** Papel do autor no projeto, em uma linha. Ex.: "Autor único: arquitetura, código e documentação". */
role: Localized;
/** Resultado concreto em uma frase: o que mudou para quem usa. Sem adjetivo vago. */
outcome: Localized;
```

Campos existentes, com regra nova:

- `links.demo`: URL pública que abre sem login. No OpenWeddy, `https://www.emanuele-andre.site/`.
- `private: true` em todo projeto de repositório privado; nesse caso `links.github` fica ausente.
- `summary`, `description`, `kind`, `role`, `outcome`, `stats[].label`, `images[].alt`, `tags`: nos projetos `macbenchmark`, `linux-endpoint-bench` e `homolog-dashboard`, sem o nome do empregador nem de marca interna (CA-05).

### Termos vedados

Esta spec não escreve o nome do empregador nem das marcas internas: o repositório é público e `.claude/specs/` é versionado. Onde for preciso referir, usar `<EMPREGADOR>` e `<MARCA-INTERNA>`.

- **O que é vedado** em qualquer arquivo versionado (código, conteúdo, dicionários, `alt`, nome de arquivo, specs, `tasks.md`, mensagens de commit): a razão social ou o nome fantasia do `<EMPREGADOR>`; o nome de áreas, laboratórios, produtos, modelos de documento e ferramentas internas (`<MARCA-INTERNA>`); hostnames, números de série, nomes de colegas e caminhos de rede internos.
- **Forma permitida:** "laboratório de endpoints de uma fintech".
- **Lista de termos:** fica em `.claude/specs/termos-vedados.local`, um termo por linha (expressão regular estendida, sem diferenciar maiúsculas), **fora do git**. O caminho é fixo na raiz de `.claude/specs/` para sobreviver ao arquivamento desta spec. O usuário pode acrescentar termos; a lista inicial foi criada pelo Arquiteto em 2026-11-12.
- **`.gitignore`:** acrescentar a linha `/.claude/specs/**/*.local` (ajuste delegado pelo Maestro a um executor; não é arquivo de nenhum dos donos A, B ou C).
- **Fatos dos repositórios privados:** o Anexo A traz só paráfrase dos READMEs, sem trecho copiado, sem nome de arquivo ou de ativo interno.

A ordem do array é a ordem de exibição nos dois modos:

| # | `slug` | Título | Origem | `private` | `item` |
|---|---|---|---|---|---|
| 1 | `hardware-test-hub` | Hardware Test Hub | existente | não | `shield` |
| 2 | `macbenchmark` | MacBenchmark | repo `macbenchmark` | sim | `sword` |
| 3 | `openweddy` | OpenWeddy | existente | não | `letter` |
| 4 | `sdd-maestri` | SDD Maestri | existente | não | `scroll` |
| 5 | `indice` | Índice | repo `indice` | sim | `key` |
| 6 | `linux-endpoint-bench` | Linux Endpoint Bench | repo `ELV` | sim | `lantern` |
| 7 | `homolog-dashboard` | Homolog Dashboard | repo `relatorio_lab` | sim | `map` |
| 8 | `orcazen` | OrçaZen | existente | sim | `pouch` |

Os títulos de 6 e 7 são nomes de vitrine propostos pelo Arquiteto, porque os nomes internos carregam a marca do laboratório. O usuário pode trocar antes da implementação.

O conteúdo de cada projeto novo (fatos conferidos nos READMEs em 2026-11-12) está no [Anexo A](#anexo-a--conteúdo-dos-projetos). O `role` e o `outcome` dos 4 projetos existentes também estão lá.

### `src/dictionaries/pt.json` e `en.json`

Chaves novas (os valores em português estão no [Anexo B](#anexo-b--textos-novos-pt)):

- `hero.pitch` — frase de valor da primeira dobra.
- `mode.toAdventure`, `mode.toDirect`, `mode.hint` — rótulos do alternador.
- `direct.nav.projects`, `direct.nav.about`, `direct.projects.title`, `direct.projects.subtitle`, `direct.about.title`, `direct.about.subtitle`, `direct.about.role`, `direct.about.location`, `direct.about.skills`, `direct.about.learning`, `direct.about.timeline`, `direct.contact.title`, `direct.contact.text`, `direct.project.back`, `direct.project.stack` — rótulos lisos do modo direto.
- `project.role`, `project.outcome`, `project.live`, `project.code` — rótulos comuns aos dois modos.

As chaves existentes continuam valendo para o modo aventura. `modal.demo` e `modal.github` passam a ter os mesmos textos de `project.live` e `project.code`.

### Estado do visitante

- Chave `portfolio-mode` no `localStorage`, valores `"direct"` ou `"adventure"`.
- Atributo `data-mode` no `<html>`, com os mesmos valores. Valor ausente ou inválido no `localStorage` resulta em `direct`.
- `.claude/specs/schema.md` passa a listar "modo" entre os estados do visitante.

### Evento de analytics

`mode_switch` com parâmetro `to` = `direct` | `adventure`, enviado por `track()` (respeita o consentimento da spec 003).

## Critérios de aceite

Os critérios de página valem em `/pt` e `/en`. "Desktop" é viewport 1366×768 e "celular" é 390×844. "Visível na primeira dobra" significa: com a página no topo (`scrollY = 0`), o `getBoundingClientRect().bottom` do elemento é menor ou igual a `innerHeight`, e o elemento não tem `display: none` nem `visibility: hidden`.

### Dados

- **CA-01** `projects` tem exatamente 8 itens, com os slugs e a ordem da tabela acima.
- **CA-02** Todo projeto tem `role` e `outcome` com `pt` e `en` não vazios, e o texto `en` é diferente do `pt` em `role`, `outcome`, `summary` e `kind`.
- **CA-03** `openweddy.links.demo` é `https://www.emanuele-andre.site/` e essa URL responde 200. Este critério só vale se a T10 estiver marcada como feita em `ACOES-PENDENTES.md`; se não estiver, `links.demo` fica ausente e o critério é "ausente".
- **CA-04** `openweddy.images` tem pelo menos 3 imagens raster (webp ou png) do site real, cada uma com até 300 KB, `width`/`height` iguais ao tamanho real do arquivo e `alt` em `pt` e `en`. A primeira é a capa.
- **CA-05** `grep -rniE -f .claude/specs/termos-vedados.local --exclude='*.local' src public .claude/specs ACOES-PENDENTES.md README.md` não retorna nenhuma linha. O arquivo de termos (ver [Termos vedados](#termos-vedados)) precisa existir e ter pelo menos uma linha; se faltar, o critério falha.
- **CA-05b** `git check-ignore .claude/specs/termos-vedados.local` retorna o caminho (o arquivo é ignorado) e `git ls-files '*.local'` não retorna nada.
- **CA-06** Os projetos `macbenchmark`, `indice`, `linux-endpoint-bench` e `homolog-dashboard` têm `private: true`, não têm `links.github` e têm pelo menos 1 imagem cujo arquivo existe em `public/projects/<slug>/`.
- **CA-07** Nenhuma imagem raster em `public/projects/macbenchmark/`, `linux-endpoint-bench/` ou `homolog-dashboard/` existe sem estar listada e marcada como aprovada na T11 de `ACOES-PENDENTES.md`.
- **CA-08** As 16 rotas `/{pt,en}/projects/<slug>` respondem 200 e aparecem em `/sitemap.xml`.

### Modo de apresentação

- **CA-09** Sem valor salvo, `document.documentElement.dataset.mode` é `direct` já na primeira pintura (sem troca visível de modo depois da hidratação).
- **CA-10** Com JavaScript desligado, a home mostra a lista de projetos do modo direto e não mostra a grade do inventário.
- **CA-11** O alternador é um `<button>` com texto visível (não só ícone), `aria-pressed` refletindo o modo aventura, alcançável por Tab e acionável por Enter e Espaço. Existe um no hero e um no cabeçalho.
- **CA-12** O alternador do hero está visível na primeira dobra no desktop e no celular, nos dois modos.
- **CA-13** Acionar o alternador troca `data-mode` sem recarregar a página e grava `portfolio-mode`; depois de recarregar, o modo escolhido se mantém.
- **CA-14** Trocar de idioma mantém o modo atual.
- **CA-15** Com consentimento aceito, acionar o alternador envia `mode_switch` com `to` igual ao novo modo. Sem consentimento, nada é enviado.

### Primeira dobra — modo direto

- **CA-16** No desktop e no celular, estão visíveis na primeira dobra, sem clique: o `<h1>` com nome e cargo; a frase `hero.pitch`; um link para o GitHub; um link para o LinkedIn; o botão de contato; o alternador.
- **CA-17** A caixa de diálogo (`DialogBox`), o HUD (corações e gemas), a fada, as gemas colecionáveis, o botão de som, o botão da fada e a dica da melodia no rodapé têm `display: none` no modo direto.
- **CA-18** A navegação do cabeçalho mostra os textos de `direct.nav.*` ("Projetos", "Sobre") e os `<h2>` das seções mostram os de `direct.*.title`.

### Projetos — modo direto

- **CA-19** A seção `#inventory` mostra uma lista (`<ul>`) com 8 cartões, cada um num `<article>`, todos no fluxo da página (sem carrossel, aba ou "ver mais").
- **CA-20** Cada cartão mostra, sem hover, foco ou clique: título, tipo (`kind`), papel (`role`) com o rótulo `project.role`, resumo, resultado (`outcome`) com o rótulo `project.outcome`, até 3 atributos, todas as tags e o ano.
- **CA-21** Cada cartão tem, como links reais (`<a href>`): "ao vivo" quando há `links.demo`; "código" quando há `links.github`; "pedir demonstração" apontando para `#contact` quando `private`; e "ver detalhes" para `/<lang>/projects/<slug>`. Links externos abrem em nova aba com `rel="noreferrer"`.
- **CA-22** A grade do inventário e o painel do item têm `display: none` no modo direto, e Tab não para em nenhum slot.
- **CA-23** No celular, a página não tem rolagem horizontal (`document.documentElement.scrollWidth <= innerWidth`).

### Modo aventura

- **CA-24** No modo aventura aparecem a caixa de diálogo, o HUD, a fada, as gemas, o inventário e o painel do item; a lista de cartões tem `display: none`.
- **CA-25** O `<h1>` e a frase `hero.pitch` continuam visíveis na primeira dobra do modo aventura, no desktop e no celular.
- **CA-26** O painel do item selecionado mostra papel e resultado, e tem os mesmos links do CA-21 sem precisar abrir o modal.
- **CA-27** O `<h2>` da seção de projetos mostra o termo de jogo seguido do termo liso (ex.: "Inventário · Projetos"); o mesmo vale para "Sobre" e "Contato".
- **CA-28** A navegação por setas, Home e End no inventário e a abertura do modal continuam funcionando como hoje.

### Página do projeto

- **CA-29** `/<lang>/projects/<slug>` mostra, acima da galeria e sem clique: título, tipo, resumo, papel, resultado, ano, stack e os links do CA-21 (exceto "ver detalhes").
- **CA-30** No modo direto, o link de volta usa `direct.project.back` e o rótulo da stack usa `direct.project.stack`; no modo aventura, usam `project.back` e `project.stack`.
- **CA-31** Na página `openweddy`, o botão "ao vivo" aponta para a URL do CA-03 e a galeria abre os prints reais no lightbox.

### i18n

- **CA-32** `pt.json` e `en.json` têm exatamente o mesmo conjunto de chaves (o `tsc` falha se não tiverem) e nenhuma das chaves novas tem valor vazio.
- **CA-33** Em `/en`, nenhum dos textos novos de `pt.json` (Anexo B) aparece na página.

### Acessibilidade e qualidade

- **CA-34** Lighthouse, categoria Acessibilidade, dá 100 na home nos dois modos e em `/pt/projects/openweddy`, no celular e no desktop.
- **CA-35** Em cada modo, a página tem um único `<h1>` e nenhum salto de nível de título entre os títulos visíveis.
- **CA-36** Conteúdo do modo inativo não recebe foco por Tab e não é lido por leitor de tela (está em `display: none`).
- **CA-37** Texto e controles novos têm contraste de pelo menos 4.5:1 nos temas dia e noite, e foco visível.
- **CA-38** Com `prefers-reduced-motion: reduce`, trocar de modo não dispara animação.
- **CA-39** `npm run build`, `npm run lint` e `npx tsc --noEmit` passam sem erro, e o console do navegador não mostra erro na home nem em uma página de projeto, nos dois modos.
- **CA-40** Lighthouse, categoria Desempenho, na home do modo direto no celular, não cai mais de 5 pontos em relação à medição feita antes da mudança (registrar as duas no `tasks.md`).

## Ações do usuário

Entram em `ACOES-PENDENTES.md` (quem edita esse arquivo é o dono do conteúdo; ver fronteiras).

- **T10 — Conferir o site do casamento antes de linkar.** Abrir `https://www.emanuele-andre.site/` numa janela anônima, sem link de convidado, e confirmar que um estranho não vê endereço residencial, chave Pix, telefones nem nomes de convidados, e não consegue enviar RSVP em nome de alguém. Marcar feito ou pedir "sem link".
- **T11 — Aprovar prints.** Tabela com cada imagem raster proposta para os projetos do laboratório; o usuário marca aprovada ou recusada. Critério do usuário: sem logo, nome da empresa, hostname, número de série ou dado interno. Vazio é válido (ficam as capas ilustradas).
- **T12 — Autorização do empregador (opcional).** Se obtida, registrar data e quem autorizou; só então uma spec futura pode citar o nome.
- **T13 — Confirmar papel.** Conferir os textos de `role` do Anexo A (premissa P1).

## Premissas

- **P1** O usuário é autor único dos 8 projetos. Se algum foi feito em equipe, o `role` daquele projeto muda antes da implementação.
- **P2** Os fatos dos projetos privados vêm dos READMEs lidos em 2026-11-12. O número de testes, suítes e artefatos pode ter mudado; o dono do conteúdo confere no repositório antes de fixar os `stats`.
- **P3** O site do casamento continua no ar depois do evento. Se sair do ar, `links.demo` é removido (CA-03 passa a "ausente").

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Vazar nome ou dado do empregador em texto, print, `alt`, nome de arquivo, spec ou commit | Alto (confidencialidade) | CA-05 e CA-05b (grep com lista local não versionada, cobrindo também `.claude/specs`), CA-07 (aprovação por imagem), DP-2, DP-8 |
| Site do casamento expor dados de família e convidados a recrutadores | Alto (privacidade de terceiros) | T10 condiciona o link (CA-03) |
| Dois modos divergirem em conteúdo com o tempo | Médio | DP-7: uma fonte de dados, só a casca muda; CA-20 e CA-26 exigem os mesmos campos |
| Modo piscar na hidratação | Médio | CA-09: script inline antes da pintura, como o tema |
| HTML duplicado (cartões + inventário) pesar no carregamento | Baixo | CA-40; imagens do modo oculto com `loading="lazy"` |
| Títulos duplicados confundirem leitor de tela ou SEO | Baixo | CA-35, CA-36: o modo inativo fica em `display: none` |
| Recrutador não notar que existe o modo aventura | Médio (é o medo original) | CA-12: alternador com rótulo de jogo na primeira dobra |
| `globals.css` (1.582 linhas) virar ponto de conflito entre executores | Médio | Fronteiras: CSS novo em arquivos separados por dono |

## Fronteiras de arquivo sugeridas

Três donos. As chaves de dicionário e os campos do contrato estão nomeados nesta spec, então B e C podem começar em paralelo com A.

### Dono A — Conteúdo e contrato

- **Possui:** `src/content/projects.ts`, `public/projects/**`, `src/dictionaries/pt.json`, `src/dictionaries/en.json`, `ACOES-PENDENTES.md`, `.claude/specs/schema.md`, `.claude/specs/INBOX.md`.
- **Fora de escopo:** qualquer `.tsx`, qualquer `.css`, `src/lib/**`.

### Dono B — Modo e casca

- **Possui:** `src/lib/store.ts`, `src/app/[lang]/layout.tsx`, `src/components/Controls.tsx`, `src/components/Hud.tsx`, `src/components/Fairy.tsx`, `src/components/Gem.tsx`, `src/components/Effects.tsx`, `src/components/DialogBox.tsx`, `src/app/globals.css`, e os novos `src/components/ModeToggle.tsx`, `src/components/ModeText.tsx`, `src/app/mode.css`.
- **Fora de escopo:** `src/content/**`, dicionários, `src/app/[lang]/page.tsx`, componentes de projeto.

### Dono C — Home e projetos

- **Possui:** `src/app/[lang]/page.tsx`, `src/components/Inventory.tsx`, `src/components/Gallery.tsx`, `src/app/[lang]/projects/[slug]/page.tsx`, `src/app/[lang]/projects/[slug]/opengraph-image.tsx`, e os novos `src/components/ProjectCards.tsx`, `src/components/ProjectLinks.tsx`, `src/app/projects.css`.
- **Fora de escopo:** `src/lib/store.ts`, `layout.tsx`, `globals.css`, `src/content/**`, dicionários.

**Dependências:** C consome `ModeText` e `ModeToggle` de B e os campos `role`/`outcome` de A. Para não travar, B entrega primeiro a assinatura de `ModeText`/`ModeToggle` (ver `plan.md`, D3 e D4), e A entrega primeiro o tipo `Project` e as chaves de dicionário, antes do conteúdo completo. O import de `mode.css` e `projects.css` fica em `layout.tsx` (dono B).

Git é do Sentinela; ninguém acima faz stage, commit ou push.

---

## Anexo A — Conteúdo dos projetos

Textos em português. A versão em inglês é tradução do dono A. Onde diz "fintech", é a forma neutra exigida pela DP-2.

### Projetos novos

**`macbenchmark` — MacBenchmark** · `item: sword` · 2026 · privado
- `kind`: Ferramenta de laboratório · macOS
- `role`: Autor único: arquitetura, app em Swift, backend e metodologia de medição
- `summary`: Benchmark nativo para homologar MacBooks Apple Silicon: mede CPU, RAM, SSD, rede, bateria e boot com cargas sintéticas e reais (Numbers, Pages, Safari) e gera um score reproduzível contra um baseline.
- `outcome`: O laboratório de endpoints de uma fintech compara máquinas e imagens de sistema com dados brutos auditáveis, em vez de um número de caixa-preta.
- `description` (pontos a cobrir): por que não PCMark/Geekbench (transparência); reprodutibilidade (seeds determinísticos, warmup descartado, execução serial com resfriamento); score em camadas por média harmônica ponderada, referência = 1000; baseline exportável em JSON; pré-voo que verifica a máquina; telemetria ao vivo; sync opcional para backend Node/TypeScript + PostgreSQL com fila offline; código privado.
- `tags`: Swift 6, SwiftUI, IOReport, Node.js, PostgreSQL, GitHub Actions
- `stats`: `4` suítes de teste · `1000` = score do baseline · `2` pipelines de CI

**`indice` — Índice** · `item: key` · 2026 · privado
- `kind`: Produto pessoal · web + Android
- `role`: Autor único: API, web, app Android e infraestrutura
- `summary`: Painel pessoal inspirado no Bullet Journal: tarefas, hábitos, finanças, metas e arquivo de mídia numa API própria, com cliente web e app Android.
- `outcome`: Uma única API serve o site e o app, com as regras de negócio cobertas por testes e deploy em contêiner.
- `description` (pontos a cobrir): monorepo com API Fastify + Prisma, web Next.js e Android em Kotlin + Jetpack Compose com widget; contratos zod compartilhados entre API e web; regras financeiras portadas do OrçaZen (ciclo de fatura, parcelas); tarefas recorrentes e migração entre dias; pronto para Cloud Run + Cloud SQL; código privado.
- `tags`: TypeScript, Fastify, Prisma, Next.js, Kotlin, Jetpack Compose, PostgreSQL, Cloud Run
- `stats`: `3` apps (API, web, Android) · `5` áreas num painel · `API-first` arquitetura

**`linux-endpoint-bench` — Linux Endpoint Bench** · `item: lantern` · 2026 · privado
- `kind`: Ferramenta de laboratório · Linux
- `role`: Autor único: orquestrador, testes e documentação de operação
- `summary`: Orquestrador de benchmark para estações Ubuntu que mede o impacto de agentes de segurança (antivírus, EDR, DLP) em CPU, disco, memória, boot e aplicativos.
- `outcome`: A decisão de homologar um agente de segurança passa a se apoiar em medições repetíveis, com reinícios reais e ambiente controlado.
- `description` (pontos a cobrir): 19 testes em 6 domínios; bateria de boot com reinícios reais; preflight que verifica dependências e energia; suspensão de atualizações automáticas durante a medição; cargas reais de escritório com LibreOffice e navegador; comando `doctor` para diagnosticar o ambiente; construído com Spec-Driven Development; código privado.
- `tags`: Python, Ubuntu, systemd, LibreOffice UNO, Playwright, hyperfine
- `stats`: `19` testes · `6` domínios medidos · `30+` specs entregues

**`homolog-dashboard` — Homolog Dashboard** · `item: map` · 2026 · privado
- `kind`: Ferramenta de laboratório · relatórios
- `role`: Autor único: coleta, modelo de dados, geração dos relatórios e integração com IA
- `summary`: Gerador de relatórios de homologação: aponta para a pasta de resultados, descobre a estrutura sozinho e produz dashboard interativo, apresentação em slides e relatório em markdown.
- `outcome`: O relatório de uma homologação sai em uma passada, com parecer opcional de IA embutido, em vez de ser montado à mão.
- `description` (pontos a cobrir): uma cópia serve todas as homologações; interface gráfica (Streamlit) e linha de comando; prévia da coleta para pegar pasta errada antes de gerar; parecer por Gemini que não derruba a geração se a API falhar; roda em Windows e macOS; código privado.
- `tags`: Python, Streamlit, Gemini, HTML, CLI
- `stats`: `3` artefatos por execução · `2` sistemas (Windows, macOS) · `IA` no parecer

### Projetos existentes — campos novos

| `slug` | `role` | `outcome` |
|---|---|---|
| `hardware-test-hub` | Autor único: framework, módulos de teste e relatórios | Homologar um notebook virou uma bateria retomável, com PASS ou FAIL por teste e evidência guardada por cenário. |
| `sdd-maestri` | Autor: desenho do método, papéis e documentação | Times de agentes de IA trabalham em paralelo sem dois editarem o mesmo arquivo, com um commit por pacote aprovado. |
| `openweddy` | Autor único: produto, front-end, banco e painel dos noivos | Usado no meu próprio casamento: convidados confirmaram presença e presentearam por Pix, sem taxa de plataforma. |
| `orcazen` | Autor único: produto, front-end, banco e integração com IA | Substituiu a planilha de finanças da casa, com extratos importados por IA e conferidos antes de gravar. |

O `outcome` do OpenWeddy afirma uso real; o usuário confirma na T13 junto com os papéis.

### OpenWeddy — mudanças

- `links.demo`: `https://www.emanuele-andre.site/` (condicionado à T10).
- `images`: prints reais do site, nesta ordem: envelope fechado (capa); convite aberto com contagem regressiva; lista de presentes. Sem tela que mostre endereço, chave Pix ou nome de convidado. A ilustração `1.svg` sai da galeria.

## Anexo B — Textos novos (pt)

| Chave | Texto |
|---|---|
| `hero.pitch` | Automatizo a infraestrutura de endpoints — homologação de hardware em Windows, macOS e Linux — e construo produtos com times de agentes de IA guiados por spec. |
| `mode.toAdventure` | Jogar o modo aventura |
| `mode.toDirect` | Ver a versão direta |
| `mode.hint` | Este portfólio também é um jogo: inventário, fada e gemas escondidas. |
| `direct.nav.projects` | Projetos |
| `direct.nav.about` | Sobre |
| `direct.projects.title` | Projetos |
| `direct.projects.subtitle` | Ferramentas de laboratório, produtos e open source. Papel, stack e resultado de cada um. |
| `direct.about.title` | Sobre |
| `direct.about.subtitle` | Quem sou e com o que trabalho. |
| `direct.about.role` | Cargo |
| `direct.about.location` | Local |
| `direct.about.skills` | Tecnologias |
| `direct.about.learning` | Estudando agora |
| `direct.about.timeline` | Trajetória |
| `direct.contact.title` | Contato |
| `direct.contact.text` | Quer conversar sobre uma vaga ou um projeto? Escolha um canal ou mande uma mensagem. |
| `direct.project.back` | Voltar aos projetos |
| `direct.project.stack` | Stack |
| `project.role` | Papel |
| `project.outcome` | Resultado |
| `project.live` | Ver ao vivo |
| `project.code` | Código no GitHub |
