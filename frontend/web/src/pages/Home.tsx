import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  created_at: string;
  image_url: string;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await api.get("/api/recipes");
      if (Array.isArray(data)) setRecipes(data);
      setLoading(false);
    };
    fetchRecipes();
  }, []);

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <div style={{ color: "#999" }}>Loading recipes...</div>
      </div>
    );

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          All Recipes
        </h2>
        <p style={{ color: "#999", fontSize: 15 }}>
          {recipes.length} recipes available
        </p>
      </div>

      <input
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 10,
          border: "1px solid #eee",
          fontSize: 15,
          marginBottom: 24,
          backgroundColor: "#fff",
          outline: "none",
        }}
      />

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 80, color: "#999" }}>
          <p style={{ fontSize: 18, marginBottom: 8 }}>No recipes found</p>
          <p style={{ fontSize: 14 }}>
            Try a different search or create a new recipe
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              cursor: "pointer",
              border: "1px solid #eee",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 20px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "100%",
                height: 140,
                backgroundColor: "#fdf3e7",
                borderRadius: 8,
                marginBottom: 14,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "🍽️"
              )}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
              {recipe.title}
            </h3>
            <p
              style={{
                color: "#999",
                fontSize: 14,
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              {recipe.description?.slice(0, 80)}
              {recipe.description?.length > 80 ? "..." : ""}
            </p>
            <div
              style={{ display: "flex", gap: 12, fontSize: 13, color: "#bbb" }}
            >
              <span>⏱ {recipe.prep_time + recipe.cook_time}min</span>
              <span>👤 {recipe.servings} servings</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
