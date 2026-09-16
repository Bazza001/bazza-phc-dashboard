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

const rolePermissions = {
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
    "Edit",
    "Print",
    "Cashier",
    "Reports",
  ],

  "ICT Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Stock",
    "SMS",
    "Alerts",
  ],

  "Records Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Cashier",
    "Reports",
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
    "Cashier",
    "Reports",
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
    "Cashier",
    "Reports",
    "SMS",
    "Alerts",
  ],

  "Family Planning Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Cashier",
    "Reports",
    "SMS",
    "Alerts",
  ],

  "Adolescent Staff": [
    "View",
    "Create",
    "Edit",
    "Print",
    "Cashier",
    "Reports",
    "SMS",
    "Alerts",
  ],
};

const initialStaff = [
  {
    id: 1,
    name: "Super Administrator",
    staffId: "BZ000",
    username: "admin",
    password: "1234",
    department: "ICT Centre",
    role: "Super Admin",
    status: "Active",
    permissions: rolePermissions["Super Admin"],
  },
  {
    id: 2,
    name: "Altini Garba Bazza",
    staffId: "BZ001",
    username: "altini",
    password: "1234",
    department: "In-Charge",
    role: "In-Charge",
    status: "Active",
    permissions: rolePermissions["In-Charge"],
  },
  {
    id: 3,
    name: "Hadiza Umar",
    staffId: "BZ002",
    username: "hadiza",
    password: "1234",
    department: "Pharmacy Unit",
    role: "Pharmacy Staff",
    status: "Active",
    permissions: rolePermissions["Pharmacy Staff"],
  },
  {
    id: 4,
    name: "Abba Yaro",
    staffId: "BZ003",
    username: "abbayaro",
    password: "1234",
    department: "Ultrasound Room",
    role: "Ultrasound Staff",
    status: "Active",
    permissions: rolePermissions["Ultrasound Staff"],
  },
  {
    id: 5,
    name: "Kabiru Lawal",
    staffId: "BZ004",
    username: "kabiru",
    password: "1234",
    department: "Laboratory Unit",
    role: "Laboratory Staff",
    status: "Active",
    permissions: rolePermissions["Laboratory Staff"],
  },
];

const menuItems = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Patients", icon: "👥" },
  { name: "Outpatients", icon: "🚶" },
  { name: "Staff & Roles", icon: "👨‍⚕️" },
  { name: "Roster / Attendance", icon: "📅" },
  { name: "Reports", icon: "📊" },
  { name: "Audit Logs", icon: "🔐" },
  { name: "SMS / Notifications", icon: "📱" },
  { name: "Stock", icon: "📦" },
  { name: "Cashier", icon: "💰" },
  { name: "Alerts", icon: "🔔" },
];

