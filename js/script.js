/* ==========================================================================
   Historia — общая логика
   Админ-пароль: admin123 (можно сменить ниже)
   ========================================================================== */

const ADMIN_PASSWORD = 'admin123';

/* ---------- ХРАНИЛИЩЕ ---------- */
const Store = {
  keys: {
    materials: 'historia_materials',
    tests: 'historia_tests',
    gallery: 'historia_gallery',
    presentations: 'historia_presentations',
    admin: 'historia_admin'
  },
  get(key) {
    try { return JSON.parse(localStorage.getItem(this.keys[key])) || []; }
    catch { return []; }
  },
  set(key, value) {
    localStorage.setItem(this.keys[key], JSON.stringify(value));
  },
  isAdmin() { return sessionStorage.getItem('historia_admin') === '1'; },
  setAdmin(on) {
    if (on) sessionStorage.setItem('historia_admin', '1');
    else sessionStorage.removeItem('historia_admin');
  }
};

/* ---------- ДАННЫЕ ПО-УМОЛЧАНИЮ ---------- */
const DefaultData = {
  materials: [
    { id: 'm1', title: 'Падение Западной Римской империи', tag: 'Древний мир', description: 'Причины и последствия краха величайшей империи античности, роль варварских нашествий и внутренних кризисов.', content: 'Западная Римская империя пала в 476 году, когда вождь германцев Одоакр низложил последнего императора Ромула Августула. Однако процесс упадка длился столетиями...' },
    { id: 'm2', title: 'Эпоха Просвещения', tag: 'Новое время', description: 'Идеи разума, свободы и прогресса, изменившие Европу и мир в XVIII веке.', content: 'Просвещение — интеллектуальное движение XVII–XVIII веков, утверждавшее приоритет разума и науки. Вольтер, Руссо, Дидро, Кант...' },
    { id: 'm3', title: 'Великие географические открытия', tag: 'XV–XVII вв.', description: 'Как плавания Колумба, Васко да Гамы и Магеллана изменили карту мира.', content: 'Эпоха Великих географических открытий связана с развитием мореплавания, картографии и стремлением европейцев найти новые торговые пути...' }
  ],
  tests: [
    {
      id: 't1',
      title: 'Древний Рим',
      description: 'Проверьте знания о легионах, императорах и культуре Вечного города.',
      questions: [
        { q: 'В каком году был основан Рим согласно легенде?', options: ['753 г. до н.э.', '509 г. до н.э.', '476 г. н.э.', '100 г. до н.э.'], correct: 0 },
        { q: 'Кто был первым императором Рима?', options: ['Юлий Цезарь', 'Октавиан Август', 'Нерон', 'Траян'], correct: 1 },
        { q: 'Как назывался главный рынок и центр общественной жизни Рима?', options: ['Колизей', 'Пантеон', 'Форум', 'Капитолий'], correct: 2 }
      ]
    },
    {
      id: 't2',
      title: 'Вторая мировая война',
      description: 'Ключевые события и даты крупнейшего конфликта XX века.',
      questions: [
        { q: 'Когда началась Вторая мировая война?', options: ['1 сентября 1939', '22 июня 1941', '7 декабря 1941', '9 мая 1945'], correct: 0 },
        { q: 'Какое сражение стало переломным на Восточном фронте?', options: ['Битва за Москву', 'Сталинградская битва', 'Курская дуга', 'Битва за Берлин'], correct: 1 }
      ]
    }
  ],
  gallery: [
    { id: 'g1', title: 'Колизей', description: 'Амфитеатр Флавиев, Рим, I век н.э.', image: '' },
    { id: 'g2', title: 'Парфенон', description: 'Храм Афины, Акрополь, V век до н.э.', image: '' },
    { id: 'g3', title: 'Замок Нойшванштайн', description: 'Бавария, XIX век', image: '' },
    { id: 'g4', title: 'Великая Китайская стена', description: 'Древнее оборонительное сооружение', image: '' }
  ],
  presentations: [
    { id: 'p1', title: 'Средневековая Европа', description: 'Феодализм, церковь и культура Средних веков.', type: 'iframe', url: 'https://docs.google.com/presentation/d/e/2PACX-1vSAMPLE/embed' },
    { id: 'p2', title: 'Русь IX–XIII вв.', description: 'Становление Древнерусского государства.', type: 'pdf', url: '#' }
  ]
};

