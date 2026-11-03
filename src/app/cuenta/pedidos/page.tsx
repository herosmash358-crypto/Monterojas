import { getServerOrders } from '@/lib/server/orders';
import OrdersList from '@/components/cuenta/OrdersList';

export default async function OrdersPage() {
  const orders = await getServerOrders();

  return <OrdersList orders={orders} />;
}
