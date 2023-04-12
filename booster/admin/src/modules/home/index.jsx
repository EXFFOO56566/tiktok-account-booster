import Layout from "@app/components/layout";
import React from "react";
import css from 'styled-jsx/css'
import moment from "moment";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {DatePicker, Select} from "antd";
import {BASE_URL, GET, POST} from "@app/request";
import {FormatNumber} from "@app/utils/fotmat-number";
import {convertMoney} from "@app/utils";
import {CustomizedXTickPack, CustomizedYTickBoost, CustomTooltip} from "@app/components/core/charts";
import AreaChart from "@app/components/core/area-chart";

const styles = css.global`
  .custom-tooltip {
      width: 100px;
      height: fit-content;
      border-radius: 4px;
      padding: 6px;
      background-color: #424242;
      &__title {
        font-size: 9px;
        line-height: 1.56;
        letter-spacing: 1.35px;
        color: #9e9e9e;
      }
      &__content {
        font-size: 13px;
        font-weight: 600;
        line-height: 1.38;
        letter-spacing: 0.3px;
        color: #ffffff;
      }
  }
`

const COLORS = ['#89d34f', '#714fff', '#ff2e93'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
                                 cx, cy, midAngle, innerRadius, outerRadius, percent, index,
                               }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (percent * 100) > 10 ? (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : '';
};

const renderLegend = (props) => {
  const {payload} = props;

  return (
    <ul className="flex items-center justify-center w-full mt-3">
      {
        payload.map((entry, index) => {
          return (
            <li key={`item-${index}`} className={index < payload.length ? "mr-10" : ""}>
              <div className="flex items-center">
                <div style={{width: 10, height: 10, background: entry?.color, borderRadius: 10}}></div>
                <div className="ml-3">
                  {entry?.payload?.name}
                </div>
              </div>
            </li>
          )
        })
      }
    </ul>
  );
}

const RenderLegendBoost = (props) => {
  const {data = []} = props;

  return (
    <ul className="flex items-center justify-center w-full mt-3">
      {
        data.map((entry, index) => {
          return (
            <li key={`item-${index}`} className={"mr-10"}>
              <div className="flex items-center">
                <div style={{width: 10, height: 10, background: entry?.color, borderRadius: 10}}/>
                <div className="ml-3">
                  {entry?.name}
                </div>
              </div>
            </li>
          )
        })
      }
    </ul>
  );
}

const CustomizedXTickBoost = ({x, y, textAnchor, fill, payload: {value}, ...props}) => {
  let data = convertMoney(value)

  return (
    <text
      x={x}
      y={y + 10}
      style={{fontSize: 9, color: '#2a2a2c', lineHeight: 1.56, letterSpacing: 1.35}}
      fill={fill}
      textAnchor={textAnchor}>
      {data}
    </text>
  )
}

const CustomizedShapeBoost = ({x, y, width, height, color}) => {
  return (
    <g>
      <rect fill={color} x={x} y={y} width={width} height={height}/>
    </g>
  )
}

