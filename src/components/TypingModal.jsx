import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../utils/api';

export default function TypingModal() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [input, setInput] = useState('');
  const [startedAt, setStartedAt] = useState(0);
  const [done, setDone] = useState(false);
  const [reflection, setReflection] = useState('');

  // Hash router mini-impl
  useEffect(() => {
    const onHash = async () => {
      const hash = window.location.hash;
      const m = hash.match(/#\/train\/(.+)/);
      if (m) {
        setOpen(true);
        const id = m[1];
        const data = await api.contentById(id);
        setContent(data);
        setInput('');
        setDone(false);
        setReflection('');
        setStartedAt(Date.now());
      } else {
        setOpen(false);
      }
    };
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const expected = content?.text || '';

  const status = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < input.length && i < expected.length; i++) {
      if (input[i] === expected[i]) correct++;
      else break; // stop-on-error
    }
    const isExact = input === expected;
    const nextIndex = correct;
    return { correct, nextIndex, isExact };
  }, [input, expected]);

  useEffect(() => {
    if (status.isExact && expected.length > 0) {
      setDone(true);
    }
  }, [status, expected]);

  const onType = (e) => {
    const val = e.target.value;
    // enforce stop-on-error
    const idx = status.nextIndex;
    const incoming = val.slice(0, idx + 1);
    if (incoming === expected.slice(0, idx + 1)) {
      setInput(val);
    } else {
      // ignore invalid keystroke beyond the first mismatch
      setInput(expected.slice(0, idx));
    }
  };

  const handleSubmit = async () => {
    const durationSec = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const words = expected.trim().split(/\s+/).length;
    await api.submitSession({ content_id: content.id, words_typed: words, duration_sec: durationSec, reflection });
    window.location.hash = '';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-white/10 overflow-hidden">
        {done ? (
          <div className="p-6">
            <h3 className="text-white text-xl font-semibold">Congratulations! +{content.words} Words Typed.</h3>
            <p className="text-slate-300 mt-2">Describe one specific situation this week where you could have used this protocol.</p>
            <textarea value={reflection} onChange={(e) => setReflection(e.target.value)} className="mt-3 w-full h-28 p-3 rounded-lg bg-white/5 border border-white/10 text-white"/>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => (window.location.hash = '')} className="px-4 py-2 rounded-lg bg-white/10 text-white">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save & Continue</button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-slate-200 text-sm">{content.section} • {content.sender} • {content.topic_tag} • {content.difficulty}</div>
            <h3 className="text-white text-xl font-semibold mt-2">{content.title}</h3>
            <p className="text-slate-300 mt-2">{content.context}</p>
            <div className="mt-4 p-4 rounded-lg bg-black/30 border border-white/10">
              <p className="text-slate-200 whitespace-pre-wrap">
                {expected.split('').map((ch, i) => {
                  const typed = input[i];
                  let cls = '';
                  if (typed == null) cls = '';
                  else if (typed === ch && i < status.nextIndex) cls = 'text-green-400';
                  else if (typed !== ch) cls = 'bg-red-500/30 text-red-200';
                  return <span key={i} className={cls}>{ch}</span>;
                })}
              </p>
            </div>
            <textarea
              className="mt-4 w-full h-28 p-3 rounded-lg bg-white/5 border border-white/10 text-white"
              value={input}
              onChange={onType}
              placeholder="Start typing here..."
            />
            <div className="mt-2 text-slate-400 text-sm">{status.nextIndex}/{expected.length} characters correct</div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => (window.location.hash = '')} className="px-4 py-2 rounded-lg bg-white/10 text-white">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
