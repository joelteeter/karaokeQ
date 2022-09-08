import { Singer } from './singer';
import { Song } from './song';

export interface Slip {
	id?: number;
	singer?: Singer;
	song?: Song;	
	isCollapsed: boolean;
	position: number;
}
