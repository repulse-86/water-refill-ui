import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import useProductsStore from '../../store/productsStore';
import useCustomersStore from '../../store/customersStore';
import useOrdersStore from '../../store/ordersStore';
import useSettingsStore from '../../store/settingsStore';
import usePosStore from '../../store/posStore';
import PosHeader from './components/PosHeader';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import CheckoutSuccessModal from './components/CheckoutSuccessModal';
import CustomerPicker from './components/CustomerPicker';

export default function PosTerminal() {
  const { products, status: productStatus, fetchProducts } = useProductsStore(
    useShallow((state) => ({
      products: state.products,
      status: state.status,
      fetchProducts: state.fetchProducts,
    }))
  );

  const { customers, fetchCustomers } = useCustomersStore(
    useShallow((state) => ({
      customers: state.customers,
      fetchCustomers: state.fetchCustomers,
    }))
  );

  const currency = useSettingsStore((state) => state.settings?.currency ?? 'PHP');
  const customerId = usePosStore((state) => state.customerId);
  const setCustomerId = usePosStore((state) => state.setCustomerId);
  const lastOrder = usePosStore((state) => state.lastOrder);
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);

  useEffect(() => {
    if (products.length === 0 && productStatus === 'idle') {
      fetchProducts();
    }
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, [products.length, productStatus, customers.length, fetchProducts, fetchCustomers]);

  const handleSaleSuccess = async () => {
    await Promise.all([fetchProducts(), fetchCustomers(), fetchOrders()]);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PosHeader />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <CustomerPicker
            customers={customers}
            value={customerId}
            onChange={setCustomerId}
            currency={currency}
          />
          <ProductGrid products={products} currency={currency} />
        </div>
        <CartPanel customers={customers} currency={currency} onSaleSuccess={handleSaleSuccess} />
      </div>

      <CheckoutSuccessModal order={lastOrder} currency={currency} />
    </div>
  );
}