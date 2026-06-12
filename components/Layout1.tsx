import { Image, ImageSourcePropType, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface Product {
  img: ImageSourcePropType;
  title: string;
  price: number;
}

const ProductCard = ({ img, title, price }: Product) => {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={img} />
      <View style={styles.cardBody}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  )
}

// 1. Tạo mảng dữ liệu chứa thông tin các sản phẩm
const productsData = [
  { id: '1', img: { uri: 'https://picsum.photos/120/80?random=1' }, title: "Product 1", price: 99.99 },
  { id: '2', img: { uri: 'https://picsum.photos/120/80?random=2' }, title: "Product 2", price: 149.99 },
  { id: '3', img: { uri: 'https://picsum.photos/120/80?random=3' }, title: "Product 3", price: 199.99 },
  { id: '4', img: { uri: 'https://picsum.photos/120/80?random=4' }, title: "Product 4", price: 249.99 },
  { id: '5', img: { uri: 'https://picsum.photos/120/80?random=5' }, title: "Product 5", price: 299.99 },
  { id: '6', img: { uri: 'https://picsum.photos/120/80?random=6' }, title: "truyện", price: 349.99 },
  { id: '7', img: { uri: 'https://picsum.photos/120/80?random=7' }, title: "Product 1", price: 99.99 },
  { id: '8', img: { uri: 'https://picsum.photos/120/80?random=8' }, title: "Product 2", price: 149.99 },
  { id: '9', img: { uri: 'https://picsum.photos/120/80?random=9' }, title: "Product 3", price: 199.99 },
  { id: '10', img: { uri: 'https://picsum.photos/120/80?random=10' }, title: "Product 4", price: 249.99 },
  { id: '11', img: { uri: 'https://picsum.photos/120/80?random=11' }, title: "Product 5", price: 299.99 },
  { id: '12', img: { uri: 'https://picsum.photos/120/80?random=12' }, title: "truyện", price: 349.99 },
];

const Layout1 = () => {
  return (
   
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={{ color: '#ffffff' }}>Logo</Text>
        </View>
        <View style={styles.banner}>
          <Image source={{ uri: 'https://picsum.photos/450/106' }} style={{ width: 450, height: 106 }} />
        </View>
      </View>
     
      <View style={styles.body}>
        {/* 2. Dùng hàm .map() để duyệt qua mảng và render các ProductCard */}
        {productsData.map((product) => (
          <ProductCard
            key={product.id} // Thêm key để React quản lý danh sách hiệu quả
            img={product.img}
            title={product.title}
            price={product.price}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Text>Footer</Text>
      </View>
    </ScrollView>
  </SafeAreaView>
 
  )
}

export default Layout1

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#d1ef28',
  },
  logo: {
    flex: 1,
    backgroundColor: '#897cae',
  },
  banner: {
    flex: 6,
    backgroundColor: '#5d7639',
  },
  body: {
    flex: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  footer: {
    flex: 1,
    backgroundColor: '#ff6b6b',
  },
  card: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 170,
    marginTop: 15,
  },
  image: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardBody: {
    padding: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
  button: {
    backgroundColor: '#69f0a3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  }
})
