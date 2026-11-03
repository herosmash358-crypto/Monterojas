import { getProducts } from '@/lib/server/catalog';
import { SearchContent } from './SearchContent';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || '';

  const products = await getProducts();

  return <SearchContent initialQuery={query} products={products} />;
}