/* Инициализация данных по умолчанию (только если пусто) */
function seedDefaults() {
  ['materials','tests','gallery','presentations'].forEach(k => {
    if (Store.get(k).length === 0) Store.set(k, DefaultData[k]);
  });
}

/* ---------- НАВИГАЦИЯ ---------- */
function initNav() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.nav-menu');
  if (burger) burger.addEventListener('click', () => menu.classList.toggle('open'));

  // активная ссылка
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

/* ---------- МОДАЛЬНЫЕ ОКНА ---------- */
function openModal(html) {
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content"><button class="modal-close" aria-label="Закрыть">&times;</button><div class="modal-body"></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
  }
  modal.querySelector('.modal-body').innerHTML = html;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- АДМИН-ПАНЕЛЬ ---------- */
function initAdmin() {
  // Кнопка и бейдж
  if (!document.querySelector('.admin-toggle')) {
    const btn = document.createElement('button');
    btn.className = 'admin-toggle';
    btn.innerHTML = '✦';
    btn.title = 'Админ-панель';
    btn.addEventListener('click', toggleAdmin);
    document.body.appendChild(btn);

    const badge = document.createElement('div');
    badge.className = 'admin-badge';
    badge.textContent = '◆ Режим редактора';
    document.body.appendChild(badge);
  }
  if (Store.isAdmin()) document.body.classList.add('admin-mode');
}

function toggleAdmin() {
  if (Store.isAdmin()) {
    Store.setAdmin(false);
    document.body.classList.remove('admin-mode');
    location.reload();
  } else {
    openModal(`
      <h2>Вход в админ-панель</h2>
      <p style="color:var(--cream); margin-bottom:1.5rem;">Введите пароль, чтобы управлять содержимым сайта.</p>
      <div class="form-group">
        <label>Пароль</label>
        <input type="password" id="adminPass" autofocus />
      </div>
      <button class="btn btn-primary" id="adminLoginBtn">Войти</button>
    `);
    setTimeout(() => {
      document.getElementById('adminLoginBtn').addEventListener('click', () => {
        const val = document.getElementById('adminPass').value;
        if (val === ADMIN_PASSWORD) {
          Store.setAdmin(true);
          closeModal();
          location.reload();
        } else {
          alert('Неверный пароль');
        }
      });
      document.getElementById('adminPass').addEventListener('keypress', e => {
        if (e.key === 'Enter') document.getElementById('adminLoginBtn').click();
      });
    }, 50);
  }
}

