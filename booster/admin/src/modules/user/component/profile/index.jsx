import React from "react";

import { Formik } from "formik";
import { Form, Input, notification } from "antd";
import * as Yup from "yup";
import css from "styled-jsx/css";

import { LoadingIcon } from "@app/components/core/loading-icon";
import UIButton from "@app/components/core/button";
import { withRouter } from "react-router";
import { LocalStore } from "@app/utils/local-storage";
import { PageLoadingOpacity } from "@app/components/core/loading";
import Layout from "@app/components/layout";
import { loadUser } from "@app/redux/actions";
import { connect } from "react-redux";
import { POST } from "@app/request";
import { removeError } from "@app/utils";
import { envName } from "@app/configs";
import Can from "@app/services/casl/can";
import { runFunction } from "@app/services/casl/ability";

const styles = css.global`
  .login {
    .login-content {
      width: 416px;
      height: fit-content;
      border-radius: 4px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      padding: 16px;
      margin: auto;
      margin-bottom: 16px;
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
`;

const Profile = ({ location, history, user, profile, loadUser, ...props }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [isPageLoading, setPageLoading] = React.useState(false);
  const fields = {
    email: "email",
    password: "password",
    firstName: "firstName",
    lastName: "lastName",
    newPasswordConfirm: "passwordConfirm",
    newPassword: "newPassword",
  };

  const [initialValues, setInitialValues] = React.useState({
    [fields.email]: "",
    [fields.password]: "",
    [fields.firstName]: "",
    [fields.lastName]: "",
    [fields.newPassword]: "",
    [fields.newPasswordConfirm]: "",
  });

  const validationSchema = Yup.object({
    [fields.password]: Yup.string()
      .required("Please enter a password")
      .min(6, "Must contain 6 characters"),
    [fields.newPassword]: Yup.string()
      .required("Please enter a new password")
      .min(6, "Must contain 6 characters"),
    [fields.newPasswordConfirm]: Yup.string()
      .required("Please enter a new password confirm")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const validationProfileSchema = Yup.object({
    [fields.email]: Yup.string()
      .email("Invalid email")
      .required("Please enter your email"),
    [fields.firstName]: Yup.string().required("Please enter your first name"),
    [fields.lastName]: Yup.string().required("Please enter your last name"),
  });

  React.useEffect(() => {
    if (user && user?._id) {
      setInitialValues({
        ...initialValues,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
      });
    }
  }, []);

  const saveProfile = (formData) => {
    setLoading({
      ...isLoading,
      profile: true,
    });

    if (user && user?._id && profile === 1) {
      POST("/admin/updateProfile", {
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        userId: user._id,
      })
        .then(({ data }) => {
          setLoading({
            ...isLoading,
            profile: false,
          });
          LocalStore.local.set(`${envName}-uuid`, data?.[0] ? data?.[0] : data);
          notification.info({
            description: `Profile was updated successfully`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification info",
            onClose: () => {
              loadUser();
            },
          });
        })
        .catch(() => {
          setLoading({
            ...isLoading,
            profile: false,
          });
          notification.info({
            description: `Profile was updated failure`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification error",
          });
        });
    }
  };

  const changePass = (formData) => {
    setLoading({
      ...isLoading,
      password: true,
    });

    if (user && user?._id && profile === 1) {
      POST("/admin/changePassword", {
        password: formData?.password,
        newPassword: formData?.newPassword,
        userId: user._id,
      })
        .then(({ data }) => {
          setLoading({
            ...isLoading,
            password: false,
          });
          notification.info({
            description: `Password was updated successfully`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification info",
            onClose: () => {
              setInitialValues({
                ...initialValues,
                newPassword: "",
                newPasswordConfirm: "",
                password: "",
              });
            },
          });
        })
        .catch((error) => {
          setLoading({
            ...isLoading,
            password: false,
          });
          notification.info({
            description: error.message,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification error",
            onClose: () => {
              setLoading({
                ...isLoading,
                password: false,
              });
            },
          });
        });
    }
  };

  return (
    <Layout title="Admin" className="login flex justify-center h-screen">
      <div className="container">
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-sm-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationProfileSchema}
              onSubmit={(e) => {
                runFunction(() => saveProfile(e))
              }}
              enableReinitialize
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
                    <div className="login-content">
                      <div className="title-login">Profile</div>
                      <div className="flex">
                        <Form.Item
                          className="core-form-item w-full block mb-3 mr-2 flex-1"
                          label="First name"
                          hasFeedback={!!errors[fields.firstName]}
                          validateStatus={errors[fields.firstName] && "error"}
                          help={errors[fields.firstName]}
                        >
                          <Input
                            name={fields.firstName}
                            placeholder="First name"
                            value={values[fields.firstName]}
                            onChange={({ target: { value } }) => {
                              setFieldValue(fields.firstName, value, false);
                              removeError({
                                errors,
                                name: fields.firstName,
                                setErrors,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          className="core-form-item w-full block mb-3 ml-2 flex-1"
                          label="Last name"
                          hasFeedback={!!errors[fields.lastName]}
                          validateStatus={errors[fields.lastName] && "error"}
                          help={errors[fields.lastName]}
                        >
                          <Input
                            name={fields.lastName}
                            placeholder="Last name"
                            value={values[fields.lastName]}
                            onChange={({ target: { value } }) => {
                              setFieldValue(fields.lastName, value, false);
                              removeError({
                                errors,
                                name: fields.lastName,
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
                          disabled
                          name={fields.email}
                          placeholder="email@example.com"
                          value={values[fields.email]}
                          onChange={({ target: { value } }) => {
                            // setFieldValue(fields.email, value, false);
                            // removeError({
                            //   errors,
                            //   name: fields.email,
                            //   setErrors,
                            // });
                          }}
                        />
                      </Form.Item>
                      <Can I="edit" a="functions">
                        <div className="flex mt-10 justify-end">
                          <UIButton
                            disabled={isLoading?.profile}
                            htmlType="submit"
                            className="third capitalize filled-error w-1/3"
                          >
                            {isLoading?.profile && <LoadingIcon />}
                            save change
                          </UIButton>
                        </div>
                      </Can>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={(e) => {
                runFunction(() => changePass(e))
              }}
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
                    <div className="login-content">
                      <div className="title-login">Change password</div>
                      <Form.Item
                        label="old password"
                        className="core-form-item w-full block mb-3"
                        validateStatus={errors[fields.password] && "error"}
                        help={errors[fields.password]}
                      >
                        <Input
                          type="password"
                          name={fields.password}
                          placeholder="*****"
                          value={values[fields.password]}
                          onChange={({ target: { value } }) => {
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
                        label="new password"
                        className="core-form-item w-full block mb-3"
                        validateStatus={errors[fields.newPassword] && "error"}
                        help={errors[fields.newPassword]}
                      >
                        <Input
                          type="password"
                          name={fields.newPassword}
                          placeholder="*****"
                          value={values[fields.newPassword]}
                          onChange={({ target: { value } }) => {
                            setFieldValue(fields.newPassword, value, false);
                            removeError({
                              errors,
                              name: fields.newPassword,
                              setErrors,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="confirm new password"
                        className="core-form-item w-full block"
                        validateStatus={
                          errors[fields.newPasswordConfirm] && "error"
                        }
                        help={errors[fields.newPasswordConfirm]}
                      >
                        <Input
                          type="password"
                          name={fields.newPasswordConfirm}
                          placeholder="*****"
                          value={values[fields.newPasswordConfirm]}
                          onChange={({ target: { value } }) => {
                            setFieldValue(
                              fields.newPasswordConfirm,
                              value,
                              false
                            );
                            removeError({
                              errors,
                              name: fields.newPasswordConfirm,
                              setErrors,
                            });
                          }}
                        />
                      </Form.Item>
                      <Can I="edit" a="functions">
                        <div className="flex mt-10 justify-end">
                          <UIButton
                            disabled={isLoading?.password}
                            htmlType="submit"
                            className="third capitalize filled-error w-1/3"
                          >
                            {isLoading?.password && <LoadingIcon />}
                            save change
                          </UIButton>
                        </div>
                      </Can>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div className="col-sm-3" />
        </div>
      </div>
      {isPageLoading && <PageLoadingOpacity />}
      <style jsx>{styles}</style>
    </Layout>
  );
};

const mapDispatchToProps = {
  loadUser,
};

const mapStatesToProps = (states) => ({
  user: states.global.user,
  profile: states.global.profile,
});

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(withRouter(Profile));
