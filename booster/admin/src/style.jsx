import css from 'styled-jsx/css';
import * as React from "react";

const styles = css.global`
  body {
    background-color: #f5f5f5;
  }
  :root {
      --primary-color: #714fff;
      --second-color: #ff865c;
      --third-color: #ff2e93;
      --red-color: #FF5630;
      --primary-text-color: #2a2a2c;
      --second-text-color: #9e9e9e;
      --error-color: #f44336;
  }
  
  .primary-color {
    color: var(--primary-color);
  }
  
  .second-color {
    color: var(--second-color);
  }
  
   .third-color {
    color: var(--third-color);
  }
  
  .second-text-color {
    color: var(--second-text-color);
  }
  
  .red-color {
    color: var(--red-color);
  }
  
  .primary-bg {
    background: var(--primary-color);
  }
  
  .second-bg {
    background: var(--second-color);
  }
  
   .third-bg {
    background: var(--third-color);
  }
  
  .red-bg {
    background: var(--red-color);
  }
  
  .title-1 {
    font-size: 40px;
  }
  .title-2 {
    font-size: 32px;
  }
  .title-3 {
    font-size: 28px;
  }
  .title-4 {
    font-size: 24px;
  }
  .title-5 {
    font-size: 20px;
  }
  .title-6 {
    font-size: 16px;
  }
  .pa-title {
      font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: 0.09px;
    color: #2a2a2c;
  }
  .pa-text {
    font-size: 13px;
    line-height: 1.38;
    letter-spacing: 0.3px;
    color: #2a2a2c;
  }
  .pa {
    font-size: 16px;
  }
  .pa-17 {
    font-size: 17px;
  }
  .pa-18 {
    font-size: 18px;
  }
  .pa-10 {
    font-size: 10px;
  }
  .pa-11 {
    font-size: 11px;
  }
  .pa-12 {
    font-size: 12px;
  }
  .pa-13 {
    font-size: 13px;
  }
  .pa-14 {
    font-size: 14px;
  }
  .pa-15 {
    font-size: 15px;
  }
  .pa-8 {
    font-size: 8px;
  }
  .href {
    color: #F91A6C;
  }
`

const StyleApp = ({children}) => (
  <>
    {children}
    <style jsx>{styles}</style>
  </>
)

export default StyleApp;
