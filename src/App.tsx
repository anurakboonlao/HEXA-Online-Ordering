import { connect, ConnectedComponent } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


import { IRouteConfig, routes } from './routes';
import AddPropsToRoute from './utils/add-props-to-route.HOC';
import permissionValidateHOC from './utils/permission-validate.HOC';
import routeMountHOC from './utils/route-mounth.HOC';


function App() {
  return (
    <div className="App">
      <Switch>
      <Redirect exact path="/" to="/Home" />
        {
          routes.map((route: IRouteConfig, index: number) => {
            // Connect HOC to redux store.
            let HOCComponent: ConnectedComponent<any, any>
            HOCComponent = connect()(routeMountHOC(route.component));

            if (route.requirePermissionValidate) {
              HOCComponent = permissionValidateHOC(HOCComponent);
            }

            const componentWithProps = AddPropsToRoute(HOCComponent, route);
            return (
              <Route exact path={route.path} component={componentWithProps} key={index}>
              </Route>
            )
          })
        }
      </Switch>
      <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
    </div>
  );
}

export default App;
