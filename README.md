# team04

## General Information

This application is intended to facilitate the frictionless creation and sharing of **lore**. Once logged in, a user can access and create *games*. A *game* represents an isolated, fully-featured instance of the application wherein users known as *game masters* can be considered equivalent to admins, as they have the ability to perform all of the requisite admin functionalities within said *game*.

Deployed Application: https://rpg-nodes.herokuapp.com/

### Login Info:
- Username: **admin**, password: **admin**
- Username: **user**, password: **user**

## How to use the application

One can log in using the above credentials **or** create a new account.

Once logged in, one can:
- Click on an existing *game*'s card **or** create a new *game*
- Edit one's account settings (and delete one's account) by clicking on the cog icon

Once on the *canvas*, one can:
- \*Create *nodes* representing lore items (people, places, items, etc.) by clicking on the '+' button
- Move nodes around the canvas by dragging them
- View existing nodes' content (represented in the form of subnodes) by opening up their nodeview (e.g. by double-clicking on them on the canvas)
- View a list of users in the game on the right sidebar
- View a list of nodes in the game on the left sidebar
- \*Enable editing of the players within the game as well as the name of the game by clicking on the 'cog' icon at the top of the right sidebar
- \*Change the name of the game by typing in the text-entry box containing the game's current name at the top of the right sidebar
- \*Change the permissions of users within the game by clicking on the 'person' icon next to their name. A filled-in icon indicates that the user is a *game master* while an outlined icon indicates that the user is a player (a regular user)
- \*Delete a user from the game by clicking the red 'remove person' icon to the right of their name
- \*Invite a new user to the game by typing their username into the text entry field at the bottom of the right sidebar

Once in a *nodeview*, one can:
- View the content (subnodes) of that node (e.g. a description of a location, a description of an event that took place at that location, a secret about that location, etc.) 
- \*\*Edit the content of existing subnodes by typing in the Quill WYSIWYG editor and saving the changes by clicking on the 'save' icon above that editor. If one enters the name of another node it will be formatted (on save) into a clickable block of text that will open that node in the *nodeview*.
- \*\*Create new subnodes using the tools at the bottom of the view
- \*\*Edit the node's metadata by opening the 'edit menu' (clicking on the 'pen' icon in the top-right)
- \*\*Change which other users can view the node, view specific subnodes within the node, and edit the node by opening the 'users menu' (clicking on the 'people' icon) \[see: **Explanation of Permissions** section\]
- \*\*Edit the node's image (what appears on the *canvas* and at the top of the *nodeview*) by opening the 'image menu' (clicking on the 'image' icon)

\* = *Game master* (admin) functionality

\*\* = *Game master* (admin) functionality which can be extended to other users in a limited capacity by a *game master* (admin)

### Explanation of Permissions

TODO

## Overview of Routes

*All listed routes are preceded with "/api".*

"/game"
- POST: Creates a new game. Expects the ID of the user creating the game (userId) and the title of the game (title) in the request body. Returns the newly-created game.

"/game/:id"
- GET: Retrieves the game with ID = req.params.id.
- DELETE: Deletes the game with ID = req.params.id. Returns the deleted game.
- PATCH: Updates the game with ID = req.params.id. Expects the properties to be updated and their values in the request body (note: this route should NOT be used to update any subdocuments within the game, i.e. nodes or users). Returns the updated game.

"/game/:gameId/user/:username"
- POST: Adds user with username = req.params.username to the game with ID = req.params.gameId. Returns the newly-created UserPermissionRecord for the given user within the given game.

"/game/:gameId/user/:userId"
- PATCH: Changes the permission of the user with ID = req.params.userId in the game with ID = req.params.gameId. Expects the new permission level of the user as req.body.permission (0 = Game Master, 1 = Player). Returns the updated UserPermissionRecord. *Note: Demoting a game master to a player will remove them as an editor from every node in the game. Promoting a player to a game master will add them as an editor to every node in the game.*
- DELETE: Removes the user with ID = req.params.userId from the game with ID = req.params.gameId. Returns the updated game.

"/node/:gameId"
- POST: Adds a (default) node to the game with ID = req.params.gameId. Returns the newly-created node.

"/node/:gameId/:nodeId"
- GET: Retrieves the node with ID = req.params.nodeId from the game with ID = req.params.gameId.
- PATCH: Updates the node with ID = req.params.nodeId within the game with ID = req.params.gameId. Expects the properties to be updated and their values in the request body (note: this route should NOT be used to update any subdocuments within the node, i.e. subnodes). Returns the updated node.
- DELETE: Removes the node with ID = req.params.nodeId from the game with ID = req.params.gameId. Returns the deleted node.

"/subnode/:gameId/:nodeId"
- POST: Adds a new subnode to the node with ID = req.params.nodeId. Expects the request body to include (name, informationLevel, editors, type). Returns the newly-created subnode.

"/subnode/:gameId/:nodeId/:subnodeId"
- GET: Retrieves the subnode with ID = req.params.subnodeId within the node with ID = req.params.nodeId within the game with ID = req.params.gameId.
- PATCH: Updates the subnode with ID = req.params.subnodeId within the node with ID = req.params.nodeId. Expects the properties to be updated and their values in the request body. Returns the updated subnode.
- DELETE: Removes the subnode with ID = req.params.subnodeId from the node with ID = req.params.nodeId. Returns the deleted subnode.

"/user"
- POST: Creates a new user. Expects req.body to contain (username, password, email). Returns the newly-created user.

"/user/:id"
- GET: Retrieves the user with ID = req.params.id.
- DELETE: Deletes the user with ID = req.params.id. *Note: this does not remove the user from any games. This may cause bugs.* Returns the deleted user.
- PATCH: Updates the user with ID = req.params.id. Expects the properties to be updated and their values in the request body (note: this route shoudl not be used to update the user's images). Returns the updated user.

"/user/:id/images"
- PATCH: Updates the list of images associated with the user with ID = req.params.id. Returns the updated user.

"/user/username/:username"
- GET: Retrieves the user with username = req.params.username.

## Frontend

1. Make sure you're in the directory `frontend`:

```
cd frontend
```

2. Install dependencies:

```
npm ci
```

3. Fire up the React development server:

```
npm start
```

Before you install a new package, always make sure you are in the directory `frontend`.

## Backend

TODO

## Third-Party Libraries

[MaterialUI](https://mui.com/)
- Used to expedite some simple component creation

[lodash.clonedeep](https://www.npmjs.com/package/lodash.clonedeep)
- Used to allow for different versions of a node state to exist in different components at the same time

[Parchment, Quill, Quill-Delta](https://quilljs.com/)
- Used for the WYSIWYG editor, as well as text content deltas and formatting

React, React-DOM, React-Router-DOM, React-Scripts
- Framework
- Used for routing (see `App.tsx`)

React UID
- Used to generate unique mapping keys

Typescript
