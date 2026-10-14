import Car from "./Car";

/**
 * Branded intro: the logo, then the Patrol drives the dashed track and the
 * curtain lifts. Pure CSS, so it also clears without JavaScript; skipped on
 * repeat visits in the same session (see the script in app/layout.tsx).
 */
export default function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="in">
        <img className="logo" src="/img/logo.png" alt="" />
        <div className="road"><div className="car"><Car /></div></div>
        <small>Western Australia · 4WD tours</small>
      </div>
    </div>
  );
}
