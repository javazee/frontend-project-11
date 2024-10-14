import './styles.scss';
import 'bootstrap';
import Controller from './controller.js';
import Model from './model.js';
import View  from './view.js';


console.log('app start');
new Controller(new Model(), new View())
    .initListeners()
    .initRendering();
