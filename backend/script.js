function openRegisterForm() {
    document.getElementById("registerForm").style.display = "block";
}

document.getElementById("carRegisterForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const carData = {
        ownerName: document.getElementById("ownerName").value,
        carModel: document.getElementById("carModel").value,
        registrationNumber: document.getElementById("registrationNumber").value,
        rentPrice: document.getElementById("rentPrice").value,
        contactInfo: document.getElementById("contactInfo").value
    };

    const response = await fetch("https://rencar-1.onrender.com/cars/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData)
    });
  
    if (response.ok) {
        alert("Car Registered Successfully!");
    } else {
        alert("Error Registering Car!");
    }
});
// Add your JavaScript code here
