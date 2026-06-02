// src/screens/EditBookScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getBookById } from '../utils/database';
import { useBooks } from '../hooks/useBooks';

const CATEGORIES = ['Tecnologia', 'Literatura', 'Educação', 'História', 'Ciências', 'Outros'];
const CONDITIONS = ['Ótimo', 'Bom', 'Regular', 'Ruim'];
const STATUSES = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'trocado', label: 'Trocado' },
];

export default function EditBookScreen({ route, navigation }) {
  const { bookId } = route.params;
  const { editBook, removeBook } = useBooks();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    getBookById(bookId).then((b) => {
      if (b) setForm({ ...b });
      setLoading(false);
    });
  }, [bookId]);

  const set = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.author.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha título e autor.');
      return;
    }
    setSaving(true);
    try {
      await editBook(bookId, form);
      Alert.alert('Atualizado!', 'Livro atualizado com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir Livro', 'Tem certeza? Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          await removeBook(bookId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading || !form) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Livro</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#e94560" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Título *</Text>
        <TextInput style={styles.input} value={form.title} onChangeText={set('title')} placeholderTextColor="#5a9fd4" />

        <Text style={styles.label}>Autor *</Text>
        <TextInput style={styles.input} value={form.author} onChangeText={set('author')} placeholderTextColor="#5a9fd4" />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat} style={[styles.chip, form.category === cat && styles.chipActive]} onPress={() => set('category')(cat)}>
              <Text style={[styles.chipText, form.category === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Estado</Text>
        <View style={styles.chipRow}>
          {CONDITIONS.map((cond) => (
            <TouchableOpacity key={cond} style={[styles.chip, form.condition === cond && styles.chipActive]} onPress={() => set('condition')(cond)}>
              <Text style={[styles.chipText, form.condition === cond && styles.chipTextActive]}>{cond}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Status</Text>
        <View style={styles.chipRow}>
          {STATUSES.map((s) => (
            <TouchableOpacity key={s.value} style={[styles.chip, form.status === s.value && styles.chipActive]} onPress={() => set('status')(s.value)}>
              <Text style={[styles.chipText, form.status === s.value && styles.chipTextActive]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={set('description')}
          multiline numberOfLines={4} textAlignVertical="top"
          placeholderTextColor="#5a9fd4"
        />

        <Text style={styles.label}>Seu Nome</Text>
        <TextInput style={styles.input} value={form.ownerName} onChangeText={set('ownerName')} placeholderTextColor="#5a9fd4" />

        <Text style={styles.label}>Contato</Text>
        <TextInput style={styles.input} value={form.ownerContact} onChangeText={set('ownerContact')} keyboardType="phone-pad" placeholderTextColor="#5a9fd4" />

        <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#051d2e' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#072a47',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#0e4272',
  },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  deleteButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#072a47',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#0e4272',
  },
  form: { paddingHorizontal: 20, paddingTop: 8 },
  label: { color: '#7ab8d9', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#072a47', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    color: '#ffffff', fontSize: 14, borderWidth: 1, borderColor: '#0e4272',
  },
  textArea: { minHeight: 90 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#072a47', borderWidth: 1, borderColor: '#0e4272',
  },
  chipActive: { backgroundColor: '#e94560', borderColor: '#e94560' },
  chipText: { color: '#5a9fd4', fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#ffffff' },
  saveButton: {
    backgroundColor: '#e94560', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 24,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
