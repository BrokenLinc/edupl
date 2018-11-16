import React from 'react';
import { compose, lifecycle, withHandlers, withProps, withState } from 'recompose';
import throttleHandler from '@hocs/throttle-handler';

const withWindowEventListener = (event, handlerProp) => lifecycle({
  componentDidMount() {
    window.addEventListener(event, this.props[handlerProp]);
  },
  componentWillUnmount() {
    window.removeEventListener(event, this.props[handlerProp]);
  },
});

const withMenu = compose(
  withProps({
    menuRef: React.createRef(),
  }),
  withState('menuIsOpen', 'setMenuIsOpen'),
  throttleHandler('setMenuIsOpen', 1),
  withHandlers({
    closeMenu: ({setMenuIsOpen}) => () => setMenuIsOpen(false),
    openMenu: ({setMenuIsOpen}) => () => setMenuIsOpen(true),
    toggleMenu: ({menuIsOpen, setMenuIsOpen}) => () => setMenuIsOpen(!menuIsOpen),
  }),
  withHandlers({
    handleWindowClick: ({ closeMenu, menuIsOpen, menuRef }) => ({ target }) => {
      if (menuIsOpen && !menuRef.current.contains(target)) {
        closeMenu();
      }
    },
  }),
  withWindowEventListener('click', 'handleWindowClick'),
);

export default withMenu;
