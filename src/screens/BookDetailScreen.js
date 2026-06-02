// src/screens/BookDetailScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getBookById } from '../utils/database';
import { useRequests } from '../hooks/useRequests';
import { getUser } from '../utils/database';

export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const { createRequest } = useRequests();

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    setLoading(true);
    const b = await getBookById(bookId);
    setBook(b);
    setLoading(false);
  };

  const handleRequestSwap = async () => {
    const user = await getUser();
    if (!user || !user.name) {
      Alert.alert(
        'Perfil incompleto',
        'Por favor, preencha seu nome no Perfil antes de solicitar uma troca.',
        [{ text: 'Ir ao Perfil', onPress: () => navigation.navigate('Perfil') }]
      );
      return;
    }

    Alert.alert(
      'Solicitar Troca',
      `Deseja solicitar o livro "${book.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setRequesting(true);
            try {
              await createRequest({
                bookId: book.id,
                bookTitle: book.title,
                bookAuthor: book.author,
                ownerName: book.ownerName,
                ownerContact: book.ownerContact,
                requesterName: user.name,
                requesterContact: user.contact || '',
              });
              Alert.alert(
                'Solicitação Enviada! 🎉',
                `Sua solicitação para "${book.title}" foi registrada. Entre em contato com ${book.ownerName} pelo número ${book.ownerContact}.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível enviar a solicitação.');
            } finally {
              setRequesting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Livro não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do Livro</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Capa / Ícone grande */}
        <View style={styles.bookCover}>
          <Ionicons name="book" size={72} color="#e94560" />
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author}</Text>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Ionicons name="grid-outline" size={13} color="#e94560" />
              <Text style={styles.tagText}>{book.category}</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="star-outline" size={13} color="#e94560" />
              <Text style={styles.tagText}>Estado: {book.condition}</Text>
            </View>
          </View>

          {book.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.sectionText}>{book.description}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dono do Livro</Text>
            <View style={styles.ownerCard}>
              <View style={styles.ownerAvatar}>
                <Ionicons name="person" size={24} color="#e94560" />
              </View>
              <View>
                <Text style={styles.ownerName}>{book.ownerName}</Text>
                <Text style={styles.ownerContact}>{book.ownerContact}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cadastrado em</Text>
            <Text style={styles.sectionText}>
              {new Date(book.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão de ação fixo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.requestButton, requesting && styles.requestButtonDisabled]}
          onPress={handleRequestSwap}
          disabled={requesting}
        >
          {requesting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="swap-horizontal" size={20} color="#ffffff" />
              <Text style={styles.requestButtonText}>Solicitar Troca</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051d2e' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#072a47',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0e4272',
  },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  bookCover: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#072a47',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: '#0e4272',
  },
  infoCard: { padding: 20 },
  bookTitle: { color: '#ffffff', fontSize: 22, fontWeight: '700', marginBottom: 6 },
  bookAuthor: { color: '#7ab8d9', fontSize: 15, marginBottom: 16 },
  tagsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#072a47',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#0e4272',
  },
  tagText: { color: '#ccccdd', fontSize: 12, fontWeight: '500' },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#e94560', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  sectionText: { color: '#7ab8d9', fontSize: 14, lineHeight: 22 },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#072a47',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0e4272',
  },
  ownerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0e4272',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerName: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  ownerContact: { color: '#7ab8d9', fontSize: 13, marginTop: 2 },
  footer: { padding: 16, paddingBottom: 24, backgroundColor: '#051d2e', borderTopWidth: 1, borderTopColor: '#072a47' },
  requestButton: {
    backgroundColor: '#e94560',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  requestButtonDisabled: { opacity: 0.6 },
  requestButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  errorText: { color: '#ffffff', textAlign: 'center', marginTop: 40 },
});
