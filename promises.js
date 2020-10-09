const astroUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getProfiles(json){
    const profiles = json.people.map(person => {
        const craft = person.craft;
        return fetch(wikiUrl + person.name)
            .then (response => response.json())
            .then (profile => {
                return {...profile, craft}
            })
            .catch(err => console.log('Error fetching Wiki: ', err))
    })
    return Promise.all(profiles);
}

function generateHTML(data) {
    data.map(person => {
        const section = document.createElement('section');
        peopleList.appendChild(section);
        const thumbnail = person.thumbnail ? `<img src='${person.thumbnail.source}'>` : '';
        section.innerHTML = `
        <span>${person.craft}</span>
        <h2>${person.title}</h2>
        ${thumbnail}
        <p>${person.description}</p>
        <p>${person.extract}</p>
        `
    })
}

btn.addEventListener('click', (event) => {
    event.target.textContent = "Loading...";
    fetch(astroUrl)
    .then(response => response.json())
    .then(res => getProfiles(res))
    .then(generateHTML) // no es necesario agregar el argumento
    .catch( err => {
        peopleList.innerHTML = '<h3>Something went wrong!</h3>';
        console.log(err);
    })
    .finally( () => event.target.remove())
});

