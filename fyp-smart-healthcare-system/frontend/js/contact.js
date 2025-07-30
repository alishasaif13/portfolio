document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    phone: this.phone.value,
    message: this.message.value,
  };

  try {
    const response = await fetch("/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Message sent successfully!");
      this.reset();
    } else {
      alert("Failed to send message: " + result.message);
    }
  } catch (error) {
    alert("Server error: " + error.message);
  }
});
