let searchIcon = document.querySelector('#search-icon');
let navbar = document.querySelector('#navbar');

searchIcon.onclick = () => {
    navbar.classList.toggle('active');
}

let cart = [];
let addToCartButtons = document.querySelectorAll('.add-to-cart');
let cartCountSpan = document.querySelector('#cart-count');

const cartIcon = document.querySelector('.icons img[alt="shopping-cart--v1"]');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutModalBtn = document.getElementById('close-checkout-modal');
const cartItemsList = document.getElementById('cart-items-list');
const totalPriceSpan = document.getElementById('total-price');
const customerNameInput = document.getElementById('customer-name');
const confirmOrderBtn = document.getElementById('confirm-order-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        let itemBox = button.closest('.box');
        let itemName = itemBox.querySelector('h3').innerText;

        let rawPriceElement = itemBox.querySelector('.price');
        let itemPriceText = rawPriceElement.firstChild.textContent.trim();
        let itemPrice = parseFloat(itemPriceText.replace('R$', '').replace(',', '.'));

        if (isNaN(itemPrice)) {
            console.error("Erro: Preço não pôde ser parseado para o item:", itemName, "Texto do preço original:", rawPriceElement.innerText);
            alert("Não foi possível adicionar o item ao carrinho devido a um erro no preço.");
            return;
        }

        let item = {
            name: itemName,
            price: itemPrice
        };

        cart.push(item);
        updateCartCount();
        alert(`${itemName} adicionado ao carrinho.`);

        console.log("Carrinho atual: ", cart);
    })
})

function updateCartCount() {
    cartCountSpan.innerText = cart.length;
}

cartIcon.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio! Adicione seus produtos antes de finalizar seu pedido.');
        return;
    }

    displayCartItems();
    checkoutModal.classList.add('active');
});

closeCheckoutModalBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

window.addEventListener('click', (event) => {
    if (event.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
})

function displayCartItems() {
    cartItemsList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li>Nenhum item no carrinho.</li>';
        totalPriceSpan.innerText = 'R$ 0,00';
        return;
    }

    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span><span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>`;
        cartItemsList.appendChild(li);
        total += item.price;
    });

    totalPriceSpan.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

confirmOrderBtn.addEventListener('click', () => {
    const customerName = customerNameInput.value.trim();
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');

    if (!customerName) {
        alert('Por favor, preencha o seu nome para finalizar o pedido.');
        return;
    }

    if (!selectedPaymentMethod) {
        alert('Por favor, selecione um método de pagamento para finalizar o pedido.');
        return;
    }

    const paymentMethod = selectedPaymentMethod.value;
    const totalPrice = totalPriceSpan.innerText;

    const now = new Date();
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const formattedDate = now.toLocaleDateString('pt-BR', dateOptions);
    const formattedTime = now.toLocaleTimeString('pt-BR', timeOptions);

    let message = `*NOVO PEDIDO - BURGER DEV'S*\n\n`;
    message += `*Nome do Cliente:* ${customerName}\n\n`;
    message += `*Itens do Pedido:*\n`;
    cart.forEach(item => {
        message += `- ${item.name} (R$ ${item.price.toFixed(2).replace('.', ',')})\n`;
    });
    message += `\n*Total:* ${totalPrice}\n`;
    message += `*Forma de Pagamento:* ${paymentMethod}\n\n`;
    message += `*Data/Hora do Pedido:* ${formattedDate} às ${formattedTime}\n\n`;
    message += `Aguardando confirmação!`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '5518981039015';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    cart = [];
    updateCartCount(); 
    checkoutModal.classList.remove('active');
    customerNameInput.value = '';
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => radio.checked = false);

    alert("Pedido enviado ao WhatsApp! Aguarde a confirmação.");
});

updateCartCount();