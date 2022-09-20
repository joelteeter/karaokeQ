export interface Song {
	id?: number;
	title: string;
	artist: string;
	runTime: number;
	embedurl: string;
	validation_requested: boolean;
}