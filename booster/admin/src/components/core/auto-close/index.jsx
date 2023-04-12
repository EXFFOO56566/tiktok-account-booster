import * as React from "react";
import { ReactNode } from "react";
import shallowCompare from 'react-addons-shallow-compare';
import css from 'styled-jsx/css';

const style = css.global`
.shdvn-popover {
  position: relative;

  &__btn {
    border: 1px solid #0eabd8;
    padding: 4px 18px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    transition: all .3s;

    &:hover,
    &:focus {
      background: #0eabd8;
      color: #fff;
    }
  }

  &__body {
    width: 356px;
    position: absolute;
    top: 27px;
    right: 0;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 12px 2px rgba(0, 0, 0, .1);
    z-index: 1000;
    padding: 8px;
    max-height: 340px;
    overflow: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar-track {
      border-radius: 4px;
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: 0;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: transparent;
    }
  }
}
`

import { EventListener } from "@app/components/core/event-listener";
import {Button} from "antd";

type Props = {
  children: React.ReactNode,
  ok: {
    label: string,
    handle: Function
  },
  close: {
    label: string,
    handle: Function
  },
  label: ReactNode,
  className?: string,
  // only for component popup
  isOnlyBody?: boolean,
  cbClosed?: Function,
}

type States = {
  isShow: boolean
}

class WrapperAutoClose extends React.Component<Props, States> {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false
    };

    this.refAutoClose = React.createRef();
  }

  componentDidMount(): void {
    const { isOnlyBody } = this.props;

    this.setState({ isShow: isOnlyBody });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  onMouseDown = (e) => {
    const { cbClosed } = this.props;
    try {
      if (this.refAutoClose.current && !this.refAutoClose.current.contains(e.target)) {
        this.setState({ isShow: false }, () => cbClosed());
      }
    } catch (e) {
    }
  };

  onClose = () => {
    const { cbClosed } = this.props;
    this.setState({ isShow: false }, () => cbClosed());
  }

  render() {
    const {className, label, ok, close, isOnlyBody} = this.props;
    const {isShow} = this.state;

    return (
      <div ref={this.refAutoClose} className={className || ''} style={{ zIndex: 1010 }}>
        <div className="auto-close-label" onClick={() => this.setState({isShow: true})}>
          {label || ''}
        </div>
        {
          isShow && (
            <div className="shdvn-popover__body__max">
              {
                React.Children.only(this.props.children)
              }
              {
                !isOnlyBody && (
                  <div className="py-4 text-right px-4">
                    <Button
                      size="small"
                      type="success"
                      className="mr-4"
                      onClick={() => {
                        ok.handle();
                        this.setState({isShow: false})
                      }}>
                      {ok.label}
                    </Button>
                    <Button
                      size="small"
                      onClick={close.handle}>
                      {close.label}
                    </Button>
                  </div>
                )
              }
            </div>
          )
        }
        <EventListener event={"mousedown"} handler={this.onMouseDown}/>
      </div>
    )
  }
}

WrapperAutoClose.defaultProps = {
  isOnlyBody: false,
  cbClosed: () => {}
};

export default WrapperAutoClose;
