# <p align="center"> - My-Anime - </p>
#### <p align="center"> _Este documento forma parte de la documentación procedimental del proyecto_ </p>
## <p align="center"> Contexto </p>

Escenario; año 2022, el anime está en tendencia, cada vez hay más fanáticos del anime. Con la llegada de los servicios de streaming o VOH no es de extrañar que este suceso esté teniendo lugar. Sin embargo, hay una pega, con tantos y tan diversos servicios de streaming es difícil mantenerse informado sobre en qué plataforma emitirán qué anime, o en qué momento estará disponible el capítulo de tu anime favorito.

Por esto, hoy, ahora más que nunca, es necesario el resurgimiento de una de las tecnologías que teníamos por olvidadas, RSS.


## <p align="center"> Análisis </p>

### <p align="center"> Técnica de Análisis 1 - Brainstorming </p>

En una sesión con todos los integrantes del equipo de desarrollo se realizó una lluvia de ideas para determinar las características del proyecto, dialogo:
- Desarrollador 1: " Entiendo, el problema es que los usuarios se tienen que conectar a las plataformas de streaming y navegar a través de ellas para saber si está disponible algún contenido de su interés. "

- Desarrollador 2: " Lo ideal sería que en lugar de estar el consumidor pendiente de si el contenido está disponible, que fuerase la plataforma la que lo avisara en cuanto el contenido esté listo. "

- Desarrollador 3: " Señores, esto apunta a que tendremos que sacar polvo a nuestras antiguos documentos y volver a aprender el protocolo RSS. ¡ Let's Go !  
    
    Está claro todo indica que la solución es crear un lector RSS que permita a los seguidores del anime ver los últimos capítulos de anime agregados y en qué plataforma fueron agregados, además habrá que añadir un sistema de notificación vía email que les avise si el contenido es de su interés. "

### <p align="center"> Técnica de Análisis 2 - Desarrollo Conjunto de Aplicaciones </p>

Continuación del diálogo de la sesión del brainstorming pero con la idea ya obtenida a partir de la última sesión, un lector RSS:

- Desarrollador 1: " De acuerdo, necesitaremos una aplicación con una base de datos de usuarios, por lo tanto, deberá de tener su correspondiente registro y login de usuarios. "

- Desarrollador 2: " Bien, la integración más rápida, eficaz y sencilla para ello es implementar la solución que nos proporciona Firebase con Firebase Authentication. "

- Desarrollador 3: " No tan rápido mi querido amigo, hay que tener en cuenta el protocolo que usaremos para suscribirnos a los distintos canales RSS de las plataformas de anime. Lo más probable es que tengamos que implementar una lógica en nuestro backend que detone ciertas funciones... "

- Desarrollador 2: "... e implementar lógica de backend en Firebase con un lenguaje que no sea node va a ser imposible, mmm...  Veo por donde vas, pero eso no descarta que usemos Firebase para el frontend y la lógica de gestión de usuarios. "

- Desarrollador 1: " Podríamos hacer nuevamente un entorno híbrido en el que frontend y backend se encuentran alojados en distintos servicios de alojamiento. Que sea el backend el que reaccione a los pingshot de los canales RSS y que interactue con la base de datos para almacenar el contenido de los canales RSS y notificar a los usuarios que les interese. 

    Por otro lado, necesitaríamos un sistema de envío de notificaciones vía email, un servidor de correos o un servicio similar, también saber qué usuarios están suscritos a las notificaciones y si están suscritos a todas o solamente a las de algunos animes en concreto. Necesitaremos almacenar en una base de datos los animes en emisión y los usuarios suscritos a ellos. "




Tras la aplicación de las sucesivas técnicas de análisis se han concretado los requisitos funcionales y no funcionales del software.
Estos vienen adecuadamente recogidos en el documento de Especificación de Requisitos del Software, [ERS.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20análisis\ERS.pdf).

