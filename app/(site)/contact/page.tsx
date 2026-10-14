"use client";
import { BASE } from "@/lib/base";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { Icon } from "@/lib/icons";
import { isEmail } from "@/lib/utils";

/** The form emails Tony directly (AWS SES in production). Nothing is stored in the admin. */
export default function ContactPage() {
  const { s } = useStore();
  const { toast } = useUI();
  const empty = { name: "", email: "", tourId: "", message: "", consent: false };
  const [f, setF] = useState(empty);
  const st = s.settings;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return toast("Please add your name.", "bad");
    if (!isEmail(f.email)) return toast("That email doesn't look right. Check for a typo, e.g. name@gmail.com", "bad");
    if (!f.message.trim()) return toast("Please write a short message.", "bad");
    if (!f.consent) return toast("Please tick the box so Tony can reply.", "bad");
    setF(empty);
    toast("Sent. Tony will reply by email.");
  };

  return (
    <>
      <section className="phead"><img src={`${BASE}/img/boab-tree-guests.jpg`} alt="" style={{ objectPosition: "center 35%" }} /><div className="wrap">
        <div className="crumbs"><Link href="/">Home</Link><span>/</span><span>Contact</span></div>
        <h1 className="t-hero">Let&apos;s plan your <em>trip</em>.</h1>
        <p>A question about a tour, your vehicle, or a private trip for your crew. Tony answers every message himself.</p>
      </div></section>
      <section className="sec s-paper light"><div className="wrap contact">
        <form className="box" noValidate onSubmit={submit}>
          <h2 className="t-2">Send Tony a message</h2>
          <div className="form">
            <div className="field"><label htmlFor="qn">Your name</label><input type="text" id="qn" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div className="field"><label htmlFor="qe">Email</label><input type="email" id="qe" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
            <div className="field full"><label htmlFor="qt">Which trip?</label><select id="qt" value={f.tourId} onChange={(e) => setF({ ...f, tourId: e.target.value })}><option value="">Not sure yet, or a private tour</option>{s.tours.filter((t) => t.published).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
            <div className="field full"><label htmlFor="qm">Message</label><textarea id="qm" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="How many people and vehicles, and roughly when?" /></div>
          </div>
          <label className="check"><input type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} /> <span>Tony can use these details to reply to me. They won&apos;t be used for anything else.</span></label>
          <div><button className="btn btn-primary btn-lg" type="submit">Send message <Icon.arrow /></button></div>
        </form>
        <aside className="dcard topo">
          <div><span className="k">Call Tony</span><a className="big" href={`tel:${st.phone.replace(/\s/g, "")}`}>{st.phone}</a></div>
          <div><span className="k">Email</span><a className="big" style={{ fontSize: "1.05rem" }} href={`mailto:${st.email}`}>{st.email}</a></div>
          <div><span className="k">Based in</span><span style={{ color: "#fff" }}>{st.location}</span></div>
          <p className="small">Private tours are usually quoted within two days, and friends can split the cost between them.</p>
          <div className="row"><a className="btn btn-ghost btn-sm" href={st.facebook} target="_blank" rel="noopener">Facebook</a><a className="btn btn-ghost btn-sm" href={st.instagram} target="_blank" rel="noopener">Instagram</a></div>
        </aside>
      </div></section>
    </>
  );
}
