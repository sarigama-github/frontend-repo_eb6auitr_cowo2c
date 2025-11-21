export default function Gate() {
  return (
    <section id="unlock" className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-2xl font-semibold">Unlock All Advanced Tracks</h3>
              <p className="text-slate-200/90 mt-2">One-time €12 unlock. Lifetime access to 200+ elite protocols. No subscriptions. No fluff.</p>
            </div>
            <button className="px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg hover:scale-[1.02] transition">Buy Now – €12</button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <LockedCard title="Casanova: Social Maneuvering" />
            <LockedCard title="Jung: Shadow Integration" />
            <LockedCard title="Voss: Cold Read & Labeling" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LockedCard({ title }) {
  return (
    <div className="relative p-4 rounded-xl border border-white/10 bg-white/5">
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-xs tracking-widest text-slate-300">LOCKED</span>
      </div>
      <div className="opacity-30 select-none">
        <p className="text-white font-medium">{title}</p>
        <p className="text-slate-300 text-sm">Advanced Track</p>
      </div>
    </div>
  );
}
