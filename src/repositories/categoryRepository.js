import { supabase } from "../lib/supabase";

function normalizeCategory(category) {
  return {
    ...category,

    userId: category.user_id,
    createdAt: category.created_at,
  };
}

export async function getCategories(userId) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map(normalizeCategory);
}

export async function createCategory(category) {
  const payload = {
    id: category.id,
    user_id: category.user_id,

    nome: category.nome,

    created_at: category.createdAt,
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return normalizeCategory(data);
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
  }
}