/* Универсальная форма добавления/редактирования */
function openEditorForm(type, item = null) {
  if (!Store.isAdmin()) return;
  const isEdit = !!item;
  let fields = '';

  if (type === 'materials') {
    fields = `
      <div class="form-group"><label>Название</label><input name="title" value="${item?.title || ''}" /></div>
      <div class="form-group"><label>Тег / Эпоха</label><input name="tag" value="${item?.tag || ''}" /></div>
      <div class="form-group"><label>Описание</label><textarea name="description">${item?.description || ''}</textarea></div>
      <div class="form-group"><label>Содержание урока</label><textarea name="content" rows="6">${item?.content || ''}</textarea></div>
    `;
  } else if (type === 'gallery') {
    fields = `
      <div class="form-group"><label>Название</label><input name="title" value="${item?.title || ''}" /></div>
      <div class="form-group"><label>Описание</label><input name="description" value="${item?.description || ''}" /></div>
      <div class="form-group"><label>URL изображения</label><input name="image" value="${item?.image || ''}" placeholder="https://..." /></div>
    `;
  } else if (type === 'presentations') {
    fields = `
      <div class="form-group"><label>Название</label><input name="title" value="${item?.title || ''}" /></div>
      <div class="form-group"><label>Описание</label><textarea name="description">${item?.description || ''}</textarea></div>
      <div class="form-group"><label>Тип</label>
        <select name="type">
          <option value="pdf" ${item?.type==='pdf'?'selected':''}>PDF</option>
          <option value="iframe" ${item?.type==='iframe'?'selected':''}>iframe (Google Slides / PowerPoint)</option>
        </select>
      </div>
      <div class="form-group"><label>URL</label><input name="url" value="${item?.url || ''}" placeholder="https://..." /></div>
    `;
  } else if (type === 'tests') {
    const qJson = item ? JSON.stringify(item.questions, null, 2) : '[\n  {\n    "q": "Вопрос?",\n    "options": ["A","B","C","D"],\n    "correct": 0\n  }\n]';
    fields = `
      <div class="form-group"><label>Название теста</label><input name="title" value="${item?.title || ''}" /></div>
      <div class="form-group"><label>Описание</label><textarea name="description">${item?.description || ''}</textarea></div>
      <div class="form-group"><label>Вопросы (JSON)</label><textarea name="questions" rows="10" style="font-family:monospace; font-size:0.85rem;">${qJson}</textarea></div>
      <p style="color:var(--cream); font-size:0.9rem;">Формат: массив объектов с полями <code>q</code>, <code>options</code>, <code>correct</code> (индекс).</p>
    `;
  }

  openModal(`
    <h2>${isEdit ? 'Редактирование' : 'Добавление'}</h2>
    <div id="editorFields">${fields}</div>
    <div style="display:flex; gap:1rem; margin-top:1rem;">
      <button class="btn btn-primary" id="saveBtn">Сохранить</button>
      <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
    </div>
  `);

  setTimeout(() => {
    document.getElementById('saveBtn').addEventListener('click', () => {
      const inputs = document.querySelectorAll('#editorFields [name]');
      const data = isEdit ? { ...item } : { id: type[0] + Date.now() };
      inputs.forEach(i => data[i.name] = i.value.trim());

      if (type === 'tests') {
        try { data.questions = JSON.parse(data.questions); }
        catch (e) { alert('Ошибка в JSON вопросов: ' + e.message); return; }
      }

      const list = Store.get(type);
      if (isEdit) {
        const idx = list.findIndex(x => x.id === item.id);
        list[idx] = data;
      } else {
        list.push(data);
      }
      Store.set(type, list);
      closeModal();
      location.reload();
    });
  }, 50);
}

function deleteItem(type, id) {
  if (!confirm('Удалить этот элемент?')) return;
  const list = Store.get(type).filter(x => x.id !== id);
  Store.set(type, list);
  location.reload();
}

/* ---------- РЕНДЕР СЕТОК ---------- */
function renderGrid(containerId, type, renderCard) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = Store.get(type);

  let html = '';
  if (Store.isAdmin()) {
    html += `<div class="card fade-in" onclick="openEditorForm('${type}')" style="display:grid; place-items:center; min-height:250px; border-style:dashed;">
      <div style="text-align:center; color:var(--gold-light); font-family:'Cormorant Garamond',serif; font-size:1.3rem;">
        <div style="font-size:3rem;">+</div>Добавить
      </div>
    </div>`;
  }
  if (items.length === 0 && !Store.isAdmin()) {
    html = `<div class="empty-state"><span class="script">Пока пусто…</span><p>Скоро здесь появятся новые материалы.</p></div>`;
  } else {
    items.forEach((item, i) => {
      html += renderCard(item, i);
    });
  }
  container.innerHTML = html;
}

