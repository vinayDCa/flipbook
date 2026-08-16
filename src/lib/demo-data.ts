export const DEMO_CATALOGUE = {
  id: 'demo-krish-aw26',
  title: 'KRISH ETHNIC WEAR — AW 2026',
  slug: 'krish-aw26',
  business_name: 'KRISH ETHNIC WEAR',
  whatsapp: '+919876543210',
  primary_color: '#4f46e5',
  page_count: 12,
  pages: Array.from({ length: 12 }).map((_, i) => ({
    page_number: i + 1,
    image_url: `https://placehold.co/800x1131/F9F8F6/1A1A1A?text=Page+${i + 1}`,
    thumbnail_url: `https://placehold.co/200x282/F9F8F6/1A1A1A?text=Page+${i + 1}`
  })),
  products: [
    {
      id: 'prod-1',
      name: 'Premium Kurta Set',
      product_code: 'KEW-104',
      price: 2499,
      page_number: 2,
    },
    {
      id: 'prod-2',
      name: 'Designer Lehenga',
      product_code: 'KEW-205',
      price: 8999,
      page_number: 4,
    }
  ],
  hotspots: [
    {
      id: 'hotspot-1',
      page_number: 2,
      x: 50,
      y: 80,
      width: 40,
      height: 10,
      type: 'whatsapp',
      target: 'KEW-104',
      whatsapp_number: '+919876543211'
    }
  ]
};
