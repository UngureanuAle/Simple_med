import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prescription-summary',
  templateUrl: './prescription-summary.component.html',
  styleUrls: ['./prescription-summary.component.css']
})
export class PrescriptionSummaryComponent {
  displayedColumns = [
      'nr',
      'drug_info',
      'copayment_list_percent',
      'name',
      'sold_per_unit',
      'price',
      'quantity',
      'totalPrice',
    ];

  @Input() prescriptionItemsData;

  formatDrugCode(medicineCode) {
    switch (medicineCode) {
      case 'N05CF02':
        return 'ZOLPIDEMUM';
      case 'N06AB03':
        return 'FLUOXETINUM';
      case 'N06AB06':
        return 'SERTRALINUM';
      case 'N06AB08':
        return 'FLUVOXAMINUM';
      case 'N06AX21':
        return 'DULOXETINUM';
      default:
        return 'Medicine code not found';
    }
  }

  formatDrugInfo(element: any){
    return `${this.formatDrugCode(element.drug_code)}/${element.pharmaceutical_form}/${element.concentration}/${element.quantity}`;
  }

  getItemsTotalPrice() {
    let total = 0;
    this.prescriptionItemsData.forEach((item) => {
        total += item.price * item.released_quantity;
    });
    return total;
  }

  getItemsPriceDecontat(){
    let total = 0;
    this.prescriptionItemsData.forEach((item) => {
        total += (item.price * item.released_quantity) - (item.price * item.released_quantity) * (item.copayment_list_percent / 100);
    });
    return total;
  }
}
