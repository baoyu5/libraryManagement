/**
 * User: Roland
 */
var productsApi = new sysCommon.api('products', {
        'loadUri': 'api/products',
        'createUri': 'api/product_add',
        'deleteUri': 'api/product_delete',
        'editUri': 'api/product_edit',
        'recordIdName': 'productId'
    }
);
$(document).ready(
    function () {

        var toolbarAll = [{
            text: '添加产品',
            //iconCls: 'icon-add',
            handler: function () {
                productsApi.create('添加产品');
            }
        }, {
            text: '修改产品',
            //iconCls: 'icon-add',
            handler: function () {
                if ($('#productsContainer .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    productsApi.edit('编辑产品');
                }
            }
        }, {
            text: '删除产品',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#productsContainer .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    productsApi.delete('确认删除该产品?');
                }
            }
        }];

        var urls = ['/api/product_add', '/api/product_edit', '/api/product_delete'];

        $('#dg4products').datagrid({
            title: '产品列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            //url: 'products_load',
            //method: 'post',
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            rownumbers: true,//行号
            url: 'api/products',
            loadFilter: sysCommon.loadFilter,
            toolbar: getToolbar(toolbarAll, urls),
            onLoadError: function() {
                accessDenied();
            },
            onLoadSuccess: function() {
                productsApi.onReloadSuccess();
                $('#dg4products').datagrid('selectRow');//选中第一条数据
                noRecord($(this), data, 'productName', 3);//无记录
            }
        });

        //设置分页控件
        //设置分页控件
        paginationConfig($('#dg4products').datagrid('getPager'));
    }
);

function saveProduct() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#newProductName'),6,20);
    var tip2 = checkProduct($('#newProductCode'));
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.产品名'+tip1;
        count++;
    }
    if (!$.isEmptyObject(tip2)) {
        tips[count] = (count+1)+'.产品编码'+tip2;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_new_products_tips'),text);
        return;
    }
    productsApi.save();
}

function updateProduct(){
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#productName'),6,20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.产品名'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4products_tips'),text);
        return;
    }
    productsApi.update();
}
