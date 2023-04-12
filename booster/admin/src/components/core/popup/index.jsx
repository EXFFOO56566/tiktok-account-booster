import React from 'react';
import ReactDOM from 'react-dom';
import UICPopup from './cpopup';

type Props = {
  onCancel?: Function,
  onOk: Function,
  content: React.ReactNode,
  title: string,
  type?: string,
  width?: any,
  align?: string,
  textOk?: string,
  textCancel?: string,
  autoClose?: boolean,
  onBeforeClose?: Function,
  isNotify?: boolean,
}

export const UIPopup = (props: Props) => {
  const div = document.createElement('div');

  if (props.title && props.content) {
    document.body.appendChild(div);
  }

  const destroy = () => {
    ReactDOM.unmountComponentAtNode(div);
    div.parentNode.removeChild(div);
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  ReactDOM.render(<UICPopup {...props} destroy={destroy} />, div);
};
