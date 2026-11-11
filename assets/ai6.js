/* Actividad integradora 6 — Daily routine (M06 S3) */
(function () {
  var BASE = "go|have|get|eat|work|study|wake|take|watch|play|sleep|do|make|cook|read|start|finish|brush|wash|drink|walk|come|leave|live|arrive|exercise|listen|drive|clean|visit|use|like|run|teach|help|call|check|prepare|return|relax|rest|wear|write|buy|open|close";
  var S_FORM = "goes|has|gets|eats|works|studies|wakes|takes|watches|plays|sleeps|does|makes|cooks|reads|starts|finishes|brushes|washes|drinks|walks|comes|leaves|lives|arrives|exercises|listens|drives|cleans|visits|uses|likes|runs|teaches|helps|calls|checks|prepares|returns|relaxes|rests|wears|writes|buys|opens|closes";
  var ADV = "(always |usually |often |sometimes |never |rarely |normally |generally |hardly ever |also )?";
  var FREQ = ["always", "usually", "often", "sometimes", "never", "rarely", "hardly ever", "every day", "every morning", "every night", "every week", "once a", "twice a", "times a", "on weekends", "on mondays", "on saturdays", "on sundays", "normally", "generally"];
  var TIME = ["in the morning", "in the afternoon", "in the evening", "at night", "at noon", "at midnight", "oclock", "at 1", "at 2", "at 3", "at 4", "at 5", "at 6", "at 7", "at 8", "at 9", "half past", "quarter", "then", "after that", "later", "early", "late", "before", "after", "am", "pm", "a m", "p m"];
  function count(f, list) { return list.filter(function (w) { return f.indexOf(" " + w) >= 0; }).length; }

  function checkQ(q, text) {
    var M = window.M06, f = M.flat(text), t = text.trim();
    return [
      { ok: /^ ((what time|what|where|when|how often|how|who|why|which)( [a-z]+){0,2} )?does [a-z]+ [a-z]+/.test(f), msg: "Usa la estructura <b>(Wh-) + does + he/she + verbo</b>: <i>What time does she…? / Does he…?</i>" },
      { ok: !new RegExp(" does [a-z]+ " + ADV + "(" + S_FORM + ") ").test(f), msg: "Después de <i>does</i> el verbo va <b>sin -s</b>: <i>Does she <b>go</b>…?</i> (no <i>goes</i>)." },
      { ok: !/ (do (he|she)|does (i|you|they|we)) /.test(f), msg: "Con <i>he / she</i> se usa <b>does</b>, no <i>do</i>." },
      { ok: M.countWords(text) >= 4, msg: "Escribe una pregunta completa sobre su rutina (qué hace, a qué hora, dónde, con qué frecuencia)." },
      { ok: /^[A-Z]/.test(t) && /\?$/.test(t), msg: "Inicia con mayúscula y termina con signo de interrogación <b>?</b> (en inglés solo va al final)." }
    ];
  }
  function checkA(q, text) {
    var M = window.M06, f = M.flat(text);
    var subj = "(yes |no )?(he|she|[a-z]+) ";
    var neg = /(doesnt|does not) [a-z]+/.test(f);
    var sform = new RegExp("^ " + subj + ADV + "([a-z]+s|has)\\b").test(f);
    var shortAns = /^ (yes (he|she) does|no (he|she) doesnt|no (he|she) does not) $/.test(f);
    return [
      { ok: /^ (yes |no )?(he|she) /.test(f) || /^[A-Z][a-z]+ /.test(text.trim().replace(/^(Yes|No),?\s+/, "")), msg: "Habla de la persona en tercera persona: empieza con <b>He</b>, <b>She</b> o su nombre (<i>Yes, she… / Samantha…</i>)." },
      { ok: (sform || neg) && !shortAns, msg: "Escribe una oración completa con el verbo en tercera persona: termina en <b>-s / -es</b> (<i>works, goes, has</i>) o usa <b>doesn't + verbo</b>." },
      { ok: !new RegExp(" (he|she) " + ADV + "(" + BASE + ") ").test(f), msg: "Te falta la <b>-s</b> del verbo: <i>she works, he goes, she has, he studies</i>." },
      { ok: !new RegExp(" (doesnt|does not) (" + S_FORM + ") ").test(f), msg: "Después de <i>doesn't</i> el verbo va sin -s: <i>She doesn't <b>work</b></i>." },
      { ok: M.countWords(text) >= 4, msg: "Responde con una oración completa, no solo <i>Yes</i> o <i>No</i>." },
      { ok: M.capPeriod(text), msg: "Inicia con mayúscula y termina con punto." }
    ];
  }

  var TOPICS = [
    ["la hora en que se despierta o se levanta", "What time does she get up?", "wake up, get up"],
    ["el desayuno", "What does he have for breakfast?", "have breakfast, eat, drink coffee"],
    ["cómo va al trabajo o a la escuela", "How does she go to work?", "go to work, take the bus, drive, walk"],
    ["a qué hora empieza a trabajar o estudiar", "What time does he start work?", "start work, start school, study"],
    ["dónde come", "Where does she have lunch?", "have lunch, eat at home, eat at work"],
    ["a qué hora termina", "When does he finish work?", "finish work, go home, arrive home"],
    ["si hace ejercicio (pregunta de sí o no)", "Does she exercise regularly?", "exercise, run, go to the gym, play soccer"],
    ["qué hace en la tarde o noche", "What does he do in the evening?", "watch TV, cook dinner, do homework, read"],
    ["con qué frecuencia hace algo", "How often does she cook dinner?", "always, usually, sometimes, never, every day"],
    ["a qué hora se duerme", "What time does he go to bed?", "go to bed, sleep, brush his/her teeth"]
  ];
  var items = [], pairs = [], script = [];
  TOPICS.forEach(function (tp, i) {
    var n = i + 1;
    items.push({ n: "Question " + n, key: "q" + n, q: "", es: "Sugerencia: pregunta sobre " + tp[0] + ".", check: checkQ,
      hints: ["Estructura: <i>What time / What / Where / When / How often</i> + <b>does</b> + <i>he / she</i> + verbo simple + …<b>?</b> Para sí o no: <b>Does</b> + <i>he / she</i> + verbo + …<b>?</b>", "Verbos que te sirven: <i>" + tp[2] + "</i>.", "Ejemplo (cámbialo por el tuyo): <i>" + tp[1] + "</i>"] });
    items.push({ n: "Answer " + n, key: "a" + n, q: "", es: "Responde tu pregunta " + n + " con una oración completa.", check: checkA,
      note: "",
      hints: ["Estructura: <i>He / She / Nombre</i> + (adverbio de frecuencia) + verbo con <b>-s</b> + … Para preguntas de sí o no: <i>Yes, she … / No, she doesn't …</i>", "Recuerda: <i>go → goes · have → has · do → does · watch → watches · study → studies · get → gets</i>.", "Ejemplos del formato: <i>Samantha has lunch at 4 o'clock. / Yes, she exercises regularly.</i>"] });
    pairs.push(["q" + n, n + ". Question"], ["a" + n, n + ". Answer"]);
    script.push(["q" + n], ["a" + n]);
  });
  script.push(["b"]);

  window.ACTIVITY = {
    id: "ai6",
    title: "Actividad integradora 6 · Finding a roommate",
    figures: {},
    steps: [
      {
        short: "Objetivo", title: "¿Qué vas a lograr?",
        lead: "Actividad integradora 6. Finding a roommate · Módulo 6, semana 3",
        blocks: [
          { type: "html", html: "<h3>Objetivo</h3><p>Al terminar podrás <b>preguntar y contar en inglés la rutina diaria</b> de otra persona (<span class='en'>he / she</span>) y la tuya, usando el presente simple, adverbios de tiempo y adverbios de frecuencia, por escrito y en voz alta.</p><h3>Lo que vas a entregar</h3><ul class='clean'><li><b>Sección A:</b> 10 preguntas en tercera persona (<span class='en'>he / she</span>) sobre la rutina de una persona y 10 respuestas completas.</li><li><b>Sección B:</b> al menos 5 oraciones sobre <b>tu</b> rutina diaria, con adverbios de tiempo y de frecuencia.</li><li><b>Sección C:</b> el enlace a un audio (mínimo 30 segundos) con todo lo anterior.</li><li><b>Sección D:</b> una reflexión en español de 100 a 150 palabras.</li></ul>" },
          { type: "html", html: "<h3>Antes de empezar: elige a tu persona</h3><p>Para la sección A piensa en <b>una persona real</b> cuya rutina conozcas: tu mamá, tu pareja, un hijo, una amiga, un compañero. Todas tus preguntas y respuestas serán sobre ella.</p><div class='note accent'>Si es mujer usarás <span class='en'>she</span>; si es hombre, <span class='en'>he</span>. En las respuestas puedes usar su nombre: <span class='en'>Samantha has lunch at 4 o'clock.</span></div><ul class='clean'><li>Tus respuestas <b>se guardan en este dispositivo</b>.</li><li>Para los ejercicios de voz usa <b>Google Chrome</b> o <b>Edge</b> y permite el micrófono.</li></ul>" }
        ]
      },
      {
        short: "Vocabulario", title: "Daily routine",
        lead: "Las actividades de todos los días y cómo decir la hora.",
        blocks: [
          { type: "cards", title: "In the morning", items: [["⏰", "wake up", "despertarse"], ["🛏️", "get up", "levantarse"], ["🚿", "take a shower", "bañarse"], ["👕", "get dressed", "vestirse"], ["🥣", "have breakfast", "desayunar"], ["🪥", "brush my teeth", "cepillarme los dientes"], ["🚌", "go to work", "ir al trabajo"], ["🏫", "go to school", "ir a la escuela"]] },
          { type: "cards", title: "In the afternoon and evening", items: [["💼", "start work", "empezar a trabajar"], ["🍽️", "have lunch", "comer (mediodía)"], ["🏁", "finish work", "terminar de trabajar"], ["🏠", "go home", "ir a casa"], ["📚", "do homework", "hacer la tarea"], ["🏋️", "exercise", "hacer ejercicio"], ["🍲", "cook dinner", "preparar la cena"], ["🥗", "have dinner", "cenar"], ["📺", "watch TV", "ver televisión"], ["🌙", "go to bed", "acostarse"]] },
          { type: "cards", title: "Time · La hora y el momento del día", items: [["🕖", "at seven o'clock", "a las siete en punto"], ["🕢", "at seven thirty", "a las siete y media"], ["🌅", "in the morning", "en la mañana"], ["☀️", "in the afternoon", "en la tarde"], ["🌆", "in the evening", "en la tarde-noche"], ["🌙", "at night", "en la noche"], ["🕛", "at noon", "al mediodía"], ["📅", "on weekends", "los fines de semana"]] },
          { type: "html", html: "<div class='note'><b>Fíjate en la preposición:</b> <span class='en'><b>at</b></span> + hora (<span class='en'>at 6:00, at noon, at night</span>) · <span class='en'><b>in</b> the</span> + parte del día (<span class='en'>in the morning</span>) · <span class='en'><b>on</b></span> + día (<span class='en'>on Mondays, on weekends</span>).</div>" },
          { type: "match", key: "p-match", title: "Práctica 1 · Une la actividad con su significado", pairs: [["get up", "levantarse"], ["have breakfast", "desayunar"], ["take a shower", "bañarse"], ["go to bed", "acostarse"], ["have lunch", "comer (mediodía)"], ["get dressed", "vestirse"], ["do homework", "hacer la tarea"], ["finish work", "terminar de trabajar"]] },
          { type: "gap", key: "p-prep", title: "Práctica 2 · at, in, on", items: [
            { t: "I get up ___ 6:00.", o: ["at", "in", "on"] },
            { t: "I have breakfast ___ the morning.", o: ["in", "at", "on"] },
            { t: "I go to bed late ___ night.", o: ["at", "in", "on"] },
            { t: "I exercise ___ Saturdays.", o: ["on", "in", "at"] },
            { t: "I do my homework ___ the afternoon.", o: ["in", "at", "on"] }
          ] }
        ]
      },
      {
        short: "He / She + -s", title: "Third person: he and she",
        lead: "En presente simple, cuando hablas de <span class='en'>he</span> o <span class='en'>she</span>, el verbo cambia: lleva <span class='en'>-s</span>.",
        blocks: [
          { type: "html", html: "<p class='note en' style='text-align:center;font-size:1.1rem'>I <b>work</b>. &nbsp;→&nbsp; She <b>works</b>. &nbsp;&nbsp;·&nbsp;&nbsp; I <b>go</b>. &nbsp;→&nbsp; He <b>goes</b>.</p><div class='tbl-wrap'><table><tr><th>Regla</th><th>Ejemplos</th></tr><tr><td>La mayoría: agrega <span class='en'>-s</span></td><td class='en'>get → gets · work → works · eat → eats · cook → cooks</td></tr><tr><td>Termina en <span class='en'>-o, -ch, -sh, -ss, -x</span>: agrega <span class='en'>-es</span></td><td class='en'>go → goes · do → does · watch → watches · brush → brushes · finish → finishes</td></tr><tr><td>Consonante + <span class='en'>y</span>: cambia a <span class='en'>-ies</span></td><td class='en'>study → studies</td></tr><tr><td>Vocal + <span class='en'>y</span>: solo <span class='en'>-s</span></td><td class='en'>play → plays</td></tr><tr><td>Irregular</td><td class='en'>have → <b>has</b></td></tr></table></div><div class='note warn'><b>Negación:</b> <span class='en'>doesn't</span> + verbo <b>sin -s</b>. <span class='en'>She doesn't work on Sundays.</span> (La -s ya está en <span class='en'>does</span>.)</div>" },
          { type: "gap", key: "p-s", title: "Práctica 1 · Elige la forma correcta", items: [
            { t: "She ___ up at 6:00 every day.", o: ["gets", "get", "getes"] },
            { t: "He ___ to work by bus.", o: ["goes", "gos", "go"] },
            { t: "Samantha ___ lunch at 4 o'clock.", o: ["has", "haves", "have"] },
            { t: "He ___ TV at night.", o: ["watches", "watchs", "watch"] },
            { t: "She ___ English in the evening.", o: ["studies", "studys", "study"] },
            { t: "He doesn't ___ breakfast.", o: ["have", "has", "haves"] }
          ] },
          { type: "order", key: "p-s-order", title: "Práctica 2 · De «I» a «She»", intro: "Ordena la oración en tercera persona.", items: [
            { q: "<span class='en'>I get up at 7:00 in the morning.</span> → She…", parts: ["She", "gets up", "at 7:00", "in the morning."] },
            { q: "<span class='en'>I don't work on Sundays.</span> → He…", parts: ["He", "doesn't", "work", "on Sundays."] },
            { q: "<span class='en'>I have dinner with my family.</span> → She…", parts: ["She", "has", "dinner", "with", "her family."] }
          ] }
        ]
      },
      {
        short: "Preguntas", title: "Questions with does",
        lead: "Para preguntar sobre <span class='en'>he / she</span> en presente se usa el auxiliar <span class='en'>does</span>.",
        blocks: [
          { type: "html", html: "<h3>Preguntas de información (Wh-)</h3><p class='note en' style='text-align:center'><b>Wh-</b> + <b>does</b> + <b>he / she</b> + <b>verbo simple</b> + … <b>?</b></p><div class='tbl-wrap'><table><tr><th>Palabra</th><th>Significa</th><th>Pregunta</th><th>Respuesta</th></tr><tr><td class='en'>What time</td><td>¿A qué hora?</td><td class='en'>What time does she have lunch?</td><td class='en'>She has lunch at 4 o'clock.</td></tr><tr><td class='en'>What</td><td>¿Qué?</td><td class='en'>What does he do in the evening?</td><td class='en'>He watches TV.</td></tr><tr><td class='en'>Where</td><td>¿Dónde?</td><td class='en'>Where does she work?</td><td class='en'>She works in a school.</td></tr><tr><td class='en'>How</td><td>¿Cómo?</td><td class='en'>How does he go to work?</td><td class='en'>He goes to work by bus.</td></tr><tr><td class='en'>How often</td><td>¿Con qué frecuencia?</td><td class='en'>How often does she exercise?</td><td class='en'>She exercises every day.</td></tr></table></div><h3>Preguntas de sí o no</h3><p class='note en' style='text-align:center'><b>Does</b> + <b>he / she</b> + <b>verbo simple</b> + … <b>?</b></p><p class='en'>Does she exercise regularly? — Yes, she exercises regularly. / No, she doesn't exercise regularly.</p><div class='note warn'><b>El error más común:</b> en la <b>pregunta</b> el verbo va <b>sin -s</b> (<span class='en'>does she <b>go</b></span>), y en la <b>respuesta</b> afirmativa <b>con -s</b> (<span class='en'>she <b>goes</b></span>).</div>" },
          { type: "mcq", key: "p-q", title: "Práctica 1 · Elige la pregunta correcta", items: [
            { q: "¿A qué hora se levanta ella?", o: ["What time does she get up?", "What time does she gets up?", "What time she gets up?"], tip: "Wh- + does + she + verbo sin -s." },
            { q: "¿Dónde trabaja él?", o: ["Where does he work?", "Where do he work?", "Where he works?"], tip: "Con he/she se usa does." },
            { q: "¿Ella ve televisión en la noche?", o: ["Does she watch TV at night?", "Does she watches TV at night?", "She does watch TV at night?"] },
            { q: "¿Con qué frecuencia cocina él?", o: ["How often does he cook?", "How often he cooks?", "How often does he cooks?"] }
          ] },
          { type: "order", key: "p-q-order", title: "Práctica 2 · Ordena la pregunta", items: [
            { q: "¿A qué hora come ella?", parts: ["What time", "does", "she", "have", "lunch?"] },
            { q: "¿Qué hace él los fines de semana?", parts: ["What", "does", "he", "do", "on weekends?"] },
            { q: "¿Ella hace ejercicio regularmente?", parts: ["Does", "she", "exercise", "regularly?"] }
          ] },
          { type: "mcq", key: "p-qa", title: "Práctica 3 · Elige la respuesta completa correcta", items: [
            { q: "<span class='en'>What time does he start work?</span>", o: ["He starts work at 8:00.", "He start work at 8:00.", "He does starts work at 8:00."] },
            { q: "<span class='en'>Does she have breakfast at home?</span>", o: ["Yes, she has breakfast at home.", "Yes, she have breakfast at home.", "Yes, she haves breakfast at home."] },
            { q: "<span class='en'>Does he exercise in the morning?</span>", o: ["No, he doesn't exercise in the morning.", "No, he doesn't exercises in the morning.", "No, he don't exercise in the morning."] }
          ] }
        ]
      },
      {
        short: "Adverbios", title: "Adverbs of frequency and time",
        lead: "Para tu rutina (sección B) necesitas decir <b>con qué frecuencia</b> y <b>cuándo</b> haces cada cosa.",
        blocks: [
          { type: "html", html: "<h3>Adverbios de frecuencia</h3><div class='tbl-wrap'><table><tr><th>Adverbio</th><th>Significa</th><th>Frecuencia</th></tr><tr><td class='en'><b>always</b></td><td>siempre</td><td>🟩🟩🟩🟩🟩 100%</td></tr><tr><td class='en'><b>usually</b></td><td>normalmente</td><td>🟩🟩🟩🟩⬜ 80%</td></tr><tr><td class='en'><b>often</b></td><td>a menudo</td><td>🟩🟩🟩⬜⬜ 60%</td></tr><tr><td class='en'><b>sometimes</b></td><td>a veces</td><td>🟩🟩⬜⬜⬜ 40%</td></tr><tr><td class='en'><b>rarely</b></td><td>casi nunca</td><td>🟩⬜⬜⬜⬜ 10%</td></tr><tr><td class='en'><b>never</b></td><td>nunca</td><td>⬜⬜⬜⬜⬜ 0%</td></tr></table></div><div class='note'><b>¿Dónde van?</b> <b>Antes</b> del verbo principal: <span class='en'>I <b>always</b> get up early.</span> Pero <b>después</b> del verbo <span class='en'>be</span>: <span class='en'>I am <b>never</b> late.</span><br>Las expresiones largas van al final: <span class='en'>I exercise <b>every day</b> / <b>twice a week</b> / <b>on weekends</b>.</span></div><h3>Adverbios y expresiones de tiempo</h3><ul class='clean'><li class='en'><b>at</b> 6:00 · <b>in the</b> morning / afternoon / evening · <b>at</b> night</li><li class='en'><b>early</b> (temprano) · <b>late</b> (tarde)</li><li class='en'><b>First</b>, … <b>Then</b> … <b>After that</b>, … <b>Later</b>, … <b>Finally</b>, …</li><li class='en'><b>before</b> work (antes del trabajo) · <b>after</b> dinner (después de cenar)</li></ul>" },
          { type: "order", key: "p-adv-order", title: "Práctica 1 · Pon el adverbio en su lugar", items: [
            { q: "Siempre me levanto a las 6:00.", parts: ["I", "always", "get up", "at 6:00."] },
            { q: "A veces veo televisión en la noche.", parts: ["I", "sometimes", "watch TV", "at night."] },
            { q: "Nunca desayuno tarde.", parts: ["I", "never", "have breakfast", "late."] },
            { q: "Hago ejercicio dos veces a la semana.", parts: ["I", "exercise", "twice", "a week."] }
          ] },
          { type: "gap", key: "p-adv", title: "Práctica 2 · Completa la rutina", items: [
            { t: "This is my daily routine. I get up ___ 6:00 in the morning every day.", o: ["at", "in", "on"] },
            { t: "___, I take a shower and get dressed.", o: ["Then", "Never", "At"] },
            { t: "I ___ have breakfast with my family.", o: ["usually", "every day", "twice a week"] },
            { t: "I go to work ___ the morning.", o: ["in", "at", "on"] },
            { t: "I go to bed early ___ night.", o: ["at", "in", "on"] }
          ] }
        ]
      },
      {
        short: "Listen & speak", title: "Listen and speak",
        lead: "Practica la pronunciación de preguntas, respuestas y rutina.",
        blocks: [
          { type: "voice", key: "p-voice", title: "Escucha y repite", intro: "Toca 🔊 para escuchar. Luego toca 🎤, di la oración y espera el resultado.", items: [
            "What time does she have lunch?",
            "Samantha has lunch at four o'clock.",
            "Does she exercise regularly?",
            "Yes, she exercises regularly.",
            "I always get up at six in the morning.",
            "I usually go to bed late at night."
          ] },
          { type: "html", html: "<h3>Tips de pronunciación</h3><ul class='clean'><li><b class='en'>does</b> = «das» (no «dús») · <b class='en'>doesn't</b> = «dá-sent».</li><li>La <b>-s</b> final sí se pronuncia: <span class='en'>works</span> «uérks», <span class='en'>gets</span> «guets», <span class='en'>goes</span> «góus».</li><li>Con <b>-es</b> se agrega una sílaba: <span class='en'>watches</span> «uó-chis», <span class='en'>finishes</span> «fí-ni-shis», <span class='en'>exercises</span> «ék-ser-sai-sis».</li><li><b class='en'>usually</b> = «yú-shua-li» · <b class='en'>always</b> = «ól-ueis» · <b class='en'>breakfast</b> = «brék-fast».</li><li>En las preguntas de sí o no (<span class='en'>Does she…?</span>) la voz <b>sube</b> al final.</li></ul>" }
        ]
      },
      {
        short: "Sección A", title: "Tu actividad: preguntas y respuestas",
        lead: "Sección A: escribe 10 preguntas en tercera persona (he o she) sobre la rutina diaria de una persona, y una oración completa que responda cada una.",
        blocks: [
          { type: "guided", placeholder: "", rows: 2, okMsg: "¡Excelente! Tiene la forma correcta.",
            example: "<b>Example:</b><br><span class='en'>What time does she have lunch? — Samantha has lunch at 4 o'clock.<br>Does she exercise regularly? — Yes, she exercises regularly.</span><br><span class='small'>Piensa en <b>una sola persona</b> y escribe todo sobre ella. Mezcla preguntas con <span class='en'>What time, What, Where, How often</span> y preguntas de sí o no. Las sugerencias de tema son opcionales.</span>",
            items: items }
        ]
      },
      {
        short: "Sección B", title: "My daily routine",
        lead: "Sección B: escribe al menos cinco oraciones que describan tu rutina diaria. Usa adverbios de tiempo y de frecuencia.",
        blocks: [
          { type: "html", html: "<h3>Plan para tu rutina</h3><p>Ahora hablas de <b>ti</b>: usa <span class='en'>I</span> y el verbo <b>sin -s</b> (<span class='en'>I get up</span>, no <span class='en'><s>I gets up</s></span>).</p><ol class='clean'><li>Empieza como el ejemplo: <span class='en'>This is my daily routine. I get up at 6:00 in the morning every day…</span></li><li>Sigue el orden de tu día: mañana → tarde → noche.</li><li>En cada oración di <b>cuándo</b> (<span class='en'>at 7:00, in the afternoon, then, after that</span>) o <b>con qué frecuencia</b> (<span class='en'>always, usually, sometimes, never, every day</span>).</li><li>Termina con la hora en que te duermes.</li></ol>" },
          { type: "free", key: "b", title: "B. My daily routine", min: 40, rows: 8, lang: "en", placeholder: "This is my daily routine. I…",
            rules: [
              { msg: "Escribe al menos cinco oraciones (cada una termina con punto).", test: function (f, raw) { return (raw.match(/[.!?](\s|$)/g) || []).length >= 5; } },
              { msg: "Habla de ti en primera persona: <i>I get up… I have…</i>", test: function (f) { return (f.match(/ i /g) || []).length >= 3; } },
              { msg: "Usa al menos dos adverbios de frecuencia distintos (<i>always, usually, often, sometimes, never, every day…</i>).", test: function (f) { return count(f, FREQ) >= 2; } },
              { msg: "Usa al menos tres expresiones de tiempo (<i>at 6:00, in the morning, at night, then, after that, early, late…</i>).", test: function (f) { return count(f, TIME) >= 3; } },
              { msg: "Con <i>I</i> el verbo va sin -s: revisa que no hayas escrito <i>I gets, I goes, I has</i>.", test: function (f) { return !new RegExp(" i " + ADV + "(" + S_FORM + ") ").test(f); } }
            ] }
        ]
      },
      {
        short: "Sección C · Audio", title: "Graba tu audio",
        lead: "Sección C: grábate leyendo las preguntas y respuestas de la sección A y tu rutina de la sección B. La grabación debe durar al menos 30 segundos.",
        blocks: [
          { type: "readaloud", title: "1. Ensaya", intro: "<p>Escucha con 🔊 y luego lee con 🎤. Las palabras en verde se entendieron; las subrayadas en rojo necesitan más práctica. Los nombres propios a veces no se reconocen: no te preocupes por esos.</p>",
            keys: pairs.concat([["b", "My daily routine"]]) },
          { type: "recorder", key: "c", file: "M06_S3_AI6_audio", title: "2. Graba y comparte tu audio",
            intro: "<p>Lee cada pregunta con su respuesta y al final tu rutina, todo de corrido. Lee despacio y con claridad. Puedes repetir la grabación las veces que quieras.</p>",
            keys: script,
            after: "<h3>3. Sube tu audio a la nube</h3><ol class='clean'><li>Descarga tu audio con el botón de arriba (o usa uno que grabaste con tu celular).</li><li>Entra a <b>Google Drive</b> (drive.google.com) → <b>Nuevo</b> → <b>Subir archivo</b> y elige tu audio.</li><li>Da clic derecho en el archivo → <b>Compartir</b> → en «Acceso general» elige <b>Cualquier persona con el enlace</b> (Lector).</li><li>Toca <b>Copiar enlace</b> y pégalo aquí:</li></ol>" }
        ]
      },
      {
        short: "Sección D", title: "Reflexión",
        lead: "Sección D: esta respuesta se escribe en español.",
        blocks: [
          { type: "free", key: "d", lang: "es", min: 100, max: 150, rows: 9, title: "D. ¿De qué manera compartir tu rutina diaria en inglés te permite identificar las similitudes y diferencias en las costumbres y tradiciones entre personas de diferentes culturas?",
            intro: "<p>Escribe tu respuesta en español en un párrafo de entre 6 y 8 líneas (aproximadamente 100 a 150 palabras).</p><div class='note'><b>Ideas para empezar</b> (elige las que sean verdad para ti):<ul class='clean'><li>¿Qué partes de tu rutina crees que son iguales en casi todo el mundo?</li><li>¿Cuáles son muy de tu cultura? (horarios de comida, la convivencia familiar, las fiestas, el trabajo…)</li><li>En el ejemplo, Samantha come a las 4. ¿A qué hora se come en tu casa? ¿Y en otros países?</li><li>¿Qué aprendes de ti y de los demás al comparar rutinas?</li></ul></div>",
            placeholder: "Compartir mi rutina diaria en inglés me permite…", okMsg: "¡Muy bien! Tu reflexión tiene la extensión que se pide. Léela una vez más para revisar ortografía.",
            rules: [{ msg: "Escribe con tus propias palabras y en español; menciona tu rutina y las costumbres o culturas que comparas.", test: function (f) { return /rutina/.test(f) && /(cultura|costumbre|tradici)/.test(f); } }] }
        ]
      },
      {
        short: "Entrega", title: "Revisa y entrega",
        lead: "Aquí están todas tus respuestas. Cópialas al archivo oficial de la actividad que descargaste de la plataforma: ese es el que envías.",
        blocks: [
          { type: "summary", file: "M06_S3_AI6_respuestas", title: "Mis respuestas · Actividad integradora 6",
            sections: [
              { title: "A. Questions and answers", items: pairs },
              { title: "B. My daily routine", items: [["b", "Mi rutina diaria"]] },
              { title: "C. Audio", items: [["c", "Enlace a mi grabación"]] },
              { title: "D. Reflexión", items: [["d", "¿De qué manera compartir tu rutina te permite identificar similitudes y diferencias culturales?", "es"]] }
            ],
            outro: "<h3>Lista final antes de enviar</h3><ul class='clean'><li>Mis 10 preguntas usan <span class='en'>does + he/she</span> + verbo sin -s y terminan con <b>?</b></li><li>Mis 10 respuestas son oraciones completas con el verbo en tercera persona (<span class='en'>-s</span>).</li><li>Todas hablan de la misma persona.</li><li>Mi rutina tiene al menos 5 oraciones con adverbios de tiempo y de frecuencia.</li><li>Mi audio incluye la sección A y la B, dura al menos 30 segundos y el enlace abre sin pedir permiso.</li><li>Mi reflexión está en español y tiene de 100 a 150 palabras.</li></ul>" }
        ]
      }
    ]
  };
})();
