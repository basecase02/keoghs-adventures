import Link from "next/link";
import type { Tour } from "@/lib/types";
import { Icon } from "@/lib/icons";
import { fmtShort, lowestPrice, money, nextDeparture, seatsClass, seatsLeft, seatsText } from "@/lib/utils";

export default function TourCard({ t }: { t: Tour }) {
  const nd = nextDeparture(t);
  const left = nd ? seatsLeft(nd) : 0;
  return (
    <Link className="tcard" href={`/tours/${t.id}`}>
      <img src={t.cover} alt={t.name} loading="lazy" />
      <div className="top">
        <span className="chip">{t.days} {t.days === 1 ? "day" : "days"}{nd ? ` · ${fmtShort(nd.date)}` : ""}</span>
        <span className={`chip ${seatsClass(left)}`}><i />{nd ? seatsText(left) : "Dates soon"}</span>
      </div>
      <div className="in">
        <span className="reg">{t.region}</span>
        <h3>{t.name}</h3>
        <div className="meta">
          <span className="price">from<b className="num">{money(lowestPrice(t))}</b></span>
          <span className="go" aria-hidden="true"><Icon.arrow /></span>
        </div>
      </div>
    </Link>
  );
}
