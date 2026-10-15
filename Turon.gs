/**
 * ╔════════════════════════════════════════════════════════════════════╗
 * ║  TURON CLUB — МУСТАҚИЛ ИЛОВА СЕРВЕРИ                    v1.6        ║
 * ║  Кириш (код) + маълумот — ҳаммаси битта скриптда.                   ║
 * ║  Иш жадвалларини фақат ЎҚИЙДИ, уларга ҳеч нарса ёзмайди.            ║
 * ╚════════════════════════════════════════════════════════════════════╝
 *
 * Бу — RBA панелидан МУСТАҚИЛ. RBA нинг кириш тизимига ҳам, бошқа
 * скриптларига ҳам боғлиқ эмас: ўз кириш коди ва ўз имзо калити бор.
 * Имзо калити биринчи ишга туширишда ўзи яратилади ва скрипт
 * хотирасида (ScriptProperties) сақланади — бу файлда калит ЙЎҚ.
 *
 * ═══ ЖОЙЛАШТИРИШ ═══
 *  1. script.google.com → «Новый проект» → номи «Turon Club App»
 *  2. Кодни шу файл билан алмаштиринг
 *  3. Пастдаги TUR.KOD_ADMIN га admin кодини ёзинг (6 рақам) → Ctrl+S
 *  4. turSinov ни ишга туширинг → рухсат беринг → ✅ лар чиқиши керак
 *  5. Развернуть → Новое развертывание → Веб-приложение
 *        Выполнять от имени:  Я
 *        У кого есть доступ:  ВСЕ
 *  6. Чиққан …/exec ҳаволасини index.html даги API_TURON га қўйинг
 *
 * ═══ ЯНГИЛАШ ═══
 *  Кодни шу файл билан алмаштиринг → TUR.KOD_ADMIN ни ёзинг → Ctrl+S →
 *  Управление развертываниями → ✏ → Новая версия. Ҳавола ўзгармайди.
 *
 * ═══ БЎЛИМЛАР ═══
 *  ?amal=baza        — Турон Клуб («Клуб тўловлари» + «Учрашув ҳисоботи»)
 *  ?amal=forum       — Турон Клуб Форум («Турон клуб форум платформаси»: Билет, Таклифнома, Келиб тўлов)
 *  ?amal=forum_mark  — Турон Форум маркетинг («Marketing RBA 15» → «Турон форум» варағи)
 *  Ҳаммасига бир хил кириш (аъзо ёки admin коди). Ҳар бирининг ўз кэши бор.
 *
 * ═══ ТЕЗЛИК ═══
 *  turSozla ни БИР МАРТА ишга туширинг (рухсат сўрайди). У 5 дақиқалик триггер
 *  ўрнатади: маълумот олдиндан тайёрланади ва кирганда дарҳол очилади.
 *
 * ═══ РОЛЛАР ва КОДЛАР ═══
 *  Аъзо коди  — маълумотни кўради.
 *  Admin коди — бунга қўшимча «Назорат» бўлими: қурилмалар, уларга ном қўйиш,
 *               блоклаш, кириш журнали, кодларни алмаштириш, ҳаммани чиқариш.
 *  Кодлар admin панелидан алмаштирилади ва скрипт хотирасида сақланади —
 *  файлни қайта қўйганда ҳам ўзгармайди.
 *
 * ═══ ХОТИРА ═══
 *  Қурилмалар рўйхати ва журнал скрипт хотирасида (ScriptProperties) туради.
 *  Алоҳида жадвал очилмайди, иш жадвалларингизга ҳеч нарса ёзилмайди.
 *
 * ═══ ЖАДВАЛЛАР ═══
 *  «Клуб тўловлари маълумотлари»
 *     Тўлов маълумотлари:  № | Аъзо И.Ф.О. | Шартнома рақами | Сана | Фаолият тури |
 *                          Тўлов усули | Фирма номи | Тўланган сумма 100 % | Давлати | Шаҳар
 *     План:                План | Факт | Колди
 *  «Учрашув ҳисоботи»
 *     Аъзолар ҳисоботи:    № | Учрашув санаси | Аъзо Ф.И.Ш. | Аъзо ҳақида | Масъул |
 *                          Асосий муаммо ва эҳтиёжлар | Ижроси | Натижа | Муддат | Ҳолати % да
 *     Ҳар аъзо — бир неча қатор: ҳар қаторда битта муаммо, ёнида унинг ижроси ва натижаси.
 *     Аъзога тегишли катаклар (исм, масъул, муддат, ҳолат) бирлаштирилган бўлади.
 *  Устун ТАРТИБИ муҳим эмас — сарлавҳа НОМИ бўйича топилади.
 *  Доллар курси — Марказий банк (cbu.uz), 6 соатда бир янгиланади.
 */

var TUR_VERSIYA = '1.6';

/* ══════════════════════════════════════════════════════════════
   КИРИШ — кодлар (аъзо / admin), рухсатнома, уринишлар чегараси
   ══════════════════════════════════════════════════════════════ */

function turProp() { return PropertiesService.getScriptProperties(); }

/* ── Тезлик ──
   Скрипт хотираси ҳар сўровда БИР МАРТА ўқилади (turH) ва ўзгаришлар
   БИР МАРТА ёзилади (turQulf охирида). Аввал ҳар қиймат алоҳида ўқиларди —
   кириш шунинг учун секин эди. */
var TUR_H = null;      // шу сўров давомидаги нусха
var TUR_YOZ = null;    // қулф ичида тўпланаётган ёзувлар

function turH(yangi) {
  if (!TUR_H || yangi) TUR_H = turProp().getProperties();
  return TUR_H;
}
function turOl(k) { var h = turH(); return Object.prototype.hasOwnProperty.call(h, k) ? h[k] : null; }
function turQoy(k, v) {
  v = String(v); turH()[k] = v;
  if (TUR_YOZ) TUR_YOZ[k] = v; else turProp().setProperty(k, v);
}

/** Ёзадиган ҳамма жой шу қулф остида ишлайди — ёзувлар бир-бирини босмайди */
function turQulf(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    turH(true); TUR_YOZ = {};
    var r = fn(), y = TUR_YOZ;
    TUR_YOZ = null;
    if (Object.keys(y).length) turProp().setProperties(y);
    return r;
  } finally { TUR_YOZ = null; lock.releaseLock(); }
}

/** Имзо калити — биринчи марта ўзи яратилади, файлда сақланмайди */
function turSir() {
  var s = turOl('SIR');
  if (!s) {
    s = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
    turQoy('SIR', s);
  }
  return s;
}

/**
 * Кириш коди. Admin панелидан алмаштирилган бўлса — скрипт хотирасидан,
 * акс ҳолда пастдаги TUR созламасидан олинади.
 * 000000 — «қўйилмаган» дегани: бундай код билан кириб бўлмайди.
 */
function turKod(rol) {
  var v = turOl(rol === 'admin' ? 'KOD_ADMIN' : 'KOD_AZO') ||
          String(rol === 'admin' ? TUR.KOD_ADMIN : TUR.KOD);
  v = String(v || '').replace(/\D/g, '');
  return (v.length === 6 && v !== '000000') ? v : '';
}

/** Давр — «ҳаммани чиқариш» босилганда ошади, эски рухсатномалар бекор бўлади */
function turDavr() { return +(turOl('DAVR') || 1); }

function turImzo(m) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(m, turSir())).replace(/=+$/, '');
}

function turTokenYasa(rol, qid) {
  var exp = Date.now() + TUR.MUDDAT_SOAT * 3600 * 1000;
  var m = (rol === 'admin' ? 'admin' : 'azo') + '.' + exp + '.' + qid + '.' + turDavr();
  return { token: m + '.' + turImzo(m), exp: exp };
}

function turTokenOch(t) {
  var q = String(t || '').split('.');
  if (q.length !== 5) return null;
  var m = q.slice(0, 4).join('.');
  if (turImzo(m) !== q[4]) return null;
  if (+q[1] < Date.now()) return null;
  if (+q[3] !== turDavr()) return null;
  return { rol: q[0] === 'admin' ? 'admin' : 'azo', exp: +q[1], qid: q[2] };
}

function turQid(q) { return String(q || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 32); }

/** Маълумот сўровини текширади — рухсатнома бўлмаса ёки қурилма блокланган бўлса хато ташлайди */
function turRuxsat(t) {
  var k = turTokenOch(t), q = k ? turQurOl(k.qid) : null;
  if (!k || (q && q.bl)) {
    var e = new Error(k ? 'Бу қурилмага кириш ёпилган' : 'Кириш талаб қилинади');
    e.kirish = true; throw e;
  }
  return k;
}

function turAdmin(d) {
  var t = turTokenOch(d.t);
  if (!t || t.rol !== 'admin') { var e = new Error('Фақат admin учун'); e.kirish = !t; throw e; }
  return t;
}


/* ══════════════════════════════════════════════════════════════
   ҚУРИЛМАЛАР ва ЖУРНАЛ — скрипт хотирасида (ScriptProperties)
   Ҳар қурилма алоҳида ёзув:  Q_<id> = { n: ном, q: қурилма, r: роль,
     b1: биринчи кириш, ox: охирги фаоллик, s: киришлар, bl: блок, bo: бўлим }
   Ном ДАРҲОЛ ёзилади — навбат ҳам, кутиш ҳам йўқ.
   ══════════════════════════════════════════════════════════════ */

function turQurOl(qid) {
  try { return JSON.parse(turOl('Q_' + qid) || 'null'); } catch (e) { return null; }
}

/** Қурилма ёзувини ўзгартиради. fn(ёзув) — ўзгартирилган ёзувни қайтаради. Қулф остида чақирилади. */
function turQurYoz_(qid, fn) {
  var o = null;
  try { o = JSON.parse(turOl('Q_' + qid) || 'null'); } catch (e) { o = null; }
  o = fn(o || { n: '', q: '', r: '', b1: Date.now(), ox: 0, s: 0, bl: 0, bo: '' }) || o;
  turQoy('Q_' + qid, JSON.stringify(o));
  return o;
}

function turQurJavob(qid, o) {
  return { qid: qid, nom: o.n || '', qurilma: o.q || '', rol: o.r || '', birinchi: +o.b1 || 0,
           oxirgi: +o.ox || 0, soni: +o.s || 0, blok: !!o.bl, bolim: o.bo || '' };
}

