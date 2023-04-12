import React from "react";
const md5 = require('md5');
import {Formik} from "formik";
import {Form, Input} from "antd";
import * as Yup from "yup";
import css from 'styled-jsx/css'

import {LoadingIcon} from "@app/components/core/loading-icon";
import Container from "@app/components/core/container";
import Row from "@app/components/core/row";
import Col from "@app/components/core/col";
import UIButton from "@app/components/core/button";
import {withRouter} from "react-router";
import {auth, firestore} from "@app/services/firebase";
import {LocalStore} from "@app/utils/local-storage";
import {firebaseConfig} from "@app/configs";
import {LoadingPage} from "@app/components/core/loading";
import Layout from "@app/components/layout";

const styles = css.global`
  .login {
    background: url("/images/bg_login.svg");
    background-size: cover;
    background-repeat: no-repeat;
    padding-top: 125px;
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

const Admin = ({location, history}) => {
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")
  const [isLoading, setLoading] = React.useState(false)
  const [isPageLoading, setPageLoading] = React.useState(true)
  const fields = {
    email: "email",
    password: "password",
    first_name: "first_name",
    last_name: "last_name",
    passwordConfirm: "passwordConfirm",
  };

  const initialValues = {
    [fields.email]: "",
    [fields.password]: "",
    [fields.first_name]: "",
    [fields.last_name]: "",
    [fields.passwordConfirm]: "",
  };

  const validationSchema = Yup.object({
    [fields.email]: Yup.string()
      .email("Invalid email")
      .required("Please enter your email"),
    [fields.first_name]: Yup.string()
      .required("Please enter your first name"),
    [fields.last_name]: Yup.string()
      .required("Please enter your last name"),
    [fields.password]: Yup.string()
      .required("Please enter a password")
      .min(8, "Must contain 8 characters"),
    [fields.passwordConfirm]: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match',
    ),
  });

  const onHandleSubmit = async (formValues) => {
    setLoading(true)
    createAdminUser(formValues)
  };

  const createAdminUser = (formValue) => {
    firestore.collection("admin").add({
      first_name: formValue?.first_name,
      last_name: formValue?.last_name,
      password: md5(formValue?.password),
      email: formValue?.email
    })
      .then(() => {
        auth.createUserWithEmailAndPassword(formValue?.email, formValue?.password)
          .then((result) => {
            LocalStore.local.set(firebaseConfig.projectId, true)
            window.location.href = "/server"
          })
          .catch((err) => {
            setLoading(false)
            setError("Saving failed, please try againh")
          })
      })
      .catch(() => {
        setLoading(false)
        setError("Saving failed, please try again")
      })
  }

  const removeError = ({errors, name, setErrors}) => {
    const newErrors = {...errors};
    delete newErrors?.[name];
    setErrors({...newErrors});
  };

  React.useEffect(() => {
    firestore.collection("admin").get()
      .then((result) => {
        setPageLoading(false)
        if (result.docs.length > 0) {
          history.push('/login')
        }
      })
  }, [])

  return (
    <Layout title="Admin" className="login flex justify-center h-screen">
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
                        Profile
                      </div>
                      <div className="flex">
                        <Form.Item
                          className="core-form-item w-full block mb-3 mr-2 flex-1"
                          label="First name"
                          hasFeedback={!!errors[fields.first_name]}
                          validateStatus={errors[fields.first_name] && "error"}
                          help={errors[fields.first_name]}
                        >
                          <Input
                            name={fields.first_name}
                            placeholder="First name"
                            value={values[fields.first_name]}
                            onChange={({target: {value}}) => {
                              setFieldValue(fields.first_name, value, false);
                              removeError({
                                errors,
                                name: fields.first_name,
                                setErrors,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          className="core-form-item w-full block mb-3 ml-2 flex-1"
                          label="Last name"
                          hasFeedback={!!errors[fields.last_name]}
                          validateStatus={errors[fields.last_name] && "error"}
                          help={errors[fields.last_name]}
                        >
                          <Input
                            name={fields.last_name}
                            placeholder="Last name"
                            value={values[fields.last_name]}
                            onChange={({target: {value}}) => {
                              setFieldValue(fields.last_name, value, false);
                              removeError({
                                errors,
                                name: fields.last_name,
                                setErrors,
                              });
                            }}
                          />
                        </Form.Item>
                      </div>
                      <Form.Item
                        className="core-form-item w-full block mb-3"
                        label="Email"
                        hasFeedback={!!errors[fields.email]}
                        validateStatus={errors[fields.email] && "error"}
                        help={errors[fields.email]}
                      >
                        <Input
                          name={fields.email}
                          placeholder="email@example.com"
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
                      <Form.Item
                        label="Password"
                        className="core-form-item w-full block mb-3"
                        validateStatus={
                          errors[fields.password] && "error"
                        }
                        help={errors[fields.password]}
                      >
                        <Input
                          type="password"
                          name={fields.password}
                          placeholder="*****"
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
                        label="confirm password"
                        className="core-form-item w-full block"
                        validateStatus={
                          errors[fields.passwordConfirm] && "error"
                        }
                        help={errors[fields.passwordConfirm]}
                      >
                        <Input
                          type="password"
                          name={fields.passwordConfirm}
                          placeholder="*****"
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
                      <div className="flex mt-10 justify-end">
                        <UIButton
                          disabled={isLoading}
                          htmlType="submit"
                          className="third capitalize filled-error w-1/3">
                          {isLoading && <LoadingIcon/>}
                          save change
                        </UIButton>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            {
              error && (
                <div className="core-alert flex items-center">
                  <div>
                    <i className="far fa-exclamation-triangle"/>
                  </div>
                  <div>{error}</div>
                </div>
              )
            }
          </Col>
          <Col className="col-sm-3"/>
        </Row>
      </Container>
      {isPageLoading && <LoadingPage/>}
      <style jsx>{styles}</style>
    </Layout>
  )
}

export default withRouter(Admin)