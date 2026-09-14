import React, { useMemo, useState } from "react";

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
  "In-Charge",
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

const allPermissions = [
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
    permissions: [
      "Dashboard",
      "Patients",
      "Departments",
      "Attendance",
      "Roster",
      "General Cashier",
      "Stock",
      "Wards & Beds",
      "Alerts",
      "SMS / Email",
      "Reports",
      "Audit Logs",
    ],
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
      "Dashboard",
      "Patients",
      "Stock",
      "Alerts",
      "SMS / Email",
      "Reports",
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
      "Dashboard",
      "Patients",
      "Stock",
      "Alerts",
      "SMS / Email",
      "Reports",
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
      "Dashboard",
      "Patients",
      "Stock",
      "Alerts",
      "SMS / Email",
      "Reports",
    ],
  },
  {
    id: 5,
    name: "Super Admin",
    staffId: "ADMIN001",
    username: "admin",
    password: "admin123",
    department: "Administration",
    role: "Super Admin",
    status: "Active",
    permissions: [...allPermissions],
  },
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

  const [staffForm, setStaffForm] = useState({
    name: "",
    staffId: "",
    username: "",
    password: "",
    department: "",
    role: "",
  });

  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  function handleLogin(e) {
    e.preventDefault();

    const foundUser = staff.find(
      (person) =>
        person.username.trim().toLowerCase() ===
          username.trim().toLowerCase() &&
        person.password === password &&
        person.status === "Active"
    );

    if (!foundUser) {
      setLoginError("Username/Staff ID ko Password ba daidai ba ne.");
      return;
    }

    setCurrentUser(foundUser);
    setActivePage("Dashboard");
    setLoginError("");
    setUsername("");
    setPassword("");
  }

  function handleLogout() {
    setCurrentUser(null);
    setActivePage("Dashboard");
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
    });

    setShowStaffModal(true);
  }

  function openEditStaff(person) {
    setEditingStaff(person);

    setStaffForm({
      name: person.name,
      staffId: person.staffId,
      username: person.username,
      password: "",
      department: person.department,
      role: person.role,
    });

    setShowStaffModal(true);
  }

  function saveStaff(e) {
    e.preventDefault();

    if (
      !staffForm.name ||
      !staffForm.staffId ||
      !staffForm.username ||
      !staffForm.department ||
      !staffForm.role
    ) {
      alert("Ka cika duk fields masu muhimmanci.");
      return;
    }

    if (!editingStaff && !staffForm.password) {
      alert("Ka saka password ga sabon staff.");
      return;
    }

    const duplicateStaffId = staff.some(
      (person) =>
        person.staffId.toLowerCase() === staffForm.staffId.toLowerCase() &&
        person.id !== editingStaff?.id
    );

    if (duplicateStaffId) {
      alert("Wannan Staff ID yana amfani.");
      return;
    }

    const duplicateUsername = staff.some(
      (person) =>
        person.username.toLowerCase() === staffForm.username.toLowerCase() &&
        person.id !== editingStaff?.id
    );

    if (duplicateUsername) {
      alert("Wannan Username yana amfani.");
      return;
    }

    if (editingStaff) {
      const updatedStaff = staff.map((person) =>
        person.id === editingStaff.id
          ? {
              ...person,
              name: staffForm.name,
              staffId: staffForm.staffId,
              username: staffForm.username,
              department: staffForm.department,
              role: staffForm.role,
              password: staffForm.password
                ? staffForm.password
                : person.password,
            }
          : person
      );

      setStaff(updatedStaff);

      if (currentUser?.id === editingStaff.id) {
        const updatedCurrentUser = updatedStaff.find(
          (person) => person.id === editingStaff.id
        );

        setCurrentUser(updatedCurrentUser);
      }
    } else {
      const newStaff = {
        id: Date.now(),
        name: staffForm.name,
        staffId: staffForm.staffId,
        username: staffForm.username,
        password: staffForm.password,
        department: staffForm.department,
        role: staffForm.role,
        status: "Active",
        permissions:
          staffForm.role === "Super Admin"
            ? [...allPermissions]
            : ["Dashboard"],
      };

      setStaff((previous) => [...previous, newStaff]);
    }

    setShowStaffModal(false);
    setEditingStaff(null);
  }

  function toggleStaffStatus(person) {
    const updatedStaff = staff.map((item) =>
      item.id === person.id
        ? {
            ...item,
            status: item.status === "Active" ? "Disabled" : "Active",
          }
        : item
    );

    setStaff(updatedStaff);
  }

  function resetPassword(person) {
    const newPassword = window.prompt(
      `Saka sabon password ga ${person.name}:`
    );

    if (!newPassword) return;

    const updatedStaff = staff.map((item) =>
      item.id === person.id
        ? {
            ...item,
            password: newPassword,
          }
        : item
    );

    setStaff(updatedStaff);

    alert(`An canza password na ${person.name}.`);
  }

  function openPermissions(person) {
    setSelectedStaff(person);
    setSelectedPermissions(person.permissions || []);
    setShowPermissions(true);
  }

  function togglePermission(permission) {
    setSelectedPermissions((previous) =>
      previous.includes(permission)
        ? previous.filter((item) => item !== permission)
        : [...previous, permission]
    );
  }

  function savePermissions() {
    if (!selectedStaff) return;

    const updatedStaff = staff.map((person) =>
      person.id === selectedStaff.id
        ? {
            ...person,
            permissions:
              person.role === "Super Admin"
                ? [...allPermissions]
                : selectedPermissions,
          }
        : person
    );

    setStaff(updatedStaff);

    if (currentUser?.id === selectedStaff.id) {
      const updatedCurrentUser = updatedStaff.find(
        (person) => person.id === selectedStaff.id
      );

      setCurrentUser(updatedCurrentUser);
    }

    setShowPermissions(false);
    setSelectedStaff(null);
  }

  const accessiblePages = useMemo(() => {
    if (!currentUser) return [];

    if (currentUser.role === "Super Admin") {
      return allPermissions;
    }

    return allPermissions.filter((page) =>
      currentUser.permissions?.includes(page)
    );
  }, [currentUser]);

  if (!currentUser) {
    return (
      <>
        <style>{styles}</style>

        <div className="login-screen">
          <div className="login-card">
            <div className="brand-mark">BPHC</div>

            <h1>BAZZA PHC</h1>

            <p className="subtitle">
              Hospital Management System
            </p>

            <form onSubmit={handleLogin}>
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
                <div className="error-box">{loginError}</div>
              )}

              <button className="login-button" type="submit">
                Sign In
              </button>
            </form>

            <div className="login-footer">
              <strong>24 Hours · 7 Days</strong>
              <span>Waziri Maccido Road, Bazza Area, Sokoto</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="small-logo">B</div>

            <div>
              <strong>BAZZA PHC</strong>
              <span>Hospital System</span>
            </div>
          </div>

          <div className="user-box">
            <div className="avatar">
              {currentUser.name.charAt(0)}
            </div>

            <div>
              <strong>{currentUser.name}</strong>
              <span>{currentUser.role}</span>
              <small>{currentUser.department}</small>
            </div>
          </div>

          <nav className="nav-menu">
            {accessiblePages.map((page) => (
              <button
                key={page}
                className={
                  activePage === page
                    ? "nav-button active"
                    : "nav-button"
                }
                onClick={() => setActivePage(page)}
              >
                {getIcon(page)}
                <span>{page}</span>
              </button>
            ))}
          </nav>

          <button className="logout-button" onClick={handleLogout}>
            Sign Out
          </button>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div>
              <h2>{activePage}</h2>
              <p>
                Bazza Primary Health Care Sokoto
              </p>
            </div>

            <div className="topbar-user">
              <strong>{currentUser.name}</strong>
              <span>{currentUser.staffId}</span>
            </div>
          </header>

          <div className="page-content">
            {activePage === "Dashboard" && (
              <Dashboard
                staff={staff}
                currentUser={currentUser}
              />
            )}

            {activePage === "Staff & Roles" &&
              currentUser.role === "Super Admin" && (
                <StaffManagement
                  staff={staff}
                  search={search}
                  setSearch={setSearch}
                  openAddStaff={openAddStaff}
                  openEditStaff={openEditStaff}
                  toggleStaffStatus={toggleStaffStatus}
                  resetPassword={resetPassword}
                  openPermissions={openPermissions}
                />
              )}

            {activePage !== "Dashboard" &&
              activePage !== "Staff & Roles" && (
                <ModulePlaceholder
                  title={activePage}
                  currentUser={currentUser}
                />
              )}
          </div>
        </main>
      </div>

      {showStaffModal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3>
                  {editingStaff
                    ? "Edit Staff"
                    : "Add New Staff"}
                </h3>

                <p>
                  Staff account and role information
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

            <form onSubmit={saveStaff}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Staff Full Name</label>

                  <input
                    value={staffForm.name}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter staff full name"
                  />
                </div>

                <div className="form-group">
                  <label>Staff ID</label>

                  <input
                    value={staffForm.staffId}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        staffId: e.target.value,
                      })
                    }
                    placeholder="Example: BZ005"
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>

                  <input
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
                      : "Password"}
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
                        ? "Leave blank to keep old password"
                        : "Enter password"
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Main Department</label>

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
                      Select department
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
                  <label>Role</label>

                  <select
                    value={staffForm.role}
                    onChange={(e) =>
                      setStaffForm({
                        ...staffForm,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select role
                    </option>

                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setShowStaffModal(false);
                    setEditingStaff(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary"
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

      {showPermissions && selectedStaff && (
        <div className="overlay">
          <div className="modal permission-modal">
            <div className="modal-header">
              <div>
                <h3>Staff Permissions</h3>

                <p>
                  {selectedStaff.name} ·{" "}
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

            {selectedStaff.role === "Super Admin" ? (
              <div className="info-box">
                Super Admin yana da cikakken system
                permissions.
              </div>
            ) : (
              <div className="permission-grid">
                {allPermissions.map((permission) => (
                  <label
                    className="permission-item"
                    key={permission}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(
                        permission
                      )}
                      onChange={() =>
                        togglePermission(permission)
                      }
                    />

                    <span>{permission}</span>
                  </label>
                ))}
              </div>
            )}

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
      )}
    </>
  );
}

function Dashboard({ staff, currentUser }) {
  const activeStaff = staff.filter(
    (person) => person.status === "Active"
  ).length;

  const departmentsCount = new Set(
    staff.map((person) => person.department)
  ).size;

  return (
    <div>
      <div className="welcome-card">
        <div>
          <span className="eyebrow">
            Welcome back
          </span>

          <h1>{currentUser.name}</h1>

          <p>
            {currentUser.role} ·{" "}
            {currentUser.department}
          </p>
        </div>

        <div className="status-pill">
          ● System Online
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Staff"
          value={staff.length}
          note="Registered staff accounts"
        />

        <StatCard
          title="Active Staff"
          value={activeStaff}
          note="Currently enabled accounts"
        />

        <StatCard
          title="Departments"
          value={departmentsCount}
          note="Departments represented"
        />

        <StatCard
          title="Pending Work"
          value="0"
          note="Module integration coming next"
        />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Hospital Overview</h3>
            <p>
              Bazza PHC management dashboard
            </p>
          </div>
        </div>

        <div className="overview-grid">
          <OverviewItem
            label="Patients Today"
            value="0"
          />

          <OverviewItem
            label="Outpatients"
            value="0"
          />

          <OverviewItem
            label="Laboratory Requests"
            value="0"
          />

          <OverviewItem
            label="Pharmacy Prescriptions"
            value="0"
          />

          <OverviewItem
            label="Ultrasound Requests"
            value="0"
          />

          <OverviewItem
            label="New Alerts"
            value="0"
          />
        </div>
      </div>
    </div>
  );
}

function StaffManagement({
  staff,
  search,
  setSearch,
  openAddStaff,
  openEditStaff,
  toggleStaffStatus,
  resetPassword,
  openPermissions,
}) {
  const filteredStaff = staff.filter((person) => {
    const query = search.trim().toLowerCase();

    return (
      person.name.toLowerCase().includes(query) ||
      person.staffId.toLowerCase().includes(query) ||
      person.username.toLowerCase().includes(query) ||
      person.department.toLowerCase().includes(query) ||
      person.role.toLowerCase().includes(query)
    );
  });

  const active = staff.filter(
    (person) => person.status === "Active"
  ).length;

  const disabled = staff.filter(
    (person) => person.status === "Disabled"
  ).length;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Staff & Roles</h1>

          <p>
            Create staff accounts, assign roles and
            manage permissions.
          </p>
        </div>

        <button
          className="primary"
          onClick={openAddStaff}
        >
          + Add New Staff
        </button>
      </div>

      <div className="stats-grid compact">
        <StatCard
          title="Total Staff"
          value={staff.length}
          note="All staff accounts"
        />

      const allPermissions = [const allPermissions = [  <StatCard
          title="Active Staff"
          value={active}
          note="Enabled accounts"
        />

        <StatCard
          title="Disabled"
          value={disabled}
          note="Disabled accounts"
        />

        <StatCard
          title="Departments"
          value={
            new Set(
              staff.map((person) => person.department)
            ).size
          }
          note="Departments represented"
        />
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <div>
            <h3>Staff Accounts</h3>

            <p>
              Search and manage registered staff.
            </p>
          </div>

          <input
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search staff, ID, role..."
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Staff ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="staff-cell">
                      <div className="mini-avatar">
                        {person.name.charAt(0)}
                      </div>

                      <div>
                        <strong>{person.name}</strong>
                        <span>@{person.username}</span>
                      </div>
                    </div>
                  </td>

                  <td>{person.staffId}</td>

                  <td>{person.department}</td>

                  <td>{person.role}</td>

                  <td>
                    <span
                      className={
                        person.status === "Active"
                          ? "status active-status"
                          : "status disabled-status"
                      }
                    >
                      {person.status}
                    </span>
                  </td>

                  <td>
                    <div className="actions">
                      <button
                        className="action-button"
                        onClick={() =>
                          openEditStaff(person)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="action-button"
                        onClick={() =>
                          openPermissions(person)
                        }
                      >
                        Permissions
                      </button>

                      <button
                        className="action-button"
                        onClick={() =>
                          resetPassword(person)
                        }
                      >
                        Password
                      </button>

                      <button
                        className="action-button"
                        onClick={() =>
                          toggleStaffStatus(person)
                        }
                      >
                        {person.status === "Active"
                          ? "Disable"
                          : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-cell"
                  >
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

function ModulePlaceholder({ title, currentUser }) {
  return (
    <div className="panel module-placeholder">
      <div className="module-icon">
        {getIcon(title)}
      </div>

      <h2>{title}</h2>

      <p>
        Wannan module yana cikin tsarin Bazza PHC kuma
        yanzu ya shirya domin mu fara gina aikin sa.
      </p>

      <div className="permission-note">
        Logged in as:{" "}
        <strong>{currentUser.role}</strong>
      </div>
    </div>
  );
}

function StatCard({ title, value, note }) {
  return (
    <div className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function OverviewItem({ label, value }) {
  return (
    <div className="overview-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getIcon(page) {
  const icons = {
    Dashboard: "▦",
    Patients: "👥",
    Departments: "🏥",
    "Staff & Roles": "🧑‍⚕️",
    Attendance: "🕒",
    Roster: "📅",
    "General Cashier": "💳",
    Stock: "📦",
    "Wards & Beds": "🛏️",
    Alerts: "🔔",
    "SMS / Email": "✉️",
    Reports: "📊",
    "Audit Logs": "📋",
    Settings: "⚙️",
  };

  return icons[page] || "•";
}
function Attendance({ staff, currentUser }) {
  const [attendance, setAttendance] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const todayRecord = attendance.find(
    (item) =>
      item.staffId === currentUser.staffId &&
      item.date === today
  );

  function signIn() {
    if (todayRecord?.signIn) {
      alert("Ka riga ka yi Sign In yau.");
      return;
    }

    const now = new Date();

    const record = {
      id: Date.now(),
      staffId: currentUser.staffId,
      staffName: currentUser.name,
      department: currentUser.department,
      role: currentUser.role,
      date: today,
      shift: "Morning",
      signIn: now.toLocaleTimeString(),
      signOut: "",
      status: "Present",
    };

    setAttendance((previous) => [
      ...previous,
      record,
    ]);
  }

  function signOut() {
    if (!todayRecord?.signIn) {
      alert("Sai ka yi Sign In kafin Sign Out.");
      return;
    }

    if (todayRecord.signOut) {
      alert("Ka riga ka yi Sign Out yau.");
      return;
    }

    setAttendance((previous) =>
      previous.map((item) =>
        item.id === todayRecord.id
          ? {
              ...item,
              signOut: new Date().toLocaleTimeString(),
            }
          : item
      )
    );
  }

  const myAttendance = attendance.filter(
    (item) => item.staffId === currentUser.staffId
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Staff Attendance</h1>

          <p>
            Sign In, Sign Out da attendance history.
          </p>
        </div>

        <div className="status-pill">
          {todayRecord?.signOut
            ? "Signed Out"
            : todayRecord?.signIn
            ? "Signed In"
            : "Not Signed In"}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Today"
          value={todayRecord ? "Present" : "—"}
          note="Attendance status"
        />

        <StatCard
          title="Sign In"
          value={todayRecord?.signIn || "—"}
          note="Today's sign-in time"
        />

        <StatCard
          title="Sign Out"
          value={todayRecord?.signOut || "—"}
          note="Today's sign-out time"
        />

        <StatCard
          title="Total Records"
          value={myAttendance.length}
          note="Your attendance records"
        />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Today's Attendance</h3>

            <p>
              {currentUser.name} ·{" "}
              {currentUser.department}
            </p>
          </div>

          <div className="attendance-actions">
            <button
              className="primary"
              onClick={signIn}
              disabled={Boolean(todayRecord?.signIn)}
            >
              ✓ Sign In
            </button>

            <button
              className="secondary"
              onClick={signOut}
              disabled={
                !todayRecord?.signIn ||
                Boolean(todayRecord?.signOut)
              }
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Staff</th>
                <th>Department</th>
                <th>Shift</th>
                <th>Sign In</th>
                <th>Sign Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {myAttendance.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.staffName}</td>
                  <td>{item.department}</td>
                  <td>{item.shift}</td>
                  <td>{item.signIn || "—"}</td>
                  <td>{item.signOut || "—"}</td>
                  <td>
                    <span className="status active-status">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}

              {myAttendance.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="empty-cell"
                  >
                    Babu attendance record tukuna.
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
const styles = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, Arial, Helvetica, sans-serif;
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

.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, #e8f3ff, transparent 35%),
    radial-gradient(circle at bottom right, #e8f8ef, transparent 35%),
    #f6f8fb;
}

.login-card {
  width: 100%;
  max-width: 430px;
  background: white;
  border-radius: 24px;
  padding: 34px;
  box-shadow: 0 20px 60px rgba(22, 35, 60, 0.12);
}

.brand-mark {
  width: 66px;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: #0e65d7;
  color: white;
  font-weight: 800;
  margin-bottom: 20px;
}

.login-card h1 {
  margin: 0;
  font-size: 30px;
}

.subtitle {
  color: #6f788a;
  margin-top: 8px;
  margin-bottom: 28px;
}

.login-card label,
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-card input,
.form-group input,
.form-group select,
.search-input {
  width: 100%;
  border: 1px solid #dce2eb;
  border-radius: 11px;
  padding: 12px 13px;
  outline: none;
  background: white;
}

.login-card input {
  margin-bottom: 16px;
}

.login-card input:focus,
.form-group input:focus,
.form-group select:focus,
.search-input:focus {
  border-color: #0e65d7;
  box-shadow: 0 0 0 3px rgba(14, 101, 215, 0.08);
}

.login-button,
.primary {
  border: none;
  background: #0e65d7;
  color: white;
  border-radius: 10px;
  padding: 12px 18px;
  font-weight: 700;
}

.login-button {
  width: 100%;
  margin-top: 4px;
}

.secondary {
  border: 1px solid #d9dfe8;
  background: white;
  color: #283248;
  border-radius: 10px;
  padding: 11px 17px;
  font-weight: 700;
}

.error-box {
  background: #fff0f0;
  color: #b52929;
  border: 1px solid #ffd3d3;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 14px;
  font-size: 13px;
}

.login-footer {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #edf0f5;
  color: #7c8494;
  font-size: 12px;
}

.login-footer strong {
  color: #2f3a50;
}

.app-shell {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  width: 265px;
  background: #101a2d;
  color: white;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 22px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.small-logo {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #2b7de9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
}

.sidebar-brand strong,
.sidebar-brand span {
  display: block;
}

.sidebar-brand span {
  color: #95a0b8;
  font-size: 11px;
  margin-top: 3px;
}

.user-box {
  display: flex;
  gap: 11px;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.avatar {
  min-width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #203150;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.user-box strong,
.user-box span,
.user-box small {
  display: block;
}

.user-box span {
  font-size: 12px;
  color: #aec2df;
  margin-top: 3px;
}

.user-box small {
  font-size: 10px;
  color: #7d8ca5;
  margin-top: 2px;
}

.nav-menu {
  padding: 12px;
  overflow-y: auto;
  flex: 1;
}

.nav-button {
  width: 100%;
  display: flex;
  gap: 11px;
  align-items: center;
  border: none;
  background: transparent;
  color: #b7c0d1;
  border-radius: 9px;
  padding: 11px 12px;
  margin-bottom: 4px;
  text-align: left;
}

.nav-button:hover {
  background: rgba(255,255,255,0.06);
  color: white;
}

.nav-button.active {
  background: #1768d4;
  color: white;
}

.logout-button {
  margin: 14px;
  padding: 11px 12px;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.13);
  background: transparent;
  color: #d9e0eb;
}

.main-area {
  margin-left: 265px;
  width: calc(100% - 265px);
}

.topbar {
  height: 82px;
  background: white;
  border-bottom: 1px solid #e9edf3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar h2 {
  margin: 0;
  font-size: 20px;
}

.topbar p {
  margin: 4px 0 0;
  color: #8690a2;
  font-size: 12px;
}

.topbar-user {
  text-align: right;
}

.topbar-user strong,
.topbar-user span {
  display: block;
}

.topbar-user span {
  color: #8a94a4;
  font-size: 12px;
  margin-top: 4px;
}

.page-content {
  padding: 28px;
}

.welcome-card {
  background: linear-gradient(135deg, #1065d7, #0e83bf);
  color: white;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 12px 30px rgba(16, 101, 215, 0.18);
}

.welcome-card h1 {
  margin: 7px 0 6px;
  font-size: 28px;
}

.welcome-card p {
  margin: 0;
  color: rgba(255,255,255,0.82);
}

.eyebrow {
  font-size: 12px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-pill {
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 999px;
  padding: 9px 13px;
  font-size: 12px;
}

.stats-grid {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stats-grid.compact {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border: 1px solid #e7ebf1;
  border-radius: 15px;
  padding: 19px;
}

.stat-card span,
.stat-card strong,
.stat-card small {
  display: block;
}

.stat-card span {
  color: #7e8899;
  font-size: 12px;
}

.stat-card strong {
  font-size: 27px;
  margin: 7px 0 7px;
}

.stat-card small {
  color: #9aa2b0;
  font-size: 11px;
}

.panel {
  background: white;
  border: 1px solid #e7ebf1;
  border-radius: 16px;
  margin-top: 22px;
  padding: 20px;
}

.panel-heading,
.table-toolbar,
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.panel-heading h3,
.table-toolbar h3,
.page-head h1 {
  margin: 0;
}

.panel-heading p,
.table-toolbar p,
.page-head p {
  margin: 5px 0 0;
  color: #8892a2;
  font-size: 12px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 18px;
}

.overview-item {
  background: #f7f9fc;
  border-radius: 12px;
  padding: 16px;
}

.overview-item span,
.overview-item strong {
  display: block;
}

.overview-item span {
  color: #8791a2;
  font-size: 12px;
}

.overview-item strong {
  font-size: 23px;
  margin-top: 6px;
}

.search-input {
  max-width: 270px;
}

.table-wrap {
  overflow-x: auto;
  margin-top: 18px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

th,
td {
  padding: 13px 12px;
  border-bottom: 1px solid #eef1f5;
  text-align: left;
  font-size: 13px;
}

th {
  color: #6d7789;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.staff-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-avatar {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: #edf4fe;
  color: #1768d4;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
}

.staff-cell strong,
.staff-cell span {
  display: block;
}

.staff-cell span {
  color: #8b94a4;
  font-size: 11px;
  margin-top: 3px;
}

.status {
  display: inline-flex;
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 11px;
  font-weight: 700;
}

.active-status {
  background: #e9f8ef;
  color: #188347;
}

.disabled-status {
  background: #fff0f0;
  color: #bb3434;
}

.actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.action-button {
  border: 1px solid #dce3ec;
  background: white;
  color: #344055;
  border-radius: 8px;
  padding: 7px 9px;
  font-size: 11px;
}

.action-button:hover {
  background: #f5f7fa;
}

.empty-cell {
  text-align: center;
  color: #929aaa;
  padding: 30px;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 35, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
}

.permission-modal {
  max-width: 720px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf0f4;
  margin-bottom: 19px;
}

.modal-header h3 {
  margin: 0;
}

.modal-header p {
  margin: 5px 0 0;
  color: #8a93a2;
  font-size: 12px;
}

.close-button {
  border: none;
  background: #f1f4f8;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 21px;
  line-height: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  min-width: 0;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 11px;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px;
  border: 1px solid #e5e9ef;
  border-radius: 10px;
  font-size: 13px;
}

.permission-item input {
  width: 17px;
  height: 17px;
}

.info-box {
  background: #eef6ff;
  border: 1px solid #d2e7ff;
  color: #1557a1;
  border-radius: 11px;
  padding: 13px;
  font-size: 13px;
}

.module-placeholder {
  text-align: center;
  padding: 55px 24px;
}

.module-icon {
  font-size: 42px;
  margin-bottom: 14px;
}

.module-placeholder h2 {
  margin: 0;
}

.module-placeholder p {
  max-width: 600px;
  margin: 10px auto;
  color: #7e8899;
  line-height: 1.6;
}

.permission-note {
  display: inline-block;
  margin-top: 14px;
  background: #f1f5fa;
  border-radius: 9px;
  padding: 10px 14px;
  color: #596477;
  font-size: 12px;
}

@media (max-width: 1050px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .sidebar {
    width: 210px;
  }

  .main-area {
    margin-left: 210px;
    width: calc(100% - 210px);
  }

  .page-content {
    padding: 18px;
  }

  .topbar {
    padding: 0 18px;
  }

  .form-grid,
  .permission-grid,
  .stats-grid,
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .welcome-card,
  .page-head,
  .table-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .search-input {
    max-width: none;
  }
}

@media (max-width: 560px) {
  .sidebar {
    position: static;
    width: 100%;
    min-height: auto;
  }

  .app-shell {
    display: block;
  }

  .main-area {
    margin-left: 0;
    width: 100%;
  }

  .nav-menu {
    max-height: 300px;
  }

  .topbar {
    position: static;
  }
}
`;

export default App;
