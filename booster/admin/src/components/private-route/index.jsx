import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {LocalStore} from "@app/utils/local-storage";
import {envName} from "@app/configs";
import Can from "@app/services/casl/can";
import Page403 from '../core/403';

const PrivateRoute = ({ component: Component, can, ...rest }) => (
  <Route {...rest} render={(props) => (
    LocalStore.local.get(`${envName}-uuid`) ? (
      <Can I={can} a="functions" passThrough>
        {(allow) => allow ? <Component {...props} /> : <Page403/>}
      </Can>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}
      />
    )
  )} />
);

export default PrivateRoute;
