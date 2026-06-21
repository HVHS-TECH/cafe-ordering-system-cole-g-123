console.log("Cafe Ordering System");

function getFormInput(event) {
    event.preventDefault();

    const nameField = document.getElementById("nameField");
    const output = document.getElementById("output");
    const userName = nameField.value.trim();

    output.style.display = "block";
    output.innerHTML = "<p>Hello " + userName + "! Welcome to our cafe.</p>";
}

document.getElementById("orderForm").addEventListener("submit", getFormInput);
