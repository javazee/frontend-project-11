import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import Controller from './controller.js';
import Model from './model.js';
import View from './view.js';
import ru from '../locales/ru.js';

await i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const controller = new Controller(new Model(), new View());
controller.start();
