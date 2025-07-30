console.log('Admin Dashboard loaded');
   // Only check auth once on page load
   fetch('/api/check-auth')
    .then(res => {
      if (res.status === 401) {
        window.location.href = '/auth.html';
      }
    })
    .catch(err => {
      console.error('Auth check failed:', err);
    });
    
    function logout() {
      // Show loading indicator
      const logoutBtn = event.target;
      logoutBtn.textContent = 'Logging out...';
      logoutBtn.disabled = true;
      
      fetch('/logout')
        .then(() => {
        window.location.href = '/auth.html';
        })
        .catch(err => {
          console.error('Logout failed:', err);
          logoutBtn.textContent = 'Logout';
          logoutBtn.disabled = false;
          alert('Logout failed. Please try again.');
        });
    }
    
    function loadPage(pageName) {
      // Update active state
      document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
      event.target.classList.add('active');
      
      // Show loading indicator
      const contentArea = document.getElementById('content-area');
      contentArea.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <div class="loading-indicator"></div>
          <p>Loading ${pageName}...</p>
        </div>
      `;
      
      // Load page content
      if (pageName === 'dashboard-content') {
        contentArea.innerHTML = document.getElementById('dashboard-content').outerHTML;
        loadDashboardStats();
        return;
      }
      
      fetch(`/admin/${pageName}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Page not found');
          }
          return response.text();
        })
        .then(html => {
          contentArea.innerHTML = html;
          // Initialize page-specific scripts
          if (pageName === 'doctors') initDoctorsPage();
          if (pageName === 'patients') initPatientsPage();
          if (pageName === 'staff') initStaffPage();
          if (pageName === 'pharmacy') initPharmacyPage();
          if (pageName === 'appointments') initAppointmentsPage();
          if (pageName === 'orders') initOrdersPage();
          if (pageName === 'contact') initContactPage();
          if (pageName === 'payments') fetchPaymentsPage();
        })
        .catch(error => {
          console.error('Error loading page:', error);
          contentArea.innerHTML = `
            <div style="text-align: center; padding: 40px; color: red;">
              <p>Error loading page. Please try again.</p>
              <button onclick="loadPage('${pageName}')" style="margin-top: 10px;">Retry</button>
            </div>
          `;
        });
    }
    
    function loadDashboardStats() {
      // Load counts for dashboard
      fetch('/doctors').then(r => r.json()).then(data => {
        const doctorCountEl = document.getElementById('doctor-count');
        if (doctorCountEl) doctorCountEl.textContent = data.length;
      }).catch(() => {
        const doctorCountEl = document.getElementById('doctor-count');
        if (doctorCountEl) doctorCountEl.textContent = 'Error';
      });
      
      fetch('/patients').then(r => r.json()).then(data => {
        const patientCountEl = document.getElementById('patient-count');
        if (patientCountEl) patientCountEl.textContent = data.length;
      }).catch(() => {
        const patientCountEl = document.getElementById('patient-count');
        if (patientCountEl) patientCountEl.textContent = 'Error';
      });
      
      fetch('/staff').then(r => r.json()).then(data => {
        const staffCountEl = document.getElementById('staff-count');
        if (staffCountEl) staffCountEl.textContent = data.length;
      }).catch(() => {
        const staffCountEl = document.getElementById('staff-count');
        if (staffCountEl) staffCountEl.textContent = 'Error';
      });
      
      fetch('/appointments').then(r => r.json()).then(data => {
        const appointmentCountEl = document.getElementById('appointment-count');
        if (appointmentCountEl) appointmentCountEl.textContent = data.length;
      }).catch(() => {
        const appointmentCountEl = document.getElementById('appointment-count');
        if (appointmentCountEl) appointmentCountEl.textContent = 'Error';
      });
    }
    
    // Load initial dashboard stats
    loadDashboardStats();
    
    // Admin page initialization functions
    function initDoctorsPage() {
      const form = document.getElementById('doctor-form');
      const tbody = document.getElementById('doctors-table-body');
      let editingId = null;

      // Load doctors
      fetch('/doctors')
        .then(r => r.json())
        .then(doctors => {
          tbody.innerHTML = '';
          doctors.forEach(doc => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${doc.name}</td>
              <td>${doc.gender}</td>
              <td>${doc.specialization}</td>
              <td>
                <button class="btn-edit" onclick="editDoctor('${doc._id}', '${doc.name}', '${doc.gender}', '${doc.specialization}')">Edit</button>
                <button class="btn-delete" onclick="deleteDoctor('${doc._id}')">Delete</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(err => {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error loading doctors</td></tr>';
        });

      // Handle form submission
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('doctor-name').value;
        const gender = document.getElementById('doctor-gender').value;
        const specialization = document.getElementById('doctor-specialization').value;

        try {
          const url = editingId ? `/doctors/${editingId}` : '/doctors';
          const method = editingId ? 'PUT' : 'POST';
          
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, gender, specialization })
          });

          if (res.ok) {
            alert(editingId ? 'Doctor updated!' : 'Doctor added!');
            form.reset();
            editingId = null;
            document.querySelector('#doctor-form button').textContent = 'Add Doctor';
            initDoctorsPage(); // Reload
          } else {
            alert('Error saving doctor');
          }
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    }

    function editDoctor(id, name, gender, specialization) {
      document.getElementById('doctor-id').value = id;
      document.getElementById('doctor-name').value = name;
      document.getElementById('doctor-gender').value = gender;
      document.getElementById('doctor-specialization').value = specialization;
      document.querySelector('#doctor-form button').textContent = 'Update Doctor';
      window.editingDoctorId = id;
    }

    function deleteDoctor(id) {
      if (confirm('Are you sure you want to delete this doctor?')) {
        fetch(`/doctors/${id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              alert('Doctor deleted!');
              initDoctorsPage();
            } else {
              alert('Error deleting doctor');
            }
          })
          .catch(err => alert('Error: ' + err.message));
      }
    }

    function initPatientsPage() {
      const form = document.getElementById('patient-form');
      const tbody = document.getElementById('patients-table-body');

      // Load patients
      fetch('/patients')
        .then(r => r.json())
        .then(patients => {
          tbody.innerHTML = '';
          patients.forEach(patient => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${patient.name}</td>
              <td>${patient.age}</td>
              <td>${patient.gender}</td>
              <td>${patient.contact}</td>
              <td>
                <button class="btn-edit" onclick="editPatient('${patient._id}', '${patient.name}', '${patient.age}', '${patient.gender}', '${patient.contact}')">Edit</button>
                <button class="btn-delete" onclick="deletePatient('${patient._id}')">Delete</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(err => {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error loading patients</td></tr>';
        });

      // Handle form submission
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('patient-name').value;
        const age = document.getElementById('patient-age').value;
        const gender = document.getElementById('patient-gender').value;
        const contact = document.getElementById('patient-contact').value;

        try {
          const url = window.editingPatientId ? `/api/patient/${window.editingPatientId}` : '/api/patient';
          const method = window.editingPatientId ? 'PUT' : 'POST';
          
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age, gender, contact })
          });

          if (res.ok) {
            alert(window.editingPatientId ? 'Patient updated!' : 'Patient added!');
            form.reset();
            window.editingPatientId = null;
            document.querySelector('#patient-form button').textContent = 'Add Patient';
            initPatientsPage(); // Reload
          } else {
            alert('Error saving patient');
          }
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    }

    function editPatient(id, name, age, gender, contact) {
      document.getElementById('patient-id').value = id;
      document.getElementById('patient-name').value = name;
      document.getElementById('patient-age').value = age;
      document.getElementById('patient-gender').value = gender;
      document.getElementById('patient-contact').value = contact;
      document.querySelector('#patient-form button').textContent = 'Update Patient';
      window.editingPatientId = id;
    }

    function deletePatient(id) {
      if (confirm('Are you sure you want to delete this patient?')) {
        fetch(`/api/patient/${id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              alert('Patient deleted!');
              initPatientsPage();
            } else {
              alert('Error deleting patient');
            }
          })
          .catch(err => alert('Error: ' + err.message));
      }
    }

    function initStaffPage() {
      const form = document.getElementById('staff-form');
      const tbody = document.getElementById('staff-table-body');

      // Load staff
      fetch('/staff')
        .then(r => r.json())
        .then(staff => {
          tbody.innerHTML = '';
          staff.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${s.name}</td>
              <td>${s.contact}</td>
              <td>${s.role}</td>
              <td>
                <button class="btn-edit" onclick="editStaff('${s._id}', '${s.name}', '${s.contact}', '${s.role}')">Edit</button>
                <button class="btn-delete" onclick="deleteStaff('${s._id}')">Delete</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(err => {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error loading staff</td></tr>';
        });

      // Handle form submission
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('staff-name').value;
        const contact = document.getElementById('staff-contact').value;
        const role = document.getElementById('staff-role').value;

        try {
          const url = window.editingStaffId ? `/staff/${window.editingStaffId}` : '/staff';
          const method = window.editingStaffId ? 'PUT' : 'POST';
          
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, contact, role })
          });

          if (res.ok) {
            alert(window.editingStaffId ? 'Staff updated!' : 'Staff added!');
            form.reset();
            window.editingStaffId = null;
            document.querySelector('#staff-form button').textContent = 'Add Staff';
            initStaffPage(); // Reload
          } else {
            alert('Error saving staff');
          }
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    }

    function editStaff(id, name, contact, role) {
      document.getElementById('staff-id').value = id;
      document.getElementById('staff-name').value = name;
      document.getElementById('staff-contact').value = contact;
      document.getElementById('staff-role').value = role;
      document.querySelector('#staff-form button').textContent = 'Update Staff';
      window.editingStaffId = id;
    }

    function deleteStaff(id) {
      if (confirm('Are you sure you want to delete this staff member?')) {
        fetch(`/staff/${id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              alert('Staff deleted!');
              initStaffPage();
            } else {
              alert('Error deleting staff');
            }
          })
          .catch(err => alert('Error: ' + err.message));
      }
    }

    function initPharmacyPage() {
      const form = document.getElementById('medicine-form');
      const tbody = document.getElementById('medicine-table-body');

      // Load medicines
      fetch('/pharmacy/stock')
        .then(r => r.json())
        .then(medicines => {
          tbody.innerHTML = '';
          medicines.forEach(med => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${med.name}</td>
              <td>${med.quantity}</td>
              <td>${med.expiry}</td>
              <td>${med.price}</td>
              <td>
                <button class="btn-edit" onclick="editMedicine('${med._id}', '${med.name}', '${med.quantity}', '${med.expiry}', '${med.price}')">Edit</button>
                <button class="btn-delete" onclick="deleteMedicine('${med._id}')">Delete</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(err => {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error loading medicines</td></tr>';
        });

      // Handle form submission
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('medicine-name').value;
        const quantity = document.getElementById('medicine-quantity').value;
        const expiry = document.getElementById('medicine-expiry').value;
        const price = document.getElementById('medicine-price').value;

        try {
          const url = window.editingMedicineId ? `/pharmacy/update/${window.editingMedicineId}` : '/pharmacy/add';
          const method = window.editingMedicineId ? 'PUT' : 'POST';
          
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity, expiry, price })
          });

          if (res.ok) {
            alert(window.editingMedicineId ? 'Medicine updated!' : 'Medicine added!');
            form.reset();
            window.editingMedicineId = null;
            document.querySelector('#medicine-form button').textContent = 'Add Medicine';
            initPharmacyPage(); // Reload
          } else {
            alert('Error saving medicine');
          }
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    }

    function editMedicine(id, name, quantity, expiry, price) {
      document.getElementById('medicine-id').value = id;
      document.getElementById('medicine-name').value = name;
      document.getElementById('medicine-quantity').value = quantity;
      document.getElementById('medicine-expiry').value = expiry;
      document.getElementById('medicine-price').value = price;
      document.querySelector('#medicine-form button').textContent = 'Update Medicine';
      window.editingMedicineId = id;
    }

    function deleteMedicine(id) {
      if (confirm('Are you sure you want to delete this medicine?')) {
        fetch(`/pharmacy/delete/${id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              alert('Medicine deleted!');
              initPharmacyPage();
            } else {
              alert('Error deleting medicine');
            }
          })
          .catch(err => alert('Error: ' + err.message));
      }
    }

    function initAppointmentsPage() {
      const tbody = document.getElementById('appointments-table-body');

      fetch('/appointments')
        .then(r => r.json())
        .then(appointments => {
          tbody.innerHTML = '';
          appointments.forEach(apt => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${apt.name || 'N/A'}</td>
              <td>${apt.doctor || 'N/A'}</td>
              <td>${apt.date || 'N/A'}</td>
              <td>${apt.time || 'N/A'}</td>
              <td>
                <button class="btn-delete" onclick="deleteAppointment('${apt._id}')">Delete</button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(err => {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error loading appointments</td></tr>';
        });
    }

    function deleteAppointment(id) {
      if (confirm('Are you sure you want to delete this appointment?')) {
        fetch(`/appointments/${id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              alert('Appointment deleted!');
              initAppointmentsPage();
            } else {
              alert('Error deleting appointment');
            }
          })
          .catch(err => alert('Error: ' + err.message));
      }
    }

    function initOrdersPage() {
      const tbody = document.getElementById('orders-table-body');

      fetch('/pharmacy/orders')
        .then(r => r.json())
        .then(orders => {
          tbody.innerHTML = '';
          orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${order.medicineName}</td>
              <td>${order.quantity}</td>
              <td>${order.customerName}</td>
              <td>${order.phone}</td>
              <td>${order.address}</td>
              <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(err => {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading orders</td></tr>';
        });
    }

    function initContactPage() {
      const tbody = document.getElementById('contact-table-body');

      fetch('/contacts')
        .then(r => r.json())
        .then(contacts => {
          tbody.innerHTML = '';
          contacts.forEach(contact => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${contact.name}</td>
              <td>${contact.email}</td>
              <td>${contact.phone}</td>
              <td>${contact.message}</td>
              <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(err => {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error loading contacts</td></tr>';
        });
    }

    function fetchPaymentsPage() {
      fetch("http://localhost:5000/api/payment/all")
        .then(res => res.json())
        .then(data => {
          const tbody = document.querySelector("#payment-table tbody");
          tbody.innerHTML = "";
          data.forEach((payment, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${index + 1}</td>
              <td>${payment.name || "-"}</td>
              <td>${payment.email || "-"}</td>
              <td>$${(payment.amount / 100).toFixed(2)}</td>
              <td>${payment.status}</td>
              <td>${new Date(payment.createdAt).toLocaleString()}</td>
            `;
            tbody.appendChild(row);
          });
        })
        .catch(err => {
          alert("Failed to fetch payments.");
        });
    }
  