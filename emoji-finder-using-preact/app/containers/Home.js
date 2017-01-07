import { h, Component } from 'preact';
import List from 'components/List';
import { fetchEmojis } from 'apis/emoji';
import mdl from 'material-design-lite/material';
import { Navigation, Card } from 'preact-mdl';

const styles = {
    input: {
        fontSize: '1.2rem',
        height: 60,
        padding: 20,
        width: '100vw',
    }
};

export default class Home extends Component {
    constructor(props) {
        super();

        this.state = {
            items: [],
            value: ''
        };

        this.onInput = this.onInput.bind(this)
        this.renderItem = this.renderItem.bind(this);
    }

    renderItem(item) {
        return (
            <h2>{item.text}</h2>
        );
    }

    onInput(event) {
        const value = event.target.value;
        this.setState({ value });

        if (value.length > 2) {
            fetchEmojis(value)
                .then(items => this.setState({ items }))
                .catch(error => console.warn('Error while fetching emoji API 💩', error));
        }
    }

    render({}, { items, value }) {
        return (
            <div>
                <input style={styles.input} placeholder="🔎" value={value} onInput={this.onInput} type="text" />
                <List items={items} renderItem={this.renderItem} />
            </div>
        );
    }
};