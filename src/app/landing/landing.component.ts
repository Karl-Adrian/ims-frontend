import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryItem } from '../models/inventory-item';
import { HttpClient } from '@angular/common/http';
import { UrlEndpoints } from 'src/environments';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  displayedColumns: string[] = ['index','name', 'quantity', 'price','actions'];
  itemForm: FormGroup;
  items: InventoryItem[] =[
    {id:0, name: "string", price: 2,quantity:3 },
    {id:1, name: "string2", price: 3,quantity:4 },
    {id:2, name: "string3", price: 3,quantity:4 },
    {id:3, name: "string4", price: 3,quantity:4 },
    {id:4, name: "string5", price: 3,quantity:4 }
  ];
  httpOptions = {
  };
  edit: boolean=false;
  itemBeingEdited!: InventoryItem;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.itemForm = this.fb.group({
      itemName: ['', [Validators.required]],
      itemQuantity: [null, [Validators.required, Validators.min(1), Validators.max(999999)]],
      itemPrice: [null, [Validators.required, Validators.min(1.00), Validators.max(99999999)]]
    })
    this.getItems();
  }
  // Passing data from table
  sendData(id:number){
    this.router.navigate(['/remove-item', {index: id,}]);
    // this.router.navigateByUrl('/remove-item', { state: { id:id} });
  }

  //Get Items 
  getItems(){
    this.http.get<InventoryItem[]>(UrlEndpoints.endpointUrl.base,this.httpOptions).subscribe(value=>{this.items=value 
    });
  }

  //Edit Items
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

}
