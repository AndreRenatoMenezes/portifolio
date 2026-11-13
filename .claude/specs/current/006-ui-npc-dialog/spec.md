# 006 — Modo aventura: avatar de NPC na caixa de diálogo, "CONTINUE" e revisão visual

- **Domínio:** ui
- **Status:** aprovada para particionamento
- **Autor:** Maestro (acumulou o papel de Arquiteto — exceção estreita: feature de uma WP e um executor; registrado em `decisoes`)
- **Data:** 2026-11-12
- **Origem:** pedido do usuário em 2026-11-12 (conversa com o Maestro)

## Contexto

Depois do merge do PR #1, o usuário ajustou o site manualmente no trabalho (commits `43c463f`, `1fded9a`, `2da24dd`, `4de0ecc` em `main`): removeu o modo direto e o alternador, trocou os cartões por fichas no inventário e liminou as chaves de modo dos dicionários. O site hoje é **só modo aventura**. O usuário gostou do resultado e pediu uma passada de um agente especializado em UI/Front-end para deixar mais coerente e bonito, mais duas ideias próprias descritas abaixo.

## Problema

1. **A caixa de diálogo fala como NPC, mas não tem NPC.** O `DialogBox` mostra a fala de "André" (`dict.hero.speaker`) digitada letra a letra — a vibe de conversa com NPC existe, mas não há retrato de quem fala.
2. **O indicador de avanço é apagado.** Hoje é só um "▼" pequeno no canto (`.dialog-next span`). Nos RPGs, o prompt de avanço é um convite explícito ("PRESS CONTINUE").
3. **Ninguém fez uma passada de coesão visual** sobre o estado atual (só modo aventura + fichas): espaçamento, hierarquia, tipografia, animações e consistência entre seções.

## Escopo (dentro)

1. **Avatar de NPC.** Criar um retrato ilustrado de André em estilo NPC de RPG (pixel-art ou ilustração vetorial consistente com as capas dos projetos), exibido junto à caixa de diálogo, como se o jogador conversasse com ele. O retrato é decorativo. **Não** usar o campo `profile.avatar` (reservado para foto real; segue `undefined`). Ativo novo em SVG; sem raster.
   - Usar nome de classe distinto do `.avatar` existente (globals.css ~799, seção de contato) para não tocar nele — sugestão: `.npc-portrait`.
2. **Prompt de CONTINUE.** Trocar o "▼" apagado por um prompt estilo RPG: texto (`dict.hero.continue`, com paridade pt/en — ex.: "CONTINUE") + seta, pulsando, exibido quando a linha termina de digitar; durante a digitação não há prompt. Clique/Enter continua avançando (comportamento atual preservado, inclusive foco e `aria-label`).
3. **Revisão de coerência visual** (modo aventura inteiro, `desktop 1366px` e `mobile 390px`, temas existentes): corrigir incoerências **dentro da posse desta WP** (espaçamento do hero/dialogo, tipografia, hierarquia, animações) e **listar** as demais como sugestões. Nada fora da posse é alterado nesta spec.

## Escopo (fora)

- `src/components/Inventory.tsx`, `ProjectIcon.tsx`, `ProjectLinks.tsx`, `Gallery.tsx`, `ContactForm.tsx`, `MobileContactBar.tsx`, `Hud.tsx`, `Fairy.tsx`, `Gem.tsx`, `Effects.tsx`, `Controls.tsx`, `HeroScene.tsx`.
- `src/app/projects.css`, `layout.tsx`, páginas de projeto, analytics/consentimento, dados de projetos, `README.md`.
- Qualquer um desses paths pode receber **sugestão** no relatório; implementação só em WP futura aprovada pelo usuário.

## Posses (arquivos)

- **Dono único (UI):** `src/components/DialogBox.tsx`, seção `<section className="hero">` de `src/app/[lang]/page.tsx`, `src/app/globals.css`, `src/dictionaries/pt.json`, `src/dictionaries/en.json`, novo arquivo SVG do retrato em `public/`.
- **Git Master (Sentinela):** branch, stage, commit. O executor **não** roda nenhum comando git.

## Restrições

- **Next.js modificado:** ler o guia relevante em `node_modules/next/dist/docs/` antes de escrever código.
- **Termos vedados:** `.claude/specs/termos-vedados.local` — grep = 0 linhas em tudo que for staged. Nada sobre o empregador/laboratório.
- **Acessibilidade:** manter padrão atual — Lighthouse acessibilidade **100** em `/pt` e `/en`; retrato com `aria-hidden`/decorativo; `sr-only` preservado; foco visível no botão; contraste ≥ 4.5:1 em todos os temas.
- **Performance:** SVG do retrato ≤ 20 KB, com `width`/`height` explícitos (sem layout shift); nenhuma fonte nova; sem raster em `public/`.
- **Movimento reduzido:** `prefers-reduced-motion: reduce` desliga a animação do prompt (exibição estática) — padrão já usado no typewriter.
- **i18n:** paridade de chaves pt/en (mesmas chaves nos dois dicionários).

## Critérios de aceite (binários)

| ID | Critério |
|----|----------|
| CA-01 | `/pt` e `/en`: a caixa de diálogo exibe o retrato ilustrado de André em estilo NPC, visível em 1366px e 390px |
| CA-02 | Retrato é decorativo (aria-hidden/role presentation); leitor de tela não anuncia imagem |
| CA-03 | Durante a digitação não há prompt; ao terminar a linha aparece o prompt "CONTINUE" + seta pulsante; clique/Enter avança (e o comportamento de foco atual é preservado) |
| CA-04 | Com `prefers-reduced-motion`, o prompt aparece estático (sem animação) |
| CA-05 | `pt.json` e `en.json` têm as mesmas chaves novas (paridade verificada) |
| CA-06 | `build`, `lint` e `tsc` passam; Lighthouse acessibilidade 100 em `/pt` e `/en` |
| CA-07 | Grep de termos vedados = 0 linhas nos arquivos staged; nenhum raster novo em `public/` |
| CA-08 | 390px e 1366px: sem overflow horizontal; retrato não sobrepõe nem comprime o texto |
| CA-09 | Relatório de revisão visual entregue com achados **dentro** (corrigidos) e **fora** da posse (só listados); nada fora da posse alterado |

## Evidências esperadas

- Diff/commit feitos pelo Git Master (branch nova, sem push sem autorização).
- Validação independente da Lupa via portal Preview (CA-01 a CA-08) — quem produz não aprova.
- Relatório de sugestões de melhoria (CA-09) levado ao usuário pelo Maestro.
