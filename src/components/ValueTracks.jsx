import { Brain, Swords, Briefcase } from 'lucide-react';

const tracks = [
  {
    icon: Swords,
    title: 'The Arena',
    desc: 'Wit under fire. Social calibration and improvisation.',
  },
  {
    icon: Brain,
    title: 'The Citadel',
    desc: 'Mindset protocols. Stoicism, focus, resilience.',
  },
  {
    icon: Briefcase,
    title: 'The Boardroom',
    desc: 'Negotiation, leverage, strategic communication.',
  },
];

export default function ValueTracks() {
  return (
    <section id="content" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">Specific benefits, real-world outcomes.</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((t, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
              <t.icon className="w-6 h-6 text-blue-400" />
              <h3 className="mt-4 text-white text-xl font-medium">{t.title}</h3>
              <p className="mt-2 text-slate-200/90">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
