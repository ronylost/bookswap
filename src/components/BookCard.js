// src/components/BookCard.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORY_COLORS = {
  Tecnologia: '#4f46e5',
  Literatura: '#0891b2',
  Educação: '#059669',
  História: '#d97706',
  Ciências: '#7c3aed',
  Outros: '#6b7280',
};

const CONDITION_COLORS = {
  Ótimo: '#10b981',
  Bom: '#3b82f6',
  Regular: '#f59e0b',
  Ruim: '#ef4444',
};

export default function BookCard({ book, onPress, compact = false }) {
  const catColor = CATEGORY_COLORS[book.category] || '#6b7280';
  const condColor = CONDITION_COLORS[book.condition] || '#6b7280';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Barra lateral colorida */}
      <View style={[styles.colorBar, { backgroundColor: catColor }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleArea}>
            <Text style={styles.title} numberOfLines={1}>
              {book.title}
            </Text>
            <Text style={styles.author} numberOfLines={1}>
              {book.author}
            </Text>
          </View>
          <View style={[styles.conditionBadge, { backgroundColor: condColor + '22', borderColor: condColor }]}>
            <Text style={[styles.conditionText, { color: condColor }]}>{book.condition}</Text>
          </View>
        </View>

        {!compact && book.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {book.description}
          </Text>
        ) : null}

        <View style={styles.bottomRow}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor + '22' }]}>
            <Text style={[styles.categoryText, { color: catColor }]}>{book.category}</Text>
          </View>
          <View style={styles.ownerRow}>
            <Ionicons name="person-outline" size={12} color="#5a9fd4" />
            <Text style={styles.ownerText}>{book.ownerName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#072a47',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0e4272',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleArea: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  author: {
    color: '#7ab8d9',
    fontSize: 12,
    marginTop: 2,
  },
  conditionBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  conditionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    color: '#5a9fd4',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  categoryBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerText: {
    color: '#5a9fd4',
    fontSize: 11,
  },
});
