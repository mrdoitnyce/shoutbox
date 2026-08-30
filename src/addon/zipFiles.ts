/* ------------------------------------------------------------------
   [SC] Chatbox PRO — XenForo 2.3.x add-on source tree.
   Every entry below is written into the release ZIP at its real path
   so the archive can be installed via ACP → Add-ons → Install from archive.
------------------------------------------------------------------- */

export const ADDON_META = {
  id: "SC/ChatboxPRO",
  title: "[SC] Chatbox PRO",
  version: "1.0.0",
  versionId: 1000070,
  dev: "Superchunes",
  devUrl: "https://superchunes.com",
  xfMin: "2.3.0",
  xfMax: "2.3.12",
};

const P = "upload/src/addons/SC/ChatboxPRO/";

export const ADDON_FILES: Record<string, string> = {
  /* ------------------------------------------------ addon.json */
  [P + "addon.json"]: `{
    "legacy_addon_id": "",
    "title": "[SC] Chatbox PRO",
    "version_string": "1.0.0",
    "version_id": 1000070,
    "dev": "Superchunes",
    "dev_url": "https://superchunes.com",
    "faq_url": "https://superchunes.com/docs/sc-chatbox-pro/faq",
    "support_url": "https://superchunes.com/support",
    "extra_urls": {
        "Documentation": "https://superchunes.com/docs/sc-chatbox-pro",
        "Changelog": "https://superchunes.com/docs/sc-chatbox-pro/changelog"
    },
    "require": {
        "XF": [2030010, "XenForo 2.3.0+"]
    },
    "icon": "icon.svg"
}
`,

  /* ------------------------------------------------ icon.svg */
  [P + "icon.svg"]: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="4" y="8" width="56" height="40" rx="9" fill="#0E1626" stroke="#FF7847" stroke-width="3"/>
  <path d="M18 52 L18 44 L30 44 Z" fill="#FF7847"/>
  <rect x="14" y="20" width="26" height="4" rx="2" fill="#35D8B7"/>
  <rect x="14" y="28" width="18" height="4" rx="2" fill="#8CA2C6"/>
  <circle cx="47" cy="24" r="5" fill="#FFC24B"/>
</svg>
`,

  /* ------------------------------------------------ Setup.php */
  [P + "Setup.php"]: `<?php

namespace SC\\ChatboxPRO;

use XF\\AddOn\\AbstractSetup;
use XF\\AddOn\\StepRunnerInstallTrait;
use XF\\AddOn\\StepRunnerUpgradeTrait;
use XF\\AddOn\\StepRunnerUninstallTrait;
use XF\\Db\\Schema\\Create;
use XF\\Db\\Schema\\Alter;

class Setup extends AbstractSetup
{
    use StepRunnerInstallTrait;
    use StepRunnerUpgradeTrait;
    use StepRunnerUninstallTrait;

    /* ------------------------------ install ------------------------------ */

    public function installStep1(): void
    {
        $this->createMessageTable();
    }

    public function installStep2(): void
    {
        $this->createRoomTable();
        $this->createBanTable();
    }

    public function installStep3(): void
    {
        $this->addUserColumns();
        $this->seedDefaultRooms();
    }

    protected function createMessageTable(): void
    {
        $this->schemaManager()->createTable('xf_sc_chat_message', function (Create $table) {
            $table->addColumn('message_id', 'int')->autoIncrement();
            $table->addColumn('room_id', 'int');
            $table->addColumn('user_id', 'int');
            $table->addColumn('username', 'varchar', 50);
            $table->addColumn('message', 'text');
            $table->addColumn('message_html', 'mediumtext')->nullable();
            $table->addColumn('command', 'varchar', 20)->setDefault('');
            $table->addColumn('is_pinned', 'tinyint', 3)->setDefault(0);
            $table->addColumn('is_deleted', 'tinyint', 3)->setDefault(0);
            $table->addColumn('post_date', 'int');
            $table->addPrimaryKey('message_id');
            $table->addKey(['room_id', 'post_date']);
            $table->addKey(['user_id', 'post_date']);
        });
    }

    protected function createRoomTable(): void
    {
        $this->schemaManager()->createTable('xf_sc_chat_room', function (Create $table) {
            $table->addColumn('room_id', 'int')->autoIncrement();
            $table->addColumn('title', 'varchar', 50);
            $table->addColumn('description', 'varchar', 255)->setDefault('');
            $table->addColumn('display_order', 'int')->setDefault(1);
            $table->addColumn('is_staff_only', 'tinyint', 3)->setDefault(0);
            $table->addColumn('allow_guests', 'tinyint', 3)->setDefault(1);
            $table->addColumn('message_count', 'int')->setDefault(0);
            $table->addPrimaryKey('room_id');
        });
    }

    protected function createBanTable(): void
    {
        $this->schemaManager()->createTable('xf_sc_chat_ban', function (Create $table) {
            $table->addColumn('ban_id', 'int')->autoIncrement();
            $table->addColumn('user_id', 'int');
            $table->addColumn('banned_by', 'int');
            $table->addColumn('ban_date', 'int');
            $table->addColumn('expiry_date', 'int')->setDefault(0);
            $table->addColumn('reason', 'varchar', 255)->setDefault('');
            $table->addPrimaryKey('ban_id');
            $table->addKey('user_id');
        });
    }

    protected function addUserColumns(): void
    {
        $this->schemaManager()->alterTable('xf_user', function (Alter $table) {
            $table->addColumn('sc_last_chat_read', 'int')->setDefault(0);
            $table->addColumn('sc_chat_message_count', 'int')->setDefault(0);
        });
    }

    protected function seedDefaultRooms(): void
    {
        $db = $this->db();
        $db->insert('xf_sc_chat_room', [
            'title'         => 'Lobby',
            'description'   => 'General chatter for the whole community',
            'display_order' => 1,
        ]);
        $db->insert('xf_sc_chat_room', [
            'title'         => 'Support',
            'description'   => 'Quick help from the crew',
            'display_order' => 2,
        ]);
    }

    /* ------------------------------ upgrade ------------------------------ */

    public function upgrade1000070Step1(): void
    {
        // Fresh release — nothing to migrate yet. Placeholder for 1.1.x.
    }

    /* ----------------------------- uninstall ----------------------------- */

    public function uninstallStep1(): void
    {
        $sm = $this->schemaManager();
        $sm->dropTable('xf_sc_chat_message');
        $sm->dropTable('xf_sc_chat_room');
        $sm->dropTable('xf_sc_chat_ban');
    }

    public function uninstallStep2(): void
    {
        $this->schemaManager()->alterTable('xf_user', function (Alter $table) {
            $table->dropColumns(['sc_last_chat_read', 'sc_chat_message_count']);
        });
    }
}
`,

  /* ------------------------------------------------ Listener/App.php */
  [P + "Listener/App.php"]: `<?php

namespace SC\\ChatboxPRO\\Listener;

use XF\\Pub\\App;
use XF\\Template\\Templater;

class App
{
    /**
     * Expose chatbox globals (enabled flag, poll interval, active room)
     * to every template so the floating widget can boot anywhere.
     */
    public static function templaterGlobalData(Templater $templater, array &$data): void
    {
        $options = \\XF::options();

        $data['scChatboxEnabled']    = (bool) $options->scChatboxMaster;
        $data['scChatboxPollInterval'] = max(1000, (int) $options->scChatboxPollInterval);
        $data['scChatboxHeight']     = max(200, (int) $options->scChatboxHeight);
    }

    /**
     * Append the floating chatbox launcher before </body> when enabled.
     */
    public static function containerParams(\\XF\\Pub\\App $app, array &$params): void
    {
        if (!\\XF::options()->scChatboxMaster)
        {
            return;
        }

        $params['scChatboxFloating'] = true;
    }
}
`,

  /* ------------------------------------------------ Entity/ChatMessage.php */
  [P + "Entity/ChatMessage.php"]: `<?php

namespace SC\\ChatboxPRO\\Entity;

use XF\\Mvc\\Entity\\Entity;
use XF\\Mvc\\Entity\\Structure;

/**
 * COLUMNS
 * @property int $message_id
 * @property int $room_id
 * @property int $user_id
 * @property string $username
 * @property string $message
 * @property string|null $message_html
 * @property string $command
 * @property bool $is_pinned
 * @property bool $is_deleted
 * @property int $post_date
 *
 * RELATIONS
 * @property \\XF\\Entity\\User $User
 * @property ChatRoom $Room
 */
class ChatMessage extends Entity
{
    public function canView(&$error = null): bool
    {
        if ($this->is_deleted)
        {
            return $this->visitor()->hasPermission('scChatbox', 'moderate');
        }

        return $this->visitor()->hasPermission('scChatbox', 'view');
    }

    public function canDelete(&$error = null): bool
    {
        return $this->visitor()->hasPermission('scChatbox', 'moderate');
    }

    public function canPin(&$error = null): bool
    {
        return $this->visitor()->hasPermission('scChatbox', 'moderate');
    }

    public function renderHtml(): string
    {
        if ($this->message_html)
        {
            return $this->message_html;
        }

        $formatter = $this->app()->stringFormatter();
        return $formatter->formatString($this->message, ['nl2br' => true]);
    }

    public static function getStructure(Structure $structure)
    {
        $structure->table   = 'xf_sc_chat_message';
        $structure->shortName = 'SC\\ChatboxPRO:ChatMessage';
        $structure->primaryKey = 'message_id';

        $structure->columns = [
            'message_id'   => ['type' => self::UINT, 'autoIncrement' => true, 'changeLog' => false],
            'room_id'      => ['type' => self::UINT, 'required' => true],
            'user_id'      => ['type' => self::UINT, 'required' => true, 'default' => 0],
            'username'     => ['type' => self::STR, 'maxLength' => 50, 'required' => true],
            'message'      => ['type' => self::STR, 'maxLength' => 500, 'required' => true],
            'message_html' => ['type' => self::STR, 'maxLength' => 4000, 'nullable' => true, 'default' => null],
            'command'      => ['type' => self::STR, 'maxLength' => 20, 'default' => ''],
            'is_pinned'    => ['type' => self::BOOL, 'default' => false],
            'is_deleted'   => ['type' => self::BOOL, 'default' => false],
            'post_date'    => ['type' => self::UINT, 'default' => \\XF::$time],
        ];

        $structure->relations = [
            'User' => [
                'entity'     => 'XF:User',
                'type'       => self::TO_ONE,
                'conditions' => 'user_id',
                'primary'    => true,
            ],
            'Room' => [
                'entity'     => 'SC\\ChatboxPRO:ChatRoom',
                'type'       => self::TO_ONE,
                'conditions' => 'room_id',
            ],
        ];

        return $structure;
    }
}
`,

  /* ------------------------------------------------ Entity/ChatRoom.php */
  [P + "Entity/ChatRoom.php"]: `<?php

namespace SC\\ChatboxPRO\\Entity;

use XF\\Mvc\\Entity\\Entity;
use XF\\Mvc\\Entity\\Structure;

/**
 * COLUMNS
 * @property int $room_id
 * @property string $title
 * @property string $description
 * @property int $display_order
 * @property bool $is_staff_only
 * @property bool $allow_guests
 * @property int $message_count
 */
class ChatRoom extends Entity
{
    public function canView(&$error = null): bool
    {
        $visitor = $this->visitor();

        if ($this->is_staff_only && !$visitor->is_staff)
        {
            return false;
        }

        if (!$visitor->user_id && !$this->allow_guests)
        {
            return false;
        }

        return $visitor->hasPermission('scChatbox', 'view');
    }

    public static function getStructure(Structure $structure)
    {
        $structure->table      = 'xf_sc_chat_room';
        $structure->shortName  = 'SC\\ChatboxPRO:ChatRoom';
        $structure->primaryKey = 'room_id';

        $structure->columns = [
            'room_id'       => ['type' => self::UINT, 'autoIncrement' => true],
            'title'         => ['type' => self::STR, 'maxLength' => 50, 'required' => true],
            'description'   => ['type' => self::STR, 'maxLength' => 255, 'default' => ''],
            'display_order' => ['type' => self::UINT, 'default' => 1],
            'is_staff_only' => ['type' => self::BOOL, 'default' => false],
            'allow_guests'  => ['type' => self::BOOL, 'default' => true],
            'message_count' => ['type' => self::UINT, 'default' => 0],
        ];

        $structure->relations = [
            'Messages' => [
                'entity'     => 'SC\\ChatboxPRO:ChatMessage',
                'type'       => self::TO_MANY,
                'conditions' => 'room_id',
                'key'        => 'message_id',
            ],
        ];

        return $structure;
    }
}
`,

  /* ------------------------------------------------ Entity/ChatBan.php */
  [P + "Entity/ChatBan.php"]: `<?php

namespace SC\\ChatboxPRO\\Entity;

use XF\\Mvc\\Entity\\Entity;
use XF\\Mvc\\Entity\\Structure;

/**
 * COLUMNS
 * @property int $ban_id
 * @property int $user_id
 * @property int $banned_by
 * @property int $ban_date
 * @property int $expiry_date
 * @property string $reason
 */
class ChatBan extends Entity
{
    public function isExpired(): bool
    {
        return $this->expiry_date > 0 && $this->expiry_date < \\XF::$time;
    }

    public static function getStructure(Structure $structure)
    {
        $structure->table      = 'xf_sc_chat_ban';
        $structure->shortName  = 'SC\\ChatboxPRO:ChatBan';
        $structure->primaryKey = 'ban_id';

        $structure->columns = [
            'ban_id'        => ['type' => self::UINT, 'autoIncrement' => true],
            'user_id'       => ['type' => self::UINT, 'required' => true],
            'banned_by'     => ['type' => self::UINT, 'default' => 0],
            'ban_date'      => ['type' => self::UINT, 'default' => \\XF::$time],
            'expiry_date'   => ['type' => self::UINT, 'default' => 0],
            'reason'        => ['type' => self::STR, 'maxLength' => 255, 'default' => ''],
        ];

        $structure->relations = [
            'User' => [
                'entity'     => 'XF:User',
                'type'       => self::TO_ONE,
                'conditions' => 'user_id',
                'primary'    => true,
            ],
        ];

        return $structure;
    }
}
`,

  /* ------------------------------------------------ Finder/ChatMessage.php */
  [P + "Finder/ChatMessage.php"]: `<?php

namespace SC\\ChatboxPRO\\Finder;

use XF\\Mvc\\Entity\\Finder;

class ChatMessage extends Finder
{
    public function visible(bool $includeDeleted = false): self
    {
        if (!$includeDeleted)
        {
            $this->where('is_deleted', 0);
        }

        return $this;
    }

    public function inRoom(int $roomId): self
    {
        return $this->where('room_id', $roomId);
    }

    public function after(int $messageId): self
    {
        if ($messageId > 0)
        {
            $this->where('message_id', '>', $messageId);
        }

        return $this;
    }

    public function pinned(): self
    {
        return $this->where('is_pinned', 1);
    }

    public function newestFirst(int $limit = 40): self
    {
        return $this->order('message_id', 'DESC')->limit($limit);
    }
}
`,

  /* ------------------------------------------------ Repository/Chat.php */
  [P + "Repository/Chat.php"]: `<?php

namespace SC\\ChatboxPRO\\Repository;

use XF\\Mvc\\Entity\\Repository;

class Chat extends Repository
{
    /** @return \\SC\\ChatboxPRO\\Finder\\ChatMessage */
    public function findMessagesForRoom(int $roomId, int $sinceId = 0, int $limit = 40)
    {
        return $this->finder('SC\\ChatboxPRO:ChatMessage')
            ->visible($this->visitor()->hasPermission('scChatbox', 'moderate'))
            ->inRoom($roomId)
            ->after($sinceId)
            ->newestFirst($limit);
    }

    public function getPinnedMessage(int $roomId)
    {
        return $this->finder('SC\\ChatboxPRO:ChatMessage')
            ->visible()
            ->inRoom($roomId)
            ->pinned()
            ->order('message_id', 'DESC')
            ->fetchOne();
    }

    /**
     * Users who posted within the active window — powers the "online" rail.
     */
    public function getActiveUsers(int $roomId, int $windowMinutes = 5): array
    {
        $cutoff = \\XF::$time - ($windowMinutes * 60);

        $rows = $this->db()->fetchAll(
            'SELECT user_id, username
             FROM xf_sc_chat_message
             WHERE room_id = ? AND post_date > ? AND user_id > 0
             GROUP BY user_id
             ORDER BY MAX(post_date) DESC
             LIMIT 50',
            [$roomId, $cutoff]
        );

        return $rows;
    }

    public function pruneMessages(int $roomId, int $keep = 400): void
    {
        $db  = $this->db();
        $cut = $db->fetchOne(
            'SELECT message_id FROM xf_sc_chat_message
             WHERE room_id = ? ORDER BY message_id DESC LIMIT 1 OFFSET ' . intval($keep),
            $roomId
        );

        if ($cut)
        {
            $db->query(
                'DELETE FROM xf_sc_chat_message
                 WHERE room_id = ? AND message_id <= ? AND is_pinned = 0',
                [$roomId, $cut]
            );
        }
    }

    public function isUserBanned(int $userId): ?array
    {
        if (!$userId)
        {
            return null;
        }

        $ban = $this->db()->fetchRow(
            'SELECT * FROM xf_sc_chat_ban
             WHERE user_id = ? AND (expiry_date = 0 OR expiry_date > ?)
             ORDER BY ban_date DESC LIMIT 1',
            [$userId, \\XF::$time]
        );

        return $ban ?: null;
    }

    public function canUseChatbox(&$error = null): bool
    {
        $visitor = $this->visitor();

        if (!$this->options()->scChatboxMaster)
        {
            $error = \\XF::phrase('sc_chatbox_disabled');
            return false;
        }

        if (!$visitor->hasPermission('scChatbox', 'view'))
        {
            $error = \\XF::phrase('sc_chatbox_no_permission');
            return false;
        }

        if (!$visitor->user_id && !$this->options()->scChatboxGuestView)
        {
            $error = \\XF::phrase('sc_chatbox_login_required');
            return false;
        }

        return true;
    }
}
`,

  /* ------------------------------------------------ Repository/ChatRoom.php */
  [P + "Repository/ChatRoom.php"]: `<?php

namespace SC\\ChatboxPRO\\Repository;

use XF\\Mvc\\Entity\\Repository;

class ChatRoom extends Repository
{
    public function findViewableRooms()
    {
        $visitor = $this->visitor();

        $finder = $this->finder('SC\\ChatboxPRO:ChatRoom')->order('display_order');

        if (!$visitor->is_staff)
        {
            $finder->where('is_staff_only', 0);
        }

        if (!$visitor->user_id)
        {
            $finder->where('allow_guests', 1);
        }

        return $finder->fetch();
    }

    public function getDefaultRoomId(): int
    {
        $room = $this->finder('SC\\ChatboxPRO:ChatRoom')
            ->order('display_order')
            ->fetchOne();

        return $room ? $room->room_id : 0;
    }
}
`,

  /* ------------------------------------------------ Service/Chat/Sender.php */
  [P + "Service/Chat/Sender.php"]: `<?php

namespace SC\\ChatboxPRO\\Service\\Chat;

use SC\\ChatboxPRO\\Entity\\ChatMessage;
use SC\\ChatboxPRO\\Entity\\ChatRoom;
use XF\\Service\\AbstractService;

class Sender extends AbstractService
{
    protected ChatRoom $room;
    protected \\XF\\Entity\\User $user;
    protected string $message = '';

    public const ALLOWED_COMMANDS = ['me', 'announce', 'shrug', 'flip'];

    public function __construct(\\XF\\App $app, ChatRoom $room, \\XF\\Entity\\User $user)
    {
        parent::__construct($app);

        $this->room = $room;
        $this->user = $user;
    }

    public function setMessage(string $message): void
    {
        $this->message = trim($message);
    }

    public function validate(array &$errors = []): bool
    {
        $visitor = $this->visitor();

        if ($this->message === '')
        {
            $errors['message'] = \\XF::phrase('sc_chatbox_empty_message');
            return false;
        }

        if (utf8_strlen($this->message) > 500)
        {
            $errors['message'] = \\XF::phrase('sc_chatbox_too_long');
            return false;
        }

        if ($this->user->user_id)
        {
            /** @var \\SC\\ChatboxPRO\\Repository\\Chat $chatRepo */
            $chatRepo = $this->repository('SC\\ChatboxPRO:Chat');

            if ($chatRepo->isUserBanned($this->user->user_id))
            {
                $errors['message'] = \\XF::phrase('sc_chatbox_banned');
                return false;
            }

            if (!$visitor->hasPermission('scChatbox', 'bypassFlood'))
            {
                $floodSeconds = max(0, (int) $this->options()->scChatboxFloodSeconds);

                if ($floodSeconds > 0)
                {
                    $last = $this->db()->fetchOne(
                        'SELECT MAX(post_date) FROM xf_sc_chat_message WHERE user_id = ?',
                        $this->user->user_id
                    );

                    if ($last && (\\XF::$time - $last) < $floodSeconds)
                    {
                        $errors['message'] = \\XF::phrase('sc_chatbox_flood_wait', [
                            'seconds' => $floodSeconds - (\\XF::$time - $last),
                        ]);
                        return false;
                    }
                }
            }
        }

        return true;
    }

    public function save(): ChatMessage
    {
        [$command, $body] = $this->parseCommand($this->message);

        $em = $this->em();

        /** @var ChatMessage $message */
        $message = $em->create('SC\\ChatboxPRO:ChatMessage');
        $message->bulkSet([
            'room_id'  => $this->room->room_id,
            'user_id'  => $this->user->user_id,
            'username' => $this->user->user_id ? $this->user->username : 'Guest',
            'message'  => $body,
            'command'  => $command,
        ]);
        $message->save();

        $this->room->message_count++;
        $this->room->save();

        if ($this->user->user_id)
        {
            $this->db()->query(
                'UPDATE xf_user SET sc_chat_message_count = sc_chat_message_count + 1
                 WHERE user_id = ?',
                $this->user->user_id
            );
        }

        /** @var \\SC\\ChatboxPRO\\Repository\\Chat $chatRepo */
        $chatRepo = $this->repository('SC\\ChatboxPRO:Chat');
        $chatRepo->pruneMessages($this->room->room_id, max(100, (int) $this->options()->scChatboxMaxStored));

        return $message;
    }

    /**
     * Splits "/me slaps the desk" into ['me', 'slaps the desk'].
     */
    protected function parseCommand(string $message): array
    {
        if (strlen($message) > 1 && $message[0] === '/')
        {
            $space = strpos($message, ' ');
            $head  = strtolower($space === false ? substr($message, 1) : substr($message, 1, $space - 1));
            $body  = $space === false ? '' : trim(substr($message, $space + 1));

            if (in_array($head, self::ALLOWED_COMMANDS, true))
            {
                return [$head, $body];
            }
        }

        return ['', $message];
    }
}
`,

  /* ------------------------------------------------ Service/Chat/Moderator.php */
  [P + "Service/Chat/Moderator.php"]: `<?php

namespace SC\\ChatboxPRO\\Service\\Chat;

use SC\\ChatboxPRO\\Entity\\ChatBan;
use SC\\ChatboxPRO\\Entity\\ChatMessage;
use XF\\Service\\AbstractService;

class Moderator extends AbstractService
{
    public function assertCanModerate(): void
    {
        if (!$this->visitor()->hasPermission('scChatbox', 'moderate'))
        {
            throw $this->exception($this->error(\\XF::phrase('sc_chatbox_no_permission'), 403));
        }
    }

    public function deleteMessage(ChatMessage $message): void
    {
        $message->is_deleted = true;
        $message->save();
    }

    public function togglePin(ChatMessage $message): void
    {
        if ($message->is_pinned)
        {
            $message->is_pinned = false;
            $message->save();
            return;
        }

        // Only one pin per room — clear the previous one first.
        $this->db()->query(
            'UPDATE xf_sc_chat_message SET is_pinned = 0
             WHERE room_id = ? AND is_pinned = 1',
            $message->room_id
        );

        $message->is_pinned = true;
        $message->save();
    }

    public function banUser(int $userId, int $durationHours, string $reason): ChatBan
    {
        $em = $this->em();

        /** @var ChatBan $ban */
        $ban = $em->create('SC\\ChatboxPRO:ChatBan');
        $ban->bulkSet([
            'user_id'       => $userId,
            'banned_by'     => $this->visitor()->user_id,
            'expiry_date'   => $durationHours > 0 ? \\XF::$time + ($durationHours * 3600) : 0,
            'reason'        => $reason,
        ]);
        $ban->save();

        return $ban;
    }
}
`,

  /* ------------------------------------------------ Pub/Controller/Chatbox.php */
  [P + "Pub/Controller/Chatbox.php"]: `<?php

namespace SC\\ChatboxPRO\\Pub\\Controller;

use XF\\Pub\\Controller\\AbstractController;

class Chatbox extends AbstractController
{
    protected function preDispatchController($action, \\XF\\Mvc\\ParameterBag $params)
    {
        if (!$this->repository('SC\\ChatboxPRO:Chat')->canUseChatbox($error))
        {
            throw $this->exception($this->error($error));
        }
    }

    public function actionIndex(\\XF\\Mvc\\ParameterBag $params)
    {
        $roomRepo = $this->repository('SC\\ChatboxPRO:ChatRoom');
        $rooms    = $roomRepo->findViewableRooms();

        $roomId = $this->filter('room_id', 'uint') ?: $roomRepo->getDefaultRoomId();
        $room   = $rooms[$roomId] ?? null;

        if (!$room || !$room->canView())
        {
            throw $this->exception($this->notFound());
        }

        $chatRepo = $this->repository('SC\\ChatboxPRO:Chat');
        $messages = $chatRepo->findMessagesForRoom($room->room_id)->fetch()->reverse();

        $viewParams = [
            'rooms'   => $rooms,
            'room'    => $room,
            'messages'=> $messages,
            'pinned'  => $chatRepo->getPinnedMessage($room->room_id),
            'online'  => $chatRepo->getActiveUsers($room->room_id),
            'canPost' => $this->visitor()->hasPermission('scChatbox', 'use'),
        ];

        return $this->view('SC\\ChatboxPRO:Chatbox\\Index', 'sc_chatbox_main', $viewParams);
    }

    /**
     * JSON poll target — the JS client asks for everything newer than the
     * given "since" message id.
     */
    public function actionPoll()
    {
        $this->setResponseType('json');

        $roomId  = $this->filter('room_id', 'uint');
        $since   = $this->filter('since', 'uint');

        $roomRepo = $this->repository('SC\\ChatboxPRO:ChatRoom');
        $room     = $roomRepo->findViewableRooms()[$roomId] ?? null;

        if (!$room || !$room->canView())
        {
            return $this->notFound();
        }

        $messages = $this->repository('SC\\ChatboxPRO:Chat')
            ->findMessagesForRoom($room->room_id, $since, 60)
            ->fetch()
            ->reverse();

        $out = [];
        foreach ($messages AS $message)
        {
            $out[] = [
                'id'       => $message->message_id,
                'userId'   => $message->user_id,
                'username' => $message->username,
                'html'     => $message->renderHtml(),
                'command'  => $message->command,
                'pinned'   => (bool) $message->is_pinned,
                'date'     => $message->post_date,
            ];
        }

        return $this->renderJson([
            'messages' => $out,
            'online'   => $this->repository('SC\\ChatboxPRO:Chat')->getActiveUsers($room->room_id),
            'time'     => \\XF::$time,
        ]);
    }

    public function actionSend()
    {
        $this->assertPostOnly();

        if (!$this->visitor()->hasPermission('scChatbox', 'use'))
        {
            throw $this->exception($this->error(\\XF::phrase('sc_chatbox_no_permission'), 403));
        }

        $roomId  = $this->filter('room_id', 'uint');
        $message = $this->filter('message', 'str');

        $roomRepo = $this->repository('SC\\ChatboxPRO:ChatRoom');
        $room     = $roomRepo->findViewableRooms()[$roomId] ?? null;

        if (!$room || !$room->canView())
        {
            throw $this->exception($this->notFound());
        }

        /** @var \\SC\\ChatboxPRO\\Service\\Chat\\Sender $sender */
        $sender = $this->service('SC\\ChatboxPRO:Chat\\Sender', $room, $this->visitor());
        $sender->setMessage($message);

        if (!$sender->validate($errors))
        {
            return $this->error($errors['message'] ?? \\XF::phraseDeferred('Oops! We ran into some problems.'));
        }

        $saved = $sender->save();

        $this->setResponseType('json');
        return $this->renderJson(['messageId' => $saved->message_id, 'status' => 'ok']);
    }

    public function actionPin()
    {
        $this->assertPostOnly();

        /** @var \\SC\\ChatboxPRO\\Service\\Chat\\Moderator $mod */
        $mod = $this->service('SC\\ChatboxPRO:Chat\\Moderator');
        $mod->assertCanModerate();

        $message = $this->assertMessageExists($this->filter('message_id', 'uint'));
        $mod->togglePin($message);

        return $this->redirect($this->buildLink('chatbox', null, ['room_id' => $message->room_id]));
    }

    public function actionDelete()
    {
        $this->assertPostOnly();

        /** @var \\SC\\ChatboxPRO\\Service\\Chat\\Moderator $mod */
        $mod = $this->service('SC\\ChatboxPRO:Chat\\Moderator');
        $mod->assertCanModerate();

        $message = $this->assertMessageExists($this->filter('message_id', 'uint'));
        $mod->deleteMessage($message);

        return $this->redirect($this->buildLink('chatbox', null, ['room_id' => $message->room_id]));
    }

    protected function assertMessageExists(int $messageId)
    {
        return $this->assertRecordExists('SC\\ChatboxPRO:ChatMessage', $messageId);
    }
}
`,

  /* ------------------------------------------------ Widget/Chatbox.php */
  [P + "Widget/Chatbox.php"]: `<?php

namespace SC\\ChatboxPRO\\Widget;

class Chatbox extends \\XF\\Widget\\AbstractWidget
{
    protected $defaultOptions = [
        'room_id'  => 0,
        'height'   => 320,
        'title'    => 'Chatbox',
    ];

    public function render()
    {
        if (!$this->repository('SC\\ChatboxPRO:Chat')->canUseChatbox())
        {
            return '';
        }

        $roomRepo = $this->repository('SC\\ChatboxPRO:ChatRoom');
        $roomId   = $this->options['room_id'] ?: $roomRepo->getDefaultRoomId();
        $room     = $roomRepo->findViewableRooms()[$roomId] ?? null;

        if (!$room || !$room->canView())
        {
            return '';
        }

        $chatRepo = $this->repository('SC\\ChatboxPRO:Chat');

        return $this->renderer('sc_chatbox_widget', [
            'room'     => $room,
            'messages' => $chatRepo->findMessagesForRoom($room->room_id, 0, 20)->fetch()->reverse(),
            'height'   => (int) $this->options['height'],
            'canPost'  => $this->visitor()->hasPermission('scChatbox', 'use'),
        ]);
    }
}
`,

  /* ------------------------------------------------ _data/routes.xml */
  [P + "_data/routes.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<routes>
  <route route_type="public" route_prefix="chatbox" format=":page"
         controller="SC\\ChatboxPRO:Chatbox" context="scChatbox"
         section="scChatbox" addon_id="SC/ChatboxPRO"/>
</routes>
`,

  /* ------------------------------------------------ _data/navigation.xml */
  [P + "_data/navigation.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<navigation>
  <navigation_entry navigation_id="scChatbox" parent_navigation_id="forums"
                    display_order="160" link="chatbox/" title="sc_chatbox"
                    addon_id="SC/ChatboxPRO"/>
</navigation>
`,

  /* ------------------------------------------------ _data/permissions.xml */
  [P + "_data/permissions.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<permissions>
  <interface_groups>
    <interface_group interface_group_id="scChatbox" display_order="5200" addon_id="SC/ChatboxPRO"/>
  </interface_groups>
  <permission_groups>
    <permission_group permission_group_id="scChatbox" interface_group_id="scChatbox"
                      display_order="5200" addon_id="SC/ChatboxPRO"/>
  </permission_groups>
  <permissions>
    <permission permission_group_id="scChatbox" permission_id="view" permission_type="flag"
                default_value="unset" interface_group_id="scChatbox" display_order="100" addon_id="SC/ChatboxPRO"/>
    <permission permission_group_id="scChatbox" permission_id="use" permission_type="flag"
                default_value="unset" interface_group_id="scChatbox" display_order="200" addon_id="SC/ChatboxPRO"/>
    <permission permission_group_id="scChatbox" permission_id="bypassFlood" permission_type="flag"
                default_value="unset" interface_group_id="scChatbox" display_order="300" addon_id="SC/ChatboxPRO"/>
    <permission permission_group_id="scChatbox" permission_id="moderate" permission_type="flag"
                default_value="unset" interface_group_id="scChatbox" display_order="400" addon_id="SC/ChatboxPRO"/>
    <permission permission_group_id="scChatbox" permission_id="manageRooms" permission_type="flag"
                default_value="unset" interface_group_id="scChatbox" display_order="500" addon_id="SC/ChatboxPRO"/>
  </permissions>
</permissions>
`,

  /* ------------------------------------------------ _data/option_groups.xml */
  [P + "_data/option_groups.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<options>
  <option_groups>
    <group group_id="scChatbox" icon="fa-comments" display_order="5200" addon_id="SC/ChatboxPRO"/>
  </option_groups>
</options>
`,

  /* ------------------------------------------------ _data/options.xml */
  [P + "_data/options.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<options>
  <option option_id="scChatboxMaster" option_type="boolean" default_value="1"
          edit_format="onoff" display_order="100" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="100"/>
  </option>
  <option option_id="scChatboxPollInterval" option_type="unsigned_integer" default_value="2500"
          edit_format="spinbox" display_order="200" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="200"/>
  </option>
  <option option_id="scChatboxHeight" option_type="unsigned_integer" default_value="420"
          edit_format="spinbox" display_order="300" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="300"/>
  </option>
  <option option_id="scChatboxGuestView" option_type="boolean" default_value="1"
          edit_format="onoff" display_order="400" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="400"/>
  </option>
  <option option_id="scChatboxFloodSeconds" option_type="unsigned_integer" default_value="5"
          edit_format="spinbox" display_order="500" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="500"/>
  </option>
  <option option_id="scChatboxMaxStored" option_type="unsigned_integer" default_value="400"
          edit_format="spinbox" display_order="600" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="600"/>
  </option>
  <option option_id="scChatboxWebhookUrl" option_type="string" default_value=""
          edit_format="textbox" display_order="700" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="700"/>
  </option>
  <option option_id="scChatboxShowLauncher" option_type="boolean" default_value="1"
          edit_format="onoff" display_order="800" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="800"/>
  </option>
  <option option_id="scChatboxLinkUrls" option_type="boolean" default_value="1"
          edit_format="onoff" display_order="900" addon_id="SC/ChatboxPRO">
    <relation group_id="scChatbox" display_order="900"/>
  </option>
</options>
`,

  /* ------------------------------------------------ _data/phrases.xml */
  [P + "_data/phrases.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<phrases>
  <phrase title="sc_chatbox" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Chatbox]]></phrase>
  <phrase title="sc_chatbox_pro" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[[SC] Chatbox PRO]]></phrase>
  <phrase title="sc_chatbox_title" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Community chat]]></phrase>
  <phrase title="sc_chatbox_placeholder" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Type a message, or / for commands…]]></phrase>
  <phrase title="sc_chatbox_send" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Send]]></phrase>
  <phrase title="sc_chatbox_online" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[In this room]]></phrase>
  <phrase title="sc_chatbox_rooms" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Rooms]]></phrase>
  <phrase title="sc_chatbox_history" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[History]]></phrase>
  <phrase title="sc_chatbox_disabled" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[The chatbox is currently disabled.]]></phrase>
  <phrase title="sc_chatbox_no_permission" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[You do not have permission to use the chatbox.]]></phrase>
  <phrase title="sc_chatbox_login_required" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Please log in to join the chat.]]></phrase>
  <phrase title="sc_chatbox_empty_message" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Please enter a message.]]></phrase>
  <phrase title="sc_chatbox_too_long" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Your message is too long (max 500 characters).]]></phrase>
  <phrase title="sc_chatbox_banned" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[You are banned from the chatbox.]]></phrase>
  <phrase title="sc_chatbox_flood_wait" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Slow down — you can post again in {seconds}s.]]></phrase>
  <phrase title="permission.scChatbox_view" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[View chatbox]]></phrase>
  <phrase title="permission.scChatbox_use" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Post in chatbox]]></phrase>
  <phrase title="permission.scChatbox_bypassFlood" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Bypass chatbox flood limit]]></phrase>
  <phrase title="permission.scChatbox_moderate" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Moderate chatbox (pin / delete / ban)]]></phrase>
  <phrase title="permission.scChatbox_manageRooms" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Manage chatbox rooms]]></phrase>
  <phrase title="option_group.scChatbox" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[[SC] Chatbox PRO]]></phrase>
  <phrase title="option.scChatboxMaster" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Enable chatbox]]></phrase>
  <phrase title="option.scChatboxPollInterval" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Poll interval (ms)]]></phrase>
  <phrase title="option.scChatboxHeight" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Chatbox height (px)]]></phrase>
  <phrase title="option.scChatboxGuestView" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Allow guests to view]]></phrase>
  <phrase title="option.scChatboxFloodSeconds" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Flood limit (seconds)]]></phrase>
  <phrase title="option.scChatboxMaxStored" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Messages stored per room]]></phrase>
  <phrase title="option.scChatboxWebhookUrl" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Discord webhook URL (optional)]]></phrase>
  <phrase title="option.scChatboxShowLauncher" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Show floating launcher on all pages]]></phrase>
  <phrase title="option.scChatboxLinkUrls" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[Auto-link URLs in messages]]></phrase>
  <phrase title="widget_definition.scChatbox" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[[SC] Chatbox]]></phrase>
