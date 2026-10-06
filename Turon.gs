/**
 * ╔════════════════════════════════════════════════════════════════════╗
 * ║  TURON CLUB — МУСТАҚИЛ ИЛОВА СЕРВЕРИ                    v1.5        ║
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

var TUR_VERSIYA = '1.5';

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

    return ContentService.createTextOutput(turMalumot(p.yangi === '1')).setMimeType(ContentService.MimeType.JSON);

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
function turKeshQoy(matn) {
  var n = Math.ceil(matn.length / 45000), o = { tur3_n: String(n) };
  for (var i = 0; i < n; i++) o['tur3_' + i] = matn.substr(i * 45000, 45000);
  CacheService.getScriptCache().putAll(o, TUR.KESH_SONIYA);
}

function turKeshOl() {
  var c = CacheService.getScriptCache(), n = +c.get('tur3_n');
  if (!n) return null;
  var k = [], s = '';
  for (var i = 0; i < n; i++) k.push('tur3_' + i);
  var h = c.getAll(k);
  for (var j = 0; j < n; j++) { if (h[k[j]] == null) return null; s += h[k[j]]; }
  return s;
}

/**
 * Жадвалларни ўқиб, тайёр жавобни кэшга қўяди.
 * Бир вақтда фақат БИТТА ўқиш кетади: «tur_band» белгиси турганда бошқалар кутади.
 * (Аввал ҳар «Янгилаш» ва ҳар қайта уриниш алоҳида ўқиш бошларди — улар устма-уст
 *  тўпланиб, бутун скриптни секинлаштирарди.)
 */
function turYangila_() {
  var c = CacheService.getScriptCache();
  c.put('tur_band', '1', 240);
  try {
    var matn = JSON.stringify(turBaza());
    turKeshQoy(matn);
    c.put('tur_vaqt', String(Date.now()), 21600);
    return matn;
  } finally { c.remove('tur_band'); }
}

/** Иловага жавоб: деярли доим кэшдан (дарҳол). Жадвал фақат кэш эскирганда ўқилади. */
function turMalumot(yangi) {
  var c = CacheService.getScriptCache(), tayyor = turKeshOl();
  var h = c.getAll(['tur_band', 'tur_vaqt']);
  var yosh = Date.now() - (+h['tur_vaqt'] || 0);

  if (tayyor) {
    if (h['tur_band']) return tayyor;                     // ҳозир янгиланяпти — борини берамиз
    if (yangi ? yosh < 60000 : yosh < TUR.ESKI_SONIYA * 1000) return tayyor;
  } else if (h['tur_band']) {
    // Кэш бўш, лекин бошқа сўров аллақачон ўқияпти — иккинчи марта ўқимаймиз, кутамиз
    for (var i = 0; i < 25; i++) {
      Utilities.sleep(1000);
      tayyor = turKeshOl();
      if (tayyor) return tayyor;
    }
  }
  return turYangila_();
}

/** Триггер ҳар 5 дақиқада чақиради — маълумотни олдиндан тайёрлаб қўяди */
function turIsit() {
  try {
    if (CacheService.getScriptCache().get('tur_band')) return;   // олдинги ўқиш ҳали тугамаган
    turYangila_();
  } catch (e) { Logger.log('turIsit: ' + e); }
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
    q.push(b.sotuv.length ? '🎉 Тайёр — энди деплой қилинг' : '⚠ Аъзо ўқилмади');
  } catch (e) {
    q.push('❌ ' + e.message);
  }
  var x = q.join('\n');
  Logger.log(x);
  return x;
}
