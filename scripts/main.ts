import { Field } from './classes/Field.js';
import { UIService } from './classes/UIService.js';

const max_width = 800;
const max_height = 600;
const appTitle = "Tower Defense";

const main = document.getElementById("main");
const uiService = new UIService(<HTMLDivElement>main);

uiService.renderText({ cssClass: "appTitle", x: 0, y: 0, width: max_width, height: 25, text: appTitle });

const field = new Field(0, 0, max_width, max_height);
uiService.renderObject(field);


