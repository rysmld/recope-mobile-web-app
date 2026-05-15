import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../lib/api";
import { colors } from "../themes";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string;
}

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const navigation = useNavigation<any>();

  const fetchRecipes = async () => {
    const data = await api.get("/api/recipes");
    if (Array.isArray(data)) setRecipes(data);
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={colors.primary}
      />
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchRecipes();
            }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>All Recipes</Text>
              <Text style={styles.headerSub}>
                {recipes.length} recipes available
              </Text>
            </View>
            <TextInput
              style={styles.search}
              placeholder="Search recipes..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateRecipe")}
            >
              <Text style={styles.createButtonText}>+ Create Recipe</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different search or create a new recipe
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("RecipeDetail", { id: item.id })}
            activeOpacity={0.7}
          >
            <View style={styles.cardImage}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} />
              ) : (
                <Text style={styles.cardEmoji}>🍽️</Text>
              )}
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.cardMeta}>
                <Text style={styles.metaText}>
                  ⏱ {item.prep_time + item.cook_time}min
                </Text>
                <Text style={styles.metaText}>👤 {item.servings} servings</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 16, marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: "700", color: colors.textPrimary },
  headerSub: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  search: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  createButton: {
    marginHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  createButtonText: { color: colors.white, fontSize: 15, fontWeight: "600" },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  cardEmoji: { fontSize: 48 },
  cardBody: { padding: 14 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 20,
  },
  cardMeta: { flexDirection: "row", gap: 16 },
  metaText: { fontSize: 13, color: colors.textFaint },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
