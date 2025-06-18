let searchIcon = document.querySelector('#search-icon');
let navbar = document.querySelector('#navbar');

searchIcon.onclick = () => {
    navbar.classList.toggle('active');
}

let cart = [];
let addToCartButtons = document.querySelectorAll('.add-to-cart');
let cartCountSpan = document.querySelector('#cart-count');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        let itemBox = button.closest('.box');
        let itemName = itemBox.querySelector('h3').innerText;
        let itemPriceText = itemBox.querySelector('.price').innerText.split(' ')[0];
        let itemPrice = parseFloat(itemPriceText.replace('R$', '').replace(',', '.'));

        let item = {
            name:itemName,
            price:itemPrice
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

updateCartCount();