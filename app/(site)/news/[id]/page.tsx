"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Icon } from "@/lib/icons";
import { fmtDate } from "@/lib/utils";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { s } = useStore();
  const p = s.posts.find((x) => x.id === id);
  if (!p) return <section className="phead"><div className="wrap"><h1 className="t-1">Post not found</h1><Link className="btn btn-primary" href="/news">All trip news</Link></div></section>;
  return (
    <>
      <section className="phead tall"><img src={p.cover} alt="" /><div className="wrap">
        <div className="crumbs"><Link href="/">Home</Link><span>/</span><Link href="/news">Trip news</Link></div>
        <h1 className="t-hero" style={{ maxWidth: "18ch" }}>{p.title}</h1>
        <p className="serif" style={{ fontSize: "1.2rem", color: "var(--ochre)" }}>{fmtDate(p.date)}</p>
      </div></section>
      <article className="sec s-paper light"><div className="wrap"><div className="prose" style={{ marginInline: "auto" }}>
        <p className="lede" style={{ color: "var(--ink)", fontSize: "1.2rem" }}>{p.excerpt}</p>
        {p.body.split("\n\n").map((x, i) => <p key={i}>{x}</p>)}
        <div style={{ marginTop: 16 }}><Link className="link" href="/news">All trip news <Icon.arrow /></Link></div>
      </div></div></article>
    </>
  );
}
