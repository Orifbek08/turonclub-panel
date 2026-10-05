/**
 * ╔════════════════════════════════════════════════════════════════════╗
 * ║  TURON CLUB — МУСТАҚИЛ ИЛОВА СЕРВЕРИ                    v1.0        ║
 * ║  Кириш (код) + маълумот — ҳаммаси битта скриптда.                   ║
 * ║  Жадвалларни фақат ЎҚИЙДИ, ҳеч нарса ёзмайди.                       ║
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
 *  3. Пастдаги TUR.KOD га ўз 6 рақамли кодингизни ёзинг → Ctrl+S
 *  4. turSinov ни ишга туширинг → рухсат беринг → ✅ лар чиқиши керак
 *  5. Развернуть → Новое развертывание → Веб-приложение
 *        Выполнять от имени:  Я
 *        У кого есть доступ:  ВСЕ
 *  6. Чиққан …/exec ҳаволасини index.html даги API_TURON га қўйинг
 *
 * ═══ КОДНИ АЛМАШТИРИШ ═══
 *  TUR.KOD ни ўзгартиринг → Ctrl+S → Управление развертываниями → ✏ → Новая версия.
 *  Ҳаммани қайта киритиш учун: turHammaChiqsin ни ишга туширинг.
 *
 * ═══ ЖАДВАЛЛАР ═══
 *  «Клуб тўловлари маълумотлари»
 *     Тўлов маълумотлари:  № | Аъзо И.Ф.О. | Шартнома рақами | Сана | Фаолият тури |
 *                          Тўлов усули | Фирма номи | Тўланган сумма 100 % | Давлати | Шаҳар
 *     План:                План | Факт | Колди
 *  «Учрашув ҳисоботи»
 *     Аъзолар ҳисоботи:    № | Учрашув санаси | Аъзо Ф.И.Ш. | Хоҳиш / сўров |
 *                          Нима қилиш керак | Масъул | Муддат | Ҳолати % да | Натижа
 *  Устун ТАРТИБИ муҳим эмас — сарлавҳа НОМИ бўйича топилади.
 *  Доллар курси — Марказий банк (cbu.uz), 6 соатда бир янгиланади.
 */

var TUR_VERSIYA = '1.0';

/* ══════════════════════════════════════════════════════════════
   КИРИШ — код, рухсатнома (имзоланган), уринишлар чегараси
   ══════════════════════════════════════════════════════════════ */

function turProp() { return PropertiesService.getScriptProperties(); }

/** Имзо калити — биринчи марта ўзи яратилади, файлда сақланмайди */
function turSir() {
  var p = turProp(), s = p.getProperty('SIR');
  if (!s) {
    s = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
    p.setProperty('SIR', s);
  }
  return s;
}

/** Давр — «ҳаммани чиқариш» босилганда ошади, эски рухсатномалар бекор бўлади */
function turDavr() { return +(turProp().getProperty('DAVR') || 1); }

function turImzo(m) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(m, turSir())).replace(/=+$/, '');
}

function turTokenYasa(qid) {
  var exp = Date.now() + TUR.MUDDAT_SOAT * 3600 * 1000;
  var m = 'azo.' + exp + '.' + qid + '.' + turDavr();
  return { token: m + '.' + turImzo(m), exp: exp };
}

function turTokenOch(t) {
  var q = String(t || '').split('.');
  if (q.length !== 5) return null;
  var m = q.slice(0, 4).join('.');
  if (turImzo(m) !== q[4]) return null;
  if (+q[1] < Date.now()) return null;
  if (+q[3] !== turDavr()) return null;
  return { rol: q[0], exp: +q[1], qid: q[2] };
}

/** Маълумот сўровини текширади — рухсатнома бўлмаса хато ташлайди */
function turRuxsat(t) {
  if (!turTokenOch(t)) {
    var e = new Error('Кириш талаб қилинади'); e.kirish = true; throw e;
  }
}

function turKirish(d) {
  var qid = String(d.qid || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 32);
  if (!qid) return { ok: false, xato: 'Қурилма аниқланмади' };
  var kod = String(d.kod || '').replace(/\D/g, '');
  var c = CacheService.getScriptCache();

  if (c.get('blok_umum'))
    return { ok: false, blok: true, xato: 'Кириш вақтинча ёпилган. 10 дақиқадан кейин уриниб кўринг.' };
  if (c.get('blok_' + qid))
    return { ok: false, blok: true, xato: 'Кўп марта хато код. 15 дақиқадан кейин уриниб кўринг.' };

  if (!kod || kod !== String(TUR.KOD)) {
    var n = (+c.get('xato_' + qid) || 0) + 1;
    c.put('xato_' + qid, String(n), 900);
    var g = (+c.get('xato_umum') || 0) + 1;
    c.put('xato_umum', String(g), 600);
    if (g >= 25) c.put('blok_umum', '1', 600);
    if (n >= 5) {
      c.put('blok_' + qid, '1', 900);
      return { ok: false, blok: true, xato: 'Кўп марта хато код. 15 дақиқадан кейин уриниб кўринг.' };
    }
    return { ok: false, xato: 'Код нотўғри', qoldi: 5 - n };
  }

  c.remove('xato_' + qid);
  var tk = turTokenYasa(qid);
  return { ok: true, rol: 'azo', token: tk.token, exp: tk.exp, muddat: TUR.MUDDAT_SOAT };
}

