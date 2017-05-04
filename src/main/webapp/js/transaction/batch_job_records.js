/**
 * User: Roland
 */
// $(document).ready(
//     function() {
//         // ?????????????? no need ??????????????????
//         return;
//         $('#dg4job_records').datagrid({
//             title: '任务列表',
//             //iconCls:'icon-edit',//图标
//             //width: 700,
//             //height: 'auto',
//             //nowrap: false,
//             //striped: true,
//             //border: true,
//             collapsible: false,//是否可折叠的
//             fit: true,//自动大小
//             url: 'listApp.action',
//             //sortName: 'code',
//             //sortOrder: 'desc',
//             remoteSort: false,
//             idField: 'ID',
//             singleSelect: true,//是否单选
//             pagination: true,//分页控件
//             rownumbers: true,//行号
//             //frozenColumns:[[
//             //    {field:'ck',checkbox:true}
//             //]],
//
//         });
//
//         //设置分页控件
//         var p = $('#dg4batch_job').datagrid('getPager');
//         $(p).pagination({
//             pageSize: 10,//每页显示的记录条数，默认为10
//             //pageList: [5,10,15],//可以设置每页记录条数的列表
//             beforePageText: '第',//页数文本框前显示的汉字
//             afterPageText: '页    共 {pages} 页',
//             displayMsg: '第 {from} - {to} 条, 共 {total} 条记录   ',
//             layout: ['first','prev','links','next','last','sep','refresh'],
//             /*onBeforeRefresh:function(){
//              $(this).pagination('loading');
//              alert('before refresh');
//              $(this).pagination('loaded');
//              }*/
//         });
//     }
// );