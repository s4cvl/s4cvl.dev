/* s4cvl.dev — intro plein écran, copie du pseudo Discord, année du footer.
   Chargé de façon synchrone dans <head> : la classe .intro doit être posée avant le premier rendu. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pas d'intro si l'utilisateur ne veut pas d'animation ou arrive sur une ancre (#projets…).
  var playIntro = !reduceMotion && !window.location.hash;

  // Filet de sécurité : quoi qu'il arrive, l'écran d'intro disparaît au bout de 3 s.
  var failsafe = null;
  if (playIntro) {
    root.classList.add('intro');
    failsafe = window.setTimeout(function () { root.classList.remove('intro'); }, 3000);
  }

  /* ---------- Intro plein écran ---------- */

  var TYPE_DELAY = 40;   // ms par caractère de la commande
  var CMD_PAUSE = 120;   // pause après la commande, avant la réponse
  var LINE_DELAY = 170;  // ms entre chaque ligne de sortie
  var HOLD = 250;        // temps de lecture du « pong » avant de partir
  var FADE = 350;        // durée du fondu de sortie (cf. .intro-screen dans style.css)
  // 14 × 40 + 120 + 4 × 170 + 250 + 350 ≈ 1,96 s

  var SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

  function runIntro() {
    var screen = document.querySelector('[data-intro]');
    var cmd = screen && screen.querySelector('[data-cmd]');
    if (!cmd) { finish(); return; }

    var fullCmd = cmd.textContent;
    var outLines = screen.querySelectorAll('.t-out');
    var cursor = screen.querySelector('.t-cursor');
    var timer = null;
    var leaving = false;

    cmd.textContent = '';
    cmd.classList.add('is-typing');

    function step(fn, delay) {
      timer = window.setTimeout(fn, delay);
    }

    function typeChar(i) {
      if (i > fullCmd.length) { step(function () { showLine(0); }, CMD_PAUSE); return; }
      cmd.textContent = fullCmd.slice(0, i);
      step(function () { typeChar(i + 1); }, TYPE_DELAY);
    }

    function showLine(i) {
      if (i >= outLines.length) { step(leave, HOLD); return; }
      outLines[i].classList.add('is-shown');
      if (cursor) outLines[i].appendChild(cursor);
      step(function () { showLine(i + 1); }, LINE_DELAY);
    }

    function leave() {
      if (leaving) return;
      leaving = true;
      window.clearTimeout(timer);
      SKIP_EVENTS.forEach(function (type) { window.removeEventListener(type, leave, true); });
      screen.classList.add('is-leaving');
      window.setTimeout(finish, FADE);
    }

    SKIP_EVENTS.forEach(function (type) {
      window.addEventListener(type, leave, { capture: true, passive: true });
    });

    typeChar(1);
  }

  function finish() {
    window.clearTimeout(failsafe);
    root.classList.remove('intro');
  }

  /* ---------- Copie du pseudo Discord ---------- */

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Repli pour les contextes non sécurisés.
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.className = 'copy-buffer';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(area);
      if (ok) { resolve(); } else { reject(); }
    });
  }

  function initCopy() {
    var status = document.querySelector('[data-copy-status]');
    var clearTimer = null;

    document.querySelectorAll('[data-copy]').forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-copy');
        copyText(value).then(function () {
          say('pseudo Discord copié : ' + value);
        }, function () {
          say('pseudo Discord : ' + value);
        });
      });
    });

    function say(message) {
      if (!status) return;
      status.textContent = message;
      window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(function () { status.textContent = ''; }, 3000);
    }
  }

  /* ---------- Init ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    var year = document.querySelector('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());

    initCopy();
    if (playIntro) runIntro();
  });
})();
