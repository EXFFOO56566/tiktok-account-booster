import {Form, Input, notification, Select} from "antd";
import UICPopup from "@app/components/core/popup/cpopup";
import React from "react";
import * as Yup from "yup";
import {Formik} from 'formik'
import UIButton from "@app/components/core/button";
import {removeError} from "@app/utils";
import { POST } from "@app/request";
import { runFunction } from "@app/services/casl/ability";
import Can from "@app/services/casl/can";

export const BoostDetail = ({onClose, cb, data = undefined}) => {
  const [formData, setFormData] = React.useState({
    stars: undefined,
    numberOfFollower: undefined,
  })

  const validateSchema = Yup.object({
    stars: Yup.number()
      .required("Please input number of stars"),
    numberOfFollower: Yup.number()
      .required("Please input number of follows"),
  })

  React.useEffect(() => {
    if (data) {

      setFormData({
        stars: data?.stars,
        numberOfFollower: data?.numberOfFollower
      })
    }
  }, [])

  React.useEffect(() => {

  }, [])

  const create = (form) => {
    POST(`/admin/createBoost`, form)
    .then(({ data }) => {
      notification.info({
        description: `Boost was created successfully`,
        placement: "bottomRight",
        duration: 2,
        icon: "",
        className: "core-notification info",
      });
      onClose()
      cb()
    })
    .catch((err) => {
      notification.info({
        description: `Boost was created failure`,
        placement: "bottomRight",
        duration: 2,
        icon: "",
        className: "core-notification error",
      });
    })
  }

  const update = (form) => {
    POST(`/admin/updateBoost`, {
      ...form,
      boostId: data?._id
    })
      .then(({ data }) => {
        notification.info({
          description: `Boost was updated successfully`,
          placement: "bottomRight",
          duration: 2,
          icon: "",
          className: "core-notification info",
        });
        onClose()
        cb()
      })
      .catch((err) => {
        notification.info({
          description: `Boost was updated failure`,
          placement: "bottomRight",
          duration: 2,
          icon: "",
          className: "core-notification error",
        });
      })
  }

  return (
    <UICPopup
      hiddenFooter={true}
      onCancel={onClose}
      textCancel="Cancel"
      textOk="Save"
      title={`${data ? 'Update' : 'New'} Boost`} width={416}>
      <Formik
        onSubmit={(e) => {
          runFunction(() => {
            if (!data) {
              create(e)
            } else {
              update(e)
            }
          })
        }}
        validationSchema={validateSchema}
        initialValues={formData}
        enableReinitialize
      >
        {
          ({setErrors, setFieldValue, errors, values, handleSubmit}) => {

            return (
              <Form onFinish={handleSubmit} className="block w-full">
                <Form.Item
                  hasFeedback={!!errors["stars"]}
                  validateStatus={errors["stars"] && "error"}
                  help={errors["stars"]}
                  className="core-form-item w-full mb-2 block" label="number of stars">
                  <Input
                    type="number"
                    onChange={({target: {value}}) => {
                      setFieldValue("stars", value, false)
                      removeError({
                        errors,
                        name: "stars",
                        setErrors,
                      });
                    }}
                    placeholder="Number of stars ⭐️" value={values?.stars} className="w-full"/>
                </Form.Item>
                <Form.Item
                  hasFeedback={!!errors["numberOfFollower"]}
                  validateStatus={errors["numberOfFollower"] && "error"}
                  help={errors["numberOfFollower"]}
                  className="core-form-item w-full mb-2 block" label="number of follows">
                  <Input
                    type="number"
                    onChange={({target: {value}}) => {
                      setFieldValue("numberOfFollower", value, false)
                      removeError({
                        errors,
                        name: "numberOfFollower",
                        setErrors,
                      });
                    }}
                    placeholder="Number of follows" value={values?.numberOfFollower} className="w-full"/>
                </Form.Item>
                <div className="flex justify-end pt-4 border-0 border-t border-solid border-gray-200">
                  <UIButton
                    onClick={onClose} className="ghost border mr-4">Cancel</UIButton>
                  <Can I="edit" a="functions">
                    <UIButton
                      htmlType="submit" className="secondary"
                      style={{background: 'var(--third-color)'}}>Save</UIButton>
                  </Can>
                </div>
              </Form>
            )
          }
        }
      </Formik>
    </UICPopup>
  )
}