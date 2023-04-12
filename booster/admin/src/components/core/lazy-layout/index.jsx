import css from 'styled-jsx/css';
import * as React from "react";

const styles = css`
.lazy-loading {
  position: relative;
  width: 100%;
  -webkit-animation: pulseAnimation 1.6s ease infinite;
  animation: pulseAnimation 1.6s ease infinite;
  margin-bottom: 32px;
  .content {
      height: 200px;
      overflow: hidden;
      border-radius: 4px;
      display: block;
      background-image: linear-gradient(45deg, #FAFBFC 0%, #ddd 100%);
  }
  .line_1 {
      display: block;
      height: 14px;
      background-image: linear-gradient(45deg, #FAFBFC 0%, #ddd 100%);
      border-radius: 4px;
  }
  .line_2 {
      display: block;
      height: 120px;
      background-image: linear-gradient(45deg, #FAFBFC 0%, #ddd 100%);
  }
  @keyframes pulseAnimation {
      0% {
          opacity: 1;
      }
      45% {
          opacity: .5;
      }
      100% {
          opacity: 1;
      }
  }
}
`

const LazyLoad = ({ className = 'col-sm-6' }) => (
  <div className={`lazy-loading ${className} mt-8 m-0 flex`}>
    <div className="line_2 w-32 rounded-full"/>
    <div className="content mt-2 w-64" style={{ height: 240 }}/>
    <div className="line_1 mt-4 w-1/2"/>
    <style jsx>{styles}</style>
  </div>
)


export default LazyLoad