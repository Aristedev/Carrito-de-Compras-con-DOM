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

2. `obj.hasOwnProperty()`:
    - Traductor: "Tiene propiedad propia"
    - El método `.hasOwnProperty()` devuelve un *booleano* (`true` o `false`) indicando si el **objeto** tiene la *propiedad especificada*.
    - Sintaxis: 
        `obj.hasOwnProperty(prop)`
        * *prop* = nombre de la propiedad a buscar
    - Determina si un objeto tiene la *propiedad especificada* como una **propiedad directa de ese objeto**; ya que a diferencia del operador `in`, este *método* **no verifica la *cadena prototipo* del objeto**.
    - Podemos usarlo para comprobar si tenemos un **objeto vacío**. Opciones:
        ```javascript
        // 1era Opción: Con Object.keys()
        let obj = {};
        console.log( Object.keys(obj).length === 0 ) // true

        // 2da opción: Con Obj.hasOwnProperty()
        function objetoVacio(obj) { // Función verificadora de objetos vacíos
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) return false; // Si obj.hasOwnProperty(prop) es true, entonces, retorna false.
            
            // Es decir, si verificamos que el objeto tiene una propiedad(no esta vacío y obj.hasOwnProperty(prop) es true), entonces negamos(false) la función verificadora(objetoVacio()) al no estar vacío.
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
    - Establece el valor de un atributo en el elemento indicado. Es decir, tomamos el nombre del atributo de HTML y le damos un valor. 
    - Si el atributo ya existe, el valor es actualizado, en caso contrario, el nuevo atributo es añadido con el nombre y valor indicado.
    - Sintaxis: 
        `Element.setAttribute(name, value);`
        * *name* = El nombre del atributo se convierte automáticamente en minúsculas cuando `setAttribute()` se llama sobre un elemento HTML en un documento HTML.
        * *value* = Cualquier valor indicado que no sea una cadena de texto se convierte automáticamente en una cadena de texto.

    - Ejm:
        
        * Se actualiza el valor de uno de los atributos de HTML.

            ```html
                <input type="text" id="myInput" value="1er mensaje"/>
            ```

            ```javascript
                let valCambiado = document.getElementById('myInput').setAttribute('vale', '2do mensaje');
                console.log(valCambiado); // <input type="text" id="myInput" value="2do mensaje"/>
            ```
            
        * Si el atributo nombrado no se encuentra en el elemento HTML, se agrega con su valor respectivo.

            ```html
                <input type="text" value="1er mensaje"/>
            ```

            ```javascript
                let inputClass = document.querySelector('input');
                inputClass.setAttribute('class', 'inName');
                console.log(inputClass); // <input type="text" class="inName" value="1er mensaje"/>
            ```
    - Los *atributos booleanos* se consideran `true` si al menos están presentes en el elemento, independientemente de su `value` actual. Por lo tanto, como regla, se debería especificar una cadena de texto vacía ("") en `value` si deseamos obtener `true`.
    - En los *atributos booleanos*, la ausencia del atributo significa que su valor es `false`.
    - Si deseamos eliminar un atributo usar `removeAttribute()` y no `null`(en el `value`), ya que pueden dar resultados no deseados.

    - Fuente: [Mozilla](https://developer.mozilla.org/es/docs/Web/API/Element/setAttribute), [dcode](https://www.youtube.com/watch?v=yc-AeIdRVEI&ab_channel=LaCocinadelC%C3%B3digo)

    > **Nota:**
    >
    > Para obtener el valor actual de un atributo, se utiliza `getAttribute();` para eliminar un atributo, se llama a `removeAttribute()`.

6. Atributo de datos `data-*` en HTML5:
    - Al indicar el atributo `data-*`, estamos agregando datos en el mismo *elemento HTML* que no queremos que se renderizen pero posteriormente estos datos pueden ser usados en el DOM.
    - Forma una clase de atributos, llamados *atributos de datos personalizados* (*custom data attributes*), que permiten el intercambio de información patentada entre el *HTML* y su *DOM* que pueden usar los *scripts*, sin tener que recurrir a atributos no estandar (DOM o `Node.setUserData()`).
    - Los atributos `data-*`  permiten almacenar información adicional sobre un elemento *HTML*.
    - Si queremos **acceder al `ElementoHMTL`** seleccionado, usamos al **propiedad `ElementoHMTL.dataset`**.
        ```html
        <div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth>John Doe</div>

        ```
        ```javascript
        const el = document.querySelector('#user');
        el.dataset.dateOfBirth = '1960-10-03'; // accedemos a data-date-of-birth
        // Resultado en JS: el.dataset.dateOfBirth === '1960-10-03'
        // Result en HTML: <div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth="1960-10-03">John Doe</div>
        ```
    - En CSS: Los valores de `data-*` son cadenas de caracteres. Por lo tanto, los valores numéricos deben ser citados en el *selector* para que el estilo surta efecto. Ejm:
        ```html
        <article
        id="electriccars"
        data-columns="3"
        data-index-number="12314"
        data-parent="cars">
        ...
        </article>
        ```

        * Para mostrar los `data-parent` en el `article`:
            ```css
            article::before {
            content: attr(data-parent);
            }
            ```
        
        * Para cambiar los estilos de acuerdo a las propiedades de datos:
            ```css
            article[data-columns='3'] {
            width: 400px;
            }
            article[data-columns='4'] {
            width: 600px;
            }
            ```
    - **Advertencias:**
        * No almacene el contenido que debería ser visible y accesible en los atributos de datos, ya que las tecnologías de asistencia, no pueden acceder a ellos.
        * Los rastreadores de búsqueda no pueden indexar los valores de los atributos de datos.

    > **Nota:**
    > 
    > **Indexar** es la acción por la cual los robots (o bots) de rastreo de Google encuentran nuestro contenido, nuestro site, y lo registran en sus bases de datos. Como resultado, cuando se realicen busquedas serán posicionados en los resultados.

7. `Node.parentElement`:
    - Si tenemos `target` en el `addEventListener('click', ...)`, con la propiedad `.parentElement` selecionamos todo el elemento padre de donde dimos `click`. Teniendo en cuenta que donde damos `click` es el elemento hijo de un elemento padre.
    - Es una propiedad de sólo lectura.
    - Devuelve el *nodo padre* del *DOM Element* (elementos del DOM), o `null`, si el *nodo* no tiene padre o si el padre no es un  *DOM Element*.
        ```javascript
        document.body.parentNode; // Returns the <html> element
        document.body.parentElement; // Returns the <html> element

        document.documentElement.parentNode; // Returns the Document node
        document.documentElement.parentElement; // Returns null (<html> does not have a parent ELEMENT node) 
        ```
    - Sintaxis:
        `elementoPadre = node.parentElement`
        * *elementoPadre* = padre del nodo actual
    - Fuentes: [Mozilla](https://developer.mozilla.org/es/docs/Web/API/Node/parentElement), [w3schools](https://www.w3schools.com/jsref/prop_node_parentelement.asp)
    
    > **Notas:**
    > - HTML Nodes vs Elements:
    >   * En *HTML DOM*, un documento HTML es una colección de nodos con (o sin) nodos secundarios.
    >   * Los **Nodos** son *nodos de elementos*, *nodos de texto* y *nodos de comentarios*.
    >   * Los **Elementos** son solo *nodos de elementos*.
    >   * Los *espacios en blanco* entre elementos también son *nodos de texto*.
    >
    > - childNodes vs children:
    >   * `childNodes` devuelve *nodos* hijos (nodos de elementos, nodos de texto y nodos de comentarios).
    >   * `children` devuelve *elementos hijos* (no nodos de texto ni nodos comentario).
    >
    > - Siblings vs Element Siblings:
    >   * **Siblings** son "hermanos" y "hermanas".
    >   * **Siblings** son nodos con el mismo padre (en la misma lista de `chilNodes`)
    >   * **Elementos Hermanos** son elementos con el mismo padre(en la misma lista de `children`)

8. Indexación de objetos
    - **Array**: 
        * Es el Objeto Array es un *Objeto Global* de JavaScript que es usado en la construcción de *arrays*.
        * Son objetos tipo lista de alto nivel.
        * Tanto la longitud como el tipo de los elementos de un **array** son variables.
        * Para crear un **Array**:
            ```javascript
            let frutas = ["Manzana", "Banana", "Guayaba"]
            console.log(frutas.length) // 3
            ```
            * Para acceder a un elemento de **Array** mediante su índice (**index**), es decir, *indexamos el array*:
            ```javascript
            let primero = frutas[0] // Manzana
            let ultimo = frutas[frutas.length - 1] // Guayaba
            ```
    
    - **ArrayBuffer**: El objeto *ArrayBuffer* se usa para representar un buffer genérico, de datos binarios brutos con una longitud específica. Tambien conocido como *arreglo de bytes* en otros lenguajes de programación.
        * No se puede manipular directamente el contenido de un ArrayBuffer, por lo tanto se crea se crea un *TypedArray* (objetos de arreglos tipados) o un objeto *DataView* para representar el *buffer* en un formato específico y su respectiva lectura y modificación del contenido del buffer.
        * Para crear un *ArrayBuffer*:
        
            ```javascript
            // Creamos un buffer de 8 bytes con una vista (DataView) Int32Array consultando el buffer.
            // Int32Array ->8 bytes = 2^8 bites = 32 bites
            const buffer = new ArrayBuffer(8);
            const view = new Int32Array(buffer);
            ```

    > **Nota**:
    >
    > Un *búfer* es un espacio en la memoria (en general, RAM) que almacena datos binarios.

    - **TypedArray** (objetos de arreglos tipados): 
        * Un objeto *TypedArray* describe una vista similar a un arreglo de un *búfer de datos binarios subyacente*.
        * No se puede crear una instancia (heredar) de este objeto directamente. En su lugar, crea una *instancia de un arreglo* de un tipo particular, tal como `Int8Array` o `BigInt64Array`.
            ```javascript
            new TypedArray(); // TypedArray() -> Int8Array() o BigInt64Array()
            new TypedArray(length);
            new TypedArray(typedArray);
            new TypedArray(object);
            new TypedArray(buffer [, byteOffset [, length]]);
            ```
        * No existe una propiedad global denominada TypedArray, ni existe un constructor TypedArray directamente visible.
        * Tenemos una serie de diferentes propiedades globales, cuyos valores son *constructores de arreglos tipados* para tipos de elementos específicos.
            ```javascript
            // Creamos un TypedArray con su tamaño en bites
            const typedArray1 = new Int8Array(8);
            typedArray1[0] = 32; // accedemos a la propiedad

            const typedArray2 = new Int8Array(typedArray1);
            typedArray2[1] = 42; // accedemos a la propiedad

            console.log(typedArray1); // Int8Array [32, 0, 0, 0, 0, 0, 0, 0]
            console.log(typedArray2); // Int8Array [32, 42, 0, 0, 0, 0, 0, 0]
            ```
        * **OJO:** A partir de *ECMAScript 2015*, los constructores *TypedArray* se deben construir con el operador `new`. Llamar a un constructor *TypedArray* como una función sin *new* arrojará un TypeError.
            ```javascript
            let dv = Int8Array([1, 2, 3]);
            // TypeError: llamar a un constructor Int8Array incorporado sin new es incorrecto

            let dv = new Int8Array([1, 2, 3]); // Es correcto
            ```

    - **Colecciones indexadas**:
        * Colecciones de datos ordenados por un valor de índice.
        * Incluye *arreglos* y *construcciones* similares a arreglos tal como objetos *Array* y objetos *TypedArray*.
    


    - Fuentes: [Mozilla - Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array), [Array Buffer](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [Mozilla - TypedArray](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [Mozilla - Colecciones Indexadas](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Indexed_collections)

8. Spread Operator `...`
    - https://www.programiz.com/javascript/spread-operator
    - https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    - **Spread Operator VS Rest Parameters**
        * *Spread Operator* expande, mientras *Rest Parameters* condensa.
        https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax (ultima parte)
    -Rest paratemeters o parámetros Rest
    https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/rest_parameters


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
* El atributo `data-id=""` no lo agregamos directamente a `<button></button>` del `index.html`, ya que este tiene que ser dinámico para cada uno de los `id`s del `api.json`.

* Para agregar los `id`s a cada uno de sus respectivos `<button>`s, usamos `dataset` (Revisar *5. `Element.setAttribute()`*).
    ```javascript
    templateCard.querySelector('.btn-dark').dataset.id = producto.id;

