const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');


async function getUser(username) {
    try {
        const { data } = await axios.get(APIURL + username);
        createUserCard(data);
        getRepos(username);
    } catch (err) {
        if (err.response && err.response.status == 404) {
            createErrorCard('No profile with this username');
        } else {
            createErrorCard('Error fetching the profile');
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios.get(APIURL + username + '/repos?sort=created');
        addReposToCard(data);
    } catch (err) {
        createErrorCard('Problem fetching repo');
    }
}

function createUserCard(user) {
    const cardHTML = `
    <div class="card"> 
        <div>
             <div data-aos="fade-right"> <img src="${user.avatar_url}" alt="${user.name}" class="avatar"></div>
        </div>
        <div data-aos="zoom-out-down">
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>
            <ul>
                <li>${user.followers} <strong>followers</strong></li>
                <li>${user.following} <strong> following</strong></li>
                <li>${user.public_repos} <strong> repos</strong></li>
            </ul>
            </div>
            <div data-aos="zoom-in-right"> <div id="repos"></div> </div>
        </div>
    </div> 
    `

    main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
    const cardHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    `

    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');

    repos.slice(0, 11).forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name; 

        reposEl.appendChild(repoEl);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);
        search.value = '';
    }
});
