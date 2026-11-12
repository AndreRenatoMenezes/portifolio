# 005 — Revisão do portfólio: novos projetos e apresentação para recrutadores

- **Domínio:** ui
- **Status:** emendada (emenda 1) — aguardando particionamento do Maestro
- **Autor:** Arquiteto (Prisma)
- **Data:** 2026-11-12 (original e emenda 1)
- **Origem:** pedido do usuário (nota `decisoes`, 2026-11-12); INBOX ("prints reais", "MacBenchmark")
- **Descoberta:** feita com o usuário em 2026-11-12, em duas rodadas (original e emenda 1). As respostas estão em [Decisões de produto](#decisões-de-produto).

## Emenda 1 — um modo só (2026-11-12)

A primeira versão desta spec criou dois modos (direto e aventura) e foi implementada no branch `feat/005-revisao-portfolio`, com PR aberto para `main`. O usuário avaliou o resultado e decidiu que a separação não ficou boa. Esta emenda:

1. **Remove o modo direto.** O portfólio volta a ter só o modo aventura. Saem o alternador, o atributo `data-mode`, a chave `portfolio-mode`, o evento `mode_switch` e os cartões do modo direto.
2. **Enriquece o inventário.** Cada item do inventário vira uma *ficha de item* que mostra, sem interação, o que os cartões do modo direto mostravam: tipo, ano, resumo, papel, resultado, atributos, tags e links. O painel lateral do item selecionado deixa de existir.
3. **Usa os ícones reais dos apps** quando existem e são do autor: Hardware Test Hub, Índice e OrçaZen. Os demais mantêm o ícone de item de fantasia.

Tudo o que não trata de modo (dados, projetos novos, termos vedados, OpenWeddy, prints, página do projeto, i18n, qualidade) continua valendo. A tabela [Situação dos critérios](#situação-dos-critérios-após-a-emenda-1) diz o que caiu, o que foi absorvido e o que é novo. O trabalho é um delta sobre o branch atual, não um recomeço.

## Problema

O público do site são recrutadores, e a página falhava com eles em dois pontos.

1. **A leitura profissional dependia de interação.** Na home, a stack, o resultado e os links de um projeto só apareciam depois de passar o mouse ou clicar num slot do inventário. Os rótulos eram só de jogo ("Inventário", "Ficha do herói", "Placas do caminho"), então quem lê rápido não achava "Projetos", "Sobre" e "Contato".
2. **A referência a games não era explícita.** Quem não reconhece o gênero via só uma página com rótulos estranhos.

A primeira versão resolveu isso separando a página em dois modos. Na prática, a separação duplicou a interface e tirou do modo padrão justamente o que diferencia o portfólio. O problema continua o mesmo; a solução agora é resolver dentro do próprio modo aventura.

Além disso, o contrato `src/content/projects.ts` tinha 4 projetos e o GitHub do usuário tem mais 4 relevantes; o OpenWeddy tem um exemplo real em produção (`https://www.emanuele-andre.site/`); todas as capas eram ilustrações; e os ícones de item são de fantasia mesmo quando o projeto tem ícone de app próprio.

## Objetivo

Um recrutador que abre a home entende em uma tela quem é o André, o que ele faz e que a página é um jogo. No inventário, vê os 8 projetos com o que são, papel, resultado, stack e links, sem nenhuma interação, e reconhece pelo ícone real os apps que têm um. A experiência de jogo (diálogo, HUD, fada, gemas, modal "Você obteve!") continua inteira.

## Decisões de produto

| # | Decisão | Autor | Alternativas rejeitadas | Situação |
|---|---|---|---|---|
| DP-1 | Entram 4 projetos novos: MacBenchmark, bancada Linux de endpoints (repo `ELV`), gerador de relatórios de homologação (repo `relatorio_lab`) e Índice. Total: 8. | Usuário | Só o Índice | mantida |
| DP-2 | Os 3 projetos do laboratório aparecem **sem o nome do empregador** (nem de marcas internas) e como privados, até o usuário registrar autorização. | Usuário | Citar a empresa já; segurar a publicação | mantida |
| DP-3 | OpenWeddy ganha link "ao vivo" para `https://www.emanuele-andre.site/` **e** prints reais na galeria. | Usuário | Só prints; só link | mantida |
| DP-4 | ~~Dois modos de apresentação com alternador: direto e aventura.~~ | Usuário | — | **revogada** pela DP-9 |
| DP-5 | ~~O modo direto é o padrão na primeira visita; a escolha fica salva.~~ | Usuário | — | **revogada** (não há modo a escolher) |
| DP-6 | ~~No modo direto saem as mecânicas de jogo; o alternador torna a referência explícita.~~ | Arquiteto | — | **revogada**; as mecânicas ficam sempre, e a referência explícita passa à DP-14 |
| DP-7 | ~~Os dois modos saem no mesmo HTML; o CSS mostra um deles conforme `html[data-mode]`.~~ | Arquiteto | — | **revogada**; substituída pela DP-10 |
| DP-8 | Projetos novos estreiam com capa ilustrada em SVG, no padrão atual. Print real de projeto do laboratório só entra com aprovação do usuário, imagem a imagem. | Arquiteto | Bloquear a entrega até ter prints aprovados | mantida |
| DP-9 | **Um modo só: aventura.** O modo direto, o alternador e a persistência de modo saem do produto. | Usuário | Manter os dois modos | nova |
| DP-10 | **Inventário em fichas de item.** Cada projeto é uma ficha com moldura de jogo: o ícone num slot à esquerda e, ao lado, tipo · ano, título, resumo, papel, resultado, até 3 atributos, tags e links. 2 colunas no desktop, 1 no celular. Sem painel lateral. Clicar no slot abre o modal "Você obteve!". | Usuário | Lista compacta estilo menu, sem atributos; manter grade de slots + painel único (só 1 projeto visível por vez) | nova |
| DP-11 | **Ícones reais** para Hardware Test Hub, Índice e OrçaZen. O usuário confirmou em 2026-11-12 que os três são de sua autoria (ou feitos para ele) e podem ser publicados. | Usuário | — | nova |
| DP-12 | **MacBenchmark e Linux Endpoint Bench mantêm o ícone de fantasia.** O ícone real deles é o mesmo nos dois, foi entregue pelo designer do `<EMPREGADOR>`, usa a cor da marca e tem o nome de uma marca interna no arquivo de origem: publicá-lo fere a DP-2. | Usuário | Usar após autorização (T12); usar já | nova |
| DP-13 | **O ícone real substitui o de fantasia em todo lugar**: ficha, modal "Você obteve!", página do projeto e imagem OG. Sem recolorir, sem filtro e sem sombra; a moldura do slot é que integra o ícone à estética. | Usuário | Real só na ficha e na página; real grande + fantasia pequeno como selo | nova |
| DP-14 | **Leitura para recrutador dentro do modo aventura:** títulos de seção compostos ("Inventário · Projetos", "Ficha do herói · Sobre", "Placas do caminho · Contato"); navegação do cabeçalho com termos lisos (Projetos, Sobre, Contato); uma frase na primeira dobra dizendo que o portfólio é um jogo. GitHub e LinkedIn **não** entram como botões no hero (ficam na seção de contato). | Usuário | Botões de GitHub e LinkedIn no hero | nova |
| DP-15 | OpenWeddy, SDD Maestri e Homolog Dashboard mantêm o ícone de fantasia. O favicon do OpenWeddy é o monograma do casal (é da instância, não do produto); o SDD Maestri não tem ícone próprio (o do app Maestri é de terceiro); o repositório do Homolog Dashboard só tem logos do empregador. | Arquiteto | Usar o monograma do casal; usar o ícone do app Maestri | nova |
| DP-16 | Teclado no inventário: todo slot fica na ordem do Tab; as setas, Home e End movem o foco entre os slots (efeito de jogo, não obrigação). Sem painel, não há mais "item selecionado" que mude conteúdo. | Arquiteto | Manter o tabindex móvel (só um slot no Tab), que pularia os slots das outras fichas | nova |

## Dentro do escopo

- Contrato `src/content/projects.ts`: campos `role`, `outcome` e `icon`; 4 projetos novos; link ao vivo e prints reais do OpenWeddy.
- Arquivos de ícone real em `public/projects/<slug>/` para os 3 projetos da DP-11.
- **Remoção do modo direto** (DP-9): estado, script, atributo, alternador, cartões, chaves de dicionário e evento de analytics.
- Home: primeira dobra (frase de jogo), inventário em fichas (DP-10), títulos compostos e navegação lisa (DP-14).
- Página `projects/[slug]` e sua imagem OG: papel, resultado, links e ícone real.
- Dicionários `pt.json` e `en.json`: chaves novas, removidas e com valor alterado.
- Acessibilidade do inventário em fichas.

## Fora de escopo

- Currículo em PDF e foto no "Sobre" (`profile.cv`, `profile.avatar`).
- Filtro ou busca de projetos, paginação do inventário.
- Mudanças no formulário de contato, na política de cookies e no consentimento.
- Novo tema, nova arte do hero, novos ícones de item de fantasia (usar os 12 existentes). Desenhar ícone novo para projeto sem ícone real.
- Usar o ícone real de MacBenchmark e Linux Endpoint Bench (DP-12), mesmo depois da T12; isso pede spec futura.
- Publicar o nome do empregador nos projetos do laboratório (depende de autorização; ver T12).
- Alterações no site do casamento.
- Limpar a chave `portfolio-mode` que já ficou gravada no navegador de quem visitou o PR: ela passa a ser ignorada, e removê-la é opcional.

## Contratos de dado

### `src/content/projects.ts` — tipo `Project`

Campos novos:

```ts
/** Papel do autor no projeto, em uma linha. Ex.: "Autor único: arquitetura, código e documentação". */
role: Localized;
/** Resultado concreto em uma frase: o que mudou para quem usa. Sem adjetivo vago. */
outcome: Localized;
/**
 * Ícone real do app, quando existe e é do autor (DP-11). Ausente = usa `item`.
 * `src` aponta para `public/projects/<slug>/icon.<svg|png|webp>`; `width`/`height` são o tamanho intrínseco.
 */
icon?: { src: string; width: number; height: number };
```

`role` e `outcome` são obrigatórios. `icon` é opcional. `item` continua obrigatório em todos os projetos: é o fallback e continua citado pela fada.

Campos existentes, com regra nova:

- `links.demo`: URL pública que abre sem login. No OpenWeddy, `https://www.emanuele-andre.site/`.
- `private: true` em todo projeto de repositório privado; nesse caso `links.github` fica ausente.
- `summary`, `description`, `kind`, `role`, `outcome`, `stats[].label`, `images[].alt`, `tags`: nos projetos `macbenchmark`, `linux-endpoint-bench` e `homolog-dashboard`, sem o nome do empregador nem de marca interna (CA-05).

### Ícones reais

| `slug` | Origem (repositório do autor) | Arquivo de destino | Observação |
|---|---|---|---|
| `hardware-test-hub` | `AndreRenatoMenezes/win_testehub`, `docs/assets/brand/icon.svg` (há também `icon-512.png`) | `public/projects/hardware-test-hub/icon.svg` | O SVG traz um bloco `<metadata>` com manifesto C2PA: remover antes de versionar (CA-43). |
| `indice` | repo `indice`, `docs/marca/indice-icon.svg` (versão "ícone do app, bege") | `public/projects/indice/icon.svg` | O guia de marca do Índice proíbe recolorir, esticar e aplicar sombra ou contorno. |
| `orcazen` | repo `app-financeiro`, `public/icon-mark.svg` (há também `icon-512.png`) | `public/projects/orcazen/icon.svg` | Fundo transparente, verde `#00C28A`. |

Regras para qualquer ícone real:

- Formato quadrado (`width` igual a `height`). SVG de preferência; raster (PNG ou WebP) com pelo menos 128 px de lado.
- Até 30 KB por arquivo.
- Sem metadados: nenhum bloco `<metadata>`, C2PA, XMP ou EXIF.
- Cópia fiel: só se pode cortar margem, redimensionar e remover metadados. Recolorir ou redesenhar é proibido.
- Projeto cujo ícone tenha qualquer elemento do `<EMPREGADOR>` (cor de marca, nome, logo) não ganha `icon` (DP-12).

### Termos vedados

Esta spec não escreve o nome do empregador nem das marcas internas: o repositório é público e `.claude/specs/` é versionado. Onde for preciso referir, usar `<EMPREGADOR>` e `<MARCA-INTERNA>`.

- **O que é vedado** em qualquer arquivo versionado (código, conteúdo, dicionários, `alt`, nome de arquivo, conteúdo de SVG, specs, `tasks.md`, mensagens de commit): a razão social ou o nome fantasia do `<EMPREGADOR>`; o nome de áreas, laboratórios, produtos, modelos de documento e ferramentas internas (`<MARCA-INTERNA>`); hostnames, números de série, nomes de colegas e caminhos de rede internos.
- **Forma permitida:** "laboratório de endpoints de uma fintech".
- **Lista de termos:** fica em `.claude/specs/termos-vedados.local`, um termo por linha (expressão regular estendida, sem diferenciar maiúsculas), **fora do git**. O caminho é fixo na raiz de `.claude/specs/` para sobreviver ao arquivamento desta spec. O usuário pode acrescentar termos; a lista inicial foi criada pelo Arquiteto em 2026-11-12.
- **`.gitignore`:** contém a linha `/.claude/specs/**/*.local`.
- **Fatos dos repositórios privados:** o Anexo A traz só paráfrase dos READMEs, sem trecho copiado, sem nome de arquivo ou de ativo interno.

### Ordem e ícones dos projetos

A ordem do array é a ordem de exibição no inventário:

| # | `slug` | Título | Origem | `private` | `item` (fallback) | `icon` |
|---|---|---|---|---|---|---|
| 1 | `hardware-test-hub` | Hardware Test Hub | existente | não | `shield` | **real** |
| 2 | `macbenchmark` | MacBenchmark | repo `macbenchmark` | sim | `sword` | — (DP-12) |
| 3 | `openweddy` | OpenWeddy | existente | não | `letter` | — (DP-15) |
| 4 | `sdd-maestri` | SDD Maestri | existente | não | `scroll` | — (DP-15) |
| 5 | `indice` | Índice | repo `indice` | sim | `key` | **real** |
| 6 | `linux-endpoint-bench` | Linux Endpoint Bench | repo `ELV` | sim | `lantern` | — (DP-12) |
| 7 | `homolog-dashboard` | Homolog Dashboard | repo `relatorio_lab` | sim | `map` | — (DP-15) |
| 8 | `orcazen` | OrçaZen | existente | sim | `pouch` | **real** |

Os títulos de 6 e 7 são nomes de vitrine propostos pelo Arquiteto, porque os nomes internos carregam a marca do laboratório.

O conteúdo de cada projeto novo está no [Anexo A](#anexo-a--conteúdo-dos-projetos), junto com o `role` e o `outcome` dos 4 existentes.

### `src/dictionaries/pt.json` e `en.json`

Os valores em português estão no [Anexo B](#anexo-b--textos-pt).

- **Novas:** `hero.gameHint`; `sections.projects`, `sections.about`, `sections.contact` (termos lisos, usados na navegação e na segunda metade dos títulos compostos).
- **Mantidas da versão original:** `hero.pitch`, `project.role`, `project.outcome`, `project.live`, `project.code`. A chave já existente `inventory.open` ("Inspecionar item") passa a ser o prefixo do nome acessível do slot.
- **Removidas:** o grupo `mode` inteiro; o grupo `direct` inteiro; `nav.projects` e `nav.about` (substituídas por `sections.*`); `inventory.selected` e `inventory.empty` (não há mais seleção nem slot vazio).
- **Valor alterado:** `inventory.subtitle` (não fala mais em "escolher"); `project.stack` (passa a composto, como os títulos); a dica da fada sobre "o escudo" (o Hardware Test Hub deixa de ser um escudo).

`modal.demo` e `modal.github` têm os mesmos textos de `project.live` e `project.code`.

### Estado do visitante

- Não há estado de modo. Nada lê nem grava `portfolio-mode`; o `<html>` não tem `data-mode`.
- `.claude/specs/schema.md` deixa de listar "modo" entre os estados do visitante.

### Evento de analytics

- `mode_switch` deixa de existir.
- `item_open` (abrir o modal) continua como está.

## Critérios de aceite

Os critérios de página valem em `/pt` e `/en`. "Desktop" é viewport 1366×768 e "celular" é 390×844. "Visível na primeira dobra" significa: com a página no topo (`scrollY = 0`), o `getBoundingClientRect().bottom` do elemento é menor ou igual a `innerHeight`, e o elemento não tem `display: none` nem `visibility: hidden`. "Ícone real" é o `icon` do projeto; "ícone de fantasia" é o `ItemIconSvg` do `item`.

### Dados

- **CA-01** `projects` tem exatamente 8 itens, com os slugs e a ordem da tabela acima.
- **CA-02** Todo projeto tem `role` e `outcome` com `pt` e `en` não vazios, e o texto `en` é diferente do `pt` em `role`, `outcome`, `summary` e `kind`.
- **CA-03** `openweddy.links.demo` é `https://www.emanuele-andre.site/` e essa URL responde 200. Este critério só vale se a T10 estiver marcada como feita em `ACOES-PENDENTES.md`; se não estiver, `links.demo` fica ausente e o critério é "ausente".
- **CA-04** `openweddy.images` tem pelo menos 3 imagens raster (webp ou png) do site real, cada uma com até 300 KB, `width`/`height` iguais ao tamanho real do arquivo e `alt` em `pt` e `en`. A primeira é a capa.
- **CA-05** `grep -rniE -f .claude/specs/termos-vedados.local --exclude='*.local' src public .claude/specs ACOES-PENDENTES.md README.md` não retorna nenhuma linha. O arquivo de termos precisa existir e ter pelo menos uma linha; se faltar, o critério falha.
- **CA-05b** `git check-ignore .claude/specs/termos-vedados.local` retorna o caminho e `git ls-files '*.local'` não retorna nada.
- **CA-06** Os projetos `macbenchmark`, `indice`, `linux-endpoint-bench` e `homolog-dashboard` têm `private: true`, não têm `links.github` e têm pelo menos 1 imagem cujo arquivo existe em `public/projects/<slug>/`.
- **CA-07** Nenhuma imagem raster em `public/projects/macbenchmark/`, `linux-endpoint-bench/` ou `homolog-dashboard/` existe sem estar listada e marcada como aprovada na T11 de `ACOES-PENDENTES.md`.
- **CA-08** As 16 rotas `/{pt,en}/projects/<slug>` respondem 200 e aparecem em `/sitemap.xml`.

### Ícones reais

- **CA-42** `hardware-test-hub`, `indice` e `orcazen` têm `icon`, e o arquivo de `icon.src` existe em `public/projects/<slug>/`. Nenhum outro projeto tem `icon`; em particular, `macbenchmark` e `linux-endpoint-bench` não têm, e não existe arquivo `icon.*` nas pastas deles.
- **CA-43** Todo arquivo de ícone real é quadrado (`width` igual a `height`, iguais ao tamanho intrínseco do arquivo), tem até 30 KB e `grep -ciaE 'c2pa|<metadata|xmp|exif' <arquivo>` retorna `0`. Raster tem pelo menos 128 px de lado.
- **CA-44** Na ficha, no modal "Você obteve!" e no cabeçalho da página do projeto, os projetos com `icon` mostram o ícone real e não mostram o ícone de fantasia; os projetos sem `icon` mostram o ícone de fantasia como hoje. O ícone real tem `alt=""` (o título está ao lado), `getComputedStyle` dele dá `filter: none` (sem `drop-shadow`) e ele não gira nem se deforma no hover ou no foco; só pode escalar por igual (o guia de marca do Índice proíbe girar, esticar e aplicar sombra).
- **CA-45** A imagem OG de `/<lang>/projects/<slug>` (`opengraph-image`) usa o ícone real quando há `icon` e o de fantasia quando não há; as 16 imagens geram sem erro no `npm run build`.

### Sem modo

- **CA-09** ~~Modo `direct` na primeira pintura.~~ **Revogado** (DP-9).
- **CA-10** ~~Sem JavaScript, modo direto.~~ **Reescrito:** com JavaScript desligado, a home mostra as 8 fichas com todos os campos do CA-20 e os links do CA-21, e o slot de cada ficha é um link que leva a `/<lang>/projects/<slug>`.
- **CA-11** a **CA-15** ~~Alternador, persistência, troca de idioma e `mode_switch`.~~ **Revogados** (DP-9).
- **CA-41** O `<html>` não tem atributo `data-mode`; não existe alternador de modo na página; `grep -rnE 'data-mode|portfolio-mode|ModeToggle|ModeText|mode_switch|ProjectCards' src` não retorna nenhuma linha; os dicionários não têm os grupos `mode` nem `direct`.

### Primeira dobra e rótulos

- **CA-16** ~~Primeira dobra do modo direto.~~ **Revogado**; substituído pelo CA-25.
- **CA-17** ~~Mecânicas de jogo ocultas no modo direto.~~ **Revogado**; ver CA-24.
- **CA-18** **Reescrito:** a navegação do cabeçalho mostra os textos de `sections.projects` e `sections.about` ("Projetos", "Sobre") e o botão de contato como hoje.
- **CA-25** **Reescrito:** no desktop e no celular, estão visíveis na primeira dobra, sem clique: o `<h1>` com nome e cargo; a frase `hero.pitch`; a frase `hero.gameHint`. No desktop, o botão "Fale comigo" do hero também está visível na primeira dobra; no celular, a barra de contato fixa (`.mobile-bar`) está visível.
- **CA-27** O `<h2>` de cada seção mostra o termo de jogo seguido do termo liso, separados por " · ": "Inventário · Projetos", "Ficha do herói · Sobre", "Placas do caminho · Contato" (e os equivalentes em `/en`).

### Inventário em fichas

- **CA-19** **Reescrito:** a seção `#inventory` mostra uma lista (`<ul>`) com 8 fichas, cada uma num `<li>` com um `<article>`, todas no fluxo da página (sem carrossel, aba, paginação ou "ver mais"). No desktop ficam em 2 colunas; no celular, em 1.
- **CA-20** **Absorvido (mesmos campos, agora na ficha):** cada ficha mostra, sem hover, foco ou clique: o slot com o ícone; tipo (`kind`) e ano; título num `<h3>`; resumo; papel (`role`) com o rótulo `project.role`; resultado (`outcome`) com o rótulo `project.outcome`; até 3 atributos; todas as tags.
- **CA-21** Cada ficha tem, como links reais (`<a href>`): "ao vivo" quando há `links.demo`; "código" quando há `links.github`; "pedir demonstração" apontando para `#contact` quando `private`; e "ver detalhes" para `/<lang>/projects/<slug>`. Links externos abrem em nova aba com `rel="noreferrer"`.
- **CA-22** **Reescrito:** não existe painel do item selecionado (`.item-panel`) nem slot vazio na home; nenhum conteúdo de projeto depende de hover ou seleção para aparecer.
- **CA-23** No celular, a página não tem rolagem horizontal (`document.documentElement.scrollWidth <= innerWidth`).
- **CA-26** ~~Painel do item com papel, resultado e links.~~ **Revogado**; absorvido pelos CA-20 e CA-21.
- **CA-28** **Reescrito:** o slot de cada ficha é um `<a href="/<lang>/projects/<slug>">` com nome acessível `inventory.open` + título (ex.: "Inspecionar item: Índice"). Clique simples abre o modal "Você obteve!" (com som e `item_open`, como hoje); clique com modificador (Ctrl, ⌘, Shift, botão do meio) segue o link. Os 8 slots estão na ordem do Tab; com o foco num slot, as setas movem o foco para o slot vizinho (esquerda/direita na linha, cima/baixo entre linhas, conforme o número de colunas), Home vai ao primeiro e End ao último. O cursor de mira aparece no slot com hover ou foco.
- **CA-46** O modal "Você obteve!" mostra capa, resumo, papel, resultado, atributos e os links do CA-21, e fecha com Esc, com o botão de fechar e com clique no fundo, devolvendo o foco ao slot que o abriu.

### Modo aventura (agora o único)

- **CA-24** **Reescrito:** a caixa de diálogo, o HUD (corações e gemas), a fada, as gemas colecionáveis, o botão de som, o botão da fada, as notificações e a dica da melodia no rodapé aparecem e funcionam como antes da 005, sem depender de nenhum atributo de modo.

### Página do projeto

- **CA-29** `/<lang>/projects/<slug>` mostra, acima da galeria e sem clique: ícone (CA-44), título, tipo, resumo, papel, resultado, ano, stack e os links do CA-21 (exceto "ver detalhes").
- **CA-30** **Reescrito:** o link de volta usa `project.back` e leva a `/<lang>#inventory`; o rótulo da stack usa `project.stack`.
- **CA-31** Na página `openweddy`, o botão "ao vivo" aponta para a URL do CA-03 e a galeria abre os prints reais no lightbox.

### i18n

- **CA-32** `pt.json` e `en.json` têm exatamente o mesmo conjunto de chaves (o `tsc` falha se não tiverem) e nenhuma chave tem valor vazio.
- **CA-33** Em `/en`, nenhum dos textos de `pt.json` listados no Anexo B aparece na página.

### Acessibilidade e qualidade

- **CA-34** Lighthouse, categoria Acessibilidade, dá 100 na home e em `/pt/projects/openweddy` e `/pt/projects/indice`, no celular e no desktop.
- **CA-35** A home tem um único `<h1>` e nenhum salto de nível de título (`h1` → `h2` da seção → `h3` da ficha).
- **CA-36** **Reescrito:** cada projeto aparece uma única vez na home como título (`<h3>`); não há conteúdo duplicado escondido com `display: none` ou `aria-hidden` para o mesmo projeto.
- **CA-37** Texto e controles novos têm contraste de pelo menos 4.5:1 nos temas dia, noite e templo, e foco visível nos slots e nos links da ficha.
- **CA-38** **Reescrito:** com `prefers-reduced-motion: reduce`, o cursor de mira não pulsa e o ícone do slot não gira nem escala.
- **CA-39** `npm run build`, `npm run lint` e `npx tsc --noEmit` passam sem erro, e o console do navegador não mostra erro na home nem em uma página de projeto.
- **CA-40** **Reescrito:** Lighthouse, categoria Desempenho, na home no celular, não cai mais de 5 pontos em relação à medição de `main` antes da 005 (registrar as duas no `tasks.md`). A ficha não carrega capa (a capa só aparece no modal e na página do projeto).

## Situação dos critérios após a emenda 1

| Situação | Critérios |
|---|---|
| Mantidos sem mudança | CA-01 a CA-08, CA-21, CA-23, CA-27, CA-29, CA-31, CA-32, CA-33, CA-37, CA-39 |
| Revogados | CA-09, CA-11, CA-12, CA-13, CA-14, CA-15, CA-16, CA-17, CA-26 |
| Absorvidos pelo modo aventura (mesma intenção, novo lugar) | CA-19 (cartões → fichas), CA-20 (campos na ficha), CA-22 (sem painel), CA-25 (primeira dobra), CA-28 (slot e teclado) |
| Reescritos (mesma intenção, sem referência a modo) | CA-10, CA-18, CA-24, CA-30, CA-34, CA-35, CA-36, CA-38, CA-40 |
| Novos | CA-41 (sem modo), CA-42 a CA-45 (ícones reais), CA-46 (modal) |

## Ações do usuário

Entram em `ACOES-PENDENTES.md` (quem edita esse arquivo é o dono do conteúdo; ver fronteiras).

- **T10 — Conferir o site do casamento antes de linkar.** Abrir `https://www.emanuele-andre.site/` numa janela anônima, sem link de convidado, e confirmar que um estranho não vê endereço residencial, chave Pix, telefones nem nomes de convidados, e não consegue enviar RSVP em nome de alguém. Marcar feito ou pedir "sem link".
- **T11 — Aprovar prints.** Tabela com cada imagem raster proposta para os projetos do laboratório; o usuário marca aprovada ou recusada. Critério do usuário: sem logo, nome da empresa, hostname, número de série ou dado interno. Vazio é válido (ficam as capas ilustradas).
- **T12 — Autorização do empregador (opcional).** Se obtida, registrar data e quem autorizou; só então uma spec futura pode citar o nome (ou usar o ícone dos projetos do laboratório).
- **T13 — Confirmar papel.** Conferir os textos de `role` do Anexo A (premissa P1).

A autoria dos três ícones reais (DP-11) foi confirmada pelo usuário na descoberta da emenda 1 e está registrada na nota `decisoes`; não vira tarefa.

## Premissas

- **P1** O usuário é autor único dos 8 projetos. Se algum foi feito em equipe, o `role` daquele projeto muda antes da implementação.
- **P2** Os fatos dos projetos privados vêm dos READMEs lidos em 2026-11-12. O número de testes, suítes e artefatos pode ter mudado; o dono do conteúdo confere no repositório antes de fixar os `stats`.
- **P3** O site do casamento continua no ar depois do evento. Se sair do ar, `links.demo` é removido (CA-03 passa a "ausente").
- **P4** Os arquivos de ícone listados em [Ícones reais](#ícones-reais) são a versão atual de cada marca. Se o autor trocar o ícone no repositório de origem, o portfólio só muda numa spec futura.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Vazar nome ou dado do empregador em texto, print, `alt`, nome de arquivo, SVG, spec ou commit | Alto (confidencialidade) | CA-05 e CA-05b, CA-07, DP-2, DP-8, DP-12 |
| Ícone de projeto do laboratório expor a marca do empregador pela cor ou pelo desenho | Alto | DP-12; CA-42 proíbe `icon` em `macbenchmark` e `linux-endpoint-bench` |
| Metadados de ícone (C2PA, XMP) levarem dados de autoria ou de ferramenta para o repositório público | Médio | CA-43 |
| Site do casamento expor dados de família e convidados a recrutadores | Alto (privacidade de terceiros) | T10 condiciona o link (CA-03) |
| Ícone real destoar da estética de jogo | Baixo (aceito pelo usuário) | DP-13: o slot com moldura integra; sem filtro para não violar o guia de marca do Índice |
| Home ficar longa com 8 fichas completas | Médio | Ficha sem capa (CA-40); 2 colunas no desktop; resumo de 1–2 frases |
| Resto do modo direto ficar no código (CSS que esconde tudo sem `data-mode`) | Alto (a página some) | CA-41 e CA-24; o plano manda remover `mode.css` e todos os `data-mode-only` juntos |
| Recrutador não notar que a página é um jogo | Médio (é o medo original) | DP-14: `hero.gameHint` na primeira dobra (CA-25) |
| `globals.css` (1.582 linhas) virar ponto de conflito entre executores | Médio | Fronteiras: CSS do inventário em `projects.css`, do dono C |

## Fronteiras de arquivo sugeridas

Delta sobre o branch `feat/005-revisao-portfolio`. Três donos; as chaves de dicionário e o campo `icon` estão nomeados nesta spec, então os três podem começar em paralelo.

### Dono A — Conteúdo e contrato

- **Possui:** `src/content/projects.ts`, `public/projects/**` (os 3 `icon.svg` novos), `src/dictionaries/pt.json`, `src/dictionaries/en.json`, `ACOES-PENDENTES.md`.
- **Faz:** campo `icon` no tipo e nos 3 projetos; arquivos de ícone sem metadados (CA-42, CA-43); chaves novas, removidas e alteradas (seção de dicionários); dica da fada sobre o escudo.
- **Fora de escopo:** qualquer `.tsx`, qualquer `.css`, `src/lib/**`.

### Dono B — Casca (remoção do modo)

- **Possui:** `src/lib/store.ts`, `src/lib/analytics.ts` (se tipar `mode_switch`), `src/app/[lang]/layout.tsx`, `src/components/Controls.tsx`, `src/components/Hud.tsx`, `src/components/Fairy.tsx`, `src/components/Gem.tsx`, `src/components/Effects.tsx`, `src/components/DialogBox.tsx`, `src/app/globals.css`; remove `src/components/ModeToggle.tsx`, `src/components/ModeText.tsx` e `src/app/mode.css`.
- **Faz:** CA-41 (parte da casca), CA-18, CA-24.
- **Fora de escopo:** `src/content/**`, dicionários, `src/app/[lang]/page.tsx`, componentes de projeto.

### Dono C — Home e projetos

- **Possui:** `src/app/[lang]/page.tsx`, `src/components/Inventory.tsx`, `src/components/ProjectLinks.tsx`, `src/components/Gallery.tsx`, `src/app/[lang]/projects/[slug]/page.tsx`, `src/app/[lang]/projects/[slug]/opengraph-image.tsx`, `src/app/projects.css`, o novo `src/components/ProjectIcon.tsx`; remove `src/components/ProjectCards.tsx`.
- **Faz:** CA-10, CA-19 a CA-23, CA-25, CA-27 a CA-30, CA-36, CA-38, CA-44 a CA-46.
- **Fora de escopo:** `src/lib/store.ts`, `layout.tsx`, `globals.css`, `src/content/**`, dicionários.

**Dependências e ordem:** C e B tiram os usos de `ModeText`/`ModeToggle` dos seus arquivos; **B apaga `ModeText.tsx`, `ModeToggle.tsx` e `mode.css` só depois que C remover os usos em `page.tsx` e em `projects/[slug]/page.tsx`**, para o build não quebrar no meio. C lê `dict.sections.*`, `dict.hero.gameHint`, que A cria primeiro; até lá, C pode tipar contra a lista desta spec. Se o Maestro preferir, B e C podem ser um dono só: o trabalho de B é quase todo remoção.

Git é do Sentinela; ninguém acima faz stage, commit ou push.

---

## Anexo A — Conteúdo dos projetos

Textos em português. A versão em inglês é tradução do dono A. Onde diz "fintech", é a forma neutra exigida pela DP-2.

### Projetos novos

**`macbenchmark` — MacBenchmark** · `item: sword` · sem `icon` (DP-12) · 2026 · privado
- `kind`: Ferramenta de laboratório · macOS
- `role`: Autor único: arquitetura, app em Swift, backend e metodologia de medição
- `summary`: Benchmark nativo para homologar MacBooks Apple Silicon: mede CPU, RAM, SSD, rede, bateria e boot com cargas sintéticas e reais (Numbers, Pages, Safari) e gera um score reproduzível contra um baseline.
- `outcome`: O laboratório de endpoints de uma fintech compara máquinas e imagens de sistema com dados brutos auditáveis, em vez de um número de caixa-preta.
- `description` (pontos a cobrir): por que não PCMark/Geekbench (transparência); reprodutibilidade (seeds determinísticos, warmup descartado, execução serial com resfriamento); score em camadas por média harmônica ponderada, referência = 1000; baseline exportável em JSON; pré-voo que verifica a máquina; telemetria ao vivo; sync opcional para backend Node/TypeScript + PostgreSQL com fila offline; código privado.
- `tags`: Swift 6, SwiftUI, IOReport, Node.js, PostgreSQL, GitHub Actions
- `stats`: `4` suítes de teste · `1000` = score do baseline · `2` pipelines de CI

**`indice` — Índice** · `item: key` · `icon` real · 2026 · privado
- `kind`: Produto pessoal · web + Android
- `role`: Autor único: API, web, app Android e infraestrutura
- `summary`: Painel pessoal inspirado no Bullet Journal: tarefas, hábitos, finanças, metas e arquivo de mídia numa API própria, com cliente web e app Android.
- `outcome`: Uma única API serve o site e o app, com as regras de negócio cobertas por testes e deploy em contêiner.
- `description` (pontos a cobrir): monorepo com API Fastify + Prisma, web Next.js e Android em Kotlin + Jetpack Compose com widget; contratos zod compartilhados entre API e web; regras financeiras portadas do OrçaZen (ciclo de fatura, parcelas); tarefas recorrentes e migração entre dias; pronto para Cloud Run + Cloud SQL; código privado.
- `tags`: TypeScript, Fastify, Prisma, Next.js, Kotlin, Jetpack Compose, PostgreSQL, Cloud Run
- `stats`: `3` apps (API, web, Android) · `5` áreas num painel · `API-first` arquitetura

**`linux-endpoint-bench` — Linux Endpoint Bench** · `item: lantern` · sem `icon` (DP-12) · 2026 · privado
- `kind`: Ferramenta de laboratório · Linux
- `role`: Autor único: orquestrador, testes e documentação de operação
- `summary`: Orquestrador de benchmark para estações Ubuntu que mede o impacto de agentes de segurança (antivírus, EDR, DLP) em CPU, disco, memória, boot e aplicativos.
- `outcome`: A decisão de homologar um agente de segurança passa a se apoiar em medições repetíveis, com reinícios reais e ambiente controlado.
- `description` (pontos a cobrir): 19 testes em 6 domínios; bateria de boot com reinícios reais; preflight que verifica dependências e energia; suspensão de atualizações automáticas durante a medição; cargas reais de escritório com LibreOffice e navegador; comando `doctor` para diagnosticar o ambiente; construído com Spec-Driven Development; código privado.
- `tags`: Python, Ubuntu, systemd, LibreOffice UNO, Playwright, hyperfine
- `stats`: `19` testes · `6` domínios medidos · `30+` specs entregues

**`homolog-dashboard` — Homolog Dashboard** · `item: map` · sem `icon` (DP-15) · 2026 · privado
- `kind`: Ferramenta de laboratório · relatórios
- `role`: Autor único: coleta, modelo de dados, geração dos relatórios e integração com IA
- `summary`: Gerador de relatórios de homologação: aponta para a pasta de resultados, descobre a estrutura sozinho e produz dashboard interativo, apresentação em slides e relatório em markdown.
- `outcome`: O relatório de uma homologação sai em uma passada, com parecer opcional de IA embutido, em vez de ser montado à mão.
- `description` (pontos a cobrir): uma cópia serve todas as homologações; interface gráfica (Streamlit) e linha de comando; prévia da coleta para pegar pasta errada antes de gerar; parecer por Gemini que não derruba a geração se a API falhar; roda em Windows e macOS; código privado.
- `tags`: Python, Streamlit, Gemini, HTML, CLI
- `stats`: `3` artefatos por execução · `2` sistemas (Windows, macOS) · `IA` no parecer

### Projetos existentes — campos novos

| `slug` | `role` | `outcome` | `icon` |
|---|---|---|---|
| `hardware-test-hub` | Autor único: framework, módulos de teste e relatórios | Homologar um notebook virou uma bateria retomável, com PASS ou FAIL por teste e evidência guardada por cenário. | real |
| `sdd-maestri` | Autor: desenho do método, papéis e documentação | Times de agentes de IA trabalham em paralelo sem dois editarem o mesmo arquivo, com um commit por pacote aprovado. | — |
| `openweddy` | Autor único: produto, front-end, banco e painel dos noivos | Usado no meu próprio casamento: convidados confirmaram presença e presentearam por Pix, sem taxa de plataforma. | — |
| `orcazen` | Autor único: produto, front-end, banco e integração com IA | Substituiu a planilha de finanças da casa, com extratos importados por IA e conferidos antes de gravar. | real |

O `outcome` do OpenWeddy afirma uso real; o usuário confirma na T13 junto com os papéis.

### OpenWeddy — mudanças

- `links.demo`: `https://www.emanuele-andre.site/` (condicionado à T10).
- `images`: prints reais do site, nesta ordem: envelope fechado (capa); convite aberto com contagem regressiva; lista de presentes. Sem tela que mostre endereço, chave Pix ou nome de convidado. A ilustração `1.svg` sai da galeria.

## Anexo B — Textos (pt)

Chaves novas ou com valor alterado na emenda 1, mais as da versão original que continuam. A versão em inglês é tradução do dono A.

| Chave | Texto | Situação |
|---|---|---|
| `hero.pitch` | Automatizo a infraestrutura de endpoints — homologação de hardware em Windows, macOS e Linux — e construo produtos com times de agentes de IA guiados por spec. | mantida |
| `hero.gameHint` | Este portfólio é um jogo: abra o inventário, siga a fada e procure as gemas escondidas. | nova |
| `sections.projects` | Projetos | nova |
| `sections.about` | Sobre | nova |
| `sections.contact` | Contato | nova |
| `inventory.subtitle` | Cada item é um projeto: ferramentas de laboratório, produtos e open source, com papel, stack e resultado. Clique no ícone para inspecionar. | alterada |
| `inventory.open` | Inspecionar item | mantida (novo uso: nome acessível do slot) |
| `project.stack` | Equipamento usado · Stack | alterada |
| `project.role` | Papel | mantida |
| `project.outcome` | Resultado | mantida |
| `project.live` | Ver ao vivo | mantida |
| `project.code` | Código no GitHub | mantida |
| `fairy.tips` (a dica do escudo) | O Hardware Test Hub tem 9 módulos de teste, e cada um devolve PASS ou FAIL. | alterada |

Os títulos compostos (CA-27) e o rótulo do slot (CA-28) são montados no componente a partir das chaves acima (`inventory.title` + " · " + `sections.projects`; `inventory.open` + ": " + título). Não criar chave para a forma composta.
