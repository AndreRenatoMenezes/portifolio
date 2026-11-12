# 001 — Performance de carregamento e SEO

- **Domínio:** infra
- **Status:** concluída (2026-11-07)
- **Autor:** Spec Architect
- **Data:** 2026-11-07

## Problema

O portfólio funciona e tem personalidade, mas foi construído priorizando a experiência, não a descoberta. Uma auditoria do build de produção (`next build`, HTML de `/pt`) mostrou que:

1. **Buscadores não enxergam os projetos.** A home só escreve no HTML o projeto selecionado no inventário. Dos 4 projetos, 3 não aparecem como texto (só em `aria-label`), e **não existe nenhum link** da home para as páginas `/pt/projects/*`: o link "Ver detalhes" só é criado quando o modal abre. As páginas de projeto ficam órfãs.
2. **Falta a base técnica de SEO.** `/robots.txt` e `/sitemap.xml` dão 404. As URLs alternativas (`hreflang`) são relativas, não há `canonical` nem `x-default`, e o compartilhamento social não tem imagem (`twitter:card` = `summary`, sem `og:image`). O favicon ainda é o padrão do Next.
3. **Há trabalho desnecessário no carregamento e na interação.** O proxy de idioma intercepta todas as páginas, inclusive `/pt` e `/en`, que já têm idioma. A fada roda um loop de animação contínuo mesmo parada. Algumas animações forçam recálculo de layout a cada frame ou continuam rodando invisíveis. O desfoque de fundo (`backdrop-filter`) está em todos os painéis. Uma variação da fonte de títulos é baixada e nunca usada.

## Objetivo

Fazer cada projeto ser encontrável e bem apresentado em buscadores e redes sociais, e reduzir o custo de carregar e usar o site, **sem perder nenhuma das interações** (inventário, modal, fada, gemas, tema, melodia).

## Quem se beneficia

- **Recrutadores e visitantes** que chegam por busca ou por link compartilhado (LinkedIn, WhatsApp): veem título, descrição e imagem corretos.
- **Visitantes em celular**: menos bateria e CPU gastos por animações.
- **André**: cada projeto ganha uma página indexável própria.

## Critérios de aceite

### SEO

- **CA-01** O HTML da home, sem JavaScript, contém o título dos 4 projetos como texto visível e 4 links `<a href>` para as páginas de projeto do mesmo idioma.
- **CA-02** O clique em um item do inventário continua abrindo o modal "Você obteve…". Abrir o link em nova aba ou sem JavaScript leva à página do projeto.
- **CA-03** `/robots.txt` responde 200 e aponta para o sitemap.
- **CA-04** `/sitemap.xml` responde 200 e lista as 2 homes e as 8 páginas de projeto, com as alternativas de idioma de cada uma.
- **CA-05** Toda página tem `canonical` absoluto, `hreflang` absoluto para `pt` e `en` e `x-default` apontando para `/`.
- **CA-06** Home e páginas de projeto têm `og:image` absoluto com 1200×630, e `twitter:card` = `summary_large_image`.
- **CA-07** A home publica dados estruturados de **pessoa** (nome, cargo, local, perfis sociais). Cada página de projeto publica dados estruturados do **projeto** (nome, descrição, linguagens, repositório quando público).
- **CA-08** O ícone da aba é próprio do site (não o padrão do Next) e existe ícone para iOS.
- **CA-09** O `<h1>` da home separa nome e cargo. O rótulo da navegação principal está no idioma da página.
- **CA-10** O domínio de produção vem de uma variável de ambiente. Sem ela, o site continua funcionando em localhost.

### Performance

- **CA-11** Requisições para `/pt`, `/en` e suas subpáginas **não** passam pelo proxy. A detecção de idioma continua funcionando em `/` e em caminhos sem idioma.
- **CA-12** Com a fada parada no seu lugar, nenhum loop de animação dela fica rodando. O loop volta sozinho quando ela precisa se mover.
- **CA-13** Nenhuma animação contínua altera propriedades que forçam layout (`inset`, `width`, `top`…). Estrelas e vaga-lumes não animam enquanto estão invisíveis (tema dia e templo).
- **CA-14** Só header, modal e toast usam `backdrop-filter`.
- **CA-15** Só são baixados os pesos de fonte usados de fato.
- **CA-16** Cada imagem reserva o espaço com a proporção real dela (sem salto de layout ao carregar), inclusive o banner 1200×340 do SDD Maestri.
- **CA-17** O bundle do cliente não inclui dicionários inteiros: só os textos necessários.

### Metas medidas

- **CA-18** Lighthouse mobile (home `/pt` em build de produção): SEO = 100, Acessibilidade ≥ 95, Performance ≥ 95, CLS < 0,05. Registrar o antes e o depois.

## Fora de escopo

- Trocar as capas ilustradas por prints reais (está no INBOX).
- Mudar o visual, os textos ou as interações.
- Blog, RSS e analytics.
- Escolher ou comprar o domínio. Esta feature só lê o domínio de uma variável de ambiente.

## Perguntas em aberto

- **Domínio de produção:** qual será? Até definir, usa a URL de produção que a Vercel fornece automaticamente.
