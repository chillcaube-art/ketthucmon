import * as SQLite from 'expo-sqlite';

// Khởi tạo biến lưu trữ instance của database
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Hàm lấy instance của database.
 * Nếu chưa có thì sẽ mở kết nối tới file 'myDatabase.db'.
 * Quá trình này là bất đồng bộ (async) để đảm bảo db đã sẵn sàng trước khi truy vấn.
 */
const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('myDatabase.db');
  return db;
};

// Định nghĩa kiểu dữ liệu cho Danh mục (Category)
export type Category = {
  id: number;
  name: string;
};

// Định nghĩa kiểu dữ liệu cho Sản phẩm (Product)
export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

// Định nghĩa kiểu dữ liệu cho Người dùng (User)
export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

// Định nghĩa kiểu dữ liệu cho Giỏ hàng (CartItem)
export type CartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  productName?: string;
  productPrice?: number;
  productImg?: string;
};

export type Order = {
  id: number;
  userId: number;
  total: number;
  status: string; // 'pending', 'shipping', 'completed', 'cancelled'
  orderDate: string;
  recipientName?: string;
  phone?: string;
  address?: string;
};

// Định nghĩa kiểu dữ liệu cho Chi tiết đơn hàng (OrderItem)
export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  productName?: string;
  productImg?: string;
};

// Dữ liệu mẫu danh mục để chèn vào lần đầu tiên chạy app
const initialCategories: Category[] = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Giày' },
  { id: 3, name: 'Balo' },
  { id: 4, name: 'Mũ' },
  { id: 5, name: 'Túi' },
];

