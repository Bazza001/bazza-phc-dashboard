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
    name: "Altini Garba Bazza",
    staffId: "BZ001",
    department: "Hospital Management",
    role: "In-Charge",
    username: "altini",
    status: "Active",
  },
  {
    id: 2,
    name: "Hadiza Umar",
    staffId: "BZ002",
    department: "Pharmacy Unit",
    role: "Pharmacy Staff",
    username: "hadiza",
    status: "Active",
  },
  {
    id: 3,
    name: "Abba Yaro",
    staffId: "BZ003",
    department: "Ultrasound Room",
    role: "Ultrasound Staff",
    username: "abbayaro",
    status: "Active",
  },
  {
    id: 4,
    name: "Kabiru Lawal",
    staffId: "BZ004",
    department: "Laboratory Unit",
    role: "Laboratory Staff",
    username: "kabiru",
    status: "Active",
  },
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [form, setForm] = useState({
    name: "",
    staffId: "",
    username: "",
    password: "",
    department: "",
    role: "",
  });

  const menu = [
    ["Dashboard", "⌂"],
    ["Patients", "👥"],
    ["Departments", "🏢"],
    ["Staff & Roles", "👨‍⚕️"],
    ["Attendance", "🕐"],
    ["Roster", "📋"],
    ["General Cashier", "💰"],
    ["Stock", "📦"],
    ["Wards & Beds", "🛏️"],
    ["Alerts", "🔔"],
    ["SMS / Email", "📱"],
    ["Reports", "📊"],
    ["Audit Logs", "🔐"],
    ["Settings", "⚙️"],
  ];

  const filteredStaff = staff.filter((person) =>
    `${person.name} ${person.staffId} ${person.username} ${person.department} ${person.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddStaff() {
    setEditing(null);
    setForm({
      name: "",
      staffId: "",
      username: "",
      password: "",
      department: "",
      role: "",
    });
    setShowForm(true);
  }

  function openEditStaff(person) {
    setEditing(person);
    setForm({
      name: person.name,
      staffId: person.staffId,
      username: person.username,
      password: "",
      department: person.department,
      role: person.role,
    });
    setShowForm(true);
  }

  function saveStaff(e) {
    e.preventDefault();

    if (
      !form.name ||
      !form.staffId ||
      !form.username ||
      !form.department ||
      !form.role
    ) {
      alert("Please complete all required fields.");
      return;
    }

    if (editing) {
      setStaff(
        staff.map((person) =>
          person.id === editing.id
            ? {
                ...person,
                name: form.name,
                staffId: form.staffId,
                username: form.username,
                department: form.department,
                role: form.role,
              }
            : person
        )
      );
    } else {
      setStaff([
        ...staff,
        {
          id: Date.now(),
          name: form.name,
          staffId: form.staffId,
          username: form.username,
          department: form.department,
          role: form.role,
          status: "Active",
        },
      ]);
    }

    setShowForm(false);
  }

  function toggleStatus(id) {
    setStaff(
      staff.map((person) =>
        person.id === id
          ? {
              ...person,
              status: person.status === "Active" ? "Disabled" : "Active",
            }
          : person
      )
    );
  }

  function resetPassword(person) {
    alert(`Password reset requested for ${person.name}`);
  }

  return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f7f5;
          color: #17221d;
        }

        button, input, select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .app {
          min-height: 100vh;
          background: #f4f7f5;
        }

        .sidebar {
          width: 260px;
          background: #244f3d;
          color: white;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          overflow-y: auto;
          z-index: 50;
        }

        .brand {
          padding: 25px 20px;
          border-bottom: 1px solid rgba(255,255,255,.12);
        }

        .brand-logo {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: white;
          color: #244f3d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 27px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .brand h2 {
          margin: 0;
          font-size: 19px;
        }

        .brand p {
          margin: 6px 0 0;
          color: #cce0d5;
          font-size: 12px;
        }

        .menu {
          padding: 15px 12px;
        }

        .menu button {
          width: 100%;
          border: 0;
          background: transparent;
          color: #eaf5ef;
          padding: 12px 13px;
          margin: 3px 0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .menu button:hover,
        .menu button.active {
          background: #315f4b;
        }

        .menu-icon {
          width: 25px;
          text-align: center;
        }

        .main {
          margin-left: 260px;
          min-height: 100vh;
        }

        .topbar {
          height: 72px;
          background: white;
          border-bottom: 1px solid #e0e7e2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .top-title {
          font-size: 20px;
          font-weight: bold;
        }

        .mobile-btn {
          display: none;
          border: 0;
          background: #eef4f0;
          padding: 9px 12px;
          border-radius: 8px;
        }

        .admin-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .online {
          color: #27734c;
          font-size: 12px;
        }

        .avatar {
          width: 42px;
          height: 42px;
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

        .welcome {
          background: white;
          border: 1px solid #e1e8e3;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 22px;
        }

        .welcome h1 {
          margin: 0 0 7px;
          font-size: 25px;
        }

        .welcome p {
          margin: 0;
          color: #68736d;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .card {
          background: white;
          border: 1px solid #e1e8e3;
          border-radius: 15px;
          padding: 18px;
        }

        .stat-icon {
          font-size: 23px;
        }

        .stat-title {
          color: #68736d;
          font-size: 13px;
          margin-top: 12px;
        }

        .stat-value {
          font-size: 25px;
          font-weight: bold;
          margin-top: 5px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
        }

        .search {
          width: 100%;
          border: 1px solid #d8e1db;
          border-radius: 10px;
          padding: 12px;
          outline: none;
          margin-bottom: 12px;
        }

        .department {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #edf1ee;
        }

        .status {
          font-size: 12px;
          padding: 5px 9px;
          border-radius: 20px;
          background: #e8f4ec;
          color: #27734c;
        }

        .page-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .page-head h1 {
          margin: 0;
          font-size: 25px;
        }

        .page-head p {
          margin: 6px 0 0;
          color: #68736d;
        }

        .primary {
          background: #315f4b;
          color: white;
          border: 0;
          padding: 12px 17px;
          border-radius: 10px;
          font-weight: bold;
        }

        .primary:hover {
          background: #244f3d;
        }

        .table-card {
          background: white;
          border: 1px solid #e1e8e3;
          border-radius: 15px;
          overflow: hidden;
        }

        .table-top {
          padding: 18px;
          border-bottom: 1px solid #edf1ee;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        th, td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid #edf1ee;
          font-size: 14px;
        }

        th {
          background: #f8faf9;
          color: #68736d;
          font-size: 12px;
          text-transform: uppercase;
        }

        .badge-active {
          background: #e8f4ec;
          color: #27734c;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 12px;
        }

        .badge-disabled {
          background: #f6e9e9;
          color: #a54848;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 12px;
        }

        .action-btn {
          border: 1px solid #d8e1db;
          background: white;
          padding: 7px 10px;
          border-radius: 7px;
          margin-right: 5px;
          font-size: 12px;
        }

        .action-btn:hover {
          background: #f1f5f2;
        }

        .form-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 100;
        }

        .form-modal {
          background: white;
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 18px;
          padding: 24px;
        }

        .form-modal h2 {
          margin-top: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          font-size: 13px;
          font-weight: bold;
        }

        .field input,
        .field select {
          border: 1px solid #d8e1db;
          padding: 12px;
          border-radius: 9px;
          background: white;
          outline: none;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 22px;
        }

        .secondary {
          border: 1px solid #d8e1db;
          background: white;
          padding: 11px 16px;
          border-radius: 9px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .feature {
          background: white;
          border: 1px solid #e1e8e3;
          border-radius: 14px;
          padding: 18px;
        }

        .feature strong {
          display: block;
          margin-top: 8px;
        }

        .feature span {
          font-size: 13px;
          color: #68736d;
        }

        @media (max-width: 1000px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .sidebar {
            transform: translateX(-100%);
            transition: .25s;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .main {
            margin-left: 0;
          }

          .mobile-btn {
            display: block;
          }

          .topbar {
            padding: 0 15px;
          }

          .online {
            display: none;
          }

          .content {
            padding: 15px;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }
        }
      `}</style>

      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">B</div>
          <h2>BAZZA PHC</h2>
          <p>Hospital Management System</p>
        </div>

        <div className="menu">
          {menu.map(([name, icon]) => (
            <button
              key={name}
              className={active === name ? "active" : ""}
              onClick={() => {
                setActive(name);
                setMobileMenu(false);
              }}
            >
              <span className="menu-icon">{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="mobile-btn"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              ☰
            </button>

            <div className="top-title">
              {active === "Dashboard"
                ? "Super Admin Dashboard"
                : active}
            </div>
          </div>

          <div className="admin-box">
            <span className="online">● System Online</span>
            <strong>Super Admin</strong>
            <div className="avatar">SA</div>
          </div>
        </header>

        <section className="content">

          {/* DASHBOARD */}
          {active === "Dashboard" && (
            <>
              <div className="welcome">
                <h1>Welcome, Super Admin</h1>
                <p>
                  Bazza Primary Health Care — Central Hospital Management
                  Dashboard
                </p>
              </div>

              <div className="stats">
                {[
                  ["👥", "Patients Today", "0"],
                  ["🚶", "Outpatients Today", "0"],
                  ["🛏️", "Inpatients", "0"],
                  ["🟢", "Staff Signed In", "0"],
                  ["⏳", "Pending Work", "0"],
                  ["₦", "Revenue Today", "₦0"],
                  ["🎁", "FREE Services", "0"],
                  ["📦", "Low Stock", "0"],
                ].map(([icon, title, value]) => (
                  <div className="card" key={title}>
                    <div className="stat-icon">{icon}</div>
                    <div className="stat-title">{title}</div>
                    <div className="stat-value">{value}</div>
                  </div>
                ))}
              </div>

              <div className="grid">
                <div className="card">
                  <h3>Departments</h3>

                  {departments.slice(0, 8).map((dept) => (
                    <div className="department" key={dept}>
                      <span>{dept}</span>
                      <span className="status">Online</span>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3>Recent System Activity</h3>

                  <div className="department">
                    <span>🔐 Super Admin Login</span>
                    <small>Now</small>
                  </div>

                  <div className="department">
                    <span>👨‍⚕️ Staff Management</span>
                    <small>Ready</small>
                  </div>

                  <div className="department">
                    <span>🕐 Attendance</span>
                    <small>Ready</small>
                  </div>

                  <div className="department">
                    <span>📦 Stock Monitoring</span>
                    <small>Ready</small>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STAFF & ROLES */}
          {active === "Staff & Roles" && (
            <>
              <div className="page-head">
                <div>
                  <h1>Staff & Roles</h1>
                  <p>
                    Manage hospital staff, departments, roles and accounts.
                  </p>
                </div>

                <button className="primary" onClick={openAddStaff}>
                  + Add New Staff
                </button>
              </div>

              <div className="stats">
                <div className="card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-title">Total Staff</div>
                  <div className="stat-value">{staff.length}</div>
                </div>

                <div className="card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-title">Active Staff</div>
                  <div className="stat-value">
                    {staff.filter((s) => s.status === "Active").length}
                  </div>
                </div>

                <div className="card">
                  <div className="stat-icon">⛔</div>
                  <div className="stat-title">Disabled</div>
                  <div className="stat-value">
                    {staff.filter((s) => s.status === "Disabled").length}
                  </div>
                </div>

                <div className="card">
                  <div className="stat-icon">🏢</div>
                  <div className="stat-title">Departments</div>
                  <div className="stat-value">{departments.length}</div>
                </div>
              </div>

              <div className="table-card">
                <div className="table-top">
                  <input
                    className="search"
                    style={{ margin: 0 }}
                    placeholder="Search staff name, Staff ID, department, role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Name</th>
                        <th>Staff ID</th>
                        <th>Username</th>
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
                                  ? "badge-active"
                                  : "badge-disabled"
                              }
                            >
                              {person.status}
                            </span>
                          </td>

                          <td>
                            <button
                              className="action-btn"
                              onClick={() => openEditStaff(person)}
                            >
                              Edit
                            </button>

                            <button
                              className="action-btn"
                              onClick={() => toggleStatus(person.id)}
                            >
                              {person.status === "Active"
                                ? "Disable"
                                : "Activate"}
                            </button>

                            <button
                              className="action-btn"
                              onClick={() => resetPassword(person)}
                            >
                              Reset Password
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredStaff.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center" }}>
                            No staff found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* OTHER MODULES */}
          {active !== "Dashboard" && active !== "Staff & Roles" && (
            <div className="card">
              <h2>{active}</h2>
              <p style={{ color: "#68736d" }}>
                {active} module zai kasance mataki na gaba na construction.
              </p>

              <div className="feature-grid">
                <div className="feature">
                  🔐
                  <strong>Super Admin Control</strong>
                  <span>Full system administration.</span>
                </div>

                <div className="feature">
                  📋
                  <strong>Searchable Records</strong>
                  <span>Search and monitor system information.</span>
                </div>

                <div className="feature">
                  📊
                  <strong>Reports</strong>
                  <span>Searchable and printable reports.</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ADD / EDIT STAFF MODAL */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <h2>
              {editing ? "Edit Staff Account" : "Create New Staff Account"}
            </h2>

            <form onSubmit={saveStaff}>
              <div className="form-grid">

                <div className="field full">
                  <label>Staff Full Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Enter staff full name"
                  />
                </div>

                <div className="field">
                  <label>Staff ID *</label>
                  <input
                    value={form.staffId}
                    onChange={(e) =>
                      setForm({ ...form, staffId: e.target.value })
                    }
                    placeholder="e.g. BZ005"
                  />
                </div>

                <div className="field">
                  <label>Username *</label>
                  <input
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    placeholder="Enter username"
                  />
                </div>

                {!editing && (
                  <div className="field full">
                    <label>Initial Password *</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="Create temporary password"
                    />
                  </div>
                )}

                <div className="field">
                  <label>Main Department *</label>
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Role *</label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div
                style={{
                  marginTop: 18,
                  padding: 14,
                  background: "#eef4f0",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#526159",
                }}
              >
                🔐 <strong>Permission rule:</strong> Staff will only access
                the department and functions assigned by Super Admin.
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary">
                  {editing ? "Save Changes" : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
