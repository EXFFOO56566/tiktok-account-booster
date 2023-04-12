import React from 'react';
import {
  addEventListener,
  removeEventListener,
} from '@app/utils/events';

export type EventListenerProps = {
  passive?: boolean,
  event: string,
  capture?: boolean,
  handler(event: Event): void,
}

export class EventListener extends React.PureComponent<EventListenerProps> {
  componentDidMount() {
    this.attachListener();
  }

  componentDidUpdate({passive, ...detachProps}: EventListenerProps) {
    this.detachListener(detachProps);
    this.attachListener();
  }

  componentWillUnmount() {
    this.detachListener();
  }

  render() {
    return null;
  }

  attachListener() {
    const {event, handler, capture, passive} = this.props;
    addEventListener(window, event, handler, {capture, passive});
  }

  detachListener(prevProps?: any) {
    const {event, handler, capture} = prevProps || this.props;
    removeEventListener(window, event, handler, capture);
  }
}
