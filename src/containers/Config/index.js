import React from 'react';
import I18n from './../../helpers/I18n';
import './index.css';

const Config = ({ 
  lang, 
  handleSelectLang, 
  grids,
  grid,
  handleSelectGrid,
  text 
}) => {

  return (
    <div className="config">
      <ul>
        <li>
          {text.config.list.version}
          <span style={{float: 'right'}}>0.0.1</span>
        </li>
        <li>
          {text.config.list.language}
          <select name="lang" value={lang} onChange={handleSelectLang}>
            {I18n.available().map( lang =>
              <option key={lang} value={lang}>{lang}</option> )
            }
          </select>
        </li>
        <li>
          {text.config.list.grid}
          <select name="grid" value={grid} onChange={handleSelectGrid}>
            {grids.map(grid =>
              <option key={grid} value={grid}>{grid}</option>)
            }
          </select>
        </li>
      </ul>
    </div>
  );
}

export default Config;