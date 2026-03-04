"use client";

import { translations } from "@/lib/translations";
import { useEffect, useMemo, useState } from "react";
import { addMonths, format } from "date-fns";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Meta = { id: string; name?: string; department?: string; district?: string };

type Service = {
  id: string;
  company: string;
  amount: string;
  serviceDate: string;
  certificatesOnly: boolean;
  status: "SCHEDULED" | "EXECUTED" | "INVOICED" | "PAID";
  course: { name: string };
  instructor: { name: string };
  location: { department: string; district: string };
  salesperson: { id: string; name: string };
};

type Sale = {
  id: string;
  customerName: string;
  customerType: "NATURAL_PERSON" | "COMPANY";
  amount: string;
  saleDate: string;
  status: string;
  course: { name: string };
  salesperson: { name: string };
};

export default function Dashboard() {
  const lang = "es";
  const t = translations[lang];
  
  const now = new Date();
  const [tab, setTab] = useState("summary");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [services, setServices] = useState<Service[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [dashboard, setDashboard] = useState<any>({ bySalesperson: {}, byWeek: {}, weeklyMatrix: {}, ranking: [] });
  const [meta, setMeta] = useState<{ instructors: Meta[]; courses: Meta[]; salespeople: Meta[]; locations: Meta[] }>({ instructors: [], courses: [], salespeople: [], locations: [] });

  const [serviceForm, setServiceForm] = useState({ company: "", courseId: "", instructorId: "", locationId: "", salespersonId: "", certificatesOnly: false, amount: "", serviceDate: format(now, "yyyy-MM-dd"), status: "SCHEDULED" });
  const [saleForm, setSaleForm] = useState({ customerName: "", customerType: "NATURAL_PERSON", companyName: "", courseId: "", salespersonId: "", amount: "", saleDate: format(now, "yyyy-MM-dd"), status: "PAID" });
  const [selectedDayServices, setSelectedDayServices] = useState<Service[] | null>(null);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  async function load() {
    const q = `month=${month}&year=${year}`;
    const [s1, s2, s3, instructors, courses, salespeople, locations] = await Promise.all([
      fetch(`/api/services?${q}`).then((r) => r.json()),
      fetch(`/api/certificate-sales?${q}`).then((r) => r.json()),
      fetch(`/api/dashboard?${q}`).then((r) => r.json()),
      fetch(`/api/metadata/instructors`).then((r) => r.json()),
      fetch(`/api/metadata/courses`).then((r) => r.json()),
      fetch(`/api/metadata/salespeople`).then((r) => r.json()),
      fetch(`/api/metadata/locations`).then((r) => r.json())
    ]);
    setServices(s1); setSales(s2); setDashboard(s3); setMeta({ instructors, courses, salespeople, locations });
  }

  useEffect(() => { load(); }, [month, year]);

  const naturalTotal = useMemo(() => sales.filter((s) => s.customerType === "NATURAL_PERSON").reduce((a, s) => a + Number(s.amount), 0), [sales]);
  const companyTotal = useMemo(() => sales.filter((s) => s.customerType === "COMPANY").reduce((a, s) => a + Number(s.amount), 0), [sales]);

  async function submitService() {
    await fetch("/api/services", { method: "POST", body: JSON.stringify({ ...serviceForm, amount: Number(serviceForm.amount), serviceDate: `${serviceForm.serviceDate}T09:00:00.000Z` }) });
    setServiceForm({ ...serviceForm, company: "", amount: "" });
    load();
  }
  async function submitSale() {
    await fetch("/api/certificate-sales", { 
  method: "POST", 
  headers: { "Content-Type": "application/json" }, // MUY IMPORTANTE
  body: JSON.stringify(body) 
});
    setSaleForm({ ...saleForm, customerName: "", amount: "" });
    load();
  }

  const salesChartData = Object.entries(dashboard.bySalesperson || {}).map(([name, value]) => ({ name, value }));
  const weekChartData = Object.entries(dashboard.byWeek || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="container grid">
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>{t.title}</h2>
          <small>{t.subtitle}</small>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{format(addMonths(new Date(year, 0, 1), i), "MMMM")}</option>)}</select>
          <input className="input" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ width: 100 }} />
        </div>
      </div>

      <div className="tabs">
        {[
          ["summary", "Executive Summary"],
          ["services", "Monthly Services Board"],
          ["certificates", "Certificates Sales"],
          ["performance", "Sales Performance 6x4"],
          ["support", "Support Database"]
        ].map(([id, label]) => <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>)}
      </div>

      {tab === "summary" && <div className="grid" style={{ gridTemplateColumns: "repeat(4,minmax(220px,1fr))" }}>
        <div className="card"><small>Total Services</small><div className="metric">{dashboard.totalServices ?? 0}</div></div>
        <div className="card"><small>Estimated Billing</small><div className="metric">S/ {(dashboard.totalEstimatedBilling ?? 0).toFixed?.(2) ?? "0.00"}</div></div>
        <div className="card"><small>Top Sales Rep</small><div className="metric">{dashboard.topSalesRep ?? "-"}</div></div>
        <div className="card"><small>Best-selling course</small><div className="metric">{dashboard.bestSellingCourse ?? "-"}</div></div>

        <div className="card" style={{ gridColumn: "span 2" }}><h4>Sales by Rep</h4><div style={{ height: 250 }}><ResponsiveContainer><BarChart data={salesChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#1f4da1" /></BarChart></ResponsiveContainer></div></div>
        <div className="card" style={{ gridColumn: "span 2" }}><h4>Services by Week</h4><div style={{ height: 250 }}><ResponsiveContainer><BarChart data={weekChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#0f9d58" /></BarChart></ResponsiveContainer></div></div>

        <div className="card" style={{ gridColumn: "span 4", display: "flex", gap: 16 }}>
          <div className="badge" style={{ background: dashboard.bonus45 ? "#dcfce7" : "#e5e7eb" }}>{dashboard.bonus45 ? "BONUS 45 ACTIVATED" : "Bonus 45 pending"}</div>
          <div className="badge" style={{ background: dashboard.bonus70 ? "#dcfce7" : "#e5e7eb" }}>{dashboard.bonus70 ? "BONUS 70 ACTIVATED" : "Bonus 70 pending"}</div>
          <div className="badge" style={{ background: "#dbeafe" }}>Most assigned instructor: {dashboard.mostAssignedInstructor ?? "-"}</div>
        </div>
      </div>}

     {tab === "services" && <>
  {/* FORMULARIO PARA AGREGAR SERVICIO */}
  <div className="card grid" style={{ gridTemplateColumns: "repeat(8,minmax(120px,1fr))", marginBottom: 16 }}>
    <input className="input" placeholder="Company" value={serviceForm.company} onChange={(e) => setServiceForm({ ...serviceForm, company: e.target.value })} />
    <select value={serviceForm.courseId} onChange={(e) => setServiceForm({ ...serviceForm, courseId: e.target.value })}>
      <option value="">Course</option>
      {meta.courses.map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}
    </select>
    <select value={serviceForm.instructorId} onChange={(e) => setServiceForm({ ...serviceForm, instructorId: e.target.value })}>
      <option value="">Instructor</option>
      {meta.instructors.map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}
    </select>
    <select value={serviceForm.locationId} onChange={(e) => setServiceForm({ ...serviceForm, locationId: e.target.value })}>
      <option value="">District</option>
      {meta.locations.map((x: any) => <option key={x.id} value={x.id}>{x.department} - {x.district}</option>)}
    </select>
    <select value={serviceForm.salespersonId} onChange={(e) => setServiceForm({ ...serviceForm, salespersonId: e.target.value })}>
      <option value="">Sales rep</option>
      {meta.salespeople.map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}
    </select>
    <input className="input" type="date" value={serviceForm.serviceDate} onChange={(e) => setServiceForm({ ...serviceForm, serviceDate: e.target.value })} />
    <input className="input" type="number" placeholder="Amount" value={serviceForm.amount} onChange={(e) => setServiceForm({ ...serviceForm, amount: e.target.value })} />
    <button className="btn" onClick={submitService}>Add Service</button>
    <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input type="checkbox" checked={serviceForm.certificatesOnly} onChange={(e) => setServiceForm({ ...serviceForm, certificatesOnly: e.target.checked })} /> Certificates only
    </label>
  </div>

  {/* GRILLA DEL CALENDARIO */}
  <div className="grid calendar-grid">
    {days.map((d) => {
      const items = services.filter((s) => new Date(s.serviceDate).getDate() === d);
      return (
        <div className="day-col" key={d} onClick={() => setSelectedDayServices(items)} style={{ cursor: "pointer" }}>
          <strong>Day {d}</strong>
          {items.map((s) =>
            <div key={s.id} className={`service-card ${s.certificatesOnly ? "cert" : ""} ${s.status === "EXECUTED" ? "executed" : ""}`} style={{ position: "relative" }}>
              {/* BOTÓN X */}
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm("¿Seguro que quieres eliminar este registro?")) return;
                  try {
                    const res = await fetch(`/api/services/${s.id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error("No se pudo eliminar");
                    setServices(prev => prev.filter(x => x.id !== s.id));
                  } catch (err) {
                    alert("Error eliminando el registro");
                  }
                }}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#555",
                  fontSize: "14px",
                  lineHeight: 1
                }}
              >
                ✕
              </button>

              <div><strong>{s.company}</strong></div>
              <small>
  {s.course?.name ?? "Sin curso"} · {s.instructor?.name ?? "Sin instructor"}
</small><br />

<small>
  {s.location?.department ?? "-"} / {s.location?.district ?? "-"}
</small><br />

<small>
  {s.salesperson?.name ?? "Sin vendedor"} · S/{Number(s.amount ?? 0).toFixed(2)}
</small>
            </div>
          )}
        </div>
      );
    })}
  </div>

  {/* MODAL FLOTANTE CON TODOS LOS SERVICIOS DEL DÍA */}
  {selectedDayServices && (
    <div className="modal-overlay" onClick={() => setSelectedDayServices(null)} style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: 16, borderRadius: 8, maxHeight: "80vh", overflowY: "auto", minWidth: 300, position: "relative" }}>
        <h4>Servicios del día</h4>
        <button style={{ position: "absolute", top: 8, right: 8 }} onClick={() => setSelectedDayServices(null)}>✕</button>
        {selectedDayServices.map(s => (
          <div key={s.id} className={`service-card ${s.certificatesOnly ? "cert" : ""} ${s.status === "EXECUTED" ? "executed" : ""}`} style={{ marginBottom: 8 }}>
            <div><strong>{s.company}</strong></div>
            <small>
  {s.course?.name ?? "Sin curso"} · {s.instructor?.name ?? "Sin instructor"}
</small><br />

<small>
  {s.location?.department ?? "-"} / {s.location?.district ?? "-"}
</small><br />

<small>
  {s.salesperson?.name ?? "Sin vendedor"} · S/{Number(s.amount ?? 0).toFixed(2)}
</small>
          </div>
        ))}
      </div>
    </div>
  )}
</>}

     {tab === "certificates" && (
  <div className="grid">
    {/* FORMULARIO PARA AGREGAR VENTA */}
    <div className="card grid" style={{ gridTemplateColumns: "repeat(8,minmax(120px,1fr))", marginBottom: 16 }}>
      <input
        className="input"
        placeholder="Customer"
        value={saleForm.customerName}
        onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })}
      />

      <select
        value={saleForm.customerType}
        onChange={(e) => setSaleForm({ ...saleForm, customerType: e.target.value as "NATURAL_PERSON" | "COMPANY" })}
      >
        <option value="NATURAL_PERSON">Natural Person</option>
        <option value="COMPANY">Company</option>
      </select>

      <select
        value={saleForm.courseId}
        onChange={(e) => setSaleForm({ ...saleForm, courseId: e.target.value })}
      >
        <option value="">Course</option>
        {meta.courses.map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select>

      <select
        value={saleForm.salespersonId}
        onChange={(e) => setSaleForm({ ...saleForm, salespersonId: e.target.value })}
      >
        <option value="">Commercial</option>
        {meta.salespeople.map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select>

      <input
        className="input"
        type="date"
        value={saleForm.saleDate}
        onChange={(e) => setSaleForm({ ...saleForm, saleDate: e.target.value })}
      />

      <input
        className="input"
        placeholder="Amount"
        value={saleForm.amount}
        onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
      />

      <button
        className="btn"
        onClick={async () => {
          if (!saleForm.customerName || !saleForm.courseId || !saleForm.salespersonId || !saleForm.amount) {
            return alert("Complete todos los campos");
          }

          const body = {
            ...saleForm,
            amount: Number(saleForm.amount),
            saleDate: `${saleForm.saleDate}T09:00:00.000Z`
          };

          try {
            // Guardar en Certificate Sales
            const res = await fetch("/api/certificate-sales", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

            const text = await res.text();
let data = null;

try {
  data = text ? JSON.parse(text) : null;
} catch (e) {
  console.warn("La respuesta no es JSON válido:", text);
}

if (!res.ok) {
  return alert(`Error guardando la venta: ${data?.error || res.status}`);
}

            // Si amount > 700, agregar también a Monthly Services Board
            if (Number(saleForm.amount) > 700) {
              await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  company: saleForm.customerType === "COMPANY" ? saleForm.companyName || saleForm.customerName : saleForm.customerName,
                  courseId: saleForm.courseId,
                  instructorId: null,
                  locationId: null,
                  salespersonId: saleForm.salespersonId,
                  certificatesOnly: true,
                  amount: Number(saleForm.amount),
                  serviceDate: `${saleForm.saleDate}T09:00:00.000Z`,
                  status: "SCHEDULED"
                })
              });
            }

            // Reset form
            setSaleForm({
              customerName: "",
              customerType: "NATURAL_PERSON",
              courseId: "",
              salespersonId: "",
              amount: "",
              saleDate: format(new Date(), "yyyy-MM-dd"),
              status: "PAID",
              companyName: ""
            });

            // Recargar tabla
            load();
          } catch (err) {
            console.error("Error creando sale:", err);
            alert("Error guardando la venta, revisa la consola");
          }
        }}
      >
        Save Sale
      </button>
    </div>

    {/* RESUMEN DE VENTAS */}
    <div className="card">
      <div style={{ display: "flex", gap: 20 }}>
        <div>Natural persons: <strong>S/ {naturalTotal.toFixed(2)}</strong></div>
        <div>Companies: <strong>S/ {companyTotal.toFixed(2)}</strong></div>
        <div>Grand total: <strong>S/ {(naturalTotal + companyTotal).toFixed(2)}</strong></div>
      </div>

      {/* TABLA DE VENTAS */}
      <table className="table">
        <thead>
          <tr><th>Customer</th><th>Type</th><th>Course</th><th>Commercial</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>{s.customerName}</td>
              <td>{s.customerType}</td>
              <td>{s.course.name}</td>
              <td>{s.salesperson.name}</td>
              <td>S/{Number(s.amount).toFixed(2)}</td>
              <td>{format(new Date(s.saleDate), "yyyy-MM-dd")}</td>
              <td>{s.status}</td>
              <td>
                <button
                  style={{ background: "transparent", color: "#555", border: "none", cursor: "pointer" }}
                  onClick={async () => {
                    if (!confirm("¿Seguro que quieres eliminar este registro?")) return;
                    try {
                      const res = await fetch(`/api/certificate-sales/${s.id}`, {
                        method: "DELETE",
                      });
                      if (!res.ok) throw new Error("No se pudo eliminar");

                      setSales(prev => prev.filter(x => x.id !== s.id));
                    } catch (err) {
                      console.error(err);
                      alert("Error eliminando la venta");
                    }
                  }}
                >✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      {tab === "performance" && <div className="card">
        <table className="table"><thead><tr><th>Week</th>{meta.salespeople.map((s: any) => <th key={s.id}>{s.name}</th>)}</tr></thead><tbody>{["Week 1", "Week 2", "Week 3", "Week 4"].map((week) => <tr key={week}><td>{week}</td>{meta.salespeople.map((sp: any) => {
          const count = dashboard.weeklyMatrix?.[sp.name]?.[week] ?? 0;
          return <td key={sp.id}>{count} {count > 5 && <span className="badge" style={{ background: "#dcfce7" }}>WEEKLY BONUS</span>}</td>;
        })}</tr>)}</tbody></table>
        <h4>Monthly Ranking</h4>
        <ol>{(dashboard.ranking || []).map((r: any) => <li key={r[0]}>{r[0]} - {r[1]} services</li>)}</ol>
      </div>}

      {tab === "support" && <div className="grid" style={{ gridTemplateColumns: "repeat(4,minmax(220px,1fr))" }}>
        <CrudCard title="Instructors" endpoint="instructors" fields={["name"]} onDone={load} items={meta.instructors} />
        <CrudCard title="Courses" endpoint="courses" fields={["name"]} onDone={load} items={meta.courses} />
        <CrudCard title="Salespeople" endpoint="salespeople" fields={["name"]} onDone={load} items={meta.salespeople} />
        <CrudCard title="Locations" endpoint="locations" fields={["department", "district"]} onDone={load} items={meta.locations} />
      </div>}
    </div>
  );
}

function CrudCard({ title, endpoint, fields, items, onDone }: { title: string; endpoint: string; fields: string[]; items: any[]; onDone: () => void }) {
  const [form, setForm] = useState<Record<string, string>>({});

  return <div className="card"><h4>{title}</h4>
    <div className="grid">{fields.map((f) => <input key={f} className="input" placeholder={f} value={form[f] || ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />)}
      <button className="btn" onClick={async () => { await fetch(`/api/metadata/${endpoint}`, { 
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form)
}); setForm({}); onDone(); }}>Add</button>
    </div>
    <ul>
        {items.slice(0, 8).map((i) => (
          <li key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span>{i.name || `${i.department} - ${i.district}`}</span>
            <button
              style={{ background: "red", color: "white", border: "none", padding: "2px 6px", cursor: "pointer" }}
              onClick={async () => {
            if (!confirm("¿Seguro que quieres eliminar este registro?")) return;
            try {
              const res = await fetch(`/api/metadata/${endpoint}/${i.id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("No se pudo eliminar");
                  onDone(); // recarga la lista
                } catch (err) {
              alert("Error eliminando el registro");
              }
            }}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  </div>;
}