/**
 * Журнал — охирги бир неча юз ҳодиса. Ёзув: [вақт, қурилма ID, роль, ҳодиса, изоҳ].
 * Тўртта бўлак: JUR_A тўлса — B, C, D га сурилади, энг эскиси ўчади.
 * Қулф остида чақирилади.
 */
var TUR_JUR = ['JUR_A', 'JUR_B', 'JUR_C', 'JUR_D'];

function turBayt(s) { return s.length + s.replace(/[\x00-\x7F]/g, '').length; }   // кирилл — 2 байт

function turJurYoz_(qid, rol, hodisa, izoh) {
  var a = [];
  try { a = JSON.parse(turOl('JUR_A') || '[]'); } catch (e) { a = []; }
  a.push([Date.now(), qid || '', rol || '', hodisa, String(izoh || '').slice(0, 60)]);
  var s = JSON.stringify(a);
  if (turBayt(s) > 8000) {                     // ScriptProperties чегараси — 9 КБ
    for (var i = TUR_JUR.length - 1; i > 1; i--) {
      var v = turOl(TUR_JUR[i - 1]);
      if (v) turQoy(TUR_JUR[i], v);
    }
    turQoy('JUR_B', JSON.stringify(a.slice(0, -1)));
    s = JSON.stringify(a.slice(-1));
  }
  turQoy('JUR_A', s);
}


/* ══════════════════════════════════════════════════════════════
   КИРИШ ва ФАОЛЛИК
   ══════════════════════════════════════════════════════════════ */

function turKirish(d) {
  var qid = turQid(d.qid);
  if (!qid) return { ok: false, xato: 'Қурилма аниқланмади' };
  var qurilma = String(d.qurilma || '').slice(0, 80);
  var kod = String(d.kod || '').replace(/\D/g, '');
  var c = CacheService.getScriptCache();

  var k = c.getAll(['blok_umum', 'blok_' + qid, 'xato_' + qid, 'xato_umum']);   // битта сўров

  if (k['blok_umum'])
    return { ok: false, blok: true, xato: 'Кириш вақтинча ёпилган. 10 дақиқадан кейин уриниб кўринг.' };
  if (k['blok_' + qid])
    return { ok: false, blok: true, xato: 'Кўп марта хато код. 15 дақиқадан кейин уриниб кўринг.' };

  var rol = null, ka = turKod('admin'), kz = turKod('azo');
  if (kod && ka && kod === ka) rol = 'admin';
  else if (kod && kz && kod === kz) rol = 'azo';

  if (!rol) {
    var n = (+k['xato_' + qid] || 0) + 1;
    c.put('xato_' + qid, String(n), 900);
    var g = (+k['xato_umum'] || 0) + 1;
    c.put('xato_umum', String(g), 600);
    if (g >= 25) c.put('blok_umum', '1', 600);
    var blok = n >= 5;
    if (blok) c.put('blok_' + qid, '1', 900);
    try { turQulf(function () { turJurYoz_(qid, '', blok ? 'kopxato' : 'xato', qurilma); }); } catch (e) {}
    return blok
      ? { ok: false, blok: true, xato: 'Кўп марта хато код. 15 дақиқадан кейин уриниб кўринг.' }
      : { ok: false, xato: 'Код нотўғри', qoldi: 5 - n };
  }

  var yopiq = false;
  turQulf(function () {
    var eski = turQurOl(qid);
    if (eski && eski.bl) { yopiq = true; turJurYoz_(qid, rol, 'yopiq', qurilma); return; }
    turQurYoz_(qid, function (o) {
      if (qurilma) o.q = qurilma;
      o.r = rol; o.ox = Date.now(); o.s = (+o.s || 0) + 1;
      return o;
    });
    turJurYoz_(qid, rol, 'kir', '');
  });
  if (yopiq)
    return { ok: false, blok: true, xato: 'Бу қурилмага кириш ёпилган. Администраторга мурожаат қилинг.' };

  if (k['xato_' + qid]) c.remove('xato_' + qid);
  var tk = turTokenYasa(rol, qid);
  return { ok: true, rol: rol, token: tk.token, exp: tk.exp, muddat: TUR.MUDDAT_SOAT };
}

/** Илова бўлим алмашганда ва ҳар 5 дақиқада сўрайди: сеанс тирикми. Фаол фойдаланувчининг муддати узаяди. */
function turFaol(d) {
  var t = turTokenOch(d.t);
  if (!t) return { ok: true, chiqish: true, sabab: 'Сеанс тугади — қайта киринг' };
  var q = turQurOl(t.qid);
  if (q && q.bl) return { ok: true, chiqish: true, sabab: 'Бу қурилмага кириш ёпилди' };

  var bolim = String(d.bolim || '').slice(0, 40), qurilma = String(d.qurilma || '').slice(0, 80);
  // Ҳар сўровда ёзмаймиз: фақат бўлим алмашса ёки 1 дақиқадан кўп ўтган бўлса
  if (!q || (bolim && bolim !== q.bo) || Date.now() - (+q.ox || 0) > 60000) {
    try {
      turQulf(function () {
        turQurYoz_(t.qid, function (o) {
          o.ox = Date.now(); o.r = t.rol;
          if (bolim) o.bo = bolim;
          if (qurilma) o.q = qurilma;
          return o;
        });
      });
    } catch (e) {}
  }

  var o = { ok: true, chiqish: false, rol: t.rol };
  if (t.exp - Date.now() < (TUR.MUDDAT_SOAT - 1) * 3600 * 1000) {
    var tk = turTokenYasa(t.rol, t.qid);
    o.token = tk.token; o.exp = tk.exp;
  }
  return o;
}


/* ══════════════════════════════════════════════════════════════
   ADMIN — назорат, номлаш, блок, код алмаштириш
   ══════════════════════════════════════════════════════════════ */

/** Қурилмалар рўйхати ва журнал */
function turNazorat(d) {
  var t = turAdmin(d);
  var h = turH(true), qur = [], nomlar = {}, jur = [];
  Object.keys(h).forEach(function (k) {
    if (k.indexOf('Q_') !== 0) return;
    try {
      var o = JSON.parse(h[k]), id = k.slice(2);
      qur.push(turQurJavob(id, o));
      nomlar[id] = o;
    } catch (e) {}
  });
  qur.sort(function (a, b) { return b.oxirgi - a.oxirgi; });

  TUR_JUR.slice().reverse().forEach(function (k) {
    try { jur = jur.concat(JSON.parse(h[k] || '[]')); } catch (e) {}
  });
  jur = jur.reverse().map(function (r) {
    var q = nomlar[r[1]] || {};
    return { vaqt: r[0], qid: r[1], rol: r[2], hodisa: r[3], izoh: r[4] || '',
             nom: q.n || '', qurilma: q.q || (r[3] === 'xato' || r[3] === 'kopxato' || r[3] === 'yopiq' ? r[4] : '') };
  });

  return { ok: true, qurilmalar: qur, jurnal: jur, hozir: Date.now(), men: t.qid,
           kodAzo: !!turKod('azo'), versiya: TUR_VERSIYA };
}

/** Қурилмага ном қўйиш — дарҳол сақланади, сақлангани қайтарилади */
function turNomQoy(d) {
  turAdmin(d);
  var qid = turQid(d.qid);
  if (!qid) return { ok: false, xato: 'Қурилма аниқланмади' };
  var nom = String(d.nom == null ? '' : d.nom).replace(/\s+/g, ' ').trim().slice(0, 40);
  var o = turQulf(function () {
    return turQurYoz_(qid, function (x) { x.n = nom; return x; });
  });
  return { ok: true, qurilma: turQurJavob(qid, o) };
}

function turBlokQoy(d) {
  var t = turAdmin(d), qid = turQid(d.qid);
  if (!qid) return { ok: false, xato: 'Қурилма аниқланмади' };
  if (qid === t.qid) return { ok: false, xato: 'Ўз қурилмангизни блоклаб бўлмайди' };
  var o = turQulf(function () {
    var x = turQurYoz_(qid, function (y) { y.bl = d.blok ? 1 : 0; return y; });
    turJurYoz_(qid, 'admin', d.blok ? 'ablok' : 'aochdi', '');
    return x;
  });
  return { ok: true, qurilma: turQurJavob(qid, o) };
}

/** Қурилмани рўйхатдан ўчириш (қайта кирса — янгидан пайдо бўлади) */
function turQurOchir(d) {
  var t = turAdmin(d), qid = turQid(d.qid);
  if (!qid) return { ok: false, xato: 'Қурилма аниқланмади' };
  if (qid === t.qid) return { ok: false, xato: 'Ўз қурилмангизни ўчириб бўлмайди' };
  turQulf(function () { delete turH()['Q_' + qid]; turProp().deleteProperty('Q_' + qid); });
  return { ok: true };
}

function turKodAlmash(d) {
  var t = turAdmin(d);
  var rol = d.rol === 'admin' ? 'admin' : 'azo';
  var yangi = String(d.yangi || '').replace(/\D/g, '');
  if (yangi.length !== 6) return { ok: false, xato: 'Код 6 та рақам бўлиши керак' };
  if (yangi === '000000') return { ok: false, xato: '000000 кодини қўйиб бўлмайди' };
  if (yangi === turKod(rol === 'admin' ? 'azo' : 'admin'))
    return { ok: false, xato: 'Admin ва аъзо коди бир хил бўлмасин' };
  turQulf(function () {
    turQoy(rol === 'admin' ? 'KOD_ADMIN' : 'KOD_AZO', yangi);
    turJurYoz_(t.qid, 'admin', rol === 'admin' ? 'kodadmin' : 'kodazo', '');
  });
  return { ok: true };
}

/** Ҳамма қурилмадаги сеансни тугатади. Admin'нинг ўзи учун янги рухсатнома қайтади. */
function turHammaChiqar(d) {
  var t = turAdmin(d);
  turQulf(function () {
    turQoy('DAVR', String(turDavr() + 1));
    turJurYoz_(t.qid, 'admin', 'chiqar', '');
  });
  var tk = turTokenYasa('admin', t.qid);
  return { ok: true, token: tk.token, exp: tk.exp };
}

/** Apps Script'дан қўлда: ҳамма сеансни тугатади */
function turHammaChiqsin() {
  turProp().setProperty('DAVR', String(turDavr() + 1));
  Logger.log('Ҳамма сеанслар тугатилди. Энди ҳамма қайта код теради.');
}


