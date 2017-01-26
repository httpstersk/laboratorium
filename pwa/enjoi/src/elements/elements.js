import { StageList } from './stage-list/stage-list';
import { StageArtists } from './stage-artists/stage-artists';
import { StageArtist } from './stage-artist/stage-artist';
import { ConfirmButton } from './confirm-button/confirm-button';
import { CountdownTimer } from './countdown-timer/countdown-timer';
import { GeoLocation } from './geo-location/geo-location';

customElements.define('stage-list', StageList);
customElements.define('stage-artists', StageArtists);
customElements.define('stage-artist', StageArtist);
customElements.define('confirm-button', ConfirmButton, { extends: 'button' });
customElements.define('countdown-timer', CountdownTimer);
customElements.define('geo-location', GeoLocation);