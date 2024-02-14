import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ProductDisplay } from './interfaces/Product';

@Injectable({
  providedIn: 'root',
})
export class MainApiService {
  http = inject(HttpClient);
  auth = inject(AuthService);
  ROOT_URL = 'http://localhost:8000';

  getProducts(
    cod: string | null,
    name: string | null,
    medType: number | null,
    admType: number | null,
    manufacturer: string | null,
    is_prescribed: boolean | null
  ) {
    let URL = `${this.ROOT_URL}/product?`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });
    const params = new HttpParams();
    if (cod) URL = `${URL}cod=${cod}&`;
    if (name) URL = `${URL}name=${name}&`;
    if (medType) URL = `${URL}med_type=${medType}&`;
    if (admType) URL = `${URL}adm_type=${admType}&`;
    if (manufacturer) URL = `${URL}manufacturer=${manufacturer}&`;
    if (is_prescribed) URL = `${URL}is_prescribed=${is_prescribed}&`;

    return this.http.get(URL, { headers: headers, params: params });
  }

  getProduct(id: string) {
    let URL = `${this.ROOT_URL}/product/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.get(URL, { headers: headers });
  }

  getProductByCode(cod: string) {
    let URL = `${this.ROOT_URL}/product/cod/${cod}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.get(URL, { headers: headers });
  }

  getProductStock(id: string) {
    let URL = `${this.ROOT_URL}/product/stock/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.get(URL, { headers: headers });
  }

  createProduct(product: ProductDisplay) {
    let URL = `${this.ROOT_URL}/product/create`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    const formData = new FormData();
    formData.append('id', product.id);
    formData.append('cod', product.cod);
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('manufacturer', product.manufacturer);
    formData.append('med_type', product.med_type.toString());
    formData.append('adm_type', product.adm_type.toString());
    formData.append('price', product.price.toString());
    formData.append('sold_per_unit', product.sold_per_unit.toString());

    if( product.price_per_unit )
      formData.append('price_per_unit', product.price_per_unit.toString());

    if( product.units_per_box )
      formData.append('units_per_box', product.units_per_box.toString());

    if( product.is_prescribed )
      formData.append('is_prescribed', product.is_prescribed.toString());

    if (product.prospect) {
      const prospectFile = product.prospect.files[0];
      formData.append('prospect', prospectFile, prospectFile.name);
    }

    //console.log(formData.);
    return this.http.post(URL, formData, { headers: headers });
  }

  deleteProduct(id: string) {
    let URL = `${this.ROOT_URL}/product/delete/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.delete(URL, { headers: headers });
  }

  updateProduct(product: ProductDisplay) {
    let URL = `${this.ROOT_URL}/product/update/${product.id}`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    const formData = new FormData();
    formData.append('id', product.id);
    formData.append('cod', product.cod);
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('description', product.description);
    formData.append('manufacturer', product.manufacturer);
    //formData.append('is_prescribed', product.is_prescribed.toString());
    formData.append('med_type', product.med_type.toString());
    formData.append('adm_type', product.adm_type.toString());
    formData.append('sold_per_unit', product.sold_per_unit.toString());

    if( product.price_per_unit )
      formData.append('price_per_unit', product.price_per_unit.toString());

    if( product.units_per_box )
      formData.append('units_per_box', product.units_per_box.toString());

    if( product.is_prescribed )
      formData.append('is_prescribed', product.is_prescribed.toString());

    if (typeof product.prospect === 'object' && product.prospect !== null) {
      const prospectFile = product.prospect.files[0];
      formData.append('prospect', prospectFile, prospectFile.name);
    }

    //console.log(formData.);
    return this.http.put(URL, formData, { headers: headers });
  }

  getBatches(cod: string | null, name: string | null) {
    let URL = `${this.ROOT_URL}/batch?`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    const params = new HttpParams();
    if (cod) URL = `${URL}cod=${cod}&`;
    if (name) URL = `${URL}name=${name}&`;

    return this.http.get(URL, { headers: headers, params: params });
  }

  createBatch(batch: any) {
    let URL = `${this.ROOT_URL}/batch/create/${batch.product_id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    //batch.created_on = batch.created_on.toLocaleString();
    return this.http.post(URL, batch, { headers: headers });
  }

  updateBatch(newData: any) {
    let URL = `${this.ROOT_URL}/batch/update/${newData.id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.put(URL, newData, { headers: headers });
  }

  deleteBatch(batchId: number) {
    let URL = `${this.ROOT_URL}/batch/delete/${batchId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.delete(URL, { headers: headers });
  }

  getClients(
    cnp: string | null,
    last_name: string | null,
    first_name: string | null
  ) {
    let URL = `${this.ROOT_URL}/clients?`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    const params = new HttpParams();
    if (cnp) URL = `${URL}cnp=${cnp}&`;
    if (last_name) URL = `${URL}last_name=${last_name}&`;
    if (first_name) URL = `${URL}first_name=${first_name}&`;

    return this.http.get(URL, { headers: headers, params: params });
  }

  getClient(cnp: string) {
    let URL = `${this.ROOT_URL}/client/${cnp}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.get(URL, { headers: headers });
  }

  createClient(client: any) {
    let URL = `${this.ROOT_URL}/clients/create`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.post(URL, client, { headers: headers });
  }

  updateClient(newData: any){
    let URL = `${this.ROOT_URL}/clients/update/${newData.id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.put(URL, newData, { headers: headers });
  }

  deleteClient(clientId: number) {
    let URL = `${this.ROOT_URL}/clients/delete/${clientId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.delete(URL, { headers: headers });
  }

  createSale(clientId: number | null, itemsList: any){
    let URL = `${this.ROOT_URL}/sales/create`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });
    const data = {
      'client_id': clientId,
      'items': itemsList
    };

    return this.http.post(URL, data, { headers: headers });
  }

  private convertDateForQuery(date: Date): string{
    let currentDate = date;

    let day: any = currentDate.getDate();
    let month: any = currentDate.getMonth() + 1; 
    let year = currentDate.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}/${month}/${year}`;
  }

  getSales(
    cod: string | null,
    cnp: string | null,
    start_date: Date | null,
    end_date: Date | null
  ) {
    let URL = `${this.ROOT_URL}/sales?`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    if (cnp) URL = `${URL}cnp=${cnp}&`;
    if (cod) URL = `${URL}cod=${cod}&`;
    if (start_date) URL = `${URL}start_date=${this.convertDateForQuery(start_date)}&`;
    if (end_date) URL = `${URL}end_date=${this.convertDateForQuery(end_date)}&`;

    return this.http.get(URL, { headers: headers });
  }

  deleteSale(saleId: number){
    let URL = `${this.ROOT_URL}/sales/delete/${saleId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.delete(URL, { headers: headers });
  }

  deleteSaleItem(saleItemId: number){
    let URL = `${this.ROOT_URL}/sales/items/delete/${saleItemId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.delete(URL, { headers: headers });
  }

  getReports(
    start_date: Date | null,
    end_date: Date | null
  ) {
    let URL = `${this.ROOT_URL}/reports?`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    if (start_date) URL = `${URL}start_date=${this.convertDateForQuery(start_date)}&`;
    if (end_date) URL = `${URL}end_date=${this.convertDateForQuery(end_date)}&`;

    return this.http.get(URL, { headers: headers });
  }

  updateConfigs(data: any){
    let URL = `${this.ROOT_URL}/configs/update`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.put(URL, data, { headers: headers });
  }

  getConfigs(){
    let URL = `${this.ROOT_URL}/configs`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.get(URL, { headers: headers });
  }

  getPrescription(
    series: string,
    nr: string,
    stencil_nr: string,
    prescription_date: Date,
    prescriptor_signature: string | null
  ){
    let URL = `${this.ROOT_URL}/siui/prescription?`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    URL = `${URL}prescription_date=${this.convertDateForQuery(prescription_date)}&series=${series}&nr=${nr}&stencil_nr=${stencil_nr}`;
    if( prescriptor_signature )
      URL = `${URL}&prescriptor_signature=${encodeURIComponent(prescriptor_signature)}`;

    return this.http.get(URL, { headers: headers });
  }

  scanBarcode(barcodeFile: File){
    let URL = `${this.ROOT_URL}/siui/datamatrix`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    const formData = new FormData();
    formData.append('qrcode', barcodeFile, barcodeFile.name);
    return this.http.post(URL, formData, { headers: headers });
  }

  createPrescriptionSale(data: any){
    let URL = `${this.ROOT_URL}/siui/prescription/create`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.post(URL, data, { headers: headers });
  }

  getPrescriptionsList(
    series: string | null,
    nr: string | null,
    stencil_nr: string | null,
    cnp: string | null,
  ){
    let URL = `${this.ROOT_URL}/siui/prescription/multiple?`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    if (series) URL = `${URL}series=${series}&`;
    if (nr) URL = `${URL}nr=${nr}&`;
    if (cnp) URL = `${URL}cnp=${cnp}&`;
    if (stencil_nr) URL = `${URL}stencil_nr=${stencil_nr}&`;

    return this.http.get(URL, { headers: headers });
  }

  getPrescriptionsById(
    prescriptionId: string
  ){
    let URL = `${this.ROOT_URL}/siui/prescription/${prescriptionId}`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.get(URL, { headers: headers });
  }

  getPrescriptionIdBySN(
    series: string,
    nr: string
  ){
    let URL = `${this.ROOT_URL}/siui/prescription-sn/${series}/${nr}`;
    const headers = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Authorization: this.auth.getTokenString(), // Add any other headers as needed
    });

    return this.http.get(URL, { headers: headers });
  }
}
