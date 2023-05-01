// select input

const searchInputElm = document.querySelector('.search-input');
const formElm = document.querySelector('form');
const msgElm = document.querySelector('.msg');
const collectionElm = document.querySelector('.collection');
const nameInputElm = document.querySelector('.name-input');
const priceInputElm = document.querySelector('.price-input');
const submitBtnElm = document.querySelector('.submit-btn');

let products = localStorage.getItem('storeProducts')
	? JSON.parse(localStorage.getItem('storeProducts'))
	: [];

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
const addProduct = (name, price) => {
	const product = {
		id: products.length + 1,
		name,
		price,
	};

	//store product to data memory
	products.push(product);

	return product;
};
const showProductToUI = (productInfo) => {
	const notFoundElm = document.querySelector('.not-found');
	if (notFoundElm) {
		notFoundElm.remove();
	}
	const { id, name, price } = productInfo;
	const elm = `<li class="list-group-item d-flex flex-row justify-content-between" data-productId='${id}'>
	<div class="product-info" >
		${name} - <span class="product-price">$${price}</span>
	</div>
	<div class="action-btn icon ms-3">
		<i class="fa-solid fa-pencil edit-product text-info"></i>
		<i class="fa-solid fa-trash-arrow-up delete-product text-danger"></i>
	</div>
</li>`;
	collectionElm.insertAdjacentHTML('afterbegin', elm);
	showMessage('product added successfully', 'success');
};
const getProductId = (e) => {
	const liElm = e.target.parentElement.parentElement;
	const id = Number(liElm.getAttribute('data-productId'));
	return id;
};

const updateAfterRemove = (products, id) => {
	return products.filter((product) => product.id !== id);
};

const removeProduct = (id) => {
	products = updateAfterRemove(products, id);
};

const removeProductFromUI = (id) => {
	document.querySelector(`[data-productId="${id}"]`).remove();
	showMessage('product deleted successfully', 'info');
};

const removeProductFromStorage = (id) => {
	let products;
	products = JSON.parse(localStorage.getItem('storeProducts'));
	products = updateAfterRemove(products, id);

	localStorage.setItem('storeProducts', JSON.stringify(products));
};

const addProductToLocalStorage = (product) => {
	let products;
	if (localStorage.getItem('storeProducts')) {
		products = JSON.parse(localStorage.getItem('storeProducts'));
		products.push(product);
	} else {
		products = [];
		products.push(product);
	}
	localStorage.setItem('storeProducts', JSON.stringify(products));
};

const showAllProductsToShow = (products) => {
	// clear existing content form collection element /ul
	collectionElm.textContent = '';

	let liElms;
	liElms =
		products.length === 0
			? '<li class="not-found show-text">No products to show</li>'
			: '';
	//sorting product list
	products.sort((a, b) => b.id - a.id);
	products.forEach((product) => {
		liElms += `<li class="list-group-item d-flex flex-row justify-content-between" data-productId='${product.id}'>
	<div class="product-info" >
		${product.name} - <span class="product-price">$${product.price}</span>
	</div>
	<div class="action-btn icon ms-3">
		<i class="fa-solid fa-pencil edit-product text-info"></i>
		<i class="fa-solid fa-trash-arrow-up delete-product text-danger"></i>
	</div>
</li>`;
	});

	collectionElm.insertAdjacentHTML('afterbegin', liElms);
};

const findProduct = (id) => {
	return products.find((product) => product.id === id);
};

const populateEditState = (product) => {
	(nameInputElm.value = product.name), (priceInputElm.value = product.price);

	//change button element
	submitBtnElm.textContent = 'Update';
	submitBtnElm.classList.add('warning');
	submitBtnElm.classList.add('update-btn');
	submitBtnElm.setAttribute('data-id', product.id);
};

const updateProduct = (receivedProduct) => {
	const updatedProduct = products.map((product) => {
		if (product.id === receivedProduct.id) {
			return {
				...product,
				name: receivedProduct.name,
				price: receivedProduct.price,
			};
		} else {
			return product;
		}
	});
	return updatedProduct;
};

const clearEditForm = () => {
	submitBtnElm.textContent = 'Submit';
	submitBtnElm.classList.remove('warning');
	submitBtnElm.classList.remove('update-btn');
	searchInputElm.removeAttribute('[data-id]');
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

	if (submitBtnElm.classList.contains('update-btn')) {
		//user want to update product
		const id = +submitBtnElm.dataset.id;
		const product = {
			id,
			name,
			price,
		};
		//update data to data memory
		const updatedProduct = updateProduct(product);

		// update memory
		products = updatedProduct;

		//DOM update
		showAllProductsToShow(updatedProduct);

		//localStorage update

		//clear the edit state
		clearEditForm();
	} else {
		//add product to data store
		const product = addProduct(name, price);

		//add product to localStorage
		addProductToLocalStorage(product);

		//show product to UI
		showProductToUI(product);
	}
});

collectionElm.addEventListener('click', (e) => {
	const id = getProductId(e);
	if (e.target.classList.contains('delete-product')) {
		//get the product id
		//remove product from data store
		removeProduct(id);
		//remove product from localStorage
		removeProductFromStorage(id);

		//remove product from UI
		removeProductFromUI(id);
	} else if (e.target.classList.contains('edit-product')) {
		//find the product
		const foundProduct = findProduct(id);
		//populate existing form data in edit state
		populateEditState(foundProduct);
	}
});

document.addEventListener('DOMContentLoaded', () =>
	showAllProductsToShow(products)
);
