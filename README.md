# Mental Backend

A Laravel + React application built with Inertia.js, providing a modern full-stack experience with server-side rendering support.

## Tech Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 19 with TypeScript
- **UI Framework:** Tailwind CSS 4 + shadcn/ui components
- **Database:** SQLite (default) / MySQL / PostgreSQL
- **Authentication:** Laravel Fortify + Sanctum
- **Testing:** Pest PHP
- **Code Quality:** Laravel Pint (PHP) + ESLint (TypeScript/React)

## Prerequisites

Before you begin, ensure you have the following installed:

- PHP 8.2 or higher
- Composer 2.x
- Node.js 20.x or higher
- npm or yarn
- SQLite (default) or MySQL/PostgreSQL

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mental-backend
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Edit `.env` file to configure your database and other settings:

```env
DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite

# Or for MySQL/PostgreSQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=mental
# DB_USERNAME=root
# DB_PASSWORD=
```

### 4. Database Setup

```bash
# Create SQLite database file (if using SQLite)
touch database/database.sqlite

# Run migrations
php artisan migrate

# (Optional) Seed the database
php artisan db:seed
```

### 5. Start Development Server

#### Option A: Using Composer Script (Recommended)

This starts all services simultaneously with color-coded logs:

```bash
composer dev
```

This command starts:
- Laravel development server (localhost:8000)
- Queue worker
- Log viewer (Pail)
- Vite dev server (for hot module replacement)

#### Option B: Manual Setup

Start each service in separate terminal windows:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Queue worker (if using queues)
php artisan queue:listen --tries=1

# Terminal 3 - Logs
php artisan pail --timeout=0

# Terminal 4 - Vite dev server
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:
- **Application:** http://localhost:8000
- **Vite Dev Server:** http://localhost:5173 (proxied through Laravel)

## Server-Side Rendering (SSR)

To run the application with SSR enabled:

```bash
# Build SSR assets
npm run build:ssr

# Start with SSR
composer dev:ssr
```

## Code Quality & Linting

### PHP Code Formatting with Laravel Pint

Laravel Pint is an opinionated PHP code style fixer built on PHP-CS-Fixer.

#### Run Pint

```bash
# Fix all PHP files
./vendor/bin/pint

# Or using composer script
composer pint
```

#### Check without fixing

```bash
./vendor/bin/pint --test
```

#### Fix specific files or directories

```bash
./vendor/bin/pint app/Models
./vendor/bin/pint app/Http/Controllers/UserController.php
```

#### Common Pint Options

```bash
# Dry run (preview changes without applying)
./vendor/bin/pint --test -v

# Fix with detailed output
./vendor/bin/pint -v

# Use a specific preset
./vendor/bin/pint --preset laravel
```

### JavaScript/TypeScript Linting with ESLint

ESLint is configured with TypeScript, React, and Prettier support.

#### Run ESLint

```bash
# Lint and auto-fix
npm run lint

# Check only (no auto-fix)
npx eslint .
```

#### Format with Prettier

```bash
# Format all files in resources/
npm run format

# Check formatting without fixing
npm run format:check
```

### Type Checking

```bash
# Run TypeScript type checking
npm run types
```

## Testing

The project uses Pest PHP for testing.

### Run Tests

```bash
# Run all tests
php artisan test

# Or using Pest directly
./vendor/bin/pest

# Run specific test file
./vendor/bin/pest tests/Feature/Auth/LoginTest.php

# Run with coverage
./vendor/bin/pest --coverage

# Run in parallel
./vendor/bin/pest --parallel
```

### Using Composer Script

```bash
composer test
```

## Building for Production

### Build Frontend Assets

```bash
# Build for production
npm run build

# Build with SSR support
npm run build:ssr
```

### Optimize Laravel

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

## Project Structure

```
├── app/                    # Application code
│   ├── Actions/           # Fortify actions
│   ├── Http/              # Controllers, Middleware, Requests
│   ├── Models/            # Eloquent models
│   └── Policies/          # Authorization policies
├── database/              # Database files
│   ├── factories/         # Model factories
│   ├── migrations/        # Database migrations
│   ├── schema/            # Database schema files
│   └── seeders/           # Database seeders
├── resources/             # Frontend resources
│   ├── css/               # Stylesheets
│   ├── js/                # React/TypeScript code
│   │   ├── actions/       # Server actions
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Inertia pages
│   │   └── types/         # TypeScript types
│   └── views/             # Blade templates
├── routes/                # Route definitions
│   ├── api.php           # API routes
│   ├── web.php           # Web routes
│   └── settings.php      # Settings routes
├── tests/                 # Test files
│   ├── Feature/          # Feature tests
│   └── Unit/             # Unit tests
└── public/                # Public assets
```

## Available Artisan Commands

```bash
# List all available commands
php artisan list

# View logs in real-time
php artisan pail

# Clear all caches
php artisan optimize:clear

# Create a new controller
php artisan make:controller ControllerName

# Create a new model with migration
php artisan make:model ModelName -m

# Create a new migration
php artisan make:migration create_table_name

# Run database migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration (drop all tables and re-migrate)
php artisan migrate:fresh

# Seed database
php artisan db:seed
```

## Troubleshooting

### Clear All Caches

```bash
php artisan optimize:clear
```

### Reset Database

```bash
php artisan migrate:fresh --seed
```

### Node Modules Issues

```bash
rm -rf node_modules package-lock.json
npm install
```

### Composer Issues

```bash
composer clear-cache
rm -rf vendor composer.lock
composer install
```

### Permission Issues (Unix/Linux/Mac)

```bash
chmod -R 775 storage bootstrap/cache
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `composer test`
4. Run linters: `./vendor/bin/pint` and `npm run lint`
5. Commit your changes
6. Push and create a Pull Request

## License

This project is licensed under the MIT License.

