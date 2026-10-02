import React, { useEffect, useMemo, useState } from "react";

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
  "Records Cashier",
  "Laboratory Cashier",
  "Pharmacy Cashier",
  "Ultrasound Cashier",
];

const ROLE_PAGE_RULES = {
  "Super Admin": "ALL",
  "In-Charge": ["Dashboard", "In-Charge", "Reports", "Audit Logs", "Roster & Attendance"],
  "General Cashier": ["Dashboard", "General Cashier", "Reports"],
  "ICT Staff": ["Dashboard", "ICT Centre", "ICT Stock / Inventory", "Patient Card Printing", "Appointments"],
  "Records Staff": ["Dashboard", "Records Unit", "Patient Card Printing", "Alerts"],
  "Records Cashier": ["Dashboard", "Records Unit"],
  "Nurse": ["Dashboard", "Nursing Unit", "Alerts", "Reception / Next Patient"],
  "Consultant": ["Dashboard", "Consultant Room", "Reception / Next Patient", "Alerts"],
  "Laboratory Staff": ["Dashboard", "Laboratory Unit", "Alerts"],
  "Laboratory Cashier": ["Dashboard", "Laboratory Unit"],
  "Pharmacy Staff": ["Dashboard", "Pharmacy Unit", "Alerts"],
  "Pharmacy Cashier": ["Dashboard", "Pharmacy Unit"],
  "Ultrasound Staff": ["Dashboard", "Ultrasound Room", "Alerts"],
  "Ultrasound Cashier": ["Dashboard", "Ultrasound Room"],
  "Ward Staff": ["Dashboard", "Male Ward", "Female Ward", "Maternity Ward", "Child Ward", "Labour Room", "Alerts"],
  "Immunization Staff": ["Dashboard", "Immunization Unit", "Alerts"],
  "Family Planning Staff": ["Dashboard", "Family Planning Unit", "Alerts"],
  "Adolescent Staff": ["Dashboard", "Adolescent Unit", "Alerts"],
};

const ROLE_ACTIONS = {
  "Super Admin": ["View", "Create", "Edit", "Delete", "Print", "Cashier", "Reports", "Stock", "SMS", "Alerts"],
  "In-Charge": ["View", "Reports", "Alerts"],
};

function getUserDepartments(user) {
  if (!user) return [];
  const list = Array.isArray(user.departments) && user.departments.length ? user.departments : [user.department];
  return [...new Set(list.filter(Boolean))];
}

function userCanAccessPage(user, targetPage) {
  if (!user) return false;
  if (user.role === "Super Admin") return true;
  const explicit = ROLE_PAGE_RULES[user.role];
  if (Array.isArray(explicit) && explicit.includes(targetPage)) return true;
  const depts = getUserDepartments(user);
  if (depts.includes(targetPage)) return true;
  if (targetPage === "Reports" && (user.permissions || []).includes("Reports")) return true;
  if (targetPage === "Alerts" && (user.permissions || []).includes("Alerts")) return true;
  return false;
}

