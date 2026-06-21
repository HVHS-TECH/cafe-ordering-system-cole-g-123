console.log("Cafe Ordering System");

function getFormInput(event) {
    event.preventDefault();

    const nameField = document.getElementById("nameField");
    const coffeeType = document.getElementById("coffeeType");
    const quantity = document.getElementById("quantity");
    const money = document.getElementById("money");
    const output = document.getElementById("output");

    const userName = nameField.value.trim();
    const coffeeName = coffeeType.value.trim();
    const quantityValue = Number(quantity.value);
    const moneyValue = Number(money.value);

    const menuPrices = {
        espresso: 5,
        americano: 5,
        cappuccino: 5,
        latte: 5,
        "flat white": 5,
        "long black": 5,
        "matcha latte": 5,
        "choco latte": 5,
        "caramel milk": 5
    };

    const normalizedCoffee = coffeeName.toLowerCase();
    const price = menuPrices[normalizedCoffee] || 0;
    const totalCost = price * quantityValue;
    const isEnoughMoney = moneyValue >= totalCost;

    output.style.display = "block";

    if (!userName || !coffeeName || !quantity.value || !money.value) {
        output.innerHTML = "<p>Please fill in all fields.</p>";
        return;
    }

    if (Number.isNaN(quantityValue) || Number.isNaN(moneyValue) || quantityValue <= 0) {
        output.innerHTML = "<p>Please enter valid quantity and money values.</p>";
        return;
    }

    output.innerHTML = "<p>You entered: Name - " + userName + ", Coffee - " + coffeeName + ", Quantity - " + quantityValue + ", Money - $" + moneyValue.toFixed(2) + ".</p>";

    if (isEnoughMoney) {
        output.innerHTML += "<p>You have enough money to buy the coffee(s).</p>";
        output.innerHTML += "<h3>Receipt</h3>";
        output.innerHTML += "<p>Name: " + userName + "</p>";
        output.innerHTML += "<p>Coffee: " + coffeeName + "</p>";
        output.innerHTML += "<p>Quantity: " + quantityValue + "</p>";
        output.innerHTML += "<p>Total Cost: $" + totalCost.toFixed(2) + "</p>";
        output.innerHTML += "<p>Change: $" + (moneyValue - totalCost).toFixed(2) + "</p>";
    } else {
        output.innerHTML += "<p>You do not have enough money to buy the coffee(s).</p>";
    }
}

document.getElementById("orderForm").addEventListener("submit", getFormInput);
