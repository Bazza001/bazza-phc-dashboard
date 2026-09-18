import React, { useMemo, useState } from "react";

const departments = [
  "ICT Centre",
  "Records Unit",
  "Nursing Unit",
  "Consultant Room",
  "Laboratory Unit",
  "Pharmacy Unit",
  "Ultrasound Room",
  "In-Charge",
  "General Cashier",
  "Male Ward",
  "Female Ward",
  "Maternity Ward",
  "Child Ward",
  "Labour Room",
  "Immunization Unit",
  "Family Planning Unit",
  "Adolescent Unit",
];

const permissions = [
  "View",
  "Create",
  "Edit",
  "Delete",
  "Print",
  "Cashier",
  "Reports",
  "Stock",
  "SMS",
  "Alerts",
];

const roles = [
  "Super Admin",
  "In-Charge",
  "General Cashier",
  "ICT Staff",
  "Records Staff",
  "Nurse",
  "Consultant",
  "Laboratory Staff",
  "Pharmacy Staff",
  "Ultrasound Staff",
  "Ward Staff",
  "Immunization Staff",
  "Family Planning Staff",
  "Adolescent Staff",
];

const initialStaff = [
  {
    id: 1,
    staffId: "BZ000",
    name: "Super Administrator",
    username: "admin",
    password: "1234",
    department: "ICT Centre",
    role: "Super Admin",
    status: "Active",
  },
  {
    id: 2,
    staffId: "BZ001",
    name: "Altini Garba Bazza",
    username: "altini",
    password: "1234",
    department: "In-Charge",
    role: "In-Charge",
    status: "Active",
  },
  {
    id: 3,
    staffId: "BZ002",
    name: "Hadiza Umar",
    username: "hadiza",
    password: "1234",
    department: "Pharmacy Unit",
    role: "Pharmacy Staff",
    status: "Active",
  },
  {
    id: 4,
    staffId: "BZ003",
    name: "Abba Yaro",
    username: "abbayaro",
    password: "1234",
    department: "Ultrasound Room",
    role: "Ultrasound Staff",
    status: "Active",
  },
  {
    id: 5,
    staffId: "BZ004",
    name: "Kabiru Lawal",
    username: "kabiru",
    password: "1234",
    department: "Laboratory Unit",
    role: "Laboratory Staff",
    status: "Active",
  },
];