function adminActionsHtml(type, id) {
  if (!Store.isAdmin()) return '';
  return `<div class="card-admin-actions">
    <button onclick="event.stopPropagation(); openEditorForm('${type}', Store.get('${type}').find(x=>x.id==='${id}'))" title="Редактировать">✎</button>
    <button onclick="event.stopPropagation(); deleteItem('${type}','${id}')" title="Удалить">×</button>
  </div>`;
}

/* ---------- СТРАНИЦЫ ---------- */

function initMaterialsPage() {
  renderGrid('materialsGrid', 'materials', (item, i) => `
    <article class="card fade-in" onclick="showMaterial('${item.id}')">
      ${adminActionsHtml('materials', item.id)}
      <div class="card-image-placeholder">📜</div>
      <div class="card-body">
        <span class="card-tag">${item.tag || 'Урок'}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="card-footer"><span>Читать</span><span class="arrow">→</span></div>
      </div>
    </article>
  `);
}

function showMaterial(id) {
  const m = Store.get('materials').find(x => x.id === id);
  if (!m) return;
  openModal(`
    <span class="script" style="font-size:1.3rem;">${m.tag || ''}</span>
    <h2>${m.title}</h2>
    <p style="color:var(--cream); font-style:italic; margin-bottom:1.5rem;">${m.description}</p>
    <div style="color:var(--cream-light); line-height:1.8; white-space:pre-wrap;">${m.content || 'Содержание урока появится скоро.'}</div>
  `);
}

function initGalleryPage() {
  renderGrid('galleryGrid', 'gallery', (item) => `
    <article class="card fade-in" onclick="showImage('${item.id}')">
      ${adminActionsHtml('gallery', item.id)}
      ${item.image
        ? `<img class="card-image" src="${item.image}" alt="${item.title}" onerror="this.outerHTML='<div class=&quot;card-image-placeholder&quot;>🏛</div>'">`
        : `<div class="card-image-placeholder">🏛</div>`}
      <div class="card-body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </article>
  `);
}

function showImage(id) {
  const g = Store.get('gallery').find(x => x.id === id);
  if (!g) return;
  openModal(`
    <h2>${g.title}</h2>
    <p style="color:var(--cream); margin-bottom:1rem;">${g.description}</p>
    ${g.image
      ? `<img src="${g.image}" alt="${g.title}" style="border:1px solid var(--gold);">`
      : `<div class="card-image-placeholder" style="aspect-ratio:16/10; font-size:6rem;">🏛</div>`}
  `);
}

function initPresentationsPage() {
  renderGrid('presGrid', 'presentations', (item) => `
    <article class="card fade-in" onclick="showPresentation('${item.id}')">
      ${adminActionsHtml('presentations', item.id)}
      <div class="card-image-placeholder">${item.type === 'pdf' ? '📕' : '🎞'}</div>
      <div class="card-body">
        <span class="card-tag">${item.type === 'pdf' ? 'PDF' : 'Slides'}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="card-footer"><span>Открыть</span><span class="arrow">→</span></div>
      </div>
    </article>
  `);
}

function showPresentation(id) {
  const p = Store.get('presentations').find(x => x.id === id);
  if (!p) return;
  let body;
  if (p.type === 'pdf') {
    body = `<iframe src="${p.url}" title="${p.title}"></iframe>
            <p style="margin-top:1rem;"><a href="${p.url}" target="_blank" class="btn btn-ghost">Открыть в новом окне ↗</a></p>`;
  } else {
    body = `<iframe src="${p.url}" title="${p.title}" allowfullscreen></iframe>`;
  }
  openModal(`<h2>${p.title}</h2><p style="color:var(--cream); margin-bottom:1rem;">${p.description}</p>${body}`);
}

/* ---------- ТЕСТЫ ---------- */
function initTestsPage() {
  renderGrid('testsGrid', 'tests', (item) => `
    <article class="card fade-in" onclick="startTest('${item.id}')">
      ${adminActionsHtml('tests', item.id)}
      <div class="card-image-placeholder">✍</div>
      <div class="card-body">
        <span class="card-tag">${(item.questions || []).length} вопросов</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="card-footer"><span>Начать</span><span class="arrow">→</span></div>
      </div>
    </article>
  `);
}