var TUR = {

  // ⚠ КИРИШ КОДЛАРИ — 6 та рақам. 000000 = қўйилмаган (бундай код билан кириб бўлмайди).
  //   Admin панелидан («Назорат → Кодлар») алмаштирилса, янгиси скрипт хотирасида
  //   сақланади ва шу ердаги қийматдан устун туради.
  KOD:       '000000',       // аъзолар коди
  KOD_ADMIN: '000000',       // admin коди
  MUDDAT_SOAT: 24,           // 24 соат ишлатилмаса — код қайта сўралади

  JADVAL_ID: '1elehsZPyNWA4Ny9BFtzIJY_wNjBz8xZv14TLJBQD2TI',
  // «Учрашув ҳисоботи» — ўқувчилар билан учрашувлар
  OQ_JADVAL_ID: '1r8u_Jg99XDcwPmML2z6KJhbh4T28KmO8dKmHJGKJw14',
  OQ_VARAQ:  ['Аъзолар ҳисоботи', 'Аъзолар хисоботи', 'Ўқувчилар'],
  // Марказий банк ишламай қолса — шу курс ишлатилади
  KURS_ZAXIRA: 12600,
  VARAQ:     ['Тўлов маълумотлари', 'Тулов маълумотлари', 'Тўловлар'],
  PLAN:      ['План', 'Plan', 'Режа'],
  KESH_SONIYA: 3600,         // тайёр жавоб кэшда шунча туради
  ESKI_SONIYA: 600           // триггер (turSozla) ҳар 5 дақиқада янгилайди; у ишламаса — 10 дақиқадан эски бўлса сўровда янгиланади
};

var TUR_XARITA = {
  fio:       ['Аъзо И.Ф.О.', 'Аъзо ИФО', 'Аъзо', 'И.Ф.О.', 'ФИО'],
  shartnoma: ['Шартнома рақами', 'Шартнома', 'Договор'],
  sana:      ['Сана', 'Дата'],
  faoliyat:  ['Фаолият тури', 'Фаолият', 'Соҳа'],
  usul:      ['Тўлов усули', 'Тулов усули'],
  firma:     ['Фирма номи', 'Фирма'],
  summa:     ['Тўланган сумма 100 %', 'Тўланган сумма 100%', 'Тўланган сумма', 'Сумма'],
  davlat:    ['Давлати', 'Давлат', 'Страна'],
  shahar:    ['Шаҳар', 'Шахар', 'Шаҳри', 'Вилоят', 'Город']
};

var TUR_OQ_XARITA = {
  sana:   ['Учрашув санаси', 'Учрашув', 'Сана'],
  fio:    ['Аъзо Ф.И.Ш.', 'Аъзо Ф.И.О.', 'Аъзо И.Ф.О.', 'Аъзо', 'Ф.И.Ш.', 'ФИО'],
  haqida: ['Аъзо ҳақида', 'Аъзо хақида', 'Аъзо хакида', 'Ҳақида', 'Фаолияти'],
  // xohish — муаммо / эҳтиёж;  nima — ижроси (биз томондан);  эски сарлавҳалар ҳам ишлайверади
  xohish: ['Асосий муаммо ва эҳтиёжлар', 'Асосий муаммо', 'Муаммо ва эҳтиёжлар', 'Муаммо', 'Хоҳиш / сўров', 'Хоҳиш/сўров', 'Хоҳиш', 'Сўров'],
  nima:   ['Ижроси', 'Ижро', 'Нима қилиш керак', 'Нима қилиш'],
  masul:  ['Масъул', 'Масул', 'Жавобгар'],
  muddat: ['Муддат', 'Срок'],
  holat:  ['Ҳолати % да', 'Ҳолати', 'Ҳолат', 'Фоиз'],
  natija: ['Натижа', 'Результат']
};


/* ══════════════════════════════════════════════════════════════
   API
   ══════════════════════════════════════════════════════════════ */

function doGet(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    if (p.amal === 'tekshir')
      return turJavob({ ok: true, versiya: TUR_VERSIYA, kodAdmin: !!turKod('admin'), kodAzo: !!turKod('azo'),
        xabar: 'Turon Club App ишлаяпти — версия ' + TUR_VERSIYA, vaqt: turHozir() });

    turRuxsat(p.t);

    var nom = p.amal === 'forum' ? 'for' : p.amal === 'forum_mark' ? 'mk' : 'tur';
    return ContentService.createTextOutput(turMalumot(p.yangi === '1', nom)).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return turJavob({ ok: false, versiya: TUR_VERSIYA, kirish: !!err.kirish, xato: String(err.message || err) });
  }
}

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (d.amal) {
      case 'kirish':  return turJavob(turKirish(d));
      case 'faol':    return turJavob(turFaol(d));
      case 'nazorat': return turJavob(turNazorat(d));
      case 'nom':     return turJavob(turNomQoy(d));
      case 'blok':    return turJavob(turBlokQoy(d));
      case 'ochir':   return turJavob(turQurOchir(d));
      case 'kod':     return turJavob(turKodAlmash(d));
      case 'chiqar':  return turJavob(turHammaChiqar(d));
      default:        return turJavob({ ok: false, xato: 'Номаълум амал' });
    }
  } catch (err) {
    return turJavob({ ok: false, kirish: !!err.kirish, xato: String(err.message || err) });
  }
}

/* ── Тайёр жавоб кэши ──
   Битта қиймат 100 КБ дан ошмаслиги керак, шунинг учун бўлакларга бўлинади —
   маълумот кўпайса ҳам кэш ишлайверади. */
/* Учта маълумот манбаи — ҳар бирининг ўз кэши ва ўз «ўқияпти» белгиси */
var TUR_MANBA = {
  tur: { kesh: 'tur3', qur: function () { return turBaza(); } },     // Турон Клуб
  'for': { kesh: 'for3', qur: function () { return forBaza(); } },   // Форум
  mk:  { kesh: 'mkf3', qur: function () { return mkBaza_(); } }      // Форум маркетинг
};

function turKeshQoy(matn, k) {
  k = k || 'tur3';
  var n = Math.ceil(matn.length / 45000), o = {};
  o[k + '_n'] = String(n);
  for (var i = 0; i < n; i++) o[k + '_' + i] = matn.substr(i * 45000, 45000);
  CacheService.getScriptCache().putAll(o, TUR.KESH_SONIYA);
}

function turKeshOl(k) {
  k = k || 'tur3';
  var c = CacheService.getScriptCache(), n = +c.get(k + '_n');
  if (!n) return null;
  var kl = [], s = '';
  for (var i = 0; i < n; i++) kl.push(k + '_' + i);
  var h = c.getAll(kl);
  for (var j = 0; j < n; j++) { if (h[kl[j]] == null) return null; s += h[kl[j]]; }
  return s;
}

/**
 * Жадвални ўқиб, тайёр жавобни кэшга қўяди.
 * Бир вақтда фақат БИТТА ўқиш кетади: «…_band» белгиси турганда бошқалар кутади.
 * (Аввал ҳар «Янгилаш» ва ҳар қайта уриниш алоҳида ўқиш бошларди — улар устма-уст
 *  тўпланиб, бутун скриптни секинлаштирарди.)
 */
function turYangila_(nom) {
  var m = TUR_MANBA[nom || 'tur'], c = CacheService.getScriptCache();
  c.put(m.kesh + '_band', '1', 240);
  try {
    var matn = JSON.stringify(m.qur());
    turKeshQoy(matn, m.kesh);
    c.put(m.kesh + '_vaqt', String(Date.now()), 21600);
    return matn;
  } finally { c.remove(m.kesh + '_band'); }
}

/** Иловага жавоб: деярли доим кэшдан (дарҳол). Жадвал фақат кэш эскирганда ўқилади. */
function turMalumot(yangi, nom) {
  nom = nom || 'tur';
  var m = TUR_MANBA[nom], c = CacheService.getScriptCache(), tayyor = turKeshOl(m.kesh);
  var h = c.getAll([m.kesh + '_band', m.kesh + '_vaqt']);
  var band = h[m.kesh + '_band'], yosh = Date.now() - (+h[m.kesh + '_vaqt'] || 0);

  if (tayyor) {
    if (band) return tayyor;                              // ҳозир янгиланяпти — борини берамиз
    if (yangi ? yosh < 60000 : yosh < TUR.ESKI_SONIYA * 1000) return tayyor;
  } else if (band) {
    // Кэш бўш, лекин бошқа сўров аллақачон ўқияпти — иккинчи марта ўқимаймиз, кутамиз
    for (var i = 0; i < 25; i++) {
      Utilities.sleep(1000);
      tayyor = turKeshOl(m.kesh);
      if (tayyor) return tayyor;
    }
  }
  return turYangila_(nom);
}

/** Триггер ҳар 5 дақиқада чақиради — маълумотни олдиндан тайёрлаб қўяди */
function turIsit() {
  // Турон Клуб ва Форум олдиндан тайёрланади. Маркетинг жадвали катта — у фақат очилганда ўқилади.
  ['tur', 'for'].forEach(function (nom) {
    try {
      if (CacheService.getScriptCache().get(TUR_MANBA[nom].kesh + '_band')) return;   // олдинги ўқиш тугамаган
      turYangila_(nom);
    } catch (e) { Logger.log('turIsit ' + nom + ': ' + e); }
  });
}

/** БИР МАРТА ишга туширинг — 5 дақиқалик триггерни ўрнатади */
function turSozla() {
  var bor = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'turIsit'; });
  if (!bor) ScriptApp.newTrigger('turIsit').timeBased().everyMinutes(5).create();
  turIsit();
  var x = '✅ Тезлаштириш ' + (bor ? 'аллақачон ёқилган' : 'ёқилди') + ': маълумот ҳар 5 дақиқада олдиндан тайёрланади.';
  Logger.log(x);
  return x;
}

function turJavob(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function turHozir() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}


/* ══════════════════════════════════════════════════════════════
   ЁРДАМЧИЛАР
   ══════════════════════════════════════════════════════════════ */

