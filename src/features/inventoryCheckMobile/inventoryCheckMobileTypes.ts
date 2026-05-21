export interface Product {
  id: string;
  sku: string;
  name: string;
  unit: string;
  category: string;
  zone: string;
  rack: string;
  shelf: string;
  expectedQty: number;
  image: string;
}

export interface StockTakeItem {
  productId: string;
  sku: string;
  name: string;
  unit: string;
  zone: string;
  rack: string;
  shelf: string;
  expectedQty: number;
  actualQty: number | null; // null if not yet counted
  notes?: string;
}

export interface StockTakeSheet {
  id: string;
  code: string;
  createdAt: string;
  completedAt: string | null;
  type: 'position' | 'product' | 'all';
  status: 'pending' | 'in_progress' | 'completed';
  zone: string | null; // e.g. "Khu vực A"
  rack: string | null; // e.g. "Dãy 01"
  selectedProductId: string | null; // if type is 'product'
  notes: string;
  items: StockTakeItem[];
  createdBy: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'SKU-FMCG-01',
    name: 'Nước xả vải Comfort Hương Ban Mai 1.8L',
    unit: 'Túi',
    category: 'Hàng tiêu dùng',
    zone: 'Zone A',
    rack: 'Dãy 01',
    shelf: 'Tầng 1',
    expectedQty: 45,
    image:
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'prod-2',
    sku: 'SKU-FMCG-02',
    name: 'Dầu ăn Simply Đậu nành nguyên chất 2L',
    unit: 'Chai',
    category: 'Hàng tiêu dùng',
    zone: 'Zone A',
    rack: 'Dãy 01',
    shelf: 'Tầng 2',
    expectedQty: 120,
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'prod-3',
    sku: 'SKU-FMCG-03',
    name: 'Bột giặt Omo Matic Cửa Trước 4kg',
    unit: 'Túi',
    category: 'Hàng tiêu dùng',
    zone: 'Zone A',
    rack: 'Dãy 02',
    shelf: 'Tầng 1',
    expectedQty: 32,
    image:
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'prod-4',
    sku: 'SKU-ELEC-01',
    name: 'Ấm đun siêu tốc Panasonic 1.7L',
    unit: 'Chiếc',
    category: 'Điện tử',
    zone: 'Zone B',
    rack: 'Dãy 01',
    shelf: 'Tầng 3',
    expectedQty: 15,
    image:
      'https://images.unsplash.com/photo-1594212699903-ec8a3cee50f6?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'prod-5',
    sku: 'SKU-ELEC-02',
    name: 'Nồi cơm điện cao tần Toshiba 1.8L',
    unit: 'Cái',
    category: 'Điện tử',
    zone: 'Zone B',
    rack: 'Dãy 02',
    shelf: 'Tầng 1',
    expectedQty: 8,
    image:
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'prod-6',
    sku: 'SKU-ELEC-03',
    name: 'Quạt đứng điện tử Mitsubishi LV16-RA',
    unit: 'Cái',
    category: 'Điện tử',
    zone: 'Zone B',
    rack: 'Dãy 03',
    shelf: 'Tầng 2',
    expectedQty: 24,
    image:
      'https://images.unsplash.com/photo-1618944847023-3e181ec167a5?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'prod-7',
    sku: 'SKU-BULK-01',
    name: 'Tủ nhựa Duy Tân Tabi 5 ngăn',
    unit: 'Bộ',
    category: 'Hàng cồng kềnh',
    zone: 'Zone C',
    rack: 'Dãy 01',
    shelf: 'Tầng 1',
    expectedQty: 10,
    image:
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'prod-8',
    sku: 'SKU-BULK-02',
    name: 'Bàn học sinh chống gù thông minh',
    unit: 'Chiếc',
    category: 'Hàng cồng kềnh',
    zone: 'Zone C',
    rack: 'Dãy 02',
    shelf: 'Tầng 1',
    expectedQty: 12,
    image:
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
];

export const MOCK_ZONES = [
  { id: 'Zone A', name: 'Khu vực A (Hàng tiêu dùng)' },
  { id: 'Zone B', name: 'Khu vực B (Điện tử)' },
  { id: 'Zone C', name: 'Khu vực C (Hàng cồng kềnh)' },
];

export const MOCK_RACKS = [
  { id: 'Dãy 01', name: 'Dãy 01' },
  { id: 'Dãy 02', name: 'Dãy 02' },
  { id: 'Dãy 03', name: 'Dãy 03' },
  { id: 'Dãy 04', name: 'Dãy 04' },
];
