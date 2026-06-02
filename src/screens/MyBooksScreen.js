// src/screens/MyBooksScreen.js

import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/BookCard';

const STATUS_LABEL = {
  disponivel: { label: 'Disponível', color: '#10b981' },
  reservado: { label: 'Reservado', color: '#f59e0b' },
  trocado: { label: 'Trocado', color: '#6b7280' },
};

export default function MyBooksScreen({ navigation }) {
  const { books, loading, loadBooks } = useBooks();

  useFocusEffect(
    React.useCallback(() => {
      loadBooks();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meus Livros</Text>
          <Text style={styles.headerSub}>{books.length} livro{books.length !== 1 ? 's' : ''} cadastrado{books.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBook')}
        >
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Legenda de status */}
      <View style={styles.legend}>
        {Object.entries(STATUS_LABEL).map(([key, val]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: val.color }]} />
            <Text style={styles.legendText}>{val.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="library-outline" size={48} color="#0a3055" />
              <Text style={styles.emptyText}>Nenhum livro cadastrado</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('AddBook')}>
                <Text style={styles.emptyButtonText}>+ Adicionar livro</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View>
              {/* Badge de status sobre o card */}
              <View style={styles.statusRow}>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_LABEL[item.status]?.color + '22' }]}>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_LABEL[item.status]?.color }]} />
                  <Text style={[styles.statusText, { color: STATUS_LABEL[item.status]?.color }]}>
                    {STATUS_LABEL[item.status]?.label}
                  </Text>
                </View>
              </View>
              <BookCard
                book={item}
                compact
                onPress={() => navigation.navigate('EditBook', { bookId: item.id })}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051d2e' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#ffffff' },
  headerSub: { fontSize: 13, color: '#5a9fd4', marginTop: 2 },
  addButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#e94560', alignItems: 'center', justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row', gap: 16, paddingHorizontal: 20, marginBottom: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#5a9fd4', fontSize: 12 },
  listContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 20 },
  statusRow: { marginBottom: 4 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#ffffff', fontSize: 16, marginTop: 12, fontWeight: '600', marginBottom: 20 },
  emptyButton: {
    backgroundColor: '#e94560', borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 12,
  },
  emptyButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
});