function turNorm(s) {
  return String(s || '').toLowerCase()
    .replace(/ў/g, 'у').replace(/қ/g, 'к').replace(/ғ/g, 'г').replace(/ҳ/g, 'х')
    .replace(/ё/g, 'е').replace(/ъ|ь|'|`|’/g, '')
    .replace(/[\s ._\-%]/g, '');
}

function turMatn(v) { return String(v == null ? '' : v).replace(/[\s ]+/g, ' ').trim(); }

/** "117 652 100,00" → 117652100 */
function turSon(v) {
  if (typeof v === 'number') return isNaN(v) ? 0 : v;
  if (v instanceof Date) return 0;
  var s = String(v == null ? '' : v).replace(/[\s ]/g, '').replace(/[^\d.,\-]/g, '');
  if (!s) return 0;
  if (s.indexOf(',') !== -1 && s.indexOf('.') !== -1) {
    s = (s.lastIndexOf(',') > s.lastIndexOf('.')) ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (s.indexOf(',') !== -1) {
    s = (s.split(',')[1] || '').length === 3 ? s.replace(/,/g, '') : s.replace(',', '.');
  }
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function turSana(v) {
  if (!v) return '';
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var s = String(v).trim(), m;
  if ((m = s.match(/^(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})/)))
    return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)))
    return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  return '';
}

function turVaraq(nomlar) {
  var ss = SpreadsheetApp.openById(TUR.JADVAL_ID), barcha = ss.getSheets();
  for (var j = 0; j < nomlar.length; j++) {
    var t = turNorm(nomlar[j]);
    for (var k = 0; k < barcha.length; k++)
      if (turNorm(barcha[k].getName()) === t) return barcha[k];
  }
  return null;
}

/** Сарлавҳадаги устунларни номи бўйича топади: аввал аниқ, кейин ичидан */
function turUstunlar(sarlavha, xarita) {
  xarita = xarita || TUR_XARITA;
  var t = {};
  for (var kalit in xarita) {
    t[kalit] = -1;
    var v = xarita[kalit];
    for (var i = 0; i < sarlavha.length && t[kalit] === -1; i++) {
      var s = turNorm(sarlavha[i]); if (!s) continue;
      for (var j = 0; j < v.length; j++) if (s === turNorm(v[j])) { t[kalit] = i; break; }
    }
    for (var a = 0; a < sarlavha.length && t[kalit] === -1; a++) {
      var s2 = turNorm(sarlavha[a]); if (!s2) continue;
      for (var b = 0; b < v.length; b++) {
        var w = turNorm(v[b]);
        if (w.length > 3 && s2.indexOf(w) === 0) { t[kalit] = a; break; }
      }
    }
  }
  return t;
}


/* ══════════════════════════════════════════════════════════════
   ЎҚИШ
   ══════════════════════════════════════════════════════════════ */

function turSatrlar() {
  var sh = turVaraq(TUR.VARAQ) || SpreadsheetApp.openById(TUR.JADVAL_ID).getSheets()[0];
  var oxQ = sh.getLastRow(), oxU = sh.getLastColumn();
  if (oxQ < 2) return { satrlar: [], varaq: sh.getName() };

  var v = sh.getRange(1, 1, oxQ, oxU).getValues();

  // Сарлавҳа қаторини топамиз — «Аъзо» ёки «И.Ф.О.» турган қатор
  var sq = -1;
  for (var r = 0; r < Math.min(10, v.length) && sq < 0; r++)
    for (var c = 0; c < v[r].length; c++) {
      var n = turNorm(v[r][c]);
      if (n.indexOf('аъзо') === 0 || n.indexOf('азо') === 0 || n === 'ифо' || n === 'фио') { sq = r; break; }
    }
  if (sq < 0) throw new Error('Сарлавҳа топилмади: «Аъзо И.Ф.О.» устуни керак');

  var u = turUstunlar(v[sq]);
  if (u.fio < 0) throw new Error('«Аъзо И.Ф.О.» устуни топилмади');

  var out = [];
  for (var i = sq + 1; i < v.length; i++) {
    var q = v[i];
    // «Итого сумма» / «Жами» қатори — ўтказиб юборамиз
    var jamiQator = false;
    for (var k = 0; k < Math.min(q.length, 8); k++) {
      var t = turNorm(q[k]);
      if (t.indexOf('итого') === 0 || t.indexOf('жами') === 0 || t.indexOf('всего') === 0) { jamiQator = true; break; }
    }
    if (jamiQator) continue;

    var fio = turMatn(q[u.fio]);
    if (!fio) continue;

    out.push({
      sana:      u.sana      >= 0 ? turSana(q[u.sana])       : '',
      fio:       fio,
      shartnoma: u.shartnoma >= 0 ? turMatn(q[u.shartnoma])  : '',
      faoliyat:  u.faoliyat  >= 0 ? turMatn(q[u.faoliyat])   : '',
      usul:      u.usul      >= 0 ? turMatn(q[u.usul])       : '',
      firma:     u.firma     >= 0 ? turMatn(q[u.firma])      : '',
      summa:     u.summa     >= 0 ? turSon(q[u.summa])       : 0,
      davlat:    u.davlat    >= 0 ? turMatn(q[u.davlat])     : '',
      shahar:    u.shahar    >= 0 ? turMatn(q[u.shahar])     : ''
    });
  }
  return { satrlar: out, varaq: sh.getName(), ustunlar: u };
}

/** «План» варағи: План | Факт | Колди */
function turPlan(sotuvSoni) {
  var sh = turVaraq(TUR.PLAN);
  var o = { plan: 0, fakt: sotuvSoni, qoldi: 0, manba: 'hisob' };
  if (!sh || sh.getLastRow() < 2) { o.qoldi = Math.max(0, o.plan - o.fakt); return o; }
  var v = sh.getRange(1, 1, 2, Math.max(3, sh.getLastColumn())).getValues();
  for (var c = 0; c < v[0].length; c++) {
    var n = turNorm(v[0][c]);
    if (n === 'план' || n === 'plan' || n === 'режа') o.plan = turSon(v[1][c]);
    if (n === 'факт' || n === 'fakt') {
      // Варақдаги формула бўлса — ўшани оламиз, бўш бўлса ўзимиз санаймиз
      if (String(v[1][c]).trim() !== '') { o.fakt = turSon(v[1][c]); o.manba = 'varaq'; }
    }
  }
  o.qoldi = Math.max(0, o.plan - o.fakt);
  return o;
}

/* ══════════════════════════════════════════════════════════════
   ЎҚУВЧИЛАР — «Учрашув ҳисоботи»
   ══════════════════════════════════════════════════════════════ */

/** «10%» → 10 ;  0.1 (фоиз формат) → 10 */
function turFoiz(kor, xom) {
  var s = String(kor == null ? '' : kor).trim();
  if (!s && (xom === '' || xom == null)) return null;
  var m = s.match(/-?\d+(?:[.,]\d+)?/);
  if (m) {
    var n = parseFloat(m[0].replace(',', '.'));
    if (s.indexOf('%') === -1 && typeof xom === 'number' && xom <= 1) n = xom * 100;
    return Math.max(0, Math.min(100, n));
  }
  return null;
}