// Dữ liệu mẫu sản phẩm để chèn vào lần đầu tiên chạy app
const initialProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: 1100000, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', categoryId: 2 },
  { id: 3, name: 'Balo thời trang', price: 490000, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', categoryId: 3 },
  { id: 4, name: 'Mũ lưỡi trai', price: 120000, img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', categoryId: 4 },
  { id: 5, name: 'Túi xách nữ', price: 980000, img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500', categoryId: 5 },
];

/**
 * Khởi tạo cơ sở dữ liệu:
 * Tạo các bảng (categories, products, users) nếu chưa tồn tại.
 * Sau đó chèn dữ liệu mẫu vào các bảng này để test.
 * @param onSuccess Hàm callback sẽ được gọi khi khởi tạo thành công (dùng để báo UI load dữ liệu)
 */
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    // Thực thi một lúc nhiều câu lệnh tạo bảng
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT);
      
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        img TEXT,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      );

      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        productId INTEGER,
        quantity INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        total REAL,
        status TEXT,
        orderDate TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        productId INTEGER,
        quantity INTEGER,
        price REAL,
        FOREIGN KEY (orderId) REFERENCES orders(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      );
    `);

    // Add new columns to orders if they don't exist
    try {
      await database.runAsync('ALTER TABLE orders ADD COLUMN recipientName TEXT;');
    } catch (e) {}
    try {
      await database.runAsync('ALTER TABLE orders ADD COLUMN phone TEXT;');
    } catch (e) {}
    try {
      await database.runAsync('ALTER TABLE orders ADD COLUMN address TEXT;');
    } catch (e) {}

    // Lặp qua mảng danh mục mẫu và chèn vào bảng categories
    for (const category of initialCategories) {
      await database.runAsync('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', category.id, category.name);
    }

    // Lặp qua mảng sản phẩm mẫu và chèn vào bảng products
    for (const product of initialProducts) {
      await database.runAsync('INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
        product.id, product.name, product.price, product.img, product.categoryId);
      
      // Update img if it already exists (to fix broken URLs)
      await database.runAsync('UPDATE products SET img = ? WHERE id = ?', product.img, product.id);
    }

    // Chèn 1 tài khoản admin mặc định nếu chưa có trong database
    await database.runAsync(`
      INSERT INTO users (username, password, role)
      SELECT 'admin', '123456', 'admin'
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
    `);

    console.log('✅ Database initialized');
    if (onSuccess) onSuccess(); // Gọi callback báo hiệu đã xong

  } catch (error) {
    console.error('❌ initDatabase outer error:', error);
  }
};

/**
 * Lấy danh sách toàn bộ Danh mục từ bảng categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const database = await getDb();
    const items = await database.getAllAsync<Category>('SELECT * FROM categories');
    return items;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

export const addCategory = async (name: string) => {
  try {
    const db = await getDb();
    await db.runAsync('INSERT INTO categories (name) VALUES (?)', name);
  } catch (error) {
    console.error('❌ Error adding category:', error);
  }
};

export const updateCategory = async (id: number, name: string) => {
  try {
    const db = await getDb();
    await db.runAsync('UPDATE categories SET name = ? WHERE id = ?', name, id);
  } catch (error) {
    console.error('❌ Error updating category:', error);
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const db = await getDb();
    await db.runAsync('DELETE FROM categories WHERE id = ?', id);
  } catch (error) {
    console.error('❌ Error deleting category:', error);
  }
};

/**
 * Lấy danh sách toàn bộ Sản phẩm từ bảng products
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const database = await getDb();
    const items = await database.getAllAsync<Product>('SELECT * FROM products');
    return items;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};

/**
 * Lấy chi tiết một Sản phẩm theo ID
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const database = await getDb();
    const product = await database.getFirstAsync<Product>('SELECT * FROM products WHERE id = ?', id);
    return product;
  } catch (error) {
    console.error('❌ Error getting product by id:', error);
    return null;
  }
};

/**
 * Thêm một Sản phẩm mới vào bảng products
 * Không cần truyền id vì id được thiết lập AUTOINCREMENT (tự động tăng)
 */
export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const database = await getDb();
    await database.runAsync(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      product.name, product.price, product.img, product.categoryId
    );
    console.log('✅ Product added');
  } catch (error) {
    console.error('❌ Error adding product:', error);
  }
};

/**
 * Cập nhật thông tin của một Sản phẩm dựa theo id
 */
export const updateProduct = async (product: Product) => {
  try {
    const database = await getDb();
    await database.runAsync(
      'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?',
      product.name, product.price, product.categoryId, product.img, product.id
    );
    console.log('✅ Product updated with image');
  } catch (error) {
    console.error('❌ Error updating product:', error);
  }
};

/**
 * Xóa một Sản phẩm khỏi bảng products dựa vào id
 */
export const deleteProduct = async (id: number) => {
  try {
    const database = await getDb();
    await database.runAsync('DELETE FROM products WHERE id = ?', id);
    console.log('✅ Product deleted');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
  }
};

/**
 * Lấy danh sách Sản phẩm theo ID Danh mục
 */
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const db = await getDb();
    const products = await db.getAllAsync<Product>(
      'SELECT * FROM products WHERE categoryId = ?',
      categoryId
    );
    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    return [];
  }
};

/**
 * Tìm kiếm Sản phẩm dựa vào từ khóa.
 * Sẽ tìm theo tên sản phẩm HOẶC tên danh mục bằng lệnh JOIN và LIKE.
 */
export const searchProductsByNameOrCategory = async (keyword: string): Promise<Product[]> => {
  try {
    const db = await getDb();
    const products = await db.getAllAsync<Product>(
      `
      SELECT products.* FROM products
      JOIN categories ON products.categoryId = categories.id
      WHERE products.name LIKE ? OR categories.name LIKE ?
      `,
      `%${keyword}%`, `%${keyword}%`
    );
    return products;
  } catch (error) {
    console.error('❌ Error searching by name or category:', error);
    return [];
  }
};

/**
 * Thêm một Người dùng mới vào bảng users
 */
export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.runAsync(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      username, password, role
    );
    console.log('✅ User added');
    return true;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return false;
  }
};

/**
 * Cập nhật thông tin Người dùng
 */
export const updateUser = async (user: User) => {
  try {
    const db = await getDb();
    await db.runAsync(
      'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
      user.username, user.password, user.role, user.id
    );
    console.log('✅ User updated');
  } catch (error) {
    console.error('❌ Error updating user:', error);
  }
};

/**
 * Xóa một Người dùng dựa theo id
 */
export const deleteUser = async (id: number) => {
  try {
    const db = await getDb();
    await db.runAsync('DELETE FROM users WHERE id = ?', id);
    console.log('✅ User deleted');
  } catch (error) {
    console.error('❌ Error deleting user:', error);
  }
};

/**
 * Lấy toàn bộ danh sách Người dùng
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const db = await getDb();
    const users = await db.getAllAsync<User>('SELECT * FROM users');
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
};

export const updateUserRole = async (userId: number, role: string) => {
  try {
    const db = await getDb();
    await db.runAsync('UPDATE users SET role = ? WHERE id = ?', role, userId);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
  }
};

/**
 * Lấy thông tin một Người dùng cụ thể theo tài khoản và mật khẩu
 * Thường dùng cho chức năng Đăng nhập.
 */
export const getUserByCredentials = async (username: string, password: string): Promise<User | null> => {
  try {
    const db = await getDb();
    const user = await db.getFirstAsync<User>(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      username, password
    );
    return user;
  } catch (error) {
    console.error('❌ Error getting user by credentials:', error);
    return null;
  }
};

/**
 * Lấy thông tin Người dùng dựa theo id
 */
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const db = await getDb();
    const user = await db.getFirstAsync<User>(
      'SELECT * FROM users WHERE id = ?',
      id
    );
    return user;
  } catch (error) {
    console.error('❌ Error getting user by id:', error);
    return null;
  }
};

/**
 * Lấy giỏ hàng của user
 */
export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  try {
    const db = await getDb();
    const items = await db.getAllAsync<CartItem>(`
      SELECT c.id, c.userId, c.productId, c.quantity, p.name as productName, p.price as productPrice, p.img as productImg
      FROM cart c
      JOIN products p ON c.productId = p.id
      WHERE c.userId = ?
    `, userId);
    return items;
  } catch (error) {
    console.error('❌ Error fetching cart:', error);
    return [];
  }
};

/**
 * Thêm vào giỏ hàng
 */
export const addToCart = async (userId: number, productId: number, quantity: number = 1) => {
  try {
    const db = await getDb();
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existing = await db.getFirstAsync<{id: number, quantity: number}>(
      'SELECT id, quantity FROM cart WHERE userId = ? AND productId = ?',
      userId, productId
    );

    if (existing) {
      await db.runAsync(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        existing.quantity + quantity, existing.id
      );
    } else {
      await db.runAsync(
        'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
        userId, productId, quantity
      );
    }
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
  }
};

/**
 * Cập nhật số lượng giỏ hàng
 */
export const updateCartQuantity = async (cartId: number, quantity: number) => {
  try {
    const db = await getDb();
    if (quantity <= 0) {
      await db.runAsync('DELETE FROM cart WHERE id = ?', cartId);
    } else {
      await db.runAsync('UPDATE cart SET quantity = ? WHERE id = ?', quantity, cartId);
    }
  } catch (error) {
    console.error('❌ Error updating cart quantity:', error);
  }
};

/**
 * Xóa khỏi giỏ hàng
 */
export const removeFromCart = async (cartId: number) => {
  try {
    const db = await getDb();
    await db.runAsync('DELETE FROM cart WHERE id = ?', cartId);
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
  }
};

/**
 * Đặt hàng (Checkout)
 */
export const placeOrder = async (
  userId: number, 
  recipientName: string = '', 
  phone: string = '', 
  address: string = ''
): Promise<boolean> => {
  try {
    const db = await getDb();
    const cartItems = await fetchCart(userId);
    if (cartItems.length === 0) return false;

    const total = cartItems.reduce((sum, item) => sum + ((item.productPrice || 0) * item.quantity), 0);
    const orderDate = new Date().toISOString();

    const orderResult = await db.runAsync(
      'INSERT INTO orders (userId, total, status, orderDate, recipientName, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      userId, total, 'Pending', orderDate, recipientName, phone, address
    );

    const orderId = orderResult.lastInsertRowId;

    for (const item of cartItems) {
      await db.runAsync(
        'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
        orderId, item.productId, item.quantity, item.productPrice || 0
      );
    }

    // Xóa giỏ hàng
    await db.runAsync('DELETE FROM cart WHERE userId = ?', userId);
    return true;
  } catch (error) {
    console.error('❌ Error placing order:', error);
    return false;
  }
};

/**
 * Lấy lịch sử đơn hàng của user
 */
export const fetchUserOrders = async (userId: number): Promise<Order[]> => {
  try {
    const db = await getDb();
    return await db.getAllAsync<Order>('SELECT * FROM orders WHERE userId = ? ORDER BY id DESC', userId);
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    return [];
  }
};

/**
 * Lấy chi tiết đơn hàng
 */
export const fetchOrderItems = async (orderId: number): Promise<OrderItem[]> => {
  try {
    const db = await getDb();
    return await db.getAllAsync<OrderItem>(`
      SELECT oi.*, p.name as productName, p.img as productImg
      FROM order_items oi
      JOIN products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `, orderId);
  } catch (error) {
    console.error('❌ Error fetching order items:', error);
    return [];
  }
};

/**
 * ADMIN: Lấy tất cả đơn hàng
 */
export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const db = await getDb();
    return await db.getAllAsync<Order>('SELECT * FROM orders ORDER BY id DESC');
  } catch (error) {
    console.error('❌ Error fetching all orders:', error);
    return [];
  }
};

/**
 * ADMIN: Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const db = await getDb();
    await db.runAsync('UPDATE orders SET status = ? WHERE id = ?', status, orderId);
  } catch (error) {
    console.error('❌ Error updating order status:', error);
  }
};

/**
 * ADMIN: Cập nhật thông tin giao hàng
 */
export const updateOrderShippingInfo = async (orderId: number, recipientName: string, phone: string, address: string) => {
  try {
    const db = await getDb();
    await db.runAsync(
      'UPDATE orders SET recipientName = ?, phone = ?, address = ? WHERE id = ?',
      recipientName, phone, address, orderId
    );
  } catch (error) {
    console.error('❌ Error updating order shipping info:', error);
  }
};

/**
 * Lọc sản phẩm theo khoảng giá
 */
export const filterProductsByPrice = async (minPrice: number, maxPrice: number): Promise<Product[]> => {
  try {
    const db = await getDb();
    return await db.getAllAsync<Product>(
      'SELECT * FROM products WHERE price >= ? AND price <= ?',
      minPrice, maxPrice
    );
  } catch (error) {
    console.error('❌ Error filtering products by price:', error);
    return [];
  }
};
