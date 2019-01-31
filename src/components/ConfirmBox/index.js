import React from 'react';
import './index.css';

const ConfirmBox = ({
  show, 
  onConfirm, 
  onCancel, 
  title, 
  message,
  textCancel,
  textConfirm,
}) => {

  const visibility = show ? 'visible' : 'hidden';

  return( 
    <div className={"confirmBox " + visibility}>
      <div className="box">
        <div className="text">
          <h3 className="title">{title}</h3>
          <p className="description">{message}</p>
        </div>
        <div className="actions">
          <div>
            <button className="cancel" onClick={onCancel}>
              {textCancel}
            </button>
          </div>
          <div>
            <button className="confirm" onClick={onConfirm}>
              {textConfirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBox;