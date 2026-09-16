import React, { useMemo, useState } from "react";

/* =========================================================
   BAZZA PRIMARY HEALTH CARE SOKOTO
   Main App
   ========================================================= */

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

const defaultPermissions = {
  "Super Admin": permissions,

  "In-Charge": [
    "View",
    "Print",
    "Reports",
    "SMS",
    "Alerts",
  ],

  "General Cashier": [
    "View",
    "Create",
    "Print",
    "Cashier",
    "Reports",
    "Alerts",
  ],

  "ICT Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Reports",
    "Stock",
    "SMS",
    "Alerts",
  ],

  "Records Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Reports",
    "SMS",
    "Alerts",
  ],

  Nurse: [
    "View",
    "Create",
    "Edit",
    "Print",
    "Alerts",
  ],

  Consultant: [
    "View",
    "Create",
    "Edit",
    "Print",
    "Reports",
    "Alerts",
  ],

  "Laboratory Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Cashier",
    "Reports",
    "Stock",
    "SMS",
    "Alerts",
  ],

  "Pharmacy Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Stock",
    "SMS",
    "Alerts",
  ],

  "Ultrasound Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Cashier",
    "Reports",
    "Stock",
    "SMS",
    "Alerts",
  ],

  "Ward Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Alerts",
  ],

  "Immunization Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Reports",
    "SMS",
    "Alerts",
  ],

  "Family Planning Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Reports",
    "SMS",
    "Alerts",
  ],

  "Adolescent Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Reports",
    "SMS",
    "Alerts",
  ],
};

const initialStaff = [
  {
    id: 1,
    name: "Altini Garba Bazza",
    staffId: "BZ001",
    username: "altini",
    password: "1234",
    department: "In-Charge",
    role: "In-Charge",
    status: "Active",
    permissions: defaultPermissions["In-Charge"],
  },
  {
    id: 2,
    name: "Hadiza Umar",
    staffId: "BZ002",
    username: "hadiza",
    password: "1234",
    department: "Pharmacy Unit",
    role: "Pharmacy Staff",
    status: "Active",
    permissions: defaultPermissions["Pharmacy Staff"],
  },
  {
    id: 3,
    name: "Abba Yaro",
    staffId: "BZ003",
    username: "abbayaro",
    password: "1234",
    department: "Ultrasound Room",
    role: "Ultrasound Staff",
    status: "Active",
    permissions: defaultPermissions["Ultrasound Staff"],
  },
  {
    id: 4,
    name: "Kabiru Lawal",
    staffId: "BZ004",
    username: "kabiru",
    password: "1234",
    department: "Laboratory Unit",
    role: "Laboratory Staff",
    status: "Active",
    permissions: defaultPermissions["Laboratory Staff"],
  },
  {
    id: 5,
    name: "Super Administrator",
    staffId: "BZ000",
    username: "admin",
    password: "1234",
    department: "ICT Centre",
    role: "Super Admin",
    status: "Active",
    permissions: permissions,
  },
];

