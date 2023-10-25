import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UrlEndpoints } from 'src/environments';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent {
  itemForm: FormGroup;
  itemName: string = '';
  itemQuantity: number = 0;
  itemPrice: number = 0;
  items: InventoryItem[] = [];
   httpOptions = {
    headers: new HttpHeaders({
      'ngrok-skip-browser-warning':"true"
    })
  };
  edit: boolean=false;
  itemBeingEdited!: InventoryItem;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      itemName: ['', [Validators.required]],
      itemQuantity: [null, [Validators.required, Validators.min(1), Validators.max(999999)]],
      itemPrice: [null, [Validators.required, Validators.min(0.10), Validators.max(99999999)]]
    })
    this.getItems()
   }


 addItem() {  
    if (this.itemName && this.itemQuantity) {
      const url=UrlEndpoints.endpointUrl.base+UrlEndpoints.endpointUrl.items
      console.log(url);
      

      if (this.edit) {
        const newItem:InventoryItem = {
          name: this.itemName,
          quantity: this.itemQuantity,
          id: this.itemBeingEdited.id,
          price: this.itemPrice
        };
        this.http.put<InventoryItem>(UrlEndpoints.endpointUrl.base,newItem, this.httpOptions).subscribe(value=>{
          this.getItems();
          this.edit=false;
        });   
      }else{
        const newItem:InventoryItem = {
          name: this.itemName,
          quantity: this.itemQuantity,
          id: 0,
          price: this.itemPrice
        };
        this.http.post<InventoryItem>(UrlEndpoints.endpointUrl.base,newItem, this.httpOptions).subscribe(value=>{
          this.getItems();
          this.edit=false;
        });                
      }
  }
  }

getItems() {
  this.http.get<InventoryItem[]>(UrlEndpoints.endpointUrl.base,this.httpOptions).subscribe(value=>{this.items=value 
});
  
}

editItems(item: InventoryItem) {
  this.itemBeingEdited=item
  this.edit=true;
  this.itemName=item.name
  this.itemQuantity=item.quantity
  this.itemPrice=item.price
  
}


deleteItems(itemId:number) {
  // const url = `http://localhost:8080/api/inventory${itemId}`;
  this.http.delete<InventoryItem>(UrlEndpoints.endpointUrl.base+`${itemId}`,this.httpOptions).subscribe(value=>{this.getItems()
});
  
}

}

interface InventoryItem {id:number, name: string, price: number,quantity:number };