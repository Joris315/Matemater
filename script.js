const TO_EMAIL = "jurkenasjoris@gmail.com";

function encode(s) {
  return encodeURIComponent(s);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function openMail(subject, body) {
  const mailto = `mailto:${TO_EMAIL}?subject=${encode(subject)}&body=${encode(body)}`;
  window.location.href = mailto;
}

function validateForm(form) {
  const fields = ["name", "class", "topic", "goal", "avg", "time", "phone", "email", "consent"];
  let ok = true;

  // clear errors
  form.querySelectorAll(".error").forEach(e => (e.textContent = ""));

  const val = (id) => (form.querySelector(`#${id}`)?.value || "").trim();

  const requiredMsg = "Šis laukas privalomas.";

  for (const id of fields) {
    const el = form.querySelector(`#${id}`);
    const err = form.querySelector(`[data-error-for="${id}"]`);
    if (!el || !err) continue;

    if (id === "consent") {
      if (!el.checked) {
        err.textContent = "Pažymėk sutikimą, kad galėtume susisiekti.";
        ok = false;
      }
      continue;
    }

    if (!val(id)) {
      err.textContent = requiredMsg;
      ok = false;
      continue;
    }

    if (id === "email") {
      const email = val("email");
      const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!basic) {
        err.textContent = "Įvesk teisingą el. pašto adresą.";
        ok = false;
      }
    }
  }

  return ok;
}

// Mobile menu
(() => {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener("click", () => {
    const isHidden = mobileNav.hasAttribute("hidden");
    if (isHidden) {
      mobileNav.removeAttribute("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
    } else {
      mobileNav.setAttribute("hidden", "");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.setAttribute("hidden", "");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
})();

// Footer year
setText("year", String(new Date().getFullYear()));

// Policy date (palikta pagal jūsų dabartinę datą, galima pakeisti ranka)
(() => {
  const el = document.getElementById("policyDate");
  if (!el) return;
  // paliekame tą, kas HTML'e, bet galima automatiškai:
  // el.textContent = new Date().toISOString().slice(0, 10);
})();

// Free consultation button (paruoštas laiškas)
(() => {
  const btn = document.getElementById("freeConsultBtn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const subject = "Nemokama konsultacija (VBE matematika) – 11–12 klasė";
    const body =
`Sveiki,

Norėčiau nemokamos konsultacijos.

- Vardas:
- Klasė (11/12):
- Tema:
- Tikslas:
- Dabartinis vidurkis:
- Kontaktas (telefonas / el. paštas):

Ačiū!`;
    openMail(subject, body);
  });
})();

// Registration form -> mailto
(() => {
  const form = document.getElementById("regForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const get = (id) => (form.querySelector(`#${id}`)?.value || "").trim();

    const subject = `Registracija (VBE matematika) – ${get("class")} klasė – ${get("name")}`;

    const body =
`Sveiki,

Registracija į matematikos užsiėmimus (11–12 klasė, VBE + nestandartiniai):

- Vardas: ${get("name")}
- Klasė: ${get("class")}
- Tema: ${get("topic")}
- Tikslas: ${get("goal")}
- Dabartinis vidurkis: ${get("avg")}
- Pasirinktas laikas: ${get("time")}
- Telefonas: ${get("phone")}
- El. paštas: ${get("email")}
- Komentaras: ${get("contact") || "-"}

Ačiū!`;

    openMail(subject, body);
  });
})();
