/* ==========================================================================
   A&E Cleaning Solutions — site interactions
   Vanilla JS. No external libraries, no APIs, no environment variables.
   ========================================================================== */
(function () {
  'use strict';

  var BUSINESS_EMAIL = 'info@aecleaningsolutions.com';

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close after tapping any link inside the menu.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    // Close on Escape.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Close when resizing back up to desktop.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });

    // Close when clicking outside the open menu.
    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });
  }

  /* ----------------------------------------------------------------------
     Sticky header shadow
     ---------------------------------------------------------------------- */
  var header = document.getElementById('header');
  if (header) {
    var applyStuck = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    applyStuck();
    window.addEventListener('scroll', applyStuck, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    '.card, .sign, .step, .quote, .about__media, .about__body, .stat, .areas li, .contact__info, .contact__form-wrap'
  );

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealTargets.length) {
    Array.prototype.forEach.call(revealTargets, function (el, index) {
      el.classList.add('reveal');
      el.style.transitionDelay = (index % 4) * 70 + 'ms';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    Array.prototype.forEach.call(revealTargets, function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     Quote request form
     ---------------------------------------------------------------------- */
  var form = document.getElementById('quoteForm');
  var status = document.getElementById('formStatus');

  if (!form) return;

  var RULES = {
    name: {
      message: 'Please enter your full name.',
      test: function (value) { return value.trim().length >= 2; }
    },
    phone: {
      message: 'Please enter a valid phone number with at least 10 digits.',
      test: function (value) { return value.replace(/\D/g, '').length >= 10; }
    },
    email: {
      message: 'Please enter a valid email address.',
      test: function (value) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim()); }
    },
    service: {
      message: 'Please choose the service you need.',
      test: function (value) { return value.trim() !== ''; }
    },
    message: {
      message: 'Please tell us a little about what needs attention (at least 10 characters).',
      test: function (value) { return value.trim().length >= 10; }
    },
    consent: {
      message: 'Please confirm we may contact you about this request.',
      test: function (value, field) { return field.checked; }
    }
  };

  function fieldWrapper(input) {
    return input.closest('.field');
  }

  function setError(input, message) {
    var wrapper = fieldWrapper(input);
    var errorEl = document.getElementById('err-' + input.id);

    if (wrapper) wrapper.classList.toggle('is-invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function validateField(input) {
    var rule = RULES[input.name];
    if (!rule) return true;

    var ok = rule.test(input.value, input);
    setError(input, ok ? '' : rule.message);
    return ok;
  }

  // Live validation once a field has been interacted with.
  Object.keys(RULES).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;

    var eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'blur';
    input.addEventListener(eventName, function () { validateField(input); });

    input.addEventListener('input', function () {
      var wrapper = fieldWrapper(input);
      if (wrapper && wrapper.classList.contains('is-invalid')) validateField(input);
    });
  });

  function showStatus(type, html) {
    if (!status) return;
    status.className = 'form__status form__status--' + type;
    status.innerHTML = html;
    status.hidden = false;
  }

  function buildMailtoLink(data) {
    var lines = [
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      'Email: ' + data.email,
      'Property address: ' + (data.address || 'Not provided'),
      'Service needed: ' + data.service,
      '',
      'Details:',
      data.message
    ];

    return (
      'mailto:' + BUSINESS_EMAIL +
      '?subject=' + encodeURIComponent('Free Property Report Request - ' + data.name) +
      '&body=' + encodeURIComponent(lines.join('\n'))
    );
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var firstInvalid = null;
    var allValid = true;

    Object.keys(RULES).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;

      if (!validateField(input)) {
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (!allValid) {
      showStatus(
        'err',
        '<strong>Please check the highlighted fields.</strong>' +
          'A few details are missing or incomplete. Prefer to talk instead? Call ' +
          '<a href="tel:+14075550128">(407) 555-0128</a>.'
      );
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
      return;
    }

    var data = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      address: form.elements.address.value.trim(),
      service: form.elements.service.value,
      message: form.elements.message.value.trim()
    };

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Preparing your request…';
    }

    // This static site has no backend, so the request is handed off to the
    // visitor's own email client with everything pre-filled.
    var mailto = buildMailtoLink(data);

    window.setTimeout(function () {
      showStatus(
        'ok',
        '<strong>Thanks, ' + data.name.split(' ')[0].replace(/[<>&]/g, '') + ' — your request is ready to send.</strong>' +
          'Your email app should now open with your property details filled in. If nothing opened, ' +
          '<a href="' + mailto + '">click here to send it</a> or call Dan directly at ' +
          '<a href="tel:+14075550128">(407) 555-0128</a>. We reply within one business day.'
      );

      window.location.href = mailto;

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generate My Free Property Report';
      }

      form.reset();
      Object.keys(RULES).forEach(function (name) {
        var input = form.elements[name];
        if (input) setError(input, '');
      });

      status.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    }, 400);
  });
})();
