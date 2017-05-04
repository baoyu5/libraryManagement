var MarketMemberApi = new sysCommon.api('marketMembers', {
    'loadUri': 'api/market_accounts',
    'recordIdName': 'userId'
});

$(document).ready(
    function () {
        var toolbarAll = [];

        var urls = [];

        var toolbar = getToolbar(toolbarAll, urls);
        if (toolbar == null) {
            toolbar = [];
        } else {
            toolbar.push('-')
        }

        toolbar.push({
            text: '会员详情',
            //iconCls: 'icon-add',
            handler: function () {
                marketMemberDetail();
            }
        });

        $('#dg4marketMembers').datagrid({
            title: '会员列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: MarketMemberApi.loadUri,
            loadFilter: function(data) {
                if (data.data && (data.status === 0)) {
                    data = authenticationStatusLoadFilter(data);
                    return data.data;
                } else {
                    return [];
                }
            },
            //sortName: 'code',
            //sortOrder: 'desc',
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            toolbar: toolbar,
            onDblClickRow: function (index, row) {
                marketMemberDetail(index, row);
            },
            onLoadSuccess: function () {
                MarketMemberApi.onReloadSuccess();
            }
        });

        //设置分页控件
        var p = $('#dg4marketMembers').datagrid('getPager');
        $(p).pagination({
            pageSize: 10,//每页显示的记录条数，默认为10
            //pageList: [5,10,15],//可以设置每页记录条数的列表
            beforePageText: '第',//页数文本框前显示的汉字
            afterPageText: '页    共 {pages} 页',
            displayMsg: '第 {from} - {to} 条, 共 {total} 条记录   ',
            layout: ['first', 'prev', 'links', 'next', 'last', 'sep', 'refresh'],
            /*onBeforeRefresh:function(){
             $(this).pagination('loading');
             alert('before refresh');
             $(this).pagination('loaded');
             }*/
        });
    }
);

function createTimeFormatter(val) {
    var formattedDate = new Date(val);
    var d = formattedDate.getDate();
    var m = formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}

/**
 * 会员认证状态显示
 */
function authenticationStatusLoadFilter(data) {
    for (var i = 0;i<data.data.rows.length;i++) {
        if (data.data.rows[i].authenticationStatus == 0) {
            data.data.rows[i].authenticationStatus = "未认证";
        }
        if (data.data.rows[i].authenticationStatus == 1) {
            data.data.rows[i].authenticationStatus = "审核中";
        }
        if (data.data.rows[i].authenticationStatus == 2) {
            data.data.rows[i].authenticationStatus = "已认证";
        }
        if (data.data.rows[i].authenticationStatus == 3) {
            data.data.rows[i].authenticationStatus = "已拒绝";
        }
        if (data.data.rows[i].accountStatus == 0) {
            data.data.rows[i].accountStatus = "正常";
        }
        if (data.data.rows[i].accountStatus == 1) {
            data.data.rows[i].accountStatus = "已冻结";
        }
    }
    return data;
}

function marketMemberDetail(index, row) {
    // dlg4_member_detail
    var row = $('#dg4marketMembers').datagrid('getSelected');
    if (row) {
        var yyzz=document.getElementById("yyzz1");
        if (row.allInOne) {
            $('#dlg4_market_member_detail .all-in-one').hide();
            $('#tianchong1').show();
            yyzz.innerText="三证合一：";
        } else {
            $('#dlg4_market_member_detail .all-in-one').show();
            $('#tianchong1').hide();
            yyzz.innerText="营业执照：";
        }
        // change bankId into bankName
        var bankName = '-';
        $.each(sysCommon.data.banks.get(), function(idx, bank){
            if(bank.id === row.bankId) {
                bankName = bank.name;
                return false;
            }
        });
        var rowCopy = $.extend({}, row, {'bankId':bankName});
        sysCommon.loadRowToView(rowCopy, 'dlg4_market_member_detail');
        $('#dlg4_market_member_detail').dialog('open').dialog('center').dialog('setTitle', '会员详情');
        $('#fm4_market_member_detail').form('load', row);
    }
    else {
        noSelectAlert();
    }
}

function marketMembersQuery() {
    trimStr(["qMarketCode"]);
    MarketMemberApi.setQueryParams();
}

/**
 * jqObjs
 * @param jqObjs 数组中的元素为 需要trim的input ID
 */
function trimStr(jqObjs) {
    $.each(jqObjs, function () {
        $("#" + this).textbox({'value': $.trim($("#" + this).val())});
    })
}