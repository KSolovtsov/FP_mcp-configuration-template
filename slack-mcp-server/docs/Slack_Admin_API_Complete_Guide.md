# Slack Administration API - Полное руководство

> Версия: 2025
> Автор: Claude Code
> Дата создания: 2025-10-28

## Содержание
1. [Введение](#введение)
2. [Настройка и аутентификация](#настройка-и-аутентификация)
3. [Управление пользователями](#управление-пользователями)
4. [Управление каналами и беседами](#управление-каналами-и-беседами)
5. [Управление сообщениями](#управление-сообщениями)
6. [Поиск и аналитика](#поиск-и-аналитика)
7. [Административные функции](#административные-функции)
8. [MCP Server для Slack](#mcp-server-для-slack)
9. [Примеры использования](#примеры-использования)
10. [Troubleshooting](#troubleshooting)

---

## Введение

Это полное руководство по администрированию Slack workspace через API и MCP (Model Context Protocol) server. Документация охватывает все основные операции для администраторов Slack.

### Что можно делать:
- ✅ Управлять пользователями (просмотр, информация)
- ✅ Управлять каналами (создание, архивация, переименование)
- ✅ Добавлять/удалять участников каналов
- ✅ Отправлять и управлять сообщениями
- ✅ Искать по сообщениям и каналам
- ✅ Получать аналитику и статистику
- ✅ Управлять настройками workspace (Enterprise Grid)

---

## Настройка и аутентификация

### Типы токенов Slack

Slack поддерживает несколько типов токенов:

| Тип токена | Префикс | Описание | Рекомендуется |
|------------|---------|----------|---------------|
| Bot Token | `xoxb-` | Для ботов и приложений | ✅ Да |
| User Token | `xoxp-` | Для пользовательских приложений | ✅ Да |
| Browser Token | `xoxc-` + `xoxd` cookie | Токены веб-клиента | ⚠️ Неофициально |
| App-level Token | `xapp-` | Для Socket Mode | ✅ Да |

### Настройка токенов браузера (xoxc)

**Файл конфигурации:** `C:\Users\kossa\Projects\Slack\slack-mcp-server\.env`

```bash
# Slack Browser Tokens (Stealth Mode)
SLACK_MCP_XOXC_TOKEN=xoxc-XXXX-XXXX-XXXX-XXXX
SLACK_MCP_XOXD_TOKEN=xoxd-XXXX

# Server Configuration
SLACK_MCP_PORT=13080
SLACK_MCP_HOST=127.0.0.1
```

### Базовый пример запроса

```bash
curl -X GET "https://slack.com/api/METHOD_NAME" \
  -H "Authorization: Bearer $SLACK_MCP_XOXC_TOKEN" \
  -H "Cookie: d=$SLACK_MCP_XOXD_TOKEN"
```

---

## Управление пользователями

### 1. users.list - Получить список всех пользователей

**Описание:** Возвращает список всех пользователей workspace.

**Метод:** `GET https://slack.com/api/users.list`

**Параметры:**
- `limit` (optional) - Максимум результатов (1-1000)
- `cursor` (optional) - Курсор для пагинации

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/users.list" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**Пример ответа:**
```json
{
  "ok": true,
  "members": [
    {
      "id": "U084MJ9C28M",
      "name": "john",
      "real_name": "John Doe",
      "is_admin": false,
      "is_owner": false,
      "is_bot": false,
      "deleted": false,
      "profile": {
        "email": "john@example.com",
        "real_name": "John Doe",
        "display_name": "John"
      }
    }
  ],
  "response_metadata": {
    "next_cursor": "dGVhbTpDMDYxRkE1UEI="
  }
}
```

**MCP метод:** ❌ Нет прямого MCP метода (использовать API)

---

### 2. users.info - Получить информацию о пользователе

**Описание:** Получает подробную информацию о конкретном пользователе.

**Метод:** `GET https://slack.com/api/users.info`

**Параметры:**
- `user` (required) - User ID (например, U084MJ9C28M)

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/users.info?user=U084MJ9C28M" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**Пример ответа:**
```json
{
  "ok": true,
  "user": {
    "id": "U084MJ9C28M",
    "name": "john",
    "real_name": "John Doe",
    "is_admin": false,
    "is_owner": false,
    "is_primary_owner": false,
    "is_restricted": false,
    "is_ultra_restricted": false,
    "profile": {
      "email": "john@example.com",
      "phone": "+1234567890",
      "title": "Software Engineer"
    }
  }
}
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 3. users.conversations - Получить каналы пользователя

**Описание:** Возвращает список каналов, в которых состоит пользователь.

**Метод:** `GET https://slack.com/api/users.conversations`

**Параметры:**
- `user` (optional) - User ID (по умолчанию - текущий пользователь)
- `types` (optional) - Типы каналов: `public_channel,private_channel,mpim,im`
- `limit` (optional) - Максимум результатов
- `cursor` (optional) - Курсор для пагинации

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/users.conversations?types=public_channel,private_channel&limit=10" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**MCP метод:** ❌ Нет прямого MCP метода

---

## Управление каналами и беседами

### 4. conversations.list - Список всех каналов

**Описание:** Возвращает список всех каналов workspace.

**Метод:** `GET https://slack.com/api/conversations.list`

**Параметры:**
- `types` (optional) - Типы: `public_channel,private_channel,mpim,im`
- `limit` (optional) - Максимум результатов (1-1000)
- `cursor` (optional) - Курсор для пагинации
- `exclude_archived` (optional) - Исключить архивные (true/false)

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=20" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**Пример ответа:**
```json
{
  "ok": true,
  "channels": [
    {
      "id": "C087E8S6CUQ",
      "name": "product",
      "is_channel": true,
      "is_private": true,
      "is_archived": false,
      "is_general": false,
      "creator": "U084QABU8H1",
      "created": 1735455782,
      "num_members": 22,
      "topic": {
        "value": "Product discussions"
      },
      "purpose": {
        "value": "Channel for product team"
      }
    }
  ]
}
```

**MCP метод:** ✅ `mcp__slack__channels_list`

```javascript
mcp__slack__channels_list({
  channel_types: "public_channel,private_channel",
  limit: 100
})
```

---

### 5. conversations.info - Информация о канале

**Описание:** Получает подробную информацию о канале.

**Метод:** `GET https://slack.com/api/conversations.info`

**Параметры:**
- `channel` (required) - Channel ID (например, C087E8S6CUQ)
- `include_locale` (optional) - Включить локаль (true/false)
- `include_num_members` (optional) - Включить количество участников (true/false)

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/conversations.info?channel=C087E8S6CUQ" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 6. conversations.members - Участники канала

**Описание:** Получает список участников канала.

**Метод:** `GET https://slack.com/api/conversations.members`

**Параметры:**
- `channel` (required) - Channel ID
- `limit` (optional) - Максимум результатов (1-1000)
- `cursor` (optional) - Курсор для пагинации

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/conversations.members?channel=C087E8S6CUQ" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**Пример ответа:**
```json
{
  "ok": true,
  "members": [
    "U084QABU8H1",
    "U084QDJR0UA",
    "U0856EF3W12"
  ],
  "response_metadata": {
    "next_cursor": ""
  }
}
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 7. conversations.create - Создать канал

**Описание:** Создает новый публичный или приватный канал.

**Метод:** `POST https://slack.com/api/conversations.create`

**Параметры:**
- `name` (required) - Имя канала (lowercase, без пробелов)
- `is_private` (optional) - Приватный канал? (true/false)
- `team_id` (optional) - Team ID для Enterprise Grid

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/conversations.create" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "new-project-channel",
    "is_private": false
  }'
```

**Пример ответа:**
```json
{
  "ok": true,
  "channel": {
    "id": "C0XXXXXXX",
    "name": "new-project-channel",
    "is_channel": true,
    "is_group": false,
    "is_private": false,
    "created": 1735455782,
    "creator": "U084QABU8H1"
  }
}
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 8. conversations.invite - Добавить пользователей в канал

**Описание:** Добавляет от 1 до 1000 пользователей в канал.

**Метод:** `POST https://slack.com/api/conversations.invite`

**Параметры:**
- `channel` (required) - Channel ID
- `users` (required) - User IDs через запятую (до 1000)
- `force` (optional) - Принудительно добавить (true/false)

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/conversations.invite" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ",
    "users": "U084MJ9C28M,U0853QW4538"
  }'
```

**Пример ответа:**
```json
{
  "ok": true,
  "channel": {
    "id": "C087E8S6CUQ",
    "name": "product",
    "num_members": 24
  }
}
```

**Важно:** Вызывающий пользователь должен быть участником канала.

**MCP метод:** ❌ Нет прямого MCP метода

---

### 9. conversations.kick - Удалить пользователя из канала

**Описание:** Удаляет пользователя из канала.

**Метод:** `POST https://slack.com/api/conversations.kick`

**Параметры:**
- `channel` (required) - Channel ID
- `user` (required) - User ID для удаления

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/conversations.kick" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ",
    "user": "U084MJ9C28M"
  }'
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 10. conversations.archive - Архивировать канал

**Описание:** Архивирует канал.

**Метод:** `POST https://slack.com/api/conversations.archive`

**Параметры:**
- `channel` (required) - Channel ID

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/conversations.archive" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ"
  }'
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 11. conversations.unarchive - Разархивировать канал

**Описание:** Восстанавливает архивированный канал.

**Метод:** `POST https://slack.com/api/conversations.unarchive`

**Параметры:**
- `channel` (required) - Channel ID

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/conversations.unarchive" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ"
  }'
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 12. conversations.rename - Переименовать канал

**Описание:** Переименовывает канал.

**Метод:** `POST https://slack.com/api/conversations.rename`

**Параметры:**
- `channel` (required) - Channel ID
- `name` (required) - Новое имя (lowercase, без пробелов)

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/conversations.rename" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ",
    "name": "product-team"
  }'
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 13. conversations.setTopic - Установить тему канала

**Описание:** Устанавливает тему канала.

**Метод:** `POST https://slack.com/api/conversations.setTopic`

**Параметры:**
- `channel` (required) - Channel ID
- `topic` (required) - Текст темы (до 250 символов)

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/conversations.setTopic" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ",
    "topic": "Product roadmap discussions"
  }'
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 14. conversations.setPurpose - Установить цель канала

**Описание:** Устанавливает цель/описание канала.

**Метод:** `POST https://slack.com/api/conversations.setPurpose`

**Параметры:**
- `channel` (required) - Channel ID
- `purpose` (required) - Текст цели (до 250 символов)

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/conversations.setPurpose" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ",
    "purpose": "Channel for product team collaboration"
  }'
```

**MCP метод:** ❌ Нет прямого MCP метода

---

## Управление сообщениями

### 15. conversations.history - История сообщений канала

**Описание:** Получает историю сообщений из канала.

**Метод:** `GET https://slack.com/api/conversations.history`

**Параметры:**
- `channel` (required) - Channel ID
- `limit` (optional) - Максимум сообщений (1-1000)
- `cursor` (optional) - Курсор для пагинации
- `oldest` (optional) - Начало временного диапазона (timestamp)
- `latest` (optional) - Конец временного диапазона (timestamp)
- `inclusive` (optional) - Включить границы диапазона (true/false)

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/conversations.history?channel=C087E8S6CUQ&limit=10" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**Пример ответа:**
```json
{
  "ok": true,
  "messages": [
    {
      "type": "message",
      "user": "U084QABU8H1",
      "text": "Hello team!",
      "ts": "1761319880.105779"
    }
  ],
  "has_more": true,
  "response_metadata": {
    "next_cursor": "bmV4dF90czoxNTEyMDg1ODYxMDAw"
  }
}
```

**MCP метод:** ✅ `mcp__slack__conversations_history`

```javascript
mcp__slack__conversations_history({
  channel_id: "C087E8S6CUQ",
  limit: "10",
  include_activity_messages: false
})
```

---

### 16. conversations.replies - Получить ответы в треде

**Описание:** Получает ответы в треде сообщения.

**Метод:** `GET https://slack.com/api/conversations.replies`

**Параметры:**
- `channel` (required) - Channel ID
- `ts` (required) - Timestamp родительского сообщения
- `limit` (optional) - Максимум сообщений
- `cursor` (optional) - Курсор для пагинации

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/conversations.replies?channel=C087E8S6CUQ&ts=1761319880.105779" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**MCP метод:** ✅ `mcp__slack__conversations_replies`

```javascript
mcp__slack__conversations_replies({
  channel_id: "C087E8S6CUQ",
  thread_ts: "1761319880.105779",
  limit: "10"
})
```

---

### 17. chat.postMessage - Отправить сообщение

**Описание:** Отправляет сообщение в канал.

**Метод:** `POST https://slack.com/api/chat.postMessage`

**Параметры:**
- `channel` (required) - Channel ID или имя
- `text` (required) - Текст сообщения
- `thread_ts` (optional) - Timestamp для ответа в треде
- `reply_broadcast` (optional) - Также показать в канале (true/false)
- `blocks` (optional) - Block Kit блоки
- `attachments` (optional) - Вложения

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ",
    "text": "Hello from API!",
    "thread_ts": "1761319880.105779"
  }'
```

**MCP метод:** ✅ `mcp__slack__conversations_add_message`

```javascript
mcp__slack__conversations_add_message({
  channel_id: "C087E8S6CUQ",
  payload: "Hello from MCP!",
  content_type: "text/markdown",
  thread_ts: "1761319880.105779"
})
```

---

### 18. chat.update - Обновить сообщение

**Описание:** Обновляет существующее сообщение.

**Метод:** `POST https://slack.com/api/chat.update`

**Параметры:**
- `channel` (required) - Channel ID
- `ts` (required) - Timestamp сообщения
- `text` (required) - Новый текст

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/chat.update" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ",
    "ts": "1761319880.105779",
    "text": "Updated message"
  }'
