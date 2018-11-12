import React from 'react';
import YouTube from 'react-youtube';
import { compose, withHandlers, withState } from 'recompose';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import playlist from './playlist';
import withMenu from './withMenu';
import VoidLink from './VoidLink';

const youtubeOptions = {
  playerVars: {
    autoplay: 1,
  },
};

const SongLink = compose(
  withHandlers({
    handleClick: ({ setCurrent, song }) => () => setCurrent(song),
  }),
)(({ children, handleClick }) => (
  <VoidLink onClick={handleClick}>{children}</VoidLink>
));

const App = compose(
  withMenu,
  withState('current', 'setCurrent', playlist[0]),
  withHandlers({
    handleVideoEnd: ({setCurrent}) => () => {
      // Advance current through playlist
      setCurrent((n) => playlist[(indexOf(playlist, n) + 1) % playlist.length]);
    },
  }),
)(({ current, handleVideoEnd, menuIsOpen, menuRef, openMenu, setCurrent }) => (
  <React.Fragment>
    <ul ref={menuRef} className={cn('menu', { 'is-open': menuIsOpen })}>
      {map(playlist, (song, index) => (
        <li key={index} className={cn({ 'is-active': (song === current) })}>
          <SongLink song={song} setCurrent={setCurrent}>
            {song.name}
            <br />
            by {song.by}
          </SongLink>
        </li>
      ))}
    </ul>
    <div className="h-100 d-flex">
      <div className="d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center">
          <button type="button" className="menu-toggle" onClick={openMenu}>
            <FontAwesomeIcon icon="bars" />
          </button>
          <div className="info-pane">
            <div className="info-date">{current.date}</div>
            <div className="info-name">{current.name}</div>
            <div className="info-by">by {current.by}</div>
          </div>
        </div>
        <iframe
          src={current.url || current.byUrl}
          name="infoFrame"
          title="Information Frame"
          className="flex-grow-1"
        />
      </div>
      <div className="w-30vw d-flex flex-column">
        {current.imgUrl && (
          <div
            className="background-cover flex-grow-1"
            style={{ backgroundImage: `url(${current.imgUrl})` }}
          />
        )}
        <YouTube
          videoId={current.videoId}
          containerClassName="embed-responsive embed-responsive-16by9"
          className="embed-responsive-item"
          opts={youtubeOptions}
          onEnd={handleVideoEnd}
          onError={handleVideoEnd}
        />
      </div>
    </div>
  </React.Fragment>
));

export default App;
