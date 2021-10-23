//Element variables
let coursesEl = document.getElementById("courses");
let experienceEl = document.getElementById("experience");
let webpagesEl = document.getElementById("webpages");
let notEl = document.getElementById('notification')
let mainContent = document.getElementById('mainContent')
let userEl = document.getElementById('username')
let passEl = document.getElementById('password')
let loginEl = document.getElementById('loginLink')
let link;
//Store the url for the fetch call in a variable
let url = 'http://studenter.miun.se/~mama2006/webb3/project/REST/rest.php';
//let url = 'http://localhost/REST/rest.php';
let localToken = localStorage.getItem("token");
let loggedIn;


function getToken(){
	/*Send the local token to the web service*/
	fetch(url + '?token=' + localToken + '&login=' + true, {
		method: 'GET',
	}).then(response => response.json()).then(data => {


            loggedIn = data.loggedIn

	if (loggedIn == true){

		
		loginEl.innerHTML = `<a href="logout.html">Logout</a>`

		getRows();

	}
	else{
		loginEl.innerHTML = `<a href="login.html">Login</a>`
	mainContent.innerHTML = "<h1>Login required to access this page</h1>"
	}

		
	}).catch(error => {
		console.log('Error: ', error)
	})

	
}

	


function login() {
    //Post the username and password to web service
    $username = userEl.value;
    $password = passEl.value;

            fetch(url + '?login=' + true,{
                method: 'POST',
                body: JSON.stringify({
                    username: $username,
                    password: $password,
                }),
            }).then(response => response.json()).then(data => {
				//Store the token in the local storage
                localStorage.setItem("token", data.token);

				

				if( data.token == localStorage.getItem("token")){

					window.location.replace("index.html");
				}
				else{
					notEl.innerHTML = data.message
			
				}


            }).catch(error => {
                console.log('Error: ', error)
            })
        

}

function logout() {
    //Clear the local storage and check so that it is successfully cleared.
	localStorage.clear();


	if(sessionStorage.length == 0){
		mainContent.innerHTML = "<h1>You successfully logged out!</h1>"
		
	}else{
		mainContent.innerHTML = `<h1>There was an error logging you out. Please <a href="logout.html">try again</a></h1>`
	}
	
		


}


//Load the data from the database and display it
function getRows() {


	//Reset the element
	coursesEl.innerHTML = '';
	//fetch the web service
	fetch(url, {
		method: 'GET',
	}).then(response => response.json()).then(data => {
		//Store the data from the different tables as objects 
		let courses = data.courses;
		let experience = data.experience;
		let webpages = data.webpages
			//Check if the response is a message or data from the database
		if('message' in data) {
			notEl.innerHTML = data.message
		} else {

            //Insert headers in the table
			coursesEl.innerHTML = `
         <tr>  
		 <th class="hideCell">id</th>  
         <th>Title</th>
         <th>Academy</th>
         <th>Start date</th>
         <th>End date</th>
		 <th>Edit</th>
		 <th>Del.</th>
         </tr>
         `
			experienceEl.innerHTML = `
         <tr>    
		 <th class="hideCell">id</th>
         <th>Title</th>
         <th>Workspace</th>
         <th>Start date</th>
         <th>End date</th>
		 <th>Edit</th>
		 <th>Del.</th>
         </tr>`
			webpagesEl.innerHTML = `
         <tr id="webpageHeads">
         <th>Tile</th> 
         <th>Description</th>
         <th>Adress</th>
		 <th>Edit</th>
		 <th>Del.</th>
		 <th id="webpageUpdateHead"></th>
         </tr>`

         /*Load data from the object into the table rows
         and add buttons for editing and deleting*/
			courses.forEach(course => {
				coursesEl.innerHTML += `
         <tr id="course${course.id}">     
         <td class="hideCell">${course.id}</td>
         <td>${course.title}</td>
         <td>${course.academy}</td>
         <td>${course.start}</td>
         <td>${course.end}</td>
         <td><input type="submit"  value="edit" class="btn" onClick='editRow("course${course.id}", 1)'></td>
         <td><input type="submit" value="x" class="deleteBtn" onClick='deleteRow(${course.id}, 1)'></td>

       </tr>
       `
			})
			experience.forEach(experience => {
				experienceEl.innerHTML += `
         <tr id="experience${experience.id}">      
         <td class="hideCell">${experience.id}</td>
         <td>${experience.title}</td>
         <td>${experience.workplace}</td>
         <td>${experience.start}</td>
         <td>${experience.end}</td>
         <td><input type="submit"  value="edit" class="btn" onClick='editRow("experience${experience.id}", 2)'></td>
         <td><input type="submit" value="x" class="deleteBtn" class="deleteBtn" onClick='deleteRow(${experience.id}, 2)'></td>
         
       </tr>`
			})
			webpages.forEach(webpage => {
                /*If the screen width is less than 769px 
                display the links with the word link.
                Otherwise display the links with the url.
                */
				link = webpage.url
				if(window.innerWidth < 769) {
					link = `Link`
				} else {
					link = webpage.url
				}
				webpagesEl.innerHTML += `
         <tr id="webpage${webpage.id}"> 
         <td class="hideCell">${webpage.id}</td>
         <td>${webpage.title}</td>
         <td>${webpage.description}</td>
         <td> <a id="link${webpage.id}" href=${webpage.url}>${link}</a></td>
         <td><input type="submit"  value="edit" class="btn" onClick='editRow("webpage${webpage.id}", 3)'></td>
         <td><input type="submit" value="x" class="deleteBtn" class="deleteBtn"  onClick='deleteRow(${webpage.id}, 3)'></td>
         
       </tr>`
			})
            /*Add input fields and buttons for adding new rows*/
			coursesEl.innerHTML += `
         <tr class="addInput" >
		 <td class="hideCell">id</td>
         <td><input type="text" placeholder="Title" id="addCourseTitle"></td>
         <td> <input type="text" placeholder="Academy" id="addAcademy"></td>
         <td><input type="text" class="dateInput" placeholder="YYYY-MM-DD" id="addCourseStart"></td>
         <td> <input type="text" class="dateInput" placeholder="YYYY-MM-DD" type="text" id="addCourseEnd"></td>
		 <td><input type="submit"  value="add" class="btn" onclick="addRow( 1);"></td>
		 <td class="hideCell"></td>
         </tr>`
			experienceEl.innerHTML += `<tr class="addInput" >
			<td class="hideCell">id</td>
         <td><input type="text" placeholder="Title" id="addExperienceTitle"></td>
         <td><input type="text" placeholder="Workplace"  id="addWorkplace"></td>
         <td><input type="text" class="dateInput" placeholder="YYYY-MM-DD"type="text" id="addExperienceStart"></td>
         <td><input type="text" class="dateInput" placeholder="YYYY-MM-DD" type="text" id="addExperienceEnd"></td>
		 <td><input type="submit"  value="add" class="btn" onclick="addRow( 2);"></td>
		 <td class="hideCell"></td>
         </tr>`
			webpagesEl.innerHTML += `<tr>
			<td class="hideCell">id</td>
         <td><input type="text" placeholder="Title"  type="text" id="addWebpageTitle"></td>
         <td><textarea placeholder="Description" id="addDescription"></textarea></td>
         <td><textarea placeholder="URL"  id="addURL"></textarea></td>
		 <td><input id="webpageAdd" type="submit"  value="add" class="btn" onclick="addRow(3);"></td>
		 <td class="hideCell"></td>
         </tr> `
		}
	}).catch(error => {
		console.log('Error: ', error)
	})
}