```

**MCP метод:** ❌ Нет прямого MCP метода

---

### 19. chat.delete - Удалить сообщение

**Описание:** Удаляет сообщение.

**Метод:** `POST https://slack.com/api/chat.delete`

**Параметры:**
- `channel` (required) - Channel ID
- `ts` (required) - Timestamp сообщения

**Пример запроса:**
```bash
curl -X POST "https://slack.com/api/chat.delete" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C087E8S6CUQ",
    "ts": "1761319880.105779"
  }'
```

**MCP метод:** ❌ Нет прямого MCP метода

---

## Поиск и аналитика

### 20. search.messages - Поиск по сообщениям

**Описание:** Поиск сообщений в workspace.

**Метод:** `GET https://slack.com/api/search.messages`

**Параметры:**
- `query` (required) - Поисковый запрос
- `count` (optional) - Максимум результатов (1-100)
- `page` (optional) - Номер страницы
- `sort` (optional) - Сортировка: `score`, `timestamp`
- `sort_dir` (optional) - Направление: `asc`, `desc`

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/search.messages?query=product+roadmap&count=20" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**MCP метод:** ✅ `mcp__slack__conversations_search_messages`

```javascript
mcp__slack__conversations_search_messages({
  search_query: "product roadmap",
  filter_in_channel: "C087E8S6CUQ",
  filter_date_after: "2025-01-01",
  limit: 20
})
```

