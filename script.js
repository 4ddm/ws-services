// ===== Mobile nav toggle =====
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== Contact form validation =====
  var form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var valid = true;

      form.querySelectorAll('[required]').forEach(function (field) {
        var group = field.closest('.form-group');
        var value = field.value.trim();
        var fieldValid = value.length > 0;

        if (fieldValid && field.type === 'email') {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if (group) {
          group.classList.toggle('has-error', !fieldValid);
        }
        if (!fieldValid) valid = false;
      });

      if (!valid) {
        e.preventDefault();
      }
    });
  }
});


// ===== Google reviews =====
(function () {
  var section = document.getElementById('reviews');
  if (!section) return;

  fetch('/.netlify/functions/reviews')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !data.reviews || !data.reviews.length) return;

      var grid = document.getElementById('reviews-grid');
      data.reviews.slice(0, 3).forEach(function (r) {
        var card = document.createElement('div');
        card.className = 'card sample-review-card review-card';

        var stars = document.createElement('div');
        stars.className = 'sample-review-stars';
        stars.textContent = '★★★★★'.slice(0, r.rating) + '☆☆☆☆☆'.slice(0, 5 - r.rating);
        stars.setAttribute('aria-label', r.rating + ' out of 5 stars');

        var text = document.createElement('p');
        text.textContent = '"' + r.text + '"';

        var name = document.createElement('span');
        name.className = 'sample-review-name';
        name.textContent = r.author || 'Google reviewer';
        if (r.when) {
          var when = document.createElement('small');
          when.textContent = r.when;
          name.appendChild(when);
        }

        card.appendChild(stars);
        card.appendChild(text);
        card.appendChild(name);
        grid.appendChild(card);
      });

      if (data.rating && data.total) {
        document.getElementById('reviews-summary').textContent =
          'Rated ' + data.rating.toFixed(1) + ' out of 5 on Google (' + data.total + (data.total === 1 ? ' review)' : ' reviews)');
      }
      if (data.url) document.getElementById('reviews-link').href = data.url;
      section.hidden = false;
    })
    .catch(function () {});
})();
