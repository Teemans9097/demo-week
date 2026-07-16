const $ = (s, p = document) => p.querySelector(s),
  $$ = (s, p = document) => [...p.querySelectorAll(s)];

// Loading screen: hide once the page finishes loading (with a safety fallback)
(function () {
  function hideLoader() {
    var l = document.getElementById("loader");
    if (!l || l.classList.contains("hide")) return;
    l.classList.add("hide");
    setTimeout(function () {
      l.parentNode && l.parentNode.removeChild(l);
    }, 600);
  }
  if (document.readyState === "complete") hideLoader();
  else window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 4000);
})();
const schools = [
  [
    "Ahmadiyya Secondary School",
    "bo",
    "SSS",
    "Bo City",
    "WASSCE lab, science club, girls mentorship",
  ],
  [
    "Government Secondary School",
    "kenema",
    "SSS",
    "Kenema",
    "BECE/WASSCE prep, library",
  ],
  [
    "Annie Walsh Memorial School",
    "western",
    "SSS",
    "Freetown",
    "Girls education, science lab",
  ],
  [
    "Prince of Wales School",
    "western",
    "SSS",
    "Kingtom, Freetown",
    "ICT lab, debate, WASSCE",
  ],
  [
    "St. Joseph Secondary School",
    "bombali",
    "JSS",
    "Makeni",
    "Reading club, teacher support",
  ],
  ["Koidu Junior Secondary", "kono", "JSS", "Kono", "After-school tutoring"],
  [
    "Port Loko Primary Support Centre",
    "portloko",
    "Primary",
    "Port Loko",
    "Literacy support, learning materials",
  ],
  [
    "Kambia Community School",
    "kambia",
    "Primary",
    "Kambia",
    "Rural learner support",
  ],
  [
    "Moyamba Girls Learning Centre",
    "moyamba",
    "JSS",
    "Moyamba",
    "Girl-child mentorship",
  ],
];
const resources = [
  [
    "BECE Mathematics Past Questions",
    "bece",
    "Timed practice questions with answers.",
  ],
  [
    "WASSCE English Essay Guide",
    "wassce",
    "Essay structure, samples and marking tips.",
  ],
  ["Primary Reading Pack", "literacy", "Simple reading exercises for pupils."],
  [
    "Teacher Lesson Plan Template",
    "teacher",
    "Printable lesson planning sheet.",
  ],
  ["ICT Basics Notes", "digital", "Computer literacy for beginners."],
  ["Integrated Science Revision", "bece", "Short notes and quiz questions."],
  ["Biology WASSCE Flashcards", "wassce", "Key terms and definitions."],
  [
    "Krio-English Study Terms",
    "literacy",
    "Helpful translation of school words.",
  ],
];
const courses = [
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
  "BECE Prep",
  "WASSCE Prep",
];
const scholarships = [
  [
    "Government Education Support",
    "For excellent and vulnerable students",
    "Open yearly",
    "Students in JSS/SSS",
  ],
  [
    "Girls in STEM Grant",
    "Supports girls in science and ICT",
    "Rolling",
    "Girls in JSS/SSS",
  ],
  [
    "Rural Learner Bursary",
    "For pupils far from school",
    "August 2026",
    "Rural learners",
  ],
  [
    "Teacher Training Fund",
    "Professional development support",
    "Quarterly",
    "Teachers",
  ],
];
const careers = [
  [
    "Medicine",
    "Biology, Chemistry, Physics, English",
    "Doctor, public health officer, nurse",
  ],
  [
    "Computer Science",
    "Mathematics, ICT, English",
    "Software developer, data analyst",
  ],
  [
    "Architecture",
    "Mathematics, Physics, Technical Drawing",
    "Architect, planner",
  ],
  ["Law", "English, Government, Literature", "Lawyer, legal officer"],
  ["Teaching", "English plus subject strength", "Teacher, education officer"],
  [
    "Engineering",
    "Mathematics, Physics, Chemistry",
    "Civil, electrical, mechanical engineer",
  ],
];
function init() {
  $("#year") && ($("#year").textContent = new Date().getFullYear());
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark");
  $(".theme")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light",
    );
  });
  $(".hamb")?.addEventListener("click", () =>
    $(".menu").classList.toggle("open"),
  );
  const back = $(".back");
  addEventListener("scroll", () => {
    if (back) back.style.display = scrollY > 500 ? "block" : "none";
  });
  back?.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: "smooth" }),
  );
  $$(".reveal").forEach((el) =>
    new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) el.classList.add("show");
      },
      { threshold: 0.12 },
    ).observe(el),
  );
  counters();
  schoolFinder();
  resourceFilter();
  courseGrid();
  scholarshipGrid();
  careerGrid();
  authForms();
  contactForm();
  securityDemo();
  tutor();
  tools();
  dashboards();
  adminActions();
  newsletter();
}
function counters() {
  $$(".count").forEach((el) => {
    let target = +el.dataset.target,
      cur = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    let t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        cur = target;
        clearInterval(t);
      }
      el.textContent = cur.toLocaleString() + (el.dataset.suffix || "");
    }, 30);
  });
}
function schoolFinder() {
  const out = $("#schoolResults");
  if (!out) return;
  const render = () => {
    let q = ($("#schoolSearch").value || "").toLowerCase(),
      d = $("#districtFilter").value,
      l = $("#levelFilter").value;
    let data = schools.filter(
      (s) =>
        (!d || s[1] == d) &&
        (!l || s[2] == l) &&
        s.join(" ").toLowerCase().includes(q),
    );
    $("#schoolCount").textContent = `${data.length} result(s) found`;
    out.innerHTML =
      data
        .map(
          (s) =>
            `<div class="card"><span class="tag">${s[2]}</span><h3>${s[0]}</h3><p><b>District:</b> ${s[3]}</p><p>${s[4]}</p><button class="btn outline" onclick="alert('Request sent for ${s[0]}')">Request info</button></div>`,
        )
        .join("") || '<div class="card">No schools found.</div>';
  };
  ["input", "change"].forEach((e) => {
    $("#schoolSearch").addEventListener(e, render);
    $("#districtFilter").addEventListener(e, render);
    $("#levelFilter").addEventListener(e, render);
  });
  render();
}
function resourceFilter() {
  const out = $("#resourceGrid");
  if (!out) return;
  let filter = "all";
  const render = () => {
    let q = ($("#resourceSearch").value || "").toLowerCase();
    let data = resources.filter(
      (r) =>
        (filter === "all" || r[1] === filter) &&
        r.join(" ").toLowerCase().includes(q),
    );
    $("#resourceCount").textContent = `${data.length} free resource(s)`;
    out.innerHTML = data
      .map(
        (r) =>
          `<div class="card"><span class="tag">${r[1].toUpperCase()}</span><h3>${r[0]}</h3><p>${r[2]}</p><button class="btn primary" onclick="alert('Demo download started: ${r[0]}')">Download</button></div>`,
      )
      .join("");
  };
  $$(".chip").forEach(
    (c) =>
      (c.onclick = () => {
        $$(".chip").forEach((x) => x.classList.remove("active"));
        c.classList.add("active");
        filter = c.dataset.filter;
        render();
      }),
  );
  $("#resourceSearch").addEventListener("input", render);
  render();
}
function courseGrid() {
  const out = $("#courseGrid");
  if (!out) return;
  out.innerHTML = courses
    .map(
      (c, i) =>
        `<div class="card"><div class="course-img">${i < 6 ? "📘" : i < 9 ? "📗" : i < 12 ? "📙" : "🎯"}</div><span class="tag">Free Course</span><h3>${c}</h3><p>Mathematics, English, Science, ICT and exam-focused lessons for Sierra Leone learners.</p><div class="progress"><span style="width:${(i * 7) % 95}%"></span></div><button class="btn primary" onclick="enroll('${c}')">Enroll now</button></div>`,
    )
    .join("");
}
function enroll(c) {
  localStorage.setItem("lastCourse", c);
  alert(`You enrolled in ${c}. Open Student Dashboard to see progress.`);
}
function scholarshipGrid() {
  const out = $("#scholarshipGrid");
  if (!out) return;
  out.innerHTML = scholarships
    .map(
      (s) =>
        `<div class="card"><span class="tag">Scholarship</span><h3>${s[0]}</h3><p>${s[1]}</p><p><b>Deadline:</b> ${s[2]}</p><p><b>For:</b> ${s[3]}</p><button class="btn gold" onclick="alert('Application checklist opened for ${s[0]}')">Apply</button></div>`,
    )
    .join("");
}
function careerGrid() {
  const out = $("#careerGrid");
  if (!out) return;
  out.innerHTML = careers
    .map(
      (c) =>
        `<div class="card"><h3>${c[0]}</h3><p><b>Required subjects:</b> ${c[1]}</p><p><b>Career paths:</b> ${c[2]}</p><button class="btn outline" onclick="alert('Career plan generated for ${c[0]}')">View pathway</button></div>`,
    )
    .join("");
}
function authForms() {
  ["loginForm", "signupForm"].forEach((id) => {
    $("#" + id)?.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      let ok = true;
      $$("input,select", f).forEach((x) => {
        if (!x.value) {
          ok = false;
          x.style.borderColor = "#dc2626";
        } else x.style.borderColor = "var(--line)";
      });
      if (
        id === "signupForm" &&
        $("#suPass") &&
        $("#suPass").value !== $("#suConfirm").value
      ) {
        ok = false;
        alert("Passwords do not match");
      }
      if (!ok) return;
      const role = $("#loginRole")?.value || $("#suRole")?.value || "Student";
      localStorage.setItem("pcRole", role);
      localStorage.setItem(
        "pcUser",
        $("#suName")?.value || $("#loginEmail")?.value || "Student",
      );
      if (role === "Admin" || role === "Teacher") {
        location.href = "two-step.html";
      } else if (role === "Parent") {
        location.href = "parent-portal.html";
      } else {
        location.href = "student-dashboard.html";
      }
    });
  });
  $("#twoStepForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $("#twoStepCode").value.trim();
    if (code === "246810") {
      const role = localStorage.getItem("pcRole") || "Teacher";
      $("#twoStepMsg").classList.remove("hidden");
      $("#twoStepMsg").textContent =
        "Verification successful. Redirecting to your dashboard...";
      setTimeout(() => {
        location.href = role === "Admin" ? "admin.html" : "teacher-portal.html";
      }, 700);
    } else {
      alert("Wrong code. Use demo code 246810.");
    }
  });
  $("#suPass")?.addEventListener("input", (e) => {
    $("#strength").textContent =
      e.target.value.length >= 8
        ? "Strong password ✓"
        : e.target.value.length >= 5
          ? "Medium password"
          : "Weak password";
  });
  $$(".showpass").forEach(
    (b) =>
      (b.onclick = () => {
        let i = $(b.dataset.target);
        i.type = i.type === "password" ? "text" : "password";
      }),
  );
}
function contactForm() {
  ["contactForm", "supportForm", "teacherForm"].forEach((id) => {
    $("#" + id)?.addEventListener("submit", (e) => {
      e.preventDefault();
      $(".success", e.target.parentElement)?.classList.remove("hidden");
      e.target.reset();
    });
  });
}
function securityDemo() {
  $("#riskCheck")?.addEventListener("click", () => {
    const p = $("#securityPassword")?.value || "";
    let level =
      p.length >= 10 && /[A-Z]/.test(p) && /[0-9]/.test(p)
        ? "Strong protection"
        : "Needs improvement";
    $("#riskResult").classList.remove("hidden");
    $("#riskResult").innerHTML =
      `<b>${level}</b><br>Two-step verification is required for Admin and Teacher. This demo stores data locally only; a real version needs a secure backend and password hashing.`;
  });
}
function adminActions() {
  $$(".adminAction").forEach((b) =>
    b.addEventListener("click", () => {
      $("#adminConsole") && ($("#adminConsole").textContent = b.dataset.msg);
    }),
  );
}
function tutor() {
  const form = $("#tutorForm");
  if (!form) return;
  form.onsubmit = (e) => {
    e.preventDefault();
    let q = $("#tutorQ").value.toLowerCase();
    let a =
      "I can help. Break the topic into simple steps, define key terms, then practise with questions.";
    if (q.includes("photosynthesis"))
      a =
        "Photosynthesis is how green plants use sunlight, water and carbon dioxide to make food. Oxygen is released as a by-product.";
    if (q.includes("algebra") || q.includes("x"))
      a =
        "For algebra, collect like terms, isolate the unknown, then check your answer by substituting it back.";
    if (q.includes("democracy"))
      a =
        "Democracy is government by the people, usually through free elections, rule of law and citizen participation.";
    $("#tutorAnswer").classList.remove("hidden");
    $("#tutorAnswer").innerHTML =
      `<b>Answer:</b><p>${a}</p><small>Simulated AI tutor for project demo.</small>`;
  };
}
function tools() {
  $("#eligBtn")?.addEventListener("click", () => {
    let score = 0;
    if ($("#dist").value === "far") score += 2;
    if ($("#materials").value === "no") score += 2;
    if ($("#priority").value !== "none") score += 2;
    $("#eligResult").classList.remove("hidden");
    $("#eligResult").innerHTML =
      score >= 4
        ? "High priority for support. Recommended: materials + scholarship information."
        : "Moderate priority. Recommended: free resources and school guidance.";
  });
  $("#aggBtn")?.addEventListener("click", () => {
    let nums = $$(".grade")
      .map((x) => +x.value)
      .filter(Boolean)
      .sort((a, b) => a - b);
    let sum = nums.slice(0, 4).reduce((a, b) => a + b, 0);
    $("#aggResult").classList.remove("hidden");
    $("#aggResult").innerHTML =
      nums.length < 4
        ? "Enter at least four grades."
        : `Best four aggregate: <b>${sum}</b>`;
  });
  const qs = [
    ["SDG 4 focuses on?", "Quality Education"],
    ["BECE is mainly taken after?", "JSS 3"],
    ["Low-data lessons help students with?", "Limited internet"],
  ];
  let i = 0,
    score = 0;
  function show() {
    if (!$("#quizQ")) return;
    $("#quizQ").textContent = qs[i][0];
    $("#quizOpts").innerHTML = [
      "Quality Education",
      "Free transport",
      "Limited internet",
      "JSS 3",
    ]
      .map(
        (o) => `<button class="chip" onclick="quizAns('${o}')">${o}</button>`,
      )
      .join("");
    $("#quizScore").textContent = `Score: ${score}`;
  }
  window.quizAns = (o) => {
    if (o === qs[i][1]) {
      score++;
      alert("Correct");
    } else alert("Try again: " + qs[i][1]);
    i = (i + 1) % qs.length;
    show();
  };
  show();
}
function dashboards() {
  const name = localStorage.getItem("pcUser") || "Aminata Student";
  $$(".userName").forEach((x) => (x.textContent = name));
  let last = localStorage.getItem("lastCourse") || "BECE Preparation";
  $$(".lastCourse").forEach((x) => (x.textContent = last));
}
function newsletter() {
  $("#newsletter")?.addEventListener("submit", (e) => {
    e.preventDefault();
    $("#nlmsg").textContent = "You have joined the education update list.";
    e.target.reset();
  });
}
document.addEventListener("DOMContentLoaded", init);