---

### 21. team.info - Информация о workspace

**Описание:** Получает информацию о workspace/team.

**Метод:** `GET https://slack.com/api/team.info`

**Параметры:**
- `team` (optional) - Team ID (для Enterprise Grid)

**Пример запроса:**
```bash
curl -X GET "https://slack.com/api/team.info" \
  -H "Authorization: Bearer xoxc-TOKEN" \
  -H "Cookie: d=xoxd-TOKEN"
```

**Пример ответа:**
```json
{
  "ok": true,
  "team": {
    "id": "T084QCY9HQA",
    "name": "Kepler Commerce",
    "domain": "kepler-commerce",
    "email_domain": "keplercommerce.com",
    "icon": {
      "image_88": "https://..."
    }
  }
}
```

**MCP метод:** ❌ Нет прямого MCP метода

---

## Административные функции

### 22. admin.users.list - Список пользователей (Enterprise Grid)

**Описание:** Список пользователей в Enterprise Grid организации.

**Метод:** `GET https://slack.com/api/admin.users.list`

**Параметры:**
- `team_id` (required) - Team/Workspace ID
- `limit` (optional) - Максимум результатов
- `cursor` (optional) - Курсор для пагинации

**Требуется:** Enterprise Grid и admin токен

**MCP метод:** ❌ Нет прямого MCP метода

