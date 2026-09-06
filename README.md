# GEOGLYF

Сайт мультидисциплинарного дизайнера Георгия Шустова: дизайн-поддержка по Time & Material и проектные услуги.

Собран на [Astro](https://astro.build), без клиентских фреймворков.

## Структура

- `src/pages/` — страницы: главная, `support`, `services` (+ страницы услуг), `work` (+ кейсы), `about`, `contacts`, `404`.
- `src/data/` — контент: `services.ts`, `cases.ts`, `site.ts` (контакты, меню). Добавить услугу или кейс = добавить объект в массив.
- `src/components/` — навигация, футер, форма, карточки, CTA.
- `src/styles/global.css` — единый CSS с брендовыми токенами.
- `public/assets/` — хромированные фигуры, портрет, favicon.

## Команды

```bash
npm install
npm run dev      # http://localhost:4321/GEOGLYF/
npm run build    # dist/
npm run preview
```

## Деплой

Push в ветку `claude/designer-portfolio-site-c1g956` или `main` запускает GitHub Actions: сборка и публикация `dist/` в ветку `gh-pages`, откуда сайт отдаёт GitHub Pages: https://mrgeos.github.io/GEOGLYF/

Для своего домена: в `astro.config.mjs` заменить `site` и убрать `base`, в Settings → Pages привязать домен.

## Что заменить перед публикацией

- Обложки и галереи кейсов: сейчас заглушки `picsum.photos`, см. `src/data/cases.ts`.
- Цены и сроки услуг в `src/data/services.ts`.
- Форма открывает Telegram с готовым текстом. Для отправки на почту замените `action` в `ContactForm.astro` на Formspree или другой сервис.
