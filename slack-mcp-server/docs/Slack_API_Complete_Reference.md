# Slack API - Полный справочник (200+ методов)

> **Версия:** 2025 | **Обновлено:** 2025-10-28
> **Методов:** 200+ | **Категорий:** 32
> **Для:** AI Agents & Администраторов

---

## 🎯 AI Quick Search Index

**Ищете метод? Используйте Ctrl+F:**
- **Создать канал** → `conversations.create`, `admin.conversations.create`
- **Пригласить пользователя** → `conversations.invite`, `admin.users.invite`
- **Удалить пользователя** → `conversations.kick`
- **Отправить сообщение** → `chat.postMessage`
- **Архивировать канал** → `conversations.archive`
- **Получить участников** → `conversations.members`
- **Поиск сообщений** → `search.messages`, `conversations_search_messages`
- **Список пользователей** → `users.list`
- **Загрузить файл** → `files.getUploadURLExternal` + `files.completeUploadExternal`
- **Получить историю** → `conversations.history`

---

## 📋 Содержание

1. [API Categories Overview](#api-categories-overview)
2. [Admin API Methods](#admin-api-methods) (60+ методов)
3. [Core API Methods](#core-api-methods)
4. [Conversations API](#conversations-api) (20+ методов)
5. [Chat API](#chat-api) (10+ методов)
6. [Users API](#users-api) (15+ методов)
7. [Files API](#files-api) (20+ методов)
8. [Search & Discovery](#search--discovery)
9. [All Other Categories](#all-other-categories)
10. [MCP Server Mapping](#mcp-server-mapping)
11. [Deprecated Methods](#deprecated-methods)

---

## API Categories Overview

| Категория | Методов | Требует Admin | Описание |
|-----------|---------|---------------|----------|
| **admin*** | 60+ | ✅ Enterprise Grid | Управление workspace (users, conversations, apps, analytics) |
| **conversations*** | 20+ | ❌ | Управление каналами и беседами |
| **chat*** | 10+ | ❌ | Отправка и управление сообщениями |
| **users*** | 15+ | ❌ | Управление пользователями |
| **files*** | 20+ | ❌ | Загрузка и управление файлами |
| **search*** | 3 | ❌ | Поиск по сообщениям и файлам |
| **reactions*** | 4 | ❌ | Управление emoji реакциями |
| **pins*** | 3 | ❌ | Закрепление сообщений |
| **stars*** | 3 | ❌ | Избранные сообщения |
| **reminders*** | 4 | ❌ | Напоминания |
| **usergroups*** | 6 | ❌ | Группы пользователей |
| **team*** | 8 | ❌ | Информация о workspace |
| **auth*** | 5 | ❌ | Аутентификация |
| **apps*** | 6 | ❌ | Управление приложениями |
| **bots*** | 2 | ❌ | Информация о ботах |
| **dnd*** | 5 | ❌ | Режим "Не беспокоить" |
| **emoji*** | 1 | ❌ | Список emoji |
| **oauth*** | 3 | ❌ | OAuth токены |
| **calls*** | 5 | ❌ | Управление звонками |
| **bookmarks*** | 4 | ❌ | Закладки в каналах |
| **canvases*** | 3 | ❌ | Canvas документы |
| **views*** | 4 | ❌ | Модальные окна |
| **workflows*** | 3 | ❌ | Workflow автоматизация |
| **dialog*** | 1 | ❌ Deprecated | Диалоговые окна |
| **rtm*** | 2 | ❌ Deprecated | Real-time messaging |
| И другие... | 50+ | Varies | Migration, Functions, OpenID, и др. |

---

## Admin API Methods

> **⚠️ Требует:** Enterprise Grid workspace + admin scopes

### admin.analytics.* (2 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.analytics.getFile` | Получить файл аналитики в JSON формате | `type`, `date` |
| `admin.analytics.getMemberAnalytics` | Получить аналитику по участникам | `team_id`, `date` |

**Пример:**
```bash
curl "https://slack.com/api/admin.analytics.getFile?type=member&date=2025-01-15" \
  -H "Authorization: Bearer xoxp-ADMIN-TOKEN"
```

---

### admin.apps.* (15+ методов)

#### admin.apps.activities.*
| Метод | Описание |
|-------|----------|
| `admin.apps.activities.list` | Список активности приложений |

#### admin.apps.approved.*
| Метод | Описание |
|-------|----------|
| `admin.apps.approved.list` | Список одобренных приложений |

#### admin.apps.config.*
| Метод | Описание |
|-------|----------|
| `admin.apps.config.lookup` | Найти конфигурацию приложения |
| `admin.apps.config.set` | Установить конфигурацию приложения |

#### admin.apps.requests.*
| Метод | Описание |
|-------|----------|
| `admin.apps.requests.list` | Список запросов на установку приложений |
| `admin.apps.requests.cancel` | Отменить запрос |

#### admin.apps.restricted.*
| Метод | Описание |
|-------|----------|
| `admin.apps.restricted.list` | Список ограниченных приложений |

#### admin.apps.* (общие)
| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.apps.approve` | Одобрить приложение | `app_id`, `request_id`, `team_id` |
| `admin.apps.clearResolution` | Очистить резолюцию приложения | `app_id`, `team_id` |
| `admin.apps.restrict` | Ограничить приложение | `app_id`, `request_id`, `team_id` |
| `admin.apps.uninstall` | Удалить приложение | `app_id`, `team_ids` |

**Пример:**
```bash
curl -X POST "https://slack.com/api/admin.apps.approve" \
  -H "Authorization: Bearer xoxp-ADMIN-TOKEN" \
  -d "app_id=A12345&team_id=T12345"
```

---

### admin.auth.policy.* (4 метода)

| Метод | Описание |
|-------|----------|
| `admin.auth.policy.assignEntities` | Назначить политику аутентификации |
| `admin.auth.policy.getEntities` | Получить entity с политикой |
| `admin.auth.policy.removeEntities` | Удалить entity из политики |

---

### admin.barriers.* (4 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.barriers.create` | Создать information barrier | `barriered_from_usergroup_ids`, `primary_usergroup_id`, `restricted_subjects` |
| `admin.barriers.delete` | Удалить barrier | `barrier_id` |
| `admin.barriers.list` | Список barriers | `cursor`, `limit` |
| `admin.barriers.update` | Обновить barrier | `barrier_id`, ... |

---

### admin.conversations.* (20+ методов)

#### admin.conversations.ekm.*
| Метод | Описание |
|-------|----------|
| `admin.conversations.ekm.listOriginalConnectedChannelInfo` | Список EKM каналов |

#### admin.conversations.restrictAccess.*
| Метод | Описание |
|-------|----------|
| `admin.conversations.restrictAccess.addGroup` | Добавить группу с доступом |
| `admin.conversations.restrictAccess.listGroups` | Список групп с доступом |
| `admin.conversations.restrictAccess.removeGroup` | Удалить группу |

#### admin.conversations.whitelist.* (deprecated → restrictAccess)
| Метод | Описание |
|-------|----------|
| `admin.conversations.whitelist.add` | Deprecated - используйте restrictAccess.addGroup |
| `admin.conversations.whitelist.listGroupsLinkedToChannel` | Deprecated |
| `admin.conversations.whitelist.remove` | Deprecated |

#### admin.conversations.* (основные)
| Метод | Описание | Параметры | HTTP |
|-------|----------|-----------|------|
| `admin.conversations.archive` | Архивировать канал | `channel_id` | POST |
| `admin.conversations.bulkArchive` | Массовая архивация | `channel_ids` | POST |
| `admin.conversations.bulkDelete` | Массовое удаление | `channel_ids` | POST |
| `admin.conversations.bulkMove` | Переместить каналы | `channel_ids`, `target_team_id` | POST |
| `admin.conversations.convertToPrivate` | Сделать приватным | `channel_id` | POST |
| `admin.conversations.convertToPublic` | Сделать публичным | `channel_id` | POST |
| `admin.conversations.create` | Создать канал (Admin) | `is_private`, `name`, `team_id` | POST |
| `admin.conversations.delete` | Удалить канал | `channel_id` | POST |
| `admin.conversations.disconnectShared` | Отключить shared канал | `channel_id` | POST |
| `admin.conversations.getConversationPrefs` | Получить настройки | `channel_id` | GET |
| `admin.conversations.getCustomRetention` | Получить retention policy | `channel_id` | GET |
| `admin.conversations.getTeams` | Получить teams канала | `channel_id` | GET |
| `admin.conversations.invite` | Пригласить в канал (Admin) | `channel_id`, `user_ids` | POST |
| `admin.conversations.lookup` | Найти канал по имени | `team_ids`, `last_message_activity_before` | GET |
| `admin.conversations.removeCustomRetention` | Удалить retention policy | `channel_id` | POST |
| `admin.conversations.rename` | Переименовать (Admin) | `channel_id`, `name` | POST |
| `admin.conversations.search` | Поиск каналов | `query`, `team_ids` | GET |
| `admin.conversations.setConversationPrefs` | Установить настройки | `channel_id`, `prefs` | POST |
| `admin.conversations.setCustomRetention` | Установить retention | `channel_id`, `duration_days` | POST |
| `admin.conversations.setTeams` | Установить teams | `channel_id`, `team_id` | POST |
| `admin.conversations.unarchive` | Разархивировать | `channel_id` | POST |

**Примеры:**
```bash
# Создать канал через Admin API
curl -X POST "https://slack.com/api/admin.conversations.create" \
  -H "Authorization: Bearer xoxp-ADMIN-TOKEN" \
  -d "name=new-team-channel&is_private=false&team_id=T12345"

# Массовая архивация
curl -X POST "https://slack.com/api/admin.conversations.bulkArchive" \
  -H "Authorization: Bearer xoxp-ADMIN-TOKEN" \
  -d "channel_ids=C123,C456,C789"

# Поиск каналов
curl "https://slack.com/api/admin.conversations.search?query=project" \
  -H "Authorization: Bearer xoxp-ADMIN-TOKEN"
```

---

### admin.emoji.* (7 методов)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.emoji.add` | Добавить emoji | `name`, `url` |
| `admin.emoji.addAlias` | Добавить alias для emoji | `alias_for`, `name` |
| `admin.emoji.list` | Список custom emoji | `cursor`, `limit` |
| `admin.emoji.remove` | Удалить emoji | `name` |
| `admin.emoji.rename` | Переименовать emoji | `name`, `new_name` |

---

### admin.functions.* (3 метода)

| Метод | Описание |
|-------|----------|
| `admin.functions.list` | Список functions |
| `admin.functions.permissions.lookup` | Проверить permissions |
| `admin.functions.permissions.set` | Установить permissions |

---

### admin.inviteRequests.* (6 методов)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.inviteRequests.approve` | Одобрить запрос | `invite_request_id`, `team_id` |
| `admin.inviteRequests.approved.list` | Список одобренных | `team_id` |
| `admin.inviteRequests.denied.list` | Список отклоненных | `team_id` |
| `admin.inviteRequests.deny` | Отклонить запрос | `invite_request_id`, `team_id` |
| `admin.inviteRequests.list` | Список всех запросов | `team_id` |

---

### admin.roles.* (4 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.roles.addAssignments` | Назначить роли | `entity_ids`, `role_id` |
| `admin.roles.listAssignments` | Список назначений ролей | `role_ids` |
| `admin.roles.removeAssignments` | Удалить назначения | `entity_ids`, `role_id` |

---

### admin.teams.* (13 методов)

#### admin.teams.admins.*
| Метод | Описание |
|-------|----------|
| `admin.teams.admins.list` | Список админов team |

#### admin.teams.owners.*
| Метод | Описание |
|-------|----------|
| `admin.teams.owners.list` | Список владельцев team |

#### admin.teams.settings.*
| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.teams.settings.info` | Получить настройки team | `team_id` |
| `admin.teams.settings.setDefaultChannels` | Установить каналы по умолчанию | `channel_ids`, `team_id` |
| `admin.teams.settings.setDescription` | Установить описание | `description`, `team_id` |
| `admin.teams.settings.setDiscoverability` | Настроить видимость | `discoverability`, `team_id` |
| `admin.teams.settings.setIcon` | Установить иконку | `image_url`, `team_id` |
| `admin.teams.settings.setName` | Установить имя | `name`, `team_id` |

#### admin.teams.* (основные)
| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.teams.create` | Создать team | `team_domain`, `team_name` |
| `admin.teams.list` | Список teams | `cursor`, `limit` |

---

### admin.usergroups.* (3 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.usergroups.addChannels` | Добавить каналы в usergroup | `channel_ids`, `usergroup_id` |
| `admin.usergroups.addTeams` | Добавить teams | `team_ids`, `usergroup_id` |
| `admin.usergroups.listChannels` | Список каналов usergroup | `usergroup_id` |
| `admin.usergroups.removeChannels` | Удалить каналы | `channel_ids`, `usergroup_id` |

---

### admin.users.* (15+ методов)

#### admin.users.session.*
| Метод | Описание | Параметры |
|-------|----------|-----------|
| `admin.users.session.clearSettings` | Очистить настройки сессии | `user_ids` |
| `admin.users.session.getSettings` | Получить настройки сессии | `user_ids` |
| `admin.users.session.invalidate` | Инвалидировать сессию | `session_id`, `team_id` |
| `admin.users.session.list` | Список сессий пользователя | `cursor`, `limit` |
| `admin.users.session.reset` | Сбросить сессии | `user_id` |
| `admin.users.session.resetBulk` | Массовый сброс сессий | `user_ids` |
| `admin.users.session.setSettings` | Установить настройки | `user_ids`, `desktop_app_browser_quit` |

#### admin.users.unsupportedVersions.*
| Метод | Описание |
|-------|----------|
| `admin.users.unsupportedVersions.export` | Экспорт пользователей с устаревшими версиями |

#### admin.users.* (основные)
| Метод | Описание | Параметры | HTTP |
|-------|----------|-----------|------|
| `admin.users.assign` | Назначить пользователя на workspace | `team_id`, `user_id` | POST |
| `admin.users.invite` | Пригласить пользователя (Admin) | `channel_ids`, `email`, `team_id` | POST |
| `admin.users.list` | Список пользователей (Admin) | `team_id`, `cursor`, `limit` | GET |
| `admin.users.remove` | Удалить пользователя с workspace | `team_id`, `user_id` | POST |
| `admin.users.setAdmin` | Сделать админом | `team_id`, `user_id` | POST |
| `admin.users.setExpiration` | Установить срок действия гостя | `expiration_ts`, `team_id`, `user_id` | POST |
| `admin.users.setOwner` | Сделать владельцем | `team_id`, `user_id` | POST |
| `admin.users.setRegular` | Сделать обычным пользователем | `team_id`, `user_id` | POST |

**Примеры:**
```bash
# Пригласить пользователя
curl -X POST "https://slack.com/api/admin.users.invite" \
  -H "Authorization: Bearer xoxp-ADMIN-TOKEN" \
  -d "email=newuser@example.com&team_id=T12345&channel_ids=C123,C456"

# Сделать админом
curl -X POST "https://slack.com/api/admin.users.setAdmin" \
  -H "Authorization: Bearer xoxp-ADMIN-TOKEN" \
  -d "team_id=T12345&user_id=U98765"

# Сбросить все сессии пользователя
curl -X POST "https://slack.com/api/admin.users.session.reset" \
  -H "Authorization: Bearer xoxp-ADMIN-TOKEN" \
  -d "user_id=U98765"
```

---

### admin.workflows.* (8 методов)

#### admin.workflows.collaborators.*
| Метод | Описание |
|-------|----------|
| `admin.workflows.collaborators.add` | Добавить коллабораторов в workflow |
| `admin.workflows.collaborators.remove` | Удалить коллабораторов |

#### admin.workflows.permissions.*
| Метод | Описание |
|-------|----------|
| `admin.workflows.permissions.lookup` | Проверить permissions workflow |

#### admin.workflows.search.*
| Метод | Описание |
|-------|----------|
| `admin.workflows.search.trigger.triggerTypes` | Поиск trigger types |

#### admin.workflows.* (основные)
| Метод | Описание |
|-------|----------|
| `admin.workflows.unpublish` | Отменить публикацию workflow |

---

## Core API Methods

### api.* (1 метод)

| Метод | Описание | Параметры | HTTP |
|-------|----------|-----------|------|
| `api.test` | Тестовый метод для проверки API | `error`, `foo` | GET/POST |

**Пример:**
```bash
curl "https://slack.com/api/api.test?foo=bar"
# Response: {"ok": true, "args": {"foo": "bar"}}
```

---

## Conversations API

> **Основная** категория для работы с каналами

| Метод | Описание | Параметры | HTTP | Scope |
|-------|----------|-----------|------|-------|
| `conversations.acceptSharedInvite` | Принять shared invite | `channel_name`, `invite_id` | POST | channels:manage |
| `conversations.approveSharedInvite` | Одобрить shared invite | `invite_id` | POST | channels:manage |
| `conversations.archive` | Архивировать канал | `channel` | POST | channels:manage |
| `conversations.close` | Закрыть direct message или MPIM | `channel` | POST | channels:write |
| `conversations.create` | Создать канал | `name`, `is_private` | POST | channels:manage |
| `conversations.declineSharedInvite` | Отклонить shared invite | `invite_id` | POST | channels:manage |
| `conversations.externalInvitePermissions.set` | Установить external invite permissions | `action`, `channel`, `target_team` | POST | N/A |
| `conversations.history` | Получить историю сообщений | `channel`, `cursor`, `inclusive`, `latest`, `limit`, `oldest` | GET | channels:history |
| `conversations.info` | Информация о канале | `channel`, `include_locale`, `include_num_members` | GET | channels:read |
| `conversations.invite` | Пригласить пользователей (1-1000) | `channel`, `users` | POST | channels:manage |
| `conversations.inviteShared` | Пригласить в shared канал | `channel`, `emails`, `user_ids` | POST | channels:manage |
| `conversations.join` | Присоединиться к каналу | `channel` | POST | channels:write |
| `conversations.kick` | Удалить пользователя из канала | `channel`, `user` | POST | channels:manage |
| `conversations.leave` | Покинуть канал | `channel` | POST | channels:write |
| `conversations.list` | Список каналов | `cursor`, `exclude_archived`, `limit`, `team_id`, `types` | GET | channels:read |
| `conversations.listConnectInvites` | Список Connect invites | `count`, `cursor`, `team_id` | GET | N/A |
| `conversations.mark` | Отметить канал как прочитанный | `channel`, `ts` | POST | channels:write |
| `conversations.members` | Список участников канала | `channel`, `cursor`, `limit` | GET | channels:read |
| `conversations.open` | Открыть или создать DM/MPIM | `channel`, `return_im`, `users` | POST | channels:write |
| `conversations.rename` | Переименовать канал | `channel`, `name` | POST | channels:manage |
| `conversations.replies` | Получить ответы в треде | `channel`, `ts`, `cursor`, `inclusive`, `latest`, `limit`, `oldest` | GET | channels:history |
| `conversations.requestSharedInvite.approve` | Одобрить запрос на shared invite | `invite_id` | POST | N/A |
| `conversations.requestSharedInvite.deny` | Отклонить запрос | `invite_id` | POST | N/A |
| `conversations.requestSharedInvite.list` | Список запросов | `cursor`, `user_id` | GET | N/A |
| `conversations.setPurpose` | Установить описание канала | `channel`, `purpose` | POST | channels:manage |
| `conversations.setTopic` | Установить тему канала | `channel`, `topic` | POST | channels:manage |
| `conversations.unarchive` | Разархивировать канал | `channel` | POST | channels:manage |

**Примеры:**
```bash
# Создать приватный канал
curl -X POST "https://slack.com/api/conversations.create" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "name=secret-project&is_private=true"

# Пригласить несколько пользователей
curl -X POST "https://slack.com/api/conversations.invite" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&users=U111,U222,U333"

# Получить историю с пагинацией
curl "https://slack.com/api/conversations.history?channel=C12345&limit=100" \
  -H "Authorization: Bearer xoxb-TOKEN"

# Переименовать канал
curl -X POST "https://slack.com/api/conversations.rename" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&name=renamed-channel"
```

---

## Chat API

| Метод | Описание | Параметры | HTTP | Scope |
|-------|----------|-----------|------|-------|
| `chat.delete` | Удалить сообщение | `channel`, `ts` | POST | chat:write |
| `chat.deleteScheduledMessage` | Удалить отложенное сообщение | `channel`, `scheduled_message_id` | POST | chat:write |
| `chat.getPermalink` | Получить permalink сообщения | `channel`, `message_ts` | GET | N/A |
| `chat.meMessage` | Отправить /me сообщение | `channel`, `text` | POST | chat:write |
| `chat.postEphemeral` | Отправить ephemeral (видно только одному) | `channel`, `user`, `text` | POST | chat:write |
| `chat.postMessage` | Отправить сообщение | `channel`, `text`, `attachments`, `blocks`, `thread_ts` | POST | chat:write |
| `chat.scheduleMessage` | Запланировать сообщение | `channel`, `post_at`, `text` | POST | chat:write |
| `chat.scheduledMessages.list` | Список отложенных сообщений | `channel`, `cursor`, `latest`, `limit`, `oldest` | GET | N/A |
| `chat.unfurl` | Развернуть ссылку в сообщении | `channel`, `ts`, `unfurls` | POST | links:write |
| `chat.update` | Обновить сообщение | `channel`, `ts`, `text`, `attachments`, `blocks` | POST | chat:write |

**Примеры:**
```bash
# Отправить простое сообщение
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&text=Hello World!"

# Отправить сообщение с Block Kit
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C12345",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Bold text* and _italic_"
        }
      }
    ]
  }'

# Ответить в треде
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&text=Reply&thread_ts=1234567890.123456"

# Обновить сообщение
curl -X POST "https://slack.com/api/chat.update" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&ts=1234567890.123456&text=Updated text"

# Запланировать сообщение на завтра 9:00
curl -X POST "https://slack.com/api/chat.scheduleMessage" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&text=Good morning!&post_at=1735718400"

# Ephemeral сообщение (видно только одному пользователю)
curl -X POST "https://slack.com/api/chat.postEphemeral" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&user=U12345&text=This is only visible to you"
```

---

## Users API

| Метод | Описание | Параметры | HTTP | Scope |
|-------|----------|-----------|------|-------|
| `users.conversations` | Список каналов пользователя | `cursor`, `exclude_archived`, `limit`, `types`, `user` | GET | channels:read |
| `users.deletePhoto` | Удалить фото профиля | - | POST | users.profile:write |
| `users.getPresence` | Получить presence статус | `user` | GET | users:read |
| `users.identity` | Информация об identity | - | GET | identity.basic |
| `users.info` | Информация о пользователе | `user`, `include_locale` | GET | users:read |
| `users.list` | Список всех пользователей | `cursor`, `include_locale`, `limit`, `team_id` | GET | users:read |
| `users.lookupByEmail` | Найти пользователя по email | `email` | GET | users:read.email |
| `users.prefs.get` | Получить preferences пользователя | - | GET | users:read |
| `users.profile.get` | Получить профиль | `include_labels`, `user` | GET | users.profile:read |
| `users.profile.set` | Установить поля профиля | `name`, `profile`, `user`, `value` | POST | users.profile:write |
| `users.setActive` | ⚠️ Deprecated - больше не работает | - | POST | N/A |
| `users.setPhoto` | Установить фото профиля | `image` | POST | users.profile:write |
| `users.setPresence` | Установить presence (auto/away) | `presence` | POST | users:write |

**Примеры:**
```bash
# Получить список всех пользователей
curl "https://slack.com/api/users.list?limit=100" \
  -H "Authorization: Bearer xoxb-TOKEN"

# Информация о конкретном пользователе
curl "https://slack.com/api/users.info?user=U12345" \
  -H "Authorization: Bearer xoxb-TOKEN"

# Найти пользователя по email
curl "https://slack.com/api/users.lookupByEmail?email=john@example.com" \
  -H "Authorization: Bearer xoxb-TOKEN"

# Обновить статус профиля
curl -X POST "https://slack.com/api/users.profile.set" \
  -H "Authorization: Bearer xoxp-USER-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "status_text": "In a meeting",
      "status_emoji": ":calendar:",
      "status_expiration": 1735718400
    }
  }'

# Установить presence
curl -X POST "https://slack.com/api/users.setPresence" \
  -H "Authorization: Bearer xoxp-USER-TOKEN" \
  -d "presence=away"
```

---

## Files API

> **⚠️ ВАЖНО:** `files.upload` deprecated! Используйте новый flow:
> 1. `files.getUploadURLExternal`
> 2. HTTP POST to URL
> 3. `files.completeUploadExternal`

| Метод | Описание | Параметры | HTTP | Scope |
|-------|----------|-----------|------|-------|
| `files.comments.delete` | ⚠️ Deprecated | - | POST | files:write |
| `files.completeUploadExternal` | Завершить загрузку файла | `files`, `channel_id`, `initial_comment` | POST | files:write |
| `files.delete` | Удалить файл | `file` | POST | files:write |
| `files.getUploadURLExternal` | Получить URL для загрузки | `filename`, `length`, `alt_txt`, `snippet_type` | GET | files:write |
| `files.info` | Информация о файле | `file`, `count`, `cursor`, `limit`, `page` | GET | files:read |
| `files.list` | Список файлов | `channel`, `count`, `page`, `show_files_hidden_by_limit`, `team_id`, `ts_from`, `ts_to`, `types`, `user` | GET | files:read |
| `files.remote.add` | Добавить remote файл | `external_id`, `external_url`, `title` | POST | remote_files:write |
| `files.remote.info` | Информация о remote файле | `external_id`, `file` | GET | remote_files:read |
| `files.remote.list` | Список remote файлов | `channel`, `cursor`, `limit`, `ts_from`, `ts_to` | GET | remote_files:read |
| `files.remote.remove` | Удалить remote файл | `external_id`, `file` | POST | remote_files:write |
| `files.remote.share` | Поделиться remote файлом | `channels`, `external_id`, `file` | GET | remote_files:share |
| `files.remote.update` | Обновить remote файл | `external_id`, `file`, `external_url`, `title` | POST | remote_files:write |
| `files.revokePublicURL` | Отозвать публичный URL | `file` | POST | files:write |
| `files.sharedPublicURL` | Включить публичный доступ | `file` | POST | files:write |
| `files.upload` | ⚠️ Deprecated с 11.03.2025 | - | POST | files:write |

**Современный flow загрузки файла:**
```bash
# Шаг 1: Получить URL для загрузки
RESPONSE=$(curl "https://slack.com/api/files.getUploadURLExternal?filename=report.pdf&length=524288" \
  -H "Authorization: Bearer xoxb-TOKEN")

UPLOAD_URL=$(echo $RESPONSE | jq -r '.upload_url')
FILE_ID=$(echo $RESPONSE | jq -r '.file_id')

# Шаг 2: Загрузить файл на полученный URL
curl -X POST "$UPLOAD_URL" \
  -F "file=@/path/to/report.pdf"

# Шаг 3: Завершить загрузку и поделиться в канале
curl -X POST "https://slack.com/api/files.completeUploadExternal" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"files\": [{\"id\": \"$FILE_ID\", \"title\": \"Q1 Report\"}],
    \"channel_id\": \"C12345\",
    \"initial_comment\": \"Here is the quarterly report\"
  }"
```

**Другие примеры:**
```bash
# Список файлов в канале
curl "https://slack.com/api/files.list?channel=C12345&count=50" \
  -H "Authorization: Bearer xoxb-TOKEN"

# Информация о файле
curl "https://slack.com/api/files.info?file=F12345" \
  -H "Authorization: Bearer xoxb-TOKEN"

# Удалить файл
curl -X POST "https://slack.com/api/files.delete" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "file=F12345"

# Добавить remote файл (например, из Google Drive)
curl -X POST "https://slack.com/api/files.remote.add" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "external_id=gdrive-123&external_url=https://drive.google.com/file/d/123&title=Spreadsheet"
```

---

## Search & Discovery

### search.* (3 метода)

| Метод | Описание | Параметры | HTTP | Scope |
|-------|----------|-----------|------|-------|
| `search.all` | Поиск по всему (сообщения + файлы) | `query`, `count`, `highlight`, `page`, `sort`, `sort_dir`, `team_id` | GET | search:read |
| `search.files` | Поиск по файлам | `query`, `count`, `highlight`, `page`, `sort`, `sort_dir`, `team_id` | GET | search:read |
| `search.messages` | Поиск по сообщениям | `query`, `count`, `highlight`, `page`, `sort`, `sort_dir`, `team_id` | GET | search:read |

**Примеры:**
```bash
# Поиск сообщений с ключевыми словами
curl "https://slack.com/api/search.messages?query=project+deadline&count=20" \
  -H "Authorization: Bearer xoxp-USER-TOKEN"

# Поиск в конкретном канале
curl "https://slack.com/api/search.messages?query=in:product%20roadmap" \
  -H "Authorization: Bearer xoxp-USER-TOKEN"

# Поиск от конкретного пользователя
curl "https://slack.com/api/search.messages?query=from:@john%20budget" \
  -H "Authorization: Bearer xoxp-USER-TOKEN"

# Поиск файлов
curl "https://slack.com/api/search.files?query=report.pdf" \
  -H "Authorization: Bearer xoxp-USER-TOKEN"
```

---

## All Other Categories

### apps.* (6 методов)

| Метод | Описание |
|-------|----------|
| `apps.activities.list` | Список активности приложений |
| `apps.auth.external.delete` | Удалить external auth |
| `apps.auth.external.get` | Получить external auth |
| `apps.connections.open` | Открыть Socket Mode соединение |
| `apps.event.authorizations.list` | Список авторизаций событий |
| `apps.manifest.create` | Создать приложение из манифеста |
| `apps.manifest.delete` | Удалить манифест |
| `apps.manifest.export` | Экспортировать манифест |
| `apps.manifest.update` | Обновить манифест |
| `apps.manifest.validate` | Валидировать манифест |
| `apps.uninstall` | Удалить приложение |

---

### assistant.* (2 метода)

| Метод | Описание |
|-------|----------|
| `assistant.threads.setStatus` | Установить статус треда |
| `assistant.threads.setSuggestedPrompts` | Установить suggested prompts |

---

### auth.* (5 методов)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `auth.revoke` | Отозвать токен | `test` |
| `auth.teams.list` | Список teams с доступом | `cursor`, `include_icon`, `limit` |
| `auth.test` | Проверить аутентификацию | - |

**Пример:**
```bash
# Проверить токен
curl "https://slack.com/api/auth.test" \
  -H "Authorization: Bearer xoxb-TOKEN"
# Response: {"ok": true, "url": "https://...", "team": "...", "user": "...", "team_id": "...", "user_id": "..."}
```

---

### bookmarks.* (4 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `bookmarks.add` | Добавить закладку в канал | `channel_id`, `title`, `type`, `emoji`, `entity_id`, `link`, `parent_id` |
| `bookmarks.edit` | Редактировать закладку | `bookmark_id`, `channel_id`, `emoji`, `link`, `title` |
| `bookmarks.list` | Список закладок канала | `channel_id` |
| `bookmarks.remove` | Удалить закладку | `bookmark_id`, `channel_id` |

---

### bots.* (2 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `bots.info` | Информация о боте | `bot`, `team_id` |

---

### calls.* (7 методов)

| Метод | Описание |
|-------|----------|
| `calls.add` | Начать звонок |
| `calls.end` | Завершить звонок |
| `calls.info` | Информация о звонке |
| `calls.participants.add` | Добавить участников |
| `calls.participants.remove` | Удалить участников |
| `calls.update` | Обновить звонок |

---

### canvases.* (5 методов)

| Метод | Описание |
|-------|----------|
| `canvases.access.delete` | Удалить доступ к canvas |
| `canvases.access.set` | Установить доступ |
| `canvases.create` | Создать canvas |
| `canvases.delete` | Удалить canvas |
| `canvases.edit` | Редактировать canvas |

---

### dnd.* (5 методов)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `dnd.endDnd` | Выключить DND | - |
| `dnd.endSnooze` | Выключить snooze | - |
| `dnd.info` | Информация о DND пользователя | `user` |
| `dnd.setSnooze` | Включить snooze | `num_minutes` |
| `dnd.teamInfo` | DND для нескольких пользователей | `users` |

---

### emoji.* (1 метод)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `emoji.list` | Список custom emoji | `include_categories` |

---

### functions.* (2 метода)

| Метод | Описание |
|-------|----------|
| `functions.completeError` | Завершить с ошибкой |
| `functions.completeSuccess` | Завершить успешно |

---

### migration.* (1 метод)

| Метод | Описание |
|-------|----------|
| `migration.exchange` | Обменять legacy token |

---

### oauth.* (3 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `oauth.access` | ⚠️ Deprecated - используйте oauth.v2.access | - |
| `oauth.v2.access` | Получить access token | `client_id`, `client_secret`, `code`, `redirect_uri` |
| `oauth.v2.exchange` | Обменять bot на user token | `client_id`, `client_secret`, `token` |

---

### openid.connect.* (2 метода)

| Метод | Описание |
|-------|----------|
| `openid.connect.token` | Получить OpenID Connect token |
| `openid.connect.userInfo` | Получить user info через OpenID |

---

### pins.* (3 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `pins.add` | Закрепить сообщение | `channel`, `timestamp` |
| `pins.list` | Список закрепленных | `channel` |
| `pins.remove` | Открепить сообщение | `channel`, `timestamp` |

---

### reactions.* (4 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `reactions.add` | Добавить реакцию | `channel`, `name`, `timestamp` |
| `reactions.get` | Получить реакции сообщения | `channel`, `timestamp` |
| `reactions.list` | Список реакций пользователя | `count`, `cursor`, `full`, `limit`, `page`, `team_id`, `user` |
| `reactions.remove` | Удалить реакцию | `name`, `channel`, `timestamp` |

**Примеры:**
```bash
# Добавить 👍 реакцию
curl -X POST "https://slack.com/api/reactions.add" \
  -H "Authorization: Bearer xoxb-TOKEN" \
  -d "channel=C12345&name=+1&timestamp=1234567890.123456"

# Получить все реакции на сообщение
curl "https://slack.com/api/reactions.get?channel=C12345&timestamp=1234567890.123456" \
  -H "Authorization: Bearer xoxb-TOKEN"
```

---

### reminders.* (4 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `reminders.add` | Создать напоминание | `text`, `time`, `team_id`, `user` |
| `reminders.complete` | Отметить как выполненное | `reminder` |
| `reminders.delete` | Удалить напоминание | `reminder` |
| `reminders.info` | Информация о напоминании | `reminder` |
| `reminders.list` | Список напоминаний | `team_id` |

---

### rtm.* (2 метода) ⚠️ Deprecated

| Метод | Описание |
|-------|----------|
| `rtm.connect` | Deprecated - используйте Socket Mode |
| `rtm.start` | Deprecated - используйте Socket Mode |

---

### stars.* (3 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `stars.add` | Добавить в избранное | `channel`, `timestamp` |
| `stars.list` | Список избранного | `count`, `cursor`, `limit`, `page`, `team_id` |
| `stars.remove` | Удалить из избранного | `channel`, `timestamp` |

---

### team.* (8 методов)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `team.accessLogs` | Логи доступа (Enterprise) | `before`, `count`, `cursor`, `limit`, `page`, `team_id` |
| `team.billableInfo` | Биллинг информация | `team_id`, `user` |
| `team.billing.info` | Биллинг инфо team | `team_id` |
| `team.externalTeams.disconnect` | Отключить external team | `target_team` |
| `team.externalTeams.list` | Список external teams | `connection_status_filter`, `cursor`, `limit`, `slack_connect_pref_filter`, `sort_direction`, `sort_field`, `workspace_filter` |
| `team.info` | Информация о team | `domain`, `team` |
| `team.integrationLogs` | Логи интеграций | `app_id`, `change_type`, `count`, `page`, `service_id`, `team_id`, `user` |
| `team.preferences.list` | Preferences team | `team_id` |

---

### usergroups.* (6 методов)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `usergroups.create` | Создать группу | `name`, `channels`, `description`, `handle`, `include_count`, `team_id` |
| `usergroups.disable` | Отключить группу | `usergroup` |
| `usergroups.enable` | Включить группу | `usergroup` |
| `usergroups.list` | Список групп | `include_count`, `include_disabled`, `include_users`, `team_id` |
| `usergroups.update` | Обновить группу | `usergroup`, `channels`, `description`, `handle`, `include_count`, `name` |
| `usergroups.users.list` | Участники группы | `usergroup`, `include_disabled`, `team_id` |
| `usergroups.users.update` | Обновить участников | `usergroup`, `users` |

**Примеры:**
```bash
# Создать usergroup
curl -X POST "https://slack.com/api/usergroups.create" \
  -H "Authorization: Bearer xoxp-USER-TOKEN" \
  -d "name=engineering&handle=eng&description=Engineering team"

# Добавить пользователей в группу
curl -X POST "https://slack.com/api/usergroups.users.update" \
  -H "Authorization: Bearer xoxp-USER-TOKEN" \
  -d "usergroup=S12345&users=U111,U222,U333"
```

---

### views.* (4 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `views.open` | Открыть модальное окно | `trigger_id`, `view` |
| `views.publish` | Опубликовать Home tab | `user_id`, `view` |
| `views.push` | Добавить view в stack | `trigger_id`, `view` |
| `views.update` | Обновить существующий view | `view`, `external_id`, `hash`, `view_id` |

---

### workflows.* (3 метода)

| Метод | Описание | Параметры |
|-------|----------|-----------|
| `workflows.stepCompleted` | Отметить шаг как завершенный | `workflow_step_execute_id`, `outputs` |
| `workflows.stepFailed` | Отметить шаг как failed | `error`, `workflow_step_execute_id` |
| `workflows.updateStep` | Обновить конфигурацию шага | `workflow_step_edit_id`, `inputs`, `outputs` |

---

## MCP Server Mapping

Slack MCP Server предоставляет **5 методов** из 200+:

| MCP Метод | API Эквивалент | Описание |
|-----------|----------------|----------|
| `mcp__slack__channels_list` | `conversations.list` | Список каналов с фильтрами |
| `mcp__slack__conversations_add_message` | `chat.postMessage` | Отправить сообщение |
| `mcp__slack__conversations_history` | `conversations.history` | История сообщений канала |
| `mcp__slack__conversations_replies` | `conversations.replies` | Ответы в треде |
| `mcp__slack__conversations_search_messages` | `search.messages` | Поиск с фильтрами |

### Для всех остальных операций используйте прямые API вызовы!

**Шаблон API запроса:**
```bash
curl -X GET/POST "https://slack.com/api/METHOD_NAME" \
  -H "Authorization: Bearer $SLACK_TOKEN" \
  -H "Cookie: d=$SLACK_COOKIE" \
  -H "Content-Type: application/json" \
  -d '{"param": "value"}'
```

---

## Deprecated Methods

⚠️ **Не используйте эти методы:**

| Deprecated метод | Замена | Дата удаления |
|------------------|--------|---------------|
| `files.upload` | `files.getUploadURLExternal` + `files.completeUploadExternal` | 11.03.2025 |
| `files.comments.*` | Используйте thread replies | Удалено |
| `users.setActive` | Нет замены | Удалено |
| `channels.*` | `conversations.*` | 2021 |
| `groups.*` | `conversations.*` | 2021 |
| `im.*` | `conversations.*` | 2021 |
| `mpim.*` | `conversations.*` | 2021 |
| `oauth.access` | `oauth.v2.access` | - |
| `rtm.*` | Socket Mode + Events API | - |
| `admin.conversations.whitelist.*` | `admin.conversations.restrictAccess.*` | - |

---

## Quick Reference Tables

### По задачам

| Задача | Метод | Примечание |
|--------|-------|------------|
| Создать канал | `conversations.create` | Обычный |
| Создать канал (Admin) | `admin.conversations.create` | Enterprise Grid |
| Добавить в канал | `conversations.invite` | До 1000 за раз |
| Удалить из канала | `conversations.kick` | - |
| Архивировать | `conversations.archive` | - |
| Переименовать | `conversations.rename` | - |
| Отправить сообщение | `chat.postMessage` | - |
| Удалить сообщение | `chat.delete` | - |
| Получить участников | `conversations.members` | С пагинацией |
| Поиск сообщений | `search.messages` | User token |
| Загрузить файл | `files.getUploadURLExternal` → `completeUploadExternal` | Новый flow |
| Список пользователей | `users.list` | С пагинацией |
| Найти по email | `users.lookupByEmail` | - |
| Добавить реакцию | `reactions.add` | - |
| Закрепить сообщение | `pins.add` | - |

### По HTTP методам

| GET методы (чтение) | POST методы (запись) |
|---------------------|---------------------|
| `conversations.list` | `conversations.create` |
| `conversations.info` | `conversations.invite` |
| `conversations.members` | `conversations.kick` |
| `conversations.history` | `conversations.archive` |
| `users.list` | `chat.postMessage` |
| `users.info` | `chat.delete` |
| `search.messages` | `files.delete` |
| `files.list` | `reactions.add` |
| `team.info` | `pins.add` |

### По Scopes

| Scope | Методы |
|-------|--------|
| `channels:read` | conversations.list, conversations.info, conversations.members |
| `channels:write` | conversations.join, conversations.leave, conversations.open |
| `channels:manage` | conversations.create, conversations.invite, conversations.kick, conversations.archive |
| `channels:history` | conversations.history, conversations.replies |
| `chat:write` | chat.postMessage, chat.update, chat.delete |
| `users:read` | users.list, users.info |
| `users:read.email` | users.lookupByEmail |
| `files:read` | files.list, files.info |
| `files:write` | files.upload (new flow), files.delete |
| `search:read` | search.messages, search.files |

---

## Заключение

Этот справочник содержит **200+ методов Slack API** организованных для быстрого поиска.

### Для AI:
- Используйте Ctrl+F для поиска
- Все методы в формате `category.method`
- Параметры и примеры для каждого метода
- HTTP методы и scopes указаны

### Для администраторов:
- Admin API требует Enterprise Grid
- Browser tokens (xoxc+xoxd) работают для большинства операций
- Bot tokens (xoxb) для автоматизации
- User tokens (xoxp) для user-specific операций

### Следующие шаги:
1. Настройте токены в `.env`
2. Тестируйте методы через `curl`
3. Создавайте скрипты автоматизации
4. Интегрируйте с MCP/AI агентами

---

**Документ обновлен:** 2025-10-28
**Версия:** 2.0.0 (Complete Edition)
**Источник:** https://api.slack.com/methods
**Автор:** Claude Code AI
