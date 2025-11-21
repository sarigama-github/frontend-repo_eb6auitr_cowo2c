import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Flame, BarChart3, Lock } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState({ rank: 'Initiate', xp: 0, streak: 0 });
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.profile().then(setProfile).catch(() => {});
    api.contentList().then(setItems).catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-slate-950/40">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6">
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-slate-300 text-xs">Current Rank</div>
              <div className="text-white font-medium">{profile.rank}</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-slate-300 text-xs mb-2">Progress</div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (profile.xp || 0) / 200)}%` }} />
            </div>
            <div className="mt-1 text-slate-400 text-xs">{profile.xp || 0} / 20,000 XP</div>
          </div>
          <nav className="mt-6 space-y-2 text-slate-200/90">
            <div>Training Inbox</div>
            <div>Archives</div>
            <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Analytics</div>
            <div className="flex items-center gap-2 opacity-60"><Lock className="w-4 h-4" /> The Club</div>
          </nav>
        </aside>

        <main className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white text-xl font-semibold">ESSENTIAL FOUNDATIONS</h3>
          <div className="mt-4 divide-y divide-white/10">
            {items.map((it) => (
              <Row key={it.id} item={it} />
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}

function Row({ item }) {
  const href = `#/train/${item.id}`; // hash link; handled by on-page modal
  return (
    <a href={href} className="group grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-4 hover:bg-white/5 rounded-xl px-3 transition">
      <div className="md:col-span-5 text-white font-medium">{item.sender}: {item.title}</div>
      <div className="md:col-span-2 text-slate-300 text-sm">{item.topic_tag}</div>
      <div className="md:col-span-2 text-slate-300 text-sm">{item.words} words</div>
      <div className="md:col-span-2 text-slate-300 text-sm">{item.time_estimate}</div>
      <div className="md:col-span-1 text-slate-300 text-sm">{item.difficulty}</div>
    </a>
  );
}
