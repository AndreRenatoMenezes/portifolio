# Portfólio — André Menezes

Portfólio bilíngue (PT/EN) em Next.js 16 com tema de aventura inspirado em RPGs de 64 bits:
inventário de projetos, caixa de diálogo, fada companheira, ciclo dia/noite, gemas escondidas
e uma melodia secreta. Todos os desenhos e sons são originais (SVG/CSS e Web Audio).

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
```

## Editar conteúdo

| O quê | Onde |
| --- | --- |
| Projetos (slots) | `src/content/projects.ts` |
| Prints dos projetos | `public/projects/<slug>/` |
| Nome, bio, skills, experiência, contatos, CV | `src/content/profile.ts` |
| Textos da interface | `src/dictionaries/pt.json` e `en.json` |
| Cores dos temas | topo de `src/app/globals.css` |

Cada projeto gera a página `/<idioma>/projects/<slug>` automaticamente.

## Segredos

- 5 gemas escondidas pela página; com todas, o tema "templo" é desbloqueado.
- Melodia no teclado: ↑ ↓ ← → A (com som ligado, cada tecla toca uma nota).

## Variáveis de ambiente

Todas são opcionais; sem elas o site funciona (sem analytics e com o formulário avisando que o envio está indisponível). Veja `.env.example` e o passo a passo em `ACOES-PENDENTES.md`.

| Variável | Para quê |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL oficial (canonical, sitemap, Open Graph) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (o GA4 é configurado dentro dele), carregado só com consentimento |
| `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | envio do formulário de contato |

## Ícones

`node scripts/make-favicon.mjs` regenera `favicon.ico` e os ícones PWA a partir de `src/app/icon.svg`.

## Deploy

Suba o repositório no GitHub e importe na Vercel. Specs e decisões ficam em `.claude/specs/`.