/** Илова ҳар 5 дақиқада сўрайди: сеанс тирикми. Фаол фойдаланувчининг муддати узаяди. */
function turFaol(d) {
  var t = turTokenOch(d.t);
  if (!t) return { ok: true, chiqish: true, sabab: 'Сеанс тугади — қайта киринг' };
  var o = { ok: true, chiqish: false };
  if (t.exp - Date.now() < (TUR.MUDDAT_SOAT - 1) * 3600 * 1000) {
    var tk = turTokenYasa(t.qid);
    o.token = tk.token; o.exp = tk.exp;
  }
  return o;
}

/** Ҳамма қурилмадаги сеансни тугатади (код алмашгач ишга туширинг) */
function turHammaChiqsin() {
  turProp().setProperty('DAVR', String(turDavr() + 1));
  Logger.log('Ҳамма сеанслар тугатилди. Энди ҳамма қайта код теради.');
}


var TUR = {

  // ⚠ КИРИШ КОДИ — 6 та рақам. Ўз кодингизга алмаштиринг.
  KOD: '000000',
  MUDDAT_SOAT: 24,           // 24 соат ишлатилмаса — код қайта сўралади

  JADVAL_ID: '1elehsZPyNWA4Ny9BFtzIJY_wNjBz8xZv14TLJBQD2TI',
  // «Учрашув ҳисоботи» — ўқувчилар билан учрашувлар
  OQ_JADVAL_ID: '1r8u_Jg99XDcwPmML2z6KJhbh4T28KmO8dKmHJGKJw14',
  OQ_VARAQ:  ['Аъзолар ҳисоботи', 'Аъзолар хисоботи', 'Ўқувчилар'],
  // Марказий банк ишламай қолса — шу курс ишлатилади
  KURS_ZAXIRA: 12600,
  VARAQ:     ['Тўлов маълумотлари', 'Тулов маълумотлари', 'Тўловлар'],
  PLAN:      ['План', 'Plan', 'Режа'],
  KESH_SONIYA: 300
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
  xohish: ['Хоҳиш / сўров', 'Хоҳиш/сўров', 'Хоҳиш', 'Сўров'],
  nima:   ['Нима қилиш керак', 'Нима қилиш'],
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
      return turJavob({ ok: true, versiya: TUR_VERSIYA,
        xabar: 'Turon Club App ишлаяпти — версия ' + TUR_VERSIYA, vaqt: turHozir() });

    turRuxsat(p.t);

    var c = CacheService.getScriptCache();
    var tayyor = c.get('tur2');
    if (tayyor && p.yangi !== '1')
      return ContentService.createTextOutput(tayyor).setMimeType(ContentService.MimeType.JSON);

    var matn = JSON.stringify(turBaza());
    try { if (matn.length < 95000) c.put('tur2', matn, TUR.KESH_SONIYA); } catch (e2) {}
    return ContentService.createTextOutput(matn).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return turJavob({ ok: false, versiya: TUR_VERSIYA, kirish: !!err.kirish, xato: String(err.message || err) });
  }
}

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.amal === 'kirish') return turJavob(turKirish(d));
    if (d.amal === 'faol')   return turJavob(turFaol(d));
    return turJavob({ ok: false, xato: 'Номаълум амал' });
  } catch (err) {
    return turJavob({ ok: false, xato: String(err.message || err) });
  }
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
  rng.getMergedRanges().forEach(function (m) {
    var r0 = m.getRow() - 1, c0 = m.getColumn() - 1, nr = m.getNumRows(), nc = m.getNumColumns();
    for (var r = r0; r < r0 + nr && r < v.length; r++)
      for (var c = c0; c < c0 + nc && c < v[r].length; c++) {
        if (r === r0 && c === c0) continue;
        v[r][c] = v[r0][c0]; kor[r][c] = kor[r0][c0];
      }
  });

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
  var o = { usd: TUR.KURS_ZAXIRA, sana: '', manba: 'zaxira' };
  try {
    var r = UrlFetchApp.fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/', { muteHttpExceptions: true });
    var j = JSON.parse(r.getContentText());
    var x = Array.isArray(j) ? j[0] : j;
    var n = parseFloat(String(x.Rate).replace(',', '.'));
    if (n > 1000) o = { usd: n, sana: String(x.Date || ''), manba: 'cbu' };
  } catch (e) {}
  try { c.put('kurs', JSON.stringify(o), o.manba === 'cbu' ? 21600 : 600); } catch (e) {}
  return o;
}

function turBaza() {
  var s = turSatrlar();
  var oq = [];
  try { oq = turOquvchilar(); } catch (e) { oq = { xato: String(e.message || e) }; }
  return {
    ok: true,
    versiya: TUR_VERSIYA,
    vaqt: turHozir(),
    sotuv: s.satrlar,
    plan: turPlan(s.satrlar.length),
    oquvchi: Array.isArray(oq) ? oq : [],
    oquvchiXato: Array.isArray(oq) ? null : oq.xato,
    kurs: turKurs(),
    tashxis: { varaq: s.varaq, oqilgan: s.satrlar.length }
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
    var tk = turTokenYasa('sinov');
    q.push(turTokenOch(tk.token) ? '✅ Кириш тизими ишлаяпти (имзо калити яратилган)' : '❌ Кириш тизимида хато');
    q.push(String(TUR.KOD) === '000000' ? '⚠ Кириш коди ҳали бошланғич (000000) — TUR.KOD ни алмаштиринг'
                                        : '✅ Кириш коди ўрнатилган');
    q.push('');
    q.push(b.sotuv.length ? '🎉 Тайёр — энди деплой қилинг' : '⚠ Аъзо ўқилмади');
  } catch (e) {
    q.push('❌ ' + e.message);
  }
  var x = q.join('\n');
  Logger.log(x);
  return x;
}