const demoPatients = [
  {
    id: 1,
    card: "BZ-P001",
    name: "Aisha Musa",
    phone: "08000000001",
    sex: "Female",
    status: "Active",
  },
  {
    id: 2,
    card: "BZ-P002",
    name: "Ibrahim Bello",
    phone: "08000000002",
    sex: "Male",
    status: "Active",
  },
  {
    id: 3,
    card: "BZ-P003",
    name: "Fatima Umar",
    phone: "08000000003",
    sex: "Female",
    status: "Active",
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("Dashboard"); 
  const [recordsView, setRecordsView] = useState("dashboard");
  const [staff, setStaff] = useState(initialStaff);
  const [patients, setPatients] = useState(demoPatients);
  const [transactions, setTransactions] = useState([]);
  const [labRequests, setLabRequests] = useState([
    { id: 1, card: "BZ-P001", patientName: "Aisha Musa", test: "Malaria Test", consultant: "Consultant Room", status: "New", paymentStatus: "Pending", amount: 1500, date: "9/18/2026, 1:20:00 PM" },
    { id: 2, card: "BZ-P002", patientName: "Ibrahim Bello", test: "Full Blood Count (FBC)", consultant: "Consultant Room", status: "Sample Received", paymentStatus: "Paid", amount: 3000, date: "9/18/2026, 1:25:00 PM" },
    { id: 3, card: "BZ-P003", patientName: "Fatima Yusuf", test: "Urinalysis", consultant: "Consultant Room", status: "In Progress", paymentStatus: "Paid", amount: 1000, date: "9/18/2026, 1:30:00 PM" },
  ]);
  const [search, setSearch] = useState("");
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const emptyStaffForm = {
    name: "",
    username: "",
    password: "",
    department: "ICT Centre",
    role: "ICT Staff",
    status: "Active",
  };

  const [staffForm, setStaffForm] = useState(emptyStaffForm);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);

  const [enabledPermissions, setEnabledPermissions] = useState(
    permissions.reduce((acc, item) => {
      acc[item] = true;
      return acc;
    }, {})
  );

  const [notification, setNotification] = useState("");

  const filteredStaff = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return staff;

    return staff.filter(
      (person) =>
        person.name.toLowerCase().includes(q) ||
        person.staffId.toLowerCase().includes(q) ||
        person.username.toLowerCase().includes(q) ||
        person.department.toLowerCase().includes(q) ||
        person.role.toLowerCase().includes(q)
    );
  }, [staff, search]);

  const showMessage = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = staff.find(
      (person) =>
        person.username === loginForm.username &&
        person.password === loginForm.password &&
        person.status === "Active"
    );

    if (!user) {
      showMessage("Username ko Password ba daidai ba.");
      return;
    }

    setCurrentUser(user);
    setPage("Dashboard");
    setLoginForm({
      username: "",
      password: "",
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("Dashboard");
  };

  const openAddStaff = () => {
    setEditingStaff(null);
    setStaffForm(emptyStaffForm);
    setShowStaffModal(true);
  };

  const openEditStaff = (person) => {
    setEditingStaff(person);

    setStaffForm({
      name: person.name,
      username: person.username,
      password: person.password,
      department: person.department,
      role: person.role,
      status: person.status,
    });

    setShowStaffModal(true);
  };

  const saveStaff = (e) => {
    e.preventDefault();

    if (
      !staffForm.name.trim() ||
      !staffForm.username.trim() ||
      !staffForm.password.trim()
    ) {
      showMessage("Cika dukkan muhimman bayanai.");
      return;
    }

    if (editingStaff) {
      setStaff((prev) =>
        prev.map((person) =>
          person.id === editingStaff.id
            ? {
                ...person,
                ...staffForm,
              }
            : person
        )
      );

      showMessage("An sabunta ma'aikaci.");
    } else {
      const newStaff = {
        id: Date.now(),
        staffId: `BZ${String(staff.length).padStart(3, "0")}`,
        ...staffForm,
      };

      setStaff((prev) => [...prev, newStaff]);
      showMessage("An ƙara sabon ma'aikaci.");
    }

    setShowStaffModal(false);
    setEditingStaff(null);
    setStaffForm(emptyStaffForm);
  };

  const deleteStaff = (id) => {
    const person = staff.find((item) => item.id === id);

    if (!person) return;

    if (person.role === "Super Admin") {
      showMessage("Ba za a iya goge Super Admin ba.");
      return;
    }

    setStaff((prev) => prev.filter((item) => item.id !== id));
    showMessage("An cire ma'aikacin daga tsarin.");
  };

  const togglePermission = (permission) => {
    setEnabledPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  if (!currentUser) {
    return (
      <LoginScreen
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        notification={notification}
      />
    );
  }

  return (
    <div className="app">
      <style>{styles}</style>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">B</div>
          <div>
            <div className="brand-title">BAZZA PHC</div>
            <div className="brand-subtitle">Sokoto</div>
          </div>
        </div>

        <div className="facility-name">
          <strong>COMPREHENSIVE HEALTH CLINIC BAZZAH</strong>
          <span>PRIMARY HEALTH CARE DEPARTMENT</span>
        </div>

        <nav className="menu">
          <MenuItem
            label="Dashboard"
            icon="⌂"
            active={page === "Dashboard"}
            onClick={() => setPage("Dashboard")}
          />

          <div className="menu-section">PATIENT SERVICES</div>

          <MenuItem
            label="ICT Centre"
            icon="▣"
            active={page === "ICT Centre"}
            onClick={() => setPage("ICT Centre")}
          />

          <MenuItem
            label="Records Unit"
            icon="▤"
            active={page === "Records Unit"}
            onClick={() => setPage("Records Unit")}
          />

          <MenuItem
            label="Nursing Unit"
            icon="♙"
            active={page === "Nursing Unit"}
            onClick={() => setPage("Nursing Unit")}
          />

          <MenuItem
            label="Consultant Room"
            icon="✚"
            active={page === "Consultant Room"}
            onClick={() => setPage("Consultant Room")}
          />

          <MenuItem
            label="Laboratory"
            icon="⚗"
            active={page === "Laboratory Unit"}
            onClick={() => setPage("Laboratory Unit")}
          />

          <MenuItem
            label="Pharmacy"
            icon="⚕"
            active={page === "Pharmacy Unit"}
            onClick={() => setPage("Pharmacy Unit")}
          />

          <MenuItem
            label="Ultrasound"
            icon="◉"
            active={page === "Ultrasound Room"}
            onClick={() => setPage("Ultrasound Room")}
          />

          <div className="menu-section">WARDS & PROGRAMS</div>

          <MenuItem
            label="Male Ward"
            icon="M"
            active={page === "Male Ward"}
            onClick={() => setPage("Male Ward")}
          />

          <MenuItem
            label="Female Ward"
            icon="F"
            active={page === "Female Ward"}
            onClick={() => setPage("Female Ward")}
          />

          <MenuItem
            label="Maternity Ward"
            icon="♥"
            active={page === "Maternity Ward"}
            onClick={() => setPage("Maternity Ward")}
          />

          <MenuItem
            label="Child Ward"
            icon="C"
            active={page === "Child Ward"}
            onClick={() => setPage("Child Ward")}
          />

          <MenuItem
            label="Labour Room"
            icon="L"
            active={page === "Labour Room"}
            onClick={() => setPage("Labour Room")}
          />

          <MenuItem
            label="Immunization"
            icon="I"
            active={page === "Immunization Unit"}
            onClick={() => setPage("Immunization Unit")}
          />

          <MenuItem
            label="Family Planning"
            icon="P"
            active={page === "Family Planning Unit"}
            onClick={() => setPage("Family Planning Unit")}
          />

          <MenuItem
            label="Adolescent Unit"
            icon="A"
            active={page === "Adolescent Unit"}
            onClick={() => setPage("Adolescent Unit")}
          />

          <div className="menu-section">ADMINISTRATION</div>

          <MenuItem
            label="Staff & Permissions"
            icon="♟"
            active={page === "Staff & Permissions"}
            onClick={() => setPage("Staff & Permissions")}
          />

          <MenuItem
            label="General Cashier"
            icon="₦"
            active={page === "General Cashier"}
            onClick={() => setPage("General Cashier")}
          />

          <MenuItem
            label="Roster & Attendance"
            icon="▦"
            active={page === "Roster & Attendance"}
            onClick={() => setPage("Roster & Attendance")}
          />

          <MenuItem
            label="Reports"
            icon="▥"
            active={page === "Reports"}
            onClick={() => setPage("Reports")}
          />

          <MenuItem
            label="Alerts"
            icon="!"
            active={page === "Alerts"}
            onClick={() => setPage("Alerts")}
          />

          <MenuItem
            label="SMS / Notifications"
            icon="✉"
            active={page === "SMS / Notifications"}
            onClick={() => setPage("SMS / Notifications")}
          />

          <MenuItem
            label="Audit Logs"
            icon="◌"
            active={page === "Audit Logs"}
            onClick={() => setPage("Audit Logs")}
          />

          <MenuItem
            label="Settings"
            icon="⚙"
            active={page === "Settings"}
            onClick={() => setPage("Settings")}
          />
        </nav>

        <div className="sidebar-footer">
          <div className="online-dot"></div>
          <span>System Online</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="top-title">{page}</div>
            <div className="top-location">
              Waziri Maccido Road, Bazza Area, Sokoto
            </div>
          </div>

          <div className="top-actions">
            <button className="icon-button" onClick={() => setPage("Alerts")}>
              🔔
            </button>

            <div className="user-box">
              <div className="avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div className="user-details">
                <strong>{currentUser.name}</strong>
                <span>{currentUser.role}</span>
              </div>
            </div>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {notification && <div className="toast">{notification}</div>}

        <section className="content">
          {page === "Dashboard" && (
            <DashboardPage
              currentUser={currentUser}
              patients={patients}
              staff={staff}
              setPage={setPage}
            />
          )}

          {page === "Staff & Permissions" && (
            <StaffManagement
              staff={filteredStaff}
              search={search}
              setSearch={setSearch}
              openAddStaff={openAddStaff}
              openEditStaff={openEditStaff}
              deleteStaff={deleteStaff}
              openPermissions={(person) => {
                setSelectedStaff(person);
                setShowPermissions(true);
              }}
            />
          )}

          {page === "ICT Centre" && (
            <ICTPage
              patients={patients}
              setPatients={setPatients}
              showMessage={showMessage}
            />
          )}

          {page === "Records Unit" && (
            <RecordsPage
              patients={patients}
              showMessage={showMessage}
              setTransactions={setTransactions}
            />
          )}

          {page === "Nursing Unit" && (
            <ModulePage
              title="Nursing Unit"
              subtitle="Nursing assessment, patient flow and ward assignment"
              icon="♙"
              stats={[
                ["Waiting", "8"],
                ["Ready for Consultant", "5"],
                ["In Ward", "21"],
                ["Completed", "37"],
              ]}
            />
          )}

          {page === "Consultant Room" && (
  <ConsultantPage
    patients={patients}
    showMessage={showMessage}
  />
)}

          {page === "Laboratory Unit" && (
            <LaboratoryPage
              patients={patients}
              requests={labRequests}
              setRequests={setLabRequests}
              setTransactions={setTransactions}
              showMessage={showMessage}
            />
          )}

          {page === "Pharmacy Unit" && (
  <PharmacyPage
    patients={patients}
    showMessage={showMessage}
    setTransactions={setTransactions}
  />
)}

          {page === "Ultrasound Room" && (
            <ModulePage
              title="Ultrasound Room"
              subtitle="Ultrasound requests, scanning and reports"
              icon="◉"
              stats={[
                ["New Requests", "4"],
                ["Waiting", "3"],
                ["Completed", "15"],
                ["Reports Ready", "7"],
              ]}
            />
          )}

          {[
            "Male Ward",
            "Female Ward",
            "Maternity Ward",
            "Child Ward",
            "Labour Room",
          ].includes(page) && (
            <ModulePage
              title={page}
              subtitle="Ward patient management and monitoring"
              icon="▣"
              stats={[
                ["Occupied Beds", "18"],
                ["Available Beds", "12"],
                ["New Admissions", "4"],
                ["Discharges", "2"],
              ]}
            />
          )}

          {[
            "Immunization Unit",
            "Family Planning Unit",
            "Adolescent Unit",
          ].includes(page) && (
            <ModulePage
              title={page}
              subtitle="Program services and patient visits"
              icon="✚"
              stats={[
                ["Today's Visits", "14"],
                ["Pending", "3"],
                ["Completed", "11"],
                ["Follow-up", "6"],
              ]}
            />
          )}

          {page === "General Cashier" && (
            <GeneralCashierPage transactions={transactions} />
          )}

          {page === "Roster & Attendance" && (
            <RosterPage staff={staff} />
          )}

          {page === "Reports" && (
            <ModulePage
              title="Reports"
              subtitle="Hospital and department reports"
              icon="▥"
              stats={[
                ["Daily Reports", "12"],
                ["Monthly Reports", "4"],
                ["Department Reports", "17"],
                ["Pending Reports", "2"],
              ]}
            />
          )}

          {page === "Alerts" && (
            <ModulePage
              title="Department Alerts"
              subtitle="Alerts sent between authorized departments"
              icon="!"
              stats={[
                ["New Alerts", "8"],
                ["Consultant Alerts", "3"],
                ["Laboratory Alerts", "2"],
                ["Other Alerts", "3"],
              ]}
            />
          )}

          {page === "SMS / Notifications" && (
            <ModulePage
              title="SMS / Notifications"
              subtitle="Patient messages and department notifications"
              icon="✉"
              stats={[
                ["Sent Today", "38"],
                ["Result Ready", "12"],
                ["Follow-up", "15"],
                ["Appointment", "11"],
              ]}
            />
          )}

          {page === "Audit Logs" && (
            <AuditPage currentUser={currentUser} />
          )}

          {page === "Settings" && (
            <ModulePage
              title="System Settings"
              subtitle="Hospital configuration and system controls"
              icon="⚙"
              stats={[
                ["Departments", departments.length],
                ["Staff", staff.length],
                ["Permissions", permissions.length],
                ["System", "Active"],
              ]}
            />
          )}
        </section>
      </main>

      {showStaffModal && (
        <Modal
          title={editingStaff ? "Edit Staff" : "Add New Staff"}
          onClose={() => setShowStaffModal(false)}
        >
          <form onSubmit={saveStaff}>
            <div className="form-grid">
              <FormField label="Full Name">
                <input
                  value={staffForm.name}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField label="Username">
                <input
                  value={staffForm.username}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      username: e.target.value,
                    })
                  }
                  placeholder="Login username"
                />
              </FormField>

              <FormField label="Password">
                <input
                  value={staffForm.password}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      password: e.target.value,
                    })
                  }
                  placeholder="Password"
                />
              </FormField>

              <FormField label="Department">
                <select
                  value={staffForm.department}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      department: e.target.value,
                    })
                  }
                >
                  {departments.map((department) => (
                    <option key={department}>{department}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Role">
                <select
                  value={staffForm.role}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      role: e.target.value,
                    })
                  }
                >
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Status">
                <select
                  value={staffForm.status}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </FormField>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setShowStaffModal(false)}
              >
                Cancel
              </button>

              <button type="submit" className="button primary">
                {editingStaff ? "Save Changes" : "Add Staff"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showPermissions && selectedStaff && (
        <Modal
          title={`Permissions — ${selectedStaff.name}`}
          onClose={() => setShowPermissions(false)}
        >
          <p className="modal-description">
            Manage access permissions for this staff account.
          </p>

          <div className="permission-grid">
            {permissions.map((permission) => (
              <label className="permission-item" key={permission}>
                <input
                  type="checkbox"
                  checked={enabledPermissions[permission]}
                  onChange={() => togglePermission(permission)}
                />
                <span>{permission}</span>
              </label>
            ))}
          </div>

          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setShowPermissions(false)}
            >
              Close
            </button>

            <button
              className="button primary"
              onClick={() => {
                setShowPermissions(false);
                showMessage("An adana permissions.");
              }}
            >
              Save Permissions
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function LoginScreen({
  loginForm,
  setLoginForm,
  handleLogin,
  notification,
}) {
  return (
    <div className="login-page">
      <style>{styles}</style>

      <div className="login-card">
        <div className="login-logo">B</div>

        <h1>Bazza PHC</h1>
        <p className="login-subtitle">
          Comprehensive Health Clinic Bazzah
        </p>

        <div className="login-line"></div>

        <h2>Staff Login</h2>

        {notification && <div className="login-error">{notification}</div>}

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({
                ...loginForm,
                username: e.target.value,
              })
            }
            placeholder="Enter username"
          />

          <label>Password</label>
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({
                ...loginForm,
                password: e.target.value,
              })
            }
            placeholder="Enter password"
          />

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        <div className="demo-box">
          <strong>Demo Login</strong>
          <span>Super Admin: admin / 1234</span>
          <span>In-Charge: altini / 1234</span>
          <span>Pharmacy: hadiza / 1234</span>
          <span>Ultrasound: abbayaro / 1234</span>
          <span>Laboratory: kabiru / 1234</span>
        </div>

        <footer>
          Primary Health Care Department • Sokoto State
        </footer>
      </div>
    </div>
  );
}

