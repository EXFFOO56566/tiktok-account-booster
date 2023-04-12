import Layout from "@app/components/layout";
import React from "react";
import {Switch, Dropdown, Menu, Modal, notification} from "antd";
import {runFunction} from "@app/services/casl/ability";
import UIButton from "@app/components/core/button";
import UITable from "@app/components/core/table";
import {POST} from "@app/request";
import Can from '@app/services/casl/can'

export default () => {
  const [isReloadTable, setReloadTable] = React.useState("")
  const [changeValue, setChangeValue] = React.useState({
    id: undefined,
    value: undefined
  })
  const [isShowAddBoost, setShowAddBoost] = React.useState({
    status: false,
    data: undefined
  })

  const onUpdateAds = (form = {}) => {
    if (changeValue?.id || Object.values(form).length > 0) {
      POST('/admin/updateAds', {
        "id": changeValue.id,
        "adsId": changeValue.value || "",
        ...form
      })
        .then(({ data }) => {
          notification.info({
            description: `Ads was updated successfully`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification info",
          });
          setChangeValue({
            id: undefined,
            value: undefined
          })
          setReloadTable((new Date().getTime().toString()))
        })
        .catch((err) => {
          notification.info({
            description: `Ads was updated failure`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification error",
          });
        })
    }
  }

  return (
    <Layout title="Ads">
      <div className="core-card">
        {
          changeValue?.id && (
            <Can I="edit" a={"functions"}>
              <div className="flex justify-end mb-4">
                <UIButton onClick={() => {
                  setChangeValue({
                    id: undefined,
                    value: undefined
                  })
                  setReloadTable((new Date().getTime().toString()))
                }} className="border mr-2">Cancel</UIButton>
                <UIButton onClick={() => onUpdateAds()} className="secondary">Save</UIButton>
              </div>
            </Can>
          )
        }
        <UITable
          isReload={isReloadTable}
          customComp={{
            adsName: ({text}) => (
              <div className="text-left">
                {text}
              </div>
            ),
            adsId: ({text, row}) => (
              <div className="text-left">
                <input
                  onChange={({ target: { value } }) => {
                    runFunction(() => {
                      setChangeValue({
                        value,
                        id: row?._id
                      })
                    })
                  }}
                  value={changeValue?.id === row?._id ? changeValue?.value : text}
                  placeholder="Ads Id"
                  className="w-full outline-none px-2 py-1"/>
              </div>
            ),
            action: ({row}) => (
              <span><Switch onChange={(enable) => {
                runFunction(() => {
                  onUpdateAds({
                    "id": row?._id,
                    "adsId": row?.adsId,
                    enable
                  })
                })
              }} defaultChecked={row?.enable}/></span>
            ),
          }}
          service={`/admin/getAdPackge`}
          isHiddenPg={false}
          defineCols={[
            {
              name: () => (
                <div className="text-left">
                  <span>Ads type</span>
                </div>
              ),
              code: "adsName",
              sort: 1
            },
            {
              name: () => <div className="text-center">ads Id</div>,
              code: "adsId",
              sort: 2
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
            adsName: 989,
            adsId: 215,
          }}
          columns={[]}
        />
      </div>
    </Layout>
  )
}