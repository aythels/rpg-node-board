# team04

## General Information

This application is intended to facilitate the frictionless creation and sharing of **lore**. Once logged in, a user can access and create *games*. A *game* represents an isolated, fully-featured instance of the application wherein users known as *game masters* can be considered equivalent to admins, as they have the ability to perform all of the requisite admin functionalities within said *game*.

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
- \*\*Edit the content of existing subnodes by typing in the Quill WYSIWYG editor
- \*\*Create new subnodes using the tools at the bottom of the view
- \*\*Edit the node's metadata by opening the 'edit menu' (clicking on the 'pen' icon in the top-right)
- \*\*Change which other users can view the node, view specific subnodes within the node, and edit the node by opening the 'users menu' (clicking on the 'people' icon) \[see: **Explanation of Permissions** section\]
- \*\*Edit the node's image (what appears on the *canvas* and at the top of the *nodeview*) by opening the 'image menu' (clicking on the 'image' icon)

\* = *Game master* (admin) functionality
\*\* = *Game master* (admin) functionality which can be extended to other users by a *game master* (admin)

### Explanation of Permissions

TODO

## Overview of Routes

TODO

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