/** «B5:B9» → { r0: 4, c0: 1, nr: 5, nc: 1 } (0 дан бошлаб) */
function turA1_(a1) {
  var m = String(a1).replace(/^.*!/, '').replace(/\$/g, '').match(/^([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?$/);
  if (!m) return null;
  function ust(h) { var n = 0; for (var i = 0; i < h.length; i++) n = n * 26 + (h.charCodeAt(i) - 64); return n - 1; }
  var c0 = ust(m[1]), r0 = +m[2] - 1, c1 = m[3] ? ust(m[3]) : c0, r1 = m[4] ? +m[4] - 1 : r0;
  return { r0: r0, c0: c0, nr: r1 - r0 + 1, nc: c1 - c0 + 1 };
}

function turOquvchilar() {
  var ss = SpreadsheetApp.openById(TUR.OQ_JADVAL_ID), sh = null, barcha = ss.getSheets();
  for (var j = 0; j < TUR.OQ_VARAQ.length && !sh; j++)
    for (var k = 0; k < barcha.length; k++)
      if (turNorm(barcha[k].getName()) === turNorm(TUR.OQ_VARAQ[j])) { sh = barcha[k]; break; }
  if (!sh) sh = barcha[0];

  var oxQ = sh.getLastRow(), oxU = sh.getLastColumn();
  if (oxQ < 2) return [];
  var rng = sh.getRange(1, 1, oxQ, oxU);
  var v = rng.getValues(), kor = rng.getDisplayValues();

  // Бирлаштирилган катаклар: қиймат фақат юқори-чап катакда бўлади — бутун соҳага ёямиз
  // Ҳар соҳа учун БИТТА мурожаат (аввал 4 та эди) ва умумий вақт чегараси — жадвал катта бўлса ҳам осилмайди
  var mr = rng.getMergedRanges(), mv = Date.now();
  for (var mi = 0; mi < mr.length && Date.now() - mv < 15000; mi++) {
    var m = turA1_(mr[mi].getA1Notation());
    if (!m) continue;
    for (var r = m.r0; r < m.r0 + m.nr && r < v.length; r++)
      for (var c = m.c0; c < m.c0 + m.nc && c < v[r].length; c++) {
        if (r === m.r0 && c === m.c0) continue;
        v[r][c] = v[m.r0][m.c0]; kor[r][c] = kor[m.r0][m.c0];
      }
  }

  // Сарлавҳа — «Аъзо» турган қатор
  var sq = -1;
  for (var r1 = 0; r1 < Math.min(10, v.length) && sq < 0; r1++)
    for (var c1 = 0; c1 < v[r1].length; c1++)
      if (turNorm(v[r1][c1]).indexOf('азо') === 0) { sq = r1; break; }
  if (sq < 0) return [];
  var u = turUstunlar(v[sq], TUR_OQ_XARITA);
  if (u.fio < 0) return [];

  var out = [];
  for (var i = sq + 1; i < v.length; i++) {
    var q = v[i], fio = turMatn(q[u.fio]);
    if (!fio) continue;
    var o = {
      fio:    fio,
      haqida: u.haqida >= 0 ? turMatn(q[u.haqida]) : '',
      sana:   u.sana   >= 0 ? turSana(q[u.sana])   : '',
      xohish: u.xohish >= 0 ? String(q[u.xohish] == null ? '' : q[u.xohish]).trim() : '',
      nima:   u.nima   >= 0 ? String(q[u.nima]   == null ? '' : q[u.nima]).trim()   : '',
      masul:  u.masul  >= 0 ? turMatn(q[u.masul])  : '',
      muddat: u.muddat >= 0 ? turSana(q[u.muddat]) : '',
      holat:  u.holat  >= 0 ? turFoiz(kor[i][u.holat], q[u.holat]) : null,
      natija: u.natija >= 0 ? String(q[u.natija] == null ? '' : q[u.natija]).trim() : '',
      q: i + 1
    };
    // Фақат исм бор, бошқа ҳеч нарса йўқ — бўш қатор
    if (!o.sana && !o.xohish && !o.nima && !o.muddat && o.holat === null && !o.natija) continue;
    out.push(o);
  }
  return out;
}


/* ══════════════════════════════════════════════════════════════
   ДОЛЛАР КУРСИ — Марказий банк, 6 соатлик кэш
   ══════════════════════════════════════════════════════════════ */

function turKurs() {
  var c = CacheService.getScriptCache();
  try { var k = c.get('kurs'); if (k) return JSON.parse(k); } catch (e) {}

  // Охирги муваффақиятли курс хотирада туради — банк сайти жавоб бермаса шу ишлатилади
  var o = { usd: TUR.KURS_ZAXIRA, sana: '', manba: 'zaxira' };
  try { var es = JSON.parse(turOl('KURS') || 'null'); if (es && es.usd > 1000) o = { usd: es.usd, sana: es.sana || '', manba: 'cbu' }; } catch (e) {}

  // Банк сайтига соатига кўпи билан БИР МАРТА мурожаат қилинади (у осилиб қолса ҳам ҳамма сўров кутмайди)
  if (!c.get('kurs_urin')) {
    c.put('kurs_urin', '1', 3600);
    try {
      var r = UrlFetchApp.fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/', { muteHttpExceptions: true });
      var j = JSON.parse(r.getContentText());
      var x = Array.isArray(j) ? j[0] : j;
      var n = parseFloat(String(x.Rate).replace(',', '.'));
      if (n > 1000) {
        o = { usd: n, sana: String(x.Date || ''), manba: 'cbu' };
        try { turProp().setProperty('KURS', JSON.stringify(o)); } catch (e2) {}
      }
    } catch (e) {}
  }
  try { c.put('kurs', JSON.stringify(o), 21600); } catch (e) {}
  return o;
}

function turBaza() {
  var v0 = Date.now(), vaqt = {};
  function olch(nom) { vaqt[nom] = Date.now() - v0; v0 = Date.now(); }

  var s = turSatrlar();                                   olch('tolov');
  var plan = turPlan(s.satrlar.length);                   olch('plan');
  var oq = [];
  try { oq = turOquvchilar(); } catch (e) { oq = { xato: String(e.message || e) }; }
  olch('oquvchi');
  var kurs = turKurs();                                   olch('kurs');
  return {
    ok: true,
    versiya: TUR_VERSIYA,
    vaqt: turHozir(),
    sotuv: s.satrlar,
    plan: plan,
    oquvchi: Array.isArray(oq) ? oq : [],
    oquvchiXato: Array.isArray(oq) ? null : oq.xato,
    kurs: kurs,
    tashxis: { varaq: s.varaq, oqilgan: s.satrlar.length, vaqt: vaqt }
  };
}


/* ══════════════════════════════════════════════════════════════
   СИНОВ — Apps Script'да turSinov ни ишга туширинг
   ══════════════════════════════════════════════════════════════ */

function turSinovForum_() {
  var q = [], v0 = Date.now();
  function ust(u, xarita) {
    var yoq = [];
    for (var k in xarita) if (!(u[k] >= 0)) yoq.push(xarita[k][0]);
    return yoq.length ? '   ⚠ топилмаган устун: ' + yoq.join(', ') : '   ✓ ҳамма устун топилди';
  }
  try {
    var b = forBilet(), m = forMehmon(), k = forKelib();
    q.push('Билет:       ' + (b.varaq ? '«' + b.varaq + '» — ' + b.satrlar.length + ' та' : '❌ варақ топилмади'));
    if (b.varaq) q.push(ust(b.u, FOR_BILET));
    q.push('Таклифнома:  ' + (m.varaq ? '«' + m.varaq + '» — ' + m.satrlar.length + ' та' : '❌ варақ топилмади'));
    if (m.varaq) q.push(ust(m.u, FOR_MEHMON));
    q.push('Келиб тўлов: ' + (k.varaq ? '«' + k.varaq + '» — ' + k.satrlar.length + ' та' : '❌ варақ топилмади'));
    if (k.varaq) q.push(ust(k.u, FOR_KELIB));
    var d = 0, z = 0, ke = 0, qa = 0;
    b.satrlar.forEach(function (x) { d += x.dogovor; z += x.zaklad; ke += x.kelib; qa += x.qarz; });
    q.push('План: ' + FOR.PLAN + ' · факт ' + b.satrlar.length + ' · қолди ' + Math.max(0, FOR.PLAN - b.satrlar.length));
    q.push('Договор ' + d + ' · Заклад ' + z + ' · Келиб тўлаган ' + ke + ' · Қарз ' + qa + ' (' + FOR.VALYUTA + ')');
    q.push('Ўқиш вақти: ' + ((Date.now() - v0) / 1000).toFixed(1) + ' сония');
    q.push(b.satrlar.length ? '🎉 Форум тайёр' : '⚠ Билет ўқилмади');
  } catch (e) { q.push('❌ ' + e.message); }
  return q.join('\n');
}

function turSinovMark_() {
  var q = [], v0 = Date.now();
  var nom = { yangi: 'ЯНГИ', sifatsiz: 'СИФАТСИЗ', sotuv: 'СОТУВ', obrabotka: 'ОБРАБОТКА' };
  try {
    var t = mkOqi_().tashxis;
    q.push('Варақ: «' + t.varaq + '» — қатор ' + t.jamiQator + ', ўқилди ' + t.oqilgan +
           ' (бўш ' + t.boshQator + ', санасиз ' + t.sanasiz + ')');
    q.push('«sotuv bolbdi» устуни: ' + (t.sotuvUstuni ? t.sotuvUstuni + '-устун, белгиланган ' + t.bayroqli + ' та' : '❌ топилмади'));
    var g = t.guruhlar || {};
    q.push('Гуруҳлар: ' + ['yangi', 'sifatsiz', 'sotuv', 'obrabotka'].map(function (k) { return nom[k] + ' ' + (g[k] || 0); }).join(' · '));
    var tg = []; for (var k in t.targetlar) tg.push(k + ' ' + t.targetlar[k]);
    q.push('Таргетологлар: ' + tg.join(' · '));
    q.push('Стадиялар (қайси гуруҳга тушди):');
    t.stadiyalar.slice(0, 15).forEach(function (x) { q.push('   ' + x.soni + '  ' + nom[x.holat] + '  « ' + x.stadiya + ' »'); });
    q.push('Ўқиш вақти: ' + ((Date.now() - v0) / 1000).toFixed(1) + ' сония');
    q.push(t.oqilgan ? '🎉 Маркетинг тайёр' : '⚠ Лид ўқилмади');
  } catch (e) { q.push('❌ ' + e.message); }
  return q.join('\n');
}

function turSinov() {
  var q = [];
  try {
    var b = turBaza();
    q.push('Версия:   ' + TUR_VERSIYA);
    var tv = b.tashxis.vaqt || {};
    q.push('Ўқиш вақти (сония): тўловлар ' + (tv.tolov / 1000).toFixed(1) + ' · план ' + (tv.plan / 1000).toFixed(1) +
           ' · ўқувчилар ' + (tv.oquvchi / 1000).toFixed(1) + ' · курс ' + (tv.kurs / 1000).toFixed(1));
    q.push('Варақ:    «' + b.tashxis.varaq + '»');
    q.push('Аъзолар:  ' + b.sotuv.length + ' та');
    q.push('План:     ' + b.plan.plan + ' · факт ' + b.plan.fakt + ' · қолди ' + b.plan.qoldi +
           (b.plan.manba === 'varaq' ? '  (факт варақдан)' : '  (факт ҳисобланди)'));
    var jami = 0; b.sotuv.forEach(function (x) { jami += x.summa; });
    q.push('Жами тўлов: ' + jami.toLocaleString('ru-RU'));
    q.push('Курс:     1$ = ' + b.kurs.usd + ' сўм (' + (b.kurs.manba === 'cbu' ? 'Марказий банк ' + b.kurs.sana : 'захира') + ')');
    q.push('Ўқувчилар жадвали: ' + (b.oquvchiXato ? '❌ ' + b.oquvchiXato : b.oquvchi.length + ' та қатор'));
    q.push('');
    b.sotuv.slice(0, 5).forEach(function (x) {
      q.push('  ' + x.sana + ' · ' + x.fio + ' · ' + x.davlat + (x.shahar ? ' / ' + x.shahar : ''));
    });
    q.push('');
    var tk = turTokenYasa('azo', 'sinov');
    q.push(turTokenOch(tk.token) ? '✅ Кириш тизими ишлаяпти (имзо калити яратилган)' : '❌ Кириш тизимида хато');
    q.push(turKod('admin') ? '✅ Admin коди ўрнатилган' : '⚠ Admin коди қўйилмаган — TUR.KOD_ADMIN га 6 рақам ёзинг');
    q.push(turKod('azo')   ? '✅ Аъзолар коди ўрнатилган'
                           : '⚠ Аъзолар коди қўйилмаган — admin бўлиб кириб, «Назорат → Кодлар»дан қўйинг');
    q.push('');
    q.push(b.sotuv.length ? '🎉 Турон Клуб тайёр' : '⚠ Аъзо ўқилмади');
  } catch (e) {
    q.push('❌ ' + e.message);
  }
  q.push('');
  q.push('══════ ФОРУМ ══════');
  q.push(turSinovForum_());
  q.push('');
  q.push('══════ ФОРУМ МАРКЕТИНГ ══════');
  q.push(turSinovMark_());
  var x = q.join('\n');
  Logger.log(x);
  return x;
}


/* ╔════════════════════════════════════════════════════════════════════╗
   ║  ТУРОН КЛУБ ФОРУМ — «Турон клуб форум платформаси» жадвали          ║
   ║  (Forum.gs v1.2 дан кўчирилган; кириш — шу илованинг ўзиники)       ║
   ╚════════════════════════════════════════════════════════════════════╝ */

var FOR_VERSIYA = '1.2';

var FOR = {
  JADVAL_ID: '10gv_-vXvluX5nbcGujCZc67jF3Kojp6-iPHloPnoIKU',
  PLAN: 550,                 // Асосий план — фақат «Билет» (тўлов қилганлар)
  VALYUTA: '$',              // Договор / Заклад қайси валютада: '$' ёки 'сўм'
  KURS_ZAXIRA: 12600,        // VALYUTA = 'сўм' бўлса — доллар курси учун захира
  KESH_SONIYA: 300,

  BILET:  ['Билет', 'Билетлар'],
  MEHMON: ['Таклифнома', 'Таклифномалар', 'Меҳмонлар'],
  KELIB:  ['Келиб Тўлов қиладиганлар', 'Келиб тўлов қиладиганлар', 'Келиб тўлайдиганлар']
};

var FOR_BILET = {
  id:       ['ID', '№', 'Ид'],
  fio:      ['Исм фамилия', 'Исм фамилияси', 'Ф.И.О.', 'ФИО', 'Исм'],
  kiritgan: ['Ким киритган', 'Киритган'],
  dogovor:  ['Договор', 'Дагавор', 'Шартнома'],
  zaklad:   ['Заклад', 'Аванс', 'Олдиндан тўлов'],
  kelib:    ['Келиб тўлаган', 'Келиб тулаган'],
  qarz:     ['Қарз', 'Карз', 'Қарзи'],
  sana:     ['Сана', 'Дата'],
  oluvchi:  ['Тўловни ким олди', 'Тўловни олган', 'Ким олди']
};

var FOR_MEHMON = {
  id:       ['ID', '№', 'Ид'],
  fio:      ['Исм фамилия', 'Исм фамилияси', 'Ф.И.О.', 'ФИО', 'Исм'],
  kiritgan: ['Ким киритган', 'Киритган'],
  sana:     ['Сана', 'Дата']
};

var FOR_KELIB = {
  soni:     ['Сони', '№'],
  fio:      ['Исм фамилия', 'Исм фамилияси', 'Ф.И.О.', 'ФИО', 'Исм'],
  kurator:  ['Куратори', 'Куратор', 'Масъул']
};


function forHozir() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function forNorm(s) {
  return String(s || '').toLowerCase()
    .replace(/ў/g, 'у').replace(/қ/g, 'к').replace(/ғ/g, 'г').replace(/ҳ/g, 'х')
    .replace(/ё/g, 'е').replace(/ъ|ь|'|`|’/g, '')
    .replace(/[\s ._\-%]/g, '');
}

function forMatn(v) { return String(v == null ? '' : v).replace(/[\s ]+/g, ' ').trim(); }

function forDateMi(v) { return Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime()); }

/** "1 200,50" · "$100" · "-$575" → сон */
function forSon(v) {
  if (typeof v === 'number') return isNaN(v) ? 0 : v;
  if (forDateMi(v)) return 0;
  var s = String(v == null ? '' : v).replace(/[\s ]/g, '');
  var manfiy = /^-|^\(.*\)$/.test(s);
  s = s.replace(/[^\d.,]/g, '');
  if (!s) return 0;
  if (s.indexOf(',') !== -1 && s.indexOf('.') !== -1) {
    s = (s.lastIndexOf(',') > s.lastIndexOf('.')) ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (s.indexOf(',') !== -1) {
    s = (s.split(',')[1] || '').length === 3 ? s.replace(/,/g, '') : s.replace(',', '.');
  }
  var n = parseFloat(s);
  return isNaN(n) ? 0 : (manfiy ? -n : n);
}

/** Сана ва вақт: {sana:'2026-10-06', vaqt:'15:45'} */
function forSana(v) {
  var tz = Session.getScriptTimeZone();
  if (!v) return { sana: '', vaqt: '' };
  if (forDateMi(v)) {
    var vq = Utilities.formatDate(v, tz, 'HH:mm');
    return { sana: Utilities.formatDate(v, tz, 'yyyy-MM-dd'), vaqt: vq === '00:00' ? '' : vq };
  }
  var s = String(v).trim(), m, sana = '';
  if ((m = s.match(/^(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})/)))
    sana = m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  else if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)))
    sana = m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  var t = s.match(/(\d{1,2}):(\d{2})/);
  return { sana: sana, vaqt: t ? ('0' + t[1]).slice(-2) + ':' + t[2] : '' };
}

