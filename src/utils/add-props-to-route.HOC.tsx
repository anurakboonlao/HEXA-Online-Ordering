import React from 'react';

const AddPropsToRoute = (WrappedComponent: React.ComponentClass<any,any> | React.FC, passedProps: any) =>
    class Route extends React.Component<any,any>{

        render() {
            console.log(passedProps);
            return (
                <WrappedComponent
                    {...Object.assign({}, this.props, passedProps)}
                />
            );
        }
    };

export default AddPropsToRoute;