function MenuItem({ label, icon, active, onClick }) {
  return (
    <button
      className={`menu-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="menu-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function DashboardPage({ currentUser, patients, staff, setPage }) {
  return (
    <div>
      <div className="welcome">
        <div>
          <div className="eyebrow">WELCOME BACK</div>
          <h1>{currentUser.name}</h1>
          <p>
            Here is the current overview of Bazza Primary Health Care.
          </p>
        </div>

        <div className="date-box">
          <strong>{new Date().toLocaleDateString()}</strong>
          <span>{currentUser.department}</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon="♙"
          text="Registered patients"
        />

        <StatCard
          title="Staff"
          value={staff.length}
          icon="♟"
          text="Active staff accounts"
        />

        <StatCard
          title="Today's Visits"
          value="42"
          icon="▣"
          text="Patient visits today"
        />

        <StatCard
          title="Pending Tasks"
          value="17"
          icon="!"
          text="Across departments"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Department Overview</h2>
              <p>Current activity by department</p>
            </div>
          </div>

          <div className="department-list">
            {[
              ["Records Unit", "12 patients waiting"],
              ["Nursing Unit", "8 patients waiting"],
              ["Consultant Room", "5 consultations"],
              ["Laboratory Unit", "7 new requests"],
              ["Pharmacy Unit", "9 prescriptions"],
              ["Ultrasound Room", "4 new requests"],
            ].map(([name, info]) => (
              <div className="department-row" key={name}>
                <div className="dept-icon">+</div>

                <div>
                  <strong>{name}</strong>
                  <span>{info}</span>
                </div>

                <span className="status-dot"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Frequently used modules</p>
            </div>
          </div>

          <div className="quick-actions">
            <button onClick={() => setPage("ICT Centre")}>
              <span>▣</span>
              Register Patient
            </button>

            <button onClick={() => setPage("Records Unit")}>
              <span>▤</span>
              Patient Records
            </button>

            <button onClick={() => setPage("General Cashier")}>
              <span>₦</span>
              Cashier
            </button>

            <button onClick={() => setPage("Roster & Attendance")}>
              <span>▦</span>
              Attendance
            </button>
          </div>
        </div>
      </div>

      <div className="panel recent-panel">
        <div className="panel-header">
          <div>
            <h2>Recent Patients</h2>
            <p>Latest patient registrations</p>
          </div>

          <button
            className="text-button"
            onClick={() => setPage("ICT Centre")}
          >
            View All
          </button>
        </div>

        <PatientTable patients={patients} />
      </div>
    </div>
  );
}

function ICTPage({ patients, setPatients, showMessage }) {
  const [form, setForm] = useState({
    surname: "",
    otherNames: "",
    phone: "",
    sex: "Female",
    spouse: "",
  });

  const registerPatient = (e) => {
    e.preventDefault();

    if (!form.surname.trim() || !form.otherNames.trim()) {
      showMessage("Shigar da sunan mara lafiya.");
      return;
    }

    const newPatient = {
      id: Date.now(),
      card: `BZ-P${String(patients.length + 1).padStart(3, "0")}`,
      name: `${form.surname} ${form.otherNames}`,
      phone: form.phone || "N/A",
      sex: form.sex,
      status: "Active",
    };

    setPatients((prev) => [...prev, newPatient]);

    setForm({
      surname: "",
      otherNames: "",
      phone: "",
      sex: "Female",
      spouse: "",
    });

    showMessage(`An yi registration. Card Number: ${newPatient.card}`);
  };

  return (
    <div>
      <PageHeader
        title="ICT Centre"
        subtitle="Patient registration and central information technology services"
        icon="▣"
      />

      <div className="stats-grid">
        <StatCard title="Patients" value={patients.length} icon="♙" />
        <StatCard title="New Today" value="12" icon="+" />
        <StatCard title="SMS Sent" value="38" icon="✉" />
        <StatCard title="System Status" value="Online" icon="●" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Register New Patient</h2>
            <p>ICT creates the shared Patient/Card Number.</p>
          </div>
        </div>

        <form onSubmit={registerPatient}>
          <div className="form-grid">
            <FormField label="Surname">
              <input
                value={form.surname}
                onChange={(e) =>
                  setForm({
                    ...form,
                    surname: e.target.value,
                  })
                }
                placeholder="Surname"
              />
            </FormField>

            <FormField label="Other Names">
              <input
                value={form.otherNames}
                onChange={(e) =>
                  setForm({
                    ...form,
                    otherNames: e.target.value,
                  })
                }
                placeholder="Other names"
              />
            </FormField>

            <FormField label="Phone Number">
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone number"
              />
            </FormField>

            <FormField label="Sex / Gender">
              <select
                value={form.sex}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sex: e.target.value,
                  })
                }
              >
                <option>Female</option>
                <option>Male</option>
              </select>
            </FormField>

            <FormField label="Spouse Name (if applicable)">
              <input
                value={form.spouse}
                onChange={(e) =>
                  setForm({
                    ...form,
                    spouse: e.target.value,
                  })
                }
                placeholder="Spouse name"
              />
            </FormField>
          </div>

          <div className="modal-actions left">
            <button className="button primary" type="submit">
              Register Patient
            </button>
          </div>
        </form>
      </div>

      <div className="panel recent-panel">
        <div className="panel-header">
          <div>
            <h2>Patient Registry</h2>
            <p>Search and view registered patients.</p>
          </div>
        </div>

        <PatientTable patients={patients} />
      </div>
    </div>
  );
}
function RecordsDashboard({ patients, onOpenService }) {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Records Unit</h1>
          <p>Patient records, files and registration services</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Today's Cards"
          value="12"
          icon="▣"
          text="Cards issued"
        />

        <StatCard
          title="Files Issued"
          value="18"
          icon="✓"
          text="Files issued"
        />

        <StatCard
          title="Pending"
          value="4"
          icon="!"
          text="Pending records"
        />

        <StatCard
          title="Total Records"
          value={patients.length}
          icon="◉"
          text="Registered patients"
        />
      </div>

      <div className="card">
        <h2>Records Services</h2>
        <p>
          Search patients, issue cards and files, and process Records payments.
        </p>

        <button
          className="primary"
          onClick={onOpenService}
        >
          Open Patient Records
        </button>
      </div>
    </div>
  );
}
function RecordsPage({ patients, showMessage, setTransactions }) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [service, setService] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const prices = {
    Card: 100,
    File: 500,
    "Card + File": 600,
  };

  const results = patients.filter((patient) => {
    const q = search.toLowerCase().trim();

    if (!q) return false;

    return (
      patient.card.toLowerCase().includes(q) ||
      patient.name.toLowerCase().includes(q) ||
      patient.phone.toLowerCase().includes(q)
    );
  });

  const handlePayment = () => {
    if (!selectedPatient) {
      showMessage("Da farko nemo patient.");
      return;
    }

    if (!service) {
      showMessage("Zaɓi Card, File ko Card + File.");
      return;
    }

    const amount = prices[service];

    const transaction = {
      id: Date.now(),
      transactionNo: `TRX-${Date.now()}`,
      department: "Records Unit",
      patientId: selectedPatient.id,
      card: selectedPatient.card,
      patientName: selectedPatient.name,
      service,
      amount,
      paymentMethod,
      paymentStatus,
      cashier: "Records Cashier",
      date: new Date().toLocaleString(),
    };

    setTransactions((prev) => [transaction, ...prev]);

    showMessage(
      `${service} na ${selectedPatient.name} an yi payment ₦${amount}.`
    );

    setSearch("");
    setSelectedPatient(null);
    setService("");
    setPaymentMethod("Cash");
    setPaymentStatus("Paid");
  };

  const printSlip = () => {
    if (!selectedPatient || !service) {
      showMessage("Zaɓi patient da service kafin printing.");
      return;
    }

    window.print();
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Records Unit</h1>
          <p>Patient records, Card, File and registration services</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Today's Cards"
          value="12"
          icon="▤"
          text="Cards issued"
        />

        <StatCard
          title="Files Issued"
          value="18"
          icon="📁"
          text="Files issued"
        />

        <StatCard
          title="Pending"
          value="4"
          icon="!"
          text="Pending records"
        />

        <StatCard
          title="Total Records"
          value={patients.length}
          icon="👤"
          text="Registered patients"
        />
      </div>

      <div className="card">
        <h2>Search Patient</h2>
        <p>Search using Card Number, Name or Phone Number.</p>

        <input
          className="search"
          placeholder="e.g. BZ-P005, Musa Ali or 08123456789"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <div style={{ marginTop: 15 }}>
            {results.length === 0 ? (
              <p>No patient found.</p>
            ) : (
              results.map((patient) => (
                <button
                  key={patient.id}
                  className="secondary"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: 8,
                  }}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <strong>{patient.card}</strong> — {patient.name} —{" "}
                  {patient.phone}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedPatient && (
        <>
          <div className="card">
            <h2>Patient Profile</h2>

            <div className="access-box">
              <strong>Card Number</strong>
              <span>{selectedPatient.card}</span>
            </div>

            <div className="access-box">
              <strong>Patient Name</strong>
              <span>{selectedPatient.name}</span>
            </div>

            <div className="access-box">
              <strong>Phone</strong>
              <span>{selectedPatient.phone}</span>
            </div>

            <div className="access-box">
              <strong>Sex</strong>
              <span>{selectedPatient.sex}</span>
            </div>
          </div>

          <div className="card">
            <h2>Records Service</h2>

            <label>Service</label>

            <select
              className="search"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">Select Service</option>
              <option value="Card">Card — ₦100</option>
              <option value="File">File — ₦500</option>
              <option value="Card + File">Card + File — ₦600</option>
            </select>

            {service && (
              <div className="access-box">
                <strong>Amount</strong>
                <span>₦{prices[service]}</span>
              </div>
            )}

            <label>Payment Method</label>

            <select
              className="search"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="POS">POS</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            <label>Payment Status</label>

            <select
              className="search"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                className="primary"
                onClick={handlePayment}
              >
                Save Transaction
              </button>

              <button
                className="secondary"
                onClick={printSlip}
              >
                Print Slip
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function StaffManagement({
  staff,
  search,
  setSearch,
  openAddStaff,
  openEditStaff,
  deleteStaff,
  openPermissions,
}) {
  return (
    <div>
      <PageHeader
        title="Staff & Permissions"
        subtitle="Manage staff accounts, departments, roles and permissions"
        icon="♟"
      />

      <div className="toolbar">
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff, ID, username or department..."
        />

        <button className="button primary" onClick={openAddStaff}>
          + Add Staff
        </button>
      </div>

      <div className="panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((person) => (
                <tr key={person.id}>
                  <td>
                    <strong>{person.staffId}</strong>
                  </td>

                  <td>{person.name}</td>

                  <td>
                    <span className="username-badge">
                      {person.username}
                    </span>
                  </td>

                  <td>{person.department}</td>

                  <td>
                    <span className="role-badge">{person.role}</span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        person.status === "Active"
                          ? "active-status"
                          : "inactive-status"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="small-button"
                        onClick={() => openPermissions(person)}
                      >
                        Permissions
                      </button>

                      <button
                        className="small-button"
                        onClick={() => openEditStaff(person)}
                      >
                        Edit
                      </button>

                      <button
                        className="small-button danger"
                        onClick={() => deleteStaff(person.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {staff.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LaboratoryPage({ patients, requests, setRequests, setTransactions, showMessage }) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [test, setTest] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [result, setResult] = useState("");

  const tests = {
    "Malaria Test": 1500,
    "Full Blood Count (FBC)": 3000,
    "Urinalysis": 1000,
    "Blood Group": 1000,
    "Widal Test": 2000,
    "Pregnancy Test": 1000,
  };

  const filteredPatients = patients.filter((patient) => {
    const q = search.toLowerCase().trim();
    if (!q) return false;
    return patient.name.toLowerCase().includes(q) || patient.card.toLowerCase().includes(q) || patient.phone.includes(q);
  });

  const stats = [
    ["New Requests", requests.filter((r) => r.status === "New").length],
    ["Samples Received", requests.filter((r) => r.status === "Sample Received").length],
    ["In Progress", requests.filter((r) => r.status === "In Progress").length],
    ["Results Ready", requests.filter((r) => r.status === "Result Ready").length],
  ];

  const createRequest = () => {
    if (!selectedPatient) {
      showMessage("Da farko nemo patient.");
      return;
    }
    if (!test) {
      showMessage("Zaɓi laboratory test.");
      return;
    }

    const amount = tests[test];
    const now = new Date().toLocaleString();
    const request = {
      id: Date.now(),
      card: selectedPatient.card,
      patientName: selectedPatient.name,
      test,
      consultant: "Consultant Room",
      status: "New",
      paymentStatus,
      amount,
      date: now,
    };

    setRequests((prev) => [request, ...prev]);

    if (paymentStatus === "Paid") {
      setTransactions((prev) => [
        {
          id: Date.now() + 1,
          transactionNo: `TRX-${Date.now() + 1}`,
          department: "Laboratory Unit",
          patientId: selectedPatient.id,
          card: selectedPatient.card,
          patientName: selectedPatient.name,
          service: test,
          amount,
          paymentMethod,
          paymentStatus,
          cashier: "Laboratory Cashier",
          date: now,
        },
        ...prev,
      ]);
    }

    showMessage(`${test} na ${selectedPatient.name} an ƙirƙira successfully.`);
    setSearch("");
    setSelectedPatient(null);
    setTest("");
    setPaymentStatus("Paid");
    setPaymentMethod("Cash");
  };

  const updateStatus = (status) => {
    if (!selectedRequest) return;
    setRequests((prev) => prev.map((r) => r.id === selectedRequest.id ? { ...r, status } : r));
    setSelectedRequest((prev) => ({ ...prev, status }));
    showMessage(`Status an canza zuwa ${status}.`);
  };

  const saveResult = () => {
    if (!selectedRequest) {
      showMessage("Da farko zaɓi request.");
      return;
    }
    if (!result.trim()) {
      showMessage("Rubuta laboratory result.");
      return;
    }
    const updated = { ...selectedRequest, result: result.trim(), status: "Result Ready" };
    setRequests((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    setSelectedRequest(updated);
    showMessage("Result Ready. Consultant zai iya ganin sakamakon.");
  };

  return (
    <div>
      <PageHeader title="Laboratory Unit" subtitle="Laboratory requests, samples and results" icon="⚗" />

      <div className="stats-grid">
        {stats.map(([name, value], index) => (
          <StatCard key={name} title={name} value={value} icon={["!", "◉", "⚗", "✓"][index]} />
        ))}
      </div>

      <div className="card">
        <h2>New Laboratory Request</h2>
        <div className="form-grid">
          <div className="field">
            <label>Search Patient</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Card number, name or phone" />
            {search && !selectedPatient && (
              <div className="search-results">
                {filteredPatients.length === 0 ? <div className="search-item">Ba a samu patient ba.</div> : filteredPatients.map((patient) => (
                  <button key={patient.id} className="search-item" onClick={() => { setSelectedPatient(patient); setSearch(patient.card); }}>
                    <strong>{patient.card}</strong> — {patient.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="field">
            <label>Laboratory Test</label>
            <select value={test} onChange={(e) => setTest(e.target.value)}>
              <option value="">Select test</option>
              {Object.entries(tests).map(([name, price]) => <option key={name} value={name}>{name} — ₦{price.toLocaleString()}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="field">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>Cash</option><option>POS</option><option>Bank Transfer</option>
            </select>
          </div>
          <div className="field">
            <label>Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option>Paid</option><option>Pending</option><option>Free</option>
            </select>
          </div>
        </div>
        {selectedPatient && <p className="muted">Patient: <strong>{selectedPatient.name}</strong> ({selectedPatient.card})</p>}
        {test && test !== "Other" && <p className="muted">Service Price: <strong>₦{tests[test].toLocaleString()}</strong></p>}
        <button className="button primary" onClick={createRequest}>Create Laboratory Request</button>
      </div>

      <div className="card">
        <h2>Laboratory Request Queue</h2>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Card</th><th>Patient</th><th>Test</th><th>Consultant</th><th>Status</th><th>Payment</th><th>Amount</th><th>Date / Time</th><th>Action</th></tr></thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.card}</td><td>{request.patientName}</td><td>{request.test}</td><td>{request.consultant}</td><td>{request.status}</td><td>{request.paymentStatus}</td><td>₦{Number(request.amount || 0).toLocaleString()}</td><td>{request.date}</td>
                  <td><button className="small-button" onClick={() => { setSelectedRequest(request); setResult(request.result || ""); }}>Open</button></td>
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan="9" className="empty-cell">Babu laboratory request tukuna.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <div className="card">
          <h2>Sample & Result — {selectedRequest.patientName}</h2>
          <p className="muted">{selectedRequest.test} • {selectedRequest.card}</p>
          <div className="button-row">
            <button className="small-button" onClick={() => updateStatus("Sample Received")}>Sample Received</button>
            <button className="small-button" onClick={() => updateStatus("In Progress")}>In Progress</button>
            <button className="small-button" onClick={() => updateStatus("Completed")}>Completed</button>
          </div>
          <div className="field">
            <label>Laboratory Result</label>
            <textarea value={result} onChange={(e) => setResult(e.target.value)} rows="5" placeholder="Enter laboratory result / findings" />
          </div>
          <button className="button primary" onClick={saveResult}>Save Result & Mark Result Ready</button>
        </div>
      )}
    </div>
  );
}

function GeneralCashierPage({ transactions }) {
  const total = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0
  );

  const cashTotal = transactions
    .filter((transaction) => transaction.paymentMethod === "Cash")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  const posTotal = transactions
    .filter((transaction) => transaction.paymentMethod === "POS")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  const transferTotal = transactions
    .filter((transaction) => transaction.paymentMethod === "Bank Transfer")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>General Cashier</h1>
          <p>Central payment and receipt management</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Collections"
          value={`₦${total.toLocaleString()}`}
          icon="₦"
          text="All transactions"
        />
        <StatCard
          title="Cash"
          value={`₦${cashTotal.toLocaleString()}`}
          icon="₦"
          text="Cash payments"
        />
        <StatCard
          title="POS"
          value={`₦${posTotal.toLocaleString()}`}
          icon="▣"
          text="POS payments"
        />
        <StatCard
          title="Bank Transfer"
          value={`₦${transferTotal.toLocaleString()}`}
          icon="↗"
          text="Transfer payments"
        />
      </div>

      <div className="card">
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="muted">Babu transaction tukuna.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Transaction #</th>
                  <th>Department</th>
                  <th>Patient</th>
                  <th>Card Number</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Cashier</th>
                  <th>Date / Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.transactionNo}</td>
                    <td>{transaction.department}</td>
                    <td>{transaction.patientName}</td>
                    <td>{transaction.card}</td>
                    <td>{transaction.service}</td>
                    <td>₦{Number(transaction.amount).toLocaleString()}</td>
                    <td>{transaction.paymentMethod}</td>
                    <td>{transaction.paymentStatus}</td>
                    <td>{transaction.cashier}</td>
                    <td>{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function RosterPage({ staff }) {
  const shifts = ["Morning", "Evening", "Night"];

  return (
    <div>
      <PageHeader
        title="Roster & Staff Attendance"
        subtitle="Monthly duty roster and staff attendance management"
        icon="▦"
      />

      <div className="stats-grid">
        <StatCard title="Total Staff" value={staff.length} icon="♟" />
        <StatCard title="Present Today" value="14" icon="✓" />
        <StatCard title="Absent" value="2" icon="!" />
        <StatCard title="On Duty" value="12" icon="▦" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Current Staff Roster</h2>
            <p>Morning, Evening and Night shifts</p>
          </div>

          <button className="button primary">Generate Monthly Roster</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Department</th>
                <th>Role</th>
                <th>Morning</th>
                <th>Evening</th>
                <th>Night</th>
                <th>Attendance</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((person, index) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.department}</td>
                  <td>{person.role}</td>
                  <td>
                    <span className="shift-badge">
                      {index % 2 === 0 ? "Duty" : "Off"}
                    </span>
                  </td>
                  <td>
                    <span className="shift-badge">
                      {index % 3 === 0 ? "Duty" : "Off"}
                    </span>
                  </td>
                  <td>
                    <span className="shift-badge">
                      {index % 4 === 0 ? "Duty" : "Off"}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge active-status">
                      Present
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="shift-rules">
          {shifts.map((shift) => (
            <div key={shift}>
              <strong>{shift}</strong>
              <span>
                After 5 {shift} shifts → scheduled off days
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditPage({ currentUser }) {
  const logs = [
    {
      action: "Login",
      user: currentUser.name,
      module: "Security",
      time: "Today, 08:05",
    },
    {
      action: "Patient Registration",
      user: "ICT Staff",
      module: "ICT Centre",
      time: "Today, 08:14",
    },
    {
      action: "Lab Request",
      user: "Consultant",
      module: "Laboratory",
      time: "Today, 08:31",
    },
    {
      action: "Prescription",
      user: "Consultant",
      module: "Pharmacy",
      time: "Today, 08:45",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="System activity and accountability records"
        icon="◌"
      />

      <div className="panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Module</th>
                <th>Date / Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.action}</td>
                  <td>{log.user}</td>
                  <td>{log.module}</td>
                  <td>{log.time}</td>
                  <td>
                    <span className="status-badge active-status">
                      Recorded
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ModulePage({ title, subtitle, icon, stats }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} icon={icon} />

      <div className="stats-grid">
        {stats.map(([name, value], index) => (
          <StatCard
            key={name}
            title={name}
            value={value}
            icon={["▣", "✓", "!", "◉"][index % 4]}
          />
        ))}
      </div>

      <div className="panel empty-module">
        <div className="large-module-icon">{icon}</div>

        <h2>{title}</h2>

        <p>
          This module is ready for its full departmental workflow.
          Department permissions remain separated from other units.
        </p>

        <button className="button primary">
          Open {title}
        </button>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle, icon }) {
  return (
    <div className="page-header">
      <div className="page-header-icon">{icon}</div>

      <div>
        <div className="eyebrow">BAZZA PHC</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, text }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>

        {text && <small>{text}</small>}
      </div>
    </div>
  );
}

function PatientTable({ patients }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Card Number</th>
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Sex</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>
                <strong>{patient.card}</strong>
              </td>

              <td>{patient.name}</td>

              <td>{patient.phone}</td>

              <td>{patient.sex}</td>

              <td>
                <span className="status-badge active-status">
                  {patient.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

const styles = `
* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, Arial, Helvetica, sans-serif;
  color: #172033;
  background: #f5f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  min-width: 320px;
  background: #f5f7fb;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app {
  min-height: 100vh;
  display: flex;
  background: #f5f7fb;
}

.sidebar {
  width: 265px;
  min-height: 100vh;
  background: #102b46;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.brand {
  height: 76px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255,255,255,.09);
}

.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #18a56b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 22px;
}

