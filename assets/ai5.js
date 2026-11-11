/* Actividad integradora 5 — Abilities, likes and dislikes (M06 S3) */
(function () {
  var KIND = {
    can: { re: /^ i can (?!not |to )[a-z]+/, msg: "Empieza con <b>I can</b> + verbo: <i>I can swim…</i>", frame: "I can + verbo + detalle." },
    cant: { re: /^ i (cant|cannot|can not) (?!to )[a-z]+/, msg: "Empieza con <b>I can't</b> (o <i>I cannot</i>) + verbo: <i>I can't drive…</i>", frame: "I can't + verbo + detalle." },
    like: { re: /^ i (really )?like (to [a-z]+|[a-z]+ing)\b/, msg: "Empieza con <b>I like to</b> + verbo, o <b>I like</b> + verbo con <i>-ing</i>.", frame: "I like to + verbo… / I like + verbo-ing…" },
    dislike: { re: /^ i ((really )?dislike [a-z]+ing|(dont|do not) like (to [a-z]+|[a-z]+ing))\b/, msg: "Empieza con <b>I dislike</b> + verbo con <i>-ing</i> (también vale <i>I don't like</i> + <i>-ing</i>).", frame: "I dislike + verbo-ing + detalle." },
    hate: { re: /^ i (really )?hate (to [a-z]+|[a-z]+ing)\b/, msg: "Empieza con <b>I hate to</b> + verbo, o <b>I hate</b> + verbo con <i>-ing</i>.", frame: "I hate to + verbo… / I hate + verbo-ing…" },
    love: { re: /^ i (really )?love (to [a-z]+|[a-z]+ing)\b/, msg: "Empieza con <b>I love to</b> + verbo, o <b>I love</b> + verbo con <i>-ing</i>.", frame: "I love to + verbo… / I love + verbo-ing…" }
  };
  function checker(kind, sib) {
    return function (q, text) {
      var M = window.M06, f = M.flat(text), k = KIND[kind];
      var res = [{ ok: k.re.test(f), msg: k.msg }];
      if (kind === "can" || kind === "cant") res.push({ ok: !/ (can|cant|cannot|can not) (to |(?!sing |bring |swing )[a-z]{2,}ing )/.test(f), msg: "Después de <i>can / can't</i> el verbo va en forma simple: sin <i>to</i>, sin <i>-ing</i> y sin <i>-s</i>." });
      res.push({ ok: M.countWords(text) >= 4, msg: "Escribe una oración completa con algún detalle (qué, dónde, cuándo o con quién)." });
      res.push({ ok: !M.ans(sib) || M.flat(M.ans(sib)) !== f, msg: "Tus dos oraciones deben ser diferentes." });
      res.push({ ok: M.capPeriod(text), msg: "Inicia con mayúscula y termina con punto." });
      return res;
    };
  }
  var items = [];
  function add(n, kind, en, es, ideas, example) {
    [1, 2].forEach(function (i) {
      items.push({
        n: n + "." + i, key: "a" + n + "-" + i, q: en, es: es + " — oración " + i + " de 2",
        check: checker(kind, "a" + n + "-" + (3 - i)),
        note: i === 2 ? "Escribe una actividad <b>diferente</b> a la de tu primera oración." : "",
        hints: ["Estructura: <i>" + KIND[kind].frame + "</i>", "Ideas de actividades: " + ideas + ". Elige las que sean verdad para ti.", "Ejemplo (no lo copies, escribe el tuyo): <i>" + example + "</i>"]
      });
    });
  }
  add(1, "can", "What can you do?", "¿Qué puedes hacer?", "<i>cook, swim, dance, sing, drive, ride a bike, play the guitar, speak English, draw, use a computer</i>", "I can cook Mexican food for my family.");
  add(2, "cant", "What can't you do?", "¿Qué no puedes hacer?", "<i>drive a truck, play the piano, speak French, swim, ski, fly a plane, run fast, whistle</i>", "I can't play the piano.");
  add(3, "like", "What do you like to do?", "¿Qué te gusta hacer?", "<i>listen to music, watch movies, read, walk in the park, play soccer, cook, go out with friends</i>", "I like to walk in the park on Sundays.");
  add(4, "dislike", "What do you dislike doing?", "¿Qué te desagrada hacer?", "<i>washing the dishes, ironing, getting up early, waiting in line, cleaning the bathroom, taking the bus</i>", "I dislike waiting in line at the bank.");
  add(5, "hate", "What do you hate to do?", "¿Qué odias hacer?", "<i>get up early, do the laundry, be late, go to the dentist, drive in traffic, take out the trash</i>", "I hate to drive in traffic.");
  add(6, "love", "What do you love to do?", "¿Qué amas hacer?", "<i>spend time with my family, travel, dance, sing, play with my children, learn new things, eat tacos</i>", "I love to travel with my family.");

  var QS = ["What can you do?", "What can't you do?", "What do you like to do?", "What do you dislike doing?", "What do you hate to do?", "What do you love to do?"];
  var script = [], sumItems = [];
  QS.forEach(function (qq, i) {
    script.push(["=" + qq], ["a" + (i + 1) + "-1"], ["a" + (i + 1) + "-2"]);
    sumItems.push(["a" + (i + 1) + "-1", (i + 1) + ". " + qq + " — Sentence 1"], ["a" + (i + 1) + "-2", (i + 1) + ". " + qq + " — Sentence 2"]);
  });

  window.ACTIVITY = {
    id: "ai5",
    title: "Actividad integradora 5 · About me",
    figures: {},
    steps: [
      {
        short: "Objetivo", title: "¿Qué vas a lograr?",
        lead: "Actividad integradora 5. About me · Módulo 6, semana 3",
        blocks: [
          { type: "html", html: "<h3>Objetivo</h3><p>Al terminar podrás <b>hablar en inglés de tus habilidades y tus gustos</b>: lo que puedes y no puedes hacer (<span class='en'>can / can't</span>) y lo que te gusta, te desagrada, odias y amas hacer (<span class='en'>like, dislike, hate, love</span>), por escrito y en voz alta.</p><h3>Lo que vas a entregar</h3><ul class='clean'><li><b>Sección A:</b> 6 preguntas, cada una con <b>dos oraciones completas</b> y <b>una imagen por oración</b> (12 oraciones y 12 imágenes).</li><li><b>Sección B:</b> el enlace a un audio (mínimo 30 segundos) donde lees las preguntas y tus respuestas.</li><li><b>Sección C:</b> una reflexión en español de 100 a 150 palabras.</li></ul>" },
          { type: "html", html: "<h3>¿Cómo funciona este sitio?</h3><ul class='clean'><li>Avanza con el botón <b>Siguiente</b>: primero aprendes y practicas, después contestas tu actividad.</li><li>Tus respuestas <b>se guardan en este dispositivo</b>.</li><li>Para los ejercicios de voz usa <b>Google Chrome</b> o <b>Edge</b> y permite el micrófono.</li><li>Las imágenes las agregas tú directamente en tu archivo de Word; aquí te decimos cómo.</li></ul><div class='note accent'>Tus respuestas son personales: no hay una sola correcta. El sitio revisa la <b>forma</b> de tus oraciones; el contenido es tuyo.</div>" }
        ]
      },
      {
        short: "Vocabulario", title: "Activities",
        lead: "Verbos y actividades para hablar de lo que haces. Toca cada tarjeta y repite.",
        blocks: [
          { type: "cards", title: "Skills · Habilidades", items: [["🏊", "swim", "nadar"], ["🍳", "cook", "cocinar"], ["💃", "dance", "bailar"], ["🎤", "sing", "cantar"], ["🚗", "drive", "manejar"], ["🚲", "ride a bike", "andar en bicicleta"], ["🎸", "play the guitar", "tocar la guitarra"], ["⚽", "play soccer", "jugar futbol"], ["🗣️", "speak English", "hablar inglés"], ["🎨", "draw", "dibujar"], ["🏃", "run", "correr"], ["💻", "use a computer", "usar una computadora"]] },
          { type: "cards", title: "Free time · Tiempo libre", items: [["🎧", "listen to music", "escuchar música"], ["🎬", "watch movies", "ver películas"], ["📖", "read", "leer"], ["✈️", "travel", "viajar"], ["🌳", "walk in the park", "caminar en el parque"], ["👨‍👩‍👧", "spend time with my family", "pasar tiempo con mi familia"], ["🛍️", "go shopping", "ir de compras"], ["🎮", "play video games", "jugar videojuegos"]] },
          { type: "cards", title: "Chores · Quehaceres y cosas no tan divertidas", items: [["🍽️", "wash the dishes", "lavar los trastes"], ["🧹", "clean the house", "limpiar la casa"], ["👕", "iron", "planchar"], ["🧺", "do the laundry", "lavar la ropa"], ["⏰", "get up early", "levantarse temprano"], ["🧍", "wait in line", "hacer fila"], ["🗑️", "take out the trash", "sacar la basura"], ["🚦", "drive in traffic", "manejar en el tráfico"]] },
          { type: "match", key: "p-match", title: "Práctica 1 · Une la actividad con su significado", pairs: [["wash the dishes", "lavar los trastes"], ["ride a bike", "andar en bicicleta"], ["get up early", "levantarse temprano"], ["draw", "dibujar"], ["wait in line", "hacer fila"], ["iron", "planchar"], ["go shopping", "ir de compras"], ["drive", "manejar"]] },
          { type: "mcq", key: "p-play", title: "Práctica 2 · ¿Cuál es correcta?", intro: "Fíjate en los detalles: instrumentos con <span class='en'>the</span>, deportes sin <span class='en'>the</span>.", items: [
            { q: "Tocar la guitarra", o: ["play the guitar", "play guitar the", "touch the guitar"], tip: "Tocar un instrumento = play the + instrumento." },
            { q: "Jugar futbol", o: ["play soccer", "play the soccer", "do soccer"], tip: "Con deportes no se usa the." },
            { q: "Escuchar música", o: ["listen to music", "listen music", "hear to music"], tip: "Listen siempre lleva to." },
            { q: "Ver películas", o: ["watch movies", "see to movies", "look movies"] }
          ] }
        ]
      },
      {
        short: "Can / can't", title: "Can and can't",
        lead: "Con <span class='en'>can</span> dices lo que <b>puedes</b> hacer; con <span class='en'>can't</span>, lo que <b>no puedes</b> hacer.",
        blocks: [
          { type: "html", html: "<div class='tbl-wrap'><table><tr><th></th><th>Estructura</th><th>Ejemplo</th></tr><tr><td>✅ Afirmativa</td><td class='en'>I <b>can</b> + verbo</td><td class='en'>I can dance. <span class='muted'>= Puedo bailar.</span></td></tr><tr><td>❌ Negativa</td><td class='en'>I <b>can't</b> + verbo</td><td class='en'>I can't sing. <span class='muted'>= No puedo cantar.</span></td></tr><tr><td>❓ Pregunta</td><td class='en'>What <b>can</b> you do?</td><td class='en'>I can cook and I can sing.</td></tr></table></div><div class='note'><b>Tres reglas de oro:</b><ul class='clean'><li>Después de <span class='en'>can / can't</span> el verbo va <b>simple</b>: <span class='en'>I can <s>to</s> swim</span>.</li><li><span class='en'>Can</span> no cambia con ninguna persona: <span class='en'>I can, she can, they can</span>.</li><li><span class='en'>can't</span> = <span class='en'>cannot</span>. En el audio, <span class='en'>can't</span> suena más largo y fuerte: «kaant».</li></ul></div><p>Puedes dar más información con: <span class='en'>very well</span> (muy bien), <span class='en'>a little</span> (un poco), <span class='en'>at all</span> (para nada): <span class='en'>I can't dance at all.</span></p>" },
          { type: "mcq", key: "p-can", title: "Práctica 1 · Elige la oración correcta", items: [
            { q: "Puedo cocinar.", o: ["I can cook.", "I can to cook.", "I can cooking."], tip: "Después de can, el verbo va sin to y sin -ing." },
            { q: "No puedo manejar.", o: ["I can't drive.", "I don't can drive.", "I can't to drive."], tip: "La negación de can es can't, sin don't." },
            { q: "Puedo tocar la guitarra muy bien.", o: ["I can play the guitar very well.", "I can very well play the guitar.", "I can plays the guitar very well."] },
            { q: "No puedo nadar para nada.", o: ["I can't swim at all.", "I can't at all swim.", "I no can swim."] }
          ] },
          { type: "order", key: "p-can-order", title: "Práctica 2 · Ordena la oración", items: [
            { q: "Puedo hablar un poco de inglés.", parts: ["I", "can", "speak", "a little", "English."] },
            { q: "No puedo andar en bicicleta.", parts: ["I", "can't", "ride", "a bike."] },
            { q: "¿Qué puedes hacer?", parts: ["What", "can", "you", "do?"] }
          ] }
        ]
      },
      {
        short: "Like, love, hate", title: "Like, dislike, hate and love",
        lead: "Cuatro verbos para hablar de tus gustos, del que más te agrada al que menos.",
        blocks: [
          { type: "html", html: "<p class='note en' style='font-size:1.15rem;text-align:center'>😍 <b>love</b> &nbsp;›&nbsp; 🙂 <b>like</b> &nbsp;›&nbsp; 🙁 <b>dislike</b> &nbsp;›&nbsp; 😡 <b>hate</b></p><div class='tbl-wrap'><table><tr><th>Verbo</th><th>Con <span class='en'>to</span> + verbo</th><th>Con verbo + <span class='en'>-ing</span></th></tr><tr><td class='en'><b>love</b> (amar, encantar)</td><td class='en'>I love to dance.</td><td class='en'>I love dancing.</td></tr><tr><td class='en'><b>like</b> (gustar)</td><td class='en'>I like to read.</td><td class='en'>I like reading.</td></tr><tr><td class='en'><b>hate</b> (odiar)</td><td class='en'>I hate to iron.</td><td class='en'>I hate ironing.</td></tr><tr><td class='en'><b>dislike</b> (desagradar)</td><td class='muted'>— no se usa —</td><td class='en'>I dislike ironing.</td></tr></table></div><div class='note warn'><b>Ojo con <span class='en'>dislike</span>:</b> siempre va con <span class='en'>-ing</span>. Por eso la pregunta de tu actividad dice <span class='en'>What do you dislike <b>doing</b>?</span> Lo correcto es <span class='en'>I dislike washing the dishes</span>, no <span class='en'><s>I dislike to wash</s></span>.</div>" },
          { type: "html", html: "<h3>¿Cómo se forma el <span class='en'>-ing</span>?</h3><div class='tbl-wrap'><table><tr><th>Regla</th><th>Ejemplos</th></tr><tr><td>La mayoría: agrega <span class='en'>-ing</span></td><td class='en'>cook → cooking · read → reading · wash → washing</td></tr><tr><td>Termina en <span class='en'>-e</span>: quita la e</td><td class='en'>dance → dancing · drive → driving · ride → riding</td></tr><tr><td>Corto, termina en consonante-vocal-consonante: duplica</td><td class='en'>swim → swimming · run → running · get → getting</td></tr></table></div>" },
          { type: "gap", key: "p-ing", title: "Práctica 1 · Elige la forma -ing correcta", items: [
            { t: "I love ___ with my friends.", o: ["dancing", "danceing", "danccing"] },
            { t: "I dislike ___ up early.", o: ["getting", "geting", "to get"] },
            { t: "I like ___ in the pool.", o: ["swimming", "swiming", "swimmeing"] },
            { t: "I hate ___ in traffic.", o: ["driving", "driveing", "drivving"] },
            { t: "I like ___ to music.", o: ["listening", "listenning", "listeing"] }
          ] },
          { type: "mcq", key: "p-like", title: "Práctica 2 · ¿Qué verbo expresa lo mismo?", items: [
            { q: "😍 Me encanta viajar.", o: ["I love to travel.", "I dislike traveling.", "I can't travel."] },
            { q: "🙁 Me desagrada planchar.", o: ["I dislike ironing.", "I dislike to iron.", "I like ironing."], tip: "Dislike siempre va con -ing." },
            { q: "😡 Odio hacer fila.", o: ["I hate to wait in line.", "I love waiting in line.", "I hate wait in line."], tip: "Hate + to + verbo, o hate + verbo-ing." },
            { q: "🙂 Me gusta leer.", o: ["I like to read.", "I like read.", "I am like to read."], tip: "Like + to + verbo, o like + verbo-ing." }
          ] },
          { type: "order", key: "p-like-order", title: "Práctica 3 · Ordena la oración", items: [
            { q: "What do you like to do?", parts: ["I", "like", "to listen", "to music", "at night."] },
            { q: "What do you dislike doing?", parts: ["I", "dislike", "cleaning", "the bathroom."] },
            { q: "What do you love to do?", parts: ["I", "love", "to spend", "time", "with my family."] }
          ] }
        ]
      },
      {
        short: "Listen & speak", title: "Listen and speak",
        lead: "En tu audio leerás las preguntas y tus respuestas. Practica primero con estas.",
        blocks: [
          { type: "voice", key: "p-voice-q", title: "Práctica 1 · Las seis preguntas", intro: "Toca 🔊 para escuchar. Luego toca 🎤 y di la pregunta. En las preguntas con <span class='en'>What</span> la voz baja al final.", items: QS },
          { type: "voice", key: "p-voice-a", title: "Práctica 2 · Respuestas modelo", items: [
            "I can cook, but I can't drive.",
            "I like to listen to music at night.",
            "I dislike getting up early.",
            "I hate to wait in line.",
            "I love to spend time with my family."
          ] },
          { type: "html", html: "<h3>Tips de pronunciación</h3><ul class='clean'><li><b class='en'>can</b> en oración suena corto: «ken» (<span class='en'>I can swim</span> = «ai ken suím»). <b class='en'>can't</b> suena largo y marcado: «kaant».</li><li><b class='en'>like</b> = «láik» · <b class='en'>love</b> = «lav» · <b class='en'>hate</b> = «jéit» (la <i>h</i> suena como «j» suave).</li><li><b class='en'>dislike</b> = «dis-láik» · <b class='en'>doing</b> = «dú-ing».</li><li>La terminación <b class='en'>-ing</b> suena «ing», sin pronunciar fuerte la <i>g</i>.</li></ul>" }
        ]
      },
      {
        short: "Sección A", title: "Tu actividad: tus habilidades y gustos",
        lead: "Sección A: responde las preguntas con oraciones completas. Escribe dos oraciones por pregunta.",
        blocks: [
          { type: "guided", placeholder: "I…", okMsg: "¡Excelente! Tu oración tiene la forma correcta. Piensa qué imagen la puede ilustrar.",
            example: "Escribe sobre <b>ti</b>: cosas que de verdad puedes hacer y que te gustan o no. Para cada pregunta necesitas <b>dos oraciones diferentes</b>. Toca <b>Revisar mi respuesta</b> y pide una pista si te atoras.",
            items: items },
          { type: "html", html: "<h3>🖼️ Las imágenes</h3><p>En tu archivo de Word debes agregar <b>una imagen por cada oración</b> (12 en total), en la columna <span class='en'>Pictures</span>.</p><ul class='clean'><li>Puedes usar <b>fotos tuyas</b> haciendo la actividad, dibujos hechos por ti o imágenes libres de internet.</li><li>Sitios con imágenes gratuitas: <b>pixabay.com</b>, <b>pexels.com</b>, <b>unsplash.com</b>. Busca en inglés la actividad (por ejemplo <span class='en'>cooking</span>).</li><li>En Word: clic en la celda → <b>Insertar → Imágenes</b> → elige el archivo. Hazla pequeña para que quepa en la tabla.</li><li>La imagen debe mostrar <b>la misma actividad</b> que dice tu oración.</li></ul>" }
        ]
      },
      {
        short: "Sección B · Audio", title: "Graba tu audio",
        lead: "Sección B: grábate leyendo en voz alta las preguntas y respuestas de la sección A. La grabación debe durar al menos 30 segundos.",
        blocks: [
          { type: "readaloud", title: "1. Ensaya tus respuestas", intro: "<p>Escucha tu oración con 🔊 y luego léela con 🎤. Las palabras en verde se entendieron; las subrayadas en rojo necesitan más práctica.</p>",
            keys: sumItems.map(function (s) { return [s[0], s[1].replace(" — Sentence ", " · ")]; }) },
          { type: "recorder", key: "b", file: "M06_S3_AI5_audio", title: "2. Graba y comparte tu audio",
            intro: "<p>Lee cada <b>pregunta</b> y después tus <b>dos respuestas</b>, de corrido. Lee despacio y con claridad. Puedes repetir la grabación las veces que quieras.</p>",
            keys: script,
            after: "<h3>3. Sube tu audio a la nube</h3><ol class='clean'><li>Descarga tu audio con el botón de arriba (o usa uno que grabaste con tu celular).</li><li>Entra a <b>Google Drive</b> (drive.google.com) → <b>Nuevo</b> → <b>Subir archivo</b> y elige tu audio.</li><li>Da clic derecho en el archivo → <b>Compartir</b> → en «Acceso general» elige <b>Cualquier persona con el enlace</b> (Lector).</li><li>Toca <b>Copiar enlace</b> y pégalo aquí:</li></ol>" }
        ]
      },
      {
        short: "Sección C", title: "Reflexión",
        lead: "Sección C: esta respuesta se escribe en español.",
        blocks: [
          { type: "free", key: "c", lang: "es", min: 100, max: 150, rows: 9, title: "C. ¿De qué manera compartir tus gustos y habilidades en inglés te permite conectar con personas de diferentes culturas?",
            intro: "<p>Escribe tu respuesta en español en un párrafo de entre 6 y 8 líneas (aproximadamente 100 a 150 palabras).</p><div class='note'><b>Ideas para empezar</b> (elige las que sean verdad para ti):<ul class='clean'><li>¿Qué gustos tuyos crees que comparten personas de otros países (música, comida, deportes)?</li><li>¿Cómo ayuda tener algo en común para iniciar una conversación o una amistad?</li><li>¿Qué podrías aprender de las habilidades y pasatiempos de otras culturas?</li><li>¿Dónde podrías usarlo: redes sociales, videojuegos, trabajo, viajes?</li></ul></div>",
            placeholder: "Compartir mis gustos y habilidades en inglés me permite…", okMsg: "¡Muy bien! Tu reflexión tiene la extensión que se pide. Léela una vez más para revisar ortografía.",
            rules: [{ msg: "Escribe con tus propias palabras y en español; menciona el inglés y las culturas o personas con las que puedes conectar.", test: function (f) { return /ingl[eé]s/.test(f) && /(cultura|persona|pa[ií]s)/.test(f); } }] }
        ]
      },
      {
        short: "Entrega", title: "Revisa y entrega",
        lead: "Aquí están todas tus respuestas. Cópialas al archivo oficial de la actividad que descargaste de la plataforma: ese es el que envías.",
        blocks: [
          { type: "summary", file: "M06_S3_AI5_respuestas", title: "Mis respuestas · Actividad integradora 5",
            intro: "<p class='small muted'>Recuerda: en el Word, cada oración lleva su imagen en la columna <span class='en'>Pictures</span>.</p>",
            sections: [
              { title: "A. Sentences", items: sumItems },
              { title: "B. Audio", items: [["b", "Enlace a mi grabación"]] },
              { title: "C. Reflexión", items: [["c", "¿De qué manera compartir tus gustos y habilidades te permite conectar con otras culturas?", "es"]] }
            ],
            outro: "<h3>Lista final antes de enviar</h3><ul class='clean'><li>Tengo dos oraciones completas y diferentes para cada una de las 6 preguntas.</li><li>Cada oración tiene su imagen (12 imágenes) y la imagen corresponde a la actividad.</li><li>Mi audio incluye preguntas y respuestas, dura al menos 30 segundos y el enlace abre sin pedir permiso.</li><li>Mi reflexión está en español y tiene de 100 a 150 palabras.</li></ul><p><a class='btn primary' href='actividad-6.html'>Continuar con la Actividad 6 →</a></p>" }
        ]
      }
    ]
  };
})();
