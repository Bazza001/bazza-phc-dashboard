import React, { useState } from "react";

const departments = [
  "ICT Centre",
  "Records Unit",
  "Nursing Unit",
  "Consultant Room",
  "Laboratory Unit",
  "Pharmacy Unit",
  "Ultrasound Room",
  "Male Ward",
  "Female Ward",
  "Maternity Ward",
  "Child Ward",
  "Labour Room",
  "Immunization Unit",
  "Family Planning Unit",
  "Adolescent Unit",
  "General Cashier",
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
    permissions: ["View", "Print", "Reports", "Alerts"],
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
    permissions: [
      "View",
      "Create",
      "Edit",
      "Print",
      "Stock",
      "SMS",
      "Alerts",
    ],
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
    permissions: [
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
    permissions: [
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
  },
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
    "SMS",
    "Alerts",
  ],

  Consultant: [
    "View",
    "Create",
    "Edit",
    "Print",
    "Reports",
    "SMS",
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
    "Reports",
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
  const [showStaffModal, setShowStaffModal] = useState(false);

const [editingStaff, setEditingStaff] = useState(null);

const [staffForm, setStaffForm] = useState({
  fullName: "",
  staffId: "",
  username: "",
  password: "",
  department: "",
  role: "",
});
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  function login(e) {
    e.preventDefault();

    const user = staff.find(
      (item) =>
        item.username.toLowerCase() === username.toLowerCase() &&
        item.password === password
    );

    if (!user) {
      setLoginError("Username ko Password ba daidai ba.");
      return;
    }

    if (user.status !== "Active") {
      setLoginError("An kashe wannan Staff Account.");
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
  }

  function hasPermission(permission) {
    if (!currentUser) return false;

    if (currentUser.role === "Super Admin") {
      return true;
    }

    return currentUser.permissions.includes(permission);
  }

  function openPermissions(person) {
    setSelectedStaff(person);
    setSelectedPermissions(person.permissions || []);
    setShowPermissions(true);
  }

  function togglePermission(permission) {
    setSelectedPermissions((old) =>
      old.includes(permission)
        ? old.filter((item) => item !== permission)
        : [...old, permission]
    );
  }
function savePermissions() {
  if (!selectedStaff) return;

  const updatedStaff = staff.map((person) =>
    person.id === selectedStaff.id
      ? {
          ...person,
          permissions: selectedPermissions,
        }
      : person
  );

  setStaff(updatedStaff);

  if (currentUser && currentUser.id === selectedStaff.id) {
    setCurrentUser({
      ...currentUser,
      permissions: selectedPermissions,
    });
  }

  setShowPermissions(false);
  setSelectedStaff(null);
}

function openAddStaff() {
  setEditingStaff(null);

  setStaffForm({
    fullName: "",
    staffId: "",
    username: "",
    password: "",
    department: "",
    role: "",
  });

  setShowStaffModal(true);
}

function openEditStaff(person) {
  setEditingStaff(person);

  setStaffForm({
    fullName: person.fullName || "",
    staffId: person.staffId || "",
    username: person.username || "",
    password: "",
    department: person.department || "",
    role: person.role || "",
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
    alert("Please fill all required fields.");
    return;
  }

  if (editingStaff) {
    const updatedStaff = staff.map((person) =>
      person.id === editingStaff.id
        ? {
            ...person,
            name: staffForm.fullName,
            staffId: staffForm.staffId,
            username: staffForm.username,
            department: staffForm.department,
            role: staffForm.role,
            ...(staffForm.password
              ? { password: staffForm.password }
              : {}),
          }
        : person
    );

    setStaff(updatedStaff);
  } else {
    const newStaff = {
      id: Date.now(),
      name: staffForm.fullName,
      staffId: staffForm.staffId,
      username: staffForm.username,
      password: staffForm.password || "123456",
      department: staffForm.department,
      role: staffForm.role,
      status: "Active",
      permissions: [],
    };

    setStaff([...staff, newStaff]);
  }

  setShowStaffModal(false);
  setEditingStaff(null);

  setStaffForm({
    fullName: "",
    staffId: "",
    username: "",
    password: "",
    department: "",
    role: "",
  });
}
  const accessiblePages = [
    "Dashboard",
    ...(currentUser?.role === "Super Admin"
      ? [
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
        ]
      : []),
  ];

  if (currentUser && currentUser.role !== "Super Admin") {
    if (currentUser.department) {
      accessiblePages.push(currentUser.department);
    }

    if (hasPermission("Cashier")) {
      accessiblePages.push("Cashier");
    }

    if (hasPermission("Stock")) {
      accessiblePages.push("Stock");
    }

    if (hasPermission("Reports")) {
      accessiblePages.push("Reports");
    }

    if (hasPermission("SMS")) {
      accessiblePages.push("SMS");
    }

    if (hasPermission("Alerts")) {
      accessiblePages.push("Alerts");
    }
  }

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

  if (!loggedIn) {
    return (
      <div className="login-page">
        <style>{loginStyles}</style>

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
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />

            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}

            <button className="login-button">
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

          <div className="demo">
            <strong>Demo Login</strong>
            <br />
            Super Admin: <b>altini / 1234</b>
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

  return (
    <div className="app">
      <style>{dashboardStyles}</style>

      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">B</div>

          <h2>BAZZA PHC</h2>

          <p>Hospital Management System</p>
        </div>

        <div className="user-info">
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role}</span>
          <small>{currentUser.department}</small>
        </div>

        <nav className="menu">
          {accessiblePages.map((page) => (
            <button
              key={page}
              className={
                activePage === page ? "active" : ""
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

        <button className="logout" onClick={logout}>
          🚪 Sign Out
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button
              className="mobile-menu"
              onClick={() =>
                setMobileMenu(!mobileMenu)
              }
            >
              ☰
            </button>

            <strong>{activePage}</strong>
          </div>

          <div className="top-user">
            <span>🟢 Online</span>

            <div>
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role}</small>
            </div>

            <div className="avatar">
              {currentUser.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>
        </header>

        <section className="content">
          {activePage === "Dashboard" && (
            <>
              <div className="welcome">
                <h1>
                  Welcome, {currentUser.name}
                </h1>

                <p>
                  {currentUser.role} ·{" "}
                  {currentUser.department}
                </p>
              </div>

              <div className="stats">
                <div className="stat">
                  <span>👥</span>
                  <small>Patients Today</small>
                  <strong>0</strong>
                </div>

                <div className="stat">
                  <span>⏳</span>
                  <small>Pending Work</small>
                  <strong>0</strong>
                </div>

                <div className="stat">
                  <span>✅</span>
                  <small>Completed</small>
                  <strong>0</strong>
                </div>

                <div className="stat">
                  <span>🔔</span>
                  <small>Alerts</small>
                  <strong>0</strong>
                </div>
              </div>

              <div className="card">
                <h2>Access Control</h2>

                <p>
                  Wannan account yana aiki ne a cikin:
                </p>

                <div className="access-box">
                  <strong>Department</strong>
                  <span>{currentUser.department}</span>
                </div>

                <div className="access-box">
                  <strong>Role</strong>
                  <span>{currentUser.role}</span>
                </div>

                <div className="access-box">
                  <strong>Permissions</strong>

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
            </>
          )}

          {activePage === "Staff & Roles" &&
            currentUser.role === "Super Admin" && (
              <StaffManagement
                staff={staff}
                search={search}
                setSearch={setSearch}
                openPermissions={openPermissions}
              />
            )}

          {activePage !== "Dashboard" &&
            activePage !== "Staff & Roles" && (
              <div className="card module">
                <div className="module-icon">
                  {menuIcons[activePage] || "🏥"}
                </div>

                <h1>{activePage}</h1>

                <p>
                  Wannan module an ware shi ne domin{" "}
                  <strong>
                    {currentUser.department}
                  </strong>
                  .
                </p>

                <div className="module-rule">
                  🔐 Department Separation yana aiki.
                  <br />
                  Wannan user ba zai iya ganin aikin
                  wasu departments ba sai idan an ba shi
                  izini.
                </div>

                {hasPermission("View") && (
                  <button className="primary">
                    Open {activePage}
                  </button>
                )}
              </div>
            )}
        </section>
      </main>

      {showPermissions && selectedStaff && (
        <div className="overlay">
          <div className="modal">
            <h2>Manage Permissions</h2>

            <p>
              <strong>{selectedStaff.name}</strong>
            </p>

            <p className="muted">
              {selectedStaff.department} ·{" "}
              {selectedStaff.role}
            </p>

            <div className="permission-list">
              {permissions.map((permission) => (
                <label key={permission}>
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(
                      permission
                    )}
                    onChange={() =>
                      togglePermission(permission)
                    }
                    disabled={
                      selectedStaff.role ===
                      "Super Admin"
                    }
                  />

                  <span>{permission}</span>
                </label>
              ))}
            </div>

            <div className="security-note">
              🔐 Super Admin ne kawai zai iya
              canza permissions.
              <br />
              Department staff ba zai iya ba kansa
              sabon permission ba.
            </div>

            <div className="modal-buttons">
  <button
    className="secondary"
    onClick={() => {
      setShowPermissions(false);
      setSelectedStaff(null);
    }}
  >
    Cancel
  </button>

  <button
    className="primary"
    onClick={savePermissions}
  >
    Save Permissions
  </button>
</div>
    
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
  openPermissions,
  openAddStaff,
  openEditStaff,
  showStaffModal,
  editingStaff,
  staffForm,
  setStaffForm,
  setShowStaffModal,
  setEditingStaff,
  saveStaff,
}) {
  const filtered = staff.filter((person) =>
    `${person.name} ${person.staffId} ${person.department} ${person.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Staff & Roles</h1>
          <p>
            Manage staff access and permissions.
          </p>{showStaffModal && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h2>
          {editingStaff ? "Edit Staff" : "Add New Staff"}
        </h2>

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
            type="text"
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
            type="text"
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
            type="text"
            value={staffForm.username}
            onChange={(e) =>
              setStaffForm({
                ...staffForm,
                username: e.target.value,
              })
            }
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label>
            {editingStaff
              ? "New Password (optional)"
              : "Initial Password"}
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
                ? "Leave blank to keep current password"
                : "Enter password"
            }
          />
        </div>

        <div className="form-group">
          <label>Main Department *</label>

          <select
            value={staffForm.department}
            onChange={(e) =>
              setStaffForm({
                ...staffForm,
                department: e.target.value,
              })
            }
          >
            <option value="">Select Department</option>

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
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="modal-buttons">

        <button
          className="secondary"
          onClick={() => {
            setShowStaffModal(false);
            setEditingStaff(null);
          }}
        >
          Cancel
        </button>

        <button
          className="primary"
          onClick={saveStaff}
        >
          {editingStaff ? "Update Staff" : "Save Staff"}
        </button>

      </div>
    </div>
  </div>
)}
        </div>

        <button className="primary" onClick={openAddStaff}>
  + Add New Staff
</button>
        
  className="action"
  onClick={() => openEditStaff(person)}
>
  ✏️ Edit
</button>

<button
  className="action"
  onClick={() => openPermissions(person)}
>
  🔐 Permissions
</button>
      </div>

      <div className="card">
        <input
          className="search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search staff..."
        />
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Staff ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((person) => (
                <tr key={person.id}>
                  <td>
                    <strong>{person.name}</strong>
                  </td>

                  <td>{person.staffId}</td>

                  <td>{person.department}</td>

                  <td>{person.role}</td>

                  <td>
                    <div className="tags">
                      {person.permissions.map(
                        (permission) => (
                          <span key={permission}>
                            {permission}
                          </span>
                        )
                      )}
                    </div>
                  </td>

                  <td>
                    <span className="active-badge">
                      {person.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="action"
                      onClick={() =>
                        openPermissions(person)
                      }
                    >
                      🔐 Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const loginStyles = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.login-page {
  min-height: 100vh;
  background: #f1f6f3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 430px;
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 15px 50px rgba(0,0,0,.08);
  text-align: center;
}

.logo {
  width: 65px;
  height: 65px;
  border-radius: 18px;
  background: #28553f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  font-size: 35px;
  font-weight: bold;
}

.login-card h1 {
  color: #28553f;
  margin: 15px 0 5px;
}

.subtitle {
  color: #718078;
  margin-bottom: 30px;
}

.login-card form {
  text-align: left;
}

.login-card label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  margin: 15px 0 7px;
}

.login-card input {
  width: 100%;
  padding: 13px;
  border: 1px solid #d9e3dd;
  border-radius: 9px;
  outline: none;
}

.login-button {
  width: 100%;
  margin-top: 20px;
  padding: 13px;
  border: 0;
  border-radius: 9px;
  background: #28553f;
  color: white;
  font-weight: bold;
}

.login-error {
  margin-top: 12px;
  padding: 10px;
  background: #fbecec;
  color: #a33b3b;
  border-radius: 8px;
  font-size: 13px;
}

.login-footer {
  margin-top: 25px;
  color: #69766f;
  font-size: 12px;
  line-height: 1.7;
}

.demo {
  margin-top: 20px;
  padding: 12px;
  background: #eef5f1;
  border-radius: 9px;
  font-size: 11px;
  line-height: 1.7;
  color: #526159;
}
`;

const dashboardStyles = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f7f5;
  color: #1c2922;
}

.app {
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: #244f3d;
  color: white;
  overflow-y: auto;
  z-index: 50;
}

.brand {
  padding: 24px;
  border-bottom: 1px solid rgba(255,255,255,.12);
}

.brand-logo {
  width: 45px;
  height: 45px;
  background: white;
  color: #244f3d;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
}

.brand h2 {
  margin: 0;
}

.brand p {
  margin: 5px 0;
  font-size: 12px;
  color: #cfe1d7;
}

.user-info {
  padding: 18px;
  border-bottom: 1px solid rgba(255,255,255,.1);
}

.user-info strong,
.user-info span,
.user-info small {
  display: block;
}

.user-info span {
  margin-top: 4px;
  color: #cfe1d7;
  font-size: 12px;
}

.user-info small {
  margin-top: 3px;
  color: #a9c5b5;
  font-size: 11px;
}

.menu {
  padding: 12px;
}

.menu button,
.logout {
  width: 100%;
  border: 0;
  background: transparent;
  color: white;
  padding: 11px 12px;
  border-radius: 9px;
  text-align: left;
  margin: 2px 0;
}

.menu button:hover,
.menu button.active {
  background: #315f4b;
}

.menu button span {
  width: 28px;
  display: inline-block;
}

.logout {
  margin: 15px 12px;
  width: calc(100% - 24px);
  background: #a44a4a;
}

.main {
  margin-left: 260px;
  min-height: 100vh;
}

.topbar {
  height: 70px;
  background: white;
  border-bottom: 1px solid #e1e8e3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 20;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 19px;
}

.mobile-menu {
  display: none;
  border: 0;
  background: #edf3ef;
  padding: 8px 11px;
  border-radius: 7px;
}

.top-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.top-user span {
  color: #2a7950;
  font-size: 12px;
}

.top-user small {
  display: block;
  color: #748079;
  font-size: 11px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #315f4b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.content {
  padding: 28px;
}

.welcome,
.card,
.table-card,
.stat {
  background: white;
  border: 1px solid #e0e8e3;
  border-radius: 15px;
}

.welcome {
  padding: 24px;
  margin-bottom: 20px;
}

.welcome h1 {
  margin: 0 0 7px;
}

.welcome p {
  margin: 0;
  color: #718078;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat {
  padding: 18px;
}

.stat span {
  font-size: 24px;
}

.stat small {
  display: block;
  color: #718078;
  margin-top: 10px;
}

.stat strong {
  display: block;
  font-size: 25px;
  margin-top: 5px;
}

.card {
  padding: 22px;
  margin-bottom: 20px;
}

.access-box {
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  padding: 13px;
  background: #f2f6f3;
  border-radius: 9px;
  margin: 5px;
}

.access-box strong {
  font-size: 12px;
  color: #69766f;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tags span {
  background: #e8f2ec;
  color: #315f4b;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 11px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.page-head h1 {
  margin: 0;
}

.page-head p {
  color: #718078;
}

.primary {
  background: #315f4b;
  color: white;
  border: 0;
  border-radius: 9px;
  padding: 11px 15px;
  font-weight: bold;
}

.secondary {
  background: white;
  border: 1px solid #d7e0da;
  padding: 10px 15px;
  border-radius: 9px;
}

.search {
  width: 100%;
  border: 1px solid #d7e0da;
  padding: 12px;
  border-radius: 9px;
  outline: none;
}

.table-card {
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

th,
td {
  padding: 14px;
  border-bottom: 1px solid #edf1ee;
  text-align: left;
  font-size: 13px;
}

th {
  background: #f7faf8;
  color: #69766f;
  font-size: 11px;
  text-transform: uppercase;
}

.active-badge {
  background: #e8f4ec;
  color: #28744c;
  padding: 5px 9px;
  border-radius: 15px;
  font-size: 11px;
}

.action {
  background: white;
  border: 1px solid #d6e0d9;
  border-radius: 7px;
  padding: 8px 10px;
}

.module {
  text-align: center;
  padding: 50px 25px;
}

.module-icon {
  font-size: 45px;
}

.module-rule {
  max-width: 550px;
  margin: 20px auto;
  padding: 15px;
  background: #eef5f1;
  border-radius: 9px;
  color: #536159;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
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
  border-radius: 16px;
  padding: 25px;
  max-height: 90vh;
  overflow-y: auto;
}

.muted {
  color: #718078;
}

.permission-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.permission-list label {
  border: 1px solid #dce5df;
  padding: 13px;
  border-radius: 9px;
  display: flex;
  gap: 10px;
}

.security-note {
  margin-top: 20px;
  padding: 14px;
  background: #eef5f1;
  border-radius: 9px;
  font-size: 12px;
  color: #526159;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media(max-width: 850px) {
  .sidebar {
    transform: translateX(-100%);
    transition: .2s;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main {
    margin-left: 0;
  }

  .mobile-menu {
    display: block;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .top-user span {
    display: none;
  }
}

@media(max-width: 600px) {
  .content {
    padding: 15px;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .top-user div:nth-child(2) {
    display: none;
  }

  .permission-list {
    grid-template-columns: 1fr;
  }

  .page-head {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;

export default App;
