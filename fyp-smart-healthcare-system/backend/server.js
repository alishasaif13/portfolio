require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB Atlas connected ✅");
}).catch((err) => {
  console.error("MongoDB connection error ❌", err);
});

// ✅ Middleware — order matters
app.use(cors());
app.use(express.json()); // 🟢 For JSON request parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "smartcare_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Static files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Models (if needed for direct use)
const User = require("./models/userModel");
const Medicine = require("./models/medicineModel");
const Order = require("./models/orderModel");
const Doctor = require("./models/doctorModel");
const Staff = require("./models/staffModel");
const Patient = require("./models/patientModel");
const Contact = require("./models/contactModel");
const Appointment = require("./models/appointmentModel");
const Payment = require("./models/paymentModel"); // Adjust path
  

// ✅ Routes (always after middleware)
const appointmentRoutes = require("./routes/appointmentRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

app.use("/api/payment", stripeRoutes);
app.use("/appointments", appointmentRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartCare running at http://localhost:${PORT}`);
});

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect("/auth.html");
  }
}

// ✅ Public Route - Always start from auth
app.get("/", (req, res) => {
  res.redirect("/auth.html");
});

// ✅ Protected Routes
app.get("/index.html", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/dashboard.html", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// Admin page routes
app.get("/doctors.html", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/doctors.html"));
});

app.get("/patients.html", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/patients.html"));
});

app.get("/staff.html", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/staff.html"));
});

app.get("/pharmacy.html", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/pharmacy.html"));
});

app.get("/orders.html", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/orders.html"));
});

app.get("/appointments.html", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/appointments.html"));
});

app.get("/admin/payments", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).send("Access denied");
  }
  res.sendFile(path.resolve(__dirname, "../frontend/payments.html"));
});

app.get("/contact.html", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../frontend/contact.html"));
});

// Admin page content routes (for dashboard loading)
app.get("/admin/doctors", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const doctorsHtml = `
    <div class="admin-page">
      <h1>Doctors Management</h1>
      
      <form class="admin-form" id="doctor-form">
        <input type="hidden" id="doctor-id" />
        <input type="text" id="doctor-name" placeholder="Doctor Name" required />
        <select id="doctor-gender" required>
          <option value="" disabled selected>Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
        <input type="text" id="doctor-specialization" placeholder="Specialization" required />
        <button type="submit">Add Doctor</button>
      </form>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="doctors-table-body">
          <tr><td colspan="4" style="text-align: center;">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  res.send(doctorsHtml);
});

app.get("/admin/patients", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const patientsHtml = `
    <div class="admin-page">
      <h1>Patients Management</h1>
      
      <form class="admin-form" id="patient-form">
        <input type="hidden" id="patient-id" />
        <input type="text" id="patient-name" placeholder="Patient Name" required />
        <input type="number" id="patient-age" placeholder="Age" required />
        <select id="patient-gender" required>
          <option value="" disabled selected>Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
        <input type="text" id="patient-contact" placeholder="Contact" required />
        <button type="submit">Add Patient</button>
      </form>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="patients-table-body">
          <tr><td colspan="5" style="text-align: center;">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  res.send(patientsHtml);
});

app.get("/admin/staff", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const staffHtml = `
    <div class="admin-page">
      <h1>Staff Management</h1>
      
      <form class="admin-form" id="staff-form">
        <input type="hidden" id="staff-id" />
        <input type="text" id="staff-name" placeholder="Staff Name" required />
        <input type="text" id="staff-contact" placeholder="Contact" required />
        <input type="text" id="staff-role" placeholder="Role" required />
        <button type="submit">Add Staff</button>
      </form>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="staff-table-body">
          <tr><td colspan="4" style="text-align: center;">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  res.send(staffHtml);
});

app.get("/admin/pharmacy", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const pharmacyHtml = `
    <div class="admin-page">
      <h1>Pharmacy Management</h1>
      
      <form class="admin-form" id="medicine-form">
        <input type="hidden" id="medicine-id" />
        <input type="text" id="medicine-name" placeholder="Medicine Name" required />
        <input type="number" id="medicine-quantity" placeholder="Quantity" required />
        <input type="date" id="medicine-expiry" placeholder="Expiry Date" required />
        <input type="number" id="medicine-price" placeholder="Price" step="0.01" required />
        <button type="submit">Add Medicine</button>
      </form>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Expiry</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="medicine-table-body">
          <tr><td colspan="5" style="text-align: center;">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  res.send(pharmacyHtml);
});

app.get("/admin/orders", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const ordersHtml = `
    <div class="admin-page">
      <h1>Pharmacy Orders</h1>
      
      <table class="admin-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id="orders-table-body">
          <tr><td colspan="6" style="text-align: center;">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  res.send(ordersHtml);
});

app.get("/admin/contact", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const contactHtml = `
    <div class="admin-page">
      <h1>Contact Messages</h1>
      
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id="contact-table-body">
          <tr><td colspan="5" style="text-align: center;">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  res.send(contactHtml);
});

app.get("/admin/appointments", ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const appointmentsHtml = `
    <div class="admin-page">
      <h1>Appointments</h1>
      
      <table class="admin-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody id="appointments-table-body">
          <tr><td colspan="5" style="text-align: center;">Loading...</td></tr>
        </tbody>
      </table>

      <script>
        fetch("/appointments")
          .then(res => res.json())
          .then(data => {
            const body = document.getElementById("appointments-table-body");
            body.innerHTML = "";
            if (data.length === 0) {
              body.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No appointments</td></tr>";
            } else {
              data.forEach(app => {
                const row = document.createElement("tr");
                row.innerHTML = \`
                  <td>\${app.name}</td>
                  <td>\${app.doctor}</td>
                  <td>\${app.date}</td>
                  <td>\${app.time}</td>
                  <td>\${app.message}</td>
                \`;
                body.appendChild(row);
              });
            }
          })
          .catch(err => {
            document.getElementById("appointments-table-body").innerHTML = 
              "<tr><td colspan='5' style='text-align:center;color:red;'>Failed to load</td></tr>";
          });
      </script>
    </div>
  `;

  res.send(appointmentsHtml);
});