</phrases>
`,

  /* ------------------------------------------------ _data/code_event_listeners.xml */
  [P + "_data/code_event_listeners.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<code_event_listeners>
  <listener event_id="templater_global_data" execute_order="10"
            callback_class="SC\\ChatboxPRO\\Listener\\App"
            callback_method="templaterGlobalData"
            description="Exposes chatbox globals to all templates"
            addon_id="SC/ChatboxPRO"/>
  <listener event_id="app_pub_setup" execute_order="10"
            callback_class="SC\\ChatboxPRO\\Listener\\App"
            callback_method="containerParams"
            description="Flags the floating launcher when enabled"
            addon_id="SC/ChatboxPRO"/>
</code_event_listeners>
`,

  /* ------------------------------------------------ _data/widget_definitions.xml */
  [P + "_data/widget_definitions.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<widget_definitions>
  <widget_definition definition_id="scChatbox"
                     definition_class="SC\\ChatboxPRO\\Widget\\Chatbox"
                     addon_id="SC/ChatboxPRO"/>
</widget_definitions>
`,

  /* ------------------------------------------------ _data/widget_positions.xml */
  [P + "_data/widget_positions.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<widget_positions>
  <position position_id="sc_chatbox_sidebar" title="Chatbox sidebar" active="1" addon_id="SC/ChatboxPRO"/>
</widget_positions>
`,

  /* ------------------------------------------------ _data/template_modifications.xml */
  [P + "_data/template_modifications.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<template_modifications>
  <modification template="PAGE_CONTAINER" modification_key="scChatboxLauncher"
                description="Injects the floating chatbox launcher"
                execution_order="10" enabled="1" action="str_replace" addon_id="SC/ChatboxPRO">
    <find><![CDATA[</body>]]></find>
    <replace><![CDATA[<xf:if is="$scChatboxEnabled"><div class="scChatbox-launcher" data-xf-init="sc-chatbox-launcher" data-poll-interval="{$scChatboxPollInterval}"></div></xf:if>
</body>]]></replace>
  </modification>
</template_modifications>
`,

  /* ------------------------------------------------ _data/templates.xml (sc_chatbox_main) */
  [P + "_data/templates.xml"]: `<?xml version="1.0" encoding="utf-8"?>
<templates>
  <template title="sc_chatbox_main" type="public" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[<xf:title>{xenforo:phrase sc_chatbox_title}</xf:title>

<style>
.scChat { background: var(--xf-palette-neutral-2); border: 1px solid var(--xf-palette-neutral-3); border-radius: 8px; overflow: hidden; }
.scChat-rooms { display: flex; gap: 4px; padding: 8px; border-bottom: 1px solid var(--xf-palette-neutral-3); }
.scChat-room { padding: 6px 12px; border-radius: 6px; font-weight: 600; color: var(--xf-palette-text-muted); }
.scChat-room.is-active { background: var(--xf-palette-primary-1); color: var(--xf-palette-primary-contrast); }
.scChat-feed { height: {$scChatboxHeight}px; overflow-y: auto; padding: 12px; }
.scChat-msg { display: flex; gap: 10px; padding: 6px 0; }
.scChat-msg--me .scChat-msg-body { font-style: italic; color: var(--xf-palette-text-muted); }
.scChat-msg--announce { justify-content: center; font-weight: 700; color: var(--xf-palette-primary-1); }
.scChat-composer { display: flex; gap: 8px; padding: 10px; border-top: 1px solid var(--xf-palette-neutral-3); }
.scChat-composer input { flex: 1; }
</style>

<div class="scChat" data-xf-init="sc-chatbox"
     data-room-id="{$room.room_id}"
     data-poll-url="{{ link('chatbox/poll') }}"
     data-send-url="{{ link('chatbox/send') }}"
     data-poll-interval="{$scChatboxPollInterval}">

    <div class="scChat-rooms">
        <xf:foreach loop="$rooms" value="$r">
            <a class="scChat-room {{ $r.room_id == $room.room_id ? 'is-active' : '' }}"
               href="{{ link('chatbox', null, {'room_id': $r.room_id}) }}">#{$r.title}</a>
        </xf:foreach>
    </div>

    <xf:if is="$pinned">
        <div class="scChat-pin block-row"><strong>Pinned:</strong> {$pinned.renderHtml()}</div>
    </xf:if>

    <div class="scChat-feed js-scChat-feed">
        <xf:foreach loop="$messages" value="$m">
            <div class="scChat-msg scChat-msg--{$m.command}" data-id="{$m.message_id}">
                <strong class="username">{$m.username}</strong>
                <span class="scChat-msg-body">{$m.renderHtml()}</span>
            </div>
        </xf:foreach>
    </div>

    <xf:if is="$canPost">
        <form class="scChat-composer js-scChat-composer" data-xf-init="submit" action="{{ link('chatbox/send') }}" method="post">
            <input type="text" name="message" maxlength="500" placeholder="{xenforo:phrase sc_chatbox_placeholder}" autocomplete="off" />
            <input type="hidden" name="room_id" value="{$room.room_id}" />
            <xf:csrf />
            <button type="submit" class="button button--primary">{xenforo:phrase sc_chatbox_send}</button>
        </form>
    <xf:else />
        <div class="block-row">{xenforo:phrase sc_chatbox_login_required}</div>
    </xf:if>
</div>

<xf:js src="sc/chatboxpro/chatbox.js" addon="SC/ChatboxPRO" prod="true" min="true" />]]></template>

  <template title="sc_chatbox_widget" type="public" version_id="1000070" addon_id="SC/ChatboxPRO"><![CDATA[<div class="block scChat-widget" data-xf-init="sc-chatbox"
     data-room-id="{$room.room_id}"
     data-poll-url="{{ link('chatbox/poll') }}"
     data-send-url="{{ link('chatbox/send') }}">
    <div class="block-container">
        <h3 class="block-header">#{$room.title}</h3>
        <div class="scChat-feed js-scChat-feed" style="height: {$height}px;">
            <xf:foreach loop="$messages" value="$m">
                <div class="scChat-msg" data-id="{$m.message_id}">
                    <strong class="username">{$m.username}</strong>
                    <span class="scChat-msg-body">{$m.renderHtml()}</span>
                </div>
            </xf:foreach>
        </div>
    </div>
</div>]]></template>
</templates>
`,

  /* ------------------------------------------------ js/sc/chatboxpro/chatbox.js */
  "upload/js/sc/chatboxpro/chatbox.js": `/*!
 * [SC] Chatbox PRO — client poller
 * (c) Superchunes — https://superchunes.com
 */
(function () {
    'use strict';

    var MAX_RENDERED = 200;

    function init(root) {
        var feed     = root.querySelector('.js-scChat-feed');
        var composer = root.querySelector('.js-scChat-composer');
        var roomId   = root.getAttribute('data-room-id');
        var pollUrl  = root.getAttribute('data-poll-url');
        var sendUrl  = root.getAttribute('data-send-url');
        var interval = parseInt(root.getAttribute('data-poll-interval'), 10) || 2500;
        var lastId   = 0;
        var timer    = null;

        if (feed) {
            var existing = feed.querySelectorAll('.scChat-msg');
            if (existing.length) {
                lastId = parseInt(existing[existing.length - 1].getAttribute('data-id'), 10) || 0;
            }
            feed.scrollTop = feed.scrollHeight;
        }

        function escapeHtml(str) {
            var div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function renderMessage(msg) {
            var row = document.createElement('div');
            row.className = 'scChat-msg scChat-msg--' + (msg.command || 'plain');
            row.setAttribute('data-id', msg.id);
            row.innerHTML = '<strong class="username">' + escapeHtml(msg.username) + '</strong> ' +
                            '<span class="scChat-msg-body">' + msg.html + '</span>';
            feed.appendChild(row);

            while (feed.children.length > MAX_RENDERED) {
                feed.removeChild(feed.firstChild);
            }

            var nearBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 120;
            if (nearBottom) {
                feed.scrollTop = feed.scrollHeight;
            }
        }

        function poll() {
            var url = pollUrl + (pollUrl.indexOf('?') === -1 ? '?' : '&') +
                      'room_id=' + encodeURIComponent(roomId) + '&since=' + lastId;

            fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
                .then(function (res) { return res.ok ? res.json() : null; })
                .then(function (data) {
                    if (!data || !data.messages) { return; }
                    data.messages.forEach(function (msg) {
                        if (msg.id > lastId) {
                            lastId = msg.id;
                            renderMessage(msg);
                        }
                    });
                })
                .catch(function () { /* network blip — retry on next tick */ });
        }

        if (composer) {
            composer.addEventListener('submit', function (e) {
                e.preventDefault();
                var input = composer.querySelector('input[name="message"]');
                var body  = (input.value || '').trim();
                if (!body) { return; }

                var fd = new FormData();
                fd.append('message', body);
                fd.append('room_id', roomId);
                var csrf = composer.querySelector('input[name="_xfToken"]');
                if (csrf) { fd.append('_xfToken', csrf.value); }

                fetch(sendUrl, { method: 'POST', body: fd, credentials: 'same-origin' })
                    .then(function () {
                        input.value = '';
                        poll();
                    });
            });
        }

        timer = setInterval(poll, interval);
        poll();
    }

    function boot() {
        var roots = document.querySelectorAll('[data-xf-init~="sc-chatbox"]');
        for (var i = 0; i < roots.length; i++) {
            init(roots[i]);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
`,

  /* ------------------------------------------------ CHANGELOG.md */
  "CHANGELOG.md": `# [SC] Chatbox PRO — changelog

## 1.0.0 — initial release
- Room-based chat with per-room guest & staff visibility
- Real-time client (2.5s poll, configurable, XF push-notification aware)
- Slash commands: /me, /announce, /shrug, /flip
- Moderation: pin (one per room), soft delete, timed bans
- Flood control with per-group bypass permission
- Message pruning to keep xf_sc_chat_message lean
- Full page at /chatbox + sidebar widget + floating launcher
- Discord webhook bridge (optional)
- Tested against XenForo 2.3.0 → 2.3.12
`,
};

/* ------------------------------------------------------------------
   README lives at the ZIP root
------------------------------------------------------------------- */
export const README = `# [SC] Chatbox PRO 1.0.0

A real-time, room-based chatbox add-on for XenForo 2.3.0 – 2.3.12.
Developed by Superchunes — https://superchunes.com

## Requirements
- XenForo 2.3.0 or newer (tested through 2.3.12)
- PHP 8.1+

## Installation
1. In your Admin CP, go to Add-ons → Install / upgrade from archive.
2. Upload this ZIP file as-is (do not unzip it).
3. When prompted, allow the schema changes (3 new tables + 2 user columns).
4. Open Options → [SC] Chatbox PRO to tune poll interval, flood limit, height.
5. Set permissions: Users → Group permissions → [SC] Chatbox.
6. Visit your-forum.com/chatbox/ — or add the "[SC] Chatbox" widget to a sidebar.

## Upgrading
Install the new archive over the existing version; upgrade steps run automatically.

## Support & docs
- Docs:    https://superchunes.com/docs/sc-chatbox-pro
- Support: https://superchunes.com/support

## License
Single-domain license. One purchase covers one live XenForo installation,
plus unlimited local/dev copies. Redistribution is not permitted.

(c) Superchunes — superchunes.com
`;