---

### 23. admin.users.setAdmin - Сделать пользователя админом

**Описание:** Назначает пользователя администратором workspace.

**Метод:** `POST https://slack.com/api/admin.users.setAdmin`

**Параметры:**
- `team_id` (required) - Team ID
- `user_id` (required) - User ID

**Требуется:** Enterprise Grid

**MCP метод:** ❌ Нет прямого MCP метода

---

### 24. admin.conversations.create - Создать канал (Admin API)

**Описание:** Создает канал через Admin API (Enterprise Grid).

**Метод:** `POST https://slack.com/api/admin.conversations.create`

**Параметры:**
- `is_private` (required) - Приватный канал? (true/false)
- `name` (required) - Имя канала
- `team_id` (required) - Team ID

**Требуется:** Enterprise Grid

**MCP метод:** ❌ Нет прямого MCP метода

---

## MCP Server для Slack

### Доступные MCP методы

MCP Server для Slack предоставляет следующие методы:

| MCP Метод | Описание | API Эквивалент |
|-----------|----------|----------------|
| `mcp__slack__channels_list` | Список каналов | conversations.list |
| `mcp__slack__conversations_add_message` | Отправить сообщение | chat.postMessage |
| `mcp__slack__conversations_history` | История сообщений | conversations.history |
| `mcp__slack__conversations_replies` | Ответы в треде | conversations.replies |
| `mcp__slack__conversations_search_messages` | Поиск сообщений | search.messages |

