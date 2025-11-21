import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">STOP CONSUMING. START INSTALLING KNOWLEDGE.</h1>
          <p className="mt-4 text-slate-200 max-w-2xl">A private training ground for men who value discipline over dopamine. Retype elite protocols. Earn mastery through proof of work.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#content" className="px-5 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl transition">Start Free Training</a>
            <a href="#unlock" className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition">Unlock All Advanced Tracks (€12)</a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-950" />
    </section>
  );
}
