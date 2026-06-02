// src/screens/HomeScreen.js

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';

const CATEGORIES = ['Todos', 'Tecnologia', 'Literatura', 'Educação', 'História', 'Ciências', 'Outros'];

export default function HomeScreen({ navigation }) {
  const { books, loading, loadBooks } = useBooks();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'Todos' || b.category === selectedCategory;
      return matchSearch && matchCategory && b.status === 'disponivel';
    });
  }, [books, search, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#072a47" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>BookSwap 📚</Text>
          <Text style={styles.headerSub}>Troque conhecimento</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{filtered.length}</Text>
          <Text style={styles.badgeLabel}>livros</Text>
        </View>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#5a9fd4" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título ou autor..."
          placeholderTextColor="#5a9fd4"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#5a9fd4" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtro de categorias */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(item) => item}
        style={styles.categoryList}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, selectedCategory === item && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Lista de livros */}
      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadBooks} tintColor="#e94560" />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={48} color="#0a3055" />
              <Text style={styles.emptyText}>Nenhum livro encontrado</Text>
              <Text style={styles.emptySubText}>Tente outro termo ou categoria</Text>
            </View>
          }
          renderItem={({ item }) => (
            <BookCard book={item} onPress={() => navigation.navigate('BookDetail', { bookId: item.id })} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051d2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 13,
    color: '#5a9fd4',
    marginTop: 2,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#072a47',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#0e4272',
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e94560',
  },
  badgeLabel: {
    fontSize: 11,
    color: '#5a9fd4',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#072a47',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#0e4272',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  categoryList: {
    marginVertical: 8,
    maxHeight: 44,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#072a47',
    borderWidth: 1,
    borderColor: '#0e4272',
  },
  categoryChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  categoryText: {
    color: '#5a9fd4',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubText: {
    color: '#5a9fd4',
    fontSize: 13,
    marginTop: 4,
  },
});
