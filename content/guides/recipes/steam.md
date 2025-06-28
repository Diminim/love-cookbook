---
title: "Steam"
authors: [Sheepolution]
date: 2025-06-25
---
{% abstract "Steam" %}

If you want to put your game on Steam, you might also want to add some Steam specific features, like achievements or multiplayer. There are many [LÖVE games on Steam](https://store.steampowered.com/curator/44895761-Made-With-L%25C3%2596VE/) already, so yes, it is possible to have these features when using LÖVE.

## luasteam

To connect with the Steam API, we will be using [luasteam](https://github.com/uspgamedev/luasteam). Get the `.dll` or `.so` for your system, and put this file in your project folder. In this chapter we will assume you placed it at the root of your project. Also at the root create a  `steam_appid.txt` with either your app's ID, or with `480`, the id for the example game [Spacewar](https://steamdb.info/app/480/info/).

Download the [steamworks_sdk.zip](https://partner.steamgames.com/downloads/list) (you need a Steamworks account). Navigate to `sdk -> redistributable_bin -> [your OS]` and copy the `steam_api64.dll` / `libsteam_api.so`. Place this not at your project folder, but in your LOVE folder (i.e. where `love.exe` is).

> [!TIP]
> You might want to set yourself to invisible on Steam, or hide notifications another way. Otherwise your friends will start to asking what Spacewar is, and why you're restarting it every 5 minutes.

Generally, loading Steam is the first thing you want to do in your game. At the top of your main.lua, place the following code:

```lua
local Steam = require "luasteam"
Steam.init()
```

> [!NOTE]
> You might get the following messages:
> 
> ```
> Setting breakpad minidump AppID = 480
> SteamInternal_SetMinidumpSteamID:  Caching Steam ID: 0123456789 [API loaded no]
> ```
>
> This is because you don't load your game through stream. You can ignore it.

You can now use the [Steam API](https://partner.steamgames.com/doc/api), but not all of Steam API has been implemented in luasteam. Check the [luasteam](https://luasteam.readthedocs.io/en/stable/) docs to see what is implemented and how it works.

For example, we can use [`Steam.friends.activateGameOverlay("community")`](https://luasteam.readthedocs.io/en/stable/friends.html#friends.activateGameOverlay) to open the community tab, and use [`Steam.friends.setAchievement(name)`](https://luasteam.readthedocs.io/en/stable/user_stats.html#userStats.setAchievement) to unlock an achievement for the player.

## Multiplayer

We can use the Steam API to create a multiplayer game. We're going to assume you know the basics of online multiplayer and networking. We will be using the P2P API, where we have one server and one or more connecting clients. At the end of this chapter is a full example implementation.

### Socket

We can let one player, the server, create a P2P socket with [`createListenSocketP2P()`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.createListenSocketP2P). Other players can then connect to this socket with [`connectP2P(steamID)`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.connectP2P). The `steamID` is the ID of the player who created the server.

To get this ID, the server can

* Invite the player using [`inviteUserToGame(connect_string)`](https://luasteam.readthedocs.io/en/stable/friends.html#friends.inviteUserToGame).
* Enable the "Join game" button on their profile with [`setRichPresence("connect", connect_string)`](https://luasteam.readthedocs.io/en/stable/friends.html#friends.setRichPresence).

The `connect_string` in this case is the `steamID` of the player who hosts the server, which we can get with [`getSteamID()`](https://luasteam.readthedocs.io/en/stable/user.html#user.getSteamID). Upon accepting the connection the callback [`onGameRichPresenceJoinRequested`](https://luasteam.readthedocs.io/en/stable/friends.html#friends.onGameRichPresenceJoinRequested) is called. In here, we can connect to the server using [`connectP2P(steamID)`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.connectP2P).

Using the callback [`onConnectionChanged`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.onConnectionChanged) we capture whenever there is a change in a connection. It comes with a `data` table, which tells us the state of the connection. If it's a client connecting to the server, we can accept the connection with [`acceptConnection(connection)`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.acceptConnection).

Because we use callbacks, we need to call [`runCallbacks()`](https://luasteam.readthedocs.io/en/stable/steam_api.html#runCallbacks) every frame.

```lua
Steam = require "luasteam"
Steam.init()

local server = true -- Change to false for the client
local connectionId

if server then
	connectionId = Steam.networkingSockets.createListenSocketP2P(0)
	Steam.friends.setRichPresence("connect", tostring(Steam.user.getSteamID()))
end

function Steam.friends.onGameRichPresenceJoinRequested(data)
	Steam.networkingSockets.connectP2P(Steam.extra.parseUint64(data.connect), 0)
	
	-- This way we allow friends of this person to join the server as well.
	Steam.friends.setRichPresence("connect", data.connect)
end

function Steam.networkingSockets.onConnectionChanged(data)
	local state = data.state
	local conn = data.connection

	if state == "Connecting" then
		if server then
			Steam.networkingSockets.acceptConnection(conn)
		end
	elseif state == "Connected" then
		-- As the server we accept the connection, so we can ignore this.
		if not server then
			print("Connected!")
			connectionId = conn
		end
	elseif state == "ClosedByPeer" then
		print("The client ended the connection (e.g. closing the game).")
	elseif state == "ProblemDetectedLocally" then
		print("I'm sure it's nothing...")
	end
end

function love.update(dt)
	Steam.runCallbacks()
end
```

### Messaging

Now that we have a connection, we want to send information back and forth using *messages*. We do this by usign a <ins>poll group</ins>.

Along with creating a socket, we also create a poll group using [`createPollGroup()`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.createPollGroup). Every time a client connects, we assign it to the poll group using [`setConnectionPollGroup(connection, pollGroup)`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.setConnectionPollGroup). This way we can use the poll group to poll for messages of all clients with [`receiveMessagesOnPollGroup(pollGroup)`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.receiveMessagesOnPollGroup). A client only needs to receive messages from the server, so it can use [`receiveMessagesOnConnection(connectionId)`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.receiveMessagesOnConnection) instead. We receive these messages as a table in the following format:
```lua
{
	1 = {
		conn = 5235,
		msg = "A message"
	},
	2 = {
		conn = 5235,
		msg = "Another message"
	},
	3 = {
		conn = 5678,
		msg = "Yet another message"
	}
}
```

We can send a message with [`sendMessageToConnection(connection, message, flag)`](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.sendMessageToConnection). The `flag` decides what method is used when sending the message (i.e. reliable means it will make sure the message is received). Check the [documentation](https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.sendMessageToConnection) for more information.

### Summary

Below is an example of a P2P implementation, with commentary on what the functions do, and links to the relevant documentation.

```lua
local server = true -- Change to false for the client
local connectionId

local pollGroup

Steam = require "luasteam"
Steam.init()

-- We call this to let Steam know that we want to use the networking sockets API.
-- Which probably won't do much in this example, but it can save you a delay.
-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.initAuthentication
Steam.networkingSockets.initAuthentication()

if server then
	-- We create a P2P server.
	-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.createListenSocketP2P
	connectionId = Steam.networkingSockets.createListenSocketP2P(0)

	-- This will be used to poll for incoming messages from clients.
	-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.createPollGroup
	pollGroup = Steam.networkingSockets.createPollGroup()

	-- This allows friends to right click -> "Join game".
	-- Or the player right clicks -> "Invite to play".
	-- We set the steam ID of the server as the key.
	-- When the player creates a P2P server, their steam ID is used as the ID to connect with the server.
	-- https://luasteam.readthedocs.io/en/stable/friends.html#friends.setRichPresence
	Steam.friends.setRichPresence("connect", tostring(Steam.user.getSteamID()))
end

-- Callback that is called when the player clicks on "Join game" or accepts the invite.
-- https://luasteam.readthedocs.io/en/stable/friends.html#friends.onGameRichPresenceJoinRequested
function Steam.friends.onGameRichPresenceJoinRequested(data)
	-- We have two options here:
	-- 1. Use data.steamIDFriend
	-- 2. Use data.connect (the key that we passed)
	-- By using option 2 we can have the client copy the key, so that people can join them as well.
	-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.connectP2P
	Steam.networkingSockets.connectP2P(Steam.extra.parseUint64(data.connect), 0)
	
	-- This way we allow friends of this person to join the server.
	Steam.friends.setRichPresence("connect", data.connect)
end

-- Callback that is called when a connection arrives/changes.
-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.onConnectionChanged
function Steam.networkingSockets.onConnectionChanged(data)
	local state = data.state
	local conn = data.connection

	-- The state tells us what happened to the connection.
	-- https://partner.steamgames.com/doc/api/ISteamNetworkingSockets#2
	if state == "Connecting" then
		if server then
			-- A client is connecting. We accept the connection.
			-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.acceptConnection
			Steam.networkingSockets.acceptConnection(conn)

			-- We assign the connection to the poll group, so we can receive messages from it.
			-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.setConnectionPollGroup
			Steam.networkingSockets.setConnectionPollGroup(conn, pollGroup)
		end
	elseif state == "Connected" then
		-- As the server we accept the connection, so we can ignore this.
		if not server then
			print("Connected!")
			connectionId = conn
		end
	elseif state == "ClosedByPeer" then
		print("The client ended the connection (e.g. closing the game).")
	elseif state == "ProblemDetectedLocally" then
		print("I'm sure it's nothing...")
	end
end

function love.update()
	-- Call this every frame to run the callbacks when an event happened.
	-- https://luasteam.readthedocs.io/en/stable/steam_api.html#runCallbacks
	Steam.runCallbacks()

	local n, messages
	if server then
		-- We poll for incoming messages from clients.
		-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.receiveMessagesOnPollGroup
		n, messages = Steam.networkingSockets.receiveMessagesOnPollGroup(pollGroup)
	else
		-- We poll for incoming messages from the server.
		-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.receiveMessagesOnConnection
		n, messages = Steam.networkingSockets.receiveMessagesOnConnection(connectionId)
	end

	if n == 0 then
		-- No messages.
		return
	end

	for _, data in ipairs(messages) do
		-- data.msg is the string that was passed.
		print(data.msg)
	end
end

function love.keypressed(k)
	if server or not connectionId then return end
	if k == "space" then
		-- We send a message to the server.
		-- https://luasteam.readthedocs.io/en/stable/networking_sockets.html#networkingSockets.sendMessageToConnection
		local method = Steam.networkingSockets.flags.Send_Reliable
		Steam.networkingSockets.sendMessageToConnection(connectionId, "Hello world!", method)
	end
end
```