### Примеры использования MCP

#### 1. Получить список каналов
```javascript
mcp__slack__channels_list({
  channel_types: "public_channel,private_channel,im,mpim",
  limit: 100,
  sort: "popularity"
})
```

#### 2. Отправить сообщение
```javascript
mcp__slack__conversations_add_message({
  channel_id: "#general",
  payload: "Hello team!",
  content_type: "text/markdown"
})
```

#### 3. Получить историю канала
```javascript
mcp__slack__conversations_history({
  channel_id: "C087E8S6CUQ",
  limit: "50",
  include_activity_messages: false
})
```

#### 4. Поиск сообщений
```javascript
mcp__slack__conversations_search_messages({
  search_query: "project deadline",
  filter_in_channel: "#product",
  filter_date_after: "2025-01-01",
  filter_users_from: "@john",
  limit: 20
})
```

---

## Примеры использования

### Пример 1: Добавить пользователей в канал

```bash
#!/bin/bash
# Добавить несколько пользователей в канал #product

CHANNEL_ID="C087E8S6CUQ"
USERS="U084MJ9C28M,U0853QW4538,U085VN6PJ6A"

curl -X POST "https://slack.com/api/conversations.invite" \
  -H "Authorization: Bearer $SLACK_MCP_XOXC_TOKEN" \
  -H "Cookie: d=$SLACK_MCP_XOXD_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"channel\": \"$CHANNEL_ID\",
    \"users\": \"$USERS\"
  }"
```