.brand-title {
  font-size: 18px;
  font-weight: 900;
}

.brand-subtitle {
  color: #9eb1c5;
  font-size: 12px;
  margin-top: 2px;
}

.facility-name {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,.09);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.facility-name strong {
  font-size: 10px;
  line-height: 1.4;
}

.facility-name span {
  color: #9eb1c5;
  font-size: 9px;
}

.menu {
  padding: 10px 10px 20px;
  overflow-y: auto;
  flex: 1;
}

.menu-section {
  color: #6f879f;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  padding: 15px 12px 7px;
}

.menu-item {
  width: 100%;
  border: 0;
  background: transparent;
  color: #c5d1dc;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
  font-size: 13px;
  margin-bottom: 2px;
}

.menu-item:hover {
  background: rgba(255,255,255,.06);
  color: white;
}

.menu-item.active {
  background: #18a56b;
  color: white;
  font-weight: 700;
}

.menu-icon {
  width: 22px;
  text-align: center;
  font-size: 15px;
}

.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(255,255,255,.09);
  color: #9eb1c5;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.online-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #27c983;
}

.main {
  margin-left: 265px;
  width: calc(100% - 265px);
  min-height: 100vh;
}

.topbar {
  height: 76px;
  background: white;
  border-bottom: 1px solid #e5e9ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.top-title {
  font-weight: 800;
  font-size: 18px;
}

