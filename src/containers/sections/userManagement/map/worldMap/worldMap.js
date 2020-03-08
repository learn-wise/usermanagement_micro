import React, { useEffect } from 'react';
import classes from './style.scss';
import { fromEvent, merge } from 'rxjs';
import { map, distinctUntilChanged, throttleTime, filter, tap } from 'rxjs/operators';
import mapData from './data.json';

export default props => {
  const { hover: HoverHandler, click: clickHandler, coloredCN } = props;
  useEffect(() => {
    let countries = Object.keys(coloredCN);
    fromEvent(document.querySelectorAll(`.${classes.mapPath} path`), 'click')
      .pipe(
        throttleTime(300),
        map(e => e.target),
        distinctUntilChanged(),
        filter(e => countries.filter(val => val === e.id).length > 0),
        tap(console.log),
      )
      .subscribe(clickHandler);
  }, [clickHandler, coloredCN]);

  useEffect(() => {
    let paths = document.querySelectorAll(`.${classes.mapPath} path`);
    merge(fromEvent(paths, 'mouseover'), fromEvent(paths, 'mouseout'))
      .pipe(map(e => e.target))
      .subscribe(HoverHandler);
  }, [HoverHandler]);

  return (
    <g className={classes.mapPath}>
      {mapData.map(el => (
        <path key={el.id + el.countryName} id={el.id} data-tip={el.countryName} d={el.path}></path>
      ))}
    </g>
  );
};
