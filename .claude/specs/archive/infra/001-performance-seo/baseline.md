# Baseline — Lighthouse mobile

Ambiente: `next build` + `next start` em `http://localhost:3001/pt`, Lighthouse 12.8.2, Chrome headless, perfil mobile padrão (CPU 4× mais lenta, rede 4G simulada).

## Antes (2026-11-07, commit 4275194)

| Métrica | Valor |
|---|---|
| Performance | 72 |
| Acessibilidade | 100 |
| Boas práticas | 100 |
| SEO | 90 |
| FCP | 0,8 s |
| LCP | 2,5 s (elemento: `h1.hero-title`) |
| TBT | 1.440 ms |
| CLS | 0 |
| Speed Index | 2,4 s |

Observações:
- SEO perde pontos só em `hreflang` ("Relative href value").
- TBT vem de uma tarefa longa de **1.482 ms "Unattributable"**, em que quase não há script (o JS total gasta ~300 ms). O breakdown mostra "Other" 2,06 s e "Style & Layout" 0,54 s, o que indica trabalho de pintura e composição: `backdrop-filter`, animações infinitas e `drop-shadow` animado no SVG.

## Depois (2026-11-07, WP-01 a WP-07 aplicadas, 2 execuções)

| Métrica | Antes | Depois | Meta (CA-18) |
|---|---|---|---|
| Performance | 72 | **98** | ≥ 95 ✅ |
| Acessibilidade | 100 | **100** | ≥ 95 ✅ |
| Boas práticas | 100 | **100** | — |
| SEO | 90 | **100** | = 100 ✅ |
| FCP | 0,8 s | 0,8 s | — |
| LCP | 2,5 s | 2,3 s | — |
| TBT | 1.440 ms | **0–10 ms** | — |
| CLS | 0 | 0,002 | < 0,05 ✅ |
| Speed Index | 2,4 s | **0,8 s** | — |

A tarefa longa de 1.482 ms sumiu; a maior agora tem 52–61 ms (runtime do React). A causa era a repintura contínua do SVG de tela cheia do hero (nuvens, estrelas e vaga-lumes animados dentro dele), somada ao `backdrop-filter` em todos os painéis.

Página de projeto (`/en/projects/sdd-maestri`): Performance 98, Acessibilidade 100, SEO 100, CLS 0,002, TBT 0 ms.
