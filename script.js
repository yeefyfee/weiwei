// script.js
let cart = [];
let menuItems = []; // 用于存储菜单项

// 页面加载时自动加载 Excel 文件
window.onload = function() {
    loadMenu();
};

function loadMenu() {
    fetch('menu.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            menuItems = jsonData; // 将读取的数据存储到 menuItems
            displayMenu(); // 显示菜单
        })
        .catch(error => console.error('Error loading the menu:', error));
}

function displayMenu() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // 清空现有菜单

    menuItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.setAttribute('data-name', item.Name);

        div.innerHTML = `
            <img src="${item['Image Path']}" alt="${item.Name}">
            <div class="info">
                <h3>${item.Name}</h3>
                <button class="add-to-cart" onclick="addToCart(this)">+</button>
            </div>
        `;
        itemList.appendChild(div);
    });
}

function filterItems() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemName = item.getAttribute('data-name').toLowerCase();
        if (itemName.includes(searchInput)) {
            item.style.display = 'flex'; // 显示匹配的商品
        } else {
            item.style.display = 'none'; // 隐藏不匹配的商品
        }
    });
}

function addToCart(button) {
    const item = button.closest('.item'); // 获取最近的 .item 元素
    const itemName = item.getAttribute('data-name'); // 获取菜品名称
    const itemImage = item.querySelector('img').src; // 获取图片路径

    // 添加到购物车
    cart.push({ name: itemName, image: itemImage });
    
    // 隐藏该商品
    item.style.display = 'none';

    // 更新购物车显示
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = ''; // 清空购物车

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: auto; margin-right: 10px;">
            ${item.name} <button onclick="removeFromCart(${index})">×</button>
        `;
        cartItems.appendChild(li);
    });
}

function removeFromCart(index) {
    const removedItem = cart.splice(index, 1)[0]; // 从购物车中剔除

    // 重新显示该商品
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (item.getAttribute('data-name') === removedItem.name) {
            item.style.display = 'flex'; // 显示剔除的商品
        }
    });

    updateCart(); // 更新购物车显示
}

// 确认订单
function confirmOrder() {
    // 将购物车内容保存到 localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // 跳转到订单小票页面
    window.location.href = 'receipt.html';
}

// 保存为图片
function saveAsImage() {
    const popupContent = document.getElementById('popupContent');
    html2canvas(popupContent).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'order.png';
        link.click();
    });
}

// 关闭弹出窗口
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // 隐藏弹出窗口
}