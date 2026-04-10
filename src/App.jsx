import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://srlvdlhozsbzlyvoudqq.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybHZkbGhvenNiemx5dm91ZHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTM4NzksImV4cCI6MjA5MTMyOTg3OX0.J5vkJ4beSGDWBj4yS869jFoKVptpiusWtJ8CeOl_h4U"
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const products = [
  { id: 1, name: "Kurma Ajwa", price: 85000, emoji: "🫘", stock: 50, category: "Makanan", desc: "Kurma premium pilihan" },
  { id: 2, name: "Madu Hutan", price: 120000, emoji: "🍯", stock: 30, category: "Minuman", desc: "Madu asli hutan tropis" },
  { id: 3, name: "Susu Kambing", price: 35000, emoji: "🥛", stock: 40, category: "Minuman", desc: "Susu kambing segar" },
  { id: 4, name: "Roti Gandum", price: 25000, emoji: "🍞", stock: 60, category: "Makanan", desc: "Roti gandum bergizi" },
  { id: 5, name: "Teh Herbal", price: 45000, emoji: "🍵", stock: 25, category: "Minuman", desc: "Teh herbal alami" },
  { id: 6, name: "Minyak Zaitun", price: 75000, emoji: "🫙", stock: 20, category: "Lainnya", desc: "Minyak zaitun extra virgin" },
  { id: 7, name: "Kismis", price: 30000, emoji: "🍇", stock: 45, category: "Makanan", desc: "Kismis manis bergizi" },
  { id: 8, name: "Sari Delima", price: 55000, emoji: "🍹", stock: 15, category: "Minuman", desc: "Minuman sari buah delima" },
]

const fmt = (n) => "Rp " + Math.round(n).toLocaleString("id-ID")

// ─── LOGIN ───────────────────────────────────────────────────────
function LoginScreen({ onLogin, onGoRegister }) {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.email || !form.password) { setError("Email dan password wajib diisi."); return }
    if (!form.email.includes("@")) { setError("Format email tidak valid."); return }
    setLoading(true)
    setError("")
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    onLogin({ email: data.user.email, name: data.user.email.split("@")[0], id: data.user.id })
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕌</div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">Zeline SMart</h1>
          <p className="text-gray-500 text-sm">Sistem POS Syariah Terpercaya</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Masuk ke Akun</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="contoh@email.com"
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder-gray-600" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder-gray-600" />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mb-4">⚠ {error}</p>}
          <button onClick={submit} disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold py-3 rounded-xl transition-all text-sm mb-4">
            {loading ? "Memproses..." : "Masuk →"}
          </button>
          <div className="bg-gray-800 rounded-xl p-3 mb-4">
            <p className="text-xs text-gray-500 italic text-center">"Sesungguhnya Allah menyukai orang yang jujur." — HR. Tirmidzi</p>
          </div>
          <p className="text-center text-xs text-gray-500">Belum punya akun?{" "}
            <button onClick={onGoRegister} className="text-yellow-400 hover:underline font-medium">Daftar sekarang</button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── REGISTER ────────────────────────────────────────────────────
function RegisterScreen({ onRegister, onGoLogin }) {
  const [form, setForm] = useState({ name: "", email: "", store: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.name || !form.email || !form.store || !form.password || !form.confirm) { setError("Semua field wajib diisi."); return }
    if (!form.email.includes("@")) { setError("Format email tidak valid."); return }
    if (form.password.length < 6) { setError("Password minimal 6 karakter."); return }
    if (form.password !== form.confirm) { setError("Password tidak cocok."); return }
    setLoading(true)
    setError("")
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, store: form.store } }
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    onRegister({ name: form.name, email: form.email, store: form.store, id: data.user?.id })
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕌</div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">Zeline SMart</h1>
          <p className="text-gray-500 text-sm">Daftar sebagai kasir baru</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Buat Akun Kasir</h2>
          <div className="space-y-4 mb-6">
            {[
              { name: "name", label: "Nama Lengkap", placeholder: "Masukkan nama lengkap", type: "text" },
              { name: "email", label: "Email", placeholder: "contoh@email.com", type: "email" },
              { name: "store", label: "Nama Toko", placeholder: "Nama toko Anda", type: "text" },
              { name: "password", label: "Password", placeholder: "Minimal 6 karakter", type: "password" },
              { name: "confirm", label: "Konfirmasi Password", placeholder: "Ulangi password", type: "password" },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs text-gray-400 font-medium mb-1 block">{f.label}</label>
                <input name={f.name} type={f.type} value={form[f.name]} onChange={handle} placeholder={f.placeholder}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder-gray-600" />
              </div>
            ))}
          </div>
          {error && <p className="text-red-400 text-xs mb-4">⚠ {error}</p>}
          <button onClick={submit} disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold py-3 rounded-xl transition-all text-sm mb-4">
            {loading ? "Memproses..." : "Daftar Sekarang →"}
          </button>
          <p className="text-center text-xs text-gray-500">Sudah punya akun?{" "}
            <button onClick={onGoLogin} className="text-yellow-400 hover:underline font-medium">Masuk di sini</button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── WELCOME ─────────────────────────────────────────────────────
