// Only run authentication check on pages that need it
if (window.location.pathname !== "/auth.html") {
  fetch("/api/check-auth")
    .then((res) => {
      if (res.status === 401) {
        window.location.href = "/auth.html";
      }
    })
    .catch((err) => {
      console.error("Session check failed:", err);
      // Don't redirect on network errors, only on auth errors
    });
}

$(document).ready(function () {
  $(".fa-bars").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
    $(".navbar ul").toggleClass("active");
  });

  $(window).on("scroll load", function () {
    $(".fa-bars").removeClass("fa-times");
    $(".navbar").removeClass("nav-toggle");
    $(".navbar ul").removeClass("active");

    if ($(window).scrollTop() > 30) {
      $("header").addClass("header-active");
    } else {
      $("header").removeClass("header-active");
    }
  });
});

const API_BASE_URL = "http://localhost:3000";

async function getData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

async function updateData(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
}

async function deleteData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
  };

  try {
    const result = await postData("/users", formData);
    console.log("Data saved:", result);
    alert("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data");
  }
}

function loadModule(moduleName) {
  fetch(`${API_BASE_URL}/${moduleName}`)
    .then((res) => res.json())
    .then((data) => {
      displayData(data, moduleName);
    })
    .catch((err) => {
      document.getElementById(
        "content"
      ).innerHTML = `<p style="color:red;">Error loading data: ${err}</p>`;
      console.error(err);
    });
}
function displayData(data, moduleName) {
  let html = `<h2>${
    moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
  } Data</h2>`;
  if (!Array.isArray(data) || data.length === 0) {
    html += `<p>No data found</p>`;
  } else {
    html += `<table><tr>`;
    Object.keys(data[0]).forEach((key) => {
      html += `<th>${key}</th>`;
    });
    html += `</tr>`;
    data.forEach((row) => {
      html += `<tr>`;
      Object.values(row).forEach((value) => {
        html += `<td>${value}</td>`;
      });
      html += `</tr>`;
    });
    html += `</table>`;
  }
  document.getElementById("content").innerHTML = html;
}
function loadReportingData() {
  fetch(`${API_BASE_URL}/reporting`)
    .then((res) => res.json())
    .then((data) => {
      displayReportingData(data);
    })
    .catch((err) => {
      document.getElementById(
        "content"
      ).innerHTML = `<p style="color:red;">Error loading reports: ${err}</p>`;
      console.error(err);
    });
}
function displayReportingData(data) {
  let html = `<h2>Reporting & Analytics</h2>`;

  if (!data || Object.keys(data).length === 0) {
    html += `<p>No reporting data available</p>`;
  } else {
    html += `<div style="display: flex; flex-wrap: wrap; gap: 20px;">`;
    Object.entries(data).forEach(([key, value]) => {
      html += `
                <div style="flex: 1 1 200px; background: #f0f0f0; padding: 20px; border-radius: 10px;">
                    <h3>${key.replace(/_/g, " ").toUpperCase()}</h3>
                    <p style="font-size: 24px; color: #2c3e50;"><strong>${value}</strong></p>
                </div>
            `;
    });
    html += `</div>`;
  }
  document.getElementById("content").innerHTML = html;
}
// Only load pharmacy data if we're on a page that needs it
if (document.getElementById("pharmacyData")) {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/pharmacy/stock")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const container = document.getElementById("pharmacyData");
        if (!data.length) {
          container.innerHTML = "No stock data found.";
          return;
        }
        // Create a list of items
        const list = document.createElement("ul");
        data.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `Medicine: ${item.name}, Quantity: ${item.quantity}`;
          list.appendChild(li);
        });
        container.innerHTML = ""; // clear "Loading..."
        container.appendChild(list);
      })
      .catch((error) => {
        console.error("Error fetching pharmacy data:", error);
        document.getElementById("pharmacyData").innerHTML =
          "Error loading pharmacy data.";
      });
  });
}
// Only handle appointment form if it exists
if (document.getElementById("appointmentForm")) {
  document
    .getElementById("appointmentForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = {
        patientName: document.getElementById("appointName").value,
        doctorName: document.getElementById("appointDoctor").value,
        date: document.getElementById("appointDate").value,
        time: document.getElementById("appointTime").value,
      };
      try {
        const res = await fetch("http://localhost:3000/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message); // "Appointment booked successfully"
        } else {
          alert(data.message); // Error message from backend
        }
      } catch (err) {
        alert("Submission failed: " + err.message);
      }
    });
}
