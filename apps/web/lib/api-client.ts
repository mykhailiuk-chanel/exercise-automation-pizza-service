import type {
  CategoryDto,
  CrustDto,
  PaginatedResult,
  ProductDto,
  SizeDto,
  ToppingDto,
} from "@pizza/shared-types";

const API_BASE_URL = process.env.API_URL ?? "http://localhost:3053/api/v1";

/** Revalidate catalog data every 5 minutes (ISR) — menus don't change every second. */
const CATALOG_REVALIDATE_SECONDS = 300;

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`API request to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getCategories(): Promise<CategoryDto[]> {
  return apiGet<CategoryDto[]>("/categories");
}

export function getSizes(): Promise<SizeDto[]> {
  return apiGet<SizeDto[]>("/sizes");
}

export function getCrusts(): Promise<CrustDto[]> {
  return apiGet<CrustDto[]>("/crusts");
}

export function getToppings(): Promise<ToppingDto[]> {
  return apiGet<ToppingDto[]>("/toppings");
}

export function getProducts(params?: {
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResult<ProductDto>> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.page) search.set("page", String(params.page));
  if (params?.pageSize) search.set("pageSize", String(params.pageSize));
  const query = search.toString();
  return apiGet<PaginatedResult<ProductDto>>(
    `/products${query ? `?${query}` : ""}`,
  );
}

/** Returns null (rather than throwing) on a 404 so pages can call notFound(). */
export async function getProductBySlug(
  slug: string,
): Promise<ProductDto | null> {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API request to /products/${slug} failed with ${res.status}`);
  }
  return res.json() as Promise<ProductDto>;
}