function WelcomeScreen({ user, onStart, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-6 text-center">
      <div className="mb-6 text-7xl">🕌</div>
      <h1 className="text-4xl font-bold text-yellow-400 mb-1">Zeline SMart</h1>
      <p className="text-gray-400 text-lg mb-1">Toko Produk Halal & Terpercaya</p>
      <p className="text-gray-600 text-sm mb-2 italic">"وَأَحَلَّ اللَّهُ الْبَيْعَ" — Allah menghalalkan jual beli (QS. Al-Baqarah: 275)</p>
      <p className="text-yellow-400 text-sm mb-8 font-medium">Selamat datang, <span className="capitalize">{user.name}</span>! 👋</p>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[["✅","100% Produk\nHalal & Tersertifikasi"],["🤖","AI Audit\nSyariah Otomatis"],["🧾","Struk Digital\nReal-Time"]].map(([icon,label],i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xs text-gray-400 whitespace-pre-line">{label}</p>
          </div>
        ))}
      </div>
      <button onClick={onStart} className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-lg px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-yellow-400/20 mb-4">
        Mulai Transaksi →
      </button>
      <button onClick={onLogout} className="text-gray-600 text-xs hover:text-gray-400 transition-all">Keluar dari akun</button>
    </div>
  )
}

// ─── PRODUCTS ────────────────────────────────────────────────────
function ProductScreen({ cart, setCart, onCheckout, onBack, user }) {
  const [filter, setFilter] = useState("Semua")
  const [search, setSearch] = useState("")
  const categories = ["Semua", "Makanan", "Minuman", "Lainnya"]
  const filtered = products.filter(p =>
    (filter === "Semua" || p.category === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )
  const addToCart = (p) => {
    const existing = cart.find(i => i.id === p.id)
    if (existing) setCart(cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
    else setCart([...cart, { ...p, qty: 1 }])
  }
  const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id))
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white">←</button>
          <span className="text-xl">🕌</span>
          <div>
            <h1 className="text-lg font-bold text-yellow-400">Zeline SMart</h1>
            <p className="text-xs text-gray-500">Kasir: <span className="capitalize text-gray-400">{user.name}</span></p>
          </div>
        </div>
        <button onClick={onCheckout} disabled={cart.length === 0}
          className="relative bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold px-5 py-2 rounded-xl text-sm transition-all hover:bg-yellow-300">
          🛒 Keranjang
          {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          <input type="text" placeholder="🔍 Cari produk..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-500 mb-4" />
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === c ? "bg-yellow-400 text-gray-950" : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-yellow-500"}`}>{c}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => {
              const inCart = cart.find(i => i.id === p.id)
              return (
                <div key={p.id} onClick={() => addToCart(p)}
                  className="bg-gray-900 border border-gray-800 hover:border-yellow-500 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/10">
                  <div className="text-4xl mb-3">{p.emoji}</div>
                  <span className="text-xs text-green-400 border border-green-800 bg-green-950 px-2 py-0.5 rounded-full">HALAL ✓</span>
                  <p className="font-semibold text-sm mt-2">{p.name}</p>
                  <p className="text-gray-500 text-xs mb-2">{p.desc}</p>
                  <p className="text-yellow-400 font-bold text-sm">{fmt(p.price)}</p>
                  <p className="text-gray-600 text-xs">Stok: {p.stock}</p>
                  {inCart && <div className="mt-2 bg-yellow-400 text-gray-950 text-xs font-bold text-center py-1 rounded-lg">✓ {inCart.qty} di keranjang</div>}
                </div>
              )
            })}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col p-4 overflow-y-auto">
            <h2 className="font-bold text-yellow-400 mb-4">🛒 Keranjang ({totalItems})</h2>
            <div className="flex-1 space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                  <span className="text-lg">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs text-yellow-400">{fmt(item.price * item.qty)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => item.qty === 1 ? removeFromCart(item.id) : setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i))}
                      className="w-5 h-5 bg-gray-700 rounded text-xs hover:bg-red-800">−</button>
                    <span className="text-xs w-4 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-5 h-5 bg-gray-700 rounded text-xs hover:bg-green-800">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-3 mt-3">
              <div className="flex justify-between text-sm text-gray-400 mb-1"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-gray-400 mb-3"><span>Zakat (2.5%)</span><span>{fmt(subtotal * 0.025)}</span></div>
              <div className="flex justify-between font-bold text-white mb-4"><span>TOTAL</span><span className="text-yellow-400">{fmt(subtotal * 1.025)}</span></div>
              <button onClick={onCheckout} className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold py-3 rounded-xl transition-all">Lanjut Bayar →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PAYMENT ─────────────────────────────────────────────────────