function forVaraq(nomlar) {
  var barcha = SpreadsheetApp.openById(FOR.JADVAL_ID).getSheets();
  for (var j = 0; j < nomlar.length; j++) {
    var t = forNorm(nomlar[j]);
    for (var k = 0; k < barcha.length; k++)
      if (forNorm(barcha[k].getName()) === t) return barcha[k];
  }
  // Номи бир оз бошқача бўлса — бошланиши бўйича
  for (var a = 0; a < nomlar.length; a++) {
    var w = forNorm(nomlar[a]).slice(0, 6);
    for (var b = 0; b < barcha.length; b++)
      if (forNorm(barcha[b].getName()).indexOf(w) === 0) return barcha[b];
  }
  return null;
}

/** Сарлавҳадаги устунларни номи бўйича топади: аввал аниқ, кейин бошланиши */
function forUstunlar(sarlavha, xarita) {
  var t = {}, band = {};
  for (var kalit in xarita) {
    t[kalit] = -1;
    var v = xarita[kalit];
    for (var j = 0; j < v.length && t[kalit] === -1; j++)
      for (var i = 0; i < sarlavha.length; i++)
        if (!band[i] && forNorm(sarlavha[i]) && forNorm(sarlavha[i]) === forNorm(v[j])) { t[kalit] = i; break; }
    for (var b = 0; b < v.length && t[kalit] === -1; b++) {
      var w = forNorm(v[b]); if (w.length <= 3) continue;
      for (var a = 0; a < sarlavha.length; a++)
        if (!band[a] && forNorm(sarlavha[a]).indexOf(w) === 0) { t[kalit] = a; break; }
    }
    if (t[kalit] >= 0) band[t[kalit]] = 1;
  }
  return t;
}

/** Варақни ўқийди: сарлавҳа — «Исм» турган қатор (биринчи 10 қатордан) */
function forOqi(nomlar, xarita) {
  var sh = forVaraq(nomlar);
  if (!sh) return { satrlar: [], u: {}, varaq: null, sq: -1, v: [] };
  var oxQ = sh.getLastRow(), oxU = sh.getLastColumn();
  if (oxQ < 1 || oxU < 1) return { satrlar: [], u: {}, varaq: sh.getName(), sq: -1, v: [] };
  var v = sh.getRange(1, 1, oxQ, oxU).getValues();
  var sq = -1;
  for (var r = 0; r < Math.min(10, v.length) && sq < 0; r++)
    for (var c = 0; c < v[r].length; c++)
      if (forNorm(v[r][c]).indexOf('исм') === 0) { sq = r; break; }
  if (sq < 0) return { satrlar: [], u: {}, varaq: sh.getName(), sq: -1, v: v };
  return { u: forUstunlar(v[sq], xarita), varaq: sh.getName(), sq: sq, v: v };
}

function forJamiMi(q) {
  for (var k = 0; k < Math.min(q.length, 6); k++) {
    var t = forNorm(q[k]);
    if (t.indexOf('итого') === 0 || t.indexOf('жами') === 0 || t.indexOf('всего') === 0) return true;
  }
  return false;
}

function forOl(q, i) { return i >= 0 ? q[i] : ''; }


/* ══════════════════════════════════════════════════════════════
   ЎҚИШ
   ══════════════════════════════════════════════════════════════ */

function forBilet() {
  var o = forOqi(FOR.BILET, FOR_BILET), u = o.u, out = [];
  if (o.sq < 0) return { satrlar: out, varaq: o.varaq, u: u };
  for (var i = o.sq + 1; i < o.v.length; i++) {
    var q = o.v[i];
    if (forJamiMi(q)) continue;
    var fio = forMatn(forOl(q, u.fio));
    if (!fio) continue;
    var s = forSana(forOl(q, u.sana));
    var dog = forSon(forOl(q, u.dogovor)), zak = forSon(forOl(q, u.zaklad)), kel = forSon(forOl(q, u.kelib));
    // Қарз доим ҳисобланади: Договор − Заклад − Келиб тўлаган (жадвалдаги «Қарз» устунига ишонилмайди)
    var qarz = Math.max(0, dog - zak - kel);
    out.push({
      id: forMatn(forOl(q, u.id)),
      fio: fio,
      kiritgan: forMatn(forOl(q, u.kiritgan)),
      dogovor: dog, zaklad: zak, kelib: kel, qarz: qarz,
      sana: s.sana, vaqt: s.vaqt,
      oluvchi: forMatn(forOl(q, u.oluvchi))
    });
  }
  return { satrlar: out, varaq: o.varaq, u: u };
}

function forMehmon() {
  var o = forOqi(FOR.MEHMON, FOR_MEHMON), u = o.u, out = [];
  if (o.sq < 0) return { satrlar: out, varaq: o.varaq, u: u };
  for (var i = o.sq + 1; i < o.v.length; i++) {
    var q = o.v[i];
    if (forJamiMi(q)) continue;
    var fio = forMatn(forOl(q, u.fio));
    if (!fio) continue;
    var s = forSana(forOl(q, u.sana));
    out.push({ id: forMatn(forOl(q, u.id)), fio: fio, kiritgan: forMatn(forOl(q, u.kiritgan)),
               sana: s.sana, vaqt: s.vaqt });
  }
  return { satrlar: out, varaq: o.varaq, u: u };
}

function forKelib() {
  var o = forOqi(FOR.KELIB, FOR_KELIB), u = o.u, out = [];
  if (o.sq < 0) return { satrlar: out, varaq: o.varaq, u: u };
  for (var i = o.sq + 1; i < o.v.length; i++) {
    var q = o.v[i];
    if (forJamiMi(q)) continue;
    var fio = forMatn(forOl(q, u.fio));
    if (!fio) continue;               // «Куратори» рўйхати бўш қаторларда ҳам бор — исмсизни ташлаймиз
    out.push({ fio: fio, kurator: forMatn(forOl(q, u.kurator)) });
  }
  return { satrlar: out, varaq: o.varaq, u: u };
}


/* ══════════════════════════════════════════════════════════════
   ДОЛЛАР КУРСИ — фақат VALYUTA = 'сўм' бўлса керак
   ══════════════════════════════════════════════════════════════ */