const menuIcons = {
  Dashboard: "⌂",
  Patients: "👥",
  Departments: "🏢",
  "Staff & Roles": "👨‍⚕️",
  Attendance: "🕐",
  Roster: "📋",
  "General Cashier": "💰",
  Cashier: "💰",
  Stock: "📦",
  "Wards & Beds": "🛏️",
  Alerts: "🔔",
  "SMS / Email": "📱",
  SMS: "📱",
  Reports: "📊",
  "Audit Logs": "🔐",
  Settings: "⚙️",
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState("");

  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    staffId: "",
    username: "",
    password: "",
    department: "",
    role: "",
    status: "Active",
  });

  /* =========================================================
     LOGIN
     ========================================================= */

  function login(e) {
    e.preventDefault();

    const user = staff.find(
      (person) =>
        person.status === "Active" &&
        (person.username.toLowerCase() === username.trim().toLowerCase() ||
          person.staffId.toLowerCase() === username.trim().toLowerCase()) &&
        person.password === password
    );

    if (!user) {
      setLoginError("Username/Staff ID ko password ba su dace ba.");
      return;
    }

    setCurrentUser(user);
    setLoggedIn(true);
    setLoginError("");
    setActivePage("Dashboard");
  }

  function logout() {
    setLoggedIn(false);
    setCurrentUser(null);
    setUsername("");
    setPassword("");
    setActivePage("Dashboard");
    setMobileMenu(false);
  }

  /* =========================================================
     PERMISSIONS
     ========================================================= */

  function hasPermission(permission) {
    if (!currentUser) return false;

    if (currentUser.role === "Super Admin") {
      return true;
    }

    return currentUser.permissions?.includes(permission);
  }

  function openPermissions(person) {
    setSelectedStaff(person);
    setSelectedPermissions(person.permissions || []);
    setShowPermissions(true);
  }

  function togglePermission(permission) {
    setSelectedPermissions((previous) => {
      if (previous.includes(permission)) {
        return previous.filter((item) => item !== permission);
      }

      return [...previous, permission];
    });
  }

  function savePermissions() {
    if (!selectedStaff) return;

    setStaff((previous) =>
      previous.map((person) =>
        person.id === selectedStaff.id
          ? {
              ...person,
              permissions:
                person.role === "Super Admin"
                  ? permissions
                  : selectedPermissions,
            }
          : person
      )
    );

    if (currentUser?.id === selectedStaff.id) {
      setCurrentUser((previous) => ({
        ...previous,
        permissions:
          selectedStaff.role === "Super Admin"
            ? permissions
            : selectedPermissions,
      }));
    }

    setShowPermissions(false);
    setSelectedStaff(null);
  }

  /* =========================================================
     STAFF FORM
     ========================================================= */

  function openAddStaff() {
    setEditingStaff(null);

    setStaffForm({
      fullName: "",
      staffId: "",
      username: "",
      password: "",
      department: "",
      role: "",
      status: "Active",
    });

    setShowStaffModal(true);
  }

  function openEditStaff(person) {
    setEditingStaff(person);

    setStaffForm({
      fullName: person.name || "",
      staffId: person.staffId || "",
      username: person.username || "",
      password: "",
      department: person.department || "",
      role: person.role || "",
      status: person.status || "Active",
    });

    setShowStaffModal(true);
  }

  function saveStaff() {
    if (
      !staffForm.fullName.trim() ||
      !staffForm.staffId.trim() ||
      !staffForm.username.trim() ||
      !staffForm.department ||
      !staffForm.role
    ) {
      window.alert("Please cika dukkan required fields.");
      return;
    }

    if (!editingStaff && !staffForm.password.trim()) {
      window.alert("Password is required for new staff.");
      return;
    }

    const duplicateStaffId = staff.some(
      (person) =>
        person.staffId.toLowerCase() ===
          staffForm.staffId.trim().toLowerCase() &&
        person.id !== editingStaff?.id
    );

    if (duplicateStaffId) {
      window.alert("Wannan Staff ID ya riga ya kasance.");
      return;
    }

    const duplicateUsername = staff.some(
      (person) =>
        person.username.toLowerCase() ===
          staffForm.username.trim().toLowerCase() &&
        person.id !== editingStaff?.id
    );

    if (duplicateUsername) {
      window.alert("Wannan username ya riga ya kasance.");
      return;
    }

    if (editingStaff) {
      setStaff((previous) =>
        previous.map((person) => {
          if (person.id !== editingStaff.id) {
            return person;
          }

          return {
            ...person,
            name: staffForm.fullName.trim(),
            staffId: staffForm.staffId.trim(),
            username: staffForm.username.trim(),
            password: staffForm.password.trim()
              ? staffForm.password
              : person.password,
            department: staffForm.department,
            role: staffForm.role,
            status: staffForm.status,
            permissions:
              person.role === staffForm.role
                ? person.permissions
                : defaultPermissions[staffForm.role] || ["View"],
          };
        })
      );
    } else {
      const newStaff = {
        id: Date.now(),
        name: staffForm.fullName.trim(),
        staffId: staffForm.staffId.trim(),
        username: staffForm.username.trim(),
        password: staffForm.password,
        department: staffForm.department,
        role: staffForm.role,
        status: staffForm.status,
        permissions: defaultPermissions[staffForm.role] || ["View"],
      };

      setStaff((previous) => [...previous, newStaff]);
    }

    setShowStaffModal(false);
    setEditingStaff(null);
  }

  /* =========================================================
     MENU ACCESS
     ========================================================= */

  const accessiblePages = useMemo(() => {
    if (!currentUser) return [];

    if (currentUser.role === "Super Admin") {
      return [
        "Dashboard",
        "Patients",
        "Departments",
        "Staff & Roles",
        "Attendance",
        "Roster",
        "General Cashier",
        "Stock",
        "Wards & Beds",
        "Alerts",
        "SMS / Email",
        "Reports",
        "Audit Logs",
        "Settings",
      ];
    }

    const pages = ["Dashboard"];

    if (currentUser.department) {
      pages.push(currentUser.department);
    }

    if (hasPermission("Cashier")) {
      pages.push("Cashier");
    }

    if (hasPermission("Stock")) {
      pages.push("Stock");
    }

    if (hasPermission("Reports")) {
      pages.push("Reports");
    }

    if (hasPermission("SMS")) {
      pages.push("SMS / Email");
    }

    if (hasPermission("Alerts")) {
      pages.push("Alerts");
    }

    return [...new Set(pages)];
  }, [currentUser]);

  /* =========================================================
     DASHBOARD
     ========================================================= */

  function DashboardPage() {
    const activeStaff = staff.filter(
      (person) => person.status === "Active"
    ).length;

    return (
      <>
        <div className="welcome">
          <h1>Welcome, {currentUser?.name}</h1>
          <p>
            Bazza Primary Health Care — Central Hospital Management
            Dashboard
          </p>
        </div>

        <div className="stats-grid">
          <StatCard icon="👥" title="Patients Today" value="0" />
          <StatCard icon="🚶" title="Outpatients Today" value="0" />
          <StatCard icon="🛏️" title="Inpatients" value="0" />
          <StatCard
            icon="🟢"
            title="Active Staff"
            value={activeStaff}
          />
          <StatCard icon="⏳" title="Pending Work" value="0" />
          <StatCard icon="₦" title="Revenue Today" value="₦0" />
          <StatCard icon="🎁" title="FREE Services" value="0" />
          <StatCard icon="📦" title="Low Stock" value="0" />
        </div>

        <div className="two-column">
          <div className="card">
            <h2>Access Control</h2>

            <p className="muted">
              Wannan account yana aiki ne bisa ga role da
              permissions da aka ba shi.
            </p>

            <div className="access-row">
              <strong>Department</strong>
              <span>{currentUser?.department}</span>
            </div>

            <div className="access-row">
              <strong>Role</strong>
              <span>{currentUser?.role}</span>
            </div>

            <div className="access-row">
              <strong>Permissions</strong>
              <div className="tags">
                {(currentUser?.permissions || []).map(
                  (permission) => (
                    <span key={permission}>{permission}</span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <h2>System Status</h2>

            <div className="status-line">
              <span>●</span>
              <strong>System Online</strong>
            </div>

            <p className="muted">
              Department separation yana aiki.
            </p>

            <p className="muted">
              User permissions suna aiki bisa role.
            </p>

            <p className="muted">
              Super Admin yana da full system access.
            </p>
          </div>
        </div>
      </>
    );
  }

  /* =========================================================
     MODULE PAGE
     ========================================================= */

  function ModulePage({ page }) {
    return (
      <div className="card module-card">
        <div className="module-icon">
          {menuIcons[page] || "🏥"}
        </div>

        <h1>{page}</h1>

        <p>
          Wannan module an ware shi ne domin{" "}
          <strong>{currentUser?.department}</strong>.
        </p>

        <div className="security-box">
          🔐 <strong>Department Separation</strong>
          <br />
          Wannan user ba zai iya ganin ko gyara aikin wasu
          departments ba sai idan an ba shi izini.
        </div>

        {hasPermission("View") && (
          <button className="primary-button">
            Open {page}
          </button>
        )}
      </div>
    );
  }

  /* =========================================================
     LOGIN
     ========================================================= */

  if (!loggedIn) {
    return (
      <div className="login-page">
        <style>{styles}</style>

        <div className="login-card">
          <div className="logo">B</div>

          <h1>BAZZA PHC</h1>

          <p className="subtitle">
            Hospital Management System
          </p>

          <form onSubmit={login}>
            <label>Username / Staff ID</label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />

            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <strong>24 Hours · 7 Days</strong>
            <br />
            Waziri Maccido Road, Bazza Area, Sokoto
            <br />
            08169640287
          </div>

          <div className="demo-box">
            <strong>Demo Login</strong>
            <br />
            Super Admin: <b>admin / 1234</b>
            <br />
            In-Charge: <b>altini / 1234</b>
            <br />
            Pharmacy: <b>hadiza / 1234</b>
            <br />
            Ultrasound: <b>abbayaro / 1234</b>
            <br />
            Laboratory: <b>kabiru / 1234</b>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN APP
     ========================================================= */

  return (
    <div className="app">
      <style>{styles}</style>

      {mobileMenu && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside
        className={`sidebar ${
          mobileMenu ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-logo">B</div>

          <h2>BAZZA PHC</h2>

          <p>Hospital Management System</p>
        </div>

        <div className="user-box">
          <strong>{currentUser?.name}</strong>
          <span>{currentUser?.role}</span>
          <small>{currentUser?.department}</small>
        </div>

        <nav className="menu">
          {accessiblePages.map((page) => (
            <button
              key={page}
              className={
                activePage === page ? "menu-active" : ""
              }
              onClick={() => {
                setActivePage(page);
                setMobileMenu(false);
              }}
            >
              <span>{menuIcons[page] || "•"}</span>
              {page}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={logout}>
          ↪ Logout
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenu(true)}
            >
              ☰
            </button>

            <div>
              <div className="top-title">
                {activePage}
              </div>
              <small>Bazza Primary Health Care Sokoto</small>
            </div>
          </div>

          <div className="admin-box">
            <span className="online">● System Online</span>
            <strong>{currentUser?.role}</strong>

            <div className="avatar">
              {currentUser?.name
                ?.split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>
        </header>

        <section className="content">
          {activePage === "Dashboard" && <DashboardPage />}

          {activePage === "Staff & Roles" &&
            currentUser?.role === "Super Admin" && (
              <StaffManagement
                staff={staff}
                search={search}
                setSearch={setSearch}
                openPermissions={openPermissions}
                openAddStaff={openAddStaff}
                openEditStaff={openEditStaff}
              />
            )}

          {activePage !== "Dashboard" &&
            activePage !== "Staff & Roles" && (
              <ModulePage page={activePage} />
            )}
        </section>
      </main>

      {/* =====================================================
          PERMISSIONS MODAL
          ===================================================== */}

      {showPermissions && selectedStaff && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Manage Permissions</h2>

                <p>
                  <strong>{selectedStaff.name}</strong>
                </p>

                <p className="muted">
                  {selectedStaff.department} ·{" "}
                  {selectedStaff.role}
                </p>
              </div>

              <button
                className="close-button"
                onClick={() => {
                  setShowPermissions(false);
                  setSelectedStaff(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="permission-list">
              {permissions.map((permission) => (
                <label key={permission}>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(
                      permission
                    )}
                    disabled={
                      selectedStaff.role === "Super Admin"
                    }
                    onChange={() =>
                      togglePermission(permission)
                    }
                  />

                  <span>{permission}</span>
                </label>
              ))}
            </div>

            <div className="security-box">
              🔐 Super Admin ne kawai zai iya canza
              permissions.
            </div>

            <div className="modal-buttons">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowPermissions(false);
                  setSelectedStaff(null);
                }}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={savePermissions}
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD / EDIT STAFF MODAL
          ===================================================== */}

      {showStaffModal && (
        <div className="overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingStaff
                    ? "Edit Staff"
                    : "Add New Staff"}
                </h2>

                <p className="muted">
                  Staff account and department access
                </p>
              </div>

              <button
                className="close-button"
                onClick={() => {
                  setShowStaffModal(false);
                  setEditingStaff(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Staff Full Name *</label>

                <input
                  value={staffForm.fullName}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Staff ID *</label>

                <input
                  value={staffForm.staffId}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      staffId: e.target.value,
                    })
                  }
                  placeholder="e.g. BZ005"
                />
              </div>

              <div className="form-group">
                <label>Username *</label>

                <input
                  value={staffForm.username}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      username: e.target.value,
                    })
                  }
                  placeholder="Username"
                />
              </div>

              <div className="form-group">
                <label>
                  Password {editingStaff ? "" : "*"}
                </label>

                <input
                  type="password"
                  value={staffForm.password}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      password: e.target.value,
                    })
                  }
                  placeholder={
                    editingStaff
                      ? "Leave empty to keep current password"
                      : "Password"
                  }
                />
              </div>

              <div className="form-group">
                <label>Department *</label>

                <select
                  value={staffForm.department}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      department: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Role *</label>

                <select
                  value={staffForm.role}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="">Select Role</option>

                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  value={staffForm.status}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {staffForm.role && (
              <div className="preview-box">
                <strong>Default Permissions</strong>

                <div className="tags">
                  {(
                    defaultPermissions[staffForm.role] || [
                      "View",
                    ]
                  ).map((permission) => (
                    <span key={permission}>
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-buttons">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowStaffModal(false);
                  setEditingStaff(null);
                }}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={saveStaff}
              >
                {editingStaff
                  ? "Update Staff"
                  : "Create Staff"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({ icon, title, value }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-title">{title}</div>

      <div className="stat-value">{value}</div>
    </div>
  );
}

/* =========================================================
   STAFF MANAGEMENT
   ========================================================= */

function StaffManagement({
  staff,
  search,
  setSearch,
  openPermissions,
  openAddStaff,
  openEditStaff,
}) {
  const filtered = staff.filter((person) =>
    `${person.name} ${person.staffId} ${person.department} ${person.role} ${person.username}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Staff & Roles</h1>

          <p>
            Manage staff accounts, departments and
            permissions.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddStaff}
        >
          + Add New Staff
        </button>
      </div>

      <div className="card search-card">
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, Staff ID, username, department..."
        />
      </div>

      <div className="card table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Staff ID</th>
                <th>Username</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((person) => (
                <tr key={person.id}>
                  <td>
                    <strong>{person.name}</strong>
                  </td>

                  <td>{person.staffId}</td>

                  <td>{person.username}</td>

                  <td>{person.department}</td>

                  <td>{person.role}</td>

                  <td>
                    <span
                      className={
                        person.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {person.status}
                    </span>
                  </td>

                  <td>
                    <div className="mini-tags">
                      {(person.permissions || [])
                        .slice(0, 3)
                        .map((permission) => (
                          <span key={permission}>
                            {permission}
                          </span>
                        ))}

                      {person.permissions?.length > 3 && (
                        <span>
                          +{person.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="small-button"
                        onClick={() =>
                          openEditStaff(person)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="small-button permission-button"
                        onClick={() =>
                          openPermissions(person)
                        }
                      >
                        Permissions
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty">
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

/* =========================================================
   CSS
   ========================================================= */

const styles = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f4f7fb;
  color: #172033;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  background: linear-gradient(135deg, #0f766e, #064e3b);
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
}

.logo {
  width: 65px;
  height: 65px;
  border-radius: 16px;
  background: #0f766e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 800;
  margin: auto;
}

.login-card h1 {
  text-align: center;
  margin: 15px 0 5px;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 30px;
}

.login-card label {
  display: block;
  font-weight: 700;
  margin: 15px 0 7px;
}

.login-card input {
  width: 100%;
  padding: 13px;
  border: 1px solid #d7dee8;
  border-radius: 10px;
  outline: none;
}

.login-card input:focus {
  border-color: #0f766e;
}

.login-button {
  width: 100%;
  margin-top: 22px;
  border: 0;
  padding: 14px;
  border-radius: 10px;
  background: #0f766e;
  color: white;
  font-weight: 800;
}

.login-error {
  margin-top: 12px;
  padding: 10px;
  border-radius: 8px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 14px;
}

.login-footer {
  text-align: center;
  margin-top: 25px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;
}

.demo-box {
  margin-top: 20px;
  background: #f1f5f9;
  padding: 13px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.7;
}

.app {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  width: 265px;
  min-height: 100vh;
  background: #082f2b;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.brand {
  padding: 25px 20px 18px;
  text-align: center;
}

.brand-logo {
  width: 55px;
  height: 55px;
  margin: auto;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f766e;
  font-size: 28px;
  font-weight: 800;
}

.brand h2 {
  margin: 12px 0 3px;
}

.brand p {
  margin: 0;
  color: #b7d4d1;
  font-size: 12px;
}

.user-box {
  margin: 10px 15px;
  padding: 13px;
  border-radius: 10px;
  background: rgba(255,255,255,.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-box span {
  color: #a7d9d3;
  font-size: 13px;
}

.user-box small {
  color: #cbd5e1;
}

.menu {
  padding: 10px;
  overflow-y: auto;
  flex: 1;
}

.menu button {
  width: 100%;
  border: 0;
  background: transparent;
  color: #d8e9e7;
  padding: 11px 13px;
  margin-bottom: 3px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 11px;
  text-align: left;
}

.menu button:hover {
  background: rgba(255,255,255,.08);
}

.menu button.menu-active {
  background: #0f766e;
  color: white;
}

.menu button span {
  width: 24px;
}

.logout-button {
  margin: 12px;
  padding: 11px;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 9px;
  background: transparent;
  color: white;
}

.main {
  margin-left: 265px;
  width: calc(100% - 265px);
  min-height: 100vh;
}

.topbar {
  height: 75px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.top-title {
  font-size: 20px;
  font-weight: 800;
}

.top-left small {
  color: #64748b;
}

.mobile-menu-button {
  display: none;
  border: 0;
  background: #f1f5f9;
  padding: 9px;
  border-radius: 8px;
}

.admin-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.online {
  color: #15803d;
  font-size: 13px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #0f766e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.content {
  padding: 28px;
}

.welcome {
  margin-bottom: 22px;
}

.welcome h1 {
  margin: 0 0 6px;
}

.welcome p {
  margin: 0;
  color: #64748b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.card {
  background: white;
  border-radius: 14px;
  border: 1px solid #e6ebf1;
  padding: 20px;
  box-shadow: 0 3px 12px rgba(15,23,42,.04);
}

.stat-card {
  min-height: 135px;
}

.stat-icon {
  font-size: 26px;
  margin-bottom: 12px;
}

.stat-title {
  color: #64748b;
  font-size: 13px;
}

.stat-value {
  margin-top: 5px;
  font-size: 25px;
  font-weight: 800;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 18px;
}

.card h2 {
  margin-top: 0;
}

.muted {
  color: #64748b;
  font-size: 14px;
}

.access-row {
  border-top: 1px solid #edf0f4;
  padding: 13px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tags,
.mini-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tags span,
.mini-tags span {
  background: #e6f5f2;
  color: #075e56;
  border-radius: 6px;
  padding: 4px 7px;
  font-size: 11px;
  font-weight: 700;
}

.status-line {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #15803d;
  margin-bottom: 20px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 18px;
}

.page-head h1 {
  margin: 0 0 5px;
}

.page-head p {
  margin: 0;
  color: #64748b;
}

.primary-button,
.secondary-button,
.small-button {
  border: 0;
  border-radius: 8px;
  padding: 10px 15px;
  font-weight: 700;
}

.primary-button {
  background: #0f766e;
  color: white;
}

.secondary-button {
  background: #e2e8f0;
  color: #1e293b;
}

.small-button {
  padding: 7px 9px;
  background: #e2e8f0;
  font-size: 11px;
}

.permission-button {
  background: #dff4ef;
  color: #075e56;
}

.search-card {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  border: 1px solid #d7dee8;
  border-radius: 9px;
  padding: 12px;
  outline: none;
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 950px;
}

th,
td {
  padding: 13px;
  text-align: left;
  border-bottom: 1px solid #edf0f4;
  font-size: 13px;
}

th {
  background: #f8fafc;
  color: #475569;
}

.status-active {
  color: #166534;
  background: #dcfce7;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.status-inactive {
  color: #991b1b;
  background: #fee2e2;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.empty {
  text-align: center;
  padding: 30px;
  color: #64748b;
}

.module-card {
  max-width: 750px;
}

.module-icon {
  font-size: 45px;
  margin-bottom: 10px;
}

.security-box {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1e40af;
  padding: 13px;
  border-radius: 9px;
  margin: 18px 0;
  line-height: 1.6;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.58);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
}

.modal {
  background: white;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 15px;
  padding: 22px;
}

.large-modal {
  max-width: 750px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0 0 5px;
}

.modal-header p {
  margin: 3px 0;
}

.close-button {
  border: 0;
  background: #f1f5f9;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 22px;
}

.permission-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 20px 0;
}

.permission-list label {
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 11px;
  border: 1px solid #d7dee8;
  border-radius: 8px;
  background: white;
}

.preview-box {
  background: #f8fafc;
  padding: 14px;
  border-radius: 9px;
  margin-top: 18px;
}

.preview-box .tags {
  margin-top: 8px;
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 800px) {
  .sidebar {
    transform: translateX(-100%);
    transition: .2s ease;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    z-index: 40;
  }

  .main {
    margin-left: 0;
    width: 100%;
  }

  .mobile-menu-button {
    display: block;
  }

  .admin-box strong,
  .online {
    display: none;
  }

  .content {
    padding: 18px;
  }

  .two-column {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .page-head {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 550px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    padding: 0 14px;
  }

  .permission-list {
    grid-template-columns: 1fr;
  }

  .login-card {
    padding: 25px;
  }
}
`;

export default App;
