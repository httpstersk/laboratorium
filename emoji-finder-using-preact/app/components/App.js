import { h } from 'preact';
import Router from 'preact-router';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Home from 'containers/Home';
import About from 'containers/About';
import mdl from 'material-design-lite/material';
import { Layout } from 'preact-mdl';

export default () => (
    <div>
        <Layout fixed-header fixed-drawer>
            <Header />
            <Sidebar />
            <Layout.Content>
                <Router>
                    <Home path="/" />
                    <About path="/about" />
                </Router>
            </Layout.Content>
        </Layout>
    </div>
)
