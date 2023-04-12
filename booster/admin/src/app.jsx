import * as React from "react";

import MakeRoute from './router';
import StyleApp from "@app/style";
import {loadUser} from "@app/redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const App = ({ loadUser }) => {
  React.useEffect(() => {
    loadUser()
  }, [])


  return (
    <StyleApp>
      <MakeRoute/>
    </StyleApp>
  )
}

const mapDispatchToProps = ({
  loadUser
})

export default connect(null, mapDispatchToProps)(withRouter(App));


