// 🟢 Form Submit Handler
document.getElementById("booking-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    phone: this.phone.value,
    doctor: this.doctor.value,
    date: this.date.value,
    time: this.time.value,
    message: this.message.value,
  };

  try {
    const response = await fetch("/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result = await response.json();

    if (response.ok) {
      alert("Appointment booked successfully!");
      this.reset();
    } else {
      alert("Failed to book appointment: " + result.message);
    }
  } catch (error) {
    alert("Server error: " + error.message);
  }
});

// 🟢 Populate Doctor Dropdown
document.addEventListener("DOMContentLoaded", async function () {
  const select = document.getElementById("doctor-select");
  try {
    const res = await fetch("/doctors");
    const doctors = await res.json();
    doctors.forEach(doc => {
      const opt = document.createElement("option");
      opt.value = doc.name;
      opt.textContent = doc.name;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("❌ Failed to load doctors:", err);
  }
});
