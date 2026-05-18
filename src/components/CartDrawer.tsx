import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";
import { useEffect } from "react";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const checkoutUrl = useCartStore((s) => s.checkoutUrl);
  const syncCart = useCartStore((s) => s.syncCart);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "EUR";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    if (!checkoutUrl) return;
    window.open(checkoutUrl, "_blank");
    closeCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? openCart() : closeCart())}>
      <SheetTrigger asChild>
        <button
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper hover:text-sage transition-colors"
          aria-label="Open cart"
        >
          Cart [{totalItems}]
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-ink text-paper border-l border-paper/10 flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-3xl tracking-tighter text-paper">
            Your Cart
          </SheetTitle>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">
            {totalItems === 0 ? "Empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 mt-6">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="font-display text-5xl text-paper/20 mb-3">∅</div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
                  No pieces yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 border border-paper/10 p-3 bg-paper/[0.02]"
                >
                  <div className="w-20 h-20 flex-shrink-0 bg-paper/5 overflow-hidden">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg leading-tight truncate">
                      {item.productTitle}
                    </div>
                    {item.selectedOptions.length > 0 && (
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist mt-1">
                        {item.selectedOptions.map((o) => o.value).join(" · ")}
                      </div>
                    )}
                    <div className="font-mono text-sm text-paper mt-2">
                      {formatPrice(item.price.amount, item.price.currencyCode)}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-paper/15">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-7 h-7 font-mono text-sm text-paper hover:bg-paper/10 disabled:opacity-40"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-mono text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-7 h-7 font-mono text-sm text-paper hover:bg-paper/10 disabled:opacity-40"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        disabled={isLoading}
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist hover:text-sage disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-paper/10 pt-6 mt-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
                Subtotal
              </span>
              <span className="font-display text-2xl">
                {formatPrice(totalAmount.toString(), currency)}
              </span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist/60">
              Shipping & taxes calculated at checkout
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading || isSyncing || !checkoutUrl}
              className="w-full bg-paper text-ink font-mono text-xs uppercase tracking-[0.25em] py-5 hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || isSyncing ? "Working…" : "Checkout with Shopify →"}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
