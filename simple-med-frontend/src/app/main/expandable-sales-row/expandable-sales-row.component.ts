import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MainApiService } from '../main-api.service';

@Component({
  selector: 'app-expandable-sales-row',
  templateUrl: './expandable-sales-row.component.html',
  styleUrls: ['./expandable-sales-row.component.css']
})
export class ExpandableSalesRowComponent {
  mainApi = inject(MainApiService);
  displayedColumns = ['cod', 'name', 'sold_per_unit', 'unitPrice', 'quantity', 'totalPrice', 'deleteAction'];

  @Input() saleItems: any;
  @Output() onDeletedLastItem: EventEmitter<any> = new EventEmitter();

  deleteSaleItem(element: any){
    this.mainApi.deleteSaleItem(element.id).subscribe(
      (response: any) => {
        if (response.delete_sale)
          this.onDeletedLastItem.emit();
        else
          this.saleItems = this.saleItems.filter(obj => obj.id !== element.id);
      }
    )
  }

}
