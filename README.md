# Лабораторна робота №3: Інтеграція бази даних SQLite в Node.js застосунок

Даний проєкт демонструє перехід від зберігання даних у пам'яті до використання реляційної СУБД SQLite.

## Технології
- Runtime: Node.js
- Мова: TypeScript
- Фреймворк: Express.js
- База даних: SQLite3

## Схема бази даних та зв’язки
Проєкт використовує реляційну модель, що складається з трьох таблиць:

1. software (Основна таблиця):
   - id: PRIMARY KEY (UUID)
   - name: TEXT (NOT NULL)
   - price: REAL (Обмеження CHECK price >= 0)
2. users (Користувачі):
   - id: PRIMARY KEY
   - username: TEXT (UNIQUE, NOT NULL)
   - email: TEXT (UNIQUE)
3. reviews (Зв'язана таблиця):
   - id: PRIMARY KEY
   - software_id: FOREIGN KEY -> software(id) (Зв'язок 1:N)
   - user_id: FOREIGN KEY -> users(id)

Оптимізація: Створено індекси idx_software_name та idx_software_developer для оптимізації вибірок.

## Міграції
Схема бази даних розгортається автоматично при старті сервера через виконання SQL-скриптів з директорії migrations/:
- 001_init.sql: Ініціалізація структури таблиць.
- 002_add_indexes.sql: Додавання індексів продуктивності.

## Безпека (Демонстрація SQL Injection)
Endpoint GET /api/software реалізований із використанням рядкової конкатенації для демонстрації вразливості до SQL-ін'єкцій:
`query += " AND developer = '" + developer + "'";`

Приклад експлуатації: використання вводу `' OR '1'='1` дозволяє обійти фільтрацію даних.

## Основні Endpoints
- GET /api/software — отримання списку із фільтрацією.
- GET /api/software-reviews/:id — отримання запису з пов'язаними даними (JOIN).
- GET /api/stats — аналітичний запит (агрегація COUNT, AVG).
- POST /api/software — створення запису з обробкою конфліктів унікальності (409 Conflict).

## Інструкція з запуску
1. Встановлення залежностей: npm install
2. Запуск сервера: npm run dev