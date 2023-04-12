import * as React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import WrapperAutoClose from '@app/components/core/auto-close';
import css from 'styled-jsx/css';
import UIButton from "@app/components/core/button";
import {Button} from "antd";

const styles = css.global`
.shdvn-ui-popup {
  &__body {
    margin: auto;
    border: none;
    border-radius: 4px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
    overflow: hidden;
    width: 400px;
    z-index: 1011;
    background: #fff;
    @media only screen and (max-width: 1280px) {
      width: 350px;
      font-size: 14px;
    }
  }
  &__header {
    margin: 14px 16px;
    h1 {
      font-size: 16px!important;
      font-weight: bold;
      line-height: 1.31;
      letter-spacing: 0.1px;
      color: #2a2a2c;
    }
  }
  &__content,
  &__footer {
    padding: 16px;
    padding-top: 0;
  }
}

.shdvn-ui-popup__bg-drop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.3);
}
`

type Props = {
  onCancel?: Function,
  onOk?: Function,
  destroy?: Function,
  content: React.ReactNode,
  title: any,
  type?: string,
  textOk?: string,
  textCancel?: string,
  width?: string,
  align?: string,
  autoClose?: boolean,
  onBeforeClose?: Function,
  children?: React.ReactNode,
  bodyStyle?: any,
  hiddenFooter?: boolean,
  isScroll?: boolean,
  isNotify?: boolean,
}

// eslint-disable-next-line react/prefer-stateless-function
class Wrap extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {autoClose, children, destroy} = this.props;

    return (
      !autoClose
        ? children
        : <WrapperAutoClose isOnlyBody cbClosed={destroy}>{children}</WrapperAutoClose>
    );
  }
}

class UICPopup extends React.Component<Props> {
  componentDidMount(): void {
    const {isNotify, onCancel, destroy} = this.props;

    if (isNotify) {
      setTimeout(() => {
        onCancel();
        destroy();
      }, 1500);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  onClose = () => {
    const {
      destroy,
      onCancel,
    } = this.props;
    onCancel();
    destroy();
  };

  onOk = () => {
    const {
      destroy,
      onOk,
      onBeforeClose,
    } = this.props;

    if (onBeforeClose()) {
      onOk();
      destroy();
    }
  };

  mapIcon = (type) => {
    switch (type) {
      case 'error':
        return <i className="fas fa-exclamation-circle"/>;
      case 'warning':
        return <i className="fas fa-exclamation-circle"/>;
      case 'info':
        return <i className="fas fa-exclamation-circle"/>;
      default:
        return '';
    }
  };

  configAlignPopup = (align, isScroll = false, isNotify = false) => {
    if (isNotify) {
      return {
        top: '5%',
        bottom: 'initial',
        right: '2.5%',
        left: 'initial',
      };
    }

    if (align === 'center') {
      return {
        top: 0,
        bottom: 0,
      };
    }

    return {
      top: !isScroll ? '5%' : 0,
      bottom: isScroll ? 0 : 'initial',
    };
  };

  renderTitle = (Title) => {
    const status = Title && {}.toString.call(Title) === '[object Function]';
    return status ? <Title/> : Title;
  }

  render() {
    const {
      content,
      title,
      type,
      textCancel,
      textOk,
      width,
      align,
      autoClose,
      children: childrenCom,
      bodyStyle,
      hiddenFooter,
      isScroll,
      isNotify,
    } = this.props;

    const className = isScroll ? 'block' : 'flex items-center justify-center';

    return (
      <div
        className={`shdvn-ui-popup fixed ${className}`}
        style={{
          zIndex: 1010,
          left: 0,
          right: 0,
          ...this.configAlignPopup(align, isScroll, isNotify),
          paddingTop: isScroll ? '64px' : 0,
          paddingBottom: isScroll ? '64px' : 0,
          overflowY: isScroll ? 'scroll' : 'initial',
        }}
      >
        <Wrap autoClose={autoClose} destroy={this.onClose}>
          <div className="shdvn-ui-popup__body bg-white" style={{width}}>
            <div className="shdvn-ui-popup__header flex justify-between mb-4 relative">
              <div className="flex items-center">
                {this.mapIcon(type)}
                <h1 className={`font-bold text-xl m-0 leading-none capitalize ${type ? 'pl-5' : ''}`}>
                  {this.renderTitle(title)}
                </h1>
              </div>
              <Button size="small" onClick={this.onClose} type="circle" className="absolute border-0 flex items-center justify-center" style={{top: -5, right: 0}}>
                <i className="ion-close-round leading-none"/>
              </Button>
            </div>
            <div className={`shdvn-ui-popup__content ${type ? 'pl-16' : ''}`} style={bodyStyle}>
              {content || null}
              {childrenCom || null}
            </div>
            <div className={`flex justify-end mt-4 shdvn-ui-popup__footer ${hiddenFooter ? 'hidden' : ''}`}>
              <UIButton onClick={this.onClose} className="ghost border mr-4">{textCancel || 'Cancel'}</UIButton>
              <UIButton onClick={this.onOk} className="secondary" style={{background: 'var(--third-color)'}}>{textOk || 'Save'}</UIButton>
            </div>
          </div>
        </Wrap>
        {!isNotify && <div className="shdvn-ui-popup__bg-drop"/>}
        <style jsx>{styles}</style>
      </div>
    );
  }
}

UICPopup.defaultProps = {
  type: '',
  onCancel: () => {
  },
  onOk: () => {
  },
  textOk: 'YES',
  textCancel: 'NO',
  width: '400',
  align: 'center' || 'top',
  autoClose: false,
  onBeforeClose: () => true,
  destroy: () => {
  },
  children: null,
  bodyStyle: {},
  hiddenFooter: false,
  isScroll: false,
  isNotify: false,
};

export default UICPopup;
