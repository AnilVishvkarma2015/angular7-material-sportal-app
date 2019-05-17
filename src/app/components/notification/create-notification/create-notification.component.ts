import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.css']
})
export class CreateNotificationComponent {

  form: FormGroup;
  id: string;
  categories: string[] = ['Holiday', 'Examination', 'Circular', 'Faculty Change'];
  notice: string;
  category: string;

  constructor(private formBuilder: FormBuilder, private noticeService: NotificationService) {
    this.form = this.formBuilder.group({
      id: [''],
      category: ['', Validators.required],
      notice: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched)
    );
  }

  onSubmit() {
    this.noticeService.create(this.form.value);
  }
}