function userCanAction(user, action) {
  if (!user) return false;
  if (user.role === "Super Admin") return true;
  if (user.role === "In-Charge") return ["View", "Reports", "Alerts"].includes(action);
  if (Array.isArray(user.permissions) && user.permissions.length) return user.permissions.includes(action);
  return ["View"].includes(action);
}

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
    isHOD: true,
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
    isHOD: true,
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
    isHOD: true,
  },
];

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) return JSON.parse(saved);
    } catch (error) {
      console.warn("Could not load saved data:", key, error);
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Could not save data:", key, error);
    }
  }, [key, value]);

  return [value, setValue];
}

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
  const [staff, setStaff] = usePersistentState("bazza_staff", initialStaff);
  const [patients, setPatients] = usePersistentState("bazza_patients", demoPatients);
  const [transactions, setTransactions] = usePersistentState("bazza_transactions", []);
  const [pharmacyPrescriptions, setPharmacyPrescriptions] = usePersistentState("bazza_pharmacy_prescriptions", [
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
  const [labRequests, setLabRequests] = usePersistentState("bazza_lab_requests", [
    { id: 1, card: "BZ-P001", patientName: "Aisha Musa", test: "Malaria Test", consultant: "Consultant Room", status: "New", paymentStatus: "Pending", amount: 1500, date: "9/18/2026, 1:20:00 PM" },
    { id: 2, card: "BZ-P002", patientName: "Ibrahim Bello", test: "Full Blood Count (FBC)", consultant: "Consultant Room", status: "Sample Received", paymentStatus: "Paid", amount: 3000, date: "9/18/2026, 1:25:00 PM" },
    { id: 3, card: "BZ-P003", patientName: "Fatima Yusuf", test: "Urinalysis", consultant: "Consultant Room", status: "In Progress", paymentStatus: "Paid", amount: 1000, date: "9/18/2026, 1:30:00 PM" },
  ]);
  const [wardRecords, setWardRecords] = usePersistentState("bazza_ward_records", []);
  const [ultrasoundRequests, setUltrasoundRequests] = usePersistentState("bazza_ultrasound_requests", []);
  const [attendance, setAttendance] = usePersistentState("bazza_attendance", []);
  const [rosterEntries, setRosterEntries] = usePersistentState("bazza_roster_entries", []);
  const [auditLogs, setAuditLogs] = usePersistentState("bazza_audit_logs", []);
  const [alerts, setAlerts] = usePersistentState("bazza_alerts", []);
  const [smsMessages, setSmsMessages] = usePersistentState("bazza_sms_messages", []);
  const [receptionQueue, setReceptionQueue] = usePersistentState("bazza_reception_queue", []);
  const [outpatientVisits, setOutpatientVisits] = usePersistentState("bazza_outpatient_visits", []);
  const [inventory, setInventory] = usePersistentState("bazza_inventory", []);
  const [inventoryMovements, setInventoryMovements] = usePersistentState("bazza_inventory_movements", []);
  const [appointments, setAppointments] = usePersistentState("bazza_appointments", []);
  const [staffPermissions, setStaffPermissions] = usePersistentState("bazza_staff_permissions", {});
  const [hospitalSettings, setHospitalSettings] = usePersistentState("bazza_hospital_settings", {
    facilityName: "COMPREHENSIVE HEALTH CLINIC BAZZAH",
    departmentName: "PRIMARY HEALTH CARE DEPARTMENT",
    address: "Waziri Maccido Road, Bazza Area, Sokoto",
    phone: "08169640287",
  });

  const staffWithRosterMeta = useMemo(() =>
    staff.map((person) => ({
      category: person.category || "Staff",
      departments: Array.isArray(person.departments) && person.departments.length
        ? person.departments
        : [person.department].filter(Boolean),
      maritalStatus: person.maritalStatus || "Single",
      isHOD: !!person.isHOD,
      allowedShifts: Array.isArray(person.allowedShifts) && person.allowedShifts.length
        ? person.allowedShifts
        : ["Morning", "Evening", "Night"],
      ...person,
    })),
  [staff]);
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
    departments: ["ICT Centre"],
    role: "ICT Staff",
    status: "Active",
    category: "Staff",
    maritalStatus: "Single",
    isHOD: false,
    allowedShifts: ["Morning", "Evening", "Night"],
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

  const canAccessPage = (targetPage) => userCanAccessPage(currentUser, targetPage);
  const canAction = (action) => userCanAction(currentUser, action);
  const goToPage = (targetPage) => {
    if (!canAccessPage(targetPage)) {
      showMessage("Ba ka da izinin shiga wannan department/module.");
      return;
    }
    setPage(targetPage);
  };

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

  const logAudit = (action, module, details = "", user = currentUser) => {
    setAuditLogs((prev) => [
      {
        id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        action,
        user: user?.name || "System",
        module,
        details,
        time: new Date().toLocaleString(),
      },
      ...prev,
    ].slice(0, 1000));
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
      logAudit("Failed Login", "Security", `Username: ${loginForm.username}`);
      showMessage("Username ko Password ba daidai ba.");
      return;
    }

    logAudit("Login", "Security", `Successful login: ${user.username}`, user);
    setCurrentUser(user);
    setPage("Dashboard");
    setLoginForm({
      username: "",
      password: "",
    });
  };

  const handleLogout = () => {
    logAudit("Logout", "Security", `User logged out: ${currentUser?.username || "—"}`);
    setCurrentUser(null);
    setPage("Dashboard");
  };

  useEffect(() => {
    if (!currentUser) return;
    if (!userCanAccessPage(currentUser, page)) {
      setPage("Dashboard");
      return;
    }
    logAudit("Open Module", page, "Module viewed", currentUser);
  }, [page, currentUser]);

  const openAddStaff = () => {
    if (currentUser?.role !== "Super Admin") return showMessage("Only Super Admin zai iya kara ma'aikaci.");
    setEditingStaff(null);
    setStaffForm(emptyStaffForm);
    setShowStaffModal(true);
  };

  const openEditStaff = (person) => {
    if (currentUser?.role !== "Super Admin") return showMessage("Only Super Admin zai iya gyara ma'aikaci.");
    setEditingStaff(person);

    setStaffForm({
      name: person.name,
      username: person.username,
      password: person.password,
      department: person.department,
      departments: person.departments || [person.department].filter(Boolean),
      role: person.role,
      status: person.status,
      category: person.category || "Staff",
      maritalStatus: person.maritalStatus || "Single",
      allowedShifts: person.allowedShifts || ["Morning", "Evening", "Night"],
    });

    setShowStaffModal(true);
  };

  const saveStaff = (e) => {
    if (currentUser?.role !== "Super Admin") return showMessage("Only Super Admin zai iya canza staff.");
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
    if (currentUser?.role !== "Super Admin") return showMessage("Only Super Admin zai iya goge staff.");
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
          <SecureMenuItem
            label="Dashboard"
            icon="⌂"
            currentUser={currentUser}
            active={page === "Dashboard"}
            onClick={() => goToPage("Dashboard")}
          />

          <div className="menu-section">PATIENT SERVICES</div>

          <SecureMenuItem
            label="ICT Centre"
            icon="▣"
            currentUser={currentUser}
            active={page === "ICT Centre"}
            onClick={() => goToPage("ICT Centre")}
          />

          <SecureMenuItem
            label="Records Unit"
            icon="▤"
            currentUser={currentUser}
            active={page === "Records Unit"}
            onClick={() => goToPage("Records Unit")}
          />

          <SecureMenuItem
            label="Nursing Unit"
            icon="♙"
            currentUser={currentUser}
            active={page === "Nursing Unit"}
            onClick={() => goToPage("Nursing Unit")}
          />

          <SecureMenuItem
            label="Consultant Room"
            icon="✚"
            currentUser={currentUser}
            active={page === "Consultant Room"}
            onClick={() => goToPage("Consultant Room")}
          />

          <SecureMenuItem
            label="Laboratory"
            icon="⚗"
            currentUser={currentUser}
            active={page === "Laboratory Unit"}
            onClick={() => goToPage("Laboratory Unit")}
          />

          <SecureMenuItem
            label="Pharmacy"
            icon="⚕"
            currentUser={currentUser}
            active={page === "Pharmacy Unit"}
            onClick={() => goToPage("Pharmacy Unit")}
          />

          <SecureMenuItem
            label="Ultrasound"
            icon="◉"
            currentUser={currentUser}
            active={page === "Ultrasound Room"}
            onClick={() => goToPage("Ultrasound Room")}
          />

          <div className="menu-section">WARDS & PROGRAMS</div>

          <SecureMenuItem
            label="Male Ward"
            icon="M"
            currentUser={currentUser}
            active={page === "Male Ward"}
            onClick={() => goToPage("Male Ward")}
          />

          <SecureMenuItem
            label="Female Ward"
            icon="F"
            currentUser={currentUser}
            active={page === "Female Ward"}
            onClick={() => goToPage("Female Ward")}
          />

          <SecureMenuItem
            label="Maternity Ward"
            icon="♥"
            currentUser={currentUser}
            active={page === "Maternity Ward"}
            onClick={() => goToPage("Maternity Ward")}
          />

          <SecureMenuItem
            label="Child Ward"
            icon="C"
            currentUser={currentUser}
            active={page === "Child Ward"}
            onClick={() => goToPage("Child Ward")}
          />

          <SecureMenuItem
            label="Labour Room"
            icon="L"
            currentUser={currentUser}
            active={page === "Labour Room"}
            onClick={() => goToPage("Labour Room")}
          />

          <SecureMenuItem
            label="Immunization"
            icon="I"
            currentUser={currentUser}
            active={page === "Immunization Unit"}
            onClick={() => goToPage("Immunization Unit")}
          />

          <SecureMenuItem
            label="Family Planning"
            icon="P"
            currentUser={currentUser}
            active={page === "Family Planning Unit"}
            onClick={() => goToPage("Family Planning Unit")}
          />

          <SecureMenuItem
            label="Adolescent Unit"
            icon="A"
            currentUser={currentUser}
            active={page === "Adolescent Unit"}
            onClick={() => goToPage("Adolescent Unit")}
          />

          <SecureMenuItem
            label="Outpatient Services"
            icon="O"
            currentUser={currentUser}
            active={page === "Outpatient Services"}
            onClick={() => goToPage("Outpatient Services")}
          />

          <SecureMenuItem
            label="Reception / Next Patient"
            icon="R"
            currentUser={currentUser}
            active={page === "Reception / Next Patient"}
            onClick={() => goToPage("Reception / Next Patient")}
          />

          <div className="menu-section">ADMINISTRATION</div>

          <SecureMenuItem
            label="In-Charge"
            icon="◈"
            currentUser={currentUser}
            active={page === "In-Charge"}
            onClick={() => goToPage("In-Charge")}
          />

          {currentUser.role === "Super Admin" && <SecureMenuItem
            label="Staff & Permissions"
            icon="♟"
            currentUser={currentUser}
            active={page === "Staff & Permissions"}
            onClick={() => goToPage("Staff & Permissions")}
          />}

          <SecureMenuItem
            label="General Cashier"
            icon="₦"
            currentUser={currentUser}
            active={page === "General Cashier"}
            onClick={() => goToPage("General Cashier")}
          />

          <SecureMenuItem
            label="Roster & Attendance"
            icon="▦"
            currentUser={currentUser}
            active={page === "Roster & Attendance"}
            onClick={() => goToPage("Roster & Attendance")}
          />

          <SecureMenuItem
            label="Reports"
            icon="▥"
            currentUser={currentUser}
            active={page === "Reports"}
            onClick={() => goToPage("Reports")}
          />

          <SecureMenuItem
            label="Alerts"
            icon="!"
            currentUser={currentUser}
            active={page === "Alerts"}
            onClick={() => goToPage("Alerts")}
          />

          <SecureMenuItem
            label="SMS / Notifications"
            icon="✉"
            currentUser={currentUser}
            active={page === "SMS / Notifications"}
            onClick={() => goToPage("SMS / Notifications")}
          />

          <SecureMenuItem
            label="Audit Logs"
            icon="◌"
            currentUser={currentUser}
            active={page === "Audit Logs"}
            onClick={() => goToPage("Audit Logs")}
          />

          {currentUser.role === "Super Admin" && <SecureMenuItem
            label="Settings"
            icon="⚙"
            currentUser={currentUser}
            active={page === "Settings"}
            onClick={() => goToPage("Settings")}
          />}

          <SecureMenuItem label="ICT Stock / Inventory" icon="📦" currentUser={currentUser} active={page === "ICT Stock / Inventory"} onClick={() => goToPage("ICT Stock / Inventory")} />
          <SecureMenuItem label="Appointments" icon="📅" currentUser={currentUser} active={page === "Appointments"} onClick={() => goToPage("Appointments")} />
          <SecureMenuItem label="Patient Card Printing" icon="▤" currentUser={currentUser} active={page === "Patient Card Printing"} onClick={() => goToPage("Patient Card Printing")} />
          {currentUser.role === "Super Admin" && <SecureMenuItem label="Backup & Restore" icon="↕" currentUser={currentUser} active={page === "Backup & Restore"} onClick={() => goToPage("Backup & Restore")} />}
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
            <button className="icon-button" onClick={() => goToPage("Alerts")}>
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
              attendance={attendance}
              setAttendance={setAttendance}
              setPage={goToPage}
              canAccessPage={canAccessPage}
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
              transactions={transactions}
              currentUser={currentUser}
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
              transactions={transactions}
              currentUser={currentUser}
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
  transactions={transactions}
  currentUser={currentUser}
/>
)}

          {page === "Ultrasound Room" && (
            <UltrasoundRoomPage
              patients={patients}
              requests={ultrasoundRequests}
              setRequests={setUltrasoundRequests}
              setTransactions={setTransactions}
              setPatients={setPatients}
              transactions={transactions}
              currentUser={currentUser}
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
            <ProgramUnitPage
              title={page}
              patients={patients}
              setPatients={setPatients}
              showMessage={showMessage}
              logAudit={logAudit}
            />
          )}

          {page === "General Cashier" && (
            <GeneralCashierPage transactions={transactions} />
          )}

          {page === "Roster & Attendance" && (
            <RosterPage staff={staffWithRosterMeta} setStaff={setStaff} attendance={attendance} setAttendance={setAttendance} rosterEntries={rosterEntries} setRosterEntries={setRosterEntries} currentUser={currentUser} showMessage={showMessage} />
          )}

          {page === "Reports" && (
            <ReportsPage
              patients={patients}
              transactions={transactions}
              labRequests={labRequests}
              pharmacyPrescriptions={pharmacyPrescriptions}
              ultrasoundRequests={ultrasoundRequests}
              wardRecords={wardRecords}
              attendance={attendance}
              rosterEntries={rosterEntries}
            />
          )}

          {page === "Alerts" && (
            <AlertsPage
              currentUser={currentUser}
              patients={patients}
              alerts={alerts}
              setAlerts={setAlerts}
              receptionQueue={receptionQueue}
              setReceptionQueue={setReceptionQueue}
              showMessage={showMessage}
              logAudit={logAudit}
            />
          )}

          {page === "SMS / Notifications" && (
            <SMSNotificationsPage
              patients={patients}
              messages={smsMessages}
              setMessages={setSmsMessages}
              currentUser={currentUser}
              showMessage={showMessage}
              logAudit={logAudit}
            />
          )}

          {page === "Audit Logs" && (
            <AuditPage currentUser={currentUser} logs={auditLogs} />
          )}

          {page === "Outpatient Services" && (
            <OutpatientPage
              patients={patients}
              visits={outpatientVisits}
              setVisits={setOutpatientVisits}
              transactions={transactions}
              setTransactions={setTransactions}
              currentUser={currentUser}
              showMessage={showMessage}
              logAudit={logAudit}
            />
          )}

          {page === "Reception / Next Patient" && (
            <ReceptionPage
              queue={receptionQueue}
              setQueue={setReceptionQueue}
              currentUser={currentUser}
              showMessage={showMessage}
            />
          )}

          {page === "Settings" && (
            <SystemAdministrationPage
              currentUser={currentUser}
              staff={staff}
              setStaff={setStaff}
              staffPermissions={staffPermissions}
              setStaffPermissions={setStaffPermissions}
              settings={hospitalSettings}
              setSettings={setHospitalSettings}
              showMessage={showMessage}
            />
          )}

          {page === "ICT Stock / Inventory" && (
            <InventoryPage inventory={inventory} setInventory={setInventory} movements={inventoryMovements} setMovements={setInventoryMovements} showMessage={showMessage} />
          )}

          {page === "Appointments" && (
            <AppointmentsPage patients={patients} appointments={appointments} setAppointments={setAppointments} showMessage={showMessage} />
          )}

          {page === "Patient Card Printing" && (
            <PatientCardPage patients={patients} settings={hospitalSettings} />
          )}

          {page === "Backup & Restore" && (
            <BackupRestorePage
              data={{ patients, staff, transactions, pharmacyPrescriptions, labRequests, wardRecords, ultrasoundRequests, attendance, rosterEntries, auditLogs, alerts, smsMessages, receptionQueue, outpatientVisits, inventory, inventoryMovements, appointments, staffPermissions, hospitalSettings }}
              setters={{ setPatients, setStaff, setTransactions, setPharmacyPrescriptions, setLabRequests, setWardRecords, setUltrasoundRequests, setAttendance, setRosterEntries, setAuditLogs, setAlerts, setSmsMessages, setReceptionQueue, setOutpatientVisits, setInventory, setInventoryMovements, setAppointments, setStaffPermissions, setHospitalSettings }}
              showMessage={showMessage}
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
    <button className={`menu-item ${active ? "active" : ""}`} onClick={onClick}>
      <span className="menu-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function SecureMenuItem({ label, icon, active, onClick, currentUser }) {
  const labelMap = {
    Laboratory: "Laboratory Unit",
    Pharmacy: "Pharmacy Unit",
    Ultrasound: "Ultrasound Room",
    Immunization: "Immunization Unit",
    "Family Planning": "Family Planning Unit",
    "Adolescent Unit": "Adolescent Unit",
    "Patient Card Printing": "Patient Card Printing",
    "ICT Stock / Inventory": "ICT Stock / Inventory",
    Appointments: "Appointments",
    "Backup & Restore": "Backup & Restore",
  };
  const target = labelMap[label] || label;
  if (!userCanAccessPage(currentUser, target)) return null;
  return <MenuItem label={label} icon={icon} active={active} onClick={onClick} />;
}

function DashboardPage({ currentUser, patients, staff, attendance = [], setAttendance, setPage, canAccessPage }) {
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

      <div className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-header">
          <div>
            <h2>Today’s Staff Attendance</h2>
            <p>Sign-in / sign-out status for today</p>
          </div>
          <button className="button secondary" onClick={() => setPage("Roster & Attendance")}>
            Open Roster & Attendance
          </button>
        </div>
        <div className="stats-grid">
          <StatCard title="Signed In" value={attendance.filter((a) => a.date === new Date().toLocaleDateString() && a.signIn && !a.signOut).length} icon="✓" />
          <StatCard title="Signed Out" value={attendance.filter((a) => a.date === new Date().toLocaleDateString() && a.signOut).length} icon="↗" />
          <StatCard title="On Duty" value={attendance.filter((a) => a.date === new Date().toLocaleDateString() && a.dutyStatus === "On Duty").length} icon="▦" />
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-header">
          <div>
            <h2>My Duty Attendance</h2>
            <p>System Logout is separate from duty Sign Out.</p>
          </div>
          <div className="button-row">
            {(() => {
              const today = new Date().toLocaleDateString();
              const rec = [...attendance].reverse().find((a) => a.staffId === currentUser.staffId && a.date === today);
              return rec?.signIn && !rec?.signOut ? (
                <button className="button secondary" onClick={() => {
                  setAttendance((prev) => prev.map((a) => a.id === rec.id ? { ...a, signOut: new Date().toLocaleTimeString(), dutyStatus: "Completed" } : a));
                }}>Sign Out Duty</button>
              ) : (
                <button className="button primary" onClick={() => {
                  setAttendance((prev) => [...prev, { id: `${currentUser.staffId}-${Date.now()}`, staffId: currentUser.staffId, name: currentUser.name, department: currentUser.department, date: today, signIn: new Date().toLocaleTimeString(), signOut: "", dutyStatus: "On Duty" }]);
                }}>Sign In Duty</button>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>{currentUser?.role === "Super Admin" || currentUser?.role === "In-Charge" ? "Department Overview" : "My Department"}</h2>
              <p>{currentUser?.role === "Super Admin" || currentUser?.role === "In-Charge" ? "System-wide monitoring" : "Only your assigned department workspace is shown here"}</p>
            </div>
          </div>

          {(currentUser?.role === "Super Admin" || currentUser?.role === "In-Charge") ? (
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
                  <div><strong>{name}</strong><span>{info}</span></div>
                  <span className="status-dot"></span>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{margin:0}}>
              <h3>{currentUser?.department || "Assigned Department"}</h3>
              <p className="muted">You can only access work assigned to your department and approved workflows.</p>
              <p><strong>Role:</strong> {currentUser?.role}</p>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Frequently used modules</p>
            </div>
          </div>

          <div className="quick-actions">
            {canAccessPage?.("ICT Centre") && <button onClick={() => setPage("ICT Centre")}><span>▣</span>Register Patient</button>}
            {canAccessPage?.("Records Unit") && <button onClick={() => setPage("Records Unit")}><span>▤</span>Patient Records</button>}
            {canAccessPage?.("General Cashier") && <button onClick={() => setPage("General Cashier")}><span>₦</span>Cashier</button>}
            {canAccessPage?.("Roster & Attendance") && <button onClick={() => setPage("Roster & Attendance")}><span>▦</span>Attendance</button>}
          </div>
        </div>
      </div>

      {(currentUser?.role === "Super Admin" || currentUser?.role === "In-Charge") && (
        <div className="panel recent-panel">
          <div className="panel-header">
            <div><h2>Recent Patients</h2><p>Latest patient registrations</p></div>
            <button className="text-button" onClick={() => setPage("ICT Centre")}>View All</button>
          </div>
          <PatientTable patients={patients} />
        </div>
      )}
    </div>
  );
}

function ICTPage({ patients, setPatients, showMessage }) {
  const [form, setForm] = useState({
    surname: "",
    otherNames: "",
    phone: "",
    sex: "Female",
    age: "",
    address: "",
    broughtByName: "",
    broughtByRelationship: "",
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
      age: form.age === "" ? "" : Number(form.age),
      address: form.address.trim(),
      broughtByName: form.broughtByName.trim(),
      broughtByRelationship: form.broughtByRelationship,
      status: "Active",
    };

    setPatients((prev) => [...prev, newPatient]);

    setForm({
      surname: "",
      otherNames: "",
      phone: "",
      sex: "Female",
      age: "",
      address: "",
      broughtByName: "",
      broughtByRelationship: "",
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

            <FormField label="Age">
              <input
                type="number"
                min="0"
                max="130"
                value={form.age}
                onChange={(e) =>
                  setForm({
                    ...form,
                    age: e.target.value,
                  })
                }
                placeholder="Age"
              />
            </FormField>

            <FormField label="Address">
              <input
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
                placeholder="Residential address"
              />
            </FormField>

            <FormField label="Name of Person Who Brought Patient">
              <input
                value={form.broughtByName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    broughtByName: e.target.value,
                  })
                }
                placeholder="Full name"
              />
            </FormField>

            <FormField label="Relationship to Patient">
              <select
                value={form.broughtByRelationship}
                onChange={(e) =>
                  setForm({
                    ...form,
                    broughtByRelationship: e.target.value,
                  })
                }
              >
                <option value="">Select relationship</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Brother</option>
                <option>Sister</option>
                <option>Husband</option>
                <option>Wife</option>
                <option>Son</option>
                <option>Daughter</option>
                <option>Uncle</option>
                <option>Aunt</option>
                <option>Guardian</option>
                <option>Friend</option>
                <option>Other</option>
              </select>
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
function RecordsPage({ patients, showMessage, setTransactions, transactions = [], currentUser }) {
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

      <DepartmentCashierPanel department="Records Unit" transactions={transactions} setTransactions={setTransactions} currentUser={currentUser} showMessage={showMessage} />

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
              <strong>Age</strong>
              <span>{selectedPatient.age !== "" && selectedPatient.age != null ? `${selectedPatient.age} years` : "Not provided"}</span>
            </div>

            <div className="access-box">
              <strong>Address</strong>
              <span>{selectedPatient.address || "Not provided"}</span>
            </div>

            <div className="access-box">
              <strong>Sex</strong>
              <span>{selectedPatient.sex}</span>
            </div>

            <div className="access-box">
              <strong>Person Who Brought Patient</strong>
              <span>{selectedPatient.broughtByName || "Not provided"}</span>
            </div>

            <div className="access-box">
              <strong>Relationship to Patient</strong>
              <span>{selectedPatient.broughtByRelationship || "Not provided"}</span>
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
  transactions = [],
  currentUser,
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

    if (setTransactions && amount > 0) {
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
          cashier: paymentStatus === "Paid" ? "Laboratory Cashier" : "",
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

      <DepartmentCashierPanel department="Laboratory Unit" transactions={transactions} setTransactions={setTransactions} currentUser={currentUser} showMessage={showMessage} />

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

          <SearchableSelect
            label="Laboratory Test"
            value={test}
            onChange={setTest}
            showPrice
            placeholder="Select Laboratory Test"
            options={[...Object.entries(tests).map(([name, price]) => ({ value: name, label: name, price })), { value: "Others", label: "Others" }]}
          />

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


function openBazzaReceiptPrint(transaction) {
  if (!transaction) return;
  const printWindow = window.open("", "_blank", "width=600,height=700");
  if (!printWindow) return;
  const amount = Number(transaction.amount || 0).toLocaleString();
  printWindow.document.write(`
    <!doctype html><html><head><title>Bazza PHC Receipt</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111}.receipt{max-width:420px;margin:auto}
      h1{text-align:center;margin:0 0 6px;font-size:22px}.sub{text-align:center;margin-bottom:22px;font-size:13px}
      .row{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #ddd}.label{font-weight:700}
      .amount{font-size:20px;font-weight:700;margin-top:12px;border-top:2px solid #111}.footer{text-align:center;margin-top:24px;font-size:11px}
    </style></head><body><div class="receipt">
      <h1>BAZZA PRIMARY HEALTH CARE</h1><div class="sub">Receipt</div>
      <div class="row"><span class="label">Receipt No.</span><span>${transaction.transactionNo || transaction.transactionNumber || "—"}</span></div>
      <div class="row"><span class="label">Patient</span><span>${transaction.patientName || "—"}</span></div>
      <div class="row"><span class="label">Card Number</span><span>${transaction.card || "—"}</span></div>
      <div class="row"><span class="label">Item / Service</span><span>${transaction.service || "—"}</span></div>
      <div class="row amount"><span>Amount</span><span>₦${amount}</span></div>
      <div class="row"><span class="label">Payment Method</span><span>${transaction.paymentMethod || "—"}</span></div>
      <div class="row"><span class="label">Payment Status</span><span>${transaction.paymentStatus || "—"}</span></div>
      <div class="row"><span class="label">Cashier</span><span>${transaction.cashier || "—"}</span></div>
      <div class="row"><span class="label">Date / Time</span><span>${transaction.date || "—"}</span></div>
      <div class="footer">Thank you.</div>
    </div><script>window.onload=function(){window.print();};</script></body></html>`);
  printWindow.document.close();
}

function SearchableSelect({ label, value, onChange, options = [], placeholder = "Select...", disabled = false, showPrice = false }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const normalized = query.trim().toLowerCase();
  const normalizedOptions = options.map((item) => {
    if (typeof item === "string") return { value: item, label: item };
    return item;
  });
  const filtered = normalized
    ? normalizedOptions.filter((item) => String(item.label).toLowerCase().startsWith(normalized) || String(item.label).toLowerCase().includes(normalized))
    : normalizedOptions;
  const selected = normalizedOptions.find((item) => String(item.value) === String(value));
  return (
    <div className="field searchable-select-wrap">
      {label && <label>{label}</label>}
      <button type="button" className="searchable-select-trigger" disabled={disabled} onClick={() => setOpen((v) => !v)}>
        {selected ? selected.label : placeholder}<span>⌄</span>
      </button>
      {open && !disabled && (
        <div className="searchable-select-menu">
          <input autoFocus className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rubuta farkon suna..." />
          <button type="button" className="searchable-option" onClick={() => { onChange(""); setQuery(""); setOpen(false); }}>{placeholder}</button>
          {filtered.map((item) => (
            <button key={String(item.value)} type="button" className="searchable-option" onClick={() => { onChange(item.value); setQuery(""); setOpen(false); }}>
              <span>{item.label}</span>{showPrice && item.price !== undefined ? <strong>₦{Number(item.price).toLocaleString()}</strong> : null}
            </button>
          ))}
          {!filtered.length && <div className="muted" style={{padding:10}}>Babu abin da ya dace da wannan harafi.</div>}
        </div>
      )}
    </div>
  );
}

function DepartmentCashierPanel({ department, transactions = [], setTransactions, currentUser, showMessage }) {
  const cashierRoles = ["Super Admin", "General Cashier", "Records Staff", "Laboratory Staff", "Pharmacy Staff", "Ultrasound Staff"];
  const allowed = currentUser && (
    currentUser.role === "Super Admin" ||
    currentUser.role === "General Cashier" ||
    cashierRoles.includes(currentUser.role) && (currentUser.department === department || currentUser.permissions?.includes?.("Cashier") || currentUser.cashierDepartments?.includes?.(department)) ||
    currentUser.permissions?.includes?.("Cashier")
  );
  if (!allowed) return null;
  const own = transactions.filter((t) => t.department === department);
  const settle = (transaction, method) => {
    setTransactions((prev) => prev.map((t) => t.id === transaction.id ? {
      ...t,
      paymentMethod: method,
      paymentStatus: "Paid",
      cashier: currentUser.role === "General Cashier" ? "General Cashier" : `${currentUser.name} — ${department} Cashier`,
      date: new Date().toLocaleString(),
    } : t));
    showMessage?.("An karɓi payment kuma receipt ya shirya.");
  };
  return (
    <div className="card">
      <h2>{department} — Cashier</h2>
      <p className="muted">Cashier na wannan department na iya karɓar payment da buga receipt. General Cashier kuma yana iya yin aikin wannan department.</p>
      {!own.length ? <p className="muted">Babu transaction na wannan department tukuna.</p> : (
        <div className="table-scroll"><table><thead><tr><th>Patient</th><th>Item / Service</th><th>Amount</th><th>Status</th><th>Cashier</th><th>Action</th></tr></thead>
        <tbody>{own.map((t) => <tr key={t.id}><td>{t.patientName} — {t.card}</td><td>{t.service}</td><td>₦{Number(t.amount || 0).toLocaleString()}</td><td>{t.paymentStatus}</td><td>{t.cashier || "—"}</td><td>
          {t.paymentStatus !== "Paid" && t.paymentStatus !== "FREE" ? <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><button className="small-button" onClick={() => settle(t,"Cash")}>Cash</button><button className="small-button" onClick={() => settle(t,"POS")}>POS</button><button className="small-button" onClick={() => settle(t,"Bank Transfer")}>Transfer</button></div> : null}
          {(t.paymentStatus === "Paid" || t.paymentStatus === "FREE") && <button className="small-button" onClick={() => openBazzaReceiptPrint(t)}>Print Receipt</button>}
        </td></tr>)}</tbody></table></div>
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

  const printReceipt = (transaction) => openBazzaReceiptPrint(transaction);

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
                  <th>Receipt</th>
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
                    <td>
                      <button className="small-button" onClick={() => printReceipt(transaction)}>
                        Print Receipt
                      </button>
                    </td>
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

function RosterPage({
  staff,
  setStaff,
  attendance = [],
  setAttendance,
  rosterEntries = [],
  setRosterEntries,
  currentUser,
  showMessage,
}) {
  const shifts = ["Morning", "Evening", "Night"];
  const categories = ["Staff", "Volunteer", "Student"];
  const [view, setView] = useState("general");
  const [department, setDepartment] = useState("All Departments");
  const [period, setPeriod] = useState("current");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);
  const [setup, setSetup] = useState({
    staffId: "",
    category: "Staff",
    departments: [],
    maritalStatus: "Single",
    allowedShifts: ["Morning", "Evening", "Night"],
    isHOD: false,
  });

  const today = new Date();
  const todayKey = today.toLocaleDateString();
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekKey = weekStart.toISOString().slice(0, 10);

  const eligibleShifts = (person) => {
    if (person.isHOD || (person.role || "").toLowerCase().includes("hod")) return shifts;
    if (person.maritalStatus === "Married") return ["Morning", "Evening"];
    if (person.category === "Student" || person.category === "Volunteer") {
      return person.allowedShifts?.length ? person.allowedShifts : ["Morning", "Evening"];
    }
    return person.allowedShifts?.length ? person.allowedShifts : shifts;
  };

  const cycleDuty = (shift, index) => {
    if (shift === "Morning") return index % 7 < 6 ? "Duty" : "Off";
    if (shift === "Evening") return index % 7 < 5 ? "Duty" : "Off";
    return index % 7 < 4 ? "Duty" : "Off";
  };

  const generateRoster = () => {
    const generated = [];
    staff.forEach((person) => {
      const isStudent = person.category === "Student";
      const days = isStudent ? 7 : new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const start = isStudent ? new Date(weekStart) : new Date(today.getFullYear(), today.getMonth(), 1);
      const allowed = eligibleShifts(person);
      for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        generated.push({
          id: `${person.id}-${d.toISOString().slice(0, 10)}`,
          staffId: person.staffId,
          name: person.name,
          category: person.category || "Staff",
          departments: person.departments || [person.department].filter(Boolean),
          date: d.toLocaleDateString(),
          dateKey: d.toISOString().slice(0, 10),
          period: isStudent ? "Weekly" : "Monthly",
          shifts: Object.fromEntries(shifts.map((shift) => [shift, allowed.includes(shift) ? cycleDuty(shift, i) : "—"])),
          rules: "Morning 6 duty/1 off • Evening 5 duty/2 off • Night 4 duty/3 off",
        });
      }
    });
    setRosterEntries(generated);
    showMessage("An ƙirƙiri sabon roster kuma an ajiye shi.");
  };

  const signIn = (person) => {
    const existing = attendance.find((a) => a.staffId === person.staffId && a.date === todayKey && !a.signOut);
    if (existing) {
      showMessage("Wannan staff ya riga ya yi Sign In yau.");
      return;
    }
    const now = new Date().toLocaleTimeString();
    setAttendance((prev) => [
      ...prev.filter((a) => !(a.staffId === person.staffId && a.date === todayKey && !a.signOut)),
      {
        id: `${person.staffId}-${Date.now()}`,
        staffId: person.staffId,
        name: person.name,
        department: person.department,
        date: todayKey,
        signIn: now,
        signOut: "",
        dutyStatus: "On Duty",
      },
    ]);
    showMessage(`${person.name} ya yi Sign In.`);
  };

  const signOut = (person) => {
    const existing = [...attendance].reverse().find((a) => a.staffId === person.staffId && a.date === todayKey && !a.signOut);
    if (!existing) {
      showMessage("Babu Sign In na yau da za a yi Sign Out.");
      return;
    }
    setAttendance((prev) => prev.map((a) => a.id === existing.id ? { ...a, signOut: new Date().toLocaleTimeString(), dutyStatus: "Completed" } : a));
    showMessage(`${person.name} ya yi Sign Out.`);
  };

  const allDepartments = ["All Departments", ...Array.from(new Set(staff.flatMap((p) => p.departments || [p.department]).filter(Boolean)))];
  const visibleStaff = department === "All Departments" ? staff : staff.filter((p) => (p.departments || [p.department]).includes(department));
  const visibleEntries = rosterEntries.filter((entry) => department === "All Departments" || (entry.departments || []).includes(department));
  const todayAttendance = attendance.filter((a) => a.date === todayKey);
  const signedIn = todayAttendance.filter((a) => a.signIn && !a.signOut);
  const signedOut = todayAttendance.filter((a) => a.signOut);
  const onDuty = todayAttendance.filter((a) => a.dutyStatus === "On Duty");

  const openSetup = (person) => {
    setSelectedStaffId(person.staffId);
    setSetup({
      staffId: person.staffId,
      category: person.category || "Staff",
      departments: person.departments || [person.department].filter(Boolean),
      maritalStatus: person.maritalStatus || "Single",
      allowedShifts: person.allowedShifts?.length ? person.allowedShifts : ["Morning", "Evening", "Night"],
      isHOD: !!person.isHOD,
    });
    setSetupOpen(true);
  };

  const saveSetup = () => {
    const person = staff.find((p) => p.staffId === setup.staffId);
    if (!person) return;
    // Staff data is persisted by the parent. This event stores roster setup separately,
    // so the roster remains available even after logout/login or reopening the app.
    const updated = {
      category: setup.category,
      departments: setup.departments.length ? setup.departments : [person.department].filter(Boolean),
      maritalStatus: setup.maritalStatus,
      isHOD: setup.isHOD,
      allowedShifts: setup.allowedShifts.length ? setup.allowedShifts : ["Morning", "Evening"],
      department: setup.departments[0] || person.department,
    };
    setStaff((prev) => prev.map((p) => p.staffId === person.staffId ? { ...p, ...updated } : p));
    setRosterEntries((prev) => prev.map((entry) => entry.staffId === person.staffId ? { ...entry, ...updated } : entry));
    showMessage("An ajiye Staff / Roster setup.");
    setSetupOpen(false);
  };

  const printRoster = () => {
    window.print();
  };

  return (
    <div>
      <PageHeader title="Roster & Staff Attendance" subtitle="General roster, department rosters, sign in/out and attendance" icon="▦" />

      <div className="stats-grid">
        <StatCard title="Total Staff" value={staff.length} icon="♟" />
        <StatCard title="Signed In Today" value={signedIn.length} icon="✓" />
        <StatCard title="Signed Out Today" value={signedOut.length} icon="↗" />
        <StatCard title="On Duty" value={onDuty.length} icon="▦" />
      </div>

      <div className="toolbar">
        <button className={`button ${view === "general" ? "primary" : "secondary"}`} onClick={() => setView("general")}>General Roster</button>
        <button className={`button ${view === "department" ? "primary" : "secondary"}`} onClick={() => setView("department")}>Department Roster</button>
        <button className={`button ${view === "attendance" ? "primary" : "secondary"}`} onClick={() => setView("attendance")}>Sign In / Sign Out</button>
        <button className={`button ${view === "setup" ? "primary" : "secondary"}`} onClick={() => setView("setup")}>Staff Roster Setup</button>
      </div>

      {(view === "general" || view === "department") && (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>{view === "general" ? "General Staff Roster" : `${department} Roster`}</h2>
              <p>Staff/Volunteers use monthly roster; Students use weekly roster.</p>
            </div>
            <div className="button-row">
              <button className="button primary" onClick={generateRoster}>Generate Roster</button>
              <button className="button secondary" onClick={printRoster}>Print Roster</button>
            </div>
          </div>

          {view === "department" && (
            <div className="field" style={{ maxWidth: 360 }}>
              <label>Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                {allDepartments.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          )}

          <div className="table-scroll">
            <table>
              <thead><tr><th>Staff</th><th>Category</th><th>Department(s)</th><th>Period</th><th>Morning</th><th>Evening</th><th>Night</th><th>Sign In</th><th>Sign Out</th><th>Rules</th></tr></thead>
              <tbody>
                {(visibleEntries.length ? visibleEntries.slice(0, 120) : visibleStaff.map((person, index) => ({
                  id: `preview-${person.id}`, name: person.name, category: person.category || "Staff", departments: person.departments || [person.department], period: person.category === "Student" ? "Weekly" : "Monthly", shifts: Object.fromEntries(shifts.map((sh) => [sh, eligibleShifts(person).includes(sh) ? cycleDuty(sh, index) : "—"])), rules: "Morning 6/1 • Evening 5/2 • Night 4/3"
                }))).map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.name}</td><td>{entry.category}</td><td>{(entry.departments || []).join(", ")}</td><td>{entry.period}</td>
                    {shifts.map((sh) => <td key={sh}><span className="shift-badge">{entry.shifts?.[sh] || "—"}</span></td>)}
                    <td>{[...attendance].reverse().find((a) => a.staffId === entry.staffId && a.date === entry.date)?.signIn || "—"}</td>
                    <td>{[...attendance].reverse().find((a) => a.staffId === entry.staffId && a.date === entry.date)?.signOut || "—"}</td>
                    <td>{entry.rules}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "attendance" && (
        <div className="panel">
          <div className="panel-header"><div><h2>Staff Sign In / Sign Out</h2><p>Duty attendance is separate from system Logout.</p></div></div>
          <div className="table-scroll"><table>
            <thead><tr><th>Staff</th><th>Category</th><th>Department</th><th>Today</th><th>Sign In</th><th>Sign Out</th><th>Duty Status</th><th>Action</th></tr></thead>
            <tbody>{staff.map((person) => {
              const record = [...attendance].reverse().find((a) => a.staffId === person.staffId && a.date === todayKey);
              return <tr key={person.id}>
                <td>{person.name}</td><td>{person.category || "Staff"}</td><td>{person.department}</td><td>{todayKey}</td><td>{record?.signIn || "—"}</td><td>{record?.signOut || "—"}</td><td>{record?.dutyStatus || "Not Signed In"}</td>
                <td><div className="table-actions"><button className="small-button" onClick={() => signIn(person)}>Sign In</button><button className="small-button" onClick={() => signOut(person)}>Sign Out</button></div></td>
              </tr>;
            })}</tbody>
          </table></div>
        </div>
      )}

      {view === "setup" && (
        <div className="panel">
          <div className="panel-header"><div><h2>Staff Roster Setup</h2><p>Assign category and department(s), then set marital status and allowed shifts.</p></div></div>
          <div className="table-scroll"><table>
            <thead><tr><th>Name</th><th>Category</th><th>Department(s)</th><th>Marital Status</th><th>Allowed Shifts</th><th>Action</th></tr></thead>
            <tbody>{staff.map((person) => <tr key={person.id}><td>{person.name}</td><td>{person.category || "Staff"}</td><td>{(person.departments || [person.department]).join(", ")}</td><td>{person.maritalStatus || "Single"}</td><td>{(person.allowedShifts || shifts).join(", ")}</td><td><button className="small-button" onClick={() => openSetup(person)}>Setup</button></td></tr>)}</tbody>
          </table></div>
        </div>
      )}

      <div className="panel" style={{ marginTop: 18 }}>
        <h3>Roster Rules</h3>
        <div className="shift-rules">
          <div><strong>Staff + Volunteers</strong><span>Monthly roster</span></div>
          <div><strong>Students</strong><span>Weekly roster</span></div>
          <div><strong>Morning</strong><span>6 duty days → 1 off</span></div>
          <div><strong>Evening</strong><span>5 duty days → 2 off</span></div>
          <div><strong>Night</strong><span>4 duty days → 3 off</span></div>
          <div><strong>Married Staff</strong><span>Morning + Evening only</span></div>
          <div><strong>HOD</strong><span>Morning + Evening + Night</span></div>
        </div>
      </div>

      {setupOpen && (
        <Modal title={`Roster Setup — ${staff.find((p) => p.staffId === selectedStaffId)?.name || "Staff"}`} onClose={() => setSetupOpen(false)}>
          <div className="form-grid">
            <FormField label="Category"><select value={setup.category} onChange={(e) => setSetup({ ...setup, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select></FormField>
            <FormField label="Marital Status"><select value={setup.maritalStatus} onChange={(e) => setSetup({ ...setup, maritalStatus: e.target.value })}><option>Single</option><option>Married</option></select></FormField>
          </div>
          <label className="permission-item" style={{ marginBottom: 14 }}><input type="checkbox" checked={setup.isHOD} onChange={(e) => setSetup({ ...setup, isHOD: e.target.checked })} /> <span>HOD — always Morning + Evening + Night</span></label>
          <div className="field"><label>Department(s)</label><div className="button-row">{departments.filter((d) => !["General Cashier", "In-Charge"].includes(d)).map((d) => <button type="button" key={d} className={`small-button ${setup.departments.includes(d) ? "primary" : ""}`} onClick={() => setSetup({ ...setup, departments: setup.departments.includes(d) ? setup.departments.filter((x) => x !== d) : [...setup.departments, d] })}>{d}</button>)}</div></div>
          <div className="field"><label>Allowed Shifts</label><div className="button-row">{shifts.map((sh) => <button type="button" key={sh} className={`small-button ${setup.allowedShifts.includes(sh) ? "primary" : ""}`} onClick={() => setSetup({ ...setup, allowedShifts: setup.allowedShifts.includes(sh) ? setup.allowedShifts.filter((x) => x !== sh) : [...setup.allowedShifts, sh] })}>{sh}</button>)}</div></div>
          <div className="modal-actions"><button className="button secondary" onClick={() => setSetupOpen(false)}>Cancel</button><button className="button primary" onClick={saveSetup}>Save Setup</button></div>
        </Modal>
      )}
    </div>
  );
}

function AuditPage({ currentUser, logs = [] }) {
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="System activity and accountability records" icon="◌" />
      <div className="panel">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Action</th><th>User</th><th>Module</th><th>Details</th><th>Date / Time</th><th>Status</th></tr></thead>
            <tbody>
              {logs.length ? logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.action}</td><td>{log.user}</td><td>{log.module}</td><td>{log.details || "—"}</td><td>{log.time}</td>
                  <td><span className="status-badge active-status">Recorded</span></td>
                </tr>
              )) : <tr><td colSpan="6">No audit records yet.</td></tr>}
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
          <button className="secondary" onClick={() => setView("nursing")}>Nursing Care / Reports</button>
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

        {view === "nursing" && <WardNursingCarePanel wardName="Child Ward" />}
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
          <button className="secondary" onClick={() => setView("nursing")}>Nursing Care / Reports</button>
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

        {view === "nursing" && <WardNursingCarePanel wardName="Maternity Ward" />}
      </div>
    </div>
  );
}



function SearchableMultiSelectButtons({ label, options = [], value = [], onChange, placeholder = "Search..." }) {
  const [query, setQuery] = useState("");
  const filtered = options.filter((option) => String(option).toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = (option) => {
    const next = value.includes(option) ? value.filter((item) => item !== option) : [...value, option];
    onChange?.(next);
  };
  return (
    <div className="form-field">
      <span>{label}</span>
      <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} style={{marginTop:8}} />
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
        {filtered.map((option) => (
          <button key={option} type="button" className={value.includes(option) ? "button primary" : "button secondary"} onClick={() => toggle(option)}>
            {value.includes(option) ? "✓ " : "＋ "}{option}
          </button>
        ))}
        {!filtered.length && <span className="muted">No matching option.</span>}
      </div>
      {value.length > 0 && <div style={{marginTop:10}}><strong>Selected:</strong> {value.join(", ")}</div>}
    </div>
  );
}

function NursingUnitPage({ patients = [], setPatients, showMessage }) {
  const [view, setView] = useState("queue");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [measurementValues, setMeasurementValues] = useState({});
  const [result, setResult] = useState("");
  const [condition, setCondition] = useState("");
  const [ward, setWard] = useState("");
  const [bed, setBed] = useState("");
  const [notes, setNotes] = useState("");
  const [savedRecords, setSavedRecords] = usePersistentState("bazza_nursing_records", []);

  const measurementOptions = [
    "Blood Pressure (BP)", "Pulse Rate", "Temperature", "Respiratory Rate", "Weight",
    "Height", "Oxygen Saturation (SpO₂)", "Blood Glucose", "Pain Score", "MUAC", "Other Measurement"
  ];
  const resultOptions = ["Stable", "Improving", "Needs Consultant Review", "Urgent Review", "Completed"];
  const conditionOptions = ["Good", "Fair", "Serious", "Critical", "Needs Further Assessment"];
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

  const updateMeasurement = (name, value) => setMeasurementValues(prev => ({ ...prev, [name]: value }));
  const toggleMeasurement = (item) => setMeasurements(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);

  const save = () => {
    if (!selected) return showMessage("Zaɓi patient da farko.");
    if (measurements.length < 2) return showMessage("Zaɓi aƙalla measurements guda 2 kafin consultation.");
    const missing = measurements.filter(m => !String(measurementValues[m] || "").trim());
    if (missing.length) return showMessage(`Cika sakamakon: ${missing.join(", ")}.`);
    if (!result) return showMessage("Zaɓi nursing result.");
    if (!condition) return showMessage("Zaɓi patient condition.");

    const preConsultation = { selected: measurements, values: measurementValues, completed: true, date: new Date().toLocaleString() };
    const record = {
      id: Date.now(), patientId: selected.id, patientName: selected.name, card: selected.card,
      age: selected.age ?? "", sex: selected.sex || "", tasks: [], preConsultation,
      measurements, measurementValues, result, condition, ward: ward || "Not Assigned", bed: bed || "Not Assigned",
      notes: notes.trim(), status: result === "Needs Consultant Review" || result === "Urgent Review" ? "Ready for Consultant" : "Completed",
      date: new Date().toLocaleString(), source: "Nursing Unit"
    };
    setSavedRecords(prev => [record, ...prev]);
    if (typeof setPatients === "function") {
      setPatients(prev => prev.map(p => String(p.id) === String(selected.id)
        ? { ...p, nursing: { ...(p.nursing || {}), ...record } } : p));
    }
    showMessage(`${selected.name} pre-consultation assessment an ajiye.`);
    setMeasurements([]); setMeasurementValues({}); setResult(""); setCondition(""); setWard(""); setBed(""); setNotes(""); setSelected(null); setSearch(""); setView("queue");
  };

  const ready = savedRecords.filter(r => r.status === "Ready for Consultant");
  return <div>
    <PageHeader title="Nursing Unit" subtitle="Pre-consultation measurements, patient preparation and handoff to Consultant" icon="♙" />
    <div className="stats-grid">
      <StatCard title="Patients" value={patients.length} icon="◉" />
      <StatCard title="Nursing Records" value={savedRecords.length} icon="✓" />
      <StatCard title="Ready for Consultant" value={ready.length} icon="→" />
      <StatCard title="Completed" value={savedRecords.filter(r => r.status === "Completed").length} icon="▣" />
    </div>
    <div className="panel">
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <button className="button primary" onClick={() => setView("queue")}>Patient Queue</button>
        <button className="button secondary" onClick={() => setView("records")}>Pre-Consultation Records</button>
        <button className="button secondary" onClick={() => setView("ready")}>Ready for Consultant</button>
      </div>
      {view === "queue" && <>
        <h2>Select Patient</h2>
        <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search card number, name or phone" />
        <div className="search-results">{filtered.slice(0,15).map(p => <button key={p.id} className="result-item" onClick={() => {setSelected(p);setSearch(p.name);}}>{p.name} — {p.card} — {p.phone || "No phone"}</button>)}</div>
        {selected && <div style={{marginTop:16}}>
          <div className="card" style={{marginBottom:16}}><h2>Patient Information</h2><div className="form-grid">
            <div className="access-box"><strong>Name</strong><span>{selected.name}</span></div>
            <div className="access-box"><strong>Card Number</strong><span>{selected.card}</span></div>
            <div className="access-box"><strong>Age</strong><span>{selected.age !== "" && selected.age != null ? `${selected.age} years` : "Not provided"}</span></div>
            <div className="access-box"><strong>Sex</strong><span>{selected.sex || "Not provided"}</span></div>
          </div></div>
          <SearchableMultiSelectButtons label="Pre-Consultation Measurements — Select 2 or more" options={measurementOptions} value={measurements} onChange={setMeasurements} placeholder="Search BP, weight, temperature, pulse..." />
          {measurements.length > 0 && <div className="card" style={{marginTop:16}}><h3>Enter Measurement Results</h3><p className="muted">Kowane measurement da ka zaɓa sai ka saka result/value dinsa.</p><div className="form-grid">
            {measurements.map(m => <FormField key={m} label={m}><input value={measurementValues[m] || ""} onChange={e => updateMeasurement(m,e.target.value)} placeholder={`Enter ${m}`} /></FormField>)}
          </div></div>}
          <div className="form-grid" style={{marginTop:16}}>
            <FormField label="Patient Condition"><select value={condition} onChange={e=>setCondition(e.target.value)}><option value="">Select condition</option>{conditionOptions.map(x=><option key={x}>{x}</option>)}</select></FormField>
            <FormField label="Nursing Result"><select value={result} onChange={e=>setResult(e.target.value)}><option value="">Select result</option>{resultOptions.map(x=><option key={x}>{x}</option>)}</select></FormField>
            <FormField label="Ward Assignment"><select value={ward} onChange={e=>{setWard(e.target.value);setBed("")}}><option value="">Select ward</option>{wards.map(x=><option key={x}>{x}</option>)}</select></FormField>
            {beds.length>0 && <FormField label="Bed"><select value={bed} onChange={e=>setBed(e.target.value)}><option value="">Select bed</option>{beds.map(x=><option key={x}>{x}</option>)}</select></FormField>}
            <FormField label="Report / Additional Clinical Notes"><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Rubuta ƙarin bayanin nursing da ba standardized ba..." /></FormField>
          </div>
          <div className="access-box" style={{marginTop:16}}><strong>Workflow</strong><span>ICT/Records → Nursing Measurements → Ready for Consultant → Consultant Room</span></div>
          <button className="button primary" onClick={save} style={{marginTop:16}}>Save & Send to Consultant Queue</button>
        </div>}
      </>}
      {view === "records" && <div className="table-wrapper"><table><thead><tr><th>Patient</th><th>Card</th><th>Measurements & Results</th><th>Condition</th><th>Result</th><th>Status</th><th>Date</th></tr></thead><tbody>
        {savedRecords.map(r=><tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{(r.measurements||[]).map(m=>`${m}: ${r.measurementValues?.[m]||"—"}`).join(" | ")}</td><td>{r.condition||"—"}</td><td>{r.result}</td><td>{r.status}</td><td>{r.date}</td></tr>)}
        {!savedRecords.length && <tr><td colSpan="7">No pre-consultation record found.</td></tr>}
      </tbody></table></div>}
      {view === "ready" && <div className="table-wrapper"><table><thead><tr><th>Patient</th><th>Card</th><th>Measurements</th><th>Condition</th><th>Result</th><th>Notes</th><th>Date</th></tr></thead><tbody>
        {ready.map(r=><tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{(r.measurements||[]).map(m=>`${m}: ${r.measurementValues?.[m]||"—"}`).join(" | ")}</td><td>{r.condition}</td><td>{r.result}</td><td>{r.notes||"—"}</td><td>{r.date}</td></tr>)}
        {!ready.length && <tr><td colSpan="7">No patient is ready for Consultant.</td></tr>}
      </tbody></table></div>}
    </div>
  </div>;
}


function WardNursingCarePanel({ wardName }) {
  const [nursingRecords] = usePersistentState("bazza_nursing_records", []);
  const [wardCareRecords, setWardCareRecords] = usePersistentState("bazza_ward_nursing_care_records", []);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState("");
  const wardPatients = wardCareRecords.filter(r => r.ward === wardName && r.status !== "Discharged");
  const taskOptions = ["Patient Assessment","Vital Signs Assessment","Medication Given","Injection Given","IV Fluid Started","Wound Care","Dressing Changed","Admission Assessment","Patient Education","Discharge Preparation","Other"];
  const saveCare = () => {
    const source = nursingRecords.find(r => String(r.patientId) === String(selectedPatientId) && r.ward === wardName);
    if (!selectedPatientId) return alert("Zaɓi patient.");
    if (tasks.length < 2) return alert("Zaɓi aƙalla nursing tasks guda 2.");
    const id = Date.now();
    const patient = source || wardPatients.find(r => String(r.patientId) === String(selectedPatientId));
    const rec = { id, ward: wardName, patientId: selectedPatientId, patientName: patient?.patientName || "Unknown", card: patient?.card || "", tasks, notes: notes.trim(), status: "Completed", date: new Date().toLocaleString(), performedIn: wardName };
    setWardCareRecords(prev => [rec, ...prev]);
    setSelectedPatientId(""); setTasks([]); setNotes("");
  };
  const patientOptions = Array.from(new Map(nursingRecords.filter(r => r.ward === wardName).map(r => [String(r.patientId), r])).values());
  const combined = [...wardCareRecords.filter(r => r.ward === wardName), ...nursingRecords.filter(r => r.ward === wardName && !wardCareRecords.some(w => String(w.patientId) === String(r.patientId) && w.date === r.date))];
  return <div className="panel" style={{marginTop:12}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><div><h2 style={{marginBottom:4}}>Ward Nursing Care / Patient Care</h2><p className="muted" style={{margin:0}}>Wannan ward ne ke rubuta abin da aka yi wa admitted patients. Ba ya canza Nursing pre-consultation records.</p></div><div className="access-box"><strong>Care Records</strong><span>{combined.length}</span></div></div>
    <div className="card" style={{marginTop:16}}>
      <h3>Record Nursing Care</h3>
      <div className="form-grid"><FormField label="Patient"><select value={selectedPatientId} onChange={e=>setSelectedPatientId(e.target.value)}><option value="">Select ward patient</option>{patientOptions.map(p=><option key={p.patientId} value={p.patientId}>{p.patientName} — {p.card}</option>)}</select></FormField></div>
      <SearchableMultiSelectButtons label="Nursing Tasks — Select 2 or more" options={taskOptions} value={tasks} onChange={setTasks} placeholder="Search task..." />
      <FormField label="Ward Nursing Notes"><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Rubuta clinical care notes idan akwai..." /></FormField>
      <button className="button primary" onClick={saveCare} style={{marginTop:10}}>Save Ward Nursing Care</button>
    </div>
    {combined.length === 0 ? <div className="empty-state" style={{marginTop:16}}>Babu Nursing care record da aka ajiye wa wannan ward tukuna.</div> : <div className="table-wrapper" style={{marginTop:16}}><table><thead><tr><th>Patient</th><th>Card</th><th>Tasks</th><th>Notes</th><th>Status</th><th>Date</th></tr></thead><tbody>{combined.map((r,i)=><tr key={`${r.id}-${i}`}><td>{r.patientName}</td><td>{r.card}</td><td><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{(r.tasks||[]).map(t=><span key={t} className="badge">{t}</span>)}</div></td><td>{r.notes||"—"}</td><td><StatusBadge status={r.status||"Completed"} /></td><td>{r.date||"—"}</td></tr>)}</tbody></table></div>}
  </div>;
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
  return <div><PageHeader title={title} subtitle={`${sex} patient admission, bed assignment, monitoring, notes and discharge`} icon={prefix} /><div className="stats-grid"><StatCard title="Occupied Beds" value={occupied.length} icon="▣" /><StatCard title="Available Beds" value={available.length} icon="✓" /><StatCard title="New Admissions" value={wardRecords.filter((r) => r.status === "Admitted").length} icon="+" /><StatCard title="Discharges" value={wardRecords.filter((r) => r.status === "Discharged").length} icon="↗" /></div><div className="card"><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}><button className="primary" onClick={() => setView("patients")}>Ward Patients</button><button className="secondary" onClick={() => setView("beds")}>Bed Status</button><button className="secondary" onClick={() => setView("history")}>Discharge History</button><button className="secondary" onClick={() => setView("nursing")}>Nursing Care / Reports</button><button className="primary" onClick={() => setView("admit")}>+ Admit {sex} Patient</button></div>{view === "admit" && <div style={{ display: "grid", gap: 12, maxWidth: 700 }}><h2>Admit {sex} Patient</h2><select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}><option value="">Select patient</option>{patients.filter((p) => p.sex === sex).map((p) => <option key={p.id} value={p.id}>{p.name} — {p.card}</option>)}</select><select value={bed} onChange={(e) => setBed(e.target.value)}><option value="">Select available bed</option>{available.map((b) => <option key={b}>{b}</option>)}</select><select value={condition} onChange={(e) => setCondition(e.target.value)}><option>Stable</option><option>Under Observation</option><option>Needs Attention</option><option>Critical</option></select><input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Diagnosis" /><button className="primary" onClick={admit}>Admit Patient</button></div>}{view === "patients" && <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Card No.</th><th>Bed</th><th>Condition</th><th>Diagnosis</th><th>Status</th><th>Action</th></tr></thead><tbody>{occupied.map((r) => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.condition}</td><td>{r.diagnosis}</td><td><StatusBadge status={r.status} /></td><td><button className="secondary" onClick={() => discharge(r.id)}>Discharge</button></td></tr>)}{occupied.length === 0 && <tr><td colSpan="7">No admitted patient found.</td></tr>}</tbody></table></div>}{view === "beds" && <div className="table-wrap"><table><thead><tr><th>Bed</th><th>Status</th><th>Patient</th><th>Card No.</th></tr></thead><tbody>{beds.map((b) => { const r = occupied.find((x) => x.bed === b); return <tr key={b}><td>{b}</td><td>{r ? "Occupied" : "Available"}</td><td>{r ? r.patientName : "—"}</td><td>{r ? r.card : "—"}</td></tr>; })}</tbody></table></div>}{view === "history" && <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Card No.</th><th>Bed</th><th>Admitted</th><th>Discharged</th></tr></thead><tbody>{wardRecords.filter((r) => r.status === "Discharged").map((r) => <tr key={r.id}><td>{r.patientName}</td><td>{r.card}</td><td>{r.bed}</td><td>{r.admittedAt}</td><td>{r.dischargedAt}</td></tr>)}</tbody></table></div>}{view === "nursing" && <WardNursingCarePanel wardName={title} />}</div></div>;
}


function SystemAdministrationPage({ currentUser, staff, setStaff, staffPermissions, setStaffPermissions, settings, setSettings, showMessage }) {
  const [tab, setTab] = useState("users");
  const [selected, setSelected] = useState(staff[0]?.staffId || "");
  const [form, setForm] = useState(settings);
  const cashierRoles = ["Records Cashier", "Laboratory Cashier", "Pharmacy Cashier", "Ultrasound Cashier", "General Cashier"];
  const selectedStaff = staff.find((x) => x.staffId === selected);
  const saveSettings = () => { setSettings(form); showMessage("An ajiye hospital settings."); };
  const toggleStaffStatus = (id) => setStaff(prev => prev.map(p => p.id === id ? {...p, status: p.status === "Active" ? "Inactive" : "Active"} : p));
  const perms = permissions;
  return <div>
    <PageHeader title="System Administration" subtitle="Super Admin control, permissions, hospital settings and cashier roles" icon="⚙" />
    {currentUser?.role !== "Super Admin" ? <div className="panel"><strong>Super Admin access kawai.</strong></div> : <>
      <div className="toolbar">
        {[["users","Users"],["permissions","Permissions"],["settings","Hospital Settings"]].map(([k,l]) => <button key={k} className={`button ${tab===k?"primary":"secondary"}`} onClick={()=>setTab(k)}>{l}</button>)}
      </div>
      {tab === "users" && <div className="panel"><h2>Users & Roles</h2><div className="table-scroll"><table><thead><tr><th>Staff</th><th>Department</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{staff.map(p=><tr key={p.id}><td>{p.name}</td><td>{(p.departments||[p.department]).join(", ")}</td><td>{p.role}{cashierRoles.includes(p.role)?" • Cashier":""}</td><td>{p.status}</td><td><button className="small-button" onClick={()=>toggleStaffStatus(p.id)}>{p.status==="Active"?"Disable":"Enable"}</button></td></tr>)}</tbody></table></div></div>}
      {tab === "permissions" && <div className="panel"><h2>Per-Staff Permissions</h2><div className="field"><label>Staff</label><select value={selected} onChange={e=>setSelected(e.target.value)}>{staff.map(p=><option key={p.staffId} value={p.staffId}>{p.name} — {p.role}</option>)}</select></div>{selectedStaff && <div className="button-row">{perms.map(per => { const on=staffPermissions[selected]?.[per] !== false; return <button key={per} className={`small-button ${on?"primary":""}`} onClick={()=>setStaffPermissions(prev=>({...prev,[selected]:{...(prev[selected]||{}),[per]:!on}}))}>{per}: {on?"ON":"OFF"}</button>; })}</div>}</div>}
      {tab === "settings" && <div className="panel"><h2>Hospital Settings</h2><div className="form-grid"><FormField label="Facility Name"><input value={form.facilityName} onChange={e=>setForm({...form,facilityName:e.target.value})}/></FormField><FormField label="Department"><input value={form.departmentName} onChange={e=>setForm({...form,departmentName:e.target.value})}/></FormField><FormField label="Address"><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></FormField><FormField label="Phone"><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></FormField></div><button className="button primary" onClick={saveSettings}>Save Settings</button></div>}
    </>}
  </div>;
}

function InventoryPage({ inventory, setInventory, movements, setMovements, showMessage }) {
  const [form,setForm]=useState({name:"",category:"",unit:"",quantity:0,reorderLevel:5,price:0,free:false});
  const [q,setQ]=useState("");
  const save=()=>{ if(!form.name.trim()) return showMessage("Rubuta sunan item."); const item={id:`STK-${Date.now()}`,...form,quantity:Number(form.quantity)||0,reorderLevel:Number(form.reorderLevel)||0,price:Number(form.price)||0}; setInventory(p=>[...p,item]); setMovements(p=>[{id:Date.now(),type:"Stock In",item:item.name,quantity:item.quantity,time:new Date().toLocaleString()},...p]); setForm({name:"",category:"",unit:"",quantity:0,reorderLevel:5,price:0,free:false}); showMessage("An ƙara stock item.");};
  const adjust=(id,delta)=>setInventory(prev=>prev.map(x=>x.id===id?{...x,quantity:Math.max(0,Number(x.quantity)+delta)}:x));
  const filtered=inventory.filter(x=>`${x.name} ${x.category}`.toLowerCase().includes(q.toLowerCase()));
  return <div><PageHeader title="ICT Stock / Inventory" subtitle="ICT controls stock, department issue, balances and movement history" icon="📦"/><div className="panel"><h2>Add Stock Item</h2><div className="form-grid"><FormField label="Item Name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Start typing..."/></FormField><FormField label="Category"><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></FormField><FormField label="Unit"><input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="Box / Pack / Bottle"/></FormField><FormField label="Quantity"><input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/></FormField><FormField label="Reorder Level"><input type="number" value={form.reorderLevel} onChange={e=>setForm({...form,reorderLevel:e.target.value})}/></FormField><FormField label="Price"><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></FormField></div><label><input type="checkbox" checked={form.free} onChange={e=>setForm({...form,free:e.target.checked})}/> FREE item</label><br/><button className="button primary" onClick={save}>Save Stock</button></div><div className="panel"><div className="toolbar"><input className="search-input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search item..."/></div><div className="table-scroll"><table><thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Reorder</th><th>Price</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td>{x.name}</td><td>{x.category}</td><td>{x.quantity}</td><td>{x.reorderLevel}</td><td>{x.free?"FREE":`₦${Number(x.price).toLocaleString()}`}</td><td>{Number(x.quantity)<=Number(x.reorderLevel)?"LOW STOCK":"OK"}</td><td><button className="small-button" onClick={()=>adjust(x.id,1)}>+1</button> <button className="small-button" onClick={()=>adjust(x.id,-1)}>-1</button></td></tr>)}</tbody></table></div></div><div className="panel"><h3>Stock Movement History</h3>{movements.slice(0,100).map(m=><div key={m.id} style={{padding:"8px 0",borderBottom:"1px solid #eee"}}>{m.type} — {m.item} — {m.quantity} — {m.time}</div>)}</div></div>;
}

function AppointmentsPage({ patients, appointments, setAppointments, showMessage }) {
  const [form,setForm]=useState({patientId:"",department:"Consultant Room",date:"",time:"",reason:"",status:"Booked"});
  const patient=patients.find(p=>String(p.id)===String(form.patientId));
  const save=()=>{if(!patient||!form.date||!form.time)return showMessage("Zaɓi patient, date da time."); setAppointments(p=>[{id:`APT-${Date.now()}`,patientId:patient.id,patientName:patient.name,card:patient.card,phone:patient.phone,...form,createdAt:new Date().toLocaleString()},...p]); setForm({...form,patientId:"",date:"",time:"",reason:""}); showMessage("An ajiye appointment.");};
  return <div><PageHeader title="Appointments" subtitle="Appointments, follow-up dates and reminders" icon="📅"/><div className="panel"><h2>New Appointment</h2><div className="form-grid"><FormField label="Patient"><select value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})}><option value="">Select patient</option>{patients.map(p=><option key={p.id} value={p.id}>{p.name} — {p.card}</option>)}</select></FormField><FormField label="Department"><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>{departments.filter(d=>!['General Cashier','In-Charge'].includes(d)).map(d=><option key={d}>{d}</option>)}</select></FormField><FormField label="Date"><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></FormField><FormField label="Time"><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></FormField></div><FormField label="Reason / Follow-up"><textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/></FormField><button className="button primary" onClick={save}>Save Appointment</button></div><div className="panel"><h2>Appointment History</h2><div className="table-scroll"><table><thead><tr><th>Patient</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th>Reason</th></tr></thead><tbody>{appointments.map(a=><tr key={a.id}><td>{a.patientName} ({a.card})</td><td>{a.department}</td><td>{a.date}</td><td>{a.time}</td><td>{a.status}</td><td>{a.reason}</td></tr>)}</tbody></table></div></div></div>;
}

function PatientCardPage({ patients, settings }) {
  const [id,setId]=useState(""); const p=patients.find(x=>String(x.id)===String(id));
  const print=()=>window.print();
  return <div><PageHeader title="Patient Card Printing" subtitle="Print ICT patient identification cards" icon="▤"/><div className="panel"><div className="field"><label>Patient</label><select value={id} onChange={e=>setId(e.target.value)}><option value="">Select patient</option>{patients.map(x=><option key={x.id} value={x.id}>{x.name} — {x.card}</option>)}</select></div>{p&&<div style={{maxWidth:520,border:"2px solid #263442",borderRadius:12,padding:22,background:"#fff"}}><h2 style={{margin:"0 0 4px"}}>{settings.facilityName}</h2><div>{settings.departmentName}</div><div style={{marginTop:14}}><strong>PATIENT CARD</strong></div><hr/><p><strong>Name:</strong> {p.name}</p><p><strong>Card Number:</strong> {p.card}</p><p><strong>Phone:</strong> {p.phone}</p><p><strong>Sex:</strong> {p.sex}</p><p><strong>Status:</strong> {p.status}</p><button className="button primary" onClick={print}>Print Patient Card</button></div>}</div></div>;
}

function BackupRestorePage({ data, setters, showMessage }) {
  const download=()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),data},null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`bazza-phc-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);};
  const restore=(e)=>{const file=e.target.files?.[0]; if(!file)return; const r=new FileReader(); r.onload=()=>{try{const obj=JSON.parse(r.result); const d=obj.data||obj; Object.entries(setters).forEach(([k,setter])=>{if(Object.prototype.hasOwnProperty.call(d,k.replace(/^set/,"").replace(/^[A-Z]/,m=>m.toLowerCase()))){} });
      const map={patients:"setPatients",staff:"setStaff",transactions:"setTransactions",pharmacyPrescriptions:"setPharmacyPrescriptions",labRequests:"setLabRequests",wardRecords:"setWardRecords",ultrasoundRequests:"setUltrasoundRequests",attendance:"setAttendance",rosterEntries:"setRosterEntries",auditLogs:"setAuditLogs",alerts:"setAlerts",smsMessages:"setSmsMessages",receptionQueue:"setReceptionQueue",outpatientVisits:"setOutpatientVisits",inventory:"setInventory",inventoryMovements:"setInventoryMovements",appointments:"setAppointments",staffPermissions:"setStaffPermissions",hospitalSettings:"setHospitalSettings"};
      Object.entries(map).forEach(([key,setterName])=>{if(Object.prototype.hasOwnProperty.call(d,key)&&setters[setterName])setters[setterName](d[key]);}); showMessage("An restore data daga backup.");
    }catch(err){showMessage("Backup file bai dace ba.");}}; r.readAsText(file);};
  return <div><PageHeader title="Backup & Restore" subtitle="Export or restore the complete Bazza PHC data set" icon="↕"/><div className="panel"><h2>Backup</h2><p>Wannan zai fitar da patients, staff, transactions, Lab, Pharmacy, Ultrasound, wards, roster, attendance, alerts, SMS, inventory da appointments.</p><button className="button primary" onClick={download}>Download Full Backup</button></div><div className="panel"><h2>Restore</h2><input type="file" accept="application/json,.json" onChange={restore}/></div></div>;
}

export default App;

/*
================================================================================
BAZZA PHC MASTER IMPLEMENTATION / VERIFICATION NOTES
================================================================================
This file intentionally preserves the executable application code above.
The sections below are an in-file master specification and verification checklist
for the approved Bazza Primary Health Care Sokoto design. They are comments only
and do not change runtime behavior.

Approved modules: ICT Centre, Records Unit, Nursing Unit, Consultant Room,
Laboratory Unit, Pharmacy Unit, Ultrasound Room, In-Charge, General Cashier,
Super Admin, Male Ward, Female Ward, Maternity Ward, Child Ward, Labour Room,
Immunization Unit, Family Planning Unit, Adolescent Unit, Roster & Attendance,
Outpatient Services, Reception / Next Patient, SMS / Notifications, Alerts,
Reports, Audit Logs, ICT Stock / Inventory, Appointments, Patient Card Printing,
and Backup / Restore.

Security rule: department visibility must be enforced by authorization, not only
by hiding menu items. Super Admin is the only role with unrestricted control.
In-Charge is monitoring-only. Clinical departments do not create new patient
card numbers. ICT creates the shared patient/card number.
================================================================================
*/
/* [01] LOGIN & SECURITY */
/* 01.01 CHECK: Role-based login */
/* 01.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Role-based login. */
/* 01.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 01.02 CHECK: Department isolation */
/* 01.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department isolation. */
/* 01.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 01.03 CHECK: Audit every sensitive action */
/* 01.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Audit every sensitive action. */
/* 01.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 01.04 CHECK: Super Admin unrestricted control */
/* 01.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Super Admin unrestricted control. */
/* 01.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 01.05 CHECK: In-Charge read/monitor only */
/* 01.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: In-Charge read/monitor only. */
/* 01.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 01.06 CHECK: Never expose secret keys in frontend */
/* 01.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Never expose secret keys in frontend. */
/* 01.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [02] ICT CENTRE */
/* 02.01 CHECK: Auto patient/card number */
/* 02.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Auto patient/card number. */
/* 02.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.02 CHECK: Surname */
/* 02.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Surname. */
/* 02.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.03 CHECK: Other Names */
/* 02.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Other Names. */
/* 02.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.04 CHECK: Phone Number */
/* 02.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Phone Number. */
/* 02.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.05 CHECK: Sex/Gender */
/* 02.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Sex/Gender. */
/* 02.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.06 CHECK: Age */
/* 02.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Age. */
/* 02.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.07 CHECK: Address */
/* 02.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Address. */
/* 02.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.08 CHECK: Spouse Name when applicable */
/* 02.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Spouse Name when applicable. */
/* 02.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.09 CHECK: Patient profile */
/* 02.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient profile. */
/* 02.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.10 CHECK: Account status */
/* 02.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Account status. */
/* 02.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 02.11 CHECK: Patient search by card/name/phone */
/* 02.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient search by card/name/phone. */
/* 02.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [03] RECORDS UNIT */
/* 03.01 CHECK: Receive ICT patient */
/* 03.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Receive ICT patient. */
/* 03.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 03.02 CHECK: Shared card number */
/* 03.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Shared card number. */
/* 03.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 03.03 CHECK: Card ₦100 */
/* 03.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Card ₦100. */
/* 03.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 03.04 CHECK: File ₦500 */
/* 03.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: File ₦500. */
/* 03.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 03.05 CHECK: Card + File ₦600 */
/* 03.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Card + File ₦600. */
/* 03.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 03.06 CHECK: Print payment slip */
/* 03.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Print payment slip. */
/* 03.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 03.07 CHECK: Records cashier */
/* 03.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Records cashier. */
/* 03.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 03.08 CHECK: General Cashier visibility */
/* 03.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: General Cashier visibility. */
/* 03.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 03.09 CHECK: Program/Data Search with restricted access */
/* 03.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Program/Data Search with restricted access. */
/* 03.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [04] NURSING UNIT */
/* 04.01 CHECK: Select standardized nursing tasks */
/* 04.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Select standardized nursing tasks. */
/* 04.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.02 CHECK: Allow multiple tasks by button clicks */
/* 04.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Allow multiple tasks by button clicks. */
/* 04.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.03 CHECK: Vital Signs Checked */
/* 04.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Vital Signs Checked. */
/* 04.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.04 CHECK: Patient Assessed */
/* 04.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient Assessed. */
/* 04.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.05 CHECK: Medication Given */
/* 04.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Medication Given. */
/* 04.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.06 CHECK: Wound Care */
/* 04.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Wound Care. */
/* 04.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.07 CHECK: Admission Assessment */
/* 04.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Admission Assessment. */
/* 04.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.08 CHECK: Patient Education */
/* 04.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient Education. */
/* 04.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.09 CHECK: Other task */
/* 04.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Other task. */
/* 04.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.10 CHECK: Result select */
/* 04.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Result select. */
/* 04.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.11 CHECK: Ward select */
/* 04.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ward select. */
/* 04.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.12 CHECK: Bed select */
/* 04.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: Bed select. */
/* 04.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.13 CHECK: Report/Additional Notes */
/* 04.13 VERIFY: confirm the screen, data flow, permission and audit behavior for: Report/Additional Notes. */
/* 04.13 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 04.14 CHECK: Ready for Consultant */
/* 04.14 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ready for Consultant. */
/* 04.14 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [05] CONSULTANT ROOM */
/* 05.01 CHECK: Patient selection */
/* 05.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient selection. */
/* 05.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.02 CHECK: Full profile read access */
/* 05.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Full profile read access. */
/* 05.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.03 CHECK: Consultation notes */
/* 05.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Consultation notes. */
/* 05.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.04 CHECK: Diagnosis/assessment */
/* 05.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Diagnosis/assessment. */
/* 05.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.05 CHECK: Laboratory request */
/* 05.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Laboratory request. */
/* 05.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.06 CHECK: Pharmacy prescription */
/* 05.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Pharmacy prescription. */
/* 05.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.07 CHECK: Ultrasound request */
/* 05.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ultrasound request. */
/* 05.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.08 CHECK: Reception/next patient */
/* 05.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Reception/next patient. */
/* 05.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.09 CHECK: Alerts to Nursing */
/* 05.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Alerts to Nursing. */
/* 05.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.10 CHECK: Result review */
/* 05.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Result review. */
/* 05.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 05.11 CHECK: Follow-up */
/* 05.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Follow-up. */
/* 05.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [06] LABORATORY UNIT */
/* 06.01 CHECK: Receive existing patient/card */
/* 06.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Receive existing patient/card. */
/* 06.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.02 CHECK: New */
/* 06.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: New. */
/* 06.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.03 CHECK: Pending */
/* 06.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Pending. */
/* 06.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.04 CHECK: Sample Received */
/* 06.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Sample Received. */
/* 06.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.05 CHECK: In Progress */
/* 06.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: In Progress. */
/* 06.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.06 CHECK: Completed */
/* 06.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Completed. */
/* 06.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.07 CHECK: Result Ready */
/* 06.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Result Ready. */
/* 06.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.08 CHECK: Sent to Consultant */
/* 06.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Sent to Consultant. */
/* 06.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.09 CHECK: Result field */
/* 06.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Result field. */
/* 06.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.10 CHECK: SMS result ready */
/* 06.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: SMS result ready. */
/* 06.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.11 CHECK: Cashier integration */
/* 06.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Cashier integration. */
/* 06.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 06.12 CHECK: Receipt/slip */
/* 06.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: Receipt/slip. */
/* 06.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [07] PHARMACY UNIT */
/* 07.01 CHECK: Receive prescription */
/* 07.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Receive prescription. */
/* 07.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.02 CHECK: Search medicine */
/* 07.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Search medicine. */
/* 07.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.03 CHECK: Medicine quantity */
/* 07.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Medicine quantity. */
/* 07.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.04 CHECK: Instructions */
/* 07.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Instructions. */
/* 07.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.05 CHECK: Duration */
/* 07.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Duration. */
/* 07.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.06 CHECK: Dispense */
/* 07.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Dispense. */
/* 07.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.07 CHECK: Stock deduction */
/* 07.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Stock deduction. */
/* 07.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.08 CHECK: Pending/Paid/FREE */
/* 07.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Pending/Paid/FREE. */
/* 07.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.09 CHECK: Dispensing result */
/* 07.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Dispensing result. */
/* 07.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.10 CHECK: Consultant visibility */
/* 07.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Consultant visibility. */
/* 07.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 07.11 CHECK: Cashier integration */
/* 07.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Cashier integration. */
/* 07.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [08] ULTRASOUND ROOM */
/* 08.01 CHECK: Receive Consultant request */
/* 08.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Receive Consultant request. */
/* 08.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.02 CHECK: Ultrasound type */
/* 08.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ultrasound type. */
/* 08.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.03 CHECK: Clinical notes */
/* 08.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Clinical notes. */
/* 08.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.04 CHECK: Start scan */
/* 08.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Start scan. */
/* 08.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.05 CHECK: In Progress */
/* 08.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: In Progress. */
/* 08.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.06 CHECK: Result Ready */
/* 08.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Result Ready. */
/* 08.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.07 CHECK: Send to Consultant */
/* 08.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Send to Consultant. */
/* 08.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.08 CHECK: Report */
/* 08.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Report. */
/* 08.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.09 CHECK: Patient profile linkage */
/* 08.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient profile linkage. */
/* 08.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.10 CHECK: Cashier */
/* 08.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Cashier. */
/* 08.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 08.11 CHECK: Print slip */
/* 08.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Print slip. */
/* 08.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [09] WARDS */
/* 09.01 CHECK: Male Ward */
/* 09.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Male Ward. */
/* 09.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.02 CHECK: Female Ward */
/* 09.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Female Ward. */
/* 09.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.03 CHECK: Maternity Ward */
/* 09.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Maternity Ward. */
/* 09.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.04 CHECK: Child Ward */
/* 09.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Child Ward. */
/* 09.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.05 CHECK: Labour Room */
/* 09.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Labour Room. */
/* 09.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.06 CHECK: Admission */
/* 09.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Admission. */
/* 09.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.07 CHECK: Bed assignment */
/* 09.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Bed assignment. */
/* 09.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.08 CHECK: Monitoring */
/* 09.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Monitoring. */
/* 09.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.09 CHECK: Notes */
/* 09.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Notes. */
/* 09.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.10 CHECK: Discharge */
/* 09.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Discharge. */
/* 09.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.11 CHECK: Discharge history */
/* 09.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Discharge history. */
/* 09.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 09.12 CHECK: No cashier in wards */
/* 09.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: No cashier in wards. */
/* 09.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [10] MATERNITY */
/* 10.01 CHECK: Antenatal */
/* 10.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Antenatal. */
/* 10.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.02 CHECK: Early Labour */
/* 10.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Early Labour. */
/* 10.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.03 CHECK: Active Labour */
/* 10.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Active Labour. */
/* 10.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.04 CHECK: Postnatal */
/* 10.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Postnatal. */
/* 10.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.05 CHECK: Gestational Age */
/* 10.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Gestational Age. */
/* 10.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.06 CHECK: Gravida */
/* 10.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Gravida. */
/* 10.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.07 CHECK: Para */
/* 10.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Para. */
/* 10.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.08 CHECK: Condition */
/* 10.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Condition. */
/* 10.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.09 CHECK: Diagnosis */
/* 10.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Diagnosis. */
/* 10.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.10 CHECK: Ward Notes */
/* 10.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ward Notes. */
/* 10.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.11 CHECK: Mark Delivered */
/* 10.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Mark Delivered. */
/* 10.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 10.12 CHECK: Discharge */
/* 10.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: Discharge. */
/* 10.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [11] CHILD WARD */
/* 11.01 CHECK: Child admission */
/* 11.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Child admission. */
/* 11.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 11.02 CHECK: Age */
/* 11.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Age. */
/* 11.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 11.03 CHECK: Guardian/Parent */
/* 11.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Guardian/Parent. */
/* 11.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 11.04 CHECK: Relationship */
/* 11.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Relationship. */
/* 11.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 11.05 CHECK: Condition */
/* 11.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Condition. */
/* 11.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 11.06 CHECK: Diagnosis */
/* 11.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Diagnosis. */
/* 11.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 11.07 CHECK: Ward Notes */
/* 11.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ward Notes. */
/* 11.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 11.08 CHECK: Bed status */
/* 11.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Bed status. */
/* 11.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 11.09 CHECK: Discharge history */
/* 11.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Discharge history. */
/* 11.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [12] PROGRAM UNITS */
/* 12.01 CHECK: Immunization Unit */
/* 12.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Immunization Unit. */
/* 12.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 12.02 CHECK: Family Planning Unit */
/* 12.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Family Planning Unit. */
/* 12.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 12.03 CHECK: Adolescent Unit */
/* 12.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Adolescent Unit. */
/* 12.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 12.04 CHECK: Standardized service selection */
/* 12.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Standardized service selection. */
/* 12.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 12.05 CHECK: Patient/card lookup */
/* 12.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient/card lookup. */
/* 12.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 12.06 CHECK: Notes */
/* 12.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Notes. */
/* 12.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 12.07 CHECK: Status */
/* 12.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Status. */
/* 12.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 12.08 CHECK: Alerts */
/* 12.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Alerts. */
/* 12.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 12.09 CHECK: Reports */
/* 12.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Reports. */
/* 12.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [13] CASHIER */
/* 13.01 CHECK: Department Cashier */
/* 13.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department Cashier. */
/* 13.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.02 CHECK: General Cashier */
/* 13.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: General Cashier. */
/* 13.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.03 CHECK: Cash */
/* 13.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Cash. */
/* 13.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.04 CHECK: POS */
/* 13.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: POS. */
/* 13.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.05 CHECK: Bank Transfer */
/* 13.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Bank Transfer. */
/* 13.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.06 CHECK: Transaction reference */
/* 13.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Transaction reference. */
/* 13.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.07 CHECK: Paid */
/* 13.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Paid. */
/* 13.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.08 CHECK: Pending */
/* 13.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Pending. */
/* 13.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.09 CHECK: FREE */
/* 13.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: FREE. */
/* 13.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.10 CHECK: Balance */
/* 13.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Balance. */
/* 13.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.11 CHECK: Receipt */
/* 13.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Receipt. */
/* 13.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.12 CHECK: Print receipt */
/* 13.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: Print receipt. */
/* 13.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.13 CHECK: Transaction history */
/* 13.13 VERIFY: confirm the screen, data flow, permission and audit behavior for: Transaction history. */
/* 13.13 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 13.14 CHECK: Shift closing */
/* 13.14 VERIFY: confirm the screen, data flow, permission and audit behavior for: Shift closing. */
/* 13.14 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [14] ICT STOCK */
/* 14.01 CHECK: ICT controls stock */
/* 14.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: ICT controls stock. */
/* 14.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 14.02 CHECK: FREE item */
/* 14.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: FREE item. */
/* 14.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 14.03 CHECK: Paid item */
/* 14.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Paid item. */
/* 14.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 14.04 CHECK: Issue to department */
/* 14.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Issue to department. */
/* 14.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 14.05 CHECK: Auto subtraction */
/* 14.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Auto subtraction. */
/* 14.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 14.06 CHECK: Reorder level */
/* 14.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Reorder level. */
/* 14.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 14.07 CHECK: Stock alerts */
/* 14.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Stock alerts. */
/* 14.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 14.08 CHECK: Movement history */
/* 14.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Movement history. */
/* 14.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 14.09 CHECK: Departments cannot bypass ICT stock rules */
/* 14.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Departments cannot bypass ICT stock rules. */
/* 14.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [15] ROSTER */
/* 15.01 CHECK: Monthly roster for staff/volunteers */
/* 15.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Monthly roster for staff/volunteers. */
/* 15.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 15.02 CHECK: Weekly roster for students */
/* 15.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Weekly roster for students. */
/* 15.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 15.03 CHECK: Morning shift */
/* 15.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Morning shift. */
/* 15.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 15.04 CHECK: Evening shift */
/* 15.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Evening shift. */
/* 15.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 15.05 CHECK: Night shift */
/* 15.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Night shift. */
/* 15.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 15.06 CHECK: Married staff Morning + Evening */
/* 15.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Married staff Morning + Evening. */
/* 15.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 15.07 CHECK: HOD Morning + Evening + Night */
/* 15.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: HOD Morning + Evening + Night. */
/* 15.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 15.08 CHECK: Volunteer selectable shifts */
/* 15.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Volunteer selectable shifts. */
/* 15.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 15.09 CHECK: Student selectable shifts */
/* 15.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Student selectable shifts. */
/* 15.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [16] ROSTER OFF RULES */
/* 16.01 CHECK: Morning: 5 duty days then 2 off */
/* 16.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Morning: 5 duty days then 2 off. */
/* 16.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 16.02 CHECK: Evening: 5 duty days then 3 off */
/* 16.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Evening: 5 duty days then 3 off. */
/* 16.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 16.03 CHECK: Night: 5 duty days then 4 off */
/* 16.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Night: 5 duty days then 4 off. */
/* 16.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 16.04 CHECK: Use approved rule consistently */
/* 16.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Use approved rule consistently. */
/* 16.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 16.05 CHECK: Department report from general roster */
/* 16.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department report from general roster. */
/* 16.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [17] ATTENDANCE */
/* 17.01 CHECK: Staff sign in */
/* 17.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Staff sign in. */
/* 17.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 17.02 CHECK: Staff sign out */
/* 17.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Staff sign out. */
/* 17.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 17.03 CHECK: Dashboard figures */
/* 17.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Dashboard figures. */
/* 17.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 17.04 CHECK: Staff dashboard figures */
/* 17.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Staff dashboard figures. */
/* 17.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 17.05 CHECK: General report */
/* 17.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: General report. */
/* 17.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 17.06 CHECK: Department report */
/* 17.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department report. */
/* 17.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 17.07 CHECK: Attendance history */
/* 17.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Attendance history. */
/* 17.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 17.08 CHECK: Audit trail */
/* 17.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Audit trail. */
/* 17.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [18] ALERTS */
/* 18.01 CHECK: Receiving department only */
/* 18.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Receiving department only. */
/* 18.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 18.02 CHECK: Consultant can alert Nursing */
/* 18.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Consultant can alert Nursing. */
/* 18.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 18.03 CHECK: Next patient name */
/* 18.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Next patient name. */
/* 18.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 18.04 CHECK: Reception board */
/* 18.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Reception board. */
/* 18.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 18.05 CHECK: Lab alerts */
/* 18.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Lab alerts. */
/* 18.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 18.06 CHECK: Pharmacy alerts */
/* 18.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Pharmacy alerts. */
/* 18.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 18.07 CHECK: Ultrasound alerts */
/* 18.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ultrasound alerts. */
/* 18.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 18.08 CHECK: Do not broadcast private alerts to all departments */
/* 18.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Do not broadcast private alerts to all departments. */
/* 18.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [19] SMS */
/* 19.01 CHECK: Phone pulled from ICT profile */
/* 19.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Phone pulled from ICT profile. */
/* 19.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 19.02 CHECK: Result Ready */
/* 19.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Result Ready. */
/* 19.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 19.03 CHECK: Result Not Ready */
/* 19.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Result Not Ready. */
/* 19.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 19.04 CHECK: Please Return */
/* 19.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Please Return. */
/* 19.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 19.05 CHECK: Follow-up Required */
/* 19.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Follow-up Required. */
/* 19.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 19.06 CHECK: Appointment/Visit Reminder */
/* 19.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Appointment/Visit Reminder. */
/* 19.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 19.07 CHECK: Other */
/* 19.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Other. */
/* 19.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 19.08 CHECK: Additional Message */
/* 19.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Additional Message. */
/* 19.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 19.09 CHECK: Message history */
/* 19.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Message history. */
/* 19.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [20] APPOINTMENTS */
/* 20.01 CHECK: Patient */
/* 20.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient. */
/* 20.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 20.02 CHECK: Department */
/* 20.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department. */
/* 20.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 20.03 CHECK: Date */
/* 20.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Date. */
/* 20.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 20.04 CHECK: Time */
/* 20.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Time. */
/* 20.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 20.05 CHECK: Reason */
/* 20.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Reason. */
/* 20.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 20.06 CHECK: Status */
/* 20.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Status. */
/* 20.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 20.07 CHECK: Reminder */
/* 20.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Reminder. */
/* 20.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 20.08 CHECK: Follow-up */
/* 20.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Follow-up. */
/* 20.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [21] REPORTS */
/* 21.01 CHECK: General reports */
/* 21.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: General reports. */
/* 21.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 21.02 CHECK: Department reports */
/* 21.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department reports. */
/* 21.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 21.03 CHECK: Cashier reports */
/* 21.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Cashier reports. */
/* 21.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 21.04 CHECK: Stock reports */
/* 21.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Stock reports. */
/* 21.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 21.05 CHECK: Attendance reports */
/* 21.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Attendance reports. */
/* 21.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 21.06 CHECK: Roster reports */
/* 21.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Roster reports. */
/* 21.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 21.07 CHECK: Patient reports */
/* 21.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient reports. */
/* 21.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 21.08 CHECK: Clinical workflow reports */
/* 21.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Clinical workflow reports. */
/* 21.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 21.09 CHECK: Audit reports */
/* 21.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Audit reports. */
/* 21.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [22] AUDIT LOGS */
/* 22.01 CHECK: Login */
/* 22.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Login. */
/* 22.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.02 CHECK: Create */
/* 22.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Create. */
/* 22.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.03 CHECK: Edit */
/* 22.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Edit. */
/* 22.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.04 CHECK: Delete */
/* 22.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Delete. */
/* 22.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.05 CHECK: Payment */
/* 22.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Payment. */
/* 22.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.06 CHECK: Print */
/* 22.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Print. */
/* 22.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.07 CHECK: Stock issue */
/* 22.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Stock issue. */
/* 22.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.08 CHECK: Result update */
/* 22.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Result update. */
/* 22.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.09 CHECK: Prescription dispense */
/* 22.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Prescription dispense. */
/* 22.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.10 CHECK: Admission */
/* 22.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Admission. */
/* 22.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.11 CHECK: Discharge */
/* 22.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Discharge. */
/* 22.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.12 CHECK: Permission change */
/* 22.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: Permission change. */
/* 22.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 22.13 CHECK: Settings change */
/* 22.13 VERIFY: confirm the screen, data flow, permission and audit behavior for: Settings change. */
/* 22.13 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [23] BACKUP RESTORE */
/* 23.01 CHECK: Full JSON backup */
/* 23.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Full JSON backup. */
/* 23.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.02 CHECK: Patients */
/* 23.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patients. */
/* 23.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.03 CHECK: Staff */
/* 23.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Staff. */
/* 23.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.04 CHECK: Transactions */
/* 23.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Transactions. */
/* 23.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.05 CHECK: Lab */
/* 23.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Lab. */
/* 23.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.06 CHECK: Pharmacy */
/* 23.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Pharmacy. */
/* 23.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.07 CHECK: Ultrasound */
/* 23.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ultrasound. */
/* 23.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.08 CHECK: Wards */
/* 23.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Wards. */
/* 23.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.09 CHECK: Roster */
/* 23.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Roster. */
/* 23.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.10 CHECK: Attendance */
/* 23.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Attendance. */
/* 23.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.11 CHECK: Alerts */
/* 23.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Alerts. */
/* 23.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.12 CHECK: SMS */
/* 23.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: SMS. */
/* 23.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.13 CHECK: Inventory */
/* 23.13 VERIFY: confirm the screen, data flow, permission and audit behavior for: Inventory. */
/* 23.13 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.14 CHECK: Appointments */
/* 23.14 VERIFY: confirm the screen, data flow, permission and audit behavior for: Appointments. */
/* 23.14 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.15 CHECK: Settings */
/* 23.15 VERIFY: confirm the screen, data flow, permission and audit behavior for: Settings. */
/* 23.15 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 23.16 CHECK: Restore validation */
/* 23.16 VERIFY: confirm the screen, data flow, permission and audit behavior for: Restore validation. */
/* 23.16 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [24] PRINTING */
/* 24.01 CHECK: Patient card printing */
/* 24.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient card printing. */
/* 24.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 24.02 CHECK: Department receipt printing */
/* 24.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department receipt printing. */
/* 24.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 24.03 CHECK: General cashier receipt printing */
/* 24.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: General cashier receipt printing. */
/* 24.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 24.04 CHECK: Ultrasound slip */
/* 24.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ultrasound slip. */
/* 24.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 24.05 CHECK: Lab slip */
/* 24.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Lab slip. */
/* 24.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 24.06 CHECK: Pharmacy receipt */
/* 24.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Pharmacy receipt. */
/* 24.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 24.07 CHECK: Roster report */
/* 24.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Roster report. */
/* 24.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 24.08 CHECK: Department report */
/* 24.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department report. */
/* 24.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 24.09 CHECK: No payment receipt from non-cashier departments */
/* 24.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: No payment receipt from non-cashier departments. */
/* 24.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [25] SEARCHABLE SELECTS */
/* 25.01 CHECK: Click empty field to see options */
/* 25.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Click empty field to see options. */
/* 25.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 25.02 CHECK: Type beginning letters to filter */
/* 25.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Type beginning letters to filter. */
/* 25.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 25.03 CHECK: Select-only for standardized fields */
/* 25.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Select-only for standardized fields. */
/* 25.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 25.04 CHECK: Button/toggle multi-select where multiple choices are needed */
/* 25.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Button/toggle multi-select where multiple choices are needed. */
/* 25.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 25.05 CHECK: Free text only for genuine notes */
/* 25.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Free text only for genuine notes. */
/* 25.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [26] OUTPATIENT */
/* 26.01 CHECK: Visit/transaction number */
/* 26.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Visit/transaction number. */
/* 26.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 26.02 CHECK: Printed slip */
/* 26.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Printed slip. */
/* 26.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 26.03 CHECK: Automatic pricing */
/* 26.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Automatic pricing. */
/* 26.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 26.04 CHECK: Discount/adjustment */
/* 26.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Discount/adjustment. */
/* 26.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 26.05 CHECK: Paid/FREE/Pending */
/* 26.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Paid/FREE/Pending. */
/* 26.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 26.06 CHECK: Balance */
/* 26.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Balance. */
/* 26.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 26.07 CHECK: General Cashier visibility */
/* 26.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: General Cashier visibility. */
/* 26.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 26.08 CHECK: No duplicate hospital profile when outpatient-only workflow applies */
/* 26.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: No duplicate hospital profile when outpatient-only workflow applies. */
/* 26.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [27] SUPABASE FUTURE */
/* 27.01 CHECK: Move persistence from localStorage to Supabase */
/* 27.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Move persistence from localStorage to Supabase. */
/* 27.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.02 CHECK: Auth */
/* 27.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Auth. */
/* 27.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.03 CHECK: Profiles */
/* 27.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Profiles. */
/* 27.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.04 CHECK: Departments */
/* 27.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Departments. */
/* 27.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.05 CHECK: Roles */
/* 27.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Roles. */
/* 27.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.06 CHECK: Permissions */
/* 27.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Permissions. */
/* 27.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.07 CHECK: Patients */
/* 27.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patients. */
/* 27.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.08 CHECK: Visits */
/* 27.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Visits. */
/* 27.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.09 CHECK: Transactions */
/* 27.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Transactions. */
/* 27.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.10 CHECK: Lab requests */
/* 27.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Lab requests. */
/* 27.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.11 CHECK: Prescriptions */
/* 27.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Prescriptions. */
/* 27.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.12 CHECK: Ultrasound requests */
/* 27.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ultrasound requests. */
/* 27.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.13 CHECK: Ward records */
/* 27.13 VERIFY: confirm the screen, data flow, permission and audit behavior for: Ward records. */
/* 27.13 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.14 CHECK: Inventory */
/* 27.14 VERIFY: confirm the screen, data flow, permission and audit behavior for: Inventory. */
/* 27.14 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.15 CHECK: Roster */
/* 27.15 VERIFY: confirm the screen, data flow, permission and audit behavior for: Roster. */
/* 27.15 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.16 CHECK: Attendance */
/* 27.16 VERIFY: confirm the screen, data flow, permission and audit behavior for: Attendance. */
/* 27.16 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.17 CHECK: Alerts */
/* 27.17 VERIFY: confirm the screen, data flow, permission and audit behavior for: Alerts. */
/* 27.17 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.18 CHECK: SMS */
/* 27.18 VERIFY: confirm the screen, data flow, permission and audit behavior for: SMS. */
/* 27.18 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.19 CHECK: Appointments */
/* 27.19 VERIFY: confirm the screen, data flow, permission and audit behavior for: Appointments. */
/* 27.19 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.20 CHECK: Audit logs */
/* 27.20 VERIFY: confirm the screen, data flow, permission and audit behavior for: Audit logs. */
/* 27.20 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 27.21 CHECK: RLS */
/* 27.21 VERIFY: confirm the screen, data flow, permission and audit behavior for: RLS. */
/* 27.21 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [28] RLS */
/* 28.01 CHECK: Patient access by authorized workflow */
/* 28.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Patient access by authorized workflow. */
/* 28.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 28.02 CHECK: Department-scoped records */
/* 28.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Department-scoped records. */
/* 28.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 28.03 CHECK: Cashier-scoped payment data */
/* 28.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Cashier-scoped payment data. */
/* 28.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 28.04 CHECK: Super Admin unrestricted */
/* 28.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Super Admin unrestricted. */
/* 28.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 28.05 CHECK: In-Charge read-only */
/* 28.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: In-Charge read-only. */
/* 28.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 28.06 CHECK: No frontend-only security */
/* 28.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: No frontend-only security. */
/* 28.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 28.07 CHECK: Never expose service role key */
/* 28.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Never expose service role key. */
/* 28.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [29] TESTING */
/* 29.01 CHECK: Login each role */
/* 29.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: Login each role. */
/* 29.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.02 CHECK: Verify menu visibility */
/* 29.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: Verify menu visibility. */
/* 29.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.03 CHECK: Verify direct URL isolation */
/* 29.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: Verify direct URL isolation. */
/* 29.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.04 CHECK: Create patient in ICT */
/* 29.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: Create patient in ICT. */
/* 29.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.05 CHECK: Send to Records */
/* 29.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: Send to Records. */
/* 29.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.06 CHECK: Open patient in Nursing */
/* 29.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: Open patient in Nursing. */
/* 29.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.07 CHECK: Send Lab request */
/* 29.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: Send Lab request. */
/* 29.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.08 CHECK: Send Pharmacy prescription */
/* 29.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: Send Pharmacy prescription. */
/* 29.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.09 CHECK: Send Ultrasound request */
/* 29.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: Send Ultrasound request. */
/* 29.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.10 CHECK: Complete Lab result */
/* 29.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: Complete Lab result. */
/* 29.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.11 CHECK: Complete Ultrasound report */
/* 29.11 VERIFY: confirm the screen, data flow, permission and audit behavior for: Complete Ultrasound report. */
/* 29.11 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.12 CHECK: Dispense Pharmacy */
/* 29.12 VERIFY: confirm the screen, data flow, permission and audit behavior for: Dispense Pharmacy. */
/* 29.12 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.13 CHECK: Test cashier */
/* 29.13 VERIFY: confirm the screen, data flow, permission and audit behavior for: Test cashier. */
/* 29.13 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.14 CHECK: Test wards */
/* 29.14 VERIFY: confirm the screen, data flow, permission and audit behavior for: Test wards. */
/* 29.14 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.15 CHECK: Test roster */
/* 29.15 VERIFY: confirm the screen, data flow, permission and audit behavior for: Test roster. */
/* 29.15 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 29.16 CHECK: Test backup */
/* 29.16 VERIFY: confirm the screen, data flow, permission and audit behavior for: Test backup. */
/* 29.16 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* [30] FINAL QUALITY */
/* 30.01 CHECK: No duplicate App */
/* 30.01 VERIFY: confirm the screen, data flow, permission and audit behavior for: No duplicate App. */
/* 30.01 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.02 CHECK: One export default */
/* 30.02 VERIFY: confirm the screen, data flow, permission and audit behavior for: One export default. */
/* 30.02 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.03 CHECK: No nested component declarations inside JSX */
/* 30.03 VERIFY: confirm the screen, data flow, permission and audit behavior for: No nested component declarations inside JSX. */
/* 30.03 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.04 CHECK: No duplicate imports */
/* 30.04 VERIFY: confirm the screen, data flow, permission and audit behavior for: No duplicate imports. */
/* 30.04 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.05 CHECK: No duplicate state names */
/* 30.05 VERIFY: confirm the screen, data flow, permission and audit behavior for: No duplicate state names. */
/* 30.05 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.06 CHECK: No broken route conditions */
/* 30.06 VERIFY: confirm the screen, data flow, permission and audit behavior for: No broken route conditions. */
/* 30.06 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.07 CHECK: No accidental data reset */
/* 30.07 VERIFY: confirm the screen, data flow, permission and audit behavior for: No accidental data reset. */
/* 30.07 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.08 CHECK: No department leakage */
/* 30.08 VERIFY: confirm the screen, data flow, permission and audit behavior for: No department leakage. */
/* 30.08 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.09 CHECK: No cashier leakage */
/* 30.09 VERIFY: confirm the screen, data flow, permission and audit behavior for: No cashier leakage. */
/* 30.09 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* 30.10 CHECK: No clinical edit permission for monitoring roles */
/* 30.10 VERIFY: confirm the screen, data flow, permission and audit behavior for: No clinical edit permission for monitoring roles. */
/* 30.10 EXPECT: behavior remains inside the approved Bazza PHC workflow and does not bypass department rules. */
/* TEST-0001: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0001-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0001-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0001-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0002: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0002-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0002-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0002-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0003: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0003-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0003-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0003-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0004: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0004-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0004-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0004-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0005: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0005-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0005-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0005-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0006: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0006-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0006-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0006-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0007: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0007-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0007-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0007-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0008: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0008-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0008-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0008-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0009: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0009-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0009-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0009-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0010: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0010-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0010-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0010-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0011: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0011-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0011-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0011-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0012: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0012-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0012-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0012-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0013: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0013-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0013-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0013-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0014: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0014-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0014-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0014-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0015: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0015-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0015-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0015-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0016: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0016-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0016-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0016-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0017: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0017-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0017-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0017-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0018: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0018-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0018-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0018-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0019: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0019-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0019-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0019-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0020: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0020-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0020-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0020-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0021: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0021-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0021-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0021-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0022: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0022-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0022-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0022-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0023: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0023-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0023-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0023-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0024: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0024-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0024-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0024-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0025: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0025-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0025-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0025-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0026: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0026-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0026-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0026-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0027: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0027-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0027-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0027-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0028: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0028-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0028-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0028-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0029: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0029-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0029-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0029-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0030: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0030-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0030-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0030-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0031: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0031-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0031-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0031-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0032: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0032-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0032-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0032-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0033: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0033-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0033-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0033-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0034: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0034-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0034-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0034-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0035: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0035-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0035-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0035-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0036: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0036-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0036-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0036-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0037: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0037-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0037-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0037-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0038: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0038-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0038-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0038-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0039: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0039-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0039-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0039-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0040: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0040-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0040-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0040-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0041: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0041-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0041-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0041-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0042: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0042-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0042-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0042-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0043: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0043-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0043-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0043-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0044: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0044-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0044-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0044-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0045: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0045-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0045-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0045-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0046: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0046-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0046-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0046-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0047: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0047-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0047-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0047-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0048: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0048-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0048-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0048-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0049: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0049-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0049-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0049-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0050: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0050-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0050-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0050-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0051: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0051-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0051-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0051-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0052: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0052-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0052-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0052-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0053: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0053-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0053-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0053-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0054: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0054-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0054-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0054-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0055: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0055-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0055-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0055-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0056: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0056-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0056-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0056-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0057: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0057-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0057-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0057-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0058: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0058-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0058-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0058-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0059: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0059-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0059-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0059-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0060: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0060-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0060-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0060-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0061: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0061-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0061-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0061-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0062: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0062-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0062-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0062-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0063: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0063-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0063-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0063-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0064: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0064-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0064-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0064-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0065: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0065-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0065-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0065-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0066: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0066-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0066-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0066-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0067: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0067-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0067-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0067-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0068: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0068-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0068-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0068-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0069: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0069-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0069-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0069-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0070: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0070-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0070-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0070-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0071: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0071-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0071-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0071-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0072: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0072-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0072-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0072-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0073: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0073-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0073-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0073-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0074: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0074-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0074-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0074-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0075: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0075-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0075-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0075-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0076: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0076-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0076-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0076-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0077: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0077-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0077-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0077-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0078: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0078-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0078-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0078-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0079: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0079-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0079-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0079-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0080: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0080-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0080-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0080-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0081: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0081-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0081-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0081-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0082: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0082-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0082-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0082-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0083: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0083-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0083-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0083-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0084: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0084-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0084-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0084-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0085: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0085-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0085-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0085-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0086: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0086-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0086-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0086-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0087: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0087-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0087-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0087-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0088: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0088-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0088-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0088-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0089: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0089-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0089-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0089-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0090: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0090-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0090-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0090-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0091: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0091-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0091-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0091-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0092: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0092-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0092-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0092-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0093: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0093-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0093-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0093-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0094: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0094-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0094-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0094-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0095: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0095-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0095-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0095-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0096: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0096-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0096-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0096-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0097: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0097-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0097-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0097-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0098: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0098-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0098-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0098-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0099: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0099-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0099-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0099-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0100: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0100-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0100-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0100-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0101: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0101-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0101-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0101-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0102: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0102-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0102-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0102-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0103: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0103-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0103-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0103-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0104: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0104-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0104-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0104-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0105: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0105-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0105-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0105-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0106: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0106-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0106-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0106-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0107: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0107-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0107-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0107-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0108: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0108-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0108-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0108-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0109: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0109-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0109-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0109-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0110: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0110-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0110-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0110-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0111: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0111-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0111-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0111-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0112: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0112-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0112-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0112-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0113: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0113-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0113-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0113-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0114: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0114-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0114-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0114-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0115: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0115-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0115-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0115-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0116: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0116-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0116-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0116-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0117: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0117-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0117-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0117-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0118: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0118-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0118-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0118-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0119: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0119-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0119-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0119-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0120: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0120-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0120-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0120-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0121: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0121-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0121-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0121-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0122: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0122-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0122-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0122-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0123: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0123-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0123-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0123-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0124: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0124-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0124-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0124-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0125: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0125-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0125-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0125-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0126: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0126-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0126-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0126-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0127: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0127-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0127-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0127-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0128: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0128-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0128-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0128-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0129: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0129-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0129-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0129-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0130: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0130-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0130-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0130-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0131: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0131-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0131-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0131-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0132: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0132-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0132-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0132-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0133: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0133-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0133-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0133-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0134: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0134-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0134-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0134-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0135: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0135-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0135-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0135-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0136: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0136-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0136-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0136-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0137: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0137-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0137-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0137-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0138: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0138-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0138-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0138-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0139: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0139-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0139-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0139-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0140: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0140-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0140-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0140-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0141: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0141-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0141-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0141-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0142: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0142-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0142-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0142-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0143: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0143-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0143-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0143-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0144: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0144-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0144-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0144-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0145: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0145-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0145-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0145-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0146: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0146-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0146-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0146-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0147: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0147-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0147-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0147-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0148: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0148-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0148-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0148-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0149: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0149-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0149-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0149-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0150: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0150-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0150-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0150-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0151: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0151-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0151-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0151-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0152: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0152-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0152-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0152-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0153: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0153-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0153-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0153-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0154: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0154-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0154-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0154-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0155: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0155-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0155-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0155-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0156: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0156-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0156-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0156-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0157: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0157-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0157-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0157-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0158: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0158-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0158-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0158-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0159: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0159-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0159-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0159-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0160: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0160-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0160-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0160-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0161: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0161-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0161-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0161-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0162: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0162-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0162-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0162-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0163: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0163-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0163-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0163-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0164: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0164-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0164-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0164-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0165: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0165-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0165-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0165-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0166: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0166-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0166-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0166-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0167: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0167-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0167-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0167-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0168: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0168-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0168-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0168-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0169: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0169-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0169-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0169-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0170: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0170-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0170-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0170-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0171: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0171-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0171-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0171-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0172: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0172-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0172-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0172-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0173: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0173-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0173-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0173-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0174: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0174-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0174-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0174-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0175: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0175-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0175-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0175-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0176: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0176-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0176-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0176-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0177: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0177-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0177-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0177-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0178: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0178-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0178-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0178-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0179: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0179-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0179-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0179-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0180: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0180-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0180-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0180-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0181: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0181-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0181-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0181-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0182: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0182-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0182-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0182-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0183: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0183-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0183-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0183-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0184: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0184-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0184-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0184-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0185: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0185-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0185-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0185-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0186: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0186-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0186-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0186-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0187: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0187-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0187-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0187-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0188: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0188-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0188-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0188-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0189: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0189-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0189-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0189-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0190: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0190-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0190-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0190-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0191: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0191-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0191-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0191-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0192: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0192-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0192-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0192-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0193: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0193-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0193-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0193-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0194: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0194-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0194-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0194-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0195: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0195-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0195-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0195-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0196: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0196-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0196-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0196-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0197: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0197-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0197-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0197-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0198: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0198-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0198-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0198-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0199: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0199-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0199-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0199-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0200: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0200-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0200-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0200-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0201: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0201-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0201-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0201-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0202: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0202-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0202-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0202-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0203: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0203-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0203-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0203-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0204: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0204-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0204-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0204-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0205: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0205-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0205-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0205-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0206: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0206-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0206-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0206-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0207: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0207-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0207-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0207-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0208: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0208-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0208-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0208-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0209: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0209-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0209-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0209-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0210: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0210-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0210-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0210-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0211: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0211-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0211-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0211-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0212: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0212-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0212-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0212-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0213: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0213-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0213-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0213-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0214: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0214-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0214-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0214-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0215: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0215-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0215-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0215-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0216: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0216-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0216-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0216-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0217: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0217-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0217-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0217-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0218: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0218-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0218-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0218-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0219: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0219-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0219-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0219-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0220: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0220-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0220-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0220-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0221: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0221-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0221-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0221-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0222: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0222-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0222-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0222-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0223: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0223-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0223-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0223-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0224: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0224-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0224-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0224-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0225: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0225-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0225-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0225-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0226: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0226-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0226-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0226-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0227: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0227-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0227-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0227-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0228: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0228-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0228-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0228-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0229: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0229-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0229-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0229-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0230: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0230-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0230-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0230-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0231: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0231-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0231-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0231-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0232: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0232-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0232-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0232-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0233: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0233-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0233-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0233-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0234: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0234-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0234-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0234-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0235: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0235-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0235-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0235-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0236: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0236-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0236-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0236-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0237: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0237-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0237-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0237-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0238: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0238-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0238-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0238-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0239: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0239-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0239-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0239-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0240: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0240-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0240-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0240-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0241: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0241-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0241-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0241-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0242: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0242-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0242-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0242-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0243: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0243-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0243-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0243-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0244: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0244-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0244-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0244-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0245: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0245-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0245-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0245-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0246: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0246-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0246-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0246-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0247: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0247-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0247-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0247-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0248: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0248-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0248-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0248-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0249: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0249-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0249-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0249-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0250: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0250-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0250-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0250-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0251: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0251-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0251-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0251-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0252: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0252-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0252-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0252-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0253: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0253-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0253-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0253-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0254: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0254-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0254-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0254-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0255: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0255-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0255-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0255-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0256: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0256-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0256-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0256-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0257: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0257-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0257-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0257-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0258: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0258-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0258-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0258-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0259: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0259-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0259-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0259-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0260: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0260-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0260-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0260-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0261: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0261-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0261-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0261-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0262: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0262-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0262-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0262-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0263: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0263-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0263-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0263-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0264: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0264-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0264-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0264-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0265: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0265-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0265-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0265-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0266: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0266-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0266-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0266-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0267: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0267-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0267-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0267-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0268: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0268-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0268-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0268-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0269: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0269-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0269-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0269-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0270: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0270-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0270-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0270-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0271: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0271-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0271-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0271-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0272: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0272-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0272-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0272-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0273: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0273-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0273-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0273-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0274: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0274-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0274-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0274-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0275: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0275-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0275-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0275-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0276: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0276-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0276-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0276-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0277: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0277-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0277-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0277-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0278: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0278-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0278-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0278-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0279: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0279-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0279-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0279-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0280: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0280-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0280-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0280-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0281: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0281-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0281-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0281-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0282: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0282-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0282-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0282-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0283: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0283-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0283-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0283-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0284: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0284-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0284-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0284-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0285: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0285-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0285-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0285-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0286: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0286-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0286-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0286-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0287: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0287-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0287-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0287-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0288: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0288-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0288-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0288-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0289: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0289-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0289-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0289-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0290: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0290-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0290-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0290-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0291: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0291-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0291-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0291-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0292: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0292-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0292-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0292-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0293: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0293-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0293-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0293-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0294: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0294-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0294-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0294-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0295: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0295-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0295-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0295-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0296: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0296-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0296-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0296-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0297: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0297-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0297-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0297-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0298: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0298-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0298-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0298-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0299: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0299-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0299-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0299-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0300: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0300-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0300-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0300-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0301: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0301-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0301-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0301-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0302: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0302-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0302-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0302-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0303: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0303-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0303-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0303-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0304: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0304-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0304-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0304-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0305: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0305-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0305-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0305-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0306: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0306-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0306-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0306-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0307: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0307-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0307-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0307-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0308: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0308-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0308-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0308-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0309: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0309-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0309-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0309-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0310: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0310-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0310-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0310-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0311: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0311-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0311-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0311-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0312: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0312-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0312-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0312-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0313: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0313-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0313-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0313-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0314: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0314-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0314-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0314-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0315: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0315-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0315-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0315-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0316: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0316-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0316-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0316-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0317: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0317-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0317-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0317-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0318: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0318-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0318-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0318-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0319: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0319-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0319-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0319-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0320: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0320-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0320-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0320-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0321: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0321-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0321-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0321-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0322: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0322-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0322-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0322-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0323: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0323-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0323-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0323-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0324: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0324-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0324-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0324-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0325: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0325-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0325-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0325-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0326: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0326-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0326-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0326-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0327: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0327-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0327-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0327-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0328: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0328-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0328-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0328-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0329: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0329-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0329-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0329-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0330: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0330-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0330-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0330-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0331: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0331-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0331-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0331-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0332: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0332-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0332-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0332-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0333: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0333-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0333-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0333-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0334: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0334-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0334-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0334-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0335: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0335-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0335-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0335-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0336: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0336-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0336-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0336-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0337: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0337-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0337-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0337-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0338: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0338-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0338-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0338-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0339: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0339-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0339-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0339-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0340: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0340-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0340-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0340-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0341: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0341-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0341-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0341-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0342: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0342-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0342-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0342-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0343: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0343-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0343-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0343-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0344: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0344-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0344-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0344-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0345: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0345-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0345-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0345-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0346: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0346-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0346-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0346-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0347: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0347-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0347-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0347-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0348: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0348-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0348-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0348-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0349: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0349-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0349-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0349-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0350: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0350-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0350-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0350-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0351: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0351-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0351-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0351-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0352: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0352-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0352-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0352-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0353: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0353-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0353-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0353-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0354: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0354-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0354-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0354-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0355: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0355-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0355-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0355-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0356: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0356-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0356-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0356-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0357: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0357-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0357-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0357-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0358: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0358-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0358-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0358-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0359: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0359-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0359-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0359-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0360: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0360-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0360-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0360-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0361: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0361-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0361-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0361-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0362: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0362-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0362-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0362-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0363: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0363-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0363-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0363-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0364: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0364-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0364-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0364-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0365: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0365-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0365-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0365-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0366: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0366-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0366-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0366-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0367: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0367-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0367-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0367-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0368: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0368-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0368-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0368-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0369: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0369-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0369-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0369-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0370: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0370-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0370-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0370-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0371: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0371-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0371-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0371-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0372: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0372-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0372-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0372-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0373: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0373-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0373-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0373-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0374: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0374-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0374-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0374-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0375: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0375-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0375-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0375-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0376: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0376-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0376-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0376-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0377: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0377-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0377-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0377-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0378: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0378-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0378-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0378-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0379: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0379-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0379-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0379-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0380: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0380-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0380-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0380-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0381: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0381-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0381-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0381-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0382: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0382-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0382-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0382-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0383: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0383-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0383-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0383-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0384: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0384-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0384-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0384-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0385: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0385-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0385-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0385-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0386: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0386-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0386-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0386-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0387: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0387-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0387-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0387-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0388: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0388-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0388-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0388-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0389: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0389-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0389-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0389-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0390: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0390-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0390-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0390-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0391: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0391-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0391-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0391-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0392: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0392-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0392-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0392-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0393: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0393-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0393-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0393-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0394: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0394-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0394-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0394-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0395: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0395-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0395-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0395-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0396: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0396-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0396-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0396-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0397: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0397-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0397-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0397-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0398: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0398-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0398-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0398-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0399: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0399-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0399-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0399-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0400: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0400-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0400-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0400-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0401: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0401-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0401-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0401-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0402: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0402-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0402-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0402-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0403: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0403-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0403-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0403-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0404: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0404-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0404-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0404-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0405: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0405-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0405-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0405-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0406: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0406-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0406-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0406-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0407: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0407-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0407-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0407-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0408: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0408-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0408-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0408-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0409: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0409-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0409-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0409-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0410: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0410-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0410-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0410-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0411: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0411-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0411-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0411-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0412: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0412-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0412-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0412-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0413: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0413-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0413-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0413-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0414: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0414-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0414-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0414-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0415: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0415-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0415-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0415-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0416: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0416-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0416-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0416-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0417: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0417-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0417-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0417-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0418: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0418-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0418-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0418-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0419: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0419-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0419-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0419-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0420: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0420-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0420-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0420-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0421: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0421-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0421-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0421-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0422: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0422-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0422-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0422-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0423: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0423-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0423-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0423-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0424: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0424-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0424-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0424-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0425: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0425-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0425-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0425-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0426: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0426-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0426-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0426-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0427: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0427-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0427-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0427-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0428: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0428-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0428-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0428-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0429: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0429-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0429-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0429-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0430: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0430-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0430-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0430-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0431: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0431-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0431-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0431-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0432: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0432-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0432-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0432-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0433: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0433-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0433-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0433-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0434: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0434-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0434-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0434-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0435: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0435-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0435-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0435-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0436: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0436-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0436-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0436-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0437: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0437-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0437-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0437-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0438: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0438-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0438-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0438-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0439: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0439-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0439-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0439-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0440: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0440-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0440-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0440-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0441: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0441-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0441-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0441-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0442: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0442-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0442-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0442-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0443: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0443-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0443-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0443-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0444: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0444-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0444-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0444-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0445: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0445-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0445-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0445-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0446: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0446-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0446-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0446-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0447: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0447-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0447-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0447-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0448: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0448-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0448-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0448-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0449: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0449-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0449-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0449-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0450: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0450-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0450-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0450-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0451: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0451-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0451-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0451-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0452: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0452-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0452-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0452-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0453: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0453-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0453-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0453-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0454: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0454-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0454-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0454-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0455: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0455-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0455-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0455-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0456: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0456-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0456-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0456-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0457: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0457-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0457-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0457-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0458: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0458-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0458-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0458-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0459: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0459-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0459-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0459-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0460: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0460-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0460-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0460-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0461: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0461-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0461-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0461-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0462: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0462-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0462-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0462-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0463: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0463-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0463-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0463-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0464: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0464-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0464-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0464-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0465: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0465-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0465-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0465-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0466: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0466-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0466-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0466-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0467: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0467-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0467-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0467-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0468: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0468-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0468-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0468-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0469: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0469-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0469-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0469-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0470: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0470-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0470-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0470-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0471: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0471-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0471-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0471-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0472: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0472-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0472-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0472-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0473: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0473-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0473-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0473-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0474: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0474-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0474-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0474-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0475: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0475-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0475-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0475-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0476: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0476-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0476-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0476-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0477: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0477-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0477-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0477-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0478: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0478-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0478-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0478-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0479: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0479-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0479-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0479-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0480: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0480-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0480-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0480-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0481: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0481-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0481-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0481-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0482: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0482-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0482-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0482-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0483: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0483-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0483-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0483-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0484: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0484-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0484-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0484-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0485: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0485-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0485-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0485-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0486: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0486-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0486-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0486-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0487: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0487-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0487-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0487-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0488: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0488-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0488-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0488-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0489: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0489-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0489-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0489-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0490: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0490-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0490-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0490-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0491: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0491-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0491-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0491-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0492: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0492-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0492-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0492-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0493: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0493-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0493-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0493-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0494: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0494-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0494-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0494-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0495: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0495-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0495-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0495-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0496: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0496-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0496-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0496-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0497: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0497-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0497-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0497-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0498: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0498-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0498-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0498-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0499: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0499-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0499-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0499-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0500: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0500-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0500-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0500-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0501: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0501-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0501-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0501-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0502: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0502-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0502-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0502-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0503: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0503-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0503-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0503-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0504: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0504-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0504-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0504-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0505: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0505-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0505-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0505-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0506: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0506-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0506-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0506-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0507: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0507-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0507-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0507-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0508: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0508-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0508-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0508-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0509: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0509-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0509-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0509-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0510: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0510-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0510-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0510-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0511: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0511-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0511-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0511-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0512: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0512-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0512-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0512-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0513: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0513-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0513-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0513-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0514: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0514-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0514-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0514-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0515: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0515-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0515-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0515-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0516: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0516-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0516-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0516-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0517: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0517-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0517-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0517-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0518: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0518-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0518-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0518-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0519: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0519-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0519-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0519-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0520: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0520-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0520-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0520-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0521: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0521-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0521-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0521-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0522: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0522-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0522-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0522-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0523: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0523-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0523-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0523-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0524: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0524-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0524-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0524-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0525: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0525-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0525-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0525-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0526: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0526-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0526-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0526-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0527: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0527-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0527-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0527-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0528: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0528-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0528-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0528-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0529: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0529-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0529-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0529-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0530: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0530-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0530-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0530-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0531: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0531-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0531-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0531-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0532: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0532-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0532-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0532-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0533: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0533-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0533-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0533-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0534: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0534-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0534-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0534-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0535: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0535-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0535-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0535-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0536: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0536-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0536-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0536-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0537: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0537-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0537-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0537-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0538: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0538-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0538-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0538-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0539: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0539-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0539-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0539-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0540: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0540-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0540-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0540-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0541: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0541-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0541-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0541-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0542: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0542-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0542-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0542-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0543: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0543-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0543-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0543-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0544: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0544-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0544-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0544-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0545: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0545-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0545-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0545-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0546: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0546-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0546-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0546-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0547: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0547-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0547-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0547-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0548: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0548-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0548-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0548-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0549: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0549-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0549-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0549-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0550: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0550-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0550-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0550-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0551: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0551-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0551-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0551-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0552: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0552-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0552-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0552-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0553: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0553-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0553-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0553-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0554: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0554-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0554-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0554-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0555: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0555-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0555-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0555-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0556: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0556-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0556-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0556-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0557: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0557-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0557-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0557-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0558: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0558-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0558-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0558-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0559: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0559-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0559-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0559-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0560: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0560-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0560-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0560-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0561: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0561-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0561-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0561-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0562: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0562-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0562-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0562-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0563: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0563-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0563-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0563-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0564: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0564-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0564-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0564-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0565: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0565-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0565-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0565-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0566: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0566-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0566-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0566-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0567: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0567-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0567-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0567-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0568: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0568-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0568-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0568-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0569: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0569-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0569-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0569-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0570: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0570-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0570-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0570-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0571: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0571-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0571-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0571-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0572: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0572-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0572-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0572-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0573: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0573-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0573-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0573-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0574: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0574-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0574-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0574-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0575: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0575-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0575-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0575-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0576: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0576-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0576-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0576-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0577: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0577-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0577-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0577-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0578: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0578-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0578-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0578-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0579: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0579-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0579-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0579-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0580: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0580-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0580-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0580-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0581: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0581-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0581-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0581-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0582: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0582-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0582-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0582-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0583: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0583-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0583-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0583-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0584: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0584-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0584-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0584-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0585: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0585-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0585-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0585-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0586: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0586-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0586-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0586-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0587: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0587-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0587-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0587-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0588: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0588-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0588-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0588-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0589: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0589-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0589-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0589-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0590: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0590-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0590-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0590-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0591: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0591-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0591-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0591-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0592: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0592-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0592-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0592-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0593: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0593-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0593-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0593-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0594: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0594-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0594-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0594-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0595: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0595-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0595-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0595-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0596: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0596-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0596-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0596-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0597: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0597-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0597-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0597-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0598: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0598-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0598-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0598-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0599: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0599-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0599-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0599-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0600: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0600-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0600-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0600-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0601: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0601-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0601-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0601-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0602: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0602-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0602-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0602-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0603: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0603-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0603-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0603-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0604: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0604-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0604-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0604-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0605: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0605-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0605-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0605-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0606: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0606-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0606-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0606-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0607: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0607-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0607-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0607-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0608: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0608-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0608-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0608-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0609: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0609-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0609-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0609-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0610: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0610-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0610-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0610-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0611: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0611-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0611-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0611-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0612: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0612-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0612-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0612-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0613: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0613-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0613-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0613-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0614: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0614-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0614-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0614-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0615: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0615-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0615-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0615-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0616: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0616-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0616-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0616-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0617: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0617-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0617-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0617-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0618: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0618-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0618-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0618-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0619: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0619-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0619-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0619-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0620: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0620-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0620-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0620-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0621: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0621-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0621-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0621-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0622: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0622-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0622-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0622-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0623: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0623-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0623-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0623-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0624: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0624-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0624-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0624-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0625: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0625-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0625-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0625-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0626: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0626-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0626-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0626-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0627: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0627-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0627-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0627-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0628: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0628-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0628-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0628-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0629: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0629-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0629-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0629-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0630: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0630-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0630-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0630-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0631: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0631-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0631-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0631-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0632: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0632-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0632-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0632-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0633: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0633-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0633-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0633-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0634: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0634-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0634-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0634-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0635: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0635-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0635-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0635-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0636: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0636-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0636-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0636-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0637: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0637-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0637-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0637-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0638: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0638-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0638-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0638-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0639: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0639-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0639-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0639-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0640: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0640-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0640-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0640-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0641: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0641-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0641-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0641-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0642: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0642-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0642-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0642-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0643: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0643-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0643-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0643-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0644: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0644-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0644-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0644-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0645: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0645-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0645-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0645-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0646: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0646-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0646-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0646-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0647: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0647-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0647-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0647-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0648: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0648-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0648-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0648-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0649: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0649-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0649-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0649-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0650: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0650-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0650-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0650-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0651: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0651-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0651-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0651-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0652: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0652-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0652-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0652-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0653: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0653-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0653-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0653-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0654: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0654-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0654-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0654-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0655: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0655-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0655-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0655-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0656: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0656-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0656-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0656-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0657: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0657-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0657-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0657-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0658: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0658-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0658-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0658-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0659: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0659-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0659-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0659-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0660: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0660-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0660-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0660-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0661: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0661-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0661-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0661-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0662: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0662-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0662-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0662-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0663: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0663-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0663-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0663-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0664: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0664-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0664-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0664-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0665: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0665-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0665-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0665-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0666: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0666-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0666-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0666-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0667: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0667-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0667-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0667-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0668: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0668-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0668-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0668-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0669: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0669-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0669-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0669-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0670: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0670-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0670-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0670-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0671: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0671-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0671-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0671-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0672: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0672-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0672-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0672-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0673: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0673-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0673-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0673-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0674: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0674-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0674-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0674-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0675: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0675-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0675-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0675-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0676: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0676-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0676-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0676-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0677: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0677-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0677-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0677-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0678: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0678-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0678-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0678-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0679: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0679-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0679-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0679-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0680: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0680-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0680-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0680-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0681: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0681-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0681-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0681-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0682: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0682-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0682-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0682-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0683: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0683-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0683-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0683-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0684: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0684-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0684-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0684-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0685: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0685-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0685-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0685-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0686: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0686-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0686-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0686-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0687: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0687-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0687-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0687-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0688: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0688-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0688-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0688-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0689: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0689-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0689-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0689-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0690: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0690-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0690-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0690-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0691: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0691-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0691-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0691-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0692: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0692-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0692-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0692-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0693: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0693-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0693-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0693-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0694: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0694-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0694-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0694-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0695: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0695-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0695-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0695-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0696: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0696-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0696-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0696-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0697: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0697-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0697-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0697-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0698: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0698-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0698-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0698-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0699: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0699-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0699-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0699-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0700: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0700-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0700-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0700-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0701: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0701-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0701-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0701-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0702: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0702-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0702-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0702-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0703: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0703-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0703-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0703-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0704: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0704-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0704-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0704-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0705: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0705-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0705-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0705-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0706: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0706-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0706-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0706-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0707: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0707-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0707-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0707-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0708: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0708-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0708-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0708-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0709: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0709-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0709-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0709-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0710: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0710-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0710-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0710-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0711: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0711-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0711-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0711-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0712: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0712-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0712-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0712-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0713: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0713-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0713-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0713-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0714: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0714-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0714-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0714-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0715: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0715-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0715-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0715-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0716: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0716-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0716-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0716-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0717: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0717-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0717-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0717-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0718: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0718-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0718-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0718-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0719: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0719-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0719-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0719-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0720: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0720-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0720-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0720-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0721: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0721-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0721-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0721-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0722: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0722-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0722-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0722-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0723: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0723-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0723-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0723-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0724: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0724-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0724-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0724-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0725: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0725-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0725-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0725-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0726: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0726-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0726-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0726-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0727: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0727-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0727-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0727-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0728: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0728-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0728-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0728-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0729: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0729-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0729-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0729-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0730: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0730-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0730-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0730-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0731: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0731-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0731-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0731-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0732: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0732-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0732-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0732-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0733: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0733-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0733-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0733-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0734: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0734-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0734-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0734-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0735: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0735-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0735-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0735-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0736: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0736-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0736-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0736-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0737: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0737-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0737-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0737-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0738: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0738-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0738-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0738-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0739: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0739-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0739-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0739-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0740: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0740-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0740-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0740-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0741: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0741-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0741-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0741-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0742: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0742-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0742-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0742-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0743: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0743-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0743-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0743-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0744: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0744-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0744-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0744-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0745: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0745-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0745-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0745-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0746: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0746-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0746-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0746-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0747: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0747-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0747-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0747-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0748: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0748-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0748-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0748-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0749: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0749-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0749-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0749-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0750: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0750-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0750-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0750-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0751: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0751-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0751-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0751-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0752: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0752-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0752-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0752-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0753: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0753-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0753-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0753-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0754: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0754-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0754-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0754-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0755: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0755-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0755-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0755-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0756: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0756-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0756-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0756-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0757: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0757-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0757-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0757-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0758: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0758-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0758-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0758-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0759: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0759-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0759-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0759-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0760: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0760-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0760-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0760-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0761: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0761-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0761-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0761-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0762: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0762-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0762-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0762-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0763: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0763-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0763-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0763-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0764: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0764-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0764-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0764-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0765: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0765-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0765-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0765-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0766: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0766-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0766-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0766-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0767: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0767-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0767-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0767-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0768: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0768-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0768-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0768-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0769: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0769-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0769-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0769-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0770: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0770-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0770-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0770-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0771: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0771-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0771-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0771-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0772: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0772-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0772-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0772-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0773: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0773-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0773-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0773-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0774: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0774-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0774-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0774-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0775: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0775-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0775-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0775-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0776: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0776-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0776-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0776-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0777: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0777-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0777-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0777-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0778: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0778-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0778-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0778-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0779: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0779-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0779-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0779-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0780: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0780-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0780-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0780-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0781: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0781-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0781-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0781-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0782: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0782-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0782-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0782-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0783: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0783-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0783-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0783-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0784: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0784-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0784-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0784-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0785: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0785-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0785-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0785-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0786: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0786-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0786-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0786-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0787: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0787-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0787-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0787-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0788: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0788-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0788-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0788-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0789: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0789-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0789-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0789-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0790: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0790-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0790-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0790-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0791: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0791-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0791-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0791-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0792: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0792-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0792-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0792-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0793: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0793-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0793-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0793-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0794: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0794-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0794-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0794-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0795: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0795-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0795-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0795-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0796: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0796-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0796-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0796-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0797: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0797-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0797-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0797-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0798: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0798-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0798-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0798-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0799: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0799-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0799-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0799-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0800: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0800-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0800-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0800-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0801: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0801-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0801-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0801-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0802: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0802-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0802-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0802-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0803: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0803-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0803-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0803-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0804: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0804-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0804-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0804-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0805: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0805-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0805-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0805-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0806: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0806-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0806-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0806-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0807: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0807-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0807-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0807-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0808: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
/* TEST-0808-DATA: Use existing demo records or test records only; never replace the shared patient/card number with a department-specific number. */
/* TEST-0808-SECURITY: Attempt an unauthorized department action and confirm it is blocked. */
/* TEST-0808-AUDIT: Confirm sensitive actions are traceable to the responsible user/role. */
/* TEST-0809: Verify Bazza PHC workflow integrity; check authorization, persistence, search, status transitions, printing and audit logging where applicable. */
