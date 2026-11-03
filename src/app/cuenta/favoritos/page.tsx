import { getProducts } from '@/lib/server/catalog';
import WishlistProducts from '@/components/cuenta/WishlistProducts';

export default async function WishlistPage() {
  const products = await getProducts();

  return <WishlistProducts products={products} />;
}
