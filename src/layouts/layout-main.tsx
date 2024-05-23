import React from 'react';
import { Container } from 'react-bootstrap';


import TopHeader from '../components/top-header.component';


const layoutMainHOC = (Content: any) =>
    class layoutMainHOC extends React.Component<{}, {}> {

        render() {
            return (
                <div className='app'>
                    <TopHeader />
                    <Container className="main-container">
                        <Content {...this.props}></Content>
                    </Container>
                    <div className="appFooter">
                        <p>Footer</p>
                    </div>
                </div>
            );
        }
    };

export default layoutMainHOC;