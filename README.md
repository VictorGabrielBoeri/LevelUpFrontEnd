# 🎮 Game Finder

Uma ferramenta web moderna para ajudar usuários a escolherem jogos baseado em suas preferências de gênero, plataforma e especificações do computador.

## ✨ Funcionalidades

- **Interface Responsiva**: Design moderno e intuitivo que funciona perfeitamente em desktop e mobile
- **Filtros Inteligentes**: Selecione gêneros, plataforma (PC/Navegador) e especifique a RAM disponível
- **Recomendações Aleatórias**: O sistema escolhe um jogo aleatório entre os que atendem aos critérios
- **Integração com API**: Utiliza a API Free-To-Play Games Database para dados atualizados
- **Detalhes Completos**: Exibe informações do jogo, requisitos mínimos e links para jogar
- **Feedback Amigável**: Mensagens claras quando nenhum jogo é encontrado

## 🛠️ Tecnologias Utilizadas

- **Vue.js 3** - Framework progressivo para interfaces
- **TypeScript** - Tipagem estática para melhor desenvolvimento
- **Pinia** - Gerenciamento de estado moderno
- **Vue Router** - Roteamento para SPA
- **Axios** - Cliente HTTP para chamadas da API
- **CSS Moderno** - Estilos responsivos com CSS custom properties

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd game-finder
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em `http://localhost:5173`

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run format` - Formata o código com Prettier
- `npm run lint` - Executa o linter ESLint

## 📁 Estrutura do Projeto

```
src/
├── assets/
│   └── main.css          # Estilos globais
├── components/
│   └── GameCard.vue      # Componente para exibir jogos
├── router/
│   └── index.ts          # Configuração do Vue Router
├── stores/
│   └── gameStore.ts      # Store Pinia para gerenciamento de estado
├── views/
│   └── HomeView.vue      # Página principal
├── App.vue               # Componente raiz
└── main.ts               # Ponto de entrada da aplicação
```

## 🔧 Funcionalidades Técnicas

### Gerenciamento de Estado (Pinia)
- Store centralizada para dados dos jogos
- Filtros reativos
- Estado de loading e erros
- Ações para buscar e filtrar jogos

### Integração com API
- Consumo da API Free-To-Play Games Database
- Busca de jogos e detalhes específicos
- Tratamento de erros robusto
- Cache de dados para melhor performance

### Interface Responsiva
- Design mobile-first
- CSS Grid e Flexbox
- Breakpoints para diferentes tamanhos de tela
- Componentes reutilizáveis

### Filtros Inteligentes
- Seleção múltipla de gêneros
- Filtro por plataforma (PC/Browser)
- Validação de RAM disponível
- Aplicação de filtros em tempo real

## 🎯 Como Usar

1. **Selecione Gêneros**: Escolha um ou mais gêneros de jogos que você gosta
2. **Escolha Plataforma**: Selecione PC, Navegador ou ambas
3. **Informe a RAM**: Digite a quantidade de RAM disponível no seu computador
4. **Encontre Jogos**: Clique em "Encontrar Jogo" para receber uma recomendação
5. **Jogue**: Use os links fornecidos para acessar o jogo recomendado

## 🔍 API Utilizada

O projeto utiliza a [Free-To-Play Games Database API](https://www.freetogame.com/api-doc) que fornece:

- Lista completa de jogos gratuitos
- Detalhes específicos de cada jogo
- Requisitos mínimos do sistema
- Links diretos para jogar

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:

- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (até 767px)

## 🎨 Design System

- **Cores**: Paleta moderna com gradientes
- **Tipografia**: Inter font para melhor legibilidade
- **Componentes**: Cards, botões e formulários consistentes
- **Animações**: Transições suaves e feedback visual

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🙏 Agradecimentos

- [Free-To-Play Games Database](https://www.freetogame.com/) pela API gratuita
- [Vue.js](https://vuejs.org/) pela excelente framework
- [Pinia](https://pinia.vuejs.org/) pelo gerenciamento de estado
