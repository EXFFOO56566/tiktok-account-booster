import React from "react";
import {Input, Form} from "antd";
import css from 'styled-jsx/css'
import {InputProps} from "antd/lib/input";

const styles = css.global`
`

const UIInput = (props): InputProps => {


  return (
    <Form.Item
      className="core-form-item"
      label="HAHA"
    >
      <Input {...props}/>
      <style jsx>{styles}</style>
    </Form.Item>
  )
}

export default UIInput;