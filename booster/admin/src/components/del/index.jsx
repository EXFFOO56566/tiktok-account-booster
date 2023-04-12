import {POST} from "@app/request";
import {notification} from "antd";

export const onDelete = ({url = "", form = {}, cb = () => {}}) => {
  POST(url, form)
    .then(({ data }) => {
      notification.info({
        description: `Deleted successfully`,
        placement: "bottomRight",
        duration: 2,
        icon: "",
        className: "core-notification info",
      });
      cb()
    })
    .catch((err) => {
      notification.info({
        description: `Deleted failure`,
        placement: "bottomRight",
        duration: 2,
        icon: "",
        className: "core-notification error",
      });
    })
}