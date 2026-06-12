import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  onPressBuy?: () => void;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 2 columns with 16 padding on sides and 16 gap

export default function ProductCard({ image, name, price, onPressBuy }: ProductCardProps) {
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{name}</Text>
        <Text style={styles.productPrice}>{price}</Text>
        <TouchableOpacity style={styles.buyButton} onPress={onPressBuy}>
          <Text style={styles.buyButtonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: itemWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
    minHeight: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: '#10b981', // Màu xanh lục khác đi một chút để phân biệt
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
