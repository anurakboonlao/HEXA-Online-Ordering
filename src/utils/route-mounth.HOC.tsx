
import React, { ComponentClass, FC } from 'react';
import { Helmet } from 'react-helmet';

import { isAuthenticated, triggerImmediateLogin } from './authUtils';



interface IRouteMountProps {
    postFetchData: ((dispatch: any, match: any, location: any) => void)[];
    dispatch: () => void;
    match: any;
    location: object;
    documentTitle: (match: object) => string;
    requireAuth?: boolean;
}

const routeMountHOC = (Component: ComponentClass | FC) => {
    return class routeMountHOC extends React.Component<any, any> {

        componentDidMount() {
            const {
                postFetchData,
                dispatch,
                match,
                location,
                requireAuth
            } = this.props as IRouteMountProps;
            const promises = Array<any>();

            if (postFetchData) {
                postFetchData.forEach((fn: any) => {
                    promises.push(fn(dispatch, match, location))
                });
            }

            Promise.all(promises).then(data => {
                // eslint-disable-next-line
                console.log('HOC fetching');
            }).catch(err => {
                // eslint-disable-next-line
                console.log(err);
            });

            const authnticated = isAuthenticated();
            if (requireAuth) {
                if (!authnticated)
                    triggerImmediateLogin();

            }

        }

        _getTitle = () =>
			this.props.documentTitle
				? this.props.documentTitle
				: null;

        render() {
            return (
                <div>
                    <Helmet
                        defaultTitle="Hexa Online Ordering"
                        titleTemplate="%s | Hexa Online Ordering"
                        title={this._getTitle()}
                    ></Helmet>
                    <Component {...this.props}></Component>
                </div>
            )
        }
    };

}


export default routeMountHOC;