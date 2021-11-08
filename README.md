# team04

## General Information

### Login Info:
- Username: **admin**, password: **admin**
- Username: **user**, password: **user**
- *Note:* There are other users that exist in the data to demonstrate some of the functionality of the views, but they should not be accessed.

### Note on Hardcoded Values
Our phase 1 project does not utilize any external data source. Rather, we created the `mock-backend.ts` file, which includes all of the hardcoded JS values that are used throughout the frontend. Any line in the code that calls a function exported from `mock-backend.ts` will, in later phases, send an equivalent request to the actual backend. Therefore, function calls such as `GETnodesInGame()` and `GETuserCanEditNode()` should be treated as equivalent to having a comment above them saying "// code below requires server call". 

### Note on routing/state
We are still undecided on how to store state (i.e. giving them via  react-router) or by using a solution like redux. Once we begin integrating a live database, we will compare the solutions and go from there. Because of this, we only have a rudimentary global state propogation currently, and the state of some pages may not appear to be as a direct result of others.

### Admin Functionalities
After logging in as 'admin', click on a game card (*Note: the "CLICK" game is the one that is actually set up with data -- the other games should not be clicked*). This will bring you to the main view of the app (canvas). From here, you can click on the gear button at the top of the righthand sidebar to enable user editing (the ability to add/remove users, promote a player to a game master, change the game name, and delete the game). 

You can drag the nodes around on the canvas. *(Note: all of them will load in the same position.)*

You can double-click on any of the square nodes in the canvas to bring up their associated NodeView. Inside the node, you can edit any subnode which you have permission to edit by typing in the Quill WYSIWYG editor (as admin you can edit all subnodes, as a user you can only edit the Notes subnodes as well as any other subnodes that an admin has explicitly given you permission to edit). If you type the name of another node in the current game, it will automatically be formatted as a clickable block of text that will open up the appropriate node. Subnodes autosave their content once every second. You can add new subnodes using the tools at the bottom of the NodeView. You can edit the node's meta-information, permissions, and image using the menu modals that open when you click the buttons on the top-right of the NodeView. *(Note: Adding a new image works in theory, but as all images are accessed as paths to the app's `public/images/` folder, inserting new images from the user's machine is not supported and this functionality should not be treated as part of the current build.)*

You can add new nodes by clicking on the plus button at the bottom-left of the page. *(Note: The system currently assumes that users will have only 1 node with a particular name. Having nodes with duplicate names does not introduce any errors, however only one of them will be able to be linked to through text.)*

### User Functionalities
After logging in as 'user', the process is similar to that of an admin with a few noticable differences. First, the user expectedly does not have access to the button that enables user editing. Furthermore, only nodes that the user has been given permission to view appear on the canvas, and the user is not permitted to create new nodes. The user can still drag nodes around and open up their respective NodeView, which will open with only the subnodes that the user has permission to view, and no menu buttons. The user can still type in the Quill editor to update nodes that they have been given permission to edit, and the user can still click on text links to open up new NodeViews.

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

TBA

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
