const miModulo = (() => {
  'use strict'
  let e = [],
    t = ['C', 'H', 'D', 'S'],
    l = ['A', 'J', 'Q', 'K'],
    r = [],
    n = document.querySelector('#btn-pedir'),
    a = document.querySelector('#btn-detener'),
    s = document.querySelector('#btn-nuevo'),
    d = document.querySelectorAll('small'),
    o = document.querySelectorAll('.div-cartas'),
    i = (t = 2) => {
      ;(e = c()), (r = [])
      for (let l = 0; l < t; l++) r.push(0)
      d.forEach(e => (e.innerText = 0)),
        o.forEach(e => (e.innerHTML = '')),
        (n.disabled = !1),
        (a.disabled = !1)
    },
    c = () => {
      e = []
      for (let r = 2; r <= 10; r++) for (let n of t) e.push(r + n)
      for (let a of t) for (let s of l) e.push(s + a)
      return _.shuffle(e)
    },
    u = () => {
      if (0 === e.length) throw 'No hay cartas en la baraja'
      return e.pop()
    },
    $ = e => {
      let t = e.substring(0, e.length - 1)
      return isNaN(t) ? ('A' === t ? 11 : 10) : 1 * t
    },
    f = (e, t) => (
      console.log(t),
      console.log(r),
      console.log($(e)),
      (r[t] = r[t] + $(e)),
      (d[t].innerText = r[t]),
      r[t]
    ),
    b = (e, t) => {
      let l = document.createElement('img')
      l.classList.add('carta'),
        (l.src = `assets/cartas/${e}.png`),
        o[t].append(l)
    },
    g = () => {
      console.log(r)
      let [e, t] = r
      setTimeout(() => {
        e === t && alert('Nadie gana'),
          e > 21 && alert('Perdistee...'),
          t > 21 && e <= 21 && alert('Ganaste!'),
          t > e && t <= 21 && alert('Perdistee!')
      }, 10)
    },
    h = e => {
      let t = 0
      do {
        let l = u()
        ;(t = f(l, r.length - 1)), b(l, r.length - 1)
      } while (t <= e && e <= 21)
      g()
    }
  return (
    n.addEventListener('click', function () {
      let e = u(),
        t = f(e, 0)
      b(e, 0),
        console.log('Puntos ', t),
        t > 21
          ? (console.warn('Perdtse'),
            (n.disabled = !0),
            (a.disabled = !0),
            h(t))
          : 21 === t &&
            (console.warn('21, bien'),
            alert('Ganaste!'),
            (n.disabled = !0),
            (a.disabled = !0),
            h(t))
    }),
    a.addEventListener('click', function () {
      ;(n.disabled = !0), (a.disabled = !0), h(r[0])
    }),
    s.addEventListener('click', function () {
      console.clear(), i()
    }),
    { nuevoJuego: i }
  )
})()
