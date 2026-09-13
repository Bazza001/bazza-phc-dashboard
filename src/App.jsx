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

const stats = [
  { title: "Patients Today", value: "0", icon: "👥" },
  { title: "Outpatients Today", value: "0", icon: "🚶" },
  { title: "Inpatients", value: "0", icon: "🛏️" },
  { title: "Staff Signed In", value: "0", icon: "🟢" },
  { title: "Pending Work", value: "0", icon: "⏳" },
  { title: "Revenue Today", value: "₦0", icon: "₦" },
  { title: "FREE Services", value: "0", icon: "🎁" },
  { title: "Low Stock", value: "0", icon: "📦" },
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

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

  const filteredDepartments = departments.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

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

        button, input {
          font: inherit;
        }

        .app {
          min-height: 100vh;
          display: flex;
          background: #f4f7f5;
        }

        .sidebar {
          width: 260px;
          background: #244f3d;
          color: white;
          min-height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          overflow-y: auto;
          z-index: 20;
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
          cursor: pointer;
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
          width: calc(100% - 260px);
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
          z-index: 10;
        }

        .mobile-btn {
          display: none;
          border: 0;
          background: #eef4f0;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .top-title {
          font-size: 20px;
          font-weight: bold;
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

        .card h3 {
          margin: 0 0 16px;
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

        .department:last-child {
          border-bottom: 0;
        }

        .dept-name {
          font-weight: 600;
        }

        .status {
          font-size: 12px;
          padding: 5px 9px;
          border-radius: 20px;
          background: #e8f4ec;
          color: #27734c;
        }

        .activity {
          padding: 12px 0;
          border-bottom: 1px solid #edf1ee;
          display: flex;
          gap: 10px;
        }

        .activity:last-child {
          border-bottom: 0;
        }

        .activity-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #eef4f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity p {
          margin: 0;
          font-size: 13px;
        }

        .activity small {
          color: #68736d;
        }

        .section-title {
          margin: 0 0 18px;
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
          cursor: pointer;
        }

        .feature:hover {
          border-color: #315f4b;
        }

        .feature strong {
          display: block;
          margin-top: 8px;
        }

        .feature span {
          font-size: 13px;
          color: #68736d;
        }

        .mobile-overlay {
          display: none;
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
            width: 100%;
          }

          .mobile-btn {
            display: block;
          }

          .topbar {
            padding: 0 15px;
          }

          .top-title {
            font-size: 16px;
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

          .stat-value {
            font-size: 20px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .mobile-overlay {
            display: block;
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="mobile-btn"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              ☰
            </button>

            <div className="top-title">
              {active === "Dashboard" ? "Super Admin Dashboard" : active}
            </div>
          </div>

          <div className="admin-box">
            <span className="online">● System Online</span>
            <div>
              <strong>Super Admin</strong>
            </div>
            <div className="avatar">SA</div>
          </div>
        </header>

        <section className="content">
          {active === "Dashboard" ? (
            <>
              <div className="welcome">
                <h1>Welcome, Super Admin</h1>
                <p>
                  Bazza Primary Health Care — Central Hospital Management
                  Dashboard
                </p>
              </div>

              <div className="stats">
                {stats.map((item) => (
                  <div className="card" key={item.title}>
                    <div className="stat-icon">{item.icon}</div>
                    <div className="stat-title">{item.title}</div>
                    <div className="stat-value">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid">
                <div className="card">
                  <h3>Departments</h3>

                  <input
                    className="search"
                    placeholder="Search department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {filteredDepartments.slice(0, 8).map((dept) => (
                    <div className="department" key={dept}>
                      <span className="dept-name">{dept}</span>
                      <span className="status">Online</span>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3>Recent System Activity</h3>

                  <div className="activity">
                    <div className="activity-icon">🔐</div>
                    <div>
                      <p>Super Admin dashboard opened</p>
                      <small>Just now</small>
                    </div>
                  </div>

                  <div className="activity">
                    <div className="activity-icon">👥</div>
                    <div>
                      <p>Patient registration activity</p>
                      <small>Waiting for data</small>
                    </div>
                  </div>

                  <div className="activity">
                    <div className="activity-icon">🕐</div>
                    <div>
                      <p>Staff attendance</p>
                      <small>Waiting for staff sign-in</small>
                    </div>
                  </div>

                  <div className="activity">
                    <div className="activity-icon">📦</div>
                    <div>
                      <p>Stock monitoring</p>
                      <small>No new activity</small>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "22px" }}>
                <h3 className="section-title">Quick Management</h3>

                <div className="feature-grid">
                  <div
                    className="feature"
                    onClick={() => setActive("Patients")}
                  >
                    👥
                    <strong>Patient Management</strong>
                    <span>Search and monitor patients</span>
                  </div>

                  <div
                    className="feature"
                    onClick={() => setActive("Staff & Roles")}
                  >
                    👨‍⚕️
                    <strong>Staff & Roles</strong>
                    <span>Manage staff and permissions</span>
                  </div>

                  <div
                    className="feature"
                    onClick={() => setActive("Attendance")}
                  >
                    🕐
                    <strong>Staff Attendance</strong>
                    <span>Sign in/out and attendance</span>
                  </div>

                  <div
                    className="feature"
                    onClick={() => setActive("Roster")}
                  >
                    📋
                    <strong>Monthly Roster</strong>
                    <span>Generate and monitor roster</span>
                  </div>

                  <div
                    className="feature"
                    onClick={() => setActive("General Cashier")}
                  >
                    💰
                    <strong>General Cashier</strong>
                    <span>Monitor all cashier transactions</span>
                  </div>

                  <div
                    className="feature"
                    onClick={() => setActive("Audit Logs")}
                  >
                    🔐
                    <strong>Audit & Security</strong>
                    <span>Monitor system activities</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card">
              <h2>{active}</h2>
              <p style={{ color: "#68736d" }}>
                {active} module is ready for construction.
              </p>

              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  background: "#eef4f0",
                  borderRadius: "12px",
                }}
              >
                <strong>Super Admin Permission</strong>
                <p style={{ marginBottom: 0, color: "#68736d" }}>
                  Wannan bangaren zai samu cikakken tsarin aiki da permissions
                  na Super Admin.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
