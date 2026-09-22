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
  const [pharmacyPrescriptions, setPharmacyPrescriptions] = useState([
  {
    id: "RX-001",
    patientId: 1,
    patientName: "Aisha Musa",
    card: "BZ-P001",
    medicine: "Paracetamol 500mg",
    quantity: 10,
    instructions: "Take 1 tablet three times daily",
    duration: "3 Days",
    consultant: "Consultant Room",
    status: "New",
    paymentStatus: "Pending",
    paymentMethod: "Cash",
    amount: 500,
    date: new Date().toLocaleString(),
  },
  {
    id: "RX-002",
    patientId: 2,
    patientName: "Ibrahim Bello",
    card: "BZ-P002",
    medicine: "Amoxicillin 500mg",
    quantity: 21,
    instructions: "Take 1 capsule three times daily",
    duration: "7 Days",
    consultant: "Consultant Room",
    status: "New",
    paymentStatus: "Paid",
    paymentMethod: "POS",
    amount: 1500,
    date: new Date().toLocaleString(),
  },
]);
  const [labRequests, setLabRequests] = useState([
    { id: 1, card: "BZ-P001", patientName: "Aisha Musa", test: "Malaria Test", consultant: "Consultant Room", status: "New", paymentStatus: "Pending", amount: 1500, date: "9/18/2026, 1:20:00 PM" },
    { id: 2, card: "BZ-P002", patientName: "Ibrahim Bello", test: "Full Blood Count (FBC)", consultant: "Consultant Room", status: "Sample Received", paymentStatus: "Paid", amount: 3000, date: "9/18/2026, 1:25:00 PM" },
    { id: 3, card: "BZ-P003", patientName: "Fatima Yusuf", test: "Urinalysis", consultant: "Consultant Room", status: "In Progress", paymentStatus: "Paid", amount: 1000, date: "9/18/2026, 1:30:00 PM" },
  ]);
  const [wardRecords, setWardRecords] = useState([]);
  const [ultrasoundRequests, setUltrasoundRequests] = useState([]);
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
            label="In-Charge"
            icon="◈"
            active={page === "In-Charge"}
            onClick={() => setPage("In-Charge")}
          />

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

          {page === "In-Charge" && (
            <InChargePage
              patients={patients}
              staff={staff}
              transactions={transactions}
              labRequests={labRequests}
              pharmacyPrescriptions={pharmacyPrescriptions}
              ultrasoundRequests={ultrasoundRequests}
              wardRecords={wardRecords}
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
            <NursingUnitPage patients={patients} setPatients={setPatients} showMessage={showMessage} />
          )}

          {page === "Consultant Room" && (
  <ConsultantPage
              patients={patients}
              showMessage={showMessage}
              setPatients={setPatients}
              setPharmacyPrescriptions={setPharmacyPrescriptions}
              pharmacyPrescriptions={pharmacyPrescriptions}
              setLabRequests={setLabRequests}
              labRequests={labRequests}
              ultrasoundRequests={ultrasoundRequests}
              setUltrasoundRequests={setUltrasoundRequests}
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
  prescriptions={pharmacyPrescriptions}
  setPrescriptions={setPharmacyPrescriptions}
  showMessage={showMessage}
  setTransactions={setTransactions}
/>
)}

          {page === "Ultrasound Room" && (
            <UltrasoundRoomPage
              patients={patients}
              requests={ultrasoundRequests}
              setRequests={setUltrasoundRequests}
              setTransactions={setTransactions}
              setPatients={setPatients}
              showMessage={showMessage}
            />
          )}

          {page === "Male Ward" && (
            <MaleWardPage patients={patients} records={wardRecords} setRecords={setWardRecords} showMessage={showMessage} />
          )}

          {page === "Female Ward" && (
            <FemaleWardPage patients={patients} records={wardRecords} setRecords={setWardRecords} showMessage={showMessage} />
          )}

          {page === "Maternity Ward" && (
            <MaternityWardPage patients={patients} records={wardRecords} setRecords={setWardRecords} showMessage={showMessage} />
          )}

          {page === "Child Ward" && (
            <ChildWardPage patients={patients} records={wardRecords} setRecords={setWardRecords} showMessage={showMessage} />
          )}

          {page === "Labour Room" && (
            <LabourRoomPage patients={patients} records={wardRecords} setRecords={setWardRecords} showMessage={showMessage} />
          )}

          {["Immunization Unit", "Family Planning Unit", "Adolescent Unit"].includes(page) && (
            <ProgramUnitPage title={page} patients={patients} showMessage={showMessage} />
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

function LaboratoryPage({
  patients,
  requests,
  setRequests,
  setTransactions,
  showMessage,
}) {
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
    Urinalysis: 1000,
    "Blood Group": 1000,
    "Widal Test": 2000,
    "Pregnancy Test": 1000,
  };

  const filteredPatients = patients.filter((patient) => {
    const q = search.toLowerCase().trim();

    if (!q) return false;

    const name = patient.name || "";
    const card = patient.card || "";
    const phone = patient.phone || "";

    return (
      name.toLowerCase().includes(q) ||
      card.toLowerCase().includes(q) ||
      phone.includes(q)
    );
  });

  const stats = [
    {
      title: "New Requests",
      value: requests.filter((r) => r.status === "New").length,
      icon: "!",
    },
    {
      title: "Samples Received",
      value: requests.filter((r) => r.status === "Sample Received").length,
      icon: "◉",
    },
    {
      title: "In Progress",
      value: requests.filter((r) => r.status === "In Progress").length,
      icon: "⚗",
    },
    {
      title: "Results Ready",
      value: requests.filter((r) => r.status === "Result Ready").length,
      icon: "✓",
    },
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
      paymentMethod,
      amount,
      result: "",
      date: now,
    };

    setRequests((previous) => [
      request,
      ...previous,
    ]);

    if (paymentStatus === "Paid") {
      setTransactions((previous) => [
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
        ...previous,
      ]);
    }

    showMessage(
      `${test} na ${selectedPatient.name} an ƙirƙira successfully.`
    );

    setSearch("");
    setSelectedPatient(null);
    setTest("");
    setPaymentStatus("Paid");
    setPaymentMethod("Cash");
  };

  const updateStatus = (status) => {
    if (!selectedRequest) {
      showMessage("Da farko zaɓi laboratory request.");
      return;
    }

    const updatedRequest = {
      ...selectedRequest,
      status,
    };

    setRequests((previous) =>
      previous.map((request) =>
        request.id === selectedRequest.id
          ? updatedRequest
          : request
      )
    );

    setSelectedRequest(updatedRequest);

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

    const updatedRequest = {
      ...selectedRequest,
      result: result.trim(),
      status: "Result Ready",
    };

    setRequests((previous) =>
      previous.map((request) =>
        request.id === selectedRequest.id
          ? updatedRequest
          : request
      )
    );

    setSelectedRequest(updatedRequest);

    showMessage(
      "Result Ready. Consultant zai iya ganin sakamakon."
    );
  };

  const sendToConsultant = () => {
    if (!selectedRequest) {
      showMessage("Da farko zaɓi request.");
      return;
    }

    if (!selectedRequest.result) {
      showMessage("Da farko ka rubuta laboratory result.");
      return;
    }

    const updatedRequest = {
      ...selectedRequest,
      status: "Sent to Consultant",
    };

    setRequests((previous) =>
      previous.map((request) =>
        request.id === selectedRequest.id
          ? updatedRequest
          : request
      )
    );

    setSelectedRequest(updatedRequest);

    showMessage(
      `Result na ${selectedRequest.patientName} an aika zuwa Consultant Room.`
    );
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Laboratory Unit</h1>
          <p>Laboratory requests, samples and results</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            text="Laboratory workflow"
          />
        ))}
      </div>

      <div className="card">
        <h2>New Laboratory Request</h2>

        <div className="form-grid">
          <div className="field">
            <label>Search Patient</label>

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedPatient(null);
              }}
              placeholder="Search name, card number or phone..."
            />

            {search && filteredPatients.length > 0 && (
              <div className="search-results">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    className="search-result-item"
                    onClick={() => {
                      setSelectedPatient(patient);
                      setSearch(patient.name);
                    }}
                  >
                    <strong>{patient.name}</strong>
                    <span>{patient.card}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="field">
            <label>Laboratory Test</label>

            <select
              value={test}
              onChange={(e) => setTest(e.target.value)}
            >
              <option value="">Select Laboratory Test</option>

              {Object.entries(tests).map(([name, price]) => (
                <option key={name} value={name}>
                  {name} — ₦{price.toLocaleString()}
                </option>
              ))}

              <option value="Others">Others</option>
            </select>
          </div>

          <div className="field">
            <label>Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="POS">POS</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="field">
            <label>Payment Status</label>

            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Free">Free</option>
            </select>
          </div>
        </div>

        {selectedPatient && (
          <div className="selected-patient">
            <strong>Selected Patient:</strong>{" "}
            {selectedPatient.name} • {selectedPatient.card}
          </div>
        )}

        <button
          className="button primary"
          onClick={createRequest}
        >
          Create Laboratory Request
        </button>
      </div>

      <div className="card">
        <h2>Laboratory Request Queue</h2>

        {requests.length === 0 ? (
          <p className="muted">
            Babu laboratory request tukuna.
          </p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Card</th>
                  <th>Patient</th>
                  <th>Test</th>
                  <th>Consultant</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Date / Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.card}</td>

                    <td>{request.patientName}</td>

                    <td>{request.test}</td>

                    <td>{request.consultant}</td>

                    <td>
                      <span className="status-badge">
                        {request.status}
                      </span>
                    </td>

                    <td>
                      {request.paymentStatus}
                    </td>

                    <td>
                      ₦{Number(request.amount || 0).toLocaleString()}
                    </td>

                    <td>{request.date}</td>

                    <td>
                      <button
                        className="small-button"
                        onClick={() => {
                          setSelectedRequest(request);
                          setResult(request.result || "");
                        }}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="card">
          <div className="page-head">
            <div>
              <h2>Laboratory Request</h2>

              <p>
                {selectedRequest.patientName} •{" "}
                {selectedRequest.card} •{" "}
                {selectedRequest.test}
              </p>
            </div>

            <button
              className="small-button"
              onClick={() => {
                setSelectedRequest(null);
                setResult("");
              }}
            >
              Close
            </button>
          </div>

          <div className="selected-patient">
            <strong>Patient:</strong>{" "}
            {selectedRequest.patientName}
            {" • "}
            <strong>Card:</strong>{" "}
            {selectedRequest.card}
            {" • "}
            <strong>Test:</strong>{" "}
            {selectedRequest.test}
          </div>

          <div className="button-row">
            <button
              className="small-button"
              onClick={() => updateStatus("Sample Received")}
            >
              Sample Received
            </button>

            <button
              className="small-button"
              onClick={() => updateStatus("In Progress")}
            >
              In Progress
            </button>

            <button
              className="small-button"
              onClick={() => updateStatus("Completed")}
            >
              Completed
            </button>
          </div>

          <div className="field">
            <label>Laboratory Result</label>

            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              rows="6"
              placeholder="Enter laboratory result / findings..."
            />
          </div>

          <div className="button-row">
            <button
              className="button primary"
              onClick={saveResult}
            >
              Save Result & Mark Result Ready
            </button>

            <button
              className="button secondary"
              onClick={sendToConsultant}
            >
              Send Result to Consultant
            </button>
          </div>

          {selectedRequest.result && (
            <div className="card">
              <h3>Saved Laboratory Result</h3>

              <p>
                {selectedRequest.result}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedRequest.status}
              </p>
            </div>
          )}
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

function ChildWardPage({ patients = [], records = [], setRecords, showMessage }) {
  const [view, setView] = useState("patients");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [bed, setBed] = useState("");
  const [condition, setCondition] = useState("Stable");
  const [age, setAge] = useState("");
  const [guardian, setGuardian] = useState("");
  const [relationship, setRelationship] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const wardRecords = records.filter((r) => r.ward === "Child Ward");
  const beds = Array.from({ length: 12 }, (_, i) => `C-${String(i + 1).padStart(2, "0")}`);
  const occupied = wardRecords.filter((r) => r.status === "Admitted");
  const availableBeds = beds.filter((b) => !occupied.some((r) => r.bed === b));

  const filteredPatients = patients.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.card, p.phone].some((v) => String(v || "").toLowerCase().includes(q));
  });

  const admit = () => {
    const patient = patients.find((p) => String(p.id) === String(selectedId));
    if (!patient) return showMessage("Zaɓi child patient daga ICT/Records.");
    if (!bed) return showMessage("Zaɓi bed.");
    if (occupied.some((r) => r.bed === bed)) return showMessage("Wannan bed ɗin yana occupied.");
    if (!age.trim()) return showMessage("Shigar da shekarun yaro.");
    if (!guardian.trim()) return showMessage("Shigar da sunan guardian/parent.");

    const record = {
      id: Date.now(),
      ward: "Child Ward",
      patientId: patient.id,
      patientName: patient.name,
      card: patient.card,
      bed,
      age: age.trim(),
      guardian: guardian.trim(),
      relationship: relationship || "Parent",
      condition,
      diagnosis: diagnosis.trim() || "Not specified",
      notes: notes.trim(),
      status: "Admitted",
      admittedAt: new Date().toLocaleString(),
      dischargedAt: "",
    };

    setRecords((prev) => [record, ...prev]);
    showMessage(`${patient.name} an admitted zuwa Child Ward.`);
    setSelectedId("");
    setBed("");
    setAge("");
    setGuardian("");
    setRelationship("");
    setCondition("Stable");
    setDiagnosis("");
    setNotes("");
    setView("patients");
  };

  const discharge = (id) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "Discharged", dischargedAt: new Date().toLocaleString() }
          : r
      )
    );
    showMessage("An yi discharge na child patient.");
  };

  const activePatients = occupied.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [r.patientName, r.card, r.bed, r.guardian, r.diagnosis, r.age]
      .some((v) => String(v || "").toLowerCase().includes(q));
  });

  return (
    <div>
      <PageHeader
        title="Child Ward"
        subtitle="Child patient admission, bed assignment, monitoring, guardian details and discharge"
        icon="C"
      />

      <div className="stats-grid">
        <StatCard title="Occupied Beds" value={occupied.length} icon="▣" />
        <StatCard title="Available Beds" value={availableBeds.length} icon="✓" />
        <StatCard title="Current Patients" value={occupied.length} icon="👶" />
        <StatCard title="Discharges" value={wardRecords.filter((r) => r.status === "Discharged").length} icon="↗" />
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <button className={view === "patients" ? "primary" : "secondary"} onClick={() => setView("patients")}>Ward Patients</button>
          <button className={view === "beds" ? "primary" : "secondary"} onClick={() => setView("beds")}>Bed Status</button>
          <button className={view === "history" ? "primary" : "secondary"} onClick={() => setView("history")}>Discharge History</button>
          <button className="primary" onClick={() => setView("admit")}>+ Admit Child Patient</button>
        </div>

        {view !== "admit" && (
          <input
            className="search"
            placeholder="Search child, card, bed, guardian or diagnosis"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        {view === "admit" && (
          <div style={{ display: "grid", gap: 12, maxWidth: 760 }}>
            <h2>Admit Child Patient</h2>

            <label>
              Patient
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">Select patient from ICT/Records</option>
                {filteredPatients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.card}</option>
                ))}
              </select>
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                Age
                <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 3 years / 8 months" />
              </label>
              <label>
                Bed
                <select value={bed} onChange={(e) => setBed(e.target.value)}>
                  <option value="">Select available bed</option>
                  {availableBeds.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                Guardian / Parent
                <input value={guardian} onChange={(e) => setGuardian(e.target.value)} placeholder="Guardian name" />
              </label>
              <label>
                Relationship
                <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
                  <option value="">Select relationship</option>
                  <option>Parent</option>
                  <option>Mother</option>
                  <option>Father</option>
                  <option>Guardian</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <label>
              Condition
              <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option>Stable</option>
                <option>Under Observation</option>
                <option>Needs Attention</option>
                <option>Critical</option>
              </select>
            </label>

            <label>
              Diagnosis
              <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" />
            </label>

            <label>
              Ward Notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes" />
            </label>

            <button className="primary" onClick={admit}>Admit Child Patient</button>
          </div>
        )}

        {view === "patients" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Patient</th><th>Card No.</th><th>Age</th><th>Bed</th><th>Guardian</th><th>Condition</th><th>Diagnosis</th><th>Action</th></tr>
              </thead>
              <tbody>
                {activePatients.map((r) => (
                  <tr key={r.id}>
                    <td>{r.patientName}</td><td>{r.card}</td><td>{r.age}</td><td>{r.bed}</td><td>{r.guardian}</td><td>{r.condition}</td><td>{r.diagnosis}</td>
                    <td><button className="secondary" onClick={() => discharge(r.id)}>Discharge</button></td>
                  </tr>
                ))}
                {activePatients.length === 0 && <tr><td colSpan="8">No admitted child patient found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {view === "beds" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Bed</th><th>Status</th><th>Patient</th><th>Card No.</th><th>Guardian</th></tr></thead>
              <tbody>
                {beds.map((b) => {
                  const r = occupied.find((x) => x.bed === b);
                  return <tr key={b}><td>{b}</td><td>{r ? "Occupied" : "Available"}</td><td>{r ? r.patientName : "—"}</td><td>{r ? r.card : "—"}</td><td>{r ? r.guardian : "—"}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        )}

        {view === "history" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Card No.</th><th>Age</th><th>Bed</th><th>Guardian</th><th>Admitted</th><th>Discharged</th></tr></thead>
              <tbody>
                {wardRecords.filter((r) => r.status === "Discharged").map((r) => (
                  <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.age}</td><td>{r.bed}</td><td>{r.guardian}</td><td>{r.admittedAt}</td><td>{r.dischargedAt}</td></tr>
                ))}
                {wardRecords.filter((r) => r.status === "Discharged").length === 0 && <tr><td colSpan="7">No discharge history found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


function MaternityWardPage({ patients = [], records = [], setRecords, showMessage }) {
  const [view, setView] = useState("patients");
  const [selectedId, setSelectedId] = useState("");
  const [bed, setBed] = useState("");
  const [condition, setCondition] = useState("Stable");
  const [pregnancyStage, setPregnancyStage] = useState("Antenatal");
  const [gestationalAge, setGestationalAge] = useState("");
  const [gravida, setGravida] = useState("");
  const [para, setPara] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("Not Delivered");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const wardRecords = records.filter((r) => r.ward === "Maternity Ward");
  const beds = Array.from({ length: 12 }, (_, i) => `MT-${String(i + 1).padStart(2, "0")}`);
  const occupied = wardRecords.filter((r) => r.status === "Admitted");
  const availableBeds = beds.filter((b) => !occupied.some((r) => r.bed === b));

  const antenatalPatients = wardRecords.filter(
    (r) => r.status === "Admitted" && r.pregnancyStage === "Antenatal"
  ).length;
  const deliveredPatients = wardRecords.filter(
    (r) => r.status === "Admitted" && r.deliveryStatus === "Delivered"
  ).length;

  const admit = () => {
    const patient = patients.find((p) => String(p.id) === String(selectedId));

    if (!patient) return showMessage("Zaɓi mace mara lafiya.");
    if (patient.sex !== "Female") return showMessage("Maternity Ward na karɓar female patient kawai.");
    if (!bed) return showMessage("Zaɓi bed.");
    if (occupied.some((r) => r.bed === bed)) return showMessage("Wannan bed ɗin yana occupied.");

    const record = {
      id: Date.now(),
      ward: "Maternity Ward",
      patientId: patient.id,
      patientName: patient.name,
      card: patient.card,
      bed,
      condition,
      pregnancyStage,
      gestationalAge: gestationalAge.trim(),
      gravida: gravida.trim(),
      para: para.trim(),
      deliveryStatus,
      diagnosis: diagnosis.trim() || "Not specified",
      notes: notes.trim(),
      status: "Admitted",
      admittedAt: new Date().toLocaleString(),
      dischargedAt: "",
    };

    setRecords((prev) => [record, ...prev]);
    showMessage(`${patient.name} an admitted zuwa Maternity Ward.`);

    setSelectedId("");
    setBed("");
    setCondition("Stable");
    setPregnancyStage("Antenatal");
    setGestationalAge("");
    setGravida("");
    setPara("");
    setDeliveryStatus("Not Delivered");
    setDiagnosis("");
    setNotes("");
    setView("patients");
  };

  const discharge = (id) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "Discharged", dischargedAt: new Date().toLocaleString() }
          : r
      )
    );
    showMessage("An yi discharge.");
  };

  const updateRecord = (id, changes) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...changes } : r))
    );
  };

  return (
    <div>
      <PageHeader
        title="Maternity Ward"
        subtitle="Maternity admission, pregnancy monitoring, bed assignment, delivery status and discharge"
        icon="♡"
      />

      <div className="stats-grid">
        <StatCard title="Occupied Beds" value={occupied.length} icon="▣" />
        <StatCard title="Available Beds" value={availableBeds.length} icon="✓" />
        <StatCard title="Antenatal Patients" value={antenatalPatients} icon="♡" />
        <StatCard title="Delivered" value={deliveredPatients} icon="+" />
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <button className={view === "patients" ? "primary" : "secondary"} onClick={() => setView("patients")}>Ward Patients</button>
          <button className={view === "beds" ? "primary" : "secondary"} onClick={() => setView("beds")}>Bed Status</button>
          <button className={view === "history" ? "primary" : "secondary"} onClick={() => setView("history")}>Discharge History</button>
          <button className="primary" onClick={() => setView("admit")}>+ Admit Maternity Patient</button>
        </div>

        {view === "admit" && (
          <div style={{ display: "grid", gap: 12, maxWidth: 800 }}>
            <h2>Admit Maternity Patient</h2>

            <label>
              Patient
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">Select female patient</option>
                {patients.filter((p) => p.sex === "Female").map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.card}</option>
                ))}
              </select>
            </label>

            <label>
              Bed
              <select value={bed} onChange={(e) => setBed(e.target.value)}>
                <option value="">Select available bed</option>
                {availableBeds.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span>Pregnancy Stage</span>
                <select value={pregnancyStage} onChange={(e) => setPregnancyStage(e.target.value)}>
                  <option>Antenatal</option>
                  <option>Early Labour</option>
                  <option>Active Labour</option>
                  <option>Postnatal</option>
                </select>
              </label>

              <label className="form-field">
                <span>Gestational Age</span>
                <input value={gestationalAge} onChange={(e) => setGestationalAge(e.target.value)} placeholder="e.g. 32 weeks" />
              </label>

              <label className="form-field">
                <span>Gravida</span>
                <input value={gravida} onChange={(e) => setGravida(e.target.value)} placeholder="e.g. G3" />
              </label>

              <label className="form-field">
                <span>Para</span>
                <input value={para} onChange={(e) => setPara(e.target.value)} placeholder="e.g. P2" />
              </label>

              <label className="form-field">
                <span>Condition</span>
                <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option>Stable</option>
                  <option>Under Observation</option>
                  <option>Needs Attention</option>
                  <option>Critical</option>
                </select>
              </label>

              <label className="form-field">
                <span>Delivery Status</span>
                <select value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)}>
                  <option>Not Delivered</option>
                  <option>Delivered</option>
                  <option>Delivery Complication</option>
                </select>
              </label>
            </div>

            <label>
              Diagnosis / Assessment
              <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis or maternity assessment" />
            </label>

            <label>
              Ward Notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional maternity/ward notes" />
            </label>

            <button className="primary" onClick={admit}>Admit Patient</button>
          </div>
        )}

        {view === "patients" && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Card No.</th>
                  <th>Bed</th>
                  <th>Stage</th>
                  <th>Gestation</th>
                  <th>Condition</th>
                  <th>Delivery</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {occupied.map((r) => (
                  <tr key={r.id}>
                    <td>{r.patientName}</td>
                    <td>{r.card}</td>
                    <td>{r.bed}</td>
                    <td>{r.pregnancyStage}</td>
                    <td>{r.gestationalAge || "—"}</td>
                    <td>{r.condition}</td>
                    <td>{r.deliveryStatus}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button className="secondary" onClick={() => updateRecord(r.id, { deliveryStatus: "Delivered", pregnancyStage: "Postnatal" })}>Mark Delivered</button>
                        <button className="secondary" onClick={() => discharge(r.id)}>Discharge</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {occupied.length === 0 && <tr><td colSpan="8">No admitted maternity patient found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {view === "beds" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Bed</th><th>Status</th><th>Patient</th><th>Card No.</th><th>Stage</th></tr></thead>
              <tbody>
                {beds.map((b) => {
                  const r = occupied.find((x) => x.bed === b);
                  return (
                    <tr key={b}>
                      <td>{b}</td>
                      <td>{r ? "Occupied" : "Available"}</td>
                      <td>{r ? r.patientName : "—"}</td>
                      <td>{r ? r.card : "—"}</td>
                      <td>{r ? r.pregnancyStage : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {view === "history" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Card No.</th><th>Bed</th><th>Stage</th><th>Delivery</th><th>Admitted</th><th>Discharged</th></tr></thead>
              <tbody>
                {wardRecords.filter((r) => r.status === "Discharged").map((r) => (
                  <tr key={r.id}>
                    <td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.pregnancyStage}</td><td>{r.deliveryStatus}</td><td>{r.admittedAt}</td><td>{r.dischargedAt}</td>
                  </tr>
                ))}
                {wardRecords.filter((r) => r.status === "Discharged").length === 0 && <tr><td colSpan="7">No discharge history found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



function NursingUnitPage({ patients = [], setPatients, showMessage }) {
  const [view, setView] = useState("queue");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [result, setResult] = useState("");
  const [ward, setWard] = useState("");
  const [bed, setBed] = useState("");
  const [notes, setNotes] = useState("");
  const [savedRecords, setSavedRecords] = useState([]);

  const routineTasks = [
    "Vital Signs Checked",
    "Patient Assessed",
    "Medication Given",
    "Wound Care",
    "Admission Assessment",
    "Patient Education",
    "Other",
  ];

  const resultOptions = ["Stable", "Improving", "Needs Consultant Review", "Urgent Review", "Completed"];
  const wards = ["Male Ward", "Female Ward", "Maternity Ward", "Child Ward", "Labour Room", "Other"];
  const beds = ward === "Male Ward" ? Array.from({length:12},(_,i)=>`M-${String(i+1).padStart(2,"0")}`)
    : ward === "Female Ward" ? Array.from({length:12},(_,i)=>`F-${String(i+1).padStart(2,"0")}`)
    : ward === "Maternity Ward" ? Array.from({length:12},(_,i)=>`MT-${String(i+1).padStart(2,"0")}`)
    : ward === "Child Ward" ? Array.from({length:12},(_,i)=>`C-${String(i+1).padStart(2,"0")}`)
    : ward === "Labour Room" ? Array.from({length:12},(_,i)=>`LR-${String(i+1).padStart(2,"0")}`) : [];

  const filtered = patients.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.card, p.phone].some(v => String(v || "").toLowerCase().includes(q));
  });

  const toggleTask = (task) => {
    setTasks(prev => prev.includes(task) ? prev.filter(x => x !== task) : [...prev, task]);
  };

  const save = () => {
    if (!selected) return showMessage("Zaɓi patient da farko.");
    if (!tasks.length) return showMessage("Zaɓi aƙalla nursing task ɗaya.");
    if (!result) return showMessage("Zaɓi nursing result.");

    const record = {
      id: Date.now(),
      patientId: selected.id,
      patientName: selected.name,
      card: selected.card,
      tasks,
      result,
      ward: ward || "Not Assigned",
      bed: bed || "Not Assigned",
      notes: notes.trim(),
      status: result === "Needs Consultant Review" || result === "Urgent Review" ? "Ready for Consultant" : "Completed",
      date: new Date().toLocaleString(),
    };

    setSavedRecords(prev => [record, ...prev]);
    if (typeof setPatients === "function") {
      setPatients(prev => prev.map(p => String(p.id) === String(selected.id)
        ? { ...p, nursing: { ...(p.nursing || {}), ...record } }
        : p
      ));
    }

    showMessage(`${selected.name} nursing record an ajiye.`);
    setTasks([]); setResult(""); setWard(""); setBed(""); setNotes(""); setSelected(null); setSearch(""); setView("queue");
  };

  const ready = savedRecords.filter(r => r.status === "Ready for Consultant");

  return (
    <div>
      <PageHeader title="Nursing Unit" subtitle="Nursing assessment, patient flow and ward assignment" icon="♙" />
      <div className="stats-grid">
        <StatCard title="Patients" value={patients.length} icon="◉" />
        <StatCard title="Nursing Records" value={savedRecords.length} icon="✓" />
        <StatCard title="Ready for Consultant" value={ready.length} icon="→" />
        <StatCard title="Completed" value={savedRecords.filter(r => r.status === "Completed").length} icon="▣" />
      </div>

      <div className="panel">
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          <button className="button primary" onClick={() => setView("queue")}>Patient Queue</button>
          <button className="button secondary" onClick={() => setView("records")}>Nursing Records</button>
          <button className="button secondary" onClick={() => setView("ready")}>Ready for Consultant</button>
        </div>

        {view === "queue" && (
          <>
            <h2>Select Patient</h2>
            <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search card number, name or phone" />
            <div className="search-results">
              {filtered.map(p => (
                <button key={p.id} className="result-item" onClick={() => { setSelected(p); setSearch(p.name); }}>
                  {p.name} — {p.card} — {p.phone || "No phone"}
                </button>
              ))}
            </div>

            {selected && (
              <div style={{marginTop:16}}>
                <h2>{selected.name}</h2>
                <p><strong>Card Number:</strong> {selected.card}</p>

                <div className="form-field">
                  <span>Routine Nursing Tasks — click to select multiple</span>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
                    {routineTasks.map(t => (
                      <button key={t} type="button" className={tasks.includes(t) ? "button primary" : "button secondary"} onClick={() => toggleTask(t)}>{t}</button>
                    ))}
                  </div>
                </div>

                <div className="form-grid">
                  <FormField label="Nursing Result">
                    <select value={result} onChange={e => setResult(e.target.value)}>
                      <option value="">Select result</option>
                      {resultOptions.map(x => <option key={x}>{x}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Ward Assignment">
                    <select value={ward} onChange={e => {setWard(e.target.value);setBed("")}}>
                      <option value="">Select ward</option>
                      {wards.map(x => <option key={x}>{x}</option>)}
                    </select>
                  </FormField>
                  {beds.length > 0 && (
                    <FormField label="Bed">
                      <select value={bed} onChange={e => setBed(e.target.value)}>
                        <option value="">Select bed</option>
                        {beds.map(x => <option key={x}>{x}</option>)}
                      </select>
                    </FormField>
                  )}
                  <FormField label="Report / Additional Notes">
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional nursing notes..." />
                  </FormField>
                </div>
                <button className="button primary" onClick={save}>Save Nursing Record</button>
              </div>
            )}
          </>
        )}

        {view === "records" && (
          <div className="table-wrapper"><table><thead><tr><th>Patient</th><th>Card</th><th>Tasks</th><th>Result</th><th>Ward/Bed</th><th>Status</th><th>Date</th></tr></thead><tbody>
            {savedRecords.map(r => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.tasks.join(", ")}</td><td>{r.result}</td><td>{r.ward} / {r.bed}</td><td>{r.status}</td><td>{r.date}</td></tr>)}
            {!savedRecords.length && <tr><td colSpan="7">No nursing record found.</td></tr>}
          </tbody></table></div>
        )}

        {view === "ready" && (
          <div className="table-wrapper"><table><thead><tr><th>Patient</th><th>Card</th><th>Result</th><th>Notes</th><th>Date</th></tr></thead><tbody>
            {ready.map(r => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.result}</td><td>{r.notes || "—"}</td><td>{r.date}</td></tr>)}
            {!ready.length && <tr><td colSpan="5">No patient is ready for Consultant.</td></tr>}
          </tbody></table></div>
        )}
      </div>
    </div>
  );
}

function UltrasoundRoomPage({ patients = [], requests = [], setRequests, setTransactions, setPatients, showMessage }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [type, setType] = useState("");
  const [otherType, setOtherType] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("queue");
  const [reportDrafts, setReportDrafts] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const ultrasoundTypes = {
    "Obstetric Ultrasound": 5000,
    "Abdominal Ultrasound": 5000,
    "Pelvic Ultrasound": 5000,
    "Renal Ultrasound": 5000,
    "Breast Ultrasound": 5000,
    "Other": 0,
  };

  const filtered = patients.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.card, p.phone, p.phoneNumber].some((v) => String(v || "").toLowerCase().includes(q));
  }).slice(0, 12);

  const createRequest = () => {
    if (!selected) return showMessage?.("Zaɓi patient.");
    if (!type) return showMessage?.("Zaɓi ultrasound type.");
    if (type === "Other" && !otherType.trim()) return showMessage?.("Rubuta sunan ultrasound na Other.");
    if (!setRequests) return showMessage?.("Ultrasound connection is not available.");

    const finalType = type === "Other" ? otherType.trim() : type;
    const amount = ultrasoundTypes[type] || 0;
    const transactionNumber = `US-TRX-${Date.now()}`;
    const request = {
      id: `US-${Date.now()}`,
      transactionNumber,
      patientId: selected.id,
      patientName: selected.name,
      card: selected.card,
      phone: selected.phone || selected.phoneNumber || "",
      type: finalType,
      service: finalType,
      notes: notes.trim(),
      consultant: "Consultant Room",
      status: "New",
      paymentStatus: amount === 0 ? "FREE" : paymentStatus,
      paymentMethod: amount === 0 ? "FREE" : paymentMethod,
      amount,
      report: "",
      requestedAt: new Date().toLocaleString(),
      completedAt: "",
      sentToConsultantAt: "",
    };

    setRequests((previous) => [request, ...previous]);

    // Every paid ultrasound service must be visible to General Cashier.
    // Keep the transaction Pending until payment is actually completed there.
    if (setTransactions && amount > 0) {
      setTransactions((previous) => [
        {
          id: transactionNumber,
          transactionNo: transactionNumber,
          transactionNumber,
          department: "Ultrasound Room",
          patientId: selected.id,
          patientName: selected.name,
          card: selected.card,
          service: finalType,
          amount,
          paymentMethod,
          paymentStatus: paymentStatus === "Paid" ? "Paid" : "Pending",
          cashier: paymentStatus === "Paid" ? "Ultrasound Cashier" : "General Cashier",
          date: new Date().toLocaleString(),
        },
        ...previous,
      ]);
    }

    showMessage?.("Ultrasound request an tura successfully.");
    setSelected(null);
    setSearch("");
    setType("");
    setOtherType("");
    setNotes("");
    setPaymentMethod("Cash");
    setPaymentStatus("Pending");
    setActiveTab("queue");
  };

  const updateStatus = (id, nextStatus) => {
    if (!setRequests) return;
    setRequests((previous) => previous.map((request) =>
      request.id === id
        ? {
            ...request,
            status: nextStatus,
            completedAt: nextStatus === "Result Ready" ? new Date().toLocaleString() : request.completedAt,
            sentToConsultantAt: nextStatus === "Sent to Consultant" ? new Date().toLocaleString() : request.sentToConsultantAt,
          }
        : request
    ));
    showMessage?.(`Ultrasound status: ${nextStatus}`);
  };

  const saveReport = (request) => {
    if (!setRequests) return;
    const report = String(reportDrafts[request.id] ?? request.report ?? "").trim();
    if (!report) return showMessage?.("Rubuta ultrasound report kafin ka kammala.");

    const completedAt = new Date().toLocaleString();
    const updatedRequest = {
      ...request,
      report,
      status: "Result Ready",
      completedAt,
    };

    setRequests((previous) => previous.map((item) =>
      item.id === request.id ? updatedRequest : item
    ));

    // Also save the result on the shared patient profile so Consultant can
    // see it even after selecting the patient again.
    if (setPatients) {
      setPatients((previous) => previous.map((patient) => {
        const samePatient =
          String(patient.id) === String(request.patientId) ||
          String(patient.card || patient.cardNumber || "") === String(request.card || "");
        if (!samePatient) return patient;
        const existing = Array.isArray(patient.ultrasoundResults) ? patient.ultrasoundResults : [];
        const withoutThis = existing.filter((item) => item.id !== request.id);
        return {
          ...patient,
          ultrasoundResults: [
            {
              id: request.id,
              card: request.card,
              type: request.type,
              notes: request.notes || "",
              report,
              status: "Result Ready",
              consultant: request.consultant || "Consultant Room",
              requestedAt: request.requestedAt || "",
              completedAt,
            },
            ...withoutThis,
          ],
        };
      }));
    }

    showMessage?.("Ultrasound report ya zama Result Ready kuma an ajiye shi a Patient Profile.");
  };

  const newRequests = requests.filter((r) => r.status === "New");
  const inProgress = requests.filter((r) => r.status === "In Progress");
  const ready = requests.filter((r) => r.status === "Result Ready");
  const sent = requests.filter((r) => r.status === "Sent to Consultant");
  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  const printUltrasoundSlip = (request) => {
    if (!request) return showMessage?.("Zaɓi Ultrasound request kafin a buga slip.");
    const printWindow = window.open("", "_blank", "width=700,height=800");
    if (!printWindow) return showMessage?.("An hana Print Window. Ka ba browser damar buɗe print window.");
    const amount = Number(request.amount || 0);
    printWindow.document.write(`
      <!doctype html>
      <html><head><title>Ultrasound Payment Slip - ${request.transactionNumber || request.id}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:28px;color:#111;}
        .receipt{max-width:620px;margin:auto;border:1px solid #ddd;padding:24px;border-radius:10px;}
        h1{margin:0 0 4px;font-size:22px;text-align:center;}
        h2{margin:0 0 20px;font-size:15px;text-align:center;font-weight:normal;}
        .line{display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:9px 0;gap:20px;}
        .label{font-weight:bold;}
        .total{font-size:20px;font-weight:bold;margin-top:16px;padding-top:14px;border-top:2px solid #111;}
        .footer{text-align:center;margin-top:28px;font-size:12px;color:#555;}
      </style></head><body>
      <div class="receipt">
        <h1>BAZZA PHC</h1>
        <h2>Ultrasound Room — Payment / Service Slip</h2>
        <div class="line"><span class="label">Transaction No.</span><span>${request.transactionNumber || request.id}</span></div>
        <div class="line"><span class="label">Patient</span><span>${request.patientName || "—"}</span></div>
        <div class="line"><span class="label">Card Number</span><span>${request.card || "—"}</span></div>
        <div class="line"><span class="label">Service</span><span>${request.type || "Ultrasound"}</span></div>
        <div class="line"><span class="label">Consultant</span><span>${request.consultant || "Consultant Room"}</span></div>
        <div class="line"><span class="label">Payment Method</span><span>${request.paymentMethod || "—"}</span></div>
        <div class="line"><span class="label">Payment Status</span><span>${request.paymentStatus || "Pending"}</span></div>
        <div class="line total"><span>Amount</span><span>₦${amount.toLocaleString()}</span></div>
        <div class="line"><span class="label">Date / Time</span><span>${request.requestedAt || new Date().toLocaleString()}</span></div>
        <div class="footer">Please keep this slip for Ultrasound service/payment records.</div>
      </div>
      <script>window.onload=function(){window.print();};</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      <PageHeader title="Ultrasound Room" subtitle="Consultant requests, scanning, reports, payment and results" icon="◉" />

      <div className="stats-grid">
        <StatCard title="New Requests" value={newRequests.length} icon="!" />
        <StatCard title="In Progress" value={inProgress.length} icon="◉" />
        <StatCard title="Results Ready" value={ready.length} icon="✓" />
        <StatCard title="Sent to Consultant" value={sent.length} icon="→" />
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 15 }}>
          <button className={activeTab === "queue" ? "button primary" : "button secondary"} onClick={() => setActiveTab("queue")}>Request Queue</button>
          <button className={activeTab === "new" ? "button primary" : "button secondary"} onClick={() => setActiveTab("new")}>New Request</button>
          <button className={activeTab === "reports" ? "button primary" : "button secondary"} onClick={() => setActiveTab("reports")}>Reports</button>
        </div>

        {activeTab === "new" && (
          <>
            <h2 style={{ marginTop: 0 }}>New Ultrasound Request</h2>
            <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient by name, Card Number or phone..." />
            {search.trim() && !selected && (
              <div className="search-results" style={{ marginTop: 10 }}>
                {filtered.map((patient) => (
                  <button key={patient.id} className="result-item" onClick={() => { setSelected(patient); setSearch(patient.name); }}>
                    {patient.name} — {patient.card} — {patient.phone || patient.phoneNumber || "No phone"}
                  </button>
                ))}
              </div>
            )}
            {selected && <p><strong>{selected.name}</strong> — {selected.card} — {selected.phone || selected.phoneNumber || "No phone"}</p>}

            <div className="form-grid">
              <FormField label="Ultrasound Type">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select ultrasound type</option>
                  {Object.entries(ultrasoundTypes).map(([name, price]) => (
                    <option key={name} value={name}>{name}{price ? ` — ₦${price.toLocaleString()}` : " — FREE/Other"}</option>
                  ))}
                </select>
              </FormField>
              {type === "Other" && (
                <FormField label="Other Ultrasound Type">
                  <input value={otherType} onChange={(e) => setOtherType(e.target.value)} placeholder="Enter ultrasound service" />
                </FormField>
              )}
              <FormField label="Clinical Notes / Request">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter clinical request..." />
              </FormField>
              <FormField label="Payment Method">
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={type === "Other"}>
                  <option>Cash</option><option>POS</option><option>Bank Transfer</option>
                </select>
              </FormField>
              <FormField label="Payment Status">
                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} disabled={type === "Other"}>
                  <option>Pending</option><option>Paid</option><option>FREE</option>
                </select>
              </FormField>
            </div>
            <button className="button primary" onClick={createRequest}>Send Request to Ultrasound Room</button>
          </>
        )}

        {activeTab === "queue" && (
          <>
            <h2 style={{ marginTop: 0 }}>Ultrasound Request Queue</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Patient</th><th>Card</th><th>Service</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.patientName}</td>
                      <td>{request.card}</td>
                      <td>{request.type}</td>
                      <td>₦{Number(request.amount || 0).toLocaleString()} / {request.paymentStatus || "Pending"}</td>
                      <td>{request.status}</td>
                      <td>
                        <button className="small-button" onClick={() => setSelectedRequestId(request.id)}>View</button>
                        <button className="small-button" onClick={() => printUltrasoundSlip(request)}>Print Slip</button>
                        {request.status === "New" && <button className="small-button" onClick={() => updateStatus(request.id, "In Progress")}>Start Scan</button>}
                        {request.status === "In Progress" && <button className="small-button" onClick={() => setActiveTab("reports")}>Enter Report</button>}
                        {request.status === "Result Ready" && <button className="small-button" onClick={() => updateStatus(request.id, "Sent to Consultant")}>Send to Consultant</button>}
                      </td>
                    </tr>
                  ))}
                  {!requests.length && <tr><td colSpan="6">No ultrasound request found.</td></tr>}
                </tbody>
              </table>
            </div>

            {selectedRequest && (
              <div className="panel" style={{ marginTop: 16, background: "#f7f9fb" }}>
                <h3 style={{ marginTop: 0 }}>Request Details</h3>
                <p><strong>Patient:</strong> {selectedRequest.patientName}</p>
                <p><strong>Card:</strong> {selectedRequest.card}</p>
                <p><strong>Ultrasound:</strong> {selectedRequest.type}</p>
                <p><strong>Consultant:</strong> {selectedRequest.consultant}</p>
                <p><strong>Clinical Request:</strong> {selectedRequest.notes || "—"}</p>
                <p><strong>Payment:</strong> ₦{Number(selectedRequest.amount || 0).toLocaleString()} / {selectedRequest.paymentStatus || "Pending"} / {selectedRequest.paymentMethod || "—"}</p>
                <p><strong>Requested:</strong> {selectedRequest.requestedAt}</p>
                {selectedRequest.report && <p style={{ whiteSpace: "pre-wrap" }}><strong>Report:</strong> {selectedRequest.report}</p>}
                <button className="small-button" onClick={() => printUltrasoundSlip(selectedRequest)}>Print Slip</button>
                <button className="small-button" onClick={() => setSelectedRequestId("")}>Close</button>
              </div>
            )}
          </>
        )}

        {activeTab === "reports" && (
          <>
            <h2 style={{ marginTop: 0 }}>Ultrasound Reports</h2>
            <div style={{ display: "grid", gap: 14 }}>
              {requests.filter((r) => ["In Progress", "Result Ready", "Sent to Consultant"].includes(r.status)).map((request) => (
                <div key={request.id} style={{ border: "1px solid #dce3e8", borderRadius: 10, padding: 15 }}>
                  <strong>{request.patientName}</strong> — {request.card}
                  <div style={{ marginTop: 5, fontSize: 12, color: "#71808d" }}>{request.type} • Consultant: {request.consultant}</div>
                  <div style={{ marginTop: 8, fontSize: 12 }}><strong>Clinical Request:</strong> {request.notes || "—"}</div>
                  <label className="form-field" style={{ marginTop: 10 }}>
                    <span>Ultrasound Report / Findings</span>
                    <textarea
                      rows={5}
                      value={reportDrafts[request.id] ?? request.report ?? ""}
                      onChange={(e) => setReportDrafts((prev) => ({ ...prev, [request.id]: e.target.value }))}
                      placeholder="Enter scan findings and final report..."
                      disabled={request.status === "Sent to Consultant"}
                    />
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                    <button className="button secondary" onClick={() => printUltrasoundSlip(request)}>Print Slip</button>
                    {request.status !== "Sent to Consultant" && <button className="button primary" onClick={() => saveReport(request)}>Save Result & Mark Ready</button>}
                  </div>
                  {request.status === "Result Ready" && <button className="button secondary" style={{ marginLeft: 8 }} onClick={() => updateStatus(request.id, "Sent to Consultant")}>Send to Consultant</button>}
                  {request.status === "Sent to Consultant" && <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}><strong>Report:</strong> {request.report}</div>}
                </div>
              ))}
              {!requests.some((r) => ["In Progress", "Result Ready", "Sent to Consultant"].includes(r.status)) && (
                <div style={{ padding: 15, background: "#f7f9fb", borderRadius: 8, color: "#71808d" }}>No ultrasound report in progress or ready.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LabourRoomPage({ patients = [], records = [], setRecords, showMessage }) {
  const [view, setView] = useState("patients");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [bed, setBed] = useState("");
  const [stage, setStage] = useState("Early Labour");
  const [condition, setCondition] = useState("Stable");
  const [notes, setNotes] = useState("");
  const [deliveryType, setDeliveryType] = useState("Not Delivered");

  const beds = Array.from({ length: 12 }, (_, i) => `LR-${String(i + 1).padStart(2, "0")}`);
  const wardRecords = records.filter((r) => r.ward === "Labour Room");
  const current = wardRecords.filter((r) => r.status === "Admitted");
  const history = wardRecords.filter((r) => r.status === "Discharged");
  const availableBeds = beds.filter((b) => !current.some((r) => r.bed === b));

  const filteredPatients = patients.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.card, p.phone].some((v) => String(v || "").toLowerCase().includes(q));
  });

  const selectedPatient = patients.find((p) => String(p.id) === String(selectedId));

  const admit = () => {
    if (!selectedPatient) return showMessage("Zaɓi patient.");
    if (selectedPatient.sex !== "Female") return showMessage("Labour Room na karɓar female patient kawai.");
    if (!bed) return showMessage("Zaɓi bed.");
    if (current.some((r) => r.bed === bed)) return showMessage("Wannan bed ɗin yana occupied.");

    const record = {
      id: Date.now(),
      ward: "Labour Room",
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      card: selectedPatient.card,
      phone: selectedPatient.phone || "",
      bed,
      stage,
      condition,
      notes,
      deliveryType: "Not Delivered",
      status: "Admitted",
      admittedAt: new Date().toLocaleString(),
      dischargedAt: "",
    };

    setRecords((prev) => [record, ...prev]);
    showMessage(`${selectedPatient.name} an admitted zuwa Labour Room.`);
    setSelectedId("");
    setBed("");
    setSearch("");
    setStage("Early Labour");
    setCondition("Stable");
    setNotes("");
  };

  const updateRecord = (id, changes, message) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));
    if (message) showMessage(message);
  };

  const markDelivered = (id) => {
    updateRecord(id, {
      stage: "Post Delivery",
      deliveryType,
      condition: "Stable",
    }, "An sabunta bayanin delivery.");
    setDeliveryType("Not Delivered");
  };

  const discharge = (id) => {
    updateRecord(id, {
      status: "Discharged",
      dischargedAt: new Date().toLocaleString(),
    }, "An yi discharge daga Labour Room.");
  };

  return (
    <div>
      <PageHeader
        title="Labour Room"
        subtitle="Labour admission, bed assignment, labour monitoring, delivery and discharge"
        icon="▣"
      />

      <div className="stats-grid">
        <StatCard title="Occupied Beds" value={current.length} icon="▣" />
        <StatCard title="Available Beds" value={availableBeds.length} icon="✓" />
        <StatCard title="Current Patients" value={current.length} icon="!" />
        <StatCard title="Discharges" value={history.length} icon="◉" />
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <button className={view === "patients" ? "tab active" : "tab"} onClick={() => setView("patients")}>Current Patients</button>
        <button className={view === "admit" ? "tab active" : "tab"} onClick={() => setView("admit")}>+ Admit Patient</button>
        <button className={view === "beds" ? "tab active" : "tab"} onClick={() => setView("beds")}>Bed Status</button>
        <button className={view === "history" ? "tab active" : "tab"} onClick={() => setView("history")}>Discharge History</button>
      </div>

      {view === "admit" && (
        <div className="panel">
          <h2>Admit Female Patient to Labour Room</h2>
          <div className="form-grid">
            <FormField label="Search Patient">
              <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, card number or phone" />
            </FormField>
            <FormField label="Patient">
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">Select patient</option>
                {filteredPatients.filter((p) => p.sex === "Female").map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.card}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Bed">
              <select value={bed} onChange={(e) => setBed(e.target.value)}>
                <option value="">Select available bed</option>
                {availableBeds.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </FormField>
            <FormField label="Labour Stage">
              <select value={stage} onChange={(e) => setStage(e.target.value)}>
                <option>Early Labour</option>
                <option>Active Labour</option>
                <option>Second Stage</option>
                <option>Post Delivery</option>
              </select>
            </FormField>
            <FormField label="Patient Condition">
              <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option>Stable</option>
                <option>Under Observation</option>
                <option>Critical</option>
              </select>
            </FormField>
            <FormField label="Labour Notes">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional labour room notes" />
            </FormField>
          </div>
          {selectedPatient && <p><strong>Selected:</strong> {selectedPatient.name} — {selectedPatient.card}</p>}
          <button className="button primary" onClick={admit}>Admit to Labour Room</button>
        </div>
      )}

      {view === "patients" && (
        <div className="panel">
          <h2>Current Labour Room Patients</h2>
          {current.length === 0 ? (
            <div style={{ padding: 15, color: "#71808d" }}>No patient currently admitted to Labour Room.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Patient</th><th>Card</th><th>Bed</th><th>Stage</th><th>Condition</th><th>Delivery</th><th>Action</th></tr></thead>
                <tbody>
                  {current.map((r) => (
                    <tr key={r.id}>
                      <td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.stage}</td><td>{r.condition}</td><td>{r.deliveryType}</td>
                      <td>
                        <button className="small-button" onClick={() => updateRecord(r.id, { stage: r.stage === "Early Labour" ? "Active Labour" : r.stage === "Active Labour" ? "Second Stage" : r.stage }, "An sabunta labour stage.")}>Update Stage</button>
                        <button className="small-button" onClick={() => markDelivered(r.id)} style={{ marginLeft: 6 }}>Mark Delivered</button>
                        <button className="small-button" onClick={() => discharge(r.id)} style={{ marginLeft: 6 }}>Discharge</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {view === "beds" && (
        <div className="panel">
          <h2>Labour Room Bed Status</h2>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Bed</th><th>Status</th><th>Patient</th><th>Stage</th><th>Condition</th></tr></thead>
              <tbody>
                {beds.map((b) => {
                  const rec = current.find((r) => r.bed === b);
                  return <tr key={b}><td>{b}</td><td>{rec ? "Occupied" : "Available"}</td><td>{rec ? rec.patientName : "—"}</td><td>{rec ? rec.stage : "—"}</td><td>{rec ? rec.condition : "—"}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "history" && (
        <div className="panel">
          <h2>Discharge History</h2>
          {history.length === 0 ? <div style={{ padding: 15, color: "#71808d" }}>No discharge history yet.</div> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Patient</th><th>Card</th><th>Bed</th><th>Final Stage</th><th>Delivery</th><th>Admitted</th><th>Discharged</th></tr></thead>
                <tbody>{history.map((r) => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.stage}</td><td>{r.deliveryType}</td><td>{r.admittedAt}</td><td>{r.dischargedAt}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProgramUnitPage({ title, patients = [], showMessage }) {
 const [search,setSearch]=useState(""); const [selected,setSelected]=useState(null); const [service,setService]=useState(""); const [notes,setNotes]=useState(""); const [visits,setVisits]=useState([]); const filtered=patients.filter(p=>{const q=search.trim().toLowerCase();if(!q)return true;return [p.name,p.card,p.phone].some(v=>String(v||"").toLowerCase().includes(q))});
 const save=()=>{if(!selected)return showMessage("Zaɓi patient.");if(!service)return showMessage("Zaɓi service.");setVisits(prev=>[{id:Date.now(),patient:selected.name,card:selected.card,service,notes,status:"Completed",date:new Date().toLocaleString()},...prev]);showMessage(`${title}: an ajiye visit.`);setSelected(null);setSearch("");setService("");setNotes("");}; const options=title==="Immunization Unit"?["BCG","OPV","Pentavalent","Measles","Yellow Fever","Other"]:title==="Family Planning Unit"?["Counselling","Contraceptive Service","Implant","IUCD","Injectable","Other"]:["Adolescent Counselling","Health Education","Follow-up","Mental Wellbeing Check","Other"];
 return <div><PageHeader title={title} subtitle="Program services and patient visits" icon="✚"/><div className="stats-grid"><StatCard title="Today's Visits" value={visits.length} icon="◉"/><StatCard title="Pending" value="0" icon="!"/><StatCard title="Completed" value={visits.length} icon="✓"/><StatCard title="Follow-up" value={visits.filter(v=>/follow/i.test(v.service)).length} icon="→"/></div><div className="panel"><h2>New Visit</h2><input className="search-input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patient"/>{search&&<div className="search-results">{filtered.map(p=><button key={p.id} className="result-item" onClick={()=>{setSelected(p);setSearch(p.name)}}>{p.name} — {p.card}</button>)}</div>}{selected&&<p><strong>{selected.name}</strong> — {selected.card}</p>}<div className="form-grid"><FormField label="Service"><select value={service} onChange={e=>setService(e.target.value)}><option value="">Select service</option>{options.map(o=><option key={o}>{o}</option>)}</select></FormField><FormField label="Notes"><textarea value={notes} onChange={e=>setNotes(e.target.value)}/></FormField></div><button className="button primary" onClick={save}>Save Visit</button></div><div className="panel"><h2>Visit History</h2><div className="table-wrapper"><table><thead><tr><th>Patient</th><th>Card</th><th>Service</th><th>Status</th><th>Date</th></tr></thead><tbody>{visits.map(v=><tr key={v.id}><td>{v.patient}</td><td>{v.card}</td><td>{v.service}</td><td>{v.status}</td><td>{v.date}</td></tr>)}</tbody></table></div></div></div>;
}

function InChargePage({
  patients = [],
  staff = [],
  transactions = [],
  labRequests = [],
  pharmacyPrescriptions = [],
  ultrasoundRequests = [],
  wardRecords = [],
}) {
  const [view, setView] = useState("overview");
  const [search, setSearch] = useState("");

  const admitted = wardRecords.filter((r) => r.status === "Admitted");
  const pendingCash = transactions.filter((t) => String(t.status || "").toLowerCase() === "pending");
  const todayCash = transactions.filter((t) => String(t.status || "").toLowerCase() === "paid");
  const pendingLab = labRequests.filter((r) => !["Completed", "Result Ready", "Sent to Consultant"].includes(r.status));
  const pendingPharmacy = pharmacyPrescriptions.filter((r) => !["Dispensed", "Completed"].includes(r.status));
  const pendingUltrasound = ultrasoundRequests.filter((r) => !["Result Ready", "Sent to Consultant", "Completed"].includes(r.status));

  const q = search.trim().toLowerCase();
  const filteredPatients = patients.filter((p) =>
    !q || [p.name, p.card, p.phone].some((v) => String(v || "").toLowerCase().includes(q))
  );

  return (
    <div>
      <PageHeader
        title="In-Charge"
        subtitle="Hospital-wide monitoring, reports, staff, patients, cashier and department status"
        icon="◈"
      />

      <div className="stats-grid">
        <StatCard title="Total Patients" value={patients.length} icon="●" />
        <StatCard title="Admitted Patients" value={admitted.length} icon="▣" />
        <StatCard title="Staff" value={staff.length} icon="♟" />
        <StatCard title="Transactions" value={transactions.length} icon="₦" />
        <StatCard title="Lab Requests" value={labRequests.length} icon="⚗" />
        <StatCard title="Pharmacy" value={pharmacyPrescriptions.length} icon="⚕" />
        <StatCard title="Ultrasound" value={ultrasoundRequests.length} icon="◉" />
        <StatCard title="Ward Patients" value={admitted.length} icon="♥" />
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <button className={view === "overview" ? "primary" : "secondary"} onClick={() => setView("overview")}>Overview</button>
          <button className={view === "patients" ? "primary" : "secondary"} onClick={() => setView("patients")}>Patients</button>
          <button className={view === "departments" ? "primary" : "secondary"} onClick={() => setView("departments")}>Department Monitor</button>
          <button className={view === "cashier" ? "primary" : "secondary"} onClick={() => setView("cashier")}>Cashier</button>
          <button className={view === "staff" ? "primary" : "secondary"} onClick={() => setView("staff")}>Staff</button>
        </div>

        {view === "overview" && (
          <div style={{ display: "grid", gap: 12 }}>
            <h2>Hospital Monitoring</h2>
            <div className="table-wrap">
              <table><thead><tr><th>Area</th><th>Total</th><th>Pending / Active</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Patients</td><td>{patients.length}</td><td>—</td><td><StatusBadge status="Active" /></td></tr>
                  <tr><td>Laboratory</td><td>{labRequests.length}</td><td>{pendingLab.length}</td><td><StatusBadge status={pendingLab.length ? "Pending" : "Clear"} /></td></tr>
                  <tr><td>Pharmacy</td><td>{pharmacyPrescriptions.length}</td><td>{pendingPharmacy.length}</td><td><StatusBadge status={pendingPharmacy.length ? "Pending" : "Clear"} /></td></tr>
                  <tr><td>Ultrasound</td><td>{ultrasoundRequests.length}</td><td>{pendingUltrasound.length}</td><td><StatusBadge status={pendingUltrasound.length ? "Pending" : "Clear"} /></td></tr>
                  <tr><td>Wards</td><td>{wardRecords.length}</td><td>{admitted.length}</td><td><StatusBadge status={admitted.length ? "Active" : "Clear"} /></td></tr>
                </tbody>
              </table>
            </div>
            <p><strong>Monitoring only:</strong> In-Charge na duba bayanai ne; ba ya gyara ko delete departmental clinical records.</p>
          </div>
        )}

        {view === "patients" && (
          <div style={{ display: "grid", gap: 12 }}>
            <h2>Global Patient Search</h2>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, card number or phone" />
            <div className="table-wrap"><table><thead><tr><th>Name</th><th>Card No.</th><th>Phone</th><th>Sex</th></tr></thead>
              <tbody>{filteredPatients.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.card}</td><td>{p.phone || "—"}</td><td>{p.sex || "—"}</td></tr>)}
              {filteredPatients.length === 0 && <tr><td colSpan="4">No patient found.</td></tr>}</tbody>
            </table></div>
          </div>
        )}

        {view === "departments" && (
          <div style={{ display: "grid", gap: 12 }}>
            <h2>Department Monitor</h2>
            <div className="table-wrap"><table><thead><tr><th>Department</th><th>Records</th><th>Active/Pending</th></tr></thead>
              <tbody>
                <tr><td>ICT Centre</td><td>{patients.length}</td><td>Patient profiles</td></tr>
                <tr><td>Records Unit</td><td>{transactions.filter(t => t.department === "Records Unit").length}</td><td>Transactions</td></tr>
                <tr><td>Nursing Unit</td><td>{patients.filter(p => p.nursing).length}</td><td>Nursing records</td></tr>
                <tr><td>Consultant Room</td><td>{patients.filter(p => p.consultation).length}</td><td>Consultations</td></tr>
                <tr><td>Laboratory Unit</td><td>{labRequests.length}</td><td>{pendingLab} pending</td></tr>
                <tr><td>Pharmacy Unit</td><td>{pharmacyPrescriptions.length}</td><td>{pendingPharmacy} pending</td></tr>
                <tr><td>Ultrasound Room</td><td>{ultrasoundRequests.length}</td><td>{pendingUltrasound} pending</td></tr>
                <tr><td>Wards</td><td>{wardRecords.length}</td><td>{admitted.length} admitted</td></tr>
              </tbody>
            </table></div>
          </div>
        )}

        {view === "cashier" && (
          <div style={{ display: "grid", gap: 12 }}>
            <h2>Cashier Monitoring</h2>
            <div className="stats-grid">
              <StatCard title="All Transactions" value={transactions.length} icon="₦" />
              <StatCard title="Paid" value={todayCash.length} icon="✓" />
              <StatCard title="Pending" value={pendingCash.length} icon="!" />
            </div>
            <div className="table-wrap"><table><thead><tr><th>Department</th><th>Patient</th><th>Service</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
              <tbody>{transactions.slice(0, 50).map((t, i) => <tr key={t.id || t.transactionNumber || i}><td>{t.department || "—"}</td><td>{t.patientName || "—"}</td><td>{t.service || t.description || "—"}</td><td>₦{Number(t.amount || 0).toLocaleString()}</td><td>{t.method || "—"}</td><td>{t.status || "—"}</td></tr>)}
              {transactions.length === 0 && <tr><td colSpan="6">No transactions found.</td></tr>}</tbody>
            </table></div>
          </div>
        )}

        {view === "staff" && (
          <div style={{ display: "grid", gap: 12 }}>
            <h2>Staff Monitoring</h2>
            <div className="table-wrap"><table><thead><tr><th>Name</th><th>Department</th><th>Role</th><th>Category</th></tr></thead>
              <tbody>{staff.map((s, i) => <tr key={s.id || i}><td>{s.name}</td><td>{s.department || "—"}</td><td>{s.role || "—"}</td><td>{s.category || "Staff"}</td></tr>)}
              {staff.length === 0 && <tr><td colSpan="4">No staff found.</td></tr>}</tbody>
            </table></div>
          </div>
        )}
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

function ConsultantPage({
  patients = [],
  showMessage,
  setPharmacyPrescriptions,
  setLabRequests,
  labRequests = [],
  pharmacyPrescriptions = [],
  ultrasoundRequests = [],
  setUltrasoundRequests,
  setPatients,
}) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationNote, setConsultationNote] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [medicineDetails, setMedicineDetails] = useState({});
  const [otherTest, setOtherTest] = useState("");
  const [otherMedicine, setOtherMedicine] = useState("");
  const [selectedUltrasound, setSelectedUltrasound] = useState("");
  const [ultrasoundNotes, setUltrasoundNotes] = useState("");

  const medicines = [
    "Paracetamol 500mg",
    "Amoxicillin 500mg",
    "Metronidazole 400mg",
    "Artemether/Lumefantrine",
  ];

  const laboratoryTests = {
    "Malaria Test": 1500,
    "Full Blood Count (FBC)": 3000,
    "Urinalysis": 1000,
    "Blood Group": 1000,
    "Widal Test": 2000,
    "Pregnancy Test": 1000,
  };

  const filteredPatients = patients.filter((patient) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    const name = String(
      patient.name || `${patient.surname || ""} ${patient.otherNames || ""}`
    ).toLowerCase();
    const card = String(patient.card || patient.cardNumber || patient.id || "").toLowerCase();
    const phone = String(patient.phone || patient.phoneNumber || "").toLowerCase();
    return name.includes(term) || card.includes(term) || phone.includes(term);
  }).slice(0, 12);

  const getPatientName = (patient) => {
    if (!patient) return "";
    return patient.name || `${patient.surname || ""} ${patient.otherNames || ""}`.trim();
  };

  const getPatientCard = (patient) => {
    if (!patient) return "";
    return patient.card || patient.cardNumber || patient.id || "";
  };

  const toggleTest = (test) => {
    setSelectedTests((previous) =>
      previous.includes(test)
        ? previous.filter((item) => item !== test)
        : [...previous, test]
    );
  };

  const toggleMedicine = (medicine) => {
    setSelectedMedicines((previous) =>
      previous.includes(medicine)
        ? previous.filter((item) => item !== medicine)
        : [...previous, medicine]
    );
  };

  const updateMedicineDetail = (medicine, field, value) => {
    setMedicineDetails((previous) => ({
      ...previous,
      [medicine]: {
        ...(previous[medicine] || {}),
        [field]: value,
      },
    }));
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearch(getPatientName(patient));
    setConsultationNote(patient.consultation?.notes || "");
    setDiagnosis(patient.consultation?.diagnosis || "");
    setSelectedTests([]);
    setSelectedMedicines([]);
    setMedicineDetails({});
    setOtherTest("");
    setOtherMedicine("");
    showMessage?.(`Patient selected: ${getPatientName(patient)}`);
  };

  const saveConsultation = () => {
    if (!selectedPatient) {
      showMessage?.("Da farko zaɓi patient.");
      return;
    }
    if (!consultationNote.trim() && !diagnosis.trim()) {
      showMessage?.("Shigar da consultation notes ko diagnosis.");
      return;
    }

    const consultation = {
      notes: consultationNote.trim(),
      diagnosis: diagnosis.trim(),
      consultant: "Consultant Room",
      date: new Date().toLocaleString(),
      status: "Completed",
    };

    if (setPatients) {
      setPatients((previous) =>
        previous.map((patient) =>
          patient.id === selectedPatient.id
            ? { ...patient, consultation }
            : patient
        )
      );
    }

    setSelectedPatient((previous) =>
      previous ? { ...previous, consultation } : previous
    );
    showMessage?.("Consultation saved successfully.");
  };

  const sendToLaboratory = () => {
    if (!selectedPatient) {
      showMessage?.("Da farko zaɓi patient.");
      return;
    }
    if (!selectedTests.length && !otherTest.trim()) {
      showMessage?.("Zaɓi aƙalla Laboratory Test ɗaya.");
      return;
    }
    if (!setLabRequests) {
      showMessage?.("Laboratory connection is not available.");
      return;
    }

    const tests = [
      ...selectedTests.map((test) => ({ test, amount: laboratoryTests[test] || 0 })),
      ...(otherTest.trim() ? [{ test: otherTest.trim(), amount: 0 }] : []),
    ];

    const requests = tests.map((item, index) => ({
      id: `LAB-${Date.now()}-${index}`,
      patientId: selectedPatient.id,
      card: getPatientCard(selectedPatient),
      patientName: getPatientName(selectedPatient),
      test: item.test,
      consultant: "Consultant Room",
      status: "New",
      paymentStatus: "Pending",
      paymentMethod: "Cash",
      amount: item.amount,
      result: "",
      consultationNote,
      date: new Date().toLocaleString(),
    }));

    setLabRequests((previous) => [...requests, ...previous]);
    showMessage?.(`${requests.length} laboratory request${requests.length > 1 ? "s" : ""} sent successfully.`);
    setSelectedTests([]);
    setOtherTest("");
  };

  const sendToPharmacy = () => {
    if (!selectedPatient) {
      showMessage?.("Da farko zaɓi patient.");
      return;
    }
    if (!selectedMedicines.length && !otherMedicine.trim()) {
      showMessage?.("Zaɓi aƙalla medicine ɗaya.");
      return;
    }
    if (!setPharmacyPrescriptions) {
      showMessage?.("Pharmacy connection is not available.");
      return;
    }

    const medicinesToSend = [
      ...selectedMedicines,
      ...(otherMedicine.trim() ? [otherMedicine.trim()] : []),
    ];

    const prescriptions = medicinesToSend.map((medicine, index) => {
      const detail = medicineDetails[medicine] || {};
      return {
        id: `CONS-RX-${Date.now()}-${index}`,
        patientId: selectedPatient.id,
        patientName: getPatientName(selectedPatient),
        card: getPatientCard(selectedPatient),
        medicine,
        quantity: Number(detail.quantity || 1),
        instructions: detail.instructions || "",
        duration: detail.duration || "",
        consultant: "Consultant Room",
        status: "New",
        paymentStatus: "Pending",
        paymentMethod: "Cash",
        amount: 0,
        date: new Date().toLocaleString(),
      };
    });

    setPharmacyPrescriptions((previous) => [...prescriptions, ...previous]);
    showMessage?.(`${prescriptions.length} prescription${prescriptions.length > 1 ? "s" : ""} sent to Pharmacy.`);
    setSelectedMedicines([]);
    setMedicineDetails({});
    setOtherMedicine("");
  };

  const sendToUltrasound = () => {
    if (!selectedPatient) return showMessage?.("Da farko zaɓi patient.");
    if (!selectedUltrasound) return showMessage?.("Zaɓi Ultrasound service.");
    if (!setUltrasoundRequests) return showMessage?.("Ultrasound connection is not available.");

    const request = {
      id: `CONS-US-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: getPatientName(selectedPatient),
      card: getPatientCard(selectedPatient),
      phone: selectedPatient.phone || selectedPatient.phoneNumber || "",
      type: selectedUltrasound,
      notes: ultrasoundNotes.trim() || consultationNote.trim(),
      consultant: "Consultant Room",
      status: "New",
      paymentStatus: "Pending",
      paymentMethod: "Cash",
      amount: selectedUltrasound === "Other" ? 0 : 5000,
      report: "",
      requestedAt: new Date().toLocaleString(),
      completedAt: "",
    };

    setUltrasoundRequests((previous) => [request, ...previous]);
    if (setPatients) {
      setPatients((previous) => previous.map((patient) => {
        if (String(patient.id) !== String(selectedPatient.id)) return patient;
        const existing = Array.isArray(patient.ultrasoundResults) ? patient.ultrasoundResults : [];
        return {
          ...patient,
          ultrasoundResults: [
            {
              id: request.id,
              card: request.card,
              type: request.type,
              notes: request.notes,
              report: "",
              status: "New",
              consultant: "Consultant Room",
              requestedAt: request.requestedAt,
            },
            ...existing.filter((item) => item.id !== request.id),
          ],
        };
      }));
    }
    showMessage?.("Ultrasound request sent successfully.");
    setSelectedUltrasound("");
    setUltrasoundNotes("");
  };

  const sameSelectedPatient = (record) => {
    if (!selectedPatient || !record) return false;
    const selectedId = String(selectedPatient.id || "");
    const selectedCard = String(getPatientCard(selectedPatient) || "");
    return (selectedId && String(record.patientId || "") === selectedId) ||
      (selectedCard && String(record.card || record.cardNumber || "") === selectedCard);
  };

  const readyLabResults = labRequests.filter(
    (request) =>
      sameSelectedPatient(request) &&
      (request.status === "Result Ready" || request.status === "Sent to Consultant")
  );

  const patientPrescriptions = pharmacyPrescriptions.filter((item) => sameSelectedPatient(item));

  const patientUltrasoundResults = [
    ...ultrasoundRequests.filter((request) => sameSelectedPatient(request)),
    ...(Array.isArray(selectedPatient?.ultrasoundResults) ? selectedPatient.ultrasoundResults : [])
      .filter((item) => !ultrasoundRequests.some((request) => request.id === item.id)),
  ];

  const selectedProfile = selectedPatient || {};
  const profileSections = [
    ["ICT Registration", selectedProfile.ictRegistration],
    ["Records", selectedProfile.records],
    ["Nursing", selectedProfile.nursing],
    ["Consultation", selectedProfile.consultation],
  ];

  return (
    <div>
      <PageHeader
        title="Consultant Room"
        subtitle="Consultation, diagnosis, laboratory requests, prescriptions and patient review"
        icon="✚"
      />

      <div className="stats-grid">
        <StatCard title="Waiting" value="5" icon="◉" />
        <StatCard title="In Consultation" value="1" icon="✚" />
        <StatCard title="Lab Requests" value={labRequests.length} icon="▣" />
        <StatCard title="Completed" value="29" icon="✓" />
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Select Patient</h2>
        <input
          className="search-input"
          style={{ width: "100%", minWidth: 0 }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedPatient(null);
          }}
          placeholder="Search patient by name, Card Number or phone..."
        />

        {!selectedPatient && search.trim() && (
          <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
            {filteredPatients.map((patient) => (
              <button
                type="button"
                key={patient.id}
                onClick={() => selectPatient(patient)}
                style={{
                  textAlign: "left",
                  border: "1px solid #dce3e8",
                  background: "#fff",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <strong>{getPatientName(patient)}</strong>
                <div style={{ marginTop: 4, fontSize: 11, color: "#71808d" }}>
                  Card: {getPatientCard(patient)} • Phone: {patient.phone || patient.phoneNumber || "-"}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPatient && (
        <>
          <div className="panel" style={{ marginTop: 20 }}>
            <div className="panel-header">
              <div>
                <h2>Patient Profile</h2>
                <p>Read-only information from ICT/Records/Nursing, with Consultant section editable here.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 15 }}>
              <div><strong>Name</strong><div>{getPatientName(selectedPatient)}</div></div>
              <div><strong>Card Number</strong><div>{getPatientCard(selectedPatient)}</div></div>
              <div><strong>Phone</strong><div>{selectedPatient.phone || selectedPatient.phoneNumber || "-"}</div></div>
              <div><strong>Sex</strong><div>{selectedPatient.sex || selectedPatient.gender || "-"}</div></div>
              <div><strong>Status</strong><div>{selectedPatient.status || "-"}</div></div>
              <div><strong>Spouse Name</strong><div>{selectedPatient.spouseName || "-"}</div></div>
            </div>

            <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
              {profileSections.map(([title, data]) => (
                <div key={title} style={{ border: "1px solid #e4e9ef", borderRadius: 8, padding: 12, background: "#fafbfd" }}>
                  <strong>{title}</strong>
                  <div style={{ marginTop: 5, fontSize: 12, color: "#71808d", whiteSpace: "pre-wrap" }}>
                    {data ? JSON.stringify(data, null, 2) : "No saved information available."}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Live Consultation</h2>
            <div className="form-grid">
              <label className="form-field">
                <span>Diagnosis</span>
                <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Enter diagnosis" />
              </label>
              <label className="form-field" style={{ gridColumn: "1 / -1" }}>
                <span>Consultation Notes</span>
                <textarea rows={5} value={consultationNote} onChange={(e) => setConsultationNote(e.target.value)} placeholder="Enter consultation notes..." />
              </label>
            </div>
            <button type="button" className="button primary" onClick={saveConsultation}>Save Consultation</button>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Laboratory Services</h2>
            <p style={{ marginTop: 0, color: "#71808d" }}>Click tests to select multiple services without using Ctrl.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(laboratoryTests).map(([name, price]) => (
                <button
                  key={name}
                  type="button"
                  className={`button ${selectedTests.includes(name) ? "primary" : "secondary"}`}
                  onClick={() => toggleTest(name)}
                >
                  {name} — ₦{price.toLocaleString()}
                </button>
              ))}
              <button type="button" className={`button ${otherTest ? "primary" : "secondary"}`} onClick={() => setOtherTest(otherTest ? "" : "Other Test")}>Others</button>
            </div>
            {otherTest && (
              <label className="form-field" style={{ marginTop: 15 }}>
                <span>Other Laboratory Test</span>
                <input value={otherTest === "Other Test" ? "" : otherTest} onChange={(e) => setOtherTest(e.target.value)} placeholder="Type other test" />
              </label>
            )}
            <div style={{ marginTop: 15, color: "#71808d", fontSize: 12 }}>
              Selected: {selectedTests.length ? selectedTests.join(", ") : "None"}{otherTest && otherTest !== "Other Test" ? `, ${otherTest}` : ""}
            </div>
            <button type="button" className="button primary" style={{ marginTop: 15 }} onClick={sendToLaboratory}>Send Request to Laboratory</button>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Ultrasound Services</h2>
            <p style={{ marginTop: 0, color: "#71808d" }}>Consultant can request Ultrasound directly for the selected patient. The request will appear in Ultrasound Room using the same Patient/Card Number.</p>
            <div className="form-grid">
              <FormField label="Ultrasound Type">
                <select value={selectedUltrasound} onChange={(e) => setSelectedUltrasound(e.target.value)}>
                  <option value="">Select ultrasound service</option>
                  <option>Obstetric Ultrasound</option>
                  <option>Abdominal Ultrasound</option>
                  <option>Pelvic Ultrasound</option>
                  <option>Renal Ultrasound</option>
                  <option>Breast Ultrasound</option>
                  <option>Other</option>
                </select>
              </FormField>
              <FormField label="Ultrasound Notes / Clinical Request">
                <textarea value={ultrasoundNotes} onChange={(e) => setUltrasoundNotes(e.target.value)} placeholder="Enter clinical request..." />
              </FormField>
            </div>
            <button type="button" className="button primary" onClick={sendToUltrasound}>Send Request to Ultrasound</button>

            <div style={{ marginTop: 18 }}>
              <h3>Ultrasound Results</h3>
              {patientUltrasoundResults.length === 0 ? (
                <div style={{ padding: 12, background: "#f7f9fb", borderRadius: 8, color: "#71808d" }}>No Ultrasound request found for this patient.</div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {patientUltrasoundResults.map((request) => (
                    <div key={request.id} style={{ border: "1px solid #dce3e8", borderRadius: 8, padding: 12 }}>
                      <strong>{request.type}</strong>
                      <div style={{ marginTop: 5 }}>Status: {request.status}</div>
                      <div style={{ marginTop: 5, fontSize: 12, color: "#71808d" }}>Requested: {request.requestedAt || "-"}</div>
                      {request.notes && <div style={{ marginTop: 7 }}><strong>Request:</strong> {request.notes}</div>}
                      {request.report && <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}><strong>Report:</strong> {request.report}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Prescription</h2>
            <p style={{ marginTop: 0, color: "#71808d" }}>Click medicines to select multiple medicines. Quantity/instructions can be entered for each selected medicine.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {medicines.map((item) => (
                <button key={item} type="button" className={`button ${selectedMedicines.includes(item) ? "primary" : "secondary"}`} onClick={() => toggleMedicine(item)}>{item}</button>
              ))}
              <button type="button" className={`button ${otherMedicine ? "primary" : "secondary"}`} onClick={() => setOtherMedicine(otherMedicine ? "" : "Other Medicine")}>Others</button>
            </div>

            {selectedMedicines.map((item) => {
              const detail = medicineDetails[item] || {};
              return (
                <div key={item} style={{ marginTop: 12, padding: 14, border: "1px solid #e4e9ef", borderRadius: 8 }}>
                  <strong>{item}</strong>
                  <div className="form-grid" style={{ marginTop: 10 }}>
                    <label className="form-field"><span>Quantity</span><input type="number" min="1" value={detail.quantity || 1} onChange={(e) => updateMedicineDetail(item, "quantity", e.target.value)} /></label>
                    <label className="form-field"><span>Duration</span><input value={detail.duration || ""} onChange={(e) => updateMedicineDetail(item, "duration", e.target.value)} placeholder="e.g. 3 days" /></label>
                    <label className="form-field" style={{ gridColumn: "1 / -1" }}><span>Instructions</span><input value={detail.instructions || ""} onChange={(e) => updateMedicineDetail(item, "instructions", e.target.value)} placeholder="e.g. Take after food" /></label>
                  </div>
                </div>
              );
            })}

            {otherMedicine && (
              <label className="form-field" style={{ marginTop: 15 }}>
                <span>Other Medicine</span>
                <input value={otherMedicine === "Other Medicine" ? "" : otherMedicine} onChange={(e) => setOtherMedicine(e.target.value)} placeholder="Type other medicine" />
              </label>
            )}
            <button type="button" className="button primary" style={{ marginTop: 15 }} onClick={sendToPharmacy}>Send Prescription to Pharmacy</button>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Laboratory Results</h2>
            {readyLabResults.length === 0 ? (
              <div style={{ padding: 15, background: "#f7f9fb", borderRadius: 8, color: "#71808d" }}>No laboratory results are ready for review.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {readyLabResults.map((request) => (
                  <div key={request.id} style={{ border: "1px solid #dce3e8", borderRadius: 10, padding: 15 }}>
                    <strong>{request.test}</strong>
                    <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{request.result || "No result entered yet."}</div>
                    <div style={{ marginTop: 8, fontSize: 11, color: "#71808d" }}>{request.status} • {request.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Pharmacy Results / Dispensing Status</h2>
            {patientPrescriptions.length === 0 ? (
              <div style={{ padding: 15, background: "#f7f9fb", borderRadius: 8, color: "#71808d" }}>No Pharmacy prescription found for this patient.</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Medicine</th><th>Qty</th><th>Instructions</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {patientPrescriptions.map((item) => (
                      <tr key={item.id}>
                        <td>{item.medicine}</td>
                        <td>{item.quantity}</td>
                        <td>{item.instructions || "-"}{item.duration ? ` (${item.duration})` : ""}</td>
                        <td><span className="status-badge active-status">{item.status || "Pending"}</span></td>
                        <td>{item.dispensedAt || item.date || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
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
  prescriptions,
  setPrescriptions,
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
function MaleWardPage({ patients = [], records = [], setRecords, showMessage }) {
  const [view, setView] = useState("patients");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [bed, setBed] = useState("");
  const [condition, setCondition] = useState("Stable");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const wardRecords = records.filter((r) => r.ward === "Male Ward");
  const beds = Array.from({ length: 12 }, (_, i) => `M-${String(i + 1).padStart(2, "0")}`);
  const occupied = wardRecords.filter((r) => r.status === "Admitted");
  const availableBeds = beds.filter((b) => !occupied.some((r) => r.bed === b));
  const filtered = wardRecords.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [r.patientName, r.card, r.bed, r.diagnosis, r.condition].some((v) => String(v || "").toLowerCase().includes(q));
  });

  const admit = () => {
    const patient = patients.find((p) => String(p.id) === String(selectedId));
    if (!patient) return showMessage("Zaɓi mara lafiya na namiji.");
    if (patient.sex !== "Male") return showMessage("Male Ward na karɓar male patient kawai.");
    if (!bed) return showMessage("Zaɓi bed.");
    if (occupied.some((r) => r.bed === bed)) return showMessage("Wannan bed ɗin yana occupied.");
    const record = { id: Date.now(), ward: "Male Ward", patientId: patient.id, patientName: patient.name, card: patient.card, bed, condition, diagnosis: diagnosis.trim() || "Not specified", notes: notes.trim(), status: "Admitted", admittedAt: new Date().toLocaleString(), dischargedAt: "" };
    setRecords((prev) => [record, ...prev]);
    showMessage(`${patient.name} an admitted zuwa Male Ward.`);
    setSelectedId(null); setBed(""); setCondition("Stable"); setDiagnosis(""); setNotes(""); setView("patients");
  };

  const discharge = (id) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status: "Discharged", dischargedAt: new Date().toLocaleString() } : r));
    showMessage("An yi discharge.");
  };

  return (
    <div>
      <PageHeader title="Male Ward" subtitle="Male patient admission, bed assignment, monitoring, notes and discharge" icon="M" />
      <div className="stats-grid">
        <StatCard title="Occupied Beds" value={occupied.length} icon="▣" />
        <StatCard title="Available Beds" value={availableBeds.length} icon="✓" />
        <StatCard title="New Admissions" value={wardRecords.filter((r) => r.status === "Admitted").length} icon="+" />
        <StatCard title="Discharges" value={wardRecords.filter((r) => r.status === "Discharged").length} icon="↗" />
      </div>
      <div className="card">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <button className={view === "patients" ? "primary" : "secondary"} onClick={() => setView("patients")}>Ward Patients</button>
          <button className={view === "beds" ? "primary" : "secondary"} onClick={() => setView("beds")}>Bed Status</button>
          <button className={view === "history" ? "primary" : "secondary"} onClick={() => setView("history")}>Discharge History</button>
          <button className="primary" onClick={() => setView("admit")}>+ Admit Male Patient</button>
        </div>
        {view !== "admit" && <input className="search" placeholder="Search patient, card, bed or diagnosis" value={search} onChange={(e) => setSearch(e.target.value)} />}
        {view === "admit" && (
          <div style={{ display: "grid", gap: 12, maxWidth: 700 }}>
            <h2>Admit Male Patient</h2>
            <label>Patient<select value={selectedId || ""} onChange={(e) => setSelectedId(e.target.value)}><option value="">Select male patient</option>{patients.filter((p) => p.sex === "Male").map((p) => <option key={p.id} value={p.id}>{p.name} — {p.card}</option>)}</select></label>
            <label>Bed<select value={bed} onChange={(e) => setBed(e.target.value)}><option value="">Select available bed</option>{availableBeds.map((b) => <option key={b} value={b}>{b}</option>)}</select></label>
            <label>Condition<select value={condition} onChange={(e) => setCondition(e.target.value)}><option>Stable</option><option>Under Observation</option><option>Needs Attention</option><option>Critical</option></select></label>
            <label>Diagnosis<input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" /></label>
            <label>Ward Notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes" /></label>
            <button className="primary" onClick={admit}>Admit Patient</button>
          </div>
        )}
        {view === "patients" && <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Card No.</th><th>Bed</th><th>Condition</th><th>Diagnosis</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.filter((r) => r.status === "Admitted").map((r) => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.condition}</td><td>{r.diagnosis}</td><td><StatusBadge status={r.status} /></td><td><button className="secondary" onClick={() => discharge(r.id)}>Discharge</button></td></tr>)}{filtered.filter((r) => r.status === "Admitted").length === 0 && <tr><td colSpan="7">No admitted male patient found.</td></tr>}</tbody></table></div>}
        {view === "beds" && <div className="table-wrap"><table><thead><tr><th>Bed</th><th>Status</th><th>Patient</th><th>Card No.</th></tr></thead><tbody>{beds.map((b) => { const r = occupied.find((x) => x.bed === b); return <tr key={b}><td>{b}</td><td>{r ? "Occupied" : "Available"}</td><td>{r ? r.patientName : "—"}</td><td>{r ? r.card : "—"}</td></tr>; })}</tbody></table></div>}
        {view === "history" && <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Card No.</th><th>Bed</th><th>Admitted</th><th>Discharged</th></tr></thead><tbody>{wardRecords.filter((r) => r.status === "Discharged").map((r) => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.admittedAt}</td><td>{r.dischargedAt}</td></tr>)}{wardRecords.filter((r) => r.status === "Discharged").length === 0 && <tr><td colSpan="5">No discharge history found.</td></tr>}</tbody></table></div>}
      </div>
    </div>
  );
}

function FemaleWardPage({ patients = [], records = [], setRecords, showMessage }) {
  return <WardPageGeneric title="Female Ward" prefix="F" sex="Female" patients={patients} records={records} setRecords={setRecords} showMessage={showMessage} />;
}

function WardPageGeneric({ title, prefix, sex, patients = [], records = [], setRecords, showMessage }) {
  const [view, setView] = useState("patients");
  const [selectedId, setSelectedId] = useState("");
  const [bed, setBed] = useState("");
  const [condition, setCondition] = useState("Stable");
  const [diagnosis, setDiagnosis] = useState("");
  const wardRecords = records.filter((r) => r.ward === title);
  const beds = Array.from({ length: 12 }, (_, i) => `${prefix}-${String(i + 1).padStart(2, "0")}`);
  const occupied = wardRecords.filter((r) => r.status === "Admitted");
  const available = beds.filter((b) => !occupied.some((r) => r.bed === b));
  const admit = () => { const p = patients.find((x) => String(x.id) === String(selectedId)); if (!p) return showMessage("Zaɓi patient."); if (p.sex !== sex) return showMessage(`${title} na karɓar ${sex.toLowerCase()} patient kawai.`); if (!bed) return showMessage("Zaɓi bed."); if (occupied.some((r) => r.bed === bed)) return showMessage("Bed ɗin yana occupied."); setRecords((prev) => [{ id: Date.now(), ward: title, patientId: p.id, patientName: p.name, card: p.card, bed, condition, diagnosis: diagnosis.trim() || "Not specified", status: "Admitted", admittedAt: new Date().toLocaleString(), dischargedAt: "" }, ...prev]); showMessage(`${p.name} an admitted zuwa ${title}.`); setSelectedId(""); setBed(""); setDiagnosis(""); setView("patients"); };
  const discharge = (id) => { setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status: "Discharged", dischargedAt: new Date().toLocaleString() } : r)); showMessage("An yi discharge."); };
  return <div><PageHeader title={title} subtitle={`${sex} patient admission, bed assignment, monitoring, notes and discharge`} icon={prefix} /><div className="stats-grid"><StatCard title="Occupied Beds" value={occupied.length} icon="▣" /><StatCard title="Available Beds" value={available.length} icon="✓" /><StatCard title="New Admissions" value={wardRecords.filter((r) => r.status === "Admitted").length} icon="+" /><StatCard title="Discharges" value={wardRecords.filter((r) => r.status === "Discharged").length} icon="↗" /></div><div className="card"><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}><button className="primary" onClick={() => setView("patients")}>Ward Patients</button><button className="secondary" onClick={() => setView("beds")}>Bed Status</button><button className="secondary" onClick={() => setView("history")}>Discharge History</button><button className="primary" onClick={() => setView("admit")}>+ Admit {sex} Patient</button></div>{view === "admit" && <div style={{ display: "grid", gap: 12, maxWidth: 700 }}><h2>Admit {sex} Patient</h2><select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}><option value="">Select patient</option>{patients.filter((p) => p.sex === sex).map((p) => <option key={p.id} value={p.id}>{p.name} — {p.card}</option>)}</select><select value={bed} onChange={(e) => setBed(e.target.value)}><option value="">Select available bed</option>{available.map((b) => <option key={b}>{b}</option>)}</select><select value={condition} onChange={(e) => setCondition(e.target.value)}><option>Stable</option><option>Under Observation</option><option>Needs Attention</option><option>Critical</option></select><input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" /><button className="primary" onClick={admit}>Admit Patient</button></div>}{view === "patients" && <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Card No.</th><th>Bed</th><th>Condition</th><th>Diagnosis</th><th>Status</th><th>Action</th></tr></thead><tbody>{occupied.map((r) => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.condition}</td><td>{r.diagnosis}</td><td><StatusBadge status={r.status} /></td><td><button className="secondary" onClick={() => discharge(r.id)}>Discharge</button></td></tr>)}{occupied.length === 0 && <tr><td colSpan="7">No admitted patient found.</td></tr>}</tbody></table></div>}{view === "beds" && <div className="table-wrap"><table><thead><tr><th>Bed</th><th>Status</th><th>Patient</th><th>Card No.</th></tr></thead><tbody>{beds.map((b) => { const r = occupied.find((x) => x.bed === b); return <tr key={b}><td>{b}</td><td>{r ? "Occupied" : "Available"}</td><td>{r ? r.patientName : "—"}</td><td>{r ? r.card : "—"}</td></tr>; })}</tbody></table></div>}{view === "history" && <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Card No.</th><th>Bed</th><th>Admitted</th><th>Discharged</th></tr></thead><tbody>{wardRecords.filter((r) => r.status === "Discharged").map((r) => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.admittedAt}</td><td>{r.dischargedAt}</td></tr>)}</tbody></table></div>}</div></div>;
}

export default App;

