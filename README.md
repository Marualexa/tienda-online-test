Agregar producto a la sección de lista de productos.
1. Entra al administrador de la tienda.
2. En el panel derecho encontrarás una lista de elementos.
3. Presiona la opción "Add product - Product".
4. Dentro de esta sección encontrarás una lista de productos que están previamente cargados en el administrador.
5. Escoge el que quieras y podrás ver como sé cargar automáticamente al seleccionar.

-- El desarrollo de este esquema se realizó en 'sections/product-colletion.loquid'

Agregar comentario:
1. Dentro del mismo sistema se agregó una opción donde podrás agregar un comentario.
2. Descripción: El mismo cuenta con varias opciones para rellenar, nombre, foto, cantidad de estrellas y una breve que quieras agregar.

-- Podras ver el documento del esquema: 'sections/comment-section.liquid'

El desarrollo de la funcionalidad de add to cart se desarrolló en los archivos:

product-snippets.liquid
1. Se agregó un formulario con liquid el cual extiende su funcionalidad con u custom-elements que se explica en el siguiente punto. Se ha debido extender la funcionalidad del formulario porque el original solo permitía agregar productos a la canasta.

new-product-form.js:
2. Se agregó la funcionalidad de limpiar canasta, agregar regalo y agregar producto, Con esta lógica se asegura que el cliente podrá agregar un solo producto al carrito.
