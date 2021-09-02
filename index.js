let fruits = [
	{id: 1, title: 'Яблоки', price: 20, img: 'https://e1.edimdoma.ru/data/ingredients/0000/2374/2374-ed4_wide.jpg?1487746348'},
	{id: 2, title: 'Апельсины', price: 30, img: 'https://m.dom-eda.com/uploads/images/catalog/item/dfc9a3e974/3cbf3bd41c_1000.jpg'},
	{id: 3, title: 'Манго', price: 40, img: 'https://produktoff.ua/static/upload/goods/22/77222_original.jpg'}
]
/**
 * +1. динамически на основе массива вывести список карточек
 * +2. Показать цену в модальном окне( и это должна быть одна модалка)
 * 3. Модальное окно для удаления с 2мя кнопками
 * ------------
 * 4. На основе плагина $.modal нужно сдеать другой плагин $.confirm
 * 
 * */
 const toHTML = fruit => `
 			<div class="col">
				<div class="card">
  				<img class="card-img-top" style="height: 300px;" src="${fruit.img}">
  				<div class="card-body">
   				<h5 class="card-title">${fruit.title}</h5>
    			<a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Check price</a>
    			<a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Delete</a>
  				</div>
				</div>
			</div>`
function render () {
	const html = fruits.map(toHTML).join('')
	document.querySelector('#fruits').innerHTML = html
}
	render()
document.addEventListener('click', event => {
	event.preventDefault()
	const btnType = event.target.dataset.btn
	const id = +event.target.dataset.id
	let fruit = fruits.find(f => f.id === id)


	if (btnType === 'price') {
		pricemodal.setContent(`
		<p>Цена на ${fruit.title}: ${fruit.price}$</p>
		`)
		pricemodal.open()
	}else if (btnType === 'remove') {
		$.confirm({
			title: 'Вы уверены?',
			content:`<p>Вы удаляете <strong> ${fruit.title} </strong></p>`
		}).then(() => {
			fruits = fruits.filter(f => f.id !== id)
			render()
		}).catch(() => {
			console.log('Cancel')
		})
	}
})
const pricemodal = $.modal({
	title: 'Цена на товары',
	closable: true,
	width: '400px',
	footerButtons: [
	{text: 'Ok', type: 'primary', handler() {
		console.log('Primary btn clicked')
		pricemodal.close()
	}},
	]
})

