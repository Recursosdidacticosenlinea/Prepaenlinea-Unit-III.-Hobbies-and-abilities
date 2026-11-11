/* Motor de las actividades. Cada página define window.ACTIVITY (ver ai3.js y ai4.js). */
(function () {
  "use strict";
  var A = window.ACTIVITY;
  var KEY = "m06s2:" + A.id;
  var S = load();
  var cur = 0;

  /* ---------- utilidades ---------- */
  function load() {
    var d = { ans: {}, done: {}, seen: {}, step: 0 };
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw) { for (var k in d) if (raw[k] != null) d[k] = raw[k]; }
    } catch (e) { /* sin almacenamiento: la página funciona igual */ }
    return d;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* idem */ } }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "html") n.innerHTML = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function words(s) {
    return String(s || "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/'/g, "").replace(/[^a-z0-9áéíóúüñ\s]/g, " ").split(/\s+/).filter(Boolean);
  }
  function flat(s) { return " " + words(s).join(" ") + " "; }
  function countWords(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).length; }
  function ans(k) { return k.charAt(0) === "=" ? k.slice(1) : (S.ans[k] || "").trim(); }

  window.M06 = { flat: flat, words: words, countWords: countWords, capPeriod: function (t) { return capPeriod(t); }, ans: ans };

  /* ---------- voz: leer en voz alta (TTS) ---------- */
  var voices = [];
  function loadVoices() { if (window.speechSynthesis) voices = speechSynthesis.getVoices(); }
  if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function speak(text, rate) {
    if (!window.speechSynthesis) { alert("Tu navegador no puede leer el texto en voz alta. Prueba con Chrome."); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; u.rate = rate || 0.85;
    var v = voices.filter(function (x) { return /^en[-_]US/i.test(x.lang); })[0] || voices.filter(function (x) { return /^en/i.test(x.lang); })[0];
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  function listenBtn(text, label) {
    return el("button", { type: "button", class: "icon", title: "Escuchar", "aria-label": "Escuchar: " + text, onclick: function () { speak(typeof text === "function" ? text() : text); } }, [label || "🔊"]);
  }

  /* ---------- voz: reconocimiento ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var active = null;
  function hear(btn, onLive, onDone) {
    if (!SR) { onDone("", "unsupported"); return; }
    if (active) { var same = active.btn === btn; active.rec.stop(); if (same) return; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    var rec = new SR(), fin = "", inter = "", err = null, quiet = null;
    rec.lang = "en-US"; rec.continuous = true; rec.interimResults = true;
    var label = btn.textContent;
    rec.onresult = function (e) {
      inter = "";
      for (var i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript + " "; else inter += e.results[i][0].transcript;
      }
      onLive((fin + inter).trim());
      clearTimeout(quiet);
      quiet = setTimeout(function () { try { rec.stop(); } catch (x) { /* ya detenido */ } }, 3000);
    };
    rec.onerror = function (e) { err = e.error; };
    rec.onend = function () {
      clearTimeout(quiet);
      if (active && active.rec === rec) active = null;
      btn.classList.remove("rec-on"); btn.textContent = label;
      onDone((fin + inter).trim(), err);
    };
    try { rec.start(); } catch (x) { onDone("", "start"); return; }
    active = { rec: rec, btn: btn };
    btn.classList.add("rec-on"); btn.textContent = "⏹ Detener";
  }
  function srMessage(err) {
    if (err === "unsupported") return "Tu navegador no tiene reconocimiento de voz. Usa Google Chrome o Microsoft Edge (en iPhone, Safari). Mientras tanto, escucha el audio y repite en voz alta.";
    if (err === "not-allowed" || err === "service-not-allowed") return "No hay permiso para usar el micrófono. Da clic en el candado de la barra de direcciones y permite el micrófono.";
    if (err === "no-speech") return "No escuché nada. Acércate al micrófono e inténtalo otra vez.";
    if (err === "network") return "El reconocimiento de voz necesita conexión a internet.";
    return "No pude escucharte. Inténtalo de nuevo.";
  }
  /* compara lo que se oyó con el texto meta: devuelve porcentaje y html marcado */
  function score(target, heard) {
    var hw = words(heard), bag = {};
    hw.forEach(function (w) { bag[w] = (bag[w] || 0) + 1; });
    var hits = 0, total = 0;
    var html = String(target).split(/(\s+)/).map(function (tok) {
      var w = words(tok).join("");
      if (!w) return esc(tok);
      total++;
      if (bag[w] > 0) { bag[w]--; hits++; return '<span class="hit">' + esc(tok) + "</span>"; }
      return '<span class="miss">' + esc(tok) + "</span>";
    }).join("");
    return { pct: total ? Math.round(100 * hits / total) : 0, html: html };
  }
  /* fila "escucha y repite" reutilizable */
  function voiceRow(getText, onPass) {
    var textBox = el("div", { class: "vtext en" });
    var heard = el("div", { class: "heard" });
    var fb = el("div", { class: "fb" });
    function paint() { textBox.textContent = getText(); }
    paint();
    var mic = el("button", { type: "button", onclick: function () {
      var target = getText();
      fb.className = "fb"; fb.textContent = "Te escucho… habla claro y cuando termines espera un momento.";
      hear(mic, function (live) { heard.textContent = "Escuché: " + live; }, function (txt, err) {
        if (!txt) { fb.className = "fb no"; fb.textContent = srMessage(err || "no-speech"); return; }
        var r = score(target, txt);
        textBox.innerHTML = r.html;
        heard.textContent = "Escuché: " + txt;
        if (r.pct >= 70) { fb.className = "fb ok"; fb.textContent = "¡Muy bien! Se entendió " + r.pct + "% de las palabras."; onPass && onPass(); }
        else { fb.className = "fb no"; fb.textContent = "Se entendió " + r.pct + "%. Escucha de nuevo las palabras subrayadas y repite."; }
      });
    } }, ["🎤 Hablar"]);
    var row = el("div", { class: "vrow" }, [textBox, el("div", { class: "row" }, [listenBtn(getText, "🔊 Escuchar"), mic]), heard, fb]);
    row.repaint = paint;
    return row;
  }

  /* ---------- figuras con letras ---------- */
  function figure(f, only) {
    var box = el("div", { class: "fig" + (f.cls ? " " + f.cls : "") });
    box.appendChild(el("img", { src: f.src, alt: f.alt || "", loading: "lazy" }));
    if (f.cls === "map") box.appendChild(el("a", { class: "btn zoom noprint", href: f.src, target: "_blank", rel: "noopener" }, ["🔍 Ampliar mapa"]));
    (f.overlays || []).forEach(function (o) {
      box.appendChild(el("img", { class: "ov", src: o.src, alt: o.alt || "", style: "left:" + o.x + "%;top:" + o.y + "%;width:" + o.w + "%" }));
    });
    (f.marks || []).forEach(function (m) {
      if (only && only !== m.l && only !== "all") return;
      box.appendChild(el("span", { class: "mk", style: "left:" + m.x + "%;top:" + m.y + "%", "aria-label": "letra " + m.l }, [m.l]));
    });
    return box;
  }

  /* ---------- bloques ---------- */
  var B = {};

  B.html = function (b) { return el("div", { class: b.card === false ? "" : "card", html: b.html }); };

  B.figure = function (b) {
    var w = el("div", { class: "card" });
    if (b.title) w.appendChild(el("h3", { text: b.title }));
    if (b.intro) w.appendChild(el("p", { html: b.intro }));
    if (b.figs) { var g = el("div", { class: "rooms" }); b.figs.forEach(function (k) { g.appendChild(figure(A.figures[k], "all")); }); w.appendChild(g); }
    else w.appendChild(figure(A.figures[b.fig], b.only || "all"));
    return w;
  };

  B.cards = function (b) {
    var w = el("div", { class: "card" }, [el("h3", { text: b.title }), el("p", { class: "muted small", text: "Toca cada tarjeta para escuchar la palabra y repítela en voz alta." })]);
    var g = el("div", { class: "vocab" });
    b.items.forEach(function (it) {
      var btn = el("button", { type: "button", onclick: function () { speak(it[1]); btn.classList.add("heard"); } },
        [el("span", { class: "emo", text: it[0] }), el("span", { class: "w en", text: it[1] }), el("span", { class: "t", text: it[2] })]);
      g.appendChild(btn);
    });
    w.appendChild(g);
    return w;
  };

  B.preps = function (b) {
    var w = el("div", { class: "card" }, [el("h3", { text: b.title }), el("p", { class: "muted small", text: "La pelota ⚽ es el objeto; la caja 📦 es la referencia." })]);
    var g = el("div", { class: "preps" });
    b.items.forEach(function (it) {
      var art = el("div", { class: "art", "aria-hidden": "true" });
      it.art.forEach(function (a) { art.appendChild(el("span", { style: "left:" + a[1] + "%;top:" + a[2] + "%;" + (a[3] || ""), text: a[0] })); });
      g.appendChild(el("div", { class: "prep" }, [art, el("b", { class: "en", text: it.en }), el("small", { text: it.es }), el("div", {}, [listenBtn(it.ex, "🔊 " + it.ex)])]));
    });
    w.appendChild(g);
    return w;
  };

  function exercise(b, body) {
    var head = el("h3", { text: b.title });
    var badge = el("span", { class: "badge", text: "Completado", hidden: !S.done[b.key] });
    head.appendChild(badge);
    var w = el("div", { class: "card" }, [head]);
    if (b.intro) w.appendChild(el("p", { class: "task", html: b.intro }));
    if (b.fig) w.appendChild(figure(A.figures[b.fig], b.only));
    w.finish = function () { if (!S.done[b.key]) { S.done[b.key] = true; save(); } badge.hidden = false; paintNav(); };
    body(w);
    return w;
  }

  B.mcq = function (b) {
    return exercise(b, function (w) {
      var solved = 0;
      b.items.forEach(function (it, i) {
        var fb = el("div", { class: "fb" });
        var opts = el("div", { class: "opts" });
        var ok = false;
        shuffle(it.o).forEach(function (o) {
          var btn = el("button", { type: "button", class: "en", onclick: function () {
            if (o === it.o[0]) {
              btn.classList.add("right"); fb.className = "fb ok"; fb.textContent = "✔ Correcto. " + (it.why || "");
              if (!ok) { ok = true; solved++; if (solved === b.items.length) w.finish(); }
            } else { btn.classList.add("wrong"); fb.className = "fb no"; fb.textContent = "Todavía no. " + (it.tip || "Inténtalo otra vez."); }
          } }, [o]);
          opts.appendChild(btn);
        });
        w.appendChild(el("div", { class: "q" }, [el("div", { html: "<b>" + (i + 1) + ".</b> " + it.q }), opts, fb]));
      });
    });
  };

  B.gap = function (b) {
    return exercise(b, function (w) {
      var sels = [];
      b.items.forEach(function (it, i) {
        var line = el("div", { class: "gapline en" });
        line.appendChild(document.createTextNode((i + 1) + ". "));
        it.t.split("___").forEach(function (part, j, arr) {
          line.appendChild(document.createTextNode(part));
          if (j < arr.length - 1) {
            var s = el("select", { "aria-label": "Elige la opción" }, [el("option", { value: "", text: "…" })]);
            shuffle(it.o).forEach(function (o) { s.appendChild(el("option", { text: o })); });
            s.dataset.a = it.o[0];
            sels.push(s); line.appendChild(s);
          }
        });
        w.appendChild(line);
      });
      var fb = el("div", { class: "fb" });
      w.appendChild(el("div", { class: "row" }, [el("button", { type: "button", class: "primary", onclick: function () {
        var good = 0;
        sels.forEach(function (s) { var r = s.value === s.dataset.a; s.className = r ? "right" : "wrong"; if (r) good++; });
        if (good === sels.length) { fb.className = "fb ok"; fb.textContent = "✔ ¡Todas correctas!"; w.finish(); }
        else { fb.className = "fb no"; fb.textContent = good + " de " + sels.length + " correctas. Corrige las marcadas en rojo. " + (b.tip || ""); }
      } }, ["Revisar"]), fb]));
    });
  };

  B.match = function (b) {
    return exercise(b, function (w) {
      var grid = el("div", { class: "match" }), pick = null, left = b.pairs.length;
      var L = shuffle(b.pairs), R = shuffle(b.pairs), cells = [];
      function mk(p, side) {
        var btn = el("button", { type: "button", class: side === 0 ? "en" : "", onclick: function () {
          if (btn.disabled) return;
          if (side === 0) { if (pick) pick.btn.classList.remove("sel"); pick = { p: p, btn: btn }; btn.classList.add("sel"); return; }
          if (!pick) return;
          if (pick.p === p) {
            [btn, pick.btn].forEach(function (x) { x.classList.remove("sel"); x.classList.add("right"); x.disabled = true; });
            pick = null; if (--left === 0) w.finish();
          } else { btn.classList.add("wrong"); setTimeout(function () { btn.classList.remove("wrong"); }, 600); }
        } }, [p[side]]);
        return btn;
      }
      for (var i = 0; i < L.length; i++) { cells.push(mk(L[i], 0), mk(R[i], 1)); }
      cells.forEach(function (c) { grid.appendChild(c); });
      w.appendChild(el("p", { class: "muted small", text: "Toca una palabra de la izquierda y luego su pareja de la derecha." }));
      w.appendChild(grid);
    });
  };

  B.order = function (b) {
    return exercise(b, function (w) {
      var solved = 0;
      b.items.forEach(function (it, i) {
        var target = it.parts, out = [];
        var ansBox = el("div", { class: "tiles answer" + (b.col ? " col" : "") }), bank = el("div", { class: "tiles" + (b.col ? " col" : "") }), fb = el("div", { class: "fb" });
        var ok = false;
        function draw() {
          ansBox.innerHTML = ""; bank.innerHTML = "";
          out.forEach(function (ix, pos) { ansBox.appendChild(el("button", { type: "button", class: "en", onclick: function () { if (ok) return; out.splice(pos, 1); draw(); } }, [target[ix]])); });
          order.forEach(function (ix) { if (out.indexOf(ix) < 0) bank.appendChild(el("button", { type: "button", class: "en", onclick: function () { out.push(ix); draw(); check(); } }, [target[ix]])); });
        }
        function check() {
          if (out.length < target.length) { fb.textContent = ""; return; }
          var good = out.every(function (ix, pos) { return target[ix] === target[pos]; });
          if (good) { ok = true; ansBox.classList.add("right"); fb.className = "fb ok"; fb.textContent = "✔ Correcto."; speak(target.join(" ")); if (++solved === b.items.length) w.finish(); }
          else { fb.className = "fb no"; fb.textContent = "El orden no es correcto. Toca una pieza de arriba para regresarla. " + (it.tip || ""); }
        }
        var order = shuffle(target.map(function (_, ix) { return ix; }));
        draw();
        w.appendChild(el("div", { class: "q" }, [el("div", { html: "<b>" + (i + 1) + ".</b> " + (it.q || "") }), ansBox, bank, fb]));
      });
    });
  };

  B.voice = function (b) {
    return exercise(b, function (w) {
      var passed = {}, n = 0;
      if (!SR) w.appendChild(el("div", { class: "note warn", text: srMessage("unsupported") }));
      b.items.forEach(function (t, i) {
        w.appendChild(voiceRow(function () { return t; }, function () { if (!passed[i]) { passed[i] = 1; if (++n >= Math.ceil(b.items.length * 0.6)) w.finish(); } }));
      });
      if (!SR) w.appendChild(el("div", { class: "row" }, [el("button", { type: "button", onclick: function () { w.finish(); } }, ["Ya practiqué en voz alta"])]));
    });
  };

  /* --- escritura guiada: revisores --- */
  var PREPS = ["on top of", "in front of", "next to", "across from", "between", "behind", "under", "above", "below", "beside", "opposite", "inside", "near", "over", "on", "in"];
  function capPeriod(t) { t = t.trim(); return /^[A-Z]/.test(t) && /[.!]$/.test(t); }
  function any(f, list) { return list.some(function (x) { return f.indexOf(" " + x) >= 0; }); }

  var CHECK = {
    place: function (q, text) {
      var f = flat(text), verb = q.plural ? "there are" : "there is";
      var noRoom = f.replace(" in the " + q.room + " ", " , ");
      return [
        { ok: f.indexOf(" " + verb + " ") === 0, msg: "Empieza con <b>" + (q.plural ? "There are" : "There is") + "</b> (" + (q.plural ? "es plural" : "es singular") + ")." },
        { ok: any(f, q.obj), msg: "Menciona el objeto de la pregunta: <i>" + q.obj[0] + "</i>." },
        { ok: f.indexOf(" in the " + q.room + " ") >= 0, msg: "Di en qué cuarto está: <i>in the …</i> (revisa la imagen)." },
        { ok: PREPS.some(function (p) { return noRoom.indexOf(" " + p + " ") >= 0; }), msg: "Usa una preposición de lugar (<i>on, under, next to, between, above, behind, in front of…</i>)." },
        { ok: any(noRoom, q.refs), msg: "Usa como referencia otro objeto que se vea cerca en la imagen (abre la pista 2)." },
        { ok: capPeriod(text), msg: "Inicia con mayúscula y termina con punto." }
      ];
    },
    route: function (q, text) {
      var f = flat(text), M = A.map;
      var seq = M.sequencers.filter(function (s) { return f.indexOf(" " + s + " ") >= 0; }).length;
      var streets = M.streets.filter(function (g) { return g.some(function (s) { return f.indexOf(" " + s + " ") >= 0; }); }).length;
      var others = M.places.filter(function (p) { return q.dest.indexOf(p) < 0 && q.from.indexOf(p) < 0; });
      return [
        { ok: countWords(text) >= 25, msg: "Escribe una explicación completa: al menos 25 palabras (llevas " + countWords(text) + ")." },
        { ok: seq >= 2, msg: "Usa al menos dos conectores de secuencia: <i>First, Then, After that, Next, Finally</i>." },
        { ok: /\b(walk|go|keep|continue|take|cross)\b/.test(f), msg: "Usa verbos de dirección en imperativo: <i>walk, go, keep walking, cross</i>." },
        { ok: /\bturn (left|right)\b/.test(f), msg: "Indica dónde dar vuelta: <i>turn left / turn right</i>." },
        { ok: streets >= 2, msg: "Nombra al menos dos calles del mapa (por ejemplo <i>Oxford Street</i>)." },
        { ok: any(f, others), msg: "Menciona al menos un edificio por el que pasas: <i>pass the …</i>." },
        { ok: any(f, q.dest), msg: "Termina diciendo dónde está el destino: <i>The " + q.dest[0] + " is next to / opposite / on the …</i>." },
        { ok: capPeriod(text), msg: "Inicia con mayúscula y termina con punto." }
      ];
    }
  };

  function checksList(res) {
    var ul = el("ul", { class: "checks" });
    res.forEach(function (r) { ul.appendChild(el("li", { class: r.ok ? "ok" : "no", html: r.msg })); });
    return ul;
  }

  B.guided = function (b) {
    var w = el("div", { class: "card" });
    if (b.example) w.appendChild(el("div", { class: "note", html: b.example }));
    b.items.forEach(function (q) {
      var box = el("div", { class: "gq" });
      var badge = el("span", { class: "badge", text: "Lista", hidden: !S.done[q.key] });
      var h = el("h3", {}, [q.n + ". ", el("span", { class: "en", text: q.q }), badge]);
      box.appendChild(h);
      box.appendChild(el("p", { class: "muted", text: q.es }));
      if (q.fig) box.appendChild(figure(A.figures[q.fig], q.mark));
      if (q.note) box.appendChild(el("p", { class: "small", html: q.note }));
      var ta = el("textarea", { rows: b.rows || 2, placeholder: b.placeholder || "", "aria-label": "Respuesta " + q.n, spellcheck: "true", lang: "en" });
      ta.value = S.ans[q.key] || "";
      var out = el("div"), hintBox = el("div"), shown = 0;
      ta.addEventListener("input", function () { S.ans[q.key] = ta.value; save(); });
      var hintBtn = el("button", { type: "button", onclick: function () {
        if (shown < q.hints.length) { hintBox.appendChild(el("div", { class: "hint", html: "<b>Pista " + (shown + 1) + ":</b> " + q.hints[shown] })); shown++; }
        if (shown >= q.hints.length) hintBtn.disabled = true;
      } }, ["💡 Pista"]);
      var check = el("button", { type: "button", class: "primary", onclick: function () {
        var res = (q.check || CHECK[b.check])(q, ta.value), all = res.every(function (r) { return r.ok; });
        out.innerHTML = ""; out.appendChild(checksList(res));
        if (all) {
          out.appendChild(el("div", { class: "fb ok", text: b.okMsg || "¡Excelente! Tu respuesta tiene todos los elementos. Vuelve a leerla viendo la imagen para confirmar que la ubicación es correcta." }));
          S.done[q.key] = true; badge.hidden = false;
        } else { delete S.done[q.key]; badge.hidden = true; }
        save(); paintNav();
      } }, ["Revisar mi respuesta"]);
      box.appendChild(ta);
      box.appendChild(el("div", { class: "row" }, [check, hintBtn, listenBtn(function () { return ta.value || q.q; }, "🔊 Escuchar mi respuesta")]));
      box.appendChild(hintBox); box.appendChild(out);
      w.appendChild(box);
    });
    return w;
  };

  B.free = function (b) {
    var w = el("div", { class: "card" });
    var badge = el("span", { class: "badge", text: "Lista", hidden: !S.done[b.key] });
    w.appendChild(el("h3", {}, [b.title, badge]));
    if (b.intro) w.appendChild(el("div", { html: b.intro }));
    if (b.fig) w.appendChild(figure(A.figures[b.fig], "none"));
    var ta = el("textarea", { rows: b.rows || 6, lang: b.lang || "en", spellcheck: "true", "aria-label": b.title, placeholder: b.placeholder || "" });
    ta.value = S.ans[b.key] || "";
    var counter = el("div", { class: "counter" }), out = el("div");
    function count() {
      var n = countWords(ta.value);
      counter.textContent = n + " palabras" + (b.min ? " (meta: " + b.min + (b.max ? " a " + b.max : " o más") + ")" : "");
      counter.className = "counter" + (n >= (b.min || 0) && (!b.max || n <= b.max) ? " ok" : "");
    }
    ta.addEventListener("input", function () { S.ans[b.key] = ta.value; save(); count(); });
    count();
    w.appendChild(ta); w.appendChild(counter);
    var btns = [el("button", { type: "button", class: "primary", onclick: function () {
      var n = countWords(ta.value), f = flat(ta.value);
      var res = [{ ok: n >= b.min && (!b.max || n <= b.max), msg: "Extensión: " + b.min + (b.max ? " a " + b.max : " o más") + " palabras (llevas " + n + ")." }];
      (b.rules || []).forEach(function (r) { res.push({ ok: r.test(f, ta.value), msg: r.msg }); });
      out.innerHTML = ""; out.appendChild(checksList(res));
      var all = res.every(function (r) { return r.ok; });
      if (all) { S.done[b.key] = true; out.appendChild(el("div", { class: "fb ok", text: b.okMsg || "¡Muy bien! Tu texto cumple con lo que se pide." })); }
      else delete S.done[b.key];
      badge.hidden = !all; save(); paintNav();
    } }, ["Revisar mi texto"])];
    if ((b.lang || "en") === "en") btns.push(listenBtn(function () { return ta.value; }, "🔊 Escuchar mi texto"));
    w.appendChild(el("div", { class: "row" }, btns));
    w.appendChild(out);
    return w;
  };

  B.readaloud = function (b) {
    var w = el("div", { class: "card" }, [el("h3", { text: b.title }), el("div", { html: b.intro || "" })]);
    if (!SR) w.appendChild(el("div", { class: "note warn", text: srMessage("unsupported") }));
    b.keys.forEach(function (k) {
      var lab = el("div", { class: "small muted", text: k[1] });
      if (!ans(k[0])) { w.appendChild(el("div", { class: "vrow" }, [lab, el("div", { class: "fb no", text: "Todavía no escribes esta respuesta. Regresa al paso anterior para completarla." })])); return; }
      var row = voiceRow(function () { return ans(k[0]); });
      row.insertBefore(lab, row.firstChild);
      w.appendChild(row);
    });
    return w;
  };

  B.recorder = function (b) {
    var w = el("div", { class: "card" });
    var badge = el("span", { class: "badge", text: "Enlace guardado", hidden: !ans(b.key) });
    w.appendChild(el("h3", {}, [b.title, badge]));
    w.appendChild(el("div", { html: b.intro || "" }));
    var script = el("div", { class: "script en", lang: "en" });
    var have = 0;
    b.keys.forEach(function (k) { if (ans(k[0])) { have++; script.appendChild(el("p", { text: ans(k[0]) })); } });
    if (!have) script.appendChild(el("p", { class: "muted", text: "Aquí aparecerán tus respuestas cuando las escribas." }));
    w.appendChild(el("p", { class: "task", text: "Tu guion (lee todo esto en voz alta):" }));
    w.appendChild(script);

    var timer = el("div", { class: "timer", text: "0:00", "aria-live": "off" });
    var status = el("div", { class: "fb" }), player = el("div");
    var mr = null, chunks = [], t0 = 0, tick = null, stream = null;
    function fmt(s) { return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
    var btn = el("button", { type: "button", class: "primary", onclick: function () {
      if (mr && mr.state === "recording") { mr.stop(); return; }
      if (!navigator.mediaDevices || !window.MediaRecorder) { status.className = "fb no"; status.textContent = "Tu navegador no puede grabar audio aquí. Usa la grabadora de tu celular o computadora y sigue las instrucciones de abajo."; return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) {
        stream = st; chunks = [];
        mr = new MediaRecorder(st);
        mr.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
        mr.onstop = function () {
          clearInterval(tick); stream.getTracks().forEach(function (t) { t.stop(); });
          btn.classList.remove("rec-on"); btn.textContent = "⏺ Grabar de nuevo";
          var secs = Math.round((Date.now() - t0) / 1000);
          var type = mr.mimeType || "audio/webm", ext = /mp4|aac|m4a/.test(type) ? "m4a" : /ogg/.test(type) ? "ogg" : "webm";
          var blob = new Blob(chunks, { type: type }), url = URL.createObjectURL(blob);
          player.innerHTML = "";
          player.appendChild(el("audio", { controls: "", src: url }));
          player.appendChild(el("div", { class: "row" }, [el("a", { class: "btn primary", href: url, download: b.file + "." + ext }, ["⬇ Descargar mi audio"])]));
          if (secs >= 30) { status.className = "fb ok"; status.textContent = "Tu grabación dura " + fmt(secs) + ". Cumple con el mínimo de 30 segundos. Escúchala y, si te gusta, descárgala."; }
          else { status.className = "fb no"; status.textContent = "Tu grabación dura " + fmt(secs) + ". Debe durar al menos 30 segundos: lee más despacio y no te saltes ninguna respuesta."; }
        };
        mr.start(); t0 = Date.now();
        btn.classList.add("rec-on"); btn.textContent = "⏹ Detener grabación";
        status.className = "fb"; status.textContent = "Grabando… lee tu guion con calma.";
        timer.className = "timer"; timer.textContent = "0:00";
        tick = setInterval(function () { var s = Math.round((Date.now() - t0) / 1000); timer.textContent = fmt(s); if (s >= 30) timer.className = "timer ok"; }, 500);
      }).catch(function () { status.className = "fb no"; status.textContent = srMessage("not-allowed"); });
    } }, ["⏺ Grabar"]);
    w.appendChild(el("div", { class: "row" }, [btn, timer, el("span", { class: "muted small", text: "mínimo 0:30" })]));
    w.appendChild(status); w.appendChild(player);

    w.appendChild(el("div", { html: b.after || "" }));
    var link = el("input", { type: "url", placeholder: "https://drive.google.com/…", "aria-label": "Enlace de tu audio" });
    link.value = S.ans[b.key] || "";
    var lfb = el("div", { class: "fb" });
    link.addEventListener("input", function () {
      S.ans[b.key] = link.value.trim();
      var ok = /^https?:\/\/\S+\.\S+/.test(link.value.trim());
      if (ok) S.done[b.key] = true; else delete S.done[b.key];
      badge.hidden = !ok; lfb.className = "fb " + (ok ? "ok" : "no");
      lfb.textContent = link.value.trim() ? (ok ? "Enlace guardado. Ábrelo en una ventana de incógnito para comprobar que cualquiera puede escucharlo." : "Eso no parece un enlace. Debe empezar con https://") : "";
      save(); paintNav();
    });
    w.appendChild(link); w.appendChild(lfb);
    return w;
  };

  B.summary = function (b) {
    var w = el("div", { class: "card" }, [el("h3", { text: b.title }), el("div", { html: b.intro || "" })]);
    var missing = 0, plain = [], doc = ["<h1>" + esc(A.title) + "</h1>", "<p><b>BORRADOR.</b> Este documento no reemplaza el archivo oficial de la actividad: descarga el formato desde la plataforma, copia ahí tus respuestas y envía ese archivo.</p>"];
    b.sections.forEach(function (sec) {
      w.appendChild(el("h3", { text: sec.title }));
      plain.push("", sec.title.toUpperCase()); doc.push("<h2>" + esc(sec.title) + "</h2>");
      sec.items.forEach(function (it) {
        var v = ans(it[0]);
        if (!v) missing++;
        var copy = el("button", { type: "button", class: "noprint", onclick: function () { copyText(v, copy); } }, ["Copiar"]);
        w.appendChild(el("div", { class: "sum-item" }, [
          el("div", { class: "lbl", text: it[1] }),
          el("div", { class: "val" + (v ? "" : " empty"), lang: it[2] || "en", text: v || "— Falta esta respuesta —" }),
          v ? el("div", { class: "row" }, [copy]) : null
        ]));
        plain.push(it[1], v || "(falta)", "");
        doc.push("<p><b>" + esc(it[1]) + "</b><br>" + esc(v || "(falta)").replace(/\n/g, "<br>") + "</p>");
      });
    });
    var all = el("button", { type: "button", class: "primary", onclick: function () { copyText(plain.join("\n").trim(), all); } }, ["📋 Copiar todas mis respuestas"]);
    var dl = el("button", { type: "button", onclick: function () {
      var html = "<html><head><meta charset='utf-8'><title>" + esc(A.title) + "</title></head><body style='font-family:Arial'>" + doc.join("") + "</body></html>";
      var a = el("a", { href: URL.createObjectURL(new Blob(["﻿", html], { type: "application/msword" })), download: b.file + ".doc" });
      document.body.appendChild(a); a.click(); a.remove();
    } }, ["⬇ Descargar mi borrador"]);
    var pr = el("button", { type: "button", onclick: function () { window.print(); } }, ["🖨 Imprimir"]);
    var head = el("div", { class: "note " + (missing ? "warn" : ""), text: missing ? (missing === 1 ? "Te falta 1 respuesta" : "Te faltan " + missing + " respuestas") + ". Regresa a los pasos anteriores para completarla" + (missing === 1 ? "." : "s.") : (b.doneMsg || "¡Tienes todas tus respuestas! Cópialas al formato oficial de la actividad que descargaste de la plataforma.") });
    w.insertBefore(head, w.children[2] || null);
    var official = b.official !== undefined ? b.official : "<b>Importante:</b> este resumen y el borrador que puedes descargar aquí <b>no reemplazan el archivo oficial</b> de la actividad. Descarga el formato desde la plataforma, copia ahí tus respuestas y envía <b>ese archivo</b> para su revisión.";
    if (official) w.insertBefore(el("div", { class: "note accent", html: official }), head.nextSibling);
    w.appendChild(el("div", { class: "row noprint" }, b.noDownload ? [all] : [all, dl, pr]));
    if (b.outro) w.appendChild(el("div", { html: b.outro }));
    return w;
  };
  function copyText(t, btn) {
    var old = btn.textContent;
    function done() { btn.textContent = "✔ Copiado"; setTimeout(function () { btn.textContent = old; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fallback); else fallback();
    function fallback() { var ta = el("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) { /* sin portapapeles */ } ta.remove(); }
  }

  /* ---------- navegación ---------- */
  function stepKeys(st) {
    var keys = [];
    st.blocks.forEach(function (b) {
      if (b.type === "guided") b.items.forEach(function (q) { keys.push(q.key); });
      else if (b.key && b.type !== "summary") keys.push(b.key);
    });
    return keys;
  }
  function stepDone(i) {
    var keys = stepKeys(A.steps[i]);
    return !!S.seen[i] && keys.every(function (k) { return S.done[k]; });
  }
  var stepsNav, barFill, pctBox, mainBox, prevBtn, nextBtn;
  function paintNav() {
    var done = 0;
    Array.prototype.forEach.call(stepsNav.children, function (btn, i) {
      var d = stepDone(i); if (d) done++;
      btn.className = (i === cur ? "cur " : "") + (d ? "done" : "");
      btn.textContent = (d ? "✓ " : (i + 1) + ". ") + A.steps[i].short;
      if (i === cur) btn.setAttribute("aria-current", "step"); else btn.removeAttribute("aria-current");
    });
    var pct = Math.round(100 * done / A.steps.length);
    barFill.style.width = pct + "%"; pctBox.textContent = pct + "% completado";
  }
  function go(i, keepScroll) {
    if (active) active.rec.stop();
    if (window.speechSynthesis) speechSynthesis.cancel();
    cur = Math.max(0, Math.min(A.steps.length - 1, i));
    S.step = cur; S.seen[cur] = true; save();
    var st = A.steps[cur];
    mainBox.innerHTML = "";
    mainBox.appendChild(el("div", { class: "step-kicker", text: "Paso " + (cur + 1) + " de " + A.steps.length }));
    mainBox.appendChild(el("h1", { text: st.title }));
    if (st.lead) mainBox.appendChild(el("p", { class: "muted", html: st.lead }));
    st.blocks.forEach(function (b) { mainBox.appendChild(B[b.type](b)); });
    prevBtn.disabled = cur === 0;
    nextBtn.textContent = cur === A.steps.length - 1 ? "Volver al inicio ⌂" : "Siguiente →";
    paintNav();
    var c = stepsNav.children[cur]; if (c && c.scrollIntoView) c.scrollIntoView({ block: "nearest", inline: "center" });
    if (!keepScroll) window.scrollTo(0, 0);
    if (history.replaceState) history.replaceState(null, "", "#paso-" + (cur + 1));
  }

  function init() {
    document.title = A.title + " · Módulo 6";
    stepsNav = el("nav", { class: "steps", "aria-label": "Pasos de la actividad" });
    A.steps.forEach(function (st, i) { stepsNav.appendChild(el("button", { type: "button", onclick: function () { go(i); } }, [st.short])); });
    barFill = el("i"); pctBox = el("span", { class: "pct" });
    var top = el("header", { class: "top" }, [el("div", { class: "wrap" }, [
      el("div", { class: "top-row" }, [el("a", { class: "btn ghost icon", href: "index.html", title: "Inicio", "aria-label": "Volver al inicio" }, ["⌂"]), el("span", { class: "title", text: A.title }), pctBox]),
      el("div", { class: "bar" }, [barFill]), stepsNav
    ])]);
    mainBox = el("div", { class: "wrap" });
    prevBtn = el("button", { type: "button", onclick: function () { go(cur - 1); } }, ["← Anterior"]);
    nextBtn = el("button", { type: "button", class: "primary", onclick: function () { if (cur === A.steps.length - 1) location.href = "index.html"; else go(cur + 1); } }, ["Siguiente →"]);
    document.body.appendChild(top);
    document.body.appendChild(el("main", {}, [mainBox]));
    document.body.appendChild(el("div", { class: "navfoot" }, [el("div", { class: "wrap" }, [prevBtn, nextBtn])]));
    var m = /paso-(\d+)/.exec(location.hash);
    go(m ? +m[1] - 1 : S.step || 0, true);
  }
  init();
})();
