const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';

if (localStorage.getItem('next_fetch')) localStorage.removeItem('next_fetch');

const getData = (api) => {
	console.log('llamando a :', api);

	fetch(api)
		.then((response) => response.json())
		.then((response) => {
			const characters = response.results;
			localStorage.setItem('next_fetch', response.info.next);

			let output = characters
				.map((character) => {
					return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
				})
				.join('');

			let newItem = document.createElement('section');
			newItem.classList.add('Items');
			newItem.innerHTML = output;
			$app.appendChild(newItem);
			if (response.info.next === null) {
				newItem.innerHTML = `<h1>Ya no hay personajes</h1>`;
				intersectionObserver.disconnect($observe);
			}
		})
		.catch((error) => console.error(error));
};

const loadData = async () => {
	try {
		let next_fetch = localStorage.getItem('next_fetch');
		await getData(next_fetch === null ? API : next_fetch);
	} catch (error) {
		console.error(error);
	}
};

const intersectionObserver = new IntersectionObserver(
	(entries) => {
		if (entries[0].isIntersecting) {
			loadData();
		}
	},
	{
		rootMargin: '0px 0px 100% 0px',
	}
);

intersectionObserver.observe($observe);
