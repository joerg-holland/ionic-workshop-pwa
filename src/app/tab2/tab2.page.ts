import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { UserPhoto, PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService, public actionSheetController: ActionSheetController, public alertController: AlertController) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }, {
        text: 'Face recognition',
        role: 'destructive',
        icon: 'happy',
        handler: () => {
          this.photoService.detectFace(photo).subscribe(
            (result: any) => {
            console.log(result);
      
            if (result.length > 0) {
              this.showAge(result[0].faceAttributes.age);
            } else {
              this.showAge('No face detected.');
            }
            },
            (error: any) => {
            console.error(error);
            }
          );
        }
      }]
    });
    await actionSheet.present();
  }

  async showAge(age: string): Promise<any> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Your age: ' + age,
      buttons: ['OK']
    });	
    await alert.present();
  }
}
