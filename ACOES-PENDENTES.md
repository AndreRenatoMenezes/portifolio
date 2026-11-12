# Ações pendentes (precisam de você)

Itens do checklist de lançamento que dependem de conta, dados pessoais ou decisão sua. O resto já foi feito ou está especificado em `.claude/specs/` (auditoria completa em `.claude/specs/AUDITORIA-2026-11-07.md`).

**Ordem sugerida:** T1 → T2 → T3 → T4 → T5 → T6 → T7. T8 é opcional.

| Task | O quê | Libera | Tempo |
|---|---|---|---|
| [T1](#t1--confirmar-dados-de-contato) | ✅ Concluída — e-mail e WhatsApp definidos | itens 11 e 19; spec 002 | — |
| [T2](#t2--publicar-na-vercel) | Publicar o site na Vercel | T3, T4 e T5 | 10 min |
| [T3](#t3--domínio-próprio-com-https) | Domínio próprio com HTTPS | item 21; URLs de SEO definitivas | 20 min + propagação |
| [T4](#t4--serviço-de-e-mail-do-formulário-resend) | Serviço de e-mail do formulário (Resend) | ativa o envio real do formulário (código pronto) | 15 min |
| [T5](#t5--google-analytics-ga4) | Criar o Google Analytics (GA4) | item 18; spec 003 | 10 min |
| [T6](#t6--revisar-a-política-de-privacidade) | Revisar a política de privacidade | item 15 (depois da spec 003) | 15 min |
| [T7](#t7--google-search-console-recomendado) | Google Search Console (recomendado) | indexação do sitemap | 10 min |
| [T8](#t8--prints-reais-dos-projetos-opcional) | Prints reais dos projetos (opcional) | capas melhores | — |

---

## T1 — Confirmar dados de contato

✅ **Concluída.** Valores em `src/content/profile.ts` → `contacts`.

- [x] **E-mail.** `andre@bragademenezes.com`.
- [x] **WhatsApp.** `5521972764096`.
- [x] **Mensagem inicial do WhatsApp.** Mantida a padrão: "Olá, André! Vi seu portfólio e queria conversar."

> Endereço físico: num portfólio pessoal, cidade + e-mail + WhatsApp bastam ("Rio de Janeiro" já aparece). Não recomendo publicar rua e número.

---

## T2 — Publicar na Vercel

O código já está no GitHub (`AndreRenatoMenezes/portifolio`, branch `main`).

1. Acesse <https://vercel.com/new> e entre com a sua conta do GitHub.
2. Em **Import Git Repository**, escolha `portifolio` → **Import**.
3. Deixe o preset **Next.js** e as opções padrão → **Deploy**.
4. Ao terminar, abra a URL `*.vercel.app` e confira a home, um projeto e a página 404.
5. (Opcional, mas ajuda nas próximas tasks) No terminal do projeto:
   ```bash
   npm i -g vercel
   vercel login
   vercel link        # escolha o projeto "portifolio"
   ```

A partir daqui, todo `git push` na `main` publica sozinho.

---

## T3 — Domínio próprio com HTTPS

1. **Escolha e compre o domínio.** Opções: comprar direto na Vercel (Dashboard → **Domains** → **Buy**), num registrador como o Registro.br (`.com.br`) ou em qualquer outro.
2. **Conecte ao projeto:** Vercel → projeto `portifolio` → **Settings → Domains → Add** → digite o domínio (ex.: `andremenezes.dev`). Adicione também o `www.` e deixe um redirecionando para o outro (a Vercel oferece isso na mesma tela).
3. **DNS** (só se o domínio não foi comprado na Vercel): no painel do registrador, crie **exatamente** os registros que a tela de Domains da Vercel mostrar (normalmente um `A` para o domínio raiz e um `CNAME` para o `www`). Use os valores da tela, não de tutoriais antigos.
4. **Espere** a Vercel marcar o domínio como **Valid Configuration**. O certificado HTTPS é emitido automaticamente, em geral em minutos; a propagação do DNS pode levar até 48 h.
5. **Defina a URL oficial do site:** Settings → **Environment Variables** → adicione `NEXT_PUBLIC_SITE_URL` = `https://seu-dominio` (sem barra no final) em **Production** → **Save**.
6. **Faça um redeploy:** Deployments → último deploy → **⋯ → Redeploy**. Sem isso, canonical, sitemap e imagem de compartilhamento continuam com a URL antiga.
7. **Confira:**
   - `https://seu-dominio/sitemap.xml` lista URLs com o domínio novo;
   - `http://seu-dominio` redireciona para `https://`.

---

## T4 — Serviço de e-mail do formulário (Resend)

O formulário da spec 002 envia as mensagens por e-mail pelo **Resend**, que veio como resultado da busca no Marketplace da Vercel. Depende da T2.

1. **Instale a integração:**
   - pelo painel: projeto → **Integrations** (ou <https://vercel.com/marketplace>) → busque **Resend** → **Install** → conecte ao projeto `portifolio`; ou
   - pelo terminal (com o `vercel link` da T2):
     ```bash
     vercel integration add resend/resend-email
     ```
   Se pedir login ou aceite no navegador, conclua por lá. Isso cria a variável `RESEND_API_KEY` no projeto.
2. **Remetente:**
   - **Com o domínio `bragademenezes.com` (recomendado):** para enviar como `contato@bragademenezes.com`, o domínio precisa estar verificado no Resend: painel do Resend → **Domains → Add Domain** → `bragademenezes.com` → crie no DNS os registros que ele mostrar (SPF/DKIM) → espere ficar **Verified**. Sem isso, o Resend recusa o envio.
   - **Sem domínio verificado (para começar):** use `onboarding@resend.dev`. Atenção: ele **só entrega para o e-mail da sua conta Resend**. Se a conta Resend não for `andre@bragademenezes.com`, as mensagens para o `CONTACT_TO` abaixo não chegam; nesse caso, verifique o domínio ou use temporariamente o e-mail da conta Resend como `CONTACT_TO`.
3. **Variáveis** (Vercel → Settings → Environment Variables, em Production e Preview):

   | Nome | Valor |
   |---|---|
   | `CONTACT_TO` | `andre@bragademenezes.com` |
   | `CONTACT_FROM` | com domínio verificado, `Portfólio <contato@bragademenezes.com>`; sem verificação, `Portfólio <onboarding@resend.dev>` (veja a limitação acima) |

4. **Redeploy** (Deployments → **⋯ → Redeploy**). O código do envio já está pronto e liga sozinho quando as três variáveis existem.
5. **Teste:** mande uma mensagem pelo formulário do site. Ela deve chegar no `CONTACT_TO`, e "Responder" deve ir para o e-mail de quem escreveu. Se aparecer o erro geral, veja Vercel → **Logs**, procurando por `[contato]`. Para testar localmente:
   ```bash
   vercel env pull .env.local --yes
   npm run dev
   ```

> Nunca cole a `RESEND_API_KEY` no chat nem a commite. Ela fica só na Vercel e no `.env.local` (que o `.gitignore` já ignora).

---

## T5 — Google Analytics (GA4)

1. Acesse <https://analytics.google.com> com a sua conta Google.
2. **Admin** (engrenagem) → **Criar → Propriedade**. Nome: "Portfólio"; fuso: São Paulo; moeda: Real.
3. Em **Coleta de dados**, escolha **Web** → URL do site (o domínio da T3, ou a URL `vercel.app` por enquanto) → nome do fluxo "Site".
4. Deixe a **Medição otimizada** ligada. Ela registra as trocas de página do site.
5. Copie o **ID da métrica** (`G-XXXXXXXXXX`).
6. Vercel → Settings → Environment Variables → `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX` em **Production** → **Save** → **Redeploy**.
7. (Recomendado) Admin → **Coleta e retenção de dados → Retenção** → 14 meses. Desligue **Google Signals** se não precisar de dados demográficos (menos dados pessoais).
8. Depois da spec 003 no ar: abra o site, **aceite os cookies**, navegue e confira em **Relatórios → Tempo real**.

> Sem `NEXT_PUBLIC_GA_ID`, o site não carrega nada do Google e não mostra o aviso de cookies. Isso é intencional.

---

## T6 — Revisar a política de privacidade

Depois que a spec 003 for implementada:

1. Leia `/pt/privacy` e `/en/privacy` no site (o texto fica em `src/content/privacy.ts`).
2. Confira se tudo bate com a realidade: e-mail de contato, serviços usados e prazo de guarda das mensagens.
3. Se houver obrigação profissional ou empresarial (ex.: o site citar o seu empregador), considere uma revisão jurídica. O texto gerado é um ponto de partida, não assessoria jurídica.
4. Me mande os ajustes no chat ou edite o arquivo direto.

---

## T7 — Google Search Console (recomendado)

Ajuda o Google a indexar o site mais rápido e mostra erros de SEO. Depende da T3.

1. Acesse <https://search.google.com/search-console> → **Adicionar propriedade** → **Domínio** → digite o domínio.
2. Crie no DNS o registro `TXT` de verificação que ele mostrar → **Verificar**.
3. Menu **Sitemaps** → envie `https://seu-dominio/sitemap.xml`.
4. Em **Inspeção de URL**, teste a home e peça a indexação.

---

## T8 — Prints reais dos projetos (opcional)

As capas atuais são ilustrações. Para trocar:

1. Tire os prints (PNG ou WebP, de preferência 1600×1000 ou maior).
2. Salve em `public/projects/<slug>/` (ex.: `public/projects/openweddy/1.png`).
3. Em `src/content/projects.ts`, troque `src`, `width` e `height` da imagem e ajuste o `alt`.

O `next/image` otimiza tamanho e formato sozinho.
