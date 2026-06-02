// src/screens/AddBookScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBooks } from '../hooks/useBooks';

const CATEGORIES = ['Tecnologia', 'Literatura', 'Educação', 'História', 'Ciências', 'Outros'];
const CONDITIONS = ['Ótimo', 'Bom', 'Regular', 'Ruim'];

export default function AddBookScreen({ navigation }) {
  const { createBook } = useBooks();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: 'Literatura',
    condition: 'Bom',
    description: '',
    ownerName: '',
    ownerContact: '',
  });

  const set = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.author.trim() || !form.ownerName.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha título, autor e seu nome.');
      return;
    }
    setLoading(true);
    try {
      await createBook(form);
      Alert.alert('Livro cadastrado! 📚', 'Seu livro está disponível para troca.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar Livro</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Título */}
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={form.title}
          onChangeText={set('title')}
          placeholder="Ex: Dom Casmurro"
          placeholderTextColor="#5a9fd4"
        />

        {/* Autor */}
        <Text style={styles.label}>Autor *</Text>
        <TextInput
          style={styles.input}
          value={form.author}
          onChangeText={set('author')}
          placeholder="Ex: Machado de Assis"
          placeholderTextColor="#5a9fd4"
        />

        {/* Categoria */}
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, form.category === cat && styles.chipActive]}
              onPress={() => set('category')(cat)}
            >
              <Text style={[styles.chipText, form.category === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Condição */}
        <Text style={styles.label}>Estado do Livro</Text>
        <View style={styles.chipRow}>
          {CONDITIONS.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[styles.chip, form.condition === cond && styles.chipActive]}
              onPress={() => set('condition')(cond)}
            >
              <Text style={[styles.chipText, form.condition === cond && styles.chipTextActive]}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={set('description')}
          placeholder="Descreva o estado do livro, edição, observações..."
          placeholderTextColor="#5a9fd4"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Dono */}
        <Text style={styles.sectionHeader}>Suas Informações</Text>

        <Text style={styles.label}>Seu Nome *</Text>
        <TextInput
          style={styles.input}
          value={form.ownerName}
          onChangeText={set('ownerName')}
          placeholder="Como prefere ser chamado"
          placeholderTextColor="#5a9fd4"
        />

        <Text style={styles.label}>Contato (WhatsApp/Telefone)</Text>
        <TextInput
          style={styles.input}
          value={form.ownerContact}
          onChangeText={set('ownerContact')}
          placeholder="(47) 99999-0000"
          placeholderTextColor="#5a9fd4"
          keyboardType="phone-pad"
        />

        {/* Botão */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>Cadastrar Livro</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#072a47', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#0e4272',
  },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
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
  sectionHeader: {
    color: '#e94560', fontSize: 12, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase',
    marginTop: 24, marginBottom: 4,
    paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#0e4272',
  },
  saveButton: {
    backgroundColor: '#e94560', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 24,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
