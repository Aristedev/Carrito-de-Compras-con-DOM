# Apuntes: DOM - Curso JavaScript Moderno
[Link del Curso](https://youtube.com/playlist?list=PLPl81lqbj-4I2ZOzryjPKxfhK3BzTlaJ7 "DOM")

![imagenDOM](https://i.ytimg.com/vi/11MEBKljhFc/maxresdefault.jpg)

## Leer y Modificar el HTML
Capturamos el id 'lista'. Debido a que no contamos con varias clases, podemos usar id
``` javascript
const lista = document.getElementById('lista');
console.log(lista);
```
Creamos un elemento «li» en el documento HTML. El «li» no tiene contenido ni donde se encontrará

`const li = document.createElement('li');`

Agregamos contenido al elemento «li»

`li.textContent = 'primer elemento';`

Definimos donde se encontrará el elemento «li»

`lista.appendChild(li);`

---

## Agregamos elementos en una lista
**1era opción:** Agregamos una lista o un array:

```javascript
const arrayElement = ['primer elemento', 'Segundo elemento', 'tercer elemento'];
arrayElement.forEach(item => {
     // console.log(item)
     const li = document.createElement('li');
     li.textContent = item;
     lista.appendChild(li);
 });
```

**2da opción:**
```javascript
arrayElement.forEach(item => {
    lista.innerHTML += `<li>${item}</li>`; // ``: podemos mezclar HMTL con JS, un elemento dinámico «item»
});
```

Se da un inconveniente con las dos opciones, se genera REFLOW.
* El *REFLOW* es cuando la pagina se reinicia por cada elemento agregado.
* El *REFLOW* es un problema cuando tenemos una gran cantidad de elementos.

---

## CLASE #4: Fragment + createElement (no más reflow)
Este método es el RECOMENDABLE al añadir una lista de elementos.

El *fragment* se guarda en una memoria volatil y no se renderiza en nuestro DOM hasta que se lo indiquemos, todo esto reduciendo la interferencia en el flujo de ejecución, disminuyendo así el *REFLOW*.

### Capturamos el id 'lista'
Debido a que no contamos con varias clases, podemos usar id.

```javascript
const lista = document.getElementById('lista');
const arrayElement = ['primer elemento', 'Segundo elemento', 'tercer elemento'];
// Usar una de las dos opciones
//  1era opción: método
const fragment = document.createDocumentFragment(); 
//  ó 2da opción: el constructor
const fragment = new DocumentFragment();
```

### Proceso de la iteración
1. guardar dentro del ciclo forEcha nuestro fragment, con cada uno de nuestros «li»
2. Cuando finalize el ciclo, agregamos la estructura(fragment) a nuestro Document

> **Conclusión:** No se agrega uno a uno los elementos, sino que, realizamos la estructura en JS y luego la incorporamos en nuestro DOM.

```javascript
arrayElement.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    fragment.appendChild(li); // Se agrega los «li» al fragment
    console.log(fragment); // Nota: #document-fragment -> Se alamacena dentro de JS. No afecta al Document
})
```
Agregamos el fragment a «lista» (del Document). 
*Una vez listo los «li» los empujamos al Document con .appendChild()*
```javascript
lista.appendChild(fragment); // Se agrega fragment al elemento «lista»
```

---

## Insertando primero los elementos
### Proceso:
1. Seleccionamos el id del *documento HTML*
2. Declaramos los *items* en un array
3. declaramos una variable `fragment` para crear un *DocumentFragment*
4. iteramos con `forEach` en el array. Dentro del `forEach`:
    - creamos elementos `li`
    - los elementos `li` toman los valores de los item del array con `.textContent`
    - extraemos el primer hijo del `fragment` con `firstChild`
    - ponemos los elementos al principio con `insertBefore`
5. Insertamos los elementos del `fragment` a la `lista` con `appendChild`

### Código
```javascript
const lista = document.getElementById('lista');
const arrayItem = ['item 1', 'item 2', 'item 3'];

const fragment = document.createDocumentFragment();

arrayItem.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    const childNode = fragment.firstChild;
    
    console.log(item, childNode); // Observamos el efecto del firstChild

    fragment.insertBefore(li, childNode);
})

lista.appendChild(fragment); 
```
---
## #5 template vs innerHTML vs createElement
Para agregar la siguiente sección dentro de *ul*:
```html
<li class="list">
    <b>Nombre: </b> <span class="text-danger">contenido de la lista</span>
</li>
```
Tenemos dos opciones.
### **1era Opción:** Usando `createElement`
En este caso es viable ya que la estructura que agregamos es sencilla.
```javascript
const lista = document.querySelector('#lista');
const arrayList = ['item 1', 'item 2', 'item 3'];
const fragment = document.createDocumentFragment();

arrayList.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('list')
    const b = document.createElement('b');
    b.textContent = 'Nombre: ';
    
    const span = document.createElement('span');
    span.classList.add('text-danger');
    span.textContent = item;

    li.appendChild(b);
    li.appendChild(span);

    fragment.appendChild(li);
})

lista.appendChild(fragment);
```
Pero
> No es viable usar el *fragment* con el *createElement* cuando tengamos que agregar muchos elementos en el *document*.

### **2da Opción:** Usando `innerHtml` y ``(template)
Esta opción no acepta el *fragment*. Porque, el `innerHTML` no acepta el *fragment* que se hace a traves de *createDocument*.

Con esta opción tambien reducimos el **reflow**.

Para este caso, esta opción es la más recomendable.

```javascript
// Con el createElement
const lista = document.querySelector('#lista');
const arrayList = ['item 1', 'item 2', 'item 3'];

// reemplamos fragment por let template
let template = ''; // templateString vacío

arrayList.forEach(item => {
    template += `
    <li class="list">
        <b>Nombre: </b> <span class="text-danger">${item}</span>
    </li>
    `
    // Agregamos un Elemento Dinámico item
})
lista.innerHTML = template; // Una vez que tenemos nuestro templateString listo, lo incorporamos al HTML
```

> Existe una discución sobre si usando template tenemos un menor rendimiento que los *createElement*. [innerHTML vs createElement](https://medium.com/@kevinchi118/innerhtml-vs-createelement-appendchild-3da39275a694#:~:text=While%20clean%2C%20using%20innerHTML%20reparses,multiple%20things%20to%20an%20element.)

**Ambas opciones no son las definitivas**, entonces ¿cuál es la más recomendable?

### **3era Opción (Mejor Opción):** Usando `<template>` y `fragment`
#### Elemento HMTL `<template>`
`<template>` Es una sección del *documento HTML* que no se muestra(o renderiza) o se hace uso(es decir, es instanciado) hasta que se lo indiquemos, usando por ejemplo *Javascript*. 

Fragmento de contenido que está siendo almacenado, del lado del cliente, para un uso posterior en el documento. [Mozilla](https://developer.mozilla.org/es/docs/Web/HTML/Element/template)

**Recomendación:** Dejar los `<template>` siempre abajo de todo el *documento HTML*.

#### Código
Proceso:
1. En el *documento HTML* realizamos nuestro `<template>` en la última sección.
2. Almacenamos la estructura del `template` en una constante y creamos un `fragment`.
3. Usamos `.forEach` para iterar y almacenar los *items*
    - Modificamos nuestra constante `template` con `forEach`, insertamos nuestra lista de *items*
    - Clonamos las características interiores de `template` mediante `.cloneNode()`
    - Almacenamos el `clone` en el `fragment`
4. Insertamos los elementos del `fragment` a la `lista` con `appendChild`

```html
<body>
    <h1>DOM JAVASCRIPT</h1>
    <ul id="lista">
        
    </ul>
    
    <template id="template-li">
        <li class="list">
            <b>Nombre: </b> <span class="text-danger"></span>
        </li>        
    </template>

    <script src="./app.js"></script>
</body>
```

```javascript
const lista = document.querySelector('#lista');
const arrayList = ['item 1', 'item 2', 'item 3'];

const template = document.querySelector('#template-li').content; // Filtrando la etiqueta de <template>
const fragment = document.createDocumentFragment();
console.log(template)
arrayList.forEach(item => {
    template.querySelector('span').textContent = item; // Los items se agregan al contenido de texto del span
    const clone = template.cloneNode(true); // Clonación del template para agregarlo en nuevo padre

    fragment.appendChild(clone); // Clona cada una de sus características interiores
})

lista.appendChild(fragment);
```
Notas:
* En la sección `template.querySelector('span').textContent = item;`. Si queremos ser más específicos en la selección de sus selectores (id o class), en una *estructura más compleja*, usamos `.list span .text-danger` resultando  `template.querySelector('.list span .text-danger').textContent = item;`.

* Para almacenar el `<template>` en el `fragment`, necesitamos clonar su contenido mediante `const clone = template.cloneNode(true)` o `const clone = document.importNode(template, true);`

---

## Contador
[Link del curso](https://www.youtube.com/watch?v=wp48fCSv-ow&list=PLPl81lqbj-4I2ZOzryjPKxfhK3BzTlaJ7&index=12)

Usando `addEventListener` y *Bootstrap*, contamos los *clicks* que se realizan en cada uno de los *botones*.

### **1era Opción:** Con `.addEventListener()`
En este caso, el *documento HTML* puede ser delegado mediante solo con `.addEventListener()`. Pero no es el recomendable en los casos generales.

```javascript
    const btnAumentar = document.querySelector('.btn-info');
    const btnDisminuir = document.querySelector('.btn-danger')
    const spanContador = document.getElementById('spanContador');
    let contador = 0;

    btnAumentar.addEventListener('click', () => {
        console.log('aumentando');
        contador++
        spanContador.textContent = contador;
    });

    btnDisminuir.addEventListener('click', () => {
        console.log('disminuyendo');
        contador--
        spanContador.textContent = contador;
    });
```

### **2da Opción(recomendable):** Event delegation o delegar los eventos
Tomamos control de cada uno de los elementos del *documento HTML* mediante `.addEventListener()` e identificando mediante el `.target.classList.contains('clase_del_elemento')` si tenemos los elementos con las clases correctas.

Logramos un mejor resultado con solo un `.addEventListener()`
```javascript
    const container = document.querySelector('.container');
    const spanContador = document.getElementById('spanContador');
    let contador = 0;
    
    // Event Delegation
    container.addEventListener('click', e => {
        if(e.target.classList.contains('btn-info')) {
            contador++
            spanContador.textContent = contador;
        }
        if(e.target.classList.contains('btn-danger')) {
            contador--
            spanContador.textContent = contador;
        }
    });
```

### stopPropagation o Detener la propagación de eventos
[Curso min 15:51](https://youtu.be/wp48fCSv-ow?list=PLPl81lqbj-4I2ZOzryjPKxfhK3BzTlaJ7&t=951)

Para *evitar que un evento se siga propagando* en las fases de *captura* y *burbujeo*. Llamamos al método `event.stopPropagation()` dentro del controlador de eventos.
```javascript
    btn.addEventListener('click', e => {
    alert('El boton fue cliqueado');
    // Dentro del controlador
    e.stopPropagation();
    });
```

Este método no detiene ningún comportamiento predeterminado del elemento. Para detener comportamientos predeterminados, usamos el método `Event.preventDefault()`. [Fuente](https://www.javascripttutorial.net/dom/events/stop-propagation-of-events/)


Notas:
> **Burbujeo**: Cuando ocurre un evento en un elemento, primero se ejecuta los controladores en él, luego en su padre y luego en otros ancestros.
Digamos que tenemos 3 elementos anidados `FORM > DIV > P`, entonces, si hacemos clic en `<p>`, veremos 3 alertas: p → div → form. [Fuente](https://javascript.info/bubbling-and-capturing)

> Los eventos DOM estándar describen **3 fases de propagación de eventos**: [Fuente](https://javascript.info/bubbling-and-capturing#:~:text=The%20standard%20DOM,from%20the%20element.)
> 1. Fase de captura: el evento se reduce al elemento.
> 2. Fase objetivo: el evento alcanzó el elemento objetivo.
> 3. Fase burbujeante: el evento brota del elemento.
>
> La fase de captura se usa muy raramente, generalmente manejamos eventos en burbujeo. [Fuente](https://javascript.info/bubbling-and-capturing#:~:text=Before%20we%20only%20talked%20about%20bubbling%2C%20because%20the%20capturing%20phase%20is%20rarely%20used.%20Normally%20it%20is%20invisible%20to%20us.)

> **Parámetros vs Argumentos**:
>
> El término **parámetro** se utiliza al darles nombre cuando se define la función.
>
> Los **argumentos** son los valores que se les da a los parámetros al llamar a la función.
>
> ![Diferencia](https://www.elvisualista.com/wp-content/uploads/2016/05/g-10.2-sintaxis-funcion-parametros.png)
>
> [Fuente](https://www.elvisualista.com/2016/05/28/javascript-para-novatos-11o/)

#### Ejemplo:
Para demostrar la propagación de un evento hacia sus elementos hijos.
[18:33](https://youtu.be/wp48fCSv-ow?list=PLPl81lqbj-4I2ZOzryjPKxfhK3BzTlaJ7&t=1113)


Elemento `div` en HTML:
```html
    <div class="bg-success py-5">
        <button class="btn btn-dark">dame click!</button>
    </div>
```

Eventos en los elementos y el `.stopPropagation()`
```javascript
    const btn = document.querySelector('.btn-dark');
    const bgSuccess = document.querySelector('.bg-success');

    btn.addEventListener('click', (e)=> {
        console.log('click en btn');
        // evitamos su propagación hacia sus elementos hijos (button)
        e.stopPropagation();
    })
    bgSuccess.addEventListener('click', ()=> {console.log('click en bgSuccess');})
```

# Carrito de Compras - Vanilla JavaScript y template HTML
[Tutorial](https://www.youtube.com/watch?v=JL7Wo-ASah4&list=PLPl81lqbj-4I2ZOzryjPKxfhK3BzTlaJ7&index=21)

## Objeto carrito
Antes de comenzar, debemos conocer:
1. `for in`:
    - Te permite recorrer todas las propiedades de un objeto.
    - Itera por las propiedades y los valores de las propiedades de un objeto, de manera genérica.
    - El bucle `for-in` itera sobre todas las propiedades enumerables de un objeto que está codificado por cadenas.
    - Parecido al `forEach`, pero este es solo para arrays y no es un *bucle* sino un *método de arrays*, que sirve para iterar, pero no es una estructura de control como tal.
    - Sintaxis:
        ```javascript
        for (key in object) {
        // bloque de código a ejecutar
        }
        ```
    - Ejemplo:
        ```javascript
        const person = {fname:"John", lname:"Doe", age:25}; 

        let txt = "";
        for (let x in person) {
            txt += person[x] + " ";
        }
        console.log(txt);
        // Output: John Doe 25
        ```
        Descripción:
        * El bucle `for in` itera sobre un objeto `person`
        * Cada iteración devuelve una *key* (`x`)
        * La *key* se utiliza para acceder al *valor* de la *key*.
        * El valor de *key* es `person[x]`

        > **Nota:**
        >
        > `+=` *Operador de asignación de suma*. Podemos realizar operaciones de suma y *concatenación* en el caso de los *strings* o variables. *Concatenar* es una elegante palabra de la programación que significa: "unir". [Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition_assignment)
    - Fuentes: [for_in_en_Javascript](https://desarrolloweb.com/articulos/recorridos-propiedades-objetos-javascript-forin.html), [Mozilla](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/for...in), [w3school](https://www.w3schools.com/js/js_loop_forin.asp)

2. `.hasOwnProperty()`:
    - Traductor: "Tiene propiedad propia"
    - El método `.hasOwnProperty()` devuelve un *booleano* indicando si el **objeto** tiene la *propiedad especificada*.
    - Sintaxis: 
        `obj.hasOwnProperty(prop)`
        * *prop* = nombre de la propiedad a buscar
    - Determina si un objeto tiene la *propiedad especificada* como una **propiedad directa de ese objeto**; ya que a diferencia del operador `in`, este *método* **no verifica la *cadena prototipo* del objeto**.
    - podemos usarlo para comprobar si tenemos un **objeto vacío**.
        ```javascript
        // 1era Opción: Con Object.keys()
        let obj = {};
        console.log( Object.keys(obj).length === 0 ) // true

        // 2da opción: Con Obj.hasOwnProperty()
        function objetoVacio(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) return false;
        }
        return true;
        }
        console.log(objetoVacio({})); // true
        console.log(objetoVacio({hola: 'mundo'})); // false
        ```

    > **Nota:**
    >
    > - Los **prototipos** son un mecanismo mediante el cual los objetos en JavaScript heredan características entre sí.
    > - La **cadena del prototipo** es el vínculo entre el objeto de instancia y el prototipo.
    > - Un *objeto prototipo* del objeto puede tener a su vez otro *objeto prototipo*, el cual hereda métodos y propiedades, y así sucesivamente. Esto es conocido como **cadena de prototipos**, esta es la explicación del porque objetos diferentes tienen las mismas propiedades y métodos definidos en otros objetos. [Mozilla](https://developer.mozilla.org/es/docs/Learn/JavaScript/Objects/Object_prototypes#:~:text=Un%20objeto%20prototipo%20del%20objeto%20puede%20tener%20a%20su%20vez%20otro%20objeto%20prototipo%2C%20el%20cual%20hereda%20m%C3%A9todos%20y%20propiedades%2C%20y%20as%C3%AD%20sucesivamente.)

3. `.values()`:
    - Este método devuelve un *array* con los *valores* correspondientes a las *propiedades enumerables de un objeto*.
        ```javascript
        // array como objeto
        let obj = { 0: 'a', 1: 'b', 2: 'c' };
        console.log(Object.values(obj)); // ['a', 'b', 'c']

        // array como objeto con una ordenación aleatoria de las claves
        let an_obj = { 100: 'a', 2: 'b', 7: 'c' };
        console.log(Object.values(an_obj)); // ['b', 'c', 'a']
        ```
    - Sintaxis: 
        `Object.values(obj)`
    - Solo devuelve propiedades enumerables.
        ```javascript
        // getFoo no es una propiedade enumerable, por lo que como se observa, no se devuelve
        let my_obj = Object.create(
            {}, 
            { getFoo: { value: function() { return this.foo; } } }
            );
        my_obj.foo = 'bar';
        console.log(Object.values(my_obj)); // ['bar']

        // parámetros que no son Objetos se fuerzan a que se comporten como tal
        console.log(Object.values('foo')); // ['f', 'o', 'o']
        ```
    - Si no existe compatibilidad en entornos antiguos, de forma nativa, podemos usar [Polyfill](https://github.com/tc39/proposal-object-values-entries).
    - Fuentes: [Mozilla](https://developer.mozilla.org/es/docs/web/javascript/reference/global_objects/object/values), [w3schools](https://www.w3schools.com/js/js_object_definition.asp), [StackOverflow](https://es.stackoverflow.com/questions/102738/c%C3%B3mo-comprobar-un-objeto-vac%C3%ADo-javascript)
    > **Notas:**
    >
    > - Partes de un objeto. 
    >
    >   ![objeto](https://www.wextensible.com/temas/javascript-objetos/ejemplos/propiedades.png)
    >
    > - En JavaScript casi todo es un objeto:
    >    * con la palabra clave `new`:
    >       + booleanos
    >       + numeros
    >       + cadenas 
    >    * Son siempre objetos:
    >       + fechas
    >       + matemáticas
    >       + expresiones regulares
    >       + arreglos
    >       + funciones
    >       + objetos
    >
    > - Todos los valores de JS son objetos, a excepción de los *valores primitivos*, como:
    >   * string
    >   * number
    >   * boolean
    >   * null
    >   * undefined
    >   * symbol
    >   * bigint
    > - Los valores primitivos son inmutables (están codificados y no se pueden cambiar). Por ejemplo:
    >
    >   `si x = 3,14, puede cambiar el valor de x, pero no puede cambiar el valor de 3,14.`

> **Notas:** 
>
> - En Javascript no existen arrays asociativos (útiles en la programación). Si queremos usar algo parecido a un *array asociativo* tendremos que utilizar las *construcciones de objetos* (Por ejemplo: `const obj = {a:'Juan', b:'Carlos', c:'JuanDev'}`).
> - Los *arrays asociativos* son aquellos que no tienen índices numéricos sino alfabéticos
    
4. `DOMContentLoaded`:
    - El *evento* `DOMContentLoaded` se activa cuando el *documento HTML*, inicial, ha sido completamente cargado y analizado (parseado) por completo. Todo lo contrario a, esperar a que las hojas de estilo CSS, imagenes y submarcos tereminen cargar.
    - Modo de uso:
        ```javascript
        // Se esperará a que el contenido del DOM haya cargado
        document.addEventListener('DOMContentLoaded', (event) => {
            // Aquí ya podemos obtener elementos del DOM
            console.log('DOM fully loaded and parsed');
        });
        ```
    - Con el `addEventListener` podemos manejarlo en las fases de captura o burbujeo.
    - Es un tipo de evento(`event`) como el `click`, `keydown`, etc. Que podemos usar dentro de `addEventListener`
    - Fuentes: [Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event), [Parzibyte's](https://parzibyte.me/blog/2019/12/05/domcontentloaded-javascript/)

5. `Element.setAttribute()`:
    - https://developer.mozilla.org/es/docs/Web/API/Element/setAttribute

## Para la contrucción del carrito

* Se leerá la información la informácion de los productos desde un [JSON](https://jsonplaceholder.typicode.com/).
* Para la *lista de elementos* del carrito se usarán *arrays*.
* Se usará Bootstrap para los estilos.
* Usaremos [imágenes](https://picsum.photos/) aleatorias para los productos.
* Usaremos `Array.prototype.reduce()` para obtener la *Cantidad* y el *Total* del carrito.
* Se usará el `delete` para eliminar un objeto de nuestra *colección de objetos*.

## Apuntes sobre el proceso
* No se usa directamente un archivo **.json** en el área local, ya que en un proyecto real se consumen desde una **base de datos**.
* Se usa imagenes de [Picsum](https://picsum.photos/), donde:

    `https://picsum.photos/id/0/600` es una imagen que obtnemos especificamente desde la [galería](https://picsum.photos/images) con `id` en el orden #`0` de tamaño `600x600`.

* En la sección:
    ```javascript
    const res = await fetch('api.json')
    ```
    en `fetch()` normalmente va un *URL* para obtener información de la *base de datos*

* Obtenemos la captura de datos:
    ```javascript
    // Captura de los datos:
    document.addEventListener('DOMContentLoaded', () => {
        fetchData()
    })

    const fetchData = async () => {
        try {
            const res = await fetch('api.json') // buscamos para obtener una respuesta
            const data = await res.json() // guardamos los datos e indicamos el tipo de respuesta (.json())
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    ```
* Usamos `forEach` para el JSON, debido a que los *cards* son una **colección de arrays**.
    ```javascript
    // Renderizamos los cards
    const pintarCard = data => {
        // console.log(data)

        // forEach, los datos del JSON son una colección de arrays
        data.forEach(producto => { 
            console.log(producto)
        });

    }
    ```
* Antes de renderizar todos los elementos de `api.json`, debemos ir visualizando que cada elemento que agreguemos funcione correctamente.
    ```javascript
    // Primera visualización de los cards con los título y los botones

    const pintarCard = data => {
    // console.log(data)

    // Colección de arrays
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title;

        const clone = templateCard.cloneNode(true); // clonamos nuestro template
        fragment.appendChild(clone); // Agregamos clone a fragment
    });
    items.appendChild(fragment); // Pasamos el fragment a items
    }
    ```