// select input

const searchInputElm = document.querySelector('.search-input');
const formElm = document.querySelector('form');
const msgElm = document.querySelector('.msg');
const collectionElm = document.querySelector('.collection');
const nameInputElm = document.querySelector('.name-input');
const priceInputElm = document.querySelector('.price-input');
const submitBtnElm = document.querySelector('#submit');

const receiveInputsValue = () => {
	const name = nameInputElm.value;
	const price = priceInputElm.value;
	return {
		name,
		price,
	};
};

const clearMessage = () => {
	msgElm.textContent = '';
};
const showMessage = (msg, action) => {
	const alertMsg = `<div class="alert alert-${action} mt-2" role="alert">
	${msg}
  </div>`;
	msgElm.insertAdjacentHTML('afterbegin', alertMsg);
	setTimeout(() => {
		clearMessage();
	}, 2000);
};

const validateInput = (name, price) => {
	let isValid = true;

	// check input is empty
	if (name === '' || price === '') {
		isValid = false;
		showMessage('please provide necessary info', 'danger');
	}

	if (Number(price) !== Number(price)) {
		isValid = false;
		showMessage('please provide price in number', 'danger');
	}
	return isValid;
};
const resetInputs = () => {
	nameInputElm.value = '';
	priceInputElm.value = '';
};

formElm.addEventListener('submit', (e) => {
	// browser reload prevent
	e.preventDefault();

	//receiving the inputs value
	const { name, price } = receiveInputsValue();

	//check validation
	const isValid = validateInput(name, price);
	if (!isValid) return;

	//reset the input
	resetInputs();
});
