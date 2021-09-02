//функция сдобавления элемента после какого то контента (ее нет в ваниладжс)
Element.prototype.appendAfter = function (element) {
	element.parentNode.insertBefore(this, Element.nextSibling)
}
function noop (){}
//Динамическое создание кнопок ОК и Cancel
function _createModalFooter (buttons = []) {
	if (buttons.length === 0) {
		return document.createElement('div')
	}
	const wrap = document.createElement('div')
	wrap.classList.add('modal-footer')
	buttons.forEach(btn => {
	const $btn = document.createElement('buttons')
		$btn.textContent = btn.text
		$btn.classList.add('btn')
		$btn.classList.add(`btn-${btn.type || 'secondary'}`)
		$btn.onclick = btn.handler || noop
		wrap.appendChild($btn)
	})
	return wrap
}


function _createModal(options){					//Это приватная функция добавления можального окна
const DEFAULT_WIDHT = '600px'
const modal = document.createElement('div')
	modal.classList.add('vmodal')
	modal.insertAdjacentHTML('afterbegin', `
	<div class="modal-overlay" data-close= "true">
	<div class="modal-window" style= "width: ${options.width || DEFAULT_WIDHT}">
	<div class="modal-header">
		<span class="modal-title">${options.title || 'Окно'}</span>
		${options.closable ? `<span class="modal-close" data-close= "true">&times;</span>` : ''}
	</div>
	<div class="modal-body" data-content>
		${options.content || ''}
	</div>
	<div class="modal-footer">
		
	</div>
	</div>
	</div>
		`)
	const footer = _createModalFooter(options.footerButtons)
	footer.appendAfter(modal.querySelector('[data-content]'))
	document.body.appendChild(modal)
	return modal
}
/**
 * +title: string --> //////{параметры передаются в объект $.modal}
 * +closable: boolean если тру то крестик показывается, если фолс то крестика нет-->
 * +content: string какой то динамический контент, который будет наодится в <p>-->
 * +width: string (400px) этот параметр будет отвечать за щирину модального окна-->
 * +релализовать метод destroy():void он должен убирать из DOM дерева модальное окно и удалять все слушатели
 * +при нажатии на крестик окно должно закрываться и на другое (оверлей) место тоже
 * +(меняем контент внутри)был публичный метод setContent(html: String) и возвращять он будет void
 *----------------
 * onClose():void вызывается когда модальное окно закрыто
 * onOpen()
 * beforeClose():boolean если тру, то модальное окно можно закрыть
 * (для того чтобы они были доступны как параметры)
 * ----------------
 * animate CSS
 * */
$.modal = function (options) {
	const $modal = _createModal(options)
	const ANIMATION_SPEED = 200
	let closing = false
	let destroyed = false
	const modal = {
		open (){
			if (destroyed) {
				return console.log('Modal was destroyed')
			}
			!closing && $modal.classList.add('open') 
		},
		close(){
			closing = true
			$modal.classList.remove('open')
			$modal.classList.add('hide')
				setTimeout(() => {
				$modal.classList.remove('hide')	
				closing = false
				if (typeof options.onClose === 'function') {
					options.onClose()
				}
				},ANIMATION_SPEED)
		},
	}
	// закрытие вне модального окна и на крестик по DATA атрибуту HTML
	const listener = event => {
if (event.target.dataset.close) {
			modal.close()
		}
	}

	$modal.addEventListener('click', listener)
	return Object.assign(modal, {
		destroy() {
			$modal.parentNode.removeChild($modal)
			$modal.removeEventListener('click', listener)
			destroyed = true
		},
		//функция динамического создания контента
		setContent (html){
			$modal.querySelector('[data-content]').innerHTML = html
		}
	})
	
	
}
