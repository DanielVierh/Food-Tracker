(() => {
    const STORAGE_KEY = "foodtracker_desktop_warning_dismissed_session";

    function isDesktopLike() {
        // Desktop/laptop usually: fine pointer + hover capability.
        // Extra width guard reduces false positives on large tablets.
        const mm = (q) => window.matchMedia && window.matchMedia(q).matches;
        const fineHover = mm("(pointer: fine) and (hover: hover)");
        const wide = mm("(min-width: 900px)");
        return fineHover && wide;
    }

    function ensureStyles() {
        if (document.getElementById("desktop-warning-modal-styles")) return;
        const style = document.createElement("style");
        style.id = "desktop-warning-modal-styles";
        style.textContent = `
#desktop_warning_modal_overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.75);
}
#desktop_warning_modal_overlay.active { display: flex; }
#desktop_warning_modal {
  width: min(720px, 96vw);
  border-radius: 18px;
  background: #0f172a;
  color: #fff;
  box-shadow: 0 20px 60px rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.12);
}
#desktop_warning_modal .dwm_header {
  padding: 18px 20px 8px 20px;
  font-size: 30px;
  font-weight: 700;
}
#desktop_warning_modal .dwm_body {
  padding: 0 20px 18px 20px;
  font-size: 26px;
  line-height: 1.4;
  opacity: 0.95;
}
#desktop_warning_modal .dwm_hint {
  margin-top: 10px;
  font-size: 24px;
  opacity: 0.85;
}
#desktop_warning_modal .dwm_actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 0 20px 18px 20px;
}
#desktop_warning_modal .dwm_btn {
  appearance: none;
  border: 0;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 20px;
  cursor: pointer;
}
#desktop_warning_modal .dwm_btn_primary {
  background: #38bdf8;
  color: #001018;
  font-weight: 700;
}
#desktop_warning_modal .dwm_btn_secondary {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
`;
        document.head.appendChild(style);
    }

    function ensureModal() {
        if (document.getElementById("desktop_warning_modal_overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "desktop_warning_modal_overlay";

        const modal = document.createElement("div");
        modal.id = "desktop_warning_modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");

        modal.innerHTML = `
  <div class="dwm_header">Nur für Mobile optimiert</div>
  <div class="dwm_body">
    Diese Anwendung wurde ausschließlich für Smartphones entwickelt. Auf Desktop-Geräten kann die Darstellung und Bedienung fehlerhaft sein.
    <div class="dwm_hint">Bitte öffne die App auf deinem Handy für die beste Nutzung.</div>
  </div>
  <div class="dwm_actions">
    <button type="button" class="dwm_btn dwm_btn_primary" id="desktop_warning_modal_ok">Verstanden</button>
  </div>
`;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const close = () => {
            try {
                sessionStorage.setItem(STORAGE_KEY, "1");
            } catch { }
            overlay.classList.remove("active");
        };

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) close();
        });

        modal
            .querySelector("#desktop_warning_modal_close")
            ?.addEventListener("click", close);
        modal
            .querySelector("#desktop_warning_modal_ok")
            ?.addEventListener("click", close);

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && overlay.classList.contains("active")) close();
        });
    }

    function updateVisibility() {
        const overlay = document.getElementById("desktop_warning_modal_overlay");
        if (!overlay) return;

        let dismissed = false;
        try {
            dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
        } catch {
            dismissed = false;
        }

        if (isDesktopLike() && !dismissed) overlay.classList.add("active");
        else overlay.classList.remove("active");
    }

    function init() {
        ensureStyles();
        ensureModal();
        updateVisibility();

        // Update if user resizes / docks window.
        window.addEventListener("resize", updateVisibility);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
