import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import products from './data/products'
import { formatHarga, getCoverImage } from './utils/productUtils'

function Icon({ name, cls = '' }) {
  return <span className={`material-symbols-outlined ${cls}`}>{name}</span>
}

function Header({ q, setQ }) {
  return (
    <header className="relative flex items-center w-full px-margin-page h-header-height sticky top-0 z-50 bg-surface border-b border-surface-variant">
      <div className="flex items-center gap-8 shrink-0">
        <Link to="/" className="text-[20px] font-extrabold text-primary">Paw & Fluff</Link>
        <nav className="hidden md:flex gap-4 text-[14px]">
          <a className="text-on-surface-variant hover:text-primary-container transition-colors" href="#">Promo</a>
          <a className="text-on-surface-variant hover:text-primary-container transition-colors" href="https://shopee.co.id/paw.n.fluff.petshop" target="_blank" rel="noopener noreferrer">Toko Kami</a>
          <a className="text-on-surface-variant hover:text-primary-container transition-colors" href="https://www.instagram.com/pawnfluffsby/" target="_blank" rel="noopener noreferrer">Hubungi Kami</a>
        </nav>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 hidden lg:block">
        <div className="relative">
          <Icon name="search" cls="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full bg-[#f5f3f3] border-none rounded-full py-3 pl-12 pr-10 focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50" placeholder="Cari perlengkapan anabul..." type="text" />
          {q && (
            <button onClick={() => setQ('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
              <Icon name="close" cls="text-[18px]" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function CatalogPage({ q, setQ }) {
  const [selectedPath, setSelectedPath] = useState('all')
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [openMap, setOpenMap] = useState({})
  const categoryTree = useMemo(() => {
    const root = {}
    products.forEach((p) => {
      const levels = [p.sub_category_1, p.sub_category_2, p.sub_category_3, p.sub_category_4, p.sub_category_5].filter(Boolean)
      let node = root
      levels.forEach((lv) => {
        if (!node[lv]) node[lv] = {}
        node = node[lv]
      })
    })
    return root
  }, [])
  const filtered = useMemo(() => products.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.sub_category_1} ${p.sub_category_2} ${p.sub_category_3} ${p.sub_category_4 || ''} ${p.sub_category_5 || ''}`.toLowerCase()
    const path = [p.sub_category_1, p.sub_category_2, p.sub_category_3, p.sub_category_4, p.sub_category_5].filter(Boolean).join(' > ')
    const byCategory = selectedPath === 'all' || path.startsWith(selectedPath)
    const numericPrice = Number(p.harga)
    const byPrice = Number.isNaN(numericPrice) || p.harga === null || numericPrice <= maxPrice
    return hay.includes(q.toLowerCase()) && byCategory && byPrice
  }), [q, selectedPath, maxPrice])

  function toggleOpen(path) {
    setOpenMap((prev) => ({ ...prev, [path]: !prev[path] }))
  }

  function CategoryNode({ label, node, path, depth = 0 }) {
    const keys = Object.keys(node || {})
    const hasChildren = keys.length > 0
    if (!hasChildren) {
      return (
        <button onClick={() => setSelectedPath(path)} className={`block px-4 py-1.5 text-[14px] text-left ${selectedPath === path ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
          {label}
        </button>
      )
    }
    const isOpen = !!openMap[path]
    return (
      <div>
        <button type="button" onClick={() => { toggleOpen(path); setSelectedPath(path) }} className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-[14px] text-on-surface-variant hover:bg-[#efeded]">
          <span className={`${selectedPath === path ? 'text-primary font-bold' : ''}`}>{label}</span>
          <Icon name="expand_more" cls={`text-[18px] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`${isOpen ? 'block' : 'hidden'} pl-4 mt-1 space-y-1`}>
          {keys.map((k) => <CategoryNode key={`${path}>${k}`} label={k} node={node[k]} path={`${path} > ${k}`} depth={depth + 1} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto flex">
      <aside className="flex flex-col gap-2 p-4 sticky top-header-height h-[calc(100vh-80px)] overflow-y-auto w-sidebar-width bg-surface border-r border-surface-variant">
        <div className="mb-4">
          <h3 className="text-[20px] font-semibold">Filter</h3>
          <p className="text-[12px] text-on-surface-variant">Customize your search</p>
          <button onClick={() => { setQ(''); setSelectedPath('all'); setMaxPrice(1000000); setOpenMap({}) }} className="text-primary text-[12px] font-bold mt-2 hover:underline">Reset All</button>
        </div>
        <p className="font-bold text-on-surface-variant text-[11px] px-4 py-2 uppercase tracking-wider">Categories</p>
        {Object.keys(categoryTree).map((k) => <CategoryNode key={k} label={k} node={categoryTree[k]} path={k} />)}
        <div className="mt-6 border-t border-surface-variant pt-4 px-4">
          <p className="font-bold text-on-surface-variant text-[14px] mb-2">Price Range</p>
          <input className="w-full accent-primary" type="range" min="0" max="1000000" step="10000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
          <div className="flex justify-between text-[12px] text-on-surface-variant mt-1">
            <span>Rp0</span><span>{new Intl.NumberFormat('id-ID').format(maxPrice)}</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-margin-page bg-surface">
        <div className="flex justify-between items-end mb-8 gap-3 flex-col md:flex-row">
          <h1 className="text-[16px] text-on-surface-variant">Showing {filtered.length} results</h1>
        </div>
        <div className="flex gap-2 mb-8">
          <button onClick={() => { setQ(''); setSelectedPath('all'); setMaxPrice(1000000) }} className="bg-[#efeded] text-on-surface p-2 rounded-lg flex items-center hover:bg-[#eae8e7] transition-colors"><Icon name="close" cls="text-[18px]" /></button>
          <div className="bg-[#efeded] px-3 py-1.5 rounded-lg flex items-center gap-2 text-[14px]"><Icon name="check_circle" cls="text-[16px] text-primary" /><span>{selectedPath === 'all' ? 'Semua Kategori' : selectedPath}</span></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="bg-white border border-surface-variant rounded-xl overflow-hidden group hover:border-primary transition-all duration-300">
              <div className="relative aspect-square bg-[#f5f3f3]">
                <img alt={p.name} className="w-full h-full object-cover" src={getCoverImage(p)} />
                <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full text-on-surface-variant"><Icon name="favorite" /></button>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-[12px] text-primary font-bold uppercase tracking-wider">{p.sub_category_2 || 'Pets'}</p>
                <h4 className="text-[16px] font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">{p.name}</h4>
                <div className="flex items-baseline gap-2"><span className="text-[18px] font-bold text-on-surface">{formatHarga(p.harga)}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

function ProductPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const p = products.find((x) => String(x.id) === String(id))
  const gallery = p ? [getCoverImage(p), ...(p.images || [])].filter(Boolean) : []
  const [active, setActive] = useState(0)
  const [variant, setVariant] = useState(0)
  const [mainImageOverride, setMainImageOverride] = useState('')
  if (!p) return <main className="p-8"><button onClick={() => nav('/')} className="rounded border px-3 py-2">Kembali</button><p className="mt-4">Produk tidak ditemukan.</p></main>

  const activeVariantImage = p.variations?.[variant]?.option_image
  const mainImage = mainImageOverride || activeVariantImage || gallery[active]
  const displayPrice = p.variations?.length > 0
    ? (p.variations[variant]?.price ?? p.harga)
    : p.harga

  return (
    <main className="max-w-[1440px] mx-auto px-margin-page py-4">
      <nav className="flex items-center gap-2 mb-6 text-[14px] text-on-surface-variant">
        <button onClick={() => nav('/')} className="hover:text-primary transition-colors">Pets</button><Icon name="chevron_right" cls="text-[16px]" /><span className="text-on-surface font-semibold">{p.sub_category_2 || 'Pet Food'}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-white border border-outline-variant group relative">
            <img alt={p.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" src={mainImage} />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {gallery.map((img, i) => (
              <button
                key={`${img}-${i}`}
                className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white p-1 ${i === active ? 'border-2 border-primary' : 'border border-outline-variant'}`}
                onClick={() => {
                  setActive(i)
                  setMainImageOverride(img)
                }}
              >
                <img alt={`Thumb ${i + 1}`} className="w-full h-full object-contain" src={img} />
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h1 className="text-[32px] font-bold leading-tight">{p.name}</h1>
            <span className="text-[32px] text-primary font-bold">{formatHarga(displayPrice)}</span>
          </div>
          {p.variations?.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center"><h3 className="text-[20px] font-semibold">Pilih Varian</h3></div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {p.variations.map((v, i) => (
                  <button
                    key={v.option_name}
                    onClick={() => {
                      setVariant(i)
                      setMainImageOverride(v.option_image || '')
                      if (!v.option_image) setActive(0)
                    }}
                    className={`cursor-pointer rounded-xl p-3 flex flex-col items-center text-center transition-all ${i === variant ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant bg-white hover:border-primary'}`}
                  >
                    <div className="w-16 h-16 mb-2 rounded-lg bg-white p-1 border border-outline-variant"><img alt={v.option_name} className="w-full h-full object-contain" src={v.option_image || getCoverImage(p)} /></div>
                    <span className={`text-[12px] ${i === variant ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>{v.option_name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="pt-6 border-t border-outline-variant">
            <a href={p.link || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-14 rounded-2xl bg-primary text-on-primary font-bold text-[16px] hover:opacity-90 transition-all">Lihat di Shopee</a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function App() {
  const [q, setQ] = useState('')
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Header q={q} setQ={setQ} />
      <Routes>
        <Route path="/" element={<CatalogPage q={q} setQ={setQ} />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <footer className="bg-[#f5f3f3] border-t border-surface-variant mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-margin-page gap-4 max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-2">
            <span className="text-[20px] font-extrabold text-on-surface-variant">PawStore</span>
            <p className="text-[14px] text-on-surface-variant">© 2024 PawStore Pet Supplies. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-[14px]">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Shipping Info</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Returns</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
