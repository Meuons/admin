//Take the data from the table row and put it in the fields 



//Delete a row
function deleteRow(row, table) {
    /*Send parameters telling the web service what
    table and row should be updated */
	fetch(url + '?table=' + table + '&id=' + row + '&token=' + localToken, {
		method: 'DELETE',
	}).then(response => response.json()).then(data => {
		//Display the message from the response and reload the courses
		notEl.innerHTML = data.message
		setTimeout(function() {
			notEl.innerHTML = ''
		}, 3000)
		getRows();
	}).catch(error => {
		console.log('Error: ', error)
	})
}




function editRow(elId, table) {

	getRows();

    //Start the function after the data is fetched
	Promise.all([
		fetch(url),
	]).then(function() {

        //Store the data from the row in an array
		let rowEl = document.getElementById(elId)
		let columns = rowEl.children;
		let arr = Array.from(columns);
        //Get the id of the row
		let row = arr[0].innerText
        //Insert a 3 fields for the webpage rows and 4 for the others
		if(table == 1 || table == 2) {
			rowEl.innerHTML = `
     <form id="${elId}form"></form>
     <td><input value="${arr[1].innerText}"type="text" id="${elId}input1"></td>
     <td> <input value="${arr[2].innerText}" type="text" id="${elId}input2"></td>
     <td> <input value="${arr[3].innerText}" type="text" id="${elId}input3"></td>
     <td> <input value="${arr[4].innerText}" type="text" id="${elId}input4"></td>
     <td><input type="submit"  value="update" class="btn" onClick="updateRow(${row}, ${table})"></td>
     <td><input type="submit"  value="x" class="deleteBtn" onClick="deleteRow(${row}, ${table})"></td>

    `
		} else if(table == 3) {
			let url = document.getElementById(`link${row}`).href
			rowEl.innerHTML = `
     <form id="${elId}form"></form>
     <td><input value="${arr[1].innerText}"type="text" id="${elId}input1"></td>
     <td> <textarea  id="${elId}input2">${arr[2].innerText}</textarea></td>
     <td> <textarea class="urlInput" value="${url}" id="${elId}input3">${url}</textarea></td>
     <td><input type="submit"  value="update" class="updateBtn"  onClick="updateRow(${row}, ${table})"></td>
     <td class="hide"><input type="submit"  value="x" class="deleteBtn"  onClick="deleteRow(${row}, ${table})"></td>
        `
		document.getElementById("webpageUpdateHead").innerText += `Update`
		} else {
			notEl.innerHTML = "error invalid table"
		}
	});
}


function addRow(table) {
	if(table == 1) {
		inputObj = {
			'title': document.getElementById("addCourseTitle").value,
			'academy': document.getElementById("addAcademy").value,
			'start': checkDate(document.getElementById("addCourseStart").value),
			'end': checkDate(document.getElementById("addCourseEnd").value),
		}
	} else if(table == 2) {
		inputObj = {
			'title': document.getElementById("addExperienceTitle").value,
			'workplace': document.getElementById("addWorkplace").value,
			'start': checkDate(document.getElementById("addExperienceStart").value),
			'end': checkDate(document.getElementById("addExperienceEnd").value),
		}
	} else if(table == 3) {
		inputObj = {
			'title': document.getElementById("addWebpageTitle").value,
			'url': document.getElementById("addURL").value,
			'description': document.getElementById("addDescription").value,
		}
	} else {
		notEl.innerHTML = "error invalid table"
	}
    /*Display messages if any field is empty or if the date format is incorrect.
    If otherwise post the data*/
	let isNotEmpty = Object.values(inputObj).every(checkEmpty);
	if(isNotEmpty == false) {
		notEl.innerHTML = "Please fill in all the fields";
	} else if((inputObj.start == true) || (inputObj.end == true)) {
		notEl.innerHTML = "Invalid date. Please try again"
	} else {
		fetch(url + '?table=' + table + '&token=' + localToken , {
			method: 'POST',
			body: JSON.stringify(inputObj),
		}).then(response => response.json()).then(data => {
			getRows();
			notEl.innerHTML = data.message
			setTimeout(function() {
				notEl.innerHTML = ''
			}, 3000)
		}).catch(error => {
			console.log('Error: ', error)
		})
	}
}


//Update a row 
function updateRow(row, table) {

    /*Create an object that takes data from the row that has been edited 
    and that has properties corresponding to it's table*/
	if(table == 1) {
		inputObj = {
			'title': document.getElementById(`course${row}input1`).value,
			'academy': document.getElementById(`course${row}input2`).value,
			'start': checkDate(document.getElementById(`course${row}input3`).value),
			'end': checkDate(document.getElementById(`course${row}input4`).value)
		}
	} else if(table == 2) {
		inputObj = {
			'title': document.getElementById(`experience${row}input1`).value,
			'workplace': document.getElementById(`experience${row}input2`).value,
			'start': checkDate(document.getElementById(`experience${row}input3`).value),
			'end': checkDate(document.getElementById(`experience${row}input4`).value)
		}
	} else if(table == 3) {
		inputObj = {
			'title': document.getElementById(`webpage${row}input1`).value,
			'description': document.getElementById(`webpage${row}input2`).value,
			'url': document.getElementById(`webpage${row}input3`).value,
		}
	} else {
		notEl.innerHTML = "error invalid table"
	}
	let isNotEmpty = Object.values(inputObj).every(checkEmpty);
if (isNotEmpty == false) {
	notEl.innerHTML = "Please fill in all the fields";
}
	else if((inputObj.start == true) || (inputObj.end == true)){
		notEl.innerHTML = "Invalid date. Please try again"
	}
	else{
	fetch(url + '?table=' + table + '&id=' + row + '&token=' + localToken, {
		method: 'PUT',
		body: JSON.stringify(inputObj),
	}).then(response => response.json()).then(data => {
		notEl.innerHTML = data.message
		setTimeout(function() {
			notEl.innerHTML = ''
		}, 3000)
		getRows();
	}).catch(error => {
		console.log('Error: ', error)
	})
}
}






//Check the date format
function checkDate(input) {
	let dateformat = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
	if(input == '') {
		return false;
	} else if(input.match(dateformat)) {
		notEl.innerHTML = ''
		return input;
	} else {
		return true;
	}
}





//Check if any field is empty
function checkEmpty(input) {
	console.log(input);
	if(input == '') {
		return false;
	} else {
		notEl.innerHTML = ''
		return input;
	}
}