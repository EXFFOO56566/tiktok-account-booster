import React from "react";
import {Formik} from "formik";
import {Form, Input} from "antd";
import * as Yup from "yup";
import css from 'styled-jsx/css'
import {Link} from "react-router-dom";
import queryString from "query-string";

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

const ResetPass = (props) => {
  const [message, setMessage] = React.useState()
  const [isLoading, setLoading] = React.useState(false)
  const fields = {
    passwordConfirm: "passwordConfirm",
    password: "password",
  };

  const initialValues = {
    [fields.email]: "",
    [fields.password]: "",
  };

  const validationSchema = Yup.object({
    [fields.password]: Yup.string()
      .required('Please Enter your password')
      .min(8, "Must contain 8 characters"),
    [fields.passwordConfirm]: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match',
    ),
  });

  const onHandleSubmit = async (formValues) => {
    setLoading(true)
    const currentQuery = queryString.parse(location.search);

    if (currentQuery?.oobCode) {

      auth.confirmPasswordReset(currentQuery?.oobCode, formValues?.password)
        .then((result) => {
          setMessage({ isError: false, text: "Password reset has been confirmed and new password updated" })
          setTimeout(() => {
            props?.history.push('/auth/success')
          }, 1500)
          setLoading(false)
        })
        .catch((result) => {
          setMessage({ isError: true, text: "Error occurred during confirmation. The code might have expired or the password is too weak" })
          setLoading(false)
        })
    } else {
      setMessage({ isError: true, text: "Error occurred during confirmation. The code might have expired or the password is too weak" })
    }
  };

  const removeError = ({errors, name, setErrors}) => {
    const newErrors = {...errors};
    delete newErrors?.[name];
    setErrors({...newErrors});
  };

  React.useEffect(() => {
  }, [])

  return (
    <Layout title="Reset Password" className="login flex ustify-center h-screen">
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
                        label="New password"
                        hasFeedback={!!errors[fields.password]}
                        validateStatus={errors[fields.password] && "error"}
                        help={errors[fields.password]}
                      >
                        <Input
                          type="password"
                          name={fields.password}
                          placeholder="New password"
                          value={values[fields.password]}
                          onChange={({target: {value}}) => {
                            setFieldValue(fields.password, value, false);
                            removeError({
                              errors,
                              name: fields.password,
                              setErrors,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="confirm new password"
                        className="core-form-item w-full block"
                        validateStatus={
                          errors[fields.passwordConfirm] && "error"
                        }
                        help={errors[fields.passwordConfirm]}
                      >
                        <Input
                          type="password"
                          name={fields.passwordConfirm}
                          placeholder="confirm new password"
                          value={values[fields.passwordConfirm]}
                          onChange={({target: {value}}) => {
                            setFieldValue(fields.passwordConfirm, value, false);
                            removeError({
                              errors,
                              name: fields.passwordConfirm,
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
                          Submit
                        </UIButton>
                        <Link to="/login" className="flex-1 w-full">
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
              message && (
                <div className={`core-alert flex items-center ${!message?.isError ? 'success' : ''}`}>
                  <div>
                    <i className="far fa-exclamation-triangle"/>
                  </div>
                  <div>{message?.text}</div>
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

export default ResetPass