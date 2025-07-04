const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMainCategories() {
  const res = await fetch(`${BASE_URL}/getallMCategory`);
  if (!res.ok) throw new Error("Failed to fetch main categories");
  const json = await res.json();
  return json.data;
}

export async function getSubCategories() {
  const res = await fetch(`${BASE_URL}/getallSubCategory`);
  if (!res.ok) throw new Error("Failed to fetch subcategories");
  const json = await res.json();
  return json.data;
}
