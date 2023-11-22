import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UrlEndpoints } from 'src/environments';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { InventoryItem } from '../models/inventory-item';
import { Router } from '@angular/router';


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent {
  
  // dataSource: MatTableDataSource<Item> = new MatTableDataSource<Item>();
  displayedColumns: string[] = ['index','name', 'quantity', 'price','actions'];
  itemForm: FormGroup;
  items: InventoryItem[] = [];
   httpOptions = {
  };
  edit: boolean=false;
  itemBeingEdited!: InventoryItem;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    console.log("Constructor");
    
    this.itemForm = this.fb.group({
      itemName: ['', [Validators.required]],
      itemQuantity: [null, [Validators.required, Validators.min(1), Validators.max(999999)]],
      itemPrice: [null, [Validators.required, Validators.min(1.00), Validators.max(99999999)]]
    })
    this.getItems()
   }

// Add Item
 addItem() {  
  console.log("addItem");

      if (this.edit) {
        const newItem:InventoryItem = {
          name: this.itemForm.get("itemName")!.value,
          quantity: this.itemForm.get("itemQuantity")!.value,
          id: this.itemBeingEdited.id,
          price: this.itemForm.get("itemPrice")!.value
        };
        
        this.http.put<InventoryItem>(UrlEndpoints.endpointUrl.base,newItem, this.httpOptions).subscribe(value=>{
          // this.getItems();
          this.itemForm.reset();
          this.router.navigate(['/landing'])
          this.edit=false;
        });
      }
      
      else{
        const newItem:InventoryItem = {
          name: this.itemForm.get("itemName")!.value,
          quantity: this.itemForm.get("itemQuantity")!.value,
          id: 0,
          price: this.itemForm.get("itemPrice")!.value
        };
        
        this.http.post<InventoryItem>(UrlEndpoints.endpointUrl.base,newItem, this.httpOptions).subscribe(value=>{
          this.getItems();
          this.itemForm.reset();
          this.edit=false;
        });                
      }
  }

  // Get Items
getItems() {
  console.log("getItems");
  this.http.get<InventoryItem[]>(UrlEndpoints.endpointUrl.base,this.httpOptions).subscribe(value=>{this.items=value 
});
  

}

// Edit Items
editItems(item: InventoryItem) {
  console.log("editItems");
  
  this.itemBeingEdited=item
  this.edit=true;
  this.itemForm.patchValue({
    itemName:item.name,
  itemQuantity:item.quantity,
  itemPrice:item.price
  });
}
// Delete Items
deleteItems(itemId:number) {
  this.http.delete<InventoryItem>(UrlEndpoints.endpointUrl.base+`/${itemId}`,this.httpOptions).subscribe(value=>{this.getItems()
});

}

getErrorMessage(){
  
}
dataSource(){

}

}

