(function (global) {

  var STORAGE_KEY = 'funnel_params';



  function parseQuery(qs) {

    if (!qs) return new URLSearchParams();

    var s = String(qs);

    if (s.charAt(0) === '?') s = s.slice(1);

    return new URLSearchParams(s);

  }



  function persistFromSearch(search) {

    try {

      var stored = parseQuery(sessionStorage.getItem(STORAGE_KEY));

      parseQuery(search || global.location.search).forEach(function (value, key) {

        stored.set(key, value);

      });

      sessionStorage.setItem(STORAGE_KEY, stored.toString());

    } catch (_) {}

  }



  function getStoredParams() {

    try {

      return parseQuery(sessionStorage.getItem(STORAGE_KEY));

    } catch (_) {

      return new URLSearchParams();

    }

  }



  function normalizeQuery(qs) {

    if (!qs) return '';

    return qs.charAt(0) === '?' ? qs : '?' + qs;

  }



  /** stored + queryString + URL atual (URL vence em conflito) */

  global.funnelMergeParams = function (queryString) {

    var merged = getStoredParams();

    parseQuery(queryString).forEach(function (value, key) {

      merged.set(key, value);

    });

    parseQuery(global.location.search).forEach(function (value, key) {

      merged.set(key, value);

    });

    try {

      sessionStorage.setItem(STORAGE_KEY, merged.toString());

    } catch (_) {}

    return merged.toString();

  };



  global.funnelGetParams = function () {

    return parseQuery(global.funnelMergeParams(''));

  };



  function currentStep() {

    var path = decodeURIComponent(global.location.pathname).replace(/\\/g, '/').toLowerCase();

    if (path.indexOf('/inicio/') !== -1) return 'inicio';

    if (path.indexOf('/step1/') !== -1) return 'step1';

    if (path.indexOf('/step2/') !== -1) return 'step2';

    return 'root';

  }



  var relativePaths = {

    root:   { inicio: 'inicio/index.html', step1: 'step1/index.html', step2: 'step2/index.html' },

    inicio: { inicio: 'index.html',        step1: '../step1/index.html', step2: '../step2/index.html' },

    step1:  { inicio: '../inicio/index.html', step1: 'index.html', step2: '../step2/index.html' },

    step2:  { inicio: '../inicio/index.html', step1: '../step1/index.html', step2: 'index.html' }

  };



  global.funnelGo = function (step, queryString) {

    var qs = normalizeQuery(global.funnelMergeParams(queryString || ''));



    if (global.location.protocol === 'file:') {

      var from = currentStep();

      var map = relativePaths[from] || relativePaths.root;

      var target = map[step];

      if (!target) return;

      global.location.href = target + qs;

      return;

    }



    global.location.href = '/' + step + '/' + qs;

  };



  persistFromSearch(global.location.search);

})(window);

