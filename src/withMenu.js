import React from 'react';
import { compose, lifecycle, withHandlers, withProps, withState } from 'recompose';
import debounceHandler from '@hocs/debounce-handler';

const withMenu = compose(
  withProps({
    menuRef: React.createRef(),
  }),
  withState('menuIsOpen', 'setMenuIsOpen'),
  withHandlers({
    openMenu: ({setMenuIsOpen}) => () => setMenuIsOpen(true),
    closeMenu: ({setMenuIsOpen}) => () => setMenuIsOpen(false),
  }),
  debounceHandler('openMenu', 1),
  withHandlers({
    handleWindowClick: ({ closeMenu, menuIsOpen, menuRef }) => ({ target }) => {
      if (menuIsOpen && !menuRef.current.contains(target)) {
        closeMenu();
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      window.addEventListener('click', this.props.handleWindowClick);
    },
    componentWillUnmount() {
      window.removeEventListener('click', this.props.handleWindowClick);
    },
  }),
);

export default withMenu;
