# Piyachok APP

**English** | **Українська**

У БАЗІ ДАННИХ ВЖЕ Є ЗАРЕЄСТРОВАНО 3 КОРИСТУВАЧІ:
1. СУПЕРЮЗЕР/КРИТИК/ВЛАСНИК ЗАКЛАДІВ - EMAIL: bodk335@gmail.com ПАРОЛЬ: admin
2. ВЛАСНИК ЗАКЛАДІВ -  EMAIL: donato.4work@gmail.com ПАРОЛЬ: test
3. НОВИЙ КОРИСТУВАЧ - EMAIL: gil591549@gmail.com ПАРОЛЬ: test

### Українська версія

# Piyachok APP

Piyachok — це сучасний веб-додаток, який допомагає користувачам знаходити та досліджувати найкращі місця для відпочинку, зустрічей, роботи чи розваг в Україні. Додаток дозволяє швидко знаходити кафе, бари, ресторани та інші заклади з детальною інформацією, відгуками, рейтингом та особливостями (Wi-Fi, тераса, жива музика тощо).

Основні функції:
- Реєстрація та управління профілем
- Пошук, фільтрація та сортування закладів (за рейтингом, середнім чеком, віддаленістю тощо)
- Додавання та управління закладами (з модерацією адміністратора)
- Відгуки, оцінки та коментарі
- Список улюблених закладів
- Новини та акції закладів
- Функція "Пиячок" — знайти компанію для зустрічі в закладі (з попередженнями про безпеку)
- Адмін-панель для суперкористувачів (модерація закладів, управління користувачами, аналітика тощо)

Додаток створено з акцентом на безпеку, мінімалістичний дизайн та зручний інтерфейс.

### Технологічний стек
- Фронтенд: React + TypeScript, Tailwind CSS, React Hook Form, React Router v6
- Управління станом: Redux Toolkit (RTK Query для API-запитів)
- Бекенд: Django + Django REST Framework
- База даних: PostgreSQL 
- Авторизація: JWT (токени access/refresh)

### Функціонал за технічним завданням
- Попередження про 18+ та безпеку при першому запуску
- Система модерації закладів
- Функція "Пиячок" для пошуку компанії
- Адмін-панель з аналітикою та управлінням контентом
- Адаптивний та мобільно-дружній дизайн

### Як запустити
1. Клонуйте репозиторій: git clone https://github.com/Donato4Humans/python-fullstack-diploma.git
2. Перейти в кореневу директорію python-fullstack-diploma та створити .env файл(відправлю у Telegram) на основі .env.example
3. cd frontend && npm install
4. cd .. && docker compose up --build -d
5. Перейти у браузері на http://localhost
6. Авторизуватись на існуючого користувача(дані вказано вище) або зареєструвати нового
7. Тестувати функціонал за допомогою інтерфейсу застосунку або Postman колекції(додам трохи пізніше)

### Ліцензія
---

API Документація:

Swagger: http://localhost/api/doc

### Контакти
Для питань чи внеску зв'яжіться з розробником.

---

### English Version

# Piyachok APP

Piyachok is a modern web application designed to help users discover and explore great places for relaxation, meetings, work, or entertainment in Ukraine. It allows users to find cafes, bars, restaurants, and other venues with detailed information, reviews, ratings, and special features like Wi-Fi, terraces, or live music.

Key features:
- User registration and profile management
- Venue search, filtering, and sorting (by rating, average check, distance, etc.)
- Adding and managing venues (with admin moderation)
- Reviews, ratings, and comments
- Favorites list
- Venue news and promotions
- Piyachok — feature for finding company to meet at a venue (with safety warnings)
- Admin panel for superusers (venue moderation, user management, analytics, etc.)

The application emphasizes safety, minimalistic design, and a smooth user experience.

### Tech Stack
- Frontend: React + TypeScript, Tailwind CSS, React Hook Form, React Router v6
- State Management: Redux Toolkit (RTK Query for API calls)
- Backend: Django + Django REST Framework
- Database: PostgreSQL (assumed)
- Authentication: JWT (access/refresh tokens)

### Features from Technical Specification
- Age verification and safety warnings on first launch
- Venue moderation system
- Piyachok feature for finding companions
- Admin panel with analytics and content management
- Responsive and mobile-friendly design

### How to Run

1. Clone the repository:  
   git clone https://github.com/Donato4Humans/python-fullstack-diploma.git

2. Go to the root directory python-fullstack-diploma and create a .env file (I will send it to you via Telegram) based on .env.example.

3. Install frontend dependencies:  
   cd frontend && npm install

4. Go back to the root and start Docker Compose:  
   cd .. && docker compose up --build -d

5. Open in your browser:  
   http://localhost

6. Log in with an existing user (credentials provided above) or register a new one.

7. Test the functionality using the application interface or the Postman collection (I will add it a bit later).


API Documentation:

Swagger: http://localhost/api/doc
 

### License
---

### Contact
For questions or contributions, open an issue or contact the developer.

---

