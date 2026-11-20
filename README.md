# BookIt Base Project

## Setup for Developers (XAMPP + GitHub)

1. Clone the repository into your XAMPP web root (e.g., `C:\xampp\htdocs\bookit`).
2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. Import `database/db_bookit.sql` into phpMyAdmin (`http://localhost/phpmyadmin`) to create `db_bookit` and its tables.
4. Copy `config/config.example.php` to `config/config.php` and fill in your local MySQL credentials (`user` and `pass`). `config/config.php` is gitignored so your credentials stay local.
5. Open `http://localhost/bookit/public/` in your browser to verify the database connection.
