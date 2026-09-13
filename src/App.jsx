import React, { useState } from "react";

const roles = [
  {
    id: "superadmin",
    name: "Super Admin",
    department: "Administration",
  },
  {
    id: "incharge",
    name: "In-Charge",
    department: "Hospital Management",
  },
  {
    id: "cashier",
    name: "General Cashier",
    department: "Finance",
  },
  {
    id: "ict",
    name: "ICT Centre",
    department: "ICT Centre",
  },
  {
    id: "records",
    name: "Records Unit",
    department: "Records",
  },
  {
    id: "nursing",
    name: "Nursing Unit",
    department: "Nursing",
  },
  {
    id: "consultant",
    name: "Consultant Room",
    department: "Clinical Care",
  },
  {
    id: "laboratory",
    name: "Laboratory Unit",
    department: "Laboratory",
  },
  {
    id: "pharmacy",
    name: "Pharmacy Unit",
    department: "Pharmacy",
  },
  {
    id: "ultrasound",
    name: "Ultrasound Room",
    department: "Ultrasound",
  },
  {
    id: "male-ward",
    name: "Male Ward",
    department: "Ward",
  },
  {
    id: "female-ward",
    name: "Female Ward",
    department: "Ward",
  },
  {
    id: "maternity",
    name: "Maternity Ward",
    department: "Maternity",
  },
  {
    id: "child-ward",
    name: "Child Ward",
    department: "Ward",
  },
  {
    id: "labour",
    name: "Labour Room",
    department: "Maternity",
  },
  {
    id: "immunization",
    name: "Immunization Unit",
    department: "Immunization",
  },
  {
    id: "family-planning",
    name: "Family Planning Unit",
    department: "Family Planning",
  },
  {
    id: "adolescent",
    name: "Adolescent Unit",
    department: "Adolescent",
  },
];

const stats = [
  { label: "Patients Today", value: "0" },
  { label: "Outpatients", value: "0" },
  { label: "Inpatients", value: "0" },
  { label: "Pending Work", value: "0" },
];

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("superadmin");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    const role = roles.find((item) => item.id === selectedRole);

    onLogin({
      username,
      role,
    });
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-mark">B</div>

        <div className="login-heading">
          <p className="eyebrow">BAZZA PHC</p>
          <h1>Bazza Primary Health Care</h1>
          <p>Sokoto Hospital Management System</p>
        </div>

        <div className="facility-status">
          <span className="status-dot"></span>
          Facility System Online
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <label>
            Staff Role / Department
            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} — {role.department}
                </option>
              ))}
            </select>
          </label>

          <label>
            Username / Staff ID
            <input
              type="text"
              placeholder="Enter staff username or ID"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="primary-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <span>24 Hours · 7 Days</span>
          <span>Waziri Maccido Road, Bazza Area, Sokoto</span>
        </div>
      </section>
    </main>
  );
}

function Dashboard({ session, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");

  const roleName = session.role.name;

  const menu = [
    "Dashboard",
    "Patients",
    "Appointments",
    "Reports",
    "Staff & Attendance",
  ];

  if (session.role.id === "superadmin") {
    menu.push("Departments", "Staff & Roles", "Stock Management", "Audit Logs");
  }

  if (session.role.id === "cashier") {
    menu.push("Cashier", "Payments", "Receipts", "Financial Reports");
  }

  if (session.role.id === "ict") {
    menu.push("Patient Registration", "Stock Control", "Stock Requests");
  }

  if (session.role.id === "records") {
    menu.push("Records", "Patient Cards", "Records Cashier");
  }

  if (session.role.id === "laboratory") {
    menu.push("Lab Requests", "Samples", "Results", "Laboratory Cashier");
  }

  if (session.role.id === "pharmacy") {
    menu.push("Prescriptions", "Dispensing", "Pharmacy Cashier", "Stock");
  }

  if (session.role.id === "ultrasound") {
    menu.push("Ultrasound Requests", "Scan Queue", "Reports", "Ultrasound Cashier");
  }

  if (
    session.role.id === "nursing" ||
    session.role.id === "consultant" ||
    session.role.id.includes("ward") ||
    session.role.id === "maternity" ||
    session.role.id === "labour"
  ) {
    menu.push("Patient Care", "Ward / Beds");
  }

  if (
    session.role.id === "immunization" ||
    session.role.id === "family-planning" ||
    session.role.id === "adolescent"
  ) {
    menu.push("Services", "Appointments", "Follow-up", "Patient SMS");
  }

  const pageTitle =
    activePage === "Dashboard" ? `${roleName} Dashboard` : activePage;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">B</div>
          <div>
            <strong>Bazza PHC</strong>
            <span>Sokoto</span>
          </div>
        </div>

        <div className="staff-box">
          <span className="status-dot"></span>
          <div>
            <strong>{session.username}</strong>
            <small>{roleName}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menu.map((item, index) => (
            <button
              key={`${item}-${index}`}
              className={activePage === item ? "nav-item active" : "nav-item"}
              onClick={() => setActivePage(item)}
            >
              <span className="nav-icon">
                {item === "Dashboard"
                  ? "⌂"
                  : item === "Reports"
                  ? "▤"
                  : item === "Patients"
                  ? "●"
                  : item === "Appointments"
                  ? "◷"
                  : "•"}
              </span>
              {item}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={onLogout}>
          Sign Out
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">BAZZA PRIMARY HEALTH CARE</p>
            <h2>{pageTitle}</h2>
          </div>

          <div className="topbar-right">
            <div className="online-badge">
              <span className="status-dot"></span>
              Online
            </div>

            <div className="date-box">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </header>

        <section className="welcome-panel">
          <div>
            <p className="eyebrow">WORKSPACE</p>
            <h1>Welcome, {session.username}</h1>
            <p>
              You are signed in as <strong>{roleName}</strong>.
              Department permissions will control what you can view and do.
            </p>
          </div>

          <div className="department-badge">
            {session.role.department}
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">CURRENT WORKSPACE</p>
                <h3>{activePage}</h3>
              </div>
            </div>

            <div className="empty-state">
              <div className="empty-icon">+</div>
              <h3>{activePage}</h3>
              <p>
                This module is ready for the next development stage.
              </p>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">FACILITY</p>
                <h3>Bazza PHC</h3>
              </div>
            </div>

            <div className="facility-list">
              <div>
                <span>Address</span>
                <strong>Waziri Maccido Road, Bazza Area, Sokoto</strong>
              </div>

              <div>
                <span>Service</span>
                <strong>24 Hours · 7 Days</strong>
              </div>

              <div>
                <span>Department</span>
                <strong>{session.role.name}</strong>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <Login onLogin={setSession} />;
  }

  return (
    <Dashboard
      session={session}
      onLogout={() => setSession(null)}
    />
  );
}

export default App;
