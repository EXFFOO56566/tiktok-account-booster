import Layout from "@app/components/layout";
import React from "react";
import UISearch from "@app/components/core/input/search";
import { Dropdown, Menu, Modal, Progress } from "antd";
import UIButton from "@app/components/core/button";
import UITable from "@app/components/core/table";

import MoreIcon from "@app/resources/images/more.svg";
import {delay, encodeString} from "@app/utils";
import { Link } from "react-router-dom";
import moment from "moment";
import Can from "@app/services/casl/can";
import { runFunction } from "@app/services/casl/ability";
import {PageLoadingOpacity} from "@app/components/core/loading";
import {onDelete} from "@app/components/del";

export default () => {
  const [isLoading, setLoading] = React.useState(false);
  const [searchValue, setSearch] = React.useState({ key: "email", value: "" });
  const [isReloadTable, setReloadTable] = React.useState("");
  const [userIds, setUserIds] = React.useState([]);

  const onSearch = (value) => {
    if (value === "") {
      delay(() => {
        setReloadTable(new Date().getTime().toString());
        setSearch({
          ...searchValue,
          value: "",
        });
      }, 300);
    } else {
      delay(() => {
        setSearch({
          ...searchValue,
          value,
        });
      }, 300);
    }
  };

  const removeUsers = () => {
    Modal.confirm({
      title: `Are you sure want to delete users`,
      onOk: () => {
        setLoading(true);
        onDelete({
          url: "/admin/deleteUser",
          form: {
            userIds
          },
          cb: () => {
            setReloadTable(new Date().getTime().toString())
            setLoading(false)
          }
        })
      },
    });
  };

  return (
    <Layout title="Server" description="desc of server">
      <div className="core-card">
        <div className="flex justify-between">
          <div className="flex">
            <UISearch
              onChange={({ target: { value } }) => onSearch(value)}
              onKeyDown={(event) => {
                const keyCode = event.which || event.keyCode;
                const { value: search } = event.target;
                if (keyCode === 13 && search) {
                  setSearch({
                    ...searchValue,
                    value: search,
                  });
                }
              }}
              placeholder="Search User Name, Email"
            />
          </div>
          <Can I="edit" a="functions">
            {
              userIds?.length > 0 && (
                <UIButton onClick={removeUsers} className="third">
                  Remove user
                </UIButton>
              )
            }
          </Can>
        </div>

        <div className="mt-6">
          <UITable
            onSelectAll={(e, a) => {
              setUserIds(e)
            }}
            customComp={{
              boost_completion: ({ text }) => (
                <div className="flex">
                  <Progress
                    percent={0}
                    showInfo={false}
                    strokeColor="#52c41a"
                    trailColor="#e0e0e0"
                  />
                  <div className="ml-5">0%</div>
                </div>
              ),
              bought_date: ({ row }) => (
                <div className="text-left">
                  {row?.transaction?.createdAt &&
                    moment(row?.transaction?.createdAt).format("DD/MM/YYYY")}
                </div>
              ),
              boost_date: ({ row }) => (
                <div className="text-left">
                  {row?.historyBoost?.updatedAt &&
                    moment(row?.historyBoost?.updatedAt).format("DD/MM/YYYY")}
                </div>
              ),
              uniqueId: ({ text, row }) => (
                <div className="text-left flex items-center">
                  <img
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#ffffff'
                    }}
                    className="mx-2 rounded-full"
                    src={row?.covers}
                    alt=""
                  />
                  <Can I="edit" a="functions">
                    @{text}
                  </Can>
                  <Can I="guess" a="functions">
                    @{encodeString(text)}
                  </Can>
                </div>
              ),
              action: ({ row }) => (
                <div className="flex items-center justify-center">
                  <Dropdown
                    align="bottomRight"
                    overlayStyle={{ width: 124 }}
                    overlay={
                      <Menu style={{ borderRadius: 4 }}>
                        <Menu.Item key="0">
                          <Link to={`/users/${row?._id}/`}>Edit</Link>
                        </Menu.Item>

                        <Menu.Item
                          key="3"
                          onClick={() =>
                            runFunction(() => {
                              Modal.confirm({
                                title: `Are you sure want to delete ${row?.uniqueId}`,
                                onOk: () => {},
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
            isReload={isReloadTable}
            service={`/admin/getListUser`}
            search={searchValue}
            isHiddenPg={false}
            defineCols={[
              {
                name: () => (
                  <div className="text-left flex items-center">
                    <span>username</span>
                  </div>
                ),
                code: "uniqueId",
                sort: 1,
              },
              {
                name: () => <div className="text-center">Follower No.</div>,
                code: "fans",
                sort: 2,
              },
              {
                name: () => <div className="text-center">Following No.</div>,
                code: "following",
                sort: 3,
              },
              {
                name: () => <div className="text-center">Like No.</div>,
                code: "like",
                sort: 4,
              },
              {
                name: <div className="text-center">Wallet</div>,
                code: "wallet",
                sort: 5,
              },
              {
                name: <div className="text-center">Bought</div>,
                code: "numOfTransaction",
                sort: 6,
              },
              {
                name: <div className="text-center">Boost Date</div>,
                code: "boost_date",
                sort: 7,
              },
              {
                name: <div className="text-center">Bought Date</div>,
                code: "bought_date",
                sort: 8,
              },
              {
                name: <div className="text-center">Boost completion</div>,
                code: "boost_completion",
                sort: 9,
              },
              {
                name: () => <div className="text-center">Action</div>,
                code: "action",
                sort: "end",
              },
            ]}
            payload={{}}
            headerWidth={{
              username: 184,
              action: 92,
              bought: 92,
              like: 92,
              wallet: 70,
              followers: 126,
              following: 130,
              boost_date: 126,
              bought_date: 130,
              bought_completion: 253,
            }}
            columns={[]}
          />
        </div>
      </div>
      {isLoading && <PageLoadingOpacity/>}
    </Layout>
  );
};
