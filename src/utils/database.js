// src/utils/database.js
// Camada de persistência usando AsyncStorage (simula banco de dados local offline)

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  BOOKS: '@bookswap:books',
  REQUESTS: '@bookswap:requests',
  USER: '@bookswap:user',
};

// Gera ID simples sem dependência externa
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// ─── LIVROS ───────────────────────────────────────────────

export const getAllBooks = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Erro ao buscar livros:', e);
    return [];
  }
};

export const addBook = async (book) => {
  try {
    const books = await getAllBooks();
    const newBook = {
      ...book,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'disponivel', // disponivel | reservado | trocado
    };
    books.push(newBook);
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
    return newBook;
  } catch (e) {
    console.error('Erro ao adicionar livro:', e);
    throw e;
  }
};

export const updateBook = async (id, updates) => {
  try {
    const books = await getAllBooks();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Livro não encontrado');
    books[index] = { ...books[index], ...updates, updatedAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
    return books[index];
  } catch (e) {
    console.error('Erro ao atualizar livro:', e);
    throw e;
  }
};

export const deleteBook = async (id) => {
  try {
    const books = await getAllBooks();
    const filtered = books.filter((b) => b.id !== id);
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Erro ao deletar livro:', e);
    throw e;
  }
};

export const getBookById = async (id) => {
  const books = await getAllBooks();
  return books.find((b) => b.id === id) || null;
};

// ─── SOLICITAÇÕES DE TROCA ────────────────────────────────

export const getAllRequests = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.REQUESTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const addRequest = async (request) => {
  try {
    const requests = await getAllRequests();
    const newRequest = {
      ...request,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'pendente', // pendente | aceito | recusado
    };
    requests.push(newRequest);
    await AsyncStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
    return newRequest;
  } catch (e) {
    throw e;
  }
};

export const updateRequest = async (id, updates) => {
  try {
    const requests = await getAllRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Solicitação não encontrada');
    requests[index] = { ...requests[index], ...updates };
    await AsyncStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
    return requests[index];
  } catch (e) {
    throw e;
  }
};

export const deleteRequest = async (id) => {
  try {
    const requests = await getAllRequests();
    const filtered = requests.filter((r) => r.id !== id);
    await AsyncStorage.setItem(KEYS.REQUESTS, JSON.stringify(filtered));
  } catch (e) {
    throw e;
  }
};

// ─── PERFIL DO USUÁRIO ────────────────────────────────────

export const getUser = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (e) {
    throw e;
  }
};

// Seed com dados de exemplo para demonstração
export const seedDatabase = async () => {
  const existing = await getAllBooks();
  if (existing.length > 0) return;

  const sampleBooks = [
    {
      title: 'Node.js: The Right Way',
      author: 'Jim R. Wilson',
      category: 'Tecnologia',
      condition: 'Ótimo',
      description: 'Ótima introdução ao Node.js com foco em boas práticas. Sem marcações.',
      ownerName: 'Julio Cartier',
      ownerContact: '(47) 98800-1234',
      status: 'disponivel',
    },
    {
      title: 'Node.js Design Patterns',
      author: 'Mario Casciaro',
      category: 'Tecnologia',
      condition: 'Bom',
      description: 'Cobre padrões de projeto aplicados ao Node.js. Ótimo para quem já tem base.',
      ownerName: 'Julio Cartier',
      ownerContact: '(47) 98800-1234',
      status: 'disponivel',
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Tecnologia',
      condition: 'Bom',
      description: 'Ótimo livro sobre boas práticas de programação. Algumas marcações a lápis.',
      ownerName: 'Carlos Silva',
      ownerContact: '(47) 99999-0001',
      status: 'disponivel',
    },
    {
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      category: 'Literatura',
      condition: 'Ótimo',
      description: 'Edição completa em um volume. Capa dura, sem danos.',
      ownerName: 'Ana Costa',
      ownerContact: '(47) 99999-0002',
      status: 'disponivel',
    },
    {
      title: 'Cálculo Vol. 1',
      author: 'James Stewart',
      category: 'Educação',
      condition: 'Regular',
      description: 'Alguns grifos nas primeiras páginas. Conteúdo intacto.',
      ownerName: 'Pedro Oliveira',
      ownerContact: '(47) 99999-0003',
      status: 'disponivel',
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      category: 'História',
      condition: 'Ótimo',
      description: 'Leitura incrível! Muito bem conservado.',
      ownerName: 'Julia Mendes',
      ownerContact: '(47) 99999-0004',
      status: 'disponivel',
    },
  ];

  for (const book of sampleBooks) {
    await addBook(book);
  }
};
