import React from 'react';
import YouTube from 'react-youtube';
import { compose, withHandlers, withProps, withState } from 'recompose';
import indexOf from 'lodash/indexOf';
import head from 'lodash/head';
import map from 'lodash/map';
import last from 'lodash/last';
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

const periods = [
  {
    name: 'Baroque',
    start: 1600,
    end: 1740,
  },
  {
    name: 'Classical',
    start: 1740,
    end: 1820,
  },
  {
    name: 'Romantic',
    start: 1820,
    end: 1920,
  },
  {
    name: 'Modern',
    start: 1920,
    end: new Date().getFullYear(),
  },
];

const TimeLine = compose(
  withProps(({ periods }) => ({
    startYear: head(periods).start,
    totalYears: last(periods).end - head(periods).start,
  })),
)(({ periods, song, startYear, totalYears }) => (
  <div className="time-periods">
    {map(periods, ({ end, name, start }) => (
      <div className="time-period" style={{ width: `${100*(end - start)/totalYears}%` }}>
        {name}
      </div>
    ))}
    {!!song && !!song.date && (
      <div className="time-period-marker" style={{ left: `${100*(song.date - startYear)/totalYears}%` }} />
    )}
  </div>
));

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
)(({ current, handleVideoEnd, menuIsOpen, menuRef, toggleMenu, setCurrent }) => (
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
    <div className="h-100 d-flex flex-column">
      <div className="d-flex align-items-center">
        <div className="info-pane flex-grow-1">
          <div className="info-date">{current.date}</div>
          <div className="info-name">{current.name}</div>
          <div className="info-by">by {current.by}</div>
        </div>
        <button type="button" className="menu-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon="bars" />
        </button>
      </div>

      <TimeLine periods={periods} song={current} />

      <div className="d-flex flex-grow-1">
        <div className="d-flex flex-column flex-grow-1">
          <iframe
            src={current.url || current.byUrl}
            name="infoFrame"
            title="Information Frame"
            className="flex-grow-1"
          />
        </div>
        <div className="d-flex flex-column" style={{ width: 460 }}>
          <YouTube
            videoId={current.videoId}
            containerClassName="embed-responsive embed-responsive-16by9"
            className="embed-responsive-item"
            opts={youtubeOptions}
            onEnd={handleVideoEnd}
            onError={handleVideoEnd}
          />
          {current.imgUrl && (
            <div
              className="background-cover flex-grow-1"
              style={{ backgroundImage: `url(${current.imgUrl})` }}
            />
          )}
        </div>
      </div>
    </div>
  </React.Fragment>
));

export default App;
