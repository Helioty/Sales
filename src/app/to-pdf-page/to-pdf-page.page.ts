import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { HTMLToPDFAPIService } from '../../commons/services/html-to-pdf-api.service';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-to-pdf-page',
  templateUrl: './to-pdf-page.page.html',
  styleUrls: ['./to-pdf-page.page.scss'],
})
export class ToPDFPagePage implements OnInit {

  constructor(public toPDF: HTMLToPDFAPIService) { }

  ngOnInit() {
    let result = this.toPDF.api()
    console.log(result)
  }

  // @ViewChild('screen', {static: false}) screen: ElementRef;
  // @ViewChild('canvas', {static: false}) canvas: ElementRef;
  // @ViewChild('downloadLink', {static: false}) downloadLink: ElementRef;

  // downloadImage(){
  //   html2canvas(this.screen.nativeElement).then(canvas => {
  //     this.canvas.nativeElement.src = canvas.toDataURL();
  //     this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
  //     this.downloadLink.nativeElement.download = 'marble-diagram.png';
  //     this.downloadLink.nativeElement.click();
  //   });
  // }
  

}
