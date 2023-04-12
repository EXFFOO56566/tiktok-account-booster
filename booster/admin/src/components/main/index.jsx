import * as React from "react";
import css from "styled-jsx/css";
import { connect } from "react-redux";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link, NavLink, withRouter } from "react-router-dom";

import ActionIcon from "@app/resources/images/circle_logo.png";
import Logo from "@app/resources/images/logo.svg";
import { loadUser } from "@app/redux/actions";
import { PageLoadingOpacity } from "@app/components/core/loading";
import { LocalStore } from "@app/utils/local-storage";
import { envName } from "@app/configs";
import Can from "@app/services/casl/can";

const { Header, Content } = Layout;

const menu = ({ logout }) => (
  <Menu style={{ borderRadius: 4 }}>
    <Menu.Item key="1">
      <Link to={"/profile"}>Edit profile</Link>
    </Menu.Item>
    <Menu.Item key="2" onClick={logout}>
      Log out
    </Menu.Item>
  </Menu>
);

const Action = ({ logout, userName = "" }) => (
  <Dropdown overlay={menu({ logout })} trigger={["click"]}>
    <a
      className="ant-dropdown-link flex items-center"
      onClick={(e) => e.preventDefault()}
    >
      <Avatar
        src={ActionIcon}
        className="my-avatar"
        shape="circle"
        size="small"
      />
      <span style={{ marginLeft: 14 }} className="flex items-center">
        <span className="user-name" style={{ paddingRight: 32 }}>
          {userName}
        </span>
        <DownOutlined width={24} height={24} />
      </span>
    </a>
  </Dropdown>
);

const styles = css.global`
  .undefined {
    padding: 0 !important;
  }
  .site-layout-background.header {
    height: 56px;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      font-size: 13px;
      line-height: 1.38;
      letter-spacing: 0.3px;
      color: #2a2a2c;
    }
    .my-avatar {
      width: 40px;
      height: 40px;
      overflow: hidden;
      border-radius: 40px;
    }
    .logo {
      margin-right: 37px;
      img {
        width: 110px;
      }
    }
    .list-menu {
      li {
        a {
          font-size: 10px;
          font-weight: bold;
          line-height: 1.2;
          letter-spacing: 1.54px;
          position: relative;
          padding: 0 18px;
          height: 56px;
          display: flex;
          align-items: center;
          color: #9e9e9e;
          i {
            font-size: 16px !important;
            color: #9e9e9e;
            margin-right: 13px;
          }
          &.active {
            color: var(--primary-text-color);
            i {
              color: var(--primary-text-color);
            }
            &:after {
              width: 100%;
              height: 3px;
              background-color: #714fff;
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
            }
          }
        }
      }
    }
  }
`;

class DefaultMain extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {}

  logOut = () => {
    const { history, loadUser } = this.props;

    this.setState({ loading: true });

    LocalStore.local.remove(`${envName}-uuid`);
    setTimeout(() => {
      loadUser();
      this.setState({ loading: false });
    }, 1000);
  };

  getProfile = () => {};

  render() {
    const { children, user } = this.props;

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          {user && (
            <Header className="site-layout-background header">
              <div className="logo">
                <Link to={"/"}>
                  <img src={Logo} alt="" />
                </Link>
              </div>
              <ul className="flex items-center flex-1 list-menu">
                <li>
                  <NavLink exact to="/" className="uppercase">
                    <i className="fal fa-chart-bar" />
                    <div>Dashboard</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/users" className="uppercase">
                    <i className="fal fa-user" />
                    <div>Users</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/boost" className="uppercase">
                    <i className="fab fa-pushed" />
                    <div>Boost</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/packs" className="uppercase">
                    <i className="fal fa-shopping-cart" />
                    <div>Packs</div>
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/ads" className="uppercase">
                    <i className="fal fa-shopping-cart" />
                    <div>Ads</div>
                  </NavLink>
                </li>
              </ul>
              <Action
                userName={`${user?.firstName || ""} ${user?.lastName || ""}`}
                logout={this.logOut}
              />
            </Header>
          )}
          <Content
            className={`site-layout-background ${!user ? "undefined" : ""}`}
            style={{
              minHeight: 280,
              padding: "24px 74px",
            }}
          >
            {children}
          </Content>
        </Layout>
        <style jsx>{styles}</style>
        {this.state.loading && <PageLoadingOpacity />}
      </Layout>
    );
  }
}

const mapDispatchToProps = {
  loadUser,
};

const mapStatesToProps = (states) => ({
  user: states.global.user,
});

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(withRouter(DefaultMain));