.top-location {
  color: #7a8796;
  font-size: 11px;
  margin-top: 4px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-button {
  border: 1px solid #e2e7ed;
  background: white;
  width: 38px;
  height: 38px;
  border-radius: 9px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 9px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #dff4eb;
  color: #168258;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details strong {
  font-size: 12px;
}

.user-details span {
  font-size: 10px;
  color: #8792a0;
}

.logout-button {
  border: 0;
  background: #fff0f0;
  color: #c53a3a;
  padding: 9px 13px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
}

.content {
  padding: 28px 30px 50px;
  max-width: 1600px;
  margin: 0 auto;
}

.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.welcome h1,
.page-header h1 {
  margin: 3px 0 5px;
  font-size: 27px;
}

.welcome p,
.page-header p {
  margin: 0;
  color: #7b8794;
  font-size: 13px;
}

.eyebrow {
  color: #18a56b;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .12em;
}

.date-box {
  background: white;
  border: 1px solid #e3e8ee;
  border-radius: 10px;
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: right;
}

.date-box strong {
  font-size: 13px;
}

.date-box span {
  color: #84909d;
  font-size: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.stat-card {
  background: white;
  border: 1px solid #e4e9ef;
  border-radius: 12px;
  padding: 19px;
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 100px;
}

.stat-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: #e5f6ef;
  color: #168258;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  font-weight: 800;
}

.stat-card span {
  display: block;
  color: #7b8794;
  font-size: 11px;
  margin-bottom: 4px;
}

.stat-card strong {
  display: block;
  font-size: 23px;
}

.stat-card small {
  display: block;
  color: #a0a8b2;
  margin-top: 3px;
  font-size: 10px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.4fr .8fr;
  gap: 20px;
  margin-bottom: 20px;
}

.panel {
  background: white;
  border: 1px solid #e4e9ef;
  border-radius: 12px;
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 18px;
}

.panel-header h2 {
  margin: 0 0 4px;
  font-size: 16px;
}

.panel-header p {
  margin: 0;
  color: #8a95a1;
  font-size: 11px;
}

.department-list {
  display: flex;
  flex-direction: column;
}

.department-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #edf0f3;
}

.department-row:last-child {
  border-bottom: 0;
}

.dept-icon {
  width: 36px;
  height: 36px;
  background: #eef7f3;
  color: #168258;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.department-row div:nth-child(2) {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.department-row strong {
  font-size: 12px;
}

.department-row span {
  color: #8b96a2;
  font-size: 10px;
  margin-top: 3px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22b978;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.quick-actions button {
  border: 1px solid #e4e9ef;
  background: #fafbfd;
  border-radius: 9px;
  padding: 17px 10px;
  color: #263345;
  font-size: 11px;
  font-weight: 700;
}

.quick-actions button:hover {
  border-color: #18a56b;
}

.quick-actions span {
  display: block;
  font-size: 20px;
  color: #18a56b;
  margin-bottom: 7px;
}

.recent-panel {
  margin-top: 20px;
}

.text-button {
  border: 0;
  background: transparent;
  color: #168258;
  font-size: 11px;
  font-weight: 800;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 24px;
}

.page-header-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #e5f6ef;
  color: #168258;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
}

.toolbar {
  background: white;
  border: 1px solid #e4e9ef;
  padding: 15px;
  border-radius: 11px;
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.search-input {
  border: 1px solid #dce2e8;
  border-radius: 8px;
  padding: 10px 13px;
  min-width: 300px;
  outline: none;
}

.search-input:focus,
input:focus,
select:focus {
  border-color: #18a56b;
  box-shadow: 0 0 0 3px rgba(24,165,107,.08);
}

.button {
  border: 0;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 12px;
}

.button.primary {
  background: #18a56b;
  color: white;
}

.button.primary:hover {
  background: #138b59;
}

.button.secondary {
  background: #eef1f4;
  color: #485462;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  background: #f8fafc;
  color: #687585;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .04em;
  padding: 12px;
  border-bottom: 1px solid #e5e9ee;
  white-space: nowrap;
}

td {
  padding: 13px 12px;
  border-bottom: 1px solid #edf0f3;
  font-size: 12px;
  color: #3f4c5b;
}

tbody tr:hover {
  background: #fbfcfd;
}

.username-badge,
.role-badge,
.status-badge,
.shift-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  padding: 5px 8px;
  font-size: 9px;
  font-weight: 800;
}

.username-badge {
  background: #f0f3f6;
  color: #596675;
}

.role-badge {
  background: #eaf2ff;
  color: #386ca7;
}

.status-badge.active-status {
  background: #e4f7ee;
  color: #168258;
}

.status-badge.inactive-status {
  background: #fff0f0;
  color: #b84040;
}

.shift-badge {
  background: #eef4fb;
  color: #41698f;
}

.table-actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.small-button {
  border: 1px solid #dfe5eb;
  background: white;
  color: #455362;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 9px;
  font-weight: 700;
}

.small-button:hover {
  border-color: #18a56b;
  color: #168258;
}

.small-button.danger {
  color: #b63c3c;
}

