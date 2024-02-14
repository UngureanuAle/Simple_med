from django.urls import path
from .views import get_products, get_reports, get_configs, update_configs, get_sales, delete_sale_item, delete_sale, create_sale, get_product, delete_client, update_client, create_client, get_clients, get_client, get_product_by_cod, get_product_stock, create_product, delete_product, update_product, get_batches, create_batch, update_batch, delete_batch

urlpatterns = [
    path('product', get_products, name='get-products'),
    path('product/<int:product_id>', get_product, name='get-product'),
    path('product/cod/<str:cod>', get_product_by_cod, name='get-product-by-cod'),
    path('product/stock/<int:product_id>', get_product_stock, name='get-product-stock'),
    path('product/create', create_product, name='create-product'),
    path('product/delete/<int:product_id>', delete_product, name='delete-product'),
    path('product/update/<int:product_id>', update_product, name='update-product'),
    path('batch', get_batches, name='get-batches'),
    path('batch/create/<int:product_id>', create_batch, name='create-batch'),
    path('batch/update/<int:batch_id>', update_batch, name='update-batch'),
    path('batch/delete/<int:batch_id>', delete_batch, name='delete-batch'),
    path('clients', get_clients, name='get-clients'),
    path('client/<str:cnp>', get_client, name='get-client'),
    path('clients/create', create_client, name='create-client'),
    path('clients/update/<int:client_id>', update_client, name='update-client'),
    path('clients/delete/<int:client_id>', delete_client, name='delete-client'),
    path('sales/create', create_sale, name='create-sale'),
    path('sales', get_sales, name='get-sales'),
    path('sales/delete/<int:sale_id>', delete_sale, name='delete-sale'),
    path('sales/items/delete/<int:sale_item_id>', delete_sale_item, name='delete-sale-item'),
    path('reports', get_reports, name='get-reports'),
    path('configs/update', update_configs, name='update-configs'),
    path('configs', get_configs, name='get-configs'),
]