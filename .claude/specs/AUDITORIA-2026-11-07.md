# Auditoria do checklist de lançamento — 2026-11-07

Verificado no código e no build de produção. Itens repetidos na lista original (mesma coisa com outro nome) foram unidos.

| # | Item | Status | Evidência / destino |
|---|---|---|---|
| 1 | Página 404 personalizada | ✅ feito | `src/app/[lang]/not-found.tsx` (floresta, PT/EN) e `src/app/global-not-found.tsx` |
| 2 | Meta title em cada página | ✅ feito | template `%s · André Menezes` no layout; `generateMetadata` por projeto |
| 3 | Meta description em cada página | ✅ feito | home pelo dicionário; projeto pelo `summary` |
| 4 | CTA / botão de ação no topo | ✅ feito (002) | o hero tem "Abrir inventário", mas não há CTA de **contato** no topo → **spec 002** |
| 5 | Favicon / conjunto de favicons | ✅ feito (004) | `icon.svg` e `apple-icon` existem; faltam `favicon.ico`, manifest e ícones 192/512 → **spec 004** |
| 6 | robots.txt | ✅ feito | `src/app/robots.ts` |
| 7 | sitemap.xml | ✅ feito | `src/app/sitemap.ts` (10 URLs com hreflang) |
| 8 | Imagem de compartilhamento (Open Graph) | ✅ feito | `opengraph-image.tsx` da home e dos projetos, 1200×630 |
| 9 | Texto alternativo nas imagens | ✅ feito | toda `Image`/`img` tem `alt`; SVGs decorativos usam `aria-hidden` |
| 10 | Versão mobile ajustada | ✅ feito | 375 px sem scroll horizontal; Lighthouse mobile 98/100 |
| 11 | WhatsApp / CTA fixo no celular | ✅ barra pronta (002); o botão de WhatsApp aparece com o número (T1) | → **spec 002** (precisa do seu número) |
| 12 | Aviso de "carregando" | ✅ feito (002) | nenhum `loading.tsx` → **spec 002** |
| 13 | Aviso de erro no formulário | ✅ feito (002); o envio real ativa com T4 | o site **não tem formulário**; o contato é só por links → **spec 002** cria o formulário |
| 14 | Página de obrigado | ✅ feito (002) | depende do formulário → **spec 002** |
| 15 | Política de privacidade | ✅ feito (003); revisão do texto: T6 | → **spec 003** |
| 17 | Aviso de cookies | ✅ feito (003); aparece quando houver GA (T5) | → **spec 003** (obrigatório antes de ativar o Analytics) |
| 18 | Google Analytics instalado | ✅ código pronto (003); ativa com o ID (T5) | → **spec 003** (precisa do seu ID do GA4) |
| 19 | Endereço real de contato | ⚠️ parcial | GitHub e LinkedIn reais; o e-mail parece ter erro de digitação; não há WhatsApp → **ação sua** (T1) |
| 20 | Imagens otimizadas | ✅ feito | `next/image` com tamanho real, SVGs leves, OG gerado no build; CLS 0,002 |
| 21 | Domínio próprio com HTTPS | ❌ falta | o site ainda não está publicado → **ação sua** (T2, T3) |

O que depende de você está em [`/ACOES-PENDENTES.md`](../../ACOES-PENDENTES.md).

## Atualização — 2026-11-07 (depois das specs 002–004)

Só dependem de ação do André: **19** (contato real, T1) e **21** (domínio/HTTPS, T2–T3), além da ativação de 13 (T4) e 17/18 (T5). Veja `/ACOES-PENDENTES.md`.
