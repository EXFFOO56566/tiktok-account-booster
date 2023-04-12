import Layout from "@app/components/layout";
import React from "react";
import UIButton from "@app/components/core/button";
import UITable from "@app/components/core/table";
import {Dropdown, Menu, Modal } from "antd";
import MoreIcon from "@app/resources/images/more.svg";
import {BoostDetail} from "@app/modules/boost/components/detail";
import moment from "moment";
import { runFunction } from "@app/services/casl/ability";
import {onDelete} from "@app/components/del";

export default () => {
  const [isReloadTable, setReloadTable] = React.useState("")
  const [isShowAddBoost, setShowAddBoost] = React.useState({
    status: false,
    data: undefined
  })

  return (
    <Layout className="" title="Boost">
      <div className="core-card">
        <div className="flex justify-end">
          <UIButton
            className="third third-bg uppercase" style={{background: 'var(--third-color)'}} onClick={() => setShowAddBoost({
            ...isShowAddBoost,
            status: true
          })}>
            new boost
          </UIButton>
        </div>

        <div className="mt-6">
          <UITable
            isReload={isReloadTable}
            customComp={{
              stars: ({text}) => (
                <div className="text-left">
                  {text} ⭐
                </div>
              ),
              number_of_follows: ({text}) => (
                <div className="text-left lowercase">
                  {text} followers
                </div>
              ),
              createdAt: ({text}) => (
                <div>
                  {moment(text).format("DD/MM/YYYY")}
                </div>
              ),
              updatedAt: ({text}) => (
                <div>
                  {moment(text).format("DD/MM/YYYY")}
                </div>
              ),
              action: ({row}) => (
                <div className="flex items-center justify-center">
                  <Dropdown
                    align="bottomRight"
                    overlayStyle={{width: 124}}
                    overlay={
                      <Menu style={{borderRadius: 4}}>
                        <Menu.Item
                          onClick={() => setShowAddBoost({
                            status: true,
                            data: row
                          })}
                          key="0">
                          Edit
                        </Menu.Item>
                        <Menu.Item key="3" onClick={() => runFunction(() => {
                          Modal.confirm({
                            title: `Are you sure want to delete boost`,
                            onOk: () => onDelete({
                              url: "/admin/removeBoost",
                              form: {
                                "boostId": row?._id,
                              },
                              cb: () => setReloadTable((new Date()).getTime().toString())
                            })
                          })
                        })}>
                          Remove
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <UIButton className="icon" style={{minWidth: 24}}>
                      <img src={MoreIcon} alt="" width={24} height={24}/>
                    </UIButton>
                  </Dropdown>
                </div>
              ),
            }}
            service={`/admin/getAllBoost`}
            isHiddenPg={false}
            defineCols={[
              {
                name: () => (
                  <div className="text-left flex items-center">
                    <span>number of stars</span>
                  </div>
                ),
                code: "stars",
                sort: 1
              },
              {
                name: () => <div className="text-center">number of follows</div>,
                code: "numberOfFollower",
                sort: 2
              },
              {
                name: () => <div className="text-center">boost used</div>,
                code: "boost_used",
                sort: 3
              },
              {
                name: () => <div className="text-center">created date</div>,
                code: "createdAt",
                sort: 4
              },
              {
                name: <div className="text-center">updated date</div>,
                code: "updatedAt",
                sort: 5
              },
              {
                name: () => <div className="text-center">Action</div>,
                code: "action",
                sort: 'end'
              }
            ]}
            payload={{}}
            headerWidth={{
              action: 92,
            }}
            columns={[]}
          />
        </div>
      </div>
      {
        isShowAddBoost?.status && (
          <BoostDetail
            data={isShowAddBoost?.data}
            onClose={() => setShowAddBoost({
              status: false,
              data: undefined
            })}
            cb={() => setReloadTable((new Date()).getTime().toString())}
          />
        )
      }
    </Layout>
  )
}