import React from "react";
import {Button} from "antd";
import css from 'styled-jsx/css'

const styles = css.global`
  .core-button {
    min-width: 115px;
    height: 32px;
    border-radius: 4px;
    padding: 0 15px!important;
    outline: none!important;
    box-shadow: none!important;
    border: none;
    font-size: 10px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: 1.54px;
    text-align: center;
    color: #ffffff;
    text-transform: uppercase;
    &:hover,
    &:focus,
    &:active {
    }
    &.primary {
      background-color: #ff865c;
      &:focus,
      &:active,
      &:hover {
        background-color: #995037;
        color: #ffffff;
      }
      &.inactive {
        background-color: #ffb79d;
      }
    }
    &.secondary {
      background-color: #714fff;
      &:focus,
      &:active,
      &:hover {
        background-color: #442f99;
        color: #ffffff;
      }
      &.inactive {
        background-color: #ffb79d;
      }
    }
    &.third {
      background-color: #ff82be;
      &:focus,
      &:active,
      &:hover {
        background-color: #f86baf;
        color: #ffffff;
      }
      &.inactive {
        background-color: #ffb79d;
      }
    }
    &.standard {
      background-color: #2a2a2c;
      &:focus,
      &:active,
      &:hover {
        background-color: #757575;
        color: #ffffff;
      }
      &.inactive {
        background-color: #bdbdbd;
      }
    }
    &.border {
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      color: #2a2a2c;
      &:focus,
      &:active,
      &:hover {
        background-color: #757575;
        color: #fff;
      }
      &.inactive {
        background-color: #bdbdbd;
        color: #2a2a2c;
      }
    }
    &.gray {
      background-color: #f5f5f5;
      line-height: 1.2;
      letter-spacing: 1.54px;
      text-align: center;
      color: #2a2a2c;
      &:focus,
      &:active,
      &:hover {
        background-color: #757575;
        color: #ffffff;
      }
      &.inactive {
        background-color: #bdbdbd;
      }
    }
    &.ghost {
      background-color: #fff;
      color: #2a2a2c;
      &:focus,
      &:active,
      &:hover {
        background-color: #2a2a2c;
        color: #ffffff;
      }
      &.inactive {
        background-color: #fff;
        color: #9e9e9e;
      }
      &.border {
          border: solid 1px #e0e0e0;
      }
    }
    &.link {
      background-color: #fff;
      color: #ff865c;
      &:focus,
      &:active,
      &:hover {
        background-color: #fff;
        color: #ff865c;
      }
    }
    &.icon {
      padding: 0!important;
      width: 24px;
      height: 24px;
      background-color: #e3e3e3;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:focus,
      &:active,
      &:hover {
        background-color: #e3e3e3;
      }
    }
  }
`

const UIButton = ({children, ...props}) => {

  return (
    <Button
      {...props}
      className={`${props?.className || ''} core-button`}>
      {children}
      <style jsx>{styles}</style>
    </Button>
  )
}

UIButton.defaultProps = {
  label: "Button"
}

export default UIButton