document.addEventListener("DOMContentLoaded", function () {
  const stockURL = "http://localhost:5000/pharmacy/stock";
  const orderURL = "http://localhost:5000/pharmacy/order";

  // 1. Load stock into table
  fetch(stockURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Stock fetch failed");
      }
      return response.json();
    })
    .then((data) => {
      const tableBody = document.querySelector("#pharmacy-stock tbody");
      tableBody.innerHTML = "";

      data.forEach((medicine) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${medicine.name || "-"}</td>
          <td>${medicine.quantity || "-"}</td>
          <td>${medicine.expiry ? new Date(medicine.expiry).toLocaleDateString() : "-"}</td>
          <td>PKR ${medicine.price || "-"}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("❌ Error fetching stock:", error);
      alert("Failed to load stock. Please check the backend.");
    });

  // 2. Handle order form submission
  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const medicineName = document.getElementById("medicine-name").value.trim();
      const quantity = document.getElementById("quantity").value.trim();
      const customerName = document.getElementById("customer-name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();

      // Optional: Basic validation
      if (!medicineName || !quantity || !customerName || !phone || !address) {
        alert("Please fill in all fields.");
        return;
      }

      const orderData = {
        medicineName,
        quantity,
        customerName,
        phone,
        address,
      };

      fetch(orderURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Order failed");
          return res.json();
        })
        .then((data) => {
          alert(data.message || "Order placed successfully");
          orderForm.reset();
        })
        .catch((error) => {
          console.error("❌ Order submission error:", error);
          alert("Failed to place order. Check server or input.");
        });
    });
  }
});
