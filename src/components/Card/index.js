import React from 'react';
import PropTypes from 'prop-types';
import CardFactory from './../../helpers/CardFactory';
import FrontFace from './FrontFace';
import BackFace from './BackFace';
import ButtonEdit from './ButtonEdit';
import { ThemeContext } from './../../Contexts';
import classNames from 'classnames';
import './index.css';

/**
 * @author Victor Heringer
 * 
 * Renders a card component
 * 
 * @prop {Number} value 
 * @prop {Bool} fliped
 * @prop {Bool} fixed
 * @prop {String} pattern
 * @prop {Bool} editing
 * @prop {Bool} icon
 * @prop {Function} onClickRemove
 * @prop {Function} onClick
 * @prop {String} className
 * @prop {String} time
 */
const Card = ({ 
  value, 
  up, 
  editing, 
  icon, 
  className, 
  fixed,
  onClick,
  onClickRemove,
  time,
  size,
  pattern
}) => {

  /**
   * @author Victor Heringer
   *
   * Shows and hide the card
   *
   * @param {Object} event
   */
  const handleClick = event => {
    event.preventDefault();
    if (fixed) {
      const card = CardFactory.create(value, icon);
      onClick(event, card);
    }
    else {
      !fixed && event.currentTarget.classList.toggle('flipped');
    }
  }

  /**
   * @author Victor Heringer
   *
   * Shows and hide the card
   *
   * @param {Object} event
   */
  const handleClickRemove = event => {
    onClickRemove(event, value);
  }

  const wrapperClasses = classNames('cardWrapper', className);

  const classes = classNames(
    'card',
    { 'flipped': up, 'cardSm': size === 'sm', 'cardMd': size === 'md' }
  );

  const closeBtnClass = editing ? 'visible' : 'hidden'; 

  return (
    <ThemeContext.Consumer>
      {theme => (
      <div className={wrapperClasses}>
        <div className="cardContainer">
          <ButtonEdit 
            className={closeBtnClass}
            handleClick={handleClickRemove} 
            time={time}
          />
          <div className={classes} onClick={handleClick}>
            <FrontFace />
            <BackFace icon={icon} value={value} pattern={theme} />
          </div>
        </div>
      </div>
      )}
    </ThemeContext.Consumer>
  );
}

Card.propTypes = {
  value: PropTypes.string,
  fliped: PropTypes.bool,
  fixed: PropTypes.bool,
  pattern: PropTypes.string,
  editing: PropTypes.bool,
  icon: PropTypes.bool,
  onClickRemove: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string
};

Card.defaultProps = {
  value: "", 
  fliped: false,
  fixed: false,
  pattern: "dark-pattern",
  editing: false,
  icon: false,
  onClickRemove: null,
  onClick: null,
  className: ''
};

export default Card;