// ===== قاعدة المنتجات =====
const products = [
    {
        id: 1,
        name: "قميص رجالي أزرق",
        category: "men",
        price: 150,
        oldPrice: 200,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        badge: "خصم 25%"
    },
    {
        id: 2,
        name: "فستان حريمي أنيق",
        category: "women",
        price: 299,
        oldPrice: 400,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
        badge: "خصم 30%"
    },
    {
        id: 3,
        name: "بناطيل جينز أزرق",
        category: "men",
        price: 199,
        oldPrice: 250,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        badge: "جديد"
    },
    {
        id: 4,
        name: "بلوزة نسائية بيضاء",
        category: "women",
        price: 129,
        image: "https://images.unsplash.com/photo-1562157873-818bc0723fde?w=400",
        badge: null
    },
    {
        id: 5,
        name: "تيشيرت أطفال",
        category: "kids",
        price: 79,
        image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400",
        badge: null
    },
    {
        id: 6,
        name: "جاكيت رجالي أسود",
        category: "men",
        price: 399,
        oldPrice: 500,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
        badge: "خصم 20%"
    },
    {
        id: 7,
        name: "تنورة حريمي",
        category: "women",
        price: 179,
        oldPrice: 220,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj8?w=400",
        badge: "خصم 20%"
    },
    {
        id: 8,
        name: "بدلة رجالية",
        category: "men",
        price: 599,
        oldPrice: 800,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
        badge: "خصم 25%"
    }
];

// ===== عربة التسوق =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== دوالعرض =====

// عرض المنتجات المميزة
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    container.innerHTML = generateProductsHTML(products.slice(0, 4));
}

// عرض كل المنتجات
function displayAllProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    container.innerHTML = generateProductsHTML(products);
}

// توليد HTML للمنتجات
function generateProductsHTML(productsArray) {
    return productsArray.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">
                    ${product.price} ريال
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ريال</span>` : ''}
                </p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> أضف للسلة
                </button>
            </div>
        </div>
    `).join('');
}

// ===== دوال السلة =====

// إضافة للمنتج
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    cart.push(product);
    updateCartCount();
    saveCart();
    
    // إشعار
    const btn = event.target;
    btn.textContent = "✅تمت الإضافة";
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-cart-plus"></i> أضف للسلة';
    }, 1000);
}

// حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    saveCart();
    displayCart();
}

// عرض السلة
function displayCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">السلة فارغة!</p>';
        document.getElementById('subtotal').textContent = '0 ريال';
        document.getElementById('tax').textContent = '0 ريال';
        document.getElementById('total').textContent = '0 ريال';
        return;
    }
    
    container.innerHTML = cart.map((product, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${product.name}</h3>
                <p class="cart-item-price">${product.price} ريال</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i> حذف
            </button>
        </div>
    `).join('');
    
    updateCartSummary();
}

// تحديث ملخص الفاتورة
function updateCartSummary() {
    const subtotal = cart.reduce((sum, p) => sum + p.price, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = subtotal + ' ريال';
    document.getElementById('tax').textContent = tax.toFixed(2) + ' ريال';
    document.getElementById('total').textContent = total.toFixed(2) + ' ريال';
}

// تحديث عدد السلة
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// حفظ في localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// تصفية المنتجات
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const price = document.getElementById('price-filter').value;
    
    let filtered = products;
    
    // تصفية حسب التصنيف
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // تصفية حسب السعر
    if (price === '0-100') {
        filtered = filtered.filter(p => p.price < 100);
    } else if (price === '100-200') {
        filtered = filtered.filter(p => p.price >= 100 && p.price <= 200);
    } else if (price === '200+') {
        filtered = filtered.filter(p => p.price > 200);
    }
    
    const container = document.getElementById('all-products');
    if (container) {
        container.innerHTML = generateProductsHTML(filtered);
    }
}

// إتمام الطلب
function checkout() {
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }
    
    const total = document.getElementById('total').textContent;
    const confirm = window.confirm(`الإجمالي: ${total}\nهل تريد إتمام الطلب؟`);
    
    if (confirm) {
        alert("✅ تم تقديم طلبك بنجاح! سنتواصل معك قريباً.");
        cart = [];
        saveCart();
        updateCartCount();
        displayCart();
    }
}

// ===== تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
    displayAllProducts();
    updateCartCount();
});