# WB Tariffs Service

Сервис для получения тарифов Wildberries и их экспорта в Google Sheets.

## Функциональность

- Ежечасное получение тарифов через API Wildberries
- Сохранение тарифов в PostgreSQL
- Автоматическое обновление Google таблиц каждые 15 минут
- Автоматическое подключение к Google таблице (согласно требованию: "Само приложение должно запускаться одной командной docker compose up и не требовать никаких дополнительных манипуляций.")

## Требования

- Docker и Docker Compose
- API ключ Wildberries
- Сервисный аккаунт Google с доступом к Google Sheets API

## Быстрый старт

1. Склонируйте репозиторий:

```bash
git clone https://github.com/cicada-pops/btlz-wb-test
cd btlz-wb-test
```

2. Скопируйте пример конфигурации:

```bash
cp .env.example .env
```

3. Заполните `.env` файл:

- Добавьте ваш API ключ Wildberries в `WB_API_KEY`
- Добавьте учетные данные сервисного аккаунта Google в `GOOGLE_CREDENTIALS` (данные для теста отправлены на hh)

4. Запустите приложение:

```bash
docker compose up
```

## Проверка работоспособности

1. Проверка логов:

```bash
docker logs app -f
```

Вы должны увидеть сообщения:

- "Сервис запущен"
- "Тарифы успешно обновлены" (каждый час)
- "Таблица Тарифы WB успешно обновлена" (каждые 15 минут)

2. Проверка базы данных:

```bash
docker exec postgres psql -U postgres -d postgres -c "SELECT date, warehouse_id, delivery_base, delivery_liter, storage_base, storage_liter FROM tariffs ORDER BY date DESC LIMIT 5;"
```

3. Глобальная очистка

```bash
docker compose down --rmi local --volumes
```

## Структура данных

### Тарифы

- `date` - дата тарифа
- `warehouse_id` - идентификатор склада
- `delivery_base` - базовый тариф доставки
- `delivery_liter` - тариф доставки за литр
- `storage_base` - базовый тариф хранения
- `storage_liter` - тариф хранения за литр

### Google таблица

- Дата
- Склад
- Тип доставки (delivery_base / delivery_liter)
- Коэффициент (storage_base + storage_liter)
