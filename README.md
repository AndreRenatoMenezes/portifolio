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

## Deploy

Suba o repositório no GitHub e importe na Vercel (sem configuração extra).
