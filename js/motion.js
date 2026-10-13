(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll(".reveal, .line-in");
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach(function (node) { node.classList.add("in"); });
    return;
  }
  function mark(entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }
  var observer = new IntersectionObserver(mark, { threshold: 0.18 });
  var timelineObserver = new IntersectionObserver(mark, { rootMargin: "0px 0px -20% 0px", threshold: 0 });
  var lineCount = new Map();
  nodes.forEach(function (node, index) {
    if (node.classList.contains("line-in")) {
      var count = lineCount.get(node.parentElement) || 0;
      node.style.transitionDelay = count * 120 + "ms";
      lineCount.set(node.parentElement, count + 1);
      observer.observe(node);
      return;
    }
    if (node.parentElement && node.parentElement.classList.contains("film")) {
      var place = Array.prototype.indexOf.call(node.parentElement.children, node);
      node.style.transitionDelay = place * 140 + "ms";
    } else {
      node.style.transitionDelay = (index % 3) * 90 + "ms";
    }
    if (node.closest(".timeline")) timelineObserver.observe(node);
    else observer.observe(node);
  });
})();

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var bar = document.querySelector(".navbar");
  if (!bar || reduce) return;

  bar.addEventListener("mousemove", function (event) {
    var box = bar.getBoundingClientRect();
    bar.style.setProperty("--gx", (event.clientX - box.left) + "px");
    bar.style.setProperty("--gy", (event.clientY - box.top) + "px");
    bar.classList.add("is-hot");
  });

  bar.addEventListener("mouseleave", function () {
    bar.classList.remove("is-hot");
  });

  bar.querySelectorAll("nav a").forEach(function (link) {
    var tx = 0;
    var ty = 0;
    var cx = 0;
    var cy = 0;
    var frame = 0;
    var origin = null;

    function step() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) {
        link.style.transform = "";
        frame = 0;
        return;
      }
      link.style.transform = "translate(" + cx.toFixed(2) + "px, " + cy.toFixed(2) + "px)";
      frame = requestAnimationFrame(step);
    }

    link.addEventListener("mouseenter", function () {
      var box = link.getBoundingClientRect();
      origin = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    });

    link.addEventListener("mousemove", function (event) {
      if (!origin) return;
      var dx = event.clientX - origin.x;
      var dy = event.clientY - origin.y;
      tx = Math.max(-4, Math.min(4, dx * 0.35));
      ty = Math.max(-4, Math.min(4, dy * 0.45));
      if (!frame) frame = requestAnimationFrame(step);
    });

    link.addEventListener("mouseleave", function () {
      tx = 0;
      ty = 0;
      origin = null;
      if (!frame) frame = requestAnimationFrame(step);
    });
  });

  var pill = bar.querySelector(".resume-menu > .pill");
  if (!pill) return;

  function ripple(event) {
    var box = pill.getBoundingClientRect();
    var dot = document.createElement("span");
    dot.className = "ripple";
    dot.style.left = (event.clientX - box.left) + "px";
    dot.style.top = (event.clientY - box.top) + "px";
    pill.appendChild(dot);
    dot.addEventListener("animationend", function () { dot.remove(); });
  }

  pill.addEventListener("mouseenter", ripple);
  pill.addEventListener("click", ripple);
})();

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var hero = document.querySelector(".hero-frame");
  var orb = hero && hero.querySelector(".orb");
  if (hero && orb && fine) {
    hero.addEventListener("mousemove", function (event) {
      var box = hero.getBoundingClientRect();
      var dx = (event.clientX - box.left) / box.width - 0.5;
      var dy = (event.clientY - box.top) / box.height - 0.5;
      orb.style.transform = "translate3d(" + (dx * 28).toFixed(1) + "px, " + (dy * 18).toFixed(1) + "px, 0)";
    });
    hero.addEventListener("mouseleave", function () {
      orb.style.transform = "";
    });
  }

  document.querySelectorAll(".contact-row a, a[download]").forEach(function (link) {
    var tx = 0;
    var ty = 0;
    var cx = 0;
    var cy = 0;
    var frame = 0;
    var origin = null;

    function step() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) {
        link.style.transform = "";
        frame = 0;
        return;
      }
      link.style.transform = "translate3d(" + cx.toFixed(2) + "px, " + cy.toFixed(2) + "px, 0)";
      frame = requestAnimationFrame(step);
    }

    link.addEventListener("mouseenter", function () {
      var box = link.getBoundingClientRect();
      origin = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    });
    link.addEventListener("mousemove", function (event) {
      if (!origin) return;
      tx = Math.max(-4, Math.min(4, (event.clientX - origin.x) * 0.35));
      ty = Math.max(-4, Math.min(4, (event.clientY - origin.y) * 0.45));
      if (!frame) frame = requestAnimationFrame(step);
    });
    link.addEventListener("mouseleave", function () {
      tx = 0;
      ty = 0;
      origin = null;
      if (!frame) frame = requestAnimationFrame(step);
    });
  });

  if (fine) {
    document.querySelectorAll(".project").forEach(function (card) {
      var glare = card.querySelector(".glare");
      card.addEventListener("mousemove", function (event) {
        var box = card.getBoundingClientRect();
        var px = (event.clientX - box.left) / box.width;
        var py = (event.clientY - box.top) / box.height;
        var rotateY = (px - 0.5) * 8;
        var rotateX = (0.5 - py) * 6;
        card.style.transform = "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg)";
        if (glare) {
          glare.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          glare.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        }
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  var timeline = document.querySelector(".timeline");
  if (!timeline) return;
  var pending = false;
  function paintLine() {
    var box = timeline.getBoundingClientRect();
    var start = window.innerHeight * 0.82;
    var travel = box.height + window.innerHeight * 0.3;
    var progress = Math.max(0, Math.min(1, (start - box.top) / travel));
    timeline.style.setProperty("--line", progress.toFixed(3));
    pending = false;
  }
  window.addEventListener("scroll", function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(paintLine);
  }, { passive: true });
  paintLine();
})();
