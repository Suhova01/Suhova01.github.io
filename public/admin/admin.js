/*
 * Настройки внешнего вида админки (Decap CMS).
 *  1. Предпросмотр справа выглядит как настоящий сайт (preview.css + шаблоны ниже).
 *  2. Кнопка «❓ Помощь» в углу экрана — открывает простую инструкцию help.html.
 */
(function () {
  var CMS = window.CMS
  if (!CMS) return
  var h = window.h
  var createClass = window.createClass

  CMS.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Onest:wght@400;500;700&family=Unbounded:wght@500;700;900&display=swap')
  CMS.registerPreviewStyle('/admin/preview.css')

  // адрес картинки → ссылка, которую понимает предпросмотр (в т.ч. только что загруженные фото)
  function asset(getAsset, path) {
    if (!path) return ''
    try {
      var a = getAsset(path)
      return a ? String(a) : path
    } catch (e) {
      return path
    }
  }

  function gallery(images, getAsset) {
    var list = (images || [])
      .map(function (img) { return typeof img === 'string' ? { src: img } : img || {} })
      .filter(function (img) { return img.src })
    if (!list.length) return null
    return h('div', { className: 'image-grid' }, list.map(function (img, i) {
      return h('figure', { key: i },
        h('img', { src: asset(getAsset, img.src), alt: '' }),
        img.caption ? h('figcaption', null, img.caption) : null)
    }))
  }

  function links(list) {
    if (!list || !list.length) return null
    return h('ul', { className: 'link-list' }, list.map(function (l, i) {
      return h('li', { key: i }, h('a', { href: l.url || '#', target: '_blank' }, l.title || 'Ссылка без названия'))
    }))
  }

  function docs(list) {
    if (!list || !list.length) return null
    return h('ul', { className: 'doc-list' }, list.map(function (d, i) {
      return h('li', { key: i },
        h(d.url ? 'a' : 'span', d.url ? { href: d.url } : null, d.name || 'Файл без названия'),
        h('span', { className: 'muted' }, d.url ? 'Скачать' : 'Файл скоро появится'))
    }))
  }

  var PagePreview = createClass({
    render: function () {
      var d = this.props.entry.get('data').toJS()
      var getAsset = this.props.getAsset
      return h('article', { className: 'preview' },
        h('div', { className: 'preview-badge' }, '👀 Так страница будет выглядеть на сайте'),
        h('div', { className: 'page-header' },
          d.eyebrow ? h('div', { className: 'eyebrow' }, d.eyebrow) : null,
          h('h1', null, d.title || 'Без названия'),
          d.intro ? h('p', { className: 'muted' }, d.intro) : null),
        d.children ? h('p', { className: 'preview-note' }, '📂 Здесь на сайте появится список подразделов') : null,
        (d.sections || []).map(function (s, i) {
          s = s || {}
          return h('div', { className: 'section', key: i },
            h('h2', null, s.heading || ''),
            s.body ? h('p', { className: 'prose' }, s.body) : null,
            gallery(s.images, getAsset),
            links(s.links),
            docs(s.docs))
        }),
        gallery(d.images, getAsset),
        docs(d.docs),
        d.showContactForm ? h('p', { className: 'preview-note' }, '📮 Здесь будет форма «Напишите мне»') : null)
    },
  })

  var ProfilePreview = createClass({
    render: function () {
      var p = (this.props.entry.get('data').toJS() || {}).person || {}
      var photo = asset(this.props.getAsset, p.photo)
      return h('div', { className: 'preview' },
        h('div', { className: 'preview-badge' }, '👀 Так это выглядит в меню слева на сайте'),
        h('aside', { className: 'sidebar-preview' },
          photo ? h('img', { className: 'sidebar-photo', src: photo, alt: '' })
                : h('div', { className: 'sidebar-photo' }, '🔔'),
          h('div', { className: 'sidebar-name' }, p.name || ''),
          h('div', { className: 'sidebar-role' }, p.role || ''),
          h('div', { className: 'sidebar-role' }, p.org || ''),
          h('div', { className: 'sidebar-role' }, p.location || ''),
          p.email ? h('div', { className: 'sidebar-role' }, '✉️ ' + p.email) : null))
    },
  })

  ;[
    'home', 'portfolio', 'portfolio-biografiya', 'portfolio-dostizheniya',
    'portfolio-dostizheniya-vospitannikov', 'portfolio-konferentsii',
    'portfolio-metod-obedineniya', 'portfolio-kvalifikatsiya', 'portfolio-samorazvitie',
    'portfolio-publikatsii', 'metodika', 'metodika-razrabotki', 'metodika-avtorskie-raboty',
    'metodika-prezentatsii', 'metodika-stsenarii', 'metodika-roditelskie-sobraniya',
    'metodika-dokumenty', 'roditelyam', 'gruppa', 'gruppa-foto', 'gruppa-rpps',
    'gruppa-muzei', 'video', 'ssylki',
  ].forEach(function (name) { CMS.registerPreviewTemplate(name, PagePreview) })
  CMS.registerPreviewTemplate('profile', ProfilePreview)

  // Кнопка помощи
  function addHelp() {
    if (document.getElementById('help-fab')) return
    var a = document.createElement('a')
    a.id = 'help-fab'
    a.href = '/admin/help.html'
    a.target = '_blank'
    a.rel = 'noopener'
    a.textContent = '❓ Помощь'
    document.body.appendChild(a)
  }
  if (document.body) addHelp()
  else document.addEventListener('DOMContentLoaded', addHelp)

  // Свёрнутый блок открывается кликом по его названию, а не только по крошечной стрелке
  document.addEventListener('click', function (e) {
    var label = e.target.closest && e.target.closest('[class*="NestedObjectLabel"]')
    if (!label) return
    var item = label.closest('[class*="SortableListItem"]')
    var arrow = item && item.querySelector('[class*="StyledListItemTopBar"] button')
    if (arrow) arrow.click()
  })
})()
