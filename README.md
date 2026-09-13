# Сайт-портфолио — Сухова А. В.

React SPA (Vite + React Router) без бэкенда и без базы данных. Контент хранится
в JSON-файлах в `src/content/`, редактируется через Decap CMS (`/admin`),
хостится как статика.

## Запуск локально

```bash
npm install
npm run dev
```

## Структура

```
src/
  components/   — Sidebar, Layout, ContactForm
  content/      — site.json (навигация), pages.json (контент страниц)
  pages/        — Page.jsx (универсальный рендерер по слагу)
  styles/       — global.css (дизайн-токены)
admin/
  index.html    — точка входа Decap CMS
  config.yml    — конфигурация коллекций CMS
```

## Деплой на Cloudflare Pages

1. Создайте GitHub-репозиторий, запушьте проект.
2. На https://pages.cloudflare.com — «Create a project» → подключить репозиторий.
3. Build command: `npm run build`, Output directory: `dist`.
4. Готово — при каждом коммите сайт передеплоится автоматически.

## Авторизация для Decap CMS (вход в /admin)

Нужен OAuth-мост, чтобы Decap CMS могла авторизовать вход через GitHub.
Два варианта:

**А. Свой OAuth-сервер на Cloudflare Workers (рекомендуется, не зависит от третьих лиц)**
Инструкция: https://decapcms.org/docs/backends-overview/#github-backend
(ищите "OAuth client" — есть готовые шаблоны воркеров для этого).

**Б. Публичный готовый OAuth-прокси сообщества** — быстрее для старта,
но зависите от чужой инфраструктуры. Ссылки — там же, в документации Decap CMS.

После настройки впишите адрес прокси в `admin/config.yml` → `backend.base_url`
и укажите свой `repo:` (формат `аккаунт/репозиторий`).
