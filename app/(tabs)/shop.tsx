import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert, Image, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Product, fetchProducts, searchProductsByNameOrCategory, filterProductsByPrice, addToCart, Category, fetchCategories, fetchProductsByCategory } from '../../database';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import CategorySelector from '../../components/CategorySelector';

export default function ShopTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchProducts();
    setProducts(data);
    const cats = await fetchCategories();
    setCategories(cats);
  };

  const handleSelectCategory = async (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    if (categoryId === 0) {
      const data = await fetchProducts();
      setProducts(data);
    } else {
      const results = await fetchProductsByCategory(categoryId);
      setProducts(results);
    }
  };

  const handleSearchTextChange = async (text: string) => {
    setSearchQuery(text);
    if (text.trim().length > 0) {
      const results = await searchProductsByNameOrCategory(text);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions(products);
      setShowSuggestions(true);
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setShowSuggestions(false);
    setSearchQuery(product.name);
    router.push(`/product/${product.id}`);
  };

  const handleSearch = async () => {
    setShowSuggestions(false);
    setSelectedCategory(0); // Reset category when searching
    if (!searchQuery.trim()) {
      const data = await fetchProducts();
      setProducts(data);
    } else {
      const results = await searchProductsByNameOrCategory(searchQuery);
      setProducts(results);
    }
  };

  const handleFilter = async () => {
    const min = 10;
    const max = maxPrice;
    const results = await filterProductsByPrice(min, max);
    setProducts(results);
  };

  const handleClearFilter = () => {
    setSearchQuery('');
    setMaxPrice(2000000);
    setSelectedCategory(0);
    loadData();
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm vào giỏ hàng', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng nhập', onPress: () => router.push('/login') }
      ]);
      return;
    }
    await addToCart(user.id, product.id, 1);
    Alert.alert('Thành công', `Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        {item.img && item.img.startsWith('http') ? (
          Platform.OS === 'web' ? (
            <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          ) : (
            <Image source={{ uri: item.img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          )
        ) : (
          <Ionicons name="image-outline" size={50} color="#ccc" />
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
      </View>
      <TouchableOpacity style={styles.btnAddCart} onPress={() => handleAddToCart(item)}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={{ paddingBottom: 10 }}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80' }} 
                style={styles.banner} 
              />
              
              <CategorySelector 
                categories={categories} 
                selectedCategoryId={selectedCategory} 
                onSelectCategory={handleSelectCategory} 
              />

              {/* Tìm kiếm */}
              <View style={{ zIndex: 10 }}>
                <View style={styles.searchRow}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm theo tên/danh mục..."
                    value={searchQuery}
                    onChangeText={handleSearchTextChange}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) {
                        setShowSuggestions(true);
                      } else {
                        setSuggestions(products);
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  <TouchableOpacity style={styles.btnSearch} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ScrollView
                    style={styles.suggestionsContainer}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                  >
                    {suggestions.map(item => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.suggestionItem}
                        onPress={() => handleSelectSuggestion(item)}
                      >
                        <Text style={styles.suggestionText} numberOfLines={1}>
                          {item.name} - <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>{item.price.toLocaleString('vi-VN')} đ</Text>
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Lọc theo giá */}
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>
                  Khoảng giá: 10 đ - {maxPrice.toLocaleString('vi-VN')} đ
                </Text>
                <View style={styles.filterRow}>
                  <Slider
                    style={{ flex: 1, height: 40 }}
                    minimumValue={10}
                    maximumValue={2000000}
                    step={10000}
                    value={maxPrice}
                    onValueChange={(val) => setMaxPrice(val)}
                    minimumTrackTintColor="#10b981"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#10b981"
                  />
                  <TouchableOpacity style={styles.btnFilter} onPress={handleFilter}>
                    <Text style={styles.btnText}>Lọc</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnClear} onPress={handleClearFilter}>
                    <Ionicons name="close" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 16, paddingTop: 10 },
  banner: { width: '100%', height: 160, borderRadius: 24, marginBottom: 10 },
  searchRow: { flexDirection: 'row', marginBottom: 16 },
  searchInput: { flex: 1, backgroundColor: '#ffffff', borderWidth: 0, borderRadius: 16, paddingHorizontal: 16, height: 50, marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, fontSize: 15 },
  btnSearch: { backgroundColor: '#4f46e5', width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  suggestionsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 62,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 1000,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  suggestionText: {
    fontSize: 14,
    color: '#334155',
  },
  filterContainer: { marginBottom: 24, backgroundColor: '#ffffff', padding: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  filterLabel: { fontWeight: '700', color: '#1e293b', marginBottom: 12, fontSize: 14 },
  filterRow: { flexDirection: 'row', alignItems: 'center' },
  btnFilter: { backgroundColor: '#10b981', paddingHorizontal: 20, height: 44, justifyContent: 'center', borderRadius: 12, marginLeft: 12 },
  btnClear: { backgroundColor: '#fef2f2', width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginLeft: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  listContent: { paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#ffffff', borderRadius: 20, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12, overflow: 'hidden' },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  cardInfo: { width: '100%', alignItems: 'flex-start', padding: 12, paddingBottom: 16 },
  productName: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 6 },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#4f46e5' },
  btnAddCart: { backgroundColor: '#4f46e5', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 10, right: 10, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 40, fontSize: 16 },
});
