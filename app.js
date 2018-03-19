class Github {
    constructor(){
        this.client_id = 'ef1c39b98e77f4715f70';
        this.client_secret = 'e5597007920c1083597b4a64c6c72fce3e6c8798';
        this.repos_number = 5;
        this.repos_sort = 'created: asc';
    }

    getUser(user){
        return new Promise((resolve, reject) => {
            fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`)
                .then(res => res.json())
                //return data
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    getRepos(user){
        return new Promise((resolve, reject) => {
            fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_number}&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`)
                .then(res => res.json())
                //return data
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

}

class UI{
    constructor(){
        this.profile = document.getElementById('profile');
    }

    showProfile(user){
        this.profile.innerHTML = `
            <div class="card card-body mb-3">
                <div class="row">
                    <div class="col-md-3">
                        <img class="img-fluid mb-2" src="${user.avatar_url}" />
                        <a href="${user.html_url}" target="_blank" class="btn btn-dark mb-4 btn-block">View Profile</a>
                    </div>
                    <div class="col-md-9">
                        <span class="badge badge-primary m-1 p-1">Public Repos: ${user.public_repos}</span>
                        <span class="badge badge-secondary m-1 p-1">Public Gists: ${user.public_gists}</span>
                        <span class="badge badge-success m-1 p-1">Followers: ${user.followers}</span>
                        <span class="badge badge-info m-1" p-1>Followers: ${user.following}</span>
                        <br><br>
                        <ul class="list-group">
                            <li class="list-group-item">Company: ${user.company}</li>
                            <li class="list-group-item">Blog/website: ${user.blog}</li>
                            <li class="list-group-item">Location: ${user.location}</li>
                            <li class="list-group-item">Member since: ${user.created_at}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <h3 class="page-heading mb-3">Latest Repos</h3>
            <div id="repos"></div>
        `;
    }

    // shoow user repos
    showRepos(repos){
        let output = '';
        repos.forEach(function(repo){
            output += `
            <div class="card card-body mb-2">
                <div class="row">
                    <div class="col-md-6">
                        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    </div>
                    <div class="col-md-6">
                    <span class="badge badge-primary p-1">Stars: ${repo.stargazers_count}</span>
                    <span class="badge badge-secondary p-1">Watchers: ${repo.watchers_count}</span>
                    <span class="badge badge-success p-1">Forks: ${repo.forms_count}</span>
                    </div>
                </div>
            </div>
            `;
        });

        // Output repos
        document.getElementById('repos').innerHTML = output;
    }
    // show alert message
    showAlert(message, className){
        //Clear any remaing alerts
        this.clearAlert();
        // create div
        const div = document.createElement('div');
        // Add classes
        div.className = className;
        // add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.searchContainer');
        // Get search box
        const search = document.querySelector('.search');
        // Insert alert
        container.insertBefore(div, search);

        // Timeout after 3 sec
        setTimeout(()=>{
            this.clearAlert();
        },3000);

    }
    // Clear alert message
    clearAlert(){
        const currentAlert = document.querySelector('.alert');
        if(currentAlert){
            currentAlert.remove();
        }
    }

    // clear profile
    clearProfile(){
        this.profile.innerHTML = '';
        document.getElementById('repos').innerHTML ='';
    }
}


// Search input
const searchUser = document.getElementById('searchUser');
// Search input event listener
searchUser.addEventListener('keyup', (e) => {

  // Init Github
  const github = new Github;
  // Init UI
  const ui = new UI;

  // Get input text
  const inputText = e.target.value;

  if(inputText !== ''){
     // Make http call
        github.getUser(inputText)

            .then(data => {
              if(data.message === 'Not Found'){
                  // show alert
                  ui.showAlert('User not found', 'alert alert-danger');
                  console.log('adsd')

              }else{
                ui.showProfile(data);

              }
            })
        .catch(err => console.log(err));

        // Make http call
        github.getRepos(inputText)
            .then(data => {
                ui.showRepos(data);
            })
            .catch(err => console.log(err));
    }else{
      // clear profile
      ui.clearProfile();
    }

});
