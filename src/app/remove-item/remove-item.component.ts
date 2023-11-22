import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UrlEndpoints } from 'src/environments';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import { InventoryItem } from '../models/inventory-item';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';


 


@Component({
  selector: 'app-remove-item',
  templateUrl: './remove-item.component.html',
  styleUrls: ['./remove-item.component.css']
})
export class RemoveItemComponent {
receivedData: any ;
displayedColumns: string[] = ['index', 'name', 'quantity', 'price', 'actions'];
itemForm: FormGroup;
items: InventoryItem [] = [];
httpOptions = {
};
edit: boolean = false;
itemBeingEdited!: InventoryItem;

constructor(private http: HttpClient, private fb: FormBuilder, private route: ActivatedRoute,private router: Router ) {
  const itemId = this.route.snapshot.params["index"];
  
  this.itemForm = this.fb.group({
    itemName: ['', [Validators.required]],
    itemQuantity: [null, [Validators.required, Validators.min(1)]],
    itemPrice: [null, [Validators.required, Validators.min(1.00)]]
  })
  this.getItem(itemId)
  
 }
  getItem(itemId: any) {
    const url=UrlEndpoints.endpointUrl.base+`/${itemId}`;
    this.http.get<InventoryItem>(url,this.httpOptions).subscribe(response=>{
      this.itemForm.patchValue({
        itemName:response.name,
        itemQuantity:response.quantity,
        itemPrice:response.price
      });      
      const quantityController = this.itemForm.get('itemQuantity');
      quantityController?.setValidators([
        Validators.max(response.quantity),
      ])
      quantityController?.updateValueAndValidity();
    })
  }

// Remove Item Function
 removeItem() {  
    const newItem:InventoryItem = {
      name: this.itemForm.get("itemName")!.value,
      quantity: this.itemForm.get("itemQuantity")!.value,
      id:  this.route.snapshot.params["index"],
      price: this.itemForm.get("itemPrice")!.value
    };
    
    this.http.put<InventoryItem>(UrlEndpoints.endpointUrl.base,newItem, this.httpOptions).subscribe(value=>{
      this.edit=false;
      this.itemForm.reset();
      this.router.navigate(['/landing'])
    });

    
    // const newItem:InventoryItem = {
    //   name: this.itemForm.get("itemName")!.value,
    //   quantity: this.itemForm.get("itemQuantity")!.value,
    //   id: 0,
    //   price: this.itemForm.get("itemPrice")!.value
    // };
    
    // this.http.post<InventoryItem>(UrlEndpoints.endpointUrl.base,newItem, this.httpOptions).subscribe(value=>{
    //   this.getItems();
    //   this.edit=false;
    // });                
}

// Get Items Function
getItems() {
  this.http.get<InventoryItem[]>(UrlEndpoints.endpointUrl.base,this.httpOptions).subscribe(value=>{this.items=value 
});
  

}
// Edit items Function
editItems(item: InventoryItem) {
  this.itemBeingEdited=item
  this.edit=true;
  this.itemForm.patchValue({
    itemName:item.name,
  itemQuantity:item.quantity,
  itemPrice:item.price
  });
}

// Delete Items Function
deleteItems(itemId:number) {
  this.http.delete<InventoryItem>(UrlEndpoints.endpointUrl.base+`/${itemId}`,this.httpOptions).subscribe(value=>{this.getItems()
});

}

maxRemovalValidator(currentValue:number):ValidatorFn {
  return(control: AbstractControl): ValidationErrors | null=> {
    const requestedRemoval = control.value;

    if (requestedRemoval > currentValue) {
      return {maxRemoval: true, message: 'Cannot remove more'};
    }
    return null;
  };
}




getErrorMessage(){
  
}
dataSource(){

}






}


