const createAutoComplete = ({
	autoCompleteWizard,
	renderOption,
	onOptionSelect, 
	inputValue,
	fetchData
	}) =>{

autoCompleteWizard.innerHTML =`<label> <b> Search fors item</b> </label>
					<input class='input' />
					<div class="dropdown">
					<div class="dropdown-menu">
						<div class="dropdown-content results">	</div>
					</div>
					</div>`;

var input = $(autoCompleteWizard).find('input')[0];					

const onInput = async e =>{
	const items = await fetchData(e.target.value);
	const res = $(autoCompleteWizard).find('.results')[0];
	res.innerHTML ='';
	
	$(autoCompleteWizard).find('.dropdown').addClass('is-active');
	if(!items.length){
		$(autoCompleteWizard).find('.dropdown').removeClass('is-active');
		return;
	}
	for(let item of items){
		const optionTag =$('<a></a>').addClass('dropdown-item')[0];
		optionTag.innerHTML = renderOption(item);
		optionTag.addEventListener('click', ()=>{
			$(autoCompleteWizard).find('.dropdown').removeClass('is-active');
			input.value = inputValue(item);
			onOptionSelect(item);
		});
		res.appendChild(optionTag);
	}
};


$(autoCompleteWizard).find('.input').keypress(debounce(onInput,1000));

$(document).click( event =>{
	if(!autoCompleteWizard.contains(event.target)){
			$(autoCompleteWizard).find('.dropdown').removeClass('is-active');
	}
});

};