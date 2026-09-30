import { site } from "../../content/site.js";
import medspaLogo from "../../assets/medspa_logo.jpg";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8"
      >
        {/* Brand logo on left */}
        <a className="brand" href="#meet-sayraa" aria-label={`${site.name} home`}>
          <div className="brand-logo-frame">
            <img
              src={medspaLogo}
              alt="Renaissance Med Spa Emblem"
              className="brand-logo-img"
            />
          </div>
          <div className="brand-copy">
            <span className="brand-title">
              Renaissance <span className="brand-title-accent">Med Spa</span>
            </span>
            <span className="brand-caption">Sayraa AI Concierge</span>
          </div>
        </a>

        {/* Navigation / Actions removed as requested */}
      </nav>
    </header>
  );
}
