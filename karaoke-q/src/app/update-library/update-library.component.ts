import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-update-library',
  templateUrl: './update-library.component.html',
  styleUrls: ['./update-library.component.scss']
})
export class UpdateLibraryComponent implements OnInit {

  closeResult = '';
  faFile = faFile;

  fileName: string = '';
  file: any = null;

  constructor(private songService: SongService, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(content:any) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result === 'Save click') {
        
            this.parseCSV(';');

        
      }
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if(file) {
      this.fileName = file.name;
      this.file = file;

    }
  }

  parseCSV(delimiter: string): any {
    //TODO: this REALLY should be done on the back end with one bulk update. going to limit it to 100 songs for now
    const reader = new FileReader();
    let songs: any = [];
    reader.onload = (event) => {
      if(event.target) {
        const str = event.target.result ? event.target.result.toString() : '';


        const headers = str.slice(0, str.indexOf('\n')).split(delimiter);
        const data = str.slice(str.indexOf('\n') + 1).split('\n');

        const arr = data.map((row: any) => {
          const values = row.split(delimiter);
          const el = headers.reduce((obj:any, header:any, index) => {
            obj[header] = values[index];

            return obj;
          }, {}
          );
          return el;
        });
        const songCount = arr.length < 100 ? arr.length : 100;
        for(let i = 0; i < songCount; i ++) {
          let newSong = { title: arr[i]['Title'].toString().replaceAll('\"',''), artist: arr[i]['Artist'].replaceAll('\"',''), runTime: 3.5 }
          this.songService.addSong(newSong).subscribe();
        }
        // this would do ALL songs, there way too many to do this way
        // arr.forEach( (song:any) => {
        //   let newSong = { title: song['Title'], artist: song['Artist'], runTime: 3.5 }
        //   this.songService.addSong(newSong).subscribe();
        // })
        return arr;
        } else {
          return '';
        }
    }
    reader.readAsText(this.file);
    
  }

}
