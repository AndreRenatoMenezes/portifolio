# Spec 008 — domínio apex: bragademenezes.com

2026-11-14. Escrita pelo Maestro em exceção estreita (feature de 1 WP + 1 executor; registrado em decisoes). Base: origin/main 07e2e40.

## Contexto

O usuário decidiu que o endereço canônico do site passa a ser `https://bragademenezes.com` (apex), no lugar do subdomínio `portifolio.bragademenezes.com`. O domínio já está adicionado no projeto Vercel. O endereço antigo deve continuar respondendo com redirect para o novo (config Vercel, lado do usuário). Produção atual (origin/main 07e2e40) contém as specs 006 + 007.

## Fora de escopo

- DNS e configuração de domínio/redirect no Vercel (usuário).
- Merge, push e PR (autorização do usuário; git é da Sentinela).
- Qualquer mudança visual ou de conteúdo além da URL.

## Contrato

- DP-01: o site trata `https://bragademenezes.com` como origem canônica (sem `www`, seguindo o padrão de barra final já existente no código).
- DP-02: nenhuma ocorrência de `portifolio.bragademenezes.com` permanece no repositório versionado (código, docs, env de exemplo). Menções históricas em logs de specs antigas dentro de `.claude/specs/**` não precisam ser reescritas — o grep vale para o código-fonte e docs operacionais (README, ACOES-PENDENTES).
- DP-03: se a URL do site for derivada de variável de ambiente (ex.: `NEXT_PUBLIC_SITE_URL`), o `.env.example` reflete o novo domínio e `ACOES-PENDENTES.md` registra a verificação do valor configurado no Vercel (ação do usuário).

## Critérios de aceite (binários)

- CA-01: `grep -rn "portifolio.bragademenezes.com" --exclude-dir=.git --exclude-dir=ref` sobre o working tree retorna 0 linhas em código-fonte, README.md, ACOES-PENDENTES.md e .env.example.
- CA-02: URLs de canonical/Open Graph/sitemap/JSON-LD/metadataBase usam `https://bragademenezes.com`, coerentes entre si.
- CA-03: `npm run lint`, `npx tsc --noEmit` e `npm run build` com exit 0.
- CA-04: chaves de dicionário pt/en inalteradas (paridade mantida; diff não toca chaves).
- CA-05 (Lupa, pós-merge em produção): `curl -I https://portifolio.bragademenezes.com` responde 301/308 com `Location` apontando para `https://bragademenezes.com/...`; `https://bragademenezes.com` responde 200.
- CA-06: se houver ação pendente do usuário no Vercel (variável de ambiente, confirmação de redirect), `ACOES-PENDENTES.md` a registra.

## Partição

- WP-29 (Forja): todas as ocorrências do domínio no repo. Possui: os arquivos que o grep apontar (metadata/layout/sitemap/JSON-LD/content, README.md, ACOES-PENDENTES.md, .env.example). Executor não faz git.
- WP-30 (Lupa): revisão por diff + CA-05 em produção depois do merge.
- WP-31 (Sentinela): commits por caminhos explícitos; push/PR só com autorização do usuário.
