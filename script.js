console.log("Cafe Ordering System");

function submitOrder() {
    const name = document.getElementById("name").value;
    const order = document.getElementById("order").value;
    const quantity = document.getElementById("quantity").value;
}

function getFormInput() {
    const NAME_FIELD = document.getElementById("nameField");
    let userName = NAME_FIELD.value;
    const OUTPUT = document.getElementById("output");
    OUTPUT.innerHTML = "<p>Hello "+userName+"! Welcome to our cafe.</p>";