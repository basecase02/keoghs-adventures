"use client";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { SaveBar } from "@/components/admin/AdminShell";
import type { SeedData } from "@/lib/types";
import { TODAY, uid } from "@/lib/utils";

type Draft = Pick<SeedData, "posts" | "faqs" | "reviews"> & { heroTitle: string; heroSub: string; announcement: string; announcementOn: boolean };
const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
// The headline and banner allow <em>/<b>; show Tony plain text with *stars* instead of tags.
const toStars = (h: string) => h.replace(/<\/?(em|b)>/g, "*");
const fromStars = (t: string, tag: "em" | "b") => { let open = false; return t.replace(/\*/g, () => ((open = !open) ? `<${tag}>` : `</${tag}>`)); };

export default function WebsiteAdmin() {
  const { s, update, ready } = useStore();
  const { toast } = useUI();
  const [d, setD] = useState<Draft | null>(null);
  const [dirty, setDirty] = useState(false);
  const fromStore = (): Draft => clone({ heroTitle: s.settings.heroTitle, heroSub: s.settings.heroSub, announcement: s.settings.announcement, announcementOn: s.settings.announcementOn, posts: s.posts, faqs: s.faqs, reviews: s.reviews });
  useEffect(() => { if (ready && !d) setD(fromStore()); }, [ready, d]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!d) return null;

  const set = (p: Partial<Draft>) => { setD({ ...d, ...p }); setDirty(true); };
  const editAt = <K extends "posts" | "faqs" | "reviews">(k: K, i: number, p: Partial<Draft[K][number]>) => set({ [k]: (d[k] as Draft[K][number][]).map((x, j) => (j === i ? { ...x, ...p } : x)) } as Partial<Draft>);
  const removeAt = (k: "posts" | "faqs" | "reviews", i: number) => set({ [k]: (d[k] as unknown[]).filter((_, j) => j !== i) } as Partial<Draft>);
  const save = () => {
    update((st) => {
      Object.assign(st.settings, { heroTitle: d.heroTitle, heroSub: d.heroSub, announcement: d.announcement, announcementOn: d.announcementOn });
      st.posts = [...d.posts].sort((a, b) => b.date.localeCompare(a.date)); st.faqs = d.faqs.filter((f) => f.q.trim()); st.reviews = d.reviews.filter((r) => r.text.trim());
    });
    setDirty(false); toast("Saved. The website is updated.");
  };

  return (
    <>
      <div className="ahead">
        <h1>Website</h1>
        <p>Change the words on your website. Open a section, type, then press Save. <Link className="link" href="/" target="_blank" rel="noopener noreferrer">See the website</Link></p>
      </div>

      <details className="acc" open>
        <summary><span><b>Banner at the top</b><small>Good for &ldquo;2 seats left&rdquo; or &ldquo;2027 dates out now&rdquo;</small></span></summary>
        <div className="body">
          <div className="field"><label htmlFor="ha">Banner text</label><input id="ha" type="text" value={toStars(d.announcement)} onChange={(e) => set({ announcement: fromStars(e.target.value, "b") })} /><span className="hint">Put *stars* around words to make them stand out.</span></div>
          <label className="row" style={{ gap: 12, fontWeight: 600, color: "var(--ink)" }}><button type="button" className="toggle" role="switch" aria-checked={d.announcementOn} onClick={() => set({ announcementOn: !d.announcementOn })} /> Show the banner</label>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>Home page headline</b><small>The big words over the first photo</small></span></summary>
        <div className="body">
          <div className="field"><label htmlFor="hh">Headline</label><input id="hh" type="text" value={toStars(d.heroTitle)} onChange={(e) => set({ heroTitle: fromStars(e.target.value, "em") })} /><span className="hint">Put *stars* around one word to make it gold and italic.</span></div>
          <div className="field"><label htmlFor="hs">Line underneath</label><textarea id="hs" style={{ minHeight: 90 }} value={d.heroSub} onChange={(e) => set({ heroSub: e.target.value })} /></div>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>Trip news</b><small>{d.posts.length} stories</small></span></summary>
        <div className="body">
          <button className="add" onClick={() => set({ posts: [{ id: uid("p"), title: "", date: TODAY, cover: `${BASE}/img/canning-convoy.jpg`, excerpt: "", body: "" }, ...d.posts] })}>+ Write a new story</button>
          {d.posts.map((p, i) => (
            <div key={p.id} className="itemrow">
              <div className="rowtop"><b>{p.title || "New story"}</b><button className="rm" onClick={() => removeAt("posts", i)}>Remove</button></div>
              <div className="field"><label>Title</label><input type="text" value={p.title} onChange={(e) => editAt("posts", i, { title: e.target.value })} /></div>
              <div className="field"><label>Short intro</label><textarea style={{ minHeight: 70 }} value={p.excerpt} onChange={(e) => editAt("posts", i, { excerpt: e.target.value })} /></div>
              <div className="field"><label>The story</label><textarea style={{ minHeight: 140 }} value={p.body} onChange={(e) => editAt("posts", i, { body: e.target.value })} /><span className="hint">Leave an empty line between paragraphs.</span></div>
            </div>
          ))}
        </div>
      </details>

      <details className="acc">
        <summary><span><b>Questions and answers</b><small>{d.faqs.length} questions</small></span></summary>
        <div className="body">
          {d.faqs.map((f, i) => (
            <div key={i} className="itemrow">
              <div className="rowtop"><b>Question {i + 1}</b><button className="rm" onClick={() => removeAt("faqs", i)}>Remove</button></div>
              <input type="text" aria-label="Question" placeholder="Question" value={f.q} onChange={(e) => editAt("faqs", i, { q: e.target.value })} />
              <textarea aria-label="Answer" style={{ minHeight: 90 }} placeholder="Answer" value={f.a} onChange={(e) => editAt("faqs", i, { a: e.target.value })} />
            </div>
          ))}
          <button className="add" onClick={() => set({ faqs: [...d.faqs, { q: "", a: "" }] })}>+ Add a question</button>
        </div>
      </details>

      <details className="acc">
        <summary><span><b>Reviews</b><small>Only add reviews guests are happy to share</small></span></summary>
        <div className="body">
          {d.reviews.map((r, i) => (
            <div key={r.id} className="itemrow">
              <div className="rowtop"><b>{r.name || "New review"}</b><button className="rm" onClick={() => removeAt("reviews", i)}>Remove</button></div>
              <div className="form">
                <div className="field"><label>Name</label><input type="text" placeholder="e.g. Mark H." value={r.name} onChange={(e) => editAt("reviews", i, { name: e.target.value })} /></div>
                <div className="field"><label>Trip</label><input type="text" value={r.trip} onChange={(e) => editAt("reviews", i, { trip: e.target.value })} /></div>
              </div>
              <div className="field"><label>What they said</label><textarea style={{ minHeight: 90 }} value={r.text} onChange={(e) => editAt("reviews", i, { text: e.target.value })} /></div>
            </div>
          ))}
          <button className="add" onClick={() => set({ reviews: [...d.reviews, { id: uid("r"), name: "", where: "", stars: 5, trip: "", text: "" }] })}>+ Add a review</button>
        </div>
      </details>

      {dirty && <SaveBar onSave={save} onDiscard={() => { setD(fromStore()); setDirty(false); }} />}
    </>
  );
}
