# 🚀 TalentMatch - Smart Recruiting & IT Matcher (Next.js + TypeScript)

Aplicação web desenvolvida com **Next.js 14+ (App Router)**, **TypeScript** e **Tailwind CSS** para triagem inteligente e cálculo de compatibilidade ponderada entre perfis de candidatos e requisitos de vagas em TI.

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)** (App Router & React Server/Client Components)
- **[TypeScript](https://www.typescriptlang.org/)** (Tipagem estrita para segurança de dados)
- **[Tailwind CSS](https://tailwindcss.com/)** (Design responsivo e consistente com o layout original)
- **LocalStorage API** (Persistência automática no navegador)

---

## 🧮 Lógica de Cálculo do Score Ponderado

A pontuação é calculada proporcionalmente ao peso atribuído a cada habilidade requerida:

$$\text{Score (\%)} = \text{round}\left( \frac{\sum \text{Pesos das Skills Compatíveis}}{\sum \text{Pesos de Todas as Skills da Vaga}} \times 100 \right)$$

### 🎨 Classificação de Resultados
- **Alto Match (Verde)**: $\ge 70\%$
- **Médio Match (Amarelo)**: $40\% \text{ a } 69\%$
- **Baixo Match (Vermelho)**: $< 40\%$

---

## 📁 Estrutura do Projeto

```
├── app/
│   ├── layout.tsx         # Layout base Next.js
│   ├── page.tsx           # Dashboard interativo com tabs e estados
│   └── globals.css        # Estilização global e Tailwind directives
├── components/
│   ├── Sidebar.tsx        # Navegação lateral com badges
│   ├── Header.tsx         # Título e status dinâmicos por tab
│   ├── StatsSummary.tsx   # Painel de métricas (KPIs de triagem)
│   ├── JobForm.tsx        # Cadastro de vagas com pesos de skill (P1 a P5)
│   ├── CandidateForm.tsx  # Processamento de perfil de candidato
│   ├── MatchResultCard.tsx# Exibição de compatibilidade e gap analysis
│   └── QuickTemplates.tsx # Botões de demonstração rápida
├── lib/
│   └── matcher.ts         # Algoritmo de correspondência ponderada
├── types/
│   └── index.ts           # Interfaces TypeScript (Skill, Job, Candidate, MatchResult)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 📦 Como Executar o Projeto

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no computador.
2. No terminal da pasta do projeto, instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse no navegador: **`http://localhost:3000`**
