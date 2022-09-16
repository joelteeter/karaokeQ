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
        
            //this.parseCSV(';');
            this.processFile();

        
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

  readFileAsync(file:any) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    })
  }

  async processFile() {
    try {
      let file = this.file;
      let contentText = await this.readFileAsync(file);
      this.parseCSV(';', contentText);
    } catch(err) {
      console.log(err);
    }
  }

  parseCSV(delimiter: string, str: any): any {
    let songs: any = [];

    const headers = str.slice(0, str.indexOf('\n')).split(delimiter);
    const data = str.slice(str.indexOf('\n') + 1).split('\n');

    const arr = data.map((row: any) => {
      const values = row.split(delimiter);
      const el = headers.reduce((obj:any, header:any, index:any) => {
        obj[header] = values[index];

        return obj;
      }, {}
      );
      return el;
    });
    //TODO: let 'er rip, for now just 100 songs.
    const songCount = arr.length < 100 ? arr.length : 100;
    for(let i = 0; i < songCount; i ++) {
      let newSong = [arr[i]['Title'].toString().replaceAll('\"',''), arr[i]['Artist'].replaceAll('\"','')];
      songs.push(newSong);
    }
    this.songService.addSongs(songs).subscribe( (res:any) => console.log(res));

    
  }

}
