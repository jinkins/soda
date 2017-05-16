import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";

import { AuthService } from './shared/auth.service';
import { Subscription } from "rxjs/rx";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private fb: FormBuilder, private as: AuthService) { }

    connectionForm: FormGroup;
    state = null;
    error = null; 

    ngOnInit(){
        this.connectionForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.as.connectionState().subscribe(
            (state) => console.log(this.state = state)
        )
    }

    getError(){
        if(typeof(this.error) == "string"){
            return this.error
        }
        else{
            return null;
        }
    }

    isLogged(){
        if(this.state){
            return true;
        }
        else{
            return false;
        }
    }

    onLogin(){
        this.error = this.as.login(this.connectionForm.value["email"], this.connectionForm.value["password"]).catch(e => console.log(this.error = e.message));
    }

    logout(){
        this.as.logout();
    }
    
}