var true_src = '/assets/check.png';
var false_src = '/assets/x.png';

var cancelAction = function(){
	clearLabel();
	
	$('#paxes tr[id="pax-new"]').remove();
	$('#newPaxBtn').prop('disabled', false);
};

var cancelUpdateAction = function(){
	clearLabel();
	
	id = $('#pax-update').data('id');
	$('#pax-' + id).removeClass('invis');
	
	$('#paxes tr[id="pax-update"]').remove();
};

var updateCurrentImg = function(new_id){
	var old_id = $('tr img[alt="true"]').parent().parent().attr('id');
	if(new_id != old_id){
		$('#' + old_id + ' img').attr('src', false_src).attr('alt', 'false');
		$('#' + new_id + ' img').attr('src', true_src).attr('alt', 'true');
	}
};

var addAction = function(){
	cancelUpdateAction();
	clearLabel();
	//add pax on click
	data = {
		name: $('#name').val(),
		location: $('#location').val(),
		start: $('#start').val(),
		end: $('#end').val()
	};
	$.ajax({
		url : '/pax/create',
		data : data,
		dataType : 'json',
		type : 'POST',
		success : function(data) {
			$('#paxes input[type="text"]').removeClass('error');
			if(data.success){
				//run cancelAction
				cancelAction();
				//add row with pax data
				var row = $('<tr id="pax-' + data.info.id + '">');
				var cols = '';
		
				cols += '<td data-id="' + data.info.id + '" data-name="' + data.info.name + '" >' + data.info.name + '</td>';
				cols += '<td data-id="' + data.info.id + '" data-location="' + data.info.location + '" >' + data.info.location + '</td>';
				cols += '<td data-id="' + data.info.id + '" data-start="' + data.info.start + '" >' + data.info.start + '</td>';
				cols += '<td data-id="' + data.info.id + '" data-end="' + data.info.end + '" >' + data.info.end + '</td>';
				cols += '<td><img alt="' + data.info.current + '" src="' + (data.info.current ? '/assets/check.png' : '/assets/x.png') + '" /></td>';
				cols += '<td><button data-id="' + data.info.id + '" type="button" class="setCurrentBtn btn btn-default">Set Current</button></td>';
				cols += '<td><button data-id="' + data.info.id + '" type="button" class="editBtn btn btn-default">Edit</button></td>';
				
				row.append(cols);
				$('#paxes').append(row);
				
				updateCurrentImg('pax-' + data.info.id);
			}else{
				//highlight missing fields
				data.missing.forEach(function(e){
					$('#' + e).addClass('error');
				});
			}
			$('#p_label').text(data.message);
		}
	});
};

var updateAction = function(){
	clearLabel();
	//update pax on click
	id = $('#pax-update').data('id');
	data = {
		id: id,
		name: $('#name-' + id).val(),
		location: $('#location-' + id).val(),
		start: $('#start-' + id).val(),
		end: $('#end-' + id).val()
	};
	$.ajax({
		url : '/pax/update',
		data : data,
		dataType : 'json',
		type : 'POST',
		success : function(data) {
			$('#paxes input[type="text"]').removeClass('error');
			if(data.success){
				//update values in hidden row
				old_val = $('#pax-' + id + ' > td[data-id="' + id + '"]').map(function() { return $(this); });
				old_val[0].data('name', data.name).text(data.name);
				old_val[1].data('location', data.location).text(data.location);
				old_val[2].data('start', data.start).text(data.start);
				old_val[3].data('end', data.end).text(data.end);
				//run cancelUpdateAction
				cancelUpdateAction();
			}else{
				//highlight missing fields
				data.missing.forEach(function(e){
					$('#' + e + '-' + id).addClass('error');
				});
			}
			//display message
			$('#p_label').text(data.message);
		}
	});
};

var clearLabel = function(){
	$('#p_label').text('');
};

var setCurrentAction = function(e){
	clearLabel();
	
	id = e.currentTarget.dataset['id'];
	
	$.ajax({
		url : '/pax/current',
		data : {
			id: id
		},
		dataType : 'json',
		type : 'POST',
		success : function(data) {
			if(data.success){
				new_id = 'pax-' + id;
				updateCurrentImg(new_id);
			}else{
				$('#p_label').text(data.message);
			}
		}
	});
};

var editAction = function(e){
	cancelAction();
	clearLabel();
	//add in call for cancelUpdate method
	cancelUpdateAction();
	id = e.currentTarget.dataset['id'];
	//hide active row with id
	$('#pax-' + id).addClass('invis');
	//get current values
	vals = $('#pax-' + id + ' > td[data-id="' + id + '"]').map(function() { return $(this); });
	//add row with inputs and update button
	var row = $('<tr data-id="' + id + '" id="pax-update">');
	var cols = '';

	cols += '<td><input type="text" value="' + vals[0].data('name') + '" placeHolder="PAX Name" id="name-' + id + '" /></td>';
	cols += '<td><input type="text" value="' + vals[1].data('location') + '" placeHolder="Location" id="location-' + id + '" /></td>';
	cols += '<td><input type="text" value="' + vals[2].data('start') + '" placeHolder="Start Date {yyyy-mm-dd}" id="start-' + id + '" /></td>';
	cols += '<td><input type="text" value="' + vals[3].data('end') + '" placeHolder="End Date {yyyy-mm-dd}" id="end-' + id + '" /></td>';
	cols += '<td><button type="button" id="updateBtn" class="btn btn-default">Update</button></td>';
	cols += '<td><button type="button" id="cancelUpdateBtn" class="btn btn-default">Cancel</button></td>';

	row.append(cols);
	$('#pax-' + id).after(row);
};

$(document).ready(function() {

	$('#paxes').on('click', '.editBtn', editAction);

	$('#paxes').on('click', '.setCurrentBtn', setCurrentAction);

	$('#paxes').on('click', '#addBtn', addAction);
	$('#paxes').on('click', '#cancelBtn', cancelAction);
	
	$('#paxes').on('click', '#updateBtn', updateAction);
	$('#paxes').on('click', '#cancelUpdateBtn', cancelUpdateAction);
	
	$('#newPaxBtn').click(function(){
		cancelUpdateAction();
		//add row of inputs to #paxes table
		var row = $('<tr id="pax-new">');
		var cols = '';

		cols += '<td><input type="text" placeHolder="PAX Name" id="name" /></td>';
		cols += '<td><input type="text" placeHolder="Location" id="location" /></td>';
		cols += '<td><input type="text" placeHolder="Start Date {yyyy-mm-dd}" id="start" /></td>';
		cols += '<td><input type="text" placeHolder="End Date {yyyy-mm-dd}" id="end" /></td>';
		cols += '<td><button type="button" id="addBtn" class="btn btn-default">Add</button></td>';
		cols += '<td><button type="button" id="cancelBtn" class="btn btn-default">Cancel</button></td>';

		row.append(cols);
		$('#paxes').append(row);
		//disable #newPaxBtn
		$('#newPaxBtn').prop('disabled', true);
	});
	$('#newPaxBtn').click(clearLabel);
	
	
});