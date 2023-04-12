import React from "react";
import {Formik} from "formik";
import {Form, Input} from "antd";
import * as Yup from "yup";
import css from 'styled-jsx/css'
import {Link} from "react-router-dom";
import {withRouter} from "react-router";

import {LoadingIcon} from "@app/components/core/loading-icon";
import Container from "@app/components/core/container";
import Row from "@app/components/core/row";
import Col from "@app/components/core/col";
import UIButton from "@app/components/core/button";
import {auth} from "@app/services/firebase";
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

const RequestPass = ({location, history, ...props}) => {
  const [isLoading, setLoading] = React.useState(false)
  const [isSent, setSent] = React.useState(false)
  const fields = {
    email: "email"
  };

  const initialValues = {
    [fields.email]: "",
  };

  const validationSchema = Yup.object({
    [fields.email]: Yup.string()
      .email("Invalid email")
      .required("Please enter email to receive reset password link")
  });

  console.log(process.env.NODE_URL)
  const onHandleSubmit = async (formValues) => {
    setLoading(true)
    auth.sendPasswordResetEmail(formValues?.email).then(() => {
      setLoading(false)
      setSent(true)
    }).catch((error) => {
     setLoading(false)
    });
  };

  const removeError = ({errors, name, setErrors}) => {
    const newErrors = {...errors};
    delete newErrors?.[name];
    setErrors({...newErrors});
  };

  return (
    <Layout title="Request reset password" className="login flex ustify-center h-screen">
      <Container>
        <Row>
          <Col className="col-sm-3"/>
          <Col className="col-sm-6">
            <div className="login-content">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onHandleSubmit}
              >
                {(form) => {
                  const {
                    values,
                    errors,
                    handleSubmit,
                    setFieldValue,
                    setErrors,
                  } = form;

                  return (
                    <Form onFinish={handleSubmit}>
                      <div className="title-login">
                        Reset Password
                      </div>
                      <Form.Item
                        className="core-form-item w-full block mb-3"
                        label="Email receives reset link"
                        hasFeedback={!!errors[fields.email]}
                        validateStatus={errors[fields.email] && "error"}
                        help={errors[fields.email]}
                      >
                        <Input
                          name={fields.email}
                          placeholder="Please enter email to receive reset password link"
                          value={values[fields.email]}
                          onChange={({target: {value}}) => {
                            setFieldValue(fields.email, value, false);
                            removeError({
                              errors,
                              name: fields.email,
                              setErrors,
                            });
                          }}
                        />
                      </Form.Item>
                      <div className="flex mt-10">
                        <UIButton
                          disabled={isLoading}
                          htmlType="submit"
                          className="third capitalize filled-error flex-1 mr-4">
                          {isLoading && <LoadingIcon/>}
                          {isSent ? 'resend' : 'send'}
                        </UIButton>
                        <Link to="/login" className=" flex-1">
                          <UIButton
                            className="gray capitalize filled-error flex-1 w-full">
                            Back to Log In
                          </UIButton>
                        </Link>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            {
              isSent && (
                <div className="core-alert flex items-center success">
                  <div>
                    <i className="far fa-exclamation-triangle"/>
                  </div>
                  <div>Please check your email</div>
                </div>
              )
            }
          </Col>
          <Col className="col-sm-3"/>
        </Row>
      </Container>
      <style jsx>{styles}</style>
    </Layout>
  )
}

export default withRouter(RequestPass)