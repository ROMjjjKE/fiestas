/* Фиестас: меню, форма заявки, мелкие эффекты */

document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMenu();
  initForm();
  initYear();
});

function initHeader() {
  var head = document.getElementById('header');
  if (!head) return;
  var onScroll = function () {
    head.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMenu() {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (!burger || !menu) return;

  var close = function () {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', function () {
    var open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = menu.querySelector('a');
      if (first) first.focus();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      close();
      burger.focus();
    }
  });

  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') close();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && !menu.hidden) close();
  });
}

function initForm() {
  var form = document.getElementById('lead-form');
  if (!form) return;

  var success = document.getElementById('form-success');
  var waLink = document.getElementById('wa-link');
  var again = document.getElementById('again-btn');
  var phoneInput = form.querySelector('[name="phone"]');
  var nameInput = form.querySelector('[name="name"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    [nameInput, phoneInput].forEach(function (el) {
      var err = document.getElementById('e-' + el.name);
      var valid = el === nameInput ? el.value.trim().length > 1 : digits(el.value).length >= 9;
      el.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (err) err.textContent = valid ? '' : (el === nameInput ? 'Как к вам обращаться?' : 'Нужен номер, чтобы перезвонить');
      if (!valid) ok = false;
    });

    if (!ok) {
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    var data = new FormData(form);
    var lines = [
      'Заявка с сайта Фиестас',
      'Имя: ' + (data.get('name') || '').toString().trim(),
      'Телефон: ' + (data.get('phone') || '').toString().trim()
    ];
    if (data.get('date')) lines.push('Дата праздника: ' + data.get('date'));
    if (data.get('note')) lines.push('Комментарий: ' + data.get('note').toString().trim());

    waLink.href = 'https://wa.me/375296257425?text=' + encodeURIComponent(lines.join('\n'));
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  if (again) {
    again.addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      nameInput.focus();
    });
  }

  function digits(v) {
    return (v || '').replace(/\D/g, '');
  }
}

function initYear() {
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
}
