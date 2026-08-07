import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAllProducts } from '../../products/productThunks';
import type { Product } from '../../products/productTypes';

interface ProductSelectorProps {
  selectedProductId: number | null;
  onSelect: (productId: number | null) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ selectedProductId, onSelect }) => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const selectedProduct: Product | undefined = products.find((p) => p.id === selectedProductId);

  const filtered = products.filter(
    (p) =>
      p.productName.toLowerCase().includes(keyword.toLowerCase()) ||
      p.productCode.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleSelect = (product: Product) => {
    onSelect(product.id);
    setIsOpen(false);
    setKeyword('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setKeyword('');
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 min-w-[260px] px-3.5 py-2 bg-white border border-wms-border-color rounded-xl text-[13px] text-wms-text-main cursor-pointer hover:border-wms-primary transition-colors shadow-xs"
        id="product-selector-trigger"
      >
        {selectedProduct ? (
          <>
            <span className="flex-1 text-left font-medium truncate">
              {selectedProduct.productName}
            </span>
            <span className="text-wms-muted text-[11px] font-mono shrink-0">
              {selectedProduct.productCode}
            </span>
            <X
              size={13}
              className="text-wms-muted hover:text-red-500 shrink-0 transition-colors"
              onClick={handleClear}
            />
          </>
        ) : (
          <>
            <Search size={14} className="text-wms-muted shrink-0" />
            <span className="flex-1 text-left text-wms-muted">Select a product...</span>
            <ChevronDown size={14} className="text-wms-muted shrink-0" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-wms-border-color rounded-xl shadow-lg z-20 overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-wms-border-color">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-wms-bg rounded-lg">
                <Search size={13} className="text-wms-muted shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by name or code..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] outline-none text-wms-text-main placeholder:text-wms-muted"
                />
              </div>
            </div>

            {/* List */}
            <ul className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-[13px] text-wms-muted text-center">No results</li>
              ) : (
                filtered.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(product)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] cursor-pointer transition-colors hover:bg-wms-bg text-left ${
                        product.id === selectedProductId
                          ? 'bg-wms-primary/10 text-wms-primary font-semibold'
                          : 'text-wms-text-main'
                      }`}
                    >
                      <span className="truncate">{product.productName}</span>
                      <span className="text-wms-muted text-[11px] font-mono ml-2 shrink-0">
                        {product.productCode}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductSelector;
