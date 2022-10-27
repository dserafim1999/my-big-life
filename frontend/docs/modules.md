
As our application contains several features that serve the global interaction with the system, but are
used for specific contexts, we designate each functionality to a module. The idea is that, as more
functionality is added to the system, the logic is contained in its own context. 

## Boilerplate

You can find all the necessary changes and additions when creating a new module in the [templates](..\templates) directory. This should help you understand the different elements required, as well as help you so you can copy and paste the base structure and modify it to satisfy your requirements. 

## New module
To create a new module, simply create a new directory in the [modules](..\src\modules) directory with a base component to house the module's logic. A module should be presented to users using [cards](..\src\components\Card\index.js), displayed over the map.



The modules can, and should, interact with the global state to perform their operations. As every module
shares this global state, this is how data s shared between them. To create a new set of action/reducers dedicated to this module, you should:

### Adding a new action file
The server logic for each module
corresponds to a server manager, related to the functionality in question. Communication between the server and the client is done through HTTP requests by accessing the backend's endpoints. An [index](..\src\actions\index.js) file defines constants to be used for the actions' type.

A new javascript file can be added to the [actions](..\src\actions) folder, where the redux actions and http requests for the desired functionality are defined.

### Adding a new reducer file
To remain consistent with the existing architecture, a new file should be created in the [reducers](..\src\reducers) file to match the created action file. Here, reducers are defined that correspond to every action defined in the actions file for this functionality. 

To register this new reducers file, it should be added to the `combineReducers` method in the [index](..\src\reducers\index.js) file.

## Add Module to View

Most modules will contain
their own view (and be associated to a route), but this is not mandatory. Navigation between the different views is done using the Navigation Menu at the bottom
of the screen, present at all times. The menu is populated with the JSON object array constant that can be found at [src\modules\ModuleRoutes.js](..\src\modules\ModuleRoutes.js) This array entry describes the route for the view, the icon to be used for the menu and the module itself.