Además, tras el proceso de investigación se han creado 2 diagramas que explican detalladamente el funcionamiento del protocolo RSS, por un lado desde el punto de vista del sitio que publica o desea publicar contenido en un canal RSS ([Understanding RSS Diagram - For Publishers.pdf](documentación\documentación%20procedimental\Understanding%20RSS%20Diagram%20-%20For%20Publishers.pdf)), por otro lado, desde el punto de vista de webs/aplicaciones o usuarios que quieran leer/mantenerse informado o hacer uso de los canales RSS de las webs que implementen esta tecnología ([Understanding RSS Diagram - For Consumers.pdf](documentación\documentación%20procedimental\Understanding%20RSS%20Diagram%20-%20For%20Consumers.pdf)).

## <p align="center"> Diseño </p>


### <p align="left"> Diseño de la topología de Red del sistema </p>
Para realizar el diseño de la topología de Red del sistema se ha tenido en cuenta los datos recopilados durante el análisis. Esto ha resultado en el [Esquema de red de la aplicación.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Esquema%20de%20red%20de%20la%20aplicación.pdf)

<br>
<br>

### <p align="left"> Diseño de la BBDD </p>
Para realizar el diseño de la BBDD se ha tenido en cuenta los datos recopilados durante el análisis. También se ha tenido en cuenta los datos que proporciona Crunchyroll y las futuras posibles fuentes en sus canales RSS. 
Esto ha resultado en el diagrama [Esquema de base de datos.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Esquema%20de%20base%20de%20datos.pdf)

<br>
<br>

### <p align="left"> Diseño del código Backend </p>
Para realizar el diseño del código del Backend se ha tenido en cuenta los datos recopilados durante el análisis y el [Diagrama de secuencia - backend.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20secuencia%20-%20backend.pdf) proporcionado por los ingenieros. Esto ha resultado en el [Diagrama de clases del backend.pdf](D:\01-DesarrolloFrontend\01-Websites\01-Produccion\04-%20My-Anime\documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20clases%20backend.pdf)

<br>
<br>

### <p align="left"> Diseño del código Frontend </p>
Para realizar el diseño del código del Frontend se ha tenido en cuenta los datos recopilados durante el análisis y los diagramas de casos de uso; [Diagrama de casos de uso - usuarios no autentificados.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20análisis\Diagrama%20de%20casos%20de%20uso%20-%20usuarios%20no%20autentificados.pdf) y [Diagrama de casos de uso - usuarios autentificados.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20análisis\Diagrama%20de%20casos%20de%20uso%20-%20usuarios%20autentificados.pdf) proporcionados por los ingenieros. Esto ha resultado en el [Diagrama de clases del frontend.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20clases%20frontend.pdf) en el cual se implementa el patrón de diseño MVC en los componentes episode y anime, además del patrón observer en el componente user.

Por otro lado, para comprender mejor el flujo de la aplicación en lo referente a la sesión del usuario se han desarrollado distintos diagramas de flujo: [Diagrama de flujo - Control de sesión.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20flujo%20-%20Control%20de%20sesión.pdf), [Diagrama de flujo - Intento de inicio de sesión.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20flujo%20-%20Intento%20de%20inicio%20de%20sesión.pdf), [Diagrama de flujo - Intento de registro.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20flujo%20-%20Intento%20de%20registro.pdf), [Diagrama de flujo - Cerrar sesión.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20flujo%20-%20Cerrar%20sesión.pdf) .

#### <p align="left"> Diseño UI </p>
Para el desarrollo de la UI se han aplicado los diseños e instrucciones proporcionadas por los diseñadores:

<p align="center">Diseño 1 - Pantallas menores a 576px ▽</p>
<div align="center">
    <img align="center" src="documentación\documentación del producto\documentación del sistema\documentación del diseño\UI - 0 pantallas menores a 576px.png" width="500">
</div>
<br>
<br>
<p align="center">Diseño 2 - Pantallas entre 576px y 768px ▽</p>
<div align="center">
    <img align="center" src="documentación\documentación del producto\documentación del sistema\documentación del diseño\UI - 1 pantallas entre 576px y 768px.png" width="500">
