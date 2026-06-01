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
  image_url: string;
  matchedCount?: number;
  totalCount?: number;
  matchPercent?: number;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [matched, setMatched] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [recipesData, matchedData] = await Promise.all([
        api.get("/api/recipes"),
        api.get("/api/pantry/match"),
      ]);
      if (Array.isArray(recipesData)) setRecipes(recipesData);
      if (Array.isArray(matchedData)) setMatched(matchedData);
      setLoading(false);
    };
    fetchData();
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
      {/* Pantry Matches */}
      {matched.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                🛒 From Your Pantry
              </h2>
              <p style={{ color: "#999", fontSize: 14 }}>
                Recipes you can make with ingredients you have
              </p>
            </div>
            <button
              onClick={() => navigate("/pantry")}
              style={{
                background: "none",
                border: "1px solid #eee",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 13,
                color: "#666",
              }}
            >
              Manage Pantry
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {matched.slice(0, 3).map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 20,
                  cursor: "pointer",
                  border: "2px solid #e67e22",
                  position: "relative",
                  transition: "transform 0.1s, box-shadow 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 20px rgba(230,126,34,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Match badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: "#e67e22",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 20,
                  }}
                >
                  {recipe.matchPercent}% match
                </div>

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
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
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
                    marginBottom: 10,
                    lineHeight: 1.5,
                  }}
                >
                  {recipe.description?.slice(0, 80)}
                  {recipe.description?.length > 80 ? "..." : ""}
                </p>
                <p style={{ fontSize: 13, color: "#e67e22", fontWeight: 500 }}>
                  {recipe.matchedCount} of {recipe.totalCount} ingredients
                  available
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Recipes */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              All Recipes
            </h2>
            <p style={{ color: "#999", fontSize: 14 }}>
              {recipes.length} recipes available
            </p>
          </div>
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
            marginBottom: 20,
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
                style={{
                  display: "flex",
                  gap: 12,
                  fontSize: 13,
                  color: "#bbb",
                }}
              >
                <span>⏱ {recipe.prep_time + recipe.cook_time}min</span>
                <span>👤 {recipe.servings} servings</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
