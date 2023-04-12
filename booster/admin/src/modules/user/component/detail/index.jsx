import React from "react";
import {Modal, Progress} from "antd";
import css from "styled-jsx/css";
import UIButton from "@app/components/core/button";
import {useRouteMatch, withRouter} from "react-router";
import Layout from "@app/components/layout";
import BackIcon from "@app/resources/images/arrows-long-left.svg";
import {POST} from "@app/request";
import AreaChart from "@app/components/core/area-chart";
import {encodeString, kFormatter} from "@app/utils";
import moment from "moment";
import Can from "@app/services/casl/can";
import {PageLoadingOpacity} from "@app/components/core/loading";
import {onDelete} from "@app/components/del";

const styles = css.global`
  .ant-layout-content {
    padding: 0 !important;
  }
  .login {
    .breadcrumb-user {
      height: 48px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      padding-left: 72px;
      padding-right: 72px;
    }
    .login-content {
      min-width: 416px;
      height: fit-content;
      width: fit-content;
      border-radius: 4px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      padding: 16px;
      margin: auto;
      margin-top: 24px;
    }
    .title-login {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: left;
      color: #2a2a2c;
      margin-bottom: 18px;
    }
  }
  .main {
    min-height: 280px;
    padding: 24px 74px;
    .line {
      height: 40px;
      padding: 9px 16px 10px;
      border-top: solid 1px #e0e0e0;
      background-color: #fafafa;
      &:nth-child(odd) {
        background-color: #ffffff;
      }
    }
    .avatar {
      width: 72px;
      height: 72px;
      background-color: #ffffff;
    }

    .profile-item {
      padding: 16px 0 8px 16px;
      border-radius: 4px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      .profile-item-value {
        font-size: 32px;
        font-weight: 200;
        line-height: 1.25;
        letter-spacing: normal;
        color: #2a2a2c;
      }
    }
  }
`;