</div>
<br>
<br>
<p align="center">Diseño 3 - Pantallas entre 768px y 992px ▽</p>
<div align="center">
    <img align="center" src="documentación\documentación del producto\documentación del sistema\documentación del diseño\UI - 2 pantallas entre 768px y 992px.png" width="500">
</div>
<br>
<br>
<p align="center">Diseño 4 - Pantallas entre 992px y 1200px ▽</p>
<div align="center">
    <img align="center" src="documentación\documentación del producto\documentación del sistema\documentación del diseño\UI - 3 pantallas entre 992px y 1200px.png" width="500">
</div>
<br>
<br>
<p align="center">Diseño 5 - Pantallas mayores a 1200px ▽</p>
<div align="center">
    <img align="center" src="documentación\documentación del producto\documentación del sistema\documentación del diseño\UI - 4 pantallas mayores a 1200px.png" width="500">
</div>


## <p align="center"> Código </p>
 Toda la documentación relativa al [código](código) se encuentra adjunta al mismo en forma de comentarios.
## <p align="center"> Pruebas </p>

 Para este proyecto no se han realizado pruebas automáticas. Sin embargo, si que se han ejecutado los diferentes casos de uso en la versión alpha verificando que funcionan correctamente y alcanzando así la versión beta del proyecto.

## <p align="center"> Documentación </p>

La documentación de este proyecto consta de los siguientes archivos:

- [documentación del producto](documentación\documentación%20del%20producto)
    - [documentación del sistema](documentación\documentación%20del%20producto\documentación%20del%20sistema)
        - [documentación del análisis](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20análisis)
            - [ERS.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20análisis\ERS.pdf)
        - [documentación del diseño](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño)
            
            - [Diagrama de clases backend.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20clases%20backend.pdf)
            
            
            - [Diagrama de clases frontend.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20clases%20frontend.pdf)

            - [Diagrama de flujo - Cerrar sesión.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20flujo%20-%20Cerrar%20sesión.pdf)

            - [Diagrama de flujo - Control de sesión.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20flujo%20-%20Control%20de%20sesión.pdf)

            - [Diagrama de flujo - Intento de inicio de sesión.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20flujo%20-%20Intento%20de%20inicio%20de%20sesión.pdf)

            - [Diagrama de flujo - Intento de registro.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20flujo%20-%20Intento%20de%20registro.pdf)

            - [Diagrama de secuencia - backend.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20secuencia%20-%20backend.pdf)

            - [Diagrama de secuencia - frontend.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Diagrama%20de%20secuencia%20-%20frontend.pdf)

            - [Esquema de base de datos.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Esquema%20de%20base%20de%20datos.pdf)

            - [Esquema de red de la aplicación.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20diseño\Esquema%20de%20red%20de%20la%20aplicación.pdf)

        - [documentación del código](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20del%20código)
        
        - [documentación de las pruebas](documentación\documentación%20del%20producto\documentación%20del%20sistema\documentación%20de%20las%20pruebas)

        - [Glosario.pdf](documentación\documentación%20del%20producto\documentación%20del%20sistema\Glosario.pdf)

    - [documentación del usuario](documentación\documentación%20del%20producto\documentación%20del%20usuario)
        - [Manual Introductorio.pdf](documentación\documentación%20del%20producto\documentación%20del%20usuario\Manual%20Introductorio.pdf)

        - [Manual de Referencia.pdf](documentación\documentación%20del%20producto\documentación%20del%20usuario\Manual%20de%20Referencia.pdf)

        - [Guía del Administrador.pdf](documentación\documentación%20del%20producto\documentación%20del%20usuario\Guía%20del%20Administrador.pdf)

- [documentación procedimental](documentación\documentación%20procedimental)
    - [README.md](documentación\documentación%20procedimental\README.md)
    - [Understanding RSS Diagram - For Publishers.pdf](documentación\documentación%20procedimental\Understanding%20RSS%20Diagram%20-%20For%20Publishers.pdf)
    - [Understanding RSS Diagram - For Consumers.pdf](documentación\documentación%20procedimental\Understanding%20RSS%20Diagram%20-%20For%20Consumers.pdf)