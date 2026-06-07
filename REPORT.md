# Lab 05 security notes

## Запуск

Термінал 1:

```bash
npm run dev:be
```

Термінал 2:

```bash
npm run dev:fe
```

## Що реалізовано

- SQLi: усі SQL-запити з даними користувача переведені на параметризовані `?`-параметри.
- XSS: дані, які виводяться на frontend, екрануються через `escapeHtml`, а форма користувача не вставляє HTML як дані.
- IDOR: `request` є персональним ресурсом; backend бере поточного користувача з `X-Demo-UserId` і фільтрує `GET/PUT/DELETE` за `user_id`.
- Misconfiguration: додані `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, обмежений CORS, єдиний формат помилок `code/message`.
- Frontend має всі CRUD-маршрути для backend-ресурсів: software, license, request, user.
- Users на frontend зроблені формою без таблиці й без email: вибір поточного профілю, ім’я, додавання, зміна і видалення.

## Перевірки

SQLi / allowlist:

```bash
curl.exe -H "X-Demo-UserId: 1" "http://localhost:3000/api/request?sortBy=bad"
```

Очікувано: `400 BAD_REQUEST`.

Без demo user:

```bash
curl.exe http://localhost:3000/api/request
```

Очікувано: `401 UNAUTHORIZED`.

IDOR:

```bash
curl.exe -H "X-Demo-UserId: 1" http://localhost:3000/api/request/1
curl.exe -H "X-Demo-UserId: 2" http://localhost:3000/api/request/1
```

Для чужого запису очікувано `404 NOT_FOUND`.

Headers:

```bash
curl.exe -I http://localhost:3000/health
```

Очікувано наявні `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.
