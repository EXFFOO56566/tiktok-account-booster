import Layout from "@app/components/layout";
import React from "react";
import UIButton from "@app/components/core/button";
import UITable from "@app/components/core/table";
import { Dropdown, Menu, Modal } from "antd";
import MoreIcon from "@app/resources/images/more.svg";
import { PackDetail } from "@app/modules/packs/components/detail";
import { runFunction } from "@app/services/casl/ability";
import {onDelete} from "@app/components/del";
import * as moment from "moment";

export default () => {
  const [isReloadTable, setReloadTable] = React.useState("")
  const [showAddPack, setShowAddPack] = React.useState({
    status: false,
    data: undefined,
  });

  return (
    <Layout className="" title="Boost">
      <div className="core-card">
        <div className="flex justify-end">
          <UIButton
            className="third third-bg uppercase"
            style={{ background: "var(--third-color)" }}
            onClick={() =>
              setShowAddPack({
                ...showAddPack,
                status: true,
              })
            }
          >
            new pack
          </UIButton>
        </div>

        <div className="mt-6">
          <UITable
            customComp={{
              packageStar: ({ text }) => (
                <div className="text-left">{text} ⭐</div>
              ),
              createdAt: ({text}) => <div>{moment(text).format("DD/MM/YYYY")}</div>,
              updatedAt: ({text}) => <div>{moment(text).format("DD/MM/YYYY")}</div>,
              packageName: ({ text }) => <div className="text-left">{text}</div>,
              pricing: ({ text }) => <div className="text-left">${text}</div>,
              action: ({ row }) => (
                <div className="flex items-center justify-center">
                  <Dropdown
                    align="bottomRight"
                    overlayStyle={{ width: 124 }}
                    overlay={
                      <Menu style={{ borderRadius: 4 }}>
                        <Menu.Item
                          key="0"
                          onClick={() =>
                            setShowAddPack({
                              data: row,
                              status: true,
                            })
                          }
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          key="3"
                          onClick={() =>
                            runFunction(() => {
                              Modal.confirm({
                                title: `Are you sure want to delete ${row?.packageName}`,
                                onOk: () => onDelete({
                                  url: "/admin/removePackage",
                                  form: {
                                    "packageId" : row?._id,
                                    "os": row?.os
                                  },
                                  cb: () => setReloadTable((new Date()).getTime().toString())
                                }),
                              });
                            })
                          }
                        >
                          Remove
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                  >
                    <UIButton className="icon" style={{ minWidth: 24 }}>
                      <img src={MoreIcon} alt="" width={24} height={24} />
                    </UIButton>
                  </Dropdown>
                </div>
              ),
            }}
            service={`/admin/getAllPackages`}
            isHiddenPg={false}
            defineCols={[
              {
                name: () => (
                  <div className="text-left flex items-center">
                    <span>Pack name</span>
                  </div>
                ),
                code: "packageName",
                sort: 1,
              },
              {
                name: () => <div className="text-center">pricing</div>,
                code: "pricing",
                sort: 2,
              },
              {
                name: () => <div className="text-center">number of stars</div>,
                code: "packageStar",
                sort: 3,
              },
              {
                name: () => <div className="text-center">Purchase Id</div>,
                code: "packageId",
                sort: 4,
              },
              {
                name: () => <div className="text-center">packs bought</div>,
                code: "packs_bought",
                sort: 5,
              },
              {
                name: <div className="text-center">created date</div>,
                code: "createdAt",
                sort: 6,
              },
              {
                name: <div className="text-center">updated date</div>,
                code: "updatedAt",
                sort: 7,
              },
              {
                name: () => <div className="text-center">Action</div>,
                code: "action",
                sort: "end",
              },
            ]}
            payload={{}}
            headerWidth={{
              username: 194,
              action: 92,
              bought: 92,
              like: 92,
              wallet: 70,
              followers: 126,
              following: 126,
              boost_date: 126,
              bought_date: 126,
              bought_completion: 253,
            }}
            columns={[]}
            isReload={isReloadTable}
          />
        </div>
      </div>
      {showAddPack?.status && (
        <PackDetail
          data={showAddPack?.data}
          onClose={() =>
            setShowAddPack({
              data: undefined,
              status: false,
            })
          }
          cb={() => setReloadTable((new Date()).getTime().toString())}
        />
      )}
    </Layout>
  );
};
