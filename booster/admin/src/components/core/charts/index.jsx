import React from "react";
import {FormatNumber} from "@app/utils/fotmat-number";

export const CustomizedXTickPack = ({x, y, textAnchor, fill, payload: {value}, ...props}) => {
  return (
    <text
      x={x}
      y={y+10}
      style={{fontSize: 9, color: '#2a2a2c', lineHeight: 1.56, letterSpacing: 1.35}}
      fill={fill}
      textAnchor={textAnchor}>
      {value}
    </text>
  )
}

export const CustomizedYTickBoost = ({x, y, textAnchor, fill, payload: {value}, ...props}) => {
  let data = value

  if (props?.type === "pack" || props?.type === "users") {
    data = FormatNumber('#.##0,##', value || 0)
  }

  return (
    <text
      x={x}
      y={y}
      style={{fontSize: 9, color: '#2a2a2c', lineHeight: 1.56, letterSpacing: 1.35}}
      fill={fill}
      textAnchor={textAnchor}
      dominantBaseline="central">
      {data}
    </text>
  )
}

export const CustomTooltip = ({active, payload, label}) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        {
          payload?.map((item, index) => (
            <div className="mb-2" key={index}>
              <div className="custom-tooltip__title uppercase">{item?.name}</div>
              <div className="custom-tooltip__content uppercase">{item?.value}</div>
            </div>
          ))
        }
      </div>
    );
  }

  return null;
};