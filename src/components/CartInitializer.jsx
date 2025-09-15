import { useEffect } from 'react';
import useCartStore from '../store/cartStore';

const CartInitializer = ({ children }) => {
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return children;
};

export default CartInitializer;