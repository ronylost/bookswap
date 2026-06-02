# BookSwap — Troca de Livros entre Estudantes

**Disciplina:** Programação para Dispositivos Móveis em Android  
**Professor:** Julio Cartier  
**Instituição:** Univille  

---

## Aluno

**Rony Nelson da Silva**  
Curso: Sistemas de Informação — 7º Semestre  
Matrícula: 202303041519  

---

## Descrição do Problema Social

Todo semestre é a mesma história: os livros indicados custam caro, e depois que você termina de usar, ficam parados na estante sem servir pra ninguém. Ao mesmo tempo, outros alunos precisam desses mesmos livros e não têm dinheiro pra comprar.

O **BookSwap** nasceu dessa situação. A ideia é simples: um app onde estudantes cadastram os livros que não usam mais e podem trocar com outros colegas. Sem custo, sem intermediário, direto entre aluno e aluno.

O impacto é real — reduz o gasto com material didático, evita desperdício e cria uma rede de colaboração dentro da própria instituição.

---

## Tecnologias

- React Native + Expo SDK 54
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage (banco de dados local, funciona offline)
- Expo Vector Icons

---

## Requisitos Técnicos Atendidos

**Framework:** React Native com Expo  
**Navegação:** Stack Navigator + Bottom Tab Navigator  
**Persistência:** AsyncStorage — banco local offline, sem necessidade de internet  

**CRUD completo:**
- **Create:** Cadastrar livro, criar solicitação de troca
- **Read:** Listar livros, buscar por título/autor, filtrar por categoria, ver detalhes
- **Update:** Editar dados do livro, atualizar status da solicitação, editar perfil
- **Delete:** Excluir livro, remover solicitação

---

## Estrutura do Projeto

```
BookSwap/
├── App.js
├── app.json
├── package.json
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js         # Navegação principal
│   ├── screens/
│   │   ├── HomeScreen.js           # Listagem com busca e filtro
│   │   ├── BookDetailScreen.js     # Detalhes + solicitar troca
│   │   ├── AddBookScreen.js        # Cadastrar livro
│   │   ├── EditBookScreen.js       # Editar / deletar livro
│   │   ├── MyBooksScreen.js        # Meus livros
│   │   ├── RequestsScreen.js       # Solicitações de troca
│   │   └── ProfileScreen.js        # Perfil do usuário
│   ├── components/
│   │   └── BookCard.js
│   ├── hooks/
│   │   ├── useBooks.js
│   │   └── useRequests.js
│   └── utils/
│       └── database.js             # Camada AsyncStorage
```

---

## Como Rodar

### Pré-requisitos

- Node.js v20.19 ou superior (importante — versões mais antigas causam erro)
- Expo Go instalado no celular — versão SDK 54
- Celular e computador na **mesma rede Wi-Fi** (obrigatório para o app conectar)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ronyNelson/bookswap.git
cd bookswap

# Instale as dependências
npm install --legacy-peer-deps

# Inicie
npx expo start --clear
```

Depois é só abrir o Expo Go no celular e escanear o QR Code que aparece no terminal.

> Se aparecer erro de conexão, confirme que o celular e o computador estão na mesma rede Wi-Fi. Isso é o problema mais comum.

---

## Dificuldades no Desenvolvimento

Esse projeto deu bastante trabalho principalmente na parte de configuração do ambiente, e acho válido documentar porque pode ajudar quem tentar rodar depois.

**Compatibilidade de SDK:**  
O maior perrengue foi alinhar a versão do Expo Go no celular com a versão do SDK do projeto. A cada tentativa o app reclamava de incompatibilidade — ora o SDK do projeto estava abaixo, ora acima do que o Expo Go esperava. A versão que funcionou foi o **SDK 54** com **React Native 0.81.5** e **Node.js v20.20+**.

**Nova Arquitetura do React Native:**  
O React Native 0.76+ ativou a Nova Arquitetura por padrão (TurboModules). Isso causava o erro `PlatformConstants could not be found` no Expo Go. Levou um tempo até entender que era um problema de incompatibilidade entre a versão do JS bundle e o que o Expo Go esperava — a solução foi garantir que o SDK do projeto batesse exatamente com o SDK do Expo Go instalado no celular.

**EMFILE — too many open files:**  
Em determinado momento o Metro Bundler parou de funcionar com erro de limite de arquivos abertos do sistema. A solução foi instalar o Watchman via Homebrew e ajustar o limite do macOS:
```bash
brew install watchman
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65536
ulimit -n 65536
```

**Node.js desatualizado:**  
O Node.js v20.8.0 que eu tinha instalado não era compatível com os pacotes do SDK 54. Foi necessário atualizar para v20.20+ via nvm.

**Recomendação geral:**  
Se for rodar esse projeto do zero, garanta primeiro que tem o Node.js v20.19 ou superior, o Expo Go SDK 54 no celular, e que celular e computador estão na mesma rede Wi-Fi. Isso resolve 90% dos problemas.

---

## Funcionalidades

| Tela | O que faz |
|------|-----------|
| Início | Lista livros disponíveis, busca por texto, filtra por categoria |
| Detalhes | Informações do livro + botão para solicitar troca |
| Meus Livros | Livros que você cadastrou, com status de disponibilidade |
| Adicionar | Formulário para cadastrar um livro novo |
| Editar | Atualiza dados ou exclui o livro |
| Trocas | Gerencia solicitações enviadas e recebidas |
| Perfil | Seus dados de contato e estatísticas |

---

## Observações

- O banco de dados é 100% local (AsyncStorage), funciona sem internet
- O app inicia com alguns livros de exemplo para demonstração
- Os dados persistem entre sessões
