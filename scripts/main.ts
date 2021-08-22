import { Field } from './classes/Field.js';
import { UIService } from './classes/UIService.js';

const main = document.getElementById("main");
const uiService = new UIService(<HTMLDivElement>main);

const field = new Field(0, 0, 800, 600);
uiService.renderObject(field);


