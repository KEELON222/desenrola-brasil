document.addEventListener('DOMContentLoaded', function () {
  var cta = document.querySelector('.cta-button');
  if (!cta) return;

  var qs = window.location.search || '';
  if (qs) {
    var base = cta.getAttribute('href').split('?')[0];
    cta.setAttribute('href', base + qs);
  }

  cta.addEventListener('click', function (e) {
    e.preventDefault();
    var params = (window.location.search || '').replace(/^\?/, '');
    funnelGo('step1', params);
  });
});