function App() {
  const [staff, setStaff] = useState(initialStaff);
  const [currentUser, setCurrentUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activePage, setActivePage] = useState("Dashboard");

  const [search, setSearch] = useState("");

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [staffForm, setStaffForm] = useState({
    name: "",
    staffId: "",
    username: "",
    password: "",
    department: "",
    role: "",
    status: "Active",
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  function login(event) {
    event.preventDefault();

    const found = staff.find(
      (person) =>
        person.username.toLowerCase() === username.trim().toLowerCase() &&
        person.password === password
    );

    if (!found) {
      setLoginError("Username ko Password ba daidai ba.");
      return;
    }

    if (found.status !== "Active") {
      setLoginError("An kashe wannan Staff Account.");
      return;
    }

    setCurrentUser(found);
    setLoginError("");
    setActivePage("Dashboard");
  }

  function logout() {
    setCurrentUser(null);
    setUsername("");
    setPassword("");
    setLoginError("");
    setActivePage("Dashboard");
  }

  function hasPermission(permission) {
    if (!currentUser) return false;

    if (currentUser.role === "Super Admin") {
      return true;
    }

    return currentUser.permissions.includes(permission);
  }

  function openAddStaff() {
    setEditingStaff(null);

    setStaffForm({
      name: "",
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
      name: person.name || "",
      staffId: person.staffId || "",
      username: person.username || "",
      password: "",
      department: person.department || "",
      role: person.role || "",
      status: person.status || "Active",
    });

    setShowStaffModal(true);
  }

  function closeStaffModal() {
    setShowStaffModal(false);
    setEditingStaff(null);
  }

  function saveStaff(event) {
    event.preventDefault();

    if (
      !staffForm.name.trim() ||
      !staffForm.staffId.trim() ||
      !staffForm.username.trim() ||
      !staffForm.department ||
      !staffForm.role
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingStaff) {
      setStaff((oldStaff) =>
        oldStaff.map((person) => {
          if (person.id !== editingStaff.id) {
            return person;
          }

          return {
            ...person,
            name: staffForm.name,
            staffId: staffForm.staffId,
            username: staffForm.username,
            password: staffForm.password
              ? staffForm.password
              : person.password,
            department: staffForm.department,
            role: staffForm.role,
            status: staffForm.status,
            permissions: rolePermissions[staffForm.role] || [],
          };
        })
      );
    } else {
      const newStaff = {
        id: Date.now(),
        name: staffForm.name,
        staffId: staffForm.staffId,
        username: staffForm.username,
        password: staffForm.password || "1234",
        department: staffForm.department,
        role: staffForm.role,
        status: staffForm.status,
        permissions: rolePermissions[staffForm.role] || [],
      };

      setStaff((oldStaff) => [...oldStaff, newStaff]);
    }

    closeStaffModal();
  }

  function openPermissions(person) {
    setSelectedStaff(person);
    setSelectedPermissions(person.permissions || []);
    setShowPermissionModal(true);
  }

  function togglePermission(permission) {
    setSelectedPermissions((oldPermissions) => {
      if (oldPermissions.includes(permission)) {
        return oldPermissions.filter(
          (item) => item !== permission
        );
      }

      return [...oldPermissions, permission];
    });
  }

  function savePermissions() {
    if (!selectedStaff) return;

    setStaff((oldStaff) =>
      oldStaff.map((person) => {
        if (person.id !== selectedStaff.id) {
          return person;
        }

        return {
          ...person,
          permissions: selectedPermissions,
        };
      })
    );

    if (currentUser && currentUser.id === selectedStaff.id) {
      setCurrentUser({
        ...currentUser,
        permissions: selectedPermissions,
      });
    }

    setShowPermissionModal(false);
    setSelectedStaff(null);
  }

  function deleteStaff(person) {
    if (person.role === "Super Admin") {
      alert("Ba za a iya goge Super Admin ba.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${person.name}?`
    );

    if (!confirmed) return;

    setStaff((oldStaff) =>
      oldStaff.filter((item) => item.id !== person.id)
    );
  }

  const filteredStaff = useMemo(() => {
    const text = search.toLowerCase();

    return staff.filter((person) =>
      `${person.name} ${person.staffId} ${person.username} ${person.department} ${person.role}`
        .toLowerCase()
        .includes(text)
    );
  }, [staff, search]);

  if (!currentUser) {
    return (
      <div className="login-page">
        <style>{styles}</style>

        <div className="login-card">
          <div className="login-logo">🏥</div>

          <h1>Bazza Primary Health Care</h1>

          <p className="login-subtitle">
            Sokoto North Local Government
          </p>

          <div className="login-line" />

          <h2>Staff Login</h2>

          <form onSubmit={login}>
            <label>Username</label>

            <input
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
            />

            {loginError && (
              <div className="error-box">
                {loginError}
              </div>
            )}

            <button className="primary-button" type="submit">
              Login
            </button>
          </form>

          <div className="demo-box">
            <strong>Demo Login</strong>
            <br />
            Username: admin
            <br />
            Password: 1234
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <style>{styles}</style>

      <aside className={sidebarOpen ? "sidebar" : "sidebar closed"}>
        <div className="brand">
          <div className="brand-icon">🏥</div>

          {sidebarOpen && (
            <div>
              <strong>Bazza PHC</strong>
              <small>Sokoto</small>
            </div>
          )}
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "menu-button active"
                  : "menu-button"
              }
              onClick={() => {
                setActivePage(item.name);
                setSidebarOpen(true);
              }}
            >
              <span>{item.icon}</span>

              {sidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        <button
          className="menu-button logout-button"
          onClick={logout}
        >
          <span>🚪</span>

          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div>
            <strong>{activePage}</strong>
          </div>

          <div className="user-box">
            <span className="online-dot">●</span>

            <div>
              <strong>{currentUser.name}</strong>
              <small>
                {currentUser.role} · {currentUser.department}
              </small>
            </div>
          </div>
        </header>

        <section className="content">
          {activePage === "Dashboard" && (
            <>
              <div className="welcome-card">
                <h1>
                  Welcome, {currentUser.name}
                </h1>

                <p>
                  Bazza Primary Health Care — Hospital
                  Management Dashboard
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>👥</span>
                  <small>Patients Today</small>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <span>🚶</span>
                  <small>Outpatients Today</small>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <span>🛏️</span>
                  <small>Inpatients</small>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <span>🟢</span>
                  <small>Staff Signed In</small>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <span>⏳</span>
                  <small>Pending Work</small>
                  <strong>0</strong>
                </div>

                <div className="stat-card">
                  <span>₦</span>
                  <small>Revenue Today</small>
                  <strong>₦0</strong>
                </div>
              </div>

              <div className="two-columns">
                <div className="panel">
                  <h2>Access Control</h2>

                  <div className="info-row">
                    <span>Department</span>
                    <strong>
                      {currentUser.department}
                    </strong>
                  </div>

                  <div className="info-row">
                    <span>Role</span>
                    <strong>{currentUser.role}</strong>
                  </div>

                  <div className="info-row block">
                    <span>Permissions</span>

                    <div className="tags">
                      {currentUser.permissions.map(
                        (permission) => (
                          <span key={permission}>
                            {permission}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <h2>System Status</h2>

                  <div className="status-row">
                    <span>System</span>
                    <strong className="green">
                      ● Online
                    </strong>
                  </div>

                  <div className="status-row">
                    <span>Department Separation</span>
                    <strong className="green">
                      ● Active
                    </strong>
                  </div>

                  <div className="status-row">
                    <span>Security</span>
                    <strong className="green">
                      ● Protected
                    </strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "Staff & Roles" &&
            currentUser.role === "Super Admin" && (
              <StaffManagement
                staff={filteredStaff}
                search={search}
                setSearch={setSearch}
                onAdd={openAddStaff}
                onEdit={openEditStaff}
                onDelete={deleteStaff}
                onPermissions={openPermissions}
              />
            )}

          {activePage === "Staff & Roles" &&
            currentUser.role !== "Super Admin" && (
              <ModulePage
                title="Staff & Roles"
                icon="👨‍⚕️"
                message="Wannan page na Super Admin ne kawai."
              />
            )}

          {activePage !== "Dashboard" &&
            activePage !== "Staff & Roles" && (
              <ModulePage
                title={activePage}
                icon={
                  menuItems.find(
                    (item) => item.name === activePage
                  )?.icon || "🏥"
                }
                message={`Wannan module na ${currentUser.department} ne.`}
              />
            )}
        </section>
      </main>

      {showStaffModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingStaff
                    ? "Edit Staff"
                    : "Add New Staff"}
                </h2>

                <p>
                  Create or update staff account.
                </p>
              </div>

              <button
                className="close-button"
                onClick={closeStaffModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveStaff}>
              <div className="form-grid">
                <div>
                  <label>Full Name *</label>

                  <input
                    value={staffForm.name}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Staff full name"
                  />
                </div>

                <div>
                  <label>Staff ID *</label>

                  <input
                    value={staffForm.staffId}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        staffId: event.target.value,
                      })
                    }
                    placeholder="e.g. BZ005"
                  />
                </div>

                <div>
                  <label>Username *</label>

                  <input
                    value={staffForm.username}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        username: event.target.value,
                      })
                    }
                    placeholder="Username"
                  />
                </div>

                <div>
                  <label>
                    {editingStaff
                      ? "New Password"
                      : "Password"}
                  </label>

                  <input
                    type="password"
                    value={staffForm.password}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        password: event.target.value,
                      })
                    }
                    placeholder={
                      editingStaff
                        ? "Leave blank to keep old password"
                        : "Password"
                    }
                  />
                </div>

                <div>
                  <label>Department *</label>

                  <select
                    value={staffForm.department}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        department: event.target.value,
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

                <div>
                  <label>Role *</label>

                  <select
                    value={staffForm.role}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        role: event.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select Role
                    </option>

                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Status</label>

                  <select
                    value={staffForm.status}
                    onChange={(event) =>
                      setStaffForm({
                        ...staffForm,
                        status: event.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeStaffModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingStaff
                    ? "Save Changes"
                    : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPermissionModal && selectedStaff && (
        <div className="modal-backdrop">
          <div className="modal small-modal">
            <div className="modal-header">
              <div>
                <h2>Manage Permissions</h2>

                <p>{selectedStaff.name}</p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowPermissionModal(false)
                }
              >
                ×
              </button>
            </div>

            <div className="permission-grid">
              {permissions.map((permission) => (
                <label
                  className="permission-item"
                  key={permission}
                >
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

            {selectedStaff.role === "Super Admin" && (
              <div className="security-note">
                Super Admin yana da dukkan permissions.
              </div>
            )}

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() =>
                  setShowPermissionModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={savePermissions}
                disabled={
                  selectedStaff.role === "Super Admin"
                }
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StaffManagement({
  staff,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
  onPermissions,
}) {
  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Staff & Roles</h1>
          <p>
            Manage staff accounts, departments and
            permissions.
          </p>
        </div>

        <button className="primary-button" onClick={onAdd}>
          + Add Staff
        </button>
      </div>

      <div className="panel">
        <div className="search-bar">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search name, Staff ID, username, department..."
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Staff ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Permissions</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((person) => (
                <tr key={person.id}>
                  <td>
                    <strong>{person.name}</strong>
                    <small className="table-small">
                      @{person.username}
                    </small>
                  </td>

                  <td>{person.staffId}</td>

                  <td>{person.department}</td>

                  <td>{person.role}</td>

                  <td>
                    <span
                      className={
                        person.status === "Active"
                          ? "status active-status"
                          : "status inactive-status"
                      }
                    >
                      {person.status}
                    </span>
                  </td>

                  <td>
                    <div className="permission-count">
                      {person.permissions.length} permissions
                    </div>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="small-button"
                        onClick={() =>
                          onPermissions(person)
                        }
                      >
                        Permissions
                      </button>

                      <button
                        className="small-button"
                        onClick={() => onEdit(person)}
                      >
                        Edit
                      </button>

                      <button
                        className="small-button danger"
                        onClick={() => onDelete(person)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {staff.length === 0 && (
            <div className="empty-state">
              No staff found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModulePage({ title, icon, message }) {
  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>
            {icon} {title}
          </h1>

          <p>{message}</p>
        </div>
      </div>

      <div className="panel module-panel">
        <div className="large-icon">{icon}</div>

        <h2>{title}</h2>

        <p>
          An shirya wannan module ne domin a
          ƙara cikakken tsarin aikin department.
        </p>

        <div className="security-note">
          🔐 Department Separation yana aiki.
        </div>
      </div>
    </div>
  );
}

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
  background: linear-gradient(135deg, #e8f5ee, #eef4ff);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.10);
}

.login-logo {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b7a45;
  color: white;
  font-size: 34px;
  margin-bottom: 18px;
}

.login-card h1 {
  margin: 0;
  font-size: 25px;
}

.login-subtitle {
  color: #657084;
  margin-top: 8px;
}

.login-line {
  height: 1px;
  background: #e4e8ef;
  margin: 24px 0;
}

.login-card h2 {
  margin-bottom: 20px;
}

.login-card label,
.modal label {
  display: block;
  font-weight: 700;
  font-size: 13px;
  margin: 14px 0 7px;
}

.login-card input,
.modal input,
.modal select,
.search-bar input {
  width: 100%;
  border: 1px solid #d9dfe8;
  border-radius: 10px;
  padding: 12px 13px;
  outline: none;
  background: white;
}

.login-card input:focus,
.modal input:focus,
.modal select:focus,
.search-bar input:focus {
  border-color: #0b7a45;
}

.primary-button {
  border: 0;
  border-radius: 10px;
  padding: 12px 18px;
  background: #0b7a45;
  color: white;
  font-weight: 700;
}

.primary-button:hover {
  opacity: .9;
}

.login-card .primary-button {
  width: 100%;
  margin-top: 18px;
}

.secondary-button {
  border: 1px solid #d5dbe5;
  border-radius: 10px;
  padding: 11px 18px;
  background: white;
  color: #273248;
  font-weight: 700;
}

.error-box {
  margin-top: 14px;
  background: #fff0f0;
  color: #b42318;
  padding: 11px;
  border-radius: 9px;
  font-size: 13px;
}

.demo-box {
  margin-top: 20px;
  background: #f4f7fb;
  border-radius: 10px;
  padding: 13px;
  font-size: 13px;
  color: #596579;
}

.app {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  width: 250px;
  background: #092d1d;
  color: white;
  min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: .2s;
}

.sidebar.closed {
  width: 76px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 8px 22px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  background: #0b7a45;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.brand strong,
.brand small {
  display: block;
}

.brand small {
  color: #b9d7c8;
  margin-top: 3px;
}

.sidebar nav {
  flex: 1;
}

.menu-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  color: #d7e8df;
  background: transparent;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 5px;
  text-align: left;
}

.menu-button:hover,
.menu-button.active {
  background: #0b7a45;
  color: white;
}

.logout-button {
  margin-top: 15px;
}

.main {
  flex: 1;
  min-width: 0;
}

.topbar {
  height: 72px;
  background: white;
  border-bottom: 1px solid #e5e9ef;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 24px;
}

.hamburger {
  border: 0;
  background: #f2f5f8;
  width: 40px;
  height: 40px;
  border-radius: 9px;
}

.user-box {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-box strong,
.user-box small {
  display: block;
}

.user-box small {
  color: #6b7485;
  margin-top: 3px;
}

.online-dot {
  color: #16a05d;
}

.content {
  padding: 26px;
  max-width: 1500px;
  margin: auto;
}

.welcome-card {
  background: linear-gradient(120deg, #0b7a45, #0f9656);
  color: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 20px;
}

.welcome-card h1 {
  margin: 0 0 8px;
}

.welcome-card p {
  margin: 0;
  opacity: .9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}

.stat-card {
  background: white;
  border: 1px solid #e4e9ef;
  border-radius: 14px;
  padding: 18px;
}

.stat-card span {
  font-size: 23px;
}

.stat-card small,
.stat-card strong {
  display: block;
}

.stat-card small {
  color: #6b7485;
  margin-top: 10px;
}

.stat-card strong {
  font-size: 23px;
  margin-top: 7px;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 18px;
}

.panel {
  background: white;
  border: 1px solid #e3e8ef;
  border-radius: 15px;
  padding: 20px;
}

.panel h2 {
  margin-top: 0;
}

.info-row,
.status-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 13px 0;
  border-bottom: 1px solid #edf0f4;
}

.info-row span,
.status-row span {
  color: #6c7586;
}

.info-row.block {
  display: block;
}

.info-row.block > span {
  display: block;
  margin-bottom: 10px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.tags span {
  background: #e8f6ef;
  color: #08743f;
  border-radius: 30px;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: 700;
}

.green {
  color: #078447;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.page-heading h1 {
  margin: 0;
}

.page-heading p {
  margin: 7px 0 0;
  color: #6a7485;
}

.search-bar {
  margin-bottom: 18px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

th,
td {
  text-align: left;
  padding: 13px 10px;
  border-bottom: 1px solid #edf0f4;
  vertical-align: middle;
}

th {
  background: #f7f9fb;
  font-size: 12px;
  color: #687286;
  text-transform: uppercase;
}

.table-small {
  display: block;
  color: #7b8493;
  margin-top: 4px;
  font-size: 12px;
}

.status {
  padding: 5px 9px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
}

.active-status {
  background: #e8f7ef;
  color: #087940;
}

.inactive-status {
  background: #fcecec;
  color: #a42b2b;
}

.permission-count {
  color: #596579;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.small-button {
  border: 1px solid #d9dfe7;
  background: white;
  border-radius: 7px;
  padding: 7px 9px;
  font-size: 12px;
}

.small-button:hover {
  background: #f4f7fa;
}

.small-button.danger {
  color: #b42318;
}

.empty-state {
  text-align: center;
  padding: 35px;
  color: #758094;
}

.module-panel {
  text-align: center;
  padding: 50px 20px;
}

.large-icon {
  font-size: 60px;
}

.module-panel h2 {
  margin-bottom: 8px;
}

.module-panel p {
  color: #6c7586;
}

.security-note {
  background: #eef8f3;
  color: #086f3e;
  padding: 12px;
  border-radius: 9px;
  margin-top: 18px;
  font-size: 13px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 17px;
  padding: 24px;
  box-shadow: 0 25px 80px rgba(0,0,0,.2);
}

.small-modal {
  max-width: 560px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 15px;
}

.modal-header h2 {
  margin: 0;
}

.modal-header p {
  margin: 5px 0 0;
  color: #727c8d;
}

.close-button {
  border: 0;
  background: #f1f4f7;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  font-size: 22px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 15px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.permission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.permission-item {
  display: flex !important;
  align-items: center;
  gap: 9px;
  padding: 12px;
  border: 1px solid #e0e5eb;
  border-radius: 9px;
  margin: 0 !important;
}

.permission-item input {
  width: auto !important;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 800px) {
  .sidebar {
    width: 76px;
  }

  .sidebar .brand div:last-child,
  .sidebar nav .menu-button span:last-child,
  .sidebar .logout-button span:last-child {
    display: none;
  }

  .content {
    padding: 16px;
  }

  .two-columns {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .permission-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    padding: 0 12px;
  }

  .user-box {
    display: none;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;

export default App;
