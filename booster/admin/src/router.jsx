import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import DefaultMain from "@app/components/main";
import PrivateRoute from "@app/components/private-route";
import { LoadingIcon } from './components/core/loading-icon';

export const routes = [
  {
    name: 'Home',
    component: React.lazy(() => Promise.all([
      import('@app/modules/home'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/',
    id: 'home',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: 'Profile',
    component: React.lazy(() => Promise.all([
      import('@app/modules/user/component/profile'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/profile',
    id: 'profile',
    exact: true,
    private: true,
    can: 'edit'
  },
  {
    name: 'Login',
    component: React.lazy(() => Promise.all([
      import('@app/modules/auth/components/login'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/login',
    id: 'login',
    exact: true,
    private: false,
    can: 'view'
  },
  {
    name: 'Sign up',
    component: React.lazy(() => Promise.all([
      import('@app/modules/auth/components/signup'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/signup',
    id: 'signup',
    exact: true,
    private: false,
    can: 'view'
  },
  {
    name: 'User',
    component: React.lazy(() => Promise.all([
      import('@app/modules/user'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/users',
    id: 'users',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: 'User detail',
    component: React.lazy(() => Promise.all([
      import('@app/modules/user/component/detail'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/users/:id',
    id: 'users-detail',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: 'Boost',
    component: React.lazy(() => Promise.all([
      import('@app/modules/boost'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/boost',
    id: 'boost',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: 'Pack',
    component: React.lazy(() => Promise.all([
      import('@app/modules/packs'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/packs',
    id: 'packs',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: 'Ads',
    component: React.lazy(() => Promise.all([
      import('@app/modules/ads'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/ads',
    id: 'ads',
    exact: true,
    private: true,
    can: 'view'
  },
];

const MakeRoute = () => (
  <DefaultMain>
    <React.Suspense fallback={(
      <div className="py-24 flex items-center justify-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{background: '#ddd'}}>
          <LoadingIcon className="text-3xl"/>
        </div>
      </div>
    )}>
      <Switch>
        {
          routes.map((route) => (
            !route?.private
              ? <Route
                exact={route.exact || false}
                path={route.path}
                key={route.id}
                render={(props) => {
                  return <route.component {...props}/>
                }}
              />
              : <PrivateRoute
                can={route.can}
                exact={route.exact || false}
                path={route.path}
                key={route.id}
                component={route.component}
              />
          ))
        }
        ))
        <Route render={() => (
          <div>Not Found</div>
        )}/>
      </Switch>
    </React.Suspense>
  </DefaultMain>
);

export default MakeRoute;