.empty-cell {
  text-align: center;
  padding: 30px;
  color: #8d98a4;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field span,
.login-card label {
  font-size: 11px;
  font-weight: 800;
  color: #586575;
}

input,
select {
  width: 100%;
  border: 1px solid #dce2e8;
  background: white;
  border-radius: 8px;
  padding: 10px 12px;
  outline: none;
  color: #263345;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.modal-actions.left {
  justify-content: flex-start;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 27, 42, .56);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal {
  width: min(700px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0,0,0,.22);
}

.modal-header {
  padding: 17px 20px;
  border-bottom: 1px solid #e8ecf0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 17px;
}

.close-button {
  border: 0;
  background: #f1f3f5;
  width: 31px;
  height: 31px;
  border-radius: 50%;
  font-size: 19px;
  color: #66717e;
}

.modal-body {
  padding: 20px;
}

.modal-description {
  color: #7c8794;
  font-size: 12px;
  margin-top: 0;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.permission-item {
  border: 1px solid #e1e6eb;
  padding: 13px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  font-weight: 700;
}

.permission-item input {
  width: auto;
}

.empty-module {
  min-height: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.large-module-icon {
  width: 70px;
  height: 70px;
  border-radius: 17px;
  background: #e5f6ef;
  color: #168258;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
}

.empty-module h2 {
  margin: 15px 0 5px;
}

.empty-module p {
  max-width: 560px;
  color: #7d8996;
  font-size: 12px;
  line-height: 1.7;
  margin-bottom: 18px;
}

.shift-rules {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.shift-rules div {
  border: 1px solid #e4e9ef;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shift-rules strong {
  font-size: 11px;
}

.shift-rules span {
  font-size: 10px;
  color: #84909d;
}

.toast {
  position: fixed;
  right: 25px;
  top: 90px;
  background: #172b40;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  z-index: 200;
  font-size: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,.18);
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef3f6;
  padding: 25px;
}

.login-card {
  width: min(430px, 100%);
  background: white;
  border: 1px solid #e2e7ec;
  border-radius: 17px;
  padding: 35px;
  box-shadow: 0 15px 45px rgba(26,48,69,.10);
}

.login-logo {
  width: 65px;
  height: 65px;
  margin: 0 auto 15px;
  background: #18a56b;
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 900;
}

.login-card h1 {
  text-align: center;
  margin: 0;
  text-transform: uppercase;
  font-size: 25px;
  color: #102b46;
}

.login-subtitle {
  text-align: center;
  color: #8a95a1;
  font-size: 11px;
  margin: 6px 0 17px;
}

.login-line {
  height: 1px;
  background: #e6ebef;
  margin-bottom: 23px;
}

.login-card h2 {
  margin: 0 0 18px;
  font-size: 17px;
}

.login-card form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-card input {
  margin-bottom: 8px;
}

.login-button {
  margin-top: 5px;
  border: 0;
  border-radius: 8px;
  background: #18a56b;
  color: white;
  padding: 12px;
  font-weight: 900;
}

.login-button:hover {
  background: #138b59;
}

.login-error {
  background: #fff0f0;
  color: #bd3b3b;
  padding: 10px;
  border-radius: 7px;
  margin-bottom: 12px;
  font-size: 11px;
}

.demo-box {
  margin-top: 20px;
  padding: 13px;
  background: #f7f9fb;
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.demo-box strong {
  font-size: 11px;
  color: #344354;
  margin-bottom: 3px;
}

.demo-box span {
  font-size: 10px;
  color: #758190;
}

.login-card footer {
  text-align: center;
  color: #a0a8b2;
  font-size: 9px;
  margin-top: 22px;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .sidebar {
    width: 220px;
  }

  .main {
    margin-left: 220px;
    width: calc(100% - 220px);
  }

  .topbar {
    padding: 0 15px;
  }

  .content {
    padding: 20px 15px 40px;
  }

  .user-details {
    display: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .sidebar {
    width: 70px;
  }

  .brand {
    justify-content: center;
    padding: 10px;
  }

  .brand > div:not(.brand-logo),
  .facility-name,
  .menu-item span:not(.menu-icon),
  .menu-section,
  .sidebar-footer span {
    display: none;
  }

  .menu-item {
    justify-content: center;
  }

  .main {
    margin-left: 70px;
    width: calc(100% - 70px);
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .welcome {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .toolbar {
    flex-direction: column;
  }

  .search-input {
    min-width: 0;
  }

  .top-location {
    display: none;
  }

  .permission-grid {
    grid-template-columns: 1fr;
  }

  .shift-rules {
    grid-template-columns: 1fr;
  }
}
`;
function PharmacyPage({
  patients = [],
  showMessage,
  setTransactions,
}) {
  const [view, setView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [duration, setDuration] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const [prescriptions, setPrescriptions] = useState([
    {
      id: "RX-001",
      patientId: "BZ-P001",
      patientName: "Aisha Musa",
      card: "BZ-P001",
      medicine: "Paracetamol 500mg",
      quantity: 10,
      instructions: "Take 1 tablet three times daily",
      duration: "3 days",
      consultant: "Consultant Room",
      status: "New",
      paymentStatus: "Pending",
      paymentMethod: "Cash",
      amount: 500,
      date: new Date().toLocaleString(),
      dispensedBy: "",
    },
    {
      id: "RX-002",
      patientId: "BZ-P002",
      patientName: "Ibrahim Bello",
      card: "BZ-P002",
      medicine: "Amoxicillin 500mg",
      quantity: 21,
      instructions: "Take 1 capsule three times daily",
      duration: "7 days",
      consultant: "Consultant Room",
      status: "New",
      paymentStatus: "Paid",
      paymentMethod: "POS",
      amount: 1500,
      date: new Date().toLocaleString(),
      dispensedBy: "",
    },
  ]);

  const [stock, setStock] = useState([
    {
      id: 1,
      medicine: "Paracetamol 500mg",
      category: "Tablet",
      price: 500,
      quantity: 100,
      reorderLevel: 20,
    },
    {
      id: 2,
      medicine: "Amoxicillin 500mg",
      category: "Capsule",
      price: 1500,
      quantity: 50,
      reorderLevel: 10,
    },
    {
      id: 3,
      medicine: "Metronidazole 400mg",
      category: "Tablet",
      price: 800,
      quantity: 35,
      reorderLevel: 10,
    },
    {
      id: 4,
      medicine: "Artemether/Lumefantrine",
      category: "Tablet",
      price: 1200,
      quantity: 20,
      reorderLevel: 5,
    },
  ]);

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return patients.slice(0, 10);
    }

    return patients
      .filter((patient) => {
        const name = String(patient.name || "").toLowerCase();
        const card = String(patient.card || "").toLowerCase();
        const phone = String(patient.phone || "").toLowerCase();

        return (
          name.includes(term) ||
          card.includes(term) ||
          phone.includes(term)
        );
      })
      .slice(0, 10);
  }, [patients, search]);

  const filteredPrescriptions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return prescriptions;
    }

    return prescriptions.filter((item) => {
      return (
        item.patientName.toLowerCase().includes(term) ||
        item.card.toLowerCase().includes(term) ||
        item.medicine.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    });
  }, [prescriptions, search]);

  const totalPrescriptions = prescriptions.length;

  const newPrescriptions = prescriptions.filter(
    (item) => item.status === "New"
  ).length;

  const dispensedToday = prescriptions.filter(
    (item) => item.status === "Dispensed"
  ).length;

  const pendingPrescriptions = prescriptions.filter(
    (item) =>
      item.status === "New" ||
      item.status === "Pending"
  ).length;

  const stockAlerts = stock.filter(
    (item) => item.quantity <= item.reorderLevel
  ).length;

  const money = (value) => {
    return `₦${Number(value || 0).toLocaleString()}`;
  };

  const getPatientName = (patient) => {
    if (!patient) return "";

    return (
      patient.name ||
      `${patient.surname || ""} ${patient.otherNames || ""}`.trim()
    );
  };

  const getPatientCard = (patient) => {
    if (!patient) return "";

    return patient.card || patient.cardNumber || patient.id || "";
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearch(getPatientName(patient));

    if (showMessage) {
      showMessage(
        `Patient selected: ${getPatientName(patient)}`
      );
    }
  };

  const selectPrescriptionPatient = (item) => {
    const patient = patients.find(
      (patient) =>
        String(patient.card || patient.cardNumber || patient.id) ===
        String(item.card)
    );

    if (patient) {
      setSelectedPatient(patient);
    } else {
      setSelectedPatient({
        id: item.patientId,
        card: item.card,
        name: item.patientName,
      });
    }
  };

  const createPrescription = () => {
    if (!selectedPatient) {
      if (showMessage) {
        showMessage("Please select a patient first.");
      }
      return;
    }

    if (!medicine) {
      if (showMessage) {
        showMessage("Please select medicine.");
      }
      return;
    }

    if (!quantity || Number(quantity) < 1) {
      if (showMessage) {
        showMessage("Please enter a valid quantity.");
      }
      return;
    }

    const selectedStock = stock.find(
      (item) => item.medicine === medicine
    );

    if (!selectedStock) {
      if (showMessage) {
        showMessage("Selected medicine is not available in stock.");
      }
      return;
    }

    const requestedQuantity = Number(quantity);

    if (requestedQuantity > selectedStock.quantity) {
      if (showMessage) {
        showMessage(
          `Insufficient stock. Available quantity: ${selectedStock.quantity}`
        );
      }
      return;
    }

    const totalAmount =
      Number(selectedStock.price) * requestedQuantity;

    const newPrescription = {
      id: `RX-${String(prescriptions.length + 1).padStart(3, "0")}`,
      patientId: selectedPatient.id,
      patientName: getPatientName(selectedPatient),
      card: getPatientCard(selectedPatient),
      medicine,
      quantity: requestedQuantity,
      instructions,
      duration,
      consultant: "Consultant Room",
      status: "New",
      paymentStatus,
      paymentMethod,
      amount: totalAmount,
      date: new Date().toLocaleString(),
      dispensedBy: "",
    };
    
    setPrescriptions((previous) => [
  newPrescription,
  ...previous,
]);

    if (
  paymentStatus === "Paid" &&
  setTransactions
) {
  setTransactions((previous) => [
    {
      id: Date.now() + 1,
      transactionNo: `TRX-${Date.now() + 1}`,
      department: "Pharmacy Unit",
      patientId: selectedPatient.id,
      card: getPatientCard(selectedPatient),
      patientName: getPatientName(selectedPatient),
      service: medicine,
      amount: totalAmount,
      paymentMethod,
      paymentStatus: "Paid",
      cashier: "Pharmacy Cashier",
      date: new Date().toLocaleString(),
    },
    ...previous,
  ]);
}

    setMedicine("");
    setQuantity(1);
    setInstructions("");
    setDuration("");
    setPaymentStatus("Pending");
    setPaymentMethod("Cash");

    if (showMessage) {
      showMessage(
        `Prescription ${newPrescription.id} created successfully.`
      );
    }

    setView("queue");
  };

  const dispensePrescription = (prescriptionId) => {
    const prescription = prescriptions.find(
      (item) => item.id === prescriptionId
    );

    if (!prescription) {
      return;
    }

    if (prescription.status === "Dispensed") {
      if (showMessage) {
        showMessage("This prescription has already been dispensed.");
      }
      return;
    }

    const medicineStock = stock.find(
      (item) => item.medicine === prescription.medicine
    );

    if (!medicineStock) {
      if (showMessage) {
        showMessage("Medicine not found in pharmacy stock.");
      }
      return;
    }

    if (medicineStock.quantity < prescription.quantity) {
      if (showMessage) {
        showMessage(
          `Insufficient stock. Available: ${medicineStock.quantity}`
        );
      }
      return;
    }

    setStock((previous) =>
      previous.map((item) =>
        item.id === medicineStock.id
          ? {
              ...item,
              quantity:
                Number(item.quantity) -
                Number(prescription.quantity),
            }
          : item
      )
    );

    setPrescriptions((previous) =>
      previous.map((item) =>
        item.id === prescriptionId
          ? {
              ...item,
              status: "Dispensed",
              dispensedBy: "Pharmacy Cashier",
              dispensedAt: new Date().toLocaleString(),
            }
          : item
      )
    );

    if (showMessage) {
      showMessage(
        `${prescription.medicine} dispensed successfully. Stock updated.`
      );
    }
  };

  const markAsPending = (prescriptionId) => {
    setPrescriptions((previous) =>
      previous.map((item) =>
        item.id === prescriptionId
          ? {
              ...item,
              status: "Pending",
            }
          : item
      )
    );

    if (showMessage) {
      showMessage("Prescription marked as Pending.");
    }
  };

  const markAsPaid = (prescriptionId, method = "Cash") => {
    setPrescriptions((previous) =>
      previous.map((item) =>
        item.id === prescriptionId
          ? {
              ...item,
              paymentStatus: "Paid",
              paymentMethod: method,
            }
          : item
      )
    );

    if (showMessage) {
      showMessage("Payment marked as Paid.");
    }
  };

  const sendSMS = (prescription) => {
    const patient = patients.find(
      (item) =>
        String(item.card || item.cardNumber || item.id) ===
        String(prescription.card)
    );

    const phone = patient?.phone || patient?.phoneNumber;

    if (!phone) {
      if (showMessage) {
        showMessage(
          "Patient phone number is not available in the ICT Patient Profile."
        );
      }
      return;
    }

    if (showMessage) {
      showMessage(
        `SMS prepared for ${prescription.patientName} (${phone}).`
      );
    }
  };

  const printPrescription = (prescription) => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=800,height=700"
    );

    if (!printWindow) {
      if (showMessage) {
        showMessage("Please allow pop-ups to print the prescription.");
      }
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Pharmacy Prescription - ${prescription.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #222;
            }

            h2 {
              margin-bottom: 4px;
            }

            .facility {
              color: #555;
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            td {
              border: 1px solid #ddd;
              padding: 10px;
            }

            .label {
              font-weight: bold;
              width: 35%;
            }

            .footer {
              margin-top: 30px;
              color: #777;
              font-size: 12px;
            }
          </style>
        </head>

        <body>
          <h2>Bazza Primary Health Care</h2>
          <div class="facility">
            Pharmacy Unit
          </div>

          <table>
            <tr>
              <td class="label">Prescription No.</td>
              <td>${prescription.id}</td>
            </tr>

            <tr>
              <td class="label">Patient Name</td>
              <td>${prescription.patientName}</td>
            </tr>

            <tr>
              <td class="label">Patient/Card Number</td>
              <td>${prescription.card}</td>
            </tr>

            <tr>
              <td class="label">Medicine</td>
              <td>${prescription.medicine}</td>
            </tr>

            <tr>
              <td class="label">Quantity</td>
              <td>${prescription.quantity}</td>
            </tr>

            <tr>
              <td class="label">Instructions</td>
              <td>${prescription.instructions || "-"}</td>
            </tr>

            <tr>
              <td class="label">Duration</td>
              <td>${prescription.duration || "-"}</td>
            </tr>

            <tr>
              <td class="label">Amount</td>
              <td>${money(prescription.amount)}</td>
            </tr>

            <tr>
              <td class="label">Payment Status</td>
              <td>${prescription.paymentStatus}</td>
            </tr>

            <tr>
              <td class="label">Payment Method</td>
              <td>${prescription.paymentMethod}</td>
            </tr>
          </table>

          <div class="footer">
            Printed from Bazza PHC Pharmacy Unit.
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const statCard = (title, value, icon) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e7ebef",
        borderRadius: 12,
        padding: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      <div>
        <div
          style={{
            color: "#7b8794",
            fontSize: 11,
            marginBottom: 7,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#263442",
            fontSize: 23,
            fontWeight: 900,
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: "#eef9f4",
          color: "#18a56b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        {icon}
      </div>
    </div>
  );

  return (
    <div>
      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
          marginBottom: 22,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              color: "#263442",
            }}
          >
            Pharmacy Unit
          </h1>

          <div
            style={{
              marginTop: 5,
              color: "#7b8794",
              fontSize: 12,
            }}
          >
            Prescriptions, dispensing, medicine stock and patient SMS
          </div>
        </div>

        <button
          type="button"
          onClick={() => setView("new")}
          style={{
            border: 0,
            borderRadius: 8,
            padding: "11px 16px",
            background: "#18a56b",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          + New Prescription
        </button>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {[
          ["dashboard", "Dashboard"],
          ["new", "New Prescription"],
          ["queue", "Prescription Queue"],
          ["stock", "Medicine Stock"],
        ].map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() => setView(key)}
            style={{
              border: "1px solid #dfe5ea",
              borderRadius: 8,
              padding: "9px 14px",
              background:
                view === key ? "#18a56b" : "#fff",
              color:
                view === key ? "#fff" : "#45525f",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: 15,
              marginBottom: 22,
            }}
          >
            {statCard(
              "New Prescriptions",
              newPrescriptions,
              "Rx"
            )}

            {statCard(
              "Dispensed Today",
              dispensedToday,
              "✓"
            )}

            {statCard(
              "Pending",
              pendingPrescriptions,
              "!"
            )}

            {statCard(
              "Stock Alerts",
              stockAlerts,
              "⚠"
            )}
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e7ebef",
              borderRadius: 12,
              padding: 18,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "#263442",
                    fontSize: 16,
                  }}
                >
                  Recent Prescriptions
                </h3>

                <div
                  style={{
                    color: "#8a95a1",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  Latest prescriptions received from Consultant
                </div>
              </div>

              <button
                type="button"
                onClick={() => setView("queue")}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#18a56b",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                View All
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr>
                    <th style={tableHeadStyle}>Prescription</th>
                    <th style={tableHeadStyle}>Patient</th>
                    <th style={tableHeadStyle}>Card No.</th>
                    <th style={tableHeadStyle}>Medicine</th>
                    <th style={tableHeadStyle}>Qty</th>
                    <th style={tableHeadStyle}>Status</th>
                    <th style={tableHeadStyle}>Payment</th>
                  </tr>
                </thead>

                <tbody>
                  {prescriptions
                    .slice(0, 5)
                    .map((item) => (
                      <tr key={item.id}>
                        <td style={tableCellStyle}>
                          {item.id}
                        </td>

                        <td style={tableCellStyle}>
                          {item.patientName}
                        </td>

                        <td style={tableCellStyle}>
                          {item.card}
                        </td>

                        <td style={tableCellStyle}>
                          {item.medicine}
                        </td>

                        <td style={tableCellStyle}>
                          {item.quantity}
                        </td>

                        <td style={tableCellStyle}>
                          <StatusBadge
                            status={item.status}
                          />
                        </td>

                        <td style={tableCellStyle}>
                          <StatusBadge
                            status={item.paymentStatus}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e7ebef",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <h3
              style={{
                margin: "0 0 15px",
                color: "#263442",
                fontSize: 16,
              }}
            >
              Stock Alerts
            </h3>

            {stock.filter(
              (item) => item.quantity <= item.reorderLevel
            ).length === 0 ? (
              <div
                style={{
                  padding: 18,
                  background: "#f5fbf8",
                  borderRadius: 8,
                  color: "#287453",
                  fontSize: 12,
                }}
              >
                ✓ No medicine is currently below the
                reorder level.
              </div>
            ) : (
              stock
                .filter(
                  (item) =>
                    item.quantity <= item.reorderLevel
                )
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom:
                        "1px solid #edf0f2",
                    }}
                  >
                    <span>{item.medicine}</span>

                    <strong>
                      {item.quantity} remaining
                    </strong>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      {/* NEW PRESCRIPTION */}
      {view === "new" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e7ebef",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3
            style={{
              margin: "0 0 5px",
              color: "#263442",
            }}
          >
            New Prescription
          </h3>

          <p
            style={{
              margin: "0 0 20px",
              color: "#7b8794",
              fontSize: 12,
            }}
          >
            Select the patient using the existing ICT
            Patient/Card Number.
          </p>

          {/* PATIENT SEARCH */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              Search Patient
            </label>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, card number or phone"
              style={inputStyle}
            />

            {search && filteredPatients.length > 0 && (
              <div
                style={{
                  marginTop: 6,
                  border: "1px solid #dfe5ea",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {filteredPatients.map((patient) => (
                  <button
                    type="button"
                    key={
                      patient.id ||
                      patient.card ||
                      patient.cardNumber
                    }
                    onClick={() =>
                      selectPatient(patient)
                    }
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: 0,
                      borderBottom:
                        "1px solid #edf0f2",
                      background: "#fff",
                      padding: 12,
                      cursor: "pointer",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        color: "#263442",
                      }}
                    >
                      {getPatientName(patient)}
                    </strong>

                    <span
                      style={{
                        color: "#7b8794",
                        fontSize: 11,
                      }}
                    >
                      Card: {getPatientCard(patient)}
                      {patient.phone
                        ? ` • ${patient.phone}`
                        : ""}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SELECTED PATIENT */}
          {selectedPatient && (
            <div
              style={{
                padding: 15,
                borderRadius: 9,
                background: "#f1faf6",
                border: "1px solid #d5eee2",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  color: "#65736d",
                  fontSize: 10,
                  marginBottom: 5,
                }}
              >
                Selected Patient
              </div>

              <strong
                style={{
                  color: "#1f5d43",
                  fontSize: 14,
                }}
              >
                {getPatientName(selectedPatient)}
              </strong>

              <div
                style={{
                  marginTop: 4,
                  color: "#4c7765",
                  fontSize: 11,
                }}
              >
                Patient/Card Number:{" "}
                {getPatientCard(selectedPatient)}
              </div>
            </div>
          )}

          {/* MEDICINE FORM */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 15,
            }}
          >
            <div>
              <label style={labelStyle}>
                Medicine
              </label>

              <select
                value={medicine}
                onChange={(event) =>
                  setMedicine(event.target.value)
                }
                style={inputStyle}
              >
                <option value="">
                  Select medicine
                </option>

                {stock.map((item) => (
                  <option
                    key={item.id}
                    value={item.medicine}
                  >
                    {item.medicine} —{" "}
                    {money(item.price)} — Stock:{" "}
                    {item.quantity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Instructions
              </label>

              <input
                value={instructions}
                onChange={(event) =>
                  setInstructions(event.target.value)
                }
                placeholder="e.g. Take 1 tablet three times daily"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Duration
              </label>

              <input
                value={duration}
                onChange={(event) =>
                  setDuration(event.target.value)
                }
                placeholder="e.g. 5 days"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Payment Status
              </label>

              <select
                value={paymentStatus}
                onChange={(event) =>
                  setPaymentStatus(event.target.value)
                }
                style={inputStyle}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Free">Free</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
                style={inputStyle}
              >
                <option value="Cash">Cash</option>
                <option value="POS">POS</option>
                <option value="Bank Transfer">
                  Bank Transfer
                </option>
              </select>
            </div>
          </div>

          {/* AMOUNT PREVIEW */}
          {medicine && (
            <div
              style={{
                marginTop: 20,
                padding: 15,
                borderRadius: 9,
                background: "#f7f9fb",
              }}
            >
              {(() => {
                const item = stock.find(
                  (stockItem) =>
                    stockItem.medicine === medicine
                );

                const total =
                  Number(item?.price || 0) *
                  Number(quantity || 0);

                return (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        marginBottom: 7,
                      }}
                    >
                      <span>Unit Price</span>
                      <strong>
                        {money(item?.price)}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        fontWeight: 900,
                      }}
                    >
                      <span>Total Amount</span>
                      <strong
                        style={{
                          color: "#18a56b",
                          fontSize: 17,
                        }}
                      >
                        {money(total)}
                      </strong>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={createPrescription}
              style={primaryButtonStyle}
            >
              Create Prescription
            </button>

            <button
              type="button"
              onClick={() => setView("dashboard")}
              style={secondaryButtonStyle}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* QUEUE */}
      {view === "queue" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e7ebef",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 15,
              alignItems: "center",
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#263442",
                }}
              >
                Prescription Queue
              </h3>

              <div
                style={{
                  marginTop: 4,
                  color: "#8a95a1",
                  fontSize: 11,
                }}
              >
                Prescriptions received from Consultant Room
              </div>
            </div>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search patient, card or medicine"
              style={{
                ...inputStyle,
                width: 260,
              }}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 1050,
                fontSize: 11,
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeadStyle}>Rx No.</th>
                  <th style={tableHeadStyle}>Patient</th>
                  <th style={tableHeadStyle}>Card No.</th>
                  <th style={tableHeadStyle}>Medicine</th>
                  <th style={tableHeadStyle}>Qty</th>
                  <th style={tableHeadStyle}>Instructions</th>
                  <th style={tableHeadStyle}>Status</th>
                  <th style={tableHeadStyle}>Payment</th>
                  <th style={tableHeadStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPrescriptions.map(
                  (item) => (
                    <tr key={item.id}>
                      <td style={tableCellStyle}>
                        {item.id}
                      </td>

                      <td style={tableCellStyle}>
                        <strong>
                          {item.patientName}
                        </strong>
                      </td>

                      <td style={tableCellStyle}>
                        {item.card}
                      </td>

                      <td style={tableCellStyle}>
                        {item.medicine}
                      </td>

                      <td style={tableCellStyle}>
                        {item.quantity}
                      </td>

                      <td style={tableCellStyle}>
                        {item.instructions || "-"}
                      </td>

                      <td style={tableCellStyle}>
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      <td style={tableCellStyle}>
                        <StatusBadge
                          status={item.paymentStatus}
                        />
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            selectPrescriptionPatient(
                              item
                            )
                          }
                          style={smallButtonStyle}
                        >
                          Patient
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            dispensePrescription(
                              item.id
                            )
                          }
                          style={{
                            ...smallButtonStyle,
                            background: "#18a56b",
                            color: "#fff",
                            borderColor: "#18a56b",
                          }}
                          disabled={
                            item.status === "Dispensed"
                          }
                        >
                          Dispense
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            markAsPending(item.id)
                          }
                          style={smallButtonStyle}
                        >
                          Pending
                        </button>

                        {item.paymentStatus !==
                          "Paid" && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsPaid(
                                item.id,
                                "Cash"
                              )
                            }
                            style={smallButtonStyle}
                          >
                            Paid
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            sendSMS(item)
                          }
                          style={smallButtonStyle}
                        >
                          SMS
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            printPrescription(item)
                          }
                          style={smallButtonStyle}
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {filteredPrescriptions.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 35,
                color: "#8a95a1",
              }}
            >
              No prescriptions found.
            </div>
          )}
        </div>
      )}

      {/* STOCK */}
      {view === "stock" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e7ebef",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <h3
              style={{
                margin: 0,
                color: "#263442",
              }}
            >
              Medicine Stock
            </h3>

            <div
              style={{
                marginTop: 4,
                color: "#8a95a1",
                fontSize: 11,
              }}
            >
              Stock is controlled by ICT Centre. Pharmacy
              can view available stock and dispensing reduces
              the quantity automatically.
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 750,
                fontSize: 12,
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeadStyle}>
                    Medicine
                  </th>

                  <th style={tableHeadStyle}>
                    Category
                  </th>

                  <th style={tableHeadStyle}>
                    Unit Price
                  </th>

                  <th style={tableHeadStyle}>
                    Current Stock
                  </th>

                  <th style={tableHeadStyle}>
                    Reorder Level
                  </th>

                  <th style={tableHeadStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {stock.map((item) => {
                  const low =
                    item.quantity <=
                    item.reorderLevel;

                  return (
                    <tr key={item.id}>
                      <td style={tableCellStyle}>
                        <strong>
                          {item.medicine}
                        </strong>
                      </td>

                      <td style={tableCellStyle}>
                        {item.category}
                      </td>

                      <td style={tableCellStyle}>
                        {money(item.price)}
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          fontWeight: 900,
                        }}
                      >
                        {item.quantity}
                      </td>

                      <td style={tableCellStyle}>
                        {item.reorderLevel}
                      </td>

                      <td style={tableCellStyle}>
                        {low ? (
                          <span
                            style={{
                              color: "#bd3b3b",
                              fontWeight: 800,
                            }}
                          >
                            Low Stock
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "#287453",
                              fontWeight: 800,
                            }}
                          >
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SELECTED PATIENT QUICK INFO */}
      {selectedPatient && view === "queue" && (
        <div
          style={{
            marginTop: 18,
            background: "#f7f9fb",
            border: "1px solid #e3e8ec",
            borderRadius: 10,
            padding: 15,
          }}
        >
          <strong
            style={{
              color: "#263442",
              display: "block",
              marginBottom: 5,
            }}
          >
            Selected Patient
          </strong>

          <span
            style={{
              color: "#66727e",
              fontSize: 12,
            }}
          >
            {getPatientName(selectedPatient)} — Card:{" "}
            {getPatientCard(selectedPatient)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ================================
   PHARMACY SUPPORT STYLES
================================ */

const tableHeadStyle = {
  textAlign: "left",
  padding: "11px 10px",
  background: "#f7f9fb",
  borderBottom: "1px solid #e4e9ed",
  color: "#687582",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  padding: "11px 10px",
  borderBottom: "1px solid #edf0f2",
  color: "#465360",
  verticalAlign: "top",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  color: "#4e5c69",
  fontSize: 11,
  fontWeight: 800,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #dce3e8",
  borderRadius: 8,
  padding: "10px 11px",
  background: "#fff",
  color: "#263442",
  fontSize: 12,
  outline: "none",
};

const primaryButtonStyle = {
  border: 0,
  borderRadius: 8,
  padding: "11px 16px",
  background: "#18a56b",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  border: "1px solid #dce3e8",
  borderRadius: 8,
  padding: "11px 16px",
  background: "#fff",
  color: "#465360",
  fontWeight: 800,
  cursor: "pointer",
};

const smallButtonStyle = {
  border: "1px solid #dce3e8",
  borderRadius: 6,
  padding: "6px 8px",
  background: "#fff",
  color: "#465360",
  fontSize: 10,
  fontWeight: 800,
  cursor: "pointer",
  marginRight: 5,
  marginBottom: 5,
};

function StatusBadge({ status }) {
  let background = "#f1f3f5";
  let color = "#65717c";

  if (
    status === "Paid" ||
    status === "Dispensed" ||
    status === "Completed"
  ) {
    background = "#eaf8f1";
    color = "#24734f";
  }

  if (
    status === "New" ||
    status === "Pending"
  ) {
    background = "#fff7e8";
    color = "#9a6b16";
  }

  if (
    status === "Free"
  ) {
    background = "#edf5ff";
    color = "#35658e";
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: 20,
        background,
        color,
        fontSize: 10,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}
export default App;
