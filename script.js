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
