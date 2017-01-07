import { h } from 'preact';
import mdl from 'material-design-lite/material';
import { Layout, Navigation } from 'preact-mdl';

export default () => (
    <Layout.Drawer>
        <Layout.Title>Emoji Finder</Layout.Title>
        <Navigation>
            <Navigation.Link href="/">Find</Navigation.Link>
            <Navigation.Link href="/about">About</Navigation.Link>
        </Navigation>
    </Layout.Drawer>
);