const Index = () => {
  const [currentYear, setYear] = React.useState(moment().year())
  const [currentMonth, setMonth] = React.useState({
    year: moment().year(),
    month: moment().month() + 1
  })
  const [dashboardData, setDashBoardData] = React.useState({})
  const [boostUsedByRanging, setBoostUsedByRanging] = React.useState([])
  const [packsBoughtByYear, setPacksBoughtByYear] = React.useState([])
  const [activeUsersByMonth, setActiveUsersByMonth] = React.useState([])
  const [oss, setOs] = React.useState([])
  const [packages, setPackage] = React.useState([])
  const [boosts, setBoost] = React.useState([])

  React.useEffect(() => {
    (async () => {
      const {data: dbRes} = await POST(`/admin/dashboard`)

      if (dbRes) {
        setDashBoardData(dbRes)
      }

      const {data: boostRes} = await GET(`${BASE_URL}data/charts/boost_used_by_ranging.json`)
      if (boostRes) {
        setBoostUsedByRanging(boostRes)
      }

      const {data: packsRes} = await GET(`${BASE_URL}data/charts/packs_bought_by_year.json`)
      if (packsRes) {
        setPacksBoughtByYear(packsRes)
      }

      const {data: activeUsersRes} = await GET(`/admin/getLastLoginByMonth`)
      if (activeUsersRes) {
        setActiveUsersByMonth(activeUsersRes)
      }

      const {data: osRes} = await GET(`${BASE_URL}data/os.json`)
      if (osRes) {
        setOs(osRes)
      }

      const {data: packs} = await POST(`/admin/getAllPackages`)
      if (packs) {
        setPackage(packs)
      }

      const {data: boosts} = await POST(`/api/feed/getAllBoost`)
      if (boosts) {
        setBoost(boosts)
      }

    })()
  }, [])

  const onChangeYear = (e) => {
    setYear(moment(e).year())
  }

  const onChangeMonth = (e) => {
    setMonth({
      month: moment(e).month() + 1,
      year: moment(e).year()
    })
  }

  console.log(dashboardData)
  return (
    <Layout title="Home">
      <div className="flex">
        <div className="core-card flex-1 mr-4 h-24">
          <div className="pa-10 uppercase second-text-color">total of users</div>
          <div className="title-2 uppercase text-black mt-2">
            {FormatNumber('#.##0,##', dashboardData?.totalUser || 0)}
          </div>
        </div>
        <div className="core-card flex-1 mr-4 h-24">
          <div className="pa-10 uppercase second-text-color">today boosts used</div>
          <div className="title-2 uppercase text-black mt-2">
            {FormatNumber('#.##0,##', dashboardData?.todayBooster || 0)}
          </div>
        </div>
        <div className="core-card flex-1 mr-4 h-24">
          <div className="pa-10 uppercase second-text-color">today packs bought</div>
          <div className="title-2 uppercase text-black mt-2">
            {FormatNumber('#.##0,##', dashboardData?.todayPackageBought || 0)}
          </div>
        </div>
        <div className="core-card flex-1 h-24 mr-4">
          <div className="pa-10 uppercase second-text-color">total of packs bought</div>
          <div className="title-2 uppercase text-black mt-2">
            {FormatNumber('#.##0,##', dashboardData?.totalPackageBought || 0)}
          </div>
        </div>
        <div className="core-card flex-1 h-24 mr-4">
          <div className="pa-10 uppercase second-text-color">today revenue</div>
          <div className="title-2 uppercase text-black mt-2">
            ${FormatNumber('#.##0,##', dashboardData?.todayRevenue || 0)}
          </div>
        </div>
        <div className="core-card flex-1 h-24">
          <div className="pa-10 uppercase second-text-color">total of revenue</div>
          <div className="title-2 uppercase text-black mt-2">
            ${FormatNumber('#.##0,##', dashboardData?.totalRevenue || 0)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap -mx-4">
        <div className="p-4 w-1/2">
          <div className="core-card w-full p-8" style={{maxHeight: 400}}>
            <div className="flex items-center justify-between  mb-4">
              <div className="font-bold pa-14 text-black">Packs Bought By Year ($)</div>
              <div className="flex-1 flex justify-end ml-10">
                <Select className="w-32 mr-4" placeholder="Select OS">
                  {
                    oss?.map(os => (
                      <Select.Option key={os?.code} value={os?.code}>
                        {os?.name}
                      </Select.Option>
                    ))
                  }
                </Select>
                <Select className="w-32 mr-4" placeholder="Select Pack">
                  {
                    packages?.map(pack => (
                      <Select.Option key={pack?.packageId} value={pack?.packageId}>
                        {pack?.packageName}
                      </Select.Option>
                    ))
                  }
                </Select>
                <DatePicker
                  className="w-20"
                  allowClear={false} picker="year"
                  value={moment(`01-01-${currentYear}`, "DD-MM-YYYY")}
                  onChange={onChangeYear}/>
              </div>
            </div>
            <div style={{width: '100%', height: 300}} className="flex-1">
              <ResponsiveContainer>
                <BarChart
                  layout="vertical"
                  isAnimationActive={false}
                  data={boostUsedByRanging}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis type="number" tick={<CustomizedXTickBoost/>}/>
                  <YAxis dataKey="name" type="category" tick={<CustomizedYTickBoost/>}/>
                  {
                    boostUsedByRanging?.length > 0 && <Tooltip content={<CustomTooltip/>}/>
                  }
                  <Legend content={<RenderLegendBoost data={boostUsedByRanging}/>}/>
                  <Bar dataKey="value" barSize={24} shape={<CustomizedShapeBoost/>}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="p-4 w-1/2">
          <div className="core-card w-full p-8" style={{maxHeight: 400}}>
            <div className="flex items-center justify-between  mb-4">
              <div className="font-bold pa-14 text-black">Boost Used By Year (k)</div>
              <div className="flex-1 flex justify-end ml-10">
                <Select className="w-24 mr-4" placeholder="Select Boost stars">
                  {
                    boosts?.sort((a, b) => a.stars - b.stars).map(boost => (
                      <Select.Option key={boost?._id} value={boost?._id}>
                        {boost?.stars} ⭐
                      </Select.Option>
                    ))
                  }
                </Select>
                <DatePicker
                  className="w-20"
                  allowClear={false} picker="year"
                  value={moment(`01-01-${currentYear}`, "DD-MM-YYYY")}
                  onChange={onChangeYear}/>
              </div>
            </div>
            <div style={{width: '100%', height: 300}} className="flex-1">
              <ResponsiveContainer>
                <BarChart
                  isAnimationActive={false}
                  data={packsBoughtByYear}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name" tick={<CustomizedXTickPack/>}/>
                  <YAxis tick={<CustomizedYTickBoost type="pack"/>}/>
                  { packsBoughtByYear?.length > 0 && <Tooltip content={<CustomTooltip/>}/> }
                  <Legend content={renderLegend}/>
                  <Bar name="Pack 1" dataKey="pack_1" stackId="a" fill="#ff2e93"/>
                  <Bar name="Pack 2" dataKey="pack_2" stackId="a" fill="#714fff"/>
                  <Bar name="Pack 3" dataKey="pack_3" stackId="a" fill="#89d34f"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="core-card w-full p-8" style={{maxHeight: 400}}>
          <div className="flex items-center justify-between  mb-4">
            <div className="font-bold pa-14 text-black">Active Users by Month</div>
            <DatePicker
              value={moment(`01-${currentMonth?.month < 10 ? "0" + currentMonth?.month : currentMonth?.month}-${currentMonth?.year}`, "DD-MM-YYYY")}
              allowClear={false} picker="month" onChange={onChangeMonth}/>
          </div>
          <AreaChart data={activeUsersByMonth}/>
        </div>
      </div>
      <style jsx>{styles}</style>
    </Layout>
  )
}

export default Index