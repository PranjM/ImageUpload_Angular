// app.component.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-image-file-upload-tutorial';

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  arrayImage : string[] = ['Img1.jpg','Img2.jpg','Img3.jpg'];

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    });
  }


  onFormSubmit(event) {
    console.log('inside call submit');

    const file = event.target.files[0];
    this.fileInputLabel = file.name;
    console.log(file)
    this.fileUploadForm.get('uploadedImage').setValue(file);
    console.log('photo upload complete');
    if (!this.fileUploadForm.get('uploadedImage').value) {
      alert('Please fill valid details!');
      return false;
    }

    const formData = new FormData();
    formData.append('uploadedImage', this.fileUploadForm.get('uploadedImage').value);
    formData.append('agentId', '007');


    this.http
      .post<any>('http://localhost:3000/uploadfile', formData).subscribe(response => {
        console.log(response);
        console.log('fileName:--'+response.uploadedFile.filename);
        if (response.statusCode === 200) {
          // Reset the file input
          this.arrayImage[2] = this.arrayImage[1];
          this.arrayImage[1] = this.arrayImage[0];
          this.arrayImage[0] = response.uploadedFile.filename;
          this.uploadFileInput.nativeElement.value = "";
          this.fileInputLabel = undefined;
        }
      }, er => {
        console.log(er);
        alert(er.error.error);
      });
  }


}



