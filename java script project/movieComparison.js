const commonAutoComplete={
	renderOption: (item)=>{
			const imgSrc = item.Poster ==='N/A' ?'' : item.Poster;
			return `
		<img src="${imgSrc}" style="height:50px;margin-right:10px" /> ${item.Title} (${item.Year})
		`;
		},
		onOptionSelect(item){
			onSelectItem(item);
		},
		inputValue(item){
			return item.Title;
		},
		async fetchData(itemId) {
			const response = await axios.get('https://www.omdbapi.com/',{
			params:{
				apikey:'4e3184ad',
				s:itemId}
		});
		if(response.data.Error){
			return []; 
		}
		return response.data.Search;
	}
};

createAutoComplete({
	...commonAutoComplete,
	autoCompleteWizard: $('#left-autocomplete')[0],
	onOptionSelect(item){
		$('.tutorial').addClass('is-hidden');
		onSelectItem(item,$('#left-summary')[0],'left');
	}
});

createAutoComplete({
	...commonAutoComplete,
	autoCompleteWizard: $('#right-autocomplete')[0],
	onOptionSelect(item){
		$('.tutorial').addClass('is-hidden');
		onSelectItem(item,$('#right-summary')[0],'right');
	}
});
	
let leftMovie;
let rightMovie;	
const onSelectItem =async (item,summaryElement,side) =>{
	const response = await axios.get('https://www.omdbapi.com/',{
		params:{
			apikey:'4e3184ad',
			i:item.imdbID}
	});
	if(response.data.Error){
		return []; 
	}
	
	if(side === 'left'){
		leftMovie =	response.data;
	}else{
		rightMovie = response.data;
	}	
	if(rightMovie && leftMovie){
		itemComparison();
	}
	summaryElement.innerHTML = itemDetails(response.data);
};

const itemComparison = ()=> {
	 const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};
	

const itemDetails = itemDtl => {
	
	const dollars = parseInt(
    itemDtl.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metascore = parseInt(itemDtl.Metascore);
  const imdbRating = parseFloat(itemDtl.imdbRating);
  const imdbVotes = parseInt(itemDtl.imdbVotes.replace(/,/g, ''));
  const awards = itemDtl.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  
	return `<article class="media">
	<figure class"media-left">
	<p class ="image">
		<img src="${itemDtl.Poster}" />
	</p>
	</figure>
	<div class="media-content">
	<div class="content">
	<h1>${itemDtl.Title}</h1>
	<h1>Genre: ${itemDtl.Genre}</h1>
	<h4>Country: ${itemDtl.Country}</h4>
	<p>Summary: ${itemDtl.Plot}</p>
	</div>
	</div>
	</article>
	<article data-value=${awards} class="notification is-primary">
		<p class="title">${itemDtl.Awards}</p>
		<p class="subtitle">Awards</p>
	</article>	
	<article data-value=${dollars} class="notification is-primary">
		<p class="title">${itemDtl.BoxOffice}</p>
		<p class="subtitle">BoxOffice</p>
	</article>
	<article data-value=${metascore} class="notification is-primary">
		<p class="title">${itemDtl.Metascore}</p>
		<p class="subtitle">Metascore</p>
	</article>
	<article data-value=${imdbRating} class="notification is-primary">
		<p class="title">${itemDtl.imdbRating}</p>
		<p class="subtitle">Imdb Rating </p>
	</article>
	<article data-value=${imdbVotes} class="notification is-primary">
		<p class="title">${itemDtl.imdbVotes}</p>
		<p class="subtitle">Imdb Votes</p>
	</article>
	`;
	
};

