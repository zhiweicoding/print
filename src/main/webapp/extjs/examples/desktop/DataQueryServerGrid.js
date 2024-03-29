var dataServeritemsPerPage = 15;

var dataServerOperation = {
	addDataServer : function() {
		var window = Ext.getCmp("addDataServerWindow");
		if (window) {
			Ext.getCmp("addDataServerWindow").show();
		} else {
			Ext.create('Ext.window.Window', {
				id : 'addDataServerWindow',
				title : '添加订阅',
				height : 300,
				width : 400,
				layout : 'fit',
				items : {
					xtype : 'form',
					bodyPadding : 5,
					width : 350,
					url : '/esb-gather/dataServer/addDataServer',
					layout : 'anchor',
					defaults : {
						anchor : '100%'
					},
					defaultType : 'textfield',
					items : [{
								xtype : 'combobox',
								fieldLabel : '应用系统',
								name : 'subscriberId',
								store : subscriberStore,
								queryMode : 'remote',
								displayField : 'sysName',
								valueField : 'id',
								allowBlank : false
							}, {
								fieldLabel : '应用服务编号',
								name : 'msgCode',
								allowBlank : false
							}, {
								xtype : 'combobox',
								fieldLabel : '视图名称',
								name : 'dataQueryId',
								store : dataQueryStore,
								queryMode : 'remote',
								displayField : 'queryName',
								valueField : 'id',
								allowBlank : false
							}, {
								fieldLabel : '备注',
								name : 'content',
								allowBlank : false
							}],
					buttons : [{
								text : '重置注册信息',
								handler : function() {
									this.up('form').getForm().reset();
								}
							}, {
								text : '提交注册信息',
								formBind : true, // only enabled once the
								// form is
								// valid
								// disabled : true,
								handler : function() {
									var form = this.up('form').getForm();
									if (form.isValid()) {
										form.submit({
											success : function(form, action) {
												Ext.Msg.alert('注册成功',
														"应用系统信息注册成功!");
												dataServerStore.reload();
												form.reset();
												Ext
														.getCmp("addDataServerWindow")
														.hide();
											},
											failure : function(form, action) {
												Ext.Msg.alert('注册失败',
														"应用系统信息注册失败!");
											}
										});
									}
								}
							}]
				}
			}).show();
		}
	},

	updateDataServer : function() {
		var row = Ext.getCmp("dataServerGird").getSelectionModel().selected.items;
		var data = row[0].data;
		var window = Ext.getCmp("updateDataServerWindow");
		if (window) {
			Ext.getCmp("updateDataServerForm").getForm().setValues(data);
			Ext.getCmp("updateDataServerWindow").show();
		} else {
			Ext.create('Ext.window.Window', {
				id : 'updateDataServerWindow',
				title : '修改订阅',
				height : 300,
				width : 400,
				layout : 'fit',
				items : {
					xtype : 'form',
					id : 'updateDataServerForm',
					bodyPadding : 5,
					width : 350,
					url : '/esb-gather/dataServer/updateDataServer',
					layout : 'anchor',
					defaults : {
						anchor : '100%'
					},
					defaultType : 'textfield',
					items : [{
								fieldLabel : '主键',
								name : 'id',
								allowBlank : false,
								readOnly : true,
								hidden : true
							}, {
								xtype : 'combobox',
								fieldLabel : '应用系统',
								name : 'subscriberId',
								store : subscriberStore,
								queryMode : 'remote',
								displayField : 'sysName',
								valueField : 'id',
								allowBlank : false
							}, {
								fieldLabel : '应用服务编号',
								name : 'msgCode',
								allowBlank : false
							}, {
								xtype : 'combobox',
								fieldLabel : '视图名称',
								name : 'dataQueryId',
								store : dataQueryStore,
								queryMode : 'remote',
								displayField : 'queryName',
								valueField : 'id',
								allowBlank : false
							}, {
								fieldLabel : '备注',
								name : 'content',
								allowBlank : false
							}],
					buttons : [{
						text : '提交修改',
						formBind : true,
						handler : function() {
							var form = this.up('form').getForm();
							if (form.isValid()) {
								form.submit({
											success : function(form, action) {
												Ext.Msg
														.alert('操作结果',
																"信息修改成功!");
												dataServerStore.reload();
												form.reset();
												Ext
														.getCmp("updateDataServerWindow")
														.hide();
											},
											failure : function(form, action) {
												Ext.Msg
														.alert('操作结果',
																"信息修改失败!");
											}
										});
							}
						}
					}]
				}
			}).show();
			Ext.getCmp("updateDataServerForm").getForm().setValues(data);
		}
	},
	deleteDataServer : function() {
		Ext.MessageBox.confirm('', '您确定要删除吗?', function(opt) {
			if (opt == 'yes') {
				var row = Ext.getCmp("dataServerGird").getSelectionModel().selected.items;
				var id = row[0].data['id'];

				Ext.Ajax.request({
							url : '/esb-gather/dataServer/deleteDataServer',
							params : {
								id : id
							},
							success : function(response) {
								var text = response.responseText;
								dataServerStore.remove(row[0]);
							}
						});
			}
		});
	}
}

