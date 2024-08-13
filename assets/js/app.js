const miModulo = (() => {
  'use strict'
  /**
   * 2C = Two of clubs (Tréboles)
   * 2D =  Two of diamonds (Diamantes)
   * 2H = Two of hearts (Corazones)
   * 2S = Two of spades (Espadas)
   */

  let deck = []
  const tipos = ['C', 'H', 'D', 'S'],
    especiales = ['A', 'J', 'Q', 'K']

  let puntosJugadores = []
  let puntosPC = 0
  let cantidadCartasJugador = 0
  let cantidadCartasPC = 0
  let turnoJugador = 0
  let turnoPC = 0
  let caraCartaOculta = ''
  // HTML REFERENCES
  const btnPedir = document.querySelector('#btn-pedir'),
    btnDetener = document.querySelector('#btn-detener'),
    btnNuevo = document.querySelector('#btn-nuevo'),
    marcadores = document.querySelectorAll('small'),
    divCartas = document.querySelectorAll('.div-cartas'),
    jugadorCartas = document.getElementById('jugador-cartas'),
    casaCartas = document.getElementById('casa-cartas'),
    mazo = document.querySelector('#div-deck'),
    cartaDeck = document.querySelector('.deck')

  const inicializarJuego = async (numJugadores = 2) => {
    deck = await crearDeck()
    puntosJugadores = []
    for (let index = 0; index < numJugadores; index++) {
      puntosJugadores.push(0)
    }

    turnoJugador = puntosJugadores.length - 1
    turnoPC = puntosJugadores.length - 2
    marcadores.forEach(m => (m.innerText = 0))
    divCartas.forEach(c => (c.innerHTML = ''))

    btnPedir.disabled = false
    btnDetener.disabled = false
    crearCartaMazo()
    tomarCarta()
    //arroja carta jugador
    await cartaJugador()
    //arroja carta PC
    setTimeout(async () => {
      await cartaPc()
    }, 600)
  }

  //crear, tomar y destruir carta del mazo(deck) del dealer
  const crearCartaMazo = () => {
    const cartaMazo = document.createElement('img')
    cartaMazo.classList.add('carta-deck')
    cartaMazo.src = 'assets/cartas/grey_back.png'
    mazo.append(cartaMazo)
  }
  const tomarCarta = () => {
    const cartaMazo = document.querySelector('.carta-deck')
    const classes = ['animate__animated', 'animate__fadeOutUpBig']
    cartaMazo.classList.add(...classes)
    //Para que vuela a añadir la carta al mazo despues de desplazarla con la animación
    //Golpe de suerte, porque la intención era mazo.remove() pero daba problemas, al ya existir .carta-deck, solo se regresa al mazo con append
    mazo.append(cartaMazo)
  }
  //Crea un nuevo deck - baraja
  const crearDeck = () => {
    deck = []
    //DECK DE CARTAS DEL 2 AL 10
    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo)
      }
    }
    //DECK DE ESPECIALES
    for (let tipo of tipos) {
      for (let esp of especiales) {
        deck.push(esp + tipo)
      }
    }
    //Rebarajea el deck
    return _.shuffle(deck)
  }

  //Permite tomar una carta
  const pedirCarta = () => {
    if (deck.length === 0) {
      throw 'No hay cartas en la baraja'
    }
    return deck.pop()
  }

  //EXTRAE EL NUMERO DE CARTA PARA SABER EL VALOR
  const valorCarta = carta => {
    //substring corta el string indicandole de cual a cual posición cortar
    const valor = carta.substring(0, carta.length - 1)
    //isNan indica si no es un numero
    return isNaN(valor) ? (valor === 'A' ? 11 : 10) : valor * 1
  }

  //(el ultimo será la PC) Pintar puntos
  const acumularPuntosJugador = (carta, turno, acumular = true) => {
    // console.log(turno)
    //console.log(puntosJugadores)
    //console.log(valorCarta(carta))
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta)
    setTimeout(() => {
      //la condición deja de cumplirse cuando aparece la segunda carta de la casa/pc para dejar de pintar el marcador de ese lado
      if (acumular) {
        marcadores[turno].innerText = puntosJugadores[turno]
      }
    }, 500)
    return puntosJugadores[turno]
  }

  //Pintar puntosPC al detener juego o puntosJugador > 21
  const acumularPuntosPC = async () => {
    /* marcadores[puntosJugadores.length - 1].innerText =
      puntosJugadores[puntosJugadores.length - 1] */
    marcadores[turnoPC].innerText = puntosJugadores[turnoPC]
  }

  //Crea la carta en el HTML
  const crearCarta = async (carta, turno, moveToLeft = false) => {
    const classes = [
      'carta',
      'carta-mostrada',
      'animate__animated',
      'animate__fadeInDownBig'
    ]
    const imgCarta = document.createElement('img')
    imgCarta.classList.add(...classes)

    //if turno == 1
    if (moveToLeft && turno == 0) {
      imgCarta.classList.add('carta-l')
    }

    imgCarta.src = `assets/cartas/${carta}.png`

    divCartas[turno].append(imgCarta)
  }

  const crearCartaOculta = (carta, turno) => {
    const classes = [
      'carta',
      'carta-oculta',
      'animate__animated',
      'animate__fadeInDownBig'
    ]
    const imgCartaFrontal = document.createElement('img')
    const imgCartaReves = document.createElement('img')
    imgCartaFrontal.classList.add(...classes)
    imgCartaFrontal.classList.add('back')

    imgCartaReves.classList.add(...classes)
    imgCartaReves.classList.add('front')

    //Guarda la ruta de la carta oculta para al voltearla asignarla, evita ver la carta desde el navegador
    caraCartaOculta = carta
    //imgCartaFrontal.src = `assets/cartas/${carta}.png`
    imgCartaReves.src = 'assets/cartas/grey_back.png'

    divCartas[turno].append(imgCartaFrontal, imgCartaReves)
    setTimeout(() => {
      imgCartaFrontal.classList.remove('animate__animated')
      imgCartaFrontal.classList.remove('animate__fadeInDownBig')
      imgCartaReves.classList.remove('animate__animated')
      imgCartaReves.classList.remove('animate__fadeInDownBig')
    }, 1000)
  }

  //Rotar carta oculta
  async function voltearCartaOculta () {
    //Busca los elementos con las clases front y back para añadir clases de rotación
    const cartaFrontal = document.querySelector('.front')
    const cartaReves = document.querySelector('.back')
    //añade la caraOcultaCarta al momento de girar la carta
    cartaReves.src = `assets/cartas/${caraCartaOculta}.png`

    cartaFrontal.classList.add('front-turn')
    cartaReves.classList.add('back-turn')
  }

  //determina el ganador
  const determinarGanador = async () => {
    const [puntosPC, puntosMinimos] = puntosJugadores
    setTimeout(() => {
      if (puntosMinimos === puntosPC) alertFunction('Nadie gana', 'Empate')
      if (puntosMinimos > 21) alertFunction('Uups...', 'Perdiste')
      if (puntosPC > 21 && puntosMinimos <= 21)
        alertFunction('Grandioso', 'Ganaste')
      if (puntosPC > puntosMinimos && puntosPC <= 21)
        alertFunction('Uups...', 'Perdiste')
    }, 1500)
  }

  //carta PC
  const cartaPc = async (
    moveToLeft = false,
    hiddenCard = false,
    acumulate = true
  ) => {
    let move = moveToLeft
    let acumular = acumulate
    tomarCarta()
    const carta = await pedirCarta()
    puntosPC = acumularPuntosJugador(carta, turnoPC, acumular)
    // /* puntosJugadores.length - 1 */
    //console.log('mover?: ', move, moveToLeft)

    if (cantidadCartasJugador.length == 2 && hiddenCard) {
      // crearCartaOculta(carta, puntosJugadores.length - 1)
      crearCartaOculta(carta, turnoPC)
    } else if (move) {
      // console.log('Si, se mueve ', move)
      // crearCarta(carta, puntosJugadores.length - 1, move)
      crearCarta(carta, turnoPC, move)

      //move = false
    } else {
      //crearCarta(carta, puntosJugadores.length - 1)
      crearCarta(carta, turnoPC)
    }

    cantidadCartasPC = casaCartas.children
  }

  function delay (ms) {
    return new Promise(res => {
      setTimeout(() => {
        res()
      }, ms)
    })
  }

  //Turno pc(casa)
  const turnoPc = async (puntosMinimos, moveToLeft = false) => {
    /* let puntosPC = 0 */
    //console.log('puntos minimos(jugador) ', puntosMinimos, puntosJugadores[1])
    /*if puntosJugadores[0] >= puntosJugadores[puntosJugadores.length - 1] &&
      puntosJugadores[0] <= 21 &&
      puntosJugadores[puntosJugadores.length - 1] != 21*/
    if (
      puntosJugadores[turnoJugador] >= puntosJugadores[turnoPC] &&
      puntosJugadores[turnoJugador] <= 21 &&
      puntosJugadores[turnoPC] != 21
    ) {
      do {
        await delay(700)
        await cartaPc(moveToLeft)
        if (puntosPC == 21) {
          break
        }
      } while (puntosPC <= puntosMinimos && puntosMinimos <= 21)
    } else {
      await acumularPuntosPC()
    }
    await determinarGanador()
  }

  //Turno jugador
  const cartaJugador = async () => {
    let disable = false
    const carta = await pedirCarta()
    //era 0 en lugar de turnoJugador
    const puntosJugador = await acumularPuntosJugador(carta, turnoJugador)
    //era 0 en lugar de turnoJugador
    await crearCarta(carta, turnoJugador)
    //console.log('puntos jugador ', puntosJugador)

    //contar las cartas del jugador
    cantidadCartasJugador = jugadorCartas.children
    //console.log('Cantidad cartas jugador', cantidadCartasJugador.length)

    if (cantidadCartasJugador.length == 2) {
      btnDetener.disabled = false
      setTimeout(async () => {
        await cartaPc(false, true, false)
      }, 500)
    }

    if (cantidadCartasJugador.length < 2) {
      btnDetener.disabled = true
    } else {
      btnPedir.disabled = true
      btnDetener.disabled = true
      setTimeout(() => {
        if (!disable) {
          btnPedir.disabled = false
          btnDetener.disabled = false
        }
      }, 1800)
    }
    //console.log('Puntos JUGADOR_ ', puntosJugador)

    if (puntosJugador > 21) {
      // console.warn('Perdtse')
      disable = true
      btnPedir.disabled = true
      btnDetener.disabled = true
      await voltearCartaOculta()
      await acumularPuntosPC()
      await determinarGanador()
    } else if (puntosJugador === 21) {
      disable = true
      //console.warn('21, bien')
      btnPedir.disabled = true
      btnDetener.disabled = true
      /* await voltearCartaOculta()
      await turnoPc(puntosJugador, true) */
      setTimeout(async () => {
        await voltearCartaOculta()
        await turnoPc(puntosJugador, true)
      }, 700)

      // await determinarGanador()
    }
  }

  /* ---------- ALERTAS ------------- */
  const alertFunction = (title, msg) => {
    let titleAlert = title
    let message = msg
    let $spanContentWin = `
     <span class="icon-alert-color">
        <i class="fa-solid fa-child-reaching fa-4x fa-bounce"></i>
     </span> 
    `

    let $spanContentLose = `
      <span class="icon-alert-color">
        <i class="fa-solid fa-skull fa-4x fa-fade"></i>
      </span> 
   `

    let $spanContentDraw = `
      <span class="icon-alert-color">
        <i class="fa-solid fa-handshake fa-4x animate__animated animate__shakeY"></i>
      </span>`

    let $spanContent = ''

    if (msg == 'Ganaste') {
      $spanContent = $spanContentWin
    } else if (msg == 'Perdiste') {
      $spanContent = $spanContentLose
    } else {
      $spanContent = $spanContentDraw
    }

    Swal.fire({
      title: `<p class="title-alert">${titleAlert}!</p>`,
      backdrop: `#272727a1`,
      customClass: {
        popup: 'border-alert'
      },
      html: `
        <h2 class="message">
         <b>${message}</b>
        </h2>
        <p class="mt-5">
         ${$spanContent}
        </p>
      `,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      showConfirmButton: false,

      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    })
  }

  //Events buttons
  //la segunda (argumento) funcion es un callback, ya que se manda como argumento de otra funcion
  btnPedir.addEventListener('click', function () {
    crearCartaMazo()
    tomarCarta()
    cartaJugador()
  })

  //detener
  btnDetener.addEventListener('click', async function () {
    btnPedir.disabled = true
    btnDetener.disabled = true
    //console.log('Cartas PC_ ', cantidadCartasPC.length)

    if (cantidadCartasPC.length > 1) {
      await voltearCartaOculta()
    }
    // await turnoPc(puntosJugadores[0], true)
    await turnoPc(puntosJugadores[turnoJugador], true)
    //setTimeout(() => {}, 1300)
  })

  //Nuevo juego
  btnNuevo.addEventListener('click', function () {
    console.clear()
    inicializarJuego()
  })

  return {
    nuevoJuego: inicializarJuego
  }
})()
