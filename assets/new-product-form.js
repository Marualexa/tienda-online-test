if (!customElements.get('new-product-form')) {
    customElements.define(
        'new-product-form',
        class NewProductForm extends HTMLElement {
            constructor() {
                super();

                this.form = this.querySelector('form');
                this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
                this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
                this.submitButton = this.querySelector('[type="submit"]');
                this.submitButtonText = this.submitButton.querySelector('span');

                if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

                this.hideErrors = this.dataset.hideErrors === 'true';
            }

            async onSubmitHandler(evt) {
                evt.preventDefault();
                console.log("Hola")

                const config = fetchConfig('javascript');
                config.headers['X-Requested-With'] = 'XMLHttpRequest';
                delete config.headers['Content-Type'];

                const formData = new FormData(this.form);
                if (this.cart) {
                    formData.append(
                        'sections',
                        this.cart.getSectionsToRender().map((section) => section.id)
                    );
                    formData.append('sections_url', window.location.pathname);
                    this.cart.setActiveElement(document.activeElement);
                }
                config.body = formData;

                // Función que agrega un regalo 
                // Esta función agregará al carrito un artículo que es gratis cuando el cliente incluya un servicio al mismo.
                async function giftTobuy() {
                    let formData = {
                        'items': [{
                            'id': 42296369774685,
                            'quantity': 1
                        }]
                    };
                    try {
                        const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        })
                            .then(response => {
                                return response.json();
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        return await response;
                    } catch (error) {
                        throw error;
                    }
                }

                // Función para limpiar la canasta
                // Esta función vacía todos los productos del carrito, restringiendo que se puedan agregar dos servicios dentro del mismo.
                async function clearCart() {
                    try {
                        const response = await fetch(`${window.Shopify.routes.root}cart/clear.js`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });
                        return await response.json();
                    } catch (error) {
                        console.error('Error clearing cart:', error);
                        throw error;
                    }
                }
                await clearCart();
                await giftTobuy();

                // Promesa para agregar un producto al carrito
                // Esta promesa realiza la función de agregar un elemento al carrito.
                fetch(`${routes.cart_add_url}`, config)
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.status) {
                            publish(PUB_SUB_EVENTS.cartError, {
                                source: 'product-form',
                                productVariantId: formData.get('id'),
                                errors: response.errors || response.description,
                                message: response.message,
                            });
                            this.handleErrorMessage(response.description);

                            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
                            if (!soldOutMessage) return;
                            soldOutMessage.classList.remove('hidden');
                            this.error = true;
                            return;
                        } else if (!this.cart) {
                            window.location = window.routes.cart_url;
                            return;
                        }

                        if (!this.error)
                            publish(PUB_SUB_EVENTS.cartUpdate, {
                                source: 'product-form',
                                productVariantId: formData.get('id'),
                                cartData: response,
                            });
                        this.error = false;
                        const quickAddModal = this.closest('quick-add-modal');
                        if (quickAddModal) {
                            document.body.addEventListener(
                                'modalClosed',
                                () => {
                                    setTimeout(() => {
                                        this.cart.renderContents(response);
                                    });
                                },
                                { once: true }
                            );
                            quickAddModal.hide(true);
                        } else {
                            this.cart.renderContents(response);
                        }
                    })
                    .catch((e) => {
                        console.error(e);
                    })
                    .finally(() => {
                        this.submitButton.classList.remove('loading');
                        if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
                        if (!this.error) this.submitButton.removeAttribute('aria-disabled');
                    });
            }

        }
    );
}
