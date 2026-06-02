// src/screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser, saveUser } from '../utils/database';
import { useBooks } from '../hooks/useBooks';

export default function ProfileScreen() {
  const { books } = useBooks();
  const [user, setUser] = useState({ name: '', contact: '', course: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getUser().then((u) => {
      if (u) setUser(u);
      setLoaded(true);
    });
  }, []);

  const handleSave = async () => {
    if (!user.name.trim()) {
      Alert.alert('Nome obrigatório', 'Por favor, informe seu nome.');
      return;
    }
    setSaving(true);
    try {
      await saveUser(user);
      setEditing(false);
      Alert.alert('Salvo!', 'Perfil atualizado com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: books.length,
    disponivel: books.filter((b) => b.status === 'disponivel').length,
    trocado: books.filter((b) => b.status === 'trocado').length,
  };

  if (!loaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#e94560" />
            ) : (
              <Ionicons name={editing ? 'checkmark' : 'pencil'} size={18} color="#e94560" />
            )}
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#e94560" />
          </View>
          <Text style={styles.userName}>{user.name || 'Sem nome'}</Text>
          {user.course ? <Text style={styles.userCourse}>{user.course}</Text> : null}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Livros</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.disponivel}</Text>
            <Text style={styles.statLabel}>Disponíveis</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.trocado}</Text>
            <Text style={styles.statLabel}>Trocados</Text>
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <Text style={styles.label}>Nome *</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={user.name}
              onChangeText={(v) => setUser((p) => ({ ...p, name: v }))}
              placeholder="Seu nome"
              placeholderTextColor="#5a9fd4"
            />
          ) : (
            <Text style={styles.value}>{user.name || '—'}</Text>
          )}

          <Text style={styles.label}>Contato (WhatsApp)</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={user.contact}
              onChangeText={(v) => setUser((p) => ({ ...p, contact: v }))}
              placeholder="(47) 99999-0000"
              placeholderTextColor="#5a9fd4"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{user.contact || '—'}</Text>
          )}

          <Text style={styles.label}>Curso / Turma</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={user.course}
              onChangeText={(v) => setUser((p) => ({ ...p, course: v }))}
              placeholder="Ex: ADS - 3º Semestre"
              placeholderTextColor="#5a9fd4"
            />
          ) : (
            <Text style={styles.value}>{user.course || '—'}</Text>
          )}

          {editing && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sobre o app */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>📚 Sobre o BookSwap</Text>
          <Text style={styles.aboutText}>
            Plataforma de troca de livros entre estudantes. Doe conhecimento,
            adquira novos livros e fortaleça a comunidade acadêmica.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051d2e' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#ffffff' },
  editButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#072a47',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#0e4272',
  },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#072a47',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#e94560', marginBottom: 12,
  },
  userName: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  userCourse: { color: '#5a9fd4', fontSize: 13, marginTop: 4 },
  statsRow: {
    flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 24,
  },
  statCard: {
    flex: 1, backgroundColor: '#072a47', borderRadius: 12, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#0e4272',
  },
  statValue: { color: '#e94560', fontSize: 22, fontWeight: '700' },
  statLabel: { color: '#5a9fd4', fontSize: 11, marginTop: 2 },
  form: { paddingHorizontal: 20 },
  sectionTitle: {
    color: '#e94560', fontSize: 12, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase',
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#0e4272', marginBottom: 4,
  },
  label: { color: '#7ab8d9', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#072a47', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    color: '#ffffff', fontSize: 14, borderWidth: 1, borderColor: '#0e4272',
  },
  value: { color: '#ffffff', fontSize: 15 },
  cancelButton: {
    marginTop: 16, alignItems: 'center', padding: 12,
  },
  cancelText: { color: '#5a9fd4', fontSize: 14 },
  aboutCard: {
    margin: 20, backgroundColor: '#072a47', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#0e4272',
  },
  aboutTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  aboutText: { color: '#7ab8d9', fontSize: 13, lineHeight: 20 },
});
