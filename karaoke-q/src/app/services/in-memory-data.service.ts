import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Singer } from '../models/singer';
import { Song } from '../models/song';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const slips = [
      { id: 1, singer: {  id: 1, name: "Joel", color: '#0000FF' }, song: { id: 1, title: "Never gonna give you up", artist: "Rick Astley", runTime: 4.5}, position: 1 },
      { id: 6, singer: {  id: 1, name: "Joel", color: '#0000FF' }, song: { id: 1, title: "Piano Man", artist: "Billy Joel", runTime: 4.5}, position: 1 },
      { id: 7, singer: {  id: 1, name: "Joel", color: '#0000FF' }, song: { id: 1, title: "Take Me Home, Country Roads", artist: "John Denver", runTime: 4.5}, position: 1 },
      { id: 2, singer: {  id: 2, name: "Melissa", color: '#FF0000' }, song: { id: 1, title: "Never gonna give you up", artist: "Rick Astley", runTime: 4.5}, position: 2 },
      { id: 3, singer: {  id: 3, name: "Jim", color: '#008000' }, song: { id: 1, title: "Never gonna give you up", artist: "Rick Astley", runTime: 4.5}, position: 3 },
      { id: 4, singer: {  id: 1, name: "Joel", color: '#0000FF' }, song: { id: 1, title: "Sweet Caroline", artist: "Neil Diamond", runTime: 4.5}, position: 4 },
      { id: 5, singer: {  id: 2, name: "Melissa", color: '#FF0000' }, song: { id: 1, title: "Never gonna give you up", artist: "Rick Astley", runTime: 4.5 }, position: 5 },

    ]
    const singers = [
      {  id: 1, name: "Joel", color: '#0000FF' },
      {  id: 2, name: "Melissa", color: '#FF0000' },
      {  id: 3, name: "Jim", color: '#008000' },
    ];
    const songs = [
      { id: 1, title: "Never gonna give you up", artist: "Rick Astley", runTime: 4.5 },
      { id: 2, title: "Piano Man", artist: "Billy Joel", runTime: 3.5 },
    ];
    return {singers, songs, slips};
  }

  // make sure singers have an id
  genId(singers: Singer[]): number {
    return singers.length > 0 ? Math.max(...singers.map(singer => singer.id)) + 1 : 11;
  }
}