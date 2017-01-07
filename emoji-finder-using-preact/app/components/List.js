import { h } from 'preact';

export default ({ items, renderItem }) => (
    <ul style={{ display: "flex" }}>
        {items.map(item => (
            <li style={{ listStyleType: "none" }}>{renderItem(item)}</li>
        ))}
    </ul>
);