const UserDetail = ({location, history, ...props}) => {
  const router = useRouteMatch();
  const [isLoading, setLoading] = React.useState(false);

  const [userDetail, setUserDetail] = React.useState({});

  React.useEffect(() => {
    (async () => {
      if (router?.params?.id) {
        const {data: users} = await POST(`/admin/getUserDetail`, {
          userId: router?.params?.id,
        });
        setUserDetail(users?.[0] || {});
      }
    })();
  }, []);

  const remove = () => {
    const {
      match: {
        params: {id},
      },
    } = props;

    if (!id) {
      return
    }

    Modal.confirm({
      title: `Are you sure want to delete user`,
      onOk: () => {
        setLoading(true);
        onDelete({
          url: "/admin/deleteUser",
          form: {
            userIds: [id]
          },
          cb: () => {
            setLoading(false)
            history?.goBack()
          }
        })
      },
    });
  };

  const {
    match: {
      params: {type},
    },
  } = props;

  return (
    <Layout title="Admin">
      <div className="login">
        <div className="breadcrumb-user w-full flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="cursor-pointer h-full flex items-center justify-center"
              onClick={() => history?.goBack()}
            >
              <img src={BackIcon} width={24}/>
            </div>
            <div className="ml-4">
              <div className="pa-16 font-bold uppercase">
                <Can I="edit" a="functions">
                  @{userDetail?.uniqueId}
                </Can>
                <Can I="guess" a="functions">
                  @{encodeString(userDetail?.uniqueId)}
                </Can>
              </div>
              <div
                className="uppercase"
                style={{
                  fontSize: 9,
                  color: "#9e9e9e",
                  letterSpacing: "1.35px",
                }}
              >
                <Can I="edit" a="functions">
                  users/@{userDetail?.uniqueId}
                </Can>
                <Can I="guess" a="functions">
                  users/@{encodeString(userDetail?.uniqueId)}
                </Can>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <Can I="edit" a="functions">
              <UIButton
                onClick={remove}
                className="border capitalize filled-error mr-3"
              >
                remove
              </UIButton>
            </Can>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="flex justify-center ">
          <div
            className="core-card flex-1 mr-4 p-0 overflow-hidden"
            style={{height: 408}}
          >
            <div className="uppercase pa-title px-4 py-4">Boost History</div>
            <div className="h-full  overflow-y-scroll pb-16">
              {userDetail?.historyBoost?.map((item, index) => (
                <div className="line flex justify-between pa-text" key={index}>
                  <div>{moment(item?.createdAt).format("DD/MM/YYYY")}</div>
                  <div>{item?.boostStars} ⭐️</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="core-card flex-1 mr-4 p-0 overflow-hidden"
            style={{height: 408}}
          >
            <div className="uppercase pa-title px-4 py-4">
              Stars Bought History
            </div>
            <div className="h-full  overflow-y-scroll pb-16">
              {userDetail?.transaction?.map((item, index) => (
                <div className="line flex justify-between pa-text" key={index}>
                  <div>{moment(item?.createdAt).format("DD/MM/YYYY")}</div>
                  <div>{item?.packageName}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="core-card flex-1 mr-2 p-0">
            <div className="uppercase pa-title px-4 py-4">Profile</div>
            <div className="px-4 w-full flex justify-center">
              <div className="justify-center flex items-center flex-col">
                <img
                  className="avatar rounded-full"
                  src={userDetail?.covers}
                  alt=""
                />
                <div className="pa-text mt-1 font-bold">
                  <Can I="edit" a="functions">
                    @{userDetail?.uniqueId}
                  </Can>
                  <Can I="guess" a="functions">
                    @{encodeString(userDetail?.uniqueId)}
                  </Can>
                </div>
              </div>
            </div>
            <div className="px-4 mt-5 flex justify-between">
              <div className="flex flex-col flex-1 items-center justify-center">
                <div className="pa-title pa-18">
                  {kFormatter(userDetail?.following || 0)}
                </div>
                <div
                  className="text-gray-500 uppercase"
                  style={{fontSize: 8, letterSpacing: 1.25}}
                >
                  following
                </div>
              </div>
              <div className="flex flex-col flex-1 items-center justify-center">
                <div className="pa-title pa-18">
                  {kFormatter(userDetail?.fans || 0)}
                </div>
                <div
                  className="text-gray-500 uppercase"
                  style={{fontSize: 8, letterSpacing: 1.25}}
                >
                  followers
                </div>
              </div>
              <div className="flex flex-col flex-1 items-center justify-center">
                <div className="pa-title pa-18">
                  {kFormatter(userDetail?.like || 0)}
                </div>
                <div
                  className="text-gray-500 uppercase"
                  style={{fontSize: 8, letterSpacing: 1.25}}
                >
                  likes
                </div>
              </div>
            </div>
            <div className="flex px-4 mt-4">
              <div className="profile-item flex-1 mr-2">
                <div
                  className="text-gray-500 uppercase"
                  style={{fontSize: 8, letterSpacing: 1.25}}
                >
                  wallet
                </div>
                <div className="profile-item-value mt-2">
                  {userDetail?.wallet} ⭐️
                </div>
              </div>
              <div className="profile-item flex-1 ml-2">
                <div
                  className="text-gray-500 uppercase"
                  style={{fontSize: 8, letterSpacing: 1.25}}
                >
                  bought
                </div>
                <div className="profile-item-value mt-2">
                  {userDetail?.numOfBoost}
                </div>
              </div>
            </div>
            <hr/>
            <div className="flex flex-col px-4">
              <div className="uppercase pa-title">Boost completion</div>
              <div className="flex">
                <Progress
                  percent={0}
                  showInfo={false}
                  strokeColor="#52c41a"
                  trailColor="#e0e0e0"
                />
                <div className="ml-5">0%</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="core-card flex-1 mr-4 p-0 overflow-hidden w-full mt-4"
          style={{height: 408}}
        >
          <div className="uppercase pa-title px-4 py-4">Boost Completion</div>
          <AreaChart data={userDetail?.follower || []}/>
        </div>
      </div>
      {isLoading && <PageLoadingOpacity/>}
      <style jsx>{styles}</style>
    </Layout>
  );
};

export default withRouter(UserDetail);
