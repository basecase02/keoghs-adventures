"use client";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/utils";

export default function NewsPage() {
  const { s } = useStore();
  return (
    <>
      <section className="phead"><img src={`${BASE}/img/stock-convoy-desert.jpg`} alt="" /><div className="wrap">
        <div className="crumbs"><Link href="/">Home</Link><span>/</span><span>Trip news</span></div>
        <h1 className="t-hero">Notes from the <em>track</em></h1>
        <p>Trip reports, new vehicles and what&apos;s coming next.</p>
      </div></section>
      <section className="sec s-paper light"><div className="wrap"><div className="grid cols-3" style={{ rowGap: 44 }}>{s.posts.map((p) => (
        <Link key={p.id} className="post" href={`/news/${p.id}`}><div className="ph"><img src={p.cover} alt="" loading="lazy" /></div><time>{fmtDate(p.date)}</time><h3>{p.title}</h3><p>{p.excerpt}</p></Link>
      ))}</div></div></section>
    </>
  );
}
