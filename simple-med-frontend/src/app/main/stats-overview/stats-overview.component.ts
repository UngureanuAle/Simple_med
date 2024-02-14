import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainApiService } from '../main-api.service';
import { single } from '../chart-classes/income-line-chart';
import { format } from 'd3';

@Component({
  selector: 'app-stats-overview',
  templateUrl: './stats-overview.component.html',
  styleUrls: ['./stats-overview.component.css'],
})
export class StatsOverviewComponent implements OnInit, AfterViewInit  {
  fb = inject(FormBuilder);
  mainApi = inject(MainApiService);

  filtersForm: FormGroup;
  generalStats: any = {
    sales: '-',
    income: '-',
    profit: '-',
    profitMargin: '-',
    processedReceipts: '-',
    receiptCompensations: '-',
    newClients: '-',
    investments: '-',
  };


  incomeChartData: any;
  salesChartData: any;
  clientChartData: any;
  receiptChartData: any;
  public view = [700, 400];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel: "Years";
  public showYAxisLabel = true;
  public yAxisLabel: "Salary";
  public graphDataChart: any[];
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
   constructor() {
    //Object.assign(this, { single });
  }


  ngOnInit() {
    this.filtersForm = this.fb.group({
      start_date: '',
      end_date: '',
    });

  }

  ngAfterViewInit() {
    
  }

  createReports() {
    this.mainApi
      .getReports(
        this.filtersForm.value.start_date
          ? this.filtersForm.value.start_date
          : null,
        this.filtersForm.value.end_date ? this.filtersForm.value.end_date : null
      )
      .subscribe((data: any) => {
        this.generalStats.sales = data['sales'];
        this.generalStats.income = data['income'];
        this.generalStats.profit = data['profit'];
        this.generalStats.profitMargin = data['profit_margin'];
        this.generalStats.newClients = data['new_clients'];
        this.generalStats.investments = data['investments'];
        this.generalStats.processedReceipts = data['prescriptions']
        this.incomeChartData = data['income-chart'];
        this.salesChartData = data['sales-chart'];
        this.clientChartData = data['client-chart'];
        this.receiptChartData = data['receipt-chart']

        this.formatChartData(this.incomeChartData);
        this.formatChartData(this.salesChartData);
        this.formatChartData(this.clientChartData);
        this.formatChartData(this.receiptChartData);
        //console.log(this.incomeChartData);
      });
  }

  private formatChartData(chartData: any){
    const newData = [];
    chartData.forEach( dimension => {
      dimension['series'].forEach( item => {
        item['name'] = new Date(item['name']);
      });
    });

  }

}
