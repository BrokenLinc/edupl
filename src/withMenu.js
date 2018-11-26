import { compose, withHandlers, withState } from 'recompose';
import throttleHandler from '@hocs/throttle-handler';

const withMenu = compose(
  withState('menuIsOpen', 'setMenuIsOpen'),
  throttleHandler('setMenuIsOpen', 1),
  withHandlers({
    closeMenu: ({setMenuIsOpen}) => () => setMenuIsOpen(false),
    openMenu: ({setMenuIsOpen}) => () => setMenuIsOpen(true),
    toggleMenu: ({menuIsOpen, setMenuIsOpen}) => () => setMenuIsOpen(!menuIsOpen),
  }),
);

export default withMenu;
