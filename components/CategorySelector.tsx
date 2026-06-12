import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Category } from '../database';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: number; // 0 for 'All'
  onSelectCategory: (categoryId: number) => void;
}

export default function CategorySelector({ categories, selectedCategoryId, onSelectCategory }: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục sản phẩm</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategoryId === 0 && styles.categoryButtonActive
          ]}
          onPress={() => onSelectCategory(0)}
        >
          <Text style={[
            styles.categoryText,
            selectedCategoryId === 0 && styles.categoryTextActive
          ]}>
            Tất cả
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategoryId === cat.id && styles.categoryButtonActive
            ]}
            onPress={() => onSelectCategory(cat.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategoryId === cat.id && styles.categoryTextActive
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  categoryButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
});
