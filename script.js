const menuItems = [
	{
		id: 'latte',
		name: 'Vanilla Latte',
		description: 'Smooth espresso, steamed milk, and vanilla syrup.',
		price: 5.75,
		category: 'Drink'
	},
	{
		id: 'cappuccino',
		name: 'Cappuccino',
		description: 'Classic espresso with a thick, velvety foam cap.',
		price: 5.25,
		category: 'Drink'
	},
	{
		id: 'mocha',
		name: 'Chocolate Mocha',
		description: 'Rich cocoa blended with espresso and milk.',
		price: 6.1,
		category: 'Drink'
	},
	{
		id: 'coldbrew',
		name: 'Cold Brew',
		description: 'Slow-steeped coffee served over ice with a clean finish.',
		price: 4.95,
		category: 'Drink'
	},
	{
		id: 'croissant',
		name: 'Butter Croissant',
		description: 'Flaky, golden pastry baked fresh each morning.',
		price: 3.5,
		category: 'Snack'
	},
	{
		id: 'muffin',
		name: 'Blueberry Muffin',
		description: 'Soft muffin loaded with juicy blueberries.',
		price: 3.95,
		category: 'Snack'
	}
];

const cart = new Map();

const menuGrid = document.getElementById('menuGrid');
const cartList = document.getElementById('cartList');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const subtotalText = document.getElementById('subtotalText');
const checkoutTotal = document.getElementById('checkoutTotal');
const drinkCount = document.getElementById('drinkCount');
const clearMenuBtn = document.getElementById('clearMenuBtn');
const checkoutForm = document.getElementById('checkoutForm');
const orderMessage = document.getElementById('orderMessage');

const currency = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

function formatMoney(value) {
	return currency.format(value);
}

function getCartEntries() {
	return Array.from(cart.entries()).map(([id, quantity]) => {
		const menuItem = menuItems.find((item) => item.id === id);
		return {
			...menuItem,
			quantity,
			lineTotal: menuItem.price * quantity
		};
	});
}

function getCartSummary() {
	return getCartEntries().reduce(
		(summary, item) => {
			summary.items += item.quantity;
			summary.total += item.lineTotal;
			return summary;
		},
		{ items: 0, total: 0 }
	);
}

function addItem(id) {
	cart.set(id, (cart.get(id) || 0) + 1);
	renderCart();
}

function increaseItem(id) {
	addItem(id);
}

function decreaseItem(id) {
	const currentQuantity = cart.get(id) || 0;
	if (currentQuantity <= 1) {
		cart.delete(id);
	} else {
		cart.set(id, currentQuantity - 1);
	}
	renderCart();
}

function removeItem(id) {
	cart.delete(id);
	renderCart();
}

function clearCart() {
	cart.clear();
	renderCart();
}

function renderMenu() {
	menuGrid.innerHTML = menuItems
		.map(
			(item) => `
				<article class="menu-card">
					<div>
						<p class="brand" style="margin:0 0 8px;">${item.category}</p>
						<h3>${item.name}</h3>
					</div>
					<p>${item.description}</p>
					<div class="menu-meta">
						<span class="price">${formatMoney(item.price)}</span>
						<button class="add-btn" type="button" data-add="${item.id}">Add to order</button>
					</div>
				</article>
			`
		)
		.join('');
}

function renderCart() {
	const entries = getCartEntries();
	const summary = getCartSummary();

	cartCount.textContent = String(summary.items);
	cartTotal.textContent = formatMoney(summary.total);
	subtotalText.textContent = formatMoney(summary.total);
	checkoutTotal.textContent = formatMoney(summary.total);
	drinkCount.textContent = String(menuItems.filter((item) => item.category === 'Drink').length);

	if (entries.length === 0) {
		cartList.innerHTML = '<div class="empty-state" id="emptyCartMessage">Your cart is empty. Add something from the menu to get started.</div>';
		return;
	}

	cartList.innerHTML = entries
		.map(
			(item) => `
				<article class="cart-item">
					<div class="cart-item-top">
						<div>
							<h3>${item.name}</h3>
							<p class="note">${item.category} • ${formatMoney(item.price)} each</p>
						</div>
						<strong>${formatMoney(item.lineTotal)}</strong>
					</div>
					<div class="cart-controls">
						<div class="qty-group" aria-label="Quantity controls for ${item.name}">
							<button class="icon-btn" type="button" data-decrease="${item.id}" aria-label="Decrease ${item.name}">−</button>
							<span class="qty-value">${item.quantity}</span>
							<button class="icon-btn" type="button" data-increase="${item.id}" aria-label="Increase ${item.name}">+</button>
						</div>
						<button class="ghost-btn" type="button" data-remove="${item.id}">Remove</button>
					</div>
				</article>
			`
		)
		.join('');
}

menuGrid.addEventListener('click', (event) => {
	const addButton = event.target.closest('[data-add]');
	if (!addButton) {
		return;
	}

	addItem(addButton.dataset.add);
});

cartList.addEventListener('click', (event) => {
	const increaseButton = event.target.closest('[data-increase]');
	const decreaseButton = event.target.closest('[data-decrease]');
	const removeButton = event.target.closest('[data-remove]');

	if (increaseButton) {
		increaseItem(increaseButton.dataset.increase);
	}

	if (decreaseButton) {
		decreaseItem(decreaseButton.dataset.decrease);
	}

	if (removeButton) {
		removeItem(removeButton.dataset.remove);
	}
});

clearMenuBtn.addEventListener('click', clearCart);

checkoutForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const summary = getCartSummary();
	const customerName = document.getElementById('customerName');
	const pickupStyle = document.getElementById('pickupStyle');
	const notes = document.getElementById('notes');

	if (summary.items === 0) {
		orderMessage.textContent = 'Add at least one item before placing your order.';
		orderMessage.classList.add('show');
		orderMessage.style.background = 'rgba(138, 75, 32, 0.09)';
		orderMessage.style.borderColor = 'rgba(138, 75, 32, 0.18)';
		orderMessage.style.color = 'var(--brand-dark)';
		return;
	}

	orderMessage.textContent = `Thanks, ${customerName.value.trim() || 'friend'}! Your ${pickupStyle.value.toLowerCase()} order has been sent. ${notes.value.trim() ? `Notes: ${notes.value.trim()}` : 'We will start preparing it now.'}`;
	orderMessage.classList.add('show');
	orderMessage.style.background = 'rgba(47, 122, 79, 0.09)';
	orderMessage.style.borderColor = 'rgba(47, 122, 79, 0.18)';
	orderMessage.style.color = 'var(--success)';

	clearCart();
	checkoutForm.reset();
});

renderMenu();
renderCart();

