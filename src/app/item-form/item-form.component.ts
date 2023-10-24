import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent {
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

  constructor(private http: HttpClient) {
    this.getItems()
   }

 addItem() {
   const  url = `http://localhost:8080/api/inventory`;   
    if (this.itemName && this.itemQuantity) {
      if (this.edit) {
        const newItem:InventoryItem = {
          name: this.itemName,
          quantity: this.itemQuantity,
          id: this.itemBeingEdited.id,
          price: this.itemPrice
        };
        this.http.put<InventoryItem>(url,newItem, this.httpOptions).subscribe(value=>{
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
        this.http.post<InventoryItem>(url,newItem, this.httpOptions).subscribe(value=>{
          this.getItems();
          this.edit=false;
        });                
      }
  }
  }

getItems() {
  const url = 'http://localhost:8080/items';
  this.http.get<InventoryItem[]>(url,this.httpOptions).subscribe(value=>{this.items=value 
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
  const url = `http://localhost:8080/items/${itemId}`;
  this.http.delete<InventoryItem>(url,this.httpOptions).subscribe(value=>{this.getItems()
});
  
}

}

interface InventoryItem {id:number, name: string, price: number,quantity:number };