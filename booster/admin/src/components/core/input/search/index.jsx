import React from "react";
import {Input, Form} from "antd";
import css from 'styled-jsx/css'
import {InputProps} from "antd/lib/input";

import SearchIcon from './search.svg'

const styles = css.global`
  .core-form-item-search {
    display: inline-flex;
    flex-direction: column;
    .ant-form-item-label {
      text-align: left;
      label {
        font-size: 8px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.25;
        letter-spacing: 1.28px;
        color: #9e9e9e;
        height: auto!important;
        text-transform: uppercase;
        &:after {
          content: "";
        }
      }
    }
    input {
      width: 180px;
      height: 32px;
      border-radius: 4px;
      border: solid 1px #e0e0e0;
      background-color: #fafafa;
      box-shadow: none;
      font-size: 13px;
      line-height: 1.38;
      letter-spacing: 0.3px;
      color: #2a2a2c;
      outline: none;
      border-right: none!important;
      &::placeholder {
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.38;
        letter-spacing: 0.3px;
        color: #9e9e9e;
      }
      &:hover,
      &:focus {
        border: solid 1px #714fff;
        background-color: #ffffff;
        box-shadow: none;
        outline: none;
        border-right: none!important;
        
        & + .ant-input-group-addon {
          border: solid 1px #714fff;
          border-left: none;
          background: #fff;
        }
      }
    }
    .ant-input-group-addon {
      border: solid 1px #e0e0e0;
      border-left: none;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      background: #fafafa;
    }
  }
`

const UISearch = (props): InputProps => {


  return (
    <Form.Item
      className="core-form-item-search"
    >
      <Input {...props} addonAfter={<img src={SearchIcon}/>}/>
      <style jsx>{styles}</style>
    </Form.Item>
  )
}

export default UISearch;