### Пример 2: Найти всех пользователей не в канале

```bash
#!/bin/bash
# Найти пользователей, которые не состоят в канале

# 1. Получить всех пользователей workspace
curl -X GET "https://slack.com/api/users.list" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Cookie: d=$COOKIE" > all_users.json

# 2. Получить участников канала
curl -X GET "https://slack.com/api/conversations.members?channel=C087E8S6CUQ" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Cookie: d=$COOKIE" > channel_members.json

# 3. Сравнить списки (используйте Python/jq для обработки)
python3 << 'EOF'
import json

with open('all_users.json') as f:
    all_users = json.load(f)

with open('channel_members.json') as f:
    channel_members = set(json.load(f)['members'])

print("Users not in channel:")
for user in all_users['members']:
    if not user['deleted'] and not user['is_bot']:
        if user['id'] not in channel_members:
            print(f"{user['real_name']} ({user['profile']['email']})")
EOF
```

### Пример 3: Массовое создание каналов

```python
import requests
import time

TOKEN = "xoxc-..."
COOKIE = "xoxd-..."
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Cookie": f"d={COOKIE}",
    "Content-Type": "application/json"
}

channels = [
    {"name": "project-alpha", "is_private": False},
    {"name": "project-beta", "is_private": True},
    {"name": "project-gamma", "is_private": False}
]

for channel in channels:
    response = requests.post(
        "https://slack.com/api/conversations.create",
        headers=HEADERS,
        json=channel
    )
    result = response.json()

    if result['ok']:
        print(f"✓ Created: #{channel['name']} (ID: {result['channel']['id']})")
    else:
        print(f"✗ Failed: #{channel['name']} - {result['error']}")

    time.sleep(1)  # Rate limiting
```

### Пример 4: Экспорт участников всех каналов

```python
import requests
import json

TOKEN = "xoxc-..."
COOKIE = "xoxd-..."
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Cookie": f"d={COOKIE}"
}

# Получить все каналы
response = requests.get(
    "https://slack.com/api/conversations.list",
    headers=HEADERS,
    params={"types": "public_channel,private_channel", "limit": 1000}
)
channels = response.json()['channels']

# Для каждого канала получить участников
export_data = {}

for channel in channels:
    if not channel['is_archived']:
        members_response = requests.get(
            "https://slack.com/api/conversations.members",
            headers=HEADERS,
            params={"channel": channel['id']}
        )

        if members_response.json()['ok']:
            export_data[channel['name']] = {
                "id": channel['id'],
                "members": members_response.json()['members'],
                "member_count": len(members_response.json()['members'])
            }

# Сохранить в файл
with open('channel_members_export.json', 'w') as f:
    json.dump(export_data, f, indent=2)

print(f"Exported {len(export_data)} channels")
```

### Пример 5: Автоматическое архивирование неактивных каналов

```python
import requests
from datetime import datetime, timedelta

TOKEN = "xoxc-..."
COOKIE = "xoxd-..."
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Cookie": f"d={COOKIE}"
}

INACTIVE_DAYS = 90  # Архивировать каналы без активности 90+ дней

# Получить все каналы
channels_response = requests.get(
    "https://slack.com/api/conversations.list",
    headers=HEADERS,
    params={"types": "public_channel,private_channel", "exclude_archived": True}
)
channels = channels_response.json()['channels']

current_time = datetime.now().timestamp()
cutoff_time = current_time - (INACTIVE_DAYS * 24 * 60 * 60)

for channel in channels:
    # Получить последнее сообщение
    history_response = requests.get(
        "https://slack.com/api/conversations.history",
        headers=HEADERS,
        params={"channel": channel['id'], "limit": 1}
    )

    if history_response.json()['ok']:
        messages = history_response.json().get('messages', [])

        if messages:
            last_message_ts = float(messages[0]['ts'])

            if last_message_ts < cutoff_time:
                # Архивировать канал
                archive_response = requests.post(
                    "https://slack.com/api/conversations.archive",
                    headers=HEADERS,
                    json={"channel": channel['id']}
                )

                if archive_response.json()['ok']:
                    print(f"✓ Archived: #{channel['name']} (inactive for {INACTIVE_DAYS}+ days)")
                else:
                    print(f"✗ Failed to archive: #{channel['name']}")
```