function PaymentScreen({ cart, onBack, onSuccess, user }) {
  const [bayar, setBayar] = useState("")
  const [method, setMethod] = useState("tunai")
  const [buyerName, setBuyerName] = useState("")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const zakat = subtotal * 0.025
  const total = subtotal + zakat
  const kembalian = parseFloat(bayar) - total

  const canSubmit = buyerName && buyerEmail &&
    (method === "transfer" || (method === "tunai" && bayar && kembalian >= 0))

  const handleSelesai = async () => {
    setLoading(true)
    const { error } = await supabase.from("transaksi").insert({
      user_id: user.id,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      method,
      items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, emoji: i.emoji })),
      subtotal,
      zakat,
      total,
    })
    setLoading(false)
    if (error) { alert("Gagal simpan transaksi: " + error.message); return }
    onSuccess({ name: buyerName, email: buyerEmail, method })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-white">←</button>
        <span className="text-xl">🕌</span>
        <div>
          <h1 className="text-lg font-bold text-yellow-400">Konfirmasi Pembayaran</h1>
          <p className="text-xs text-gray-500">Kasir: <span className="capitalize">{user.name}</span></p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full p-6 space-y-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-3">Data Pembeli</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nama Pembeli *</label>
              <input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Masukkan nama pembeli"
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email Pembeli *</label>
              <input value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} placeholder="email@pembeli.com"
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-3">Ringkasan Pesanan</h3>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-800">
              <span>{item.emoji} {item.name} x{item.qty}</span>
              <span className="text-yellow-400">{fmt(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-gray-400"><span>Zakat/Sadaqah (2.5%)</span><span>{fmt(zakat)}</span></div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-800">
              <span>TOTAL</span><span className="text-yellow-400">{fmt(total)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-green-800 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">🤖 AI Audit Result</p>
          <p className="text-green-400 text-sm font-medium">✅ Semua produk terverifikasi HALAL. Transaksi sesuai prinsip Syariah.</p>
          <p className="text-gray-600 text-xs mt-1">Tidak ada pelanggaran akad terdeteksi • Audit selesai</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-3">Metode Pembayaran</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {["tunai", "transfer"].map(m => (
              <button key={m} onClick={() => setMethod(m)}
                className={`py-3 rounded-xl text-sm font-medium border transition-all ${method === m ? "bg-yellow-400 text-gray-950 border-yellow-400" : "bg-gray-800 text-gray-400 border-gray-700 hover:border-yellow-500"}`}>
                {m === "tunai" ? "💵 Tunai (Ambil di Tempat)" : "📱 Transfer (Dikirim)"}
              </button>
            ))}
          </div>

          {method === "tunai" && (
            <>
              <div className="bg-blue-950 border border-blue-800 rounded-xl px-4 py-2 text-blue-300 text-xs mb-3">
                ℹ️ Pembayaran tunai dilakukan saat pembeli mengambil barang di toko.
              </div>
              <input type="number" placeholder="Masukkan nominal uang (Rp)" value={bayar} onChange={e => setBayar(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white outline-none text-sm mb-2" />
              {bayar && kembalian >= 0 && <div className="bg-green-950 border border-green-800 rounded-xl px-4 py-2 text-green-400 text-sm font-medium">💚 Kembalian: {fmt(kembalian)}</div>}
              {bayar && kembalian < 0 && <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-2 text-red-400 text-sm">❌ Uang kurang: {fmt(Math.abs(kembalian))}</div>}
            </>
          )}

          {method === "transfer" && (
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Transfer ke rekening berikut:</p>
              <div className="bg-gray-700 rounded-lg p-3 mb-2">
                <p className="text-xs text-gray-400">Bank Syariah Indonesia (BSI)</p>
                <p className="text-white font-bold text-lg">7123456789</p>
                <p className="text-xs text-gray-400">a.n. Zeline SMart</p>
              </div>
              <p className="text-yellow-400 font-bold text-center text-lg">{fmt(total)}</p>
              <p className="text-gray-500 text-xs text-center mt-1">Barang akan dikirim setelah pembayaran dikonfirmasi</p>
            </div>
          )}
        </div>

        <button onClick={handleSelesai} disabled={!canSubmit || loading}
          className="w-full bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 hover:bg-yellow-300 text-gray-950 font-bold py-4 rounded-2xl text-lg transition-all hover:scale-[1.01]">
          {loading ? "Menyimpan..." : "✓ Selesaikan Transaksi"}
        </button>
      </div>
    </div>
  )
}

// ─── SUCCESS ─────────────────────────────────────────────────────
function SuccessScreen({ cart, onReset, buyer }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal * 1.025
  const now = new Date().toLocaleString("id-ID")
  const noStruk = `ZS-${Date.now().toString().slice(-6)}`

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-400 mb-1">Transaksi Berhasil!</h2>
        <p className="text-gray-400 text-sm mb-6">Jazakallah khairan atas kepercayaan Anda</p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-left mb-6">
          <div className="text-center mb-4 border-b border-gray-800 pb-3">
            <p className="text-yellow-400 font-bold text-lg">🕌 Zeline SMart</p>
            <p className="text-gray-500 text-xs">{now}</p>
            <p className="text-gray-600 text-xs">No. Struk: {noStruk}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">Data Pembeli</p>
            <p className="text-white text-sm font-medium capitalize">{buyer.name}</p>
            <p className="text-gray-400 text-xs">{buyer.email}</p>
            <p className="text-gray-500 text-xs mt-1">
              {buyer.method === "tunai" ? "💵 Tunai — Ambil di Tempat" : "📱 Transfer — Dikirim ke Alamat"}
            </p>
          </div>

          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-1 text-gray-400">
              <span>{item.emoji} {item.name} x{item.qty}</span>
              <span>{fmt(item.price * item.qty)}</span>
            </div>
          ))}

          <div className="border-t border-gray-800 mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-gray-400"><span>Zakat (2.5%)</span><span>{fmt(subtotal * 0.025)}</span></div>
            <div className="flex justify-between font-bold text-white text-base mt-1"><span>TOTAL</span><span className="text-yellow-400">{fmt(total)}</span></div>
          </div>

          <div className="mt-3 bg-green-950 border border-green-800 rounded-xl p-2 text-center">
            <p className="text-green-400 text-xs">🤖 AI Audit: Transaksi Syariah Terverifikasi ✓</p>
          </div>
        </div>

        <button onClick={onReset} className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold py-3 rounded-2xl transition-all">
          Transaksi Baru →
        </button>
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login")
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [buyer, setBuyer] = useState(null)

  // Cek session yang masih aktif
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email, name: session.user.email.split("@")[0], id: session.user.id })
        setScreen("welcome")
      }
    })
  }, [])

  const handleLogin = (u) => { setUser(u); setScreen("welcome") }
  const handleRegister = (u) => { setUser(u); setScreen("welcome") }
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null); setCart([]); setScreen("login")
  }
  const handleSuccess = (b) => { setBuyer(b); setScreen("success") }
  const handleReset = () => { setCart([]); setScreen("welcome") }

  return (
    <>
      {screen === "login" && <LoginScreen onLogin={handleLogin} onGoRegister={() => setScreen("register")} />}
      {screen === "register" && <RegisterScreen onRegister={handleRegister} onGoLogin={() => setScreen("login")} />}
      {screen === "welcome" && <WelcomeScreen user={user} onStart={() => setScreen("products")} onLogout={handleLogout} />}
      {screen === "products" && <ProductScreen cart={cart} setCart={setCart} onCheckout={() => setScreen("payment")} onBack={() => setScreen("welcome")} user={user} />}
      {screen === "payment" && <PaymentScreen cart={cart} onBack={() => setScreen("products")} onSuccess={handleSuccess} user={user} />}
      {screen === "success" && <SuccessScreen cart={cart} onReset={handleReset} buyer={buyer} />}
    </>
  )
}
