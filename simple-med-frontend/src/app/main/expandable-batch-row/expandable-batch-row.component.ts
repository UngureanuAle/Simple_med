import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-expandable-batch-row',
  templateUrl: './expandable-batch-row.component.html',
  styleUrls: ['./expandable-batch-row.component.css'],
})
export class ExpandableBatchRowComponent {
  @Input() batchesData: any;
  @Input() productId: number;

  displayedColumns = [
    'batchNr',
    'createdOn',
    'provider',
    'totalInitial',
    'paid_price_per_unit',
    'total_price',
    'insertAction'
  ];
  @Output() onSelectedBatch: EventEmitter<any> = new EventEmitter();
  @Output() onInsertBatch: EventEmitter<any> = new EventEmitter();

  sendCurrentBatch(batch: any){
    this.onSelectedBatch.emit(batch);
  }

  sendInsertBatchSignal(){
    this.onInsertBatch.emit(this.productId);
  }
}