const TestState = { id: null, idx: 0, answers: [] };

function startTest(id) {
  const test = Store.get('tests').find(x => x.id === id);
  if (!test) return;
  TestState.id = id;
  TestState.idx = 0;
  TestState.answers = [];
  renderTestQuestion(test);
}

function renderTestQuestion(test) {
  if (TestState.idx >= test.questions.length) return renderTestResult(test);
  const q = test.questions[TestState.idx];
  const progress = ((TestState.idx) / test.questions.length) * 100;
  openModal(`
    <span class="script" style="font-size:1.2rem;">${test.title}</span>
    <h2>Вопрос ${TestState.idx + 1} из ${test.questions.length}</h2>
    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
    <p class="question">${q.q}</p>
    <div class="options">
      ${q.options.map((o, i) => `<div class="option" onclick="answerTest(${i})">${o}</div>`).join('')}
    </div>
  `);
}

function answerTest(optionIdx) {
  const test = Store.get('tests').find(x => x.id === TestState.id);
  const q = test.questions[TestState.idx];
  const options = document.querySelectorAll('.option');
  options.forEach((o, i) => {
    o.style.pointerEvents = 'none';
    if (i === q.correct) o.classList.add('correct');
    if (i === optionIdx && i !== q.correct) o.classList.add('incorrect');
  });
  TestState.answers.push(optionIdx === q.correct);
  setTimeout(() => {
    TestState.idx++;
    renderTestQuestion(test);
  }, 1200);
}

function renderTestResult(test) {
  const correct = TestState.answers.filter(Boolean).length;
  const total = test.questions.length;
  const percent = Math.round((correct / total) * 100);
  let verdict = 'Достойно летописца!';
  if (percent < 50) verdict = 'Стоит перечитать хроники…';
  else if (percent < 80) verdict = 'Хорошие знания истории.';
  openModal(`
    <div class="test-result">
      <span class="script" style="font-size:1.5rem;">Результат</span>
      <h2>${test.title}</h2>
      <span class="score">${correct} / ${total}</span>
      <p style="font-size:1.3rem; color:var(--cream-light); margin-bottom:1.5rem;">${percent}% — ${verdict}</p>
      <button class="btn btn-primary" onclick="startTest('${test.id}')">Пройти снова</button>
      <button class="btn btn-ghost" onclick="closeModal()">Закрыть</button>
    </div>
  `);
}

/* ---------- ИНИЦИАЛИЗАЦИЯ ---------- */
document.addEventListener('DOMContentLoaded', () => {
  seedDefaults();
  initNav();
  initAdmin();

  if (document.getElementById('materialsGrid')) initMaterialsPage();
  if (document.getElementById('galleryGrid')) initGalleryPage();
  if (document.getElementById('presGrid')) initPresentationsPage();
  if (document.getElementById('testsGrid')) initTestsPage();

  // Форма контактов
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      openModal(`
        <div style="text-align:center; padding:1.5rem;">
          <span class="script" style="font-size:2rem; display:block;">Благодарю!</span>
          <h2>Сообщение отправлено</h2>
          <p style="color:var(--cream); margin:1rem 0 1.5rem;">Я отвечу вам в ближайшее время.</p>
          <button class="btn btn-primary" onclick="closeModal()">Хорошо</button>
        </div>
      `);
      contactForm.reset();
    });
  }
});

// экспортируем для inline-обработчиков
window.openEditorForm = openEditorForm;
window.deleteItem = deleteItem;
window.Store = Store;
window.showMaterial = showMaterial;
window.showImage = showImage;
window.showPresentation = showPresentation;
window.startTest = startTest;
window.answerTest = answerTest;
window.closeModal = closeModal;
