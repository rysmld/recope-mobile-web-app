import { useEffect, useState } from "react";
import api from "../lib/api";

interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export default function Pantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [adding, setAdding] = useState(false);

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
      setUnit("");
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/api/pantry/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid #eee",
    fontSize: 15,
    outline: "none",
    backgroundColor: "#fafaf8",
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
              gridTemplateColumns: "1fr 100px 100px auto",
              gap: 10,
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
            <input
              placeholder="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={inputStyle}
            />
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
            <div
              key={item.id}
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
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                  <span style={{ fontSize: 13, color: "#999" }}>
                    {item.quantity} {item.unit}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ddd",
                  fontSize: 18,
                  cursor: "pointer",
                  padding: "0 4px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e53935")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ddd")}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
