import React from "react";
import {Link} from "react-router-dom";
import css from 'styled-jsx/css'

import Container from "@app/components/core/container";
import Row from "@app/components/core/row";
import Col from "@app/components/core/col";
import UIButton from "@app/components/core/button";
import Layout from "@app/components/layout";

const styles = css.global`
  .login {
    background: url("/images/bg_login.svg");
    background-size: cover;
    background-repeat: no-repeat;
    padding-top: 104px;
    .login-content {
      width: 416px;
      height: fit-content;
      border-radius: 4px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      padding: 16px;
      margin: auto;
    }
    .title-login {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: center;
      color: #2a2a2c;
      margin-bottom: 18px;
    }
  }
`

const Success = ({location, history, ...props}) => {

  return (
    <Layout title="Đăng nhập" className="login flex ustify-center h-screen">
      <Container>
        <Row>
          <Col className="col-sm-3"/>
          <Col className="col-sm-6">
            <div className="login-content">
              <div className="title-login">
                Password Was Updated
              </div>
              <Link to="/login" className=" flex-1">
                <UIButton className="w-full third">
                  Back to Log In
                </UIButton>
              </Link>
            </div>
          </Col>
          <Col className="col-sm-3"/>
        </Row>
      </Container>
      <style jsx>{styles}</style>
    </Layout>
  )
}

export default Success