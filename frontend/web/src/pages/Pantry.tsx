import { useEffect, useState } from "react";
import api from "../lib/api";

interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

const UNITS = [
  "pcs",
  "kg",
  "g",
  "L",
  "ml",
  "cup",
  "tbsp",
  "tsp",
  "pack",
  "bag",
  "can",
  "bottle",
];

const selectStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid #eee",
  fontSize: 15,
  outline: "none",
  backgroundColor: "#fafaf8",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 32,
};

const inputStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid #eee",
  fontSize: 15,
  outline: "none",
  backgroundColor: "#fafaf8",
};

export default function Pantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    quantity: string;
    unit: string;
  }>({ name: "", quantity: "", unit: "pcs" });
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchPantry = async () => {
    const data = await api.get("/api/pantry");
    if (Array.isArray(data)) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setAdding(true);
    const data = await api.post("/api/pantry", { name, quantity, unit });
    if (!data.error) {
      setItems((prev) => [...prev, data]);
      setName("");
      setQuantity("");
      setUnit("pcs");
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/api/pantry/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleStartEdit = (item: PantryItem) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      quantity: item.quantity || "",
      unit: item.unit || "pcs",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", quantity: "", unit: "pcs" });
  };

  const handleSaveEdit = async (id: string) => {
    setSavingId(id);
    const data = await api.put(`/api/pantry/${id}`, editForm);
    if (!data.error) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...editForm } : i)),
      );
      setEditingId(null);
    }
    setSavingId(null);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          My Pantry
        </h2>
        <p style={{ color: "#999", fontSize: 15 }}>
          Track ingredients you have at home
        </p>
      </div>

      {/* Add item form */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          Add Ingredient
        </h3>
        <form onSubmit={handleAdd}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 140px auto",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              placeholder="Ingredient name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={inputStyle}
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={selectStyle}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={adding}
              style={{
                backgroundColor: "#e67e22",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "11px 20px",
                fontSize: 15,
                fontWeight: 600,
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              {adding ? "..." : "+ Add"}
            </button>
          </div>
        </form>
      </div>

      {/* Pantry items */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          In My Pantry ({items.length})
        </h3>

        {loading && <p style={{ color: "#999" }}>Loading...</p>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
            <p style={{ color: "#999", fontSize: 15 }}>Your pantry is empty</p>
            <p style={{ color: "#bbb", fontSize: 13, marginTop: 4 }}>
              Add ingredients you have at home
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <div key={item.id}>
              {editingId === item.id ? (
                // Edit mode
                <div
                  style={{
                    padding: "14px 16px",
                    backgroundColor: "#fdf3e7",
                    borderRadius: 10,
                    border: "1px solid #f0c080",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 100px 140px",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      style={inputStyle}
                      placeholder="Ingredient name"
                    />
                    <input
                      value={editForm.quantity}
                      onChange={(e) =>
                        setEditForm({ ...editForm, quantity: e.target.value })
                      }
                      style={inputStyle}
                      placeholder="Qty"
                    />
                    <select
                      value={editForm.unit}
                      onChange={(e) =>
                        setEditForm({ ...editForm, unit: e.target.value })
                      }
                      style={selectStyle}
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        border: "1px solid #eee",
                        background: "#fff",
                        padding: "8px 16px",
                        borderRadius: 8,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      disabled={savingId === item.id}
                      style={{
                        backgroundColor: "#e67e22",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {savingId === item.id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    backgroundColor: "#fafaf8",
                    borderRadius: 10,
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#e67e22",
                      }}
                    />
                    <span style={{ fontSize: 15, fontWeight: 500 }}>
                      {item.name}
                    </span>
                    {(item.quantity || item.unit) && (
                      <span
                        style={{
                          fontSize: 13,
                          color: "#fff",
                          backgroundColor: "#e67e22",
                          padding: "2px 10px",
                          borderRadius: 20,
                          fontWeight: 500,
                        }}
                      >
                        {item.quantity} {item.unit}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleStartEdit(item)}
                      style={{
                        background: "none",
                        border: "1px solid #eee",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 13,
                        color: "#666",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: "none",
                        border: "1px solid #ffcdd2",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 13,
                        color: "#e53935",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
