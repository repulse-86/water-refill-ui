import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Droplet, Plus, X } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import usePosStore from '../../../store/posStore';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'water_refill', label: 'Refills' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'equipment', label: 'Equipment' },
];

const typeBadge = {
  water_refill: { variant: 'blue', label: 'Refill' },
  accessory: { variant: 'violet', label: 'Accessory' },
  equipment: { variant: 'slate', label: 'Equipment' },
};

export default function ProductGrid({ products, currency }) {
  const addToCart = usePosStore((state) => state.addToCart);
  const removeFromCart = usePosStore((state) => state.removeFromCart);
  const cart = usePosStore((state) => state.cart);
  const [category, setCategory] = useState('all');

  const cartMap = useMemo(
    () => Object.fromEntries(cart.map((item) => [item.product_id, item.quantity])),
    [cart]
  );

  const visible = useMemo(
    () => (category === 'all' ? products : products.filter((p) => p.type === category)),
    [products, category]
  );

  return (
    <div className="flex-1 min-w-0">
      <motion.div layout className="inline-flex items-center bg-gray-100 rounded-lg p-1 mb-4 gap-1">
        {CATEGORIES.map(({ id, label }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => setCategory(id)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              category === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
            layout
          >
            {label}
          </motion.button>
        ))}
      </motion.div>

      {visible.length === 0 ? (
        <p className="text-sm text-slate-400">No products available.</p>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.04 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {visible.map((product) => {
            const stock = Number(product.stock_quantity);
            const outOfStock = stock <= 0;
            const lowStock = !outOfStock && stock <= Number(product.reorder_point);
            const qty = cartMap[product.id] ?? 0;
            const inCart = qty > 0;
            const badge = typeBadge[product.type] ?? typeBadge.accessory;

            const tone = outOfStock
              ? 'border-red-200 bg-red-50/30'
              : lowStock
                ? 'border-amber-200 bg-amber-50/30'
                : 'border-slate-200 bg-white';

            const statusColor = outOfStock
              ? 'text-red-600'
              : lowStock
                ? 'text-amber-600'
                : 'text-slate-400';

            const statusText = outOfStock
              ? 'Out of stock'
              : lowStock
                ? `Low stock · ${stock} left`
                : `${stock} in stock`;

            return (
              <motion.button
                key={product.id}
                type="button"
                disabled={outOfStock}
                onClick={() => addToCart(product)}
                className={`group relative aspect-square flex flex-col ${tone} border rounded-xl p-3 text-left overflow-hidden
                  transition-all duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  hover:border-sky-300 hover:shadow-md hover:shadow-sky-100/60 hover:-translate-y-0.5
                  active:scale-[0.94] active:duration-100 active:ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
                  disabled:opacity-60 disabled:saturate-0 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:scale-100`}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
              >
                {product.image ? (
                  <>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </>
                ) : (
                  <Droplet
                    className={`pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${inCart ? 'text-sky-200/60' : 'text-sky-100/70'}`}
                  />
                )}

                <div className="relative z-10 flex-1 flex flex-col min-h-0">
                  <p className="text-base font-bold text-slate-800 leading-snug line-clamp-2 pr-12 drop-shadow-sm">{product.name}</p>
                  <div className="mt-1">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  {!outOfStock && (
                    <div className="absolute top-0 right-0 flex items-center gap-1">
                      {inCart && (
                        <span
                          role="button"
                          tabIndex={-1}
                          title="Remove from sale"
                          aria-label={`Remove ${product.name} from sale`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromCart(product.id);
                          }}
                          className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-red-100 hover:text-red-600 active:scale-90 transition"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      )}
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all
                          ${inCart ? 'bg-sky-600 text-white shadow-sm' : 'opacity-0 group-hover:opacity-100 bg-sky-600 text-white'}`}
                      >
                        {inCart && qty > 1 ? (
                          <span className="text-[10px] font-bold leading-none">{qty}</span>
                        ) : inCart ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {product.image ? (
                  <div className="relative z-10 mt-auto pt-2.5 border-t border-white/20">
                    <p className="text-base font-bold text-white tabular-nums leading-none drop-shadow-sm">
                      <span className="text-[11px] font-semibold text-white/80">{currency} </span>
                      {Number(product.price).toFixed(2)}
                    </p>
                    {inCart && qty > 0 && (
                      <p className="mt-1 text-[11px] font-bold text-white/90">Qty {qty}</p>
                    )}
                    {!inCart && (
                      <p className={`mt-1 text-[11px] font-medium leading-tight ${statusColor} text-white/90 drop-shadow-sm`}>{statusText}</p>
                    )}
                  </div>
                ) : (
                  <div className="relative z-10 mt-auto pt-2.5 border-t border-slate-100">
                    <p className="text-base font-bold text-sky-600 tabular-nums leading-none">
                      <span className="text-[11px] font-semibold text-slate-400">{currency} </span>
                      {Number(product.price).toFixed(2)}
                    </p>
                    <p className={`mt-1 text-[11px] font-medium leading-tight ${statusColor}`}>{statusText}</p>
                  </div>
                )}
               </motion.button>
             );
           })}
         </motion.div>
       )}
     </div>
   );
 }