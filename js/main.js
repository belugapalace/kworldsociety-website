/* ============================================================
   KWorld Society — Orrery
   City strip · chapter registry · interactive globe · form · reveals
   ============================================================ */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      drawRing(R * 1.17,  0.36, false, 'rgba(138,107,40,0.34)', 1, true);
      drawRing(R * 1.30, -1.16, false, 'rgba(138,107,40,0.18)', 1, false);

      /* Sphere. */
      var sg = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.34, 0, cx, cy, R);
      sg.addColorStop(0, '#3a3363');
      sg.addColorStop(0.45, '#1d1838');
      sg.addColorStop(1, '#0b0917');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();

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
          ctx.font = '500 10px Archivo, sans-serif';
          ctx.fillStyle = hq && !lit
            ? 'rgba(255,246,226,0.9)'
            : 'rgba(255,250,240,0.96)';
          ctx.fillText(c.name.toUpperCase(), o.x + (hq ? 17 : 13), o.y - 8);
        }
      });

      /* Limb shading, so the orb reads as a solid object on light ground. */
      var lb = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R);
      lb.addColorStop(0, 'rgba(0,0,0,0)');
      lb.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = lb;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(214,188,126,0.28)';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Armillary rings — front halves. */
      drawRing(R * 1.17,  0.36, true, 'rgba(138,107,40,0.55)', 1.1, true);
      drawRing(R * 1.30, -1.16, true, 'rgba(138,107,40,0.30)', 1, false);

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
