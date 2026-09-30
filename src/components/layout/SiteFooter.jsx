export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-content-wrap">
        {/* Copyright */}
        <p className="footer-copyright">
          &copy; 2026 Renaissance Med Spa. All rights reserved.
        </p>

        {/* Primary Headline with emoji */}
        <h3 className="footer-main-title">
          Meet Sayraa &mdash; Your AI Guide to Aesthetic Care, Wellness &amp; Radiance 🧖‍♀️✨
        </h3>

        {/* Subtitle / Description lines */}
        <p className="footer-sub-title">
          Sayraa &mdash; Smart Universal Aesthetic Care &amp; Med Spa Concierge
        </p>

        <p className="footer-desc-line">
          An AI-powered luxury med spa companion, created for Renaissance Med Spa.
        </p>

        <p className="footer-desc-line">
          Your 24/7 aesthetic companion &mdash; ready to assist with clinical skincare, laser therapies,
          injectable planning, and bespoke wellness regimens anytime you need it.
        </p>

        <p className="footer-credit-line">
          Crafted with passion, clinical expertise, and timeless luxury! 🌸
        </p>

        {/* Social Pill Buttons matching reference screenshot */}
        <div className="footer-social-row">
          <a
            href="https://x.com/Subham34713"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn"
            aria-label="Twitter"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Twitter</span>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=100057584082708&sk=about"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn"
            aria-label="Facebook"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </a>

          <a
            href="https://www.instagram.com/mr_subham7.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn"
            aria-label="Instagram"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href="https://www.linkedin.com/in/subham-khandual/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-btn"
            aria-label="LinkedIn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Bottom Italic Punchline in warm gold with emoji */}
        <p className="footer-punchline">
          Your AI guide to aesthetic care, wellness &amp; timeless radiance. 🧖‍♀️✨
        </p>
      </div>
    </footer>
  );
}