function forKurs() {
  var c = CacheService.getScriptCache();
  try { var k = c.get('forum_kurs'); if (k) return JSON.parse(k); } catch (e) {}
  var o = { usd: FOR.KURS_ZAXIRA, sana: '', manba: 'zaxira' };
  try {
    var r = UrlFetchApp.fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/', { muteHttpExceptions: true });
    var j = JSON.parse(r.getContentText());
    var x = Array.isArray(j) ? j[0] : j;
    var n = parseFloat(String(x.Rate).replace(',', '.'));
    if (n > 1000) o = { usd: n, sana: String(x.Date || ''), manba: 'cbu' };
  } catch (e) {}
  try { c.put('forum_kurs', JSON.stringify(o), o.manba === 'cbu' ? 21600 : 600); } catch (e) {}
  return o;
}

function forBaza() {
  var b = forBilet(), m = forMehmon(), k = forKelib();
  return {
    ok: true,
    versiya: FOR_VERSIYA,
    vaqt: forHozir(),
    valyuta: FOR.VALYUTA,
    bilet: b.satrlar,
    mehmon: m.satrlar,
    kelib: k.satrlar,
    plan: { plan: FOR.PLAN, fakt: b.satrlar.length, qoldi: Math.max(0, FOR.PLAN - b.satrlar.length) },
    kurs: FOR.VALYUTA === 'сўм' ? forKurs() : null,
    tashxis: { bilet: b.varaq, mehmon: m.varaq, kelib: k.varaq }
  };
}


/* ╔════════════════════════════════════════════════════════════════════╗
   ║  ТУРОН ФОРУМ МАРКЕТИНГ — «Marketing RBA 15» жадвали, «Турон форум»  ║
   ║  варағи (Marketing.gs v3.3 дан кўчирилган; фақат форум варағи)       ║
   ╚════════════════════════════════════════════════════════════════════╝ */

var MK_VERSIYA = '3.3';

var MK_SOZLAMA = {
  // «Marketing RBA 15» жадвали: ҳаволани ТЎЛИҚ қўйинг (браузер манзил қаторидан нусха олиб) —
  // скрипт ичидан ID ни ўзи ажратиб олади. Фақат ID қўйса ҳам бўлади.
  JADVAL_ID: 'https://docs.google.com/spreadsheets/d/1hzGb1Fg4EzW9nXDNU7AfFFB4HI1HIebW6BPIvyKDnm0/edit?gid=0#gid=0',
  VARAQLAR: ['3 кунлик', '3кунлик', '3 kunlik'],
  // v3.1: бошқа варақлар
  VARAQ_TUR: {
    forum: ['Турон форум', 'Турон Форум', 'Turon forum', 'Турон клуб форум'],
    uy:    ['Уй', 'Uy', 'Уй маркетинг']
  },
  KESH_SONIYA: 600,
  MAX_YOZUV: 40000
};

/* ── ТАРГЕТОЛОГЛАР — «Название» устунидан ────────────────────
   Бўшлиқ, катта-кичик ҳарф, ё/е фарқи аҳамиятсиз. */
var MK_TARGET = [
  { nom: 'Элёр',   kalit: ['элёртаргет', 'элертаргет', 'элёр', 'элер'] },
  { nom: 'Гавхар', kalit: ['гавхартаргет', 'гавҳартаргет', 'гавхар', 'гавҳар'] }
];

/* ── МАНБА бўйича таргетолог — «Источник» устунидан ── */
var MK_MANBA_TARGET = [
  { nom: 'ilhombegimqulov.uz', kalit: ['ilhombegimqulov', 'илхомбегимкулов'] }
];

var MK_BOSHQA = 'Бошқалар';

/* ── v3.2: «Турон форум» ва «Уй» варақлари учун таргетологлар ──
   «Название» устуни ичидан изланади. ТАРТИБ МУҲИМ: аввал аниқроғи (Махмуд, Инстаграм),
   кейин умумийси (Элёр Таргет) — акс ҳолда «Элёр Таргет Инстаграм» ҳам «Элёр Таргет»га тушади.
   Калит массив бўлса — ҳаммаси бирга бўлиши шарт: ['элер','инстаграм']. */
var MK_TARGET_TUR = {
  forum: [
    { nom: 'Махмуд Медиа',          kalit: ['махмудмедиа', 'mahmudmedia', 'махмуд', 'mahmud'] },
    { nom: 'Элёр Таргет Инстаграм', kalit: [['элер', 'инстаграм'], ['элер', 'instagram'], ['elyor', 'instagram']] },
    { nom: 'Элёр Таргет',           kalit: ['элертаргет', 'элертагет', 'элер', 'elyor'] }
  ],
  uy: [
    { nom: 'Махмуд Медиа',          kalit: ['махмудмедиа', 'mahmudmedia', 'махмуд', 'mahmud'] },
    { nom: 'Элёр Таргет Инстаграм', kalit: [['элер', 'инстаграм'], ['элер', 'instagram'], ['elyor', 'instagram']] },
    { nom: 'Элёр Таргет',           kalit: ['элертаргет', 'элертагет', 'элер', 'elyor'] }
  ]
};
function mkKalitMos_(n, k) {
  if (Array.isArray(k)) { for (var i = 0; i < k.length; i++) if (n.indexOf(k[i]) === -1) return false; return true; }
  return n.indexOf(k) !== -1;
}

/* ── СТАДИЯЛАР. Рўйхатда йўғи — «обработка» ── */
var MK_STADIYA = {
  yangi:    ['Маркетинг новие лид', 'янги лид', 'Янги лид', 'Маркетинг новый лид'],
  sifatsiz: ['База', 'Сделка провалена', 'Онлине йоки Бизнеси йок',
             'Онлайн йоки Бизнеси йок', 'Онлине ёки Бизнеси йўқ'],
  /* СОТУВ стадиялари — Bitrix канбандаги устунлар.
     Рақами ўзгарса ҳам ишлайди: «Тошкент 15», «Тошкент 16» — барибир сотув,
     чунки НОМ БОШЛАНИШИ бўйича солиштирилади. */
  sotuv:    ['Онлайн интенсив', 'Онлине интенсив',
             'Шымкент', 'Шимкент',
             'Ош',
             'Самарканд', 'Самарқанд',
             'Фаргона', 'Фарғона',
             'Хужанд', 'Худжанд', 'Хўжанд',
             'Тошкент',
             'Россия', 'Русия',
             'Туркманистон', 'Туркменистан', 'Туркмания']
};


/* ── v3.1: «Турон форум» ва «Уй» стадиялари ──
   Bitrix'да бошқа воронка — стадиялари бошқача.
   «sotuv bolbdi» устунига 1 қўйилса — стадиядан қатъи назар СОТУВ.
   «Кўтармади» панелда ўзи сифатсизга ўтказилади. */
var MK_STADIYA_TUR = {
  forum: {
    yangi:    ['Новая', 'Новый', 'Новый лид', 'Маркетинг новие лид', 'Янги лид'],
    sifatsiz: ['Сделка провалена', 'База', 'Кутармади', 'Кўтармади', 'Котармади',
               'Онлайн йоки Бизнеси йок', 'Онлине йоки Бизнеси йок', 'Бизнеси йок', 'Бизнеси йўқ'],
    sotuv:    ['Сделка успешна', 'Успешная сделка', 'Успешно', 'Билет олди', 'Билет сотилди',
               'Тулов килди', 'Тўлов қилди', 'Тулади', 'Тўлади', 'Оплачено', 'Сотилди']
  },
  uy: {
    yangi:    ['Новая', 'Новый', 'Новый лид', 'Маркетинг новие лид', 'Янги лид'],
    sifatsiz: ['Сделка провалена', 'База', 'Кутармади', 'Кўтармади',
               'Онлайн йоки Бизнеси йок', 'Бизнеси йок', 'Бизнеси йўқ'],
    sotuv:    ['Сделка успешна', 'Успешная сделка', 'Успешно', 'Тулов килди', 'Тўлов қилди',
               'Оплачено', 'Сотилди']
  }
};

/** Жорий сўров қайси варақ учун: 'asosiy' | 'forum' | 'uy' */
var MK_TUR = 'forum';            // иловада фақат «Турон форум» варағи
function mkSt_() { return MK_TUR === 'asosiy' ? MK_STADIYA : MK_STADIYA_TUR[MK_TUR]; }
function mkTurOl_(v) { return (v === 'forum' || v === 'uy') ? v : 'asosiy'; }
function mkKeshKalit_() { return MK_TUR === 'asosiy' ? 'mk2_' : (MK_TUR === 'forum' ? 'mkf_' : 'mku_'); }

function mkHozir_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function mkPaket_(satrlar, maydon, lugatli) {
  var lug = {}, xar = {};
  lugatli.forEach(function (m) { lug[m] = []; xar[m] = {}; });

  var q = satrlar.map(function (o) {
    var r = [];
    for (var i = 0; i < maydon.length; i++) {
      var m = maydon[i], v = o[m];
      if (lugatli.indexOf(m) >= 0) {
        var s = String(v == null ? '' : v);
        if (xar[m][s] === undefined) { xar[m][s] = lug[m].length; lug[m].push(s); }
        r.push(xar[m][s]);
      } else if (typeof v === 'boolean') r.push(v ? 1 : 0);
      else if (typeof v === 'number') r.push(v);
      else r.push(v == null ? '' : v);
    }
    return r;
  });

  return { m: maydon, lug: lug, lugM: lugatli, q: q };
}

function mkOxirgiQator_(sh, ustun) {
  var n = sh.getLastRow();
  if (n < 2) return 1;
  var v = sh.getRange(1, ustun, n, 1).getValues();
  for (var i = v.length - 1; i >= 1; i--)
    if (String(v[i][0]).trim() !== '') return i + 1;
  return 1;
}

/* ══════════════════════════════════════════════════════════════
   ЁРДАМЧИЛАР
   ══════════════════════════════════════════════════════════════ */

function mkNorm_(s) {
  return String(s == null ? '' : s).toLowerCase()
    .replace(/ў/g, 'у').replace(/қ/g, 'к').replace(/ғ/g, 'г').replace(/ҳ/g, 'х')
    .replace(/ё/g, 'е').replace(/й/g, 'и').replace(/ъ|ь|'|`|’/g, '')
    .replace(/[\s\u00a0._\-]/g, '');
}

function mkMatn_(v) {
  return String(v == null ? '' : v).replace(/[\s\u00a0]+/g, ' ').trim();
}

function mkSana_(v) {
  if (!v) return '';
  if (v instanceof Date)
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var s = String(v).trim(), m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)))
    return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  if ((m = s.match(/^(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})/)))
    return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  return '';
}

