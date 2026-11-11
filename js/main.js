/* ============================================================
   KWorld Society — Orrery
   City strip · chapter registry · interactive globe · form · reveals
   ============================================================ */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── K-pop mode: the hero tiger turns kawaii and back ───
     The crest is split into its frame and its tiger. The frame stays;
     the tiger swaps with a chibi version on a loop (CSS drives it). */
  (function () {
    if (!document.documentElement.classList.contains('kpop')) return;
    var crest = document.querySelector('.crest-hero');
    if (!crest) return;
    var wrap = document.createElement('div');
    wrap.className = 'kp-crest rv';
    crest.classList.remove('rv');
    crest.parentNode.insertBefore(wrap, crest);
    wrap.appendChild(crest);
    var og = document.createElement('div');
    og.className = 'kp-og';
    og.setAttribute('aria-hidden', 'true');
    wrap.appendChild(og);
    wrap.insertAdjacentHTML('beforeend',
      '<svg class="kp-cute" viewBox="0 0 1080 1080" aria-hidden="true" focusable="false"><g class="kp-bob" stroke="#3B1458" stroke-width="13" stroke-linejoin="round" stroke-linecap="round"><path d="M640 742c70 10 108-40 96-112-6-38-8-58 4-72" fill="none" stroke="#3B1458" stroke-width="44"/><path d="M640 742c70 10 108-40 96-112-6-38-8-58 4-72" fill="none" stroke="#FFB45C" stroke-width="20"/><path d="M722 670l26-6M716 620l28 2" fill="none"/><path transform="translate(-28 0)" d="M770 560c-20-16-50-6-44 18 4 18 34 30 44 40 10-10 40-22 44-40 6-24-24-34-44-18z" fill="#FF3FA4" stroke-width="10"/><ellipse cx="540" cy="690" rx="128" ry="118" fill="#FFB45C"/><ellipse cx="540" cy="712" rx="74" ry="80" fill="#FFF3E2" stroke="none"/><path d="M425 650q26 6 34 24M420 700q26 4 36 22M655 650q-26 6-34 24M660 700q-26 4-36 22" fill="none"/><path d="M540 690c-10-12-30-6-28 8 2 10 20 20 28 26 8-6 26-16 28-26 2-14-18-20-28-8z" fill="#FF7EB9" stroke-width="7"/><ellipse cx="478" cy="800" rx="52" ry="32" fill="#FFB45C"/><ellipse cx="602" cy="800" rx="52" ry="32" fill="#FFB45C"/><path d="M466 790v18M490 790v18M590 790v18M614 790v18" fill="none" stroke-width="9"/><ellipse cx="458" cy="676" rx="34" ry="30" fill="#FFB45C"/><ellipse cx="622" cy="676" rx="34" ry="30" fill="#FFB45C"/><circle cx="412" cy="350" r="56" fill="#FFB45C"/><circle cx="668" cy="350" r="56" fill="#FFB45C"/><circle cx="416" cy="356" r="28" fill="#FF9ED8" stroke="none"/><circle cx="664" cy="356" r="28" fill="#FF9ED8" stroke="none"/><ellipse cx="540" cy="465" rx="172" ry="146" fill="#FFB45C"/><ellipse cx="540" cy="535" rx="78" ry="54" fill="#FFF3E2" stroke="none"/><path d="M540 324v40M500 332l8 34M580 332l-8 34" fill="none" stroke-width="15"/><path d="M372 440l42 10M370 482l40 2M708 440l-42 10M710 482l-40 2" fill="none" stroke-width="15"/><g class="kp-eyes" stroke="none"><ellipse cx="476" cy="470" rx="30" ry="37" fill="#3B1458"/><ellipse cx="604" cy="470" rx="30" ry="37" fill="#3B1458"/><circle cx="466" cy="456" r="12" fill="#fff"/><circle cx="594" cy="456" r="12" fill="#fff"/><circle cx="486" cy="486" r="6" fill="#fff"/><circle cx="614" cy="486" r="6" fill="#fff"/></g><ellipse cx="420" cy="530" rx="32" ry="17" fill="#FF7EB9" stroke="none" opacity=".7"/><ellipse cx="660" cy="530" rx="32" ry="17" fill="#FF7EB9" stroke="none" opacity=".7"/><path d="M526 512h28l-14 14z" fill="#FF3FA4" stroke-width="8"/><path d="M506 540q17 22 34 0q17 22 34 0" fill="none" stroke-width="10"/><path d="M700 300l9 22 22 9-22 9-9 22-9-22-22-9 22-9z" fill="#FFE45E" stroke-width="7"/><path d="M380 560l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" fill="#7AD3FF" stroke-width="6"/></g></svg>' +
      '<span class="kp-poof" aria-hidden="true">\u2726 \u2661 \u2727 \u2605 \u2726 \u2661</span>');
  })();

  /* ── The network ───────────────────────────────────────
     lat/lng are true geographic coordinates.
     tier drives both the registry styling and the globe marker. */
  var CITIES = [
    { name: 'Seoul',       lat:  37.5665, lng: 126.9780, region: 'South Korea · Asia',      status: 'Headquarters', tier: 'hq' },
    { name: 'Athens',      lat:  37.9838, lng:  23.7275, region: 'Greece · Europe',         status: 'Founding',     tier: 'founding' },
    { name: 'Istanbul',    lat:  41.0082, lng:  28.9784, region: 'Turkey',                  status: 'Active',       tier: 'active' },
    { name: 'Paris',       lat:  48.8566, lng:   2.3522, region: 'France · Europe',         status: 'Active',       tier: 'active' },
    { name: 'Rome',        lat:  41.9028, lng:  12.4964, region: 'Italy · Europe',          status: 'Active',       tier: 'active' },
    { name: 'London',      lat:  51.5072, lng:  -0.1276, region: 'United Kingdom · Europe', status: 'Active',       tier: 'active' },
    { name: 'Provence',    lat:  43.5297, lng:   5.4474, region: 'France · Europe',         status: 'Active',       tier: 'active' },
    { name: 'Berlin',      lat:  52.5200, lng:  13.4050, region: 'Germany · Europe',        status: 'Active',       tier: 'active' },
    { name: 'Stockholm',   lat:  59.3293, lng:  18.0686, region: 'Sweden · Europe',         status: 'Active',       tier: 'active' },
    { name: 'Dubai',       lat:  25.2048, lng:  55.2708, region: 'UAE · MENA',              status: 'Active',       tier: 'active' },
    { name: 'Casablanca',  lat:  33.5731, lng:  -7.5898, region: 'Morocco · North Africa',  status: 'New',          tier: 'new' },
    { name: 'Riyadh',      lat:  24.7136, lng:  46.6753, region: 'Saudi Arabia · MENA',     status: 'Onboarding',   tier: 'onboarding' },
    { name: 'New York',    lat:  40.7128, lng: -74.0060, region: 'United States · Americas',status: 'Onboarding',   tier: 'onboarding' },
    { name: 'Los Angeles', lat:  34.0522, lng:-118.2437, region: 'United States · Americas',status: 'Onboarding',   tier: 'onboarding' },
    { name: 'Mexico City', lat:  19.4326, lng: -99.1332, region: 'Mexico · Americas',       status: 'Onboarding',   tier: 'onboarding' },
    { name: 'Cape Town',   lat: -33.9249, lng:  18.4241, region: 'South Africa · Africa',   status: 'Onboarding',   tier: 'onboarding' }
  ];

  function byTier(t) {
    for (var i = 0; i < CITIES.length; i++) if (CITIES[i].tier === t) return CITIES[i];
    return CITIES[0];
  }
  var ATHENS = byTier('founding');
  var SEOUL  = byTier('hq');

  function coordLabel(c) {
    var ns = Math.abs(c.lat).toFixed(2) + '°' + (c.lat >= 0 ? 'N' : 'S');
    var ew = Math.abs(c.lng).toFixed(2) + '°' + (c.lng >= 0 ? 'E' : 'W');
    return ns + '  ' + ew;
  }

  /* ── City strip ───────────────────────────────────────── */
  (function () {
    var el = document.getElementById('strip');
    if (!el) return;
    var seq = CITIES.map(function (c) {
      return '<span>' + c.name + '<b> &nbsp;&mdash;&nbsp; </b></span>';
    }).join('');
    el.innerHTML = seq + seq;
  })();

  /* ── Chapter registry ─────────────────────────────────── */
  (function () {
    var el = document.getElementById('cidx');
    if (!el) return;
    el.innerHTML = CITIES.map(function (c, i) {
      return '<button class="crow" type="button" data-i="' + i + '" style="--i:' + i + '">' +
             '<span class="cn mono">' + String(i + 1).padStart(2, '0') + '</span>' +
             '<span class="cbody"><span class="cc">' + c.name + '</span>' +
             '<span class="cr">' + c.region + '</span></span>' +
             '<span class="ct" data-t="' + c.tier + '">' +
               '<i class="lamp" aria-hidden="true"></i>' + c.status +
             '</span>' +
             '</button>';
    }).join('');
  })();

  /* ── The orrery ───────────────────────────────────────── */
  (function () {
    var cv = document.getElementById('globe');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d');

    var W = cv.width, H = cv.height;
    var cx = W / 2, cy = H * 0.46, R = W * 0.40;

    /* Constellation star map across the sphere surface. */
    var STARS = [], LINES = [];
    (function () {
      var s = 54321;
      var rnd = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      var i, j;
      for (i = 0; i < 1100; i++) {
        STARS.push({
          lat: Math.asin(rnd() * 2 - 1) * 180 / Math.PI,
          lng: rnd() * 360 - 180,
          sz: rnd() * 1.5 + 0.25,
          br: rnd() * 0.55 + 0.12
        });
      }
      var used = {};
      for (i = 0; i < STARS.length && LINES.length < 260; i++) {
        var best = -1, bd = 18;
        for (j = 0; j < STARS.length; j++) {
          if (i === j) continue;
          var a = STARS[i], b = STARS[j];
          var dla = a.lat - b.lat;
          var dln = (a.lng - b.lng) * Math.cos(a.lat * Math.PI / 180);
          var d = Math.sqrt(dla * dla + dln * dln);
          if (d < 18 && d < bd) { bd = d; best = j; }
        }
        if (best >= 0) {
          var k = Math.min(i, best) + '-' + Math.max(i, best);
          if (!used[k]) { used[k] = 1; LINES.push([i, best]); }
        }
      }
    })();

    /* Home position: the founding chapter, centred. */
    var rotY = 0, rotX = 0;
    var tY = null, tX = null;
    var drag = false, lastX = 0, lastY = 0;
    /* Distance travelled since pointer-down, so a drag is never
       mistaken for a click on whatever star it happens to end over. */
    var travel = 0;
    var CLICK_SLOP = 6;
    var selected = null, hovered = null;

    /* Unit vector for a lat/lng, north up. */
    function unit(lat, lng) {
      var ph = (90 - lat) * Math.PI / 180;
      var th = (lng + 180) * Math.PI / 180;
      return {
        x: -Math.sin(ph) * Math.cos(th),
        y: -Math.cos(ph),
        z:  Math.sin(ph) * Math.sin(th)
      };
    }

    function project(lat, lng) {
      var u = unit(lat, lng);
      var x = u.x * R, y = u.y * R, z = u.z * R;
      var x2 = x * Math.cos(rotY) - z * Math.sin(rotY);
      var z2 = x * Math.sin(rotY) + z * Math.cos(rotY);
      var y2 = y * Math.cos(rotX) - z2 * Math.sin(rotX);
      var z3 = y * Math.sin(rotX) + z2 * Math.cos(rotX);
      return { x: cx + x2, y: cy + y2, z: z3 };
    }

    /* Rotation that brings a point to the front of the sphere. */
    function facing(lat, lng) {
      var u = unit(lat, lng);
      var z2 = Math.sqrt(u.x * u.x + u.z * u.z);
      return {
        y: Math.atan2(u.x, u.z),
        x: Math.max(-0.72, Math.min(0.72, Math.atan2(u.y, z2)))
      };
    }

    function faceTarget(lat, lng) {
      var f = facing(lat, lng);
      var d = f.y - rotY;
      while (d >  Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      tY = rotY + d;
      tX = f.x;
    }

    /* Open framed on the founding chapter. */
    (function () {
      var home = facing(ATHENS.lat, ATHENS.lng);
      rotY = home.y;
      rotX = home.x;
    })();

    /* Great-circle interpolation between two points. */
    function slerp(la1, lo1, la2, lo2, t) {
      var a = unit(la1, lo1), b = unit(la2, lo2);
      var dot = a.x * b.x + a.y * b.y + a.z * b.z;
      var ang = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (ang < 0.001) return { lat: la2, lng: lo2 };
      var s = Math.sin(ang);
      var w1 = Math.sin((1 - t) * ang) / s, w2 = Math.sin(t * ang) / s;
      var vx = w1 * a.x + w2 * b.x, vy = w1 * a.y + w2 * b.y, vz = w1 * a.z + w2 * b.z;
      return {
        lat: 90 - Math.acos(Math.max(-1, Math.min(1, -vy))) * 180 / Math.PI,
        lng: Math.atan2(vz, -vx) * 180 / Math.PI - 180
      };
    }

    function drawArc(la1, lo1, la2, lo2, color, lw) {
      ctx.beginPath();
      var moved = false;
      for (var i = 0; i <= 50; i++) {
        var p2 = slerp(la1, lo1, la2, lo2, i / 50);
        var p = project(p2.lat, p2.lng);
        if (p.z < 0) { moved = false; continue; }
        if (!moved) { ctx.moveTo(p.x, p.y); moved = true; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.stroke();
    }

    /* Armillary ring, fixed in screen space and split front/back. */
    function drawRing(rad, tilt, front, color, lw, ticks) {
      var i, a, x, z0, y, z;
      ctx.beginPath();
      var moved = false;
      for (i = 0; i <= 180; i++) {
        a = i / 180 * Math.PI * 2;
        x = rad * Math.cos(a); z0 = rad * Math.sin(a);
        y = -z0 * Math.sin(tilt); z = z0 * Math.cos(tilt);
        if ((z > 0) !== front) { moved = false; continue; }
        if (!moved) { ctx.moveTo(cx + x, cy + y); moved = true; }
        else ctx.lineTo(cx + x, cy + y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.stroke();

      if (!ticks) return;
      for (i = 0; i < 72; i++) {
        a = i / 72 * Math.PI * 2;
        x = rad * Math.cos(a); z0 = rad * Math.sin(a);
        y = -z0 * Math.sin(tilt); z = z0 * Math.cos(tilt);
        if ((z > 0) !== front) continue;
        var long = i % 6 === 0;
        var len = long ? 6 : 3;
        var nx = Math.cos(a), ny = -Math.sin(a) * Math.sin(tilt);
        var m = Math.sqrt(nx * nx + ny * ny) || 1;
        ctx.beginPath();
        ctx.moveTo(cx + x, cy + y);
        ctx.lineTo(cx + x + nx / m * len, cy + y + ny / m * len);
        ctx.strokeStyle = color;
        ctx.lineWidth = long ? 0.9 : 0.5;
        ctx.stroke();
      }
    }

    /* Seasonal skin — set by the head script, gone after 26 Dec. */
    var XMAS = document.documentElement.classList.contains('xmas');
    var KPOP = document.documentElement.classList.contains('kpop');
    var SKIN = XMAS ? {
      ringA: ['rgba(230,57,70,0.45)', 'rgba(230,57,70,0.85)', 2, 2.4],
      ringB: ['rgba(43,168,74,0.35)', 'rgba(43,168,74,0.7)', 2, 2],
      sphere: ['#C8F0FF', '#5DB8FF', '#2C6FD6'],
      limb: 'rgba(10,30,80,0.35)', edge: ['rgba(255,255,255,0.7)', 3]
    } : KPOP ? {
      ringA: ['rgba(255,63,164,0.5)', 'rgba(255,63,164,0.95)', 3, 3.4],
      ringB: ['rgba(51,182,245,0.45)', 'rgba(51,182,245,0.9)', 2.6, 3],
      sphere: ['#FFE3F5', '#FF9ED8', '#9A7BFF'],
      limb: 'rgba(90,30,140,0.3)', edge: ['#3B1458', 3.5]
    } : {
      ringA: ['rgba(138,107,40,0.34)', 'rgba(138,107,40,0.55)', 1, 1.1],
      ringB: ['rgba(138,107,40,0.18)', 'rgba(138,107,40,0.30)', 1, 1],
      sphere: ['#3a3363', '#1d1838', '#0b0917'],
      limb: 'rgba(0,0,0,0.5)', edge: ['rgba(214,188,126,0.28)', 1]
    };

    /* K-pop mode: the globe gets a face. Drawn right after the sphere so
       the network and city labels still sit on top of it. */
    function drawFace(t) {
      var ey = cy + R * 0.22, ex = R * 0.3, er = R * 0.085;
      var blink = (t % 4.2) > 4.05;                 // a quick blink every ~4s
      ctx.save();
      ctx.globalAlpha = 0.9;
      for (var s = -1; s <= 1; s += 2) {
        if (blink) {
          ctx.beginPath();
          ctx.moveTo(cx + s * ex - er, ey); ctx.quadraticCurveTo(cx + s * ex, ey + er * 0.8, cx + s * ex + er, ey);
          ctx.strokeStyle = '#3B1458'; ctx.lineWidth = Math.max(2, R * 0.025); ctx.lineCap = 'round'; ctx.stroke();
        } else {
          ctx.beginPath(); ctx.ellipse(cx + s * ex, ey, er * 0.82, er, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#3B1458'; ctx.fill();
          ctx.beginPath(); ctx.arc(cx + s * ex - er * 0.28, ey - er * 0.38, er * 0.32, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
          ctx.beginPath(); ctx.arc(cx + s * ex + er * 0.3, ey + er * 0.3, er * 0.14, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();                            // blush
        ctx.ellipse(cx + s * ex * 1.55, ey + er * 1.7, er * 1.1, er * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,63,164,0.45)'; ctx.fill();
      }
      ctx.beginPath();                              // little cat smile
      var my = ey + er * 1.55, mw = er * 0.75;
      ctx.moveTo(cx - mw * 2, my);
      ctx.quadraticCurveTo(cx - mw, my + mw * 1.3, cx, my);
      ctx.quadraticCurveTo(cx + mw, my + mw * 1.3, cx + mw * 2, my);
      ctx.strokeStyle = '#3B1458'; ctx.lineWidth = Math.max(2, R * 0.022); ctx.lineCap = 'round'; ctx.stroke();
      ctx.restore();
    }

    function heartPath(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.9);
      ctx.bezierCurveTo(x - s * 1.6, y - s * 0.1, x - s * 0.9, y - s * 1.3, x, y - s * 0.45);
      ctx.bezierCurveTo(x + s * 0.9, y - s * 1.3, x + s * 1.6, y - s * 0.1, x, y + s * 0.9);
      ctx.closePath();
    }
    /* A heart and a star chasing each other round the rings. */
    function drawOrbiters(t, front) {
      var items = [[t * 0.5, R * 1.17, 0.36, 'heart'], [t * 0.5 + Math.PI, R * 1.3, -1.16, 'star']];
      items.forEach(function (it) {
        var a = it[0], depth = Math.sin(a);
        if ((depth > 0) !== front) return;
        var x = cx + it[1] * Math.cos(a), y = cy + it[1] * 0.3 * depth + Math.sin(it[2]) * it[1] * 0.15 * Math.cos(a);
        var s = R * (front ? 0.085 : 0.06) * (1 + Math.sin(t * 5) * 0.08);
        ctx.save();
        ctx.globalAlpha = front ? 1 : 0.7;
        ctx.lineWidth = 3; ctx.strokeStyle = '#3B1458'; ctx.lineJoin = 'round';
        if (it[3] === 'heart') {
          heartPath(x, y, s); ctx.fillStyle = '#FF3FA4'; ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.arc(x - s * 0.5, y - s * 0.4, s * 0.18, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
        } else {
          ctx.beginPath();
          for (var k = 0; k < 10; k++) {
            var r = k % 2 ? s * 0.5 : s * 1.15, an = -Math.PI / 2 + k * Math.PI / 5 + t * 0.8;
            ctx.lineTo(x + r * Math.cos(an), y + r * Math.sin(an));
          }
          ctx.closePath(); ctx.fillStyle = '#FFE45E'; ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      });
    }

    /* Santa's sleigh on a tilted orbit. Back half is drawn before the
       sphere so the planet hides it; front half after, crossing over. */
    function drawSanta(t, front) {
      var a = t * 0.42;
      var depth = Math.sin(a);                     // >0 = toward viewer
      if ((depth > 0) !== front) return;
      var x = cx + R * 1.05 * Math.cos(a);
      var y = cy - R * 0.15 + R * 0.38 * depth;
      var goingLeft = depth > 0;                   // front half travels right-to-left
      var sc = front ? 1 : 0.72;
      ctx.save();
      ctx.globalAlpha = front ? 1 : 0.75;
      ctx.translate(x, y + Math.sin(t * 3) * 3);   // a little bob
      ctx.scale(goingLeft ? sc : -sc, sc);
      /* sparkle trail behind the sleigh */
      for (var k = 1; k <= 6; k++) {
        ctx.beginPath();
        ctx.arc(26 + k * 11, 6 + Math.sin(t * 6 + k) * 3, 3.2 - k * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = k % 2 ? 'rgba(255,209,102,' + (0.9 - k * 0.13) + ')'
                              : 'rgba(255,255,255,' + (0.9 - k * 0.13) + ')';
        ctx.fill();
      }
      /* Hand-drawn so it looks the same everywhere — colour emoji
         aren't available on every device. Faces left; mirrored above. */
      ctx.scale(1.25, 1.25);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      function blob(fn, fill, stroke) {
        ctx.beginPath(); fn();
        ctx.fillStyle = fill; ctx.fill();
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
      }
      function deer(dx, rudolph) {
        ctx.strokeStyle = '#6B3B1E'; ctx.lineWidth = 2;
        ctx.beginPath();                                       // legs
        ctx.moveTo(dx - 6, 3); ctx.lineTo(dx - 9, 11);
        ctx.moveTo(dx + 6, 3); ctx.lineTo(dx + 9, 11);
        ctx.stroke();
        blob(function () { ctx.ellipse(dx, 0, 11, 6, 0, 0, Math.PI * 2); }, '#9C5B32', '#fff');
        blob(function () { ctx.arc(dx - 12, -7, 5, 0, Math.PI * 2); }, '#9C5B32', '#fff');
        ctx.strokeStyle = '#6B3B1E'; ctx.lineWidth = 1.6;      // antlers
        ctx.beginPath();
        ctx.moveTo(dx - 11, -11); ctx.lineTo(dx - 8, -18); ctx.lineTo(dx - 5, -20);
        ctx.moveTo(dx - 9, -15); ctx.lineTo(dx - 13, -19);
        ctx.stroke();
        blob(function () { ctx.arc(dx - 17, -6, rudolph ? 2.6 : 1.6, 0, Math.PI * 2); },
             rudolph ? '#FF2D3D' : '#3A1B2C');
      }
      /* harness */
      ctx.strokeStyle = '#FFD166'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(-18, -2); ctx.lineTo(-58, -2); ctx.stroke();
      deer(-34, false);
      deer(-62, true);
      /* sleigh runner */
      ctx.strokeStyle = '#FFD166'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(22, 11); ctx.lineTo(-16, 11);
      ctx.quadraticCurveTo(-24, 11, -22, 3); ctx.stroke();
      /* gift sack */
      blob(function () { ctx.arc(16, -11, 8, 0, Math.PI * 2); }, '#2BA84A', '#fff');
      /* Santa */
      blob(function () { ctx.arc(3, -11, 8, 0, Math.PI * 2); }, '#E63946', '#fff');
      blob(function () { ctx.arc(1, -21, 5.5, 0, Math.PI * 2); }, '#FFD6B8');
      blob(function () { ctx.ellipse(0, -16, 5.5, 4.5, 0, 0, Math.PI); }, '#FFFFFF');
      blob(function () {                                         // hat
        ctx.moveTo(-5, -24); ctx.lineTo(7, -24); ctx.lineTo(11, -34); ctx.closePath();
      }, '#E63946');
      blob(function () { ctx.rect(-6, -26, 14, 3); }, '#FFFFFF');
      blob(function () { ctx.arc(11, -34, 2.6, 0, Math.PI * 2); }, '#FFFFFF');
      /* sleigh body */
      blob(function () {
        ctx.moveTo(-18, -4); ctx.lineTo(22, -4); ctx.lineTo(24, 7);
        ctx.quadraticCurveTo(24, 9, 20, 9); ctx.lineTo(-12, 9);
        ctx.quadraticCurveTo(-20, 9, -18, -4); ctx.closePath();
      }, '#E63946', '#fff');
      ctx.strokeStyle = '#FFD166'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-15, 1); ctx.lineTo(21, 1); ctx.stroke();
      ctx.restore();
    }

    function render() {
      var t = performance.now() * 0.001;
      var pulse = Math.sin(t * 1.8) * 0.5 + 0.5;
      var pulse2 = Math.sin(t * 1.2 + 1) * 0.5 + 0.5;
      var i;

      if (tY !== null) {
        rotY += (tY - rotY) * 0.07;
        rotX += (tX - rotX) * 0.07;
        if (Math.abs(tY - rotY) < 0.002 && Math.abs(tX - rotX) < 0.002) {
          rotY = tY; rotX = tX; tY = tX = null;
        }
      }

      ctx.clearRect(0, 0, W, H);

      /* Cast shadow on the stone. */
      var shY = cy + R * 1.16;
      var sh = ctx.createRadialGradient(cx, shY / 0.17, 0, cx, shY / 0.17, R * 0.92);
      sh.addColorStop(0, 'rgba(40,34,22,0.20)');
      sh.addColorStop(1, 'rgba(40,34,22,0)');
      ctx.save();
      ctx.scale(1, 0.17);
      ctx.beginPath();
      ctx.arc(cx, shY / 0.17, R * 0.92, 0, Math.PI * 2);
      ctx.fillStyle = sh;
      ctx.fill();
      ctx.restore();

      /* Armillary rings — back halves. */
      drawRing(R * 1.17,  0.36, false, SKIN.ringA[0], SKIN.ringA[2], true);
      drawRing(R * 1.30, -1.16, false, SKIN.ringB[0], SKIN.ringB[2], false);
      if (XMAS && !REDUCED) drawSanta(t, false);
      if (KPOP && !REDUCED) drawOrbiters(t, false);

      /* Sphere. */
      var sg = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.34, 0, cx, cy, R);
      sg.addColorStop(0,    SKIN.sphere[0]);
      sg.addColorStop(0.45, SKIN.sphere[1]);
      sg.addColorStop(1,    SKIN.sphere[2]);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();

      if (XMAS) {
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
        ctx.beginPath();
        ctx.ellipse(cx, cy - R * 0.98, R * 0.95, R * 0.28, 0, 0, Math.PI * 2);
        for (var sc = -4; sc <= 4; sc++) {                    // scalloped snow edge
          ctx.moveTo(cx + sc * R * 0.2 + R * 0.12, cy - R * 0.72);
          ctx.arc(cx + sc * R * 0.2, cy - R * 0.72, R * 0.12, 0, Math.PI * 2);
        }
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.fill();
        ctx.restore();
      }

      if (KPOP) drawFace(REDUCED ? 0 : t);

      /* Constellation lines. */
      for (i = 0; i < LINES.length; i++) {
        var a = STARS[LINES[i][0]], b = STARS[LINES[i][1]];
        var pa = project(a.lat, a.lng), pb = project(b.lat, b.lng);
        if (pa.z < 0 || pb.z < 0) continue;
        var lf = Math.max(0, Math.min(pa.z, pb.z) / R);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = 'rgba(214,188,126,' + (0.085 * lf) + ')';
        ctx.lineWidth = 0.35;
        ctx.stroke();
      }

      /* Stars. */
      for (i = 0; i < STARS.length; i++) {
        var st = STARS[i];
        var ps = project(st.lat, st.lng);
        if (ps.z < 0) continue;
        var sf = Math.max(0, ps.z / R);
        ctx.beginPath();
        ctx.arc(ps.x, ps.y, st.sz * (0.4 + 0.6 * sf), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245,238,220,' + (st.br * sf) + ')';
        ctx.fill();
      }

      /* Latitude rings. */
      ctx.strokeStyle = 'rgba(214,188,126,0.06)';
      ctx.lineWidth = 0.5;
      for (var la = -60; la <= 60; la += 30) {
        ctx.beginPath();
        var moved = false;
        for (var lo = -180; lo <= 180; lo += 5) {
          var pl = project(la, lo);
          if (pl.z < 0) { moved = false; continue; }
          if (!moved) { ctx.moveTo(pl.x, pl.y); moved = true; }
          else ctx.lineTo(pl.x, pl.y);
        }
        ctx.stroke();
      }

      /* Arcs radiating from the founding chapter. */
      if (project(ATHENS.lat, ATHENS.lng).z > 0) {
        for (i = 0; i < CITIES.length; i++) {
          var c2 = CITIES[i];
          if (c2 === ATHENS || c2 === SEOUL) continue;
          if (project(c2.lat, c2.lng).z > -R * 0.1) {
            var isSel = selected && selected.name === c2.name;
            var dim = c2.tier === 'onboarding' ? 0.5 : 1;
            drawArc(ATHENS.lat, ATHENS.lng, c2.lat, c2.lng,
                    'rgba(214,188,126,' + (isSel ? 0.5 : 0.16 * dim) + ')', 0.6);
          }
        }
        /* Headquarters line: Seoul to the founding chapter. */
        if (project(SEOUL.lat, SEOUL.lng).z > -R * 0.1) {
          drawArc(SEOUL.lat, SEOUL.lng, ATHENS.lat, ATHENS.lng, 'rgba(240,214,150,0.42)', 0.9);
        }
      }

      /* Chapter stars, back to front. */
      var proj = CITIES.map(function (c, idx) {
        var p = project(c.lat, c.lng);
        return { c: c, x: p.x, y: p.y, z: p.z, i: idx, vis: p.z >= -R * 0.05 };
      }).sort(function (m, n) { return m.z - n.z; });

      proj.forEach(function (o) {
        if (!o.vis) return;
        var c = o.c;
        var f = Math.max(0.3, (o.z + R) / (2 * R));
        var sel = selected && selected.name === c.name;
        var hov = hovered && hovered.name === c.name;
        var hq = c.tier === 'hq';
        var found = c.tier === 'founding';
        var onb = c.tier === 'onboarding';
        var lit = sel || hov;

        /* Halo */
        var haloR = hq ? 26 : (found ? 22 : 16);
        var halo;
        if (hq)        halo = 'rgba(255,246,226,' + (0.34 + pulse * 0.24) + ')';
        else if (found) halo = 'rgba(240,214,150,' + (0.30 + pulse * 0.22) + ')';
        else if (onb)  halo = 'rgba(214,188,126,' + (0.08 + pulse2 * 0.09 * f) + ')';
        else           halo = 'rgba(245,238,220,' + (0.15 + pulse2 * 0.16 * f) + ')';

        var gr = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, haloR);
        gr.addColorStop(0, halo);
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(o.x, o.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();

        /* Pulsing rings */
        if (hq) {
          ctx.strokeStyle = 'rgba(255,246,226,' + (0.30 + pulse * 0.30) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(o.x, o.y, 11 + pulse * 7, 0, Math.PI * 2); ctx.stroke();
          ctx.strokeStyle = 'rgba(240,214,150,' + (0.16 + pulse2 * 0.20) + ')';
          ctx.beginPath(); ctx.arc(o.x, o.y, 18 + pulse2 * 8, 0, Math.PI * 2); ctx.stroke();
        } else if (found || lit) {
          var rr = found ? 12 + pulse * 8 : 9 + pulse2 * 6;
          ctx.beginPath();
          ctx.arc(o.x, o.y, rr, 0, Math.PI * 2);
          ctx.strokeStyle = found
            ? 'rgba(240,214,150,' + (0.26 + pulse * 0.28) + ')'
            : 'rgba(245,238,220,' + (0.22 + pulse2 * 0.24) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        /* Marker core — a distinct shape per tier */
        if (hq) {
          /* Headquarters: a four-point star set in a diamond */
          var s = 7.5;
          ctx.beginPath();
          ctx.moveTo(o.x, o.y - s);
          ctx.quadraticCurveTo(o.x + s * 0.24, o.y - s * 0.24, o.x + s, o.y);
          ctx.quadraticCurveTo(o.x + s * 0.24, o.y + s * 0.24, o.x, o.y + s);
          ctx.quadraticCurveTo(o.x - s * 0.24, o.y + s * 0.24, o.x - s, o.y);
          ctx.quadraticCurveTo(o.x - s * 0.24, o.y - s * 0.24, o.x, o.y - s);
          ctx.closePath();
          ctx.fillStyle = '#FFF6E2';
          ctx.fill();
          ctx.strokeStyle = 'rgba(240,214,150,' + (0.6 + pulse * 0.4) + ')';
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(o.x - 14, o.y); ctx.lineTo(o.x + 14, o.y);
          ctx.moveTo(o.x, o.y - 14); ctx.lineTo(o.x, o.y + 14);
          ctx.stroke();
        } else if (onb) {
          /* Onboarding: hollow, not yet live */
          ctx.beginPath();
          ctx.arc(o.x, o.y, lit ? 4.2 : 3.4, 0, Math.PI * 2);
          ctx.strokeStyle = lit
            ? 'rgba(255,250,240,0.95)'
            : 'rgba(226,206,164,' + (0.5 + 0.4 * f) + ')';
          ctx.lineWidth = 1.1;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(o.x, o.y, found ? 5 : (lit ? 4.2 : 2.9 * f), 0, Math.PI * 2);
          ctx.fillStyle = found
            ? '#f0d696'
            : (lit ? '#fffaf0' : 'rgba(245,238,220,' + (0.62 + 0.38 * f) + ')');
          ctx.fill();

          if (found) {
            ctx.strokeStyle = 'rgba(240,214,150,' + (0.5 + pulse * 0.4) + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(o.x - 11, o.y); ctx.lineTo(o.x + 11, o.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(o.x, o.y - 11); ctx.lineTo(o.x, o.y + 11); ctx.stroke();
          }
        }

        if (hov || sel || hq) {
          ctx.font = KPOP ? '400 13px "Bagel Fat One", sans-serif' : '500 10px Archivo, sans-serif';
          ctx.fillStyle = KPOP ? '#3B1458' : hq && !lit
            ? 'rgba(255,246,226,0.9)'
            : 'rgba(255,250,240,0.96)';
          ctx.fillText(c.name.toUpperCase(), o.x + (hq ? 17 : 13), o.y - 8);
        }
      });

      /* Limb shading, so the orb reads as a solid object on light ground. */
      var lb = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R);
      lb.addColorStop(0, 'rgba(0,0,0,0)');
      lb.addColorStop(1, SKIN.limb);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = lb;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = SKIN.edge[0];
      ctx.lineWidth = SKIN.edge[1];
      ctx.stroke();

      /* Armillary rings — front halves. */
      drawRing(R * 1.17,  0.36, true, SKIN.ringA[1], SKIN.ringA[3], true);
      drawRing(R * 1.30, -1.16, true, SKIN.ringB[1], SKIN.ringB[3], false);
      if (XMAS && !REDUCED) drawSanta(t, true);
      if (KPOP && !REDUCED) drawOrbiters(t, true);

      /* A slow sway that keeps the sphere alive without losing the network. */
      if (!drag && tY === null && !REDUCED) {
        rotY += Math.cos(t * 0.18) * 0.0009;
      }

      requestAnimationFrame(render);
    }

    /* Nearest chapter under the pointer. */
    function hitTest(mx, my) {
      var best = null, bestD = 13;
      CITIES.forEach(function (c) {
        var p = project(c.lat, c.lng);
        if (p.z < -R * 0.05) return;
        var d = Math.sqrt((p.x - mx) * (p.x - mx) + (p.y - my) * (p.y - my));
        if (d < bestD) { bestD = d; best = c; }
      });
      return best;
    }

    function pointerPos(e) {
      var r = cv.getBoundingClientRect();
      var sx = cv.width / r.width, sy = cv.height / r.height;
      var src = e.touches ? e.touches[0] : e;
      return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
    }

    /* ── Selection ──────────────────────────────────────── */
    var rows = Array.prototype.slice.call(document.querySelectorAll('.crow'));
    var elCity  = document.getElementById('l-city');
    var elReg   = document.getElementById('l-reg');
    var elCoord = document.getElementById('l-coord');
    var elSt    = document.getElementById('l-st');
    var elDot   = document.getElementById('l-dot');
    var elStt   = document.getElementById('l-stt');

    function select(c, rotate) {
      selected = c;
      rows.forEach(function (r) {
        var on = !!c && CITIES[+r.dataset.i].name === c.name;
        r.classList.toggle('on', on);
        r.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      if (!c) return;
      elCity.textContent = c.name;
      elReg.textContent = c.region;
      elCoord.textContent = coordLabel(c);
      elStt.textContent = c.status;
      elDot.className = 'label-d t-' + c.tier;
      elSt.hidden = false;
      if (rotate) faceTarget(c.lat, c.lng);
    }

    rows.forEach(function (r) {
      var c = CITIES[+r.dataset.i];
      r.addEventListener('mouseenter', function () { hovered = c; });
      r.addEventListener('mouseleave', function () { hovered = null; });
      r.addEventListener('focus', function () { hovered = c; });
      r.addEventListener('blur', function () { hovered = null; });
      r.addEventListener('click', function () { select(c, true); });
    });

    /* ── Pointer ────────────────────────────────────────── */
    cv.addEventListener('mousedown', function (e) {
      drag = true; travel = 0; tY = tX = null;
      var p = pointerPos(e); lastX = p.x; lastY = p.y;
    });

    cv.addEventListener('mousemove', function (e) {
      var p = pointerPos(e);
      if (drag) {
        var dx = p.x - lastX, dy = p.y - lastY;
        travel += Math.abs(dx) + Math.abs(dy);
        rotY += dx * 0.006;
        rotX += dy * 0.004;
        rotX = Math.max(-0.72, Math.min(0.72, rotX));
        lastX = p.x; lastY = p.y;
        hovered = null;
      } else {
        hovered = hitTest(p.x, p.y);
        cv.style.cursor = hovered ? 'pointer' : 'grab';
      }
    });

    cv.addEventListener('mouseup', function (e) {
      if (!drag) return;
      drag = false;
      if (travel > CLICK_SLOP) return;   /* that was a drag, not a click */
      var p = pointerPos(e);
      var c = hitTest(p.x, p.y);
      if (c) select(c, true);
    });

    cv.addEventListener('mouseleave', function () { drag = false; hovered = null; });

    cv.addEventListener('touchstart', function (e) {
      drag = true; travel = 0; tY = tX = null;
      var p = pointerPos(e); lastX = p.x; lastY = p.y;
    }, { passive: true });

    cv.addEventListener('touchmove', function (e) {
      if (!drag) return;
      var p = pointerPos(e);
      var dx = p.x - lastX, dy = p.y - lastY;
      travel += Math.abs(dx) + Math.abs(dy);
      rotY += dx * 0.006;
      rotX += dy * 0.004;
      rotX = Math.max(-0.72, Math.min(0.72, rotX));
      lastX = p.x; lastY = p.y;
    }, { passive: true });

    /* A tap (not a swipe) selects the chapter under the finger. */
    cv.addEventListener('touchend', function (e) {
      if (!drag) return;
      drag = false;
      if (travel > CLICK_SLOP) return;
      var t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      var r = cv.getBoundingClientRect();
      var c = hitTest((t.clientX - r.left) * (cv.width / r.width),
                      (t.clientY - r.top) * (cv.height / r.height));
      if (c) select(c, true);
    });

    /* Open on the founding chapter. */
    select(ATHENS, false);
    render();
  })();

  /* ── Membership form ──────────────────────────────────── */
  (function () {
    var form = document.getElementById('membership-form');
    var status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.fs');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          status.textContent = 'Application received — check your email for confirmation.';
        } else {
          status.textContent = 'Something went wrong — please email us directly.';
        }
      }).catch(function () {
        status.textContent = 'Network error — please try again.';
      }).then(function () {
        status.classList.add('show');
        if (btn) { btn.disabled = false; btn.textContent = 'Apply for membership'; }
      });
    });
  })();

  /* ── Snowfall (Christmas theme only) ──────────────────────
     A light canvas of drifting flakes; skipped for reduced motion and
     paused while the tab is hidden. */
  (function () {
    if (!document.documentElement.classList.contains('xmas') || REDUCED) return;
    var c = document.createElement('canvas');
    c.className = 'xmas-snow';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    var x = c.getContext('2d'), w, h, flakes = [];
    function size() {
      var d = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * d; c.height = h * d; c.style.width = w + 'px'; c.style.height = h + 'px';
      x.setTransform(d, 0, 0, d, 0, 0);
    }
    size();
    window.addEventListener('resize', size);
    var n = w < 600 ? 34 : 70;
    for (var i = 0; i < n; i++) {
      flakes.push({ x: Math.random() * w, y: Math.random() * h,
                    r: Math.random() * 2.4 + 1, s: Math.random() * 0.6 + 0.35,
                    p: Math.random() * Math.PI * 2,
                    /* mostly snow, with a few candy-coloured sprinkles so it
                       reads on the light sections too */
                    c: ['#FFFFFF','#FFFFFF','#CDEBFF','#FFC2D1','#BFF0CF','#FFE59A'][i % 6] });
    }
    function tick() {
      if (!document.hidden) {
        x.clearRect(0, 0, w, h);
        x.shadowColor = 'rgba(90,120,180,0.45)';
        x.shadowBlur = 2;
        for (var i = 0; i < flakes.length; i++) {
          var f = flakes[i];
          f.y += f.s; f.p += 0.012; f.x += Math.sin(f.p) * 0.35;
          if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
          x.fillStyle = f.c;
          x.beginPath(); x.arc(f.x, f.y, f.r, 0, Math.PI * 2); x.fill();
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  })();

  /* ── K-pop mode: rising hearts & stars, cursor sparkles ───
     Only while html.kpop is set; skipped for reduced motion. */
  (function () {
    if (!document.documentElement.classList.contains('kpop') || REDUCED) return;
    var c = document.createElement('canvas');
    c.className = 'kp-float';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    var x = c.getContext('2d'), w, h, bits = [];
    function size() {
      var d = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * d; c.height = h * d; c.style.width = w + 'px'; c.style.height = h + 'px';
      x.setTransform(d, 0, 0, d, 0, 0);
    }
    size();
    window.addEventListener('resize', size);
    var COLS = ['#FF3FA4', '#FF9ED8', '#7AD3FF', '#C9A7FF', '#B8F28A', '#FFE45E'];
    var n = w < 600 ? 14 : 26;
    for (var i = 0; i < n; i++) {
      bits.push({ x: Math.random() * w, y: Math.random() * h, s: Math.random() * 6 + 5,
                  v: Math.random() * 0.45 + 0.25, p: Math.random() * 6.3,
                  k: i % 3, c: COLS[i % COLS.length] });
    }
    function heart(px, py, s) {
      x.beginPath();
      x.moveTo(px, py + s * 0.9);
      x.bezierCurveTo(px - s * 1.6, py - s * 0.1, px - s * 0.9, py - s * 1.3, px, py - s * 0.45);
      x.bezierCurveTo(px + s * 0.9, py - s * 1.3, px + s * 1.6, py - s * 0.1, px, py + s * 0.9);
    }
    function star(px, py, s, r) {
      x.beginPath();
      for (var k = 0; k < 8; k++) {
        var rr = k % 2 ? s * 0.32 : s * 1.1, a = r + k * Math.PI / 4;
        x.lineTo(px + rr * Math.cos(a), py + rr * Math.sin(a));
      }
      x.closePath();
    }
    function tick() {
      if (!document.hidden) {
        x.clearRect(0, 0, w, h);
        x.lineWidth = 1.6; x.strokeStyle = 'rgba(59,20,88,0.55)';
        for (var i = 0; i < bits.length; i++) {
          var b = bits[i];
          b.y -= b.v; b.p += 0.02; b.x += Math.sin(b.p) * 0.4;
          if (b.y < -20) { b.y = h + 20; b.x = Math.random() * w; }
          x.globalAlpha = 0.75;
          x.fillStyle = b.c;
          if (b.k === 0) heart(b.x, b.y, b.s);
          else if (b.k === 1) star(b.x, b.y, b.s, b.p);
          else { x.beginPath(); x.arc(b.x, b.y, b.s * 0.45, 0, Math.PI * 2); }
          x.fill(); x.stroke();
        }
        x.globalAlpha = 1;
      }
      requestAnimationFrame(tick);
    }
    tick();

    /* sparkle trail on desktop pointers */
    if (!window.matchMedia('(pointer: fine)').matches) return;
    var GLYPHS = ['♡', '✦', '★', '✧'], last = 0;
    window.addEventListener('pointermove', function (e) {
      var now = performance.now();
      if (now - last < 45) return;
      last = now;
      var s = document.createElement('span');
      s.className = 'kp-spark';
      s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.style.color = COLS[(Math.random() * COLS.length) | 0];
      document.body.appendChild(s);
      window.setTimeout(function () { s.remove(); }, 820);
    }, { passive: true });
  })();

  /* ── Promo popup: Stray Kids live viewing giveaway ───────
     Once per session. Retires itself at 8 Nov 12:00 UTC, when the last
     timezone (UTC-12) finishes 7 November. No auto-dismiss — it's an
     offer, so it waits for the visitor: X, backdrop click or Escape. */
  (function () {
    var el = document.getElementById('promo');
    if (!el) return;
    if (Date.now() > Date.UTC(2026, 10, 8, 12, 0, 0)) return; // 10 = November

    var SEEN = 'kws-promo-skz-2026';
    try {
      if (sessionStorage.getItem(SEEN)) return;
      sessionStorage.setItem(SEEN, '1');
    } catch (e) {}

    el.hidden = false;
    document.body.style.overflow = 'hidden';
    var x = document.getElementById('promo-x');

    function close() {
      el.classList.add('is-out');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.setTimeout(function () { el.hidden = true; }, 400);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    if (x) { x.addEventListener('click', close); x.focus({ preventScroll: true }); }
    el.addEventListener('click', function (e) { if (e.target === el) close(); });
    document.addEventListener('keydown', onKey);
  })();

  /* ── Chuseok greeting ─────────────────────────────────────
     Shown once per session, through Chuseok itself. Cut off at
     29 Sep 00:00 UTC+14 (= 28 Sep 12:00 UTC), the moment the last
     timezone on Earth (UTC-12) finishes 28 September — so every
     timezone gets the full holiday before it retires on its own.
     Anything the visitor does dismisses it, and it never blocks the
     site: if scripting fails the panel stays hidden, since it only
     ever becomes visible from here. */
  (function () {
    var el = document.getElementById('chuseok');
    if (!el) return;
    if (Date.now() > Date.UTC(2026, 8, 28, 12, 0, 0)) return; // month is 0-indexed: 8 = September

    var SEEN = 'kws-chuseok-2026';
    try {
      if (sessionStorage.getItem(SEEN)) return;
      sessionStorage.setItem(SEEN, '1');
    } catch (e) { /* private mode: show it, just don't remember */ }

    el.hidden = false;
    document.body.style.overflow = 'hidden';

    var done = false;
    function dismiss() {
      if (done) return;
      done = true;
      el.classList.add('is-out');
      document.body.style.overflow = '';
      window.setTimeout(function () { el.hidden = true; }, 600);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', dismiss);
      window.removeEventListener('touchmove', dismiss);
    }
    function onKey() { dismiss(); }

    var btn = document.getElementById('chuseok-x');
    if (btn) btn.addEventListener('click', dismiss);
    el.addEventListener('click', function (e) { if (e.target === el) dismiss(); });
    document.addEventListener('keydown', onKey);

    /* Scroll/swipe dismiss arms after a beat, not immediately — otherwise
       leftover trackpad momentum from the page load itself can close the
       greeting before its entrance animation even finishes. Click and
       Escape stay instant, since those are always deliberate. */
    window.setTimeout(function () {
      if (done) return;
      window.addEventListener('wheel', dismiss, { passive: true });
      window.addEventListener('touchmove', dismiss, { passive: true });
    }, 1200);

    /* Falls away on its own if left alone. */
    window.setTimeout(dismiss, REDUCED ? 6000 : 13000);
  })();

  /* ── Deferred video ───────────────────────────────────────
     preload="none" plus a data-src means not a byte of video is
     fetched until the block is actually scrolled to. Playback pauses
     again once it leaves the viewport. Applies to every video on the
     page that opts in with data-src. */
  (function () {
    var vids = document.querySelectorAll('video[data-src]');
    if (!vids.length) return;

    /* Reduced motion: leave the poster in place, never fetch or play. */
    if (REDUCED) return;

    /* Metered or slow connections keep the posters too. The clips are
       several megabytes each; on a 2G connection or with Data Saver on,
       that cost is not worth an ambient loop. */
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      var slow = conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
      if (conn.saveData === true || slow) return;
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(vids, function (v) {
        v.src = v.dataset.src;
        v.play().catch(function () {});
      });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; }
          v.play().catch(function () {});
        } else if (v.src) {
          v.pause();
        }
      });
    }, { threshold: 0.25 });

    Array.prototype.forEach.call(vids, function (v) { obs.observe(v); });
  })();

  /* ── Scroll reveals ───────────────────────────────────── */
  (function () {
    var items = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    Array.prototype.forEach.call(items, function (el) { obs.observe(el); });
  })();

})();
