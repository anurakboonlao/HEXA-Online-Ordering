import React from 'react';


const layoutPlainHOC = (Content: any) =>
    class layoutPlainHOC extends React.Component<{}, {}> {

        render() {
            return (
                <div className='app'>                  
                    <Content {...this.props}></Content>
                </div>
            );
        }
    };

export default layoutPlainHOC;