/** Лид қайси таргетологники */
function mkTarget_(nomi, manba) {
  var n = mkNorm_(nomi);
  var royxat = (MK_TUR !== 'asosiy' && MK_TARGET_TUR[MK_TUR]) ? MK_TARGET_TUR[MK_TUR] : MK_TARGET;
  for (var i = 0; i < royxat.length; i++)
    for (var j = 0; j < royxat[i].kalit.length; j++)
      if (mkKalitMos_(n, royxat[i].kalit[j])) return royxat[i].nom;

  if (MK_TUR !== 'asosiy') return MK_BOSHQA;      // форум/уй: манба (turonclub.uz) таргетолог эмас
  var m = mkNorm_(manba);
  for (var a = 0; a < MK_MANBA_TARGET.length; a++)
    for (var b = 0; b < MK_MANBA_TARGET[a].kalit.length; b++)
      if (m.indexOf(MK_MANBA_TARGET[a].kalit[b]) !== -1) return MK_MANBA_TARGET[a].nom;

  return MK_BOSHQA;
}

/**
 * Стадия қайси гуруҳга киради.
 * Аввал аниқ мослик, кейин БОШЛАНИШИ бўйича («Тошкент 15» → «Тошкент»).
 * ⚠ Ичидан излаш мумкин эмас: «тошкент» ичида «ош» бор.
 */
function mkHolat_(stadiya) {
  var s = mkNorm_(stadiya);
  if (!s) return 'obrabotka';

  var tartib = ['yangi', 'sifatsiz', 'sotuv'], g, l, i;

  for (g = 0; g < tartib.length; g++) {
    l = mkSt_()[tartib[g]];
    for (i = 0; i < l.length; i++)
      if (s === mkNorm_(l[i])) return tartib[g];
  }

  for (g = 0; g < tartib.length; g++) {
    l = mkSt_()[tartib[g]];
    for (i = 0; i < l.length; i++) {
      var k = mkNorm_(l[i]);
      // «Ош» 2 ҳарф — шунинг учун чегара 2. Бошланиши текширилгани учун
      // «тошкент15» «ош»га мос келмайди, хавфсиз.
      if (k.length >= 2 && s.indexOf(k) === 0) return tartib[g];
    }
  }

  return 'obrabotka';
}

/** «sotuv bolbdi» катакчаси сотувни билдирадими */
function mkBayroq_(v) {
  if (v === true) return true;
  if (typeof v === 'number') return v > 0;
  var s = mkNorm_(v);
  if (!s) return false;
  return s === '1' || s === 'true' || s === 'ха' || s === 'ha' ||
         s === 'yes' || s === 'да' || s === 'sotuv' || s === 'сотув';
}

var MK_XARITA = {
  sana:    ['Дата начала', 'Сана', 'Дата'],
  nomi:    ['Название', 'Номи', 'Наименование'],
  manba:   ['Источник', 'Манба'],
  stadiya: ['Стадия сделки', 'Стадия'],
  menejer: ['Ответственный', 'Менеджер', 'Масъул'],
  // Сиз ўзингиз белгилайдиган устун — 1 бўлса сотув
  sotuvB:  ['sotuv bolbdi', 'sotuv boldi', 'sotuv bo\'ldi', 'sotuv',
            'Сотув булди', 'Сотув бўлди', 'Сотув']
};

function mkUstunlar_(sarlavha, xarita) {
  var t = {};
  for (var kalit in xarita) {
    t[kalit] = -1;
    var v = xarita[kalit];
    for (var i = 0; i < sarlavha.length && t[kalit] === -1; i++) {
      var s = mkNorm_(sarlavha[i]);
      if (!s) continue;
      for (var j = 0; j < v.length; j++)
        if (s === mkNorm_(v[j])) { t[kalit] = i; break; }
    }
    for (var a = 0; a < sarlavha.length && t[kalit] === -1; a++) {
      var s2 = mkNorm_(sarlavha[a]);
      if (!s2) continue;
      for (var b = 0; b < v.length; b++) {
        var x = mkNorm_(v[b]);
        if (x.length > 4 && s2.indexOf(x) !== -1) { t[kalit] = a; break; }
      }
    }
  }
  return t;
}

/** JADVAL_ID тўлиқ ҳавола бўлса — ичидан ID ни ажратади */
function mkJadvalId_() {
  var v = String(MK_SOZLAMA.JADVAL_ID || '').trim(), m = v.match(/\/d\/([a-zA-Z0-9_-]+)/);
  var id = m ? m[1] : v;
  if (!id || v.indexOf('БУ_ЕРГА') >= 0 || (!m && v.indexOf('/') >= 0))
    throw new Error('JADVAL_ID қўйилмаган: скриптдаги MK_SOZLAMA.JADVAL_ID га «Marketing RBA 15» жадвали ҳаволасини қўйинг');
  return id;
}

function mkVaraq_() {
  var barcha = SpreadsheetApp.openById(mkJadvalId_()).getSheets();
  var izla = MK_TUR === 'asosiy' ? MK_SOZLAMA.VARAQLAR : MK_SOZLAMA.VARAQ_TUR[MK_TUR];
  for (var j = 0; j < izla.length; j++) {
    var t = mkNorm_(izla[j]);
    for (var k = 0; k < barcha.length; k++)
      if (mkNorm_(barcha[k].getName()) === t) return barcha[k];
  }
  var nomlar = barcha.map(function (s) { return s.getName(); });
  throw new Error('«' + izla[0] + '» варағи топилмади. Жадвалдагилари: ' + nomlar.join(', '));
}


/* ══════════════════════════════════════════════════════════════
   ЎҚИШ
   ══════════════════════════════════════════════════════════════ */

function mkOqi_() {
  var sh = mkVaraq_();
  var oxU = sh.getLastColumn();
  var sarlavha = sh.getRange(1, 1, 1, oxU).getValues()[0];
  var u = mkUstunlar_(sarlavha, MK_XARITA);

  var yoq = [];
  ['sana', 'stadiya'].forEach(function (k) { if (u[k] < 0) yoq.push(k); });
  if (yoq.length) throw new Error('Мажбурий устун топилмади: ' + yoq.join(', '));

  var oxQ = mkOxirgiQator_(sh, u.sana + 1);
  if (oxQ < 2) return { lidlar: [], tashxis: { varaq: sh.getName(), jamiQator: 0 } };

  var v = sh.getRange(1, 1, oxQ, oxU).getValues();

  var r = [], stadiyaSanoq = {}, targetSanoq = {}, manbaSanoq = {};
  var bosh = 0, sanasiz = 0, bayroqli = 0;

  for (var i = 1; i < v.length; i++) {
    var st = mkMatn_(u.stadiya >= 0 ? v[i][u.stadiya] : '');
    var nm = mkMatn_(u.nomi    >= 0 ? v[i][u.nomi]    : '');
    var mb = mkMatn_(u.manba   >= 0 ? v[i][u.manba]   : '');
    var sn = mkSana_(v[i][u.sana]);

    if (!st && !nm && !mb && !sn) { bosh++; continue; }
    if (!sn) { sanasiz++; continue; }

    var holat = mkHolat_(st);

    // «sotuv bolbdi» устуни ҳамма нарсадан устун туради
    if (u.sotuvB >= 0 && mkBayroq_(v[i][u.sotuvB])) { holat = 'sotuv'; bayroqli++; }

    var target = mkTarget_(nm, mb);

    if (st) {
      if (!stadiyaSanoq[st]) stadiyaSanoq[st] = { soni: 0, holat: holat };
      stadiyaSanoq[st].soni++;
      if (holat === 'sotuv') stadiyaSanoq[st].holat = 'sotuv';
    }
    targetSanoq[target] = (targetSanoq[target] || 0) + 1;
    if (mb) manbaSanoq[mb] = (manbaSanoq[mb] || 0) + 1;

    r.push({
      sana: sn, target: target, manba: mb, stadiya: st, holat: holat,
      menejer: u.menejer >= 0 ? mkMatn_(v[i][u.menejer]) : ''
    });
  }

  if (r.length > MK_SOZLAMA.MAX_YOZUV) r = r.slice(r.length - MK_SOZLAMA.MAX_YOZUV);

  var stRoyxat = [];
  for (var s2 in stadiyaSanoq)
    stRoyxat.push({ stadiya: s2, soni: stadiyaSanoq[s2].soni, holat: stadiyaSanoq[s2].holat });
  stRoyxat.sort(function (a, b) { return b.soni - a.soni; });

  var mbRoyxat = [];
  for (var m2 in manbaSanoq) mbRoyxat.push({ manba: m2, soni: manbaSanoq[m2] });
  mbRoyxat.sort(function (a, b) { return b.soni - a.soni; });

  // Гуруҳлар ҳақиқий ёзувлардан саналади (байроқ ҳисобга олинган ҳолда)
  var guruhlar = { yangi: 0, sifatsiz: 0, sotuv: 0, obrabotka: 0 };
  r.forEach(function (x) { guruhlar[x.holat] = (guruhlar[x.holat] || 0) + 1; });

  return {
    lidlar: r,
    tashxis: {
      versiya: MK_VERSIYA, varaq: sh.getName(), jamiQator: oxQ - 1,
      boshQator: bosh, sanasiz: sanasiz, oqilgan: r.length,
      sotuvUstuni: u.sotuvB >= 0 ? (u.sotuvB + 1) : 0,
      bayroqli: bayroqli, guruhlar: guruhlar,
      stadiyalar: stRoyxat, manbalar: mbRoyxat.slice(0, 20), targetlar: targetSanoq,
      sarlavha: sarlavha.map(function (x) { return mkMatn_(x); })
                        .filter(function (x) { return x; })
    }
  };
}

function mkBaza_() {
  var o = mkOqi_();
  var targetlar = [];
  for (var t in o.tashxis.targetlar) targetlar.push(t);

  return {
    ok: true,
    versiya: MK_VERSIYA,
    vaqt: mkHozir_(),
    lidlarP: mkPaket_(o.lidlar,
      ['sana', 'target', 'manba', 'stadiya', 'holat', 'menejer'],
      ['sana', 'target', 'manba', 'stadiya', 'holat', 'menejer']),
    targetlar: targetlar.sort(),
    tashxis: o.tashxis
  };
}

