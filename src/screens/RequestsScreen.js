// src/screens/RequestsScreen.js

import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRequests } from '../hooks/useRequests';

const STATUS_CONFIG = {
  pendente: { label: 'Pendente', color: '#f59e0b', icon: 'time-outline' },
  aceito: { label: 'Aceito', color: '#10b981', icon: 'checkmark-circle-outline' },
  recusado: { label: 'Recusado', color: '#ef4444', icon: 'close-circle-outline' },
};

export default function RequestsScreen() {
  const { requests, loading, loadRequests, editRequest, removeRequest } = useRequests();

  useFocusEffect(
    React.useCallback(() => {
      loadRequests();
    }, [])
  );

  const handleUpdateStatus = (id, newStatus) => {
    Alert.alert('Atualizar Status', `Marcar como "${STATUS_CONFIG[newStatus].label}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: () => editRequest(id, { status: newStatus }) },
    ]);
  };

  const handleDelete = (id, title) => {
    Alert.alert('Excluir Solicitação', `Remover solicitação para "${title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removeRequest(id) },
    ]);
  };

  const renderItem = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pendente;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.bookInfo}>
            <Ionicons name="book-outline" size={16} color="#e94560" />
            <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.color + '22' }]}>
            <Ionicons name={cfg.icon} size={12} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        <Text style={styles.bookAuthor}>{item.bookAuthor}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="arrow-up-circle-outline" size={12} color="#5a9fd4" />
          <Text style={styles.infoText}>Solicitante: {item.requesterName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-circle-outline" size={12} color="#5a9fd4" />
          <Text style={styles.infoText}>Dono: {item.ownerName}</Text>
        </View>
        {item.ownerContact ? (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={12} color="#5a9fd4" />
            <Text style={styles.infoText}>Contato: {item.ownerContact}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={12} color="#5a9fd4" />
          <Text style={styles.infoText}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          {item.status === 'pendente' && (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#10b98122', borderColor: '#10b981' }]}
                onPress={() => handleUpdateStatus(item.id, 'aceito')}
              >
                <Ionicons name="checkmark" size={14} color="#10b981" />
                <Text style={[styles.actionText, { color: '#10b981' }]}>Aceitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#ef444422', borderColor: '#ef4444' }]}
                onPress={() => handleUpdateStatus(item.id, 'recusado')}
              >
                <Ionicons name="close" size={14} color="#ef4444" />
                <Text style={[styles.actionText, { color: '#ef4444' }]}>Recusar</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#5a9fd422', borderColor: '#5a9fd4' }]}
            onPress={() => handleDelete(item.id, item.bookTitle)}
          >
            <Ionicons name="trash-outline" size={14} color="#5a9fd4" />
            <Text style={[styles.actionText, { color: '#5a9fd4' }]}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solicitações de Troca</Text>
        <Text style={styles.headerSub}>{requests.length} solicitaç{requests.length === 1 ? 'ão' : 'ões'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={loadRequests}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="swap-horizontal-outline" size={48} color="#0a3055" />
              <Text style={styles.emptyText}>Nenhuma solicitação ainda</Text>
              <Text style={styles.emptySubText}>As trocas aparecerão aqui</Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051d2e' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#ffffff' },
  headerSub: { fontSize: 13, color: '#5a9fd4', marginTop: 2 },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  card: {
    backgroundColor: '#072a47', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#0e4272',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  bookInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginRight: 8 },
  bookTitle: { color: '#ffffff', fontSize: 14, fontWeight: '700', flex: 1 },
  bookAuthor: { color: '#7ab8d9', fontSize: 12, marginBottom: 10 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoText: { color: '#5a9fd4', fontSize: 12 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1,
  },
  actionText: { fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#ffffff', fontSize: 16, marginTop: 12, fontWeight: '600' },
  emptySubText: { color: '#5a9fd4', fontSize: 13, marginTop: 4 },
});
