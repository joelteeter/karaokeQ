import { Singer } from './singer';
import { Song } from './song';

export interface Slip {
	id?: number;
	sessionId: number;
	singer?: Singer;
	song?: Song;	
	isCollapsed: boolean;
	position: number;
}