// Role dashboard interactive upgrades
(function () {
  function q(s, p = document) {
    return p.querySelector(s);
  }
  function qa(s, p = document) {
    return [...p.querySelectorAll(s)];
  }
  document.addEventListener("DOMContentLoaded", () => {
    qa(".studentAction").forEach((b) =>
      b.addEventListener("click", () => {
        let c = q("#studentConsole");
        if (c) c.textContent = b.dataset.msg;
        let list = q("#studentActivities");
        if (list) {
          let div = document.createElement("div");
          div.className = "activity";
          div.innerHTML =
            "<b>" +
            b.dataset.msg +
            "</b><span>Just now · saved to learning activity</span>";
          list.prepend(div);
        }
      }),
    );
    qa(".teacherAction").forEach((b) =>
      b.addEventListener("click", () => {
        let c = q("#teacherConsole");
        if (c) c.textContent = b.dataset.msg;
      }),
    );
    qa(".parentAction").forEach((b) =>
      b.addEventListener("click", () => {
        let c = q("#parentConsole");
        if (c) c.textContent = b.dataset.msg;
      }),
    );
    const adminData = {
      users: [
        [
          "Approve Teachers",
          "Review pending teacher accounts and approve verified educators.",
          "Teacher account approved successfully.",
        ],
        [
          "Manage Students",
          "Update student classes, reset accounts and review progress access.",
          "Student record updated.",
        ],
        [
          "Parent Access",
          "Link parent accounts to learner profiles.",
          "Parent linked to learner successfully.",
        ],
      ],
      content: [
        [
          "Courses",
          "Add, edit or delete Primary, JSS, SSS, BECE and WASSCE courses.",
          "Course content updated.",
        ],
        [
          "Resources",
          "Publish notes, PDFs, videos, past papers and exam guides.",
          "Resource published.",
        ],
        [
          "Scholarships",
          "Post scholarship opportunities and deadlines.",
          "Scholarship notice published.",
        ],
      ],
      security: [
        [
          "Login Logs",
          "Review failed login attempts and unusual activity.",
          "Login logs reviewed.",
        ],
        [
          "Two-Step Control",
          "Require 2FA for admin and teacher accounts.",
          "Two-step policy updated.",
        ],
        [
          "Moderation",
          "Block abusive reports and unsafe forum posts.",
          "Unsafe content removed.",
        ],
      ],
      reports: [
        [
          "District Report",
          "See learners, schools and resource use by district.",
          "District report generated.",
        ],
        [
          "Performance Report",
          "Detect weak subjects and recommend interventions.",
          "Performance report generated.",
        ],
        [
          "Export Data",
          "Download monthly platform summary.",
          "Monthly CSV export prepared.",
        ],
      ],
      announcements: [
        [
          "Exam Notice",
          "Send BECE/WASSCE mock exam dates.",
          "Exam notice sent.",
        ],
        [
          "Scholarship Alert",
          "Notify students and parents about new opportunities.",
          "Scholarship alert sent.",
        ],
        [
          "Maintenance Notice",
          "Inform users about platform updates.",
          "Maintenance notice sent.",
        ],
      ],
    };
    function renderAdmin(tab = "users") {
      let out = q("#adminTabContent");
      if (!out) return;
      out.innerHTML = adminData[tab]
        .map(
          (x) =>
            `<div class="panel"><h3>${x[0]}</h3><p>${x[1]}</p><button class="btn primary adminAction" data-msg="${x[2]}">Run Action</button></div>`,
        )
        .join("");
      qa(".adminAction", out).forEach((b) =>
        b.addEventListener("click", () => {
          let c = q("#adminConsole");
          if (c) c.textContent = b.dataset.msg;
        }),
      );
    }
    qa("[data-admin-tab]").forEach((btn) =>
      btn.addEventListener("click", () => {
        qa("[data-admin-tab]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderAdmin(btn.dataset.adminTab);
      }),
    );
    renderAdmin("users");
  });
})();

// Responsive navigation with a working "More" dropdown + button ripple
(function () {
  const menu = document.querySelector(".menu");
  if (!menu) return;

  // Capture the original, complete link list once so we can rebuild cleanly.
  const originalItems = [...menu.querySelectorAll(":scope > li")].map((li) =>
    li.cloneNode(true),
  );
  const PRIMARY_COUNT = 6; // links shown before the "More" button on desktop
  const isDesktop = () => window.innerWidth >= 1024;
  let mode = null; // "desktop" | "mobile"

  function restore() {
    menu.innerHTML = "";
    originalItems.forEach((li) => menu.appendChild(li.cloneNode(true)));
  }

  function buildDesktop() {
    restore();
    const items = [...menu.querySelectorAll(":scope > li")];
    if (items.length > PRIMARY_COUNT + 1) {
      const overflow = items.slice(PRIMARY_COUNT);
      overflow.forEach((li) => li.remove());

      const more = document.createElement("li");
      more.className = "more";
      more.innerHTML =
        '<a href="#" class="more-btn" aria-haspopup="true" aria-expanded="false">More <span class="caret">▾</span></a>' +
        '<div class="more-menu" role="menu"></div>';
      const box = more.querySelector(".more-menu");
      const btn = more.querySelector(".more-btn");

      overflow.forEach((li) => {
        const a = li.querySelector("a");
        if (!a) return;
        a.setAttribute("role", "menuitem");
        if (a.classList.contains("active")) more.classList.add("has-active");
        box.appendChild(a);
      });
      menu.appendChild(more);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const open = more.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.addEventListener("click", (e) => {
        if (!more.contains(e.target)) {
          more.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          more.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        }
      });
    }
    mode = "desktop";
  }

  function buildMobile() {
    restore(); // full flat list inside the hamburger drawer
    mode = "mobile";
  }

  function sync() {
    const want = isDesktop() ? "desktop" : "mobile";
    if (want === mode) return;
    menu.classList.remove("open");
    want === "desktop" ? buildDesktop() : buildMobile();
  }

  // Close the mobile drawer after choosing a real link (not the More toggle).
  menu.addEventListener("click", (e) => {
    if (
      !isDesktop() &&
      e.target.closest("a") &&
      !e.target.closest(".more-btn")
    )
      menu.classList.remove("open");
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sync, 150);
  });

  sync();

  // Button ripple feedback (delegated so it also covers rendered content).
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".btn");
    if (!b) return;
    b.classList.add("ripple");
    setTimeout(() => b.classList.remove("ripple"), 460);
  });
})();