Ext.define('MyDesktop.DataQueryServerGrid', {
	extend : 'Ext.ux.desktop.Module',

	requires : ['Ext.data.ArrayStore', 'Ext.util.Format', 'Ext.grid.Panel',
			'Ext.grid.RowNumberer'],

	id : 'dataServerWindow',

	init : function() {
		this.launcher = {
			text : '数据查询服务管理',
			iconCls : 'dataQueryServerWindow'
		};
	},

	createWindow : function() {
		var itemLimit = 1;
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('dataServerWindow');
		if (!win) {
			win = desktop.createWindow({
						id : 'dataServerWindow',
						title : '数据查询服务管理',
						width : 820,
						height : 480,
						iconCls : 'dataQueryServerWindow',
						animCollapse : false,
						constrainHeader : true,
						layout : 'fit',
						viewConfig : {
							forceFit : true
						},
						items : [{
							border : false,
							id : "dataServerGird",
							xtype : 'grid',
							store : Ext.data.StoreManager
									.lookup('dataServerStore'),
							columns : [new Ext.grid.RowNumberer(), {
										text : '主键',
										dataIndex : 'id',
										hidden : true
									}, {
										text : '应用服务编号',
										dataIndex : 'msgCode',
										sortable : true,
										width : 150
									}, {
										text : "服务系统编号",
										sortable : true,
										dataIndex : 'subscriberId',
										hidden : true
									}, {
										text : "服务系统名称",
										width : 150,
										sortable : true,
										dataIndex : 'subscriberName'
									}, {
										text : "视图ID",
										sortable : true,
										dataIndex : 'dataQueryId',
										hidden : true
									}, {
										text : "视图名",
										width : 150,
										sortable : true,
										dataIndex : 'dataQueryName'
									}, {
										text : "添加时间",
										width : 150,
										sortable : true,
										dataIndex : 'actionDate'
									}, {
										text : "备注",
										width : 200,
										sortable : true,
										dataIndex : 'content'
									}]
						}],
						tbar : [{
									text : '增加',
									tooltip : '添加一行记录',
									iconCls : 'add',
									handler : function() {
										dataServerOperation.addDataServer();
									}
								}, '-', {
									text : '修改',
									tooltip : '修改当前记录',
									iconCls : 'option',
									handler : function() {

										var row = Ext.getCmp("dataServerGird")
												.getSelectionModel().selected.items
										if (row.length) {
											dataServerOperation
													.updateDataServer();
										} else {
											Ext.Msg.alert('', "需要选中一条记录!");
											return;
										}
									}
								}, '-', {
									text : '删除',
									tooltip : '删除选中的记录',
									iconCls : 'remove',
									handler : function() {

										var row = Ext.getCmp("dataServerGird")
												.getSelectionModel().selected.items
										if (row.length) {
											dataServerOperation.deleteDataServer();
										} else {
											Ext.Msg.alert('', "需要选中一条记录!");
											return;
										}
									}
								}],
						bbar : Ext.create('Ext.PagingToolbar', {
									store : dataServerStore,
									displayInfo : true,
									displayMsg : '显示 {0} - {1} 条，共计 {2} 条',
									emptyMsg : "没有数据"
								})
					});
		}
		return win;
	}

});

Ext.define('dataServer', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'msgCode',
						type : 'string'
					}, {
						name : 'subscriberId',
						type : 'string'
					}, {
						name : 'subscriberName',
						type : 'string'
					}, {
						name : 'dataQueryId',
						type : 'string'
					}, {
						name : 'dataQueryName',
						type : 'string'
					}, {
						name : 'actionDate',
						type : 'string'
					}, {
						name : 'content',
						type : 'string'
					}]

		});

// 一个包含AjaxProxy代理的Store, 使用参数方式绑定.

var dataServerStore = Ext.create('Ext.data.Store', {
			storeId : 'dataServerStore',
			model : 'dataServer',
			autoLoad : false,
			pageSize : dataServeritemsPerPage,
			proxy : {
				type : 'ajax',
				url : '/esb-gather/dataServer/findDataServers',
				reader : {
					type : 'json',
					root : 'root',
					totalProperty : 'total'
				}
			}
		});
dataServerStore.load({
			params : {
				start : 0,
				limit : dataServeritemsPerPage
			}
		});
