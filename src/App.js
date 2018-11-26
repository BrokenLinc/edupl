import React from 'react';
import YouTube from 'react-youtube';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';
import indexOf from 'lodash/indexOf';
import head from 'lodash/head';
import map from 'lodash/map';
import last from 'lodash/last';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import MenuIcon from '@material-ui/icons/Menu';

import CONFIG from './configs/classicalMusic';
import withMenu from './withMenu';

const { periods, playlist } = CONFIG;

const youtubeOptions = {
  playerVars: {
    autoplay: 1,
  },
};

const TimeLine = compose(
  withProps(({ periods }) => ({
    startYear: head(periods).start,
    totalYears: last(periods).end - head(periods).start,
  })),
)(({ periods, song, startYear, totalYears }) => (
  <div className="time-periods">
    {map(periods, ({ color, end, name, start }) => (
      <div key={name} className="time-period" style={{ backgroundColor: color.A700, width: `${100*(end - start)/totalYears}%` }}>
        {name}
      </div>
    ))}
    {!!song && !!song.date && (
      <div className="time-period-marker" style={{ left: `${100*(song.date - startYear)/totalYears}%` }}>
        {song.date}
      </div>
    )}
  </div>
));

const SongListItem = compose(
  withHandlers({
    handleClick: ({ setCurrent, song }) => () => setCurrent(song),
  }),
)(({ handleClick, isCurrent, song }) => (
  <ListItem button onClick={handleClick} selected={isCurrent}>
    <ListItemIcon>
      {isCurrent ? <MusicNoteIcon /> : <PlayArrowIcon/>}
    </ListItemIcon>
    <ListItemText primary={song.name} secondary={song.by} />
  </ListItem>
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

    <CssBaseline />

    <Drawer ref={menuRef} anchor="right" open={menuIsOpen} onClose={toggleMenu}>
      <List component="nav">
        {map(playlist, (song, index) => (
          <SongListItem key={index} song={song} setCurrent={setCurrent} isCurrent={song === current} />
        ))}
      </List>
    </Drawer>

    <div className="h-100 d-flex flex-column">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className="flex-grow-1">
            Educational Playlists: Classical Music
          </Typography>
          <IconButton onClick={toggleMenu} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

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
              className="background-cover flex-grow-1 d-flex flex-column justify-content-end"
              style={{ backgroundImage: `url(${current.imgUrl})` }}
            >
              <div className="info-pane">
                <div className="info-date">{current.date}</div>
                <div className="info-name">{current.name}</div>
                <div className="info-by">by {current.by}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </React.Fragment>
));

export default App;
