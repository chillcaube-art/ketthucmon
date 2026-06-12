import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from 'react-native';
import { Category, fetchCategories, addCategory, updateCategory, deleteCategory } from '../../database';
import { useRouter } from 'expo-router';

export default function AdminCategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }
    
    if (editingId) {
      await updateCategory(editingId, name);
      setEditingId(null);
    } else {
      await addCategory(name);
    }
    
    setName('');
    loadData();
  };

  const handleEdit = (item: Category) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa danh mục này?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Xóa', 
        style: 'destructive',
        onPress: async () => {
          await deleteCategory(id);
          loadData();
        } 
      }
    ]);
  };

  const handleAddProduct = (categoryId: number) => {
    // Navigate to products tab and pass categoryId
    router.push({ pathname: '/(tabs)', params: { categoryId } });
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.idText}>ID: {item.id}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.btnAddProduct} onPress={() => handleAddProduct(item.id)}>
          <Text style={styles.btnText}>Thêm SP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnEdit} onPress={() => handleEdit(item)}>
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text style={styles.headerTitle}>Quản lý Danh mục</Text>
              
              {/* Add Form */}
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>{editingId ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Tên danh mục" 
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                />
                <TouchableOpacity style={styles.btnAdd} onPress={handleAddOrUpdate}>
                  <Text style={styles.btnText}>{editingId ? 'CẬP NHẬT' : 'THÊM'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  listContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#333' },
  formCard: { 
    borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 15, marginBottom: 20,
    backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2
  },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: { 
    borderWidth: 1, borderColor: '#ddd', borderRadius: 4, paddingHorizontal: 12, height: 40, marginBottom: 12,
    backgroundColor: '#fff', color: '#000'
  },
  btnAdd: { backgroundColor: '#2196F3', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 4 },
  card: { flexDirection: 'row', backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1, paddingRight: 10 },
  nameText: { fontWeight: 'bold', fontSize: 16, marginBottom: 4, color: '#333' },
  idText: { fontSize: 14, color: '#555', marginBottom: 2 },
  actionButtons: { flexDirection: 'row', justifyContent: 'center' },
  btnAddProduct: { backgroundColor: '#ff9800', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, marginRight: 8, alignItems: 'center' },
  btnEdit: { backgroundColor: '#4CAF50', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, marginRight: 8, alignItems: 'center' },
  btnDelete: { backgroundColor: '#F44336', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
