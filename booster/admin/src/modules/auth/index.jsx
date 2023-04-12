import queryString from "query-string";
import React from "react";

export default ({ location, history }) => {
  React.useEffect(() => {
    const currentQuery = queryString.parse(location.search);

    if (currentQuery?.mode === "resetPassword" && currentQuery?.oobCode) {
      let query = {
        oobCode: currentQuery?.oobCode
      };
      history.push(`/reset-password?${queryString.stringify(query)}`);
    } else {
      history.push(`/`);
    }
  }, [])

  return <span/>
}