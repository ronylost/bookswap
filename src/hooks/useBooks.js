// src/hooks/useBooks.js

import { useState, useEffect, useCallback } from 'react';
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  seedDatabase,
} from '../utils/database';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      await seedDatabase();
      const data = await getAllBooks();
      setBooks(data);
      setError(null);
    } catch (e) {
      setError('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const createBook = async (bookData) => {
    const newBook = await addBook(bookData);
    setBooks((prev) => [...prev, newBook]);
    return newBook;
  };

  const editBook = async (id, updates) => {
    const updated = await updateBook(id, updates);
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  };

  const removeBook = async (id) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    books,
    loading,
    error,
    loadBooks,
    createBook,
    editBook,
    removeBook,
  };
}
