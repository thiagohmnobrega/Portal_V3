# Portal GeHfer - Sistema de Gestão da Qualidade

Sistema web para gestão de não conformidades e controle de qualidade.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query
- Zustand
- Vitest
- Cypress
- PWA

## 📋 Pré-requisitos

- Node.js 20+
- npm 9+

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/sua-org/portal-gehfer.git

# Entre no diretório
cd portal-gehfer

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## ⚡ Scripts

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run test`: Executa testes unitários
- `npm run test:e2e`: Executa testes E2E
- `npm run test:coverage`: Gera relatório de cobertura
- `npm run docs`: Gera documentação

## 📦 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/      # Contextos React
├── pages/         # Páginas da aplicação
├── services/      # Serviços e APIs
├── stores/        # Estados globais (Zustand)
├── test/          # Configuração e testes
├── types/         # Tipos TypeScript
└── utils/         # Funções utilitárias
```

## 🔍 Testes

O projeto utiliza:
- Vitest para testes unitários
- Testing Library para testes de componentes
- Cypress para testes E2E

## 📱 PWA

A aplicação é um Progressive Web App (PWA) com:
- Instalação na tela inicial
- Funcionamento offline
- Atualizações automáticas

## 📈 Monitoramento

- Sentry para monitoramento de erros
- Métricas de performance
- Rastreamento de sessão

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.