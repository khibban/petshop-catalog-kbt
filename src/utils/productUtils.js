export const FALLBACK_IMAGE = 'https://placehold.co/640x640?text=No+Image'

export function formatHarga(harga) {
  if (harga === null || harga === undefined || harga === '') return 'Harga belum tersedia'
  const numeric = Number(harga)
  if (Number.isNaN(numeric)) return String(harga)
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(numeric)
}

export function resolveProductLink(link, id) {
  return link || `/product/${id}`
}

export function getCoverImage(product) {
  return product.cover_image || product.images?.[0] || FALLBACK_IMAGE
}

