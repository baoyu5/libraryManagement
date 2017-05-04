/**
 * User: Roland
 */

var jobApi = new sysCommon.api('batch_job', {
        'loadUri': 'api/jobs',
        'createUri': 'api/job_add',
        'deleteUri': 'api/job_delete',
        'editUri': 'api/job_edit',
        'recordIdName': 'id'
    }
);

$(document).ready(
    function () {

        var toolbarAll = [{
            text: '新建任务',
            handler: function () {
                jobApi.create('新建任务')
            }
        }, {
            text: '修改任务',
            handler: function () {
                if ($('#bgContainer .datagrid-body .noRst').length) {  //排除记无录
                    noSelectAlert();
                }else{
                    jobApi.edit('修改任务')
                }
            }
        }, {
            text: '删除任务',
            handler: function () {
                if ($('#bgContainer .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    jobApi.delete('确认要删除该任务吗?');
                }
            }
        }, {
            text: '执行记录',
            handler: function () {
                jobRecords();
            }
        }];

        var urls = ['/api/job_add', '/api/job_edit', '/api/job_delete', '/api/job_executions']
        $('#dg4batch_job').datagrid({
            title: '任务列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/jobs',
            loadFilter: sysCommon.loadFilter,
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            toolbar: getToolbar(toolbarAll, urls),
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function(data) {
                jobApi.onReloadSuccess();
                noRecord($(this),data,'name',3);//无记录
                $('#dg4batch_job').datagrid('selectRow');//默认不选中数据
            }
        });

        //设置分页控件
        paginationConfig($('#dg4batch_job').datagrid('getPager'));
    }
);


var url;
function newJob() {
    $("#dlg4batch_job_tips").html('');
    $('#dlg4batch_job').dialog('open').dialog('center').dialog('setTitle', '新建任务');

    $('#fm4batch_job').form('clear');
    url = 'save_user.php';
}

function saveJob() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#newJobName'),6,20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.任务名'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_new_batch_job_tips'),text);
        return;
    }
    jobApi.save();
}

function updateJob() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#jobName'),6,20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.任务名'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4batch_job_tips'),text);
        return;
    }
    jobApi.update();
}

jobRecords.options = {
    title: '任务列表',
    collapsible: false,//是否可折叠的
    fit: true,//自动大小
    url: '',
    loadFilter: sysCommon.loadFilter,
    remoteSort: false,
    idField: 'ID',
    singleSelect: true,//是否单选
    pagination: true,//分页控件
    rownumbers: true,//行号
    onLoadError: function () {
        accessDenied();
    }
};
jobRecords.inited = false;
function jobRecords() {
    var opts = $.extend({}, jobRecords.options, {
        url: 'api/job_executions?id=0'
    });
    console.log('job_records:', opts);
    $('#dg4job_records').datagrid(opts);
    if (!jobRecords.inited) {
        $('#dg4job_records').datagrid('getPager').pagination(sysCommon.paginationConfig);
        $('#job_select').combobox({
            url: 'api/jobs?rows=0&page=1',
            valueField: 'id',
            textField: 'name',
            panelHeight: 110,
            loadFilter: function (data) {
                var ret;
                if (data.status === 0) {
                    ret = data.data.rows;
                } else {
                    ret = [];
                }
                ret.unshift({
                    'id': 0,
                    'name': '全部'
                });
                return ret;
            }
        });
        jobRecords.inited = true;
    }
    $('#dlg4batch_job_records').dialog('open').dialog('center').dialog('setTitle', '任务执行记录');
}


// 查询
function jobRecordsQuery() {
    var params = {};
    params.id = $('#job_select').combobox('getValue');
    params.startTime = $('#job_records_start').datebox('getValue');
    params.endTime = $('#job_records_end').datebox('getValue');

    $('#dg4job_records').datagrid({
        'url': 'api/job_executions?' + $.param(params)
    });
    paginationConfig($('#dg4batch_job').datagrid('getPager'));
}

// 重置查询条件
function jobRecordsReset() {
    $('#job_select').combobox('select', 0);
    $('#job_records_start').datebox('clear');
    $('#job_records_end').datebox('clear');

    $('#dg4transactions').datagrid({
        'url': 'api/job_executions?id=0'
    });
    paginationConfig($('#dg4batch_job').datagrid('getPager'));
}

function batchJobStatusFormatter(val) {
    return val ? '是' : '否';
}

function batchJobTypeFormatter(val) {
    if (val == 1) {
        return '有序型';
    }
    return '无序型';
}