---

## Troubleshooting

### Частые ошибки и решения

#### 1. `not_authed` - Ошибка аутентификации

**Причина:** Неверный или отсутствующий токен

**Решение:**
- Проверьте токен в `.env` файле
- Убедитесь, что используете оба токена: xoxc и xoxd cookie
- Токены могут истечь - получите новые из браузера

#### 2. `channel_not_found` - Канал не найден

**Причина:** Неверный Channel ID или нет доступа

**Решение:**
- Проверьте Channel ID (должен начинаться с C или G)
- Убедитесь, что пользователь является участником приватного канала
- Используйте `conversations.list` для проверки доступных каналов

#### 3. `cant_invite_self` - Нельзя пригласить себя

**Причина:** Попытка добавить пользователя, который уже в канале

**Решение:**
- Проверьте список участников с `conversations.members`
- Фильтруйте пользователей перед приглашением

#### 4. `rate_limited` - Превышен лимит запросов

**Причина:** Слишком много запросов к API

**Решение:**
- Добавьте задержки между запросами (рекомендуется 1 сек)
- Используйте batch операции где возможно
- Следите за header `Retry-After`

#### 5. `missing_scope` - Недостаточно прав

**Причина:** Токен не имеет необходимых scopes

**Решение:**
- Используйте токен с правильными scopes
- Для браузерных токенов (xoxc) большинство операций доступны
- Для bot/user токенов настройте scopes в приложении

### Лимиты API

| Операция | Лимит |
|----------|-------|
| Общие запросы | ~1 запрос/сек (Tier 1) |
| conversations.history | 20+ запросов/мин |
| chat.postMessage | 1 запрос/сек |
| users.list | 20 запросов/мин |
| Пользователей в invite | До 1000 за раз |

### Получение новых токенов

Для получения xoxc и xoxd токенов:

1. Откройте Slack в браузере (Chrome/Firefox)
2. Откройте DevTools (F12)
3. Перейдите в Network tab
4. Обновите страницу
5. Найдите любой запрос к `api.slack.com`
6. Скопируйте:
   - `Authorization: Bearer xoxc-...` (токен xoxc)
   - Cookie `d=xoxd-...` (токен xoxd)

### Полезные ссылки

- Официальная документация Slack API: https://api.slack.com/methods
- Slack API Explorer: https://api.slack.com/methods/conversations.list/test
- Rate limits: https://api.slack.com/docs/rate-limits
- Block Kit Builder: https://app.slack.com/block-kit-builder

---

## Заключение

Это руководство охватывает все основные операции для администрирования Slack workspace через API.

**Ключевые возможности:**
- ✅ Полное управление пользователями
- ✅ Управление каналами (создание, архивация, настройка)
- ✅ Управление участниками каналов
- ✅ Отправка и управление сообщениями
- ✅ Поиск и аналитика
- ✅ MCP интеграция для автоматизации

**Следующие шаги:**
1. Настройте токены в `.env` файле
2. Протестируйте базовые операции
3. Создайте скрипты автоматизации
4. Интегрируйте с вашими инструментами

**Поддержка:**
- GitHub Issues: https://github.com/slack-mcp-server
- Slack API Community: https://api.slack.com/community

---

Документ обновлен: 2025-10-28
Версия: 1.0.0