// Public page routes (no authentication required)
app.get("/doctorPublic.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/doctorPublic.html"));
});

app.get("/staffPublic.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/staffPublic.html"));
});

app.get("/patientPublic.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/patientPublic.html"));
});
app.get("/pharmacyPublic.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pharmacyPublic.html"));
});

// ✅ Signup route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    // Check if this is the first user (make them admin) or if email contains 'admin'
    let role = "user";
    const userCount = await User.countDocuments();
    if (userCount === 0 || email.toLowerCase().includes("admin")) {
      role = "admin";
    }

    const user = new User({ name, email, password, role });
    await user.save();

    req.session.user = user;
    res.status(200).json({ role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
});

// ✅ Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.session.user = user;
    res.status(200).json({ role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// ✅ Auth status check (for frontend)
app.get("/api/check-auth", (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// ✅ Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Logout error");
    res.redirect("/auth.html");
  });
});

// ---------- Appointments ----------

app.post("/submit-form", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(200).json({ message: "Appointment saved!" });
  } catch (error) {
    console.error("❌ Error saving appointment:", error);
    res.status(500).json({ message: "Failed to save appointment." });
  }
});
app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments." });
  }
});
app.delete("/appointments/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment." });
  }
});

// ---------- Pharmacy Stock ----------
app.get("/pharmacy/stock", async (req, res) => {
  try {
    const stock = await Medicine.find();
    res.status(200).json(stock);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stock" });
  }
});

app.post("/pharmacy/add", async (req, res) => {
  try {
    const { name, quantity, expiry, price } = req.body;
    if (!name || quantity == null || !expiry || price == null) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newMed = new Medicine({ name, quantity, expiry, price });
    await newMed.save();
    res.status(200).json({ message: "Medicine added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add medicine" });
  }
});

app.get("/pharmacy/get/:id", async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ message: "Medicine not found" });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: "Error fetching medicine" });
  }
});

app.put("/pharmacy/update/:id", async (req, res) => {
  try {
    const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating medicine" });
  }
});

app.delete("/pharmacy/delete/:id", async (req, res) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting medicine" });
  }
});

// ---------- Pharmacy Orders ----------
app.post("/pharmacy/order", async (req, res) => {
  try {
    const { medicineName, quantity, customerName, phone, address } = req.body;
    if (!medicineName || !quantity || !customerName || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newOrder = new Order({
      medicineName,
      quantity,
      customerName,
      phone,
      address,
    });
    await newOrder.save();
    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to place order" });
  }
});

app.get("/pharmacy/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// ---------- Doctors ----------
app.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

app.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctor details" });
  }
});

app.post("/doctors", async (req, res) => {
  try {
    const { name, gender, specialization } = req.body;
    if (!name || !gender || !specialization) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newDoctor = new Doctor({ name, gender, specialization });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(500).json({ message: "Failed to add doctor" });
  }
});

app.put("/doctors/:id", async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedDoctor)
      return res.status(404).json({ message: "Doctor not found" });
    res.json(updatedDoctor);
  } catch (err) {
    res.status(500).json({ message: "Failed to update doctor" });
  }
});

app.delete("/doctors/:id", async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor)
      return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete doctor" });
  }
});

// ---------- Staff ----------
app.get("/staff", async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.status(200).json(staffList);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff data" });
  }
});

app.get("/staff/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff" });
  }
});

app.post("/staff", async (req, res) => {
  try {
    const { name, contact, role } = req.body;
    if (!name || !contact || !role) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const newStaff = new Staff({ name, contact, role });
    await newStaff.save();
    res
      .status(201)
      .json({ message: "Staff added successfully", staff: newStaff });
  } catch (err) {
    res.status(500).json({ message: "Failed to add staff" });
  }
});

app.put("/staff/:id", async (req, res) => {
  try {
    const { name, contact, role } = req.body;
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      { name, contact, role },
      { new: true }
    );
    if (!updatedStaff)
      return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff updated successfully", staff: updatedStaff });
  } catch (err) {
    res.status(500).json({ message: "Failed to update staff" });
  }
});

app.delete("/staff/:id", async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff)
      return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete staff" });
  }
});

// Create Patient
app.post("/api/patient", async (req, res) => {
  try {
    const { name, age, gender, contact } = req.body;
    const newPatient = new Patient({ name, age, gender, contact });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

// Read All Patients
app.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

// Update Patient
app.put("/api/patient/:id", async (req, res) => {
  try {
    const { name, age, gender, contact } = req.body;
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, contact },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete Patient
app.delete("/api/patient/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ---------- Contact ----------
app.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.status(200).json({ message: "Contact message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

// Save payment after success
app.post("/api/payment/save", async (req, res) => {
  try {
    const { name, email, amount, status } = req.body;
    const newPayment = new Payment({
      name,
      email,
      amount,
      status,
      createdAt: new Date()
    });
    await newPayment.save();
    res.status(200).json({ message: "Payment saved" });
  } catch (err) {
    console.error("❌ Error saving payment:", err);
    res.status(500).json({ error: "Failed to save payment" });
  }
});