* Delegación del evento en el boton de compra de las cards:
    ```javascript
    // Objeto vacío para agregar elementos en el
    let carrito = {};
    // Event delegation con el boton de compra
    items.addEventListener('click', e => { // variable e para el evento
        addCarrito(e);
    })

    const addCarrito = e => {
    // console.log(e.target);
    // console.log(e.target.classList.contains('btn-dark'));
    if(e.target.classList.contains('btn-dark')) {
        // console.log(e.target.parentElement)
        setCarrito(e.target.parentElement) // tomamos todo el elemento del card con parenElement
    }
    e.stopPropagation(); // Para evitar que se hereden fuera del nodo seleccionado
    }

    // Lógica del carrito
    const setCarrito = objeto => { // recibimos un objeto
        // console.log(objeto);
        const producto = {
            // 
            id: objeto.querySelector('.btn-dark').dataset.id,
            title: objeto.querySelector('h5').textContent,
            precio: objeto.querySelector('p').textContent,
            cantidad: 1, // Unidad del producto
        }
        
        console.log(producto);
    }
    ```

* Si deseamos comprar mas de un elemento presionando varias veces el boton de comprar:
    ```javascript
    // Suma de cantidad de productos, si queremos el mismo producto
    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    ```
    En `carrito[producto.id].cantidad` 
    - `carrito[]` es toda nuestra colección de objetos.
    - `[producto.id]` es el elemento que se esta repitiendo dentro de un objeto.
    - `carrito[producto.id]` elemento que se repite dentro del objeto `carrito`.
    - `carrito[producto.id].cantidad`, accedemos a la `cantidad` del elemento que se esta repitiendo dentro del objeto `carrito`.

> **Nota:**
>
> - Para volver a la terminal luego de hacer un `git log` en **git**, presionamos **q**. De esta forma salimos de la *lista de estado de git*. [ajaxhispano](https://ajaxhispano.com/ask/como-salir-de-git-log-o-git-diff-duplicar-1284/)