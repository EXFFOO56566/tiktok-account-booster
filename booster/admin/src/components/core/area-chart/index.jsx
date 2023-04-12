import {Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart as AChart} from "recharts";
import React from "react";
import {CustomizedXTickPack, CustomizedYTickBoost, CustomTooltip} from "@app/components/core/charts";

const AreaChart = ({ data = [], xAxisDataKey = "name", dataKey = "value", type = "users" }) => {

  return (
    <div style={{width: '100%', height: 300}} className="flex-1">
      <ResponsiveContainer>
        <AChart
          data={data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey={xAxisDataKey} tick={<CustomizedXTickPack/>}/>
          <YAxis tick={<CustomizedYTickBoost type={type}/>}/>
          <Tooltip content={<CustomTooltip/>}/>
          <Area stackId="name" dot={{stroke: '#714fff', strokeWidth: 4}}
                type="linear" dataKey={dataKey} stroke="#714fff"
                fill="rgba(113, 79, 255, 0.2)"/>
        </AChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AreaChart